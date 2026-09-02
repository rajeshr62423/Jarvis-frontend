"use client";

import { useCallback, useRef } from "react";
import {
  setExecuting,
  setIdle,
  setListening,
  setSpeaking,
  setThinking,
  setErrorState,
} from "@/store/features/jarvis/jarvis.action";
import {
  selectJarvisLastCommand,
  selectJarvisLastError,
  selectJarvisState,
} from "@/store/features/jarvis/jarvis.selector";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

const ERROR_RESET_MS = 2600;

export function useJarvisState() {
  const dispatch = useAppDispatch();
  const state = useAppSelector(selectJarvisState);
  const lastCommand = useAppSelector(selectJarvisLastCommand);
  const lastError = useAppSelector(selectJarvisLastError);
  const errorTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearErrorTimer = () => {
    if (errorTimer.current) {
      clearTimeout(errorTimer.current);
      errorTimer.current = null;
    }
  };

  const idle = useCallback(() => {
    clearErrorTimer();
    dispatch(setIdle());
  }, [dispatch]);

  const listening = useCallback(() => {
    clearErrorTimer();
    dispatch(setListening());
  }, [dispatch]);

  const thinking = useCallback(
    (command?: string) => {
      clearErrorTimer();
      dispatch(setThinking(command));
    },
    [dispatch],
  );

  const speaking = useCallback(() => {
    clearErrorTimer();
    dispatch(setSpeaking());
  }, [dispatch]);

  const executing = useCallback(() => {
    clearErrorTimer();
    dispatch(setExecuting());
  }, [dispatch]);

  const error = useCallback(
    (message: string) => {
      clearErrorTimer();
      dispatch(setErrorState(message));
      errorTimer.current = setTimeout(() => {
        dispatch(setIdle());
      }, ERROR_RESET_MS);
    },
    [dispatch],
  );

  return {
    state,
    lastCommand,
    lastError,
    setIdle: idle,
    setListening: listening,
    setThinking: thinking,
    setSpeaking: speaking,
    setExecuting: executing,
    setError: error,
  };
}
