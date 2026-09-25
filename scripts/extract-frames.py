"""
Turns assets-src/sherco-rollin.mp4 into the WebP image sequence used by the hero.

Why an image sequence and not the video itself: scrubbing a <video> with the
scroll position stutters on most phones, while drawing pre-decoded frames to a
<canvas> stays smooth everywhere.

What happens to every frame:
  * the near-white studio background (values ~244-255 plus compression noise)
    is lifted to pure white, so the canvas can be blended with
    `mix-blend-mode: multiply` and disappears seamlessly into the page;
  * the floor shadow fades out towards the bottom edge (only light shadow
    pixels, so the dark tyres keep their contrast) and the last rows turn
    white, because the shadow touches the frame border in the second half
    of the clip;
  * frame 0 (a flash frame of the reference photo) and the frames where the
    bike is still cut off by the left edge are skipped;
  * the bike's bounding box per frame goes into manifest.json (the hero uses
    it to place the bike next to the headline and for the headline reveal).

Requirements: Python 3, Pillow, numpy and an ffmpeg binary
(`pip install pillow numpy imageio-ffmpeg` provides everything).

Usage (from the repository root):
    python3 scripts/extract-frames.py
"""

import json
import shutil
import subprocess
import tempfile
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets-src" / "sherco-rollin.mp4"
OUT = ROOT / "public" / "sequence"

FIRST_FRAME = 40   # bike fully inside the frame from here on
LAST_FRAME = 238   # bike faces the camera
WHITE_POINT = 244  # everything brighter becomes pure white
SHADOW_FADE_FROM = 0.86  # light shadow pixels fade out from here to the bottom
EDGE_FADE_FROM = 0.975  # the last rows fade to white completely
QUALITY = 78


def ffmpeg_binary() -> str:
    found = shutil.which("ffmpeg")
    if found:
        return found
    import imageio_ffmpeg  # type: ignore

    return imageio_ffmpeg.get_ffmpeg_exe()


def smoothstep(t: np.ndarray) -> np.ndarray:
    t = np.clip(t, 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def bike_box(rgb: np.ndarray) -> list:
    """Bounding box of the bike (coloured or dark pixels, not the soft shadow), in 0–1 units."""
    luma = rgb.mean(axis=2)
    saturation = rgb.max(axis=2) - rgb.min(axis=2)
    ys, xs = np.where((saturation > 40) | (luma < 90))
    h, w = luma.shape
    return [round(xs.min() / w, 3), round(ys.min() / h, 3), round(xs.max() / w, 3), round(ys.max() / h, 3)]


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.webp"):
        old.unlink()

    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(
            [ffmpeg_binary(), "-loglevel", "error", "-i", str(SRC), "-vsync", "0", f"{tmp}/%03d.png"],
            check=True,
        )
        raw = sorted(Path(tmp).glob("*.png"))

        height, width = np.asarray(Image.open(raw[0])).shape[:2]
        rows = np.linspace(0.0, 1.0, height)[:, None]
        shadow_fade = smoothstep((rows - SHADOW_FADE_FROM) / (1.0 - SHADOW_FADE_FROM))
        edge_fade = smoothstep((rows - EDGE_FADE_FROM) / (1.0 - EDGE_FADE_FROM))

        total = 0
        count = 0
        boxes = []
        for index in range(FIRST_FRAME, LAST_FRAME + 1):
            frame = np.asarray(Image.open(raw[index]).convert("RGB")).astype(np.float32)
            frame = np.clip(frame * (255.0 / WHITE_POINT), 0.0, 255.0)
            luma = frame.mean(axis=2)
            # 0 for dark pixels (tyres, engine), 1 for the light grey floor shadow
            lightness = np.clip((luma - 120.0) / 80.0, 0.0, 1.0)
            fade = np.maximum(shadow_fade * lightness, edge_fade)[:, :, None]
            frame = frame + (255.0 - frame) * fade
            image = Image.fromarray(frame.round().astype(np.uint8))
            target = OUT / f"{count:03d}.webp"
            image.save(target, "WEBP", quality=QUALITY, method=6)
            total += target.stat().st_size
            boxes.append(bike_box(np.asarray(image).astype(np.int16)))
            count += 1

    manifest = {
        "count": count,
        "width": int(width),
        "height": int(height),
        "sourceFrames": [FIRST_FRAME, LAST_FRAME],
        "sourceFps": 24,
    }
    text = json.dumps(manifest, indent=2)[:-2]
    text += ',\n  "bbox": ' + json.dumps(boxes, separators=(",", ":")) + "\n}\n"
    (OUT / "manifest.json").write_text(text)
    print(f"{count} frames, {total / 1024 / 1024:.2f} MB")


if __name__ == "__main__":
    main()
