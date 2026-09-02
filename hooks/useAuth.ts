"use client";

import { useCallback } from "react";
import * as authApi from "@/services/api/auth";
import { clearSession, saveSession } from "@/services/api/session";
import { useAppSelector } from "@/store/hooks";
import { selectAuthStatus, selectAuthUser } from "@/store/features/auth/auth.selector";

export function useAuth() {
  const status = useAppSelector(selectAuthStatus);
  const user = useAppSelector(selectAuthUser);

  const login = useCallback(async (email: string, password: string) => {
    const auth = await authApi.login(email, password);
    saveSession(auth);
  }, []);

  const register = useCallback(
    async (email: string, password: string, name: string) => {
      const auth = await authApi.register(email, password, name);
      saveSession(auth);
    },
    [],
  );

  const logout = useCallback(() => {
    clearSession();
  }, []);

  return { status, user, login, register, logout };
}
