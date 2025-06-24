import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { AuthState, LoginCredentials, RegisterCredentials } from '../types/auth';
import { apiClient } from '../utils/api';

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null
};

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      const { token, user } = response.data;
      localStorage.setItem('authToken', token);
      return { token, user };
    } catch (error: any) {
      const message = error.response?.data?.message || 'Login failed';
      return rejectWithValue(message);
    }
  }
);

export const validateToken = createAsyncThunk(
  'auth/validateToken',
  async (token: string, { rejectWithValue }) => {
    try {
      const response = await apiClient.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data.user;
    } catch (error: any) {
      localStorage.removeItem('authToken');
      return rejectWithValue('Token validation failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('authToken');
      return { ...initialState, isLoading: false };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(validateToken.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.isLoading = false;
      })
      .addCase(validateToken.rejected, (state) => {
        return { ...initialState, isLoading: false };
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;