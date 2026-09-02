"use client";

import { useMemo, useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import {
  useUpdateProfileMutation,
  useUpdateSettingsMutation,
  useUploadAvatarMutation,
} from "@/store/api";
import { HudPanel } from "@/components/hud/HudPanel";
import { AuthField } from "@/components/auth/AuthField";
import { ToggleSwitch } from "@/components/hud/ToggleSwitch";
import { getTimezoneOptions } from "@/lib/timezones";
import { resolveAvatarUrl } from "@/lib/avatar";
import type { Profile, Settings } from "@/lib/types";

const NOTIFICATION_TOGGLES: { key: string; label: string }[] = [
  { key: "email", label: "EMAIL ALERTS" },
  { key: "push", label: "PUSH ALERTS" },
  { key: "sound", label: "SOUND" },
];

function readBoolPref(notifications: Record<string, unknown>, key: string) {
  return notifications[key] !== false;
}

/**
 * Mounted only once `profile`/`settings` have loaded (see SettingsPage), so
 * local form state can be initialized straight from props on first render
 * instead of being synced in from a query result via an effect.
 */
export function SettingsForm({
  profile,
  settings,
}: {
  profile: Profile;
  settings: Settings;
}) {
  const [updateProfile, { isLoading: savingProfile }] =
    useUpdateProfileMutation();
  const [updateSettings, { isLoading: savingSettings }] =
    useUpdateSettingsMutation();
  const [uploadAvatar, { isLoading: uploadingAvatar }] =
    useUploadAvatarMutation();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl ?? "");
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [voice, setVoice] = useState(settings.voice);
  const [appearance, setAppearance] = useState(settings.appearance);
  const [aiBehavior, setAiBehavior] = useState(settings.aiBehavior);
  const [timezone, setTimezone] = useState(settings.timezone);
  const timezoneOptions = useMemo(() => {
    const options = getTimezoneOptions();
    return options.includes(timezone) ? options : [timezone, ...options];
  }, [timezone]);
  const [notificationPrefs, setNotificationPrefs] = useState(() =>
    Object.fromEntries(
      NOTIFICATION_TOGGLES.map(({ key }) => [
        key,
        readBoolPref(settings.notifications, key),
      ]),
    ),
  );
  const [savedFlash, setSavedFlash] = useState<string | null>(null);

  const flash = (label: string) => {
    setSavedFlash(label);
    setTimeout(() => setSavedFlash(null), 2000);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setAvatarError(null);
    try {
      const updated = await uploadAvatar(file).unwrap();
      setAvatarUrl(updated.avatarUrl ?? "");
      flash("AVATAR UPDATED");
    } catch {
      setAvatarError("UPLOAD FAILED — USE A PNG/JPG/GIF/WEBP UNDER 5MB");
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ name, email, avatarUrl: avatarUrl || undefined });
    flash("PROFILE UPDATED");
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      voice,
      appearance,
      aiBehavior,
      timezone,
      notifications: notificationPrefs,
    }).unwrap();
    document.documentElement.dataset.theme = appearance;
    flash("PREFERENCES UPDATED");
  };

  return (
    <div className="settings-dashboard flex h-full flex-col gap-4 overflow-y-auto">
      <div className="settings-heading flex items-center justify-between">
        <span className="hud-label">OPERATOR CONFIGURATION</span>
        {savedFlash && (
          <span className="hud-label text-jarvis-ok">{savedFlash}</span>
        )}
      </div>

      <HudPanel
        title="PROFILE"
        className="settings-panel settings-profile-panel p-4 sm:p-5"
      >
        <form onSubmit={handleProfileSubmit} className="settings-profile-form">
          <div className="settings-profile-column">
            <div className="settings-profile-fields">
              <AuthField
                label="NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <AuthField
                label="EMAIL"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={savingProfile}
              className="settings-save-button hud-label rounded border border-jarvis-border-strong px-4 py-2 text-jarvis-cyan transition-colors disabled:opacity-50"
            >
              SAVE PROFILE
            </button>
          </div>
          <div className="settings-avatar-field flex flex-col gap-1.5">
            <span className="hud-label">AVATAR</span>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                aria-label="Change avatar"
                className="group relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-jarvis-border-strong bg-jarvis-bg-2 text-jarvis-muted transition-colors hover:border-jarvis-cyan"
              >
                {resolveAvatarUrl(avatarUrl) ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={resolveAvatarUrl(avatarUrl)!}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6" />
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                  <Camera className="h-5 w-5 text-jarvis-cyan" />
                </span>
              </button>
              <div className="flex flex-col gap-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingAvatar}
                  className="hud-label self-start text-jarvis-cyan transition-colors hover:opacity-80 disabled:opacity-50"
                >
                  {uploadingAvatar ? "UPLOADING..." : "CHANGE AVATAR"}
                </button>
                <span className="text-[0.65rem] text-jarvis-muted">
                  PNG, JPG, GIF or WEBP. Max 5MB.
                </span>
                {avatarError && (
                  <span className="text-[0.65rem] text-jarvis-crit">
                    {avatarError}
                  </span>
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/gif,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>
          </div>
        </form>
      </HudPanel>

      <HudPanel
        title="SYSTEM PREFERENCES"
        className="settings-panel settings-preferences-panel p-4 sm:p-5"
      >
        <form
          onSubmit={handleSettingsSubmit}
          className="settings-preferences-form"
        >
          <div className="settings-preference-column">
            <label className="flex flex-col gap-1.5">
              <span className="hud-label">VOICE</span>
              <select
                value={voice}
                onChange={(e) => setVoice(e.target.value)}
                className="hud-select hud-mono"
              >
                <option value="off">OFF</option>
                <option value="on">ON</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="hud-label">AI BEHAVIOR</span>
              <select
                value={aiBehavior}
                onChange={(e) => setAiBehavior(e.target.value)}
                className="hud-select hud-mono"
              >
                <option value="assistant">ASSISTANT</option>
                <option value="formal">FORMAL</option>
                <option value="casual">CASUAL</option>
              </select>
            </label>
            <div className="settings-notifications flex flex-col gap-3">
              <span className="hud-label">NOTIFICATIONS</span>
              {NOTIFICATION_TOGGLES.map(({ key, label }) => (
                <div
                  key={key}
                  className="settings-toggle-row flex items-center justify-between"
                >
                  <span className="text-xs text-jarvis-fg/80">{label}</span>
                  <ToggleSwitch
                    checked={notificationPrefs[key]}
                    onChange={() =>
                      setNotificationPrefs((prev) => ({
                        ...prev,
                        [key]: !prev[key],
                      }))
                    }
                    label={`Toggle ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="settings-preference-column">
            <label className="flex flex-col gap-1.5">
              <span className="hud-label">APPEARANCE</span>
              <select
                value={appearance}
                onChange={(e) => setAppearance(e.target.value)}
                className="hud-select hud-mono"
              >
                <option value="dark">DARK</option>
                <option value="light">LIGHT</option>
              </select>
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="hud-label">TIMEZONE</span>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="hud-select hud-mono"
              >
                {timezoneOptions.map((tz) => (
                  <option key={tz} value={tz}>
                    {tz}
                  </option>
                ))}
              </select>
            </label>
            <div className="settings-signal-note">
              <span className="hud-label text-jarvis-cyan">SYSTEM SIGNAL</span>
              <span className="text-xs leading-relaxed text-jarvis-muted">
                Preferences synchronize across every active JARVIS terminal.
              </span>
            </div>
          </div>

          <button
            type="submit"
            disabled={savingSettings}
            className="settings-preferences-save hud-label rounded border border-jarvis-border-strong px-4 py-2 text-jarvis-cyan transition-colors disabled:opacity-50"
          >
            SAVE PREFERENCES
          </button>
        </form>
      </HudPanel>
    </div>
  );
}
