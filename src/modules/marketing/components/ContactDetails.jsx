

// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   getContactById,
//   updateContactStatus,
//   clearSelectedContact,
// } from '@/modules/marketing/slices/contactSlice';
// import { Progress } from '@/components/ui/progress';
// import { fetchMeetingsByContact } from '@/modules/meet/slices/meetSlice';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Loader2,
//   AlertCircle,
//   User,
//   Mail,
//   Phone,
//   Building,
//   Briefcase,
//   MapPin,
//   MessageSquare,
//   Tag,
//   CheckCircle,
//   XCircle,
//   ArrowLeft,
//   Circle,
// } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';
// import ScheduleMeeting from '@/modules/meet/components/scheduleMeeting';
// import { formatDateTimeUTC } from '@/utils/formatDate';

// // Initial Phase Component
// function InitialPhase({ nextOptions, currentStatus, openFeedbackDialog, getButtonStyles, isActive, isAccessible }) {
//   const suggestion = "Take action by selecting 'Conversion Made' to proceed to follow-up or 'Ignore' to close the contact.";
//   return (
//     <div
//       className={cn(
//         'bg-white rounded-2xl shadow-sm p-4 border',
//         isActive ? 'border-blue-300' : 'border-gray-200',
//         !isAccessible && 'opacity-50'
//       )}
//     >
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">Initial Phase</h3>
//       <p className="text-sm text-gray-600 italic mb-4">{suggestion}</p>
//       {nextOptions.length > 0 && currentStatus !== 'Closed' && isAccessible ? (
//         <div className="flex flex-wrap gap-3">
//           {nextOptions.map((option) => (
//             <Button
//               key={option}
//               className={cn(
//                 'text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200',
//                 'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
//                 option === 'Conversion Made' ? 'bg-blue-600 text-white hover:bg-blue-700' : getButtonStyles(option)
//               )}
//               onClick={() => openFeedbackDialog(option)}
//               disabled={!isAccessible}
//             >
//               {option}
//             </Button>
//           ))}
//         </div>
//       ) : (
//         <p className="text-sm text-gray-500">No actions available.</p>
//       )}
//     </div>
//   );
// }

// // Follow-up Phase Component
// function FollowUpPhase({ nextOptions, currentStatus, openFeedbackDialog, getButtonStyles, isActive, isAccessible }) {
//   const suggestion = "Continue with 'Follow-up Taken' for further engagement, select 'Converted to Lead' to schedule a meeting, or 'Ignore' to close.";
//   return (
//     <div
//       className={cn(
//         'bg-white rounded-2xl shadow-sm p-4 border',
//         isActive ? 'border-blue-300' : 'border-gray-200',
//         !isAccessible && 'opacity-50'
//       )}
//     >
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">Follow-up Phase</h3>
//       <p className="text-sm text-gray-600 italic mb-4">{suggestion}</p>
//       {nextOptions.length > 0 && currentStatus !== 'Closed' && isAccessible ? (
//         <div className="flex flex-wrap gap-3 mb-6">
//           {nextOptions.map((option) => (
//             <Button
//               key={option}
//               className={cn(
//                 'text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200',
//                 'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
//                 option === 'Converted to Lead' ? 'bg-blue-600 text-white hover:bg-blue-700' : getButtonStyles(option)
//               )}
//               onClick={() => openFeedbackDialog(option)}
//               disabled={!isAccessible}
//             >
//               {option}
//             </Button>
//           ))}
//         </div>
//       ) : (
//         <p className="text-sm text-gray-500">No actions available.</p>
//       )}
//     </div>
//   );
// }

// // Meeting Phase Component
// function MeetingPhase({ meetings, totalMeetings, progressValue, isFreeTierFull, isContactClosed, setOpenMeetDialog, router, nextOptions, openFeedbackDialog, getButtonStyles, isActive, isAccessible }) {
//   const suggestion = "Schedule a meeting to discuss further or close the contact if no meeting is needed.";
//   return (
//     <div
//       className={cn(
//         'bg-white rounded-2xl shadow-sm p-4 border',
//         isActive ? 'border-blue-300' : 'border-gray-200',
//         !isAccessible && 'opacity-50'
//       )}
//     >
//       <h3 className="text-lg font-semibold text-gray-800 mb-2">Meeting Phase</h3>
//       <p className="text-sm text-gray-600 italic mb-4">{suggestion}</p>
//       <div className="flex flex-wrap gap-3 mb-6">
//         {nextOptions.length > 0 && !isContactClosed && isAccessible ? (
//           nextOptions.map((option) => (
//             <Button
//               key={option}
//               className={cn(
//                 'text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200',
//                 'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
//                 getButtonStyles(option)
//               )}
//               onClick={() => openFeedbackDialog(option)}
//               disabled={!isAccessible}
//             >
//               {option}
//             </Button>
//           ))
//         ) : null}
//         <Button
//           onClick={() => setOpenMeetDialog(true)}
//           className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
//           disabled={isFreeTierFull || isContactClosed || !isAccessible}
//         >
//           {isContactClosed
//             ? 'Contact Closed'
//             : isFreeTierFull
//             ? 'Meeting Limit Reached'
//             : 'Schedule Meeting'}
//         </Button>
//       </div>
//       <h4 className="text-md font-semibold text-gray-700 mb-3">Meeting References</h4>
//       <div className="mb-4">
//         <div className="flex items-center justify-between mb-1">
//           <span className="text-sm text-gray-700 font-medium">
//             Meeting Tracker ({Math.min(totalMeetings, 3)} / 3)
//           </span>
//           {isFreeTierFull && (
//             <span className="text-xs text-red-600 font-semibold">
//               Free tier limit reached
//             </span>
//           )}
//         </div>
//         <Progress value={progressValue} className="h-2 rounded-full" />
//       </div>
//       {meetings && meetings.length > 0 ? (
//         <div className="flex flex-wrap gap-2">
//           {meetings.slice(0, 3).map((meeting) => (
//             <span
//               key={meeting._id}
//               title="Click to view meeting details!"
//               onClick={() => isAccessible && router.push(`/meet/${meeting.meetingId}`)}
//               className={cn(
//                 'cursor-pointer bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition',
//                 !isAccessible && 'cursor-not-allowed'
//               )}
//             >
//               {meeting.title} – {meeting.mode}
//             </span>
//           ))}
//         </div>
//       ) : (
//         <p className="text-sm text-gray-500">No meeting references found.</p>
//       )}
//     </div>
//   );
// }

