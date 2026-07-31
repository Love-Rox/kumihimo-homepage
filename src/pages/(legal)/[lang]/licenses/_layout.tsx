import type { PageProps } from 'waku/router';
import type { ReactNode } from 'react';

import { Document } from '../../../../components/Document';
import { LEGAL } from '../../../../legal';

/**
 * The notices shell.
 *
 * Its own route group for the same reason the docs have one: a layout is given neither the
 * path nor the query at runtime, so a shared one would put another page's canonical here.
 */
export default async function LegalLayout({
  children,
  lang,
}: PageProps<'/[lang]/licenses'> & { children: ReactNode }) {
  const resolved = lang === 'en' ? 'en' : 'ja';
  const t = LEGAL[resolved];

  return (
    <Document lang={resolved} path={`/${resolved}/licenses`}>
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
