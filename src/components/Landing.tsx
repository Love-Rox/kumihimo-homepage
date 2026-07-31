import type { Lang } from '../copy';
import { COPY } from '../copy';
import { RELEASE } from '../release';
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
              <LiveEditor label={t.editor.loading} lang={lang} />
            </div>
          </div>
        </section>

        <section className="shell section" id="vscode">
          <Reveal>
            <div className="section__head">
              <p className="mono eyebrow">{t.vscode.eyebrow}</p>
              <h2>{t.vscode.title}</h2>
              <p>{t.vscode.lede}</p>
            </div>

            <div className="play__row">
              {/* The panel as it actually reads, rather than a screenshot that would go
                  stale the first time a message was reworded. */}
              <div className="slab">
                <span className="mono">problems</span>
                <div className="diag">
                  <div className="diag__row">
                    <span className="diag__wire">
                      <span className="diag__sev">warning</span> {t.vscode.sample.wire}
                    </span>
                    <span className="diag__why">{t.vscode.sample.why}</span>
                  </div>
                </div>
              </div>
              <div className="slab">
                <span className="mono">terminal</span>
                <pre className="code">
                  <code>
                    <span className="c">{t.vscode.installNote}</span>
                    {'\n'}code --install-extension love-rox.kumihimo-vscode
                  </code>
                </pre>
                <p className="release">
                  {RELEASE.marketplace ? (
                    <span className="mono">
                      {t.released} {RELEASE.marketplace.version} · {RELEASE.marketplace.date}
                    </span>
                  ) : null}
                  <a
                    href="https://marketplace.visualstudio.com/items?itemName=love-rox.kumihimo-vscode"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t.vscode.marketplace}
                  </a>
                </p>
              </div>
            </div>

            <div className="feats">
              {t.vscode.features.map((feature) => (
                <div className="feat" key={feature.title}>
                  <h3>{feature.title}</h3>
                  <p>{feature.body}</p>
                </div>
              ))}
            </div>
          </Reveal>
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

            <p className="release">
              <span className="mono">
                {t.released} {RELEASE.npm.version} · {RELEASE.npm.date}
              </span>
              <a
                href="https://github.com/Love-Rox/kumihimo/releases"
                target="_blank"
                rel="noopener noreferrer"
              >
                {t.changelog}
              </a>
            </p>

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
