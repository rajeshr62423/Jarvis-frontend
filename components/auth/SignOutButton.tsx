"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/hooks/useAuth";

export function SignOutButton({
  children,
  className,
  ariaLabel,
}: {
  children: ReactNode;
  className: string;
  ariaLabel?: string;
}) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { logout } = useAuth();

  useEffect(() => {
    if (!isConfirming) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsConfirming(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isConfirming]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsConfirming(true)}
        aria-label={ariaLabel}
        className={className}
      >
        {children}
      </button>

      {isConfirming &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="sign-out-modal-overlay fixed inset-0 z-[9999] flex items-center justify-center p-4"
            onMouseDown={() => setIsConfirming(false)}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="sign-out-title"
              className="sign-out-confirm-dialog hud-panel relative w-full max-w-sm rounded-lg p-5 shadow-2xl"
              onMouseDown={(event) => event.stopPropagation()}
            >
              <p
                id="sign-out-title"
                className="hud-mono text-sm font-semibold text-jarvis-fg"
              >
                CONFIRM SIGN OUT
              </p>
              <p className="mt-2 text-sm text-jarvis-muted">
                Are you sure you want to end this session?
              </p>
              <div className="mt-5 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsConfirming(false)}
                  className="hud-label rounded border border-jarvis-border px-3 py-2 text-jarvis-muted transition-colors hover:border-jarvis-cyan hover:text-jarvis-fg"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={logout}
                  className="hud-label rounded border border-jarvis-crit px-3 py-2 text-jarvis-crit transition-colors hover:bg-jarvis-crit/10"
                >
                  SIGN OUT
                </button>
              </div>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
