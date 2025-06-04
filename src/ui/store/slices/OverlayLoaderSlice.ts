import { createSlice } from "@reduxjs/toolkit";

interface OverlayLoaderState {
  visible: boolean;
  message?: string;
}

const initialState: OverlayLoaderState = {
  visible: false,
  message: undefined,
};

const overlayLoaderSlice = createSlice({
  name: "overlayLoader",
  initialState,
  reducers: {
    showLoader(state, action) {
      state.visible = true;
      state.message = action.payload || undefined;
    },
    hideLoader(state) {
      state.visible = false;
      state.message = undefined;
    },
  },
});

export const { showLoader, hideLoader } = overlayLoaderSlice.actions;
export default overlayLoaderSlice.reducer;