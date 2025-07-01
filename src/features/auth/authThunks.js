import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api';

export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      return res.data;
    } catch (err) {
      console.error("Login thunk error:", err.response?.data || err.message);
      return rejectWithValue(err.response?.data || 'Login error');
    }
  }
);
