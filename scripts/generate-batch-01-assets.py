#!/usr/bin/env python3
"""Generate master STL + product SVG assets for batch-01 (20 products)."""

from __future__ import annotations

import math
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
STL_DIR = ROOT / "production" / "stl" / "masters"
IMG_DIR = ROOT / "public" / "products"
ORDERS_DIR = ROOT / "production" / "stl" / "orders"

PRODUCTS = [
    ("PL-NAME-KEY", "Name Keychain", "#FFE600", "keychain", 40, 18, 4),
    ("PL-BAG-TAG", "Bag Tag", "#C8FF3D", "tag", 55, 35, 3),
    ("PL-FLEXI-DINO", "Flexi Dino", "#FF5A3C", "flexi", 90, 30, 25),
    ("PL-CLICKER", "Clicker", "#0B0B0F", "clicker", 35, 35, 18),
    ("PL-PEN-CUP", "Pen Cup", "#E8E4DA", "cup", 70, 70, 90),
    ("PL-ORBIT-CLIP", "Orbit Clip", "#C8FF3D", "clip", 50, 30, 20),
    ("PL-PHONE-STAND", "Phone Stand", "#7B61FF", "stand", 80, 70, 60),
    ("PL-DESK-ARC", "Desk Arc", "#E8E4DA", "arc", 180, 40, 120),
    ("PL-NAME-RIDGE", "Name Ridge", "#0B0B0F", "ridge", 120, 25, 35),
    ("PL-LITH-FRAME", "Lithophane Frame", "#FFE600", "frame", 100, 10, 130),
    ("PL-MINI-POT", "Mini Pot", "#FF5A3C", "pot", 75, 75, 70),
    ("PL-HEART-BOX", "Heart Box", "#FF5A3C", "box", 70, 65, 35),
    ("PL-CAKE-TOP", "Cake Topper", "#FFE600", "topper", 100, 8, 120),
    ("PL-ORNAMENT", "Ornament", "#C8FF3D", "ornament", 60, 10, 70),
    ("PL-PET-TAG", "Pet Tag", "#7B61FF", "pet", 40, 30, 3),
    ("PL-BOOKMARK", "Bookmark", "#0B0B0F", "bookmark", 140, 30, 2),
    ("PL-HEX-HOOK", "Hex Hook", "#E8E4DA", "hook", 50, 30, 40),
    ("PL-SOAP-DISH", "Soap Dish", "#C8FF3D", "dish", 110, 70, 15),
    ("PL-CTRL-STAND", "Controller Stand", "#0B0B0F", "ctrl", 120, 80, 70),
    ("PL-FLEX-COIL", "Flex Coil", "#FFE600", "coil", 70, 45, 45),
]


def write_ascii_stl(path: Path, name: str, triangles: list[tuple]):
    lines = [f"solid {name}"]
    for n, (v1, v2, v3) in triangles:
        lines.append(f"  facet normal {n[0]:.6f} {n[1]:.6f} {n[2]:.6f}")
        lines.append("    outer loop")
        for v in (v1, v2, v3):
            lines.append(f"      vertex {v[0]:.4f} {v[1]:.4f} {v[2]:.4f}")
        lines.append("    endloop")
        lines.append("  endfacet")
    lines.append(f"endsolid {name}")
    path.write_text("\n".join(lines) + "\n", encoding="utf-8")


def tri(a, b, c):
    ux, uy, uz = b[0] - a[0], b[1] - a[1], b[2] - a[2]
    vx, vy, vz = c[0] - a[0], c[1] - a[1], c[2] - a[2]
    nx = uy * vz - uz * vy
    ny = uz * vx - ux * vz
    nz = ux * vy - uy * vx
    length = math.sqrt(nx * nx + ny * ny + nz * nz) or 1.0
    return ((nx / length, ny / length, nz / length), (a, b, c))


def box(w, d, h, ox=0.0, oy=0.0, oz=0.0):
    x0, x1 = ox, ox + w
    y0, y1 = oy, oy + d
    z0, z1 = oz, oz + h
    p = {
        "a": (x0, y0, z0),
        "b": (x1, y0, z0),
        "c": (x1, y1, z0),
        "d": (x0, y1, z0),
        "e": (x0, y0, z1),
        "f": (x1, y0, z1),
        "g": (x1, y1, z1),
        "h": (x0, y1, z1),
    }
    faces = [
        ("a", "b", "c"),
        ("a", "c", "d"),  # bottom
        ("e", "g", "f"),
        ("e", "h", "g"),  # top
        ("a", "e", "f"),
        ("a", "f", "b"),  # front
        ("d", "c", "g"),
        ("d", "g", "h"),  # back
        ("a", "d", "h"),
        ("a", "h", "e"),  # left
        ("b", "f", "g"),
        ("b", "g", "c"),  # right
    ]
    return [tri(p[i], p[j], p[k]) for i, j, k in faces]


