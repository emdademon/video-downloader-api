'use client';

import { useEffect, useState } from 'react';
import { checkApiHealth } from '@/lib/api';

export type ApiEngineStatus = 'warming' | 'online' | 'ready';

export function useApiHealth() {
  const [status, setStatus] = useState<ApiEngineStatus>('warming');

  useEffect(() => {
    const controller = new AbortController();

    checkApiHealth(controller.signal).then((healthy) => {
      if (!controller.signal.aborted) {
        setStatus(healthy ? 'online' : 'ready');
      }
    });

    return () => {
      controller.abort();
    };
  }, []);

  return { status, setStatus };
}
