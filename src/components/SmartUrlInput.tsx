'use client';

import React, { useRef } from 'react';
import {
  AlertCircle,
  ClipboardPaste,
  Loader2,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { PLATFORM_MAP } from '@/lib/constants';
import { PlatformId } from '@/lib/types';
import { detectPlatformFromUrl } from '@/lib/utils';
import { PlatformIcon } from './PlatformIcons';

interface SmartUrlInputProps {
  url: string;
  activePlatform: PlatformId;
  isLoading: boolean;
  validationError: string | null;
  onUrlChange: (value: string) => void;
  onFetch: () => void;
  onPasteSuccess?: () => void;
  onPasteError?: () => void;
}

export function SmartUrlInput({
  url,
  activePlatform,
  isLoading,
  validationError,
  onUrlChange,
  onFetch,
  onPasteSuccess,
  onPasteError,
}: SmartUrlInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const detectedPlatform = detectPlatformFromUrl(url);
  const displayPlatform = detectedPlatform ?? activePlatform;
  const activeConfig = PLATFORM_MAP[displayPlatform];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      onFetch();
    }
  };

  const handlePasteClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text && text.trim()) {
          onUrlChange(text.trim());
          onPasteSuccess?.();
          inputRef.current?.focus();
          return;
        }
      }
      inputRef.current?.focus();
      onPasteError?.();
    } catch {
      inputRef.current?.focus();
      onPasteError?.();
    }
  };

  const handleClear = () => {
    onUrlChange('');
    inputRef.current?.focus();
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} noValidate>
        <div
          className={`group relative rounded-2xl border p-2 transition-all duration-300 backdrop-blur-2xl ${
            validationError
              ? 'border-rose-500/60 bg-rose-950/20 shadow-[0_0_30px_-8px_rgba(244,63,94,0.3)]'
              : 'border-white/[0.12] bg-[#0B0F1A]/85 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.75)] focus-within:border-white/25 focus-within:bg-[#0D1220]/95'
          }`}
        >
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            {/* Input Area */}
            <div className="relative flex flex-1 items-center">
              {/* Left Platform / Link Badge */}
              <div
                className={`ml-2 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-colors ${
                  detectedPlatform
                    ? activeConfig.badgeClass
                    : 'border-white/10 bg-white/[0.04] text-slate-400'
                }`}
                title={
                  detectedPlatform
                    ? `Detected ${activeConfig.name} URL`
                    : `${activeConfig.name} Link`
                }
              >
                <PlatformIcon platform={displayPlatform} className="h-4 w-4" />
              </div>

              <input
                ref={inputRef}
                type="url"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                value={url}
                onChange={(e) => onUrlChange(e.target.value)}
                disabled={isLoading}
                placeholder={activeConfig.placeholder}
                aria-label="Social media video URL"
                aria-invalid={Boolean(validationError)}
                className="h-12 w-full bg-transparent px-3.5 text-sm font-medium text-white placeholder:text-slate-500 focus:outline-none disabled:opacity-60 sm:h-14 sm:text-base"
              />

              {/* Quick Paste or Clear Control */}
              <div className="mr-1 flex shrink-0 items-center gap-1.5">
                {url ? (
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isLoading}
                    aria-label="Clear URL input"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05] text-slate-400 transition hover:bg-white/[0.1] hover:text-white disabled:opacity-50"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePasteClick}
                    disabled={isLoading}
                    className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.05] px-3 text-xs font-semibold text-slate-300 transition hover:border-white/20 hover:bg-white/[0.1] hover:text-white disabled:opacity-50"
                  >
                    <ClipboardPaste className="h-3.5 w-3.5" />
                    <span>Paste</span>
                  </button>
                )}
              </div>
            </div>

            {/* Fetch Video CTA Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`relative inline-flex h-12 shrink-0 items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-r px-6 text-sm font-bold tracking-wide text-white shadow-lg transition-all duration-300 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-75 sm:h-14 sm:px-7 sm:text-base ${activeConfig.buttonGradient}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin sm:h-5 sm:w-5" />
                  <span>Fetching Media...</span>
                </>
              ) : (
                <>
                  <Search className="h-4 w-4 sm:h-5 sm:w-5" />
                  <span>Fetch Video</span>
                  <Sparkles className="hidden h-4 w-4 opacity-80 sm:inline" />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Inline Validation / Error Banner */}
      {validationError && (
        <div
          role="alert"
          className="mt-3 flex items-start gap-2.5 rounded-xl border border-rose-500/30 bg-rose-500/[0.09] px-4 py-3 text-xs font-medium text-rose-200 backdrop-blur-xl sm:text-sm"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-400" />
          <span>{validationError}</span>
        </div>
      )}
    </div>
  );
}
