import { createApi, fakeBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiError } from "@/services/api/client";
import * as tasksApi from "@/services/api/tasks";
import * as calendarApi from "@/services/api/calendar";
import * as chatApi from "@/services/api/chat";
import * as automationsApi from "@/services/api/automations";
import * as integrationsApi from "@/services/api/integrations";
import * as profileApi from "@/services/api/profile";
import * as settingsApi from "@/services/api/settings";
import * as analyticsApi from "@/services/api/analytics";
import type {
  AnalyticsRange,
  Automation,
  CalendarEvent,
  ChatMessage,
  Integration,
  IntegrationProvider,
  Profile,
  Settings,
  Task,
  TaskStatus,
  TaskTab,
} from "@/lib/types";

async function run<T>(fn: () => Promise<T>) {
  try {
    return { data: await fn() };
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: { status: error.status, data: error.body } };
    }
    return { error: { status: "CUSTOM_ERROR" as const, data: String(error) } };
  }
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    "Task",
    "CalendarEvent",
    "ChatMessage",
    "Automation",
    "Integration",
    "Profile",
    "Settings",
    "Analytics",
  ],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], { status?: TaskStatus; tab?: TaskTab } | void>({
      queryFn: (filters) => run(() => tasksApi.listTasks(filters ?? undefined)),
      providesTags: ["Task"],
    }),
    createTask: builder.mutation<Task, tasksApi.CreateTaskInput>({
      queryFn: (input) => run(() => tasksApi.createTask(input)),
      invalidatesTags: ["Task"],
    }),
    updateTask: builder.mutation<
      Task,
      { id: string; input: Partial<tasksApi.CreateTaskInput> }
    >({
      queryFn: ({ id, input }) => run(() => tasksApi.updateTask(id, input)),
      invalidatesTags: ["Task"],
    }),
    toggleTask: builder.mutation<Task, string>({
      queryFn: (id) => run(() => tasksApi.toggleTask(id)),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData("getTasks", undefined, (draft) => {
            const task = draft.find((t) => t.id === id);
            if (task) task.status = task.status === "done" ? "todo" : "done";
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Task"],
    }),
    deleteTask: builder.mutation<Task, string>({
      queryFn: (id) => run(() => tasksApi.deleteTask(id)),
      invalidatesTags: ["Task"],
    }),

    getEvents: builder.query<CalendarEvent[], { from: string; to: string } | void>({
      queryFn: (range) => run(() => calendarApi.listEvents(range ?? undefined)),
      providesTags: ["CalendarEvent"],
    }),
    createEvent: builder.mutation<CalendarEvent, calendarApi.CreateEventInput>({
      queryFn: (input) => run(() => calendarApi.createEvent(input)),
      invalidatesTags: ["CalendarEvent"],
    }),
    updateEvent: builder.mutation<
      CalendarEvent,
      { id: string; input: Partial<calendarApi.CreateEventInput> }
    >({
      queryFn: ({ id, input }) => run(() => calendarApi.updateEvent(id, input)),
      invalidatesTags: ["CalendarEvent"],
    }),
    deleteEvent: builder.mutation<CalendarEvent, string>({
      queryFn: (id) => run(() => calendarApi.deleteEvent(id)),
      invalidatesTags: ["CalendarEvent"],
    }),

    getChatHistory: builder.query<ChatMessage[], void>({
      queryFn: () => run(() => chatApi.getChatHistory()),
      providesTags: ["ChatMessage"],
    }),
    sendChatMessage: builder.mutation<
      { userMessage: ChatMessage; assistantMessage: ChatMessage },
      string
    >({
      queryFn: (content) => run(() => chatApi.sendMessage(content)),
      async onQueryStarted(_content, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            api.util.updateQueryData("getChatHistory", undefined, (draft) => {
              draft.push(data.userMessage, data.assistantMessage);
            }),
          );
        } catch {
          // surfaced to caller via the mutation promise
        }
      },
    }),
    deleteChatMessage: builder.mutation<void, string>({
      queryFn: (id) => run(() => chatApi.deleteChatMessage(id)),
      invalidatesTags: ["ChatMessage"],
    }),
    clearChatHistory: builder.mutation<void, void>({
      queryFn: () => run(() => chatApi.clearChatHistory()),
      invalidatesTags: ["ChatMessage"],
    }),

    getAutomations: builder.query<Automation[], void>({
      queryFn: () => run(() => automationsApi.listAutomations()),
      providesTags: ["Automation"],
    }),
    createAutomation: builder.mutation<
      Automation,
      automationsApi.CreateAutomationInput
    >({
      queryFn: (input) => run(() => automationsApi.createAutomation(input)),
      invalidatesTags: ["Automation"],
    }),
    updateAutomation: builder.mutation<
      Automation,
      { id: string; input: Partial<automationsApi.CreateAutomationInput> }
    >({
      queryFn: ({ id, input }) => run(() => automationsApi.updateAutomation(id, input)),
      invalidatesTags: ["Automation"],
    }),
    toggleAutomation: builder.mutation<Automation, string>({
      queryFn: (id) => run(() => automationsApi.toggleAutomation(id)),
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const patch = dispatch(
          api.util.updateQueryData("getAutomations", undefined, (draft) => {
            const automation = draft.find((a) => a.id === id);
            if (automation) automation.enabled = !automation.enabled;
          }),
        );
        try {
          await queryFulfilled;
        } catch {
          patch.undo();
        }
      },
      invalidatesTags: ["Automation"],
    }),
    deleteAutomation: builder.mutation<Automation, string>({
      queryFn: (id) => run(() => automationsApi.deleteAutomation(id)),
      invalidatesTags: ["Automation"],
    }),

    getIntegrations: builder.query<Integration[], void>({
      queryFn: () => run(() => integrationsApi.listIntegrations()),
      providesTags: ["Integration"],
    }),
    connectIntegration: builder.mutation<
      Integration,
      { provider: IntegrationProvider; code?: string }
    >({
      queryFn: ({ provider, code }) =>
        run(() => integrationsApi.connectIntegration(provider, code)),
      invalidatesTags: ["Integration"],
    }),
    disconnectIntegration: builder.mutation<Integration, IntegrationProvider>({
      queryFn: (provider) => run(() => integrationsApi.disconnectIntegration(provider)),
      invalidatesTags: ["Integration"],
    }),

    getProfile: builder.query<Profile, void>({
      queryFn: () => run(() => profileApi.getProfile()),
      providesTags: ["Profile"],
    }),
    updateProfile: builder.mutation<Profile, profileApi.UpdateProfileInput>({
      queryFn: (input) => run(() => profileApi.updateProfile(input)),
      invalidatesTags: ["Profile"],
    }),
    uploadAvatar: builder.mutation<Profile, File>({
      queryFn: (file) => run(() => profileApi.uploadAvatar(file)),
      invalidatesTags: ["Profile"],
    }),

    getSettings: builder.query<Settings, void>({
      queryFn: () => run(() => settingsApi.getSettings()),
      providesTags: ["Settings"],
    }),
    updateSettings: builder.mutation<Settings, settingsApi.UpdateSettingsInput>({
      queryFn: (input) => run(() => settingsApi.updateSettings(input)),
      invalidatesTags: ["Settings"],
    }),

    getAnalyticsSummary: builder.query<
      Awaited<ReturnType<typeof analyticsApi.getAnalyticsSummary>>,
      AnalyticsRange | void
    >({
      queryFn: (range) => run(() => analyticsApi.getAnalyticsSummary(range ?? undefined)),
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useToggleTaskMutation,
  useDeleteTaskMutation,
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetChatHistoryQuery,
  useSendChatMessageMutation,
  useDeleteChatMessageMutation,
  useClearChatHistoryMutation,
  useGetAutomationsQuery,
  useCreateAutomationMutation,
  useUpdateAutomationMutation,
  useToggleAutomationMutation,
  useDeleteAutomationMutation,
  useGetIntegrationsQuery,
  useConnectIntegrationMutation,
  useDisconnectIntegrationMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetAnalyticsSummaryQuery,
} = api;
