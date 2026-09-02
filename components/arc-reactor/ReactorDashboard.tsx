"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  ArrowLeft,
  Atom,
  ChevronDown,
  CircleGauge,
  Cpu,
  Gauge,
  HeartPulse,
  Power,
  ShieldCheck,
  Thermometer,
  TriangleAlert,
  Zap,
} from "lucide-react";
import { HudPanel } from "@/components/hud/HudPanel";
import { ArcReactorCore, type ReactorState } from "@/components/arc-reactor/ArcReactorCore";

const distribution = [
  ["SUIT SYSTEMS", 35],
  ["WEAPONS", 25],
  ["SHIELDS", 20],
  ["PROPULSION", 15],
  ["AUXILIARY", 5],
] as const;
const diagnostics = [
  "ENERGY CONDUITS",
  "PLASMA CONTAINMENT",
  "MAGNETIC FIELD",
  "PARTICLE ACCELERATOR",
  "THERMAL REGULATION",
];
const logs = [
  ["00:59:48", "Power output adjusted to maximum"],
  ["00:59:12", "Cooling system optimized"],
  ["00:58:31", "Arc reactor stabilization complete"],
  ["00:57:05", "Energy surge detected and stabilized"],
  ["00:56:23", "Reactor diagnostics initiated"],
];

function Metric({
  icon: Icon,
  label,
  value,
  tone = "cyan",
}: {
  icon: typeof Zap;
  label: string;
  value: string;
  tone?: "cyan" | "ok" | "warn";
}) {
  return (
    <div className="reactor-metric">
      <Icon className={`h-6 w-6 reactor-${tone}`} />
      <div>
        <p className="hud-label">{label}</p>
        <p className={`hud-mono mt-1 text-lg reactor-${tone}`}>{value}</p>
      </div>
    </div>
  );
}

function LineChart({
  label,
  value,
  temperature = false,
}: {
  label: string;
  value?: string;
  temperature?: boolean;
}) {
  const points = temperature
    ? "0,71 18,68 35,69 53,64 70,66 88,57 105,59 123,52 140,51 158,53 175,43 193,46 210,39 228,48 246,52 264,47 282,50 300,51"
    : "0,66 18,58 35,63 53,53 70,37 88,44 105,60 123,59 140,55 158,43 175,47 193,52 210,58 228,56 246,50 264,55 282,38 300,43";
  return (
    <div
      className="reactor-chart"
      role="img"
      aria-label={`${label} live line chart`}
    >
      <div className="flex items-center justify-between">
        <span className="hud-label">{label}</span>
        {value && (
          <span className="hud-mono text-sm text-jarvis-fg">{value}</span>
        )}
      </div>
      <svg
        viewBox="0 0 300 100"
        preserveAspectRatio="none"
        className="mt-4 h-32 w-full"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`fill-${label}`} x1="0" x2="0" y1="0" y2="1">
            <stop stopColor="var(--jarvis-cyan)" stopOpacity=".28" />
            <stop offset="1" stopColor="var(--jarvis-cyan)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d={`M ${points} L 300,100 L 0,100 Z`}
          fill={`url(#fill-${label})`}
        />
        <polyline
          points={points}
          fill="none"
          stroke="var(--jarvis-cyan)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <div className="mt-1 flex justify-between hud-label text-[0.58rem]">
        <span>00:00</span>
        <span>00:15</span>
        <span>00:30</span>
        <span>00:45</span>
        <span>01:00</span>
      </div>
    </div>
  );
}

function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4"
      onMouseDown={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="hud-panel w-full max-w-md rounded-lg p-5"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 className="hud-display text-sm tracking-wider text-jarvis-fg">
          {title}
        </h2>
        {children}
      </section>
    </div>
  );
}

