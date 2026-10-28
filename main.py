import os
import tempfile
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import yt_dlp

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "Video Downloader API is Running!"}

@app.get("/api/info")
def get_video_info(url: str = Query(..., description="Target Social Media Video URL")):
    ydl_opts = {'quiet': True, 'no_warnings': True}
    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=False)
            return {
                "title": info.get('title', 'Social Media Video'),
                "thumbnail": info.get('thumbnail'),
                "duration": info.get('duration'),
                "uploader": info.get('uploader'),
                "platform": info.get('extractor_key'),
            }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/download")
def download_media(
    url: str,
    type: str = "video",
    quality: str = "1080p",
    format: str = "mp4"
):
    temp_dir = tempfile.mkdtemp()
    out_template = os.path.join(temp_dir, '%(title)s.%(ext)s')

    if type == "audio":
        ydl_opts = {
            'format': 'bestaudio/best',
            'outtmpl': out_template,
            'postprocessors': [{
                'key': 'FFmpegExtractAudio',
                'preferredcodec': format,
                'preferredquality': '192',
            }],
        }
    else:
        height_map = {"4k": "2160", "1080p": "1080", "720p": "720", "480p": "480"}
        target_height = height_map.get(quality, "1080")
        ydl_opts = {
            'format': f'bestvideo[height<={target_height}]+bestaudio/best',
            'outtmpl': out_template,
            'merge_output_format': format,
        }

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(url, download=True)
            file_path = ydl.prepare_filename(info)
            base, _ = os.path.splitext(file_path)
            expected_file = f"{base}.{format}"
            final_path = expected_file if os.path.exists(expected_file) else file_path
            
            return FileResponse(
                path=final_path,
                filename=os.path.basename(final_path),
                media_type='application/octet-stream'
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
