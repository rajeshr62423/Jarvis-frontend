import { api } from "@/services/api/client";
import type { AnalyticsRange, AnalyticsSummary } from "@/lib/types";

export function getAnalyticsSummary(range: AnalyticsRange = "week") {
  return api<AnalyticsSummary>(`/analytics/summary?range=${range}`);
}
