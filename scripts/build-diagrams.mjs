/**
 * Compile every `.khm` source on the site into SVG, in Node, before the app builds.
 *
 * Runs as `predev` and `prebuild`. Node has the `Worker` the layout engine needs; the
 * Cloudflare runtime the app deploys to does not — rendering at request time inside the
 * worker fails with `_Worker is not a constructor`. Compiling here is also simply better:
 * the visitor gets static SVG and no layout engine in the bundle.
 *
 * An entry is either an array of lines, or `{ lines, expect }` where `expect` is how many
 * diagnostics the example is supposed to produce. The docs need the second form: a page
 * explaining what the compiler catches has to show wiring it actually catches, and quoting
 * the real output beats paraphrasing it.
 *
 * Each example is built once per language. The picture carries three things that have a
 * language — the names drawn on the boxes, the legend, and the diagnostics quoted beside it
 * — and a Japanese page showing an English diagram is the same failure as an untranslated
 * caption. The wiring is written once and only the quoted names are swapped, through
 * `diagrams.glossary.json`, so the two languages cannot come to demonstrate different things.
 *
 * A count that does not match the declaration fails the build in both directions. An
 * example that stops being wrong is as much of a problem as one that stops being right,
 * because the prose beside it would go on claiming otherwise.
 *
 * The schedules are computed here too. Much of what the language decides is invisible in
 * the drawing and shows up only in the lists somebody packs a van from — whether a moulded
 * tail counts as a cable, whether a part appears once or twice. A page arguing about that
 * has to print the real table, or it is arguing about nothing the reader can check.
 */

import {
  LOCALES,
  adapterSchedule,
  buildModel,
  cableSchedule,
  compile,
  equipmentSchedule,
  parse,
  wirelessSchedule,
} from '@love-rox/kumihimo-core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const sourcesPath = resolve(here, '../src/diagrams.sources.json');
const glossaryPath = resolve(here, '../src/diagrams.glossary.json');
const outPath = resolve(here, '../src/generated/diagrams.json');

/** @type {Record<string, string[] | { lines: string[]; expect?: number }>} */
const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));

/** @type {Record<string, string>} */
const glossary = JSON.parse(await readFile(glossaryPath, 'utf8'));

/**
 * The same source with its display names in the given language.
 *
 * Only the contents of quoted strings are touched, and only whole ones. A name is a label
 * the compiler carries through to the drawing; substituting anywhere else would edit the
 * wiring, which is the one thing that has to stay identical between the two.
 *
 * @param {string} source - The source as written.
 * @param {string} locale - Language to draw it in.
 * @returns {string} The source to compile.
 */
function inLocale(source, locale) {
  if (locale === 'ja') return source;
  return (
    source
      .replace(/"([^"]*)"/g, (whole, name) => (name in glossary ? `"${glossary[name]}"` : whole))
      // A jacket colour is a keyword, not a label, so it sits outside the quotes. kumihimo
      // takes both spellings; the example should show the one its reader would type.
      .replace(/\[color=([^\]]+)\]/g, (whole, name) =>
        name in glossary ? `[color=${glossary[name]}]` : whole,
      )
  );
}

/** Names in the glossary that no example uses. Left in, they rot unnoticed. */
const usedNames = new Set();

const built = {};
let wrong = 0;

for (const [key, entry] of Object.entries(sources)) {
  const lines = Array.isArray(entry) ? entry : entry.lines;
  const expect = Array.isArray(entry) ? 0 : (entry.expect ?? 0);

  const written = lines.join('\n');
  // Both places a glossary entry can be used, so the unused check below sees what
  // `inLocale` sees. Counting only the quoted half would report a colour as dead.
  for (const pattern of [/"([^"]*)"/g, /\[color=([^\]]+)\]/g]) {
    for (const name of written.matchAll(pattern)) {
      if (name[1] in glossary) usedNames.add(name[1]);
    }
  }

  built[key] = {};

  for (const locale of LOCALES) {
    const source = inLocale(written, locale);
    const { svg, diagnostics } = await compile(source, { legend: false, locale });

    // The same source again, through the model rather than the renderer. `compile` returns
    // a picture; the schedules need the resolved diagram, and building it twice is cheaper
    // than widening `compile`'s return for one caller.
    const { diagram } = buildModel(parse(source, { locale }).document, { locale });

    built[key][locale] = {
      source,
      svg,
      diagnostics: diagnostics.length,
      messages: diagnostics.map((d) => ({
        severity: d.severity,
        code: d.code,
        message: d.message,
      })),
      schedules: {
        cable: cableSchedule(diagram, locale).map((r) => ({
          label: r.label ?? '',
          from: r.fromDevice,
          to: r.toDevice,
          signal: r.signalLabel || r.signal,
          // A radio path is measured in channels, not metres, so the column that would
          // hold a length holds the frequency instead. Both are empty when neither is
          // written, which is a different thing from `?m` and has to look different.
          length: r.length ?? '',
          connectors: r.connectors.join(' / '),
          note: r.note ?? '',
        })),
        // Radio paths are their own sheet. Nothing here is coiled; what it needs is a
        // frequency somebody has to co-ordinate, which is a different job.
        wireless: wirelessSchedule(diagram, locale).map((r) => ({
          label: r.label ?? '',
          from: r.fromDevice,
          to: r.toDevice,
          signal: r.signalLabel || r.signal,
          carrier: r.carrierLabel ?? '',
          frequency: r.frequency ?? '',
        })),
        adapter: adapterSchedule(diagram, locale).map((r) => ({
          adapter: r.adapter,
          count: r.count,
          links: r.links.join(' / '),
        })),
        equipment: equipmentSchedule(diagram).map((r) => ({
          device: r.label,
          kind: r.kind,
          group: r.group ?? '',
          ports: r.ports,
        })),
      },
    };

    // The diagnostics are a property of the wiring, so the count must not depend on the
    // language. If it does, a substitution has changed something it should not have.
    const ok = diagnostics.length === expect;
    if (!ok) wrong += 1;

    console.log(
      `  ${key.padEnd(12)} ${locale}  ${String(svg.length).padStart(6)} bytes  ` +
        `${diagnostics.length}/${expect} diagnostic${ok ? '' : '   ← 期待と違う'}`,
    );

    for (const d of diagnostics) {
      console.log(`    ${d.severity} [${d.code}] ${d.message}`);
    }
  }
}

const unused = Object.keys(glossary).filter((k) => !k.startsWith('_') && !usedNames.has(k));
if (unused.length > 0) {
  console.error(`\n用語集に使われていない語があります: ${unused.join(' / ')}`);
  console.error('図から消えたのなら、用語集からも消してください。');
  process.exit(1);
}

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(built, null, 2)}\n`, 'utf8');
console.log(`\n${Object.keys(built).length} diagrams → src/generated/diagrams.json`);

if (wrong > 0) {
  console.error(`\n${wrong} example(s) did not produce the declared diagnostics.`);
  console.error('Fix the source, or fix the claim the page makes about it.');
  process.exit(1);
}
