import type { ConnectionState, Notification } from "@/lib/types";

export type NotificationsState = {
  items: Notification[];
  connection: ConnectionState;
};
