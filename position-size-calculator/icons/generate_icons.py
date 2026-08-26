from PIL import Image, ImageDraw

def make_icon(size, path, padding_ratio=0.0):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    pad = int(size * padding_ratio)
    bg_box = [pad, pad, size - pad, size - pad]
    radius = int(size * 0.22)
    d.rounded_rectangle(bg_box, radius=radius, fill=(15, 23, 42, 255))

    cx, cy = size / 2, size / 2
    r_outer = size * 0.30
    r_mid = size * 0.19
    r_inner = size * 0.08

    accent = (59, 130, 246, 255)
    accent_light = (147, 197, 253, 255)
    white = (255, 255, 255, 255)

    d.ellipse([cx - r_outer, cy - r_outer, cx + r_outer, cy + r_outer], outline=accent_light, width=max(2, int(size * 0.02)))
    d.ellipse([cx - r_mid, cy - r_mid, cx + r_mid, cy + r_mid], outline=accent, width=max(2, int(size * 0.025)))
    d.ellipse([cx - r_inner, cy - r_inner, cx + r_inner, cy + r_inner], fill=white)

    img.save(path)

make_icon(192, "icon-192.png")
make_icon(512, "icon-512.png")
make_icon(512, "icon-512-maskable.png", padding_ratio=0.12)
print("done")
