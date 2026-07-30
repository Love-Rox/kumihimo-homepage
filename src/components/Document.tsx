import '../styles.css';

import type { ReactNode } from 'react';

/**
 * The document shell.
 *
 * `lang` has to be an attribute of `<html>`, and nothing nested inside `<html>` can set it
 * — so a single shared root layout cannot serve two languages. Each route group renders
 * its own shell instead, and this component is what keeps the two from drifting apart.
 *
 * `<title>` and `<meta>` are hoisted here by React from wherever a page renders them, so
 * the per-language head does not need passing through. `<link>` is not: a `<link>` written
 * outside this `<head>` never reaches the output at all, which is why the alternates sit
 * here rather than beside the tags they belong with. They are the same three on every
 * page, so nothing is lost by centralising them.
 */
export function Document({ lang, children }: { lang: string; children: ReactNode }) {
  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#f9601f" />
        <link rel="alternate" hrefLang="ja" href="/ja" />
        <link rel="alternate" hrefLang="en" href="/en" />
        <link rel="alternate" hrefLang="x-default" href="/ja" />
      </head>
      <body>{children}</body>
    </html>
  );
}
