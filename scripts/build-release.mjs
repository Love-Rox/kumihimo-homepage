/**
 * Record what is actually published, into src/generated/release.json.
 *
 * Runs as `predev` and `prebuild`. The numbers come from the registries themselves rather
 * than from a version written into this repository, because this site is not the thing
 * being released: a hand-kept number here would say "0.4.0 is out" on a day when it was
 * not, and nobody would notice until someone tried to install it.
 *
 * npm is required. If the registry cannot be reached the build fails, because a page
 * quietly missing the version it promises is worse than a build that stops.
 *
 * The Marketplace is optional. It has no documented public API for this, and a homepage
 * deploy failing because Microsoft's gallery endpoint hiccuped would be a bad trade. When
 * it cannot be read the extension's line is left out and the reason is printed.
 */

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '../src/generated/release.json');

/** The package that stands for the set: they are released together, from one changeset. */
const NPM_PACKAGE = '@love-rox/kumihimo-core';
const EXTENSION = 'love-rox.kumihimo-vscode';

/** A date as `YYYY-MM-DD`, in UTC. A release does not belong to the builder's timezone. */
function day(iso) {
  return new Date(iso).toISOString().slice(0, 10);
}

async function fromNpm() {
  const url = `https://registry.npmjs.org/${NPM_PACKAGE.replace('/', '%2f')}`;
  const response = await fetch(url, { headers: { accept: 'application/json' } });
  if (!response.ok) throw new Error(`${url} → ${response.status}`);

  const body = await response.json();
  const version = body['dist-tags']?.latest;
  if (!version) throw new Error(`${NPM_PACKAGE} has no latest dist-tag`);

  const published = body.time?.[version];
  if (!published) throw new Error(`${NPM_PACKAGE}@${version} has no publish time`);

  return { name: NPM_PACKAGE, version, date: day(published) };
}

async function fromMarketplace() {
  const response = await fetch(
    'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery',
    {
      method: 'POST',
      headers: {
        accept: 'application/json;api-version=7.2-preview.1',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        filters: [{ criteria: [{ filterType: 7, value: EXTENSION }], pageSize: 1 }],
        // 1 = include versions, which is where the publish date lives.
        flags: 1,
      }),
    },
  );
  if (!response.ok) throw new Error(`extensionquery → ${response.status}`);

  const body = await response.json();
  const latest = body.results?.[0]?.extensions?.[0]?.versions?.[0];
  if (!latest?.version) throw new Error(`${EXTENSION} was not found`);

  return {
    name: EXTENSION,
    version: latest.version,
    date: day(latest.lastUpdated),
  };
}

const npm = await fromNpm();

let marketplace;
try {
  marketplace = await fromMarketplace();
} catch (error) {
  console.warn(`Marketplace を読めませんでした（拡張の行は省略します）: ${String(error)}`);
}

const release = marketplace ? { npm, marketplace } : { npm };

mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, `${JSON.stringify(release, null, 2)}\n`);

console.log(
  `${npm.name}@${npm.version} (${npm.date})` +
    (marketplace ? ` · ${marketplace.name}@${marketplace.version} (${marketplace.date})` : ''),
);
