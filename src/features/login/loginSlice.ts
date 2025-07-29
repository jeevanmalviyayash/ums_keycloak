import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "./loginAction";

export type LoginFieldErrors = {
  email?: string;
  password?: string;
};

export interface LoginState {
  email: string;
  password: string;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  fieldError: LoginFieldErrors;
  shouldRedirect: boolean;
  role: string;
  roleId: string;
  user: {};
   groupId: number;
}

const initialState: LoginState = {
  email: "",
  password: "",
  isAuthenticated: false,
  loading: false,
  error: null,
  fieldError: {},
  shouldRedirect: false,
  role: "",
  user: {},
  roleId: "",
   groupId:0
};

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setFieldError(state, action: PayloadAction<LoginFieldErrors | object>) {
      state.fieldError = action.payload;
    },
    clearFieldError(state) {
      state.fieldError = {};
    },
    setShouldRedirect(state, action: PayloadAction<boolean>) {
      state.shouldRedirect = action.payload;
    },
    setIsAuthentication(state, action: PayloadAction<boolean>) {
      state.isAuthenticated = action.payload;
    },
    setRole(state, action: PayloadAction<string>) {
      state.role = action.payload;
    },
    setUser(state, action: PayloadAction<string>) {
      state.user = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldError = {};
        state.shouldRedirect = false;
      })
      .addCase(loginUser.fulfilled, (state) => {
        state.loading = false;
        state.shouldRedirect = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.shouldRedirect = false;

        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (
          typeof action.payload === "object" &&
          action.payload !== null
        ) {
          state.fieldError = action.payload as LoginFieldErrors;
        } else {
          state.error = "Registration failed due to an unknown error.";
        }
      });
  },
});

export const {
  setLoading,
  setError,
  setFieldError,
  clearFieldError,
  setShouldRedirect,
  setIsAuthentication,
  setRole,
  setUser,
} = loginSlice.actions;

export default loginSlice.reducer;
