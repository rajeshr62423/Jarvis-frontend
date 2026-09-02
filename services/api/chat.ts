import { api } from "@/services/api/client";
import type { ChatMessage } from "@/lib/types";

export function getChatHistory() {
  return api<ChatMessage[]>("/chat/history");
}

export function sendMessage(content: string) {
  return api<{ userMessage: ChatMessage; assistantMessage: ChatMessage }>(
    "/chat/messages",
    { method: "POST", body: { content } },
  );
}

export function deleteChatMessage(id: string) {
  return api<void>(`/chat/messages/${id}`, { method: "DELETE" });
}

export function clearChatHistory() {
  return api<void>("/chat/history", { method: "DELETE" });
}
