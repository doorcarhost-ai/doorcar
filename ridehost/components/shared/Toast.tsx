"use client";

import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle, Info, X, AlertTriangle } from "lucide-react";
import { useNotificationStore } from "@/lib/store";

export function ToastContainer() {
  const { notifications, removeNotification } = useNotificationStore();

  const icons = {
    success: <CheckCircle className="h-4 w-4 text-green-600" />,
    error: <AlertCircle className="h-4 w-4 text-red-600" />,
    info: <Info className="h-4 w-4 text-blue-600" />,
    warning: <AlertTriangle className="h-4 w-4 text-[#FF7A00]" />,
  };

  const colors = {
    success: "border-green-200 bg-green-50",
    error: "border-red-200 bg-red-50",
    info: "border-blue-200 bg-blue-50",
    warning: "border-[#FF7A00]/20 bg-[#FFF8F3]",
  };

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {notifications.map((n) => (
          <motion.div
            key={n.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl border shadow-premium-lg ${colors[n.type]}`}
          >
            <div className="shrink-0 mt-0.5">{icons[n.type]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111827]">{n.title}</p>
              <p className="text-xs text-[#6B7280] mt-0.5">{n.message}</p>
            </div>
            <button onClick={() => removeNotification(n.id)} className="shrink-0 h-6 w-6 flex items-center justify-center rounded-lg hover:bg-black/5 transition-colors">
              <X className="h-3.5 w-3.5 text-[#6B7280]" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
