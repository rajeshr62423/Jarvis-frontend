import type { AuthResponse, User } from "@/lib/types";

const ACCESS_TOKEN_KEY = "jarvis.accessToken";
const REFRESH_TOKEN_KEY = "jarvis.refreshToken";
const USER_KEY = "jarvis.user";

export type Session = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

let cached: Session | null | undefined;

function isBrowser() {
  return typeof window !== "undefined";
}

export function loadSession(): Session | null {
  if (!isBrowser()) return null;
  if (cached !== undefined) return cached;

  const accessToken = window.localStorage.getItem(ACCESS_TOKEN_KEY);
  const refreshToken = window.localStorage.getItem(REFRESH_TOKEN_KEY);
  const userRaw = window.localStorage.getItem(USER_KEY);

  if (!accessToken || !refreshToken || !userRaw) {
    cached = null;
    return null;
  }

  try {
    const user = JSON.parse(userRaw) as User;
    cached = { accessToken, refreshToken, user };
    return cached;
  } catch {
    cached = null;
    return null;
  }
}

type SessionListener = (session: Session | null) => void;
const listeners = new Set<SessionListener>();

export function onSessionChange(listener: SessionListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function setSession(session: Session | null) {
  cached = session;
  listeners.forEach((listener) => listener(session));
}

export function saveSession(auth: AuthResponse): Session {
  const session: Session = {
    accessToken: auth.accessToken,
    refreshToken: auth.refreshToken,
    user: auth.user,
  };
  if (isBrowser()) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, session.accessToken);
    window.localStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
    window.localStorage.setItem(USER_KEY, JSON.stringify(session.user));
  }
  setSession(session);
  return session;
}

export function clearSession() {
  if (isBrowser()) {
    window.localStorage.removeItem(ACCESS_TOKEN_KEY);
    window.localStorage.removeItem(REFRESH_TOKEN_KEY);
    window.localStorage.removeItem(USER_KEY);
  }
  setSession(null);
}
