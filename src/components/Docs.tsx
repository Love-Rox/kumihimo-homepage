import type { ReactNode } from 'react';

import type { Lang } from '../copy';
import { Diagram } from './Diagram';
import { Footer } from './Footer';
import { Nav } from './Nav';
import type { Block, Docs as DocsContent } from '../docs';
import built from '../generated/diagrams.json';
import { VOCABULARY, categories, signalsOf } from '../vocabulary';

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

function Diagnostics({ name, lang }: { name: string; lang: Lang }) {
  const entry = built[key(name)][lang];

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

/** Names in the category, in the order the compiler lists them. */
const CATEGORY_NAMES: Record<string, Record<Lang, string>> = {
  video: { ja: '映像', en: 'Video' },
  audio: { ja: '音声', en: 'Audio' },
  control: { ja: '制御', en: 'Control' },
  network: { ja: 'ネットワーク', en: 'Network' },
  power: { ja: '電源', en: 'Power' },
  sync: { ja: '同期', en: 'Sync' },
  generic: { ja: '汎用', en: 'Generic' },
};

/**
 * The accepted words for one kind of thing.
 *
 * Every one of these comes from the published package, so the page cannot claim a word the
 * compiler would reject, or omit one it accepts.
 */
function Vocabulary({ of, lang }: { of: string; lang: Lang }) {
  const ja = lang === 'ja';

  if (of === 'signals') {
    return (
      <div className="vocab">
        {categories().map((category) => (
          <div className="vocab__group" key={category}>
            <h4>{CATEGORY_NAMES[category]?.[lang] ?? category}</h4>
            <div className="vocab__grid">
              {signalsOf(category).map((signal) => (
                <div className="vocab__item" key={signal.name}>
                  <code className="tok">{signal.name}</code>
                  <span className="vocab__what">{signal.label[lang]}</span>
                  {/* A radio path has no connector, and saying so teaches more than an
                      empty line does. The wireless flag itself is not printed: every
                      wireless label already says it. */}
                  <span className="vocab__conn">
                    {signal.wireless
                      ? ja
                        ? 'コネクタなし'
                        : 'no connector'
                      : signal.connectors.join(' / ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (of === 'colours') {
    return (
      <div className="vocab__grid vocab__grid--wide">
        {VOCABULARY.colours.map((colour) => (
          <div className="vocab__item" key={colour.hex}>
            <span className="vocab__swatch" style={{ background: colour.hex }} />
            <span className="vocab__names">
              {colour.names.map((name) => (
                <code className="tok" key={name}>
                  {name}
                </code>
              ))}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const words =
    of === 'kinds' ? VOCABULARY.kinds : of === 'units' ? VOCABULARY.units : VOCABULARY.themes;

  return (
    <div className="vocab__words">
      {words.map((word) => (
        <code className="tok" key={word}>
          {word}
        </code>
      ))}
    </div>
  );
}

function Piece({ block, lang }: { block: Block; lang: Lang }) {
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
      return <Diagram name={key(block.name)} filename={block.filename} lang={lang} layout="row" />;

    case 'diagnostics':
      return <Diagnostics name={block.name} lang={lang} />;

    case 'vocabulary':
      return <Vocabulary of={block.of} lang={lang} />;
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
              <Piece block={block} lang={lang} key={j} />
            ))}
          </section>
        ))}
      </main>

      <Footer lang={lang} otherHref={otherHref} />
    </>
  );
}
