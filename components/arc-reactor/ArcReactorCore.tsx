export type ReactorState =
  | "NORMAL"
  | "HIGH ENERGY"
  | "DIAGNOSTICS"
  | "CRITICAL"
  | "SHUTDOWN";

export function ArcReactorCore({ state }: { state: ReactorState }) {
  const isCritical = state === "CRITICAL";
  const isOff = state === "SHUTDOWN";
  return (
    <div
      className={`arc-reactor ${state.toLowerCase().replace(" ", "-")}`}
      aria-label={`Arc reactor status: ${state}`}
    >
      <div className="arc-halo" />
      <div className="arc-reactor-grid" />
      <div className="arc-ring arc-ring-outer" />
      <div className="arc-ring arc-ring-dots" />
      <div className="arc-ring arc-ring-technical" />
      <div className="arc-ring arc-ring-middle" />
      <div className="arc-ring arc-ring-segments" />
      <div className="arc-ring arc-ring-inner" />
      <div className="arc-tech-orbit arc-tech-orbit-one" />
      <div className="arc-tech-orbit arc-tech-orbit-two" />
      <div className="arc-ticks" />
      <div className="arc-connectors">
        <span />
        <span />
        <span />
        <span />
      </div>
      <div className="arc-spokes" />
      <div className="arc-energy-arcs">
        {Array.from({ length: 8 }, (_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="arc-scanner" />
      <div className="arc-wave arc-wave-one" />
      <div className="arc-wave arc-wave-two" />
      <div className="arc-core">
        <div className="arc-symbol">
          <span />
          <span />
          <span />
        </div>
      </div>
      <span className="arc-particle arc-particle-one" />
      <span className="arc-particle arc-particle-two" />
      <span className="arc-particle arc-particle-three" />
      <span className="arc-particle arc-particle-four" />
      <span className="arc-particle arc-particle-five" />
      {(isCritical || isOff) && (
        <span className="arc-state-overlay">{isOff ? "OFFLINE" : "ALERT"}</span>
      )}
    </div>
  );
}
