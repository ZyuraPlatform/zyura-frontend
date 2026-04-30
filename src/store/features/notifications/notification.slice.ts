import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface NotificationItem {
  _id: string;
  name: string;
  profile_photo?: string;
  report?: {
    questionBankId: string;
    mcqId: string;
    text: string;
  };
  status?: string;
  read?: boolean;
  createdAt?: string;
}

interface NotificationState {
  items: NotificationItem[];
}

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { items: [] } as NotificationState,
  reducers: {
    addNotification: (state, action: PayloadAction<NotificationItem>) => {
      // ✅ Prevent duplicates — don't add if same _id already exists
      const exists = state.items.some((n) => n._id === action.payload._id);
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },
    // ✅ NEW: remove a single notification by reportId (used on click + auto-dismiss)
    removeNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((n) => n._id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } =
  notificationSlice.actions;

export const selectNotifications = (state: any) => state.notifications.items;

export default notificationSlice.reducer;