import type { Session } from "@/services/api/session";
import type { User } from "@/lib/types";

export type AuthStatus = "loading" | "authenticated" | "unauthenticated";

export type AuthState = {
  status: AuthStatus;
  user: User | null;
};

export type SessionChangedPayload = Session | null;
