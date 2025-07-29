import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface tokenState {
  token: string;
  isAuthenticated: boolean;
}

const initialState: tokenState = {
  token: "",
  isAuthenticated: false,
};

const tokenSlice = createSlice({
  name: "token",
  initialState,
  reducers: {
    setToken(state, action: PayloadAction<string>) {
      state.token = action.payload;
    },
    setIsAuthentication(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    clearToken(state) {
      state.isAuthenticated = false;
      state.token = "";
    },
  },
});

export const { setToken, setIsAuthentication, clearToken } = tokenSlice.actions;

export default tokenSlice.reducer;
