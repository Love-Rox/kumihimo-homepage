import '../styles.css';

import type { ReactNode } from 'react';

/**
 * The document shell.
 *
 * `lang` has to be an attribute of `<html>`, and nothing nested inside `<html>` can set it
 * — so a single shared root layout cannot serve two languages. Each route group renders
 * its own shell instead, and this component is what keeps the two from drifting apart.
 *
 * `<title>` and the rest of the per-language head are hoisted out of the page by React, so
 * they do not need to be passed through here.
 */
export function Document({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <html lang={lang}>
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
