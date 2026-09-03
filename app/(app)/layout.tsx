"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useAssistantIdentity } from "@/hooks/useAssistantIdentity";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import { useGetSettingsQuery } from "@/store/api";
import { HudNavigation } from "@/components/layout/HudNavigation";
import { ConnectionBanner } from "@/components/hud/ConnectionBanner";
import { ToastStack } from "@/components/hud/ToastStack";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status } = useAuth();
  const { data: settings } = useGetSettingsQuery(undefined, {
    skip: status !== "authenticated",
  });
  const identity = useAssistantIdentity();
  useNotificationsSocket();

  useEffect(() => {
    if (settings?.appearance) {
      document.documentElement.dataset.theme = settings.appearance;
    }
  }, [settings?.appearance]);

  useEffect(() => {
    document.title = identity;
    return () => {
      document.title = "JARVIS";
    };
  }, [identity]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-dvh items-center justify-center">
        <span className="hud-label animate-pulse">ESTABLISHING SECURE SESSION...</span>
      </div>
    );
  }

  return (
    <div className="hud-grid-bg flex min-h-dvh flex-col gap-3 overflow-x-hidden p-3 md:flex-row">
      <ToastStack />
      <HudNavigation />
      <div className="app-main-scroll flex min-w-0 flex-1 flex-col gap-3">
        <ConnectionBanner />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
