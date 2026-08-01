import type { PageProps } from 'waku/router';

import { Examples } from '../../../../components/Examples';
import { EXAMPLES } from '../../../../examples';

const LANGS = ['ja', 'en'] as const;

/** `/ja/examples` and `/en/examples`, siblings the same way the guide's pages are. */
export default async function ExamplesPage({ lang }: PageProps<'/[lang]/examples'>) {
  const resolved = lang === 'en' ? 'en' : 'ja';
  return <Examples lang={resolved} t={EXAMPLES[resolved]} />;
}

export const getConfig = async () =>
  ({
    render: 'static',
    staticPaths: LANGS,
  }) as const;
