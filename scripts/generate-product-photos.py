#!/usr/bin/env python3
"""Generate unique studio-style product images (SVG) for each SKU."""

from __future__ import annotations

from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
IMG_DIR = ROOT / "public" / "products"

# sku, title_de, accent, kind
PRODUCTS = [
    ("pl-name-key", "Name Keychain", "#FFE600", "keychain"),
    ("pl-bag-tag", "Rucksack-Tag", "#C8FF3D", "tag"),
    ("pl-flexi-dino", "Flexi Dino", "#FF5A3C", "dino"),
    ("pl-clicker", "Fidget Clicker", "#2A2A2A", "clicker"),
    ("pl-pen-cup", "Desk Pen Cup", "#E8E4DA", "cup"),
    ("pl-orbit-clip", "Orbit Clip", "#C8FF3D", "orbit"),
    ("pl-phone-stand", "Phone Stand", "#7B61FF", "phone"),
    ("pl-desk-arc", "Desk Arc", "#D4CFC4", "arc"),
    ("pl-name-ridge", "Name Ridge", "#1A1A1A", "ridge"),
    ("pl-lith-frame", "Lithophane", "#FFE600", "frame"),
    ("pl-mini-pot", "Mini Planter", "#FF5A3C", "pot"),
    ("pl-heart-box", "Herzbox", "#FF5A3C", "heart"),
    ("pl-cake-top", "Cake Topper", "#FFE600", "cake"),
    ("pl-ornament", "Ornament", "#C8FF3D", "ornament"),
    ("pl-pet-tag", "Pet Tag", "#7B61FF", "pet"),
    ("pl-bookmark", "Lesezeichen", "#1A1A1A", "bookmark"),
    ("pl-hex-hook", "Hex Hook", "#E8E4DA", "hook"),
    ("pl-soap-dish", "Seifenschale", "#A8E06A", "soap"),
    ("pl-ctrl-stand", "Controller Stand", "#1A1A1A", "ctrl"),
    ("pl-flex-coil", "Flex Coil", "#FFE600", "coil"),
]


