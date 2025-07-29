import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type ProfileFieldError = {
  phoneNumber?: string;
  city?: string;
  company?: string;
  address?: string;
};

interface ProfileState {
  phoneNumber: string;
  city: string;
  company: string;
  address: string;
  fieldError: ProfileFieldError;
  shouldRedirect: boolean;
}

const initialState: ProfileState = {
  phoneNumber: "",
  city: "",
  address: "",
  company: "",
  fieldError: {},
  shouldRedirect: false,
};

const profile = createSlice({
  name: "profile",
  initialState,
  reducers: {
    setFieldError(state, action: PayloadAction<ProfileFieldError | object>) {
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

export const { setFieldError, clearFieldError, setShouldRedirect } =
  profile.actions;

export default profile.reducer;
