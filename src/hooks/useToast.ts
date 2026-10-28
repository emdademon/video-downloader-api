'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { ToastItem, ToastVariant } from '@/lib/types';

export function useToast(defaultDuration = 5500) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const existingTimer = timersRef.current.get(id);
    if (existingTimer) {
      window.clearTimeout(existingTimer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addToast = useCallback(
    (
      variant: ToastVariant,
      title: string,
      description?: string,
      duration = defaultDuration
    ) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      setToasts((prev) => [...prev.slice(-3), { id, variant, title, description }]);

      const timer = window.setTimeout(() => {
        timersRef.current.delete(id);
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, duration);

      timersRef.current.set(id, timer);
      return id;
    },
    [defaultDuration]
  );

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timerId) => window.clearTimeout(timerId));
      timers.clear();
    };
  }, []);

  return {
    toasts,
    addToast,
    dismissToast,
  };
}
