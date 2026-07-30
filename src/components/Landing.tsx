import type { Lang } from '../copy';
import { COPY } from '../copy';
import { Diagram } from './Diagram';
import { Footer } from './Footer';
import { LiveEditor } from './LiveEditor';
import { Nav } from './Nav';
import { Reveal } from './Reveal';

/**
 * The landing page, in whichever language it is handed.
 *
 * One component rather than two pages so the structure cannot drift between the
 * languages — only the strings differ, and they all live in `copy.ts`.
 */
export function Landing({ lang }: { lang: Lang }) {
  const t = COPY[lang];

  return (
    <>
      <Nav lang={lang} />

      <main id="top">
        <section className="shell hero">
          <div>
            <p className="mono eyebrow">{t.hero.eyebrow}</p>
            <h1 className="hero__title">{t.hero.title}</h1>
            <p className="hero__lede">
              {t.hero.lede}
              <strong>{t.hero.ledeStrong}</strong>
              {t.hero.ledeAfter}
            </p>
            <div className="hero__actions">
              <a className="btn btn--accent" href="#editor">
                {t.hero.tryIt}
              </a>
              <a className="btn" href="#install">
                {t.hero.install}
              </a>
            </div>
            <div className="hero__meta">
              <span className="mono">38 signal types</span>
              <span className="mono">7 packages</span>
              <span className="mono">MIT</span>
            </div>
          </div>

          <Diagram name="hero" filename="studio.khm" layout="stack" />
        </section>

        <section className="shell section" id="catches">
          <Reveal>
            <div className="section__head">
              <p className="mono eyebrow">{t.catches.eyebrow}</p>
              <h2>{t.catches.title}</h2>
              <p>{t.catches.lede}</p>
            </div>

            <div className="diag">
              {t.catches.faults.map((fault) => (
                <div className="diag__row" key={fault.wire}>
                  <span className="diag__wire">
                    <span className="diag__sev">warning</span> {fault.wire}
                  </span>
                  <span className="diag__why">{fault.why}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        <section className="shell section" id="playground">
          <Reveal>
            <div className="section__head">
              <p className="mono eyebrow">{t.playground.eyebrow}</p>
              <h2>{t.playground.title}</h2>
              <p>{t.playground.lede}</p>
            </div>
          </Reveal>

          <div className="play">
            {(
              [
                ['ports', t.playground.ports, 'ports.khm'],
                ['wireless', t.playground.wireless, 'wireless.khm'],
                ['library', t.playground.library, 'library.khm'],
              ] as const
            ).map(([name, note, filename]) => (
              <Reveal key={name}>
                <div className="play__note">
                  <h3>{note.title}</h3>
                  <p>{note.body}</p>
                </div>
                <Diagram name={name} filename={filename} />
              </Reveal>
            ))}
          </div>
        </section>

        <section className="band" id="editor">
          <div className="shell">
            <p className="mono eyebrow">{t.editor.eyebrow}</p>
            <h2>{t.editor.title}</h2>
            <p className="mono">{t.editor.lede}</p>
            <div className="band__frame">
              <LiveEditor label={t.editor.loading} />
            </div>
          </div>
        </section>

        <section className="shell section" id="install">
          <Reveal>
            <div className="section__head">
              <p className="mono eyebrow">{t.install.eyebrow}</p>
              <h2>{t.install.title}</h2>
            </div>

            <div className="play__row">
              <div className="slab">
                <span className="mono">terminal</span>
                <pre className="code">
                  <code>
                    <span className="c">{t.install.cliNote}</span>
                    {'\n'}pnpm add -D @love-rox/kumihimo-cli{'\n\n'}
                    kumihimo build studio.khm -o studio.svg{'\n'}
                    kumihimo check studio.khm{'\n'}
                    kumihimo export studio.khm drawio
                  </code>
                </pre>
              </div>
              <div className="slab">
                <span className="mono">markdown</span>
                <pre className="code">
                  <code>
                    <span className="c">{t.install.mdNote}</span>
                    {'\n'}pnpm add @love-rox/kumihimo-rehype{'\n\n'}
                    <span className="s">```kumihimo</span>
                    {'\n'}cam.SDI <span className="n">-&gt;</span> sw.1 : sdi 30m{'\n'}
                    <span className="s">```</span>
                  </code>
                </pre>
              </div>
            </div>

            <div className="pkgs">
              {t.packages.map((pkg) => (
                <div className="pkg" key={pkg.name}>
                  <span className="pkg__name">{pkg.name}</span>
                  <span className="pkg__what">{pkg.what}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>
      </main>

      <Footer lang={lang} />
    </>
  );
}
