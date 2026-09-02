import type { JarvisState } from "@/lib/types";

export type JarvisSliceState = {
  state: JarvisState;
  lastCommand: string | null;
  lastError: string | null;
};
