import type { RootState } from "@/store/store";

export const selectNotifications = (state: RootState) => state.notifications.items;
export const selectConnectionState = (state: RootState) => state.notifications.connection;
export const selectUnreadCount = (state: RootState) =>
  state.notifications.items.filter((n) => !n.read).length;
