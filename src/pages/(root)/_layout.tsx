import type { ReactNode } from 'react';

import { Document } from '../../components/Document';

/**
 * The signpost's shell.
 *
 * The page offers both languages and then sends people to `/ja`, so `ja` is the honest
 * declaration for the document a reader ends up with.
 */
export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <Document lang="ja" path="/">
      {/* Both languages, because this is the one page that has not chosen yet. */}
      <title>kumihimo — 言語を選ぶ · Choose a language</title>
      {children}
    </Document>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
