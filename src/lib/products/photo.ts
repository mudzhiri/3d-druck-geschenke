/** Presentable studio SVG product photos (OWN — not scraped from MakerWorld). */

const ACCENTS = [
  "#FFE600",
  "#FF5A3C",
  "#6B2D9B",
  "#C8FF3D",
  "#1F8A7A",
  "#1E4DD8",
  "#0B0B0F",
  "#FF2D8A",
];

function shape(kind: string, accent: string, label: string): string {
  const a = accent;
  const short = label.slice(0, 12).toUpperCase();
  switch (kind) {
    case "keychain":
      return `<ellipse cx="320" cy="520" rx="140" ry="28" fill="#000" opacity="0.12"/>
      <rect x="210" y="250" width="220" height="78" rx="20" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <circle cx="245" cy="289" r="16" fill="#F3F3F1" stroke="#0A0A0A" stroke-width="4"/>
      <text x="275" y="300" font-family="Arial Black,sans-serif" font-size="26" fill="#0A0A0A">${short.slice(0, 6)}</text>
      <circle cx="245" cy="210" r="22" fill="none" stroke="#C0C4CA" stroke-width="10"/>`;
    case "clicker":
      return `<ellipse cx="320" cy="520" rx="120" ry="26" fill="#000" opacity="0.12"/>
      <circle cx="320" cy="310" r="110" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <circle cx="320" cy="310" r="48" fill="#FFE600" stroke="#0A0A0A" stroke-width="4"/>
      <circle cx="320" cy="310" r="18" fill="#0A0A0A"/>`;
    case "cup":
      return `<ellipse cx="320" cy="520" rx="130" ry="26" fill="#000" opacity="0.12"/>
      <path d="M230 220 L410 220 L390 460 L250 460 Z" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <ellipse cx="320" cy="220" rx="90" ry="24" fill="#fff" stroke="#0A0A0A" stroke-width="4"/>
      <text x="250" y="340" font-family="Arial Black,sans-serif" font-size="22" fill="#0A0A0A">${short.slice(0, 5)}</text>`;
    case "phone":
      return `<ellipse cx="320" cy="520" rx="140" ry="26" fill="#000" opacity="0.12"/>
      <path d="M220 460 L420 460 L380 280 L260 280 Z" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <rect x="285" y="200" width="70" height="120" rx="10" fill="#1A1A1A" stroke="#0A0A0A" stroke-width="4"/>`;
    case "dino":
      return `<ellipse cx="320" cy="520" rx="160" ry="28" fill="#000" opacity="0.12"/>
      <path d="M140 360 C180 280 240 260 300 300 C360 250 440 270 500 340 C480 400 400 430 320 420 C250 430 170 400 140 360Z" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <circle cx="460" cy="320" r="22" fill="${a}" stroke="#0A0A0A" stroke-width="4"/>`;
    case "pot":
      return `<ellipse cx="320" cy="510" rx="120" ry="24" fill="#000" opacity="0.12"/>
      <path d="M240 240 L400 240 L380 430 L260 430 Z" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <ellipse cx="320" cy="240" rx="80" ry="18" fill="#C8FF3D" stroke="#0A0A0A" stroke-width="4"/>`;
    case "ornament":
      return `<ellipse cx="320" cy="520" rx="100" ry="22" fill="#000" opacity="0.12"/>
      <circle cx="320" cy="310" r="100" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <text x="265" y="325" font-family="Arial Black,sans-serif" font-size="28" fill="#0A0A0A">${short.slice(0, 4)}</text>
      <rect x="310" y="180" width="20" height="40" fill="#0A0A0A"/>`;
    case "pet":
      return `<ellipse cx="320" cy="510" rx="110" ry="22" fill="#000" opacity="0.12"/>
      <ellipse cx="320" cy="310" rx="120" ry="70" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <text x="270" y="320" font-family="Arial Black,sans-serif" font-size="24" fill="#0A0A0A">${short.slice(0, 5)}</text>`;
    case "bookmark":
      return `<ellipse cx="320" cy="520" rx="90" ry="20" fill="#000" opacity="0.12"/>
      <path d="M260 160 L380 160 L380 480 L320 440 L260 480 Z" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <text x="280" y="280" font-family="Arial Black,sans-serif" font-size="18" fill="#0A0A0A" transform="rotate(90 300 280)">${short.slice(0, 6)}</text>`;
    case "cake":
      return `<ellipse cx="320" cy="500" rx="150" ry="24" fill="#000" opacity="0.1"/>
      <text x="160" y="330" font-family="Brush Script MT,Georgia,serif" font-size="64" fill="${a}" stroke="#0A0A0A" stroke-width="2">${short.slice(0, 8)}</text>`;
    case "hook":
      return `<ellipse cx="320" cy="510" rx="100" ry="20" fill="#000" opacity="0.12"/>
      <path d="M250 200 L390 200 L390 280 Q390 360 320 380 Q250 360 250 280 Z" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <circle cx="320" cy="420" r="18" fill="none" stroke="#0A0A0A" stroke-width="8"/>`;
    case "soap":
      return `<ellipse cx="320" cy="500" rx="130" ry="22" fill="#000" opacity="0.1"/>
      <rect x="200" y="280" width="240" height="100" rx="20" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <circle cx="260" cy="330" r="12" fill="#0A0A0A" opacity="0.25"/>
      <circle cx="320" cy="330" r="12" fill="#0A0A0A" opacity="0.25"/>
      <circle cx="380" cy="330" r="12" fill="#0A0A0A" opacity="0.25"/>`;
    case "orbit":
      return `<ellipse cx="320" cy="510" rx="140" ry="26" fill="#000" opacity="0.12"/>
      <ellipse cx="320" cy="320" rx="140" ry="90" fill="none" stroke="${a}" stroke-width="28"/>
      <ellipse cx="320" cy="320" rx="140" ry="90" fill="none" stroke="#0A0A0A" stroke-width="5"/>
      <circle cx="320" cy="320" r="28" fill="#0A0A0A"/>`;
    case "arc":
      return `<ellipse cx="320" cy="520" rx="140" ry="26" fill="#000" opacity="0.12"/>
      <path d="M200 420 Q320 180 440 420" fill="none" stroke="${a}" stroke-width="36" stroke-linecap="round"/>
      <path d="M200 420 Q320 180 440 420" fill="none" stroke="#0A0A0A" stroke-width="6"/>`;
    case "heart":
      return `<ellipse cx="320" cy="520" rx="120" ry="24" fill="#000" opacity="0.12"/>
      <path d="M320 420 C220 340 220 240 320 280 C420 240 420 340 320 420Z" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>`;
    case "ridge":
      return `<ellipse cx="320" cy="510" rx="150" ry="24" fill="#000" opacity="0.12"/>
      <rect x="160" y="280" width="320" height="70" rx="8" fill="${a}" stroke="#0A0A0A" stroke-width="5"/>
      <text x="200" y="325" font-family="Arial Black,sans-serif" font-size="28" fill="#0A0A0A">${short.slice(0, 8)}</text>`;
    case "coil":
    default:
      return `<ellipse cx="320" cy="510" rx="130" ry="26" fill="#000" opacity="0.12"/>
      <circle cx="320" cy="320" r="120" fill="none" stroke="${a}" stroke-width="42"/>
      <circle cx="320" cy="320" r="120" fill="none" stroke="#0A0A0A" stroke-width="5"/>
      <circle cx="320" cy="320" r="40" fill="#0A0A0A"/>`;
  }
}

