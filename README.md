# HoqueSave — All-in-One Social Media Video & Audio Downloader

A full-stack Social Media Video & Audio Downloader built with **Next.js (App Router)**, **React**, **Tailwind CSS**, and **Lucide Icons** on the frontend, connected seamlessly to a cloud **FastAPI + yt-dlp + FFmpeg** backend (`https://my-video-downloader-api-8ftr.onrender.com`).

## Key Features

- **Glassmorphism Media Studio UI**: Responsive navbar, dynamic platform-reactive gradients, tactile selector cards, and smooth mobile/desktop ergonomics.
- **5-Platform Smart Support**: Interactive platform tabs and automatic URL detection for **YouTube**, **Facebook**, **Instagram**, **Pinterest**, and **LinkedIn**.
- **Live Metadata Preview**: Fetches video title, high-resolution thumbnail, duration, uploader, and source platform via `GET /api/info?url={URL}` with a shimmer skeleton loader.
- **Video & Audio Modes**:
  - **Video File Mode**: Quality selector (`4K (2160p)`, `1080p`, `720p`, `480p`) + Container Format selector (`MP4`, `MOV`, `MKV`).
  - **Audio Only Mode**: Audio Format selector (`MP3`, `WAV`, `AAC`, `M4A`) powered by FFmpeg 192kbps+ demuxing.
- **Direct Browser Stream Downloads**: Triggers direct streaming downloads from `GET /api/download` with toast notifications and local recent-media history.

## Getting Started (Frontend)

```bash
npm install
npm run dev
```

Open `http://localhost:3000` in your browser.

### Optional Environment Variable

By default, the frontend connects directly to `https://my-video-downloader-api-8ftr.onrender.com`. To point to another backend instance, create `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=https://my-video-downloader-api-8ftr.onrender.com
```

## Production Build

```bash
npm run build
npm run start
```

## Backend API Reference (`main.py`)

1. **`GET /api/info?url={URL}`**
   - Returns `{ "title", "thumbnail", "duration", "uploader", "platform" }`
2. **`GET /api/download?url={URL}&type={video|audio}&quality={4k|1080p|720p|480p}&format={mp4|mov|mkv|mp3|wav|m4a|aac}`**
   - Streams downloadable media file via `FileResponse`.
