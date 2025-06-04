import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type NotificationType = "success" | "danger" | "warning" | "info";

export interface NotificationItem {
  id: number;
  message: string;
  type: NotificationType;
  duration: number; // Optional duration for auto-dismiss
}

interface NotificationState {
  notifications: NotificationItem[];
}

const initialState: NotificationState = {
  notifications: [],
};

let idCounter = 0;

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNotification: {
      reducer(state, action: PayloadAction<NotificationItem>) {
        state.notifications.push(action.payload);
      },
      prepare(message: string, type: NotificationType = "info", duration: number = 2000) {
        return {
          payload: {
            id: ++idCounter,
            message,
            type,
            duration
          },
        };
      },
    },
    removeNotification(state, action: PayloadAction<number>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
    },
    clearNotifications(state) {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;