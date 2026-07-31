import type { ReactNode } from 'react';

import type { Lang } from '../copy';
import { Footer } from './Footer';
import type { Legal as LegalContent } from '../legal';
import { Nav } from './Nav';
import generated from '../generated/notices.json';

interface Notice {
  name: string;
  version: string;
  why: string;
  spdx: string;
  homepage: string | null;
  text: string;
}

/**
 * Assigned to a declared type rather than left to inference.
 *
 * The file is generated and not committed, so its inferred shape is whatever the last
 * build happened to produce. Naming the shape means a change in the generator fails here,
 * rather than quietly handing this component `any`.
 */
const notices: Notice[] = generated;

/**
 * `code`, **bold** and [links](…) inside a sentence.
 *
 * The same two rules the docs use, plus links, because a notice that names a source has to
 * be able to point at it. Nodes rather than markup, so no licence text can be read as HTML.
 */
function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g).map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      // biome-ignore lint/suspicious/noArrayIndexKey: split output is positional
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
    if (link) {
      return (
        // biome-ignore lint/suspicious/noArrayIndexKey: split output is positional
        <a href={link[2]} key={i} rel="noreferrer noopener" target="_blank">
          {link[1]}
        </a>
      );
    }
    return part;
  });
}

/**
 * The notices page.
 *
 * Every licence text is shown in full rather than summarised. A summary of a licence is
 * not the licence, and the whole point of the page is to be the thing a reader can check.
 */
export function Legal({ t, lang }: { t: LegalContent; lang: Lang }) {
  const other = `/${lang === 'en' ? 'ja' : 'en'}/licenses`;

  return (
    <>
      <Nav lang={lang} otherHref={other} />

      <main className="shell docs">
        <header className="docs__head">
          <p className="mono eyebrow">{t.eyebrow}</p>
          <h1 className="docs__title">{t.heading}</h1>
          <p className="docs__lede">{t.lede}</p>
          <p className="prose">{t.ownLicence}</p>
          <div className="docs__links">
            <a className="btn" href="/third-party-notices.txt">
              {t.downloadLabel}
            </a>
          </div>
        </header>

        <section className="docs__section">
          <h2 className="docs__h2">{t.noteHeading}</h2>
          <p className="note">{inline(t.note)}</p>
        </section>

        <section className="docs__section">
          <div className="tablewrap">
            <table className="table">
              <thead>
                <tr>
                  <th>{t.columns.component}</th>
                  <th>{t.columns.role}</th>
                  <th>{t.columns.licence}</th>
                </tr>
              </thead>
              <tbody>
                {notices.map((n) => (
                  <tr key={n.name}>
                    <td>
                      <a href={`#${n.name}`}>
                        <code className="tok">{n.name}</code>
                      </a>{' '}
                      {n.version}
                    </td>
                    <td>{n.why}</td>
                    <td>
                      <code className="tok">{n.spdx}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {notices.map((n) => (
          <section className="docs__section" id={n.name} key={n.name}>
            <h2 className="docs__h2">
              {n.name} <span className="toc__n mono">{n.version}</span>
            </h2>
            <p className="prose">
              <code className="tok">{n.spdx}</code>
              {n.homepage ? (
                <>
                  {' · '}
                  <a href={n.homepage} rel="noreferrer noopener" target="_blank">
                    {n.homepage}
                  </a>
                </>
              ) : null}
            </p>
            <pre className="code licence">
              <code>{n.text}</code>
            </pre>
          </section>
        ))}
      </main>

      <Footer lang={lang} otherHref={other} />
    </>
  );
}
