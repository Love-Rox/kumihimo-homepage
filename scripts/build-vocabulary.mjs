/**
 * Read the language's fixed vocabulary out of the compiler, into src/generated/vocabulary.json.
 *
 * Runs as `predev` and `prebuild`. Hand-writing these lists would be writing the same thing
 * twice and letting the copy rot: a signal type added to the language would go on being
 * absent from the page that claims to list them. The extension's completions are read from
 * the same exports for the same reason.
 *
 * The version listed is whatever the site has installed, which is the published one — so
 * the page describes what a reader would actually get, not what is on a branch somewhere.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  BUILTIN_SIGNALS,
  CABLE_COLORS,
  DEVICE_KINDS,
  LENGTH_UNITS,
  THEMES,
  localise,
} from '@love-rox/kumihimo-core';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../src/generated/vocabulary.json');

/** Category order, so related signals sit together rather than in alphabetical rubble. */
const CATEGORIES = ['video', 'audio', 'control', 'network', 'power', 'sync', 'generic'];

const signals = Object.entries(BUILTIN_SIGNALS)
  .map(([name, signal]) => ({
    name,
    category: signal.category,
    label: { en: localise(signal.label, 'en'), ja: localise(signal.label, 'ja') },
    connectors: signal.connectors,
    wireless: signal.wireless === true,
  }))
  .toSorted(
    (a, b) =>
      CATEGORIES.indexOf(a.category) - CATEGORIES.indexOf(b.category) ||
      a.name.localeCompare(b.name),
  );

// Colours are bilingual keywords pointing at the same swatch, so they are grouped by what
// they resolve to rather than listed twice.
const byHex = new Map();
for (const [name, hex] of Object.entries(CABLE_COLORS)) {
  const entry = byHex.get(hex) ?? { hex, names: [] };
  entry.names.push(name);
  byHex.set(hex, entry);
}

const vocabulary = {
  signals,
  kinds: [...DEVICE_KINDS],
  colours: [...byHex.values()],
  units: [...LENGTH_UNITS],
  themes: Object.keys(THEMES),
};

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(vocabulary, null, 2)}\n`);

console.log(
  `${signals.length} signal types · ${vocabulary.kinds.length} device kinds · ` +
    `${vocabulary.colours.length} colours · ${vocabulary.units.length} units · ` +
    `${vocabulary.themes.length} themes → src/generated/vocabulary.json`,
);
