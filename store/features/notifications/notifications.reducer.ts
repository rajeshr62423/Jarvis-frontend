import { createReducer } from "@reduxjs/toolkit";
import {
  allNotificationsMarkedRead,
  connectionStateChanged,
  notificationMarkedRead,
  notificationReceived,
  notificationRemoved,
  notificationsLoaded,
  notificationsReset,
} from "@/store/features/notifications/notifications.action";
import type { NotificationsState } from "@/store/features/notifications/notifications.types";

const initialState: NotificationsState = {
  items: [],
  connection: "disconnected",
};

export const notificationsReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(notificationsLoaded, (state, action) => {
      state.items = action.payload;
    })
    .addCase(notificationReceived, (state, action) => {
      state.items.unshift(action.payload);
    })
    .addCase(notificationMarkedRead, (state, action) => {
      const notification = state.items.find((n) => n.id === action.payload);
      if (notification) notification.read = true;
    })
    .addCase(allNotificationsMarkedRead, (state) => {
      state.items.forEach((n) => {
        n.read = true;
      });
    })
    .addCase(notificationRemoved, (state, action) => {
      state.items = state.items.filter((n) => n.id !== action.payload);
    })
    .addCase(connectionStateChanged, (state, action) => {
      state.connection = action.payload;
    })
    .addCase(notificationsReset, (state) => {
      state.items = [];
      state.connection = "disconnected";
    });
});
