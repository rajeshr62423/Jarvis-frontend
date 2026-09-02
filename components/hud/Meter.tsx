export function Meter({
  label,
  value,
  suffix = "%",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <span className="hud-label">{label}</span>
        <span className="hud-mono text-xs text-jarvis-fg">
          {Math.round(value)}
          {suffix}
        </span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-jarvis-blue to-jarvis-cyan transition-[width] duration-700 ease-out"
          style={{ width: `${clamped}%`, boxShadow: "0 0 8px var(--jarvis-glow)" }}
        />
      </div>
    </div>
  );
}