export function ReactorDashboard() {
  const [state, setState] = useState<ReactorState>("NORMAL");
  const [powerMode, setPowerMode] = useState("MAXIMUM");
  const [temperature, setTemperature] = useState(42);
  const [dialog, setDialog] = useState<"shutdown" | "report" | "logs" | null>(
    null,
  );
  const [lastAction, setLastAction] = useState("SYSTEMS NOMINAL");
  useEffect(() => {
    const timer = window.setInterval(
      () =>
        setTemperature((current) =>
          Math.max(38, Math.min(48, current + (Math.random() > 0.5 ? 1 : -1))),
        ),
      3500,
    );
    return () => window.clearInterval(timer);
  }, []);
  const integrity = state === "CRITICAL" ? 72 : state === "SHUTDOWN" ? 0 : 100;
  const stateColor =
    state === "CRITICAL"
      ? "reactor-warn"
      : state === "SHUTDOWN"
        ? "text-jarvis-muted"
        : "text-jarvis-cyan";
  const performanceSummary = useMemo(
    () =>
      state === "HIGH ENERGY"
        ? ["99.9%", "9ms", "99.4%", "98.6%"]
        : ["99.7%", "12ms", "99.9%", "98.6%"],
    [state],
  );

  const runDiagnostics = () => {
    setState("DIAGNOSTICS");
    setLastAction("DIAGNOSTIC SCAN RUNNING");
    window.setTimeout(() => {
      setState("NORMAL");
      setLastAction("DIAGNOSTICS COMPLETE");
    }, 2600);
  };
  return (
    <div className="reactor-page mx-auto max-w-[1500px] pb-6">
      <header className="reactor-header">
        <button
          type="button"
          onClick={() => history.back()}
          className="rounded p-2 text-jarvis-muted hover:text-jarvis-cyan"
          aria-label="Go back"
        >
          <ArrowLeft />
        </button>
        <div>
          <h1 className="hud-display text-xl tracking-[.16em] text-jarvis-fg">
            ARC REACTOR
          </h1>
          <p className="hud-label mt-1">POWERING STARK INDUSTRIES</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="hud-label hidden sm:inline">SYSTEM STATUS</span>
          <span className="hud-label text-jarvis-ok">ONLINE</span>
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-jarvis-ok" />
        </div>
      </header>
      <div className="reactor-metrics">
        <Metric
          icon={Zap}
          label="POWER OUTPUT"
          value={state === "SHUTDOWN" ? "0%" : "100%"}
        />
        <Metric
          icon={CircleGauge}
          label="ENERGY LEVEL"
          value={state === "CRITICAL" ? "72%" : "100%"}
        />
        <Metric
          icon={Thermometer}
          label="CORE TEMP."
          value={`${temperature}°C`}
          tone={temperature > 45 ? "warn" : "cyan"}
        />
        <Metric
          icon={Activity}
          label="REACTOR STATUS"
          value={state === "NORMAL" ? "STABLE" : state}
          tone={state === "CRITICAL" ? "warn" : "ok"}
        />
      </div>
      <div className="reactor-main-grid mt-3">
        <HudPanel title="REACTOR CONTROLS" className="reactor-controls p-4">
          <label className="hud-label">
            POWER MODE
            <select
              value={powerMode}
              onChange={(event) => {
                setPowerMode(event.target.value);
                setState(
                  event.target.value === "HIGH ENERGY"
                    ? "HIGH ENERGY"
                    : "NORMAL",
                );
              }}
              className="hud-select hud-mono mt-2 w-full text-sm text-jarvis-cyan"
            >
              <option>MAXIMUM</option>
              <option>HIGH ENERGY</option>
              <option>CONSERVATION</option>
            </select>
          </label>
          <Control label="STABILIZER" value="ONLINE" />
          <Control label="COOLANT FLOW" value="OPTIMAL" />
          <Control label="VIBRATION DAMPER" value="ACTIVE" />
          <Control label="CORE SHIELD" value={`${integrity}%`} />
          <button
            onClick={runDiagnostics}
            className="reactor-button mt-4 w-full"
          >
            RUN DIAGNOSTICS
          </button>
          <button
            onClick={() => setDialog("shutdown")}
            className="reactor-button-danger mt-3 w-full"
          >
            SHUTDOWN
          </button>
        </HudPanel>
        <section className="reactor-core-panel flex min-h-[430px] flex-col items-center justify-center">
          <ArcReactorCore state={state} />
          <div className="mt-2 text-center">
            <p className="hud-display tracking-[.22em] text-jarvis-cyan">
              ARC REACTOR
            </p>
            <p className="hud-label mt-1">MK VI PROTOTYPE</p>
          </div>
        </section>
        <div className="grid gap-3">
          <HudPanel title="CORE INTEGRITY" className="p-5 text-center">
            <div
              className="integrity-ring mx-auto"
              style={
                {
                  "--integrity": `${integrity * 3.6}deg`,
                } as React.CSSProperties
              }
            >
              <div>
                <strong className="hud-mono text-2xl text-jarvis-fg">
                  {integrity}%
                </strong>
                <span className="hud-label block text-[.6rem]">INTEGRITY</span>
              </div>
            </div>
            <p className={`hud-label mt-5 ${stateColor}`}>
              {integrity ? "NO ANOMALIES DETECTED" : "REACTOR OFFLINE"}
            </p>
            <p className="hud-label mt-1 opacity-65">{lastAction}</p>
          </HudPanel>
          <HudPanel title="POWER DISTRIBUTION" className="p-4">
            <div className="space-y-3">
              {distribution.map(([label, value]) => (
                <div key={label}>
                  <div className="flex justify-between">
                    <span className="hud-label text-[.62rem]">{label}</span>
                    <span className="hud-mono text-xs">{value}%</span>
                  </div>
                  <div className="reactor-bar">
                    <span
                      style={{ width: `${state === "SHUTDOWN" ? 0 : value}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="flex justify-between border-t border-jarvis-border pt-3">
                <span className="hud-label">TOTAL OUTPUT</span>
                <span className="hud-mono">
                  {state === "SHUTDOWN" ? 0 : 100}%
                </span>
              </div>
            </div>
          </HudPanel>
        </div>
      </div>
      <div className="reactor-lower-grid mt-3">
        <HudPanel
          title="PERFORMANCE OVERVIEW"
          action={
            <span className="hud-label">
              REAL TIME <ChevronDown className="inline h-3 w-3" />
            </span>
          }
          className="p-4"
        >
          <LineChart label="" />
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-jarvis-border pt-3 sm:grid-cols-4">
            {[
              "EFFICIENCY",
              "RESPONSE TIME",
              "POWER STABILITY",
              "CORE LIFE",
            ].map((label, index) => (
              <div key={label}>
                <p className="hud-label text-[.58rem]">{label}</p>
                <p className="hud-mono mt-1 text-lg text-jarvis-fg">
                  {performanceSummary[index]}
                </p>
              </div>
            ))}
          </div>
        </HudPanel>
        <HudPanel title="SYSTEM DIAGNOSTICS" className="p-4">
          {diagnostics.map((item, index) => (
            <div
              className="flex items-center justify-between border-b border-jarvis-border/60 py-2.5"
              key={item}
            >
              <span className="hud-label text-[.64rem]">{item}</span>
              <span className="hud-label text-jarvis-ok">
                {index === 2 ? "STABLE" : index === 3 ? "NOMINAL" : "OPTIMAL"}{" "}
                <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-jarvis-ok" />
              </span>
            </div>
          ))}
          <button
            onClick={() => setDialog("report")}
            className="reactor-button mt-4 w-full"
          >
            VIEW FULL REPORT
          </button>
        </HudPanel>
        <HudPanel
          title="EVENT LOGS"
          action={
            <button
              onClick={() => setDialog("logs")}
              className="hud-label text-jarvis-cyan"
            >
              VIEW ALL
            </button>
          }
          className="p-4"
        >
          {logs.map(([time, message]) => (
            <div
              className="flex gap-3 border-b border-jarvis-border/60 py-2.5"
              key={time}
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-jarvis-cyan" />
              <span className="hud-mono text-[.64rem] text-jarvis-muted">
                {time}
              </span>
              <span className="text-xs text-jarvis-fg/80">{message}</span>
            </div>
          ))}
        </HudPanel>
      </div>
      <div className="reactor-bottom-grid mt-3">
        <HudPanel title="POWER ROUTING" className="p-5">
          <div className="reactor-routing">
            {[
              [Atom, "ARC REACTOR", 100],
              [Cpu, "SUIT SYSTEMS", 35],
              [Zap, "WEAPONS", 25],
              [ShieldCheck, "SHIELDS", 20],
              [Gauge, "PROPULSION", 15],
              [Power, "AUXILIARY", 5],
            ].map(([Icon, label, value], index) => {
              const IconComponent = Icon as typeof Atom;
              return (
                <div className="reactor-route-node" key={label as string}>
                  <div className="reactor-route-icon">
                    <IconComponent className="h-5 w-5" />
                  </div>
                  <span className="hud-label mt-2 text-center text-[.58rem]">
                    {label as string}
                  </span>
                  <span className="hud-mono text-sm">{value as number}%</span>
                  {index < 5 && <span className="reactor-route-line" />}
                </div>
              );
            })}
          </div>
        </HudPanel>
        <HudPanel
          title="CORE TEMPERATURE"
          action={<span className="hud-label text-jarvis-ok">OPTIMAL</span>}
          className="p-4"
        >
          <LineChart label="" value={`${temperature}°C`} temperature />
        </HudPanel>
      </div>
      {dialog === "shutdown" && (
        <Dialog
          title="INITIATE REACTOR SHUTDOWN"
          onClose={() => setDialog(null)}
        >
          <p className="mt-3 text-sm text-jarvis-muted">
            Are you sure you want to initiate reactor shutdown?
          </p>
          <div className="mt-5 flex justify-end gap-3">
            <button
              onClick={() => setDialog(null)}
              className="reactor-button px-4"
            >
              CANCEL
            </button>
            <button
              onClick={() => {
                setState("SHUTDOWN");
                setLastAction("SHUTDOWN SEQUENCE COMPLETE");
                setDialog(null);
              }}
              className="reactor-button-danger px-4"
            >
              CONFIRM SHUTDOWN
            </button>
          </div>
        </Dialog>
      )}
      {dialog === "report" && (
        <Dialog title="DIAGNOSTICS REPORT" onClose={() => setDialog(null)}>
          <p className="mt-3 text-sm text-jarvis-muted">
            All five primary systems are functioning within nominal operating
            ranges. No maintenance intervention is required.
          </p>
          <button
            onClick={() => setDialog(null)}
            className="reactor-button mt-5 w-full"
          >
            CLOSE REPORT
          </button>
        </Dialog>
      )}
      {dialog === "logs" && (
        <Dialog title="EVENT LOG ARCHIVE" onClose={() => setDialog(null)}>
          <div className="mt-3 max-h-64 overflow-y-auto">
            {logs.concat(logs).map(([time, message], index) => (
              <p
                className="border-b border-jarvis-border py-2 text-sm text-jarvis-muted"
                key={`${time}-${index}`}
              >
                <span className="mr-2 hud-mono text-jarvis-cyan">{time}</span>
                {message}
              </p>
            ))}
          </div>
          <button
            onClick={() => setDialog(null)}
            className="reactor-button mt-5 w-full"
          >
            CLOSE ARCHIVE
          </button>
        </Dialog>
      )}
    </div>
  );
}

function Control({ label, value }: { label: string; value: string }) {
  return (
    <div className="reactor-control-row">
      <div>
        <p className="hud-label text-[.6rem]">{label}</p>
        <p className="hud-mono mt-1 text-sm text-jarvis-cyan">{value}</p>
      </div>
      <span className="h-2 w-2 rounded-full bg-jarvis-ok" />
    </div>
  );
}
