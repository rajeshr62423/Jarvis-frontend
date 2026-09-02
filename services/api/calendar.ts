import { api } from "@/services/api/client";
import type { CalendarEvent } from "@/lib/types";

export type CreateEventInput = {
  title: string;
  startAt: string;
  endAt: string;
  color?: string;
  description?: string;
};

export function listEvents(range?: { from: string; to: string }) {
  const params = new URLSearchParams();
  if (range) {
    params.set("from", range.from);
    params.set("to", range.to);
  }
  const query = params.toString();
  return api<CalendarEvent[]>(`/calendar${query ? `?${query}` : ""}`);
}

export function createEvent(input: CreateEventInput) {
  return api<CalendarEvent>("/calendar", { method: "POST", body: input });
}

export function updateEvent(id: string, input: Partial<CreateEventInput>) {
  return api<CalendarEvent>(`/calendar/${id}`, { method: "PATCH", body: input });
}

export function deleteEvent(id: string) {
  return api<CalendarEvent>(`/calendar/${id}`, { method: "DELETE" });
}
