import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface modalState {
  message: string;
  isOpen: boolean;
}

const initialState: modalState = {
  message: "",
  isOpen: false,
};

const modalSlice = createSlice({
  name: "modal",
  initialState,
  reducers: {
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    setIsOpen(state, action: PayloadAction<boolean>) {
      state.isOpen = action.payload;
    },
    closeModal(state) {
      state.isOpen = false;
      state.message = "";
    },
  },
});

export const { setMessage, setIsOpen, closeModal } = modalSlice.actions;

export default modalSlice.reducer;
