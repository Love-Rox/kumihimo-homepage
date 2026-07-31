import type { Lang } from '../copy';
import { COPY } from '../copy';
import { RELEASE } from '../release';

/**
 * Ft2 · one inline line, shared by every page.
 *
 * Shared rather than duplicated so the version, the licence and the language switch cannot
 * say different things depending on which page a reader happens to be on.
 */
export function Footer({
  lang,
  otherHref,
}: {
  lang: Lang;
  /** Where the language switch goes. Defaults to the other language's landing page. */
  otherHref?: string;
}) {
  const t = COPY[lang];

  return (
    <footer className="foot">
      <div className="shell foot__line">
        <a className="mono" href="https://github.com/Love-Rox/kumihimo/releases">
          kumihimo {RELEASE.npm.version} · {RELEASE.npm.date}
        </a>
        <a className="mono" href={`/${lang}/licenses`}>
          MIT
        </a>
        <a className="mono" href={`/${lang}/docs`}>
          {t.nav.docs}
        </a>
        <a className="mono" href="https://github.com/Love-Rox/kumihimo">
          GitHub
        </a>
        <a className="mono" href="https://www.npmjs.com/package/@love-rox/kumihimo-core">
          npm
        </a>
        <a
          className="mono"
          href={`https://github.com/Love-Rox/kumihimo/blob/main/docs/SPEC${lang === 'ja' ? '.ja' : ''}.md`}
        >
          {t.footerSpec}
        </a>
        <a className="mono" href={otherHref ?? t.otherLangHref}>
          {t.otherLangLabel}
        </a>
      </div>
    </footer>
  );
}
