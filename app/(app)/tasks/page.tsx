"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { useCreateTaskMutation, useGetTasksQuery } from "@/store/api";
import { HudPanel } from "@/components/hud/HudPanel";
import { TaskRow } from "@/components/tasks/TaskRow";
import type { TaskPriority, TaskStatus } from "@/lib/types";

const STATUS_FILTERS: { label: string; value: TaskStatus | "all" }[] = [
  { label: "ALL", value: "all" },
  { label: "ACTIVE", value: "todo" },
  { label: "DONE", value: "done" },
];

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<TaskStatus | "all">("all");
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<TaskPriority>("medium");

  const { data: tasks = [], isLoading } = useGetTasksQuery(
    statusFilter === "all" ? undefined : { status: statusFilter },
  );
  const { data: allTasks = [] } = useGetTasksQuery();
  const [createTask, { isLoading: creating }] = useCreateTaskMutation();
  const completedCount = allTasks.filter(
    (task) => task.status === "done",
  ).length;
  const activeCount = allTasks.length - completedCount;
  const progress = allTasks.length
    ? Math.round((completedCount / allTasks.length) * 100)
    : 0;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    await createTask({ title: title.trim(), priority });
    setTitle("");
  };

  return (
    <div className="tasks-command-center flex h-full flex-col gap-4">
      <header className="tasks-header flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="hud-label mb-2 text-jarvis-cyan">
            OBJECTIVE MANAGEMENT SYSTEM
          </p>
          <h1 className="hud-display text-xl tracking-[0.16em] text-jarvis-fg">
            TASK COMMAND CENTER
          </h1>
        </div>
        <div className="tasks-summary flex gap-4">
          <div>
            <span className="hud-label">TOTAL</span>
            <strong className="hud-mono">
              {allTasks.length.toString().padStart(2, "0")}
            </strong>
          </div>
          <div>
            <span className="hud-label">ACTIVE</span>
            <strong className="hud-mono text-jarvis-cyan">
              {activeCount.toString().padStart(2, "0")}
            </strong>
          </div>
          <div>
            <span className="hud-label">COMPLETE</span>
            <strong className="hud-mono text-jarvis-ok">
              {completedCount.toString().padStart(2, "0")}
            </strong>
          </div>
        </div>
      </header>

      <div className="tasks-progress hud-panel">
        <div className="flex items-center justify-between">
          <span className="hud-label">TASK PROGRESS</span>
          <span className="hud-mono text-xs text-jarvis-cyan">{progress}%</span>
        </div>
        <div className="tasks-progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
        <span className="hud-label mt-2 block text-[0.58rem]">
          {completedCount.toString().padStart(2, "0")} /{" "}
          {allTasks.length.toString().padStart(2, "0")} OBJECTIVES COMPLETE
        </span>
      </div>

      <div className="tasks-filter-bar flex items-center justify-between gap-3">
        <div className="tasks-filters flex gap-1">
          {STATUS_FILTERS.map((f) => (
            <button
              type="button"
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`tasks-filter-button hud-label rounded border px-3 py-2 transition-colors ${
                statusFilter === f.value
                  ? "is-active border-jarvis-border-strong text-jarvis-cyan"
                  : "border-transparent text-jarvis-muted hover:border-jarvis-border hover:text-jarvis-fg"
              }`}
            >
              {f.label}{" "}
              <span>
                {(f.value === "all"
                  ? allTasks.length
                  : f.value === "todo"
                    ? activeCount
                    : completedCount
                )
                  .toString()
                  .padStart(2, "0")}
              </span>
            </button>
          ))}
        </div>
      </div>

      <form
        onSubmit={handleCreate}
        className="tasks-quick-add hud-panel flex items-center gap-2 p-2"
      >
        <span className="tasks-add-mark flex h-10 w-10 shrink-0 items-center justify-center rounded-md">
          <Plus className="h-4 w-4" />
        </span>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ENTER NEW OBJECTIVE..."
          className="hud-input hud-mono flex-1 text-sm"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as TaskPriority)}
          className="hud-select hud-mono w-auto text-xs"
        >
          <option value="low">LOW</option>
          <option value="medium">MEDIUM</option>
          <option value="high">HIGH</option>
        </select>
        <button
          type="submit"
          disabled={creating || !title.trim()}
          className="tasks-add-button hud-label flex h-11 shrink-0 items-center justify-center gap-2 rounded-md border border-jarvis-border-strong px-4 text-jarvis-cyan transition-colors hover:bg-jarvis-glow/20 disabled:opacity-30"
        >
          <Check className="h-4 w-4" /> ADD TASK
        </button>
      </form>

      <HudPanel
        title={`${tasks.length} OBJECTIVE${tasks.length === 1 ? "" : "S"}`}
        className="tasks-list-panel"
      >
        {isLoading && (
          <div className="hud-label px-4 py-6 opacity-50">LOADING TASKS...</div>
        )}
        {!isLoading && tasks.length === 0 && (
          <div className="tasks-empty-state">
            <span className="tasks-empty-glyph">◈</span>
            <span className="hud-label">NO ACTIVE OBJECTIVES</span>
            <span className="text-xs text-jarvis-muted">
              JARVIS TASK QUEUE IS CLEAR.
            </span>
          </div>
        )}
        {tasks.map((task) => (
          <TaskRow key={task.id} task={task} />
        ))}
      </HudPanel>
    </div>
  );
}
