import type { PageProps } from 'waku/router';
import type { ReactNode } from 'react';

import { Document } from '../../../../components/Document';
import { EXAMPLES } from '../../../../examples';

/**
 * The recipe shell.
 *
 * Its own layout rather than a shared one with the guide, for the reason the guide's own
 * comment gives: a layout sees only its route params, so one shared between `/ja/docs` and
 * `/ja/examples` could not tell them apart and would put one page's canonical on both.
 */
export default async function ExamplesLayout({
  children,
  lang,
}: PageProps<'/[lang]/examples'> & { children: ReactNode }) {
  const resolved = lang === 'en' ? 'en' : 'ja';
  const t = EXAMPLES[resolved];

  return (
    <Document lang={resolved} path={`/${resolved}/examples`}>
      <title>{t.title}</title>
      <meta name="description" content={t.description} />
      <meta property="og:title" content={t.title} />
      <meta property="og:description" content={t.description} />
      <meta property="og:type" content="article" />
      {children}
    </Document>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
