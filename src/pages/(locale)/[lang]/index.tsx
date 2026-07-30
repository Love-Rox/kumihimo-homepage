import type { PageProps } from 'waku/router';

import { Landing } from '../../../components/Landing';
import type { Lang } from '../../../copy';
import { COPY } from '../../../copy';

const LANGS = ['ja', 'en'] as const;

/**
 * `/ja` and `/en` are siblings under one dynamic segment, so neither language is the
 * other's afterthought and both carry the same structure.
 */
export default async function LocalePage({ lang }: PageProps<'/[lang]'>) {
  const resolved: Lang = lang === 'en' ? 'en' : 'ja';
  return <Landing lang={resolved} />;
}

export const getConfig = async () =>
  ({
    render: 'static',
    staticPaths: LANGS,
  }) as const;

export { COPY };