def cylinder(r, h, segments=24, ox=0.0, oy=0.0, oz=0.0):
    tris = []
    for i in range(segments):
        a0 = (2 * math.pi * i) / segments
        a1 = (2 * math.pi * (i + 1)) / segments
        x0, y0 = ox + r * math.cos(a0), oy + r * math.sin(a0)
        x1, y1 = ox + r * math.cos(a1), oy + r * math.sin(a1)
        b0 = (x0, y0, oz)
        b1 = (x1, y1, oz)
        t0 = (x0, y0, oz + h)
        t1 = (x1, y1, oz + h)
        center_b = (ox, oy, oz)
        center_t = (ox, oy, oz + h)
        tris.append(tri(center_b, b1, b0))
        tris.append(tri(center_t, t0, t1))
        tris.append(tri(b0, b1, t1))
        tris.append(tri(b0, t1, t0))
    return tris


def geometry_for(kind: str, w: float, d: float, h: float):
    if kind in {"cup", "pot", "coil", "clicker"}:
        return cylinder(max(w, d) / 2, h)
    if kind == "ornament":
        return cylinder(w / 2, d) + box(8, 8, 12, w / 2 - 4, -4, d)
    if kind == "hook":
        return box(w, d, h * 0.3) + box(w * 0.35, d, h, w * 0.3, 0, 0)
    if kind == "frame":
        t = 6
        return (
            box(w, d, t)
            + box(w, d, t, 0, 0, h - t)
            + box(t, d, h)
            + box(t, d, h, w - t, 0, 0)
        )
    if kind == "arc":
        return box(w, d, 12) + box(18, d, h, 0, 0, 0) + box(18, d, h, w - 18, 0, 0)
    return box(w, d, h)


