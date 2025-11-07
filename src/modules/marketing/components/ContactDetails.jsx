






// 'use client';

// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useDispatch, useSelector } from 'react-redux';
// import {
//   getContactById,
//   updateContactStatus,
//   clearSelectedContact,

// } from '@/features/marketing/contactSlice';
// import { Progress } from '@/components/ui/progress';

// import {
//   fetchMeetingsByContact
// } from '@/features/meet/meetSlice';
// import { Button } from '@/components/ui/button';
// import { Label } from '@/components/ui/label';
// import { Card, CardContent } from '@/components/ui/card'; // Import Card components
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
//   Edit,
//   ArrowLeft,
// } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';
// import ScheduleMeeting from '@/modules/meet/scheduleMeeting';
// import { formatDateTimeUTC } from '@/utils/formatDate';

// export default function ContactDetails({ contactId }) {
  
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const { selectedContact, status, error } = useSelector((state) => state.contact);
//   //meeting check
//   const { meetings } = useSelector((state) => state.meet);
//   const [feedback, setFeedback] = useState('');
//   const [isFeedbackDialogOpen, setIsFeedbackDialogOpen] = useState(false);
//   const [selectedStatus, setSelectedStatus] = useState('');
//   const [openMeetDialog, setOpenMeetDialog] = useState(false);
//   useEffect(() => {
//     if (contactId) {
//       dispatch(getContactById(contactId));
//        dispatch(fetchMeetingsByContact(contactId));
//     }
//     return () => {
//       dispatch(clearSelectedContact());
//     };
//   }, [contactId, dispatch]);
// // console.log(meetings);

//   const FREE_TIER_LIMIT = 3;
// const totalMeetings = meetings?.length || 0;
// const progressValue = Math.min((totalMeetings / FREE_TIER_LIMIT) * 100, 100);
// const isFreeTierFull = totalMeetings >= FREE_TIER_LIMIT;
// const isContactClosed = selectedContact?.status === 'Closed';
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

//   const currentStatus = selectedContact?.status || '';
//   let nextOptions = [];
//   if (currentStatus === 'Contact Received') {
//     nextOptions = ['Conversion Made', 'Follow-up Taken'];
//   } else if (currentStatus === 'Follow-up Taken') {
//     nextOptions = ['Follow-up Taken', 'Converted to Lead', 'Closed'];
//   } else if (currentStatus === 'Conversion Made') {
//     nextOptions = ['Follow-up Taken', 'Converted to Lead', 'Closed'];
//   } else if (currentStatus === 'Converted to Lead') {
//     nextOptions = ['Closed'];
//   }

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
//       case 'Closed':
//         return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:border-red-400';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400';
//     }
//   };



  
  
//   return (
//     <div className="p-4">
//       <Card className="overflow-hidden">
//         <CardContent className="p-6 sm:p-8 min-h-screen">
//           {/* Header */}
//           <div className="flex items-center justify-between mb-6">
//               <button
//                 onClick={() => router.back()}
//                 className="inline-flex cursor-pointer items-center gap-2 bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//               >
//                 <svg
//                   className="h-4 w-4"
//                   fill="none"
//                   stroke="currentColor"
//                   viewBox="0 0 24 24"
//                   xmlns="http://www.w3.org/2000/svg"
//                 >
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth="2"
//                     d="M15 19l-7-7 7-7"
//                   />
//                 </svg>
//                 Back
//               </button>
//               {
//                 selectedContact && (

//             <span
//               className={cn(
//                 'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
//                 statusColor
//               )}
//             >
//               <StatusIcon className="h-4 w-4 mr-1" />
//               {currentStatus || 'N/A'}
//             </span>
//                 )
//               }
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
//               {/* Take Action (Hidden if Closed) */}
//               {nextOptions.length > 0 && currentStatus !== 'Closed' && (
//                 <div>
//                   <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//                     Take Action
//                   </h3>
//                   <div className="flex flex-wrap gap-3">
//                     {nextOptions.map((option) => (
//                       <Button
//                         key={option}
//                         className={cn(
//                           'text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200',
//                           'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
//                           getButtonStyles(option)
//                         )}
//                         onClick={() => openFeedbackDialog(option)}
//                       >
//                         {option}
//                       </Button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               {/* Contact Info */}
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Information</h2>
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


//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
//   {/* Left Column: Action History */}
  
//   <div className="bg-white rounded-2xl shadow-sm p-4">
//     <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//       Action History
//     </h3>

//     {selectedContact?.conversations.length > 0 ? (
//       <div className="space-y-4 overflow-y-auto max-h-72 pr-2">
//         {selectedContact?.conversations.map((action, index) => {
//           let historyColor = 'bg-yellow-100 text-yellow-800';
//           let HistoryIcon = AlertCircle;

