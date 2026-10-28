import {
  AudioFormat,
  PlatformConfig,
  PlatformId,
  SelectOption,
  VideoFormat,
  VideoQuality,
} from './types';

export const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  'https://my-video-downloader-api-8ftr.onrender.com'
).replace(/\/+$/, '');

export const PLATFORMS: PlatformConfig[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    tagline: 'Videos, Shorts & 4K UHD',
    placeholder: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    exampleFormat: 'youtube.com/watch?v=... or youtu.be/...',
    domains: ['youtube.com', 'youtu.be', 'music.youtube.com'],
    accentHex: '#FF3B5C',
    glowGradient:
      'radial-gradient(ellipse 65% 50% at 50% -10%, rgba(244, 63, 94, 0.24), rgba(239, 68, 68, 0.08) 50%, transparent 80%)',
    activeBorder: 'border-rose-500/50 shadow-[0_0_28px_-6px_rgba(244,63,94,0.35)]',
    activeBg: 'bg-gradient-to-b from-rose-500/[0.14] to-rose-950/[0.18]',
    badgeClass: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    buttonGradient: 'from-rose-500 via-red-500 to-orange-500',
    supportedFeatures: ['Up to 4K (2160p)', 'YouTube Shorts', '192kbps MP3 / WAV'],
  },
  {
    id: 'facebook',
    name: 'Facebook',
    tagline: 'Watch, Reels & Public Clips',
    placeholder: 'https://www.facebook.com/watch/?v=10153231379946729',
    exampleFormat: 'facebook.com/watch/?v=... or fb.watch/...',
    domains: ['facebook.com', 'fb.watch', 'fb.com'],
    accentHex: '#3B82F6',
    glowGradient:
      'radial-gradient(ellipse 65% 50% at 50% -10%, rgba(59, 130, 246, 0.25), rgba(37, 99, 235, 0.08) 50%, transparent 80%)',
    activeBorder: 'border-blue-500/50 shadow-[0_0_28px_-6px_rgba(59,130,246,0.35)]',
    activeBg: 'bg-gradient-to-b from-blue-500/[0.14] to-blue-950/[0.18]',
    badgeClass: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    buttonGradient: 'from-blue-500 via-indigo-500 to-cyan-500',
    supportedFeatures: ['FB Watch HD', 'Facebook Reels', 'Clean Audio Rip'],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    tagline: 'Reels, Feed Videos & IGTV',
    placeholder: 'https://www.instagram.com/reel/C8xYzExample/',
    exampleFormat: 'instagram.com/reel/... or instagram.com/p/...',
    domains: ['instagram.com', 'instagr.am'],
    accentHex: '#EC4899',
    glowGradient:
      'radial-gradient(ellipse 65% 50% at 50% -10%, rgba(236, 72, 153, 0.24), rgba(245, 158, 11, 0.09) 50%, transparent 80%)',
    activeBorder: 'border-pink-500/50 shadow-[0_0_28px_-6px_rgba(236,72,153,0.35)]',
    activeBg: 'bg-gradient-to-b from-pink-500/[0.14] to-purple-950/[0.18]',
    badgeClass: 'bg-pink-500/15 text-pink-300 border-pink-500/30',
    buttonGradient: 'from-pink-500 via-fuchsia-500 to-amber-500',
    supportedFeatures: ['IG Reels No-Watermark', 'Feed Video Posts', 'Original Audio M4A/MP3'],
  },
  {
    id: 'pinterest',
    name: 'Pinterest',
    tagline: 'Video Pins & Idea Clips',
    placeholder: 'https://www.pinterest.com/pin/123456789012345678/',
    exampleFormat: 'pinterest.com/pin/... or pin.it/...',
    domains: ['pinterest.com', 'pin.it'],
    accentHex: '#E11D48',
    glowGradient:
      'radial-gradient(ellipse 65% 50% at 50% -10%, rgba(225, 29, 72, 0.24), rgba(251, 113, 133, 0.08) 50%, transparent 80%)',
    activeBorder: 'border-red-500/50 shadow-[0_0_28px_-6px_rgba(225,29,72,0.35)]',
    activeBg: 'bg-gradient-to-b from-red-500/[0.14] to-rose-950/[0.18]',
    badgeClass: 'bg-red-500/15 text-red-300 border-red-500/30',
    buttonGradient: 'from-red-600 via-rose-500 to-pink-500',
    supportedFeatures: ['HD Video Pins', 'Idea Pin Clips', 'Direct MP4 & MOV'],
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    tagline: 'Native Posts & Event Videos',
    placeholder: 'https://www.linkedin.com/posts/activity-7190000000000000000',
    exampleFormat: 'linkedin.com/posts/... or linkedin.com/feed/update/...',
    domains: ['linkedin.com', 'lnkd.in'],
    accentHex: '#0EA5E9',
    glowGradient:
      'radial-gradient(ellipse 65% 50% at 50% -10%, rgba(14, 165, 233, 0.24), rgba(56, 189, 248, 0.08) 50%, transparent 80%)',
    activeBorder: 'border-sky-500/50 shadow-[0_0_28px_-6px_rgba(14,165,233,0.35)]',
    activeBg: 'bg-gradient-to-b from-sky-500/[0.14] to-sky-950/[0.18]',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30',
    buttonGradient: 'from-sky-500 via-blue-500 to-indigo-500',
    supportedFeatures: ['Keynote & Post Clips', '1080p Presentation Video', 'Podcast/Talk MP3'],
  },
];

