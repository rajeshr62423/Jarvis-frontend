export type ToastTone = "info" | "success" | "warning" | "error";

export type ToastItem = {
  id: string;
  title: string;
  message: string;
  tone: ToastTone;
};

export type ToastState = {
  items: ToastItem[];
};
