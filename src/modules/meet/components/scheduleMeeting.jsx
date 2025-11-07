
"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  createMeeting,
  resetCreateStatus,
  clearError,
} from "@/modules/meet/slices/meetSlice";
import { toast } from "sonner"; // npm install sonner

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Loader2,
  Clock,
  Link,
  MapPin,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function ScheduleMeetingModal({ meetingRefs, contactId,onClose }) {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();

  const { createStatus, error } = useSelector((state) => state.meet);

  // Auto-detect any xxxId from URL
  const urlRef = (() => {
    if (meetingRefs) return null;
    for (const [key, value] of searchParams.entries()) {
      if (key.endsWith("Id")) {
        const cleanKey = key.replace(/Id$/, "");
        return `${cleanKey}:${value}`;
      }
    }
    return null;
  })();

  const finalRef = meetingRefs || urlRef;

  const [form, setForm] = useState({
    title: "",
    agenda: "",
    date: "",
    startTime: "",
    endTime: "",
    mode: "offline",
    meetingLink: "",
    contactId:"",
    reference: finalRef,
  });

  const [duration, setDuration] = useState(0);

  // Reset on open
  useEffect(() => {
    dispatch(clearError());
    dispatch(resetCreateStatus());
  }, [dispatch]);

  // Duration
  useEffect(() => {
    if (form.startTime && form.endTime) {
      const [sh, sm] = form.startTime.split(":");
      const [eh, em] = form.endTime.split(":");
      const start = new Date(2025, 0, 1, sh, sm);
      const end = new Date(2025, 0, 1, eh, em);
      if (end > start) {
        setDuration(Math.round((end - start) / 60000));
      } else {
        setDuration(0);
      }
    }
  }, [form.startTime, form.endTime]);

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = form.title && form.date && form.startTime && form.endTime;
    const onlineLink = form.mode === "online" ? form.meetingLink : true;
    if (!required || !onlineLink) return;

    const payload = {
      title: form.title,
      agenda: form.agenda,
      contactId: contactId,
      date: form.date,
      startTime: `${form.date}T${form.startTime}:00.000Z`,
      endTime: `${form.date}T${form.endTime}:00.000Z`,
      duration,
      mode: form.mode,
      meetingLink: form.mode === "online" ? form.meetingLink : null,
      reference: form.reference,
      // endNote: REMOVED ENTIRELY
    };

    const result = await dispatch(createMeeting(payload));
    if (result.type.endsWith("fulfilled")) {
      toast.success("Meeting scheduled successfully!");
      onClose();
    }
  };

  const isValid =
    form.title &&
    form.date &&
    form.startTime &&
    form.endTime &&
    (form.mode === "offline" || form.meetingLink);

  return (
    <div className="space-y-5  min-w-full ">

      {/* REFERENCE BADGE */}
      {form.reference && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <span className="font-medium text-blue-900">Event type:</span>{" "}
          <span className="font-mono text-blue-700">{form.reference}</span>
        
        </div>
      )}

      {/* TITLE */}
      <div>
        <Label>Title <span className="text-red-500">*</span></Label>
        <Input
          placeholder="Q4 Sales Review"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="mt-1"
           maxLength="100"
        />
      </div>

      {/* AGENDA - EXPANDABLE */}
      <div >
        <Label>Agenda<span className="text-red-500">*</span></Label>
        <Textarea
          placeholder="1. Review targets, 
          2. Demo new features..."
          rows={4}
          maxLength="500"
          className="mt-1 resize-y min-h-50"
          value={form.agenda}
          onChange={(e) => setForm({ ...form, agenda: e.target.value })}
        />
        <div>{form.agenda.length}/500</div>
      </div>

      {/* DATE */}
      <div>
        <Label>Date <span className="text-red-500">*</span></Label>
        <Input
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="mt-1"
        />
      </div>

      {/* TIME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <Label>Start Time <span className="text-red-500">*</span></Label>
          <Input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            className="mt-1"
          />
        </div>
        <div>
          <Label>End Time <span className="text-red-500">*</span></Label>
          <Input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm({ ...form, endTime: e.target.value })}
            className="mt-1"
          />
        </div>
      </div>

      {/* DURATION */}
      {duration > 0 && (
        <div className="flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 p-2 rounded-lg">
          <Clock className="w-4 h-4" />
          Duration: <strong>{duration} min</strong>
        </div>
      )}

      {/* MODE */}
      <div>
        <Label>Mode <span className="text-red-500">*</span></Label>
        <RadioGroup
          value={form.mode}
          onValueChange={(v) =>
            setForm({
              ...form,
              mode: v,
              meetingLink: v === "offline" ? "" : form.meetingLink,
            })
          }
          className="mt-2"
        >
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="offline" id="offline" />
              <Label htmlFor="offline" className="cursor-pointer flex items-center gap-1">
                <MapPin className="w-4 h-4" /> Offline
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="online" id="online" />
              <Label htmlFor="online" className="cursor-pointer flex items-center gap-1">
                <Link className="w-4 h-4" /> Online
              </Label>
            </div>
          </div>
        </RadioGroup>
      </div>

      {/* ONLINE LINK */}
      {form.mode === "online" && (
        <div>
          <Label>Join Link <span className="text-red-500">*</span></Label>
          <Input
            placeholder="https://zoom.us/j/..."
            value={form.meetingLink}
            onChange={(e) => setForm({ ...form, meetingLink: e.target.value })}
            className="mt-1"
          />
        </div>
      )}

      {/* ERROR */}
      {/* {error && (
        <Alert variant="destructive">
          <AlertCircle className="w-4 h-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )} */}

      {/* BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="w-full sm:w-auto"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={!isValid || createStatus === "loading"}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium"
        >
          {createStatus === "loading" ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Scheduling...
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4 mr-2" />
              Schedule Meeting
            </>
          )}
        </Button>
      </div>
    </div>
  );
}








































