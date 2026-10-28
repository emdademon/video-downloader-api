'use client';

import React, { useEffect, useState } from 'react';
import { Loader2, Server } from 'lucide-react';

export function ResultSkeleton() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const showColdStartNotice = elapsedSeconds >= 5;

  return (
    <section
      aria-busy="true"
      aria-live="polite"
      className="relative mt-8 overflow-hidden rounded-3xl border border-white/[0.1] bg-[#0B0F1A]/85 p-5 shadow-2xl backdrop-blur-2xl sm:p-7"
    >
      {/* Animated Shimmer Sweep */}
      <div className="pointer-events-none absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />

      {/* Top Status Header */}
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] pb-4">
        <div className="flex items-center gap-2.5 text-sm font-medium text-slate-200">
          <Loader2 className="h-4 w-4 animate-spin text-cyan-400" />
          <span>
            {showColdStartNotice
              ? 'Waking cloud media engine & extracting stream metadata...'
              : 'Analyzing URL & fetching high-resolution streams...'}
          </span>
        </div>
        <span className="font-mono text-xs text-slate-400">
          {elapsedSeconds}s elapsed
        </span>
      </div>

      {showColdStartNotice && (
        <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-cyan-500/20 bg-cyan-500/[0.07] px-3.5 py-2.5 text-xs text-cyan-200">
          <Server className="h-4 w-4 shrink-0 text-cyan-400" />
          <span>
            First request after idle can take ~20–40 seconds while the Render
            FastAPI + yt-dlp instance spins up. Hang tight!
          </span>
        </div>
      )}

      {/* 2-Column Skeleton Matching Result Preview + Download Options Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left: Thumbnail & Metadata Skeleton */}
        <div className="space-y-4 lg:col-span-5">
          <div className="aspect-video w-full animate-pulse rounded-2xl border border-white/[0.06] bg-white/[0.05]" />
          <div className="flex items-center gap-2">
            <div className="h-6 w-24 animate-pulse rounded-full bg-white/[0.07]" />
            <div className="h-6 w-28 animate-pulse rounded-full bg-white/[0.05]" />
          </div>
          <div className="space-y-2.5">
            <div className="h-5 w-11/12 animate-pulse rounded-lg bg-white/[0.08]" />
            <div className="h-5 w-3/4 animate-pulse rounded-lg bg-white/[0.06]" />
          </div>
        </div>

        {/* Right: Mode Toggle + Dropdowns + CTA Skeleton */}
        <div className="flex flex-col justify-between space-y-5 lg:col-span-7">
          <div className="space-y-5">
            <div className="h-12 w-full animate-pulse rounded-2xl bg-white/[0.05]" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <div className="h-3.5 w-28 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-14 w-full animate-pulse rounded-xl bg-white/[0.05]" />
              </div>
              <div className="space-y-2">
                <div className="h-3.5 w-28 animate-pulse rounded bg-white/[0.06]" />
                <div className="h-14 w-full animate-pulse rounded-xl bg-white/[0.05]" />
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="h-10 w-full animate-pulse rounded-xl bg-white/[0.04]" />
            <div className="h-14 w-full animate-pulse rounded-2xl bg-white/[0.08]" />
          </div>
        </div>
      </div>
    </section>
  );
}
