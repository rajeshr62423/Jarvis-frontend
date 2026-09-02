"use client";

import { Activity } from "lucide-react";
import { useClock } from "@/hooks/useClock";
import { useAuth } from "@/hooks/useAuth";
import { ConnectionIndicator } from "@/components/hud/ConnectionIndicator";
import { SignOutButton } from "@/components/auth/SignOutButton";

export function SystemHeader({
  onOpenIntelligence,
}: {
  onOpenIntelligence?: () => void;
}) {
  const now = useClock();
  const { user } = useAuth();

  return (
    <header className="hud-panel flex h-14 items-center justify-between px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="relative h-2.5 w-2.5">
          <span className="absolute inset-0 animate-ping rounded-full bg-jarvis-cyan opacity-60" />
          <span className="absolute inset-0 rounded-full bg-jarvis-cyan" />
        </div>
        <span className="hud-display text-sm font-semibold tracking-[0.3em] text-jarvis-fg">
          JARVIS
        </span>
        <span className="hud-label hidden sm:inline">ONLINE</span>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <div className="hidden md:block">
          <ConnectionIndicator />
        </div>
        <span className="hud-mono hidden text-xs text-jarvis-muted sm:inline">
          {now
            ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
            : "--:--:--"}
        </span>
        {onOpenIntelligence && (
          <button
            onClick={onOpenIntelligence}
            aria-label="Open system intelligence panel"
            className="hud-label flex items-center gap-1.5 rounded border border-jarvis-border px-2 py-1 transition-colors hover:border-jarvis-cyan hover:text-jarvis-cyan lg:hidden"
          >
            <Activity className="h-3.5 w-3.5" />
            <span>INTEL</span>
          </button>
        )}
        {user && (
          <div className="flex items-center gap-3">
            <span className="hud-label hidden lg:inline">{user.name}</span>
            <SignOutButton
              className="hud-label rounded border border-jarvis-border px-2 py-1 transition-colors hover:border-jarvis-cyan hover:text-jarvis-cyan"
            >
              SIGN OUT
            </SignOutButton>
          </div>
        )}
      </div>
    </header>
  );
}
