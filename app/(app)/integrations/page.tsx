"use client";

import {
  CalendarDays,
  FileText,
  GitFork,
  HardDrive,
  Mail,
  MessagesSquare,
  Users,
} from "lucide-react";
import { useConnectIntegrationMutation, useDisconnectIntegrationMutation, useGetIntegrationsQuery } from "@/store/api";
import { HudPanel } from "@/components/hud/HudPanel";
import type { IntegrationProvider } from "@/lib/types";

const PROVIDERS: { id: IntegrationProvider; label: string; icon: typeof GitFork }[] = [
  { id: "google-calendar", label: "GOOGLE CALENDAR", icon: CalendarDays },
  { id: "gmail", label: "GMAIL", icon: Mail },
  { id: "slack", label: "SLACK", icon: MessagesSquare },
  { id: "teams", label: "TEAMS", icon: Users },
  { id: "notion", label: "NOTION", icon: FileText },
  { id: "drive", label: "DRIVE", icon: HardDrive },
  { id: "github", label: "GITHUB", icon: GitFork },
];

export default function IntegrationsPage() {
  const { data: integrations = [] } = useGetIntegrationsQuery();
  const [connect] = useConnectIntegrationMutation();
  const [disconnect] = useDisconnectIntegrationMutation();

  const statusFor = (provider: IntegrationProvider) =>
    integrations.find((i) => i.provider === provider)?.connected ?? false;

  return (
    <div className="flex h-full flex-col gap-4">
      <span className="hud-label">SYSTEM INTEGRATIONS</span>
      <div className="grid flex-1 grid-cols-1 gap-3 content-start sm:grid-cols-2 lg:grid-cols-3">
        {PROVIDERS.map(({ id, label, icon: Icon }) => {
          const connected = statusFor(id);
          return (
            <HudPanel key={id} className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <Icon className="h-5 w-5 text-jarvis-muted" />
                <span
                  className="hud-label"
                  style={{ color: connected ? "var(--jarvis-ok)" : "var(--jarvis-muted)" }}
                >
                  {connected ? "CONNECTED" : "OFFLINE"}
                </span>
              </div>
              <span className="hud-mono text-sm text-jarvis-fg">{label}</span>
              <button
                onClick={() =>
                  connected ? disconnect(id) : connect({ provider: id })
                }
                className={`hud-label rounded border py-2 transition-colors ${
                  connected
                    ? "border-jarvis-border text-jarvis-muted hover:border-jarvis-crit hover:text-jarvis-crit"
                    : "border-jarvis-border-strong text-jarvis-cyan hover:bg-jarvis-glow/20"
                }`}
              >
                {connected ? "DISCONNECT" : "CONNECT"}
              </button>
            </HudPanel>
          );
        })}
      </div>
    </div>
  );
}
