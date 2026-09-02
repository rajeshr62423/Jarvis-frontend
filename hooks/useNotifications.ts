"use client";

import { useCallback } from "react";
import * as notificationsApi from "@/services/api/notifications";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  allNotificationsMarkedRead,
  notificationMarkedRead,
  notificationRemoved,
} from "@/store/features/notifications/notifications.action";
import {
  selectConnectionState,
  selectNotifications,
  selectUnreadCount,
} from "@/store/features/notifications/notifications.selector";

export function useNotifications() {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const connection = useAppSelector(selectConnectionState);
  const unreadCount = useAppSelector(selectUnreadCount);

  const markRead = useCallback(
    (id: string) => {
      dispatch(notificationMarkedRead(id));
      notificationsApi.markNotificationRead(id).catch(() => {});
    },
    [dispatch],
  );

  const markAllRead = useCallback(() => {
    dispatch(allNotificationsMarkedRead());
    notificationsApi.markAllNotificationsRead().catch(() => {});
  }, [dispatch]);

  const remove = useCallback(
    (id: string) => {
      dispatch(notificationRemoved(id));
      notificationsApi.deleteNotification(id).catch(() => {});
    },
    [dispatch],
  );

  return { notifications, unreadCount, connection, markRead, markAllRead, remove };
}
