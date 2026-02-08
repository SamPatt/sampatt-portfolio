---
title: patterkin-script
tags:
  - project-patterkin-videos
  - bash
  - cli-commands
  - video-processing
image: null
last_edited: 2026-02-08T01:18:36.000Z
created: 2026-02-08T01:18:36.000Z
---

# Video Processing Pipeline

  

`process_tape_complete.py` is a single-script pipeline that takes a raw DV/AVI capture and produces all the assets needed for web streaming. It runs 7 steps sequentially, skipping any that already have output files present (making it safe to re-run after a failure).

  

## Pipeline Steps

  

### 1. Encode

  

Deinterlaces the raw DV capture and transcodes it to a progressive H.264 MP4 archive.

  

- **Deinterlacing**: bwdif filter with BFF (bottom field first) parity, send_frame mode

- **Encoder**: NVENC hardware encoder (`h264_nvenc`), slow preset, CQ 18

- **Output resolution**: 720x540 with SAR 1:1

- **Audio**: AAC at 192 kbps, 48 kHz

- **Corruption handling**: If `--corrupted` is passed, switches to yadif (simpler deinterlacing), fast preset, CQ 20, and sets `-err_detect ignore_err` and `-fflags +ignidx+igndts` to push through bitstream errors

- **Fallback**: If the primary encode hangs for >10 minutes (common with severely damaged DV), it automatically kills the process and retries with the fallback encoder

- **Output**: `T###_archive.mp4` with `faststart` flag for progressive download

  

### 2. Poster

  

Extracts a single frame from the archive as a JPEG thumbnail for use as the video poster in the player.

  

- **Default time**: 10 seconds into the video (configurable via `--poster-time`)

- **Resolution**: 720x540

- **Quality**: `-q:v 2` (high quality JPEG)

- **Output**: `poster.jpg`

  

### 3. Sprite

  

Generates a contact sheet sprite image and matching WebVTT file for thumbnail previews during scrubbing.

  

- **Grid**: 10 columns x 7 rows = 70 thumbnails max

- **Thumbnail size**: 160x120 pixels each

- **Interval**: Adaptive -- divides total duration by 70 so every video gets full timeline coverage regardless of length

- **VTT**: Maps each thumbnail's position in the sprite to its time range, used by Video.js for hover previews

- **Output**: `sprite.jpg` + `sprite.vtt`

  

### 4. HLS

  

Creates an HTTP Live Streaming adaptive bitrate ladder so the player can switch quality based on bandwidth.

  

- **360p stream**: 1.2 Mbps video, 128 kbps audio, 10s segments (`360p_###.ts`)

- **480p stream**: 2.5 Mbps video, 192 kbps audio, 10s segments (`480p_###.ts`)

- **Segment duration**: 10 seconds

- **Encoder**: NVENC fast preset for both rungs

- **Output**: `hls/master.m3u8`, `hls/360p.m3u8`, `hls/480p.m3u8`, and all `.ts` segment files

  

### 5. Tape Images

  

Finds any JPG photos of the physical tape label in the raw folder (photos taken before digitizing) and compresses them for web display.

  

- **Auto-discovery**: Scans the raw directory for `*.jpg` / `*.JPG` files

- **Compression**: Iteratively reduces JPEG quality from 95 downward until the file is under 1 MB

- **Naming**: Outputs as `tape_01.jpg`, `tape_02.jpg`, etc.

- **Output**: `tape_images/` directory

  

### 6. Transcribe

  

Runs speech-to-text on the archive audio using WhisperX with GPU acceleration.

  

- **Model**: `large-v3` (most accurate Whisper variant)

- **Compute**: CUDA with float16 precision, batch size 16

- **Post-processing**: Long segments (>5s or >20 words) are split at sentence boundaries for readability

- **Output formats**:

- `transcript.vtt` -- WebVTT subtitles for the video player

- `transcript.json` -- Structured JSON with per-segment timestamps, language detection, and processing stats

  

### 7. Metadata

  

Finalizes the tape's metadata by moving it from the raw folder to the processed folder and stamping it with processing results.

  

- **Move**: Copies `metadata.yaml` from raw to processed, then deletes the raw copy

- **Status flags**: Sets `encoded`, `hls`, `thumbnails`, `transcribed` booleans based on which output files exist

- **File paths**: Records the relative path to every output file

- **Duration**: Probes the archive with ffprobe and writes `duration_minutes` into the metadata

- **JSON export**: Converts the final YAML to `metadata.json` for consumption by the frontend

