'use client';

import React, { useEffect, useState } from 'react';
import {
  AudioWaveform,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  FileAudio,
  FileVideo,
  Film,
  Headphones,
  RotateCcw,
  Sliders,
  Sparkles,
  User,
} from 'lucide-react';
import {
  AUDIO_FORMAT_OPTIONS,
  VIDEO_FORMAT_OPTIONS,
  VIDEO_QUALITY_OPTIONS,
} from '@/lib/constants';
import {
  AudioFormat,
  MediaMode,
  VideoFormat,
  VideoInfoResponse,
  VideoQuality,
} from '@/lib/types';
import { formatDuration, resolvePlatformMeta } from '@/lib/utils';
import { PlatformIcon } from './PlatformIcons';
import { SelectDropdown } from './SelectDropdown';

interface ResultWorkspaceProps {
  sourceUrl: string;
  videoInfo: VideoInfoResponse;
  mode: MediaMode;
  quality: VideoQuality;
  videoFormat: VideoFormat;
  audioFormat: AudioFormat;
  downloadUrl: string;
  onModeChange: (mode: MediaMode) => void;
  onQualityChange: (quality: VideoQuality) => void;
  onVideoFormatChange: (format: VideoFormat) => void;
  onAudioFormatChange: (format: AudioFormat) => void;
  onDownloadClick: () => void;
  onReset: () => void;
}

