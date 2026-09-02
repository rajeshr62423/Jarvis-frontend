"use client";

import { useEffect, useRef } from "react";
import { ConversationTurn } from "@/components/command/ConversationTurn";
import type { ChatMessage } from "@/lib/types";

export function ConversationView({
  messages,
  loading,
}: {
  messages: ChatMessage[];
  loading: boolean;
}) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length]);

  return (
    <div className="min-h-0 flex-1 overflow-y-auto px-1 py-4">
      <div className="mx-auto flex max-w-2xl flex-col gap-5">
        {loading && (
          <div className="hud-label text-center opacity-50">LOADING CONVERSATION LOG...</div>
        )}
        {!loading && messages.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <span className="hud-label">AWAITING FIRST COMMAND</span>
            <p className="max-w-sm text-xs text-jarvis-muted">
              Speak or type a command below to begin.
            </p>
          </div>
        )}
        {messages.map((message, i) => {
          const previous = messages[i - 1];
          const durationMs =
            message.role === "assistant" && previous?.role === "user"
              ? new Date(message.createdAt).getTime() -
                new Date(previous.createdAt).getTime()
              : undefined;
          return (
            <ConversationTurn
              key={message.id}
              message={message}
              durationMs={durationMs !== undefined && durationMs >= 0 ? durationMs : undefined}
            />
          );
        })}
        <div ref={endRef} />
      </div>
    </div>
  );
}
