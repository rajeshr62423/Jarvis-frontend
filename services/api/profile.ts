import { api } from "@/services/api/client";
import type { Profile } from "@/lib/types";

export type UpdateProfileInput = {
  name?: string;
  email?: string;
  avatarUrl?: string;
  preferences?: Record<string, unknown>;
};

export function getProfile() {
  return api<Profile>("/profile");
}

export function updateProfile(input: UpdateProfileInput) {
  return api<Profile>("/profile", { method: "PATCH", body: input });
}

export function uploadAvatar(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  return api<Profile>("/profile/avatar", { method: "POST", body: formData });
}
