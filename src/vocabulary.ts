/**
 * The language's fixed vocabulary, read out of the compiler at build time.
 *
 * See `scripts/build-vocabulary.mjs`. The shape is declared here rather than inferred, for
 * the same reason the notices and the release are: the file is generated and not committed,
 * so its inferred type is whatever the last build happened to produce.
 */

import type { Lang } from './copy';
import generated from './generated/vocabulary.json';

/** One builtin signal type. */
export interface SignalWord {
  /** The word written in a `.khm` file. */
  name: string;
  /** Which family it belongs to, which picks its colour and line style. */
  category: string;
  /** Drawn name, in both languages. */
  label: Record<Lang, string>;
  /** Connectors this type is typically terminated with. */
  connectors: string[];
  /** Whether it is a radio path rather than a cable. */
  wireless: boolean;
}

/** A jacket colour, and every word that resolves to it. */
export interface ColourWord {
  /** The CSS colour it resolves to. */
  hex: string;
  /** Every accepted spelling, English and Japanese. */
  names: string[];
}

interface Vocabulary {
  signals: SignalWord[];
  kinds: string[];
  colours: ColourWord[];
  units: string[];
  themes: string[];
}

export const VOCABULARY: Vocabulary = generated;

/** Signal types of one family, in the order they are listed. */
export function signalsOf(category: string): SignalWord[] {
  return VOCABULARY.signals.filter((s) => s.category === category);
}

/** Every family that has at least one type, in the order they are listed. */
export function categories(): string[] {
  return [...new Set(VOCABULARY.signals.map((s) => s.category))];
}
