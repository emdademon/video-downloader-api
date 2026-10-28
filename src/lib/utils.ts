import { PLATFORM_MAP, PLATFORMS } from './constants';
import { PlatformConfig, PlatformId } from './types';

export function detectPlatformFromUrl(rawUrl: string): PlatformId | null {
  const trimmed = rawUrl.trim().toLowerCase();
  if (!trimmed) return null;

  const candidate =
    trimmed.startsWith('http://') || trimmed.startsWith('https://')
      ? trimmed
      : `https://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    const host = parsed.hostname.replace(/^www\./, '').replace(/^m\./, '');

    for (const platform of PLATFORMS) {
      if (
        platform.domains.some(
          (domain) => host === domain || host.endsWith(`.${domain}`)
        )
      ) {
        return platform.id;
      }
    }
  } catch {
    for (const platform of PLATFORMS) {
      if (platform.domains.some((domain) => trimmed.includes(domain))) {
        return platform.id;
      }
    }
  }

  return null;
}

export function resolvePlatformMeta(
  extractorKey?: string | null,
  sourceUrl?: string
): {
  id: PlatformId | null;
  label: string;
  config: PlatformConfig | null;
} {
  if (extractorKey) {
    const keyLower = extractorKey.toLowerCase();
    if (keyLower.includes('youtube')) {
      return { id: 'youtube', label: 'YouTube', config: PLATFORM_MAP.youtube };
    }
    if (keyLower.includes('facebook') || keyLower === 'fb') {
      return { id: 'facebook', label: 'Facebook', config: PLATFORM_MAP.facebook };
    }
    if (keyLower.includes('instagram')) {
      return {
        id: 'instagram',
        label: 'Instagram',
        config: PLATFORM_MAP.instagram,
      };
    }
    if (keyLower.includes('pinterest')) {
      return {
        id: 'pinterest',
        label: 'Pinterest',
        config: PLATFORM_MAP.pinterest,
      };
    }
    if (keyLower.includes('linkedin')) {
      return { id: 'linkedin', label: 'LinkedIn', config: PLATFORM_MAP.linkedin };
    }
  }

  if (sourceUrl) {
    const detected = detectPlatformFromUrl(sourceUrl);
    if (detected) {
      const cfg = PLATFORM_MAP[detected];
      return { id: detected, label: cfg.name, config: cfg };
    }
  }

  const cleanedLabel = extractorKey
    ? extractorKey.replace(/([a-z])([A-Z])/g, '$1 $2').trim()
    : 'Social Media';

  return { id: null, label: cleanedLabel, config: null };
}

export function validateAndNormalizeUrl(input: string): {
  valid: boolean;
  normalizedUrl: string;
  error?: string;
} {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      valid: false,
      normalizedUrl: '',
      error: 'Please paste a social media video link first.',
    };
  }

  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;

  try {
    const parsed = new URL(withProtocol);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return {
        valid: false,
        normalizedUrl: '',
        error: 'Only valid http:// or https:// media links are supported.',
      };
    }
    if (!parsed.hostname || !parsed.hostname.includes('.')) {
      return {
        valid: false,
        normalizedUrl: '',
        error: 'Please enter a complete URL (for example, https://youtube.com/watch?v=...).',
      };
    }
    return { valid: true, normalizedUrl: parsed.toString() };
  } catch {
    return {
      valid: false,
      normalizedUrl: '',
      error: 'That doesn’t look like a valid URL. Check the link and try again.',
    };
  }
}

export function formatDuration(seconds?: number | null): string | null {
  if (seconds === null || seconds === undefined || Number.isNaN(seconds)) {
    return null;
  }
  const totalSeconds = Math.max(0, Math.round(Number(seconds)));
  if (totalSeconds === 0) return 'Live / Clip';

  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const paddedSecs = String(secs).padStart(2, '0');
  if (hrs > 0) {
    const paddedMins = String(mins).padStart(2, '0');
    return `${hrs}:${paddedMins}:${paddedSecs}`;
  }
  return `${String(mins).padStart(2, '0')}:${paddedSecs}`;
}

export function cleanApiErrorMessage(rawMessage: string): string {
  if (!rawMessage) {
    return 'Unable to fetch video metadata. Please verify the link is public and try again.';
  }
  const stripped = rawMessage
    .replace(/\u001b\[[0-9;]*m/g, '') // strip ANSI color codes from yt-dlp
    .replace(/^ERROR:\s*(\[[^\]]+\]\s*[^:]*:\s*)?/i, '')
    .trim();

  if (/private|login|sign in|cookies/i.test(stripped)) {
    return 'This post appears to be private or age-restricted. Please use a public video URL.';
  }
  if (/unsupported url/i.test(stripped)) {
    return 'Unsupported URL format. Please paste a direct public video link from YouTube, Facebook, Instagram, Pinterest, or LinkedIn.';
  }
  if (stripped.length > 200) {
    return `${stripped.slice(0, 197)}...`;
  }
  return stripped;
}
