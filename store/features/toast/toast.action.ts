import { createAction } from "@reduxjs/toolkit";
import { TOAST_DISMISSED, TOAST_SHOWN } from "@/store/features/toast/toast.actionType";
import type { ToastItem } from "@/store/features/toast/toast.types";

export const showToast = createAction<ToastItem>(TOAST_SHOWN);
export const dismissToast = createAction<string>(TOAST_DISMISSED);
