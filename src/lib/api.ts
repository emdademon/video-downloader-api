import { API_BASE_URL } from './constants';
import { DownloadParams, VideoInfoResponse } from './types';
import { cleanApiErrorMessage } from './utils';

export async function checkApiHealth(signal?: AbortSignal): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal,
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchVideoInfo(
  url: string,
  signal?: AbortSignal
): Promise<VideoInfoResponse> {
  const endpoint = `${API_BASE_URL}/api/info?url=${encodeURIComponent(url)}`;

  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal,
    });
  } catch (err) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw err;
    }
    throw new Error(
      'Could not connect to the cloud extraction engine. If the Render server was asleep, wait a few seconds and click "Fetch Video" again.'
    );
  }

  let payload: Record<string, unknown> | null = null;
  try {
    payload = (await res.json()) as Record<string, unknown>;
  } catch {
    payload = null;
  }

  if (!res.ok) {
    const detail =
      typeof payload?.detail === 'string'
        ? cleanApiErrorMessage(payload.detail)
        : `Server responded with status ${res.status}. Please check the link and try again.`;
    throw new Error(detail);
  }

  return {
    title:
      typeof payload?.title === 'string' && payload.title.trim()
        ? payload.title.trim()
        : 'Social Media Video',
    thumbnail: typeof payload?.thumbnail === 'string' ? payload.thumbnail : null,
    duration: typeof payload?.duration === 'number' ? payload.duration : null,
    platform: typeof payload?.platform === 'string' ? payload.platform : null,
    uploader: typeof payload?.uploader === 'string' ? payload.uploader : null,
  };
}

export function buildDownloadUrl({
  url,
  type,
  quality,
  format,
}: DownloadParams): string {
  const params = new URLSearchParams({
    url,
    type,
    quality,
    format,
  });
  return `${API_BASE_URL}/api/download?${params.toString()}`;
}

export function triggerBrowserDownload(downloadUrl: string): void {
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  anchor.setAttribute('download', '');
  anchor.style.display = 'none';
  document.body.appendChild(anchor);
  anchor.click();
  window.setTimeout(() => {
    anchor.remove();
  }, 250);
}
