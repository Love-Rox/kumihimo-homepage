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
  /**
   * A list of accepted words, read out of the compiler at build time.
   *
   * Not written here on purpose. Hand-copying 47 signal types is writing the same thing
   * twice and letting the copy rot — a type added to the language would go on being absent
   * from the page that claims to list them.
   */
  | { kind: 'vocabulary'; of: 'signals' | 'kinds' | 'colours' | 'units' | 'themes' }
  /**
   * A schedule the example actually produces, computed at build time.
   *
   * Much of what the language decides is invisible in the drawing. Whether a moulded tail
   * counts as a cable, whether a part is listed once or twice — none of it changes the
   * picture, and all of it changes the lists somebody packs a van from. A page arguing
   * about that has to print the real table, or it is arguing about nothing the reader can
   * check.
   */
  | { kind: 'schedule'; name: string; of: 'cable' | 'wireless' | 'adapter' | 'equipment' }
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
          {
            kind: 'p',
            text: 'VS Code で書くなら拡張があります。**書きながら診断が出て、隣に図が出ます。** 判定は下の「信号と互換判定」と同じもので、コンパイラがそのまま動いています。',
          },
          {
            kind: 'code',
            filename: 'shell',
            lines: ['code --install-extension love-rox.kumihimo-vscode'],
          },
          {
            kind: 'p',
            text: 'プレビューは `⌘K V`（Windows / Linux は `Ctrl+K V`）、またはタイトルバーのボタンです。エディタの配色に追随し、図・ケーブル表・機器表・変換部材をタブで切り替えられます。補完はコンパイラの一覧そのものから出ます。文言も診断も VS Code の表示言語に追従します。詳しくは[トップページの VS Code の節](/ja#vscode)。',
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
            text: '端子が等間隔で16個並ぶと、16個の同じものにしか見えません。実機はそうではなく、HDMI が4つ、SDI が4つ、アナログが2つ、と面板が余白で区切っています。`gap` の行を置くと、その次に宣言されるものの上に余白が入ります。',
          },
          { kind: 'diagram', name: 'docsGap', filename: 'gap.khm' },
          {
            kind: 'p',
            text: '`gap` ひとつがポート間隔の半分、`gap 2` で1ポート分です。連続して書けば加算されます。複数のポートに展開される宣言でも、余白が入るのは**最初の1つの前だけ**です。`in CH[1..16]` の上の `gap` は `CH1` の前の1箇所であって、16箇所ではありません。',
          },
          {
            kind: 'note',
            text: 'これは見た目だけの指定です。ポートも結線も一覧表も変わりません。**すべての `gap` を消した図は、同じ系統を表します。**',
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
            text: '場所・ラック・サブシステムを枠で囲みます。',
          },
          { kind: 'diagram', name: 'docsGroup', filename: 'group.khm' },
          {
            kind: 'p',
            text: '`group` は `group` を入れられます。会場の中にステージとラックがあり、ステージの中にカメラがある。**現場を歩く人にとってはどちらの階層も実在し**、箱が実際に置かれている場所を指すのは一番内側です。',
          },
          { kind: 'diagram', name: 'docsNested', filename: 'nested.khm' },
          {
            kind: 'note',
            text: '機材が属するのは、それが書かれた `group` であって親ではありません。機材表に出るのは一番内側の名前です。人が歩いていく先がそこだからです。',
          },
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
        id: 'words',
        title: '使える単語',
        blocks: [
          {
            kind: 'p',
            text: 'ここに出ている語は、**このページが公開済みのパッケージから読み出したもの**です。手で書き写した一覧ではないので、コンパイラが受け付けない語が載ることも、受け付ける語が抜けることもありません。VS Code の補完も同じ出どころです。',
          },
          { kind: 'p', text: '**信号種別** — ポートと結線の `:` の後に書きます。' },
          { kind: 'vocabulary', of: 'signals' },
          {
            kind: 'note',
            text: '一覧に無い信号は `signal` で自分で定義できます。「信号と互換判定」を参照してください。',
          },
          { kind: 'p', text: '**機材種別** — `device … as` の後に書きます。' },
          { kind: 'vocabulary', of: 'kinds' },
          {
            kind: 'p',
            text: '**ケーブル色** — `[color=…]` に書きます。英語と日本語のどちらでも同じ色になります。`#0af` のような16進表記も使えます。',
          },
          { kind: 'vocabulary', of: 'colours' },
          {
            kind: 'p',
            text: '**長さの単位** — 数値に続けて書きます。`30m` `6ft` のように空白を空けません。',
          },
          { kind: 'vocabulary', of: 'units' },
          { kind: 'p', text: '**テーマ** — `diagram { theme: … }` に書きます。' },
          { kind: 'vocabulary', of: 'themes' },
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
        id: 'over',
        title: '何かに乗っている信号',
        blocks: [
          {
            kind: 'p',
            text: 'NDI は映像ですが、線を流れているのは Ethernet です。無線 LAN なら電波です。**図が語りたいのは NDI で、物理を決めるのは Ethernet や WiFi** — `over` はこの2つを分けて書きます。',
          },
          { kind: 'diagram', name: 'exOver', filename: 'over.khm' },
          {
            kind: 'p',
            text: '**乗り物が物理を決めます。** `over wifi` の区間はコネクタを持たずチャンネルを持ち、無線表に出ます。`over lan` の区間は RJ45 で長さと番号を持ち、ケーブル表に出ます。**名前と色は中身が決めます。**',
          },
          { kind: 'schedule', name: 'exOver', of: 'cable' },
          { kind: 'schedule', name: 'exOver', of: 'wireless' },
          {
            kind: 'note',
            text: '`over` を書かなければ、信号は自分自身の乗り物です。これまでどおりの動きになります。',
          },
        ],
      },
      {
        id: 'connector',
        title: '箱に付いているコネクタ',
        blocks: [
          {
            kind: 'p',
            text: '信号種別が複数のコネクタを持つとき、口はどれが付いているかを書けます。**性別はケーブルの性質ではなく、機器の口の性質**だからです。',
          },
          { kind: 'diagram', name: 'docsConnector', filename: 'connector.khm' },
          {
            kind: 'p',
            text: '**ケーブルの端は導かれます。** プラグは逆の性別と噛み合うので、オスの出力にはメスの端が来ます。口に1回書けば、そこに届くすべてのケーブルが自動的に一致します。',
          },
          { kind: 'schedule', name: 'docsConnector', of: 'cable' },
          {
            kind: 'note',
            text: '`xlr` は組み込みで唯一、コネクタ欄が**対**である型です。他は「どれか」の意味で、`usb` は A か B か C。対でない型ではケーブル端は逆ではなく同じ名前になります。',
          },
          {
            kind: 'p',
            text: '**殻の大小はコネクタであって、型ではありません。** カメラは micro HDMI、スイッチャーはフルサイズ、あいだのケーブルは何も変換していません。だから `hdmi` が3つとも持ちます。型を分ければ、成立している接続に不一致が出てしまいます。',
          },
          { kind: 'diagram', name: 'docsShell', filename: 'shell.khm' },
          {
            kind: 'p',
            text: '書く価値は表にあります。`HDMI Micro → HDMI` は `HDMI → HDMI` とは別のケーブルで、持って来たか来なかったかのどちらかです。`DisplayPort Mini`、`USB Micro-B`、`DIN 1.0/2.3`、3.5mm の MIDI、ボディパックの Mini XLR も同じです。',
          },
          { kind: 'schedule', name: 'docsShell', of: 'cable' },
          {
            kind: 'p',
            text: '**殻を変えるだけの小物は `adapter` です。** こう書けばケーブルはふつうの HDMI-HDMI に戻り、アダプタは資材表に1個だけ載ります。なくせる部品はそちらに載るのが正しい書類です。',
          },
          { kind: 'diagram', name: 'docsShellAdapter', filename: 'shell-adapter.khm' },
          { kind: 'schedule', name: 'docsShellAdapter', of: 'cable' },
          { kind: 'schedule', name: 'docsShellAdapter', of: 'adapter' },
          {
            kind: 'note',
            text: '空白を含む値は引用符で囲みます: `[connector="HDMI Micro"]`。殻の名前はたいてい空白を含みます。',
          },
        ],
      },
      {
        id: 'cable-parts',
        title: '成型ケーブルと、長さ未定',
        blocks: [
          {
            kind: 'p',
            text: '尻尾が全部成型された分岐ケーブルは、**部材であると同時にケーブル**です。van に積まれ、番号が振られ、積む人が見るのはケーブル表です。`as cable` を足すと部材表ではなくケーブル表に出ます。',
          },
          { kind: 'diagram', name: 'exMoulded', filename: 'moulded.khm' },
          { kind: 'schedule', name: 'exMoulded', of: 'cable' },
          { kind: 'schedule', name: 'exMoulded', of: 'adapter' },
          {
            kind: 'p',
            text: '**1個の物が1行**です。プラグごとに3行にはなりません。部材表からは外れるので二重に数えられません。`as cable` のうしろには結線と同じく長さとケーブル番号を書けます。',
          },
          {
            kind: 'p',
            text: '長さがまだ決まっていないときは `?m` と書きます。長さを省くこともできますが、その空欄は**「まだ測っていない」と「誰も考えていない」**の2つを同時に意味します。van に積む人が見る表では、片方だけが残っている仕事です。',
          },
          { kind: 'diagram', name: 'exUnknown', filename: 'unknown.khm' },
          { kind: 'schedule', name: 'exUnknown', of: 'cable' },
          {
            kind: 'note',
            text: '単位は書きます。**どの単位で測るかは未定の対象ではない**からです。`?m` `?ft` など、この言語が知っている単位すべてが使えます。',
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
          {
            kind: 'p',
            text: 'There is a VS Code extension for writing it. **Diagnostics as you type, and the diagram beside the source.** The verdicts are the ones under "Signals and compatibility" below — it is the same compiler, running in the editor.',
          },
          {
            kind: 'code',
            filename: 'shell',
            lines: ['code --install-extension love-rox.kumihimo-vscode'],
          },
          {
            kind: 'p',
            text: "The preview opens with `⌘K V` (`Ctrl+K V` on Windows and Linux) or the button in the editor title bar. It follows the editor's colour theme, and switches between the diagram and the cable, equipment and adapter schedules. Completions come from the compiler's own lists, and both the extension's words and the compiler's follow your display language. More on [the VS Code section of the front page](/en#vscode).",
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
            text: 'Sixteen connectors drawn at one pitch read as sixteen of the same thing. Real equipment is not like that: four HDMI inputs, then four SDI, then a pair of analogue jacks, and the panel says so by leaving room between them. A `gap` line leaves that room above whatever is declared next.',
          },
          { kind: 'diagram', name: 'docsGap', filename: 'gap.khm' },
          {
            kind: 'p',
            text: 'One `gap` is half a port pitch, so `gap 2` is a whole one. Consecutive gaps add up. A declaration that expands into many ports gets the space **once**, before the first of them: `gap` above `in CH[1..16]` is one space before `CH1`, not sixteen down the strip.',
          },
          {
            kind: 'note',
            text: 'This is presentation only. No port, connection or schedule changes — **the same diagram with every `gap` removed describes the same system.**',
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
            text: 'A frame around a location, a rack or a subsystem.',
          },
          { kind: 'diagram', name: 'docsGroup', filename: 'group.khm' },
          {
            kind: 'p',
            text: 'A `group` can hold another `group`. A venue holds a stage and a rack; the stage holds the cameras. **Both levels are real to whoever walks the site**, and only the innermost one names the place a box is actually standing in.',
          },
          { kind: 'diagram', name: 'docsNested', filename: 'nested.khm' },
          {
            kind: 'note',
            text: 'A device belongs to the group it is written in, not to that group’s parent. The equipment list names the innermost one, because that is the shelf somebody walks to.',
          },
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
        id: 'words',
        title: 'The vocabulary',
        blocks: [
          {
            kind: 'p',
            text: 'Every word below is **read out of the published package by this page**. It is not a list copied by hand, so it cannot offer a word the compiler would reject or omit one it accepts. The VS Code completions come from the same place.',
          },
          { kind: 'p', text: '**Signal types** — after the `:` on a port or a connection.' },
          { kind: 'vocabulary', of: 'signals' },
          {
            kind: 'note',
            text: 'A type that is not here can be declared with `signal`. See "Signals and compatibility".',
          },
          { kind: 'p', text: '**Device kinds** — after `device … as`.' },
          { kind: 'vocabulary', of: 'kinds' },
          {
            kind: 'p',
            text: '**Jacket colours** — inside `[color=…]`. English and Japanese spellings resolve to the same swatch, and a hex literal like `#0af` works too.',
          },
          { kind: 'vocabulary', of: 'colours' },
          {
            kind: 'p',
            text: '**Length units** — written against the number, with no space: `30m`, `6ft`.',
          },
          { kind: 'vocabulary', of: 'units' },
          { kind: 'p', text: '**Themes** — inside `diagram { theme: … }`.' },
          { kind: 'vocabulary', of: 'themes' },
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
        id: 'over',
        title: 'A signal riding on something else',
        blocks: [
          {
            kind: 'p',
            text: 'NDI is video, but what flows down the wire is Ethernet — or, over Wi-Fi, radio. **The drawing is about the NDI; the physics belongs to the Ethernet or the Wi-Fi.** `over` keeps the two apart.',
          },
          { kind: 'diagram', name: 'exOver', filename: 'over.khm' },
          {
            kind: 'p',
            text: '**The carrier decides the physics.** An `over wifi` hop has no connector, takes a channel, and lands on the wireless schedule. An `over lan` run is RJ45, takes a length and a number, and lands on the cable one. **The name and the colour come from the payload.**',
          },
          { kind: 'schedule', name: 'exOver', of: 'cable' },
          { kind: 'schedule', name: 'exOver', of: 'wireless' },
          {
            kind: 'note',
            text: 'Without `over`, a signal is its own carrier and everything behaves exactly as before.',
          },
        ],
      },
      {
        id: 'connector',
        title: 'Which connector is on the box',
        blocks: [
          {
            kind: 'p',
            text: 'Where a signal type offers a choice, a port can say which one it has. **Gender is a property of the socket, not of the cable.**',
          },
          { kind: 'diagram', name: 'docsConnector', filename: 'connector.khm' },
          {
            kind: 'p',
            text: '**The cable ends follow.** A plug mates with the opposite gender, so a male output takes a female cable end. Written once per socket, every cable reaching that socket agrees with it.',
          },
          { kind: 'schedule', name: 'docsConnector', of: 'cable' },
          {
            kind: 'note',
            text: '`xlr` is the only builtin whose connector list is a **mating pair**. Everywhere else the list means "one of these" — `usb` is A or B or C — and there the cable end is the same name rather than an opposite.',
          },
          {
            kind: 'p',
            text: '**A smaller shell is a connector, not a type.** A camera has micro HDMI, a switcher has full size, and the lead between them converts nothing — so `hdmi` carries all three rather than splitting into three signals. Splitting them would report a mismatch on a connection that works.',
          },
          { kind: 'diagram', name: 'docsShell', filename: 'shell.khm' },
          {
            kind: 'p',
            text: 'The reason to write it is the schedule. `HDMI Micro → HDMI` is a different lead from `HDMI → HDMI`, and it is one you either packed or did not. The same goes for `DisplayPort Mini`, `USB Micro-B`, `DIN 1.0/2.3`, MIDI on `TRS 3.5mm`, and mini XLR on a bodypack.',
          },
          { kind: 'schedule', name: 'docsShell', of: 'cable' },
          {
            kind: 'p',
            text: '**A part that only changes the shell is an `adapter`.** Then the cable goes back to being an ordinary HDMI-to-HDMI, and the adapter is counted once on the parts list — which is where a thing that can be lost belongs.',
          },
          { kind: 'diagram', name: 'docsShellAdapter', filename: 'shell-adapter.khm' },
          { kind: 'schedule', name: 'docsShellAdapter', of: 'cable' },
          { kind: 'schedule', name: 'docsShellAdapter', of: 'adapter' },
          {
            kind: 'note',
            text: 'A value with a space in it goes in quotes: `[connector="HDMI Micro"]`. Most shell names have one.',
          },
        ],
      },
      {
        id: 'cable-parts',
        title: 'Moulded leads, and a length still to come',
        blocks: [
          {
            kind: 'p',
            text: 'A fan-out whose tails are all moulded is **a part and a cable at once**. It goes in the van, it gets a number, and the person loading reads the cable schedule. `as cable` puts it there instead of on the parts list.',
          },
          { kind: 'diagram', name: 'exMoulded', filename: 'moulded.khm' },
          { kind: 'schedule', name: 'exMoulded', of: 'cable' },
          { kind: 'schedule', name: 'exMoulded', of: 'adapter' },
          {
            kind: 'p',
            text: '**One object, one row** — not one per plug. It leaves the parts list, so it is not counted twice. `as cable` takes a length and a cable number, the same ones a run takes.',
          },
          {
            kind: 'p',
            text: 'Where the length is not settled yet, write `?m`. Leaving it off already worked, and the blank it produced meant **"not measured" and "nobody thought about it"** at once. On a list somebody packs a van from, only one of those is a job still to do.',
          },
          { kind: 'diagram', name: 'exUnknown', filename: 'unknown.khm' },
          { kind: 'schedule', name: 'exUnknown', of: 'cable' },
          {
            kind: 'note',
            text: 'The unit is still written, because **which unit it will be measured in is not the open question**. `?m`, `?ft`, and any other unit the language knows.',
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
