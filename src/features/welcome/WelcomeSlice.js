import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: 'Welcome to the Football Shop App!',
};

const welcomeSlice = createSlice({
  name: 'welcome',
  initialState,
  reducers: {
    setMessage: (state, action) => {
      state.message = action.payload;
    },
  },
});

export const { setMessage } = welcomeSlice.actions;
export default welcomeSlice.reducer;
