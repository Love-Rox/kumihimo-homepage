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
 * A count that does not match the declaration fails the build in both directions. An
 * example that stops being wrong is as much of a problem as one that stops being right,
 * because the prose beside it would go on claiming otherwise.
 */

import { compile } from '@love-rox/kumihimo-core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const sourcesPath = resolve(here, '../src/diagrams.sources.json');
const outPath = resolve(here, '../src/generated/diagrams.json');

/** @type {Record<string, string[] | { lines: string[]; expect?: number }>} */
const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));

const built = {};
let wrong = 0;

for (const [key, entry] of Object.entries(sources)) {
  const lines = Array.isArray(entry) ? entry : entry.lines;
  const expect = Array.isArray(entry) ? 0 : (entry.expect ?? 0);

  const source = lines.join('\n');
  const { svg, diagnostics } = await compile(source, { legend: false });

  built[key] = {
    source,
    svg,
    diagnostics: diagnostics.length,
    messages: diagnostics.map((d) => ({
      severity: d.severity,
      code: d.code,
      message: d.message,
    })),
  };

  const ok = diagnostics.length === expect;
  if (!ok) wrong += 1;

  console.log(
    `  ${key.padEnd(12)} ${String(svg.length).padStart(6)} bytes  ` +
      `${diagnostics.length}/${expect} diagnostic${ok ? '' : '   ← 期待と違う'}`,
  );

  for (const d of diagnostics) {
    console.log(`    ${d.severity} [${d.code}] ${d.message}`);
  }
}

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(built, null, 2)}\n`, 'utf8');
console.log(`\n${Object.keys(built).length} diagrams → src/generated/diagrams.json`);

if (wrong > 0) {
  console.error(`\n${wrong} example(s) did not produce the declared diagnostics.`);
  console.error('Fix the source, or fix the claim the page makes about it.');
  process.exit(1);
}
