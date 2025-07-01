import { createSlice } from '@reduxjs/toolkit';
import {
  checkInUser,
  checkOutUser,
  fetchTodayStatus,
  fetchAttendancePaginated,
} from './attendanceThunks';

const initialState = {
  checkInTime: null,
  checkOutTime: null,
  statusMessage: '',
  records: [],
  loading: false,
  error: null,

  // Pagination & filters
  page: 1,
  totalPages: 1,
  totalRecords: 0,
  filters: {
    from: '',
    to: '',
    user: '',
  },
};

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState,
  reducers: {
    resetStatus: (state) => {
      state.statusMessage = '';
      state.error = null;
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
      state.page = 1; // Reset to page 1 when filters change
    },
  },
  extraReducers: (builder) => {
    builder
      // ✅ Check-in
      .addCase(checkInUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkInUser.fulfilled, (state) => {
        state.loading = false;
        state.checkInTime = new Date().toISOString();
        state.statusMessage = 'Check-in successful';
      })
      .addCase(checkInUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Check-in failed';
      })

      // ✅ Check-out
      .addCase(checkOutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkOutUser.fulfilled, (state) => {
        state.loading = false;
        state.checkOutTime = new Date().toISOString();
        state.statusMessage = 'Check-out successful';
      })
      .addCase(checkOutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Check-out failed';
      })

      // ✅ Fetch today's status
      .addCase(fetchTodayStatus.fulfilled, (state, action) => {
        state.checkInTime = action.payload.checkInTime;
        state.checkOutTime = action.payload.checkOutTime;
      })

      // ✅ Paginated attendance (admin)
      .addCase(fetchAttendancePaginated.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendancePaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.records = action.payload.data;
        state.page = action.payload.page;
        state.totalPages = action.payload.totalPages;
        state.totalRecords = action.payload.totalRecords;
      })
      .addCase(fetchAttendancePaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch attendance';
      });
  },
});

export const { resetStatus, setPage, setFilters } = attendanceSlice.actions;
export default attendanceSlice.reducer;