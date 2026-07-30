/**
 * The root is a signpost, not a third copy of the page.
 *
 * `/ja` and `/en` are siblings; this sends people to one of them. The redirect is a meta
 * refresh rather than script so it works with JavaScript off, and both links stay visible
 * so a visitor who lands here mid-redirect is never stuck.
 */
export default async function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="0; url=/ja" />
      <main className="shell" style={{ paddingBlock: 'var(--space-3xl)' }}>
        <p className="mono eyebrow">KUMIHIMO</p>
        <h1 style={{ fontSize: 'var(--text-2xl)', marginBlock: 'var(--space-md)' }}>
          Choose a language · 言語を選ぶ
        </h1>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          <a className="btn btn--accent" href="/ja">
            日本語
          </a>
          <a className="btn" href="/en">
            English
          </a>
        </div>
      </main>
    </>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