- **Output**: `metadata.yaml` + `metadata.json`

  

## Commands

  

### Full pipeline

  

Processes a tape through all 7 steps. Requires an NVIDIA GPU for both encoding (NVENC) and transcription (WhisperX). The `--storage nas` flag reads raw files from `/mnt/patterkin-raw/T###/` and writes output to `/mnt/patterkin-processed/T###/`.

  

```bash

python3 scripts/process_tape_complete.py T022 --storage nas

```

  

### Trimming the source

  

Cuts the raw capture before processing. Useful for removing leader/trailer noise from the DV stream. Accepts either `HH:MM:SS` or raw seconds. `--start` and `--end` can be used independently -- omit either to keep the original start or end point.

  

```bash

# Trim both ends

python3 scripts/process_tape_complete.py T022 --start 00:00:10 --end 01:57:45 --storage nas

  

# Trim only the beginning (keep everything after 30 seconds)

python3 scripts/process_tape_complete.py T022 --start 00:00:30 --storage nas

  

# Trim only the end

python3 scripts/process_tape_complete.py T022 --end 01:55:00 --storage nas

```

  

### Custom poster frame

  

Sets which frame from the encoded archive is used as the video thumbnail. Defaults to 10 seconds in. Accepts `HH:MM:SS` or seconds.

  

```bash

python3 scripts/process_tape_complete.py T022 --poster-time 00:46:04 --storage nas

```

  

### Selective steps

  

Run only specific pipeline steps. Useful for re-running a failed step without repeating the entire pipeline, or for skipping steps you don't need yet.

  

```bash

# Only encode (useful for reviewing footage before committing to full processing)

python3 scripts/process_tape_complete.py T022 --steps encode --storage nas

  

# Generate everything except the transcript

python3 scripts/process_tape_complete.py T022 --steps encode poster sprite hls tape-images metadata --storage nas

  

# Re-run just transcription and metadata on an already-encoded tape

python3 scripts/process_tape_complete.py T022 --steps transcribe metadata --storage nas

```

  

Convenience shorthand flags are also available:

  

```bash

# Equivalent to --steps encode

python3 scripts/process_tape_complete.py T022 --encode-only --storage nas

  

# Skip encoding (assumes T###_archive.mp4 already exists)

python3 scripts/process_tape_complete.py T022 --no-encode --storage nas

  

# Skip transcription

python3 scripts/process_tape_complete.py T022 --no-transcribe --storage nas

```

  

### Corrupted tape handling

  

For tapes with DV bitstream errors (dropped frames, garbled sections). Switches to a more forgiving deinterlacing filter and encoding preset, and tells FFmpeg to ignore bitstream errors rather than aborting.

  

```bash

python3 scripts/process_tape_complete.py T022 --corrupted --storage nas

```

  

If the primary encode hangs (common with severe corruption), the script automatically kills it after 10 minutes and retries with a fallback encoder. If the fallback also hangs after 8 minutes, it aborts.

  

### Local storage

  

For development or testing without NAS mounts. Reads raw files from `~/Videos/patterkin/raw/T###/` and writes to `~/Videos/patterkin/processed/T###/`.

  

```bash

python3 scripts/process_tape_complete.py T022 --storage local

```

  

### Post-processing: upload to R2

  

After processing, upload the output to Cloudflare R2 for serving. The `--exclude` flag skips the large archive MP4 (which is kept on local/NAS storage only).

  

```bash

rclone copy /mnt/patterkin-processed/T022 r2:patterkin-videos/videos/T022 --exclude="*archive.mp4"

```

  

### Post-processing: sync scene IDs

  

If the tape's `metadata.yaml` includes scene definitions, sync them to Supabase so reactions can be attached to individual scenes.

  

```bash

# Preview what would be synced

node scripts/sync_scene_ids.js --dry-run

  

# Actually sync

node scripts/sync_scene_ids.js

```

  

## Requirements

  

- **FFmpeg** with NVENC support (requires NVIDIA GPU + CUDA drivers)

- **Python 3.10+** with `pyyaml` and `whisperx`

- **WhisperX** with CUDA support for transcription

- **cuDNN** libraries (the script auto-creates compatibility symlinks)

- **rclone** configured with R2 credentials for upload

- **Node.js** for scene sync script

  

## Performance

  

On an RTX 4090, encoding a 2-hour DV tape takes approximately 2-3 minutes. HLS generation adds another 2-3 minutes. Transcription with `large-v3` takes roughly 3-5 minutes for a 2-hour tape. The full pipeline typically completes in under 15 minutes per tape.
