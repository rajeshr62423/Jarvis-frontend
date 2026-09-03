import { api } from "@/services/api/client";
import type { Settings } from "@/lib/types";

export type UpdateSettingsInput = {
  voice?: string;
  appearance?: string;
  aiBehavior?: string;
  assistantIdentity?: string;
  notifications?: Record<string, unknown>;
  language?: string;
  timezone?: string;
};

export function getSettings() {
  return api<Settings>("/settings");
}

export function updateSettings(input: UpdateSettingsInput) {
  return api<Settings>("/settings", { method: "PATCH", body: input });
}