//           if (action.status === 'Converted to Lead') {
//             historyColor = 'bg-green-100 text-green-800';
//             HistoryIcon = CheckCircle;
//           } else if (action.status === 'Closed') {
//             historyColor = 'bg-red-100 text-red-800';
//             HistoryIcon = XCircle;
//           } else if (action.status === 'In Progress') {
//             historyColor = 'bg-blue-100 text-blue-800';
//             HistoryIcon = AlertCircle;
//           } else if (action.status === 'Follow-up Taken') {
//             historyColor = 'bg-purple-100 text-purple-800';
//             HistoryIcon = AlertCircle;
//           }

//           return (
//             <div key={index} className="border-l-2 border-gray-200 pl-4">
//               <div className="flex items-center mb-1">
//                 <HistoryIcon className="h-4 w-4 mr-2 text-gray-500" />
//                 <span
//                   className={cn(
//                     'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
//                     historyColor
//                   )}
//                 >
//                   {action.status}
//                 </span>
//               </div>
//               {action.feedback && (
//                 <p className="text-sm text-gray-600">{action.feedback}</p>
//               )}
//               {action.timestamp && (
//                 <p className="text-xs text-gray-400">{formatDateTimeUTC(action.timestamp)}</p>
//               )}
//             </div>
//           );
//         })}
//       </div>
//     ) : (
//       <p className="text-sm text-gray-500">No action history available.</p>
//     )}
//   </div>

//   {/* Right Column: Meeting References + Schedule Button */}
//   {/* <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
//     <div>
//       <h3 className="text-lg font-semibold text-gray-800 mb-3">
//         Meeting References
//       </h3>

//       {meetings && meetings.length > 0 ? (
//         <div className="flex flex-wrap gap-2">
//           {meetings.map((meeting) => (
//             <span
//               key={meeting._id}
//               onClick={() => router.push(`/meet/${meeting.meetingId}`)}
//               className="cursor-pointer bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition"
//             >
//               {meeting.title} – 
              
//               {meeting.mode}
//             </span>
//           ))}
//         </div>
     
//       ) : (
//         <p className="text-sm text-gray-500">No meeting references found.</p>
//       )}
//     </div>
//     {
      
//     }
//   <div className="mt-6">
//       <Button
//       onClick={() => setOpenMeetDialog(true)}
//         className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto"
//       >
//         Schedule Meeting
//       </Button>
//     </div>
  
//   </div> */}
//   {/* Right Column: Meeting References + Schedule Button */}
// <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
//   <div>
//     <h3 className="text-lg font-semibold text-gray-800 mb-3">
//       Meeting References
//     </h3>

//     {/* Meeting Tracker */}
//     <div className="mb-4">
//       <div className="flex items-center justify-between mb-1">
//         <span className="text-sm text-gray-700 font-medium">
//           Meeting Tracker ({Math.min(totalMeetings, FREE_TIER_LIMIT)} / {FREE_TIER_LIMIT})
//         </span>
//         {isFreeTierFull && (
//           <span className="text-xs text-red-600 font-semibold">
//             Free tier limit reached
//           </span>
//         )}
//       </div>
//       <Progress value={progressValue} className="h-2 rounded-full" />
//     </div>

//     {/* Meeting list */}
//     {meetings && meetings.length > 0 ? (
//       <div className="flex flex-wrap gap-2">
//         {meetings.slice(0, FREE_TIER_LIMIT).map((meeting) => (
//           <span
//             key={meeting._id}
//             title="Click View meeting Details!"
//             onClick={() => router.push(`/meet/${meeting.meetingId}`)}
//             className="cursor-pointer bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition"
//           >
//             {meeting.title} – {meeting.mode}
//           </span>
//         ))}
//       </div>
//     ) : (
//       <p className="text-sm text-gray-500">No meeting references found.</p>
//     )}
//   </div>

//   {/* Schedule Button */}
//   <div className="mt-6">
//     <Button
//       onClick={() => setOpenMeetDialog(true)}
//       className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
//       disabled={isFreeTierFull || isContactClosed}
//     >
//       {isContactClosed
//         ? 'Contact Closed'
//         : isFreeTierFull
//         ? 'Meeting Limit Reached'
//         : 'Schedule Meeting'}
//     </Button>
//   </div>
// </div>

// </div>

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

//       {/* meeting schedule Dialog */}
//       <Dialog open={openMeetDialog} onOpenChange={setOpenMeetDialog}>
//         <DialogContent className="max-h-[85dvh]  min-w-[50vw] mt-4 ">
     
//           <DialogHeader>
//             <DialogTitle>Schedule a  Meeting</DialogTitle>
//           </DialogHeader>

//                <ScheduleMeeting contactId={contactId} meetingRefs={contactId} onClose={() => setOpenMeetDialog(false)} />
//                {/* <ScheduleMeeting meetingRefs="meeting" onClose={() => setOpenMeetDialog(false)} /> */}
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
// } from '@/features/marketing/contactSlice';
// import { Progress } from '@/components/ui/progress';
// import { fetchMeetingsByContact } from '@/features/meet/meetSlice';
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
//   Edit,
//   ArrowLeft,
//   ChevronDown,
//   ChevronRight,
//   Circle,
// } from 'lucide-react';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
// import { toast } from 'sonner';
// import { cn } from '@/lib/utils';
// import ScheduleMeeting from '@/modules/meet/scheduleMeeting';
// import { formatDateTimeUTC } from '@/utils/formatDate';

