import type { Lang } from '../copy';
import type { Examples as ExamplesContent } from '../examples';
import { Piece, inline } from './Blocks';
import { Footer } from './Footer';
import { Nav } from './Nav';

/**
 * The recipe page.
 *
 * Shares its shell with the guide on purpose — same nav, same slabs, same tables — because
 * these are two ways into one language, not two products. What differs is the unit: the
 * guide has sections that build on each other, this has entries that each stand alone and
 * start from a situation rather than from a keyword. Hence the one-line `gist` under every
 * heading: someone scanning for their own problem should be able to skip an entry without
 * reading its code.
 */
export function Examples({ t, lang }: { t: ExamplesContent; lang: Lang }) {
  // The counterpart page, not the other language's front door — same reasoning as the
  // guide. Landing on a home page after a language switch costs more than the switch saves.
  const otherHref = `/${lang === 'en' ? 'ja' : 'en'}/examples`;

  return (
    <>
      <Nav lang={lang} otherHref={otherHref} />

      <main className="shell docs">
        <header className="docs__head">
          <p className="mono eyebrow">{t.eyebrow}</p>
          <h1 className="docs__title">{t.heading}</h1>
          <p className="docs__lede">{t.lede}</p>
          <div className="docs__links">
            <a className="btn" href={`/${lang}/docs`}>
              {t.docsLabel}
            </a>
          </div>
        </header>

        <nav aria-label={t.tocLabel} className="toc">
          <p className="mono eyebrow">{t.tocLabel}</p>
          <ol className="toc__list">
            {t.recipes.map((r, i) => (
              <li key={r.id}>
                <a href={`#${r.id}`}>
                  <span className="toc__n mono">{String(i + 1).padStart(2, '0')}</span>
                  {r.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {t.recipes.map((r, i) => (
          <section className="docs__section" id={r.id} key={r.id}>
            <h2 className="docs__h2">
              <span className="toc__n mono">{String(i + 1).padStart(2, '0')}</span>
              {r.title}
            </h2>
            <p className="recipe__gist">{inline(r.gist)}</p>
            {r.blocks.map((block, j) => (
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
