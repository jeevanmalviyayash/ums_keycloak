import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GroupFieldError = {
  name?: string;
  description?: string;
};

export interface GroupState {
  id: number;
  name: string;
  description: string;
  fieldError: GroupFieldError;
  shouldRedirect: boolean;
}

const initialState: GroupState = {
  id: 0,
  name: "",
  description: "",
  fieldError: {},
  shouldRedirect: false,
};

const groupSlice = createSlice({
  name: "groupSlice",
  initialState,
  reducers: {
    setGroupName(state, action: PayloadAction<string>) {
      state.name = action.payload;
    },
    setGroupDescription(state, action: PayloadAction<string>) {
      state.description = action.payload;
    },
    setGroupFieldError(state, action: PayloadAction<GroupFieldError | object>) {
      state.fieldError = action.payload;
    },
    clearGroupFieldError(state) {
      state.fieldError = {};
    },
    setGroupShouldRedirect(state, action: PayloadAction<boolean>) {
      state.shouldRedirect = action.payload;
    },
  },
});

export const {
  setGroupName,
  setGroupDescription,
  setGroupFieldError,
  clearGroupFieldError,
  setGroupShouldRedirect,
} = groupSlice.actions;

export default groupSlice.reducer;
