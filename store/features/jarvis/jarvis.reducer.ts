import { createReducer } from "@reduxjs/toolkit";
import {
  setErrorState,
  setExecuting,
  setIdle,
  setListening,
  setSpeaking,
  setThinking,
} from "@/store/features/jarvis/jarvis.action";
import type { JarvisSliceState } from "@/store/features/jarvis/jarvis.types";

const initialState: JarvisSliceState = {
  state: "idle",
  lastCommand: null,
  lastError: null,
};

export const jarvisReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(setIdle, (state) => {
      state.state = "idle";
    })
    .addCase(setListening, (state) => {
      state.state = "listening";
    })
    .addCase(setThinking, (state, action) => {
      state.state = "thinking";
      if (action.payload !== undefined) state.lastCommand = action.payload;
    })
    .addCase(setSpeaking, (state) => {
      state.state = "speaking";
    })
    .addCase(setExecuting, (state) => {
      state.state = "executing";
    })
    .addCase(setErrorState, (state, action) => {
      state.state = "error";
      state.lastError = action.payload;
    });
});