// // Conversation History Component
// function ConversationHistory({ conversations }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation History</h3>
//       {conversations?.length > 0 ? (
//         <div className="space-y-4 overflow-y-auto max-h-72 pr-2">
//           {conversations.map((action, index) => {
//             let historyColor = 'bg-yellow-100 text-yellow-800';
//             let HistoryIcon = AlertCircle;
//             if (action.status === 'Converted to Lead') {
//               historyColor = 'bg-green-100 text-green-800';
//               HistoryIcon = CheckCircle;
//             } else if (action.status === 'Closed') {
//               historyColor = 'bg-red-100 text-red-800';
//               HistoryIcon = XCircle;
//             } else if (action.status === 'In Progress') {
//               historyColor = 'bg-blue-100 text-blue-800';
//               HistoryIcon = AlertCircle;
//             } else if (action.status === 'Follow-up Taken') {
//               historyColor = 'bg-purple-100 text-purple-800';
//               HistoryIcon = AlertCircle;
//             } else if (action.status === 'Conversion Made') {
//               historyColor = 'bg-blue-100 text-blue-800';
//               HistoryIcon = AlertCircle;
//             }
//             return (
//               <div key={index} className="border-l-2 border-gray-200 pl-4">
//                 <div className="flex items-center mb-1">
//                   <HistoryIcon className="h-4 w-4 mr-2 text-gray-500" />
//                   <span
//                     className={cn(
//                       'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
//                       historyColor
//                     )}
//                   >
//                     {action.status}
//                   </span>
//                 </div>
//                 {action.feedback && (
//                   <p className="text-sm text-gray-600">{action.feedback}</p>
//                 )}
//                 {action.timestamp && (
//                   <p className="text-xs text-gray-400">{formatDateTimeUTC(action.timestamp)}</p>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       ) : (
//         <p className="text-sm text-gray-500">No action history available.</p>
//       )}
//     </div>
//   );
// }

// export default function ContactDetails({ contactId }) {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { selectedContact, status, error } = useSelector((state) => state.contact);
//   const { meetings } = useSelector((state) => state.meet);
//   const [feedback, setFeedback] = useState('');
//   const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [openMeetDialog, setOpenMeetDialog] = useState(false);

//   useEffect(() => {
//     if (contactId) {
//       dispatch(getContactById(contactId));
//       dispatch(fetchMeetingsByContact(contactId));
//     }
//     return () => {
//       dispatch(clearSelectedContact());
//     };
//   }, [contactId, dispatch]);

//   const FREE_TIER_LIMIT = 3;
//   const totalMeetings = meetings?.length || 0;
//   const progressValue = Math.min((totalMeetings / FREE_TIER_LIMIT) * 100, 100);
//   const isFreeTierFull = totalMeetings >= FREE_TIER_LIMIT;
//   const isContactClosed = selectedContact?.status === 'Closed';

//   // Determine current step and completed steps
//   const currentStatus = selectedContact?.status || 'Contact Received';
//   let currentStep = 'initial';
//   let completedSteps = [];

//   if (['Conversion Made', 'Follow-up Taken'].includes(currentStatus)) {
//     currentStep = 'followup';
//     completedSteps = ['initial'];
//   } else if (['Converted to Lead', 'Closed'].includes(currentStatus)) {
//     currentStep = 'meeting';
//     completedSteps = ['initial', 'followup'];
//   }

//   const handleStatusUpdate = () => {
//     if (contactId && selectedStatus) {
//       if (feedback.length > 500) {
//         toast.error('Feedback cannot exceed 500 characters.');
//         return;
//       }
//       dispatch(
//         updateContactStatus({
//           contactId,
//           status: selectedStatus,
//           feedback,
//         })
//       ).then((result) => {
//         if (result.meta.requestStatus === 'fulfilled') {
//           toast.success('Status updated successfully.');
//           dispatch(getContactById(contactId));
//           setIsFeedbackDialogOpen(false);
//           setFeedback('');
//           setSelectedStatus('');
//         } else {
//           toast.error('Failed to update status.');
//         }
//       });
//     }
//   };

//   const openFeedbackDialog = (status) => {
//     setSelectedStatus(status);
//     setIsFeedbackDialogOpen(true);
//   };

//   // Define nextOptions for each phase
//   const initialOptions = currentStatus === 'Contact Received' ? ['Conversion Made', 'Ignore'] : [];
//   const followUpOptions = ['Conversion Made', 'Follow-up Taken'].includes(currentStatus)
//     ? ['Follow-up Taken', 'Converted to Lead', 'Ignore']
//     : [];
//   const meetingOptions = currentStatus === 'Converted to Lead' ? ['Close'] : [];

//   // Status colors for chips
//   let statusColor = 'bg-yellow-100 text-yellow-800';
//   let StatusIcon = AlertCircle;
//   if (currentStatus === 'Converted to Lead') {
//     statusColor = 'bg-green-100 text-green-800';
//     StatusIcon = CheckCircle;
//   } else if (currentStatus === 'Closed') {
//     statusColor = 'bg-red-100 text-red-800';
//     StatusIcon = XCircle;
//   }

//   // Action button colors
//   const getButtonStyles = (option) => {
//     switch (option) {
//       case 'Conversion Made':
//         return 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 hover:border-blue-400';
//       case 'Follow-up Taken':
//         return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200 hover:border-purple-400';
//       case 'Converted to Lead':
//         return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:border-green-400';
//       case 'Close':
//       case 'Ignore':
//         return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:border-red-400';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400';
//     }
//   };

//   // Determine accessible sections
//   const isInitialAccessible = true;
//   const isFollowUpAccessible = ['Conversion Made', 'Follow-up Taken', 'Converted to Lead', 'Closed'].includes(currentStatus);
//   const isMeetingAccessible = ['Converted to Lead', 'Closed'].includes(currentStatus);

//   // Stepper configuration
//   const steps = [
//     { id: 'initial', label: 'Initial', accessible: isInitialAccessible },
//     { id: 'followup', label: 'Follow-up', accessible: isFollowUpAccessible },
//     { id: 'meeting', label: 'Meeting', accessible: isMeetingAccessible },
//   ];

//   return (
//     <div className="">
//       <Card className="overflow-hidden shadow-lg border-0 bg-white">
//         <CardContent className="p-6 sm:p-8 min-h-screen">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//             <Button
//               onClick={() => router.back()}
//               className="inline-flex items-center gap-2 bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//             >
//               <ArrowLeft className="h-4 w-4" />
//               Back
//             </Button>
//             {selectedContact && (
//               <span
//                 className={cn(
//                   'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
//                   statusColor
//                 )}
//               >
//                 <StatusIcon className="h-4 w-4 mr-1" />
//                 {currentStatus || 'N/A'}
//               </span>
//             )}
//           </div>

