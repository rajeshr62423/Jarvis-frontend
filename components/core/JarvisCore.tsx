"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { subscribeSpeechActivity } from "@/services/audio/speech-synthesis";
import type { JarvisState } from "@/lib/types";

export const JARVIS_STATE_META: Record<
  JarvisState,
  { color: string; label: string; outerDuration: number; innerDuration: number }
> = {
  idle: {
    color: "var(--jarvis-cyan)",
    label: "STANDING BY",
    outerDuration: 26,
    innerDuration: 18,
  },
  listening: {
    color: "var(--jarvis-cyan)",
    label: "LISTENING",
    outerDuration: 22,
    innerDuration: 12,
  },
  thinking: {
    color: "var(--jarvis-blue)",
    label: "PROCESSING",
    outerDuration: 20,
    innerDuration: 8,
  },
  speaking: {
    color: "var(--jarvis-cyan)",
    label: "RESPONDING",
    outerDuration: 24,
    innerDuration: 14,
  },
  executing: {
    color: "var(--jarvis-blue)",
    label: "EXECUTING",
    outerDuration: 20,
    innerDuration: 7,
  },
  error: {
    color: "var(--jarvis-crit)",
    label: "FAULT",
    outerDuration: 20,
    innerDuration: 8,
  },
};

const CORE_SCALE: Partial<Record<JarvisState, number[]>> = {
  idle: [1, 1.03, 1],
  listening: [1, 1.04, 1],
  thinking: [1, 1.04, 0.99, 1.04, 1],
  speaking: [1, 1.04, 0.99, 1.04, 1],
  executing: [1, 1.04, 1],
  error: [1, 1.04, 0.98, 1],
};

const SIZE_CLASS: Record<"xs" | "sm" | "lg", string> = {
  xs: "w-10",
  sm: "w-36 sm:w-40",
  lg: "w-56 sm:w-72 lg:w-80",
};

export function JarvisCore({
  state,
  size = "lg",
}: {
  state: JarvisState;
  size?: "xs" | "sm" | "lg";
}) {
  const meta = JARVIS_STATE_META[state];
  const reducedMotion = useReducedMotion();
  const [flash, setFlash] = useState(0);

  useEffect(() => {
    if (state !== "speaking") return;
    return subscribeSpeechActivity(() => setFlash((n) => n + 1));
  }, [state]);

  const showOrbit = state === "thinking" || state === "executing";

  return (
    <div className={`relative aspect-square select-none ${SIZE_CLASS[size]}`}>
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "repeating-conic-gradient(from 0deg, var(--ring-color) 0deg 1deg, transparent 1deg 9deg)",
          maskImage:
            "radial-gradient(circle, transparent 44%, black 45%, black 49%, transparent 50%)",
          WebkitMaskImage:
            "radial-gradient(circle, transparent 44%, black 45%, black 49%, transparent 50%)",
          opacity: 0.55,
          ["--ring-color" as string]: meta.color,
        }}
        animate={{ rotate: 360 }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : { duration: meta.outerDuration, repeat: Infinity, ease: "linear" }
        }
      />

      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full">
        <motion.circle
          cx={100}
          cy={100}
          r={80}
          fill="none"
          stroke={meta.color}
          strokeOpacity={0.35}
          strokeWidth={1}
          strokeDasharray="1 7"
          style={{ transformOrigin: "100px 100px" }}
          animate={
            reducedMotion
              ? { rotate: 0 }
              : { rotate: -360, opacity: [0.28, 0.42, 0.28] }
          }
          transition={
            reducedMotion
              ? { duration: 0 }
              : {
                  duration: meta.innerDuration,
                  repeat: Infinity,
                  ease: "linear",
                }
          }
        />
        <circle
          cx={100}
          cy={100}
          r={62}
          fill="none"
          stroke={meta.color}
          strokeOpacity={0.2}
          strokeWidth={1}
        />
        {showOrbit && (
          <motion.g
            style={{ transformOrigin: "100px 100px" }}
            animate={reducedMotion ? { rotate: 0 } : { rotate: 360 }}
            transition={
              reducedMotion
                ? { duration: 0 }
                : {
                    duration: meta.innerDuration * 0.6,
                    repeat: Infinity,
                    ease: "linear",
                  }
            }
          >
            <circle cx={100} cy={20} r={3} fill={meta.color} />
          </motion.g>
        )}
      </svg>

      <motion.div
        className="absolute inset-[30%] rounded-full"
        animate={{ scale: CORE_SCALE[state] ?? [1, 1.03, 1] }}
        transition={
          reducedMotion
            ? { duration: 0 }
            : {
                duration:
                  state === "idle" ? 3.4 : state === "listening" ? 2.4 : 2.8,
                repeat: Infinity,
                ease: "easeInOut",
              }
        }
        style={{
          background: `radial-gradient(circle, ${meta.color} 0%, color-mix(in srgb, ${meta.color} 40%, transparent) 55%, transparent 78%)`,
          filter: `drop-shadow(0 0 ${18 + (flash % 2) * 4}px ${meta.color})`,
        }}
      />

      {size === "lg" && (
        <div className="absolute inset-x-0 -bottom-8 flex flex-col items-center gap-1">
          <span className="hud-label" style={{ color: meta.color }}>
            {meta.label}
          </span>
        </div>
      )}
    </div>
  );
}
