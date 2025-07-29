import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { updateRole } from "./roleAction";
import { updateUser } from "../editUser/editUseraction";

export type RoleFieldError = {
  name?: string;
  description?: string;
    group?: string;
  groupId?: number;
};

export interface roleState {
  id: number;
  role: string;
  description: string;
  fieldError: RoleFieldError;
  shouldRedirect: boolean;
    group: string;
  groupId: number;
}

const initialState: roleState = {
  id: 0,
  role: "",
  description: "",
  fieldError: {},
  shouldRedirect: false,
    group: "",
  groupId: 0,
};

const roleSlice = createSlice({
  name: "roleSlice",
  initialState,
  reducers: {
    setRole(state, action: PayloadAction<string>) {
      state.role = action.payload;
    },
    setFieldError(state, action: PayloadAction<RoleFieldError | object>) {
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

export const { setRole, setFieldError, setShouldRedirect, clearFieldError } =
  roleSlice.actions;

export default roleSlice.reducer;
