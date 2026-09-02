import type { AuthResponse } from "@/lib/types";
import { clearSession, loadSession, saveSession } from "@/services/api/session";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(status: number, body: unknown) {
    const message =
      (typeof body === "object" &&
        body !== null &&
        "message" in body &&
        String((body as { message: unknown }).message)) ||
      `Request failed with status ${status}`;
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const session = loadSession();
  if (!session) return null;

  if (!refreshPromise) {
    refreshPromise = fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    })
      .then(async (response) => {
        if (!response.ok) return null;
        const auth = (await response.json()) as AuthResponse;
        saveSession(auth);
        return auth.accessToken;
      })
      .catch(() => null)
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

type ApiOptions = Omit<RequestInit, "body"> & {
  body?: unknown;
  auth?: boolean;
};

export async function api<T>(
  path: string,
  { auth = true, body, headers, ...options }: ApiOptions = {},
): Promise<T> {
  const session = auth ? loadSession() : null;

  const isFormData = body instanceof FormData;

  const doFetch = async (accessToken?: string) =>
    fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        // Omit Content-Type for FormData so the browser sets the multipart boundary itself.
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        ...headers,
      },
      body: isFormData ? body : body !== undefined ? JSON.stringify(body) : undefined,
    });

  let response = await doFetch(session?.accessToken);

  if (response.status === 401 && auth && session) {
    const newAccessToken = await refreshAccessToken();
    if (!newAccessToken) {
      clearSession();
      throw new ApiError(401, { message: "Session expired" });
    }
    response = await doFetch(newAccessToken);
  }

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new ApiError(response.status, errorBody);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}
