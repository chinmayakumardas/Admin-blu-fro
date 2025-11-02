
// // src/store/features/meet/meetSlice.js
// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import { axiosInstance } from '@/lib/axios';

// const BASE_URL = '/meet';

// // ------------------------------------------------------------------
// // FETCH ALL MEETS
// // ------------------------------------------------------------------
// export const fetchMeets = createAsyncThunk(
//   'meet/fetchAll',
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`${BASE_URL}/all`);
//       return response.data.meets || response.data; // handle either structure
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch meets');
//     }
//   }
// );

// // ------------------------------------------------------------------
// // FETCH SINGLE MEET BY ID
// // ------------------------------------------------------------------
// export const fetchMeetById = createAsyncThunk(
//   'meet/fetchById',
//   async (meetingId, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.get(`${BASE_URL}/getMeetByMeetId/${meetingId}`);
//       return response.data.meet || response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to fetch meet');
//     }
//   }
// );

// // ------------------------------------------------------------------
// // CREATE MEET
// // ------------------------------------------------------------------
// export const createMeet = createAsyncThunk(
//   'meet/create',
//   async (meetData, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.post(`${BASE_URL}/create`, meetData);
//       return response.data.meet || response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to create meet');
//     }
//   }
// );

// // ------------------------------------------------------------------
// // UPDATE MEET
// // ------------------------------------------------------------------
// export const updateMeet = createAsyncThunk(
//   'meet/update',
//   async ({ meetingId, updates }, { rejectWithValue }) => {
//     try {
//       const response = await axiosInstance.put(`${BASE_URL}/update/${meetingId}`, updates);
//       return response.data.meet || response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to update meet');
//     }
//   }
// );

// // ------------------------------------------------------------------
// // RESCHEDULE MEET
// // ------------------------------------------------------------------
// export const rescheduleMeet = createAsyncThunk(
//   'meet/reschedule',
//   async ({ meetingId, date, startTime, endTime }, { rejectWithValue }) => {
//     try {
//       const duration = Math.round((new Date(endTime) - new Date(startTime)) / 60000);
//       const payload = { date, startTime, endTime, duration };
//       const response = await axiosInstance.put(`${BASE_URL}/update/${meetingId}`, payload);
//       return response.data.meet || response.data;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to reschedule meet');
//     }
//   }
// );

// // ------------------------------------------------------------------
// // DELETE MEET
// // ------------------------------------------------------------------
// export const deleteMeet = createAsyncThunk(
//   'meet/delete',
//   async (meetingId, { rejectWithValue }) => {
//     try {
//       await axiosInstance.delete(`${BASE_URL}/${meetingId}`);
//       return meetingId;
//     } catch (error) {
//       return rejectWithValue(error.response?.data?.message || 'Failed to delete meet');
//     }
//   }
// );

// // ------------------------------------------------------------------
// // SLICE
// // ------------------------------------------------------------------
// const meetSlice = createSlice({
//   name: 'meet',
//   initialState: {
//     meets: [],
//     selectedMeet: null,
//     status: 'idle',
//     createStatus: 'idle',
//     updateStatus: 'idle',
//     error: null,
//   },
//   reducers: {
//     clearSelectedMeet: (state) => {
//       state.selectedMeet = null;
//     },
//     resetCreateStatus: (state) => {
//       state.createStatus = 'idle';
//     },
//     resetUpdateStatus: (state) => {
//       state.updateStatus = 'idle';
//     },
//     clearError: (state) => {
//       state.error = null;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       // Fetch all meets
//       .addCase(fetchMeets.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchMeets.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.meets = action.payload;
//       })
//       .addCase(fetchMeets.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })

//       // Fetch meet by ID
//       .addCase(fetchMeetById.pending, (state) => {
//         state.status = 'loading';
//       })
//       .addCase(fetchMeetById.fulfilled, (state, action) => {
//         state.status = 'succeeded';
//         state.selectedMeet = action.payload;
//       })
//       .addCase(fetchMeetById.rejected, (state, action) => {
//         state.status = 'failed';
//         state.error = action.payload;
//       })

//       // Create meet
//       .addCase(createMeet.pending, (state) => {
//         state.createStatus = 'loading';
//       })
//       .addCase(createMeet.fulfilled, (state, action) => {
//         state.createStatus = 'succeeded';
//         state.meets.push(action.payload);
//       })
//       .addCase(createMeet.rejected, (state, action) => {
//         state.createStatus = 'failed';
//         state.error = action.payload;
//       })

//       // Update meet
//       .addCase(updateMeet.pending, (state) => {
//         state.updateStatus = 'loading';
//       })
//       .addCase(updateMeet.fulfilled, (state, action) => {
//         state.updateStatus = 'succeeded';
//         const index = state.meets.findIndex((m) => m._id === action.payload._id);
//         if (index !== -1) state.meets[index] = action.payload;
//       })
//       .addCase(updateMeet.rejected, (state, action) => {
//         state.updateStatus = 'failed';
//         state.error = action.payload;
//       })

//       // Reschedule meet
//       .addCase(rescheduleMeet.fulfilled, (state, action) => {
//         const index = state.meets.findIndex((m) => m._id === action.payload._id);
//         if (index !== -1) state.meets[index] = action.payload;
//       })