// // Initial Phase Component
// function InitialPhase({ nextOptions, currentStatus, openFeedbackDialog, getButtonStyles }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-4">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//         Take Action
//       </h3>
//       {nextOptions.length > 0 && currentStatus !== 'Closed' ? (
//         <div className="flex flex-wrap gap-3">
//           {nextOptions.map((option) => (
//             <Button
//               key={option}
//               className={cn(
//                 'text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200',
//                 'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
//                 getButtonStyles(option)
//               )}
//               onClick={() => openFeedbackDialog(option)}
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
// function FollowUpPhase({ conversations }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-4">
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//         Action History
//       </h3>
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

// // Meeting Phase Component
// function MeetingPhase({ meetings, totalMeetings, progressValue, isFreeTierFull, isContactClosed, setOpenMeetDialog, router }) {
//   return (
//     <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-col justify-between">
//       <div>
//         <h3 className="text-lg font-semibold text-gray-800 mb-3">
//           Meeting References
//         </h3>
//         <div className="mb-4">
//           <div className="flex items-center justify-between mb-1">
//             <span className="text-sm text-gray-700 font-medium">
//               Meeting Tracker ({Math.min(totalMeetings, 3)} / 3)
//             </span>
//             {isFreeTierFull && (
//               <span className="text-xs text-red-600 font-semibold">
//                 Free tier limit reached
//               </span>
//             )}
//           </div>
//           <Progress value={progressValue} className="h-2 rounded-full" />
//         </div>
//         {meetings && meetings.length > 0 ? (
//           <div className="flex flex-wrap gap-2">
//             {meetings.slice(0, 3).map((meeting) => (
//               <span
//                 key={meeting._id}
//                 title="Click to view meeting details!"
//                 onClick={() => router.push(`/meet/${meeting.meetingId}`)}
//                 className="cursor-pointer bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition"
//               >
//                 {meeting.title} – {meeting.mode}
//               </span>
//             ))}
//           </div>
//         ) : (
//           <p className="text-sm text-gray-500">No meeting references found.</p>
//         )}
//       </div>
//       <div className="mt-6">
//         <Button
//           onClick={() => setOpenMeetDialog(true)}
//           className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
//           disabled={isFreeTierFull || isContactClosed}
//         >
//           {isContactClosed
//             ? 'Contact Closed'
//             : isFreeTierFull
//             ? 'Meeting Limit Reached'
//             : 'Schedule Meeting'}
//         </Button>
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
//   const [openSection, setOpenSection] = useState('initial');

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

//   // Set default open section to current step
//   useEffect(() => {
//     setOpenSection(currentStep);
//   }, [currentStep]);

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

//   let nextOptions = [];
//   if (currentStatus === 'Contact Received') {
//     nextOptions = ['Conversion Made', 'Follow-up Taken'];
//   } else if (currentStatus === 'Follow-up Taken') {
//     nextOptions = ['Follow-up Taken', 'Converted to Lead', 'Closed'];
//   } else if (currentStatus === 'Conversion Made') {
//     nextOptions = ['Follow-up Taken', 'Converted to Lead', 'Closed'];
//   } else if (currentStatus === 'Converted to Lead') {
//     nextOptions = ['Closed'];
//   }

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
//       case 'Closed':
//         return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:border-red-400';
//       default:
//         return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400';
//     }
//   };

//   // Determine accessible sections
//   const isInitialAccessible = true;
//   const isFollowUpAccessible = ['Conversion Made', 'Follow-up Taken', 'Converted to Lead', 'Closed'].includes(currentStatus);
//   const isMeetingAccessible = ['Converted to Lead', 'Closed'].includes(currentStatus);

//   // Toggle section handler
//   const toggleSection = (section) => {
//     if (
//       (section === 'initial' && isInitialAccessible) ||
//       (section === 'followup' && isFollowUpAccessible) ||
//       (section === 'meeting' && isMeetingAccessible)
//     ) {
//       setOpenSection(openSection === section ? null : section);
//     }
//   };

//   // Stepper configuration
//   const steps = [
//     { id: 'initial', label: 'Initial', accessible: isInitialAccessible },
//     { id: 'followup', label: 'Follow-up', accessible: isFollowUpAccessible },
//     { id: 'meeting', label: 'Meeting', accessible: isMeetingAccessible },
//   ];

