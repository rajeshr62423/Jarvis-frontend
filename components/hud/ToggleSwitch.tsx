export function ToggleSwitch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      aria-label={label}
      className="relative h-5 w-9 shrink-0 rounded-full border transition-colors"
      style={{
        borderColor: checked
          ? "var(--jarvis-ok)"
          : "var(--jarvis-border-strong)",
        background: checked ? "rgba(0,255,163,0.15)" : "transparent",
      }}
    >
      <span
        className="absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all"
        style={{
          left: checked ? "calc(100% - 1.1rem)" : "0.15rem",
          background: checked ? "var(--jarvis-ok)" : "var(--jarvis-muted)",
        }}
      />
    </button>
  );
}
