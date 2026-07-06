'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type: ToastType;
}

interface ToastContextType {
  toast: (options: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback(({ title, message, type }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-start gap-3 p-4 rounded-lg shadow-lg border w-80 fade-in-up pointer-events-auto"
            style={{ 
              borderColor: t.type === 'error' ? 'rgb(239 68 68 / 0.5)' : t.type === 'success' ? 'rgb(34 197 94 / 0.5)' : 'rgb(var(--color-border))',
              backgroundColor: 'rgb(var(--color-surface))'
            }}
          >
            {t.type === 'success' && <CheckCircle className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />}
            {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
            {t.type === 'info' && <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: 'rgb(var(--color-text))' }}>{t.title}</p>
              {t.message && <p className="text-sm mt-1" style={{ color: 'rgb(var(--color-text-2))' }}>{t.message}</p>}
            </div>
            <button onClick={() => removeToast(t.id)} className="shrink-0 transition-colors" style={{ color: 'rgb(var(--color-text-3))' }} onMouseOver={(e) => e.currentTarget.style.color = 'rgb(var(--color-text))'} onMouseOut={(e) => e.currentTarget.style.color = 'rgb(var(--color-text-3))'}>
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