//           {/* Loading State */}
//           {status === 'loading' && !selectedContact ? (
//             <div className="flex flex-col items-center justify-center py-12 min-h-screen">
//               <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//               <span className="mt-2 text-gray-600">Loading contact details...</span>
//             </div>
//           ) : error && !selectedContact ? (
//             <Alert variant="destructive" className="mb-6">
//               <AlertCircle className="h-5 w-5" />
//               <AlertTitle>Error</AlertTitle>
//               <AlertDescription>{error}</AlertDescription>
//             </Alert>
//           ) : selectedContact ? (
//             <div className="space-y-8">
//               {/* Contact Info */}
//               <div>
//                 <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Contact Information</h2>
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//                   <Detail icon={Tag} label="Contact ID" value={selectedContact.contactId} color="text-blue-600" />
//                   <Detail icon={User} label="Contact Person Name" value={selectedContact.fullName} color="text-blue-600" />
//                   <Detail icon={Mail} label="Email Address" value={selectedContact.email} color="text-green-600" />
//                   <Detail icon={Phone} label="Phone Number" value={selectedContact.phone} color="text-green-600" />
//                   <Detail icon={Building} label="Company Name" value={selectedContact.companyName} color="text-purple-600" />
//                   <Detail icon={Briefcase} label="Role in Organization" value={selectedContact.designation} color="text-purple-600" />
//                   <Detail icon={Building} label="Brand Category" value={selectedContact.brandCategory} color="text-indigo-600" />
//                   <Detail icon={MapPin} label="Location" value={selectedContact.location} color="text-indigo-600" />
//                   {selectedContact.serviceInterest?.length > 0 && (
//                     <Detail
//                       icon={Tag}
//                       label="Services of Interest"
//                       value={selectedContact.serviceInterest.join(', ')}
//                       color="text-red-600"
//                     />
//                   )}
//                   <Detail
//                     icon={MessageSquare}
//                     label="Referral Source"
//                     value={selectedContact.referralSource}
//                     color="text-red-600"
//                   />
//                   <div className="sm:col-span-2">
//                     <Detail icon={MessageSquare} label="Message" value={selectedContact.message} color="text-gray-600" />
//                   </div>
//                   <div className="sm:col-span-2">
//                     <Detail icon={MessageSquare} label="Latest Feedback" value={selectedContact.feedback} color="text-gray-600" />
//                   </div>
//                 </div>
//               </div>

//               {/* Stepper */}
//               <div className="mb-6">
//                 <div className="grid grid-cols-1 md:flex md:items-center md:space-x-4">
//                   {steps.map((step, index) => {
//                     const isCompleted = completedSteps.includes(step.id);
//                     const isCurrent = step.id === currentStep;
//                     const isAccessible = step.accessible;
//                     return (
//                       <div
//                         орт key={step.id}
//                         className={cn(
//                           'flex items-center p-3 rounded-lg',
//                           isCompleted ? 'bg-green-100 text-green-800' : isCurrent ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-500',
//                           !isAccessible && 'opacity-50'
//                         )}
//                       >
//                         {isCompleted ? (
//                           <CheckCircle className="h-5 w-5 mr-2" />
//                         ) : isCurrent ? (
//                           <AlertCircle className="h-5 w-5 mr-2" />
//                         ) : (
//                           <Circle className="h-5 w-5 mr-2" />
//                         )}
//                         <span className="font-medium">{step.label}</span>
//                         {index < steps.length - 1 && (
//                           <span className="hidden md:block mx-2 text-gray-400">→</span>
//                         )}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Phases Section */}
//               <div className="space-y-6">
//                 <InitialPhase
//                   nextOptions={initialOptions}
//                   currentStatus={currentStatus}
//                   openFeedbackDialog={openFeedbackDialog}
//                   getButtonStyles={getButtonStyles}
//                   isActive={currentStep === 'initial'}
//                   isAccessible={isInitialAccessible}
//                 />
//                 <FollowUpPhase
//                   nextOptions={followUpOptions}
//                   currentStatus={currentStatus}
//                   openFeedbackDialog={openFeedbackDialog}
//                   getButtonStyles={getButtonStyles}
//                   isActive={currentStep === 'followup'}
//                   isAccessible={isFollowUpAccessible}
//                 />
//                 <MeetingPhase
//                   meetings={meetings}
//                   totalMeetings={totalMeetings}
//                   progressValue={progressValue}
//                   isFreeTierFull={isFreeTierFull}
//                   isContactClosed={isContactClosed}
//                   setOpenMeetDialog={setOpenMeetDialog}
//                   router={router}
//                   nextOptions={meetingOptions}
//                   openFeedbackDialog={openFeedbackDialog}
//                   getButtonStyles={getButtonStyles}
//                   isActive={currentStep === 'meeting'}
//                   isAccessible={isMeetingAccessible}
//                 />
//               </div>

//               {/* Conversation History */}
//               <ConversationHistory conversations={selectedContact?.conversations} />
//             </div>
//           ) : (
//             <div className="text-lg text-gray-600 text-center py-6 min-h-screen">No contact found.</div>
//           )}
//         </CardContent>
//       </Card>

//       {/* Feedback Dialog */}
//       <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
//         <DialogContent className="sm:max-w-lg">
//           <DialogHeader>
//             <DialogTitle className="text-xl text-gray-800">Update Status: {selectedStatus}</DialogTitle>
//           </DialogHeader>
//           <div className="space-y-4">
//             <div>
//               <Label className="font-medium text-gray-700">Feedback (max 500 characters)</Label>
//               <textarea
//                 placeholder="Share your thoughts..."
//                 value={feedback}
//                 onChange={(e) => setFeedback(e.target.value)}
//                 className="mt-1 w-full h-32 border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
//                 maxLength={500}
//               />
//               <p className="text-xs text-gray-500 mt-1">{feedback.length}/500 characters</p>
//             </div>
//           </div>
//           <DialogFooter>
//             <Button
//               variant="outline"
//               onClick={() => setIsFeedbackDialogOpen(false)}
//               className="text-gray-700 border-gray-300 hover:bg-gray-100"
//             >
//               Cancel
//             </Button>
//             <Button
//               onClick={handleStatusUpdate}
//               className="bg-blue-600 hover:bg-blue-700 text-white"
//               disabled={!selectedStatus}
//             >
//               Submit
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Meeting Schedule Dialog */}
//       <Dialog open={openMeetDialog} onOpenChange={setOpenMeetDialog}>
//         <DialogContent className="max-h-[85dvh] min-w-[50vw] mt-4">
//           <DialogHeader>
//             <DialogTitle>Schedule a Meeting</DialogTitle>
//           </DialogHeader>
//           <ScheduleMeeting contactId={contactId} meetingRefs={contactId} onClose={() => setOpenMeetDialog(false)} />
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }

