import type { PageProps } from 'waku/router';
import type { ReactNode } from 'react';

import { Document } from '../../../components/Document';
import { COPY } from '../../../copy';

/**
 * Per-language document and head.
 *
 * The shell lives in its own route group so `lang` can differ between `/ja` and `/en`; a
 * layout shared with the signpost would have to pick one language and apply it to both.
 * A search engine and a screen reader each read that attribute rather than guessing from
 * the text.
 *
 * Only `<title>` and `<meta>` may be written here — React hoists those into the head. A
 * `<link>` written here is dropped, so the alternates live in `Document`.
 */
export default async function LocaleLayout({
  children,
  lang,
}: PageProps<'/[lang]'> & { children: ReactNode }) {
  const t = COPY[lang === 'en' ? 'en' : 'ja'];

  return (
    <Document lang={t.htmlLang} path={`/${t.htmlLang}`}>
      <title>{t.title}</title>
      <meta name="description" content={t.description} />
      <meta property="og:title" content={t.title} />
      <meta property="og:description" content={t.description} />
      <meta property="og:type" content="website" />
      {children}
    </Document>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
