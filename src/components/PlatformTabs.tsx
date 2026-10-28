'use client';

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { PLATFORMS } from '@/lib/constants';
import { PlatformId } from '@/lib/types';
import { PlatformIcon } from './PlatformIcons';

interface PlatformTabsProps {
  activePlatform: PlatformId;
  onSelectPlatform: (platform: PlatformId) => void;
}

export function PlatformTabs({
  activePlatform,
  onSelectPlatform,
}: PlatformTabsProps) {
  const currentConfig =
    PLATFORMS.find((p) => p.id === activePlatform) ?? PLATFORMS[0];

  return (
    <div id="platforms" className="w-full scroll-mt-24">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 px-1">
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          Select Target Platform
        </span>
        <span className="text-xs text-slate-400">
          Auto-detects pasted links across all networks
        </span>
      </div>

      {/* Interactive Selector Cards */}
      <div
        role="tablist"
        aria-label="Social Media Platforms"
        className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5"
      >
        {PLATFORMS.map((platform) => {
          const isSelected = platform.id === activePlatform;
          return (
            <button
              key={platform.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => onSelectPlatform(platform.id)}
              className={`group relative flex flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition-all duration-300 backdrop-blur-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                isSelected
                  ? `${platform.activeBorder} ${platform.activeBg}`
                  : 'border-white/[0.08] bg-white/[0.03] hover:border-white/[0.16] hover:bg-white/[0.055]'
              } ${
                platform.id === 'linkedin'
                  ? 'col-span-2 sm:col-span-1'
                  : 'col-span-1'
              }`}
            >
              <div className="flex w-full items-center justify-between gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-transform duration-300 group-hover:scale-105 ${
                    isSelected
                      ? `${platform.badgeClass}`
                      : 'border-white/10 bg-white/[0.05] text-slate-300 group-hover:text-white'
                  }`}
                >
                  <PlatformIcon platform={platform.id} className="h-4 w-4" />
                </div>

                <span
                  className={`h-2 w-2 rounded-full transition-all duration-300 ${
                    isSelected
                      ? 'scale-100 opacity-100'
                      : 'scale-50 bg-slate-600 opacity-0 group-hover:opacity-50'
                  }`}
                  style={
                    isSelected
                      ? {
                          backgroundColor: platform.accentHex,
                          boxShadow: `0 0 10px ${platform.accentHex}`,
                        }
                      : undefined
                  }
                />
              </div>

              <div className="mt-3">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`text-sm font-semibold tracking-tight ${
                      isSelected
                        ? 'text-white'
                        : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {platform.name}
                  </span>
                </div>
                <p className="mt-0.5 line-clamp-1 text-[11px] font-medium text-slate-400">
                  {platform.tagline}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Platform Capabilities Strip */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-2 text-xs text-slate-400">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
          <span
            className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${currentConfig.badgeClass}`}
          >
            <PlatformIcon platform={currentConfig.id} className="h-3 w-3" />
            {currentConfig.name} Mode
          </span>
          {currentConfig.supportedFeatures.map((feat) => (
            <span
              key={feat}
              className="inline-flex items-center gap-1 text-slate-300"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400/90" />
              {feat}
            </span>
          ))}
        </div>
        <span className="hidden font-mono text-[11px] text-slate-500 xl:inline">
          {currentConfig.exampleFormat}
        </span>
      </div>
    </div>
  );
}
