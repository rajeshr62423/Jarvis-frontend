import { ArcReactorCore } from "@/components/arc-reactor/ArcReactorCore";
import { ParticleField } from "@/components/hud/ParticleField";
import { FlyingHeroesField } from "@/components/hud/FlyingHeroesField";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="auth-grid-bg relative flex min-h-dvh items-center justify-center overflow-hidden px-4 py-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_20%,rgba(34,211,238,0.09),transparent)]" />
      <div className="auth-fog" aria-hidden="true" />
      <ParticleField />
      <FlyingHeroesField />
      <div className="auth-ambient-reactor" aria-hidden="true">
        <ArcReactorCore state="NORMAL" />
      </div>
      <div className="auth-scrim" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm">{children}</div>
    </div>
  );
}
