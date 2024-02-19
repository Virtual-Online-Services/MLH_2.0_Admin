import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: sessionStorage.getItem("userInfo")
    ? JSON.parse(sessionStorage.getItem("userInfo"))
    : null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      // sessionStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      // sessionStorage.removeItem("userInfo");
      // sessionStorage.removeItem("email");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export default authSlice.reducer;
