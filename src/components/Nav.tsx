'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import type { Lang } from '../copy';
import { COPY } from '../copy';
import { Mark } from './Mark';

type Command = {
  group: string;
  label: string;
  hint: string;
  href: string;
};

/**
 * What the palette can reach. Real destinations only — no placeholder rows.
 *
 * The section links carry the landing page's path rather than a bare `#catches`, because
 * the same nav is rendered on the docs pages, where a bare fragment points at nothing.
 */
function commandsFor(lang: Lang, otherHref: string): Command[] {
  const t = COPY[lang];
  const ja = lang === 'ja';
  const home = `/${lang}`;
  const groups = {
    page: ja ? 'ページ内' : 'On this page',
    docs: ja ? 'ドキュメント' : 'Docs',
    links: ja ? 'リンク' : 'Links',
    lang: ja ? '言語' : 'Language',
  };

  return [
    { group: groups.page, label: t.nav.catches, hint: 'what it catches', href: `${home}#catches` },
    {
      group: groups.page,
      label: t.nav.playground,
      hint: 'playground',
      href: `${home}#playground`,
    },
    { group: groups.page, label: t.nav.editor, hint: 'live editor', href: `${home}#editor` },
    { group: groups.page, label: t.nav.vscode, hint: 'the extension', href: `${home}#vscode` },
    { group: groups.docs, label: t.nav.docs, hint: `${home}/docs`, href: `${home}/docs` },
    {
      group: groups.docs,
      label: t.nav.examples,
      hint: `${home}/examples`,
      href: `${home}/examples`,
    },
    {
      group: groups.docs,
      label: 'SPEC (English)',
      hint: 'docs/SPEC.md',
      href: 'https://github.com/Love-Rox/kumihimo/blob/main/docs/SPEC.md',
    },
    {
      group: groups.docs,
      label: 'SPEC (日本語)',
      hint: 'docs/SPEC.ja.md',
      href: 'https://github.com/Love-Rox/kumihimo/blob/main/docs/SPEC.ja.md',
    },
    {
      group: groups.docs,
      label: 'Examples on GitHub',
      hint: 'examples/',
      href: 'https://github.com/Love-Rox/kumihimo/tree/main/examples',
    },
    {
      group: groups.links,
      label: 'GitHub',
      hint: 'Love-Rox/kumihimo',
      href: 'https://github.com/Love-Rox/kumihimo',
    },
    {
      group: groups.links,
      label: 'npm',
      hint: '@love-rox/kumihimo-core',
      href: 'https://www.npmjs.com/package/@love-rox/kumihimo-core',
    },
    {
      group: groups.links,
      label: 'VS Code',
      hint: 'love-rox.kumihimo-vscode',
      href: 'https://marketplace.visualstudio.com/items?itemName=love-rox.kumihimo-vscode',
    },
    { group: groups.lang, label: t.otherLangLabel, hint: otherHref, href: otherHref },
  ];
}

/**
 * N13 · inline ⌘K search pill.
 *
 * The pill is visible for people who have never met the shortcut, and the shortcut works
 * for people who have. Shipping the pill means shipping the keyboard model with it: Esc
 * closes, the backdrop closes, arrows move, Enter opens, focus returns where it started.
 */