//       // Delete meet
//       .addCase(deleteMeet.fulfilled, (state, action) => {
//         state.meets = state.meets.filter((m) => m._id !== action.payload);
//       });
//   },
// });

// export const {
//   clearSelectedMeet,
//   resetCreateStatus,
//   resetUpdateStatus,
//   clearError,
// } = meetSlice.actions;

// export default meetSlice.reducer;



















// src/store/features/meet/meetSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { axiosInstance } from '@/lib/axios';

const BASE_URL = '/meet';

// ------------------------------------------------------------------
// 1️⃣ CREATE MEETING  → POST /meet/create
// ------------------------------------------------------------------
export const createMeeting = createAsyncThunk(
  'meet/createMeeting',
  async (meetData, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`${BASE_URL}/create`, meetData);
      return response.data.meeting || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create meeting');
    }
  }
);

// ------------------------------------------------------------------
// 2️⃣ GET ALL MEETINGS → GET /meet/all
// ------------------------------------------------------------------
export const fetchAllMeetings = createAsyncThunk(
  'meet/fetchAllMeetings',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/all`);
      return response.data.meetings || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meetings');
    }
  }
);

// ------------------------------------------------------------------
// 3️⃣ GET SINGLE MEETING BY ID → GET /meet/getMeetByMeetId/:meetingId
// ------------------------------------------------------------------
export const fetchMeetingById = createAsyncThunk(
  'meet/fetchMeetingById',
  async (meetingId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/getMeetByMeetId/${meetingId}`);
      return response.data.meeting || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meeting');
    }
  }
);

// ------------------------------------------------------------------
// 4️⃣ UPDATE MEETING → PUT /meet/update/:meetingId
// ------------------------------------------------------------------
export const updateMeeting = createAsyncThunk(
  'meet/updateMeeting',
  async ({ meetingId, updates }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(`${BASE_URL}/update/${meetingId}`, updates);
      return response.data.meeting || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update meeting');
    }
  }
);

// ------------------------------------------------------------------
// 5️⃣ DELETE MEETING → DELETE /meet/delete/:meetingId
// ------------------------------------------------------------------
export const deleteMeeting = createAsyncThunk(
  'meet/deleteMeeting',
  async (meetingId, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`${BASE_URL}/delete/${meetingId}`);
      return meetingId;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete meeting');
    }
  }
);

// ------------------------------------------------------------------
// 6️⃣ GET MEETINGS BY CONTACT → GET /meet/contact/:contactId
// ------------------------------------------------------------------
export const fetchMeetingsByContact = createAsyncThunk(
  'meet/fetchMeetingsByContact',
  async (contactId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(`${BASE_URL}/contact/${contactId}`);
      return response.data.meetings || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch meetings by contact');
    }
  }
);

// ------------------------------------------------------------------
// 7️⃣ UPDATE MEETING STATUS → PATCH /meet/updatestatus/:meetingId
// ------------------------------------------------------------------
export const updateMeetingStatus = createAsyncThunk(
  'meet/updateMeetingStatus',
  async ({ meetingId, meetingStatus, endNote }, { rejectWithValue }) => {
    try {
      const payload = { meetingStatus, endNote };
      const response = await axiosInstance.patch(`${BASE_URL}/updatestatus/${meetingId}`, payload);
      return response.data.meeting || response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update meeting status');
    }
  }
);

// ------------------------------------------------------------------
// SLICE
// ------------------------------------------------------------------
const meetSlice = createSlice({
  name: 'meet',
  initialState: {
    meetings: [],
    selectedMeeting: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    clearSelectedMeeting: (state) => {
      state.selectedMeeting = null;
    },
    clearError: (state) => {
      state.error = null;
    },  resetCreateStatus: (state) => {
      state.createStatus = 'idle';
    },
  },
  extraReducers: (builder) => {
    builder
      // Create meeting
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.meetings.push(action.payload);
      })

      // Fetch all meetings
      .addCase(fetchAllMeetings.fulfilled, (state, action) => {
        state.meetings = action.payload;
      })

      // Fetch meeting by ID
      .addCase(fetchMeetingById.fulfilled, (state, action) => {
        state.selectedMeeting = action.payload;
      })

      // Update meeting
      .addCase(updateMeeting.fulfilled, (state, action) => {
        const index = state.meetings.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.meetings[index] = action.payload;
      })

      // Delete meeting
      .addCase(deleteMeeting.fulfilled, (state, action) => {
        state.meetings = state.meetings.filter(m => m._id !== action.payload);
      })

      // Fetch meetings by contact
      .addCase(fetchMeetingsByContact.fulfilled, (state, action) => {
        state.meetings = action.payload;
      })

      // Update meeting status
      .addCase(updateMeetingStatus.fulfilled, (state, action) => {
        const index = state.meetings.findIndex(m => m._id === action.payload._id);
        if (index !== -1) state.meetings[index] = action.payload;
      })

      // Handle rejections (common)
      .addMatcher(
        (action) => action.type.endsWith('/rejected'),
        (state, action) => {
          state.error = action.payload;
        }
      );
  },
});

export const { clearSelectedMeeting, clearError } = meetSlice.actions;
export default meetSlice.reducer;
