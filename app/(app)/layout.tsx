"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
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
  useNotificationsSocket();

  useEffect(() => {
    if (settings?.appearance) {
      document.documentElement.dataset.theme = settings.appearance;
    }
  }, [settings?.appearance]);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status !== "authenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="hud-label animate-pulse">ESTABLISHING SECURE SESSION...</span>
      </div>
    );
  }

  return (
    <div className="hud-grid-bg flex min-h-screen flex-col gap-3 p-3 pb-20 md:flex-row md:pb-3">
      <ToastStack />
      <HudNavigation />
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <ConnectionBanner />
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
