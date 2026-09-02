type Tone = "ok" | "warn" | "crit" | "muted" | "cyan";

const TONE_COLOR: Record<Tone, string> = {
  ok: "var(--jarvis-ok)",
  warn: "var(--jarvis-warn)",
  crit: "var(--jarvis-crit)",
  muted: "var(--jarvis-muted)",
  cyan: "var(--jarvis-cyan)",
};

export function StatusIndicator({
  label,
  tone = "cyan",
  pulse = false,
}: {
  label: string;
  tone?: Tone;
  pulse?: boolean;
}) {
  const color = TONE_COLOR[tone];
  return (
    <div className="flex items-center gap-2">
      <span
        className={`h-1.5 w-1.5 rounded-full ${pulse ? "animate-pulse" : ""}`}
        style={{ background: color, boxShadow: `0 0 6px ${color}` }}
      />
      <span className="hud-label" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
