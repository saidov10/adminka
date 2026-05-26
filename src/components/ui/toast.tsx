import { useState, useEffect } from "react";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: string;
  title?: string;
  description?: string;
  type?: ToastType;
}

let toastListeners: Array<(toasts: Toast[]) => void> = [];
let toasts: Toast[] = [];

export const toast = ({
  title,
  description,
  variant,
}: {
  title?: string;
  description?: string;
  variant?: "default" | "destructive" | "success";
}) => {
  const id = Math.random().toString(36).substring(2, 9);
  let type: ToastType = "info";
  if (variant === "destructive") type = "error";
  if (variant === "success") type = "success";

  toasts = [...toasts, { id, title, description, type }];
  toastListeners.forEach((listener) => listener(toasts));

  setTimeout(() => {
    toasts = toasts.filter((t) => t.id !== id);
    toastListeners.forEach((listener) => listener(toasts));
  }, 4000);
};

export const Toaster = () => {
  const [currentToasts, setCurrentToasts] = useState<Toast[]>([]);

  useEffect(() => {
    setCurrentToasts(toasts);
    toastListeners.push(setCurrentToasts);
    return () => {
      toastListeners = toastListeners.filter((l) => l !== setCurrentToasts);
    };
  }, []);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {currentToasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-xl border shadow-2xl pointer-events-auto transition-all duration-300 transform translate-y-0 scale-100 flex flex-col gap-1 backdrop-blur-md ${
            t.type === "success"
              ? "bg-slate-900/90 border-emerald-500/30 text-white"
              : t.type === "error"
              ? "bg-slate-900/90 border-rose-500/30 text-white"
              : "bg-slate-900/90 border-slate-800 text-white"
          }`}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg">
              {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
            </span>
            <div className="flex-1">
              {t.title && <div className="font-semibold text-sm tracking-wide">{t.title}</div>}
              {t.description && <div className="text-xs text-slate-400 mt-0.5">{t.description}</div>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