export function buildProductSvg(opts: {
  title: string;
  accent?: string;
  photoKind: string;
  dayIndex?: number;
}): string {
  const accent = opts.accent || ACCENTS[(opts.dayIndex ?? 0) % ACCENTS.length]!;
  const body = shape(opts.photoKind, accent, opts.title);
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 640 640" role="img" aria-label="${escapeXml(opts.title)}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#FAFAF8"/>
      <stop offset="55%" stop-color="#F3F3F1"/>
      <stop offset="100%" stop-color="#E8E4DA"/>
    </linearGradient>
  </defs>
  <rect width="640" height="640" fill="url(#bg)"/>
  <rect x="24" y="24" width="592" height="592" fill="none" stroke="#0A0A0A" stroke-width="4"/>
  <rect x="24" y="24" width="592" height="72" fill="#FFE600" stroke="#0A0A0A" stroke-width="4"/>
  <text x="44" y="70" font-family="Arial Black, Helvetica, sans-serif" font-size="28" fill="#0A0A0A">3D GESCHENKE</text>
  ${body}
  <text x="44" y="600" font-family="Arial Black,sans-serif" font-size="20" fill="#0A0A0A">${escapeXml(opts.title.slice(0, 28))}</text>
</svg>`;
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Data-URL usable as product image without filesystem writes. */
export function svgDataUrl(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}
