"use client";

import { useNotifications } from "@/hooks/useNotifications";
import { StatusIndicator } from "@/components/hud/StatusIndicator";
import type { ConnectionState } from "@/lib/types";

const LABEL: Record<ConnectionState, string> = {
  connected: "CONNECTED",
  connecting: "CONNECTING",
  reconnecting: "RECONNECTING",
  disconnected: "OFFLINE",
};

const TONE: Record<ConnectionState, "ok" | "warn" | "muted"> = {
  connected: "ok",
  connecting: "warn",
  reconnecting: "warn",
  disconnected: "muted",
};

export function ConnectionIndicator() {
  const { connection } = useNotifications();
  return (
    <StatusIndicator
      label={LABEL[connection]}
      tone={TONE[connection]}
      pulse={connection === "connecting" || connection === "reconnecting"}
    />
  );
}
