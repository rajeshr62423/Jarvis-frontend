import { api } from "@/services/api/client";
import type { Task, TaskPriority, TaskStatus, TaskTab } from "@/lib/types";

export type CreateTaskInput = {
  title: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  tab?: TaskTab;
  dueAt?: string;
};

export function listTasks(filters?: { status?: TaskStatus; tab?: TaskTab }) {
  const params = new URLSearchParams();
  if (filters?.status) params.set("status", filters.status);
  if (filters?.tab) params.set("tab", filters.tab);
  const query = params.toString();
  return api<Task[]>(`/tasks${query ? `?${query}` : ""}`);
}

export function createTask(input: CreateTaskInput) {
  return api<Task>("/tasks", { method: "POST", body: input });
}

export function updateTask(id: string, input: Partial<CreateTaskInput>) {
  return api<Task>(`/tasks/${id}`, { method: "PATCH", body: input });
}

export function toggleTask(id: string) {
  return api<Task>(`/tasks/${id}/toggle`, { method: "PATCH" });
}

export function deleteTask(id: string) {
  return api<Task>(`/tasks/${id}`, { method: "DELETE" });
}
