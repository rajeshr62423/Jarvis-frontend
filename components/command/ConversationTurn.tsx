"use client";

import { useState, useSyncExternalStore } from "react";
import { motion } from "framer-motion";
import { Check, Copy, Pause, Play, Trash2, Volume2 } from "lucide-react";
import {
  getSpeechState,
  pauseSpeaking,
  resumeSpeaking,
  speak,
  subscribeSpeechState,
  type SpeechPlaybackState,
} from "@/services/audio/speech-synthesis";
import { useDeleteChatMessageMutation } from "@/store/api";
import type { ChatMessage } from "@/lib/types";
import { MarkdownMessage } from "@/components/command/MarkdownMessage";

function formatDuration(ms: number) {
  return ms < 1000 ? `${ms}MS` : `${(ms / 1000).toFixed(1)}S`;
}

export function ConversationTurn({
  message,
  durationMs,
}: {
  message: ChatMessage;
  durationMs?: number;
}) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);
  const [deleteMessage, { isLoading: deleting }] = useDeleteChatMessageMutation();
  const playback = useSyncExternalStore(
    (onChange) => subscribeSpeechState(() => onChange()),
    () => {
      const current = getSpeechState();
      return current.id === message.id ? current.state : "stopped";
    },
    (): SpeechPlaybackState => "stopped",
  );
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  const handlePlayPause = () => {
    if (playback === "playing") {
      pauseSpeaking();
    } else if (playback === "paused") {
      resumeSpeaking();
    } else {
      speak(message.id, message.content);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex flex-col gap-1.5 ${isUser ? "items-end text-right" : "items-start text-left"}`}
    >
      <span className="hud-label" style={{ color: isUser ? "var(--jarvis-muted)" : "var(--jarvis-cyan)" }}>
        {isUser ? "USER COMMAND" : "JARVIS RESPONSE"} · {time}
        {durationMs !== undefined && ` · ${formatDuration(durationMs)}`}
      </span>
      <div
        className={`group max-w-[85%] rounded-sm border px-4 py-3 text-sm leading-relaxed sm:max-w-[70%] ${
          isUser
            ? "border-jarvis-border bg-white/[0.02] text-jarvis-fg/90"
            : "border-jarvis-border-strong bg-jarvis-glow/10 text-jarvis-fg"
        }`}
      >
        {isUser ? (
          <span className="align-middle">{message.content}</span>
        ) : (
          <MarkdownMessage content={message.content} />
        )}
        <span className="ml-3 inline-flex items-center gap-2 align-middle">
          {!isUser && (
            <button
              onClick={handlePlayPause}
              aria-label={
                playback === "playing"
                  ? "Pause response audio"
                  : playback === "paused"
                    ? "Resume response audio"
                    : "Play response audio"
              }
              className="text-jarvis-muted transition-colors hover:text-jarvis-cyan"
            >
              {playback === "playing" ? (
                <Pause className="h-3.5 w-3.5" />
              ) : playback === "paused" ? (
                <Play className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
            </button>
          )}
          <button
            onClick={handleCopy}
            aria-label="Copy message text"
            className="text-jarvis-muted transition-colors hover:text-jarvis-cyan"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 text-jarvis-ok" />
            ) : (
              <Copy className="h-3.5 w-3.5" />
            )}
          </button>
          <button
            onClick={() => deleteMessage(message.id)}
            disabled={deleting}
            aria-label="Delete message"
            className="text-jarvis-muted transition-colors hover:text-jarvis-crit disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </span>
      </div>
    </motion.div>
  );
}
