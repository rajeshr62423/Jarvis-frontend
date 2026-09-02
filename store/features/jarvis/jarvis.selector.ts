import type { RootState } from "@/store/store";

export const selectJarvisState = (state: RootState) => state.jarvis.state;
export const selectJarvisLastCommand = (state: RootState) => state.jarvis.lastCommand;
export const selectJarvisLastError = (state: RootState) => state.jarvis.lastError;
