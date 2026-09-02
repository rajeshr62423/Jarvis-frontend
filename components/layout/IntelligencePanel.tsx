"use client";

import { X } from "lucide-react";
import { useGetAnalyticsSummaryQuery } from "@/store/api";
import { useGetAutomationsQuery } from "@/store/api";
import { useGetTasksQuery } from "@/store/api";
import { useNotifications } from "@/hooks/useNotifications";
import { HudPanel } from "@/components/hud/HudPanel";
import { Meter } from "@/components/hud/Meter";
import { StatusIndicator } from "@/components/hud/StatusIndicator";
import { ConnectionIndicator } from "@/components/hud/ConnectionIndicator";

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 1) return "NOW";
  if (minutes < 60) return `${minutes}M AGO`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}H AGO`;
  return `${Math.floor(hours / 24)}D AGO`;
}

export function IntelligencePanel({ onClose }: { onClose?: () => void }) {
  const { data: analytics } = useGetAnalyticsSummaryQuery("week");
  const { data: tasks } = useGetTasksQuery({ status: "todo" });
  const { data: automations } = useGetAutomationsQuery();
  const { notifications } = useNotifications();

  const activeAutomations = automations?.filter((a) => a.enabled).length ?? 0;

  return (
    <aside className="hud-panel flex h-full w-full flex-col gap-5 overflow-y-auto p-4 lg:w-72">
      <div className="flex items-center justify-between">
        <span className="hud-label">SYSTEM INTELLIGENCE</span>
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Close system intelligence panel"
            className="text-jarvis-muted transition-colors hover:text-jarvis-cyan"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Meter label="AI CORE" value={analytics?.productivityScore ?? 0} />
        <div className="flex items-center justify-between">
          <span className="hud-label">NETWORK</span>
          <ConnectionIndicator />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="hud-panel flex flex-col gap-1 p-3">
          <span className="hud-label">ACTIVE TASKS</span>
          <span className="hud-mono text-xl text-jarvis-cyan text-glow">
            {String(tasks?.length ?? 0).padStart(2, "0")}
          </span>
        </div>
        <div className="hud-panel flex flex-col gap-1 p-3">
          <span className="hud-label">AUTOMATIONS</span>
          <span className="hud-mono text-xl text-jarvis-cyan text-glow">
            {String(activeAutomations).padStart(2, "0")}
          </span>
        </div>
      </div>

      <HudPanel title="RECENT ACTIVITY" className="flex-1">
        <div className="flex flex-col divide-y divide-jarvis-border">
          {notifications.length === 0 && (
            <div className="hud-label px-4 py-4 opacity-50">NO RECENT ACTIVITY</div>
          )}
          {notifications.slice(0, 8).map((n) => (
            <div key={n.id} className="flex flex-col gap-1 px-4 py-3">
              <div className="flex items-center justify-between">
                <StatusIndicator
                  label={n.type.toUpperCase()}
                  tone={n.read ? "muted" : "cyan"}
                />
                <span className="hud-mono text-[0.6rem] text-jarvis-muted">
                  {timeAgo(n.createdAt)}
                </span>
              </div>
              <p className="text-xs leading-snug text-jarvis-fg/80">{n.title}</p>
            </div>
          ))}
        </div>
      </HudPanel>
    </aside>
  );
}
