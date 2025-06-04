import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ConfirmationModalState {
  visible: boolean;
  title?: string;
  message?: string;
  onConfirm?: (() => void) | null;
  onCancel?: (() => void) | null;
}

const initialState: ConfirmationModalState = {
  visible: false,
  title: "Are you sure?",
  message: "This action cannot be undone.",
  onConfirm: null,
};

const confirmationModalSlice = createSlice({
  name: "confirmationModal",
  initialState,
  reducers: {
    showConfirmationModal(
      state,
      action: PayloadAction<{ title?: string; message?: string; onConfirm?: () => void; onCancel?: () => void }>
    ) {
      state.visible = true;
      state.title = action.payload.title || "Are you sure?";
      state.message = action.payload.message || "This action cannot be undone.";
      state.onConfirm = action.payload.onConfirm || null;
      state.onCancel = action.payload.onCancel || null;
    },
    hideConfirmationModal(state) {
      state.visible = false;
      state.onConfirm = null;
      state.onCancel = null;
    },
  },
});

export const { showConfirmationModal, hideConfirmationModal } = confirmationModalSlice.actions;
export default confirmationModalSlice.reducer;