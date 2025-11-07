




import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  Clock,
  Link,
  FileText,
  DollarSign,
  History,
  ChevronLeft,
  CheckCircle2,
  Clock3,
  FileCheck,
  Send,
  MessageSquare,
  CheckSquare,
  RefreshCw,
  Plus,
  Edit3,
  Save,
  X,
  Check,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  fetchMeetingById,
  updateMeeting,
  rescheduleMeet,
  updateMeetingStatus,
  clearSelectedMeeting,
  clearError,
} from "@/modules/meet/slices/meetSlice";

// Placeholder MOM and Quotation data
const initialMomData = {
  momId: null,
  summary: "",
  actionItems: [],
  status: "draft",
};

const initialQuotationData = {
  quotationId: null,
  title: "",
  amount: 0,
  currency: "USD",
  validUntil: "",
  status: "draft",
  feedback: "",
  clientAgreed: false,
};

export default function MeetingController({ meetingId }) {
  const dispatch = useDispatch();
  const { selectedMeeting, status, error } = useSelector((state) => state.meet);

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [showReschedule, setShowReschedule] = useState(false);
  const [showMOM, setShowMOM] = useState(false);
  const [showQuotation, setShowQuotation] = useState(false);
  const [showStatusUpdate, setShowStatusUpdate] = useState(false);
  const [statusUpdateType, setStatusUpdateType] = useState(null); // "completed" or "canceled"
  const [mom, setMom] = useState(initialMomData);
  const [quotation, setQuotation] = useState(initialQuotationData);
  const [endNote, setEndNote] = useState("");
  const [feedback, setFeedback] = useState("");
  const [localError, setLocalError] = useState(null);
  const [updateStatus, setUpdateStatus] = useState("idle"); // Local state for status update loading

  // Derived values
  const meetingEnded = selectedMeeting?.endTime
    ? new Date(selectedMeeting.endTime) < new Date()
    : false;
  const hasMOM = !!mom.momId;
  const hasQuotation = !!quotation.quotationId;
  const hasEndNote = !!selectedMeeting?.endNote;
  const canUpdateStatus =
    selectedMeeting?.meetingStatus === "scheduled" ||
    selectedMeeting?.meetingStatus === "rescheduled";

  // Fetch meeting on mount
  useEffect(() => {
    if (meetingId) {
      dispatch(fetchMeetingById(meetingId));
    }
    return () => {
      dispatch(clearSelectedMeeting());
      dispatch(clearError());
    };
  }, [dispatch, meetingId]);

  // Sync editForm with selectedMeeting
  useEffect(() => {
    if (selectedMeeting) {
      try {
        setEditForm({
          title: selectedMeeting.title || "",
          date: selectedMeeting.date ? format(new Date(selectedMeeting.date), "yyyy-MM-dd") : "",
          startTime: selectedMeeting.startTime
            ? format(new Date(selectedMeeting.startTime), "HH:mm")
            : "",
          endTime: selectedMeeting.endTime
            ? format(new Date(selectedMeeting.endTime), "HH:mm")
            : "",
          agenda: selectedMeeting.agenda || "",
          mode: selectedMeeting.mode || "online",
          meetingLink: selectedMeeting.meetingLink || "",
          meetingStatus: selectedMeeting.meetingStatus || "scheduled",
        });
        setLocalError(null);
      } catch (err) {
        console.error("Error syncing editForm:", err);
        setLocalError("Invalid meeting data. Please try again.");
      }
    }
  }, [selectedMeeting]);

  // Format functions
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM d, yyyy");
    } catch {
      return "Invalid Date";
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return "N/A";
    try {
      return format(new Date(dateStr), "MMM d, yyyy h:mm a");
    } catch {
      return "Invalid Date";
    }
  };

  // Handlers
  const handleSave = async () => {
    if (!editForm?.title || !editForm.date || !editForm.startTime || !editForm.endTime) {
      setLocalError("Please fill all required fields.");
      return;
    }
    if (editForm.mode === "online" && !editForm.meetingLink) {
      setLocalError("Please provide a meeting link for online mode.");
      return;
    }
    try {
      setLocalError(null);
      await dispatch(
        updateMeeting({
          meetingId,
          updates: {
            ...editForm,
            startTime: `${editForm.date}T${editForm.startTime}:00.000Z`,
            endTime: `${editForm.date}T${editForm.endTime}:00.000Z`,
            meetingLink: editForm.mode === "online" ? editForm.meetingLink : null,
            meetingStatus: editForm.meetingStatus,
          },
        })
      ).unwrap();
      setIsEditing(false);
    } catch (err) {
      setLocalError(err.payload || "Failed to update meeting.");
    }
  };

  const handleReschedule = async () => {
    if (!editForm?.date || !editForm.startTime || !editForm.endTime) {
      setLocalError("Please fill all required fields.");
      return;
    }
    try {
      setLocalError(null);
      await dispatch(
        rescheduleMeet({
          meetingId,
          date: editForm.date,
          startTime: `${editForm.date}T${editForm.startTime}:00.000Z`,
          endTime: `${editForm.date}T${editForm.endTime}:00.000Z`,
          meetingStatus: "rescheduled",
        })
      ).unwrap();
      setShowReschedule(false);
    } catch (err) {
      setLocalError(err.payload || "Failed to reschedule meeting.");
    }
  };

  const handleCreateMOM = () => {
    setMom({ ...mom, momId: `mom-${meetingId}`, status: "drafted" });
    setShowMOM(false);
  };

  const handleCreateQuotation = () => {
    setQuotation({ ...quotation, quotationId: `quot-${meetingId}` });
    setShowQuotation(false);
  };

  const handleSendQuotation = () => {
    setQuotation({ ...quotation, status: "sent" });
  };

  const handleFeedbackSubmit = () => {
    if (feedback.trim()) {
      setQuotation({ ...quotation, feedback });
      setFeedback("");
    }
  };

  const handleAgreement = () => {
    setQuotation({ ...quotation, clientAgreed: true });
  };

  const handleStatusUpdate = async () => {
    if (!endNote.trim()) {
      setLocalError("Please provide a feedback note.");
      return;
    }
    try {
      setLocalError(null);
      setUpdateStatus("loading");
      await dispatch(
        updateMeetingStatus({
          meetingId,
          meetingStatus: statusUpdateType,
          endNote,
        })
      ).unwrap();
      setShowStatusUpdate(false);
      setEndNote("");
      setStatusUpdateType(null);
    } catch (err) {
      setLocalError(err.payload || "Failed to update meeting status.");
    } finally {
      setUpdateStatus("idle");
    }
  };

  const openStatusUpdateModal = (type) => {
    setStatusUpdateType(type);
    setShowStatusUpdate(true);
  };

  // Skeleton loader
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto space-y-4">
          <Skeleton className="h-8 w-32" />
          <Card className="shadow-lg border-0">
            <div className="p-6">
              <Skeleton className="h-10 w-3/4" />
              <div className="grid lg:grid-cols-3 gap-6 mt-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Render error state
  if (status === "failed" || localError) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertDescription>{localError || error || "No meeting found."}</AlertDescription>
      </Alert>
    );
  }

  if (!selectedMeeting) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
        <AlertDescription>Meeting data unavailable.</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-6">
          <ChevronLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <Card className="shadow-lg border-0">
          <div className="bg-blue-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">{selectedMeeting.title}</h1>
                <p className="text-indigo-200 text-sm">ID: {meetingId}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="bg-white/20">
                  <Link className="w-4 h-4 mr-1" /> {selectedMeeting.mode}
                </Badge>
                <Badge
                  variant={
                    selectedMeeting.meetingStatus === "completed"
                      ? "success"
                      : selectedMeeting.meetingStatus === "canceled"
                      ? "destructive"
                      : "default"
                  }
                >
                  {selectedMeeting.meetingStatus}
                </Badge>
                <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          <CardContent className="p-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Meeting Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
                    <Calendar className="w-5 h-5" /> Schedule
                  </h3>
                  <div className="mt-2 text-sm space-y-1">
                    <p><strong>Date:</strong> {formatDate(selectedMeeting.date)}</p>
                    <p>
                      <strong>Time:</strong>{" "}
                      {format(new Date(selectedMeeting.startTime), "h:mm a")} –{" "}
                      {format(new Date(selectedMeeting.endTime), "h:mm a")}
                    </p>
                    <p><strong>Duration:</strong> {selectedMeeting.duration || 0} mins</p>
                    <p>
                      <strong>Status:</strong>{" "}
                      {selectedMeeting.meetingStatus.charAt(0).toUpperCase() +
                        selectedMeeting.meetingStatus.slice(1)}
                    </p>
                  </div>
                </div>

                {selectedMeeting.agenda && (
                  <div>
                    <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
                      <FileText className="w-5 h-5" /> Agenda
                    </h3>
                    <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                      {selectedMeeting.agenda}
                    </p>
                  </div>
                )}

                {selectedMeeting.mode === "online" && selectedMeeting.meetingLink && (
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
                      <Link className="w-5 h-5" /> Join
                    </h3>
                    <a
                      href={selectedMeeting.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {selectedMeeting.meetingLink}
                    </a>
                  </div>
                )}

                {hasEndNote && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <FileText className="w-5 h-5" /> End Note
                    </h3>
                    <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">
                      {selectedMeeting.endNote}
                    </p>
                    <p className="text-xs text-gray-500">
                      Updated: {formatDateTime(selectedMeeting.updatedAt)}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Center */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">Action Center</h3>
                <div className="space-y-2">
                  {canUpdateStatus && (
                    <>
                      <Button
                        className="w-full justify-start"
                        onClick={() => openStatusUpdateModal("completed")}
                        disabled={updateStatus === "loading"}
                      >
                        <Check className="w-4 h-4 mr-2" /> Mark as Completed
                      </Button>
                      <Button
                        className="w-full justify-start"
                        variant="destructive"
                        onClick={() => openStatusUpdateModal("canceled")}
                        disabled={updateStatus === "loading"}
                      >
                        <XCircle className="w-4 h-4 mr-2" /> Cancel Meeting
                      </Button>
                    </>
                  )}

                  {meetingEnded && !hasMOM && (
                    <Button
                      className="w-full justify-start"
                      onClick={() => setShowMOM(true)}
                      disabled={updateStatus === "loading"}
                    >
                      <Plus className="w-4 h-4 mr-2" /> Create MOM
                    </Button>
                  )}

                  {hasMOM && (
                    <Button className="w-full justify-start" variant="outline" disabled>
                      <CheckCircle2 className="w-4 h-4 mr-2" /> MOM Created
                    </Button>
                  )}

                  <Button
                    className="w-full justify-start"
                    variant="outline"
                    onClick={() => setShowReschedule(true)}
                    disabled={updateStatus === "loading" || !canUpdateStatus}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" /> Reschedule
                  </Button>

                  {meetingEnded && hasMOM && !hasQuotation && (
                    <Button
                      className="w-full justify-start"
                      onClick={() => setShowQuotation(true)}
                      disabled={updateStatus === "loading"}
                    >
                      <DollarSign className="w-4 h-4 mr-2" /> Create Quotation
                    </Button>
                  )}

                  {hasQuotation && (
                    <>
                      <Button className="w-full justify-start" variant="outline" disabled>
                        <CheckCircle2 className="w-4 h-4 mr-2" /> Quotation Created
                      </Button>
                      {quotation.status !== "sent" && (
                        <Button
                          className="w-full justify-start"
                          onClick={handleSendQuotation}
                        >
                          <Send className="w-4 h-4 mr-2" /> Send Quotation
                        </Button>
                      )}
                      {quotation.status === "sent" && !quotation.clientAgreed && (
                        <Button
                          className="w-full justify-start"
                          onClick={handleAgreement}
                        >
                          <CheckSquare className="w-4 h-4 mr-2" /> Client Agreed
                        </Button>
                      )}
                    </>
                  )}
                </div>

                {/* Feedback Input */}
                {meetingEnded && hasQuotation && quotation.status === "sent" && !quotation.feedback && (
                  <div className="space-y-2">
                    <Label>Feedback</Label>
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Enter client feedback..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="flex-1"
                      />
                      <Button onClick={handleFeedbackSubmit} disabled={!feedback.trim()}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* History */}
              <div>
                <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
                  <History className="w-5 h-5" /> History
                </h3>
                <div className="mt-4 max-h-96 overflow-y-auto space-y-3">
                  {selectedMeeting.history?.length ? (
                    selectedMeeting.history.map((event, i) => (
                      <div key={i} className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                          {event.action === "created" ? (
                            <Calendar className="w-4 h-4" />
                          ) : (
                            <Edit3 className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">
                            Meeting {event.action === "created" ? "Created" : "Updated"}
                          </p>
                          <p className="text-xs text-gray-500">{formatDateTime(event.updatedAt)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center">No history available.</p>
                  )}
                </div>
              </div>
            </div>

            {/* MOM Section */}
            {hasMOM && (
              <div className="bg-emerald-50 p-6 mt-6 rounded-lg">
                <h3 className="text-lg font-semibold text-emerald-800 mb-3">Minutes of Meeting</h3>
                <p className="text-sm">{mom.summary || "No summary provided."}</p>
              </div>
            )}

            {/* Quotation Section */}
            {hasQuotation && (
              <div className="bg-purple-50 p-6 mt-6 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Quotation</h3>
                <p className="text-sm font-medium">{quotation.title || "Untitled Quotation"}</p>
                <p className="text-xl font-bold text-purple-700">
                  ${quotation.amount.toLocaleString()} {quotation.currency}
                </p>
                <p className="text-sm text-gray-600">
                  Valid until {quotation.validUntil ? formatDate(quotation.validUntil) : "N/A"}
                </p>
                {quotation.feedback && (
                  <p className="text-sm mt-2 italic">Feedback: {quotation.feedback}</p>
                )}
                {quotation.clientAgreed && (
                  <Badge className="mt-2 bg-green-600">Client Agreed</Badge>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle>Edit Meeting</DialogTitle></DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div>
                <Label>Title <span className="text-red-500">*</span></Label>
                <Input
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                />
              </div>
              <div>
                <Label>Date <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Start Time <span className="text-red-500">*</span></Label>
                  <Input
                    type="time"
                    value={editForm.startTime}
                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Time <span className="text-red-500">*</span></Label>
                  <Input
                    type="time"
                    value={editForm.endTime}
                    onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Agenda</Label>
                <Textarea
                  value={editForm.agenda}
                  onChange={(e) => setEditForm({ ...editForm, agenda: e.target.value })}
                />
              </div>
              <div>
                <Label>Mode <span className="text-red-500">*</span></Label>
                <select
                  value={editForm.mode}
                  onChange={(e) => setEditForm({ ...editForm, mode: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              {editForm.mode === "online" && (
                <div>
                  <Label>Join Link <span className="text-red-500">*</span></Label>
                  <Input
                    value={editForm.meetingLink}
                    onChange={(e) => setEditForm({ ...editForm, meetingLink: e.target.value })}
                  />
                </div>
              )}
              <div>
                <Label>Meeting Status</Label>
                <select
                  value={editForm.meetingStatus}
                  onChange={(e) => setEditForm({ ...editForm, meetingStatus: e.target.value })}
                  className="w-full p-2 border rounded"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="rescheduled">Rescheduled</option>
                  <option value="canceled">Canceled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {localError && (
                <Alert variant="destructive">
                  <AlertDescription>{localError}</AlertDescription>
                </Alert>
              )}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-1" /> Cancel
                </Button>
                <Button onClick={handleSave} disabled={updateStatus === "loading"}>
                  <Save className="w-4 h-4 mr-1" /> Save
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Dialog */}
      <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
        <DialogContent>
          <DialogHeader><DialogTitle>Reschedule Meeting</DialogTitle></DialogHeader>
          {editForm && (
            <div className="space-y-4">
              <div>
                <Label>Date <span className="text-red-500">*</span></Label>
                <Input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label>Start Time <span className="text-red-500">*</span></Label>
                  <Input
                    type="time"
                    value={editForm.startTime}
                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <Label>End Time <span className="text-red-500">*</span></Label>
                  <Input
                    type="time"
                    value={editForm.endTime}
                    onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                  />
                </div>
              </div>
              {localError && (
                <Alert variant="destructive">
                  <AlertDescription>{localError}</AlertDescription>
                </Alert>
              )}
              <Button
                className="w-full"
                onClick={handleReschedule}
                disabled={updateStatus === "loading"}
              >
                Reschedule
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* MOM Dialog */}
      <Dialog open={showMOM} onOpenChange={setShowMOM}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create MOM</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Summary</Label>
              <Textarea
                placeholder="Enter meeting summary..."
                value={mom.summary}
                onChange={(e) => setMom({ ...mom, summary: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={handleCreateMOM}>
              Create MOM
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Quotation Dialog */}
      <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
        <DialogContent>
          <DialogHeader><DialogTitle>Create Quotation</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Enter quotation title"
                value={quotation.title}
                onChange={(e) => setQuotation({ ...quotation, title: e.target.value })}
              />
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={quotation.amount || ""}
                onChange={(e) => setQuotation({ ...quotation, amount: +e.target.value })}
              />
            </div>
            <div>
              <Label>Valid Until</Label>
              <Input
                type="date"
                value={quotation.validUntil}
                onChange={(e) => setQuotation({ ...quotation, validUntil: e.target.value })}
              />
            </div>
            <Button className="w-full" onClick={handleCreateQuotation}>
              Create Quotation
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={showStatusUpdate} onOpenChange={setShowStatusUpdate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {statusUpdateType === "completed" ? "Mark Meeting as Completed" : "Cancel Meeting"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Feedback Note</Label>
              <Textarea
                placeholder="Enter feedback note (e.g., what was discussed, outcomes, or reason for cancellation)"
                value={endNote}
                onChange={(e) => setEndNote(e.target.value)}
              />
            </div>
            {localError && (
              <Alert variant="destructive">
                <AlertDescription>{localError}</AlertDescription>
              </Alert>
            )}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowStatusUpdate(false);
                  setEndNote("");
                  setStatusUpdateType(null);
                }}
              >
                <X className="w-4 h-4 mr-1" /> Cancel
              </Button>
              <Button
                onClick={handleStatusUpdate}
                disabled={updateStatus === "loading" || !endNote.trim()}
              >
                <Save className="w-4 h-4 mr-1" /> Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}




