# 衣装プロンプト工房 / Costume Prompt Workshop

パーツを組み合わせて、一着の英語プロンプトを仕立てる。

服の基本形・シルエット・部位・素材・装飾・配色・世界観・モチーフ・属性を選び、整合性のある英語の衣装プロンプトを生成する静的Webアプリ。完成品を配るカタログではなく、**部品から未知の一着を設計する設計台**。

---

## Phase 5D：コンセプトファッション工房の統合（完了）

「設計台から作る」に加えて「コンセプトから作る」を追加しました。題材 → 方向性（最大2件）→ 衣装ベース → 反映先（最大4件）・強さの4段階で選び、**3案を比較してから設計台へ採用**します。候補の生成・選び直し・画面からの離脱は現在の設計を書き換えません。既存設計がある場合は「既に選んだ項目を残して未選択部分へ提案」「新しい衣装を作る」を選べ、採用時には置換確認があります。採用後は従来の設計台で自由に編集できます。

実装基準は `nyuriwossan/outfit-prompt-workshop` のmain `25a50aaec818811925418db5c34a608a365c6e44`。参照元は [concept-fashion-workshop](https://github.com/nyuriwossan/concept-fashion-workshop) の `f883463e3dd9f00c2de7c5e95c0855f11a0739d2` です。参照元は変更していません。移植したのは語彙・設計思想・必要なロジックで、React/Vite/Vinextや別の完成文generatorは持ち込んでいません。アプリは引き続き静的HTML/CSS/JSで動き、ビルド・npm・外部APIは不要です。Phase 6には進んでいません。

### データと変換

- 10カテゴリ：概念・感情／ファンタジー・超常／物語・神話・伝承／食べ物・飲み物／自然・天体・気象／生き物・植物／素材・現象／美術・建築・工芸／民族・伝統衣装／特殊・舞台衣装。
- 112モチーフ（食品72件）＋伝統衣装14件＝126題材。食品は5分類から選び、配色・柄・刺繍・素材などへ抽象化します。実物は明示選択した場合だけ、演出を含む出力で別のトレイ上へ配置します。
- 方向性16、ベース18、反映先12、強さ5、アイドル15種、アール・ヌーヴォー8種。自由入力は題材名として保持し、未知語から色や素材を推測しません。自動生成処理はcustomTagsへ書き込みません。
- 11基本衣装を追加して計94件。韓服、サリー、レヘンガ、ベリーダンス衣装、カフタン、アオザイ、フラメンコ衣装、ヨーロッパ民族衣装、ケンテ風衣装、マリアッチ風衣装、カーニバル衣装。漢服・旗袍・着物は既存IDを再使用し、カテゴリは既存9種のままです。
- モチーフ112、伝統衣装14、ベース18、方向性16、方向補助3、個別形状37の明示的対応表。参照IDは計1,656箇所（同じIDでもプロフィール・配置先が異なる参照を数える）です。文字列の曖昧検索は使いません。

`CPW.conceptFashion.buildCandidates(selection, {seed, count:3, currentOutfit, mode:'new'|'preserve'})` は `{outfit,reasons,warnings,seed,index,appliedPaths}` の配列を返します。同じ選択・seed・元衣装・データなら結果は再現できます。返却Outfitはプレビュー用の安定したID・日時を持ち、UIで新規採用した時点で実際のID・日時を付けます。

Outfit正規化、カテゴリのスロット、merfolk、stylingの適用判定、condition、advisor/rulesを再使用します。hard競合が出た場合は明示的な衣装プールから差し替え、必要なら既存advisorの修正案を適用します。warningと候補の反映理由は別に表示します。新しいhard規則はなく、文化的衣装についてのinfoを1件追加しました。

旗袍の襟・丈・スリット・飾り布は既存の部位形式へ変換します。裾へ「高いスリット」「控えめスリット」の2選択肢を追加しました。「スリットなし」は旧旗袍テンプレートの固定句より優先します。伝統寄りでは識別構造を優先し、被覆バランスから無関係な開口を足しません。現代化・ファンタジー融合は明示的な創作選択です。アイドルのメンズ／ユニセックスは仕立ての違いで、人物の性別指定ではありません。

### 保存と出力

schemaは **0.5**。既存保存キーはそのままです。0.1〜0.4を読み込み、旧データには空の `concept.inspiration` と任意の演出設定を補完します。保存・再読込・複製・単体JSON・ライブラリJSONでinspiration、presentation、styling、condition、specialParts、layers、merfolk、customTagsを維持します。旧0.3と現行0.4の各32プリセットについて、移行後の短縮版・詳細版が元の出力と完全一致します。

出力付近の折りたたみ「演出・見せ方」には、見せ方25、ポーズムード15、座面21、背景4、人物指定5、塗り7、仕上げ5、線4の計86項目を統合しました。元のfocus／poseAssist／compositionAssistの語彙も `data/presentation.js` にまとめ、旧保存IDを維持しています。新しいpresetが選択されている間、旧ポーズ指定は休止します。座面は座り構図だけに出し、人魚用の構図では脚前提の指示を抑制します。人物の既定値は未選択です。

| 出力範囲 | 衣装 | ポーズ・人物・明示した食品小物 | 背景 | 画風 |
|---|---|---|---|---|
| 衣装だけ | ○ | — | — | — |
| 衣装＋ポーズ | ○ | ○ | — | — |
| 全部 | ○ | ○ | ○ | ONにした場合のみ |

既存generatorにconceptInspiration／background／renderingを追加しました。palette/materials/shape/detailの元の長文を足さず、構造化した項目は既存ブロックから出力します。コンセプト識別句は既存様式・テーマとの明示的な同義対応で抑制します。新しいコンセプト衣装では、配色・素材・留め具・結晶パーツの重複も抑制します。旧衣装の出力を不要に変えないよう、従来の表現を保持しています。

### 検証

**809 / 809テスト通過**。既存615件を保持し、194件を追加しました。旧テストはschema期待値と、新規の空フィールドを除いて旧保存内容を比較する箇所のみ更新しています。受入A〜Rをすべて検証しています。CP0→CP8の各段階の記録は `verification/phase5d-*` にあります。

**150,000設計ケース × 短縮・詳細＝300,000生成文**をseed固定で監査し、機械検出の問題は0件です。通常設計／コンセプト、全9衣装カテゴリ・94基本衣装、全10コンセプトカテゴリ・126題材、食品5分類、全14伝統衣装、旗袍の各設定、アイドル15、アール・ヌーヴォー8、着こなし34、状態53、特殊パーツ4種、見せ方25、出力範囲3種、人物あり／なしを含みます。ランダム監査は有限のルール検査であり、全英文の人手校閲や全組合せの保証ではありません。

headless Edgeで375／390／430pxの開始画面、食品2段階選択、旗袍、3案、採用キャンセル、既存設計を残すモード、採用、再編集、人魚、演出、3出力範囲、保存・再読込・複製、全ブラウザテストを検証。横スクロールなし、追加操作のタップ領域44px以上、固定ナビの重なりなしを確認しています。

```sh
node scripts/test.cjs
node scripts/counts-phase5d.cjs verification/phase5d-counts.json
node scripts/audit-phase5d.cjs 150000 verification/phase5d-audit-150k.json
# 開発時だけPlaywrightとブラウザが必要。本体は無依存。
node scripts/ui-phase5d.cjs verification/phase5d-ui.json
```

既知制約：自由入力からの意味推論は行いません。対応表は創作上の推薦であり、文化的衣装の完全な史実再現を保証しません。候補は最大3案で、ガチャは従来の部分ガチャを維持しています。iPhone Safari実機では、safe-area、ソフトウェアキーボードとselect、上下ナビ、JSONの共有・読込、ブラウザ再起動後の保存復元を最後に手動確認してください。

以下のPhase 5Cの数値・検証結果は、その完了時点の履歴です。

---

## Phase 5C：パターン・仕立て・着こなし拡張（完了）

同じ基本衣装から、形・仕立て・着方の違う衣装を設計できるよう拡張しました。唯一の基準は GitHub main の `2f99585e788a2046b10b5af595684fd1dc67f34f` です。作業開始時に既存524テストの全通過を確認し、CP1→CP6の順で実装・回帰検証しました。Phase 6は未着手です。

選択肢は **383件追加、915→1,298件**。カウントは軸ごとの選択レコード（プリセット・配置・数量等も含む）で、分類見出し、フィルター、競合ルール、出力スイッチは含めません。`node scripts/counts.cjs` で再計算できます。類義語のgigot／leg-of-muttonは一つにまとめ、既存IDは維持しています。

| 軸 | main（5B） | Phase 5C |
|---|---:|---:|
| `styles` | 12 | 54 |
| `decorations` | 49 | 81 |
| `styling` | 0 | 34 |
| `silhouette.fit` | 5 | 15 |
| `silhouette.upperVolume` | 3 | 9 |
| `silhouette.lowerVolume` | 3 | 9 |
| `silhouette.waist` | 4 | 10 |
| `silhouette.length` | 5 | 18 |
| `silhouette.symmetry` | 3 | 7 |
| `parts.neckline` | 6 | 25 |
| `parts.collar` | 6 | 25 |
| `parts.shoulders` | 4 | 14 |
| `parts.sleeves` | 5 | 32 |
| `parts.cuffs` | 4 | 15 |
| `parts.waist` | 5 | 17 |
| `parts.skirt_shape` | 5 | 16 |
| `parts.hem` | 5 | 19 |
| `parts.bottoms` | 4 | 16 |
| `parts.inner_shirt` | 3 | 10 |
| `parts.vest` | 3 | 9 |
| `parts.cover_up` | 7 | 8 |
| `parts.closure` | 0 | 22 |
| `parts.cutout` | 0 | 21 |
| `parts.construction_detail` | 0 | 21 |
| `parts.asymmetry_detail` | 0 | 17 |

新規部位は **closure / cutout / construction_detail / asymmetry_detail**。cutoutは既存の複数選択形式（`[{id, layer}]`）、ほか3スロットは単一IDです。和装には仕立て・非対称、水着には仕立て・非対称・既存背面軸と重複しない開口、人魚には上半身用の選択肢を接続しています。旧データの休止中ボトムスを突然出力しないため、top_bottomの従来スロットは維持しています。アンクルパンツの受入ケースは既存の基本衣装「シャツ＋アンクルパンツ」で再現できます。

独立セクション「着こなし・着崩し」を衣装構造の次に追加しました。保存構造は `styling: { items: ['sleeves_rolled_up', 'half_tucked'] }`、最大2件です。3件目は案内して拒否し、未知ID・疑似ID・重複を保存正規化時に除外します。適用条件は `CPW.styling` で共有し、UI・ガチャ・advisor・generatorの判断を揃えています。カテゴリ変更後に不適用となった選択は保持し、英文出力は休止します。

schemaは **0.4**。0.1／0.2／0.3には空のstylingを補完し、保存キーは `cpw:draft:v1` / `cpw:library:v1` のままです。mainの実装が生成した32件の0.3プリセット保存データを固定フィクスチャにし、移行後も保存フィールドと短縮版・詳細版が一致することを確認しています。利用者個人の保存ライブラリは取得していません。

generatorに `blockStyling` を追加し、parts→styling→wearState→merfolk→materials→conditionの順に出力します。追加タグは末尾のままです。着こなしは「worn with the sleeves rolled up and the collar loosened」の形へまとめ、crewneck／crew neckなどの重複を圧縮します。左右対称と非対称構造が重なる場合、具体的な構造を英文で優先し、保存や日本語一覧には選択を残します。

部分ガチャはシルエット・仕立て・カットアウト・着こなし・様式を追加し、従来の襟・袖・装飾等も拡張データに接続しました。様式を回す際は「主様式を維持」を解除します。採用前に元設計は変わりません。基準mainに全体ガチャは存在せず、このPhaseでも既存の部分ガチャを拡張しています。

warningを6規則追加（着こなしの適用外／同部位の着方の重複／対称性と非対称構造／硬い素材とドレープ／水着背面と開口の重複／背あきと背面装甲）。新しいhard規則は追加していません。カジュアル・ビジネス・パンク・テックウェア・ロマンティック・ゴシック・人魚の補助候補も接続しました。

検証コマンド（Node.jsのみでロジックと監査を実行できます）：

    node scripts/test.cjs
    node scripts/audit.cjs 100000 audit-results.json
    node scripts/counts.cjs counts.json

**615 / 615テスト通過**（既存524件を維持、schema更新に伴う期待値2箇所のみ更新）。受入A〜L通過。Gの3種類の着こなしは、最大2件仕様に従い3通りのペアで検証しています。seed固定の **100,000生成文**（50,000衣装×短縮・詳細）を全9カテゴリ・83基本衣装・54様式で監査し、機械検出の問題は0件でした。構文、冠詞・単複、句読点、着こなしの矛盾、人魚の脚用要素、ブランド・実在警察機関の禁止語、性別自動語、追加タグの保持を検査しています。ルールベースの監査であり、全英文の人手校閲を意味しません。

UIはheadless Edge（Chromium 153）で375／390／430px、各9カテゴリを検査。横スクロール・画面外chipなし、表示ボタン44×44px以上、accordion、着こなし追加・削除・3件目拒否、カテゴリ切替、人魚、保存→再描画を確認しました。`scripts/ui.cjs` は開発用Playwrightを利用します。アプリ本体の外部依存・ビルド工程はありません。

既知制約：iPhone Safariの実機検証は未実施です。次回はセーフエリア、上下固定ナビとの重なり、長い選択肢リストのスクロール、保存再読込、JSONファイルの共有・読込を確認してください。着こなしは最大2件で、複数衣装への厳密な割当ては行いません。様式の年代表現は視覚傾向で、史実の完全再現を保証しません。

---

## 公開のしかた

リポジトリ名・フォルダ名は `outfit-prompt-workshop` に統一する（画面上の日本語名「衣装プロンプト工房」は変えない）。

ビルド工程はない。リポジトリのルートにこの一式を置いて GitHub Pages を有効にするだけ。

    Settings → Pages → Source: main / (root)
    # → https://<ユーザー名>.github.io/outfit-prompt-workshop/

`file://` で直接開くと、ブラウザの制限で `localStorage` が使えず自動保存が動かないことがある。動作確認はローカルサーバ経由が確実。

    python3 -m http.server 8000
    # → http://localhost:8000/

外部API・外部ライブラリ・Webフォントの読み込みは一切ない。初回読み込み後は通信なしで動く。

---

## 生成エンジン（generator.js）

英語の組み立ては `window.CPW.generator` に閉じている。app.js は結果を並べるだけ。

- `blocks(outfit)` … 17ブロックを `{ short: [], detailed: [] }` で返す
- `short(outfit)` … タグ寄りのカンマ区切り
- `detailed(outfit)` … 一着として読める英文
- `compress(list)` … 同じ句・含まれる句を落とす
- `article(phrase)` / `joinAnd(list)` … 冠詞と接続
- `EMPTY_JA` … 出力できるものが無いときの案内文

出力の既定は「衣装のみ」。背景・ポーズ・感情・物語・魔法演出・品質タグは
`outfit.output` の4スイッチがONのときだけ足す。

### 実機試行修正①で入った生成規則

画像生成AIの誤読を防ぐための規則。いずれもロジックテストで縛ってある。

- **雰囲気に carrying を使わない。** carry は物理動作（抱える）として解釈されやすい。`evoking a {mood} atmosphere` へ統一。
- **barefoot は衣装パーツではなく着用状態。** `with barefoot` を作らず、詳細版は `worn barefoot` の独立句、短縮版は独立タグ。データ側は選択肢に `wearState: true` を付けるだけで、この扱いになる。
- **水着の型（one-piece / two-piece）は核へ統合。** `with two-piece` のような欠けた句を作らない。核が既に型を語る場合（bikini / board shorts）は重ねない。選択肢の `coreAdjEn` が統合に使われる。
- **複数形の核（board shorts）には `a pair of`。** 基本衣装に `plural: true` を付ける。
- **主テーマは `-inspired` で核へ結ぶ。** `fairy-tale lolita maid board shorts` のような名詞の積み重ねを避ける。`themeAdjEn` が既に -inspired で終わるものはそのまま。
- **位置未指定の副素材は `with {name} accents`。** `combined with flowing chiffon` のように主衣装へ直結させない。
- **flowing は流れる構造があるときだけ。** ドレープ・広がる裾・床丈/引き裾・羽織りのいずれかが選ばれていなければ、素材名から flowing を落とす。
- **句読点は最終段で正規化。** `.,` `,,` `..` を作らない。文末はピリオド1つ、短縮版の末尾には記号を付けない。
- **追加タグは改変せず末尾へ。** 短縮版はカンマ、詳細版はピリオドと空白で境界を明確にする。

## スロットの3段階

`data/garments.js` の大分類（`garmentCategories`）とサブタイプ（`garments`）が持つ。
サブタイプの指定が大分類より優先される。

- `requiredSlots` / `requiredFields` … 「基本設計○％」の母数に入る
- `recommendedSlots` / `recommendedFields` … 未設定なら補助候補（Phase 4）。母数には入らない
- どちらにも書かないスロット … 完全任意。母数にも不足表示にも入らない

## ファイル構成

    /
    ├─ index.html      画面の器とスクリプト読み込み順
    ├─ styles.css      デザイントークンと全スタイル
    ├─ app.js          状態管理・スキーマ・保存・画面遷移・UI接続
    ├─ generator.js    英語プロンプトの生成（短縮版・詳細版）
    ├─ advisor.js      競合判定・装飾密度判定・補助候補・修正案生成
    ├─ gacha.js        部分ガチャ（3案生成・維持条件・差分・採用）
    ├─ data/
    │  ├─ colors.js       色、色グループ、トーン、配色方式、色の役割
    │  ├─ concept.js      世界観、時代、着用場面、季節、役割、様式
    │  ├─ garments.js     基本衣装の大分類・サブタイプ・着用役割・レイヤー
    │  ├─ parts.js        部位スロットの定義と選択肢、シルエット
    │  ├─ materials.js    素材、透け感、光沢、厚み、柄
    │  ├─ decorations.js  装飾、装飾位置、装飾密度・量、特殊パーツ（翼・角・光輪・尾）、チェーン、浮遊・魔法的装飾
    │  ├─ styling.js      着こなし34種とUI・生成・ガチャ・advisor共通の適用判定
    │  ├─ conditions.js   衣装の状態・加工（汚れ・破損・濡れ・血・経年・意図的加工）、程度・範囲・部位、素材別表現、親和データ
    │  ├─ motifs.js       童話、星座、神話、聖・魔
    │  ├─ attributes.js   9属性（色・素材・装飾・シルエット・モチーフ・演出・語感・推奨様式・避ける手ざわり）
    │  ├─ presets.js      整合した初期値パッチ
    │  └─ rules.js        競合・警告ルールの宣言的定義、相性情報
    ├─ tests.js        ロジックテストの定義
    ├─ tests.html      テスト実行画面
    ├─ tests-phase5c.js / tests-fixtures-03.js  追加検証とmainの0.3保存データ
    ├─ scripts/        Nodeテスト・10万文監査・件数集計・任意のブラウザQA
    ├─ verification/   CP別結果と監査・UI検査の記録
    └─ README.md

`data/concept.js` は設計書の推奨構成にはない追加ファイル。世界観や役割は garments にも presets にも属さないため独立させた。

読み込み順は `data/*.js`（`conditions.js` は `decorations.js` の直後、`styling.js` はその直後）→ `app.js` → `generator.js` → `advisor.js` → `gacha.js`。`app.js` のスキーマ正規化が `D.conditions` を参照するため、`conditions.js` は必ず `app.js` より前に置く。`advisor.js` と `gacha.js` は `CPW.util` / `CPW.schema` / `CPW.progress` を使うので、必ず `app.js` より後に置く。`gacha.js` は `advisor.js` の判定を呼ぶので、その後に置く。`index.html` と `tests.html` の両方を揃えること。

すべてのデータは `window.CPW.data.*` に登録するだけの素のスクリプト。モジュール構文を使っていないので、`file://` でもビルドなしでも読める。

---

## 保存と書き出し

設計は端末のブラウザ内（localStorage）にのみ保存する。サーバーへは送らない。

画面上の呼び名と実体の対応は次のとおり。

| 画面の表記 | 実体 |
|---|---|
| データ出力（保存済み衣装のカード） | その一着を **JSON形式** のファイルとして書き出す（`{ type: 'cpw-outfit', version, exportedAt, outfit }`） |
| この衣装をJSONで書き出す | 編集中の一着を JSON形式 で書き出す |
| 全部を書き出す | 保存済みすべてを JSON形式 で書き出す（`type: 'cpw-library'`） |
| JSONを読み込む | 書き出した JSON を読み込む。壊れていてもアプリを止めず、理由を返す |

**「データ出力」は JSON形式**。ボタン名を利用者向けの言葉にしただけで、ファイル形式・中身・スキーマは変えていない。書き出したものはそのまま読み戻せる（`tests.js` で往復を検査）。

`version` は `CPW.SCHEMA_VERSION`（現在 **0.5**）。古い版のデータは読み込み時に移行する（部位スロットの旧ID、特殊パーツの旧形式、0.1／0.2 の `condition` 欠落は空配列で補完）。0.1・0.2・0.3・0.4 のデータはそのまま読める。旧データには空の `styling` も補完する。

## 衣装の状態・加工（Phase 5B 後半）

汚れ・破れ・濡れ・血の付着・経年・意図的な加工を、素材・装飾とは別の独立レイヤーとして指定する。設計台では「素材・装飾」の次に独立セクション「衣装の状態・加工」がある。

保存構造（現行スキーマ0.5、conditionは0.3から互換）：

    condition: {
      items: [
        { type: 'mud_splattered', group: 'state',
          severity: 'moderate', extent: 'localized', placements: ['hem'] }
      ]
    }

- `group` は `state`（現在の状態）か `treatment`（最初から施された加工）。出力では treatment が state より先に出る。
- 最大 **2件**。3件目を追加しようとすると「衣装の状態・加工は2件まで指定できます。」と案内して止める。保存側でも先頭2件へ丸める。
- 空配列＝状態指定なし。`no_condition` のような疑似IDは保存しない。
- 未知の `type` は読み込み時に静かに捨てる。アプリ全体は停止しない。

**素材別表現（matClasses）**：状態の英語句は主素材の `matClasses` で言い換える。金属・硬質には torn / frayed / wrinkled を出さず scratched / dented / chipped 系へ、防水には water-soaked を出さず water droplets / rain-beaded / water running across the surface へ、毛皮・プラッシュは matted / wet / mud-stained 系へ、鱗（人魚の尾）は water-slick scales / scratched scales などへ変換する。分類が不明なら安全な一般表現（base）へフォールバックする。

**生成の約束**：濡れから透け・密着・露出を自動追加しない（濡れと透け感は別概念）。血は衣装・布地・装備・鱗への付着表現のみで、負傷・流血・gore は絶対に作らない。`with wet` / `with dirt` / `torn open` は生成しない。程度（lightly/heavily）・範囲（in several places / across much of … / throughout）・部位（along the hem / at one sleeve など）は状態ごとの語順で結合し、`torn at overall` のような機械的連結を作らない。

**人魚（merfolk）**：Phase 5B 前半の詳細版で尾の形（`with classic scaled mermaid tail`）と人魚必須句（`with the lower body ending in a single scaled mermaid tail…`）が重複していたのを、後半で一文（`with the lower body ending in a single classic scaled mermaid tail, replacing separate human legs and feet`）へ統合した。脚の置換構造（単一の尾・人間の脚なし・足なし）は維持。状態の部位は人魚では脚・靴系を出さず（尾・尾びれを出す）、人魚以外では尾系を出さない。UI・ガチャに加えて生成側にも同じ防御があり、インポートJSON経由でも脚系部位の状態は出力されない（値は保持され、カテゴリを戻せば復元）。

**競合・警告**：金属×破れ（warning・scratched/dented/chipped を案内）、金属×しわ（warning）、防水×水吸い（info・水滴系を案内）、金属×毛玉（hard）、意味の重複（ダメージ加工×激しい破れ／補修加工×補修済み／色落ち加工×色褪せ／水滴×ずぶ濡れ）を判定する。完全に矛盾しない組み合わせは hard にしない。

**部分ガチャ**：対象「状態・加工」（内部ID `condition`）を追加。種類・程度・範囲・部位を組み替え、採用するまで元の設計は変えない。血の状態は、状態・加工を明示的に対象へ選んだとき／すでに血が含まれるときだけ低確率で候補になり、他の対象のガチャや補助候補が突然血を付けることはない。現代服・制服・夢かわルームウェアでは「状態なし」を高確率にし、性別による重み付けはしない。人魚は専用プール（水滴・海水・塩跡・鱗の傷など）から引き、脚・靴系の部位は出さない。

**補助候補**：冒険者服・白衣・架空警察制服・マフィア風スーツ・作業つなぎ・魔術師のローブ・旅装ローブ・人魚に、衣装と相性の良い状態を提案する。夢かわルームウェア系は状態なしを基本とし候補を出さない。提案は採用するまで設計へ反映しない。

**状態付きプリセット（8件）**：戦闘後の傷んだ衣装／雨に濡れた制服／泥に汚れた冒険者／使い込まれた作業着／血痕の付いた白衣／水滴をまとった人魚／焦げた魔法衣装／補修された旅装。グループ「状態・場面」に入っている。

---

## 用語：主テーマ と 主役装飾モチーフ

**この二つは別物。内部名もUI表記も混ぜない。**

| | 内部名 | UI表記 | 役割 |
|---|---|---|---|
| 題材 | `concept.primaryThemeMotif` / `secondaryThemeMotifs` | 主テーマ / 副テーマ | 世界観・配色・素材・候補提案・雰囲気へ広く影響する |
| 造形 | `decorations.focalMotif` | 主役装飾モチーフ | 衣装上で繰り返す具体的な形、装飾位置、視覚的焦点へ影響する |

両立する例：

    主テーマ　　　　　北欧神話
    副テーマ　　　　　氷属性
    主役装飾モチーフ　氷晶
    補助装飾　　　　　ルーン、鴉、銀刺繍

文章生成でも別ブロックとして処理し、最終出力で統合する（Phase 3）。

    a Norse mythology-inspired royal outfit adorned with ice-crystal motifs along the collar and cuffs

主役装飾モチーフは必須ではない。装飾を追加したとき、または装飾密度が一定以上のときに設定できる任意項目。

---

## データを追加する

### 色を追加する

`data/colors.js` の `CPW.data.colors` に追加する。

```js
{
  id: 'deep_crimson',          // 一意。英小文字とアンダースコア
  labelJa: '深紅',
  promptEn: 'deep crimson',    // 出力に載る英語。hex は載せない
  hex: '#8B1E2D',              // UI表示用のみ
  family: 'red',               // colorFamilies の id
  tone: 'deep',                // colorTones の id
  temperature: 'warm', value: 'dark', saturation: 'rich',
  moods: ['dramatic', 'royal', 'gothic'],
  recommendedWith: ['jet_black', 'warm_ivory'],   // 実在する色 id
  attributes: ['fire', 'darkness'],
  styles: ['gothic', 'baroque', 'royal']
}
```

`family` と `tone`、`recommendedWith` の実在チェックは tests.html が自動で見る。

**類似した英語色名の水増しはしない。** 追加するのは実用上の違いがある色だけ。目標の120色は、基本色相×トーン、オフホワイト・黒・グレー、茶・ベージュ、金属色、宝石色、衣装で使用頻度の高い伝統色・くすみ色・深色の組み合わせで埋める。

### 部位を追加する

`data/parts.js` の `CPW.data.partSlots`。スロットには3つの種別がある。

| kind | 値の形 | 例 |
|---|---|---|
| `single`（既定） | id 文字列 | 襟、袖、靴 |
| `multi` | `[{ id, layer }]` | レッグウェア |
| `composite` | 軸ごとのオブジェクト | 手袋・ハンドウェア |

スロットを足すか、既存スロットの `options` に足す。

```js
{
  id: 'legwear', labelJa: 'レッグウェア',
  multi: true,        // true なら複数選択可（重複警告の対象になる）
  options: [
    { id: 'thigh_high_stockings', labelJa: 'ニーハイストッキング',
      shortPrompt: 'thigh-high stockings',
      tags: ['stockings', 'legwear_long'] }   // tags が競合判定の手がかり
  ]
}
```

新しいスロットは、出したい基本衣装の `garmentCategories[].slots` にも id を足すこと。足さないと画面に出ない。

`multi: true` のスロットの値は `{ id, layer }` の配列として保存される。`layer` が違えば重ね着として扱い、同じなら重複警告の対象になる。層は `CPW.data.partLayers`（内側／主衣装／外側）で、UIには日本語だけを見せる。

### 複合スロット（手袋・ハンドウェア）

合成IDを増やさず、軸に分けて持つ。

```js
{
  id: 'handwear', labelJa: '手袋・ハンドウェア',
  kind: 'composite',
  requiredAxis: 'type',       // これが未選択の間、他の軸は休止
  legacyMap: { ... },         // 旧い合成IDを新構造へ移す変換表
  phraseOrder: ['length', 'fingertips', 'material'],   // 省略時もこの順
  axes: [
    { key: 'type',       labelJa: '種類', required: true, options: [...] },
    { key: 'material',   labelJa: '素材', options: [...] },
    { key: 'length',     labelJa: '長さ', options: [...] },
    { key: 'fingertips', labelJa: '指先', options: [...] }
  ]
}
```

保存される値：

```js
parts.handwear = { type: 'hand_gloves', material: 'lace_hand', length: 'elbow_length', fingertips: 'fingerless' }
```

**種類が未選択のときの扱い**：素材・長さ・指先は状態に残るが「休止」になる。UIからは隠れ、休止中である旨と内容を表示する。出力・完成度・競合判定には一切混ざらない。種類を選び直すと、その指定がそのまま戻る。

種類の選択肢は `skipAxes` を持てる（例：アームウォーマーは指先軸を持たない）。

`CPW.schema.compositeToPhrase(slot, value)` が Phase 3 へ渡す形を返す。一般語と具体語を並べないので、`lace gloves, elbow-length lace gloves` のような重複は生まれない。

```js
{ head: 'gloves', modifiers: ['elbow-length', 'fingerless', 'lace'] }
// → "elbow-length fingerless lace gloves"
```

新しい種類軸の id には `hand_` を付けている。`legacyMap` の鍵（旧合成ID）と同じ文字列を軸の選択肢に使うと、旧形式と新形式が同じ id で併存してしまうため。tests.html がこの衝突を自動で見る。

### 装飾を追加する

`data/decorations.js` の `CPW.data.decorations`。`weight` は装飾飽和の判定に使う内部の重み。装飾密度ごとの `budget` を超えると警告する。装飾量は `single / few / many`（密度側の `ornate` などと語を衝突させない）。

### プリセットを追加する

`data/presets.js`。`patch` は設計状態と同じ形の部分オブジェクトで、書いた項目だけを上書きする。

```js
{
  id: 'royalty', group: 'story', labelJa: '王族・貴族',
  summaryJa: '式典・構築的・銀糸の装飾',
  patch: {
    concept: { worldview: 'western_fantasy', role: 'royal_prince' },
    garment: { category: 'uniform', subtype: 'royal_uniform' },
    parts: { collar: 'high_standing_collar', legwear: ['knee_socks'] }
  }
}
```

`parts` の複数スロットは文字列配列で書いてよい。読み込み時に `{ id, layer: 'main' }` へ正規化される。参照している id が実在するかは tests.html が自動で見る。

### 競合ルールを追加する

`data/rules.js` に「何と何がぶつかるか」だけを宣言する。「どう調べるか」は `advisor.js` に閉じる。

2種類ある。

**pair** … 2つの選択がぶつかる。

```js
{
  id: 'stockings_and_socks',
  kind: 'pair',
  type: 'duplicate',        // physical | duplicate | semantic | style_mix | palette | density | output
  severity: 'warning',      // hard | warning | info
  category: '部位',
  sameLayerOnly: true,      // 別レイヤーなら重ね着として認め、競合にしない
  left:  { tags: ['stockings'] },
  right: { tags: ['socks'] },
  titleJa: 'ストッキングと靴下が同じ層にある',
  messageJa: '…',
  resolutions: [
    { labelJa: 'ストッキングを残す',     action: 'keepLeft' },
    { labelJa: '靴下を残す',             action: 'keepRight' },
    { labelJa: '靴下を外側の層にする',   action: 'moveRightToLayer:outer' },
    { labelJa: 'このまま維持する',       action: 'ignore' }   // 創作上の意図を残す道
  ]
}
```

`left` / `right` は `{ slots, paths, tags, ids }` の選択子。書いた条件だけを見る。`tags` と `ids` は「どれかに一致」。

`action` の種類：

| action | 意味 |
|---|---|
| `keepLeft` / `keepRight` | 反対側を外す |
| `replaceLeftWith:<id>` / `replaceRightWith:<id>` | 別の選択肢へ置き換える |
| `moveRightToLayer:<layer>` | 別の層へ移す（multiスロットのみ） |
| `moveLeftToSecondary` / `moveRightToSecondary` | 副素材へ移す |
| `setPath:<path>=<値>` | 任意のパスを設定 |
| `setStyleOnly:<id>` | 主様式をその1つに寄せ、副様式を空にする |
| `ignore` | 維持する（patchなし） |

**check** … 数え上げ系。判定の中身は `advisor.js` の `CHECKS` に置き、ルール側はパラメータと文言だけ持つ。

```js
{
  id: 'too_many_colors',
  kind: 'check', type: 'palette', severity: 'info', category: '配色',
  check: 'colorCount', max: 4,
  titleJa: '色数が多い',
  messageJa: '…',
  resolutions: []
}
```

警告は「問題です」で止めない。`advisor.check()` が `action` を patch へ翻訳し、当てられない案は落としてから返す。UIは patch を当てるだけ。

相性情報（`CPW.data.affinity`）も同じファイル。世界観ごとの様式・素材、王道に出さないもの、様式ごとの装飾、選択肢の手ざわり（`worldviewOptionTags` / `styleOptionTags`）、「少し意外」で動かしてよい範囲、カテゴリ上限。点数の付け方は `advisor.js` の `SCORE`。

---

### 特殊パーツを追加する

翼・角・光輪・尾は `data/decorations.js` の `CPW.data.specialParts.slots` にある複合スロット。手袋と同じ仕組みで、**種類（`requiredAxis`）が要**。種類が未選択なら、他の軸に値が入っていても休止し、出力・完成度・警告に混ざらない。

新しい種類を足すとき（例：翼に「蝶の翼」）：

    // slots[0]（翼）の axes から key:'type' を探して足す
    { id: 'butterfly_wings', labelJa: '蝶の翼', shortPrompt: 'butterfly wings',
      tags: ['wings', 'organic'] }

- `shortPrompt` に冠詞を入れない。冠詞と複数形は `generator.js` が面倒をみる。
  - 翼・角のように既に複数形なら冠詞は付かない。光輪・尾のような単数の可算には `a` が付く。
- `tags` は競合ルールの引っかかりどころ。`mechanical` を付けると低技術の世界観と、`organic` を付けると金属素材との組み合わせで警告が出る。

新しい軸を足すとき：

    { key: 'pattern', labelJa: '翅脈', options: [
      { id: 'wing_veined', labelJa: '葉脈状', shortPrompt: 'veined' }
    ]}

軸を足したら `phraseOrder` に並び順を書く。書かないと修飾語として出ない。`phraseOrder` に無い軸は、`generator.js` の特殊パーツ節で個別に扱うか、出力に出ないままになる（色・枚数・尾の先端・光輪の位置がその例）。

色の軸は全パーツ共通で `colorAxis(prefix)` が作る。3通り。

| 選択肢 | 意味 |
|---|---|
| `<prefix>_color_primary` | 衣装の主色と連動（`linkTo: 'palette.primary'`） |
| `<prefix>_color_metal` | 金属色と連動（`linkTo: 'palette.metal'`） |
| `<prefix>_color_individual` | この部位だけ個別指定（値は `colorId` に入る） |

新しいスロット（例：耳）を丸ごと足すなら、`slots` に1件足すだけでUI・生成・判定・ガチャが自動で追従する。必要なのは `id` / `labelJa` / `kind:'composite'` / `requiredAxis` / `phraseOrder` / `axes`（`type` と `color` を含む）。

複数追加できるもの（`decorativeChains` / `restraintChains` / `floating` / `magical`）は、ただの配列に1件足すだけ。

- **装飾チェーンと拘束チェーンは必ず分ける。** 装飾は衣装のみ出力でも出る。拘束は `narrative: true` を付け、出力設定の「物語」がONのときだけ出る。
- **浮遊装飾・魔法的装飾は「装飾」であって「エフェクト」ではない。** エフェクトOFFでも出る。光そのものを出したいなら属性の `effects` に書く。

### 属性を編集する

`data/attributes.js`。9属性すべてに、次の9項目が要る（ひとつでも欠けるとテストが落ちる）。

| 項目 | 中身 | 参照先 |
|---|---|---|
| `colors` | 補助候補に出す色 | `data/colors.js` |
| `materials` | 補助候補に出す素材 | `data/materials.js` |
| `decorations` | 補助候補に出す装飾・柄 | `decorations` または `patterns` |
| `silhouettes` | 補助候補に出すシルエット | `data/parts.js` の `silhouette.*` |
| `motifs` | 相性のよい主テーマ | `data/motifs.js` |
| `effects` | 演出語（英語） | 出力設定の「エフェクト」がONのときだけ使う |
| `moods` | 語感 | 生成には直接使わない |
| `recommendedStyles` | 王道候補の様式 | `data/concept.js` の `styles` |
| `avoidTags` | 王道候補から外す手ざわり | 選択肢の `tags` に当てる |

守っている約束（テストで縛ってある）：

- **光属性に `angel`、闇属性に `demon` を入れない。** 「光＝天使」「闇＝悪魔」は別概念。天使・悪魔を出したいなら、主テーマか特殊パーツで明示的に選ぶ。属性は雰囲気を決めるだけ。
- **水と氷を混ぜない。** 水は流れ・drape・波、氷は硬さ・結晶・鋭さ。装飾・シルエット・モチーフは重ねない。
- **自然を緑と花だけにしない。** 土・樹皮・革まで含める。
- **同じ候補を5属性以上で使い回さない。**
- **反映先（`applyTo`）が全部OFFなら、属性は何も動かさない。** 主テーマ・様式の候補も出さない。

### 競合ルールを追加する（特殊パーツ編）

`data/rules.js`。2種類ある。

`kind: 'pair'` … 2つのトークンの組み合わせで引っかける。宣言だけで書ける。

    { id: 'multi_tail_vs_train', kind: 'pair', severity: 'warning', category: '特殊パーツ',
      left:  { paths: ['specialParts.tail.count'], tags: ['multi_tail'] },
      right: { paths: ['silhouette.length'], ids: ['train'] },
      titleJa: '複数の尾と引き裾', messageJa: '…',
      resolutions: [
        { labelJa: '尾を1本にする', action: 'replaceLeftWith:tail_one' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ] }

`kind: 'check'` … 「◯◯でないとき」のような条件が要るものは、`advisor.js` の `CHECKS` に関数を足す。関数は当てはまらなければ `null`、当てはまれば `{ involvedPaths, messageJa?, extraJa?, resolutions? }` を返す。

    // 例：光輪は背後に回してあれば競合しない
    haloVsHeadpiece: function (o) {
      var h = S.activeComposite(D.specialPartSlot('halo'), o.specialParts.halo);
      if (!h || h.position === 'halo_behind') return null;
      …
    }

特殊パーツは軸ごとにトークンになるので、`pair` の左右が同じスロットの別の軸に当たると同じ警告が2度出る。`advisor.js` の `groupKey()` がスロット単位でまとめているので、新しい複合スロットを足しても2度出ることはない。

**警告は禁止ではない。** 意図的な混成（機械の翼×歴史もの、など）を潰さないよう、必ず `ignore`（このまま維持する）を用意する。

### 英語表記の約束

**American English に統一**（gray / color / armor / jewelry）。データを足すときは次を守る。

- 綴りは American（`grey` `colour` `armour` `spiralling` は使わない）
- 修飾語の複合語はハイフンでつなぐ（`floor-length` `thigh-high` `body-hugging`）
- もともと複数形の衣類（gloves / stockings / boots / trousers）を単数で書かない
- IDは `snake_case`。`labelJa` は日本語、`shortPrompt` は英語
- 同じ概念に複数のIDを作らない

いずれも `tests.js` の「品質：…」が全データを走査して見張っている。守れていないと落ちる。

なお Phase 5A で部位スロットIDを `snake_case` へ統一した（`skirtShape` → `skirt_shape` など8件）。旧IDで保存された衣装は `schema.LEGACY_SLOT_IDS` が読み替えるので、この表は消さないこと。特殊パーツも同様に、各スロットの `legacyMap` が Phase 4 の保存データを読み替えている。

## テスト

`tests.html` をブラウザで開くと全件走る。**Phase 5B 最終独立監査完了時点で 524 件、全通過。**

内訳：Phase 1〜3 が 172 件（util・スキーマ・検証・移行・パッチ・完成度・保存・書き出し・ルーター・データ整合・手袋の4軸・レッグウェアの層・生成エンジン・ケースA〜D）。Phase 4 で 102 件（競合判定・配色・装飾密度・補助候補・部分ガチャ）。Phase 5A で 116 件、実機試行修正①で 32 件、実機確認後の文言微修正で 4 件、Phase 5B 前半で 29 件、Phase 5B 後半で 62 件、最終独立監査で英文回帰 7 件を追加。

Phase 5B 後半の内訳：状態・加工のデータ健全性 8 件、保存・移行（0.1→0.3／0.2→0.3／JSON往復／未知ID／件数上限）11 件、英文生成（受入ケースA〜P・素材別表現・句読点・人魚英文重複修正）21 件、競合・警告 6 件、補助候補 5 件、ガチャ（血の制御・件数上限・人魚プール・元設計の不変）8 件、状態付きプリセット 2 件、監査固定 2 件（人魚×脚系部位、非人魚×尾部位の出力抑止）。

最終独立監査の7件は、人魚カテゴリで下半身ボリューム・丈を休止すること、着用役割の動詞句へ接続語を重ねないこと、ランジェリー型の冠詞、可算装飾の単複、特殊パーツの動詞接続、宝石色の重複表現を固定する。さらにカテゴリを通常衣装から人魚へ切り替えた直後、状態・加工の部位候補が脚・靴から人魚の尾・尾びれへ即時更新されることを実動確認した。

Phase 5A の内訳：特殊パーツ 42 件（複合軸・休止・保存/旧データ移行・短縮版・詳細版・色連動・チェーンの分離）、特殊パーツの競合 22 件、9属性の監査 22 件、データ品質検証 24 件、検証ケースA〜F 6 件。

データ品質検証はデータ全体を機械的に走査する。ID重複・snake_case・空の `labelJa`/`shortPrompt`・色のhex・参照先の実在（属性→色/素材/装飾/シルエット/モチーフ/様式、カテゴリ→スロット、プリセット、ガチャの対象、ルールの `check`/`action`/`setPath`/selector、相性データ、`legacyMap` の行き先、色連動の `linkTo`）・英式綴りの混入・ハイフンの揺れ・複数形の扱いを見ている。**Phase 5B でデータを大量に入れても、壊れたものは黙って通らない。**

保存まわりのテストは `store` の読み書きをメモリに差し替えて実行するので、開いても保存済みの衣装は消えない。

Claudeによる42,000文の監査に加え、最終独立監査では全衣装・着用役割、全装飾×数量、全素材×状態、特殊パーツ、人魚シルエット、ガチャを含む **59,658文** を追加走査し、禁止句・句読点破損・人魚への脚系混入は0件だった。375 / 390 / 430pxのheadless Chromium実動確認でも、開始画面・設計台・状態1件/2件・人魚切替で横スクロールなし、表示中ボタンは44px以上、3件目拒否と人魚専用部位への切替を確認した。実機Safari固有のセーフエリア挙動は別途確認する。

### 手動で確認すること

| 項目 | 見るところ |
|---|---|
| iPhone Safari での表示 | 下部固定バーがホームバーに潜らないか |
| 片手操作 | チップ・ボタンのタップ領域が44px以上あるか |
| フォーカス表示 | キーボード操作でどこにいるか分かるか |
| 入力中の再描画 | 衣装名を打っている最中にフォーカスが飛ばないか |
| 誤タップ | 削除の確認が出るか |
| コピー成功の通知 | トーストが見えるか |
| 警告の下部バー | hardがあるとき赤く出るか |
| ガチャのプレビュー | 採用前に元の設計が動いていないか |

---

## 実装の進み具合

| Phase | 内容 | 状態 |
|---|---|---|
| 1 | データ構造・状態管理・画面遷移・自動保存・基本UI | 完了 |
| 2 | 衣装構造・部位・素材・装飾・配色の各セクション | 完了 |
| 3 | 短縮版・詳細版・日本語構造一覧・重複除去 | 完了 |
| 4 | 競合判定・補助候補・装飾密度・部分ガチャ | 完了 |
| 5A | 特殊パーツの構造確定と編集UI・9属性の監査・英語表記の統一・データ品質検証 | 完了 |
| 実機試行修正① | 文体統一・スチームパンク配色・戻る導線・英文生成の実害修正（mood／barefoot／水着の核／素材の付着先／句読点／追加タグ） | 完了 |
| 実機確認後の文言微修正 | 部分ガチャの言い回し・保存済み衣装の「データ出力」表記とaria-label | 完了 |
| 5B | 前半：収録データの本格拡充（色128・素材50・柄30・装飾49・モチーフ39・基本衣装83・人魚）／後半：衣装の状態・加工（独立レイヤー・素材別表現・保存0.3・ガチャ・補助候補・状態付きプリセット8件） | 完了 |
| 5C | パターン・仕立て・着こなし拡張、保存0.4、追加383件、615テスト・10万文監査 | 完了 |
| 5D | コンセプト統合、保存0.5、126題材、809テスト・15万設計ケース監査 | 完了 |
| 6 | アクセシビリティ・バックアップ・テスト・公開確認 | 未着手（今回の実装範囲外） |

Phase 5 は途中で 5A（構造・品質）と 5B（データ量）に分けた。土台を固めてから数を入れるため。

---

## 既知の制限

- 特殊パーツは翼13・角11・光輪10・尾12種類（Phase 5B 前半で拡充済み）。
- 「維持する」を選んだ警告はセッション中だけ覚える。保存やJSON往復では持ち回らない。
- 競合ルール・infoは45件（Phase 5Cのwarning 6件とPhase 5Dの文化的衣装info 1件を含む）。収録データが増えれば取りこぼしも増える。
- 袖の層は「主衣装の袖」と「羽織り」でしか分かれない。同じ層に2着重ねる表現は Phase 5 の `garment.layers` 待ち。
- 補助候補は上位3〜6件、同一カテゴリ2件までに絞る。良い候補でも枠から漏れることがある。
- 手袋と特殊パーツは複合軸、レッグウェアとカットアウトは複数選択、その他の部位は単一選択。分解が要るものが出てきたら `kind: 'composite'` を足す。
- 収録数：色128、素材50（全件 matClasses 付き）、柄30、装飾81、様式54、着こなし34、モチーフ39、基本衣装83、プリセット32（うち状態付き8）、状態・加工53種（部位18種）。
- 保存先は端末のブラウザ内のみ。履歴やサイトデータを消すと一緒に消える。書き出しでバックアップを取ること。
- `file://` で開くと自動保存が働かないことがある。GitHub Pages 上では問題ない。
- 横スクロールやセーフエリアの最終確認は実機（iPhone Safari、375〜430px）で行うこと。jsdom はレイアウトを計測しない。
- 配色はスチームパンク基調（羊皮紙・革・真鍮・銅・緑青）。変数名は従来のまま値だけ差し替えているため、Phase 5B 以降も既存ルールがそのまま新配色を受け取る。

---

## 方針

タグを大量に並べる辞典ではない。

**衣装パーツを選ぶ → 一着として整理する → 問題を知らせる → 次の候補を提案する → 英語プロンプトへ仕立てる**

主導権は常に使う人の側にある。補助候補もガチャも、現在の設計を勝手に書き換えない。収録数の多さより、データの構造・組み合わせの整合性・文章生成の質を優先する。

姉妹アプリ：[AI画像生成タグ・フレーズ辞典](https://nyuriwossan.github.io/ai-image-tag-dictionary/)（個別のタグを探す道具。工房は一着を設計する道具）
