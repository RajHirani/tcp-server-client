import { configureStore } from "@reduxjs/toolkit";
import serverReducer from "./slices/ServerSlice";
import clientReducer from "./slices/ClientSlice";
import notificationReducer from "./slices/NotificationSlice";
import overlayLoaderReducer from "./slices/OverlayLoaderSlice";
import confirmationModalReducer from "./slices/ConfirmationModalSlice";

export const store = configureStore({
  reducer: {
    server: serverReducer,
    client: clientReducer,
    notification: notificationReducer,
    overlayLoader: overlayLoaderReducer,
    confirmationModal: confirmationModalReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;