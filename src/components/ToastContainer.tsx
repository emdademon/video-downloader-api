'use client';

import React from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from 'lucide-react';
import { ToastItem } from '@/lib/types';

interface ToastContainerProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed bottom-4 right-4 left-4 z-50 flex flex-col items-end gap-3 sm:left-auto sm:bottom-6 sm:right-6 sm:w-full sm:max-w-sm"
    >
      {toasts.map((toast) => {
        const variantStyles = {
          success: {
            border: 'border-emerald-500/35 bg-[#0A131A]/95',
            iconWrap: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
            icon: <CheckCircle2 className="h-4 w-4" />,
          },
          error: {
            border: 'border-rose-500/40 bg-[#160B12]/95',
            iconWrap: 'bg-rose-500/15 text-rose-400 border-rose-500/30',
            icon: <AlertCircle className="h-4 w-4" />,
          },
          info: {
            border: 'border-cyan-500/35 bg-[#0A111D]/95',
            iconWrap: 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30',
            icon: <Info className="h-4 w-4" />,
          },
        }[toast.variant];

        return (
          <div
            key={toast.id}
            role="status"
            className={`pointer-events-auto flex w-full items-start gap-3 rounded-2xl border p-4 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-300 ${variantStyles.border}`}
          >
            <div
              className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border ${variantStyles.iconWrap}`}
            >
              {variantStyles.icon}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-white">{toast.title}</p>
              {toast.description && (
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  {toast.description}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              aria-label="Dismiss notification"
              className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
