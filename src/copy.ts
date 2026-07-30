/**
 * Every string on the page, in both languages.
 *
 * The diagnostics quoted under "what it catches" are the compiler's real Japanese output,
 * so the English page shows a faithful translation beside the same wiring rather than a
 * rewritten claim. Nothing here is a metric, because none has been measured.
 */

export type Lang = 'ja' | 'en';

interface Fault {
  wire: string;
  why: string;
}

interface Note {
  title: string;
  body: string;
}

export interface Copy {
  htmlLang: string;
  title: string;
  description: string;
  otherLangHref: string;
  otherLangLabel: string;

  nav: { catches: string; playground: string; editor: string; search: string };

  hero: {
    eyebrow: string;
    title: string;
    lede: string;
    ledeStrong: string;
    ledeAfter: string;
    tryIt: string;
    install: string;
  };

  catches: { eyebrow: string; title: string; lede: string; faults: Fault[] };

  playground: {
    eyebrow: string;
    title: string;
    lede: string;
    ports: Note;
    wireless: Note;
    library: Note;
  };

  editor: { eyebrow: string; title: string; lede: string };

  install: { eyebrow: string; title: string; cliNote: string; mdNote: string };

  packages: { name: string; what: string }[];
  footerSpec: string;
}

const FAULT_WIRES = [
  'ext.CAT → netsw.1',
  'cam.SDI → sync.REF',
  'cdp.ANALOG → dac.DIGITAL',
  'pc.HDMI → mon.DVI',
  'desk.MAIN → amp.LINE',
];