// function Detail({ icon: Icon, label, value, color }) {
//   if (!value) return null;
//   return (
//     <div className="flex items-start gap-3">
//       <Icon className={cn('h-5 w-5 mt-0.5', color)} />
//       <div>
//         <p className="text-sm font-medium text-gray-500">{label}</p>
//         <p className="text-sm text-gray-800">{value}</p>
//       </div>
//     </div>
//   );
// }











// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   getContactById,
//   updateContactStatus,
//   clearSelectedContact,
// } from '@/modules/marketing/slices/contactSlice';
// import { Progress } from '@/components/ui/progress';
// import { fetchMeetingsByContact } from '@/modules/meet/slices/meetSlice';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent } from '@/components/ui/card';
// import {
//   Loader2,
//   AlertCircle,
//   User,
//   Mail,
//   Phone,
//   Building,
//   Briefcase,
//   MapPin,
//   MessageSquare,
//   Tag,
//   CheckCircle,
//   XCircle,
//   ArrowLeft,
//   Circle,
//   Info,
//   Lightbulb,
//   Target,
//   Calendar,
//   UserCheck,
//   Ban,
// } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from '@/components/ui/dialog';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';
// import ScheduleMeeting from '@/modules/meet/components/scheduleMeeting';
// import { formatDateTimeUTC } from '@/utils/formatDate';

// function Detail({ icon: Icon, label, value, color }) {
//   if (!value) return null;
//   return (
//     <div className="flex items-start gap-3">
//       <Icon className={cn('h-5 w-5 mt-0.5', color)} />
//       <div>
//         <p className="text-sm font-medium text-gray-500">{label}</p>
//         <p className="text-sm text-gray-800">{value}</p>
//       </div>
//     </div>
//   );
// }

// // Next Step Guidance Dialog
// function NextStepDialog({ isOpen, onClose, phase, currentStatus }) {
//   const guides = {
//     initial: {
//       title: "Initial Contact Phase",
//       icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
//       color: "yellow",
//       steps: [
//         { action: "Conversion Made", desc: "Mark if you’ve replied and shown interest.", icon: <Target className="w-5 h-5" /> },
//         { action: "Ignore", desc: "Close if not relevant or no response needed.", icon: <Ban className="w-5 h-5" /> },
//       ],
//     },
//     followup: {
//       title: "Follow-up Phase",
//       icon: <MessageSquare className="w-8 h-8 text-purple-600" />,
//       color: "purple",
//       steps: [
//         { action: "Follow-up Taken", desc: "You've sent a follow-up message.", icon: <MessageSquare className="w-5 h-5" /> },
//         { action: "Converted to Lead", desc: "Ready for meeting → Schedule now!", icon: <Calendar className="w-5 h-5" /> },
//         { action: "Ignore", desc: "No interest → Close contact.", icon: <Ban className="w-5 h-5" /> },
//       ],
//     },
//     meeting: {
//       title: "Meeting Phase",
//       icon: <UserCheck className="w-8 h-8 text-green-600" />,
//       color: "green",
//       steps: [
//         { action: "Schedule Meeting", desc: "Click 'Schedule Meeting' to book a call.", icon: <Calendar className="w-5 h-5" /> },
//         { action: "Close", desc: "No meeting needed → Close contact.", icon: <XCircle className="w-5 h-5" /> },
//       ],
//     },
//   };

//   const guide = guides[phase];

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <div className="flex items-center gap-3">
//             {guide.icon}
//             <DialogTitle className="text-xl">{guide.title}</DialogTitle>
//           </div>
//           <DialogDescription className="text-base mt-2">
//             Here’s what you should do next based on the current status:
//           </DialogDescription>
//         </DialogHeader>
//         <div className="space-y-4 py-4">
//           {guide.steps.map((step, i) => (
//             <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
//               <div className={cn("p-2 rounded-full", 
//                 guide.color === "yellow" ? "bg-yellow-200" :
//                 guide.color === "purple" ? "bg-purple-200" : "bg-green-200"
//               )}>
//                 {step.icon}
//               </div>
//               <div>
//                 <p className="font-semibold text-gray-800">{step.action}</p>
//                 <p className="text-sm text-gray-600">{step.desc}</p>
//               </div>
//             </div>
//           ))}
//         </div>
//         <DialogFooter>
//           <Button onClick={onClose} className="w-full">Got it!</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }

// // Phase Card with Info Button
// function PhaseCard({ title, children, isActive, isAccessible, onInfoClick, icon: Icon }) {
//   return (
//     <div className={cn(
//       "relative bg-white rounded-2xl shadow-md border-2 transition-all duration-300 cursor-pointer",
//       isActive ? "border-blue-500 shadow-xl scale-105" : "border-gray-200",
//       !isAccessible && "opacity-60 grayscale"
//     )}
//     onClick={isAccessible ? onInfoClick : undefined}>
//       <div className="p-5">
//         <div className="flex items-center justify-between mb-3">
//           <div className="flex items-center gap-3">
//             {Icon && <Icon className={cn("w-6 h-6", isActive ? "text-blue-600" : "text-gray-500")} />}
//             <h3 className="text-lg font-bold text-gray-800">{title}</h3>
//           </div>
//           {isAccessible && (
//             <Button
//               size="icon"
//               variant="ghost"
//               className="h-8 w-8 rounded-full hover:bg-blue-100"
//               onClick={(e) => { e.stopPropagation(); onInfoClick(); }}
//             >
//               <Info className="h-4 w-4" />
//             </Button>
//           )}
//         </div>
//         <div className={cn(!isAccessible && "pointer-events-none")}>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function ContactDetails({ contactId }) {
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { selectedContact, status, error } = useSelector((state) => state.contact);
//   const { meetings } = useSelector((state) => state.meet);

//   const [feedback, setFeedback] = useState('');
//   const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [openMeetDialog, setOpenMeetDialog] = useState(false);
//   const [guideDialog, setGuideDialog] = useState({ open: false, phase: '' });

//   useEffect(() => {
//     if (contactId) {
//       dispatch(getContactById(contactId));
//       dispatch(fetchMeetingsByContact(contactId));
//     }
//     return () => dispatch(clearSelectedContact());
//   }, [contactId, dispatch]);

