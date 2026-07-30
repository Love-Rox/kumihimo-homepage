import type { ReactNode } from 'react';

/**
 * A wrapper the stylesheet animates on scroll — with no JavaScript at all.
 *
 * This started as a client component that set `opacity: 0` and waited for an
 * IntersectionObserver. That makes the page's content contingent on hydration: a browser
 * extension that touches `<html>` is enough to break hydration, and every section below
 * the fold stays invisible. A blank page is a far worse failure than a missing fade.
 *
 * The animation now lives entirely in CSS behind `@supports (animation-timeline: view())`.
 * Where that is unsupported the content is simply visible, which is the correct fallback.
 */
export function Reveal({ children }: { children: ReactNode }) {
  return <div className="reveal">{children}</div>;
}
