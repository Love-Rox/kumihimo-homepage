/**
 * What is published right now, read at build time from the registries themselves.
 *
 * See `scripts/build-release.mjs`. The shape is declared here rather than inferred, for the
 * same reason the notices are: the file is generated and not committed, so its inferred
 * type is whatever the last build happened to produce.
 */

import generated from './generated/release.json';

/** One published thing. */
export interface Published {
  /** Package or extension identifier, as someone would type it to install it. */
  name: string;
  /** The latest published version. */
  version: string;
  /** The day it was published, `YYYY-MM-DD` in UTC. */
  date: string;
}

interface Release {
  /** The npm packages. They are released together, so one entry stands for the set. */
  npm: Published;
  /** The VS Code extension. Absent when the Marketplace could not be read at build time. */
  marketplace?: Published;
}

export const RELEASE: Release = generated;
