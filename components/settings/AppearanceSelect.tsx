"use client";

import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown } from "lucide-react";

export type AppearanceProtocol =
  | "arc"
  | "verdant"
  | "overdrive"
  | "pulse"
  | "stealth";

const PROTOCOLS: { value: AppearanceProtocol; label: string; swatch: string }[] = [
  { value: "arc", label: "ARC", swatch: "#22d3ee" },
  { value: "verdant", label: "VERDANT", swatch: "#34d399" },
  { value: "overdrive", label: "OVERDRIVE", swatch: "#f43f5e" },
  {
    value: "pulse",
    label: "PULSE",
    swatch: "linear-gradient(135deg, #22d3ee, #a855f7)",
  },
  { value: "stealth", label: "STEALTH", swatch: "#9ca3af" },
];

/** Legacy values ("dark", "light") and anything unrecognized fall back to ARC. */
export function normalizeAppearance(value: string): AppearanceProtocol {
  const match = PROTOCOLS.find((p) => p.value === value);
  return match ? match.value : "arc";
}

export function AppearanceSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: AppearanceProtocol) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const active = normalizeAppearance(value);
  const activeProtocol = PROTOCOLS.find((p) => p.value === active)!;

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="appearance-protocol relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="hud-select hud-mono appearance-protocol-trigger flex w-full items-center justify-between gap-2"
      >
        <span className="flex items-center gap-2">
          <span
            className="appearance-protocol-dot"
            style={{ background: activeProtocol.swatch }}
          />
          {activeProtocol.label}
        </span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-jarvis-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <ul role="listbox" aria-label="Appearance protocol" className="appearance-protocol-menu">
          {PROTOCOLS.map((p) => (
            <li key={p.value} role="option" aria-selected={p.value === active}>
              <button
                type="button"
                onClick={() => {
                  onChange(p.value);
                  setOpen(false);
                }}
                className={`appearance-protocol-option hud-mono w-full ${
                  p.value === active ? "is-active" : ""
                }`}
              >
                <span className="appearance-protocol-dot" style={{ background: p.swatch }} />
                <span>{p.label}</span>
                {p.value === active && <Check className="ml-auto h-3.5 w-3.5" />}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
