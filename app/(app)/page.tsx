"use client";

import { useRouter } from "next/navigation";
// import { CalendarClock } from "lucide-react";
import {
  BatteryFull,
  Clock,
  Search,
  Signal,
  Thermometer,
  Video,
  Volume2,
  VolumeX,
  Wifi,
  WifiOff,
} from "lucide-react";
import { ArcReactorCore, type ReactorState } from "@/components/arc-reactor/ArcReactorCore";
import { HudPanel } from "@/components/hud/HudPanel";
import { ParticleField } from "@/components/hud/ParticleField";
import { Meter } from "@/components/hud/Meter";
import { CircularMeter } from "@/components/hud/CircularMeter";
import { useAuth } from "@/hooks/useAuth";
import { useAssistantIdentity } from "@/hooks/useAssistantIdentity";
import { useNotifications } from "@/hooks/useNotifications";
import { useJarvisState } from "@/hooks/useJarvisState";
import { useClock } from "@/hooks/useClock";
import { useNetworkInfo } from "@/hooks/useNetworkInfo";
import { useWeather } from "@/hooks/useWeather";
import { useGetAnalyticsSummaryQuery /* , useGetEventsQuery */ } from "@/store/api";
import { isSpeechSynthesisSupported } from "@/services/audio/speech-synthesis";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  return "Good Evening";
}

const REACTOR_STATE_BY_JARVIS_STATE: Record<
  "idle" | "listening" | "thinking" | "speaking" | "executing" | "error",
  ReactorState
> = {
  idle: "NORMAL",
  listening: "HIGH ENERGY",
  thinking: "DIAGNOSTICS",
  speaking: "HIGH ENERGY",
  executing: "HIGH ENERGY",
  error: "CRITICAL",
};

// function todayRange() {
//   const now = new Date();
//   const from = new Date(now.getFullYear(), now.getMonth(), now.getDate());
//   const to = new Date(
//     now.getFullYear(),
//     now.getMonth(),
//     now.getDate(),
//     23,
//     59,
//     59,
//   );
//   return { from: from.toISOString(), to: to.toISOString() };
// }

const QUICK_ACTIONS = [
  // { label: "New Task", detail: "CAPTURE AN OBJECTIVE", icon: Plus, href: "/tasks" },
  {
    label: "Start Meeting",
    detail: "OPEN A LIVE CHANNEL",
    icon: Video,
    href: "/command-center",
  },
  // { label: "Set Reminder", detail: "SCHEDULE A SIGNAL", icon: Bell, href: "/tasks" },
] as const;