def svg_for(sku: str, title: str, color: str, kind: str) -> str:
    shapes = {
        "keychain": f'<rect x="90" y="120" width="140" height="60" rx="12" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><circle cx="110" cy="150" r="10" fill="#F3F3F1" stroke="#0A0A0A" stroke-width="3"/>',
        "tag": f'<rect x="80" y="100" width="160" height="110" rx="16" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><circle cx="110" cy="130" r="12" fill="#F3F3F1" stroke="#0A0A0A" stroke-width="3"/>',
        "flexi": f'<path d="M70 180 C110 80, 210 80, 250 180" fill="none" stroke="{color}" stroke-width="28" stroke-linecap="round"/><circle cx="70" cy="180" r="18" fill="{color}" stroke="#0A0A0A" stroke-width="3"/><circle cx="250" cy="180" r="18" fill="{color}" stroke="#0A0A0A" stroke-width="3"/>',
        "clicker": f'<circle cx="160" cy="160" r="70" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><circle cx="160" cy="160" r="28" fill="#FFE600" stroke="#0A0A0A" stroke-width="3"/>',
        "cup": f'<rect x="100" y="90" width="120" height="140" rx="8" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><ellipse cx="160" cy="90" rx="60" ry="16" fill="#fff" stroke="#0A0A0A" stroke-width="3"/>',
        "clip": f'<ellipse cx="160" cy="160" rx="80" ry="50" fill="none" stroke="{color}" stroke-width="22"/><circle cx="160" cy="160" r="18" fill="#0A0A0A"/>',
        "stand": f'<polygon points="90,230 230,230 200,90 120,90" fill="{color}" stroke="#0A0A0A" stroke-width="4"/>',
        "arc": f'<path d="M60 220 L60 80 Q160 20 260 80 L260 220" fill="none" stroke="{color}" stroke-width="26" stroke-linecap="round"/>',
        "ridge": f'<rect x="60" y="150" width="200" height="40" rx="6" fill="{color}" stroke="#0A0A0A" stroke-width="4"/>',
        "frame": f'<rect x="70" y="70" width="180" height="180" fill="none" stroke="{color}" stroke-width="18"/><rect x="100" y="100" width="120" height="120" fill="#fff" stroke="#0A0A0A" stroke-width="3"/>',
        "pot": f'<path d="M100 100 L220 100 L200 230 L120 230 Z" fill="{color}" stroke="#0A0A0A" stroke-width="4"/>',
        "box": f'<path d="M160 80 L230 120 L160 160 L90 120 Z" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><path d="M90 120 L90 190 L160 230 L160 160 Z" fill="#ff8a70" stroke="#0A0A0A" stroke-width="3"/><path d="M160 160 L160 230 L230 190 L230 120 Z" fill="#e04830" stroke="#0A0A0A" stroke-width="3"/>',
        "topper": f'<rect x="155" y="90" width="10" height="150" fill="{color}" stroke="#0A0A0A" stroke-width="2"/><rect x="80" y="70" width="160" height="40" rx="8" fill="{color}" stroke="#0A0A0A" stroke-width="4"/>',
        "ornament": f'<circle cx="160" cy="170" r="70" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><rect x="150" y="70" width="20" height="30" fill="#0A0A0A"/>',
        "pet": f'<ellipse cx="160" cy="165" rx="70" ry="55" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><circle cx="120" cy="120" r="22" fill="{color}" stroke="#0A0A0A" stroke-width="3"/><circle cx="200" cy="120" r="22" fill="{color}" stroke="#0A0A0A" stroke-width="3"/>',
        "bookmark": f'<rect x="130" y="50" width="60" height="220" rx="8" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><polygon points="130,270 160,240 190,270" fill="#F3F3F1"/>',
        "hook": f'<polygon points="160,70 210,100 210,160 160,190 110,160 110,100" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><rect x="145" y="150" width="30" height="70" fill="#0A0A0A"/>',
        "dish": f'<rect x="60" y="130" width="200" height="70" rx="16" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><line x1="90" y1="150" x2="230" y2="180" stroke="#0A0A0A" stroke-width="3"/>',
        "ctrl": f'<rect x="70" y="140" width="180" height="80" rx="12" fill="{color}" stroke="#0A0A0A" stroke-width="4"/><rect x="100" y="90" width="120" height="55" rx="8" fill="#333" stroke="#0A0A0A" stroke-width="3"/>',
        "coil": f'<circle cx="160" cy="160" r="70" fill="none" stroke="{color}" stroke-width="28"/><circle cx="160" cy="160" r="28" fill="#0A0A0A"/>',
    }
    shape = shapes.get(kind, shapes["ridge"])
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="640" height="640" viewBox="0 0 320 320">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#F3F3F1"/>
      <stop offset="100%" stop-color="#FFE600" stop-opacity="0.35"/>
    </linearGradient>
  </defs>
  <rect width="320" height="320" fill="url(#bg)"/>
  <rect x="16" y="16" width="288" height="288" fill="none" stroke="#0A0A0A" stroke-width="4"/>
  {shape}
  <text x="24" y="44" font-family="Arial Black, Helvetica, sans-serif" font-size="14" font-weight="900" fill="#0A0A0A">{sku}</text>
  <text x="24" y="300" font-family="Arial, sans-serif" font-size="12" font-weight="700" fill="#0A0A0A">{title}</text>
</svg>
"""


def main():
    STL_DIR.mkdir(parents=True, exist_ok=True)
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    ORDERS_DIR.mkdir(parents=True, exist_ok=True)
    manifest = []
    for sku, title, color, kind, w, d, h in PRODUCTS:
        stl_name = f"{sku}_MASTER_v1.stl"
        stl_path = STL_DIR / stl_name
        tris = geometry_for(kind, float(w), float(d), float(h))
        write_ascii_stl(stl_path, sku.replace("-", "_"), tris)
        svg_path = IMG_DIR / f"{sku.lower()}.svg"
        svg_path.write_text(svg_for(sku, title, color, kind), encoding="utf-8")
        manifest.append(f"{sku}\t{stl_name}\t{svg_path.name}\t{kind}\t{w}x{d}x{h}mm")
        print(f"OK {sku} -> {stl_path.relative_to(ROOT)}")

    (ROOT / "production" / "stl" / "MANIFEST-batch-01.tsv").write_text(
        "sku\tmaster_stl\timage\tkind\tdimensions\n" + "\n".join(manifest) + "\n",
        encoding="utf-8",
    )
    print(f"Wrote {len(PRODUCTS)} masters + images")


if __name__ == "__main__":
    main()
