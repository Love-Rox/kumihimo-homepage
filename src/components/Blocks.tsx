/**
 * How one block of written content is drawn.
 *
 * Shared by the guide and the recipe page. They are different pages — one explains the
 * language a piece at a time, the other answers "how do I write *this*" — but a code slab
 * and a schedule should not look like two different things depending on which page they
 * landed on, and two copies of this would drift the first time either was touched.
 */

import type { ReactNode } from 'react';

import type { Lang } from '../copy';
import type { Block } from '../docs';
import built from '../generated/diagrams.json';
import { VOCABULARY, categories, signalsOf } from '../vocabulary';
import { Diagram } from './Diagram';

type Key = keyof typeof built;

/**
 * Resolve a diagram name against what was actually compiled.
 *
 * A name that no longer exists in `diagrams.sources.json` should stop the build, not
 * render an empty box. Static generation runs this, so a typo fails `pnpm build`.
 */
export function key(name: string): Key {
  if (!(name in built)) {
    throw new Error(`diagrams.sources.json に "${name}" がありません`);
  }
  return name as Key;
}

/**
 * `code` inside a sentence.
 *
 * Deliberately not a Markdown parser and deliberately not `dangerouslySetInnerHTML`: the
 * prose needs exactly this and bold, and returning nodes means no string of text can ever
 * be read as markup.
 */
function code(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith('`') && part.endsWith('`') && part.length > 2 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: split output is positional
      <code className="tok" key={i}>
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

/**
 * Bold first, then code inside it — a sentence that emphasises a claim about `gap` needs
 * both at once, and splitting on either alone leaves the other's backticks on the page.
 */
export function inline(text: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') && part.length > 4 ? (
      // biome-ignore lint/suspicious/noArrayIndexKey: split output is positional
      <strong key={i}>{code(part.slice(2, -2))}</strong>
    ) : (
      // biome-ignore lint/suspicious/noArrayIndexKey: split output is positional
      <span key={i}>{code(part)}</span>
    ),
  );
}

function Diagnostics({ name, lang }: { name: string; lang: Lang }) {
  const entry = built[key(name)][lang];

  return (
    <ul className="diaglist">
      {entry.messages.map((m) => (
        <li className="diaglist__item" key={`${m.code}:${m.message}`}>
          <span className="chip">{m.severity}</span>
          <code className="tok">{m.code}</code>
          <span className="diaglist__msg">{m.message}</span>
        </li>
      ))}
    </ul>
  );
}

const SCHEDULE_HEADS: Record<string, Record<Lang, string[]>> = {
  cable: {
    ja: ['番号', 'から', 'へ', '信号', '長さ', 'コネクタ'],
    en: ['No.', 'From', 'To', 'Signal', 'Length', 'Connectors'],
  },
  // No length and no connector column, because a radio path has neither. What it has is a
  // channel somebody has to co-ordinate, and what it is riding on when `over` said so.
  wireless: {
    ja: ['番号', 'から', 'へ', '信号', '乗り物', 'チャンネル'],
    en: ['No.', 'From', 'To', 'Signal', 'Over', 'Channel'],
  },
  parts: {
    ja: ['部材', '数', 'つながる先'],
    en: ['Part', 'Qty', 'Between'],
  },
  equipment: {
    ja: ['機材', '種別', 'グループ', 'ポート'],
    en: ['Device', 'Kind', 'Group', 'Ports'],
  },
};

const SCHEDULE_TITLES: Record<string, Record<Lang, string>> = {
  cable: { ja: 'ケーブル表', en: 'Cable schedule' },
  wireless: { ja: '無線表', en: 'Wireless schedule' },
  parts: { ja: '部材表', en: 'Parts list' },
  equipment: { ja: '機材表', en: 'Equipment list' },
};

/**
 * A schedule the example produces, as the compiler produced it.
 *
 * An empty one is drawn rather than skipped. "Nothing here" is frequently the whole point
 * — a moulded lead that correctly stayed off the parts list says so by leaving a table
 * empty, and omitting the table would hide the claim being made.
 */
