import { createAction } from "@reduxjs/toolkit";
import { SESSION_CHANGED } from "@/store/features/auth/auth.actionType";
import type { SessionChangedPayload } from "@/store/features/auth/auth.types";

export const sessionChanged = createAction<SessionChangedPayload>(SESSION_CHANGED);
