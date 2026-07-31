import type { ReactNode } from 'react';

import type { Lang } from '../copy';
import { Diagram } from './Diagram';
import { Footer } from './Footer';
import { Nav } from './Nav';
import type { Block, Docs as DocsContent } from '../docs';
import built from '../generated/diagrams.json';

type Key = keyof typeof built;

/**
 * Resolve a diagram name against what was actually compiled.
 *
 * A name that no longer exists in `diagrams.sources.json` should stop the build, not
 * render an empty box. Static generation runs this, so a typo fails `pnpm build`.
 */
function key(name: string): Key {
  if (!(name in built)) {
    throw new Error(`diagrams.sources.json に "${name}" がありません`);
  }
  return name as Key;
}

/**
 * `code` and **bold** inside a sentence.
 *
 * Deliberately not a Markdown parser and deliberately not `dangerouslySetInnerHTML`: the
 * prose needs exactly these two, and returning nodes means no string of text can ever be
 * read as markup.
 */
function code(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: split output is positional
      <code className="tok" key={i}>
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

/**
 * Bold first, then code inside it — a sentence that emphasises a claim about `gap` needs
 * both at once, and splitting on either alone leaves the other's backticks on the page.
 */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: split output is positional
      <strong key={i}>{code(part.slice(2, -2))}</strong>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: split output is positional
      <span key={i}>{code(part)}</span>
    ),
  );
}

function Diagnostics({ name }: { name: string }) {
  const entry = built[key(name)];

  return (
    <ul className="diaglist">
      {entry.messages.map((m) => (
        <li className="diaglist__item" key={`${m.code}:${m.message}`}>
          <span className="chip">{m.severity}</span>
          <code className="tok">{m.code}</code>
          <span className="diaglist__msg">{m.message}</span>
        </li>
      ))}
    </ul>
  );
}

function Piece({ block }: { block: Block }) {
  switch (block.kind) {
    case 'p':
      return <p className="prose">{inline(block.text)}</p>;

    case 'note':
      return <p className="note">{inline(block.text)}</p>;

    case 'code':
      return (
        <div className="slab">
          <div className="slab__label">
            <span className="mono">{block.filename}</span>
          </div>
          <pre className="code">
            <code>{block.lines.join('\n')}</code>
          </pre>
        </div>
      );

    case 'diagram':
      return <Diagram name={key(block.name)} filename={block.filename} layout="row" />;

    case 'diagnostics':
      return <Diagnostics name={block.name} />;

    case 'table':
      return (
        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h}>{inline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
                    <td key={i}>{inline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export function Docs({ t, lang }: { t: DocsContent; lang: Lang }) {
  // The counterpart page, not the other language's front door: landing on a home page
  // after a language switch and having to find the section again costs more than the
  // switch saves. The nav and the footer switch to the same place.
  const otherHref = `/${lang === 'en' ? 'ja' : 'en'}/docs`;

  return (
    <>
      <Nav lang={lang} otherHref={otherHref} />

      <main className="shell docs">
        <header className="docs__head">
          <p className="mono eyebrow">{t.eyebrow}</p>
          <h1 className="docs__title">{t.heading}</h1>
          <p className="docs__lede">{t.lede}</p>
          <div className="docs__links">
            <a className="btn" href={t.specHref} rel="noreferrer noopener" target="_blank">
              {t.specLabel}
            </a>
          </div>
        </header>

        <nav aria-label={t.tocLabel} className="toc">
          <p className="mono eyebrow">{t.tocLabel}</p>
          <ol className="toc__list">
            {t.sections.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`}>
                  <span className="toc__n mono">{String(i + 1).padStart(2, '0')}</span>
                  {s.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {t.sections.map((s, i) => (
          <section className="docs__section" id={s.id} key={s.id}>
            <h2 className="docs__h2">
              <span className="toc__n mono">{String(i + 1).padStart(2, '0')}</span>
              {s.title}
            </h2>
            {s.blocks.map((block, j) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: blocks are an ordered script
              <Piece block={block} key={j} />
            ))}
          </section>
        ))}
      </main>

      <Footer lang={lang} otherHref={otherHref} />
    </>
  );
}
