import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notifications",
  initialState: { items: [] as any[] },
  reducers: {
    addNotification: (state, action) => {
      state.items.unshift(action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export const selectNotifications = (state: any) => state.notifications.items;
export default notificationSlice.reducer;