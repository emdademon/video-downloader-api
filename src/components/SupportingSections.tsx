'use client';

import React, { useState } from 'react';
import {
  ArrowDownToLine,
  AudioLines,
  ChevronDown,
  Clock,
  Film,
  History,
  Layers,
  Link2,
  ShieldCheck,
  Sparkles,
  Trash2,
  Zap,
} from 'lucide-react';
import { FAQ_ITEMS, PLATFORMS } from '@/lib/constants';
import { PlatformId, RecentMediaItem } from '@/lib/types';
import { formatDuration, resolvePlatformMeta } from '@/lib/utils';
import { PlatformIcon } from './PlatformIcons';

interface RecentHistorySectionProps {
  items: RecentMediaItem[];
  onSelect: (item: RecentMediaItem) => void;
  onClear: () => void;
}

export function RecentHistorySection({
  items,
  onSelect,
  onClear,
}: RecentHistorySectionProps) {
  if (items.length === 0) return null;

  return (
    <section
      aria-label="Recently fetched videos"
      className="mx-auto mt-10 max-w-5xl px-4 sm:px-6 lg:px-8"
    >
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
          <History className="h-3.5 w-3.5 text-cyan-400" />
          <span>Recently Fetched Media</span>
        </div>
        <button
          type="button"
          onClick={onClear}
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-slate-400 transition hover:bg-white/[0.06] hover:text-rose-300"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Clear History</span>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const meta = resolvePlatformMeta(item.platform, item.url);
          const dur = formatDuration(item.duration);
          return (
            <button
              key={item.url}
              type="button"
              onClick={() => onSelect(item)}
              className="group flex items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-2.5 text-left transition-all hover:border-white/[0.18] hover:bg-white/[0.06] backdrop-blur-xl"
            >
              <div className="relative h-14 w-24 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#080C15]">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-600">
                    <Film className="h-5 w-5" />
                  </div>
                )}
                {dur && (
                  <span className="absolute bottom-1 right-1 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-white">
                    {dur}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-xs font-bold text-slate-100 group-hover:text-white">
                  {item.title}
                </p>
                <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-slate-400">
                  <PlatformIcon
                    platform={meta.id}
                    className="h-3 w-3 text-cyan-400"
                  />
                  <span>{meta.label}</span>
                  <span className="text-slate-600">•</span>
                  <Clock className="h-3 w-3" />
                  <span>Reload</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

interface SupportingSectionsProps {
  onQuickSelectPlatform: (platform: PlatformId) => void;
}

export function SupportingSections({
  onQuickSelectPlatform,
}: SupportingSectionsProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  return (
    <>
      {/* CAPABILITIES BENTO GRID */}
      <section
        id="capabilities"
        className="mx-auto mt-20 max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/25 bg-cyan-500/[0.08] px-3.5 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-300">
            <Zap className="h-3.5 w-3.5" />
            Studio-Grade Pipeline
          </span>
          <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Engineered for Crisp Video &amp; Pure Audio
          </h2>
          <p className="mt-2.5 text-sm leading-relaxed text-slate-400 sm:text-base">
            Powered by FastAPI, yt-dlp, and FFmpeg stream muxing for clean
            high-bitrate media downloads without watermarks or browser bloat.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-white/[0.15]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-rose-500/30 bg-rose-500/15 text-rose-300">
              <Film className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
              Up to 4K Ultra HD
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
              Choose between 4K (2160p), 1080p, 720p, and 480p with automatic
              video + audio stream merging into MP4, MOV, or MKV.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-white/[0.15]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-fuchsia-500/30 bg-fuchsia-500/15 text-fuchsia-300">
              <AudioLines className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
              Dedicated Audio Ripper
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
              Extract standalone soundtracks, podcasts, and talks straight into
              MP3, lossless WAV, AAC, or Apple M4A containers.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-white/[0.15]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-500/30 bg-cyan-500/15 text-cyan-300">
              <Layers className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
              5 Major Platforms
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
              One unified interface for YouTube, Facebook, Instagram, Pinterest,
              and LinkedIn with smart link recognition.
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 backdrop-blur-xl transition hover:border-white/[0.15]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/15 text-emerald-300">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-white">
              Zero Accounts or Ads
            </h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
              No sign-up walls, popups, or watermarks. Paste a link, preview the
              source stream, and trigger an instant browser download.
            </p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 3-STEP WORKFLOW */}
      <section
        id="how-it-works"
        className="mx-auto mt-20 max-w-6xl scroll-mt-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="rounded-3xl border border-white/[0.08] bg-gradient-to-b from-white/[0.04] to-white/[0.015] p-6 backdrop-blur-2xl sm:p-10">
          <div className="flex flex-col items-start justify-between gap-4 border-b border-white/[0.07] pb-6 sm:flex-row sm:items-end">
            <div>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-cyan-400">
                Simple 3-Step Workflow
              </span>
              <h2 className="mt-1.5 text-2xl font-extrabold tracking-tight text-white">
                From Social Feed to Local File in Seconds
              </h2>
            </div>
            <p className="text-xs text-slate-400 sm:text-sm">
              Works seamlessly across desktop, iOS Safari, and Android Chrome
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                step: '01',
                icon: <Link2 className="h-5 w-5 text-rose-300" />,
                title: 'Copy Any Video URL',
                desc: 'Grab the share link from YouTube, Facebook, Instagram, Pinterest, or LinkedIn and paste it into the Smart Input bar.',
              },
              {
                step: '02',
                icon: <Sparkles className="h-5 w-5 text-cyan-300" />,
                title: 'Fetch & Preview Stream',
                desc: 'Click "Fetch Video" to inspect the high-res thumbnail, exact title, runtime duration, and verified source platform.',
              },
              {
                step: '03',
                icon: <ArrowDownToLine className="h-5 w-5 text-emerald-300" />,
                title: 'Select Format & Download',
                desc: 'Pick Video File (up to 4K MP4/MOV/MKV) or Audio Only (MP3/WAV/AAC/M4A) and press "Download Now".',
              },
            ].map((item) => (
              <div
                key={item.step}
                className="relative rounded-2xl border border-white/[0.07] bg-[#090D18]/75 p-5"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.05]">
                    {item.icon}
                  </div>
                  <span className="font-mono text-2xl font-extrabold text-white/15">
                    {item.step}
                  </span>
                </div>
                <h3 className="mt-4 text-base font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION */}
      <section
        id="faq"
        className="mx-auto mt-20 max-w-4xl scroll-mt-24 px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-fuchsia-400">
            Questions &amp; Answers
          </span>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="mt-8 space-y-3">
          {FAQ_ITEMS.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-xl transition-colors hover:border-white/[0.14]"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="text-sm font-bold text-white sm:text-base">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-300' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/[0.06] px-5 py-4 text-xs leading-relaxed text-slate-300 sm:text-sm">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mt-24 border-t border-white/[0.08] bg-[#05070D]/90">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/[0.06]">
                  <ArrowDownToLine className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-bold text-white">
                  Hoque<span className="text-cyan-400">Save</span>
                </span>
              </div>
              <p className="mt-2 max-w-md text-xs leading-relaxed text-slate-400">
                All-in-One Social Media Video &amp; Audio Downloader powered by
                high-speed cloud stream extraction and FFmpeg processing.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map((p) => (
                <a
                  key={p.id}
                  href="#downloader"
                  onClick={() => onQuickSelectPlatform(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-xs font-medium text-slate-300 transition hover:border-white/[0.18] hover:bg-white/[0.07] hover:text-white"
                >
                  <PlatformIcon platform={p.id} className="h-3.5 w-3.5" />
                  <span>{p.name}</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 flex flex-col justify-between gap-3 border-t border-white/[0.06] pt-6 text-xs text-slate-400 sm:flex-row sm:items-center">
            <span>
              &copy; {new Date().getFullYear()} HoqueSave Media Studio. For
              personal &amp; authorized content archiving only.
            </span>
            <span className="font-medium text-slate-300 sm:text-right">
              Developed by{' '}
              <span className="font-semibold text-white">
                Md. Emdadul Hoque
              </span>
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
