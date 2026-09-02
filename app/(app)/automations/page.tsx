"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { useCreateAutomationMutation, useGetAutomationsQuery } from "@/store/api";
import { HudPanel } from "@/components/hud/HudPanel";
import { AutomationRow } from "@/components/automations/AutomationRow";

export default function AutomationsPage() {
  const { data: automations = [], isLoading } = useGetAutomationsQuery();
  const [createAutomation, { isLoading: creating }] = useCreateAutomationMutation();
  const [title, setTitle] = useState("");
  const [schedule, setSchedule] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !schedule.trim()) return;
    await createAutomation({ title: title.trim(), schedule: schedule.trim() });
    setTitle("");
    setSchedule("");
  };

  const activeCount = automations.filter((a) => a.enabled).length;

  return (
    <div className="flex h-full flex-col gap-4">
      <span className="hud-label">AUTOMATION WORKFLOWS · {activeCount} ACTIVE</span>

      <form onSubmit={handleCreate} className="hud-panel flex flex-wrap items-center gap-2 p-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="AUTOMATION TITLE..."
          className="hud-mono flex-1 basis-40 bg-transparent px-2 text-sm text-jarvis-fg placeholder:text-jarvis-muted focus:outline-none"
        />
        <input
          value={schedule}
          onChange={(e) => setSchedule(e.target.value)}
          placeholder="SCHEDULE (e.g. daily, 08:00)"
          className="hud-mono rounded border border-jarvis-border bg-jarvis-bg-2 px-2 py-1.5 text-xs text-jarvis-fg placeholder:text-jarvis-muted focus:outline-none"
        />
        <button
          type="submit"
          disabled={creating || !title.trim() || !schedule.trim()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-jarvis-border-strong text-jarvis-cyan transition-colors hover:bg-jarvis-glow/20 disabled:opacity-30"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      <HudPanel title={`${automations.length} AUTOMATION${automations.length === 1 ? "" : "S"}`} className="flex-1 overflow-y-auto">
        {isLoading && <div className="hud-label px-4 py-6 opacity-50">LOADING AUTOMATIONS...</div>}
        {!isLoading && automations.length === 0 && (
          <div className="hud-label px-4 py-6 opacity-50">NO AUTOMATIONS CONFIGURED</div>
        )}
        {automations.map((automation) => (
          <AutomationRow key={automation.id} automation={automation} />
        ))}
      </HudPanel>
    </div>
  );
}
