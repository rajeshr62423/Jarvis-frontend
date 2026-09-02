"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { dismissToast } from "@/store/features/toast/toast.action";
import { selectToasts } from "@/store/features/toast/toast.selector";
import type { ToastItem, ToastTone } from "@/store/features/toast/toast.types";

const TONE_COLOR: Record<ToastTone, string> = {
  info: "var(--jarvis-cyan)",
  success: "var(--jarvis-ok)",
  warning: "var(--jarvis-warn)",
  error: "var(--jarvis-crit)",
};

const AUTO_DISMISS_MS = 6000;

function Toast({ toast }: { toast: ToastItem }) {
  const dispatch = useAppDispatch();
  const color = TONE_COLOR[toast.tone];

  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(toast.id)), AUTO_DISMISS_MS);
    return () => clearTimeout(timer);
  }, [toast.id, dispatch]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.25 }}
      className="hud-panel pointer-events-auto flex w-80 items-start gap-3 p-3"
      style={{ borderColor: `color-mix(in srgb, ${color} 45%, var(--jarvis-border))` }}
    >
      <span
        className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full"
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <div className="min-w-0 flex-1">
        <p className="hud-label" style={{ color }}>
          {toast.title}
        </p>
        <p className="mt-1 text-xs leading-snug text-jarvis-fg/80">{toast.message}</p>
      </div>
      <button
        onClick={() => dispatch(dismissToast(toast.id))}
        aria-label="Dismiss notification"
        className="text-jarvis-muted transition-colors hover:text-jarvis-fg"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}

export function ToastStack() {
  const toasts = useAppSelector(selectToasts);

  return (
    <div className="pointer-events-none fixed right-3 top-16 z-40 flex flex-col gap-2 sm:right-4 sm:top-20">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
}
