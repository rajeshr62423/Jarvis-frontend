import { createAction } from "@reduxjs/toolkit";
import {
  SET_ERROR,
  SET_EXECUTING,
  SET_IDLE,
  SET_LISTENING,
  SET_SPEAKING,
  SET_THINKING,
} from "@/store/features/jarvis/jarvis.actionType";

export const setIdle = createAction(SET_IDLE);
export const setListening = createAction(SET_LISTENING);
export const setThinking = createAction<string | undefined>(SET_THINKING);
export const setSpeaking = createAction(SET_SPEAKING);
export const setExecuting = createAction(SET_EXECUTING);
export const setErrorState = createAction<string>(SET_ERROR);