def product_shape(kind: str, accent: str) -> str:
    a = accent
    shadows = 'filter="url(#soft)"'
    if kind == "keychain":
        return f"""
      <ellipse cx="320" cy="520" rx="140" ry="28" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <rect x="230" y="250" width="180" height="70" rx="16" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <circle cx="255" cy="285" r="14" fill="#F3F3F1" stroke="#0A0A0A" stroke-width="4"/>
        <text x="290" y="295" font-family="Arial Black,sans-serif" font-size="28" fill="#0A0A0A">ANNA</text>
        <path d="M255 240 Q255 200 290 200" fill="none" stroke="#0A0A0A" stroke-width="6" stroke-linecap="round"/>
        <circle cx="290" cy="200" r="10" fill="none" stroke="#0A0A0A" stroke-width="6"/>
      </g>"""
    if kind == "tag":
        return f"""
      <ellipse cx="320" cy="530" rx="150" ry="30" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <rect x="210" y="210" width="220" height="150" rx="22" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <circle cx="250" cy="255" r="16" fill="#F3F3F1" stroke="#0A0A0A" stroke-width="4"/>
        <text x="245" y="320" font-family="Arial Black,sans-serif" font-size="36" fill="#0A0A0A">MIA</text>
        <text x="245" y="345" font-family="Arial,sans-serif" font-size="14" fill="#0A0A0A" opacity="0.6">3D GESCHENKE</text>
      </g>"""
    if kind == "dino":
        return f"""
      <ellipse cx="320" cy="520" rx="160" ry="28" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <path d="M140 360 C180 280 240 260 300 300 C360 250 440 270 500 340 C480 400 400 430 320 420 C250 430 170 400 140 360Z" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <circle cx="460" cy="320" r="22" fill="{a}" stroke="#0A0A0A" stroke-width="4"/>
        <circle cx="468" cy="314" r="5" fill="#0A0A0A"/>
        <path d="M200 380 L180 430 M240 400 L230 450 M300 410 L300 460 M360 400 L370 450 M420 380 L440 430" stroke="#0A0A0A" stroke-width="8" stroke-linecap="round"/>
      </g>"""
    if kind == "clicker":
        return f"""
      <ellipse cx="320" cy="520" rx="120" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <circle cx="320" cy="320" r="110" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <circle cx="320" cy="320" r="48" fill="#FFE600" stroke="#0A0A0A" stroke-width="4"/>
        <circle cx="320" cy="320" r="18" fill="#0A0A0A"/>
      </g>"""
    if kind == "cup":
        return f"""
      <ellipse cx="320" cy="520" rx="130" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <path d="M230 220 L410 220 L390 460 L250 460 Z" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <ellipse cx="320" cy="220" rx="90" ry="24" fill="#fff" stroke="#0A0A0A" stroke-width="4"/>
        <rect x="300" y="260" width="12" height="140" rx="4" fill="#0A0A0A" opacity="0.2"/>
        <rect x="330" y="250" width="10" height="120" rx="4" fill="#FF5A3C" opacity="0.85"/>
        <rect x="275" y="270" width="10" height="110" rx="4" fill="#7B61FF" opacity="0.85"/>
      </g>"""
    if kind == "orbit":
        return f"""
      <ellipse cx="320" cy="510" rx="140" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <ellipse cx="320" cy="320" rx="140" ry="90" fill="none" stroke="{a}" stroke-width="28"/>
        <ellipse cx="320" cy="320" rx="140" ry="90" fill="none" stroke="#0A0A0A" stroke-width="5"/>
        <circle cx="320" cy="320" r="28" fill="#0A0A0A"/>
        <circle cx="200" cy="320" r="14" fill="#fff" stroke="#0A0A0A" stroke-width="3"/>
        <circle cx="440" cy="320" r="14" fill="#fff" stroke="#0A0A0A" stroke-width="3"/>
      </g>"""
    if kind == "phone":
        return f"""
      <ellipse cx="320" cy="520" rx="140" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <path d="M220 460 L420 460 L380 280 L260 280 Z" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <rect x="285" y="200" width="70" height="120" rx="10" fill="#1A1A1A" stroke="#0A0A0A" stroke-width="4" transform="rotate(-8 320 260)"/>
        <rect x="295" y="220" width="50" height="80" rx="4" fill="#4FC3F7" opacity="0.9" transform="rotate(-8 320 260)"/>
      </g>"""
    if kind == "arc":
        return f"""
      <ellipse cx="320" cy="530" rx="180" ry="28" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <path d="M120 430 L120 280 Q320 120 520 280 L520 430" fill="none" stroke="{a}" stroke-width="36" stroke-linecap="round"/>
        <path d="M120 430 L120 280 Q320 120 520 280 L520 430" fill="none" stroke="#0A0A0A" stroke-width="6" stroke-linecap="round"/>
        <ellipse cx="200" cy="250" rx="50" ry="50" fill="#2A2A2A" stroke="#0A0A0A" stroke-width="4"/>
      </g>"""
    if kind == "ridge":
        return f"""
      <ellipse cx="320" cy="480" rx="160" ry="24" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <rect x="140" y="300" width="360" height="70" rx="8" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <text x="170" y="348" font-family="Arial Black,sans-serif" font-size="36" fill="#FFE600" letter-spacing="4">LEO</text>
      </g>"""
    if kind == "frame":
        return f"""
      <ellipse cx="320" cy="530" rx="150" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <rect x="170" y="160" width="300" height="340" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <rect x="200" y="190" width="240" height="280" fill="#1A1A1A"/>
        <rect x="200" y="190" width="240" height="280" fill="url(#glow)" opacity="0.85"/>
        <text x="250" y="340" font-family="Arial,sans-serif" font-size="18" fill="#FFE600" opacity="0.7">PHOTO</text>
      </g>"""
    if kind == "pot":
        return f"""
      <ellipse cx="320" cy="520" rx="130" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <path d="M230 240 L410 240 L380 460 L260 460 Z" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <ellipse cx="320" cy="240" rx="90" ry="22" fill="#C8FF3D" stroke="#0A0A0A" stroke-width="4"/>
        <path d="M300 220 Q280 160 320 140 Q360 160 340 220" fill="#2E7D32" stroke="#0A0A0A" stroke-width="3"/>
        <circle cx="320" cy="200" r="10" fill="#66BB6A"/>
      </g>"""
    if kind == "heart":
        return f"""
      <ellipse cx="320" cy="510" rx="140" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <path d="M320 420 C260 360 180 300 180 250 C180 200 220 180 260 200 C290 214 305 240 320 260 C335 240 350 214 380 200 C420 180 460 200 460 250 C460 300 380 360 320 420Z" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <path d="M250 280 L390 280 L370 380 L270 380 Z" fill="#E04830" stroke="#0A0A0A" stroke-width="3"/>
      </g>"""
    if kind == "cake":
        return f"""
      <ellipse cx="320" cy="520" rx="100" ry="22" fill="#000" opacity="0.1"/>
      <g {shadows}>
        <rect x="308" y="220" width="24" height="260" fill="{a}" stroke="#0A0A0A" stroke-width="4"/>
        <rect x="200" y="180" width="240" height="55" rx="10" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <text x="245" y="218" font-family="Arial Black,sans-serif" font-size="28" fill="#0A0A0A">HAPPY</text>
      </g>"""
    if kind == "ornament":
        return f"""
      <ellipse cx="320" cy="520" rx="110" ry="24" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <rect x="305" y="140" width="30" height="40" fill="#0A0A0A"/>
        <circle cx="320" cy="160" r="12" fill="none" stroke="#0A0A0A" stroke-width="5"/>
        <circle cx="320" cy="320" r="120" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <text x="275" y="335" font-family="Arial Black,sans-serif" font-size="32" fill="#0A0A0A">2026</text>
      </g>"""
    if kind == "pet":
        return f"""
      <ellipse cx="320" cy="500" rx="130" ry="24" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <ellipse cx="320" cy="330" rx="120" ry="95" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <circle cx="250" cy="250" r="36" fill="{a}" stroke="#0A0A0A" stroke-width="4"/>
        <circle cx="390" cy="250" r="36" fill="{a}" stroke="#0A0A0A" stroke-width="4"/>
        <text x="275" y="345" font-family="Arial Black,sans-serif" font-size="28" fill="#fff">REX</text>
        <circle cx="320" cy="200" r="10" fill="none" stroke="#0A0A0A" stroke-width="5"/>
      </g>"""
    if kind == "bookmark":
        return f"""
      <ellipse cx="320" cy="530" rx="80" ry="20" fill="#000" opacity="0.1"/>
      <g {shadows}>
        <path d="M270 120 L370 120 L370 480 L320 430 L270 480 Z" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <text x="288" y="280" font-family="Arial Black,sans-serif" font-size="22" fill="#FFE600" writing-mode="tb">BOOK</text>
      </g>"""
    if kind == "hook":
        return f"""
      <ellipse cx="320" cy="520" rx="100" ry="22" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <polygon points="320,160 400,210 400,320 320,370 240,320 240,210" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <path d="M320 340 Q320 430 360 460" fill="none" stroke="#0A0A0A" stroke-width="16" stroke-linecap="round"/>
      </g>"""
    if kind == "soap":
        return f"""
      <ellipse cx="320" cy="500" rx="160" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <rect x="160" y="280" width="320" height="120" rx="24" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <line x1="200" y1="310" x2="440" y2="370" stroke="#0A0A0A" stroke-width="4" opacity="0.35"/>
        <line x1="200" y1="340" x2="440" y2="400" stroke="#0A0A0A" stroke-width="4" opacity="0.35"/>
        <ellipse cx="320" cy="300" rx="70" ry="28" fill="#fff" opacity="0.7" stroke="#0A0A0A" stroke-width="3"/>
      </g>"""
    if kind == "ctrl":
        return f"""
      <ellipse cx="320" cy="520" rx="150" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <rect x="170" y="300" width="300" height="120" rx="20" fill="{a}" stroke="#0A0A0A" stroke-width="5"/>
        <rect x="230" y="200" width="180" height="110" rx="14" fill="#333" stroke="#0A0A0A" stroke-width="4"/>
        <circle cx="270" cy="250" r="14" fill="#FFE600"/>
        <circle cx="370" cy="250" r="14" fill="#FF5A3C"/>
      </g>"""
    # coil default
    return f"""
      <ellipse cx="320" cy="510" rx="130" ry="26" fill="#000" opacity="0.12"/>
      <g {shadows}>
        <circle cx="320" cy="320" r="120" fill="none" stroke="{a}" stroke-width="42"/>
        <circle cx="320" cy="320" r="120" fill="none" stroke="#0A0A0A" stroke-width="5"/>
        <circle cx="320" cy="320" r="40" fill="#0A0A0A"/>
        <circle cx="320" cy="320" r="18" fill="{a}"/>
      </g>"""


