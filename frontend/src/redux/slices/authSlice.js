import { createSlice } from '@reduxjs/toolkit';

const saved = JSON.parse(localStorage.getItem('auth')) || { user: null, accessToken: null };

const initialState = {
  user: saved.user,
  accessToken: saved.accessToken,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth: (state, action) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      localStorage.setItem('auth', JSON.stringify({ user: state.user, accessToken: state.accessToken }));
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      localStorage.removeItem('auth');
    }
  }
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
