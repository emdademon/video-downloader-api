'use client';

import React, { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { SelectOption } from '@/lib/types';

interface SelectDropdownProps<T extends string> {
  label: string;
  icon?: React.ReactNode;
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
}

export function SelectDropdown<T extends string>({
  label,
  icon,
  value,
  options,
  onChange,
}: SelectDropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const labelId = useId();

  const selectedOption =
    options.find((opt) => opt.value === value) ?? options[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative w-full">
      <label
        id={labelId}
        className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400"
      >
        {icon}
        <span>{label}</span>
      </label>

      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/50 ${
          open
            ? 'border-cyan-400/50 bg-white/[0.08] shadow-[0_0_24px_-6px_rgba(34,211,238,0.25)]'
            : 'border-white/[0.1] bg-white/[0.04] hover:border-white/[0.2] hover:bg-white/[0.065]'
        }`}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white sm:text-base">
              {selectedOption.label}
            </span>
            <span className="rounded-md border border-white/10 bg-white/[0.06] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-cyan-300">
              {selectedOption.badge}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs text-slate-400">
            {selectedOption.detail}
          </p>
        </div>

        <ChevronDown
          className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
            open ? 'rotate-180 text-cyan-300' : ''
          }`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={labelId}
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/[0.14] bg-[#0E1424]/95 p-1.5 shadow-[0_24px_60px_-10px_rgba(0,0,0,0.85)] backdrop-blur-2xl"
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <li key={opt.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-2.5 text-left transition-colors ${
                    isSelected
                      ? 'bg-cyan-500/15 text-white'
                      : 'text-slate-200 hover:bg-white/[0.06] hover:text-white'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold">{opt.label}</span>
                      <span
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                          isSelected
                            ? 'bg-cyan-400/20 text-cyan-200'
                            : 'bg-white/[0.06] text-slate-400'
                        }`}
                      >
                        {opt.badge}
                      </span>
                    </div>
                    <p className="mt-0.5 truncate text-xs text-slate-400">
                      {opt.detail}
                    </p>
                  </div>

                  {isSelected && (
                    <Check className="h-4 w-4 shrink-0 text-cyan-400" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
