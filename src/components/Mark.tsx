/**
 * The kumihimo mark — 角八つ組, the cross-section of a braided cord.
 *
 * Vermilion is the Rox house colour, and it is the one thing on the page that is not
 * Cobalt. That is deliberate: the mark identifies the publisher, the interface identifies
 * the product. It stays small and sits away from the cobalt button so the two saturated
 * colours never compete in the same glance.
 */
export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className="mark"
    >
      <rect width="64" height="64" rx="14" fill="#f9601f" />
      <g fill="none" stroke="#f7f1e7" strokeWidth="4.4" strokeLinecap="square">
        <path d="M14 22 L32 40 L50 22" />
        <path d="M14 42 L32 24 L50 42" />
      </g>
      <circle cx="32" cy="32" r="3.6" fill="#f7f1e7" />
    </svg>
  );
}