export function Nav({
  lang,
  otherHref,
}: {
  lang: Lang;
  /**
   * Where the language switch goes. Defaults to the other language's landing page; the
   * docs pass their own counterpart, because dropping someone on a front door after a
   * language switch costs more than the switch saves.
   */
  otherHref?: string;
}) {
  const t = COPY[lang];
  const ja = lang === 'ja';
  const other = otherHref ?? t.otherLangHref;
  const commands = commandsFor(lang, other);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  const matches = commands.filter((c) =>
    `${c.label} ${c.hint} ${c.group}`.toLowerCase().includes(query.toLowerCase()),
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
    // Send focus back where it came from rather than dropping it on the body.
    opener.current?.focus();
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        opener.current = document.activeElement as HTMLElement;
        setOpen((was) => !was);
      }
      if (event.key === 'Escape') close();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [close]);

  useEffect(() => {
    if (!open) {
      document.body.style.removeProperty('overflow');
      return;
    }
    document.body.style.overflow = 'hidden';
    input.current?.focus();
  }, [open]);

  const go = useCallback(
    (command: Command | undefined) => {
      if (!command) return;
      close();
      const [path, hash] = command.href.split('#');
      // A section link already on that page should scroll, not reload it.
      if (hash && (path === '' || path === window.location.pathname)) {
        document.querySelector(`#${hash}`)?.scrollIntoView({ behavior: 'smooth' });
      } else if (command.href.startsWith('/')) {
        window.location.href = command.href;
      } else {
        window.open(command.href, '_blank', 'noopener,noreferrer');
      }
    },
    [close],
  );

  return (
    <>
      <header className="nav">
        <div className="shell nav__inner">
          <a className="nav__brand" href={`/${lang}`}>
            <Mark />
            kumihimo
          </a>
          <nav className="nav__links">
            <a className="nav__link" href={`/${lang}#catches`}>
              {t.nav.catches}
            </a>
            <a className="nav__link" href={`/${lang}#playground`}>
              {t.nav.playground}
            </a>
            <a className="nav__link" href={`/${lang}#editor`}>
              {t.nav.editor}
            </a>
            <a className="nav__link" href={`/${lang}#vscode`}>
              {t.nav.vscode}
            </a>
            <a className="nav__link" href={`/${lang}/docs`}>
              {t.nav.docs}
            </a>
            <a className="nav__link" href={`/${lang}/examples`}>
              {t.nav.examples}
            </a>
          </nav>
          <div className="nav__right">
            <a className="nav__link" href={other}>
              {t.otherLangLabel}
            </a>
            <button
              type="button"
              className="searchpill"
              aria-label={`${t.nav.search} (⌘K)`}
              onClick={(event) => {
                opener.current = event.currentTarget;
                setOpen(true);
              }}
            >
              <span className="searchpill__text">{t.nav.search}</span>
              <span>
                <kbd>⌘</kbd> <kbd>K</kbd>
              </span>
            </button>
            <a
              className="btn btn--accent"
              href="https://github.com/Love-Rox/kumihimo"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      <div className="cmdk" data-open={open} aria-hidden={!open}>
        <div className="cmdk__backdrop" onClick={close} />
        <div className="cmdk__panel" role="dialog" aria-modal="true" aria-label={t.nav.search}>
          <div className="cmdk__field">
            <input
              ref={input}
              value={query}
              placeholder={t.nav.search}
              onChange={(event) => {
                setQuery(event.target.value);
                setActive(0);
              }}
              onKeyDown={(event) => {
                if (event.key === 'ArrowDown') {
                  event.preventDefault();
                  setActive((i) => Math.min(i + 1, matches.length - 1));
                }
                if (event.key === 'ArrowUp') {
                  event.preventDefault();
                  setActive((i) => Math.max(i - 1, 0));
                }
                if (event.key === 'Enter') {
                  event.preventDefault();
                  go(matches[active]);
                }
              }}
            />
            <kbd>esc</kbd>
          </div>

          <div className="cmdk__results">
            {matches.length === 0 ? (
              <p className="cmdk__empty">{ja ? '一致するものがありません' : 'No matches'}</p>
            ) : (
              matches.map((command, i) => (
                <button
                  key={command.href}
                  type="button"
                  className="cmdk__item"
                  data-active={i === active}
                  onMouseEnter={() => setActive(i)}
                  onClick={() => go(command)}
                >
                  {command.label}
                  <span>{command.hint}</span>
                </button>
              ))
            )}
          </div>

          <div className="cmdk__foot">
            <span className="mono">
              <kbd>↑</kbd> <kbd>↓</kbd> {ja ? '移動' : 'move'}
            </span>
            <span className="mono">
              <kbd>↵</kbd> {ja ? '開く' : 'open'}
            </span>
            <span className="mono">
              <kbd>esc</kbd> {ja ? '閉じる' : 'close'}
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
