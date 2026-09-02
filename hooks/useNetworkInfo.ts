"use client";

import { useSyncExternalStore } from "react";
import { readNetworkInfo, subscribeNetworkInfo } from "@/services/api/network";
import type { NetworkInfo } from "@/services/api/network";

const SERVER_SNAPSHOT: NetworkInfo = {
  supported: false,
  effectiveType: null,
  downlinkMbps: null,
};

export function useNetworkInfo(): NetworkInfo {
  return useSyncExternalStore(subscribeNetworkInfo, readNetworkInfo, () => SERVER_SNAPSHOT);
}
