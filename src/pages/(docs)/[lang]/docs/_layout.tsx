import type { PageProps } from 'waku/router';
import type { ReactNode } from 'react';

import { Document } from '../../../../components/Document';
import { DOCS } from '../../../../docs';

/**
 * The docs shell.
 *
 * Docs sit in their own route group rather than under `(locale)` because a layout is given
 * neither the path nor the query at runtime — only its own route params. A layout shared
 * with the landing page could not tell `/ja` from `/ja/docs`, and would put the landing
 * page's canonical on both.
 */
export default async function DocsLayout({
  children,
  lang,
}: PageProps<'/[lang]/docs'> & { children: ReactNode }) {
  const resolved = lang === 'en' ? 'en' : 'ja';
  const t = DOCS[resolved];

  return (
    <Document lang={resolved} path={`/${resolved}/docs`}>
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
