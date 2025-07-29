import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateUser } from "./editUseraction";

export type EditUserFieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  company?: string;
  address?: string;
  role?: string;
  roleId?: number;
};

interface EditUserState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  company: string;
  address: string;
  role: string;
  roleId: number;
  loading: boolean;
  error: string | null;
  fieldError: EditUserFieldErrors;
  shouldRedirect: boolean;
}

const initialState: EditUserState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  city: "",
  company: "",
  address: "",
  role: "",
  roleId: 0,
  loading: false,
  error: null,
  fieldError: {},
  shouldRedirect: false,
};

const editUser = createSlice({
  name: "editUser",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setFieldError(state, action: PayloadAction<EditUserFieldErrors | object>) {
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
} = editUser.actions;

export default editUser.reducer;
