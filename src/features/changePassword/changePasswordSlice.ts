import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChangePasswordFieldErrors } from "./changePasswordTypes";
//import { ChangePasswordFieldErrors } from "./changePasswordTypes";

interface ChangePasswordState {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  loading: boolean;
  error: string | null;
  fieldError: ChangePasswordFieldErrors;
  shouldRedirect: boolean;
}

const initialState: ChangePasswordState = {
  currentPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  loading: false,
  error: null,
  fieldError: {},
  shouldRedirect: false,
};

const changePassword = createSlice({
  name: "changePassword",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setFieldError(state, action: PayloadAction<ChangePasswordFieldErrors | object>) {
      state.fieldError = action.payload;
    },
    clearFieldError(state) {
      state.fieldError = {};
    },
    setShouldRedirect(state, action: PayloadAction<boolean>) {
      state.shouldRedirect = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  setFieldError,
  clearFieldError,
  setShouldRedirect,
} = changePassword.actions;

export default changePassword.reducer;
