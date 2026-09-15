"""
Génère les icônes PWA du carnet de route.
Lance : python make_icons.py
Design : une lanterne rouge sur fond nuit, et le caractère 中 en or au centre.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

HERE = Path(__file__).parent / "icons"
BG_TOP = (22, 17, 20)
BG_BOT = (10, 11, 15)
RED = (227, 50, 45)
RED_DARK = (150, 26, 24)
GOLD = (232, 176, 75)

# Polices capables de tracer un idéogramme. Aucune n'est garantie présente : si rien
# n'est trouvé, on retombe sur le 中 tracé à la main (deux traits, ça se dessine).
FONT_CANDIDATES = [
    "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc",
    "/usr/share/fonts/opentype/noto/NotoSerifCJK-Bold.ttc",
    "/usr/share/fonts/truetype/noto/NotoSansCJK-Bold.ttc",
    "/System/Library/Fonts/PingFang.ttc",
]


def _vgrad(size, top, bot):
    img = Image.new("RGB", (size, size), top)
    for y in range(size):
        t = y / max(1, size - 1)
        img.paste(tuple(int(a + (b - a) * t) for a, b in zip(top, bot)), (0, y, size, y + 1))
    return img


def _han_font(px):
    """Police contenant vraiment 中, sinon None.

    Un `getbbox()` non vide ne suffit pas : quand le glyphe manque, FreeType rend le
    `.notdef`, qui est souvent un rectangle creux — exactement ce qu'on croyait dessiner.
    On compare donc le rendu de 中 à celui d'un caractère à usage privé, forcément absent :
    s'ils sont identiques, c'est le .notdef des deux côtés.
    """
    for path in FONT_CANDIDATES:
        if not Path(path).exists():
            continue
        try:
            f = ImageFont.truetype(path, px)
        except OSError:
            continue
        han, notdef = f.getmask("中"), f.getmask("\ue000")
        if han.getbbox() and bytes(han) != bytes(notdef):
            return f
    return None


def _draw_zhong(d, cx, cy, h, color):
    """中 tracé à la main : un rectangle et une barre verticale qui le traverse."""
    w = int(h * 0.62)
    th = max(3, int(h * 0.11))
    box = [cx - w // 2, cy - int(h * 0.30), cx + w // 2, cy + int(h * 0.30)]
    d.rectangle(box, outline=color, width=th)
    d.line([cx, cy - h // 2, cx, cy + h // 2], fill=color, width=th)


def make_icon(size: int, out: Path) -> None:
    img = _vgrad(size, BG_TOP, BG_BOT)
    d = ImageDraw.Draw(img)
    cx, cy = size // 2, int(size * 0.52)
    rx, ry = int(size * 0.30), int(size * 0.26)

    # chapeau et culot de la lanterne
    cap_w, cap_h = int(rx * 0.72), max(2, int(size * 0.035))
    d.rectangle([cx - cap_w, cy - ry - cap_h, cx + cap_w, cy - ry + cap_h // 2], fill=GOLD)
    d.rectangle([cx - cap_w, cy + ry - cap_h // 2, cx + cap_w, cy + ry + cap_h], fill=GOLD)
    # anse et gland
    d.line([cx, int(size * 0.10), cx, cy - ry], fill=GOLD, width=max(2, size // 90))
    d.line([cx, cy + ry + cap_h, cx, int(size * 0.90)], fill=RED_DARK, width=max(2, size // 70))

    # corps : ellipse pleine + côtes verticales plus sombres
    d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=RED)
    for f in (0.42, 0.78):
        w = int(rx * f)
        d.ellipse([cx - w, cy - ry, cx + w, cy + ry], outline=RED_DARK, width=max(1, size // 150))

    # le caractère 中, en or
    h = int(size * 0.30)
    font = _han_font(h)
    if font:
        box = d.textbbox((0, 0), "中", font=font)
        d.text((cx - (box[0] + box[2]) / 2, cy - (box[1] + box[3]) / 2), "中", font=font, fill=GOLD)
    else:
        _draw_zhong(d, cx, cy, h, GOLD)

    img.convert("RGB").save(out, "PNG")
    print(f"  OK {out.name} ({size}px)")


if __name__ == "__main__":
    HERE.mkdir(exist_ok=True)
    for s in (180, 192, 512, 1024):
        make_icon(s, HERE / f"icon-{s}.png")
    print("Done.")
