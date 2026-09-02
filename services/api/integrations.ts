import { api } from "@/services/api/client";
import type { Integration, IntegrationProvider } from "@/lib/types";

export function listIntegrations() {
  return api<Integration[]>("/integrations");
}

export function getIntegration(provider: IntegrationProvider) {
  return api<Integration>(`/integrations/${provider}`);
}

export function connectIntegration(provider: IntegrationProvider, code?: string) {
  return api<Integration>(`/integrations/${provider}/connect`, {
    method: "POST",
    body: { code },
  });
}

export function disconnectIntegration(provider: IntegrationProvider) {
  return api<Integration>(`/integrations/${provider}/disconnect`, {
    method: "POST",
  });
}
