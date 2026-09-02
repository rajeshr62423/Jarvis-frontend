"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  VoiceInputController,
  isSpeechRecognitionSupported,
} from "@/services/audio/speech-recognition";
import { useJarvisState } from "@/hooks/useJarvisState";

export function useVoiceInput(onFinalTranscript: (text: string) => void) {
  const [supported] = useState(() => isSpeechRecognitionSupported());
  const controllerRef = useRef<VoiceInputController | null>(null);
  const [interim, setInterim] = useState("");
  const { state, setListening, setIdle, setError } = useJarvisState();
  const onFinalRef = useRef(onFinalTranscript);
  useEffect(() => {
    onFinalRef.current = onFinalTranscript;
  });

  const stop = useCallback(() => {
    controllerRef.current?.stop();
    controllerRef.current = null;
  }, []);

  const start = useCallback(() => {
    if (!supported) return;
    setInterim("");
    const controller = new VoiceInputController();
    controllerRef.current = controller;

    const started = controller.start({
      onInterim: setInterim,
      onFinal: (transcript) => {
        setInterim("");
        if (transcript) onFinalRef.current(transcript);
      },
      onEnd: () => {
        controllerRef.current = null;
        setIdle();
      },
      onError: (error) => {
        controllerRef.current = null;
        if (error !== "aborted" && error !== "no-speech") {
          setError("VOICE INPUT UNAVAILABLE");
        } else {
          setIdle();
        }
      },
    });

    if (started) setListening();
  }, [supported, setListening, setIdle, setError]);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return {
    supported,
    isListening: state === "listening",
    interim,
    start,
    stop,
  };
}
