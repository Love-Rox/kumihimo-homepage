import type { PageProps } from 'waku/router';
import type { ReactNode } from 'react';

import { COPY } from '../../copy';

/**
 * Per-language head. Sets `lang` on the document and the alternate link, so a search
 * engine and a screen reader both know which of the two siblings they are looking at.
 */
export default async function LocaleLayout({
  children,
  lang,
}: PageProps<'/[lang]'> & { children: ReactNode }) {
  const t = COPY[lang === 'en' ? 'en' : 'ja'];

  return (
    <>
      <title>{t.title}</title>
      <meta name="description" content={t.description} />
      <meta property="og:title" content={t.title} />
      <meta property="og:description" content={t.description} />
      <meta property="og:type" content="website" />
      <link rel="alternate" hrefLang="ja" href="/ja" />
      <link rel="alternate" hrefLang="en" href="/en" />
      <link rel="alternate" hrefLang="x-default" href="/ja" />
      {children}
    </>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