//   const FREE_TIER_LIMIT = 3;
//   const totalMeetings = meetings?.length || 0;
//   const progressValue = Math.min((totalMeetings / FREE_TIER_LIMIT) * 100, 100);
//   const isFreeTierFull = totalMeetings >= FREE_TIER_LIMIT;
//   const isContactClosed = selectedContact?.status === 'Closed';
//   const currentStatus = selectedContact?.status || 'Contact Received';

//   // Step logic
//   let currentStep = 'initial';
//   let completedSteps = [];
//   if (['Conversion Made', 'Follow-up Taken'].includes(currentStatus)) {
//     currentStep = 'followup';
//     completedSteps = ['initial'];
//   } else if (['Converted to Lead', 'Closed'].includes(currentStatus)) {
//     currentStep = 'meeting';
//     completedSteps = ['initial', 'followup'];
//   }

//   const handleStatusUpdate = () => {
//     if (feedback.length > 500) {
//       toast.error('Feedback cannot exceed 500 characters.');
//       return;
//     }
//     dispatch(updateContactStatus({ contactId, status: selectedStatus, feedback }))
//       .unwrap()
//       .then(() => {
//         toast.success('Status updated successfully!');
//         dispatch(getContactById(contactId));
//         setIsFeedbackDialogOpen(false);
//         setFeedback('');
//         setSelectedStatus('');
//       })
//       .catch(() => toast.error('Failed to update status'));
//   };

//   const openFeedbackDialog = (status) => {
//     setSelectedStatus(status);
//     setIsFeedbackDialogOpen(true);
//   };

//   const openGuide = (phase) => setGuideDialog({ open: true, phase });

//   // Options
//   const initialOptions = currentStatus === 'Contact Received' ? ['Conversion Made', 'Ignore'] : [];
//   const followUpOptions = ['Conversion Made', 'Follow-up Taken'].includes(currentStatus)
//     ? ['Follow-up Taken', 'Converted to Lead', 'Ignore']
//     : [];
//   const meetingOptions = currentStatus === 'Converted to Lead' ? ['Close'] : [];

//   const getButtonStyles = (option) => {
//     const styles = {
//       'Conversion Made': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
//       'Follow-up Taken': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
//       'Converted to Lead': 'bg-green-100 text-green-800 hover:bg-green-200',
//       'Close': 'bg-red-100 text-red-800 hover:bg-red-200',
//       'Ignore': 'bg-red-100 text-red-800 hover:bg-red-200',
//     };
//     return styles[option] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
//   };

//   const isInitialAccessible = true;
//   const isFollowUpAccessible = ['Conversion Made', 'Follow-up Taken', 'Converted to Lead', 'Closed'].includes(currentStatus);
//   const isMeetingAccessible = ['Converted to Lead', 'Closed'].includes(currentStatus);

//   const steps = [
//     { id: 'initial', label: 'Initial', accessible: isInitialAccessible },
//     { id: 'followup', label: 'Follow-up', accessible: isFollowUpAccessible },
//     { id: 'meeting', label: 'Meeting', accessible: isMeetingAccessible },
//   ];

//   // Status chip
//   const statusConfig = {
//     'Contact Received': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
//     'Conversion Made': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
//     'Follow-up Taken': { color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
//     'Converted to Lead': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
//     'Closed': { color: 'bg-red-100 text-red-800', icon: XCircle },
//   };
//   const { color: statusColor = 'bg-gray-100 text-gray-800', icon: StatusIcon = AlertCircle } = statusConfig[currentStatus] || {};

//   return (
//     <>
//       <Card className="overflow-hidden shadow-xl border-0">
//         <CardContent className="p-6 lg:p-10">
//           {/* Header */}
//           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
//             <Button onClick={() => router.back()} variant="default" className="gap-2">
//               <ArrowLeft className="h-4 w-4" /> Back
//             </Button>
//             <span className={cn('inline-flex items-center px-4 py-2 rounded-full text-sm font-bold', statusColor)}>
//               <StatusIcon className="h-4 w-4 mr-2" />
//               {currentStatus}
//             </span>
//           </div>

//           {status === 'loading' && !selectedContact ? (
//             <div className="flex flex-col items-center justify-center py-20">
//               <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
//               <p className="mt-4 text-lg text-gray-600">Loading contact...</p>
//             </div>
//           ) : error ? (
//             <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
//           ) : selectedContact ? (
//             <div className="space-y-10">
//               {/* Contact Info */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
//                 <Detail icon={Tag} label="Contact ID" value={selectedContact.contactId} color="text-blue-600" />
//                 <Detail icon={User} label="Name" value={selectedContact.fullName} color="text-blue-600" />
//                 <Detail icon={Mail} label="Email" value={selectedContact.email} color="text-green-600" />
//                 <Detail icon={Phone} label="Phone" value={selectedContact.phone} color="text-green-600" />
//                 <Detail icon={Building} label="Company" value={selectedContact.companyName} color="text-purple-600" />
//                 <Detail icon={Briefcase} label="Role" value={selectedContact.designation} color="text-purple-600" />
//                 <Detail icon={Tag} label="Brand" value={selectedContact.brandCategory} color="text-indigo-600" />
//                 <Detail icon={MapPin} label="Location" value={selectedContact.location} color="text-indigo-600" />
//                 {selectedContact.serviceInterest?.length > 0 && (
//                   <Detail icon={Tag} label="Interested In" value={selectedContact.serviceInterest.join(', ')} color="text-red-600" />
//                 )}
//                 <div className="md:col-span-2"><Detail icon={MessageSquare} label="Message" value={selectedContact.message} color="text-gray-700" /></div>
//               </div>

//               {/* Stepper - UNCHANGED */}
//               <div className="mb-10">
//                 <div className="grid grid-cols-1 md:flex md:items-center md:space-x-4">
//                   {steps.map((step, index) => {
//                     const isCompleted = completedSteps.includes(step.id);
//                     const isCurrent = step.id === currentStep;
//                     return (
//                       <div
//                         key={step.id}
//                         className={cn(
//                           'flex items-center p-4 rounded-xl font-bold transition-all',
//                           isCompleted ? 'bg-green-100 text-green-800' : 
//                           isCurrent ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500' : 
//                           'bg-gray-200 text-gray-500',
//                           !step.accessible && 'opacity-50'
//                         )}
//                       >
//                         {isCompleted ? <CheckCircle className="h-6 w-6 mr-3" /> : 
//                          isCurrent ? <AlertCircle className="h-6 w-6 mr-3" /> : 
//                          <Circle className="h-6 w-6 mr-3" />}
//                         <span>{step.label}</span>
//                         {index < steps.length - 1 && <span className="hidden md:block mx-4 text-gray-400 text-2xl">→</span>}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* 3 PHASES - SIDE BY SIDE */}
//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//                 {/* Initial Phase */}
//                 <PhaseCard
//                   title="1. Initial Contact"
//                   icon={Lightbulb}
//                   isActive={currentStep === 'initial'}
//                   isAccessible={isInitialAccessible}
//                   onInfoClick={() => openGuide('initial')}
//                 >
//                   <p className="text-sm text-gray-600 mb-4">Have you replied to this lead?</p>
//                   <div className="flex flex-wrap gap-3">
//                     {initialOptions.map(opt => (
//                       <Button key={opt} size="sm" className={cn("font-semibold", getButtonStyles(opt))}
//                         onClick={() => openFeedbackDialog(opt)} disabled={!isInitialAccessible}>
//                         {opt}
//                       </Button>
//                     ))}
//                   </div>
//                 </PhaseCard>

