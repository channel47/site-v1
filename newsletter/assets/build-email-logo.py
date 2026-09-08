#!/usr/bin/env python3
"""Build static and one-play email-safe versions of the Channel47 logo."""

from __future__ import annotations

import math
from pathlib import Path

from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[2]
GIF_OUTPUT = ROOT / "public" / "email" / "channel47-mark.gif"
STATIC_OUTPUT = ROOT / "public" / "email" / "channel47-mark-v2.png"

# Mirrors components/site/mark-blocks.ts at 3x output resolution.
SCALE = 3
CANVAS = (52, 28)
OFFSET = (2, 2)
BLOCKS = (
    (0, 0, 7, 18),
    (7, 11, 7, 7),
    (14, 0, 7, 24),
    (27, 0, 14, 7),
    (41, 0, 7, 12),
    (34, 12, 7, 12),
)

# Mirrors GlitchLogo's Post, Skill, Connector, Workshop color cycle.
ACCENTS = ("#a27f30", "#bc6b62", "#18998b", "#ad6b9b")
INK = "#161718"
KEYLINE = "#fdfdfc"
FRAME_MS = 40
ANIMATION_SECONDS = 0.80


def rgb(value: str) -> tuple[int, int, int, int]:
    value = value.lstrip("#")
    return tuple(int(value[i : i + 2], 16) for i in (0, 2, 4)) + (255,)


def mix(start: str, end: str, amount: float) -> tuple[int, int, int, int]:
    a = rgb(start)
    b = rgb(end)
    return tuple(round(x + (y - x) * amount) for x, y in zip(a, b))


def bit_delay(index: int) -> float:
    """The deterministic pulse=0 delay from components/site/bit-anim.ts."""
    hashed = math.sin((index + 1) * 127.1 + 311.7) * 43758.5453
    jitter = hashed - math.floor(hashed)
    return 0.05 + index * 0.034 + jitter * 0.12


def block_color(index: int, elapsed: float) -> tuple[int, int, int, int] | None:
    progress = (elapsed - bit_delay(index)) / 0.4
    if progress < 0:
        return None
    accent = ACCENTS[index % len(ACCENTS)]
    if progress <= 0.70:
        return rgb(accent)
    return mix(accent, INK, min(1.0, (progress - 0.70) / 0.30))


def rectangle(draw: ImageDraw.ImageDraw, block: tuple[int, int, int, int], color: object, grow: int = 0) -> None:
    x, y, width, height = block
    left = (OFFSET[0] + x - grow) * SCALE
    top = (OFFSET[1] + y - grow) * SCALE
    right = (OFFSET[0] + x + width + grow) * SCALE - 1
    bottom = (OFFSET[1] + y + height + grow) * SCALE - 1
    draw.rectangle((left, top, right, bottom), fill=color)


def frame(elapsed: float | None) -> Image.Image:
    image = Image.new("RGBA", (CANVAS[0] * SCALE, CANVAS[1] * SCALE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    colors = [rgb(INK) if elapsed is None else block_color(i, elapsed) for i in range(len(BLOCKS))]

    # Draw all expanded keylines first, then the blocks, to avoid seams where
    # neighboring rectangles touch.
    for block, color in zip(BLOCKS, colors):
        if color is not None:
            rectangle(draw, block, rgb(KEYLINE), grow=1)
    for block, color in zip(BLOCKS, colors):
        if color is not None:
            rectangle(draw, block, color)
    return image


def main() -> None:
    static_frame = frame(None)
    STATIC_OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    static_frame.save(STATIC_OUTPUT, format="PNG", optimize=True)

    # Frame one is the completed mark so clients with animation disabled get
    # the correct static fallback. Supporting clients then run the site's
    # staggered colored-block build once and remain on the completed mark.
    times = [step * FRAME_MS / 1000 for step in range(round(ANIMATION_SECONDS * 1000 / FRAME_MS) + 1)]
    frames = [static_frame, *(frame(elapsed) for elapsed in times), frame(None)]
    durations = [40, *([FRAME_MS] * len(times)), 600]

    frames[0].save(
        GIF_OUTPUT,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        disposal=2,
        optimize=True,
        transparency=0,
    )
    print(f"Built {STATIC_OUTPUT} ({STATIC_OUTPUT.stat().st_size} bytes)")
    print(f"Built {GIF_OUTPUT} ({GIF_OUTPUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
