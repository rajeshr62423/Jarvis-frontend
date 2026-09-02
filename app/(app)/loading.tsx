import { ArcReactorCore } from "@/components/arc-reactor/ArcReactorCore";

export default function AppLoading() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <div className="w-48 sm:w-56">
        <ArcReactorCore state="NORMAL" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <span className="hud-label text-jarvis-cyan">INITIALIZING MODULE</span>
        <span className="hud-mono text-[0.65rem] text-jarvis-muted">
          STANDBY<span className="loading-ellipsis" />
        </span>
      </div>
    </div>
  );
}