export default function HomePage() {
  const router = useRouter();
  const { user } = useAuth();
  const identity = useAssistantIdentity();
  const { connection } = useNotifications();
  const { state } = useJarvisState();

  // const range = useMemo(() => todayRange(), []);
  // const { data: events = [] } = useGetEventsQuery(range);
  const { data: analytics } = useGetAnalyticsSummaryQuery("week");

  // const todaysSchedule = [...events].sort(
  //   (a, b) => new Date(a.startAt).getTime() - new Date(b.startAt).getTime(),
  // );

  const ttsSupported = isSpeechSynthesisSupported();
  const now = useClock();
  const network = useNetworkInfo();
  const weather = useWeather();

  return (
    <div className="home-dashboard flex flex-col gap-5">
      <ParticleField />
      <div className="home-header flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="hud-label mb-2 text-jarvis-cyan">
            PERSONAL AI OPERATING SYSTEM{" "}
            <span className="mx-2 opacity-40">/</span> HOME
          </p>
          <h1 className="hud-display text-2xl tracking-[0.08em] text-jarvis-fg sm:text-3xl">
            {greeting()}, {user?.name?.split(" ")[0] ?? "Operator"}
          </h1>
          <p className="mt-2 text-sm text-jarvis-muted">
            Your systems are ready. What shall we build today?
          </p>
        </div>

        <div className="home-status-cluster flex flex-wrap gap-2">
          <div
            className="home-status-badge hud-panel flex items-center gap-2 rounded-lg px-3 py-2"
            title="Connection status"
          >
            {connection === "connected" ? (
              <Wifi className="h-4 w-4 text-jarvis-ok" aria-label="Connection status" />
            ) : (
              <WifiOff
                className={`h-4 w-4 text-jarvis-muted ${
                  connection === "connecting" || connection === "reconnecting"
                    ? "animate-pulse"
                    : ""
                }`}
                aria-label="Connection status"
              />
            )}
            <span className="hud-mono text-xs text-jarvis-cyan">
              {connection === "connected" ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          <div
            className="home-status-badge hud-panel flex items-center gap-2 rounded-lg px-3 py-2"
            title="Voice output"
          >
            {ttsSupported ? (
              <Volume2 className="h-4 w-4 text-jarvis-cyan" aria-label="Voice output" />
            ) : (
              <VolumeX className="h-4 w-4 text-jarvis-muted" aria-label="Voice output" />
            )}
            <span className="hud-mono text-xs text-jarvis-cyan">
              {ttsSupported ? "ON" : "OFF"}
            </span>
          </div>
          <div
            className="home-status-badge hud-panel flex items-center gap-2 rounded-lg px-3 py-2"
            title="Battery"
          >
            <BatteryFull className="h-4 w-4 text-jarvis-cyan" aria-label="Battery" />
            <span className="hud-mono text-xs text-jarvis-cyan">100%</span>
          </div>
          <div
            className="home-status-badge hud-panel flex items-center gap-2 rounded-lg px-3 py-2"
            title="Date and time"
          >
            <Clock className="h-4 w-4 text-jarvis-cyan" aria-label="Date and time" />
            <span className="hud-mono text-xs text-jarvis-cyan">
              {now
                ? now
                    .toLocaleString([], {
                      month: "short",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                    .toUpperCase()
                : "--:--:--"}
            </span>
          </div>
          <div
            className="home-status-badge hud-panel flex items-center gap-2 rounded-lg px-3 py-2"
            title="Network"
          >
            <Signal className="h-4 w-4 text-jarvis-cyan" aria-label="Network" />
            <span className="hud-mono text-xs text-jarvis-cyan">
              {network.supported
                ? `${network.effectiveType?.toUpperCase() ?? "—"} · ${network.downlinkMbps ?? "—"} MBPS`
                : "N/A"}
            </span>
          </div>
          <div
            className="home-status-badge hud-panel flex items-center gap-2 rounded-lg px-3 py-2"
            title="Temperature"
          >
            <Thermometer className="h-4 w-4 text-jarvis-cyan" aria-label="Temperature" />
            <span className="hud-mono text-xs text-jarvis-cyan">
              {weather.status === "ready" && weather.temperatureC !== null
                ? `${Math.round(weather.temperatureC)}°C`
                : weather.status === "loading"
                  ? "..."
                  : "N/A"}
            </span>
          </div>
        </div>
      </div>

      <div className="home-hero-grid grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="home-core-column flex flex-col items-center gap-6 py-4 sm:py-6">
          <div className="home-core-stage">
            <span className="home-stage-marker home-stage-marker-one">
              CORE 01
            </span>
            <span className="home-stage-marker home-stage-marker-two">
              LIVE / 24.7
            </span>
            <div className="w-56 sm:w-72 lg:w-80">
              <ArcReactorCore state={REACTOR_STATE_BY_JARVIS_STATE[state]} />
            </div>
            <div className="home-core-readout">
              <span className="hud-label">NEURAL LINK</span>
              <span className="hud-mono text-xs text-jarvis-cyan">
                STABLE <i />
              </span>
            </div>
          </div>

          <button
            onClick={() => router.push("/command-center")}
            className="home-search hud-panel flex w-full max-w-xl items-center gap-3 rounded-full px-5 py-3.5 text-left transition-colors"
          >
            <span className="home-search-icon flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
              <Search className="h-4 w-4 text-jarvis-cyan" />
            </span>
            <span className="flex-1 text-sm text-jarvis-muted">
              Tap or say{" "}
              <span className="text-jarvis-fg">&ldquo;Hey {identity}&rdquo;</span>
            </span>
          </button>

          <div className="home-actions grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {QUICK_ACTIONS.map(({ label, detail, icon: Icon, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="home-action-card hud-panel flex items-center gap-3 rounded-lg px-4 py-3.5 text-left transition-colors sm:flex-col sm:items-start sm:gap-3"
              >
                <span className="home-action-icon flex h-9 w-9 shrink-0 items-center justify-center rounded-md">
                  <Icon className="h-4 w-4" />
                </span>
                <span>
                  <span className="block text-sm text-jarvis-fg">{label}</span>
                  <span className="hud-label mt-1 block text-[0.58rem]">
                    {detail}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <HudPanel title="SYSTEM OVERVIEW" className="flex flex-col gap-4 p-4">
            <CircularMeter
              label="AI CORE"
              value={analytics?.productivityScore ?? 0}
            />
            <div className="flex flex-col gap-3">
              <Meter label="MEMORY" value={92} />
              <Meter label="NETWORK" value={100} />
              <Meter label="SECURITY" value={96} />
            </div>
          </HudPanel>

          {/* Calendar module hidden — re-enable alongside the nav entry in
              HudNavigation.tsx if it comes back.
          <HudPanel title="TODAY'S SCHEDULE" className="flex flex-col p-2">
            {todaysSchedule.length === 0 && (
              <div className="home-empty-schedule flex flex-col items-center px-3 py-7 text-center">
                <CalendarClock className="mb-3 h-7 w-7 text-jarvis-cyan opacity-60" />
                <span className="hud-label">NO EVENTS TODAY</span>
                <span className="mt-1 text-xs text-jarvis-muted">
                  Your schedule is clear.
                </span>
              </div>
            )}
            {todaysSchedule.slice(0, 4).map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 border-b border-jarvis-border px-3 py-2.5 last:border-b-0"
              >
                <CalendarClock className="h-3.5 w-3.5 shrink-0 text-jarvis-muted" />
                <span className="flex-1 truncate text-xs text-jarvis-fg">
                  {event.title}
                </span>
                <span className="hud-mono text-[0.65rem] text-jarvis-muted">
                  {new Date(event.startAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            ))}
            <button
              onClick={() => router.push("/calendar")}
              className="hud-label px-3 py-2.5 text-left text-jarvis-cyan transition-colors hover:opacity-80"
            >
              View Full Calendar →
            </button>
          </HudPanel>
          */}
        </div>
      </div>
    </div>
  );
}