//   return (
//     <div className="p-4 sm:p-6 md:p-8">
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
//                         key={step.id}
//                         className={cn(
//                           'flex items-center p-3 rounded-lg',
//                           isCompleted ? 'bg-green-100 text-green-800' : isCurrent ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-500',
//                           !isAccessible && 'opacity-50 cursor-not-allowed'
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
//               <div className="space-y-4">
//                 {/* Initial Phase */}
//                 <div>
//                   <button
//                     onClick={() => toggleSection('initial')}
//                     className={cn(
//                       'w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg text-lg font-semibold text-gray-800',
//                       !isInitialAccessible && 'opacity-50 cursor-not-allowed'
//                     )}
//                     disabled={!isInitialAccessible}
//                     aria-expanded={openSection === 'initial'}
//                     aria-controls="initial-phase"
//                   >
//                     <span>Initial Phase</span>
//                     {openSection === 'initial' ? (
//                       <ChevronDown className="h-5 w-5 text-gray-600" />
//                     ) : (
//                       <ChevronRight className="h-5 w-5 text-gray-600" />
//                     )}
//                   </button>
//                   {openSection === 'initial' && (
//                     <div id="initial-phase" className="mt-2">
//                       <InitialPhase
//                         nextOptions={nextOptions}
//                         currentStatus={currentStatus}
//                         openFeedbackDialog={openFeedbackDialog}
//                         getButtonStyles={getButtonStyles}
//                       />
//                     </div>
//                   )}
//                 </div>

//                 {/* Follow-up Phase */}
//                 <div>
//                   <button
//                     onClick={() => toggleSection('followup')}
//                     className={cn(
//                       'w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg text-lg font-semibold text-gray-800',
//                       !isFollowUpAccessible && 'opacity-50 cursor-not-allowed'
//                     )}
//                     disabled={!isFollowUpAccessible}
//                     aria-expanded={openSection === 'followup'}
//                     aria-controls="followup-phase"
//                   >
//                     <span>Follow-up Phase</span>
//                     {openSection === 'followup' ? (
//                       <ChevronDown className="h-5 w-5 text-gray-600" />
//                     ) : (
//                       <ChevronRight className="h-5 w-5 text-gray-600" />
//                     )}
//                   </button>
//                   {openSection === 'followup' && (
//                     <div id="followup-phase" className="mt-2">
//                       <FollowUpPhase conversations={selectedContact?.conversations} />
//                     </div>
//                   )}
//                 </div>

//                 {/* Meeting Phase */}
//                 <div>
//                   <button
//                     onClick={() => toggleSection('meeting')}
//                     className={cn(
//                       'w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg text-lg font-semibold text-gray-800',
//                       !isMeetingAccessible && 'opacity-50 cursor-not-allowed'
//                     )}
//                     disabled={!isMeetingAccessible}
//                     aria-expanded={openSection === 'meeting'}
//                     aria-controls="meeting-phase"
//                   >
//                     <span>Meeting Phase</span>
//                     {openSection === 'meeting' ? (
//                       <ChevronDown className="h-5 w-5 text-gray-600" />
//                     ) : (
//                       <ChevronRight className="h-5 w-5 text-gray-600" />
//                     )}
//                   </button>
//                   {openSection === 'meeting' && (
//                     <div id="meeting-phase" className="mt-2">
//                       <MeetingPhase
//                         meetings={meetings}
//                         totalMeetings={totalMeetings}
//                         progressValue={progressValue}
//                         isFreeTierFull={isFreeTierFull}
//                         isContactClosed={isContactClosed}
//                         setOpenMeetDialog={setOpenMeetDialog}
//                         router={router}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>
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
// } from '@/features/marketing/contactSlice';
// import { Progress } from '@/components/ui/progress';
// import { fetchMeetingsByContact } from '@/features/meet/meetSlice';
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
// import ScheduleMeeting from '@/modules/meet/scheduleMeeting';
// import { formatDateTimeUTC } from '@/utils/formatDate';

// // Initial Phase Component
// function InitialPhase({ nextOptions, currentStatus, openFeedbackDialog, getButtonStyles, isActive, isAccessible }) {
//   return (
//     <div
//       className={cn(
//         'bg-white rounded-2xl shadow-sm p-4 border',
//         isActive ? 'border-blue-300' : 'border-gray-200',
//         !isAccessible && 'opacity-50'
//       )}
//     >
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//         Initial Actions
//       </h3>
//       {nextOptions.length > 0 && currentStatus !== 'Closed' && isAccessible ? (
//         <div className="flex flex-wrap gap-3">
//           {nextOptions.map((option) => (
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
//           ))}
//         </div>
//       ) : (
//         <p className="text-sm text-gray-500">No actions available.</p>
//       )}
//     </div>
//   );
// }

// // Follow-up Phase Component
// function FollowUpPhase({ conversations, nextOptions, currentStatus, openFeedbackDialog, getButtonStyles, isActive, isAccessible }) {
//   return (
//     <div
//       className={cn(
//         'bg-white rounded-2xl shadow-sm p-4 border',
//         isActive ? 'border-blue-300' : 'border-gray-200',
//         !isAccessible && 'opacity-50'
//       )}
//     >
//       <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
//         Follow-up Actions
//       </h3>
//       {nextOptions.length > 0 && currentStatus !== 'Closed' && isAccessible ? (
//         <div className="flex flex-wrap gap-3 mb-6">
//           {nextOptions.map((option) => (
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
//           ))}
//         </div>
//       ) : null}
//       <h4 className="text-md font-semibold text-gray-700 mb-3">Conversation History</h4>
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

