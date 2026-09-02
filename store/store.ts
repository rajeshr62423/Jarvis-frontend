import { configureStore } from "@reduxjs/toolkit";
import { api } from "@/store/api";
import { authReducer } from "@/store/features/auth/auth.reducer";
import { jarvisReducer } from "@/store/features/jarvis/jarvis.reducer";
import { notificationsReducer } from "@/store/features/notifications/notifications.reducer";
import { toastReducer } from "@/store/features/toast/toast.reducer";

export function makeStore() {
  return configureStore({
    reducer: {
      auth: authReducer,
      jarvis: jarvisReducer,
      notifications: notificationsReducer,
      toast: toastReducer,
      [api.reducerPath]: api.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(api.middleware),
  });
}

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
