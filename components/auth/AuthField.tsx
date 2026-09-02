export function AuthField({
  label,
  ...props
}: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="hud-label">{label}</span>
      <input {...props} className="hud-input hud-mono" />
    </label>
  );
}
