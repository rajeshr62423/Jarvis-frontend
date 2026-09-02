import { API_URL } from "@/services/api/client";

export function resolveAvatarUrl(avatarUrl: string | null | undefined) {
  if (!avatarUrl) return null;
  return avatarUrl.startsWith("http") ? avatarUrl : `${API_URL}${avatarUrl}`;
}
