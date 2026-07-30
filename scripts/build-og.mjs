/**
 * Draws the social cards.
 *
 * Run by hand, not by `pnpm build`: it shells out to rsvg-convert, which the CI runner
 * does not have. The PNGs are committed, so the site never depends on it being installed.
 *
 *   pnpm og
 *
 * The type is Inter and Hiragino Sans rather than the site's Space Grotesk, because
 * @fontsource ships woff only and neither rsvg-convert nor resvg reads woff. The card is
 * therefore close to the page rather than identical to it.
 */

import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

/** tokens.css, resolved to sRGB — rsvg-convert does not parse oklch. */
const C = {
  bg: '#161b22', // --color-graphite
  panel: '#22272e', // --color-graphite-2
  ink: '#e4e8ed', // --color-graphite-ink
  muted: '#9299a1', // --color-graphite-muted
  rule: '#34383f', // --color-graphite-rule
  accent: '#0076ed', // --color-accent
  vermilion: '#f9601f', // the Rox house colour, as in favicon.svg
};

const SANS = 'Inter, Hiragino Sans, sans-serif';

const CARDS = [
  {
    file: 'og.ja.png',
    // Must match hero.title in src/copy.ts — asserted below.
    headline: '系統図を、テキストで書く。',
    sub: 'ポート単位で結線を書くと、SVG が出ます。',
    size: 74,
  },
  {
    file: 'og.en.png',
    headline: 'Wiring you can write.',
    sub: 'Describe connections port to port and get SVG.',
    size: 78,
  },
];

/**
 * The vignette: two devices, four ports, three cables.
 *
 * Drawn rather than lifted from a compiled diagram, because the real output is dark ink on
 * paper and would have to be recoloured to sit on this background. It is decoration, so it
 * says nothing a reader could act on — the headline carries the claim.
 */
function vignette() {
  const port = (x, y, fill) =>
    `<rect x="${x}" y="${y}" width="12" height="12" rx="3" fill="${fill}"/>`;

  // Sits in the bottom-right, clear of the headline. The panels are opaque, so anything
  // they overlap disappears without a trace — the first draft lost the last three
  // characters of the Japanese headline exactly that way.
  //
  // One cable per port, straight across. The draft routed the first port into the second
  // one's input, which is two sources on one input: the kind of thing this tool exists to
  // catch, drawn on its own social card. There is no room to cross wires legibly in a gap
  // this narrow, so they do not cross.
  return `
  <g transform="translate(812 424)">
    <rect x="0" y="0" width="92" height="132" rx="9" fill="${C.panel}" stroke="${C.rule}" stroke-width="2"/>
    <rect x="216" y="0" width="92" height="132" rx="9" fill="${C.panel}" stroke="${C.rule}" stroke-width="2"/>
    ${port(86, 24, C.accent)}${port(86, 60, C.accent)}${port(86, 96, C.vermilion)}
    ${port(210, 24, C.accent)}${port(210, 60, C.accent)}${port(210, 96, C.vermilion)}
    <g fill="none" stroke-width="3.5" stroke-linecap="round">
      <path d="M98 30 H210" stroke="${C.accent}"/>
      <path d="M98 66 H210" stroke="${C.accent}"/>
      <path d="M98 102 H210" stroke="${C.vermilion}"/>
    </g>
  </g>`;
}

/** The braided mark from public/favicon.svg, scaled up. */
function mark(x, y, size) {
  const k = size / 64;
  return `
  <g transform="translate(${x} ${y}) scale(${k})">
    <rect width="64" height="64" rx="14" fill="${C.vermilion}"/>
    <g fill="none" stroke="#f7f1e7" stroke-width="4.4" stroke-linecap="square">
      <path d="M14 22 L32 40 L50 22"/>
      <path d="M14 42 L32 24 L50 42"/>
    </g>
    <circle cx="32" cy="32" r="3.6" fill="#f7f1e7"/>
  </g>`;
}

function card({ headline, sub, size }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${C.bg}"/>
  <rect x="0" y="0" width="1200" height="6" fill="${C.vermilion}"/>
  ${mark(80, 76, 76)}
  <text x="176" y="132" font-family="${SANS}" font-size="46" font-weight="600" fill="${C.ink}" letter-spacing="-1">kumihimo</text>
  <text x="80" y="298" font-family="${SANS}" font-size="${size}" font-weight="600" fill="${C.ink}" letter-spacing="-2">${headline}</text>
  <text x="80" y="368" font-family="${SANS}" font-size="30" fill="${C.muted}">${sub}</text>
  ${vignette()}
  <text x="80" y="546" font-family="${SANS}" font-size="26" fill="${C.muted}">kumihimo.love-rox.cc</text>
</svg>`;
}

// The headlines are duplicated from copy.ts, which cannot be imported here. Fail loudly
// rather than let the card drift away from the page it advertises.
const copy = readFileSync(join(root, 'src/copy.ts'), 'utf8');
for (const { headline } of CARDS) {
  if (!copy.includes(headline)) {
    throw new Error(`copy.ts に見出しがありません: ${headline}`);
  }
}

const tmp = mkdtempSync(join(tmpdir(), 'kumihimo-og-'));
for (const spec of CARDS) {
  const svg = join(tmp, `${spec.file}.svg`);
  const png = join(root, 'public', spec.file);
  writeFileSync(svg, card(spec));
  execFileSync('rsvg-convert', ['-w', '1200', '-h', '630', '-o', png, svg]);
  console.log(`wrote public/${spec.file}`);
}
