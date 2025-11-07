import { configureStore } from "@reduxjs/toolkit";

//1.setting/commom slice
import sidebarReducer from "@/modules/settings/slices/sidebarSlice";
//2. Communication
import notificationReducer from "@/modules/communication/slices/notificationSlice";

//3. Auth & User
import profileReducer from "@/modules/user/slices/profileSlice";
import authReducer from "@/modules/auth/slices/authSlice";
import userReducer from "@/modules/user/slices/userSlice";

//2.dashbaord/overview
import dashboardReducer from "@/modules/dashboard/slices/dashboardSlice";

//3.marketing
import contactReducer from "@/modules/marketing/slices/contactSlice";
import MarketingOverviewReducer from "@/modules/marketing/slices/MarketingOverviewSlice";

//4.sales
import quotationReducer from "@/features/sales/quotationSlice";
import quotationRequestsReducer from "@/features/sales/quotationRequestSlice";

//6. meeting
import meetReducer from "@/modules/meet/slices/meetSlice";

//5.client
import clientReducer from "@/modules/client-management/slices/clientSlice";

//6.project management
import projectReducer from "@/features/projectSlice";
import teamReducer from "@/features/teamSlice";
import taskReducer from "@/features/taskSlice";
import subTaskReducer from "@/features/subTaskSlice";

import bugReducer from "@/features/bugSlice";
import issuesReducer from "@/features/issues/issuesSlice";
import documentReducer from "@/modules/document/slices/documentSlice";

import teamMembersReducer from "@/features/teamMembersSlice";
import viewTeamByProjectIdReducer from "@/features/viewTeamByProjectIdSlice";

// module reducer
import meetingReducer from "@/features/meetingSlice";
import teammeetingMomReducer from "@/features/calender/teammeetingMomSlice";
import meetingCalendarReducer from "@/features/calender/meetingCalendarSlice";
import teamMeetingsReducer from "@/features/calender/teammeetingCalenderSlice";
import momReducer from "@/features/momSlice";
import causeReducer from "@/features/causeSlice";
import projectAnalyticsReducer from "@/features/projectAnalyticsSlice";

//master table
import slotReducer from "@/modules/master/slices/slotMasterSlice";
import serviceReducer from "@/modules/master/slices/serviceMasterSlice";
import industriesReducer from "@/modules/master/slices/industriesMasterSlice";

import projectMeetingMomReducer from "@/features/projectmeetingmomSlice"; // Adjust path as needed
import projectShowCauseReducer from "@/features/projectShowCauseSlice";
const initialState = {
  initialized: false,
  loading: false,
  error: null,
};

export const store = configureStore({
  reducer: {
    app: (state = initialState, action) => {
      switch (action.type) {
        case "app/initialize":
          return { ...state, initialized: true };
        case "app/setLoading":
          return { ...state, loading: action.payload };
        case "app/setError":
          return { ...state, error: action.payload };
        default:
          return state;
      }
    },
    //shared reducers
    sidebar: sidebarReducer,
    //setting
    profile: profileReducer,
    auth: authReducer,
    notifications: notificationReducer,
    user: userReducer,

    //dashboard
    dashboard: dashboardReducer,

    //marketing phase
    marketingOverview: MarketingOverviewReducer,
    contact: contactReducer,

    //sales & Meet phase
    quotation: quotationReducer,
    quotationRequests: quotationRequestsReducer,
    meet: meetReducer,

    // module reducer
    meetings: meetingReducer,
    meetingCalendar: meetingCalendarReducer,
    mom: momReducer,

    client: clientReducer,
    project: projectReducer,
    task: taskReducer,
    subTask: subTaskReducer,
    team: teamReducer,
    bugs: bugReducer,
    issues: issuesReducer,
    cause: causeReducer,

    projectAnalytics: projectAnalyticsReducer,

    //master
    slots: slotReducer,
    services: serviceReducer,
    industries: industriesReducer,

    //document
    documents: documentReducer,

    
    teamMeetings: teamMeetingsReducer,
    teammeetingMom: teammeetingMomReducer,
    teamMembers: teamMembersReducer,
    projectTeam: viewTeamByProjectIdReducer,

    //project meeting

    projectMeetingMom: projectMeetingMomReducer,

    //
    projectShowCause: projectShowCauseReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Initialize store
store.dispatch({ type: "app/initialize" });

export default store;
