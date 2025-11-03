



// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useRouter } from "next/navigation";
// import { validateInput, sanitizeInput } from "@/utils/sanitize";
// import { fetchProjectById, updateProject } from "@/features/projectSlice";
// import {
//   FiCalendar,
//   FiUser,
//   FiFileText,
//   FiUpload,
//   FiX,
//   FiFolder,
//   FiFile,
//   FiArrowLeft,
// } from "react-icons/fi";
// import { toast } from "sonner";
// import TeamLeadSelect from "@/modules/project/TeamLeadSelect";
// import ClientSelect from "@/modules/project/ClientSelect";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
// import {
//   Select,
//   SelectTrigger,
//   SelectValue,
//   SelectContent,
//   SelectItem,
// } from "@/components/ui/select";
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from "@/components/ui/card";
// import gsap from "gsap";

// export default function ProjectEditForm({ projectId }) {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { project, status, error } = useSelector((state) => state.project);
//   const formRef = useRef(null);
//   const fileInputRef = useRef(null);
//   const teamLeadSelectRef = useRef(null);
//   const clientSelectRef = useRef(null);

//   const [formData, setFormData] = useState({
//     projectName: "",
//     description: "",
//     clientId: "",
//     teamLeadId: "",
//     teamLeadName: "",
//     startDate: "",
//     expectedEndDate: "",
//     category: "",
//     attachments: [],
//   });

//   const [isTeamLeadSelectOpen, setIsTeamLeadSelectOpen] = useState(false);
//   const [isClientSelectOpen, setIsClientSelectOpen] = useState(false);
//   const [dragActive, setDragActive] = useState(false);
//   const [fileErrors, setFileErrors] = useState([]);
//   const [isFormInitialized, setIsFormInitialized] = useState(false);

//   // Fetch project data on component mount
//   useEffect(() => {
//     if (projectId && status.fetchProject === "idle") {
//       dispatch(fetchProjectById(projectId));
//     }
//   }, [dispatch, projectId, status.fetchProject]);

//   // Animate form appearance
//   useEffect(() => {
//     gsap.fromTo(
//       formRef.current,
//       { opacity: 0, y: 30 },
//       { opacity: 1, y: 0, duration: 1, ease: "power4.out" }
//     );
//   }, []);

//   // Update form data when project data is fetched, only if not initialized
//   useEffect(() => {
//     if (
//       project &&
//       project.data &&
//       !isFormInitialized &&
//       status.fetchProject === "succeeded"
//     ) {
//       setFormData({
//         projectName: project.data.projectName || "",
//         description: project.data.description || "",
//         clientId: project.data.clientId || "",
//         teamLeadId: project.data.teamLeadId || "",
//         teamLeadName: project.data.teamLeadName || "",
//         startDate: project.data.startDate
//           ? project.data.startDate.split("T")[0]
//           : "",
//         expectedEndDate: project.data.expectedEndDate
//           ? project.data.expectedEndDate.split("T")[0]
//           : "",
//         category: project.data.category || "",
//         attachments: [],
//       });
//       setIsFormInitialized(true);
//     }
//   }, [project, status.fetchProject, isFormInitialized]);

