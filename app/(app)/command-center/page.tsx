"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { JarvisCore, JARVIS_STATE_META } from "@/components/core/JarvisCore";
import { ConversationView } from "@/components/command/ConversationView";
import { CommandBar } from "@/components/command/CommandBar";
import { useChat } from "@/hooks/useChat";
import { useJarvisState } from "@/hooks/useJarvisState";
import { useClearChatHistoryMutation } from "@/store/api";

export default function CommandCenterPage() {
  const [voiceOutputEnabled, setVoiceOutputEnabled] = useState(true);
  const [confirmClear, setConfirmClear] = useState(false);
  const { state } = useJarvisState();
  const { messages, loading, send } = useChat(voiceOutputEnabled);
  const [clearHistory, { isLoading: clearing }] = useClearChatHistoryMutation();
  const hasConversation = messages.length > 0;

  const handleClear = async () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    await clearHistory();
    setConfirmClear(false);
  };

  return (
    <div className="hud-panel flex h-[calc(100dvh-6.5rem)] flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-jarvis-border px-4 py-2">
        <span className="hud-label">COMMAND CENTER</span>
        <div className="flex items-center gap-4">
          {hasConversation && (
            <div className="flex items-center gap-2">
              {confirmClear && (
                <button
                  onClick={() => setConfirmClear(false)}
                  className="hud-label text-jarvis-muted transition-colors hover:text-jarvis-fg"
                >
                  CANCEL
                </button>
              )}
              <button
                onClick={handleClear}
                disabled={clearing}
                aria-label="Clear conversation"
                className={`hud-label flex items-center gap-1.5 transition-colors disabled:opacity-40 ${
                  confirmClear
                    ? "text-jarvis-crit"
                    : "text-jarvis-muted hover:text-jarvis-crit"
                }`}
              >
                <Trash2 className="h-3 w-3" />
                {confirmClear ? "CONFIRM CLEAR?" : "CLEAR"}
              </button>
            </div>
          )}
          <button
            onClick={() => setVoiceOutputEnabled((v) => !v)}
            className="hud-label transition-colors hover:text-jarvis-cyan"
            aria-pressed={voiceOutputEnabled}
          >
            VOICE OUTPUT: {voiceOutputEnabled ? "ON" : "OFF"}
          </button>
        </div>
      </div>

      {hasConversation ? (
        <motion.div
          layout
          className="flex shrink-0 items-center gap-3 border-b border-jarvis-border px-4 py-2.5"
        >
          <JarvisCore state={state} size="xs" />
          <span className="hud-label" style={{ color: JARVIS_STATE_META[state].color }}>
            {JARVIS_STATE_META[state].label}
          </span>
        </motion.div>
      ) : (
        <motion.div
          layout
          className="flex shrink-0 flex-col items-center gap-2 pb-2 pt-10"
        >
          <JarvisCore state={state} size="lg" />
        </motion.div>
      )}

      <ConversationView messages={messages} loading={loading} />

      <div className="shrink-0 border-t border-jarvis-border p-4">
        <CommandBar onSubmit={send} />
      </div>
    </div>
  );
}
