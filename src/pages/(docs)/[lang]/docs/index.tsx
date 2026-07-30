import type { PageProps } from 'waku/router';

import { Docs } from '../../../../components/Docs';
import { DOCS } from '../../../../docs';

const LANGS = ['ja', 'en'] as const;

/** `/ja/docs` and `/en/docs`, siblings the same way the landing pages are. */
export default async function DocsPage({ lang }: PageProps<'/[lang]/docs'>) {
  const resolved = lang === 'en' ? 'en' : 'ja';
  return <Docs lang={resolved} t={DOCS[resolved]} />;
}

export const getConfig = async () =>
  ({
    render: 'static',
    staticPaths: LANGS,
  }) as const;
