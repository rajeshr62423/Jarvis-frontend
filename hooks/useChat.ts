"use client";

import { useCallback, useEffect, useRef } from "react";
import { useGetChatHistoryQuery, useSendChatMessageMutation } from "@/store/api";
import { speak, stopSpeaking } from "@/services/audio/speech-synthesis";
import { useJarvisState } from "@/hooks/useJarvisState";

export function useChat(voiceOutputEnabled: boolean) {
  const { data: messages = [], isLoading } = useGetChatHistoryQuery();
  const [sendChatMessage] = useSendChatMessageMutation();
  const { setThinking, setSpeaking, setIdle, setError } = useJarvisState();
  const voiceOutputEnabledRef = useRef(voiceOutputEnabled);
  useEffect(() => {
    voiceOutputEnabledRef.current = voiceOutputEnabled;
  });

  const send = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed) return;

      setThinking(trimmed);
      try {
        const { assistantMessage } = await sendChatMessage(trimmed).unwrap();

        if (voiceOutputEnabledRef.current) {
          setSpeaking();
          speak(assistantMessage.id, assistantMessage.content, { onEnd: () => setIdle() });
        } else {
          setIdle();
        }
      } catch {
        setError("COMMAND FAILED TO REACH JARVIS CORE");
      }
    },
    [sendChatMessage, setThinking, setSpeaking, setIdle, setError],
  );

  useEffect(() => stopSpeaking, []);

  return { messages, loading: isLoading, send };
}
