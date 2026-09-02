"use client";

import { useEffect } from "react";
import { loadSession, onSessionChange } from "@/services/api/session";
import { sessionChanged } from "@/store/features/auth/auth.action";
import { useAppDispatch } from "@/store/hooks";

/**
 * Session persistence (localStorage) lives outside React so the API client's
 * silent 401 refresh can update it without a hook. This bridges those
 * changes into the Redux store so components stay in sync.
 */
export function SessionBridge() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(sessionChanged(loadSession()));
    return onSessionChange((session) => dispatch(sessionChanged(session)));
  }, [dispatch]);

  return null;
}
