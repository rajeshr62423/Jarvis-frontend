import { createReducer } from "@reduxjs/toolkit";
import { sessionChanged } from "@/store/features/auth/auth.action";
import type { AuthState } from "@/store/features/auth/auth.types";

const initialState: AuthState = {
  status: "loading",
  user: null,
};

export const authReducer = createReducer(initialState, (builder) => {
  builder.addCase(sessionChanged, (state, action) => {
    const session = action.payload;
    state.status = session ? "authenticated" : "unauthenticated";
    state.user = session?.user ?? null;
  });
});
