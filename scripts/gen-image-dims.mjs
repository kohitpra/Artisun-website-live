/**
 * scripts/gen-image-dims.mjs
 * ─────────────────────────────────────────────────────────────────────────────
 * Writes lib/image-dimensions.json: { "/path/in/public.webp": [width, height] }
 * for every image in public/ that the source code references.
 *
 * components/media/SizedImage + SizedImg read this map to put real
 * width/height attributes on images (fewer layout shifts, and audits stop
 * flagging "image elements do not have explicit width and height").
 *
 * Runs automatically before `next build` (package.json "prebuild").
 * Uses the image-size copy bundled inside Next, so there is no extra
 * dependency. It never fails the build: on any error it keeps the existing
 * JSON and exits 0.
 * ─────────────────────────────────────────────────────────────────────────────
 */
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const OUT = path.join(root, 'lib', 'image-dimensions.json');
const EXT = /\.(png|jpe?g|webp|avif|gif|svg)$/i;
const SRC_DIRS = ['app', 'components', 'lib'];

function walk(dir, filter, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, filter, out);
    else if (filter(p)) out.push(p);
  }
  return out;
}

/** SVG: only trust explicit numeric width/height on the root <svg> (what browsers use). */
function svgSize(file) {
  const head = fs.readFileSync(file, 'utf8').slice(0, 2000);
  const tag = /<svg\b[^>]*>/i.exec(head)?.[0] ?? '';
  const w = /\swidth=["']?([\d.]+)(px)?["'\s>]/i.exec(tag)?.[1];
  const h = /\sheight=["']?([\d.]+)(px)?["'\s>]/i.exec(tag)?.[1];
  return w && h ? [Math.round(+w), Math.round(+h)] : null;
}

try {
  const { imageSize } = require('next/dist/compiled/image-size');

  const source = walk(path.join(root, SRC_DIRS[0]), (p) => /\.(tsx?|jsx?|css)$/.test(p))
    .concat(...SRC_DIRS.slice(1).map((d) => walk(path.join(root, d), (p) => /\.(tsx?|jsx?|css)$/.test(p))))
    .map((f) => fs.readFileSync(f, 'utf8'))
    .join('\n');

  const pub = path.join(root, 'public');
  const map = {};
  for (const file of walk(pub, (p) => EXT.test(p))) {
    const key = '/' + path.relative(pub, file).split(path.sep).join('/');
    // Only images the code actually references (keeps the JSON small).
    if (!source.includes(key) && !source.includes(encodeURI(key))) continue;
    // Commas in a filename break next/image: the optimizer answers 400 and the
    // browser shows a broken-image icon (this happened on /origin and /aura).
    if (key.includes(',')) {
      console.warn(`[image-dims] WARNING: "${key}" has a comma in its name and will not load. Rename it (e.g. use - instead).`);
    }
    try {
      let dims = null;
      if (/\.svg$/i.test(file)) dims = svgSize(file);
      else {
        const s = imageSize(fs.readFileSync(file));
        // EXIF-rotated JPEGs report their stored size; browsers show them rotated.
        const swap = s.orientation && s.orientation >= 5;
        if (s.width && s.height) dims = swap ? [s.height, s.width] : [s.width, s.height];
      }
      if (dims) map[key] = dims;
    } catch {
      /* unreadable file: skip */
    }
  }

  const sorted = Object.fromEntries(Object.keys(map).sort().map((k) => [k, map[k]]));
  fs.writeFileSync(OUT, JSON.stringify(sorted, null, 0) + '\n');
  console.log(`[image-dims] ${Object.keys(sorted).length} images → lib/image-dimensions.json`);
} catch (err) {
  console.warn('[image-dims] skipped, keeping existing lib/image-dimensions.json:', err?.message);
  if (!fs.existsSync(OUT)) fs.writeFileSync(OUT, '{}\n');
}
