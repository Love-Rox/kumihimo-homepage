import type { PageProps } from 'waku/router';

import { Legal } from '../../../../components/Legal';
import { LEGAL } from '../../../../legal';

const LANGS = ['ja', 'en'] as const;

/** `/ja/licenses` and `/en/licenses`. */
export default async function LicensesPage({ lang }: PageProps<'/[lang]/licenses'>) {
  const resolved = lang === 'en' ? 'en' : 'ja';
  return <Legal lang={resolved} t={LEGAL[resolved]} />;
}

export const getConfig = async () =>
  ({
    render: 'static',
    staticPaths: LANGS,
  }) as const;
