import type { RootState } from "@/store/store";

export const selectToasts = (state: RootState) => state.toast.items;
