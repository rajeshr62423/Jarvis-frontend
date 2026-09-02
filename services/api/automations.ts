import { api } from "@/services/api/client";
import type { Automation } from "@/lib/types";

export type CreateAutomationInput = {
  title: string;
  schedule: string;
  trigger?: string;
  action?: string;
  enabled?: boolean;
  config?: Record<string, unknown>;
};

export function listAutomations() {
  return api<Automation[]>("/automations");
}

export function createAutomation(input: CreateAutomationInput) {
  return api<Automation>("/automations", { method: "POST", body: input });
}

export function updateAutomation(
  id: string,
  input: Partial<CreateAutomationInput>,
) {
  return api<Automation>(`/automations/${id}`, { method: "PATCH", body: input });
}

export function toggleAutomation(id: string) {
  return api<Automation>(`/automations/${id}/toggle`, { method: "PATCH" });
}

export function deleteAutomation(id: string) {
  return api<Automation>(`/automations/${id}`, { method: "DELETE" });
}
