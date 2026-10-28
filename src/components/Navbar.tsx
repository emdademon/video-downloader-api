'use client';

import React, { useState } from 'react';
import {
  ArrowDownToLine,
  Cpu,
  Menu,
  Sparkles,
  X,
} from 'lucide-react';
import { ApiEngineStatus } from '@/hooks/useApiHealth';

interface NavbarProps {
  apiStatus: ApiEngineStatus;
}

const NAV_LINKS = [
  { label: 'Downloader', href: '#downloader' },
  { label: 'Platforms', href: '#platforms' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar({ apiStatus }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const statusMeta = {
    online: {
      dot: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)]',
      label: 'Engine Online',
      text: 'text-emerald-300',
      border: 'border-emerald-500/25 bg-emerald-500/[0.08]',
    },
    warming: {
      dot: 'bg-amber-400 animate-pulse',
      label: 'Connecting Engine',
      text: 'text-amber-200',
      border: 'border-amber-500/25 bg-amber-500/[0.08]',
    },
    ready: {
      dot: 'bg-cyan-400',
      label: 'Cloud API Ready',
      text: 'text-cyan-200',
      border: 'border-cyan-500/25 bg-cyan-500/[0.08]',
    },
  }[apiStatus];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/[0.07] bg-[#06080F]/75 backdrop-blur-2xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Identity */}
        <a
          href="#downloader"
          className="group flex items-center gap-3 focus:outline-none"
        >
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-indigo-500/25 via-rose-500/20 to-amber-500/20 shadow-inner transition-transform duration-300 group-hover:scale-105">
            <ArrowDownToLine className="h-5 w-5 text-white" />
            <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-gradient-to-tr from-rose-500 to-amber-400 text-[9px] font-bold text-white shadow">
              <Sparkles className="h-2.5 w-2.5" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-base font-bold tracking-tight text-white sm:text-lg">
              Omni<span className="bg-gradient-to-r from-rose-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">Save</span>
            </span>
            <span className="text-[11px] font-medium tracking-wide text-slate-400">
              All-in-One Media Studio
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg px-3.5 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right API Status Pill + Mobile Menu Button */}
        <div className="flex items-center gap-2.5">
          <div
            className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium sm:inline-flex ${statusMeta.border} ${statusMeta.text}`}
            title="FastAPI + yt-dlp + FFmpeg Cloud Engine"
          >
            <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
            <Cpu className="h-3.5 w-3.5 opacity-80" />
            <span>{statusMeta.label}</span>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.09] md:hidden"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="border-t border-white/[0.08] bg-[#080B14]/95 px-4 pb-5 pt-3 backdrop-blur-2xl md:hidden">
          <div className="mb-3 flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5">
            <span className="text-xs font-medium text-slate-400">
              Backend Extraction Engine
            </span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold ${statusMeta.text}`}
            >
              <span className={`h-2 w-2 rounded-full ${statusMeta.dot}`} />
              {statusMeta.label}
            </span>
          </div>
          <nav className="flex flex-col space-y-1">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-200 transition hover:bg-white/[0.07] hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