// // Meeting Phase Component
// function MeetingPhase({ meetings, totalMeetings, progressValue, isFreeTierFull, isContactClosed, setOpenMeetDialog, router, nextOptions, openFeedbackDialog, getButtonStyles, isActive, isAccessible }) {
//   return (
//     <div
//       className={cn(
//         'bg-white rounded-2xl shadow-sm p-4 border',
//         isActive ? 'border-blue-300' : 'border-gray-200',
//         !isAccessible && 'opacity-50'
//       )}
//     >
//       <h3 className="text-lg font-semibold text-gray-800 mb-3">
//         Meeting Actions
//       </h3>
//       {nextOptions.length > 0 && !isContactClosed && isAccessible ? (
//         <div className="flex flex-wrap gap-3 mb-6">
//           {nextOptions.map((option) => (
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
//           ))}
//         </div>
//       ) : null}
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
//       <div className="mt-6">
//         <Button
//           onClick={() => setOpenMeetDialog(true)}
//           className="bg-green-600 hover:bg-green-700 text-white w-full md:w-auto disabled:opacity-60 disabled:cursor-not-allowed"
//           disabled={isFreeTierFull || isContactClosed || !isAccessible}
//         >
//           {isContactClosed
//             ? 'Contact Closed'
//             : isFreeTierFull
//             ? 'Meeting Limit Reached'
//             : 'Schedule Meeting'}
//         </Button>
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
//   const initialOptions = currentStatus === 'Contact Received' ? ['Conversion Made', 'Follow-up Taken'] : [];
//   const followUpOptions = ['Conversion Made', 'Follow-up Taken'].includes(currentStatus)
//     ? ['Follow-up Taken', 'Converted to Lead', 'Closed']
//     : [];
//   const meetingOptions = currentStatus === 'Converted to Lead' ? ['Closed'] : [];

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
//       case 'Closed':
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
//     <div className="p-4 sm:p-6 md:p-8">
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
//                         key={step.id}
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
//                 {/* Initial Phase */}
//                 <InitialPhase
//                   nextOptions={initialOptions}
//                   currentStatus={currentStatus}
//                   openFeedbackDialog={openFeedbackDialog}
//                   getButtonStyles={getButtonStyles}
//                   isActive={currentStep === 'initial'}
//                   isAccessible={isInitialAccessible}
//                 />

//                 {/* Follow-up Phase */}
//                 <FollowUpPhase
//                   conversations={selectedContact?.conversations}
//                   nextOptions={followUpOptions}
//                   currentStatus={currentStatus}
//                   openFeedbackDialog={openFeedbackDialog}
//                   getButtonStyles={getButtonStyles}
//                   isActive={currentStep === 'followup'}
//                   isAccessible={isFollowUpAccessible}
//                 />

//                 {/* Meeting Phase */}
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
import { fetchMeetingsByContact } from '@/features/meet/meetSlice';
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
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import ScheduleMeeting from '@/modules/meet/scheduleMeeting';
import { formatDateTimeUTC } from '@/utils/formatDate';

