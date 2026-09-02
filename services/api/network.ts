export type NetworkInfo = {
  supported: boolean;
  effectiveType: string | null;
  downlinkMbps: number | null;
};

type NavigatorConnection = {
  effectiveType?: string;
  downlink?: number;
  addEventListener: (type: "change", listener: () => void) => void;
  removeEventListener: (type: "change", listener: () => void) => void;
};

function getConnection(): NavigatorConnection | null {
  if (typeof navigator === "undefined") return null;
  const nav = navigator as Navigator & {
    connection?: NavigatorConnection;
    mozConnection?: NavigatorConnection;
    webkitConnection?: NavigatorConnection;
  };
  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection ?? null;
}

const UNSUPPORTED_SNAPSHOT: NetworkInfo = {
  supported: false,
  effectiveType: null,
  downlinkMbps: null,
};

let cached: NetworkInfo = UNSUPPORTED_SNAPSHOT;

/**
 * Returns a stable object reference when nothing has actually changed, so
 * this is safe to use as a useSyncExternalStore getSnapshot without
 * triggering re-render loops.
 */
export function readNetworkInfo(): NetworkInfo {
  const connection = getConnection();
  if (!connection) return UNSUPPORTED_SNAPSHOT;

  const effectiveType = connection.effectiveType ?? null;
  const downlinkMbps = connection.downlink ?? null;

  if (cached.effectiveType !== effectiveType || cached.downlinkMbps !== downlinkMbps) {
    cached = { supported: true, effectiveType, downlinkMbps };
  }
  return cached;
}

export function subscribeNetworkInfo(callback: () => void): () => void {
  const connection = getConnection();
  if (!connection) return () => {};
  connection.addEventListener("change", callback);
  return () => connection.removeEventListener("change", callback);
}