export function ResultWorkspace({
  sourceUrl,
  videoInfo,
  mode,
  quality,
  videoFormat,
  audioFormat,
  downloadUrl,
  onModeChange,
  onQualityChange,
  onVideoFormatChange,
  onAudioFormatChange,
  onDownloadClick,
  onReset,
}: ResultWorkspaceProps) {
  const [imgError, setImgError] = useState(false);
  const [justTriggered, setJustTriggered] = useState(false);

  // Reset image error whenever a new thumbnail arrives
  useEffect(() => {
    setImgError(false);
  }, [videoInfo.thumbnail, sourceUrl]);

  const platformMeta = resolvePlatformMeta(videoInfo.platform, sourceUrl);
  const formattedDuration = formatDuration(videoInfo.duration);
  const activeFormat = mode === 'video' ? videoFormat : audioFormat;

  const buttonGradient =
    platformMeta.config?.buttonGradient ??
    'from-cyan-500 via-blue-500 to-indigo-500';

  const handleTrigger = () => {
    setJustTriggered(true);
    onDownloadClick();
    window.setTimeout(() => {
      setJustTriggered(false);
    }, 2800);
  };

  return (
    <section
      aria-label="Fetched media preview and download options"
      className="relative mt-8 rounded-3xl border border-white/[0.12] bg-[#0B0F1A]/90 p-5 shadow-[0_28px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-2xl sm:p-7"
    >
      {/* Top Workspace Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <h2 className="text-sm font-bold text-white sm:text-base">
              Media Stream Ready
            </h2>
            <p className="text-xs text-slate-400">
              Configure output mode, quality &amp; container format below
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.09] hover:text-white"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            <span>Original Post</span>
          </a>
          <button
            type="button"
            onClick={onReset}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/[0.09] hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Clear</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout: Result Preview Card + Download Options Grid */}
      <div className="grid grid-cols-1 gap-7 lg:grid-cols-12">
        {/* 4. RESULT PREVIEW CARD */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-white/[0.025] p-4 lg:col-span-5">
          <div>
            {/* Thumbnail Frame */}
            <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-[#070A12]">
              {videoInfo.thumbnail && !imgError ? (
                <>
                  {/* Subtle Ambient Blurred Fill Behind Non-16:9 Vertical Reels/Shorts */}
                  <img
                    src={videoInfo.thumbnail}
                    alt=""
                    aria-hidden="true"
                    referrerPolicy="no-referrer"
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-xl"
                  />
                  <img
                    src={videoInfo.thumbnail}
                    alt={videoInfo.title}
                    referrerPolicy="no-referrer"
                    onError={() => setImgError(true)}
                    className="relative z-10 h-full w-full object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                  />
                </>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-slate-900 via-indigo-950/50 to-slate-900 text-slate-400">
                  <Film className="h-10 w-10 text-slate-500" />
                  <span className="text-xs font-medium text-slate-400">
                    Preview Thumbnail Unavailable
                  </span>
                </div>
              )}

              {/* Top-left Platform Origin Badge Overlay */}
              <div className="absolute left-3 top-3 z-20">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-semibold backdrop-blur-md ${
                    platformMeta.config
                      ? platformMeta.config.badgeClass
                      : 'border-white/20 bg-black/65 text-white'
                  }`}
                >
                  <PlatformIcon platform={platformMeta.id} className="h-3.5 w-3.5" />
                  <span>{platformMeta.label}</span>
                </span>
              </div>

              {/* Bottom-right Duration Badge Overlay */}
              {formattedDuration && (
                <div className="absolute bottom-3 right-3 z-20">
                  <span className="inline-flex items-center gap-1 rounded-lg border border-white/15 bg-black/75 px-2.5 py-1 font-mono text-xs font-semibold text-white backdrop-blur-md">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    {formattedDuration}
                  </span>
                </div>
              )}
            </div>

            {/* Video Title */}
            <h3
              title={videoInfo.title}
              className="mt-4 line-clamp-2 text-base font-bold leading-snug text-white sm:text-lg"
            >
              {videoInfo.title}
            </h3>

            {/* Metadata Pills */}
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-medium">
                <PlatformIcon
                  platform={platformMeta.id}
                  className="h-3.5 w-3.5 text-cyan-300"
                />
                <span>Origin: {platformMeta.label}</span>
              </span>

              {videoInfo.uploader && (
                <span className="inline-flex max-w-[210px] items-center gap-1.5 truncate rounded-lg border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 font-medium text-slate-300">
                  <User className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span className="truncate">{videoInfo.uploader}</span>
                </span>
              )}
            </div>
          </div>

          {/* Stream Output Summary Footer */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-white/[0.07] bg-black/30 px-3.5 py-2.5 text-xs">
            <span className="text-slate-400">Selected Output</span>
            <span className="font-mono font-semibold uppercase text-cyan-300">
              {mode === 'video'
                ? `${quality === '4k' ? '4K 2160p' : quality} • .${videoFormat}`
                : `192kbps Audio • .${audioFormat}`}
            </span>
          </div>
        </div>

        {/* 5. DOWNLOAD OPTIONS GRID & 6. DOWNLOAD ACTION */}
        <div className="flex flex-col justify-between space-y-6 lg:col-span-7">
          <div className="space-y-5">
            {/* Mode Toggle: Video File vs Audio Only */}
            <div>
              <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                Download Mode
              </span>
              <div
                role="tablist"
                aria-label="Download mode"
                className="grid grid-cols-2 gap-2 rounded-2xl border border-white/[0.09] bg-black/40 p-1.5"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'video'}
                  onClick={() => onModeChange('video')}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                    mode === 'video'
                      ? 'border border-white/15 bg-gradient-to-b from-white/[0.14] to-white/[0.06] text-white shadow-md'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <FileVideo
                    className={`h-4 w-4 ${
                      mode === 'video' ? 'text-cyan-400' : 'text-slate-400'
                    }`}
                  />
                  <span>Video File</span>
                </button>

                <button
                  type="button"
                  role="tab"
                  aria-selected={mode === 'audio'}
                  onClick={() => onModeChange('audio')}
                  className={`flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition-all duration-200 ${
                    mode === 'audio'
                      ? 'border border-white/15 bg-gradient-to-b from-white/[0.14] to-white/[0.06] text-white shadow-md'
                      : 'text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                  }`}
                >
                  <Headphones
                    className={`h-4 w-4 ${
                      mode === 'audio' ? 'text-fuchsia-400' : 'text-slate-400'
                    }`}
                  />
                  <span>Audio Only</span>
                </button>
              </div>
            </div>

            {/* Dropdowns Grid */}
            {mode === 'video' ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectDropdown
                  label="Video Quality"
                  icon={<Sliders className="h-3.5 w-3.5 text-cyan-400" />}
                  value={quality}
                  options={VIDEO_QUALITY_OPTIONS}
                  onChange={onQualityChange}
                />

                <SelectDropdown
                  label="Video Format"
                  icon={<Film className="h-3.5 w-3.5 text-indigo-400" />}
                  value={videoFormat}
                  options={VIDEO_FORMAT_OPTIONS}
                  onChange={onVideoFormatChange}
                />
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectDropdown
                  label="Audio Format"
                  icon={<FileAudio className="h-3.5 w-3.5 text-fuchsia-400" />}
                  value={audioFormat}
                  options={AUDIO_FORMAT_OPTIONS}
                  onChange={onAudioFormatChange}
                />

                {/* Audio Processing Spec Card */}
                <div className="flex flex-col justify-end">
                  <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                    <AudioWaveform className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Audio Engine Profile</span>
                  </span>
                  <div className="flex h-[68px] flex-col justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        FFmpeg Direct Demux
                      </span>
                      <span className="rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
                        192 kbps+
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      Best source audio stream transcoded cleanly
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* 6. DOWNLOAD ACTION */}
          <div className="space-y-3 border-t border-white/[0.08] pt-5">
            <button
              type="button"
              onClick={handleTrigger}
              className={`group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r px-6 text-base font-extrabold tracking-wide text-white shadow-[0_14px_35px_-10px_rgba(59,130,246,0.55)] transition-all duration-300 hover:brightness-110 active:scale-[0.99] sm:h-16 sm:text-lg ${buttonGradient}`}
            >
              {/* Subtle Hover Shine */}
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {justTriggered ? (
                <>
                  <Sparkles className="h-5 w-5 animate-pulse" />
                  <span>
                    Download Triggered ({activeFormat.toUpperCase()}
                    {mode === 'video' ? ` • ${quality.toUpperCase()}` : ''})
                  </span>
                </>
              ) : (
                <>
                  <Download className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
                  <span>
                    Download Now —{' '}
                    {mode === 'video'
                      ? `${videoFormat.toUpperCase()} (${
                          quality === '4k' ? '4K' : quality
                        })`
                      : `${audioFormat.toUpperCase()} Audio`}
                  </span>
                </>
              )}
            </button>

            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs text-slate-400">
              <span>
                Streams directly from cloud FFmpeg muxer — allow a few seconds
                for large 1080p/4K files to start saving.
              </span>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-cyan-300 underline decoration-cyan-500/40 underline-offset-4 transition hover:text-cyan-200"
              >
                Direct stream link
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
