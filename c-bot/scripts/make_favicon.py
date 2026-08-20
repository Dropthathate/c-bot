from pathlib import Path
from PIL import Image

source = Path("/home/ubuntu/c-bot/c-bot/public/ss.png")
target = Path("/home/ubuntu/c-bot/c-bot/public/favicon.png")

with Image.open(source) as image:
    rgba = image.convert("RGBA")
    # The central symbol occupies this region; omitting the wordmark preserves favicon legibility.
    mark = rgba.crop((350, 170, 1260, 1190))
    mark.thumbnail((512, 512), Image.Resampling.LANCZOS)
    mark.save(target, format="PNG", optimize=True, compress_level=9)
