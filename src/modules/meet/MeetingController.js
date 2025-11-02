
// // src/modules/meeting/MeetingController.jsx
// "use client";

// import React, { useState } from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Progress } from "@/components/ui/progress";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import {
//   Calendar,
//   Clock,
//   Link,
//   MapPin,
//   Users,
//   FileText,
//   DollarSign,
//   History,
//   ChevronLeft,
//   CheckCircle2,
//   Clock3,
//   FileCheck,
//   Receipt,
//   RefreshCw,
//   Plus,
//   Edit3,
//   Save,
//   X,
//   Send,
//   MessageSquare,
//   CheckSquare,
// } from "lucide-react";
// import { format } from "date-fns";

// // ---------------------------------------------------------------------
// // DUMMY DATA (FULLY DYNAMIC)
// // ---------------------------------------------------------------------
// let meetingData = {
//   meetingId: "meetingid42",
//   title: "Q4 Product Roadmap Review",
//   agenda: "1. Review Q3 achievements\n2. Present Q4 goals and KPIs\n3. Demo new dashboard features\n4. Open floor for feedback",
//   date: "2025-11-15",
//   startTime: "10:00",
//   endTime: "11:30",
//   duration: 90,
//   mode: "online",
//   meetingLink: "https://zoom.us/j/9876543210?pwd=abc123",
//   endNote: "",
//   status: "completed",
//   contactId: "60d5ec49f1b2c8b3a4d5e6f1",
//   momId: "mom001",
//   quotationId: "quot2025-001",
//   createdAt: "2025-11-01T09:00:00.000Z",
//   updatedAt: "2025-11-16T12:00:00.000Z",
// };

// const momData = {
//   momId: "mom001",
//   summary: "Team approved roadmap. 3 features prioritized. Budget approved.",
//   actionItems: [
//     { task: "Update dashboard UI", owner: "Alex", due: "2025-12-01", done: false },
//     { task: "Prepare pricing model", owner: "Sarah", due: "2025-11-25", done: true },
//   ],
//   decisions: ["Go live with v2.0 on Jan 15", "Increase dev team by 2"],
//   status: "drafted",
// };

// const quotationData = {
//   quotationId: "quot2025-001",
//   title: "Enterprise License - Q4 2025",
//   amount: 48000,
//   currency: "USD",
//   validUntil: "2025-12-15",
//   status: "sent",
//   feedback: "Client liked the pricing but wants 10% discount.",
//   clientAgreed: false,
// };

// const timelineEvents = [
//   { type: "meeting", title: "Meeting Scheduled", date: "2025-11-01T09:00:00.000Z", icon: <Calendar />, color: "blue" },
//   { type: "meeting", title: "Meeting Held", date: "2025-11-15T11:30:00.000Z", icon: <CheckCircle2 />, color: "green" },
//   { type: "reschedule", title: "Rescheduled", date: "2025-11-10T14:30:00.000Z", icon: <RefreshCw />, color: "yellow", note: "Moved due to conflict" },
//   { type: "mom", title: "MOM Drafted", date: "2025-11-15T12:00:00.000Z", icon: <FileCheck />, color: "emerald" },
//   { type: "quotation", title: "Quotation Created", date: "2025-11-16T09:00:00.000Z", icon: <DollarSign />, color: "purple" },
//   { type: "quotation", title: "Quotation Sent", date: "2025-11-16T10:00:00.000Z", icon: <Send />, color: "indigo" },
//   { type: "feedback", title: "Feedback Received", date: "2025-11-17T11:00:00.000Z", icon: <MessageSquare />, color: "pink" },
//   { type: "agreement", title: "Client Agreed", date: "2025-11-18T14:00:00.000Z", icon: <CheckSquare />, color: "lime", note: "With 8% discount" },
// ];

// export default function MeetingController({ meetingId }) {
//   const [meeting, setMeeting] = useState(meetingData);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState(meeting);
//   const [showReschedule, setShowReschedule] = useState(false);
//   const [showMOM, setShowMOM] = useState(false);
//   const [showQuotation, setShowQuotation] = useState(false);
//   const [mom, setMom] = useState(momData);
//   const [quotation, setQuotation] = useState(quotationData);
//   const [timeline, setTimeline] = useState(timelineEvents);

//   // Derived
//   const meetingEnded = new Date(`${meeting.date}T${meeting.endTime}`) < new Date();
//   const hasMOM = !!meeting.momId;
//   const hasQuotation = !!meeting.quotationId;
//   const progress = hasQuotation ? 100 : hasMOM ? 66 : meetingEnded ? 33 : 16;

//   const formatTime = (t) => t;
//   const formatDate = (d) => format(new Date(d), "MMM d, yyyy");
//   const formatDateTime = (d) => format(new Date(d), "MMM d, h:mm a");

//   // Save Edit
//   const handleSave = () => {
//     const duration = (new Date(`2025-01-01 ${editForm.endTime}`) - new Date(`2025-01-01 ${editForm.startTime}`)) / 60000;
//     setMeeting({ ...editForm, duration });
//     setIsEditing(false);
//     addTimeline("edit", "Meeting details updated");
//   };

