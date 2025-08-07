import { createAsyncThunk } from '@reduxjs/toolkit';
 import api from '../../api';
// Check-in
export const checkInUser = createAsyncThunk(
  'attendance/checkIn',
  async (location, { rejectWithValue }) => {
    try {
      await api.post('/attendance/checkin', location);
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Check-in error');
    }
  }
);

// Check-out
export const checkOutUser = createAsyncThunk(
  'attendance/checkOut',
  async (location, { rejectWithValue }) => {
    try {
      await api.post('/attendance/checkout', location);
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Check-out error');
    }
  }
);

// Admin – Load all records
// export const loadAllRecords = createAsyncThunk(
//   'attendance/loadAllRecords',
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await api.get('/attendance/all');
//       return res.data;
//     } catch (err) {
//       return rejectWithValue(err.response?.data || 'Failed to load records');
//     }
//   }
// );

export const fetchAttendancePaginated = createAsyncThunk(
  'attendance/fetchPaginated',
  async ({ page, limit, from, to, user }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', page);
      queryParams.append('limit', limit);
      if (from) queryParams.append('from', from);
      if (to) queryParams.append('to', to);
      if (user) queryParams.append('user', user);

      console.log('FETCHING:', queryParams.toString()); // Optional debug

      const response = await api.get(`/attendance/all?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Fetch failed');
    }
  }
);
export const fetchAttendanceExport = createAsyncThunk(
  'attendance/fetchAttendanceExport',
  async ({ from, to, user }, thunkAPI) => {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', 0);
      queryParams.append('limit', 0);
      if (from) queryParams.append('from', from);
      if (to) queryParams.append('to', to);
      if (user) queryParams.append('user', user);

      console.log('FETCHING:', queryParams.toString()); // Optional debug

      const response = await api.get(`/attendance/all?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.error || 'Fetch failed');
    }
  }
);



// Optional: fetch today’s status (use if you build route in backend)
export const fetchTodayStatus = createAsyncThunk(
  'attendance/fetchTodayStatus',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get('/attendance/status/today');
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || 'Status fetch error');
    }
  }
);
