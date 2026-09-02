import { api } from "@/services/api/client";
import type { Notification } from "@/lib/types";

export function listNotifications() {
  return api<Notification[]>("/notifications");
}

export function markNotificationRead(id: string) {
  return api<Notification>(`/notifications/${id}/read`, { method: "PATCH" });
}

export function markAllNotificationsRead() {
  return api<{ count: number }>("/notifications/read-all", { method: "POST" });
}

export function deleteNotification(id: string) {
  return api<Notification>(`/notifications/${id}`, { method: "DELETE" });
}
