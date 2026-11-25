// Erzeugt die App-Symbole als PNG (ohne Zusatzpakete). Aufruf: npm run icons
// Motiv: weißer Gewichtsstapel (Steckgewichte einer Maschine) mit orangem Steckbolzen auf Blau.
import { writeFileSync, mkdirSync } from 'node:fs';
import { deflateSync } from 'node:zlib';

const BG = [0x1f, 0x4f, 0xd1];
const FG = [0xff, 0xff, 0xff];
const PIN = [0xff, 0x8a, 0x3d];

const rrect = (x, y, x0, y0, x1, y1, r) => {
  const cx = Math.max(x0 + r, Math.min(x, x1 - r));
  const cy = Math.max(y0 + r, Math.min(y, y1 - r));
  return Math.hypot(x - cx, y - cy) <= r && x >= x0 && x <= x1 && y >= y0 && y <= y1;
};
// Farbe an (x, y) im 512er-Raster, null = Hintergrund
function farbe(x, y) {
  // Steckbolzen rechts (über die Platten hinaus)
  if (rrect(x, y, 318, 286, 420, 306, 10)) return PIN;
  if (Math.hypot(x - 420, y - 296) <= 22) return PIN;
  // Führungsstange
  if (x >= 244 && x <= 268 && y >= 70 && y <= 140) return FG;
  // 5 Platten
  for (let i = 0; i < 5; i++) {
    const y0 = 140 + i * 60;
    if (rrect(x, y, 116, y0, 396, y0 + 46, 14)) return FG;
  }
  return null;
}
function crc32(buf) {
  let c, crc = 0xffffffff;
  for (let n = 0; n < buf.length; n++) {
    c = (crc ^ buf[n]) & 0xff;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    crc = (crc >>> 8) ^ c;
  }
  return (crc ^ 0xffffffff) >>> 0;
}
const chunk = (type, data) => {
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type), data]);
  const crc = Buffer.alloc(4); crc.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, crc]);
};

function png(size, padding = 0) {
  const SS = 3; // Kantenglättung
  const raw = Buffer.alloc((size * 3 + 1) * size);
  const scale = (512 + 2 * padding) / size;
  for (let py = 0; py < size; py++) {
    raw[py * (size * 3 + 1)] = 0;
    for (let px = 0; px < size; px++) {
      let r = 0, g = 0, b = 0;
      for (let sy = 0; sy < SS; sy++) for (let sx = 0; sx < SS; sx++) {
        const x = (px + (sx + 0.5) / SS) * scale - padding;
        const y = (py + (sy + 0.5) / SS) * scale - padding;
        const f = farbe(x, y) || BG;
        r += f[0]; g += f[1]; b += f[2];
      }
      const o = py * (size * 3 + 1) + 1 + px * 3;
      raw[o] = r / (SS * SS); raw[o + 1] = g / (SS * SS); raw[o + 2] = b / (SS * SS);
    }
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0); ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; ihdr[9] = 2;
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw, { level: 9 })), chunk('IEND', Buffer.alloc(0)),
  ]);
}

const dir = new URL('../docs/icons/', import.meta.url);
mkdirSync(dir, { recursive: true });
writeFileSync(new URL('apple-touch-icon.png', dir), png(180, 20));
writeFileSync(new URL('icon-192.png', dir), png(192, 20));
writeFileSync(new URL('icon-512.png', dir), png(512, 40));
writeFileSync(new URL('icon-maskable-512.png', dir), png(512, 110)); // mit Rand für Android-Formen
console.log('Symbole erstellt in docs/icons/');
