'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

interface ToastContextType {
  showToast: (message: string, type?: Toast['type'], duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: Toast['type'] = 'info', duration = 3000) => {
      const id = Date.now().toString();
      const toast: Toast = { id, message, type, duration };

      setToasts((prev) => [...prev, toast]);

      if (duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
      }
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-20 right-6 z-50 space-y-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 20, x: 100 }}
              animate={{ opacity: 1, y: 0, x: 0 }}
              exit={{ opacity: 0, y: -20, x: 100 }}
              transition={{ type: 'spring', damping: 15 }}
              className={`pointer-events-auto px-4 py-3 rounded-xl font-medium shadow-lg rounded-lg backdrop-blur-md ${
                toast.type === 'success'
                  ? 'bg-green-200/80 dark:bg-green-900/50 text-green-900 dark:text-green-100'
                  : toast.type === 'error'
                  ? 'bg-red-200/80 dark:bg-red-900/50 text-red-900 dark:text-red-100'
                  : toast.type === 'warning'
                  ? 'bg-yellow-200/80 dark:bg-yellow-900/50 text-yellow-900 dark:text-yellow-100'
                  : 'bg-blue-200/80 dark:bg-blue-900/50 text-blue-900 dark:text-blue-100'
              }`}
            >
              {toast.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
}
