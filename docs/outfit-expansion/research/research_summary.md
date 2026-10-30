# research_summary

作成: Manus AI

監査対象は衣装工房main `185380d5ff087a92d7452c7c9a73f4c193adc395` と、美青年錬成ガチャmain `0f1494bbe60f6088b4951280dbb742e1086c031a` です。[1] [2] 衣装工房は基本衣装109件・プリセット72件、美青年錬成ガチャは衣装174件です。ガチャのコスプレ15件は174件の別枠ではなく内数でした。[3]

## 結論

174件の全件照合は A=53、B=44、C=68、D=9 です。A+Bの**97件**は衣装工房に同等衣装があるか、実在IDの組合せで再現できます。C+Dの**77件**が、衣装構造として未整備です。Bの44件には既存の基本衣装・部位・モチーフ等を使う具体的レシピを付けました。

「衣装工房に実質的に存在しない」をC+Dと定義するなら、その77件を現行機能だけで再現できる数は0件です。反対に、「単独の同等衣装はないが既存部位で組める」も不足と数えるなら、Bの44件が再現可能な追加候補になります。この区別を実装計画で維持してください。

新規候補は172件です。実装先の集計は `basic_garment` 31件、`existing_base_sufficient` 9件、`new_base_required` 33件、`new_basic_or_category` 41件、`part` 3件、`preset` 7件、`special_feature` 2件、`structured_existing_recipe` 46件 です。候補は構造差を優先し、色違い・同義語の水増しを避けました。CSVとJSONは同じ172レコードを持ち、複合値はCSVではJSON文字列に圧縮しています。

## コスプレ・季節イベント・着ぐるみ

コスプレでは、タバード、ハーレクインの菱形パネル一体服、ドラムメジャーのステージコート、冷却チューブ下着、養蜂ベール付きスモック、食品・日用品の箱型仮装を優先しました。固有キャラクターを複製せず、英語プロンプトは構造語に限定しています。宇宙服のチューブ・外殻、タバード、舞台衣装の構造は公開資料で用語を確認しました。[5]

季節・イベントでは、サンタ毛皮縁スーツとクリスマス風テーラードスーツを分離し、法被、甚平、収穫祭用レーダーホーゼン／ディアンドル、ヴェネツィアン・バウタ・クローク、ハロウィンの魔女コートドレスを優先します。イベント名だけの色替えは基本衣装にせず、既存衣装+配色・装飾で足りるものはプリセットとして扱います。[6]

着ぐるみでは、顔出しの耳・尾アクセサリー、フード衣装、動物つなぎ、厚手ぬいぐるみスーツ、全頭完全マスコット、ファッション再解釈を分けました。完全マスコットは頭・胴・手・足・視界メッシュ・換気を別部材とするため、通常衣装とは別の構造です。[7]

## 新規基本衣装とプリセットの境界

A/Bの97件は、基本衣装を複製せず、検索可能なプリセット・イベント分類・モチーフ・既存部位の組合せとして追加します。Cの68件は既存カテゴリ内で輪郭・層・用途が明確に異なるものに限って基本衣装または専用プリセットにします。Dの9件は、全頭被覆や一体手足のように現行の保存スロット・生成ブロック・競合規則に存在しないため、専用カテゴリまたは新規スロットが必要です。現行の50競合ルールを拡張し、C/Dに対するハード競合を先に定義してください。[4]

## 最小改修で最大のバリエーションを得る手順

まず比較表のA/B 97件をレシピ検索・イベント分類として可視化します。次にCを既存カテゴリへデータ追加します。最後にDだけを完全マスコット用の複合構造、生成ブロック、hard rule、保存移行、モバイルUIと一緒に導入します。これにより、既存IDと保存互換を守りながら、重複衣装ではなく探しやすい組合せと本当に足りない構造を増やせます。

## 高優先候補の分野別例

- SF・未来: 冷却チューブの宇宙作業アンダースーツ、データ運びのモジュラーポンチョ
- animal_fashion_reinterpretation: トナカイ枝角ボタンの冬コート
- animal_hooded_garment: 恐竜背びれフードジャケット、サメ背びれフードポンチョ、ドラゴン角フードクローク、トナカイ枝角フードカーディガン
- animal_motif_accessory: ネコ耳＋尻尾ストリートセット、キツネ耳＋尾ストールセット、ウサギ耳＋ポンポン尻尾アクセサリー
- animal_pajama_onesie: ウーパールーパーえら襟つなぎ、恐竜背びれスリーパーつなぎ、ネコ前ファスナーフリースつなぎ、ウサギフランネル寝つなぎ
- dress: ハロウィン魔女コートドレス、収穫祭ディアンドル
- full_mascot: カップケーキ完全マスコットスーツ、ドラゴン完全マスコットスーツ、ハンバーガー完全マスコットスーツ、ペンギン完全マスコットスーツ、カボチャ完全マスコットスーツ、ウサギ完全マスコットスーツ
- plush_padded_suit: マルハナバチ羽根付きぬいぐるみスーツ、カピバラ箱形ぬいぐるみスーツ
- robe: ヴェネツィア・バウタクローク
- top_bottom: クリスマスエルフ・チュニック、ダウンパーカ＋ビブパンツ、収穫祭レーダーホーゼンセット、トナカイ・フード付き着ぐるみ
- uniform: サンタ衣装、バレンタイン・ショコラティエ制服
- wafuku: 甚平セット、春祭り法被コート
- ステージ・ショー: 飾り組紐のドラムメジャー舞台コート、菱形パネルの道化舞台服、平板ネットの舞台チュチュ衣装
- ファンタジー: 抽象紋章のタバード
- 童話・物語: つぎはぎ案山子のオーバーオール
- 職業・制服: ベールフードの養蜂作業スモック、分割前垂れの鍛冶作業スーツ
- 食品・日用品・動物の一般化仮装: 抽象動物プレイサック、フォーチュンクッキーの折りタバード、鉢植えハウスプラントのエプロン衣装、ポップコーン箱チュニック、フグ風ふくらみケープ

**References**

[1]: https://github.com/nyuriwossan/outfit-prompt-workshop/tree/185380d5ff087a92d7452c7c9a73f4c193adc395 "Outfit Prompt Workshop audited main commit"
[2]: https://github.com/nyuriwossan/bishounen-prompt-gacha/tree/0f1494bbe60f6088b4951280dbb742e1086c031a "Bishounen Prompt Gacha audited main commit"
[3]: https://github.com/nyuriwossan/bishounen-prompt-gacha/blob/0f1494bbe60f6088b4951280dbb742e1086c031a/src/data/outfits.ts "Gacha outfit data and cosplay records"
[4]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/data/rules.js "Outfit Workshop conflict rules"
[5]: https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/ "NASA Spacewalk Spacesuit Basics"
[6]: https://www.metmuseum.org/art/collection/search/112631 "The Met Venetian mask"
[7]: https://mascot-store.com/blogs/mascot-marketing-center/how-mascot-costumes-are-made-inside-the-anatomy-of-a-professional-mascot-suit "Mascot costume anatomy"
