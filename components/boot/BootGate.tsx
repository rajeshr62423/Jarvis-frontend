"use client";

import { useState, useSyncExternalStore } from "react";
import { BootSequence } from "@/components/boot/BootSequence";

const BOOT_SEEN_KEY = "jarvis.bootSeen";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  return window.localStorage.getItem(BOOT_SEEN_KEY) === "1";
}

// Assume "already seen" for the server-rendered/pre-hydration pass so
// returning visitors (the common case) never see a boot-sequence flash.
function getServerSnapshot() {
  return true;
}

export function BootGate({ children }: { children: React.ReactNode }) {
  const seen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const [completed, setCompleted] = useState(false);

  if (seen || completed) return <>{children}</>;

  return (
    <BootSequence
      onComplete={() => {
        window.localStorage.setItem(BOOT_SEEN_KEY, "1");
        setCompleted(true);
      }}
    />
  );
}
