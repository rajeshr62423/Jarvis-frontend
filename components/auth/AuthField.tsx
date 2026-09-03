"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type AuthFieldProps = {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export function AuthField({
  label,
  icon: Icon,
  error,
  type,
  id,
  className,
  ...props
}: AuthFieldProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;
  const [reveal, setReveal] = useState(false);
  const isPassword = type === "password";
  const resolvedType = isPassword ? (reveal ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="hud-label">
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-jarvis-muted" />
        )}
        <input
          id={inputId}
          type={resolvedType}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className={`hud-input hud-mono w-full ${Icon ? "hud-input--has-icon" : ""} ${
            isPassword ? "hud-input--has-toggle" : ""
          } ${error ? "is-invalid" : ""} ${className ?? ""}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setReveal((v) => !v)}
            aria-label={reveal ? "Hide password" : "Show password"}
            aria-pressed={reveal}
            className="absolute right-1 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-jarvis-muted transition-colors hover:text-jarvis-cyan"
          >
            {reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p id={errorId} role="alert" className="hud-label text-jarvis-crit">
          {error}
        </p>
      )}
    </div>
  );
}
