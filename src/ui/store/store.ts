import { configureStore } from "@reduxjs/toolkit";
import serverReducer from "./slices/ServerSlice";
import clientReducer from "./slices/ClientSlice";

export const store = configureStore({
  reducer: {
    server: serverReducer,
    client: clientReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;