"use client";

import { useGetSettingsQuery } from "@/store/api";
import { DEFAULT_ASSISTANT_IDENTITY } from "@/lib/assistantIdentities";

/**
 * The user's chosen assistant name/persona (Settings > Assistant Identity),
 * for authenticated-area UI copy. Falls back to the default while settings
 * are still loading or unavailable — never used on pre-auth screens (login,
 * register, boot sequence), since there's no session to read a preference
 * from there.
 */
export function useAssistantIdentity(): string {
  const { data: settings } = useGetSettingsQuery();
  return settings?.assistantIdentity || DEFAULT_ASSISTANT_IDENTITY;
}
