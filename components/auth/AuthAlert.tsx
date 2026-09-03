import { AlertTriangle } from "lucide-react";

export function AuthAlert({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-alert" role="alert">
      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-jarvis-crit" />
      <p className="hud-label text-jarvis-crit">{children}</p>
    </div>
  );
}
