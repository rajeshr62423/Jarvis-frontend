"use client";

import { Check } from "lucide-react";

export function AuthCheckbox({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex cursor-pointer select-none items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="auth-checkbox-box">
        <Check className="h-3 w-3" strokeWidth={3} />
      </span>
      <span className="hud-label">{label}</span>
    </label>
  );
}
