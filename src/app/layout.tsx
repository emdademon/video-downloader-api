import type { Metadata, Viewport } from 'next';
import '@fontsource-variable/plus-jakarta-sans';
import '@fontsource-variable/jetbrains-mono';
import './globals.css';

export const metadata: Metadata = {
  title: 'HoqueSave — All-in-One Social Media Video & Audio Downloader',
  applicationName: 'HoqueSave',
  description:
    'Download 4K/1080p MP4, MOV & MKV videos and MP3, WAV, AAC & M4A audio from YouTube, Facebook, Instagram, Pinterest, and LinkedIn with HoqueSave.',
  authors: [{ name: 'Md. Emdadul Hoque' }],
  creator: 'Md. Emdadul Hoque',
  openGraph: {
    title: 'HoqueSave — All-in-One Social Media Video & Audio Downloader',
    siteName: 'HoqueSave',
    description:
      'Download 4K/1080p MP4, MOV & MKV videos and MP3, WAV, AAC & M4A audio from YouTube, Facebook, Instagram, Pinterest, and LinkedIn.',
    type: 'website',
  },
  keywords: [
    'HoqueSave',
    'video downloader',
    'audio downloader',
    'YouTube downloader',
    'Instagram Reels downloader',
    'Facebook video downloader',
    'Pinterest video downloader',
    'LinkedIn video downloader',
    '4K MP4',
    'MP3 converter',
  ],
};

export const viewport: Viewport = {
  themeColor: '#06080F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen font-sans antialiased">{children}</body>
    </html>
  );
}
