"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useNotifications } from "@/hooks/useNotifications";
import type { ConnectionState } from "@/lib/types";

const MESSAGE: Partial<Record<ConnectionState, string>> = {
  connecting: "ESTABLISHING SECURE CONNECTION...",
  reconnecting: "CONNECTION LOST — ATTEMPTING TO RECONNECT...",
  disconnected: "CONNECTION LOST — RETRYING...",
};

export function ConnectionBanner() {
  const { connection } = useNotifications();
  const message = MESSAGE[connection];

  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden"
        >
          <div
            className="hud-mono flex items-center justify-center gap-2 border py-1.5 text-[0.65rem] tracking-[0.15em]"
            style={{
              borderColor: "var(--jarvis-warn)",
              color: "var(--jarvis-warn)",
              background: "color-mix(in srgb, var(--jarvis-warn) 8%, transparent)",
            }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-jarvis-warn" />
            {message}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