//   // Reschedule
//   const handleReschedule = () => {
//     setMeeting(editForm);
//     setShowReschedule(false);
//     addTimeline("reschedule", `Rescheduled to ${editForm.date} ${editForm.startTime}`);
//   };

//   // Create MOM
//   const handleCreateMOM = () => {
//     setMeeting({ ...meeting, momId: "mom001" });
//     setShowMOM(false);
//     addTimeline("mom", "MOM Drafted");
//   };

//   // Create Quotation
//   const handleCreateQuotation = () => {
//     setMeeting({ ...meeting, quotationId: "quot2025-001" });
//     setShowQuotation(false);
//     addTimeline("quotation", "Quotation Created");
//   };

//   // Send Quotation
//   const handleSendQuotation = () => {
//     setQuotation({ ...quotation, status: "sent" });
//     addTimeline("quotation", "Quotation Sent");
//   };

//   // Client Feedback
//   const handleFeedback = () => {
//     setQuotation({ ...quotation, feedback: "Client liked the pricing but wants 10% discount." });
//     addTimeline("feedback", "Feedback Received");
//   };

//   // Client Agreed
//   const handleAgreement = () => {
//     setQuotation({ ...quotation, clientAgreed: true });
//     addTimeline("agreement", "Client Agreed");
//   };

//   const addTimeline = (type, title, note) => {
//     const newEvent = {
//       type,
//       title,
//       date: new Date().toISOString(),
//       icon: getIcon(type),
//       color: getColor(type),
//       note,
//     };
//     setTimeline([newEvent, ...timeline]);
//   };

//   const getIcon = (type) => {
//     const icons = {
//       meeting: <Calendar />,
//       reschedule: <RefreshCw />,
//       mom: <FileCheck />,
//       quotation: <DollarSign />,
//       feedback: <MessageSquare />,
//       agreement: <CheckSquare />,
//       edit: <Edit3 />,
//     };
//     return icons[type] || <Clock3 />;
//   };

//   const getColor = (type) => {
//     const colors = {
//       meeting: "blue",
//       reschedule: "yellow",
//       mom: "emerald",
//       quotation: "purple",
//       feedback: "pink",
//       agreement: "lime",
//       edit: "gray",
//     };
//     return colors[type] || "gray";
//   };

//   if (meetingId !== meeting.meetingId) {
//     return (
//       <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
//         <AlertDescription>Meeting not found.</AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-6">
//           <ChevronLeft className="w-4 h-4 mr-1" /> Back
//         </Button>

//         {/* SINGLE CARD */}
//         <Card className="shadow-2xl border-0 overflow-hidden">
//           {/* Header */}
//           <div className="bg-gradient-to-r from-indigo-600 to-purple-700 p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-3xl font-bold">{meeting.title}</h1>
//                 <p className="text-indigo-100">ID: {meeting.meetingId}</p>
//               </div>
//               <div className="flex gap-2">
//                 <Badge variant="secondary" className="bg-white/20">
//                   <Link className="w-4 h-4 mr-1" /> {meeting.mode}
//                 </Badge>
//                 <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
//                   <Edit3 className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <CardContent className="p-0">
//             {/* Progress */}
//             <div className="bg-gray-50 px-6 py-4 border-b">
//               <div className="flex justify-between mb-2">
//                 <span className="font-medium">Workflow Progress</span>
//                 <span>{progress}%</span>
//               </div>
//               <Progress value={progress} className="h-3" />
//             </div>

//             <div className="grid lg:grid-cols-3 gap-6 p-6">
//               {/* LEFT: Meeting Details */}
//               <div className="space-y-5">
//                 <div>
//                   <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
//                     <Calendar className="w-5 h-5" /> Schedule
//                   </h3>
//                   <div className="mt-2 space-y-1 text-sm">
//                     <p><strong>Date:</strong> {formatDate(meeting.date)}</p>
//                     <p><strong>Time:</strong> {formatTime(meeting.startTime)} – {formatTime(meeting.endTime)}</p>
//                     <p><strong>Duration:</strong> {meeting.duration} mins</p>
//                   </div>
//                 </div>

//                 {meeting.agenda && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
//                       <FileText className="w-5 h-5" /> Agenda
//                     </h3>
//                     <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">
//                       {meeting.agenda}
//                     </p>
//                   </div>
//                 )}

//                 {meeting.mode === "online" && meeting.meetingLink && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
//                       <Link className="w-5 h-5" /> Join
//                     </h3>
//                     <a href={meeting.meetingLink} target="_blank" className="text-sm text-blue-600 hover:underline break-all">
//                       {meeting.meetingLink}
//                     </a>
//                   </div>
//                 )}
//               </div>

//               {/* CENTER: ACTION CENTER */}
//               <div className="flex flex-col justify-center">
//                 <h3 className="text-xl font-bold text-center mb-4">Action Center</h3>
//                 <div className="space-y-3">
//                   <Button
//                     className="w-full justify-start"
//                     variant={hasMOM ? "outline" : "default"}
//                     disabled={!meetingEnded}
//                     onClick={() => setShowMOM(true)}
//                   >
//                     {hasMOM ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
//                     {hasMOM ? "MOM Created" : "Create MOM"}
//                   </Button>

