/**
 * The guide, in both languages.
 *
 * Every `.khm` shown as a diagram is compiled by the published package at build time, so
 * the drawing beside a claim is the drawing that claim produces. The faults section quotes
 * the compiler's real diagnostics rather than a paraphrase, and the build fails if that
 * example stops producing exactly two of them.
 *
 * Nothing here is a benchmark or a metric, because none has been measured.
 */

import type { Lang } from './copy';

export type Block =
  | { kind: 'p'; text: string }
  | { kind: 'code'; filename: string; lines: string[] }
  | { kind: 'diagram'; name: string; filename: string }
  | { kind: 'diagnostics'; name: string }
  | { kind: 'table'; head: string[]; rows: string[][] }
  | { kind: 'note'; text: string };

export interface Section {
  id: string;
  title: string;
  blocks: Block[];
}

export interface Docs {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lede: string;
  tocLabel: string;
  backLabel: string;
  /** The label for the same page in the other language. */
  otherLangLabel: string;
  specLabel: string;
  specHref: string;
  sections: Section[];
}

const SPEC_JA = 'https://github.com/Love-Rox/kumihimo/blob/main/docs/SPEC.ja.md';
const SPEC_EN = 'https://github.com/Love-Rox/kumihimo/blob/main/docs/SPEC.md';