export const COPY: Record<Lang, Copy> = {
  ja: {
    htmlLang: 'ja',
    title: 'kumihimo — 系統図を、テキストで書く。',
    description:
      'AV の系統図をテキストで書き、SVG を生成します。ポート単位で結線を記述し、ケーブルは挿さるのに何も通らない配線を指摘します。',
    otherLangHref: '/en',
    otherLangLabel: 'English',

    nav: { catches: '検出できるもの', playground: '書き方', editor: '試す', search: '検索・移動' },

    hero: {
      eyebrow: 'AV SIGNAL FLOW · 系統図',
      title: '系統図を、テキストで書く。',
      lede: 'ポート単位で結線を書くと、SVG が出ます。図が描けるだけではありません。',
      ledeStrong: 'ケーブルは気持ちよく挿さるのに、何も通らない配線',
      ledeAfter: 'を、現場に着く前に指摘します。',
      tryIt: 'ブラウザで試す',
      install: 'インストール',
    },

    catches: {
      eyebrow: 'WHAT IT CATCHES',
      title: '挿さるのに、通らない。',
      lede: '検出する価値があるのは、プラグがぴたりと嵌まり、見た目には何もおかしくなく、そして何も出ない組み合わせです。判定には必ず理由が付き、その理由はケーブル表にも残ります。',
      faults: [
        {
          wire: FAULT_WIRES[0]!,
          why: 'HDBaseT は Cat ケーブルと RJ45 を使うが Ethernet ではない。スイッチには挿せない',
        },
        { wire: FAULT_WIRES[1]!, why: 'BNC を共有するだけ。同期基準入力に映像を入れてもロックしない' },
        {
          wire: FAULT_WIRES[2]!,
          why: 'RCA を共有するだけ。アナログ音声を S/PDIF 入力に入れても何も出ない',
        },
        { wire: FAULT_WIRES[3]!, why: 'HDMI-DVI 変換ケーブルが必要。via で明示すると資材表に載る' },
        { wire: FAULT_WIRES[4]!, why: 'バランス→アンバランス。レベルが下がりハムループに晒される' },
      ],
    },

    playground: {
      eyebrow: 'HOW IT READS',
      title: '書いたものが、そのまま出る。',
      lede: '下の図はすべて、左のソースを公開済みのパッケージでビルド時にコンパイルした結果です。',
      ports: {
        title: 'ポートと範囲',
        body: 'CH[1..16] は16本に展開されます。宣言した順序がそのまま図に出るので、IN 1 が IN 2 の下に来ることはありません。',
      },
      wireless: {
        title: '無線',
        body: '無線区間はケーブルではないので、長さの代わりに周波数を持ちます。受信機を通さず卓へ直結すれば、そこで指摘が出ます。',
      },
      library: {
        title: '機材ライブラリ',
        body: '卓の16chを図ごとに書き直す必要はありません。model で一度定義し、device … from で何台でも実体化します。',
      },
    },

    editor: {
      eyebrow: 'LIVE',
      title: 'ここで書けます。',
      lede: '左に書くと右に出ます。診断をクリックすると該当行へ飛びます。',
    },

    install: {
      eyebrow: 'INSTALL',
      title: '入れて、書く。',
      cliNote: '# コマンドラインで使う',
      mdNote: '# Markdown に埋め込む',
    },

    packages: [
      { name: '@love-rox/kumihimo-cli', what: 'build / check / export / watch' },
      { name: '@love-rox/kumihimo-core', what: 'パーサ・検証・レイアウト・SVG' },
      { name: '@love-rox/kumihimo-editor', what: '埋め込み型ライブエディタ' },
      { name: '@love-rox/kumihimo-rehype', what: 'Markdown のコードフェンス' },
      { name: '@love-rox/kumihimo-react', what: 'React コンポーネント' },
      { name: '@love-rox/kumihimo-vue', what: 'Vue 3 コンポーネント' },
      { name: '@love-rox/kumihimo-astro', what: 'Astro 統合' },
    ],
    footerSpec: '仕様',
  },

  en: {
    htmlLang: 'en',
    title: 'kumihimo — AV signal flow diagrams, written as text.',
    description:
      'Write AV signal flow diagrams as text and get SVG. Connections are port to port, and the wiring that plugs in perfectly and carries nothing gets flagged before anyone reaches site.',
    otherLangHref: '/',
    otherLangLabel: '日本語',

    nav: { catches: 'What it catches', playground: 'How it reads', editor: 'Try it', search: 'Search' },

    hero: {
      eyebrow: 'AV SIGNAL FLOW · 系統図',
      title: 'Wiring you can write.',
      lede: 'Describe connections port to port and get SVG. It does more than draw: it flags ',
      ledeStrong: 'the cable that seats perfectly and carries nothing',
      ledeAfter: ' before anyone reaches site.',
      tryIt: 'Try it here',
      install: 'Install',
    },

    catches: {
      eyebrow: 'WHAT IT CATCHES',
      title: 'It fits. It does nothing.',
      lede: 'The faults worth catching are the ones where the plug seats, the drawing looks right, and no signal arrives. Every verdict carries its reason, and the reason follows through into the cable schedule.',
      faults: [
        {
          wire: FAULT_WIRES[0]!,
          why: 'HDBaseT uses Cat cable and RJ45 but is not Ethernet. It does not go into a switch',
        },
        {
          wire: FAULT_WIRES[1]!,
          why: 'They only share BNC. A reference input will not lock to video',
        },
        {
          wire: FAULT_WIRES[2]!,
          why: 'They only share RCA. Analogue audio into a S/PDIF input produces nothing',
        },
        {
          wire: FAULT_WIRES[3]!,
          why: 'Needs an HDMI-DVI cable. Declare it with via and it lands on the parts list',
        },
        {
          wire: FAULT_WIRES[4]!,
          why: 'Balanced to unbalanced: level drop and hum-loop exposure',
        },
      ],
    },

    playground: {
      eyebrow: 'HOW IT READS',
      title: 'What you write is what comes out.',
      lede: 'Every diagram below was compiled at build time by the published package from the source beside it.',
      ports: {
        title: 'Ports and ranges',
        body: 'CH[1..16] expands to sixteen. Declaration order is drawn, so IN 1 never ends up below IN 2.',
      },
      wireless: {
        title: 'Wireless',
        body: 'A radio path is not a cable, so it carries a frequency where a cable carries a length. Wire it straight into the desk with no receiver and you get told.',
      },
      library: {
        title: 'Equipment libraries',
        body: "A desk's sixteen channels do not get rewritten per drawing. Define it once with model, instantiate as many as you like with device … from.",
      },
    },

    editor: {
      eyebrow: 'LIVE',
      title: 'Write it here.',
      lede: 'Type on the left, watch the right. Click a diagnostic to jump to the line.',
    },

    install: {
      eyebrow: 'INSTALL',
      title: 'Install it, write it.',
      cliNote: '# on the command line',
      mdNote: '# embedded in Markdown',
    },

    packages: [
      { name: '@love-rox/kumihimo-cli', what: 'build / check / export / watch' },
      { name: '@love-rox/kumihimo-core', what: 'parser, validator, layout, SVG' },
      { name: '@love-rox/kumihimo-editor', what: 'embeddable live editor' },
      { name: '@love-rox/kumihimo-rehype', what: 'Markdown code fences' },
      { name: '@love-rox/kumihimo-react', what: 'React component' },
      { name: '@love-rox/kumihimo-vue', what: 'Vue 3 component' },
      { name: '@love-rox/kumihimo-astro', what: 'Astro integration' },
    ],
    footerSpec: 'Spec',
  },
};
