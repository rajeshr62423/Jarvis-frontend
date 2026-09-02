"use client";

import { useEffect } from "react";
import * as notificationsApi from "@/services/api/notifications";
import { getSocket } from "@/services/websocket/socket";
import { useAppDispatch } from "@/store/hooks";
import { useAuth } from "@/hooks/useAuth";
import {
  connectionStateChanged,
  notificationReceived,
  notificationsLoaded,
  notificationsReset,
} from "@/store/features/notifications/notifications.action";
import { showToast } from "@/store/features/toast/toast.action";
import type { ToastTone } from "@/store/features/toast/toast.types";
import type { Notification } from "@/lib/types";

const TONE_BY_TYPE: Record<string, ToastTone> = {
  success: "success",
  error: "error",
  warning: "warning",
};

function toneForType(type: string): ToastTone {
  return TONE_BY_TYPE[type.toLowerCase()] ?? "info";
}

/**
 * Mounted once in the authenticated app shell. Owns the Socket.IO
 * connection lifecycle and the initial REST fetch; all state it produces
 * lives in the notifications slice so any component can read it.
 */
export function useNotificationsSocket() {
  const dispatch = useAppDispatch();
  const { status, user } = useAuth();

  useEffect(() => {
    if (status !== "authenticated" || !user) return;

    let cancelled = false;
    notificationsApi
      .listNotifications()
      .then((list) => {
        if (!cancelled) dispatch(notificationsLoaded(list));
      })
      .catch(() => {});

    const socket = getSocket();
    dispatch(connectionStateChanged("connecting"));
    socket.connect();

    const handleConnect = () => {
      dispatch(connectionStateChanged("connected"));
      socket.emit("join", user.id);
    };
    const handleDisconnect = () => dispatch(connectionStateChanged("disconnected"));
    const handleReconnectAttempt = () =>
      dispatch(connectionStateChanged("reconnecting"));
    const handleNotification = (notification: Notification) => {
      dispatch(notificationReceived(notification));
      dispatch(
        showToast({
          id: notification.id,
          title: notification.title,
          message: notification.message,
          tone: toneForType(notification.type),
        }),
      );
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.io.on("reconnect_attempt", handleReconnectAttempt);
    socket.on("notification", handleNotification);

    if (socket.connected) handleConnect();

    return () => {
      cancelled = true;
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.io.off("reconnect_attempt", handleReconnectAttempt);
      socket.off("notification", handleNotification);
      socket.disconnect();
      dispatch(notificationsReset());
    };
  }, [status, user, dispatch]);
}
