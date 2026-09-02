"use client";

import { Check, Trash2 } from "lucide-react";
import { useDeleteTaskMutation, useToggleTaskMutation } from "@/store/api";
import type { Task } from "@/lib/types";

const PRIORITY_TONE: Record<Task["priority"], string> = {
  high: "var(--jarvis-crit)",
  medium: "var(--jarvis-warn)",
  low: "var(--jarvis-muted)",
};

export function TaskRow({ task }: { task: Task }) {
  const [toggleTask] = useToggleTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const done = task.status === "done";
  const dueDate = task.dueAt ? new Date(task.dueAt) : null;
  const dueLabel =
    dueDate && dueDate.toDateString() === new Date().toDateString()
      ? "TODAY"
      : dueDate
        ? dueDate
            .toLocaleDateString([], { month: "short", day: "2-digit" })
            .toUpperCase()
        : "NO DEADLINE";

  return (
    <div className={`task-row group ${done ? "is-complete" : ""}`}>
      <button
        type="button"
        onClick={() => toggleTask(task.id)}
        aria-label={done ? "Mark task as todo" : "Mark task as done"}
        className="task-checkbox flex h-5 w-5 shrink-0 items-center justify-center rounded-full border"
        style={{
          borderColor: done
            ? "var(--jarvis-ok)"
            : "var(--jarvis-border-strong)",
          background: done ? "var(--jarvis-ok)" : "transparent",
        }}
      >
        {done && <Check className="h-3 w-3 text-jarvis-bg" />}
      </button>
      <div className="task-content">
        <span className="task-title">{task.title}</span>
        <span className="hud-label task-meta">
          {done ? "COMPLETED" : "SYSTEM OBJECTIVE"}
        </span>
      </div>
      <span
        className="task-priority hud-label"
        style={{ color: PRIORITY_TONE[task.priority] }}
      >
        {task.priority === "high"
          ? "▲"
          : task.priority === "medium"
            ? "◆"
            : "○"}{" "}
        {task.priority.toUpperCase()}
      </span>
      <span
        className={`task-due hud-mono ${dueDate && dueDate < new Date() && !done ? "is-overdue" : ""}`}
      >
        <span>{dueLabel}</span>
        {dueDate && <small>{dueDate.getFullYear()}</small>}
      </span>
      <button
        type="button"
        onClick={() => deleteTask(task.id)}
        aria-label={`Delete ${task.title}`}
        title="Delete task"
        className="task-action text-jarvis-muted transition-colors hover:text-jarvis-crit"
      >
        <Trash2 className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