//                   <Button variant="outline" className="w-full justify-start" onClick={() => setShowReschedule(true)}>
//                     <RefreshCw className="w-4 h-4 mr-2" /> Reschedule
//                   </Button>

//                   <Button
//                     className="w-full justify-start"
//                     variant={hasQuotation ? "outline" : "default"}
//                     disabled={!hasMOM}
//                     onClick={() => setShowQuotation(true)}
//                   >
//                     {hasQuotation ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <DollarSign className="w-4 h-4 mr-2" />}
//                     {hasQuotation ? "Quotation Sent" : "Create Quotation"}
//                   </Button>

//                   {hasQuotation && quotation.status !== "sent" && (
//                     <Button variant="default" className="w-full" onClick={handleSendQuotation}>
//                       <Send className="w-4 h-4 mr-2" /> Send Quotation
//                     </Button>
//                   )}

//                   {hasQuotation && quotation.status === "sent" && !quotation.feedback && (
//                     <Button variant="outline" className="w-full" onClick={handleFeedback}>
//                       <MessageSquare className="w-4 h-4 mr-2" /> Add Feedback
//                     </Button>
//                   )}

//                   {hasQuotation && quotation.feedback && !quotation.clientAgreed && (
//                     <Button variant="default" className="w-full" onClick={handleAgreement}>
//                       <CheckSquare className="w-4 h-4 mr-2" /> Client Agreed
//                     </Button>
//                   )}
//                 </div>
//               </div>

//               {/* RIGHT: TIMELINE */}
//               <div>
//                 <h3 className="text-lg font-semibold text-purple-700 mb-4 flex items-center gap-2">
//                   <History className="w-5 h-5" /> Full History
//                 </h3>
//                 <div className="space-y-3 max-h-96 overflow-y-auto">
//                   {timeline.map((e, i) => (
//                     <div key={i} className="flex gap-3">
//                       <div className={`w-10 h-10 rounded-full bg-${e.color}-100 flex items-center justify-center text-${e.color}-600`}>
//                         {e.icon}
//                       </div>
//                       <div className="flex-1">
//                         <p className="font-medium text-sm">{e.title}</p>
//                         {e.note && <p className="text-xs text-gray-600">{e.note}</p>}
//                         <p className="text-xs text-gray-500">{formatDateTime(e.date)}</p>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             </div>

//             <Separator />

//             {/* MOM Preview */}
//             {hasMOM && (
//               <div className="bg-emerald-50 p-6">
//                 <h3 className="text-xl font-bold text-emerald-800 mb-3">Minutes of Meeting</h3>
//                 <p className="text-sm mb-3">{mom.summary}</p>
//                 <div className="space-y-2">
//                   {mom.actionItems.map((a, i) => (
//                     <div key={i} className="flex items-center gap-2 text-sm">
//                       <div className={`w-2 h-2 rounded-full ${a.done ? "bg-green-600" : "bg-gray-400"}`} />
//                       <span><strong>{a.task}</strong> → {a.owner} (Due: {a.due})</span>
//                     </div>
//                   ))}
//                 </div>
//               </div>
//             )}

//             {/* Quotation Preview */}
//             {hasQuotation && (
//               <div className="bg-purple-50 p-6">
//                 <h3 className="text-xl font-bold text-purple-800 mb-3">Quotation</h3>
//                 <p className="text-sm"><strong>{quotation.title}</strong></p>
//                 <p className="text-2xl font-bold text-purple-700">${quotation.amount.toLocaleString()}</p>
//                 <p className="text-sm text-gray-600">Valid until {formatDate(quotation.validUntil)}</p>
//                 {quotation.feedback && <p className="text-sm mt-2 italic">"{quotation.feedback}"</p>}
//                 {quotation.clientAgreed && <Badge className="mt-2">Client Agreed</Badge>}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* EDIT DIALOG */}
//       <Dialog open={isEditing} onOpenChange={setIsEditing}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader><DialogTitle>Edit Meeting</DialogTitle></DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label>Title</Label>
//               <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
//             </div>
//             <div>
//               <Label>Date</Label>
//               <Input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               <div>
//                 <Label>Start Time</Label>
//                 <Input type="time" value={editForm.startTime} onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })} />
//               </div>
//               <div>
//                 <Label>End Time</Label>
//                 <Input type="time" value={editForm.endTime} onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })} />
//               </div>
//             </div>
//             <div>
//               <Label>Agenda</Label>
//               <Textarea value={editForm.agenda} onChange={(e) => setEditForm({ ...editForm, agenda: e.target.value })} />
//             </div>
//             <div className="flex justify-end gap-2">
//               <Button variant="outline" onClick={() => setIsEditing(false)}><X /></Button>
//               <Button onClick={handleSave}><Save className="w-4 h-4 mr-1" /> Save</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* RESCHEDULE */}
//       <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Reschedule Meeting</DialogTitle></DialogHeader>
//           <div className="space-y-3">
//             <Input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })} />
//             <div className="flex gap-2">
//               <Input type="time" value={editForm.startTime} onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })} />
//               <Input type="time" value={editForm.endTime} onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })} />
//             </div>
//             <Button className="w-full" onClick={handleReschedule}>Reschedule</Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* MOM FORM */}
//       <Dialog open={showMOM} onOpenChange={setShowMOM}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Create MOM</DialogTitle></DialogHeader>
//           <Textarea placeholder="Summary..." value={mom.summary} onChange={(e) => setMom({ ...mom, summary: e.target.value })} />
//           <Button className="w-full" onClick={handleCreateMOM}>Create MOM</Button>
//         </DialogContent>
//       </Dialog>