export const DOCS: Record<Lang, Docs> = {
  ja: {
    title: 'kumihimo の使い方 — 系統図をテキストで書く',
    description:
      'kumihimo の文法をひととおり。機材とポートの書き方、つなぎ方、信号の互換判定、変換ケーブル、無線、機材ライブラリ、出力まで。図はすべて公開済みパッケージでビルド時にコンパイルしています。',
    eyebrow: 'DOCS',
    heading: '書き方',
    lede: 'ポートを宣言して、つなぐ。それだけです。下の図はすべて、左のソースを公開済みパッケージでビルド時にコンパイルした結果で、描き直したものではありません。',
    tocLabel: '目次',
    backLabel: 'トップへ',
    otherLangLabel: 'English',
    specLabel: '仕様書（全文）',
    specHref: SPEC_JA,
    sections: [
      {
        id: 'install',
        title: '入れる',
        blocks: [
          { kind: 'p', text: 'コマンドラインで使う場合は CLI を入れます。' },
          {
            kind: 'code',
            filename: 'shell',
            lines: [
              'pnpm add @love-rox/kumihimo-cli',
              '',
              'kumihimo build studio.khm -o studio.svg   # 描く',
              'kumihimo check studio.khm                 # 検証だけ',
              'kumihimo build studio.khm --watch         # 保存で描き直す',
              'kumihimo export studio.khm drawio         # 編集できる draw.io ファイル',
              'kumihimo export studio.khm cable --stdout # ケーブル表を TSV で',
            ],
          },
          {
            kind: 'p',
            text: '`kumihimo` と `khm` の両方の名前で入ります。警告は既定ではビルドを失敗させません。失敗させたいときは `--strict` を付けます。',
          },
        ],
      },
      {
        id: 'first',
        title: '最初の一枚',
        blocks: [
          {
            kind: 'p',
            text: '機材を宣言して、ポートどうしをつなぎます。拡張子は `.khm` です。',
          },
          { kind: 'diagram', name: 'docsFirst', filename: 'first.khm' },
          {
            kind: 'p',
            text: '`device <id> "<ラベル>" as <種別>` の `<id>` は接続を書くときの名前で、図には出ません。図に出るのは `"<ラベル>"` の方です。',
          },
        ],
      },
      {
        id: 'device',
        title: '機材とポート',
        blocks: [
          {
            kind: 'code',
            filename: '構文',
            lines: [
              'device <id> "<ラベル>" as <種別> {',
              '  in   <ポート指定> : <信号>   # 入力',
              '  out  <ポート指定> : <信号>   # 出力',
              '  io   <ポート指定> : <信号>   # 双方向（Dante, Ethernet …）',
              '  @model "HyperDeck Studio HD Mini"',
              '}',
            ],
          },
          {
            kind: 'p',
            text: 'ポート指定には4つの書き方があります。16ch の卓を16行書く必要はありません。',
          },
          {
            kind: 'table',
            head: ['書き方', '例', '展開'],
            rows: [
              ['単体', '`SDI`', '`SDI`'],
              ['並べる', '`L, R`', '`L`, `R`'],
              ['数の範囲', '`1..4`', '`1`, `2`, `3`, `4`'],
              ['接頭辞つき範囲', '`CH[1..16]`', '`CH1` … `CH16`'],
            ],
          },
          { kind: 'diagram', name: 'ports', filename: 'ports.khm' },
          {
            kind: 'note',
            text: '宣言した順序がそのまま描かれます。`IN 1` が `IN 2` の下に来ることはありません。機材の中での位置は意味を持つ情報なので、並べ替えません。',
          },
          {
            kind: 'p',
            text: '種別は形を決めます。`camera` `switcher` `mixer` `recorder` `player` `display` `projector` `speaker` `microphone` `amplifier` `computer` `converter` `matrix` `patchbay` `router` `interface` `generic` から選びます。省略すると `generic` です。',
          },
          {
            kind: 'p',
            text: '`@` で始まる行は任意のメタデータです。図には出ませんが、機材表と各種エクスポートに載ります。',
          },
        ],
      },
      {
        id: 'connect',
        title: 'つなぐ',
        blocks: [
          {
            kind: 'code',
            filename: '構文',
            lines: ['<機材>.<ポート> <矢印> <機材>.<ポート> : <信号> <修飾子>*'],
          },
          {
            kind: 'table',
            head: ['矢印', '意味'],
            rows: [
              ['`->`', '一方向。信号が流れる向き'],
              ['`<->`', '双方向（Dante, Ethernet, 制御 …）'],
              ['`--`', '向きなし（電源 …）'],
            ],
          },
          {
            kind: 'p',
            text: '修飾子は順不同で、どれも省略できます。',
          },
          {
            kind: 'table',
            head: ['書き方', '意味', '例'],
            rows: [
              ['`<長さ>`', 'ケーブル長', '`10m` `30cm` `2.5m` `3ft`'],
              ['`"<ラベル>"`', 'ケーブル番号や名前', '`"V-01"`'],
              ['`via "<部品>"`', '変換ケーブルやアダプタ', '`via "HDMI-DVI変換"`'],
              ['`[k=v, …]`', '任意の属性', '`[connector=BNC, color=青]`'],
            ],
          },
          { kind: 'diagram', name: 'docsConnect', filename: 'connect.khm' },
          {
            kind: 'p',
            text: '両端が同じ数のポートを並べると、順に対応します。`mixer.(L, R) -> amp.(IN_L, IN_R)` は2行書くのと同じです。',
          },
          {
            kind: 'p',
            text: '`[color=…]` はケーブルの被覆の色です。信号種別の既定色を上書きします。これは装飾ではなく、現場で線を特定する手段（「青いのを1番へ」）なので、色はケーブル表にも持ち越されます。日本語名（赤・青・緑・黄・橙・桃・紫・黒・白・灰・茶）と英語名、`#0af` のような16進が使えます。解釈できない値は診断になり、図には届きません。',
          },
          {
            kind: 'note',
            text: '長さは数と単位だけの裸のトークンです。`#` は行コメント専用なので、長さの前に付くことはありません。',
          },
        ],
      },
      {
        id: 'group',
        title: 'まとめる',
        blocks: [
          {
            kind: 'p',
            text: '場所・ラック・サブシステムを枠で囲みます。入れ子は v0.1 では1段までです。',
          },
          { kind: 'diagram', name: 'docsGroup', filename: 'group.khm' },
        ],
      },
      {
        id: 'signal',
        title: '信号と互換判定',
        blocks: [
          {
            kind: 'p',
            text: 'これが図を描くだけの道具との違うところです。すべての接続が「物理的に成立するか」を判定されます。',
          },
          {
            kind: 'note',
            text: '判定は**両端のポートが宣言した型**で行います。接続行の `: <信号>` が表すのは**ケーブル**で、型を宣言していない端の穴埋めにしか使われません。ここを取り違えると、型を自分自身と比べることになり、どんな不一致も検出できなくなります。',
          },
          {
            kind: 'table',
            head: ['判定', '意味', '扱い'],
            rows: [
              ['`ok`', '普通の接続', '黙る'],
              ['`lossy`', '通るが何かを失う、または部品が要る', '警告'],
              ['`incompatible`', '能動変換なしには成立しない', '報告'],
            ],
          },
          {
            kind: 'p',
            text: '検出する価値があるのは、プラグがぴたりと嵌まり、見た目に何もおかしくなく、そして何も出ない組み合わせです。下は2本ともコネクタを共有しているだけの配線です。',
          },
          { kind: 'diagram', name: 'docsFaults', filename: 'faults.khm' },
          { kind: 'diagnostics', name: 'docsFaults' },
          {
            kind: 'p',
            text: '判定には必ず理由が付き、その理由はケーブル表にも残ります。同種の組み合わせは他にも `dmx`↔`xlr`、`rca`↔`spdif`、`adat`↔`spdif`、`composite`↔`component`、`wordclock`↔`sdi` があります。',
          },
          {
            kind: 'p',
            text: '現場の取り決めは `compat` で一度だけ、理由と一緒に書けます。理由は診断とケーブル表に流れるので、なぜ許したのかが図から失われません。',
          },
          {
            kind: 'code',
            filename: 'compat',
            lines: [
              'compat aes -> xlr : ok    "社内基準：10m 未満なら可"',
              'compat xlr -> rca : lossy "必ず DI を通す"',
            ],
          },
          {
            kind: 'p',
            text: '主な診断コードです。既定の重さは設定で変えられます。',
          },
          {
            kind: 'table',
            head: ['コード', '意味', '既定'],
            rows: [
              ['`signal-mismatch`', '両端が信号について食い違っている', '警告'],
              ['`adapter-required`', 'アダプタが要るのに宣言がない', '警告'],
              ['`adapter-insufficient`', '`via` はあるがケーブルでは橋渡しできない', 'エラー'],
              ['`direction-mismatch`', '出力どうし、入力どうし', 'エラー'],
              ['`port-overbooked`', '1つの入力に複数の送り出し', 'エラー'],
              ['`implicit-device`', '宣言していない機材を参照した', '警告'],
              ['`unconnected-port`', '宣言したのに何もつながっていない', '既定オフ'],
            ],
          },
          {
            kind: 'note',
            text: '例外は投げません。どの段階も診断を集めて最善の結果を返すので、誤りのある図もちゃんと描かれます。**欠陥を見つけるために必要なのは、まさにその欠陥が写った絵**だからです。',
          },
        ],
      },
      {
        id: 'via',
        title: '変換をはさむ',
        blocks: [
          {
            kind: 'p',
            text: '受動的なアダプタや変換ケーブルが途中に入ることを宣言します。',
          },
          { kind: 'diagram', name: 'docsVia', filename: 'via.khm' },
          {
            kind: 'p',
            text: '`via` は警告を黙らせる道具ではありません。**部品を資材表に載せる宣言**です。線には変換の印が付き、アダプタが明細に出ます。',
          },
          {
            kind: 'p',
            text: 'ケーブルで本当に橋渡しできる組み合わせ（HDMI↔DVI、DP→HDMI など）なら `via` で診断が消えます。宣言しなければ報告され、必要な部品の名前が示されます。一方、どんなケーブルでも橋渡しできない組み合わせ（SDI→HDMI など）では `via` を書いても診断は消えません。それは電源の要る箱なので、ケーブルの属性ではなく**機材として図に置く**べきものです。',
          },
          {
            kind: 'code',
            filename: 'converter.khm',
            lines: [
              '# 誤り：SDI を HDMI に変えるケーブルは存在しない',
              'cam.SDI -> mon.HDMI : sdi via "SDI-HDMI変換"',
              '',
              '# 正しい：変換器は機材',
              'device conv "BMD Mini Converter SDI-HDMI" as converter {',
              '  in  SDI  : sdi',
              '  out HDMI : hdmi',
              '}',
              'cam.SDI   -> conv.SDI : sdi',
              'conv.HDMI -> mon.HDMI : hdmi',
            ],
          },
        ],
      },
      {
        id: 'wireless',
        title: '無線',
        blocks: [
          {
            kind: 'p',
            text: '無線区間はケーブルではないので、長さの代わりに周波数やチャンネルを持ちます。線は破線で描かれます。',
          },
          { kind: 'diagram', name: 'wireless', filename: 'wireless.khm' },
          {
            kind: 'p',
            text: '受信機を通さずマイクを卓へ直結すれば、そこで指摘が出ます。無線と有線の境界も判定の対象です。',
          },
        ],
      },
      {
        id: 'library',
        title: '機材ライブラリ',
        blocks: [
          {
            kind: 'p',
            text: '卓の16chを図ごとに書き直す必要はありません。`model` で一度定義し、`device … from` で何台でも実体化します。',
          },
          { kind: 'diagram', name: 'library', filename: 'library.khm' },
          {
            kind: 'p',
            text: '別ファイルに置いたものは `use` で読み込みます。読み込んだファイルに機材や接続が書かれていた場合は無視され、警告になります。ライブラリは定義を置く場所であって、図を置く場所ではないためです。',
          },
          {
            kind: 'code',
            filename: 'studio.khm',
            lines: ['use "lib/yamaha.khm"', '', 'device foh from dm3 "FOH卓"'],
          },
        ],
      },
      {
        id: 'theme',
        title: '見た目',
        blocks: [
          {
            kind: 'code',
            filename: 'diagram ブロック',
            lines: [
              'diagram "Studio A" {',
              '  direction: LR      # LR（左→右、既定）| TB（上→下）',
              '  theme: light       # light（既定）| dark | mono | blueprint',
              '  spacing: 60        # 機材どうしの間隔（px）',
              '}',
            ],
          },
          {
            kind: 'table',
            head: ['テーマ', '用途'],
            rows: [
              ['`light`', '既定。画面とカラー印刷'],
              ['`dark`', '暗い画面'],
              ['`mono`', '**白黒印刷とコピー**'],
              ['`blueprint`', '設備図面の青焼き調'],
            ],
          },
          {
            kind: 'p',
            text: '`mono` は色をいっさい使いません。信号は**線種**で区別され、`[color=…]` で指定した被覆色は無視されます。コピーを通った色が残っているふりをしても誰の役にも立たないからです。',
          },
          { kind: 'diagram', name: 'docsTheme', filename: 'mono.khm' },
          {
            kind: 'note',
            text: 'テーマは `-t/--theme` でも渡せますが、ソース中の `diagram { theme: … }` が勝ちます。図は自分がどう見えるべきかを知っていて、呼び出し側は既定値しか知らないからです。',
          },
        ],
      },
      {
        id: 'output',
        title: '出力と埋め込み',
        blocks: [
          {
            kind: 'p',
            text: 'SVG のほか、編集できる draw.io ファイル、ケーブル表・機材表の TSV が出せます。',
          },
          {
            kind: 'p',
            text: 'Markdown には `kumihimo` のコードフェンスをそのまま埋め込めます。ビルド時に SVG になります。',
          },
          {
            kind: 'code',
            filename: 'markdown',
            lines: [
              '```kumihimo',
              'cam.SDI -> sw.1 : sdi 30m "V-01"',
              '```',
              '',
              "import rehypeKumihimo from '@love-rox/kumihimo-rehype';",
              '',
              'unified()',
              '  .use(remarkParse)',
              '  .use(remarkRehype)',
              '  .use(rehypeKumihimo, { theme: "dark", onDiagnostics: report })',
              '  .use(rehypeStringify);',
            ],
          },
          {
            kind: 'p',
            text: 'React・Vue・Astro のコンポーネントもあります。コンパイルは非同期で、新しい図ができるまで前の図が画面に残り、遅れて終わった古いコンパイルが新しい結果を上書きすることはありません。',
          },
          {
            kind: 'code',
            filename: 'React',
            lines: [
              "import { Kumihimo, useKumihimo } from '@love-rox/kumihimo-react';",
              '',
              '<Kumihimo source={src} theme="dark" onDiagnostics={report} />;',
              '',
              'const { svg, diagram, diagnostics, pending, error } = useKumihimo(src);',
            ],
          },
          {
            kind: 'p',
            text: '`onDiagnostics` を使えば、誤配線のきれいな絵をそのまま公開してしまうことを避けられます。',
          },
        ],
      },
    ],
  },

  en: {
    title: 'Using kumihimo — AV signal flow diagrams as text',
    description:
      'The kumihimo language, end to end: devices and ports, connections, signal compatibility, adapters, wireless, equipment libraries and output. Every diagram is compiled at build time by the published package.',
    eyebrow: 'DOCS',
    heading: 'How to write it',
    lede: 'Declare ports, then connect them. That is the whole idea. Every diagram below was compiled at build time by the published package from the source beside it — none was redrawn.',
    tocLabel: 'Contents',
    backLabel: 'Home',
    otherLangLabel: '日本語',
    specLabel: 'Full spec',
    specHref: SPEC_EN,
    sections: [
      {
        id: 'install',
        title: 'Install',
        blocks: [
          { kind: 'p', text: 'For the command line, install the CLI.' },
          {
            kind: 'code',
            filename: 'shell',
            lines: [
              'pnpm add @love-rox/kumihimo-cli',
              '',
              'kumihimo build studio.khm -o studio.svg   # draw it',
              'kumihimo check studio.khm                 # validate only',
              'kumihimo build studio.khm --watch         # redraw on save',
              'kumihimo export studio.khm drawio         # editable draw.io file',
              'kumihimo export studio.khm cable --stdout # cable schedule as TSV',
            ],
          },
          {
            kind: 'p',
            text: 'It installs as both `kumihimo` and `khm`. Warnings do not fail the build unless you pass `--strict`.',
          },
        ],
      },
      {
        id: 'first',
        title: 'Your first diagram',
        blocks: [
          {
            kind: 'p',
            text: 'Declare the equipment, then wire port to port. The extension is `.khm`.',
          },
          { kind: 'diagram', name: 'docsFirst', filename: 'first.khm' },
          {
            kind: 'p',
            text: 'In `device <id> "<label>" as <kind>`, the `<id>` is how connections refer to the device and is not drawn. The `"<label>"` is what appears on the diagram.',
          },
        ],
      },
      {
        id: 'device',
        title: 'Devices and ports',
        blocks: [
          {
            kind: 'code',
            filename: 'syntax',
            lines: [
              'device <id> "<label>" as <kind> {',
              '  in   <port spec> : <signal>   # input',
              '  out  <port spec> : <signal>   # output',
              '  io   <port spec> : <signal>   # bidirectional (Dante, Ethernet …)',
              '  @model "HyperDeck Studio HD Mini"',
              '}',
            ],
          },
          {
            kind: 'p',
            text: 'A port spec takes four forms, so a sixteen-channel desk is not sixteen lines.',
          },
          {
            kind: 'table',
            head: ['Form', 'Example', 'Expands to'],
            rows: [
              ['Single', '`SDI`', '`SDI`'],
              ['List', '`L, R`', '`L`, `R`'],
              ['Numeric range', '`1..4`', '`1`, `2`, `3`, `4`'],
              ['Prefixed range', '`CH[1..16]`', '`CH1` … `CH16`'],
            ],
          },
          { kind: 'diagram', name: 'ports', filename: 'ports.khm' },
          {
            kind: 'note',
            text: 'Declaration order is preserved and drawn. `IN 1` never ends up below `IN 2`. Position within a device is meaningful information, so nothing gets reordered.',
          },
          {
            kind: 'p',
            text: 'The kind picks the shape: `camera` `switcher` `mixer` `recorder` `player` `display` `projector` `speaker` `microphone` `amplifier` `computer` `converter` `matrix` `patchbay` `router` `interface` `generic`. It defaults to `generic`.',
          },
          {
            kind: 'p',
            text: 'Any `@`-prefixed line is metadata. It is not drawn, but it is carried into the equipment schedule and the exports.',
          },
        ],
      },
      {
        id: 'connect',
        title: 'Connections',
        blocks: [
          {
            kind: 'code',
            filename: 'syntax',
            lines: ['<device>.<port> <arrow> <device>.<port> : <signal> <modifier>*'],
          },
          {
            kind: 'table',
            head: ['Arrow', 'Meaning'],
            rows: [
              ['`->`', 'one way, in the direction signal flows'],
              ['`<->`', 'two way (Dante, Ethernet, control …)'],
              ['`--`', 'no direction (power …)'],
            ],
          },
          { kind: 'p', text: 'Modifiers may appear in any order and any may be omitted.' },
          {
            kind: 'table',
            head: ['Syntax', 'Meaning', 'Example'],
            rows: [
              ['`<length>`', 'cable length', '`10m` `30cm` `2.5m` `3ft`'],
              ['`"<label>"`', 'cable number or name', '`"V-01"`'],
              ['`via "<part>"`', 'adapter or converting lead', '`via "HDMI-DVI cable"`'],
              ['`[k=v, …]`', 'arbitrary attributes', '`[connector=BNC, color=blue]`'],
            ],
          },
          { kind: 'diagram', name: 'docsConnect', filename: 'connect.khm' },
          {
            kind: 'p',
            text: 'When both ends name the same number of ports, they pair up in order. `mixer.(L, R) -> amp.(IN_L, IN_R)` is the same as writing two lines.',
          },
          {
            kind: 'p',
            text: '`[color=…]` is the cable jacket, overriding the signal type default. It is not decoration: it is how a run gets identified on site — "the blue one into 1" — so the colour follows through into the cable schedule. Colour names work in English or Japanese, and hex such as `#0af` works too. Anything else becomes a diagnostic and never reaches the drawing.',
          },
          {
            kind: 'note',
            text: 'Length is a bare token of a number and a unit. `#` is reserved for comments, so it never prefixes a length.',
          },
        ],
      },
      {
        id: 'group',
        title: 'Groups',
        blocks: [
          {
            kind: 'p',
            text: 'A frame around a location, a rack or a subsystem. Nesting is one level in v0.1.',
          },
          { kind: 'diagram', name: 'docsGroup', filename: 'group.khm' },
        ],
      },
      {
        id: 'signal',
        title: 'Signals and compatibility',
        blocks: [
          {
            kind: 'p',
            text: 'This is where it stops being a drawing tool. Every connection is judged on whether it can physically work.',
          },
          {
            kind: 'note',
            text: 'The verdict is reached from **what the two ports themselves declare**. The `: <signal>` on a connection describes **the cable**, and only fills in for an end that declares nothing. Get that backwards and a type is compared against itself, so no mismatch can ever be found.',
          },
          {
            kind: 'table',
            head: ['Verdict', 'Meaning', 'Treated as'],
            rows: [
              ['`ok`', 'a normal connection', 'silent'],
              ['`lossy`', 'works, but something is given up or a part is needed', 'warning'],
              ['`incompatible`', 'will not work without active conversion', 'reported'],
            ],
          },
          {
            kind: 'p',
            text: 'The faults worth catching are the ones where the plug seats, the drawing looks right, and no signal arrives. Both cables below merely share a connector.',
          },
          { kind: 'diagram', name: 'docsFaults', filename: 'faults.khm' },
          { kind: 'diagnostics', name: 'docsFaults' },
          {
            kind: 'p',
            text: 'Every verdict carries its reason, and the reason follows through into the cable schedule. The same trap exists for `dmx`↔`xlr`, `rca`↔`spdif`, `adat`↔`spdif`, `composite`↔`component` and `wordclock`↔`sdi`.',
          },
          {
            kind: 'p',
            text: 'A site standard can be stated once, with its reason. The reason reaches the diagnostic and the schedule, so why a connection was allowed is never lost from the drawing.',
          },
          {
            kind: 'code',
            filename: 'compat',
            lines: [
              'compat aes -> xlr : ok    "house standard: under 10m"',
              'compat xlr -> rca : lossy "always through a DI"',
            ],
          },
          { kind: 'p', text: 'The diagnostics you will meet most. Severities are configurable.' },
          {
            kind: 'table',
            head: ['Code', 'Meaning', 'Default'],
            rows: [
              ['`signal-mismatch`', 'the two ends disagree about the signal', 'warning'],
              ['`adapter-required`', 'an adapter is needed but not declared', 'warning'],
              ['`adapter-insufficient`', '`via` declared but no cable can bridge this', 'error'],
              ['`direction-mismatch`', 'output to output, or input to input', 'error'],
              ['`port-overbooked`', 'more than one source into one input', 'error'],
              ['`implicit-device`', 'referred to an undeclared device', 'warning'],
              ['`unconnected-port`', 'a declared port wired to nothing', 'off'],
            ],
          },
          {
            kind: 'note',
            text: 'Nothing throws. Every stage collects diagnostics and returns a best-effort result, so a faulty diagram still renders — **a picture of a flawed system is exactly what an author needs in order to see the flaw**.',
          },
        ],
      },
      {
        id: 'via',
        title: 'Adapters',
        blocks: [
          {
            kind: 'p',
            text: 'Declares that a passive adapter or converting lead sits in the run.',
          },
          { kind: 'diagram', name: 'docsVia', filename: 'via.khm' },
          {
            kind: 'p',
            text: '`via` is not a way to silence a warning. It is **a declaration that puts a part on the schedule**. The link gets a conversion mark and the adapter appears as a line item.',
          },
          {
            kind: 'p',
            text: 'For pairings a cable can genuinely bridge (HDMI↔DVI, DP→HDMI …), declaring `via` clears the diagnostic; leaving it out is still reported, with the required part named. For pairings no cable can bridge (SDI→HDMI …), `via` does not clear it. Those need a powered box, which belongs in the diagram as **a device** rather than as a property of a cable.',
          },
          {
            kind: 'code',
            filename: 'converter.khm',
            lines: [
              '# Wrong: no cable turns SDI into HDMI',
              'cam.SDI -> mon.HDMI : sdi via "SDI-HDMI converter"',
              '',
              '# Right: the converter is a device',
              'device conv "BMD Mini Converter SDI-HDMI" as converter {',
              '  in  SDI  : sdi',
              '  out HDMI : hdmi',
              '}',
              'cam.SDI   -> conv.SDI : sdi',
              'conv.HDMI -> mon.HDMI : hdmi',
            ],
          },
        ],
      },
      {
        id: 'wireless',
        title: 'Wireless',
        blocks: [
          {
            kind: 'p',
            text: 'A radio path is not a cable, so it carries a frequency or a channel where a cable carries a length. It is drawn dashed.',
          },
          { kind: 'diagram', name: 'wireless', filename: 'wireless.khm' },
          {
            kind: 'p',
            text: 'Wire a microphone straight into the desk with no receiver and you get told. The boundary between wireless and wired is judged too.',
          },
        ],
      },
      {
        id: 'library',
        title: 'Equipment libraries',
        blocks: [
          {
            kind: 'p',
            text: "A desk's sixteen channels do not get rewritten per drawing. Define it once with `model`, instantiate as many as you like with `device … from`.",
          },
          { kind: 'diagram', name: 'library', filename: 'library.khm' },
          {
            kind: 'p',
            text: 'Definitions in another file are pulled in with `use`. If an imported file also held devices or connections they are ignored, with a warning: a library is where definitions live, not drawings.',
          },
          {
            kind: 'code',
            filename: 'studio.khm',
            lines: ['use "lib/yamaha.khm"', '', 'device foh from dm3 "FOH desk"'],
          },
        ],
      },
      {
        id: 'theme',
        title: 'Appearance',
        blocks: [
          {
            kind: 'code',
            filename: 'diagram block',
            lines: [
              'diagram "Studio A" {',
              '  direction: LR      # LR (left to right, default) | TB (top to bottom)',
              '  theme: light       # light (default) | dark | mono | blueprint',
              '  spacing: 60        # gap between nodes, px',
              '}',
            ],
          },
          {
            kind: 'table',
            head: ['Theme', 'For'],
            rows: [
              ['`light`', 'Default. Screen and colour print'],
              ['`dark`', 'Dark screens'],
              ['`mono`', '**Black and white print and photocopies**'],
              ['`blueprint`', 'Blueprint colouring, as facility drawings use'],
            ],
          },
          {
            kind: 'p',
            text: '`mono` uses no colour at all. Signals are distinguished by **line style** instead, and a jacket colour given with `[color=…]` is ignored — pretending a colour survived a photocopy helps nobody.',
          },
          { kind: 'diagram', name: 'docsTheme', filename: 'mono.khm' },
          {
            kind: 'note',
            text: 'A theme can also be passed with `-t/--theme`, but a `diagram { theme: … }` in the source wins: the drawing knows how it is meant to look, the caller only knows a default.',
          },
        ],
      },
      {
        id: 'output',
        title: 'Output and embedding',
        blocks: [
          {
            kind: 'p',
            text: 'Besides SVG, it exports an editable draw.io file and TSV cable and equipment schedules.',
          },
          {
            kind: 'p',
            text: 'Markdown takes a `kumihimo` code fence directly; it becomes SVG at build time.',
          },
          {
            kind: 'code',
            filename: 'markdown',
            lines: [
              '```kumihimo',
              'cam.SDI -> sw.1 : sdi 30m "V-01"',
              '```',
              '',
              "import rehypeKumihimo from '@love-rox/kumihimo-rehype';",
              '',
              'unified()',
              '  .use(remarkParse)',
              '  .use(remarkRehype)',
              '  .use(rehypeKumihimo, { theme: "dark", onDiagnostics: report })',
              '  .use(rehypeStringify);',
            ],
          },
          {
            kind: 'p',
            text: 'There are React, Vue and Astro components too. Compiling is asynchronous, so the previous diagram stays on screen while a new one is produced, and a slow earlier compile can never overwrite a newer one.',
          },
          {
            kind: 'code',
            filename: 'React',
            lines: [
              "import { Kumihimo, useKumihimo } from '@love-rox/kumihimo-react';",
              '',
              '<Kumihimo source={src} theme="dark" onDiagnostics={report} />;',
              '',
              'const { svg, diagram, diagnostics, pending, error } = useKumihimo(src);',
            ],
          },
          {
            kind: 'p',
            text: 'Use `onDiagnostics` if you would rather not publish a nice-looking picture of faulty wiring.',
          },
        ],
      },
    ],
  },
};
