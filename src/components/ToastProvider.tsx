// src/components/ToastProvider.tsx
"use client";
import React, { createContext, useCallback, useContext, useState } from "react";

type Toast = { id: string; type?: "info" | "success" | "error"; title: string; ttl?: number };
type ToastContextType = { push: (t: Omit<Toast, "id">) => void };

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [list, setList] = useState<Toast[]>([]);

  const push = useCallback((t: Omit<Toast, "id">) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const ttl = t.ttl ?? 4500;
    const toast = { id, ...t, ttl };
    setList((s) => [toast, ...s]);
    setTimeout(() => setList((s) => s.filter((x) => x.id !== id)), ttl);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-xs">
        {list.map((t) => (
          <div
            key={t.id}
            className={`rounded-md p-3 shadow-md ${
              t.type === "success"
                ? "bg-green-50 border border-green-200"
                : t.type === "error"
                ? "bg-red-50 border border-red-200"
                : "bg-white border border-gray-200"
            }`}
          >
            <div
              className={`font-semibold ${
                t.type === "success"
                  ? "text-green-700"
                  : t.type === "error"
                  ? "text-red-700"
                  : "text-gray-800"
              }`}
            >
              {t.title}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