//       {/* QUOTATION FORM */}
//       <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Create Quotation</DialogTitle></DialogHeader>
//           <Input placeholder="Title" value={quotation.title} onChange={(e) => setQuotation({ ...quotation, title: e.target.value })} />
//           <Input type="number" placeholder="Amount" value={quotation.amount} onChange={(e) => setQuotation({ ...quotation, amount: +e.target.value })} />
//           <Button className="w-full mt-3" onClick={handleCreateQuotation}>Create</Button>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }
























// import React, { useEffect, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   Card,
//   CardContent,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Separator } from "@/components/ui/separator";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { Skeleton } from "@/components/ui/skeleton";
// import {
//   Calendar,
//   Clock,
//   Link,
//   FileText,
//   DollarSign,
//   History,
//   ChevronLeft,
//   CheckCircle2,
//   Clock3,
//   FileCheck,
//   Send,
//   MessageSquare,
//   CheckSquare,
//   RefreshCw,
//   Plus,
//   Edit3,
//   Save,
//   X,
//   PenSquare,
// } from "lucide-react";
// import { format } from "date-fns";
// import {
//   fetchMeetById,
//   updateMeet,
//   rescheduleMeet,
//   clearSelectedMeet,
//   clearError,
// } from "@/features/meet/meetSlice";

// // Placeholder MOM, Quotation, and End Note data
// const initialMomData = {
//   momId: null,
//   summary: "",
//   actionItems: [],
//   status: "draft",
// };

// const initialQuotationData = {
//   quotationId: null,
//   title: "",
//   amount: 0,
//   currency: "USD",
//   validUntil: "",
//   status: "draft",
//   feedback: "",
//   clientAgreed: false,
// };

// const initialEndNoteData = {
//   note: "",
//   updatedAt: null,
// };

// export default function MeetingController({ meetingId }) {
//   const dispatch = useDispatch();
//   const { selectedMeet, status, updateStatus, error } = useSelector((state) => state.meet);

//   const [isEditing, setIsEditing] = useState(false);
//   const [editForm, setEditForm] = useState(null);
//   const [showReschedule, setShowReschedule] = useState(false);
//   const [showMOM, setShowMOM] = useState(false);
//   const [showQuotation, setShowQuotation] = useState(false);
//   const [showEndNote, setShowEndNote] = useState(false);
//   const [mom, setMom] = useState(initialMomData);
//   const [quotation, setQuotation] = useState(initialQuotationData);
//   const [endNote, setEndNote] = useState(initialEndNoteData);
//   const [feedback, setFeedback] = useState("");
//   const [localError, setLocalError] = useState(null);

//   // Derived values
//   const meetingEnded = selectedMeet?.endTime
//     ? new Date(selectedMeet.endTime) < new Date()
//     : false;
//   const hasMOM = !!mom.momId;
//   const hasQuotation = !!quotation.quotationId;
//   const hasEndNote = !!endNote.note;
//   const canShowEndNote =
//     meetingEnded ||
//     (selectedMeet?.meetingStatus === "canceled" ||
//       selectedMeet?.meetingStatus === "completed");

//   // Fetch meeting on mount
//   useEffect(() => {
//     if (meetingId) {
//       dispatch(fetchMeetById(meetingId));
//     }
//     return () => {
//       dispatch(clearលclearSelectedMeet());
//       dispatch(clearError());
//     };
//   }, [dispatch, meetingId]);

//   // Sync editForm with selectedMeet
//   useEffect(() => {
//     if (selectedMeet) {
//       try {
//         setEditForm({
//           title: selectedMeet.title || "",
//           date: selectedMeet.date ? format(new Date(selectedMeet.date), "yyyy-MM-dd") : "",
//           startTime: selectedMeet.startTime ? format(new Date(selectedMeet.startTime), "HH:mm") : "",
//           endTime: selectedMeet.endTime ? format(new Date(selectedMeet.endTime), "HH:mm") : "",
//           agenda: selectedMeet.agenda || "",
//           mode: selectedMeet.mode || "online",
//           meetingLink: selectedMeet.meetingLink || "",
//           meetingStatus: selectedMeet.meetingStatus || "scheduled",
//         });
//         setLocalError(null);
//       } catch (err) {
//         console.error("Error syncing editForm:", err);
//         setLocalError("Invalid meeting data. Please try again.");
//       }
//     }
//   }, [selectedMeet]);

