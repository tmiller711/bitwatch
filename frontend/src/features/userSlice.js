import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  authenticated: false,
  currentUser: null,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      console.log('aofjasif')
      state.authenticated = true;
      state.currentUser = action.payload;
    },
    loginFailure(state, action) {
      state.error = action.payload;
    },
    logout(state) {
      console.log("logout")
      state.authenticated = false;
      state.currentUser = null;
    },
  },
});

export const { loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;