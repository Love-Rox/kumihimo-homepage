# kumihimo-homepage

Product site for [kumihimo](https://github.com/Love-Rox/kumihimo) — AV signal flow diagrams
(系統図) written as text.

`/ja` and `/en` are siblings under one `[lang]` segment, so neither language is the other's
afterthought.

## Stack

Waku · React 19 RSC · Tailwind v4 · Cloudflare Workers.

## Development

```bash
pnpm install
pnpm dev        # runs `diagrams` first, then waku dev
pnpm build
pnpm deploy
```

## How the diagrams get there

Every `.khm` example lives in [`src/diagrams.sources.json`](src/diagrams.sources.json).
`scripts/build-diagrams.mjs` compiles each one with the published
`@love-rox/kumihimo-core` and writes `src/generated/diagrams.json`, which the page imports.

This runs in **Node, at build time**, for two reasons:

- The layout engine spawns a Web Worker, and the Cloudflare runtime has no `Worker`
  constructor — rendering at request time fails with `_Worker is not a constructor`.
- The visitor gets static SVG and no layout engine in the bundle. The only hydrated island
  on the page is the live editor, far below the fold.

The script **exits non-zero on any unexpected diagnostic**. A site claiming to catch faulty
wiring must not quietly ship a picture of faulty wiring.

## Design

Built with the Hallmark discipline: genre modern-minimal, macrostructure Component
Playground, theme Cobalt, nav N13 (inline ⌘K), footer Ft2. Tokens live in
[`tokens.css`](tokens.css); nothing in the stylesheet inlines a colour or a font stack.

The mark ([`design/mark.svg`](design/mark.svg)) is 角八つ組 — the cross-section of a braided
cord — in the Rox house vermilion. It is the one thing on the page that is not Cobalt,
because it identifies the publisher rather than the product.

## License

MIT © SASAGAWA Kiyoshi
