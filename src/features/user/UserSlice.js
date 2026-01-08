// src/features/user/UserSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchUserProfile, updateUserProfile } from '../../apis/user.js';

const initialState = {
  user: null,
  loading: false,
  error: null,
};

// Async thunks
export const getUserProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchUserProfile();
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch profile');
    }
  }
);

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await updateUserProfile(data);
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUser: state => {
      state.user = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // get profile
      .addCase(getUserProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // update profile
      .addCase(updateProfile.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUser } = userSlice.actions;
export default userSlice.reducer;
