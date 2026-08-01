/**
 * Recipes: how to write a particular thing, in both languages.
 *
 * The guide explains the language a piece at a time. This answers the other question —
 * "I have *this* in front of me, how do I write it" — so every entry starts from a
 * situation rather than from a keyword, and several of them exist only to sit next to each
 * other. A moulded lead and a distribution panel are written differently and produce
 * different lists, and neither is understandable without the other beside it.
 *
 * Every source here is compiled by the published package at build time and every table is
 * the table it actually produced. Nothing is described from memory; nothing is redrawn.
 */

import type { Lang } from './copy';
import type { Block } from './docs';

export interface Recipe {
  id: string;
  /** The situation, as somebody would say it out loud. */
  title: string;
  /** What the answer turns on. One line, read before the code. */
  gist: string;
  blocks: Block[];
}

export interface Examples {
  title: string;
  description: string;
  eyebrow: string;
  heading: string;
  lede: string;
  tocLabel: string;
  docsLabel: string;
  recipes: Recipe[];
}

export const EXAMPLES: Record<Lang, Examples> = {
  ja: {
    title: '記述例 — kumihimo でこう書く',
    description:
      '実際の現場をそのまま kumihimo で書いた例を並べています。基本のつなぎ方から、変換ケーブルと変換アダプタの書き分け、無線と搬送、長さ未定まで。図も表もすべて公開済みパッケージがビルド時に出力したものです。',
    eyebrow: 'EXAMPLES',
    heading: '記述例',
    lede: '「これはどう書くのか」に答えるページです。図の下にケーブル表と部材表を出しているものがあります。表に何が出るかが答えそのものである例が多く、そこが読めないと書き分けた意味がわかりません。',
    tocLabel: '目次',
    docsLabel: '文法の説明',
    recipes: [
      {
        id: 'basic',
        title: 'カメラをスイッチャーにつなぐ',
        gist: 'ポートを宣言して、つなぐ。最小の1枚はこれだけです。',
        blocks: [
          {
            kind: 'p',
            text: '機材に**口を宣言**して、**口と口をつなぎます**。`out SDI : sdi` は「SDI という名前の出力が1つあり、そこを通るのは SDI 信号」という意味です。',
          },
          { kind: 'diagram', name: 'exBasic', filename: 'basic.khm' },
          {
            kind: 'p',
            text: '`cam` `sw` `SDI` `1` は自分で決める名前です。`camera` `switcher` `sdi` は決められた語から選びます。どちらがどちらかは下の**「自由に決める語と、選ぶ語」**にまとめてあります。',
          },
          { kind: 'schedule', name: 'exBasic', of: 'cable' },
          {
            kind: 'note',
            text: '長さもケーブル番号も書いていないので、表の該当欄は空です。**何も書いていない**ことと**未定と書いた**ことは別で、その区別は下の「長さがまだわからない」にあります。',
          },
        ],
      },
      {
        id: 'length',
        title: '長さ・ケーブル番号・被覆の色を書く',
        gist: '信号名のうしろに、長さ、番号、色の順で足します。',
        blocks: [
          {
            kind: 'p',
            text: '結線に足せるものは決まった順に並びます。**長さ**、**"番号"**、**`[color=…]`**。どれも省けます。',
          },
          { kind: 'diagram', name: 'exLength', filename: 'length.khm' },
          { kind: 'schedule', name: 'exLength', of: 'cable' },
          {
            kind: 'p',
            text: '番号は現場で読み上げるものなので、そのまま表の1列目になります。色は図の線の色になり、**白黒で刷るときは `theme: mono`** にすると色ではなく線種で描き分けます。',
          },
        ],
      },
      {
        id: 'unknown',
        title: '長さがまだわからない',
        gist: '`?m` と書きます。空欄のままにするのとは別の意味になります。',
        blocks: [
          {
            kind: 'p',
            text: '長さを省くことは元からできました。ただその空欄は2つの意味を同時に持っていました。**「まだ測っていない」**と**「誰も考えていない」**です。van に積む人が見る表では、片方だけが残っている仕事です。',
          },
          { kind: 'diagram', name: 'exUnknown', filename: 'unknown.khm' },
          { kind: 'schedule', name: 'exUnknown', of: 'cable' },
          {
            kind: 'p',
            text: '`?m` は表に `?m` と出ます。単位は書きます。**どの単位で測るかは未定の対象ではない**からです。`?m` `?ft` など、この言語が知っている単位すべてが使えます。',
          },
          {
            kind: 'note',
            text: '`?m` も長さなので、長さとして扱われます。無線区間には書けませんし、`adapter` の端に書けばその端は**ソケット**になります（下の「変換ケーブルと変換アダプタ」）。',
          },
        ],
      },
      {
        id: 'many',
        title: '同じつなぎ方を何本もまとめて書く',
        gist: '宣言では `1..4`、結線では `(1, 2, 3, 4)` です。',
        blocks: [
          {
            kind: 'p',
            text: '口の宣言は範囲で書けます。`in 1..4 : sdi` は4つの入力です。`in CH[1..16] : xlr` のように**接頭辞つき**でも書けます。',
          },
          { kind: 'diagram', name: 'exMany', filename: 'many.khm' },
          { kind: 'schedule', name: 'exMany', of: 'cable' },
          {
            kind: 'p',
            text: '結線側は**括弧に並べます**。左右の数が揃っていれば順に結ばれ、4本の別々の結線になります。表も4行です。',
          },
          {
            kind: 'note',
            text: '結線では `sw.(1..4)` という範囲の書き方は使えません。**これは意図的です。** 口の並びは連番であることが多いので宣言では範囲が便利ですが、結線を範囲で書くと、片側の口が1つずれただけで**黙って全部が1つずれた結線になります**。図は正しく描かれ、表も正しく出て、現場で挿すまで誰も気づきません。並べて書けば、数が合わないことがその場でわかります。',
          },
        ],
      },
      {
        id: 'lead',
        title: '変換ケーブル1本ですませる（HDMI-DVI など）',
        gist: '`via` で結線に添えます。1本のケーブルなので1行です。',
        blocks: [
          {
            kind: 'p',
            text: 'HDMI-DVI のケーブルは、**切れ目のない1本**です。途中に止まる場所はありません。だからこれは結線に添える情報で、`via` で書きます。',
          },
          { kind: 'diagram', name: 'docsVia', filename: 'lead.khm' },
          { kind: 'schedule', name: 'docsVia', of: 'cable' },
          { kind: 'schedule', name: 'docsVia', of: 'parts' },
          {
            kind: 'p',
            text: '**ケーブル表に1行、部材表は空**です。1個の物は1行になります。これを `adapter` で書くと図の途中に箱が立ち、1本のケーブルが2本に見えてしまいます。',
          },
        ],
      },
      {
        id: 'dongle',
        title: '片側がケーブル一体の変換アダプタ（USB-HDMI など）',
        gist: '端の数ではなく、**どの端がソケットか**で決まります。',
        blocks: [
          {
            kind: 'p',
            text: 'USB-HDMI の変換は端が2つですが、これは**分岐点**です。USB 側は生えていて、HDMI 側はソケットで、そこに届くケーブルは誰かが持っていく1本だからです。前項の HDMI-DVI ケーブルも端は2つで、こちらは1本です。**端の数では区別できません。**',
          },
          {
            kind: 'note',
            text: '**結線は、長さかケーブル番号が書かれていなければ一体です。** この1つの規則が表を決めます。',
          },
          { kind: 'diagram', name: 'exDongle', filename: 'dongle.khm' },
          { kind: 'schedule', name: 'exDongle', of: 'cable' },
          { kind: 'schedule', name: 'exDongle', of: 'parts' },
          {
            kind: 'p',
            text: 'USB 側には何も書いていないので**一体**と読まれ、ケーブル表に出ません。HDMI 側には `5m "V-01"` があるので**ソケット**と読まれ、持っていくケーブルとして1行出ます。変換器そのものは部材表に1個。**現場で必要なものと過不足なく一致します。**',
          },
        ],
      },
      {
        id: 'panel',
        title: '分配パネルのように、口が全部ソケットのもの',
        gist: '差し込む先の数だけケーブルが要ります。',
        blocks: [
          {
            kind: 'p',
            text: '同じ `adapter` でも、口が全部ソケットならケーブルはその数だけ要ります。前項との違いは書き方ではなく、**それぞれの結線に長さと番号を書いたかどうか**だけです。',
          },
          { kind: 'diagram', name: 'exPanel', filename: 'panel.khm' },
          { kind: 'schedule', name: 'exPanel', of: 'cable' },
          { kind: 'schedule', name: 'exPanel', of: 'parts' },
          {
            kind: 'p',
            text: '**3本と、パネル1枚。**端がいくつあっても規則は同じです。',
          },
        ],
      },
      {
        id: 'moulded',
        title: '成型の分岐ケーブル（4分岐など）',
        gist: '`as cable` を足すと、部材ではなくケーブル表に出ます。',
        blocks: [
          {
            kind: 'p',
            text: '尻尾が全部成型された分岐ケーブルは、**部材であると同時にケーブル**です。van に積まれ、番号が振られ、積む人が見るのはケーブル表です。部材表にだけ載せると、その人の見る紙に載りません。',
          },
          { kind: 'diagram', name: 'exMoulded', filename: 'moulded.khm' },
          { kind: 'schedule', name: 'exMoulded', of: 'cable' },
          { kind: 'schedule', name: 'exMoulded', of: 'parts' },
          {
            kind: 'p',
            text: '**1個の物が1行**です。プラグごとに3行にはなりません。届く先はまとめて並びます。部材表からは外れるので、二重に数えられません。',
          },
          {
            kind: 'note',
            text: '`as cable` のうしろには結線と同じように長さとケーブル番号を書けます。書くものが同じなのは、指しているものが同じ**誰かが探して測って番号を振るケーブル**だからです。',
          },
        ],
      },
      {
        id: 'split',
        title: 'TRRS を TRS 2本に分ける',
        gist: '同じ形の物が2通りあります。分かれ目は結線に長さを書いたかどうかだけです。',
        blocks: [
          {
            kind: 'p',
            text: '**1本のケーブルとして**書く場合。ヘッドセット分岐のように、TRRS のプラグから2本の尻尾が生えている物です。',
          },
          { kind: 'diagram', name: 'exSplitLead', filename: 'splitter-lead.khm' },
          { kind: 'schedule', name: 'exSplitLead', of: 'cable' },
          { kind: 'schedule', name: 'exSplitLead', of: 'parts' },
          {
            kind: 'p',
            text: '**結線には何も書きません。** `: trrs35` `: trs35` だけです。長さもケーブル番号も付けない。書いた瞬間そこは**ソケット**になり、「別途ケーブルが要る」という意味に変わります。1本なので書きません。長さと番号は `as cable` のうしろに、**物として1つ**だけ付けます。',
          },
          {
            kind: 'p',
            text: '次は**差し込み口がある分岐アダプタ**として書く場合。宣言はほとんど同じです。',
          },
          { kind: 'diagram', name: 'exSplitPanel', filename: 'splitter-panel.khm' },
          { kind: 'schedule', name: 'exSplitPanel', of: 'cable' },
          { kind: 'schedule', name: 'exSplitPanel', of: 'parts' },
          {
            kind: 'table',
            head: ['', '1本のケーブル', '分岐アダプタ'],
            rows: [
              ['`as cable "A-01"`', '**付ける**', '付けない'],
              ['各結線の長さ・番号', '書かない', '**書く**'],
              ['ケーブル表', '1行', '2行'],
              ['部材表', '空', '1個'],
            ],
          },
          {
            kind: 'p',
            text: '**変えたのは2か所だけ**です。どちらも PC 側には何も書いていないので、TRRS のプラグが生えている点は共通しています。分岐アダプタの側で部材表の「つながる先」にノートPC が入っているのはそのためです。',
          },
          {
            kind: 'note',
            text: '現場での判断はこれだけです — **その口に別のケーブルを挿すか**。挿すなら長さか番号を書く、挿さないなら書かない。',
          },
        ],
      },
      {
        id: 'wireless',
        title: 'ワイヤレスマイクを書く',
        gist: '無線の信号型を使えば、線ではなく波として描かれます。',
        blocks: [
          {
            kind: 'p',
            text: '`uhf` のような無線の信号型は**コネクタを持ちません**。長さも書けません。代わりに `[ch=…]` でチャンネルを書きます。',
          },
          { kind: 'diagram', name: 'wireless', filename: 'wireless.khm' },
          { kind: 'schedule', name: 'wireless', of: 'cable' },
          { kind: 'schedule', name: 'wireless', of: 'wireless' },
          {
            kind: 'p',
            text: '**2枚に分かれます。** ケーブル表に出るのは受信機から卓までの XLR 1本だけで、電波の区間は無線表です。長さもコネクタも巻くものも無い行がケーブル表にあると、**測り忘れたケーブル**に見えてしまうためです。',
          },
          {
            kind: 'note',
            text: '2枚は別の人が別のものを探して読みます。**届く長さがあるか**と、**同じチャンネルが2系統で重なっていないか**です。',
          },
        ],
      },
      {
        id: 'over',
        title: '無線 LAN 経由の NDI のように、何かに乗っている信号',
        gist: '`over` で「中身」と「乗り物」を分けて書きます。',
        blocks: [
          {
            kind: 'p',
            text: 'NDI は映像ですが、流れているのは Ethernet です。無線 LAN なら電波です。**図が語りたいのは NDI で、物理を決めるのは Ethernet や WiFi** です。`over` はこの2つを分けます。',
          },
          { kind: 'diagram', name: 'exOver', filename: 'over.khm' },
          { kind: 'schedule', name: 'exOver', of: 'cable' },
          { kind: 'schedule', name: 'exOver', of: 'wireless' },
          {
            kind: 'p',
            text: '**乗り物が物理を決めます。** 同じ NDI が2枚に分かれました。`over wifi` の区間は無線表で、コネクタを持たずチャンネルを持ちます。`over lan` の区間はケーブル表で、RJ45 と長さと番号を持ちます。**中身が同じでも乗り物で行き先が変わる**のが、`over` の効き方そのものです。',
          },
          {
            kind: 'p',
            text: '無線表の**乗り物**の欄には `Wi-Fi` が入ります。**名前は中身のもの、周波数は乗り物のもの**なので、列が分かれています。前の項のワイヤレスマイクではこの欄が空でした。`uhf` は自分自身の乗り物で、「UHF が UHF に乗っている」とは書く意味がないからです。',
          },
          {
            kind: 'note',
            text: '`over` を書かなければ、信号は自分自身の乗り物です。これまでどおりの動きになります。',
          },
        ],
      },
      {
        id: 'dante',
        title: '同じ LAN に Dante と NDI が同居する',
        gist: '乗り物が同じでも、中身が違えば別の線として描かれます。',
        blocks: [
          {
            kind: 'p',
            text: '1本の Cat ケーブルに何が乗っているかは、現場では別々の関心事です。`over` で書き分ければ、**同じ RJ45 でも図の上では別の系統**として読めます。',
          },
          { kind: 'diagram', name: 'exDante', filename: 'dante.khm' },
          { kind: 'schedule', name: 'exDante', of: 'cable' },
        ],
      },
      {
        id: 'group',
        title: '場所ごとにまとめる',
        gist: '`group` で囲むと、図でも囲まれます。',
        blocks: [
          {
            kind: 'p',
            text: 'ステージ、ラック、調整室。**置き場所が違うものは違う場所に描かれてほしい**ので、`group` で囲みます。',
          },
          { kind: 'diagram', name: 'docsGroup', filename: 'group.khm' },
          { kind: 'schedule', name: 'docsGroup', of: 'equipment' },
          {
            kind: 'p',
            text: '機材表にはグループが列として出ます。`diagram "会場" { direction: LR }` で向きを変えられます。',
          },
        ],
      },
      {
        id: 'gap',
        title: '口の並びに切れ目を入れる',
        gist: '`gap` は実物のパネルの余白です。',
        blocks: [
          {
            kind: 'p',
            text: '実物のパネルには区切りがあります。図がそれと違う並びだと、**図を見ながら現物を触る人が数え間違えます**。`gap` はその余白です。`gap 2` で2つぶん空きます。',
          },
          { kind: 'diagram', name: 'docsGap', filename: 'gap.khm' },
        ],
      },
      {
        id: 'library',
        title: '同じ機材を何台も置く',
        gist: '`model` で一度書いて、`from` で呼びます。',
        blocks: [
          {
            kind: 'p',
            text: '同じ卓を2台置くとき、口の一覧を2回書く必要はありません。`model` に書いて `device … from …` で呼びます。**名前だけ変えられます。**',
          },
          { kind: 'diagram', name: 'library', filename: 'library.khm' },
          {
            kind: 'p',
            text: '`@vendor "Yamaha"` のような注記も付けられます。機材表に出ます。',
          },
        ],
      },
      {
        id: 'faults',
        title: '挿さらない組み合わせを見つけてもらう',
        gist: 'コネクタが同じでも通らないものを指摘します。',
        blocks: [
          {
            kind: 'p',
            text: '**形が合うことと通ることは別**です。HDBaseT は Cat ケーブルと RJ45 を使いますが Ethernet ではないので、スイッチには挿せません。SDI と同期基準は BNC を共有しますが、映像を入れてもロックしません。',
          },
          { kind: 'diagram', name: 'docsFaults', filename: 'faults.khm' },
          { kind: 'diagnostics', name: 'docsFaults' },
          {
            kind: 'p',
            text: 'これは**このページのビルドが実際に出した文言**です。警告は既定ではビルドを止めません。止めたいときは `--strict` を付けます。',
          },
        ],
      },
      {
        id: 'theme',
        title: '白黒で刷る',
        gist: '`theme: mono` にすると色ではなく線種で描き分けます。',
        blocks: [
          {
            kind: 'p',
            text: '現場に持っていく紙は白黒のことがあります。色だけで描き分けた図は、刷った瞬間に読めなくなります。',
          },
          { kind: 'diagram', name: 'docsTheme', filename: 'mono.khm' },
          {
            kind: 'p',
            text: '`[color=青]` はそのまま残しておいて構いません。**mono のときは線種に置き換えられます。**選べるテーマは次のとおりです。',
          },
          { kind: 'vocabulary', of: 'themes' },
        ],
      },
      {
        id: 'words',
        title: '自由に決める語と、選ぶ語',
        gist: '名前は自分で決め、種別と信号型は一覧から選びます。',
        blocks: [
          {
            kind: 'p',
            text: 'どの語を自分で決められて、どの語が決まっているのかがわかりにくい、というのはもっともです。分かれ目は1つです。**あなたの現場を指す語は自由、この言語が意味を知っている語は一覧から**。',
          },
          {
            kind: 'table',
            head: ['書く場所', 'どちらか', '例'],
            rows: [
              ['機材の id（`device` の直後）', '**自由**', '`cam1` `foh` `sw`'],
              ['表示名（`"…"`）', '**自由**', '`"FX3"` `"モニター卓"`'],
              ['ポート名', '**自由**', '`SDI` `1..4` `CH[1..16]`'],
              ['ケーブル番号（`"…"`）', '**自由**', '`"V-01"` `"A-12"`'],
              ['注記（`@…`）', '**自由**', '`@vendor "Yamaha"`'],
              ['機材種別（`as …`）', '**一覧から**', '`camera` `mixer` `router`'],
              ['信号型（`: …`）', '**一覧から**', '`sdi` `xlr` `dante`'],
              ['単位', '**一覧から**', '`m` `cm` `ft`'],
              ['色（`[color=…]`）', '**一覧から**', '`青` `blue`'],
              ['テーマ', '**一覧から**', '`light` `mono`'],
            ],
          },
          {
            kind: 'note',
            text: '一覧にない信号型が要るときは `signal` で自分で定義できます。一覧は**閉じてはいません**。以下はすべて公開済みパッケージから読み出したもので、手で書き写したものではありません。',
          },
          { kind: 'p', text: '**機材種別** — `as` のうしろに書きます。' },
          { kind: 'vocabulary', of: 'kinds' },
          { kind: 'p', text: '**単位**' },
          { kind: 'vocabulary', of: 'units' },
          { kind: 'p', text: '**色** — 日本語と英語のどちらでも書けます。' },
          { kind: 'vocabulary', of: 'colours' },
          {
            kind: 'p',
            text: '**信号型** — `:` のうしろに書きます。コネクタも載せてあります。**コネクタなし**は無線です。',
          },
          { kind: 'vocabulary', of: 'signals' },
        ],
      },
    ],
  },

  en: {
    title: 'Recipes — how to write it in kumihimo',
    description:
      'Real situations written out in kumihimo: the basics, telling a conversion lead apart from an adapter, radio and carriers, and a length nobody has measured yet. Every diagram and every table was produced by the published package at build time.',
    eyebrow: 'EXAMPLES',
    heading: 'Recipes',
    lede: 'A page for the question "I have this in front of me — how do I write it". Several entries print the cable schedule and the parts list under the drawing, because for those the tables *are* the answer, and the distinction being drawn is invisible without them.',
    tocLabel: 'Contents',
    docsLabel: 'The guide',
    recipes: [
      {
        id: 'basic',
        title: 'Plug a camera into a switcher',
        gist: 'Declare the sockets, connect them. The smallest complete drawing is this.',
        blocks: [
          {
            kind: 'p',
            text: 'Give a device its **sockets**, then **join socket to socket**. `out SDI : sdi` means "there is one output called SDI, and what goes through it is an SDI signal".',
          },
          { kind: 'diagram', name: 'exBasic', filename: 'basic.khm' },
          {
            kind: 'p',
            text: '`cam`, `sw`, `SDI` and `1` are names you choose. `camera`, `switcher` and `sdi` come from a fixed list. Which is which is set out under **"Words you choose, words you pick"** below.',
          },
          { kind: 'schedule', name: 'exBasic', of: 'cable' },
          {
            kind: 'note',
            text: 'No length and no cable number were written, so those columns are blank. **Saying nothing** and **saying "not measured yet"** are different, and that difference is under "A length nobody has measured yet".',
          },
        ],
      },
      {
        id: 'length',
        title: 'Write a length, a cable number and a jacket colour',
        gist: 'They follow the signal, in that order.',
        blocks: [
          {
            kind: 'p',
            text: 'What a run can carry comes in a fixed order: **length**, **"number"**, **`[color=…]`**. Any of them can be left out.',
          },
          { kind: 'diagram', name: 'exLength', filename: 'length.khm' },
          { kind: 'schedule', name: 'exLength', of: 'cable' },
          {
            kind: 'p',
            text: 'The number is what gets read aloud on site, so it is the first column of the schedule. The colour becomes the colour of the line — and **`theme: mono` for printing**, which draws the difference with line styles instead.',
          },
        ],
      },
      {
        id: 'unknown',
        title: 'A length nobody has measured yet',
        gist: 'Write `?m`. It means something different from leaving it blank.',
        blocks: [
          {
            kind: 'p',
            text: 'Leaving the length off already worked, and the blank it produced meant two things at once: **"not measured"** and **"nobody thought about it"**. On a list somebody packs a van from, only one of those is a job still to do.',
          },
          { kind: 'diagram', name: 'exUnknown', filename: 'unknown.khm' },
          { kind: 'schedule', name: 'exUnknown', of: 'cable' },
          {
            kind: 'p',
            text: '`?m` prints as `?m`. The unit is still written, because **which unit it will be measured in is not the open question**. `?m`, `?ft`, and any other unit the language knows.',
          },
          {
            kind: 'note',
            text: '`?m` is still a length, and is treated as one. A radio path refuses it, and on an adapter it makes that end a **socket** (see "A lead, and a thing beside a cable").',
          },
        ],
      },
      {
        id: 'many',
        title: 'Write many identical runs at once',
        gist: '`1..4` in a declaration, `(1, 2, 3, 4)` in a connection.',
        blocks: [
          {
            kind: 'p',
            text: 'Sockets can be declared as a range. `in 1..4 : sdi` is four inputs. `in CH[1..16] : xlr` does the same **with a prefix**.',
          },
          { kind: 'diagram', name: 'exMany', filename: 'many.khm' },
          { kind: 'schedule', name: 'exMany', of: 'cable' },
          {
            kind: 'p',
            text: 'A connection **lists them in brackets**. Matching counts pair up in order, and the result is four separate runs — four rows.',
          },
          {
            kind: 'note',
            text: 'A connection will not take `sw.(1..4)`, and that is **deliberate**. Sockets usually are numbered in a row, so a range earns its place in a declaration. A range in a *connection* means one socket out of step silently wires **everything** one out of step: the drawing comes out right, the schedules come out right, and nobody finds out until they are plugging it in. Listed out, a count that does not match is visible where it is written.',
          },
        ],
      },
      {
        id: 'lead',
        title: 'One conversion lead does the job (HDMI-DVI and friends)',
        gist: '`via` on the run. It is one cable, so it is one row.',
        blocks: [
          {
            kind: 'p',
            text: 'An HDMI-DVI cable is **one unbroken run**. Nothing stops in the middle of it. So it is something the run carries, and it is written with `via`.',
          },
          { kind: 'diagram', name: 'docsVia', filename: 'lead.khm' },
          { kind: 'schedule', name: 'docsVia', of: 'cable' },
          { kind: 'schedule', name: 'docsVia', of: 'parts' },
          {
            kind: 'p',
            text: '**One cable row, an empty parts list.** One object, one row. Written as an `adapter` it would put a box in the middle of the drawing and turn one cable into what looks like two.',
          },
        ],
      },
      {
        id: 'dongle',
        title: 'A lead, and a thing beside a cable (USB-HDMI and friends)',
        gist: 'Not the number of ends — **which ends are sockets**.',
        blocks: [
          {
            kind: 'p',
            text: 'A USB-HDMI adapter has two ends and is a **junction**: the USB tail is moulded on, the HDMI side is a socket, and the cable reaching it is one somebody has to bring. The HDMI-DVI lead above also has two ends, and is one cable. **The count cannot tell them apart.**',
          },
          {
            kind: 'note',
            text: '**A run is captive unless it carries a length or a cable number.** That one rule decides the schedules.',
          },
          { kind: 'diagram', name: 'exDongle', filename: 'dongle.khm' },
          { kind: 'schedule', name: 'exDongle', of: 'cable' },
          { kind: 'schedule', name: 'exDongle', of: 'parts' },
          {
            kind: 'p',
            text: 'Nothing is written on the USB side, so it reads as **moulded on** and produces no cable row. The HDMI side carries `5m "V-01"`, so it reads as a **socket** and produces one cable to bring. The adapter itself is one part. **Exactly what has to be in the case, and nothing else.**',
          },
        ],
      },
      {
        id: 'panel',
        title: 'A distribution panel, where every socket is a socket',
        gist: 'One cable per thing plugged into it.',
        blocks: [
          {
            kind: 'p',
            text: 'The same `adapter`, with sockets all round, needs one cable per socket. The difference from the previous recipe is not how it is written — it is **whether each run carries a length and a number**.',
          },
          { kind: 'diagram', name: 'exPanel', filename: 'panel.khm' },
          { kind: 'schedule', name: 'exPanel', of: 'cable' },
          { kind: 'schedule', name: 'exPanel', of: 'parts' },
          {
            kind: 'p',
            text: '**Three cables and one panel.** The rule holds at any number of ends.',
          },
        ],
      },
      {
        id: 'moulded',
        title: 'A moulded fan-out lead',
        gist: 'Add `as cable` and it goes on the cable schedule instead of the parts list.',
        blocks: [
          {
            kind: 'p',
            text: 'A fan-out whose tails are all moulded is **a part and a cable at once**. It goes in the van, it gets a number, and the person loading reads the cable schedule. On the parts list alone it is missing from the sheet they read.',
          },
          { kind: 'diagram', name: 'exMoulded', filename: 'moulded.khm' },
          { kind: 'schedule', name: 'exMoulded', of: 'cable' },
          { kind: 'schedule', name: 'exMoulded', of: 'parts' },
          {
            kind: 'p',
            text: '**One object, one row** — not one per plug. The far ends are listed together. It leaves the parts list, so it is not counted twice.',
          },
          {
            kind: 'note',
            text: '`as cable` takes a length and a cable number, the same ones a run takes. They describe the same thing: a cable somebody has to find, measure and label.',
          },
        ],
      },
      {
        id: 'split',
        title: 'Split a TRRS into two TRS',
        gist: 'Two objects of the same shape. What separates them is whether the runs carry a length.',
        blocks: [
          {
            kind: 'p',
            text: 'First as **one cable** — a headset splitter, where two tails come off the TRRS plug.',
          },
          { kind: 'diagram', name: 'exSplitLead', filename: 'splitter-lead.khm' },
          { kind: 'schedule', name: 'exSplitLead', of: 'cable' },
          { kind: 'schedule', name: 'exSplitLead', of: 'parts' },
          {
            kind: 'p',
            text: '**The runs carry nothing** — just `: trrs35` and `: trs35`. No length, no cable number. Writing one makes that end a **socket**, which means "and a separate cable to reach it". This is one object, so nothing is written. The length and the number go after `as cable`, **once, for the object**.',
          },
          {
            kind: 'p',
            text: 'Now the same shape as a **splitter with sockets**. The declaration is almost identical.',
          },
          { kind: 'diagram', name: 'exSplitPanel', filename: 'splitter-panel.khm' },
          { kind: 'schedule', name: 'exSplitPanel', of: 'cable' },
          { kind: 'schedule', name: 'exSplitPanel', of: 'parts' },
          {
            kind: 'table',
            head: ['', 'One cable', 'A splitter'],
            rows: [
              ['`as cable "A-01"`', '**yes**', 'no'],
              ['Length/number on each run', 'no', '**yes**'],
              ['Cable schedule', '1 row', '2 rows'],
              ['Parts list', 'empty', '1'],
            ],
          },
          {
            kind: 'p',
            text: '**Two changes, and that is all.** Neither writes anything on the PC side, so in both readings the TRRS plug is moulded on — which is why the laptop appears among what the splitter reaches on the parts list.',
          },
          {
            kind: 'note',
            text: 'The decision on site is only this: **does something plug into that end**. If it does, give the run a length or a number. If it does not, write neither.',
          },
        ],
      },
      {
        id: 'wireless',
        title: 'A radio mic',
        gist: 'A wireless signal type draws as a wave, not a line.',
        blocks: [
          {
            kind: 'p',
            text: 'A wireless type such as `uhf` **has no connector**, and takes no length. It takes a channel instead, written `[ch=…]`.',
          },
          { kind: 'diagram', name: 'wireless', filename: 'wireless.khm' },
          { kind: 'schedule', name: 'wireless', of: 'cable' },
          { kind: 'schedule', name: 'wireless', of: 'wireless' },
          {
            kind: 'p',
            text: '**Two sheets.** The cable schedule has only the XLR from receiver to desk; the hop through the air is on the wireless one. A row with no length, no connector and nothing to coil, sitting among the cables, reads as **a cable nobody measured**.',
          },
          {
            kind: 'note',
            text: 'The two are read by different people looking for different things: **enough cable to reach**, against **two paths on one channel**.',
          },
        ],
      },
      {
        id: 'over',
        title: 'A signal riding on something else — NDI over Wi-Fi',
        gist: '`over` separates the payload from what carries it.',
        blocks: [
          {
            kind: 'p',
            text: 'NDI is video, but what flows is Ethernet — or, over Wi-Fi, radio. **The drawing is about the NDI; the physics belongs to the Ethernet or the Wi-Fi.** `over` keeps the two apart.',
          },
          { kind: 'diagram', name: 'exOver', filename: 'over.khm' },
          { kind: 'schedule', name: 'exOver', of: 'cable' },
          { kind: 'schedule', name: 'exOver', of: 'wireless' },
          {
            kind: 'p',
            text: '**The carrier decides the physics** — and here the same NDI has landed on two different sheets. The `over wifi` hop is on the wireless one, with no connector and a channel. The `over lan` run is on the cable one, RJ45 with a length and a number. **One payload, sorted by what carries it**, which is `over` working exactly as it says.',
          },
          {
            kind: 'p',
            text: 'The **over** column reads `Wi-Fi`: **the name belongs to the payload and the frequency to the carrier**, which is why they are separate columns. In the radio mic above that column was empty — `uhf` is its own carrier, and "riding on itself" is not worth writing down.',
          },
          {
            kind: 'note',
            text: 'Without `over`, a signal is its own carrier and everything behaves exactly as before.',
          },
        ],
      },
      {
        id: 'dante',
        title: 'Dante and NDI sharing one network',
        gist: 'Same carrier, different payloads, different lines.',
        blocks: [
          {
            kind: 'p',
            text: 'What rides on a given Cat cable is a separate concern on site. Written with `over`, **the same RJ45 reads as two distinct systems** on the drawing.',
          },
          { kind: 'diagram', name: 'exDante', filename: 'dante.khm' },
          { kind: 'schedule', name: 'exDante', of: 'cable' },
        ],
      },
      {
        id: 'group',
        title: 'Group things by where they are',
        gist: '`group` boxes them, and the drawing boxes them too.',
        blocks: [
          {
            kind: 'p',
            text: 'Stage, rack, control room. **Things kept in different places should be drawn in different places**, which is what `group` is for.',
          },
          { kind: 'diagram', name: 'docsGroup', filename: 'group.khm' },
          { kind: 'schedule', name: 'docsGroup', of: 'equipment' },
          {
            kind: 'p',
            text: 'The group becomes a column on the equipment list. `diagram "House" { direction: LR }` turns the drawing.',
          },
        ],
      },
      {
        id: 'gap',
        title: 'Break up a row of sockets',
        gist: '`gap` is the blank space on the real panel.',
        blocks: [
          {
            kind: 'p',
            text: 'Real panels have breaks in them. A drawing laid out differently **makes the person holding it miscount**. `gap` is that blank space; `gap 2` leaves two.',
          },
          { kind: 'diagram', name: 'docsGap', filename: 'gap.khm' },
        ],
      },
      {
        id: 'library',
        title: 'Several of the same device',
        gist: 'Write it once as a `model`, call it with `from`.',
        blocks: [
          {
            kind: 'p',
            text: 'Two identical desks do not need their socket lists written twice. Put it in a `model` and call it with `device … from …`. **Only the name has to change.**',
          },
          { kind: 'diagram', name: 'library', filename: 'library.khm' },
          {
            kind: 'p',
            text: 'Notes like `@vendor "Yamaha"` come along with it, and appear on the equipment list.',
          },
        ],
      },
      {
        id: 'faults',
        title: 'Have the wrong pairings found for you',
        gist: 'Things that fit and still do not work.',
        blocks: [
          {
            kind: 'p',
            text: '**Fitting and working are different.** HDBaseT uses Cat cable and RJ45 but is not Ethernet, so it does not go into a switch. SDI and a reference input share BNC, but video will not lock a genlock.',
          },
          { kind: 'diagram', name: 'docsFaults', filename: 'faults.khm' },
          { kind: 'diagnostics', name: 'docsFaults' },
          {
            kind: 'p',
            text: 'That is **what building this page actually printed**. Warnings do not fail a build by default; `--strict` makes them.',
          },
        ],
      },
      {
        id: 'theme',
        title: 'Print it in black and white',
        gist: '`theme: mono` draws the difference with line styles.',
        blocks: [
          {
            kind: 'p',
            text: 'The copy that goes on site is often monochrome. A drawing that separates its runs by colour alone stops being readable the moment it is printed.',
          },
          { kind: 'diagram', name: 'docsTheme', filename: 'mono.khm' },
          {
            kind: 'p',
            text: '`[color=blue]` can stay exactly where it is. **Under mono it becomes a line style instead.** The themes are:',
          },
          { kind: 'vocabulary', of: 'themes' },
        ],
      },
      {
        id: 'words',
        title: 'Words you choose, words you pick',
        gist: 'Names are yours; kinds and signal types come from a list.',
        blocks: [
          {
            kind: 'p',
            text: 'Which words are free and which are fixed is a fair thing to find unclear. There is one dividing line. **A word that names something in your show is yours; a word the language has to understand comes from a list.**',
          },
          {
            kind: 'table',
            head: ['Where it goes', 'Which', 'For example'],
            rows: [
              ['Device id (after `device`)', '**Yours**', '`cam1` `foh` `sw`'],
              ['Display name (`"…"`)', '**Yours**', '`"FX3"` `"Monitor desk"`'],
              ['Port names', '**Yours**', '`SDI` `1..4` `CH[1..16]`'],
              ['Cable number (`"…"`)', '**Yours**', '`"V-01"` `"A-12"`'],
              ['Notes (`@…`)', '**Yours**', '`@vendor "Yamaha"`'],
              ['Device kind (`as …`)', '**From a list**', '`camera` `mixer` `router`'],
              ['Signal type (`: …`)', '**From a list**', '`sdi` `xlr` `dante`'],
              ['Units', '**From a list**', '`m` `cm` `ft`'],
              ['Colours (`[color=…]`)', '**From a list**', '`blue` `青`'],
              ['Themes', '**From a list**', '`light` `mono`'],
            ],
          },
          {
            kind: 'note',
            text: 'A signal type that is not on the list can be defined with `signal`. The list is **not closed**. Everything below is read out of the published package rather than copied by hand.',
          },
          { kind: 'p', text: '**Device kinds** — what follows `as`.' },
          { kind: 'vocabulary', of: 'kinds' },
          { kind: 'p', text: '**Units**' },
          { kind: 'vocabulary', of: 'units' },
          { kind: 'p', text: '**Colours** — either spelling works.' },
          { kind: 'vocabulary', of: 'colours' },
          {
            kind: 'p',
            text: '**Signal types** — what follows `:`, with their connectors. **No connector** means it is a radio path.',
          },
          { kind: 'vocabulary', of: 'signals' },
        ],
      },
    ],
  },
};
