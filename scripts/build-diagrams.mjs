/**
 * Compile every `.khm` source on the site into SVG, in Node, before the app builds.
 *
 * Runs as `predev` and `prebuild`. Node has the `Worker` the layout engine needs; the
 * Cloudflare runtime the app deploys to does not — rendering at request time inside the
 * worker fails with `_Worker is not a constructor`. Compiling here is also simply better:
 * the visitor gets static SVG and no layout engine in the bundle.
 *
 * Exits non-zero on an unexpected diagnostic. A site that shows a diagram of faulty
 * wiring while claiming to catch faulty wiring is worse than a broken build.
 */

import { compile } from '@love-rox/kumihimo-core';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const sourcesPath = resolve(here, '../src/diagrams.sources.json');
const outPath = resolve(here, '../src/generated/diagrams.json');

/** @type {Record<string, string[]>} */
const sources = JSON.parse(await readFile(sourcesPath, 'utf8'));

const built = {};
let unexpected = 0;

for (const [key, lines] of Object.entries(sources)) {
  const source = lines.join('\n');
  const { svg, diagnostics } = await compile(source, { legend: false });

  built[key] = { source, svg, diagnostics: diagnostics.length };
  console.log(
    `  ${key.padEnd(10)} ${String(svg.length).padStart(6)} bytes  ` +
      (diagnostics.length === 0 ? 'clean' : `${diagnostics.length} diagnostic`),
  );

  for (const d of diagnostics) {
    console.log(`    ${d.severity} [${d.code}] ${d.message}`);
    unexpected += 1;
  }
}

await mkdir(dirname(outPath), { recursive: true });
await writeFile(outPath, `${JSON.stringify(built, null, 2)}\n`, 'utf8');
console.log(`\n${Object.keys(built).length} diagrams → src/generated/diagrams.json`);

if (unexpected > 0) {
  console.error(`\n${unexpected} unexpected diagnostic(s). Fix the source or the claim.`);
  process.exit(1);
}
