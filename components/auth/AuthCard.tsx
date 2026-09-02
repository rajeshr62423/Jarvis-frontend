import type { ReactNode } from "react";
import { ArcReactorCore } from "@/components/arc-reactor/ArcReactorCore";

export function AuthCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="hud-panel scanline flex flex-col gap-6 p-6 sm:p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-20 sm:w-24">
          <ArcReactorCore state="NORMAL" />
        </div>
        <h1 className="hud-display text-lg tracking-[0.35em] text-jarvis-fg">JARVIS</h1>
        <p className="hud-label">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-4">
        <span className="hud-label text-jarvis-cyan">{title}</span>
        {children}
      </div>
    </div>
  );
}
