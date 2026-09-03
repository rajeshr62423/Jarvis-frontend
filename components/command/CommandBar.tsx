"use client";

import { useEffect, useRef, useState } from "react";
import { LoaderCircle, Paperclip, Send } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { VoiceControl } from "@/components/command/VoiceControl";
import { JarvisCore } from "@/components/core/JarvisCore";
import { useJarvisState } from "@/hooks/useJarvisState";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useAssistantIdentity } from "@/hooks/useAssistantIdentity";
import type { JarvisState } from "@/lib/types";

export function CommandBar({ onSubmit }: { onSubmit: (text: string) => void }) {
  const [value, setValue] = useState("");
  const { state, lastError } = useJarvisState();
  const { supported, interim, start, stop } = useVoiceInput((transcript) => {
    onSubmit(transcript);
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const identity = useAssistantIdentity();

  const STATE_LABEL: Partial<Record<JarvisState, string>> = {
    listening: "LISTENING...",
    thinking: "ANALYZING...",
    speaking: `${identity} SPEAKING...`,
    executing: "EXECUTING...",
    error: "COMMAND ERROR",
  };

  const busy =
    state === "thinking" || state === "speaking" || state === "executing";
  const statusLabel = STATE_LABEL[state];

  // Re-focus the command box once the assistant is free to take the next
  // command,
  // instead of leaving it to the browser's inconsistent disabled->enabled
  // focus-restore behavior.
  useEffect(() => {
    if (!busy && state !== "listening") inputRef.current?.focus();
  }, [busy, state]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || busy) return;
    onSubmit(value);
    setValue("");
  };

  return (
    <div className="jarvis-command-console flex flex-col gap-2">
      <div className="command-status-line h-4">
        <AnimatePresence mode="wait">
          {statusLabel && (
            <motion.span
              key={statusLabel}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="hud-label"
              style={{
                color:
                  state === "error"
                    ? "var(--jarvis-crit)"
                    : "var(--jarvis-cyan)",
              }}
            >
              {state === "error" && lastError ? lastError : statusLabel}
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <form
        onSubmit={handleSubmit}
        className={`jarvis-command-bar hud-panel flex flex-wrap items-center gap-2 p-2 ${state === "listening" ? "is-listening" : ""}`}
      >
        {state === "listening" && (
          <div className="inline-voice-panel w-full" aria-live="polite">
            <div className="inline-voice-header">
              <span className="voice-status-line">
                <i /> SYSTEM ACTIVE
              </span>
              <span className="hud-display inline-voice-title">
                {identity} LISTENING
              </span>
            </div>
            <div className="inline-voice-reactor">
              <JarvisCore state={state} size="sm" />
            </div>
            <div
              className="inline-voice-waveform"
              aria-label="Live voice activity"
              role="img"
            >
              {Array.from({ length: 26 }, (_, index) => (
                <i
                  key={index}
                  style={{ "--wave-index": index } as React.CSSProperties}
                />
              ))}
            </div>
            <div className="inline-voice-transcript">
              <span className="hud-label">
                {interim ? "YOU ARE SPEAKING" : "LIVE TRANSCRIPTION"}
              </span>
              <span>{interim || "Listening for your command..."}</span>
            </div>
          </div>
        )}
        <VoiceControl
          state={state}
          supported={supported}
          compact
          onPress={() => (state === "listening" ? stop() : start())}
        />
        <div className="command-input-wrapper flex min-w-0 flex-1 flex-col justify-center">
          <input
            ref={inputRef}
            value={state === "listening" ? interim || value : value}
            onChange={(e) => setValue(e.target.value)}
            disabled={state === "listening" || busy}
            placeholder={`Ask ${identity} anything...`}
            className="hud-input hud-command-input hud-mono w-full text-sm"
          />
          <div className="command-input-status hud-label" aria-live="polite">
            <span className={`command-status-dot ${busy ? "is-busy" : ""}`} />
            {busy ? (statusLabel ?? "PROCESSING") : `${identity} READY`}
          </div>
        </div>
        {state === "listening" && (
          <button
            type="button"
            onClick={stop}
            className="inline-stop-button hud-label rounded-md border border-jarvis-border-strong px-3 py-2 text-jarvis-cyan transition-colors hover:bg-jarvis-glow/20"
          >
            STOP
          </button>
        )}
        <div className="command-actions flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled
            aria-label="Attachments are not available"
            title="Attachments are not available yet"
            className="command-action-button hidden h-10 w-10 items-center justify-center rounded-md border border-transparent text-jarvis-muted sm:flex"
          >
            <Paperclip className="h-4 w-4" />
          </button>
          <button
            type="submit"
            disabled={busy || !value.trim()}
            aria-label={busy ? `${identity} is processing` : "Send command"}
            className="command-send-button flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-jarvis-border-strong text-jarvis-cyan transition-colors disabled:cursor-not-allowed disabled:opacity-35"
          >
            {busy ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