//   // Click outside handler for select dropdowns
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (
//         teamLeadSelectRef.current &&
//         !teamLeadSelectRef.current.contains(event.target)
//       ) {
//         setIsTeamLeadSelectOpen(false);
//       }
//       if (
//         clientSelectRef.current &&
//         !clientSelectRef.current.contains(event.target)
//       ) {
//         setIsClientSelectOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("touchstart", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("touchstart", handleClickOutside);
//     };
//   }, []);

//   const [formErrors, setFormErrors] = useState({
//     projectName: "",
//     description: "",
//     clientId: "",
//     teamLeadId: "",
//     teamLeadName: "",
//     startDate: "",
//     expectedEndDate: "",
//     category: "",
//   });

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const validation = validateInput(value);

//     if (!validation.isValid) {
//       setFormErrors((prev) => ({
//         ...prev,
//         [name]: validation.warning,
//       }));
//       return;
//     }

//     setFormErrors((prev) => ({
//       ...prev,
//       [name]: "",
//     }));

//     const sanitizedValue = sanitizeInput(value);
//     const updatedFormData = {
//       ...formData,
//       [name]: sanitizedValue,
//     };

//     // Reset clientId when category changes to in house
//     if (name === "category" && sanitizedValue === "in house") {
//       updatedFormData.clientId = "";
//       setFormErrors((prev) => ({
//         ...prev,
//         clientId: "",
//       }));
//     }

//     if (
//       name === "startDate" &&
//       updatedFormData.expectedEndDate &&
//       new Date(sanitizedValue) > new Date(updatedFormData.expectedEndDate)
//     ) {
//       setFormErrors((prev) => ({
//         ...prev,
//         startDate: "Start date cannot be after expected end date",
//       }));
//     } else if (
//       name === "expectedEndDate" &&
//       updatedFormData.startDate &&
//       new Date(updatedFormData.startDate) > new Date(sanitizedValue)
//     ) {
//       setFormErrors((prev) => ({
//         ...prev,
//         expectedEndDate: "Expected end date cannot be before start date",
//       }));
//     }

//     setFormData(updatedFormData);
//   };

//   const handleDrag = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     if (e.type === "dragenter" || e.type === "dragover") {
//       setDragActive(true);
//     } else if (e.type === "dragleave") {
//       setDragActive(false);
//     }
//   };

//   const handleDrop = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     setDragActive(false);
//     if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
//       handleFiles(e.dataTransfer.files);
//     }
//   };

//   const handleFiles = (files) => {
//     const newFiles = Array.from(files);
//     const validFiles = [];
//     const errors = [];

//     const allowedTypes = [
//       "application/pdf",
//       "application/msword",
//       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
//       "application/vnd.ms-excel",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
//       "application/vnd.ms-powerpoint",
//       "application/vnd.openxmlformats-officedocument.presentationml.presentation",
//       "text/plain",
//     ];

//     const maxSize = 10 * 1024 * 1024; // 10MB

//     newFiles.forEach((file) => {
//       if (!allowedTypes.includes(file.type)) {
//         errors.push(`File ${file.name} has an unsupported type.`);
//       } else if (file.size > maxSize) {
//         errors.push(`File ${file.name} exceeds 10MB.`);
//       } else {
//         validFiles.push(file);
//       }
//     });

//     if (errors.length > 0) {
//       setFileErrors(errors);
//       toast.error(errors.join(" "));
//     }

//     if (validFiles.length > 0) {
//       setFormData((prev) => ({
//         ...prev,
//         attachments: [...prev.attachments, ...validFiles],
//       }));

//       gsap.from(".file-item:last-child", {
//         opacity: 0,
//         x: -30,
//         duration: 0.5,
//         ease: "power4.out",
//       });
//     }
//   };

//   const removeFile = (index) => {
//     const fileElement = document.querySelector(`.file-item:nth-child(${index + 1})`);
//     gsap.to(fileElement, {
//       opacity: 0,
//       x: 30,
//       duration: 0.5,
//       ease: "power4.in",
//       onComplete: () => {
//         setFormData((prev) => ({
//           ...prev,
//           attachments: prev.attachments.filter((_, i) => i !== index),
//         }));
//       },
//     });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     let hasErrors = false;
//     const newErrors = { ...formErrors };

//     for (const [key, value] of Object.entries(formData)) {
//       if (key === "attachments" || key === "teamLeadName") continue;
//       if (key === "clientId" && formData.category === "in house") continue;
//       const validation = validateInput(value);
//       if (!validation.isValid) {
//         newErrors[key] = validation.warning;
//         hasErrors = true;
//       }
//     }

//     if (formData.startDate && formData.expectedEndDate) {
//       if (new Date(formData.startDate) > new Date(formData.expectedEndDate)) {
//         newErrors.startDate = "Start date cannot be after expected end date";
//         newErrors.expectedEndDate = "Expected end date cannot be before start date";
//         hasErrors = true;
//       }
//     }

//     if (hasErrors) {
//       setFormErrors(newErrors);
//       toast.error("Please fix the errors in the form before submitting.");
//       return;
//     }

//     try {
//       const submissionData = new FormData();
//       submissionData.append("projectName", formData.projectName);
//       submissionData.append("description", formData.description);
//       if (formData.category === "client") {
//         submissionData.append("clientId", formData.clientId);
//       }
//       submissionData.append("teamLeadId", formData.teamLeadId);
//       submissionData.append("teamLeadName", formData.teamLeadName);
//       submissionData.append("startDate", formData.startDate);
//       submissionData.append("expectedEndDate", formData.expectedEndDate);
//       submissionData.append("category", formData.category);

//       formData.attachments.forEach((file) => {
//         submissionData.append("attachments[]", file);
//       });

//       await gsap.to(formRef.current, {
//         opacity: 0,
//         y: -30,
//         duration: 0.5,
//         ease: "power4.in",
//       });

//       await dispatch(
//         updateProject({ projectId, updatedData: submissionData })
//       ).unwrap();

//       toast.success("Project updated successfully!");
//       router.back();
//     } catch (err) {
//       toast.error(`Failed to update project: ${err.message || "Unknown error"}`);
//       gsap.to(formRef.current, {
//         opacity: 1,
//         y: 0,
//         duration: 0.5,
//         ease: "power4.out",
//       });
//     }
//   };

//   const getFileIcon = (file) => {
//     const fileName = file.name || "unknown";
//     const extension = fileName.split(".").pop().toLowerCase();
//     return <FiFile className="text-gray-800" aria-hidden="true" />;
//   };

//   if (status.fetchProject === "loading") {
//     return (
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center min-h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-t-3 border-[#1447e6] mb-4"></div>
//         <p className="text-gray-600 font-medium text-sm sm:text-base">
//           Loading project details...
//         </p>
//       </div>
//     );
//   }

//   if (status.fetchProject === "failed") {
//     return (
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 flex justify-center">
//         <Card className="bg-red-50 border border-red-200 text-red-700 px-4 sm:px-6 py-5 rounded-lg max-w-md w-full">
//           <CardTitle className="font-semibold text-base sm:text-lg mb-2">
//             Unable to load project
//           </CardTitle>
//           <p className="text-red-600 text-sm sm:text-base">
//             {error.fetchProject || "An error occurred"}
//           </p>
//           <Button
//             onClick={() => dispatch(fetchProjectById(projectId))}
//             className="mt-4 bg-red-100 hover:bg-red-200 text-red-700 px-4 sm:px-5 py-2 rounded-md text-sm sm:text-base font-medium flex items-center gap-2 mx-auto transition-colors"
//             aria-label="Retry loading project"
//           >
//             <FiArrowLeft className="h-4 w-4" />
//             Retry
//           </Button>
//         </Card>
//         </div>
//       );
//   }

//   return (
//     <Card
//       ref={formRef}
//       className="min-h-screen bg-white border border-gray-200 shadow-md w-full max-w-[100vw] mx-auto"
//     >
//       <CardHeader className="px-4 sm:px-6">
//         <div className="flex items-center gap-2 sm:gap-4">
//           <Button
//             variant="outline"
//             onClick={() => router.back()}
//             className="flex items-center gap-2 border-gray-300 text-gray-800 hover:bg-gray-100 rounded-md text-xs sm:text-sm px-3 sm:px-4 py-2"
//             aria-label="Back to projects"
//           >
//             <FiArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" aria-hidden="true" />
//             <span className="hidden sm:inline">Back</span>
//           </Button>
//           <CardTitle className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">
//             Edit Project
//           </CardTitle>
//         </div>
//       </CardHeader>
//       <CardContent className="px-4 sm:px-6">
//         <form id="project-form" onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
//           <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
//             <div className="flex-1 space-y-4 sm:space-y-6">
//               <div className="space-y-2">
//                 <Label
//                   htmlFor="projectName"
//                   className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
//                     formErrors.projectName ? "text-red-500" : "text-gray-800"
//                   }`}
//                 >
//                   <FiFileText aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
//                   Project Name
//                   {formErrors.projectName && (
//                     <span className="text-[10px] sm:text-xs ml-2">({formErrors.projectName})</span>
//                   )}
//                 </Label>
//                 <Input
//                   id="projectName"
//                   name="projectName"
//                   value={formData.projectName}
//                   onChange={handleChange}
//                   required
//                   disabled={
//                     status.fetchProject === "loading" ||
//                     status.updateProject === "loading"
//                   }
//                   placeholder="Enter project name"
//                   className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm h-10 sm:h-11 w-full ${
//                     formErrors.projectName ? "border-red-300" : ""
//                   } touch-manipulation`}
//                   aria-label="Project name"
//                 />
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="flex-1 space-y-2">
//                   <Label
//                     htmlFor="category"
//                     className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
//                       formErrors.category ? "text-red-500" : "text-gray-800"
//                     }`}
//                   >
//                     <FiFolder aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
//                     Project Type
//                     {formErrors.category && (
//                       <span className="text-[10px] sm:text-xs ml-2">({formErrors.category})</span>
//                     )}
//                   </Label>
               
//                   <Select
//                     name="category"
//                     value={formData.category}
//                     onValueChange={(value) =>
//                       handleChange({ target: { name: "category", value } })
//                     }
//                     disabled={
//                       status.fetchProject === "loading" ||
//                       status.updateProject === "loading"
//                     }
//                   >
//                     <SelectTrigger
//                       className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 rounded-md text-sm h-10 sm:h-11 w-full ${
//                         formErrors.category ? "border-red-300" : ""
//                       } touch-manipulation`}
//                       aria-label="Project type"
//                     >
//                       <SelectValue placeholder="Select Project Type" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="client">Client</SelectItem>
//                       <SelectItem value="in house">In House</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="flex-1 space-y-2">
//                   {formData.category === "client" ? (
//                     <div ref={clientSelectRef}>
//                       <Label
//                         htmlFor="clientId"
//                         className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
//                           formErrors.clientId ? "text-red-500" : "text-gray-800"
//                         }`}
//                       >
//                         <FiUser aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
//                         Client
//                         {formErrors.clientId && (
//                           <span className="text-[10px] sm:text-xs ml-2">({formErrors.clientId})</span>
//                         )}
//                       </Label>
//                       <ClientSelect
//                         value={formData.clientId}
//                         isOpen={isClientSelectOpen}
//                         onToggle={() => setIsClientSelectOpen(!isClientSelectOpen)}
//                         onChange={(value) => {
//                           setFormData((prev) => ({ ...prev, clientId: value }));
//                           setIsClientSelectOpen(false);
//                           setFormErrors((prev) => ({ ...prev, clientId: "" }));
//                         }}
//                         disabled={
//                           status.fetchProject === "loading" ||
//                           status.updateProject === "loading"
//                         }
//                         className="border-gray-300 focus:ring-[#1447e6] text-gray-800 rounded-md text-sm h-10 sm:h-11 w-full touch-manipulation"
//                       />
//                     </div>
//                   ) : (
//                     <div className="h-10 sm:h-11"></div>
//                   )}
//                 </div>
//               </div>

//               <div className="space-y-2">
//                 <Label
//                   htmlFor="teamLeadId"
//                   className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
//                     formErrors.teamLeadId ? "text-red-500" : "text-gray-800"
//                   }`}
//                 >
//                   <FiUser aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
//                   Team Lead
//                   {formErrors.teamLeadId && (
//                     <span className="text-[10px] sm:text-xs ml-2">({formErrors.teamLeadId})</span>
//                   )}
//                 </Label>
//                 <TeamLeadSelect
//                   value={formData.teamLeadId}
//                   isOpen={isTeamLeadSelectOpen}
//                   onToggle={() => setIsTeamLeadSelectOpen(!isTeamLeadSelectOpen)}
//                   onChange={({ teamLeadId, teamLeadName }) => {
//                     setFormData((prev) => ({
//                       ...prev,
//                       teamLeadId,
//                       teamLeadName,
//                     }));
//                     setIsTeamLeadSelectOpen(false);
//                     setFormErrors((prev) => ({ ...prev, teamLeadId: "" }));
//                   }}
//                   disabled={
//                     status.fetchProject === "loading" ||
//                     status.updateProject === "loading"
//                   }
//                   className="border-gray-300 focus:ring-[#1447e6] text-gray-800 rounded-md text-sm h-10 sm:h-11 w-full touch-manipulation"
//                 />
//               </div>

//               <div className="flex flex-col sm:flex-row gap-4">
//                 <div className="flex-1 space-y-2">
//                   <Label
//                     htmlFor="startDate"
//                     className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
//                       formErrors.startDate ? "text-red-500" : "text-gray-800"
//                     }`}
//                   >
//                     <FiCalendar aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
//                     Start Date
//                     {formErrors.startDate && (
//                       <span className="text-[10px] sm:text-xs ml-2">({formErrors.startDate})</span>
//                     )}
//                   </Label>
//                   <Input
//                     id="startDate"
//                     type="date"
//                     name="startDate"
//                     value={formData.startDate}
//                     onChange={handleChange}
//                     required
//                     disabled={
//                       status.fetchProject === "loading" ||
//                       status.updateProject === "loading"
//                     }
//                     className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm h-10 sm:h-11 w-full ${
//                       formErrors.startDate ? "border-red-300" : ""
//                     } touch-manipulation`}
//                     aria-label="Start date"
//                   />
//                 </div>
//                 <div className="flex-1 space-y-2">
//                   <Label
//                     htmlFor="expectedEndDate"
//                     className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
//                       formErrors.expectedEndDate ? "text-red-500" : "text-gray-800"
//                     }`}
//                   >
//                     <FiCalendar aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
//                     Expected End Date
//                     {formErrors.expectedEndDate && (
//                       <span className="text-[10px] sm:text-xs ml-2">({formErrors.expectedEndDate})</span>
//                     )}
//                   </Label>
//                   <Input
//                     id="expectedEndDate"
//                     type="date"
//                     name="expectedEndDate"
//                     value={formData.expectedEndDate}
//                     onChange={handleChange}
//                     required
//                     disabled={
//                       status.fetchProject === "loading" ||
//                       status.updateProject === "loading"
//                     }
//                     className={`border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm h-10 sm:h-11 w-full ${
//                       formErrors.expectedEndDate ? "border-red-300" : ""
//                     } touch-manipulation`}
//                     aria-label="Expected end date"
//                   />
//                 </div>
//               </div>
//             </div>

//             <div className="flex-1 space-y-2 lg:max-w-md">
//               <Label className="font-semibold flex items-center gap-2 text-xs sm:text-sm text-gray-800">
//                 <FiUpload aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
//                 File Upload
//               </Label>
//               <div className="border rounded-md bg-white flex flex-col h-[300px] sm:h-[400px] lg:h-full">
//                 <div
//                   className={`p-4 border-b border-gray-200 transition-colors duration-200 flex flex-col items-center justify-center flex-grow ${
//                     dragActive ? "border-blue-300 bg-gray-50" : "bg-white"
//                   }`}
//                   onDragEnter={handleDrag}
//                   onDragLeave={handleDrag}
//                   onDragOver={handleDrag}
//                   onDrop={handleDrop}
//                   onClick={() =>
//                     status.fetchProject !== "loading" &&
//                     status.updateProject !== "loading" &&
//                     fileInputRef.current?.click()
//                   }
//                   role="button"
//                   tabIndex={0}
//                   onKeyDown={(e) => {
//                     if (e.key === "Enter" || e.key === " ") {
//                       status.fetchProject !== "loading" &&
//                         status.updateProject !== "loading" &&
//                         fileInputRef.current?.click();
//                     }
//                   }}
//                   aria-label="File upload area"
//                 >
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     multiple
//                     onChange={(e) => handleFiles(e.target.files)}
//                     className="hidden"
//                     disabled={
//                       status.fetchProject === "loading" ||
//                       status.updateProject === "loading"
//                     }
//                     accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,text/plain"
//                     aria-hidden="true"
//                   />
//                   <div className="flex flex-col items-center justify-center space-y-2 text-center">
//                     <FiUpload className="text-xl sm:text-2xl text-gray-800" aria-hidden="true" />
//                     <p className="text-[10px] sm:text-sm text-gray-600 px-2">
//                       Drag & drop files or tap to upload (PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT)
//                     </p>
//                   </div>
//                 </div>
//                 <div className="p-4 flex flex-col">
//                   <p className="text-[10px] sm:text-sm text-gray-600 mb-2">
//                     {formData.attachments.length > 0
//                       ? `${formData.attachments.length} file${
//                           formData.attachments.length > 1 ? "s" : ""
//                         } chosen`
//                       : "No files chosen"}
//                   </p>
//                   {formData.attachments.length > 0 && (
//                     <div className="max-h-40 sm:max-h-48 overflow-y-auto">
//                       <div className="grid grid-cols-1 gap-2 w-full">
//                         {formData.attachments.map((file, index) => {
//                           const fileName = file.name;
//                           const extension = fileName.split(".").pop().toLowerCase();
//                           const truncatedName = fileName.substring(
//                             0,
//                             Math.min(15, fileName.length - extension.length - 1)
//                           );
//                           const displayName = `${truncatedName}...${extension}`;

//                           return (
//                             <div
//                               key={`attachment-${index}`}
//                               className="file-item relative group flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-md text-sm sm:text-base hover:bg-gray-100 transition-all duration-200 w-full"
//                             >
//                               <div className="flex items-center gap-2 sm:gap-3 truncate">
//                                 <div className="text-lg sm:text-2xl">{getFileIcon(file)}</div>
//                                 <span
//                                   className="text-gray-600 text-xs sm:text-base truncate"
//                                   title={fileName}
//                                 >
//                                   {displayName}
//                                 </span>
//                               </div>
//                               <Button
//                                 variant="ghost"
//                                 size="sm"
//                                 onClick={() => removeFile(index)}
//                                 disabled={
//                                   status.fetchProject === "loading" ||
//                                   status.updateProject === "loading"
//                                 }
//                                 className="text-gray-800 hover:text-[#1447e6] p-1"
//                                 aria-label={`Remove ${fileName}`}
//                               >
//                                 <FiX size={16} sm={18} />
//                               </Button>
//                             </div>
//                           );
//                         })}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="space-y-2">
//             <Label
//               htmlFor="description"
//               className={`font-semibold flex items-center gap-2 text-xs sm:text-sm ${
//                 formErrors.description ? "text-red-500" : "text-gray-800"
//               }`}
//             >
//               <FiFileText aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" />
//               Description
//               {formErrors.description && (
//                 <span className="text-[10px] sm:text-xs ml-2">({formErrors.description})</span>
//               )}
//             </Label>
//             <Textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               required
//               disabled={
//                 status.fetchProject === "loading" ||
//                 status.updateProject === "loading"
//               }
//               className={`min-h-[40vh] sm:min-h-[60vh] border-gray-300 focus:ring-[#1447e6] text-gray-800 placeholder:text-gray-400 rounded-md text-sm w-full ${
//                 formErrors.description ? "border-red-300" : ""
//               } touch-manipulation`}
//               placeholder="Describe your project..."
//               aria-label="Project description"
//             />
//           </div>

//           <div className="flex justify-end mt-4 sm:mt-6">
//             <Button
//               type="submit"
//               form="project-form"
//               disabled={
//                 status.fetchProject === "loading" ||
//                 status.updateProject === "loading"
//               }
//               className="flex items-center gap-2 bg-[#1447e6] hover:bg-[#0f3cb5] text-white rounded-md px-4 sm:px-6 py-2 text-xs sm:text-sm w-full sm:w-auto"
//               aria-label="Save changes"
//             >
//               {status.fetchProject === "loading" ||
//               status.updateProject === "loading" ? (
//                 <>
//                   <svg
//                     className="animate-spin h-4 w-4 sm:h-5 sm:w-5 text-white"
//                     xmlns="http://www.w3.org/2000/svg"
//                     fill="none"
//                     viewBox="0 0 24 24"
//                   >
//                     <circle
//                       className="opacity-25"
//                       cx="12"
//                       cy="12"
//                       r="10"
//                       stroke="currentColor"
//                       strokeWidth="4"
//                     ></circle>
//                     <path
//                       className="opacity-75"
//                       fill="currentColor"
//                       d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
//                     ></path>
//                   </svg>
//                   Saving...
//                 </>
//               ) : (
//                 <>Save Changes</>
//               )}
//             </Button>
//           </div>
//         </form>
//       </CardContent>
//     </Card>
//   );
// }







"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { validateInput, sanitizeInput } from "@/utils/sanitize";
import TeamLeadSelect from "@/modules/project/TeamLeadSelect";
import ClientSelect from "@/modules/project/ClientSelect";
import {
  FiCalendar,
  FiFileText,
  FiUpload,
  FiX,
  FiEye,
  FiCheck,
  FiArrowLeft,
} from "react-icons/fi";
import {
  fetchProjectById,
  updateProject,
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

export default function ProjectEditForm({ projectId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { project, status, error } = useSelector((state) => state.project);

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
  const [initialized, setInitialized] = useState(false);

  // FETCH PROJECT
  useEffect(() => {
    if (projectId && status.fetchProject === "idle") {
      dispatch(fetchProjectById(projectId));
    }
  }, [dispatch, projectId, status.fetchProject]);

  // AUTO-FILL (robust category: handles any variation of "in house" or "client")
  useEffect(() => {
    if (project?.data && !initialized && status.fetchProject === "succeeded") {
      const p = project.data;

      let rawCategory = (p.category || p.catgotyb || "").toString().toLowerCase().trim();
      rawCategory = rawCategory.replace(/[^a-z\s-]/g, "").replace(/\s+/g, " ");
      const category = rawCategory.includes("house") ? "in house" : rawCategory.includes("client") ? "client" : "";

      setFormData({
        projectName: p.projectName ?? "",
        description: p.description ?? "",
        clientId: p.clientId ?? undefined,
        teamLeadId: p.teamLeadId ?? "",
        teamLeadName: p.teamLeadName ?? "",
        startDate: p.startDate ? p.startDate.split("T")[0] : "",
        expectedEndDate: p.expectedEndDate ? p.expectedEndDate.split("T")[0] : "",
        category: category,
        attachments: [],
      });

      setInitialized(true);
      setHasHandledSuccess(false);
    }
  }, [project, status.fetchProject, initialized]);

  // SUCCESS / ERROR (ONLY after submit → toast + redirect ONCE)
  useEffect(() => {
    if (status.updateProject === "updated" && !hasHandledSuccess) {
      setHasHandledSuccess(true);
      toast.success("Project updated successfully!");
      dispatch(fetchAllProjects());
      dispatch(resetProjectCreation());
      router.push("/project/all");
    } else if (status.updateProject === "update_failed") {
      toast.error(error?.updateProject || "Failed to update project");
      dispatch(resetProjectCreation());
      setHasHandledSuccess(false); // allow retry
    }
  }, [status.updateProject, error, hasHandledSuccess, dispatch, router]);

  // CLICK OUTSIDE
  useEffect(() => {
    const handler = (e) => {
      if (clientSelectRef.current && !clientSelectRef.current.contains(e.target)) setIsClientSelectOpen(false);
      if (teamLeadSelectRef.current && !teamLeadSelectRef.current.contains(e.target)) setIsTeamLeadSelectOpen(false);
      if (formRef.current && !formRef.current.contains(e.target)) {
        setIsStartDatePickerOpen(false);
        setIsExpectedEndDatePickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  // INPUT HANDLERS
  const handleChange = (e) => {
    const { name, value } = e.target;
    const validation = validateInput(value);
    if (!validation.isValid) {
      setFormErrors((prev) => ({ ...prev, [name]: validation.warning }));
      return;
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
    const sanitized = sanitizeInput(value);

    setFormData((prev) => {
      const updated = { ...prev, [name]: sanitized };

      if (name === "category" && sanitized === "in house") {
        updated.clientId = undefined;
        setFormErrors((err) => ({ ...err, clientId: "" }));
      }

      if (name === "startDate" && updated.expectedEndDate) {
        if (new Date(sanitized) > new Date(updated.expectedEndDate)) {
          setFormErrors((err) => ({ ...err, startDate: "Start date cannot be after end date" }));
        } else {
          setFormErrors((err) => ({ ...err, startDate: "", expectedEndDate: "" }));
        }
      }
      if (name === "expectedEndDate" && updated.startDate) {
        if (new Date(updated.startDate) > new Date(sanitized)) {
          setFormErrors((err) => ({ ...err, expectedEndDate: "End date cannot be before start date" }));
        } else {
          setFormErrors((err) => ({ ...err, expectedEndDate: "", startDate: "" }));
        }
      }

      return updated;
    });
  };

  const handleDateSelect = (name, date) => {
    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    handleChange({ target: { name, value: formatted } });
    if (name === "startDate") setIsStartDatePickerOpen(false);
    if (name === "expectedEndDate") setIsExpectedEndDatePickerOpen(false);
  };

  // FILE HANDLERS
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
    const valid = [];
    const errs = [];

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    ];
    const max = 10 * 1024 * 1024;

    newFiles.forEach((f) => {
      if (!allowed.includes(f.type)) errs.push(`${f.name}: Only PDF/Word/Excel/PPT`);
      else if (f.size > max) errs.push(`${f.name}: Max 10 MB`);
      else {
        valid.push(f);
        setUploadProgress((p) => ({ ...p, [f.name]: 0 }));
        simulateUpload(f.name);
      }
    });

    if (errs.length) {
      setFileErrors(errs);
      toast.error("Some files rejected");
    }
    if (valid.length) {
      setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...valid] }));
      toast.success(`${valid.length} file(s) added`);
    }
  };

  const simulateUpload = (name) => {
    let prog = 0;
    const iv = setInterval(() => {
      prog += 20;
      setUploadProgress((p) => ({ ...p, [name]: prog }));
      if (prog >= 100) {
        clearInterval(iv);
        setTimeout(() => setUploadProgress((p) => {
          const { [name]: _, ...rest } = p;
          return rest;
        }), 800);
      }
    }, 200);
  };

  const removeFile = (idx) => {
    const file = formData.attachments[idx];
    setFormData((prev) => ({ ...prev, attachments: prev.attachments.filter((_, i) => i !== idx) }));
    setUploadProgress((p) => {
      const { [file.name]: _, ...rest } = p;
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

  // SUBMIT (separate handler → clean dispatch, no side effects)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset errors
    const newErrors = {
      projectName: "",
      description: "",
      clientId: "",
      teamLeadId: "",
      startDate: "",
      expectedEndDate: "",
      category: "",
    };
    let hasError = false;

    // Required fields
    const required = ["projectName", "description", "teamLeadId", "startDate", "expectedEndDate", "category"];
    required.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = "Required";
        hasError = true;
      }
    });

    if (formData.category === "client" && !formData.clientId) {
      newErrors.clientId = "Client required";
      hasError = true;
    }

    if (hasError) {
      setFormErrors(newErrors);
      toast.error("Please fill all required fields");
      return;
    }

    // Build FormData
    const fd = new FormData();
    fd.append("projectName", formData.projectName);
    fd.append("description", formData.description);
    if (formData.category === "client") fd.append("clientId", formData.clientId);
    fd.append("teamLeadId", formData.teamLeadId);
    fd.append("teamLeadName", formData.teamLeadName);
    fd.append("startDate", formData.startDate);
    fd.append("expectedEndDate", formData.expectedEndDate);
    fd.append("category", formData.category);
    formData.attachments.forEach((file) => fd.append("attachments", file));

    // Reset success flag & dispatch
    setHasHandledSuccess(false);
    try {
      await dispatch(updateProject({ projectId, updatedData: fd })).unwrap();
      // Success → handled in useEffect
    } catch (err) {
      // Error → handled in useEffect
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
    const filled = required.every((k) => !!formData[k]);
    const clientOk = formData.category !== "client" || !!formData.clientId;
    return filled && clientOk && status.updateProject !== "updating";
  };

  // CALENDAR PICKER
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
              if (month === 0) {
                setMonth(11);
                setYear(year - 1);
              } else setMonth(month - 1);
            }}
          >‹</Button>
          <span className="font-medium text-sm">
            {new Date(year, month).toLocaleString("default", { month: "long", year: "numeric" })}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              if (month === 11) {
                setMonth(0);
                setYear(year + 1);
              } else setMonth(month + 1);
            }}
          >›</Button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs">
          {weekdays.map((d) => (
            <div key={d} className="font-semibold text-gray-500 py-2">{d}</div>
          ))}
          {Array.from({ length: firstDay }).map((_, i) => <div key={`empty-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const date = new Date(year, month, day);
            const isSel = selected && selected.toDateString() === date.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <Button
                key={day}
                variant={isSel ? "default" : "ghost"}
                className={`h-8 w-8 text-xs ${isSel ? "bg-blue-600 hover:bg-blue-700" : ""} ${isToday ? "ring-2 ring-blue-400" : ""}`}
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

  // RENDER
  if (status.fetchProject === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-t-3 border-blue-600 mb-4" />
          <p className="text-gray-600 font-medium">Loading project…</p>
        </div>
      </div>
    );
  }

  if (status.fetchProject === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full text-center">
          <h3 className="text-lg font-semibold text-red-700 mb-2">Unable to load project</h3>
          <p className="text-red-600 text-sm mb-4">{error?.fetchProject || "Unknown error"}</p>
          <Button onClick={() => dispatch(fetchProjectById(projectId))} variant="outline">
            <FiArrowLeft className="mr-2" /> Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div ref={formRef} className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center sm:text-left">
            <div className="flex items-center gap-4 mb-4">
              <Button variant="outline" onClick={() => router.push("/project/all")} className="flex items-center gap-2">
                <FiArrowLeft className="h-5 w-5" />
                <span className="hidden sm:inline">Back</span>
              </Button>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">Edit Project</h1>
            <p className="mt-2 text-lg text-gray-600">Update details and documents</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                {/* Project Name */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-1">
                    Project Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    name="projectName"
                    value={formData.projectName}
                    onChange={handleChange}
                    readOnly
                    placeholder="e.g., Enterprise CRM System"
                    // className={`h-12 ${formErrors.projectName ? "border-red-500 focus:ring-red-500" : ""}`}
                    disabled={status.updateProject === "updating"}
                  />
                  {formErrors.projectName && <p className="text-red-500 text-sm">{formErrors.projectName}</p>}
                </div>

                {/* Category & Client */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-base font-semibold flex items-center gap-1">
                      Project Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(v) => {
                        setFormData((prev) => ({ ...prev, category: v }));
                        if (v === "in house") {
                          setFormData((prev) => ({ ...prev, clientId: undefined }));
                          setFormErrors((prev) => ({ ...prev, clientId: "" }));
                        }
                      }}
                      disabled={status.updateProject === "updating"}
                    >
                      <SelectTrigger className="h-12">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-500" />
                            Client Project
                          </span>
                        </SelectItem>
                        <SelectItem value="in house">
                          <span className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-purple-500" />
                            In-House
                          </span>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.category && <p className="text-red-500 text-sm">{formErrors.category}</p>}
                  </div>

                  {formData.category === "client" && (
                    <div ref={clientSelectRef} className="space-y-2">
                      <Label className="text-base font-semibold flex items-center gap-1">
                        Client <span className="text-red-500">*</span>
                      </Label>
                      <ClientSelect
                        value={formData.clientId}
                        isOpen={isClientSelectOpen}
                        onToggle={() => setIsClientSelectOpen(!isClientSelectOpen)}
                        onChange={(v) => {
                          setFormData((p) => ({ ...p, clientId: v }));
                          setFormErrors((e) => ({ ...e, clientId: "" }));
                        }}
                        className="h-12"
                        disabled={status.updateProject === "updating"}
                      />
                      {formErrors.clientId && <p className="text-red-500 text-sm">{formErrors.clientId}</p>}
                    </div>
                  )}
                </div>

                {/* Team Lead */}
                <div className="space-y-2">
                  <Label className="text-base font-semibold flex items-center gap-1">
                    Team Lead <span className="text-red-500">*</span>
                  </Label>
                  <div ref={teamLeadSelectRef}>
                    <TeamLeadSelect
                      value={formData.teamLeadId}
                      isOpen={isTeamLeadSelectOpen}
                      onToggle={() => setIsTeamLeadSelectOpen(!isTeamLeadSelectOpen)}
                      onChange={({ teamLeadId, teamLeadName }) => {
                        setFormData((p) => ({ ...p, teamLeadId, teamLeadName }));
                        setFormErrors((e) => ({ ...e, teamLeadId: "" }));
                      }}
                      className="h-12"
                      disabled={status.updateProject === "updating"}
                    />
                  </div>
                  {formErrors.teamLeadId && <p className="text-red-500 text-sm">{formErrors.teamLeadId}</p>}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2 relative">
                    <Label className="text-base font-semibold flex items-center gap-1">
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
                        disabled={status.updateProject === "updating"}
                      />
                      <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      {isStartDatePickerOpen && <CalendarPicker value={formData.startDate} onSelect={handleDateSelect} name="startDate" />}
                    </div>
                    {formErrors.startDate && <p className="text-red-500 text-sm">{formErrors.startDate}</p>}
                  </div>

                  <div className="space-y-2 relative">
                    <Label className="text-base font-semibold flex items-center gap-1">
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
                        disabled={!formData.startDate || status.updateProject === "updating"}
                      />
                      <FiCalendar className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                      {isExpectedEndDatePickerOpen && <CalendarPicker value={formData.expectedEndDate} onSelect={handleDateSelect} name="expectedEndDate" />}
                    </div>
                    {formErrors.expectedEndDate && <p className="text-red-500 text-sm">{formErrors.expectedEndDate}</p>}
                  </div>
                </div>
              </div>

              {/* UPLOAD */}
              <div className="space-y-6">
                <Label className="text-base font-semibold">Project Documents (PDF, Word, Excel, PPT)</Label>
                <div
                  className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-all cursor-pointer ${dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 bg-gray-50"}`}
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
                    disabled={status.updateProject === "updating"}
                  />
                  <FiUpload className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400" />
                  <p className="mt-3 text-sm sm:text-base text-gray-600">Drag & drop or click to select</p>
                  <p className="text-xs text-gray-500 mt-1">Max 10 MB • PDF, DOC/DOCX, XLS/XLSX, PPT/PPTX</p>
                </div>

                {fileErrors.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    {fileErrors.map((e, i) => <p key={i} className="text-red-700 text-sm">{e}</p>)}
                  </div>
                )}

                {formData.attachments.length > 0 && (
                  <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">{formData.attachments.length} document(s) ready</p>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {formData.attachments.map((f, i) => (
                        <div key={i} className="bg-white border rounded-lg p-4 flex items-center justify-between group hover:shadow-md transition-shadow">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {getFileIcon(f.type)}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{f.name}</p>
                              <p className="text-xs text-gray-500">{(f.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {uploadProgress[f.name] !== undefined ? (
                              <div className="w-24">
                                <Progress value={uploadProgress[f.name]} className="h-2" />
                                <p className="text-xs text-center mt-1">{uploadProgress[f.name]}%</p>
                              </div>
                            ) : (
                              <>
                                <Button type="button" variant="ghost" size="icon" onClick={() => viewFile(f)} className="opacity-0 group-hover:opacity-100">
                                  <FiEye className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFile(i)}>
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

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-base font-semibold flex items-center gap-1">
                Project Description <span className="text-red-500">*</span>
              </Label>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Scope, objectives, deliverables..."
                className={`min-h-48 ${formErrors.description ? "border-red-500 focus:ring-red-500" : ""}`}
                disabled={status.updateProject === "updating"}
              />
              {formErrors.description && <p className="text-red-500 text-sm">{formErrors.description}</p>}
            </div>

            {/* Submit */}
            <div className="flex justify-center sm:justify-end pt-8">
              <Button
                type="submit"
                size="lg"
                disabled={!isFormValid()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-10 py-6 text-lg rounded-xl shadow-xl disabled:opacity-50 flex items-center gap-3 min-w-64"
              >
                {status.updateProject === "updating" ? (
                  <>
                    <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z" />
                    </svg>
                    Updating…
                  </>
                ) : (
                  <>
                    <FiCheck className="h-6 w-6" />
                    Update Project
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* PREVIEW MODAL */}
      {previewFile && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={closePreview}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-full overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gray-50">
              <h3 className="text-lg sm:text-xl font-semibold truncate pr-4">{previewFile.name}</h3>
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
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}