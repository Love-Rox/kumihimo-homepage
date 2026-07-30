import '../styles.css';

import type { ReactNode } from 'react';

/**
 * `lang` is set per page rather than here, because `/ja` and `/en` are siblings and the
 * shell has no language of its own. The root signpost stays neutral.
 */
export default async function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#f9601f" />
      </head>
      <body>{children}</body>
    </html>
  );
}

export const getConfig = async () => ({ render: 'static' }) as const;
