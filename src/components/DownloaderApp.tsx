'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Shield, Sparkles, Zap } from 'lucide-react';
import { PLATFORM_MAP } from '@/lib/constants';
import {
  buildDownloadUrl,
  fetchVideoInfo,
  triggerBrowserDownload,
} from '@/lib/api';
import {
  AudioFormat,
  MediaMode,
  PlatformId,
  RecentMediaItem,
  VideoFormat,
  VideoInfoResponse,
  VideoQuality,
} from '@/lib/types';
import {
  detectPlatformFromUrl,
  resolvePlatformMeta,
  validateAndNormalizeUrl,
} from '@/lib/utils';
import { useApiHealth } from '@/hooks/useApiHealth';
import { useRecentDownloads } from '@/hooks/useRecentDownloads';
import { useToast } from '@/hooks/useToast';
import { Navbar } from './Navbar';
import { PlatformTabs } from './PlatformTabs';
import { SmartUrlInput } from './SmartUrlInput';
import { ResultSkeleton } from './ResultSkeleton';
import { ResultWorkspace } from './ResultWorkspace';
import {
  RecentHistorySection,
  SupportingSections,
} from './SupportingSections';
import { ToastContainer } from './ToastContainer';

export function DownloaderApp() {
  const [activePlatform, setActivePlatform] = useState<PlatformId>('youtube');
  const [inputUrl, setInputUrl] = useState('');
  const [fetchedUrl, setFetchedUrl] = useState<string | null>(null);
  const [videoInfo, setVideoInfo] = useState<VideoInfoResponse | null>(null);
  const [isFetching, setIsFetching] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Download configuration states
  const [mode, setMode] = useState<MediaMode>('video');
  const [quality, setQuality] = useState<VideoQuality>('1080p');
  const [videoFormat, setVideoFormat] = useState<VideoFormat>('mp4');
  const [audioFormat, setAudioFormat] = useState<AudioFormat>('mp3');

  const abortRef = useRef<AbortController | null>(null);
  const workspaceAnchorRef = useRef<HTMLDivElement>(null);

  const { status: apiStatus, setStatus: setApiStatus } = useApiHealth();
  const { recentItems, pushRecentItem, clearRecentItems } =
    useRecentDownloads();
  const { toasts, addToast, dismissToast } = useToast();

  const activePlatformConfig = PLATFORM_MAP[activePlatform];

  // Clean up any in-flight fetch on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleUrlChange = useCallback((value: string) => {
    setInputUrl(value);
    setValidationError(null);
    const detected = detectPlatformFromUrl(value);
    if (detected) {
      setActivePlatform(detected);
    }
  }, []);

  const handleSelectPlatform = useCallback((platform: PlatformId) => {
    setActivePlatform(platform);
    setValidationError(null);
  }, []);

  const handleFetchVideo = useCallback(async () => {
    const check = validateAndNormalizeUrl(inputUrl);
    if (!check.valid) {
      const errMsg = check.error ?? 'Please enter a valid video URL.';
      setValidationError(errMsg);
      addToast('error', 'Invalid Video Link', errMsg);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setValidationError(null);
    setIsFetching(true);
    setVideoInfo(null);

    try {
      const info = await fetchVideoInfo(check.normalizedUrl, controller.signal);
      if (controller.signal.aborted) return;

      setVideoInfo(info);
      setFetchedUrl(check.normalizedUrl);
      setApiStatus('online');

      const resolved = resolvePlatformMeta(info.platform, check.normalizedUrl);
      if (resolved.id) {
        setActivePlatform(resolved.id);
      }

      pushRecentItem(check.normalizedUrl, info);

      window.setTimeout(() => {
        workspaceAnchorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 100);
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to retrieve video information. Please try again.';
      setValidationError(message);
      addToast('error', 'Could Not Fetch Video', message);
    } finally {
      if (!controller.signal.aborted) {
        setIsFetching(false);
      }
    }
  }, [inputUrl, addToast, pushRecentItem, setApiStatus]);

  const activeFormat = mode === 'video' ? videoFormat : audioFormat;

  const downloadUrl = useMemo(() => {
    if (!fetchedUrl) return '';
    return buildDownloadUrl({
      url: fetchedUrl,
      type: mode,
      quality,
      format: activeFormat,
    });
  }, [fetchedUrl, mode, quality, activeFormat]);

  const handleDownloadNow = useCallback(() => {
    if (!fetchedUrl || !videoInfo || !downloadUrl) return;

    triggerBrowserDownload(downloadUrl);

    const specLabel =
      mode === 'video'
        ? `${videoFormat.toUpperCase()} • ${
            quality === '4k' ? '4K (2160p)' : quality
          }`
        : `${audioFormat.toUpperCase()} Audio (192kbps)`;

    addToast(
      'success',
      'Download Started!',
      `Preparing "${videoInfo.title}" in ${specLabel}. Your browser download will begin automatically.`
    );
  }, [
    fetchedUrl,
    videoInfo,
    downloadUrl,
    mode,
    videoFormat,
    quality,
    audioFormat,
    addToast,
  ]);

  const handleResetWorkspace = useCallback(() => {
    abortRef.current?.abort();
    setIsFetching(false);
    setVideoInfo(null);
    setFetchedUrl(null);
    setValidationError(null);
    setInputUrl('');
  }, []);

  const handleReloadRecent = useCallback(
    (item: RecentMediaItem) => {
      abortRef.current?.abort();
      setIsFetching(false);
      setValidationError(null);
      setInputUrl(item.url);
      setFetchedUrl(item.url);
      setVideoInfo({
        title: item.title,
        thumbnail: item.thumbnail,
        duration: item.duration,
        platform: item.platform,
        uploader: item.uploader,
      });

      const resolved = resolvePlatformMeta(item.platform, item.url);
      if (resolved.id) {
        setActivePlatform(resolved.id);
      }

      addToast(
        'info',
        'Media Reloaded',
        `Loaded "${item.title}" into the download studio.`
      );

      window.setTimeout(() => {
        workspaceAnchorRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        });
      }, 80);
    },
    [addToast]
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#06080F] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-100">
      {/* Dynamic Ambient Mesh Background */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-700"
        style={{
          backgroundImage: activePlatformConfig.glowGradient,
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,rgba(56,189,248,0.08),transparent_70%)]"
      />
      {/* Subtle Architectural Grid Overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-[0.18] [background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_15%,#000_35%,transparent_100%)]"
      />

      {/* Sticky Glassmorphic Navbar */}
      <div className="relative z-10">
        <Navbar apiStatus={apiStatus} />

        {/* 1. HERO SECTION */}
        <main id="downloader" className="scroll-mt-20">
          <section className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14 lg:px-8 lg:pt-16">
            {/* Hero Eyebrow Pill */}
            <div className="flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-white/[0.04] px-4 py-1.5 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>4K Ultra HD Video &amp; Lossless Audio Extractor</span>
                <span className="hidden text-slate-600 sm:inline">•</span>
                <span className="hidden text-cyan-300 sm:inline">
                  FastAPI + FFmpeg Powered
                </span>
              </div>
            </div>

            {/* Hero Title & Subtitle */}
            <div className="mx-auto mt-6 max-w-3xl text-center">
              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12]">
                Download Videos &amp; Audio from{' '}
                <span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                  Every Social Platform
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-300/90 sm:text-base lg:text-lg">
                Save crisp 4K/1080p MP4, MOV &amp; MKV videos or extract pure
                MP3, WAV, AAC &amp; M4A audio from YouTube, Facebook, Instagram,
                Pinterest, and LinkedIn in one click.
              </p>
            </div>

            {/* Glassmorphism Main Studio Shell */}
            <div className="mt-9 rounded-3xl border border-white/[0.1] bg-white/[0.025] p-4 shadow-[0_32px_90px_-20px_rgba(0,0,0,0.8)] backdrop-blur-2xl sm:p-6 lg:p-7">
              {/* 2. PLATFORM SPECIFIC TABS */}
              <PlatformTabs
                activePlatform={activePlatform}
                onSelectPlatform={handleSelectPlatform}
              />

              {/* 3. SMART INPUT AREA */}
              <div className="mt-5">
                <SmartUrlInput
                  url={inputUrl}
                  activePlatform={activePlatform}
                  isLoading={isFetching}
                  validationError={validationError}
                  onUrlChange={handleUrlChange}
                  onFetch={handleFetchVideo}
                  onPasteSuccess={() =>
                    addToast(
                      'info',
                      'Link Pasted',
                      'Click "Fetch Video" to inspect available download formats.'
                    )
                  }
                  onPasteError={() =>
                    addToast(
                      'info',
                      'Clipboard Access Blocked',
                      'Press Ctrl+V (or Cmd+V) directly inside the URL field.'
                    )
                  }
                />
              </div>

              {/* Trust Micro-Bar */}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-slate-400">
                <span className="inline-flex items-center gap-1.5">
                  <Zap className="h-3.5 w-3.5 text-amber-400" />
                  <span>Direct High-Speed Stream</span>
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-emerald-400" />
                  <span>No Watermarks • Zero Registration</span>
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  MP4 • MOV • MKV • MP3 • WAV • AAC • M4A
                </span>
              </div>
            </div>

            {/* Result Anchor: Skeleton Loader OR Result Preview + Download Options Grid */}
            <div ref={workspaceAnchorRef} className="scroll-mt-24">
              {isFetching && <ResultSkeleton />}

              {!isFetching && videoInfo && fetchedUrl && (
                <ResultWorkspace
                  sourceUrl={fetchedUrl}
                  videoInfo={videoInfo}
                  mode={mode}
                  quality={quality}
                  videoFormat={videoFormat}
                  audioFormat={audioFormat}
                  downloadUrl={downloadUrl}
                  onModeChange={setMode}
                  onQualityChange={setQuality}
                  onVideoFormatChange={setVideoFormat}
                  onAudioFormatChange={setAudioFormat}
                  onDownloadClick={handleDownloadNow}
                  onReset={handleResetWorkspace}
                />
              )}
            </div>
          </section>

          {/* Recently Fetched Quick-Reload Shelf */}
          <RecentHistorySection
            items={recentItems}
            onSelect={handleReloadRecent}
            onClear={() => {
              clearRecentItems();
              addToast('info', 'History Cleared', 'Removed recent media items.');
            }}
          />

          {/* Capabilities, How It Works, FAQ & Footer */}
          <SupportingSections onQuickSelectPlatform={handleSelectPlatform} />
        </main>
      </div>

      {/* Floating Toast Notification System */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
