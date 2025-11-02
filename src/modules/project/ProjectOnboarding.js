


"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { validateInput, sanitizeInput } from "@/utils/sanitize";
import TeamLeadSelect from "@/modules/project/TeamLeadSelect";
import ClientSelect from "@/modules/project/ClientSelect";
import {
  FiCalendar,
  FiUser,
  FiFileText,
  FiUpload,
  FiX,
  FiEye,
  FiCheck,
} from "react-icons/fi";
import {
  createProject,
  fetchAllProjects,
  resetProjectCreation,
} from "@/features/projectSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function ProjectOnboarding() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector((state) => ({
    loading: state.project.status.projectCreation === "loading",
    error: state.project.error.projectCreation,
    successMessage: state.project.successMessage,
  }));

  const formRef = useRef(null);
  const fileInputRef = useRef(null);
  const clientSelectRef = useRef(null);
  const teamLeadSelectRef = useRef(null);

  const [formData, setFormData] = useState({
    projectName: "",
    description: "",
    clientId: undefined,
    teamLeadId: "",
    teamLeadName: "",
    startDate: "",
    expectedEndDate: "",
    category: "",
    attachments: [],
  });

  const [formErrors, setFormErrors] = useState({
    projectName: "",
    description: "",
    clientId: "",
    teamLeadId: "",
    startDate: "",
    expectedEndDate: "",
    category: "",
  });

  const [fileErrors, setFileErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [previewFile, setPreviewFile] = useState(null);
  const [isClientSelectOpen, setIsClientSelectOpen] = useState(false);
  const [isTeamLeadSelectOpen, setIsTeamLeadSelectOpen] = useState(false);
  const [isStartDatePickerOpen, setIsStartDatePickerOpen] = useState(false);
  const [isExpectedEndDatePickerOpen, setIsExpectedEndDatePickerOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [hasHandledSuccess, setHasHandledSuccess] = useState(false);

  // Success navigation
  useEffect(() => {
    if (successMessage && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      toast.success("Project created successfully!");
      dispatch(fetchAllProjects());
      router.push("/project/all");
      dispatch(resetProjectCreation());
    }
    if (error) {
      toast.error(error || "Failed to create project");
      dispatch(resetProjectCreation());
    }
  }, [successMessage, error, router, dispatch, hasHandledSuccess]);

  // Click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (clientSelectRef.current && !clientSelectRef.current.contains(event.target)) {
        setIsClientSelectOpen(false);
      }
      if (teamLeadSelectRef.current && !teamLeadSelectRef.current.contains(event.target)) {
        setIsTeamLeadSelectOpen(false);
      }
      if (formRef.current && !formRef.current.contains(event.target)) {
        setIsStartDatePickerOpen(false);
        setIsExpectedEndDatePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const validation = validateInput(value);

    if (!validation.isValid) {
      setFormErrors((prev) => ({ ...prev, [name]: validation.warning }));
      return;
    }

    setFormErrors((prev) => ({ ...prev, [name]: "" }));

    const sanitizedValue = sanitizeInput(value);
    const updatedFormData = { ...formData, [name]: sanitizedValue };

    if (name === "category" && sanitizedValue === "in house") {
      updatedFormData.clientId = undefined;
      setFormErrors((prev) => ({ ...prev, clientId: "" }));
    }

    if (name === "startDate" && updatedFormData.expectedEndDate) {
      if (new Date(sanitizedValue) > new Date(updatedFormData.expectedEndDate)) {
        setFormErrors((prev) => ({ ...prev, startDate: "Start date cannot be after end date" }));
      } else {
        setFormErrors((prev) => ({ ...prev, startDate: "", expectedEndDate: "" }));
      }
    }

    if (name === "expectedEndDate" && updatedFormData.startDate) {
      if (new Date(updatedFormData.startDate) > new Date(sanitizedValue)) {
        setFormErrors((prev) => ({ ...prev, expectedEndDate: "End date cannot be before start date" }));
      } else {
        setFormErrors((prev) => ({ ...prev, expectedEndDate: "", startDate: "" }));
      }
    }

    setFormData(updatedFormData);
  };

  const handleDateSelect = (name, date) => {
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    handleChange({ target: { name, value: formatted } });
    if (name === "startDate") setIsStartDatePickerOpen(false);
    if (name === "expectedEndDate") setIsExpectedEndDatePickerOpen(false);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.length) handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (files) => {
    const newFiles = Array.from(files);
    const validFiles = [];
    const errors = [];

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];

    const maxSize = 10 * 1024 * 1024;

    newFiles.forEach((file, index) => {
      if (!allowedTypes.includes(file.type)) {
        errors.push(`${file.name}: Only PDF, Word, Excel, PPT allowed`);
      } else if (file.size > maxSize) {
        errors.push(`${file.name}: Max 10MB`);
      } else {
        validFiles.push(file);
        setUploadProgress((prev) => ({ ...prev, [file.name]: 0 }));
        simulateUpload(file.name);
      }
    });

    if (errors.length) {
      setFileErrors(errors);
      toast.error("Some files were rejected");
    }

    if (validFiles.length) {
      setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...validFiles] }));
      setFileErrors([]);
      toast.success(`${validFiles.length} file(s) added`);
    }
  };

  const simulateUpload = (fileName) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress((prev) => ({ ...prev, [fileName]: progress }));
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          setUploadProgress((prev) => {
            const { [fileName]: _, ...rest } = prev;
            return rest;
          });
        }, 800);
      }
    }, 200);
  };

  const removeFile = (index) => {
    const file = formData.attachments[index];
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
    setUploadProgress((prev) => {
      const { [file.name]: _, ...rest } = prev;
      return rest;
    });
  };

  const viewFile = (file) => {
    const url = URL.createObjectURL(file);
    setPreviewFile({ url, name: file.name, type: file.type });
  };

  const closePreview = () => {
    if (previewFile?.url) URL.revokeObjectURL(previewFile.url);
    setPreviewFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let hasErrors = false;
    const newErrors = { ...formErrors };

    const required = ["projectName", "description", "teamLeadId", "startDate", "expectedEndDate", "category"];
    required.forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "This field is required";
        hasErrors = true;
      }
    });

    if (formData.category === "client" && !formData.clientId) {
      newErrors.clientId = "Client is required";
      hasErrors = true;
    }

    if (hasErrors) {
      setFormErrors(newErrors);
      toast.error("Please fill all required fields");
      return;
    }

    const submissionData = new FormData();
    submissionData.append("projectName", formData.projectName);
    submissionData.append("description", formData.description);
    if (formData.category === "client") submissionData.append("clientId", formData.clientId);
    submissionData.append("teamLeadId", formData.teamLeadId);
    submissionData.append("teamLeadName", formData.teamLeadName);
    submissionData.append("startDate", formData.startDate);
    submissionData.append("expectedEndDate", formData.expectedEndDate);
    submissionData.append("category", formData.category);
    formData.attachments.forEach((file) => submissionData.append("attachments", file));

    try {
      await dispatch(createProject(submissionData)).unwrap();
    } catch (err) {
      // Error handled in useEffect
    }
  };

  const getFileIcon = (type) => {
    if (type.includes("pdf")) return <FiFileText className="w-5 h-5 text-red-600" />;
    if (type.includes("word")) return <FiFileText className="w-5 h-5 text-blue-600" />;
    if (type.includes("excel")) return <FiFileText className="w-5 h-5 text-green-600" />;
    if (type.includes("powerpoint")) return <FiFileText className="w-5 h-5 text-orange-600" />;
    return <FiFileText className="w-5 h-5 text-gray-600" />;
  };

  const isFormValid = () => {
    const required = ["projectName", "description", "teamLeadId", "startDate", "expectedEndDate", "category"];
    const allFilled = required.every((key) => formData[key]);
    const clientValid = formData.category !== "client" || formData.clientId;
    return allFilled && clientValid && !loading;
  };

  const CalendarPicker = ({ value, onSelect, name }) => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth());

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const selected = value ? new Date(value) : null;

    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    return (
      <div className="absolute z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 mt-2 w-72">
        <div className="flex justify-between items-center mb-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (month === 0) { setMonth(11); setYear(year - 1); }
              else setMonth(month - 1);
            }}
          >‹</Button>
          <span className="font-medium text-sm">
            {new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (month === 11) { setMonth(0); setYear(year + 1); }
              else setMonth(month + 1);
            }}
          >›</Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {weekdays.map((day) => (
            <div key={day} className="font-semibold text-gray-500 py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: firstDay }, (_, i) => (
            <div key={`empty-start-${i}`} />
          ))}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const isSelected = selected && selected.toDateString() === date.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <Button
                key={day}
                variant={isSelected ? "default" : "ghost"}
                className={`h-8 w-8 text-xs ${isSelected ? "bg-blue-600 hover:bg-blue-700" : ""} ${isToday ? "ring-2 ring-blue-400" : ""}`}
                onClick={() => onSelect(name, date)}
              >
                {day}
              </Button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <>
      <div ref={formRef} className="min-h-screen  p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center sm:text-left">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
              Onboard New Project
            </h1>
            <p className="mt-2 text-lg text-gray-600">Fill in the details to create a professional project</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Form Fields */}
              <div className="space-y-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-800 flex items-center gap-1">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    placeholder="e.g., Enterprise CRM System"
                    className={`h-12 text-base ${formErrors.projectName ? "border-red-500 focus:ring-red-500" : "border-gray-300"}`}
                  />
                  {formErrors.projectName && <p className="text-red-500 text-sm">{formErrors.projectName}</p>}
                </div>

                {/* Category & Client */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold text-gray-800 flex items-center gap-1">
                      Project Type <span className="text-red-500">*</span>
                    </Label>
                    <Select value={formData.category} onValueChange={(v) => handleChange({ target: { name: "category", value: v } })}>
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                            Client Project
                          </span>
                        </SelectItem>
                        <SelectItem value="in house">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                            In-House
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.category === "client" && (
                    <div ref={clientSelectRef} className="space-y-2">
                      <Label className="text-base font-semibold text-gray-800 flex items-center gap-1">
                        Client <span className="text-red-500">*</span>
                      </Label>
                      <ClientSelect
                        value={formData.clientId}
                        isOpen={isClientSelectOpen}
                        onToggle={() => setIsClientSelectOpen(!isClientSelectOpen)}
                        onChange={(v) => {
                          setFormData(prev => ({ ...prev, clientId: v }));
                          setFormErrors(prev => ({ ...prev, clientId: "" }));
                        }}
                        className="h-12"
                      />
                      {formErrors.clientId && <p className="text-red-500 text-sm">{formErrors.clientId}</p>}
                    </div>
                  )}
                </div>

                {/* Team Lead */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold text-gray-800 flex items-center gap-1">
                    Team Lead <span className="text-red-500">*</span>
                  </Label>
                  <TeamLeadSelect
                    value={formData.teamLeadId}
                    isOpen={isTeamLeadSelectOpen}
                    onToggle={() => setIsTeamLeadSelectOpen(!isTeamLeadSelectOpen)}
                    onChange={({ teamLeadId, teamLeadName }) => {
                      setFormData(prev => ({ ...prev, teamLeadId, teamLeadName }));
                      setFormErrors(prev => ({ ...prev, teamLeadId: "" }));
                    }}
                    className="h-12"
                  />
                  {formErrors.teamLeadId && <p className="text-red-500 text-sm">{formErrors.teamLeadId}</p>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label className="text-base font-semibold text-gray-800 flex items-center gap-1">
                      Start Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formData.startDate}
                        readOnly
                        placeholder="YYYY-MM-DD"
                        className={`h-12 pr-10 cursor-pointer ${formErrors.startDate ? "border-red-500 focus:ring-red-500" : ""}`}
                        onClick={() => setIsStartDatePickerOpen(!isStartDatePickerOpen)}
                      />
                      <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      {isStartDatePickerOpen && (
                        <CalendarPicker value={formData.startDate} onSelect={handleDateSelect} name="startDate" />
                      )}
                    </div>
                    {formErrors.startDate && <p className="text-red-500 text-sm">{formErrors.startDate}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label className="text-base font-semibold text-gray-800 flex items-center gap-1">
                      Expected End Date <span className="text-red-500">*</span>
                    </Label>
                    <div className="relative">
                      <Input
                        type="text"
                        value={formData.expectedEndDate}
                        readOnly
                        placeholder="YYYY-MM-DD"
                        className={`h-12 pr-10 cursor-pointer ${formErrors.expectedEndDate ? "border-red-500 focus:ring-red-500" : ""}`}
                        onClick={() => formData.startDate && setIsExpectedEndDatePickerOpen(!isExpectedEndDatePickerOpen)}
                        disabled={!formData.startDate}
                      />
                      <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      {isExpectedEndDatePickerOpen && (
                        <CalendarPicker value={formData.expectedEndDate} onSelect={handleDateSelect} name="expectedEndDate" />
                      )}
                    </div>
                    {formErrors.expectedEndDate && <p className="text-red-500 text-sm">{formErrors.expectedEndDate}</p>}
                  </div>
                </div>
              </div>

              {/* Right: Upload */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold text-gray-800">
                    Project Documents (PDF, Word, Excel, PPT)
                  </Label>
                  <div
                    className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
                      dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"
                    }`}
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                      onChange={(e) => e.target.files && handleFiles(e.target.files)}
                      className="hidden"
                    />
                    <FiUpload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                    <p className="mt-3 text-sm sm:text-base text-gray-600">
                      Drag & drop documents here, or click to select
                    </p>
                    <p className="text-xs text-gray-500 mt-1">Max 10MB per file • PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX only</p>
                  </div>

                  {fileErrors.length > 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      {fileErrors.map((e, i) => (
                        <p key={i} className="text-red-700 text-sm">{e}</p>
                      ))}
                    </div>
                  )}

                  {formData.attachments.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-gray-700">
                        {formData.attachments.length} document(s) ready
                      </p>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {formData.attachments.map((file, i) => (
                          <div key={i} className="bg-white border rounded-lg p-4 flex items-center justify-between group hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {getFileIcon(file.type)}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
                                <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              {uploadProgress[file.name] !== undefined && (
                                <div className="w-24">
                                  <Progress value={uploadProgress[file.name]} className="h-2" />
                                  <p className="text-xs text-gray-500 mt-1 text-center">{uploadProgress[file.name]}%</p>
                                </div>
                              )}
                              {uploadProgress[file.name] === undefined && (
                                <>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); viewFile(file); }}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <FiEye className="h-4 w-4 text-blue-600" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                  >
                                    <FiX className="h-4 w-4 text-red-500" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-base font-semibold text-gray-800 flex items-center gap-1">
                Project Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Provide a detailed description of the project scope, objectives, deliverables, and any special requirements..."
                className={`min-h-48 text-base ${formErrors.description ? "border-red-500 focus:ring-red-500" : ""}`}
              />
              {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-center sm:justify-end pt-8">
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid()}
                className="bg-blue-600  hover:from-blue-700 hover:to-indigo-700 text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 min-w-64 justify-center"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    Creating Project...
                  </>
                ) : (
                  <>
                    <FiCheck className="h-6 w-6" />
                    Create Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0  z-50 flex items-center justify-center p-4" onClick={closePreview}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-full overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gray-50">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate pr-4">{previewFile.name}</h3>
              <Button variant="ghost" size="icon" onClick={closePreview}>
                <FiX className="h-6 w-6" />
              </Button>
            </div>
            <div className="flex-1 bg-gray-100 p-4 sm:p-6 overflow-auto">
              {previewFile.type === "application/pdf" ? (
                <iframe src={previewFile.url} className="w-full h-full min-h-96 rounded-lg border" title={previewFile.name} />
              ) : (
                <div className="bg-white border-2 border-dashed rounded-xl w-full h-96 flex flex-col items-center justify-center">
                  <FiFileText className="h-16 w-16 text-gray-400 mb-4" />
                  <p className="text-gray-600 text-lg">Preview not available</p>
                  <p className="text-gray-500 text-sm mt-2">Download to view {previewFile.type.split('/').pop().toUpperCase()} files</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}