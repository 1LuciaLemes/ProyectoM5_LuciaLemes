import { createContext, useContext } from "react";

export type Toast = {
  id: string;
  message: string;
  type: "success" | "error" | "info";
};

export type ToastContextType = {
  toast: (message: string, type?: Toast["type"]) => void;
};

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}