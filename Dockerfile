FROM python:3.10
RUN apt-get update && apt-get install -y ffmpeg
WORKDIR /code
COPY requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN pip install --no-cache-dir --upgrade yt-dlp
COPY . /code
CMD uvicorn main:app --host 0.0.0.0 --port ${PORT:-10000}
