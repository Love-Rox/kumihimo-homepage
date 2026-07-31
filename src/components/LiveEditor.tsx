'use client';

import { Suspense, lazy, useEffect, useRef, useState } from 'react';

import type { Lang } from '../copy';
import { SAMPLE } from '../sample';

/**
 * The editor, fetched only when someone scrolls to it.
 *
 * The layout engine is ~575 kB gzipped. Importing it at the top of this module puts it in
 * the route's bundle, so every visitor pays for it whether or not they ever reach the
 * editor — which the build output makes plain. A dynamic import behind an
 * IntersectionObserver moves that cost to the people who actually asked for it.
 *
 * The placeholder holds the same height as the editor so nothing jumps when it arrives.
 */
const Editor = lazy(async () => {
  // Unreachable on the server: `wanted` only turns true inside an effect, and effects do
  // not run there. Saying so lets the bundler drop the import from the SSR build, which
  // otherwise carries 2.6 MB of layout engine into the worker to never execute it.
  if (import.meta.env.SSR) throw new Error('The editor is client-only.');

  // Only the JavaScript is deferred. The editor's stylesheet is imported statically from
  // `styles.css`: the bundler hoists a dynamic CSS import anyway, and a few kB of CSS
  // arriving early is worth having the editor styled the instant it appears.
  const { KumihimoEditor } = await import('@love-rox/kumihimo-editor');
  return { default: KumihimoEditor };
});

export function LiveEditor({ label, lang }: { label: string; lang: Lang }) {
  const [wanted, setWanted] = useState(false);
  const slot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = slot.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setWanted(true);
          observer.disconnect();
        }
      },
      // Start fetching a screen early so it is usually ready by the time it is on screen.
      { rootMargin: '600px 0px' },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="editor-slot" ref={slot}>
      {wanted ? (
        <Suspense fallback={<p className="editor-slot__wait mono">{label}</p>}>
          <Editor initialSource={SAMPLE} readUrl={false} filename="kumihimo" locale={lang} />
        </Suspense>
      ) : (
        <p className="editor-slot__wait mono">{label}</p>
      )}
    </div>
  );
}