//   // Format functions
//   const formatDate = (dateStr) => {
//     if (!dateStr) return "N/A";
//     try {
//       return format(new Date(dateStr), "MMM d, yyyy");
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   const formatDateTime = (dateStr) => {
//     if (!dateStr) return "N/A";
//     try {
//       return format(new Date(dateStr), "MMM d, yyyy h:mm a");
//     } catch {
//       return "Invalid Date";
//     }
//   };

//   // Handlers
//   const handleSave = async () => {
//     if (!editForm?.title || !editForm.date || !editForm.startTime || !editForm.endTime) {
//       setLocalError("Please fill all required fields.");
//       return;
//     }
//     if (editForm.mode === "online" && !editForm.meetingLink) {
//       setLocalError("Please provide a meeting link for online mode.");
//       return;
//     }
//     try {
//       setLocalError(null);
//       await dispatch(
//         updateMeet({
//           meetingId,
//           updates: {
//             ...editForm,
//             startTime: `${editForm.date}T${editForm.startTime}:00.000Z`,
//             endTime: `${editForm.date}T${editForm.endTime}:00.000Z`,
//             meetingLink: editForm.mode === "online" ? editForm.meetingLink : null,
//             meetingStatus: editForm.meetingStatus,
//           },
//         })
//       ).unwrap();
//       setIsEditing(false);
//     } catch (err) {
//       setLocalError(err.payload || "Failed to update meeting.");
//     }
//   };

//   const handleReschedule = async () => {
//     if (!editForm?.date || !editForm.startTime || !editForm.endTime) {
//       setLocalError("Please fill all required fields.");
//       return;
//     }
//     try {
//       setLocalError(null);
//       await dispatch(
//         rescheduleMeet({
//           meetingId,
//           date: editForm.date,
//           startTime: `${editForm.date}T${editForm.startTime}:00.000Z`,
//           endTime: `${editForm.date}T${editForm.endTime}:00.000Z`,
//           meetingStatus: "rescheduled",
//         })
//       ).unwrap();
//       setShowReschedule(false);
//     } catch (err) {
//       setLocalError(err.payload || "Failed to reschedule meeting.");
//     }
//   };

//   const handleCreateMOM = () => {
//     setMom({ ...mom, momId: `mom-${meetingId}`, status: "drafted" });
//     setShowMOM(false);
//   };

//   const handleCreateQuotation = () => {
//     setQuotation({ ...quotation, quotationId: `quot-${meetingId}` });
//     setShowQuotation(false);
//   };

//   const handleSendQuotation = () => {
//     setQuotation({ ...quotation, status: "sent" });
//   };

//   const handleFeedbackSubmit = () => {
//     if (feedback.trim()) {
//       setQuotation({ ...quotation, feedback });
//       setFeedback("");
//     }
//   };

//   const handleAgreement = () => {
//     setQuotation({ ...quotation, clientAgreed: true });
//   };

//   const handleEndNoteSubmit = () => {
//     if (endNote.note.trim()) {
//       setEndNote({ ...endNote, updatedAt: new Date().toISOString() });
//       setShowEndNote(false);
//     }
//   };

//   // Skeleton loader
//   if (status === "loading") {
//     return (
//       <div className="min-h-screen bg-gray-50 py-8 px-4">
//         <div className="max-w-6xl mx-auto space-y-4">
//           <Skeleton className="h-8 w-32" />
//           <Card className="shadow-lg border-0">
//             <div className="p-6">
//               <Skeleton className="h-10 w-3/4" />
//               <div className="grid lg:grid-cols-3 gap-6 mt-6">
//                 <div className="space-y-4">
//                   <Skeleton className="h-6 w-40" />
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-4 w-full" />
//                 </div>
//                 <div className="space-y-4">
//                   <Skeleton className="h-6 w-40" />
//                   <Skeleton className="h-10 w-full" />
//                   <Skeleton className="h-10 w-full" />
//                   <Skeleton className="h-10 w-full" />
//                 </div>
//                 <div className="space-y-4">
//                   <Skeleton className="h-6 w-40" />
//                   <Skeleton className="h-4 w-full" />
//                   <Skeleton className="h-4 w-full" />
//                 </div>
//               </div>
//             </div>
//           </Card>
//         </div>
//       </div>
//     );
//   }

//   // Render error state
//   if (status === "failed" || localError) {
//     return (
//       <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
//         <AlertDescription>{localError || error || "No meeting found."}</AlertDescription>
//       </Alert>
//     );
//   }

//   if (!selectedMeet) {
//     return (
//       <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
//         <AlertDescription>Meeting data unavailable.</AlertDescription>
//       </Alert>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4">
//       <div className="max-w-6xl mx-auto">
//         <Button variant="ghost" size="sm" onClick={() => window.history.back()} className="mb-6">
//           <ChevronLeft className="w-4 h-4 mr-1" /> Back
//         </Button>

//         <Card className="shadow-lg border-0">
//           <div className="bg-indigo-600 p-6 text-white">
//             <div className="flex items-center justify-between">
//               <div>
//                 <h1 className="text-2xl font-bold">{selectedMeet.title}</h1>
//                 <p className="text-indigo-200 text-sm">ID: {meetingId}</p>
//               </div>
//               <div className="flex gap-2">
//                 <Badge variant="secondary" className="bg-white/20">
//                   <Link className="w-4 h-4 mr-1" /> {selectedMeet.mode}
//                 </Badge>
//                 <Badge
//                   variant={
//                     selectedMeet.meetingStatus === "completed"
//                       ? "success"
//                       : selectedMeet.meetingStatus === "canceled"
//                       ? "destructive"
//                       : "default"
//                   }
//                 >
//                   {selectedMeet.meetingStatus}
//                 </Badge>
//                 <Button size="sm" variant="secondary" onClick={() => setIsEditing(true)}>
//                   <Edit3 className="w-4 h-4" />
//                 </Button>
//               </div>
//             </div>
//           </div>

//           <CardContent className="p-6">
//             <div className="grid lg:grid-cols-3 gap-6">
//               {/* Meeting Details */}
//               <div className="space-y-6">
//                 <div>
//                   <h3 className="text-lg font-semibold text-indigo-700 flex items-center gap-2">
//                     <Calendar className="w-5 h-5" /> Schedule
//                   </h3>
//                   <div className="mt-2 text-sm space-y-1">
//                     <p><strong>Date:</strong> {formatDate(selectedMeet.date)}</p>
//                     <p>
//                       <strong>Time:</strong> {format(new Date(selectedMeet.startTime), "h:mm a")} –{" "}
//                       {format(new Date(selectedMeet.endTime), "h:mm a")}
//                     </p>
//                     <p><strong>Duration:</strong> {selectedMeet.duration || "N/A"} mins</p>
//                     <p>
//                       <strong>Status:</strong>{" "}
//                       {selectedMeet.meetingStatus.charAt(0).toUpperCase() +
//                         selectedMeet.meetingStatus.slice(1)}
//                     </p>
//                   </div>
//                 </div>

//                 {selectedMeet.agenda && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-green-700 flex items-center gap-2">
//                       <FileText className="w-5 h-5" /> Agenda
//                     </h3>
//                     <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">
//                       {selectedMeet.agenda}
//                     </p>
//                   </div>
//                 )}

//                 {selectedMeet.mode === "online" && selectedMeet.meetingLink && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-blue-700 flex items-center gap-2">
//                       <Link className="w-5 h-5" /> Join
//                     </h3>
//                     <a
//                       href={selectedMeet.meetingLink}
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       className="text-sm text-blue-600 hover:underline"
//                     >
//                       {selectedMeet.meetingLink}
//                     </a>
//                   </div>
//                 )}

//                 {hasEndNote && canShowEndNote && (
//                   <div>
//                     <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
//                       <FileText className="w-5 h-5" /> End Note
//                     </h3>
//                     <p className="mt-2 text-sm bg-gray-50 p-3 rounded-lg whitespace-pre-line">
//                       {endNote.note}
//                     </p>
//                     <p className="text-xs text-gray-500">
//                       Updated: {formatDateTime(endNote.updatedAt)}
//                     </p>
//                   </div>
//                 )}
//               </div>

//               {/* Action Center */}
//               <div className="space-y-4">
//                 <h3 className="text-lg font-semibold text-gray-800">Action Center</h3>
//                 <div className="space-y-2">
//                   {canShowEndNote && !hasEndNote && (
//                     <Button
//                       className="w-full justify-start"
//                       onClick={() => setShowEndNote(true)}
//                       disabled={updateStatus === "loading"}
//                     >
//                       <PenSquare className="w-4 h-4 mr-2" /> Add End Note
//                     </Button>
//                   )}

//                   {hasEndNote && (
//                     <Button
//                       className="w-full justify-start"
//                       variant="outline"
//                       onClick={() => setShowEndNote(true)}
//                       disabled={updateStatus === "loading"}
//                     >
//                       <Edit3 className="w-4 h-4 mr-2" /> Edit End Note
//                     </Button>
//                   )}

//                   {meetingEnded && !hasMOM && (
//                     <Button
//                       className="w-full justify-start"
//                       onClick={() => setShowMOM(true)}
//                       disabled={updateStatus === "loading"}
//                     >
//                       <Plus className="w-4 h-4 mr-2" /> Create MOM
//                     </Button>
//                   )}

//                   {hasMOM && (
//                     <Button className="w-full justify-start" variant="outline" disabled>
//                       <CheckCircle2 className="w-4 h-4 mr-2" /> MOM Created
//                     </Button>
//                   )}

//                   <Button
//                     className="w-full justify-start"
//                     variant="outline"
//                     onClick={() => setShowReschedule(true)}
//                     disabled={updateStatus === "loading"}
//                   >
//                     <RefreshCw className="w-4 h-4 mr-2" /> Reschedule
//                   </Button>

//                   {meetingEnded && hasMOM && !hasQuotation && (
//                     <Button
//                       className="w-full justify-start"
//                       onClick={() => setShowQuotation(true)}
//                       disabled={updateStatus === "loading"}
//                     >
//                       <DollarSign className="w-4 h-4 mr-2" /> Create Quotation
//                     </Button>
//                   )}

//                   {hasQuotation && (
//                     <>
//                       <Button className="w-full justify-start" variant="outline" disabled>
//                         <CheckCircle2 className="w-4 h-4 mr-2" /> Quotation Created
//                       </Button>
//                       {quotation.status !== "sent" && (
//                         <Button
//                           className="w-full justify-start"
//                           onClick={handleSendQuotation}
//                         >
//                           <Send className="w-4 h-4 mr-2" /> Send Quotation
//                         </Button>
//                       )}
//                       {quotation.status === "sent" && !quotation.clientAgreed && (
//                         <Button
//                           className="w-full justify-start"
//                           onClick={handleAgreement}
//                         >
//                           <CheckSquare className="w-4 h-4 mr-2" /> Client Agreed
//                         </Button>
//                       )}
//                     </>
//                   )}
//                 </div>

//                 {/* Feedback Input */}
//                 {meetingEnded && hasQuotation && quotation.status === "sent" && !quotation.feedback && (
//                   <div className="space-y-2">
//                     <Label>Feedback</Label>
//                     <div className="flex gap-2">
//                       <Textarea
//                         placeholder="Enter client feedback..."
//                         value={feedback}
//                         onChange={(e) => setFeedback(e.target.value)}
//                         className="flex-1"
//                       />
//                       <Button onClick={handleFeedbackSubmit} disabled={!feedback.trim()}>
//                         <Send className="w-4 h-4" />
//                       </Button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* History */}
//               <div>
//                 <h3 className="text-lg font-semibold text-purple-700 flex items-center gap-2">
//                   <History className="w-5 h-5" /> History
//                 </h3>
//                 <div className="mt-4 max-h-96 overflow-y-auto space-y-3">
//                   {selectedMeet.history?.length ? (
//                     selectedMeet.history.map((event, i) => (
//                       <div key={i} className="flex gap-3">
//                         <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
//                           {event.action === "created" ? (
//                             <Calendar className="w-4 h-4" />
//                           ) : (
//                             <Edit3 className="w-4 h-4" />
//                           )}
//                         </div>
//                         <div>
//                           <p className="text-sm font-medium">
//                             Meeting {event.action === "created" ? "Created" : "Updated"}
//                           </p>
//                           <p className="text-xs text-gray-500">{formatDateTime(event.updatedAt)}</p>
//                         </div>
//                       </div>
//                     ))
//                   ) : (
//                     <p className="text-sm text-gray-500 text-center">No history available.</p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* MOM Section */}
//             {hasMOM && (
//               <div className="bg-emerald-50 p-6 mt-6 rounded-lg">
//                 <h3 className="text-lg font-semibold text-emerald-800 mb-3">Minutes of Meeting</h3>
//                 <p className="text-sm">{mom.summary || "No summary provided."}</p>
//               </div>
//             )}

//             {/* Quotation Section */}
//             {hasQuotation && (
//               <div className="bg-purple-50 p-6 mt-6 rounded-lg">
//                 <h3 className="text-lg font-semibold text-purple-800 mb-3">Quotation</h3>
//                 <p className="text-sm font-medium">{quotation.title || "Untitled Quotation"}</p>
//                 <p className="text-xl font-bold text-purple-700">
//                   ${quotation.amount.toLocaleString()} {quotation.currency}
//                 </p>
//                 <p className="text-sm text-gray-600">
//                   Valid until {quotation.validUntil ? formatDate(quotation.validUntil) : "N/A"}
//                 </p>
//                 {quotation.feedback && (
//                   <p className="text-sm mt-2 italic">Feedback: {quotation.feedback}</p>
//                 )}
//                 {quotation.clientAgreed && (
//                   <Badge className="mt-2 bg-green-600">Client Agreed</Badge>
//                 )}
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       </div>

//       {/* Edit Dialog */}
//       <Dialog open={isEditing} onOpenChange={setIsEditing}>
//         <DialogContent className="max-w-lg">
//           <DialogHeader><DialogTitle>Edit Meeting</DialogTitle></DialogHeader>
//           {editForm && (
//             <div className="space-y-4">
//               <div>
//                 <Label>Title <span className="text-red-500">*</span></Label>
//                 <Input
//                   value={editForm.title}
//                   onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label>Date <span className="text-red-500">*</span></Label>
//                 <Input
//                   type="date"
//                   value={editForm.date}
//                   onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <Label>Start Time <span className="text-red-500">*</span></Label>
//                   <Input
//                     type="time"
//                     value={editForm.startTime}
//                     onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label>End Time <span className="text-red-500">*</span></Label>
//                   <Input
//                     type="time"
//                     value={editForm.endTime}
//                     onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
//                   />
//                 </div>
//               </div>
//               <div>
//                 <Label>Agenda</Label>
//                 <Textarea
//                   value={editForm.agenda}
//                   onChange={(e) => setEditForm({ ...editForm, agenda: e.target.value })}
//                 />
//               </div>
//               <div>
//                 <Label>Mode <span className="text-red-500">*</span></Label>
//                 <select
//                   value={editForm.mode}
//                   onChange={(e) => setEditForm({ ...editForm, mode: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="online">Online</option>
//                   <option value="offline">Offline</option>
//                 </select>
//               </div>
//               {editForm.mode === "online" && (
//                 <div>
//                   <Label>Join Link <span className="text-red-500">*</span></Label>
//                   <Input
//                     value={editForm.meetingLink}
//                     onChange={(e) => setEditForm({ ...editForm, meetingLink: e.target.value })}
//                   />
//                 </div>
//               )}
//               <div>
//                 <Label>Meeting Status</Label>
//                 <select
//                   value={editForm.meetingStatus}
//                   onChange={(e) => setEditForm({ ...editForm, meetingStatus: e.target.value })}
//                   className="w-full p-2 border rounded"
//                 >
//                   <option value="scheduled">Scheduled</option>
//                   <option value="rescheduled">Rescheduled</option>
//                   <option value="canceled">Canceled</option>
//                   <option value="completed">Completed</option>
//                 </select>
//               </div>
//               {localError && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{localError}</AlertDescription>
//                 </Alert>
//               )}
//               <div className="flex justify-end gap-2">
//                 <Button variant="outline" onClick={() => setIsEditing(false)}>
//                   <X className="w-4 h-4 mr-1" /> Cancel
//                 </Button>
//                 <Button onClick={handleSave} disabled={updateStatus === "loading"}>
//                   <Save className="w-4 h-4 mr-1" /> Save
//                 </Button>
//               </div>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* Reschedule Dialog */}
//       <Dialog open={showReschedule} onOpenChange={setShowReschedule}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Reschedule Meeting</DialogTitle></DialogHeader>
//           {editForm && (
//             <div className="space-y-4">
//               <div>
//                 <Label>Date <span className="text-red-500">*</span></Label>
//                 <Input
//                   type="date"
//                   value={editForm.date}
//                   onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
//                 />
//               </div>
//               <div className="grid grid-cols-2 gap-2">
//                 <div>
//                   <Label>Start Time <span className="text-red-500">*</span></Label>
//                   <Input
//                     type="time"
//                     value={editForm.startTime}
//                     onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
//                   />
//                 </div>
//                 <div>
//                   <Label>End Time <span className="text-red-500">*</span></Label>
//                   <Input
//                     type="time"
//                     value={editForm.endTime}
//                     onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
//                   />
//                 </div>
//               </div>
//               {localError && (
//                 <Alert variant="destructive">
//                   <AlertDescription>{localError}</AlertDescription>
//                 </Alert>
//               )}
//               <Button
//                 className="w-full"
//                 onClick={handleReschedule}
//                 disabled={updateStatus === "loading"}
//               >
//                 Reschedule
//               </Button>
//             </div>
//           )}
//         </DialogContent>
//       </Dialog>

//       {/* MOM Dialog */}
//       <Dialog open={showMOM} onOpenChange={setShowMOM}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Create MOM</DialogTitle></DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label>Summary</Label>
//               <Textarea
//                 placeholder="Enter meeting summary..."
//                 value={mom.summary}
//                 onChange={(e) => setMom({ ...mom, summary: e.target.value })}
//               />
//             </div>
//             <Button className="w-full" onClick={handleCreateMOM}>
//               Create MOM
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* Quotation Dialog */}
//       <Dialog open={showQuotation} onOpenChange={setShowQuotation}>
//         <DialogContent>
//           <DialogHeader><DialogTitle>Create Quotation</DialogTitle></DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label>Title</Label>
//               <Input
//                 placeholder="Enter quotation title"
//                 value={quotation.title}
//                 onChange={(e) => setQuotation({ ...quotation, title: e.target.value })}
//               />
//             </div>
//             <div>
//               <Label>Amount</Label>
//               <Input
//                 type="number"
//                 placeholder="Enter amount"
//                 value={quotation.amount || ""}
//                 onChange={(e) => setQuotation({ ...quotation, amount: +e.target.value })}
//               />
//             </div>
//             <div>
//               <Label>Valid Until</Label>
//               <Input
//                 type="date"
//                 value={quotation.validUntil}
//                 onChange={(e) => setQuotation({ ...quotation, validUntil: e.target.value })}
//               />
//             </div>
//             <Button className="w-full" onClick={handleCreateQuotation}>
//               Create Quotation
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>

//       {/* End Note Dialog */}
//       <Dialog open={showEndNote} onOpenChange={setShowEndNote}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>{hasEndNote ? "Edit End Note" : "Add End Note"}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label>End Note</Label>
//               <Textarea
//                 placeholder="Enter meeting end note (e.g., what was discussed, outcomes, etc.)"
//                 value={endNote.note}
//                 onChange={(e) => setEndNote({ ...endNote, note: e.target.value })}
//               />
//             </div>
//             <Button className="w-full" onClick={handleEndNoteSubmit} disabled={!endNote.note.trim()}>
//               Save End Note
//             </Button>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }












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
} from "@/features/meet/meetSlice";

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
          <div className="bg-indigo-600 p-6 text-white">
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
                    <p><strong>Duration:</strong> {selectedMeeting.duration || "N/A"} mins</p>
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