def svg(sku: str, title: str, accent: str, kind: str) -> str:
    return f"""<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 640 640">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FAFAF8"/>
      <stop offset="55%" stop-color="#F3F3F1"/>
      <stop offset="100%" stop-color="#E8E4DA"/>
    </linearGradient>
    <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FFE600" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="#FFE600" stop-opacity="0.55"/>
    </linearGradient>
    <filter id="soft" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#0A0A0A" flood-opacity="0.18"/>
    </filter>
  </defs>
  <rect width="640" height="640" fill="url(#bg)"/>
  <rect x="24" y="24" width="592" height="592" fill="none" stroke="#0A0A0A" stroke-width="4"/>
  <rect x="24" y="24" width="592" height="72" fill="#FFE600" stroke="#0A0A0A" stroke-width="4"/>
  <text x="44" y="70" font-family="Arial Black, Helvetica, sans-serif" font-size="28" fill="#0A0A0A">3D GESCHENKE</text>
  {product_shape(kind, accent)}
  <text x="44" y="600" font-family="Arial Black,sans-serif" font-size="22" fill="#0A0A0A">{title}</text>
</svg>
"""


def main():
    IMG_DIR.mkdir(parents=True, exist_ok=True)
    for sku, title, accent, kind in PRODUCTS:
        path = IMG_DIR / f"{sku}.svg"
        path.write_text(svg(sku, title, accent, kind), encoding="utf-8")
        print("OK", path.name)


if __name__ == "__main__":
    main()
