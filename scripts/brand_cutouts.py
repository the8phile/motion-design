"""Make transparent PNGs of the official Kopia logo from the brand JPGs (brand/source/).

  python3 scripts/brand_cutouts.py

Only the background connected to the image border is removed (flood fill), so the K inside the
tile survives even where it has the background colour. Edges keep a soft anti-aliased alpha.
Prefer the official SVG files when they are available; these PNGs are derived from the JPGs.
"""
import os

import numpy as np
from PIL import Image
from scipy import ndimage

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, "brand", "source")
TILE_RIGHT = 560  # x where the tile + red offset end in the 1600x692 source lockups
OUT = os.path.join(ROOT, "brand")


def cutout(path, bg, tol=60, soft=90):
    rgb = np.asarray(Image.open(path).convert("RGB")).astype(np.float32)
    dist = np.sqrt(((rgb - np.array(bg, np.float32)) ** 2).sum(-1))
    near = dist < tol
    lab, _ = ndimage.label(near)
    border = np.unique(np.concatenate([lab[0], lab[-1], lab[:, 0], lab[:, -1]]))
    # also the counters of the wordmark (inside O, P, A): background-coloured regions right of the tile.
    # Regions inside the tile (the K) are kept.
    objs = ndimage.find_objects(lab)
    counters = [i + 1 for i, sl in enumerate(objs) if sl is not None and sl[1].start > TILE_RIGHT]
    bgmask = np.isin(lab, np.concatenate([border[border > 0], counters]))
    alpha = np.ones(dist.shape, np.float32)
    alpha[bgmask] = 0
    # soft edge: pixels within 2 px of the removed background get alpha from colour distance
    band = ndimage.binary_dilation(bgmask, iterations=2) & ~bgmask
    alpha[band] = np.clip((dist[band] - tol * 0.3) / soft, 0, 1)
    # un-premultiply the edge colour away from the background so no halo remains
    a = alpha[..., None]
    fg = np.where(a > 0.02, (rgb - (1 - a) * np.array(bg, np.float32)) / np.maximum(a, 0.02), rgb)
    rgba = np.dstack([np.clip(fg, 0, 255), alpha * 255]).astype(np.uint8)
    return Image.fromarray(rgba, "RGBA")


def trim(img, pad=8):
    box = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    l, t, r, b = box
    return img.crop((max(0, l - pad), max(0, t - pad), min(img.width, r + pad), min(img.height, b + pad)))


blue = cutout(os.path.join(SRC, "kopia-logo-on-white.jpg"), (255, 255, 255))   # blue logo, for light backgrounds
white = cutout(os.path.join(SRC, "kopia-logo-on-blue.jpg"), (13, 94, 244))     # white logo, for blue/dark backgrounds
for name, img in (("kopia-logo-blue.png", blue), ("kopia-logo-white.png", white)):
    trim(img).save(os.path.join(OUT, name))
    # the mark alone (tile + red offset), left part of the lockup
    trim(img.crop((140, 140, 560, 560))).save(os.path.join(OUT, name.replace("logo", "mark")))
print("wrote", sorted(f for f in os.listdir(OUT) if f.endswith(".png")))