function Schedule({ name, of, lang }: { name: string; of: string; lang: Lang }) {
  const rows = built[key(name)][lang].schedules[of as 'cable' | 'wireless' | 'parts' | 'equipment'];
  const head = SCHEDULE_HEADS[of]?.[lang] ?? [];
  const ja = lang === 'ja';

  const cells = rows.map((row) => {
    if ('adapter' in row) return [row.adapter, String(row.count), row.links];
    if ('device' in row) return [row.device, row.kind, row.group || '—', String(row.ports)];
    if ('carrier' in row) {
      return [
        row.label || '—',
        row.from,
        row.to,
        row.signal,
        // Empty when the signal is its own carrier: "uhf, riding on uhf" is noise, and the
        // column is here to answer what a thing is actually going over.
        row.carrier || '—',
        row.frequency || '—',
      ];
    }
    return [
      row.label || '—',
      row.from,
      row.to,
      row.signal,
      row.length || '—',
      row.connectors || (ja ? 'コネクタなし' : 'none'),
    ];
  });

  return (
    <div className="sched">
      <p className="sched__title mono">{SCHEDULE_TITLES[of]?.[lang] ?? of}</p>
      {cells.length === 0 ? (
        <p className="sched__empty">{ja ? '（空）' : '(empty)'}</p>
      ) : (
        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                {head.map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {cells.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
                    <td key={i}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/** Names in the category, in the order the compiler lists them. */
const CATEGORY_NAMES: Record<string, Record<Lang, string>> = {
  video: { ja: '映像', en: 'Video' },
  audio: { ja: '音声', en: 'Audio' },
  control: { ja: '制御', en: 'Control' },
  network: { ja: 'ネットワーク', en: 'Network' },
  power: { ja: '電源', en: 'Power' },
  sync: { ja: '同期', en: 'Sync' },
  generic: { ja: '汎用', en: 'Generic' },
};

/**
 * The accepted words for one kind of thing.
 *
 * Every one of these comes from the published package, so the page cannot claim a word the
 * compiler would reject, or omit one it accepts.
 */
function Vocabulary({ of, lang }: { of: string; lang: Lang }) {
  const ja = lang === 'ja';

  if (of === 'signals') {
    return (
      <div className="vocab">
        {categories().map((category) => (
          <div className="vocab__group" key={category}>
            <h4>{CATEGORY_NAMES[category]?.[lang] ?? category}</h4>
            <div className="vocab__grid">
              {signalsOf(category).map((signal) => (
                <div className="vocab__item" key={signal.name}>
                  <code className="tok">{signal.name}</code>
                  <span className="vocab__what">{signal.label[lang]}</span>
                  {/* A radio path has no connector, and saying so teaches more than an
                      empty line does. The wireless flag itself is not printed: every
                      wireless label already says it. */}
                  <span className="vocab__conn">
                    {signal.wireless
                      ? ja
                        ? 'コネクタなし'
                        : 'no connector'
                      : signal.connectors.join(' / ')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (of === 'colours') {
    return (
      <div className="vocab__grid vocab__grid--wide">
        {VOCABULARY.colours.map((colour) => (
          <div className="vocab__item" key={colour.hex}>
            <span className="vocab__swatch" style={{ background: colour.hex }} />
            <span className="vocab__names">
              {colour.names.map((name) => (
                <code className="tok" key={name}>
                  {name}
                </code>
              ))}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const words =
    of === 'kinds' ? VOCABULARY.kinds : of === 'units' ? VOCABULARY.units : VOCABULARY.themes;

  return (
    <div className="vocab__words">
      {words.map((word) => (
        <code className="tok" key={word}>
          {word}
        </code>
      ))}
    </div>
  );
}

export function Piece({ block, lang }: { block: Block; lang: Lang }) {
  switch (block.kind) {
    case 'p':
      return <p className="prose">{inline(block.text)}</p>;

    case 'note':
      return <p className="note">{inline(block.text)}</p>;

    case 'code':
      return (
        <div className="slab">
          <div className="slab__label">
            <span className="mono">{block.filename}</span>
          </div>
          <pre className="code">
            <code>{block.lines.join('\n')}</code>
          </pre>
        </div>
      );

    case 'diagram':
      return <Diagram name={key(block.name)} filename={block.filename} lang={lang} layout="row" />;

    case 'diagnostics':
      return <Diagnostics name={block.name} lang={lang} />;

    case 'schedule':
      return <Schedule name={block.name} of={block.of} lang={lang} />;

    case 'vocabulary':
      return <Vocabulary of={block.of} lang={lang} />;

    case 'table':
      return (
        <div className="tablewrap">
          <table className="table">
            <thead>
              <tr>
                {block.head.map((h) => (
                  <th key={h}>{inline(h)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row) => (
                <tr key={row.join('|')}>
                  {row.map((cell, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: cells are positional
                    <td key={i}>{inline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}
