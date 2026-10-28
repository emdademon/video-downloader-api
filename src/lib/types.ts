export type PlatformId =
  | 'youtube'
  | 'facebook'
  | 'instagram'
  | 'pinterest'
  | 'linkedin';

export type MediaMode = 'video' | 'audio';

export type VideoQuality = '4k' | '1080p' | '720p' | '480p';

export type VideoFormat = 'mp4' | 'mov' | 'mkv';

export type AudioFormat = 'mp3' | 'wav' | 'aac' | 'm4a';

export type MediaFormat = VideoFormat | AudioFormat;

export interface VideoInfoResponse {
  title: string;
  thumbnail: string | null;
  duration: number | null;
  platform: string | null;
  uploader?: string | null;
}

export interface DownloadParams {
  url: string;
  type: MediaMode;
  quality: VideoQuality;
  format: MediaFormat;
}

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  badge: string;
  detail: string;
}

export interface PlatformConfig {
  id: PlatformId;
  name: string;
  tagline: string;
  placeholder: string;
  exampleFormat: string;
  domains: string[];
  accentHex: string;
  glowGradient: string;
  activeBorder: string;
  activeBg: string;
  badgeClass: string;
  buttonGradient: string;
  supportedFeatures: string[];
}

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
}

export interface RecentMediaItem {
  url: string;
  title: string;
  thumbnail: string | null;
  duration: number | null;
  platform: string | null;
  uploader?: string | null;
  fetchedAt: number;
}