//                 {/* Follow-up Phase */}
//                 <PhaseCard
//                   title="2. Follow-up"
//                   icon={MessageSquare}
//                   isActive={currentStep === 'followup'}
//                   isAccessible={isFollowUpAccessible}
//                   onInfoClick={() => openGuide('followup')}
//                 >
//                   <p className="text-sm text-gray-600 mb-4">Keep the conversation going!</p>
//                   <div className="flex flex-wrap gap-3">
//                     {followUpOptions.map(opt => (
//                       <Button key={opt} size="sm" className={cn("font-semibold", getButtonStyles(opt))}
//                         onClick={() => openFeedbackDialog(opt)} disabled={!isFollowUpAccessible}>
//                         {opt}
//                       </Button>
//                     ))}
//                   </div>
//                 </PhaseCard>

//                 {/* Meeting Phase */}
//                 <PhaseCard
//                   title="3. Meeting"
//                   icon={Calendar}
//                   isActive={currentStep === 'meeting'}
//                   isAccessible={isMeetingAccessible}
//                   onInfoClick={() => openGuide('meeting')}
//                 >
//                   <div className="space-y-4">
//                     <Button
//                       className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
//                       onClick={() => setOpenMeetDialog(true)}
//                       disabled={isFreeTierFull || isContactClosed || !isMeetingAccessible}
//                     >
//                       {isFreeTierFull ? "Limit Reached" : "Schedule Meeting"}
//                     </Button>
//                     {meetingOptions.map(opt => (
//                       <Button key={opt} size="sm" variant="destructive" className="w-full"
//                         onClick={() => openFeedbackDialog(opt)} disabled={!isMeetingAccessible}>
//                         {opt}
//                       </Button>
//                     ))}
//                     <div>
//                       <Progress value={progressValue} className="h-3" />
//                       <p className="text-xs text-center mt-2 text-gray-600">
//                         {totalMeetings} / {FREE_TIER_LIMIT} meetings used
//                       </p>
//                     </div>
//                   </div>
//                 </PhaseCard>
//               </div>

//               {/* Conversation History */}
//               <div className="mt-10 bg-white rounded-2xl shadow-md p-6 border">
//                 <h3 className="text-xl font-bold mb-4">Conversation History</h3>
//                 {selectedContact.conversations?.length > 0 ? (
//                   <div className="space-y-4 max-h-96 overflow-y-auto">
//                     {selectedContact.conversations.map((c, i) => (
//                       <div key={i} className="flex gap-3 text-sm">
//                         <div className="font-semibold text-gray-500">{formatDateTimeUTC(c.timestamp)}</div>
//                         <span className={cn("px-3 py-1 rounded-full text-xs font-bold", getButtonStyles(c.status))}>
//                           {c.status}
//                         </span>
//                         {c.feedback && <p className="text-gray-700">– {c.feedback}</p>}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <p className="text-gray-500">No history yet.</p>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <p className="text-center text-gray-500 py-20">No contact found.</p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Feedback Dialog */}
//       <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Update Status → {selectedStatus}</DialogTitle>
//           </DialogHeader>
//           <textarea
//             className="w-full h-32 p-3 border rounded-lg resize-none"
//             placeholder="Add feedback (optional, max 500 chars)"
//             value={feedback}
//             onChange={(e) => setFeedback(e.target.value)}
//             maxLength={500}
//           />
//           <p className="text-xs text-gray-500 text-right">{feedback.length}/500</p>
//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>Cancel</Button>
//             <Button onClick={handleStatusUpdate}>Update Status</Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Schedule Meeting */}
//       <Dialog open={openMeetDialog} onOpenChange={setOpenMeetDialog}>
//         <DialogContent className="max-w-4xl max-h-[100dvh] overflow-y-auto">
//           <ScheduleMeeting contactId={contactId} onClose={() => setOpenMeetDialog(false)} />
//         </DialogContent>
//       </Dialog>

//       {/* Next Step Guide */}
//       <NextStepDialog
//         isOpen={guideDialog.open}
//         onClose={() => setGuideDialog({ open: false, phase: '' })}
//         phase={guideDialog.phase}
//         currentStatus={currentStatus}
//       />
//     </>
//   );
// }



'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import {
  getContactById,
  updateContactStatus,
  clearSelectedContact,
} from '@/modules/marketing/slices/contactSlice';
import { Progress } from '@/components/ui/progress';
import { fetchMeetingsByContact } from '@/modules/meet/slices/meetSlice';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import {
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  Building,
  Briefcase,
  MapPin,
  MessageSquare,
  Tag,
  CheckCircle,
  XCircle,
  ArrowLeft,
  Circle,
  Info,
  Lightbulb,
  Target,
  Calendar,
  UserCheck,
  Ban,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ScheduleMeeting from '@/modules/meet/components/scheduleMeeting';
import { formatDateTimeUTC } from '@/utils/formatDate';

// Safe Detail Component
function Detail({ icon: Icon, label, value, color }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3">
      <Icon className={cn('h-5 w-5 mt-0.5', color)} />
      <div>
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-sm text-gray-800">{value}</p>
      </div>
    </div>
  );
}

