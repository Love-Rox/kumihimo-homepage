/**
 * Collect the licence notices of everything this site ships, into public/third-party-notices.txt.
 *
 * Runs as `predev` and `prebuild`, and fails when a licence text cannot be found, so the
 * notice cannot quietly go stale or lose an entry as dependencies move.
 *
 * The reason this exists: the editor's chunk carries elkjs, which is EPL-2.0, and
 * minification strips every notice out of it. Distributing the built bundle without saying
 * so anywhere is the part that is not allowed — not the use of the library.
 *
 * Only what reaches a visitor is listed. Build and deploy tooling is not distributed and
 * has no notice obligation, so wrangler and the rest are deliberately absent.
 */

import { createRequire } from 'node:module';
import { existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const require = createRequire(join(here, '../package.json'));

/**
 * What ships, and why each entry is here.
 *
 * `from` names the package to resolve it through, for anything this project does not
 * depend on directly — elkjs arrives via the layout engine, not from here.
 */
const SHIPPED = [
  { name: 'elkjs', why: 'レイアウトエンジン / layout engine', from: '@love-rox/kumihimo-core' },
  { name: 'react', why: 'UI ランタイム / UI runtime' },
  { name: 'react-dom', why: 'UI ランタイム / UI runtime' },
  { name: 'react-server-dom-webpack', why: 'RSC ランタイム / RSC runtime' },
  { name: 'waku', why: 'フレームワーク / framework' },
  { name: '@fontsource/inter', why: '本文書体 / body typeface' },
  { name: '@fontsource/space-grotesk', why: '見出し書体 / display typeface' },
  { name: '@fontsource/jetbrains-mono', why: '等幅書体 / monospace typeface' },
  { name: '@love-rox/kumihimo-core', why: 'コンパイラ / compiler' },
  { name: '@love-rox/kumihimo-editor', why: 'ライブエディタ / live editor' },
];

const LICENCE_FILES = ['LICENSE', 'LICENSE.md', 'LICENSE.txt', 'LICENCE', 'LICENCE.md'];

/**
 * The directory a package was installed into.
 *
 * Found by walking the resolver's own search paths rather than by resolving
 * `<name>/package.json`, which several of these packages block through `exports` — the
 * manifest is not theirs to publish, but it is exactly what a notice needs.
 */
function packageDir(name, from) {
  const req = from ? createRequire(packageEntry(from)) : require;
  for (const base of req.resolve.paths(name) ?? []) {
    const candidate = join(base, name);
    if (existsSync(join(candidate, 'package.json'))) return candidate;
  }
  throw new Error(`${name} をどの node_modules にも見つけられません`);
}

/**
 * Any real file inside a package, to hang a child resolver off.
 *
 * Through `realpathSync`, because pnpm links a dependency into place and a resolver
 * started at the link walks the linking project's node_modules, not the linked package's —
 * where a transitive dependency such as elkjs actually lives.
 */
function packageEntry(name) {
  return realpathSync(join(packageDir(name), 'package.json'));
}

function read(dir) {
  for (const file of LICENCE_FILES) {
    try {
      return readFileSync(join(dir, file), 'utf8').trimEnd();
    } catch {
      // Try the next spelling.
    }
  }
  return undefined;
}

const collected = [];
let missing = 0;

for (const entry of SHIPPED) {
  const dir = packageDir(entry.name, entry.from);
  const meta = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8'));
  const text = read(dir);

  if (text === undefined) {
    console.error(`${entry.name}: ライセンス本文が見つかりません (${dir})`);
    missing += 1;
    continue;
  }

  collected.push({
    name: meta.name,
    version: meta.version,
    why: entry.why,
    spdx: meta.license ?? '(package.json に記載なし)',
    homepage: meta.homepage ?? null,
    text,
  });
}

if (missing > 0) {
  console.error(`\n${missing} 件のライセンス本文を取得できませんでした。`);
  process.exit(1);
}

const parts = collected.map((c) =>
  [
    '='.repeat(78),
    `${c.name} ${c.version}`,
    c.why,
    `SPDX: ${c.spdx}`,
    c.homepage ? `Home: ${c.homepage}` : undefined,
    '='.repeat(78),
    '',
    c.text,
  ]
    .filter((line) => line !== undefined)
    .join('\n'),
);

const header = `kumihimo.love-rox.cc — 第三者ライセンス表記 / Third-party notices

このサイトが配信するものに含まれる第三者コンポーネントの一覧です。ビルド時に、実際に
インストールされているパッケージから生成しています。

Components distributed as part of this site. Generated at build time from the packages
actually installed, so this file cannot fall out of step with them.

kumihimo itself is MIT. See https://github.com/Love-Rox/kumihimo

注意 / Note: elkjs is available under EPL-2.0 or GPL-3.0-or-later, at your option. This
site distributes it under the EPL-2.0. Its source is at https://github.com/kieler/elkjs

`;

// Two forms of the same facts. The page renders the structured one; the text file is what
// someone can save, diff or attach to a procurement question without running the site.
writeFileSync(
  resolve(here, '../public/third-party-notices.txt'),
  `${header}${parts.join('\n\n')}\n`,
  'utf8',
);

const json = resolve(here, '../src/generated/notices.json');
mkdirSync(dirname(json), { recursive: true });
writeFileSync(json, `${JSON.stringify(collected, null, 2)}\n`, 'utf8');

console.log(
  `${collected.length} components → public/third-party-notices.txt, src/generated/notices.json`,
);
