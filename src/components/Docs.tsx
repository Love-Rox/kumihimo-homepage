import type { Lang } from '../copy';
import type { Docs as DocsContent } from '../docs';
import { Piece } from './Blocks';
import { Footer } from './Footer';
import { Nav } from './Nav';

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
