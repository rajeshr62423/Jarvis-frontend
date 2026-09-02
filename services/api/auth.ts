import { api } from "@/services/api/client";
import type { AuthResponse } from "@/lib/types";

export function login(email: string, password: string) {
  return api<AuthResponse>("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function register(email: string, password: string, name: string) {
  return api<AuthResponse>("/auth/register", {
    method: "POST",
    body: { email, password, name },
    auth: false,
  });
}