export const PLATFORM_MAP: Record<PlatformId, PlatformConfig> = PLATFORMS.reduce(
  (acc, item) => {
    acc[item.id] = item;
    return acc;
  },
  {} as Record<PlatformId, PlatformConfig>
);

export const VIDEO_QUALITY_OPTIONS: SelectOption<VideoQuality>[] = [
  {
    value: '4k',
    label: '4K (2160p)',
    badge: 'Ultra HD',
    detail: 'Maximum 2160p cinema resolution',
  },
  {
    value: '1080p',
    label: '1080p',
    badge: 'Full HD',
    detail: 'Recommended crisp HD quality',
  },
  {
    value: '720p',
    label: '720p',
    badge: 'Standard HD',
    detail: 'Balanced quality & quick download',
  },
  {
    value: '480p',
    label: '480p',
    badge: 'Compact SD',
    detail: 'Lightweight file size for mobile',
  },
];

export const VIDEO_FORMAT_OPTIONS: SelectOption<VideoFormat>[] = [
  {
    value: 'mp4',
    label: 'MP4',
    badge: 'Universal',
    detail: 'Plays natively on all devices & browsers',
  },
  {
    value: 'mov',
    label: 'MOV',
    badge: 'QuickTime',
    detail: 'Ideal for macOS, iOS & video editing',
  },
  {
    value: 'mkv',
    label: 'MKV',
    badge: 'Matroska',
    detail: 'Flexible high-bitrate media container',
  },
];

export const AUDIO_FORMAT_OPTIONS: SelectOption<AudioFormat>[] = [
  {
    value: 'mp3',
    label: 'MP3',
    badge: '192 kbps',
    detail: 'Universal audio format for every player',
  },
  {
    value: 'wav',
    label: 'WAV',
    badge: 'Lossless',
    detail: 'Uncompressed PCM audio for editing',
  },
  {
    value: 'aac',
    label: 'AAC',
    badge: 'High Efficiency',
    detail: 'Clean modern acoustics at smaller size',
  },
  {
    value: 'm4a',
    label: 'M4A',
    badge: 'Apple Audio',
    detail: 'Optimized for Apple Music & iOS devices',
  },
];

export const FAQ_ITEMS = [
  {
    question: 'Which social media platforms are supported?',
    answer:
      'HoqueSave natively supports YouTube (videos & Shorts), Facebook (Watch & Reels), Instagram (Reels, Posts & IGTV), Pinterest (Video & Idea Pins), and LinkedIn native video posts — powered by yt-dlp and FFmpeg on our cloud extraction engine.',
  },
  {
    question: 'Why might the first fetch take 15–30 seconds?',
    answer:
      'Our FastAPI + yt-dlp + FFmpeg backend runs on Render cloud infrastructure. If the server has been idle, it automatically wakes up on your first request. Subsequent video fetches and downloads respond within seconds.',
  },
  {
    question: 'What happens if I select 4K (2160p) on a video uploaded in 1080p?',
    answer:
      'Our FFmpeg pipeline automatically selects the highest available video stream up to your requested ceiling (e.g., height <= 2160) and merges it with the highest-bitrate audio track so your download never fails when a creator uploaded at lower resolution.',
  },
  {
    question: 'Can I extract pure audio without downloading the video track?',
    answer:
      'Yes! Switch the Download Mode toggle to "Audio Only" after fetching any link, then pick MP3, WAV, AAC, or M4A. The backend extracts and transcodes pure audio via FFmpeg before streaming the file directly to your browser.',
  },
];
