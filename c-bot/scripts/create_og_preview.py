"""Generate the source-controlled 1200×630 SomaSync AI Open Graph image.

This deterministic generator intentionally uses no third-party marks and makes no compliance claims.
It is kept in the repository so the public social image can be recreated outside any hosted platform.
"""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "public" / "og-preview.png"
LOGO = ROOT / "public" / "ss.png"

WIDTH, HEIGHT = 1200, 630
BACKGROUND = "#F6F3EC"
INK = "#13273B"
BLUE = "#2F7EAE"
PALE_BLUE = "#DCEEF5"
SAGE = "#79957D"
RULE = "#C6D3D7"


def font(weight: str, size: int) -> ImageFont.FreeTypeFont:
    filename = "DejaVuSans-Bold.ttf" if weight == "bold" else "DejaVuSans.ttf"
    return ImageFont.truetype(f"/usr/share/fonts/truetype/dejavu/{filename}", size)


def main() -> None:
    canvas = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(canvas)

    # Quiet topographic field: a proprietary visual motif, not a medical endorsement mark.
    for offset, alpha in ((0, 34), (24, 24), (48, 16), (72, 10)):
        box = (758 - offset, 104 - offset, 1174 + offset, 520 + offset)
        draw.ellipse(box, outline=(47, 126, 174, alpha), width=2)
    for x in (80, 128, 176, 224):
        draw.line((x, 72, x, 548), fill=RULE, width=1)
    for y in (134, 182, 230, 278, 326, 374, 422, 470):
        draw.line((48, y, 338, y), fill=RULE, width=1)

    draw.rounded_rectangle((46, 48, 314, 84), radius=18, fill=PALE_BLUE)
    draw.text((64, 58), "SESSION DOCUMENTATION SYSTEM", font=font("bold", 14), fill=BLUE)
    draw.text((48, 153), "SomaSync AI", font=font("bold", 76), fill=INK)
    draw.text((52, 251), "Voice documentation for", font=font("regular", 36), fill=INK)
    draw.text((52, 299), "manual therapy", font=font("regular", 36), fill=INK)
    draw.line((52, 378, 526, 378), fill=BLUE, width=4)
    draw.text((52, 407), "Clinician-reviewed SOAP note drafts", font=font("regular", 23), fill="#4E6170")
    draw.text((52, 478), "01  CAPTURE", font=font("bold", 13), fill=SAGE)
    draw.text((196, 478), "02  REVIEW", font=font("bold", 13), fill=SAGE)
    draw.text((334, 478), "03  DOCUMENT", font=font("bold", 13), fill=SAGE)
    draw.text((52, 548), "somasyncai.com", font=font("regular", 18), fill="#6D7C86")

    # Use the existing official mark when present; preserve its proportions.
    if LOGO.exists():
        mark = Image.open(LOGO).convert("RGBA")
        mark.thumbnail((115, 115))
        canvas.paste(mark, (969, 252), mark)
    else:
        draw.ellipse((994, 278, 1070, 354), outline=BLUE, width=8)
        draw.ellipse((1040, 278, 1116, 354), outline=BLUE, width=8)

    draw.text((918, 411), "CLINICAL CARTOGRAPHY", font=font("bold", 13), fill=BLUE)
    canvas.save(OUTPUT, "PNG", optimize=True)


if __name__ == "__main__":
    main()
