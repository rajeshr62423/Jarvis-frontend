import type { ReactNode } from "react";
import { ArcReactorCore } from "@/components/arc-reactor/ArcReactorCore";

export function AuthCard({
  eyebrow,
  heading,
  tagline,
  subtitle,
  children,
}: {
  eyebrow: string;
  heading: string;
  tagline: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="auth-card hud-panel scanline relative z-10 flex flex-col gap-6 p-6 sm:p-8">
      <div className="auth-card-hex" aria-hidden="true" />
      <span className="auth-card-corner auth-card-corner-tl" aria-hidden="true" />
      <span className="auth-card-corner auth-card-corner-tr" aria-hidden="true" />
      <span className="auth-card-corner auth-card-corner-bl" aria-hidden="true" />
      <span className="auth-card-corner auth-card-corner-br" aria-hidden="true" />
      <div className="auth-card-scan" aria-hidden="true" />

      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-20 sm:w-24">
          <ArcReactorCore state="NORMAL" />
        </div>
        <h1 className="hud-display text-lg tracking-[0.35em] text-jarvis-fg">JARVIS</h1>
        <p className="hud-label">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <span className="hud-label text-jarvis-cyan">{eyebrow}</span>
          <h2 className="text-xl font-semibold text-jarvis-fg sm:text-2xl">{heading}</h2>
          <p className="text-sm text-jarvis-muted">{tagline}</p>
        </div>
        {children}
      </div>
    </div>
  );
}
