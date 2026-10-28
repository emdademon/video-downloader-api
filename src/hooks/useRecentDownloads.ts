'use client';

import { useCallback, useEffect, useState } from 'react';
import { RecentMediaItem, VideoInfoResponse } from '@/lib/types';

const STORAGE_KEY = 'omnisave_recent_media_v1';
const MAX_ITEMS = 6;

export function useRecentDownloads() {
  const [recentItems, setRecentItems] = useState<RecentMediaItem[]>([]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as RecentMediaItem[];
        if (Array.isArray(parsed)) {
          setRecentItems(parsed.slice(0, MAX_ITEMS));
        }
      }
    } catch {
      // Ignore storage access issues in private browsing
    }
  }, []);

  const pushRecentItem = useCallback((url: string, info: VideoInfoResponse) => {
    setRecentItems((prev) => {
      const next: RecentMediaItem[] = [
        {
          url,
          title: info.title,
          thumbnail: info.thumbnail,
          duration: info.duration,
          platform: info.platform,
          uploader: info.uploader,
          fetchedAt: Date.now(),
        },
        ...prev.filter((item) => item.url !== url),
      ].slice(0, MAX_ITEMS);

      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage quota errors
      }

      return next;
    });
  }, []);

  const clearRecentItems = useCallback(() => {
    setRecentItems([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore storage access errors
    }
  }, []);

  return {
    recentItems,
    pushRecentItem,
    clearRecentItems,
  };
}
