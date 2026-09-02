"use client";

import { motion } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import type { JarvisState } from "@/lib/types";

export function VoiceControl({
  state,
  supported,
  onPress,
  compact = false,
}: {
  state: JarvisState;
  supported: boolean;
  onPress: () => void;
  compact?: boolean;
}) {
  const active = state === "listening";
  const color = state === "error" ? "var(--jarvis-crit)" : "var(--jarvis-cyan)";

  return (
    <button
      type="button"
      onClick={onPress}
      disabled={!supported}
      aria-pressed={active}
      aria-label={
        supported
          ? "Toggle voice input"
          : "Voice input unsupported in this browser"
      }
      title={
        supported
          ? "Voice command"
          : "Voice input needs a Chromium-based browser"
      }
      className={`relative flex shrink-0 items-center justify-center border transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${compact ? "command-voice-button h-11 w-11 rounded-md" : "h-12 w-12 rounded-full"}`}
      style={{
        borderColor: active ? color : "var(--jarvis-border-strong)",
        background: active ? "var(--jarvis-glow)" : "transparent",
      }}
    >
      {active && (
        <>
          <motion.span
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: color }}
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
          <motion.span
            className="absolute inset-0 rounded-full border"
            style={{ borderColor: color }}
            animate={{ scale: [1, 1.6], opacity: [0.6, 0] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.5,
            }}
          />
        </>
      )}
      {supported ? (
        <Mic className="h-5 w-5" style={{ color }} />
      ) : (
        <MicOff className="h-5 w-5 text-jarvis-muted" />
      )}
    </button>
  );
}