// SAFE NextStepDialog – Now 100% crash-proof
function NextStepDialog({ isOpen, onClose, phase = 'initial' }) {
  const guides = {
    initial: {
      title: "Initial Contact Phase",
      icon: <Lightbulb className="w-8 h-8 text-yellow-600" />,
      color: "yellow",
      steps: [
        { action: "Conversion Made", desc: "You've replied and shown interest.", icon: <Target className="w-5 h-5" /> },
        { action: "Ignore", desc: "Not relevant → Close contact.", icon: <Ban className="w-5 h-5" /> },
      ],
    },
    followup: {
      title: "Follow-up Phase",
      icon: <MessageSquare className="w-8 h-8 text-purple-600" />,
      color: "purple",
      steps: [
        { action: "Follow-up Taken", desc: "Sent another message.", icon: <MessageSquare className="w-5 h-5" /> },
        { action: "Converted to Lead", desc: "Ready for meeting → Schedule!", icon: <Calendar className="w-5 h-5" /> },
        { action: "Ignore", desc: "No response → Close.", icon: <Ban className="w-5 h-5" /> },
      ],
    },
    meeting: {
      title: "Meeting Phase",
      icon: <Calendar className="w-8 h-8 text-green-600" />,
      color: "green",
      steps: [
        { action: "Schedule Meeting", desc: "Book a call now.", icon: <Calendar className="w-5 h-5" /> },
        { action: "Close", desc: "No meeting needed.", icon: <XCircle className="w-5 h-5" /> },
      ],
    },
  };

  const guide = guides[phase] || guides.initial; // Fallback to initial

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {guide.icon}
            <DialogTitle className="text-xl">{guide.title}</DialogTitle>
          </div>
          <DialogDescription className="text-base mt-2">
            What should you do next?
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {guide.steps.map((step, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <div className={cn(
                "p-2 rounded-full",
                guide.color === "yellow" ? "bg-yellow-200" :
                guide.color === "purple" ? "bg-purple-200" : "bg-green-200"
              )}>
                {step.icon}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{step.action}</p>
                <p className="text-sm text-gray-600">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button onClick={onClose} className="w-full">Got it!</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Phase Card
function PhaseCard({ title, children, isActive, isAccessible, onInfoClick, icon: Icon }) {
  return (
    <div
      className={cn(
        "relative bg-white rounded-2xl shadow-md border-2 transition-all duration-300",
        isActive ? "border-blue-500 shadow-xl scale-105" : "border-gray-200",
        !isAccessible && "opacity-60 grayscale cursor-not-allowed"
      )}
      onClick={isAccessible ? onInfoClick : undefined}
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {Icon && <Icon className={cn("w-6 h-6", isActive ? "text-blue-600" : "text-gray-500")} />}
            <h3 className="text-lg font-bold text-gray-800">{title}</h3>
          </div>
          {isAccessible && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full hover:bg-blue-100"
              onClick={(e) => {
                e.stopPropagation();
                onInfoClick();
              }}
            >
              <Info className="h-4 w-4" />
            </Button>
          )}
        </div>
        <div className={cn(!isAccessible && "pointer-events-none")}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ContactDetails({ contactId }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { selectedContact, status, error } = useSelector((state) => state.contact);
  const { meetings } = useSelector((state) => state.meet);

  const [feedback, setFeedback] = useState('');
  const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [openMeetDialog, setOpenMeetDialog] = useState(false);
  const [guideDialog, setGuideDialog] = useState({ open: false, phase: 'initial' }); // default safe

  useEffect(() => {
    if (contactId) {
      dispatch(getContactById(contactId));
      dispatch(fetchMeetingsByContact(contactId));
    }
    return () => dispatch(clearSelectedContact());
  }, [contactId, dispatch]);

  const FREE_TIER_LIMIT = 3;
  const totalMeetings = meetings?.length || 0;
  const progressValue = Math.min((totalMeetings / FREE_TIER_LIMIT) * 100, 100);
  const isFreeTierFull = totalMeetings >= FREE_TIER_LIMIT;
  const isContactClosed = selectedContact?.status === 'Closed';
  const currentStatus = selectedContact?.status || 'Contact Received';

  // Step logic
  let currentStep = 'initial';
  let completedSteps = [];
  if (['Conversion Made', 'Follow-up Taken'].includes(currentStatus)) {
    currentStep = 'followup';
    completedSteps = ['initial'];
  } else if (['Converted to Lead', 'Closed'].includes(currentStatus)) {
    currentStep = 'meeting';
    completedSteps = ['initial', 'followup'];
  }

  const handleStatusUpdate = async () => {
    if (feedback.length > 500) {
      toast.error('Feedback cannot exceed 500 characters.');
      return;
    }
    try {
      await dispatch(updateContactStatus({ contactId, status: selectedStatus, feedback })).unwrap();
      toast.success('Status updated!');
      dispatch(getContactById(contactId));
      setIsFeedbackDialogOpen(false);
      setFeedback('');
      setSelectedStatus('');
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const openFeedbackDialog = (status) => {
    setSelectedStatus(status);
    setIsFeedbackDialogOpen(true);
  };

  const openGuide = (phase) => {
    setGuideDialog({ open: true, phase }); // Safe
  };

  // Options
  const initialOptions = currentStatus === 'Contact Received' ? ['Conversion Made', 'Ignore'] : [];
  const followUpOptions = ['Conversion Made', 'Follow-up Taken'].includes(currentStatus)
    ? ['Follow-up Taken', 'Converted to Lead', 'Ignore']
    : [];
  const meetingOptions = currentStatus === 'Converted to Lead' ? ['Close'] : [];

  const getButtonStyles = (option) => {
    const map = {
      'Conversion Made': 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      'Follow-up Taken': 'bg-purple-100 text-purple-800 hover:bg-purple-200',
      'Converted to Lead': 'bg-green-100 text-green-800 hover:bg-green-200',
      'Close': 'bg-red-100 text-red-800 hover:bg-red-200',
      'Ignore': 'bg-red-100 text-red-800 hover:bg-red-200',
    };
    return map[option] || 'bg-gray-100 text-gray-800 hover:bg-gray-200';
  };

  const isInitialAccessible = true;
  const isFollowUpAccessible = ['Conversion Made', 'Follow-up Taken', 'Converted to Lead', 'Closed'].includes(currentStatus);
  const isMeetingAccessible = ['Converted to Lead', 'Closed'].includes(currentStatus);

  const steps = [
    { id: 'initial', label: 'Initial', accessible: isInitialAccessible },
    { id: 'followup', label: 'Follow-up', accessible: isFollowUpAccessible },
    { id: 'meeting', label: 'Meeting', accessible: isMeetingAccessible },
  ];

  const statusConfig = {
    'Contact Received': { color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
    'Conversion Made': { color: 'bg-blue-100 text-blue-800', icon: AlertCircle },
    'Follow-up Taken': { color: 'bg-purple-100 text-purple-800', icon: AlertCircle },
    'Converted to Lead': { color: 'bg-green-100 text-green-800', icon: CheckCircle },
    'Closed': { color: 'bg-red-100 text-red-800', icon: XCircle },
  };
  const { color: statusColor = 'bg-gray-100 text-gray-800', icon: StatusIcon = AlertCircle } = statusConfig[currentStatus] || {};

  return (
    <>
      <Card className="overflow-hidden shadow-xl border-0">
        <CardContent className="p-6 lg:p-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <Button onClick={() => router.back()} variant="default" className="gap-2">
              <ArrowLeft className="h-4 w-4" /> Back
            </Button>
            <span className={cn('inline-flex items-center px-4 py-2 rounded-full text-sm font-bold', statusColor)}>
              <StatusIcon className="h-4 w-4 mr-2" />
              {currentStatus}
            </span>
          </div>

          {status === 'loading' && !selectedContact ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
              <p className="mt-4 text-lg">Loading...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : selectedContact ? (
            <div className="space-y-10">

              {/* Contact Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-6 rounded-2xl">
                <Detail icon={Tag} label="ID" value={selectedContact.contactId} color="text-blue-600" />
                <Detail icon={User} label="Name" value={selectedContact.fullName} color="text-blue-600" />
                <Detail icon={Mail} label="Email" value={selectedContact.email} color="text-green-600" />
                <Detail icon={Phone} label="Phone" value={selectedContact.phone} color="text-green-600" />
                <Detail icon={Building} label="Company" value={selectedContact.companyName} color="text-purple-600" />
                <Detail icon={Briefcase} label="Role" value={selectedContact.designation} color="text-purple-600" />
                <Detail icon={Tag} label="Brand" value={selectedContact.brandCategory} color="text-indigo-600" />
                <Detail icon={MapPin} label="Location" value={selectedContact.location} color="text-indigo-600" />
                {selectedContact.serviceInterest?.length > 0 && (
                  <Detail icon={Tag} label="Interested In" value={selectedContact.serviceInterest.join(', ')} color="text-red-600" />
                )}
                <div className="md:col-span-2">
                  <Detail icon={MessageSquare} label="Message" value={selectedContact.message} color="text-gray-700" />
                </div>
              </div>

              {/* Stepper - EXACTLY SAME */}
              <div className="mb-10">
                <div className="grid grid-cols-1 md:flex md:items-center md:space-x-4">
                  {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = step.id === currentStep;
                    return (
                      <div
                        key={step.id}
                        className={cn(
                          'flex items-center p-4 rounded-xl font-bold transition-all',
                          isCompleted ? 'bg-green-100 text-green-800' :
                          isCurrent ? 'bg-blue-100 text-blue-800 ring-2 ring-blue-500' :
                          'bg-gray-200 text-gray-500',
                          !step.accessible && 'opacity-50'
                        )}
                      >
                        {isCompleted ? <CheckCircle className="h-6 w-6 mr-3" /> :
                         isCurrent ? <AlertCircle className="h-6 w-6 mr-3" /> :
                         <Circle className="h-6 w-6 mr-3" />}
                        <span>{step.label}</span>
                        {index < steps.length - 1 && <span className="hidden md:block mx-4 text-gray-400 text-2xl">→</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 3 PHASES GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <PhaseCard title="1. Initial Contact" icon={Lightbulb} isActive={currentStep === 'initial'} isAccessible={isInitialAccessible} onInfoClick={() => openGuide('initial')}>
                  <p className="text-sm text-gray-600 mb-4">Have you replied?</p>
                  <div className="flex flex-wrap gap-2">
                    {initialOptions.map(opt => (
                      <Button key={opt} size="sm" className={cn("font-semibold", getButtonStyles(opt))}
                        onClick={() => openFeedbackDialog(opt)}>
                        {opt}
                      </Button>
                    ))}
                  </div>
                </PhaseCard>

                <PhaseCard title="2. Follow-up" icon={MessageSquare} isActive={currentStep === 'followup'} isAccessible={isFollowUpAccessible} onInfoClick={() => openGuide('followup')}>
                  <p className="text-sm text-gray-600 mb-4">Keep engaging!</p>
                  <div className="flex flex-wrap gap-2">
                    {followUpOptions.map(opt => (
                      <Button key={opt} size="sm" className={cn("font-semibold", getButtonStyles(opt))}
                        onClick={() => openFeedbackDialog(opt)}>
                        {opt}
                      </Button>
                    ))}
                  </div>
                </PhaseCard>

                <PhaseCard title="3. Meeting" icon={Calendar} isActive={currentStep === 'meeting'} isAccessible={isMeetingAccessible} onInfoClick={() => openGuide('meeting')}>
                  <div className="space-y-3">
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={() => setOpenMeetDialog(true)}
                      disabled={isFreeTierFull || isContactClosed}>
                      {isFreeTierFull ? "Limit Reached" : "Schedule Meeting"}
                    </Button>
                    {meetingOptions.map(opt => (
                      <Button key={opt} size="sm" variant="destructive" className="w-full"
                        onClick={() => openFeedbackDialog(opt)}>
                        {opt}
                      </Button>
                    ))}
                    <div>
                      <Progress value={progressValue} className="h-3" />
                      <p className="text-xs text-center mt-2">{totalMeetings}/{FREE_TIER_LIMIT} meetings</p>
                    </div>
                  </div>
                </PhaseCard>
              </div>

              {/* Conversation History */}
              <div className="mt-10 bg-white rounded-2xl shadow-md p-6 border">
                <h3 className="text-xl font-bold mb-4">Conversation History</h3>
                {selectedContact.conversations?.length > 0 ? (
                  <div className="space-y-3 text-sm">
                    {selectedContact.conversations.map((c, i) => (
                      <div key={i} className="flex flex-wrap items-center gap-3">
                        <span className="text-gray-500">{formatDateTimeUTC(c.timestamp)}</span>
                        <span className={cn("px-3 py-1 rounded-full text-xs font-bold", getButtonStyles(c.status))}>
                          {c.status}
                        </span>
                        {c.feedback && <span className="text-gray-700">– {c.feedback}</span>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No history yet.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-center py-20 text-gray-500">No contact found.</p>
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Update → {selectedStatus}</DialogTitle></DialogHeader>
          <textarea className="w-full h-32 p-3 border rounded-lg" placeholder="Feedback (max 500)" value={feedback}
            onChange={e => setFeedback(e.target.value)} maxLength={500} />
          <p className="text-right text-xs text-gray-500">{feedback.length}/500</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFeedbackDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleStatusUpdate}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openMeetDialog} onOpenChange={setOpenMeetDialog}>
        <DialogContent className="max-w-4xl max-h-[90dvh] overflow-y-auto">
          <ScheduleMeeting contactId={contactId} onClose={() => setOpenMeetDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* SAFE GUIDE DIALOG */}
      <NextStepDialog isOpen={guideDialog.open} onClose={() => setGuideDialog({ open: false, phase: 'initial' })} phase={guideDialog.phase} />
    </>
  );
}