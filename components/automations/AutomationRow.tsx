"use client";

import { Trash2 } from "lucide-react";
import { useDeleteAutomationMutation, useToggleAutomationMutation } from "@/store/api";
import { ToggleSwitch } from "@/components/hud/ToggleSwitch";
import type { Automation } from "@/lib/types";

export function AutomationRow({ automation }: { automation: Automation }) {
  const [toggleAutomation] = useToggleAutomationMutation();
  const [deleteAutomation] = useDeleteAutomationMutation();

  return (
    <div className="flex items-center gap-3 border-b border-jarvis-border px-4 py-3 last:border-b-0">
      <ToggleSwitch
        checked={automation.enabled}
        onChange={() => toggleAutomation(automation.id)}
        label="Toggle automation"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm text-jarvis-fg">{automation.title}</p>
        <p className="hud-mono text-[0.65rem] text-jarvis-muted">
          {automation.schedule.toUpperCase()}
          {automation.trigger ? ` · ${automation.trigger}` : ""} · {automation.action.toUpperCase()}
        </p>
      </div>
      {automation.lastRun && (
        <span className="hud-mono hidden text-[0.65rem] text-jarvis-muted sm:inline">
          LAST RUN {new Date(automation.lastRun).toLocaleDateString()}
        </span>
      )}
      <button
        onClick={() => deleteAutomation(automation.id)}
        aria-label="Delete automation"
        className="text-jarvis-muted transition-colors hover:text-jarvis-crit"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
