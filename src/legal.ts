import type { Lang } from './copy';

export interface Legal {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lede: string;
  ownLicence: string;
  downloadLabel: string;
  noteHeading: string;
  note: string;
  columns: { component: string; role: string; licence: string };
  showText: string;
}

export const LEGAL: Record<Lang, Legal> = {
  ja: {
    title: 'ライセンス表記 — kumihimo',
    description:
      'kumihimo および kumihimo.love-rox.cc が配信する第三者コンポーネントのライセンス表記。ビルド時に実際のパッケージから生成しています。',
    eyebrow: 'LICENSES',
    heading: 'ライセンス表記',
    lede: 'このサイトが配信するものに含まれる第三者コンポーネントの一覧です。ビルド時に、実際にインストールされているパッケージのライセンス本文から生成しているので、依存が変わればここも変わります。',
    ownLicence: 'kumihimo 自体は MIT です。',
    downloadLabel: 'テキストで取得',
    noteHeading: 'elkjs について',
    note: 'elkjs は EPL-2.0 と GPL-3.0-or-later の選択制で提供されています。**このサイトは EPL-2.0 のもとで配布しています。** 配線の経路計算に使っており、エディタを開いたときにブラウザへ届きます。ソースは [github.com/kieler/elkjs](https://github.com/kieler/elkjs) にあります。',
    columns: { component: 'コンポーネント', role: '役割', licence: 'ライセンス' },
    showText: '本文を読む',
  },
  en: {
    title: 'Notices — kumihimo',
    description:
      'Licence notices for kumihimo and the third-party components distributed by kumihimo.love-rox.cc, generated at build time from the packages actually installed.',
    eyebrow: 'LICENSES',
    heading: 'Third-party notices',
    lede: 'Components distributed as part of this site. Generated at build time from the licence texts of the packages actually installed, so this page moves when the dependencies do.',
    ownLicence: 'kumihimo itself is MIT.',
    downloadLabel: 'Plain text',
    noteHeading: 'About elkjs',
    note: "elkjs is offered under EPL-2.0 or GPL-3.0-or-later, at the recipient's option. **This site distributes it under the EPL-2.0.** It routes the cables, and reaches the browser when the editor is opened. Its source is at [github.com/kieler/elkjs](https://github.com/kieler/elkjs).",
    columns: { component: 'Component', role: 'Role', licence: 'Licence' },
    showText: 'Read the text',
  },
};
