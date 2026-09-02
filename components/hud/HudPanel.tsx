import type { ReactNode } from "react";

export function HudPanel({
  title,
  action,
  children,
  className = "",
}: {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`hud-panel relative overflow-hidden ${className}`}>
      {title && (
        <div className="flex items-center justify-between border-b border-jarvis-border px-4 py-2.5">
          <span className="hud-label">{title}</span>
          {action}
        </div>
      )}
      <div className="relative">{children}</div>
    </section>
  );
}
