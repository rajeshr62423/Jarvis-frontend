export function CircularMeter({
  label,
  value,
  size = 88,
}: {
  label: string;
  value: number;
  size?: number;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const stroke = 6;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - clamped / 100);

  return (
    <div className="flex items-center gap-4">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--jarvis-border)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--jarvis-cyan)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: "stroke-dashoffset 700ms ease-out",
            filter: "drop-shadow(0 0 6px var(--jarvis-glow))",
          }}
        />
      </svg>
      <div className="flex flex-col">
        <span className="hud-mono text-2xl text-jarvis-fg text-glow">{Math.round(clamped)}%</span>
        <span className="hud-label">{label}</span>
      </div>
    </div>
  );
}