// Initial Phase Component
function InitialPhase({ nextOptions, currentStatus, openFeedbackDialog, getButtonStyles, isActive, isAccessible }) {
  const suggestion = "Take action by selecting 'Conversion Made' to proceed to follow-up or 'Ignore' to close the contact.";
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm p-4 border',
        isActive ? 'border-blue-300' : 'border-gray-200',
        !isAccessible && 'opacity-50'
      )}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Initial Phase</h3>
      <p className="text-sm text-gray-600 italic mb-4">{suggestion}</p>
      {nextOptions.length > 0 && currentStatus !== 'Closed' && isAccessible ? (
        <div className="flex flex-wrap gap-3">
          {nextOptions.map((option) => (
            <Button
              key={option}
              className={cn(
                'text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200',
                'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                option === 'Conversion Made' ? 'bg-blue-600 text-white hover:bg-blue-700' : getButtonStyles(option)
              )}
              onClick={() => openFeedbackDialog(option)}
              disabled={!isAccessible}
            >
              {option}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No actions available.</p>
      )}
    </div>
  );
}

// Follow-up Phase Component
function FollowUpPhase({ nextOptions, currentStatus, openFeedbackDialog, getButtonStyles, isActive, isAccessible }) {
  const suggestion = "Continue with 'Follow-up Taken' for further engagement, select 'Converted to Lead' to schedule a meeting, or 'Ignore' to close.";
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm p-4 border',
        isActive ? 'border-blue-300' : 'border-gray-200',
        !isAccessible && 'opacity-50'
      )}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Follow-up Phase</h3>
      <p className="text-sm text-gray-600 italic mb-4">{suggestion}</p>
      {nextOptions.length > 0 && currentStatus !== 'Closed' && isAccessible ? (
        <div className="flex flex-wrap gap-3 mb-6">
          {nextOptions.map((option) => (
            <Button
              key={option}
              className={cn(
                'text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200',
                'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                option === 'Converted to Lead' ? 'bg-blue-600 text-white hover:bg-blue-700' : getButtonStyles(option)
              )}
              onClick={() => openFeedbackDialog(option)}
              disabled={!isAccessible}
            >
              {option}
            </Button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No actions available.</p>
      )}
    </div>
  );
}

// Meeting Phase Component
function MeetingPhase({ meetings, totalMeetings, progressValue, isFreeTierFull, isContactClosed, setOpenMeetDialog, router, nextOptions, openFeedbackDialog, getButtonStyles, isActive, isAccessible }) {
  const suggestion = "Schedule a meeting to discuss further or close the contact if no meeting is needed.";
  return (
    <div
      className={cn(
        'bg-white rounded-2xl shadow-sm p-4 border',
        isActive ? 'border-blue-300' : 'border-gray-200',
        !isAccessible && 'opacity-50'
      )}
    >
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Meeting Phase</h3>
      <p className="text-sm text-gray-600 italic mb-4">{suggestion}</p>
      <div className="flex flex-wrap gap-3 mb-6">
        {nextOptions.length > 0 && !isContactClosed && isAccessible ? (
          nextOptions.map((option) => (
            <Button
              key={option}
              className={cn(
                'text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200',
                'shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2',
                getButtonStyles(option)
              )}
              onClick={() => openFeedbackDialog(option)}
              disabled={!isAccessible}
            >
              {option}
            </Button>
          ))
        ) : null}
        <Button
          onClick={() => setOpenMeetDialog(true)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-full px-5 py-2.5 transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2"
          disabled={isFreeTierFull || isContactClosed || !isAccessible}
        >
          {isContactClosed
            ? 'Contact Closed'
            : isFreeTierFull
            ? 'Meeting Limit Reached'
            : 'Schedule Meeting'}
        </Button>
      </div>
      <h4 className="text-md font-semibold text-gray-700 mb-3">Meeting References</h4>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-700 font-medium">
            Meeting Tracker ({Math.min(totalMeetings, 3)} / 3)
          </span>
          {isFreeTierFull && (
            <span className="text-xs text-red-600 font-semibold">
              Free tier limit reached
            </span>
          )}
        </div>
        <Progress value={progressValue} className="h-2 rounded-full" />
      </div>
      {meetings && meetings.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {meetings.slice(0, 3).map((meeting) => (
            <span
              key={meeting._id}
              title="Click to view meeting details!"
              onClick={() => isAccessible && router.push(`/meet/${meeting.meetingId}`)}
              className={cn(
                'cursor-pointer bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full hover:bg-blue-200 transition',
                !isAccessible && 'cursor-not-allowed'
              )}
            >
              {meeting.title} – {meeting.mode}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No meeting references found.</p>
      )}
    </div>
  );
}

// Conversation History Component
function ConversationHistory({ conversations }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Conversation History</h3>
      {conversations?.length > 0 ? (
        <div className="space-y-4 overflow-y-auto max-h-72 pr-2">
          {conversations.map((action, index) => {
            let historyColor = 'bg-yellow-100 text-yellow-800';
            let HistoryIcon = AlertCircle;
            if (action.status === 'Converted to Lead') {
              historyColor = 'bg-green-100 text-green-800';
              HistoryIcon = CheckCircle;
            } else if (action.status === 'Closed') {
              historyColor = 'bg-red-100 text-red-800';
              HistoryIcon = XCircle;
            } else if (action.status === 'In Progress') {
              historyColor = 'bg-blue-100 text-blue-800';
              HistoryIcon = AlertCircle;
            } else if (action.status === 'Follow-up Taken') {
              historyColor = 'bg-purple-100 text-purple-800';
              HistoryIcon = AlertCircle;
            } else if (action.status === 'Conversion Made') {
              historyColor = 'bg-blue-100 text-blue-800';
              HistoryIcon = AlertCircle;
            }
            return (
              <div key={index} className="border-l-2 border-gray-200 pl-4">
                <div className="flex items-center mb-1">
                  <HistoryIcon className="h-4 w-4 mr-2 text-gray-500" />
                  <span
                    className={cn(
                      'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                      historyColor
                    )}
                  >
                    {action.status}
                  </span>
                </div>
                {action.feedback && (
                  <p className="text-sm text-gray-600">{action.feedback}</p>
                )}
                {action.timestamp && (
                  <p className="text-xs text-gray-400">{formatDateTimeUTC(action.timestamp)}</p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No action history available.</p>
      )}
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

  useEffect(() => {
    if (contactId) {
      dispatch(getContactById(contactId));
      dispatch(fetchMeetingsByContact(contactId));
    }
    return () => {
      dispatch(clearSelectedContact());
    };
  }, [contactId, dispatch]);

  const FREE_TIER_LIMIT = 3;
  const totalMeetings = meetings?.length || 0;
  const progressValue = Math.min((totalMeetings / FREE_TIER_LIMIT) * 100, 100);
  const isFreeTierFull = totalMeetings >= FREE_TIER_LIMIT;
  const isContactClosed = selectedContact?.status === 'Closed';

  // Determine current step and completed steps
  const currentStatus = selectedContact?.status || 'Contact Received';
  let currentStep = 'initial';
  let completedSteps = [];

  if (['Conversion Made', 'Follow-up Taken'].includes(currentStatus)) {
    currentStep = 'followup';
    completedSteps = ['initial'];
  } else if (['Converted to Lead', 'Closed'].includes(currentStatus)) {
    currentStep = 'meeting';
    completedSteps = ['initial', 'followup'];
  }

  const handleStatusUpdate = () => {
    if (contactId && selectedStatus) {
      if (feedback.length > 500) {
        toast.error('Feedback cannot exceed 500 characters.');
        return;
      }
      dispatch(
        updateContactStatus({
          contactId,
          status: selectedStatus,
          feedback,
        })
      ).then((result) => {
        if (result.meta.requestStatus === 'fulfilled') {
          toast.success('Status updated successfully.');
          dispatch(getContactById(contactId));
          setIsFeedbackDialogOpen(false);
          setFeedback('');
          setSelectedStatus('');
        } else {
          toast.error('Failed to update status.');
        }
      });
    }
  };

  const openFeedbackDialog = (status) => {
    setSelectedStatus(status);
    setIsFeedbackDialogOpen(true);
  };

  // Define nextOptions for each phase
  const initialOptions = currentStatus === 'Contact Received' ? ['Conversion Made', 'Ignore'] : [];
  const followUpOptions = ['Conversion Made', 'Follow-up Taken'].includes(currentStatus)
    ? ['Follow-up Taken', 'Converted to Lead', 'Ignore']
    : [];
  const meetingOptions = currentStatus === 'Converted to Lead' ? ['Close'] : [];

  // Status colors for chips
  let statusColor = 'bg-yellow-100 text-yellow-800';
  let StatusIcon = AlertCircle;
  if (currentStatus === 'Converted to Lead') {
    statusColor = 'bg-green-100 text-green-800';
    StatusIcon = CheckCircle;
  } else if (currentStatus === 'Closed') {
    statusColor = 'bg-red-100 text-red-800';
    StatusIcon = XCircle;
  }

  // Action button colors
  const getButtonStyles = (option) => {
    switch (option) {
      case 'Conversion Made':
        return 'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200 hover:border-blue-400';
      case 'Follow-up Taken':
        return 'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200 hover:border-purple-400';
      case 'Converted to Lead':
        return 'bg-green-100 text-green-800 border-green-300 hover:bg-green-200 hover:border-green-400';
      case 'Close':
      case 'Ignore':
        return 'bg-red-100 text-red-800 border-red-300 hover:bg-red-200 hover:border-red-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200 hover:border-gray-400';
    }
  };

  // Determine accessible sections
  const isInitialAccessible = true;
  const isFollowUpAccessible = ['Conversion Made', 'Follow-up Taken', 'Converted to Lead', 'Closed'].includes(currentStatus);
  const isMeetingAccessible = ['Converted to Lead', 'Closed'].includes(currentStatus);

  // Stepper configuration
  const steps = [
    { id: 'initial', label: 'Initial', accessible: isInitialAccessible },
    { id: 'followup', label: 'Follow-up', accessible: isFollowUpAccessible },
    { id: 'meeting', label: 'Meeting', accessible: isMeetingAccessible },
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8">
      <Card className="overflow-hidden shadow-lg border-0 bg-white">
        <CardContent className="p-6 sm:p-8 min-h-screen">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 bg-blue-700 text-white font-medium text-sm px-4 py-2 rounded-full shadow-md hover:bg-blue-800 hover:shadow-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            {selectedContact && (
              <span
                className={cn(
                  'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
                  statusColor
                )}
              >
                <StatusIcon className="h-4 w-4 mr-1" />
                {currentStatus || 'N/A'}
              </span>
            )}
          </div>

          {/* Loading State */}
          {status === 'loading' && !selectedContact ? (
            <div className="flex flex-col items-center justify-center py-12 min-h-screen">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="mt-2 text-gray-600">Loading contact details...</span>
            </div>
          ) : error && !selectedContact ? (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-5 w-5" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : selectedContact ? (
            <div className="space-y-8">
              {/* Contact Info */}
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 mb-4">Contact Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <Detail icon={Tag} label="Contact ID" value={selectedContact.contactId} color="text-blue-600" />
                  <Detail icon={User} label="Contact Person Name" value={selectedContact.fullName} color="text-blue-600" />
                  <Detail icon={Mail} label="Email Address" value={selectedContact.email} color="text-green-600" />
                  <Detail icon={Phone} label="Phone Number" value={selectedContact.phone} color="text-green-600" />
                  <Detail icon={Building} label="Company Name" value={selectedContact.companyName} color="text-purple-600" />
                  <Detail icon={Briefcase} label="Role in Organization" value={selectedContact.designation} color="text-purple-600" />
                  <Detail icon={Building} label="Brand Category" value={selectedContact.brandCategory} color="text-indigo-600" />
                  <Detail icon={MapPin} label="Location" value={selectedContact.location} color="text-indigo-600" />
                  {selectedContact.serviceInterest?.length > 0 && (
                    <Detail
                      icon={Tag}
                      label="Services of Interest"
                      value={selectedContact.serviceInterest.join(', ')}
                      color="text-red-600"
                    />
                  )}
                  <Detail
                    icon={MessageSquare}
                    label="Referral Source"
                    value={selectedContact.referralSource}
                    color="text-red-600"
                  />
                  <div className="sm:col-span-2">
                    <Detail icon={MessageSquare} label="Message" value={selectedContact.message} color="text-gray-600" />
                  </div>
                  <div className="sm:col-span-2">
                    <Detail icon={MessageSquare} label="Latest Feedback" value={selectedContact.feedback} color="text-gray-600" />
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div className="mb-6">
                <div className="grid grid-cols-1 md:flex md:items-center md:space-x-4">
                  {steps.map((step, index) => {
                    const isCompleted = completedSteps.includes(step.id);
                    const isCurrent = step.id === currentStep;
                    const isAccessible = step.accessible;
                    return (
                      <div
                        орт key={step.id}
                        className={cn(
                          'flex items-center p-3 rounded-lg',
                          isCompleted ? 'bg-green-100 text-green-800' : isCurrent ? 'bg-blue-100 text-blue-800' : 'bg-gray-200 text-gray-500',
                          !isAccessible && 'opacity-50'
                        )}
                      >
                        {isCompleted ? (
                          <CheckCircle className="h-5 w-5 mr-2" />
                        ) : isCurrent ? (
                          <AlertCircle className="h-5 w-5 mr-2" />
                        ) : (
                          <Circle className="h-5 w-5 mr-2" />
                        )}
                        <span className="font-medium">{step.label}</span>
                        {index < steps.length - 1 && (
                          <span className="hidden md:block mx-2 text-gray-400">→</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Phases Section */}
              <div className="space-y-6">
                <InitialPhase
                  nextOptions={initialOptions}
                  currentStatus={currentStatus}
                  openFeedbackDialog={openFeedbackDialog}
                  getButtonStyles={getButtonStyles}
                  isActive={currentStep === 'initial'}
                  isAccessible={isInitialAccessible}
                />
                <FollowUpPhase
                  nextOptions={followUpOptions}
                  currentStatus={currentStatus}
                  openFeedbackDialog={openFeedbackDialog}
                  getButtonStyles={getButtonStyles}
                  isActive={currentStep === 'followup'}
                  isAccessible={isFollowUpAccessible}
                />
                <MeetingPhase
                  meetings={meetings}
                  totalMeetings={totalMeetings}
                  progressValue={progressValue}
                  isFreeTierFull={isFreeTierFull}
                  isContactClosed={isContactClosed}
                  setOpenMeetDialog={setOpenMeetDialog}
                  router={router}
                  nextOptions={meetingOptions}
                  openFeedbackDialog={openFeedbackDialog}
                  getButtonStyles={getButtonStyles}
                  isActive={currentStep === 'meeting'}
                  isAccessible={isMeetingAccessible}
                />
              </div>

              {/* Conversation History */}
              <ConversationHistory conversations={selectedContact?.conversations} />
            </div>
          ) : (
            <div className="text-lg text-gray-600 text-center py-6 min-h-screen">No contact found.</div>
          )}
        </CardContent>
      </Card>

      {/* Feedback Dialog */}
      <Dialog open={isFeedbackDialogOpen} onOpenChange={setIsFeedbackDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-gray-800">Update Status: {selectedStatus}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label className="font-medium text-gray-700">Feedback (max 500 characters)</Label>
              <textarea
                placeholder="Share your thoughts..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="mt-1 w-full h-32 border-gray-300 rounded-lg p-3 text-sm focus:ring-blue-500 focus:border-blue-500 resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">{feedback.length}/500 characters</p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsFeedbackDialogOpen(false)}
              className="text-gray-700 border-gray-300 hover:bg-gray-100"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!selectedStatus}
            >
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Meeting Schedule Dialog */}
      <Dialog open={openMeetDialog} onOpenChange={setOpenMeetDialog}>
        <DialogContent className="max-h-[85dvh] min-w-[50vw] mt-4">
          <DialogHeader>
            <DialogTitle>Schedule a Meeting</DialogTitle>
          </DialogHeader>
          <ScheduleMeeting contactId={contactId} meetingRefs={contactId} onClose={() => setOpenMeetDialog(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

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