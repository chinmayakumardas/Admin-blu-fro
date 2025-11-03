"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "sonner";
import { format } from "date-fns";
import { createIssue } from "@/features/issueSlice"; // <-- your Redux action
import {
  AlertCircle,
  FileText,
  CalendarIcon,
  Flag,
  Clock,
  X,
  Loader2,
} from "lucide-react";

const ReportIssueForm = ({ onClose, onIssueReported, isOpen = true }) => {
  const dispatch = useDispatch();

  // 🧠 Local State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [refId, setRefId] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // 🧹 Reset form
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("Medium");
    setRefId("");
    setSelectedDate(null);
    setSelectedTime("");
    setAttachment(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  // ✅ Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required.";
    if (!description.trim()) newErrors.description = "Description is required.";
    if (!priority) newErrors.priority = "Please select a priority.";
    if (!selectedDate) newErrors.date = "Please select a due date.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 📤 Submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);

    const pad = (n) => (n < 10 ? "0" + n : n);
    let combinedDateTime = null;
    if (selectedDate) {
      const dateObj = new Date(selectedDate);
      const [hours, minutes] = selectedTime ? selectedTime.split(":").map(Number) : [23, 59];
      dateObj.setHours(hours, minutes, 0, 0);
      combinedDateTime =
        dateObj.getFullYear() +
        "-" +
        pad(dateObj.getMonth() + 1) +
        "-" +
        pad(dateObj.getDate()) +
        "T" +
        pad(dateObj.getHours()) +
        ":" +
        pad(dateObj.getMinutes()) +
        ":" +
        pad(dateObj.getSeconds());
    }

    const formData = new FormData();
    formData.append("title", title.trim());
    formData.append("description", description.trim());
    formData.append("priority", priority);
    formData.append("deadline", combinedDateTime);
    if (refId) formData.append("ref_id", refId.trim());
    if (attachment) formData.append("attachment", attachment);

    try {
      await dispatch(createIssue(formData)).unwrap();
      toast.success("Issue reported successfully!");
      resetForm();
      onIssueReported?.();
      onClose();
    } catch (err) {
      toast.error(err?.message || "Failed to report issue.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = title.trim() && description.trim() && priority && selectedDate;
  const isDisabled = isSubmitting || !isFormValid;

  // 💎 UI
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="w-full max-w-3xl bg-white border border-gray-200 rounded-xl shadow-lg p-4 sm:p-6">
        <DialogHeader className="border-b border-gray-100 pb-3 flex items-center justify-between">
          <DialogTitle className="text-base sm:text-lg font-semibold text-gray-800 flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-500" /> Report Issue
          </DialogTitle>
          <DialogClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-500 hover:bg-gray-100 rounded-full h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogClose>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
          className="space-y-5 mt-4"
        >
          {/* 🧾 Title */}
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              <AlertCircle className="h-4 w-4 text-blue-500 mr-2" />
              Title <span className="text-red-500 ml-1">*</span>
            </label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter issue title"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1 flex items-center">
                <X className="h-3 w-3 mr-1" /> {errors.title}
              </p>
            )}
          </div>

          {/* 📌 Optional Reference ID */}
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              Reference ID (optional)
            </label>
            <Input
              value={refId}
              onChange={(e) => setRefId(e.target.value)}
              placeholder="Enter related task ID or ref"
              disabled={isSubmitting}
            />
          </div>

          {/* 📅 Priority + Date + Time */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="flex items-center text-sm font-medium mb-2">
                <Flag className="h-4 w-4 text-blue-500 mr-2" />
                Priority <span className="text-red-500 ml-1">*</span>
              </label>
              <Select
                value={priority}
                onValueChange={setPriority}
                disabled={isSubmitting}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium mb-2">
                <CalendarIcon className="h-4 w-4 text-blue-500 mr-2" />
                Due Date <span className="text-red-500 ml-1">*</span>
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    {selectedDate ? format(selectedDate, "MMM dd, yyyy") : "Select date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="flex items-center text-sm font-medium mb-2">
                <Clock className="h-4 w-4 text-blue-500 mr-2" />
                Time
              </label>
              <Input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* 📝 Description */}
          <div>
            <label className="flex items-center text-sm font-medium mb-2">
              Description <span className="text-red-500 ml-1">*</span>
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="min-h-[150px]"
              disabled={isSubmitting}
            />
          </div>

          {/* 📎 Attachment */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Attachment (optional)
            </label>
            <Input
              type="file"
              accept="image/*,application/pdf,.doc,.docx"
              onChange={(e) => setAttachment(e.target.files[0] || null)}
              disabled={isSubmitting}
            />
          </div>

          {/* 🔘 Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isDisabled}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" /> Submitting...
                </>
              ) : (
                "Report Issue"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportIssueForm;
