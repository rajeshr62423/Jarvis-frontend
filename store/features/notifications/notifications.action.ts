import { createAction } from "@reduxjs/toolkit";
import {
  ALL_NOTIFICATIONS_MARKED_READ,
  CONNECTION_STATE_CHANGED,
  NOTIFICATIONS_LOADED,
  NOTIFICATIONS_RESET,
  NOTIFICATION_MARKED_READ,
  NOTIFICATION_RECEIVED,
  NOTIFICATION_REMOVED,
} from "@/store/features/notifications/notifications.actionType";
import type { ConnectionState, Notification } from "@/lib/types";

export const notificationsLoaded = createAction<Notification[]>(NOTIFICATIONS_LOADED);
export const notificationReceived = createAction<Notification>(NOTIFICATION_RECEIVED);
export const notificationMarkedRead = createAction<string>(NOTIFICATION_MARKED_READ);
export const allNotificationsMarkedRead = createAction(ALL_NOTIFICATIONS_MARKED_READ);
export const notificationRemoved = createAction<string>(NOTIFICATION_REMOVED);
export const connectionStateChanged = createAction<ConnectionState>(
  CONNECTION_STATE_CHANGED,
);
export const notificationsReset = createAction(NOTIFICATIONS_RESET);
