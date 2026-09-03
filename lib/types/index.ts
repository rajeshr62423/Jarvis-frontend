export type User = {
  id: string;
  email: string;
  name: string;
};

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "done";
export type TaskTab = "my" | "project";

export type Task = {
  id: string;
  userId: string;
  title: string;
  priority: TaskPriority;
  status: TaskStatus;
  tab: TaskTab;
  dueAt: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CalendarEvent = {
  id: string;
  userId: string;
  title: string;
  startAt: string;
  endAt: string;
  color: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  userId: string;
  content: string;
  role: ChatRole;
  tokens: number;
  createdAt: string;
};

export type Notification = {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  data: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
};

export type Automation = {
  id: string;
  userId: string;
  title: string;
  schedule: string;
  trigger: string | null;
  action: string;
  enabled: boolean;
  config: Record<string, unknown>;
  lastRun: string | null;
  createdAt: string;
  updatedAt: string;
};

export type IntegrationProvider =
  | "google-calendar"
  | "gmail"
  | "slack"
  | "teams"
  | "notion"
  | "drive"
  | "github";

export type Integration = {
  id: string;
  userId: string;
  provider: string;
  connected: boolean;
  expiresAt: string | null;
  metadata: unknown;
  createdAt: string;
  updatedAt: string;
};

export type Profile = {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  plan: string;
  preferences: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};

export type Settings = {
  id: string;
  userId: string;
  voice: string;
  appearance: string;
  aiBehavior: string;
  assistantIdentity: string;
  notifications: Record<string, unknown>;
  language: string;
  timezone: string;
  updatedAt: string;
};

export type AnalyticsRange = "day" | "week" | "month" | "year";

export type AnalyticsSummary = {
  range: string;
  period: { startDate: string; endDate: string };
  taskCompletion: { completed: number; total: number; percentage: number };
  events: number;
  chatInteractions: number;
  productivityScore: number;
  timeDistribution: { morning: number; afternoon: number; evening: number };
};

export type JarvisState =
  | "idle"
  | "listening"
  | "thinking"
  | "speaking"
  | "executing"
  | "error";

export type ConnectionState =
  | "connected"
  | "connecting"
  | "disconnected"
  | "reconnecting";
