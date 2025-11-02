import { configureStore } from '@reduxjs/toolkit'

//1.basic/commom slice
import sidebarReducer from '@/features/shared/sidebarSlice';

import profileReducer from "@/features/shared/profileSlice"
import authReducer from '@/features/shared/authSlice';
import notificationReducer from '@/features/shared/notificationSlice';
import userReducer from '@/features/shared/userSlice';

//2.dashbaord/overview
import dashboardReducer from '@/features/dashboard/dashboardSlice';

//3.marketing
import contactReducer from '@/features/marketing/contactSlice';

//4.sales
import quotationReducer from '@/features/sales/quotationSlice';
import quotationRequestsReducer from '@/features/sales/quotationRequestSlice';
import meetReducer from '@/features/meet/meetSlice';

//5.client

//6.project management
import projectReducer from '@/features/projectSlice';
import teamReducer from '@/features/teamSlice';
import taskReducer from '@/features/taskSlice';
import subTaskReducer from '@/features/subTaskSlice';

import bugReducer from '@/features/bugSlice';
import documentReducer from '@/features/documentSlice';

import teamMembersReducer from '@/features/teamMembersSlice';
import viewTeamByProjectIdReducer from '@/features/viewTeamByProjectIdSlice';




// module reducer
import meetingReducer from '@/features/meetingSlice';
import teammeetingMomReducer from '@/features/calender/teammeetingMomSlice';
import meetingCalendarReducer from '@/features/calender/meetingCalendarSlice';
import teamMeetingsReducer from '@/features/calender/teammeetingCalenderSlice';
import momReducer from '@/features/momSlice';
import clientReducer from '@/features/clientSlice';
import causeReducer from '@/features/causeSlice';
import projectAnalyticsReducer from "@/features/projectAnalyticsSlice";


//master table
import slotReducer from '@/features/master/slotMasterSlice';
import serviceReducer from '@/features/master/serviceMasterSlice';
import industriesReducer from '@/features/master/industriesMasterSlice';








import projectMeetingMomReducer from '@/features/projectmeetingmomSlice'; // Adjust path as needed
import projectShowCauseReducer from '@/features/projectShowCauseSlice';
const initialState = {
  initialized: false,
  loading: false,
  error: null
};

export const store = configureStore({
  reducer: {
    app: (state = initialState, action) => {
      switch (action.type) {
        case 'app/initialize':
          return { ...state, initialized: true };
        case 'app/setLoading':
          return { ...state, loading: action.payload };
        case 'app/setError':
          return { ...state, error: action.payload };
        default:
          return state;
      }
    },
    sidebar:sidebarReducer,
  //shared reducers
  auth: authReducer,
  notifications: notificationReducer,
  user: userReducer,


    //dashboard

  dashboard:dashboardReducer,
  projectAnalytics: projectAnalyticsReducer,
meet:meetReducer,
  // module reducer
 contact: contactReducer,
  meetings: meetingReducer,
  meetingCalendar: meetingCalendarReducer,
  mom: momReducer,
  //sales
  quotation : quotationReducer,
  quotationRequests:quotationRequestsReducer,
  client:clientReducer,
  project:projectReducer,
  task:taskReducer,
  subTask:subTaskReducer,
  team: teamReducer,
  bugs: bugReducer,
  cause: causeReducer,
 

  documents: documentReducer,
  profile: profileReducer,

  //master
  slots: slotReducer,
  services: serviceReducer,
  industries:industriesReducer,

  teamMeetings:teamMeetingsReducer,
teammeetingMom:teammeetingMomReducer,
    teamMembers: teamMembersReducer,
  projectTeam: viewTeamByProjectIdReducer,

  



  //project meeting
 
     projectMeetingMom: projectMeetingMomReducer,
  

     //
     projectShowCause: projectShowCauseReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
});

// Initialize store
store.dispatch({ type: 'app/initialize' });

export default store;