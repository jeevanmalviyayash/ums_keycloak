import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { addUser, registerUser } from "./registerAction";

export type RegisterFieldErrors = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  city?: string;
  company?: string;
  address?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  roleId?: number;
  group?: string;
  groupId?: number;
};

export interface RegisterState {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  company: string;
  address: string;
  password: string;
  confirmPassword: string;
  role: string;
  roleId: number;
  loading: boolean;
  error: string | null;
  fieldError: RegisterFieldErrors;
  shouldRedirect: boolean;
  group: string;
  groupId: number;
}

const initialState: RegisterState = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  city: "",
  company: "",
  address: "",
  password: "",
  confirmPassword: "",
  role: "",
  roleId: 0,
  loading: false,
  error: null,
  fieldError: {},
  shouldRedirect: false,
  group: "",
  groupId: 0,
};

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    },
    setFieldError(state, action: PayloadAction<RegisterFieldErrors | object>) {
      state.fieldError = action.payload;
    },
    clearFieldError(state) {
      state.fieldError = {};
    },
    setShouldRedirect(state, action: PayloadAction<boolean>) {
      state.shouldRedirect = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldError = {};
        state.shouldRedirect = false;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        state.shouldRedirect = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.shouldRedirect = false;

        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (
          typeof action.payload === "object" &&
          action.payload !== null
        ) {
          state.fieldError = action.payload as RegisterFieldErrors;
        } else {
          state.error = "Registration failed due to an unknown error.";
        }
      })

      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.fieldError = {};
        state.shouldRedirect = false;
      })
      .addCase(addUser.fulfilled, (state) => {
        state.loading = false;
        state.shouldRedirect = true;
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.shouldRedirect = false;

        if (typeof action.payload === "string") {
          state.error = action.payload;
        } else if (
          typeof action.payload === "object" &&
          action.payload !== null
        ) {
          state.fieldError = action.payload as RegisterFieldErrors;
        } else {
          state.error = "AddUser failed due to an unknown error.";
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
} = registerSlice.actions;

export default registerSlice.reducer;
