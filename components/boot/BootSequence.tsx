"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArcReactorCore } from "@/components/arc-reactor/ArcReactorCore";

const LINES = [
  "INITIALIZING JARVIS...",
  "LOADING AI CORE...",
  "ESTABLISHING SECURE CONNECTION...",
  "CALIBRATING SYSTEM INTELLIGENCE...",
  "SYSTEMS ONLINE",
];

const LINE_INTERVAL_MS = 480;
const HOLD_MS = 700;

export function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    if (visibleLines >= LINES.length) {
      const holdTimer = setTimeout(onComplete, HOLD_MS);
      return () => clearTimeout(holdTimer);
    }
    const timer = setTimeout(() => setVisibleLines((n) => n + 1), LINE_INTERVAL_MS);
    return () => clearTimeout(timer);
  }, [visibleLines, onComplete]);

  useEffect(() => {
    const skipOnKey = () => onComplete();
    window.addEventListener("keydown", skipOnKey);
    return () => window.removeEventListener("keydown", skipOnKey);
  }, [onComplete]);

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-jarvis-bg hud-grid-bg">
      <div className="relative flex flex-col items-center gap-5">
        <motion.div
          className="relative w-40 sm:w-48"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <ArcReactorCore state="NORMAL" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hud-display text-2xl tracking-[0.4em] text-jarvis-fg sm:text-3xl"
        >
          JARVIS
        </motion.h1>

        <div className="hud-mono flex min-h-[140px] w-[min(90vw,420px)] flex-col gap-2 text-xs tracking-[0.15em]">
          <AnimatePresence>
            {LINES.slice(0, visibleLines).map((line, i) => (
              <motion.div
                key={line}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className={
                  i === LINES.length - 1
                    ? "text-jarvis-cyan text-glow"
                    : "text-jarvis-muted"
                }
              >
                {i === LINES.length - 1 ? "" : "> "}
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="hud-label opacity-40">click or press any key to skip</div>
      </div>
    </div>
  );
}
