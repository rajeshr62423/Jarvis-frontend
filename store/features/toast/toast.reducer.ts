import { createReducer } from "@reduxjs/toolkit";
import { dismissToast, showToast } from "@/store/features/toast/toast.action";
import type { ToastState } from "@/store/features/toast/toast.types";

const MAX_TOASTS = 4;

const initialState: ToastState = {
  items: [],
};

export const toastReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(showToast, (state, action) => {
      state.items.push(action.payload);
      if (state.items.length > MAX_TOASTS) state.items.shift();
    })
    .addCase(dismissToast, (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    });
});
