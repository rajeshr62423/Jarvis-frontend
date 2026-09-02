"use client";

import { useGetProfileQuery, useGetSettingsQuery } from "@/store/api";
import { SettingsForm } from "@/components/settings/SettingsForm";

export default function SettingsPage() {
  const { data: profile } = useGetProfileQuery();
  const { data: settings } = useGetSettingsQuery();

  if (!profile || !settings) {
    return <div className="hud-label px-4 py-6 opacity-50">LOADING CONFIGURATION...</div>;
  }

  return <SettingsForm profile={profile} settings={settings} />;
}
