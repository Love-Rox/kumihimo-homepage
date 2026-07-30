import '../styles.css';

import type { ReactNode } from 'react';

import { ORIGIN } from '../site';

/**
 * The document shell.
 *
 * `lang` has to be an attribute of `<html>`, and nothing nested inside `<html>` can set it
 * — so a single shared root layout cannot serve two languages. Each route group renders
 * its own shell instead, and this component is what keeps the two from drifting apart.
 *
 * `<title>` and `<meta>` are hoisted here by React from wherever a page renders them, so
 * the per-language head does not need passing through. `<link>` is not: a `<link>` written
 * outside this `<head>` never reaches the output at all, which is why the alternates and
 * the canonical sit here rather than beside the tags they belong with.
 *
 * Everything pointing outward carries the full origin: a relative hreflang is not
 * honoured, and a scraper resolves og:image against nothing.
 */
export function Document({
  lang,
  path,
  children,
}: {
  lang: string;
  /** This page's path, from the site root, with a leading slash. */
  path: string;
  children: ReactNode;
}) {
  const url = `${ORIGIN}${path}`;
  const card = `${ORIGIN}/og.${lang === 'en' ? 'en' : 'ja'}.png`;

  return (
    <html lang={lang}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <meta name="theme-color" content="#f9601f" />

        <link rel="canonical" href={url} />
        <link rel="alternate" hrefLang="ja" href={`${ORIGIN}/ja`} />
        <link rel="alternate" hrefLang="en" href={`${ORIGIN}/en`} />
        <link rel="alternate" hrefLang="x-default" href={`${ORIGIN}/ja`} />

        <meta property="og:site_name" content="kumihimo" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content={card} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
      </head>
      <body>{children}</body>
    </html>
  );
}
