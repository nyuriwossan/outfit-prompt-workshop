/* 衣装プロンプト工房 / data/garments.js
 * 基本衣装。category が「どの部位項目を出すか（slots）」を決める。
 * Phase 5B 前半で60〜80件へ拡張済み（人魚カテゴリ merfolk を含む）。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  // 着用役割（10.3）
  CPW.data.wearRoles = [
    { id: 'inner_layer', labelJa: '下に着る（見せない）', promptEn: 'worn underneath' },
    { id: 'visible_inner', labelJa: '見せる下地', promptEn: 'worn as a visible underlayer' },
    { id: 'lingerie_fashion', labelJa: 'ランジェリー様式として', promptEn: 'styled as lingerie' },
    { id: 'main_outfit', labelJa: '主役の一着', promptEn: '' },
    { id: 'layered_with_outerwear', labelJa: '羽織りと重ねる', promptEn: 'layered under outerwear' }
  ];

  // 着用レイヤー
  CPW.data.layers = [
    { id: 'base', labelJa: '肌着・基層' },
    { id: 'inner', labelJa: '内側' },
    { id: 'main', labelJa: '主層' },
    { id: 'outer', labelJa: '外層・羽織り' }
  ];

  /* 大分類（7.3）。slots は data/parts.js の slot id を参照する。
   * スロットは3段階に分ける。
   *   requiredSlots    … 「基本設計○％」の母数に入れる。無いと設計として成り立たない骨格。
   *   recommendedSlots … 未設定なら補助候補の対象（Phase 4）。母数には入れない。
   *   それ以外         … 完全任意。母数にも不足表示にも入れない。
   * サブタイプ（garments[]）が requiredSlots / recommendedSlots / requiredFields /
   * recommendedFields を持つ場合、そちらが大分類より優先される。 */
  CPW.data.garmentCategories = [
    {
      id: 'top_bottom', labelJa: 'トップス＋ボトムス',
      slots: ['neckline', 'collar', 'shoulders', 'sleeves', 'cuffs', 'waist', 'hem', 'cover_up', 'handwear', 'legwear', 'footwear', 'headwear'],
      requiredSlots: ['sleeves'],
      recommendedSlots: ['neckline', 'waist', 'hem', 'footwear']
    },
    {
      id: 'dress', labelJa: 'ドレス・ワンピース',
      slots: ['neckline', 'collar', 'shoulders', 'sleeves', 'cuffs', 'waist', 'skirt_shape', 'hem', 'cover_up', 'handwear', 'legwear', 'footwear', 'headwear'],
      requiredSlots: ['skirt_shape'],
      recommendedSlots: ['neckline', 'sleeves', 'waist', 'hem', 'legwear', 'footwear']
    },
    {
      id: 'uniform', labelJa: 'スーツ・制服',
      slots: ['inner_shirt', 'collar', 'shoulders', 'sleeves', 'cuffs', 'vest', 'waist', 'bottoms', 'handwear', 'legwear', 'footwear', 'cover_up', 'headwear'],
      requiredSlots: ['bottoms'],
      recommendedSlots: ['inner_shirt', 'collar', 'sleeves', 'waist', 'footwear']
    },
    {
      id: 'robe', labelJa: 'ローブ・コート',
      slots: ['neckline', 'collar', 'shoulders', 'sleeves', 'cuffs', 'waist', 'hem', 'handwear', 'legwear', 'footwear', 'cover_up', 'headwear'],
      requiredSlots: ['sleeves'],
      recommendedSlots: ['collar', 'hem', 'waist', 'footwear']
    },
    {
      id: 'wafuku', labelJa: '和装',
      slots: ['collar', 'sleeves', 'waist', 'hem', 'handwear', 'legwear', 'footwear', 'headwear'],
      requiredSlots: ['waist'],
      recommendedSlots: ['collar', 'sleeves', 'hem', 'footwear']
    },
    {
      id: 'chinese', labelJa: '中華服',
      slots: ['collar', 'shoulders', 'sleeves', 'cuffs', 'waist', 'hem', 'handwear', 'legwear', 'footwear', 'headwear'],
      requiredSlots: ['collar'],
      recommendedSlots: ['sleeves', 'waist', 'hem', 'footwear']
    },
    {
      id: 'swimwear', labelJa: '水着',
      slots: ['swim_form', 'neckline', 'straps', 'back', 'waist', 'leg_opening', 'coverage', 'cover_up', 'footwear', 'headwear'],
      requiredSlots: ['swim_form'],
      recommendedSlots: ['neckline', 'straps', 'back', 'coverage']
    },
    {
      /* チェックポイント4：人魚。人間の脚を置き換える構造なので、
       * 脚用スロット（bottoms / skirt_shape / legwear / footwear / leg_opening）と hem を
       * slots に含めない。値は outfit.parts に残るが、UI・出力・完成度・警告・ガチャの
       * いずれにも混ぜない（カテゴリ slots から外す方式）。 */
      id: 'merfolk', labelJa: '人魚',
      slots: ['mermaid_tail_form', 'neckline', 'collar', 'shoulders', 'sleeves', 'cuffs', 'waist', 'cover_up', 'handwear', 'headwear'],
      requiredSlots: ['mermaid_tail_form'],
      recommendedSlots: ['neckline', 'waist', 'headwear']
    },
    {
      id: 'lingerie', labelJa: '下着・ランジェリー',
      // ボディスーツやシュミーズは襟・袖・手袋を持ちうるので、その分もスロットに含める（ケースA）
      slots: ['lingerie_form', 'neckline', 'collar', 'shoulders', 'sleeves', 'cuffs', 'top_structure', 'bottom_structure', 'straps', 'waist', 'garter', 'handwear', 'legwear', 'cover_up', 'footwear'],
      requiredSlots: ['lingerie_form'],
      recommendedSlots: ['neckline', 'collar', 'sleeves', 'handwear', 'legwear']
    }
  ];

  // サブタイプ（基本衣装そのもの）
  CPW.data.garments = [
    // トップス＋ボトムス
    { id: 'shirt_and_trousers', labelJa: 'シャツ＋トラウザーズ', category: 'top_bottom', shortPrompt: 'shirt and trousers', detailedPrompt: 'a shirt worn with tailored trousers', tags: ['plain', 'daily'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'knit_and_skirt', labelJa: 'ニット＋スカート', category: 'top_bottom', shortPrompt: 'knit top and skirt', detailedPrompt: 'a soft knit top worn with a skirt', tags: ['daily', 'soft'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'hoodie_and_cargo', labelJa: 'フーディ＋カーゴパンツ', category: 'top_bottom', shortPrompt: 'hoodie and cargo pants', detailedPrompt: 'an oversized hoodie worn with cargo pants', tags: ['casual', 'street'], recommendedWorldviews: ['modern', 'sci_fi'], layer: 'main' },

    // ドレス
    { id: 'ball_gown', labelJa: 'ボールガウン', category: 'dress', shortPrompt: 'ball gown', detailedPrompt: 'a full-skirted ball gown', tags: ['ornate', 'formal'], recommendedWorldviews: ['historical_western', 'western_fantasy'], layer: 'main' },
    { id: 'maid_dress', labelJa: 'メイドドレス', category: 'dress', shortPrompt: 'maid dress', detailedPrompt: 'a maid dress with an apron', tags: ['uniform', 'frilled'], recommendedWorldviews: ['historical_western', 'dark_fantasy'], layer: 'main' },
    { id: 'slip_dress_outer', labelJa: 'スリップドレス', category: 'dress', shortPrompt: 'slip dress', detailedPrompt: 'a bias-cut slip dress', tags: ['plain', 'soft', 'no_sleeve'], recommendedWorldviews: ['modern'], layer: 'main' },

    // 制服・スーツ
    { id: 'royal_uniform', labelJa: '王族制服', category: 'uniform', shortPrompt: 'royal uniform', detailedPrompt: 'a royal ceremonial uniform', tags: ['ornate', 'structured', 'royal'], recommendedWorldviews: ['western_fantasy', 'historical_western'], layer: 'main' },
    { id: 'business_suit', labelJa: 'ビジネススーツ', category: 'uniform', shortPrompt: 'tailored suit', detailedPrompt: 'a sharply tailored business suit', tags: ['plain', 'structured'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'school_uniform', labelJa: '学生服', category: 'uniform', shortPrompt: 'school uniform', detailedPrompt: 'a school uniform', tags: ['daily', 'structured'], recommendedWorldviews: ['modern'], layer: 'main' },

    // ローブ・コート
    { id: 'mage_robe', labelJa: '魔術師のローブ', category: 'robe', shortPrompt: 'mage robe', detailedPrompt: 'a long mage robe', tags: ['flowing', 'arcane'], recommendedWorldviews: ['western_fantasy', 'dark_fantasy'], layer: 'outer' },
    { id: 'long_coat', labelJa: 'ロングコート', category: 'robe', shortPrompt: 'long coat', detailedPrompt: 'a structured long coat', tags: ['structured'], recommendedWorldviews: ['modern', 'sci_fi', 'dark_fantasy'], layer: 'outer' },

    // 和装・中華服
    { id: 'kimono', labelJa: '着物', category: 'wafuku', shortPrompt: 'kimono', detailedPrompt: 'a traditional kimono with an obi', tags: ['traditional', 'draped'], recommendedWorldviews: ['japanese'], layer: 'main' },
    { id: 'hanfu', labelJa: '漢服', category: 'chinese', shortPrompt: 'hanfu', detailedPrompt: 'a flowing hanfu', tags: ['traditional', 'flowing'], recommendedWorldviews: ['chinese'], layer: 'main' },

    // 水着（10.1 代表）
    { id: 'classic_one_piece', labelJa: 'ワンピース水着', category: 'swimwear', shortPrompt: 'classic one-piece swimsuit', detailedPrompt: 'a classic one-piece swimsuit', tags: ['swim', 'no_sleeve'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'bikini', labelJa: 'ビキニ', category: 'swimwear', shortPrompt: 'bikini', detailedPrompt: 'a two-piece bikini', tags: ['swim', 'no_sleeve'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'swim_trunks', labelJa: 'サーフトランクス', category: 'swimwear', shortPrompt: 'board shorts', detailedPrompt: 'board shorts', plural: true, tags: ['swim', 'no_sleeve'], recommendedWorldviews: ['modern'], layer: 'main' },

    // ランジェリー（10.2 代表）
    {
      id: 'lace_bodysuit', labelJa: 'レースボディスーツ', category: 'lingerie',
      shortPrompt: 'lace bodysuit', detailedPrompt: 'a one-piece lace bodysuit',
      tags: ['lace', 'fitted'], recommendedWorldviews: ['modern', 'dark_fantasy'], layer: 'main',
      // 一体型なので下着の型は自明。透け感はこの衣装の要（sheer / opaque で別物になる）。
      requiredSlots: [],
      requiredFields: ['materials.transparency'],
      recommendedSlots: ['neckline', 'collar', 'sleeves', 'handwear', 'legwear'],
      recommendedFields: ['decorations.items']
    },
    { id: 'bra_and_briefs', labelJa: 'ブラ＋ショーツ', category: 'lingerie', shortPrompt: 'bra and briefs', detailedPrompt: 'a matching bra and briefs set', tags: ['lace', 'no_sleeve'], recommendedWorldviews: ['modern'], layer: 'inner' },
    { id: 'overbust_corset', labelJa: 'オーバーバストコルセット', category: 'lingerie', shortPrompt: 'overbust corset', detailedPrompt: 'a structured overbust corset', tags: ['structured', 'ornate'], recommendedWorldviews: ['historical_western', 'dark_fantasy'], layer: 'main', requiredSlots: [] },

    /* ==== Phase 5B 前半：追加基本衣装 ==== */
    // 学校制服（既存 school_uniform は維持）
    { id: 'gakuran_uniform', labelJa: '学ラン', category: 'uniform', shortPrompt: 'gakuran uniform', detailedPrompt: 'a black stand-collar gakuran school uniform', tags: ['uniform', 'structured', 'daily'], recommendedWorldviews: ['modern', 'japanese'], layer: 'main' },
    { id: 'sailor_school_uniform', labelJa: 'セーラー服', category: 'uniform', shortPrompt: 'sailor school uniform', detailedPrompt: 'a sailor-collar school uniform', tags: ['uniform', 'daily'], recommendedWorldviews: ['modern', 'japanese'], layer: 'main' },
    { id: 'school_blazer_uniform', labelJa: 'ブレザー制服', category: 'uniform', shortPrompt: 'school blazer uniform', detailedPrompt: 'a school blazer uniform with a necktie', tags: ['uniform', 'structured', 'daily'], recommendedWorldviews: ['modern'], layer: 'main' },

    // メイド服（既存 maid_dress は維持）
    { id: 'classic_maid_dress', labelJa: 'クラシックメイド', category: 'dress', shortPrompt: 'classic maid dress', detailedPrompt: 'a long classic maid dress with a full apron', tags: ['uniform', 'frilled', 'classic'], recommendedWorldviews: ['historical_western'], layer: 'main' },
    { id: 'victorian_maid_dress', labelJa: 'ヴィクトリアンメイド', category: 'dress', shortPrompt: 'victorian maid dress', detailedPrompt: 'a floor-length victorian maid dress with a pinafore apron', tags: ['uniform', 'frilled', 'historical'], recommendedWorldviews: ['historical_western'], layer: 'main' },
    { id: 'cafe_maid_outfit', labelJa: 'カフェメイド', category: 'dress', shortPrompt: 'cafe maid outfit', detailedPrompt: 'a short cafe-style maid outfit with a frilled apron', tags: ['uniform', 'frilled', 'modern'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'gothic_maid_dress', labelJa: 'ゴシックメイド', category: 'dress', shortPrompt: 'gothic maid dress', detailedPrompt: 'a dark gothic maid dress with lace trim', tags: ['uniform', 'frilled', 'dark'], recommendedWorldviews: ['dark_fantasy', 'historical_western'], layer: 'main' },

    // 現代ベーシック（ブランド名不使用）
    { id: 'simple_tshirt_and_jeans', labelJa: 'Tシャツ＋ジーンズ', category: 'top_bottom', shortPrompt: 't-shirt and jeans', detailedPrompt: 'a simple t-shirt worn with jeans', tags: ['plain', 'daily', 'casual'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'simple_shirt_and_ankle_pants', labelJa: 'シャツ＋アンクルパンツ', category: 'top_bottom', shortPrompt: 'shirt and ankle pants', detailedPrompt: 'a clean shirt worn with cropped ankle pants', tags: ['plain', 'daily'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'crewneck_knit_and_chinos', labelJa: 'クルーネックニット＋チノパン', category: 'top_bottom', shortPrompt: 'crewneck knit and chinos', detailedPrompt: 'a crewneck knit sweater worn with chinos', tags: ['plain', 'daily'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'cardigan_and_long_skirt', labelJa: 'カーディガン＋ロングスカート', category: 'top_bottom', shortPrompt: 'cardigan and long skirt', detailedPrompt: 'a soft cardigan worn with a long flowing skirt', tags: ['soft', 'daily'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'sweatshirt_and_joggers', labelJa: 'スウェット＋ジョガーパンツ', category: 'top_bottom', shortPrompt: 'sweatshirt and joggers', detailedPrompt: 'a relaxed sweatshirt worn with jogger pants', tags: ['casual', 'daily', 'street'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'rib_knit_and_wide_pants', labelJa: 'リブニット＋ワイドパンツ', category: 'top_bottom', shortPrompt: 'rib knit top and wide pants', detailedPrompt: 'a fitted rib knit top worn with wide-leg pants', tags: ['daily', 'soft'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'oversized_shirt_and_leggings', labelJa: 'オーバーサイズシャツ＋レギンス', category: 'top_bottom', shortPrompt: 'oversized shirt and leggings', detailedPrompt: 'an oversized shirt worn over leggings', tags: ['casual', 'daily'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'tshirt_dress', labelJa: 'Tシャツワンピース', category: 'dress', shortPrompt: 't-shirt dress', detailedPrompt: 'a relaxed t-shirt dress', tags: ['plain', 'daily', 'casual'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'blouse_and_tapered_pants', labelJa: 'ブラウス＋テーパードパンツ', category: 'top_bottom', shortPrompt: 'blouse and tapered pants', detailedPrompt: 'a soft blouse worn with tapered pants', tags: ['plain', 'daily'], recommendedWorldviews: ['modern'], layer: 'main' },

    // 夢かわ・ふわもこルームウェア
    { id: 'pastel_fluffy_loungewear', labelJa: 'パステルふわもこルームウェア', category: 'top_bottom', shortPrompt: 'pastel fluffy loungewear', detailedPrompt: 'a pastel fluffy loungewear set', tags: ['soft', 'fluffy', 'cozy', 'dreamy'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'oversized_plush_hoodie_set', labelJa: 'オーバーサイズもこもこパーカーセット', category: 'top_bottom', shortPrompt: 'oversized plush hoodie set', detailedPrompt: 'an oversized plush hoodie set with matching shorts', tags: ['soft', 'fluffy', 'cozy', 'casual'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'fuzzy_cardigan_lounge_set', labelJa: 'ふわふわカーディガンセット', category: 'top_bottom', shortPrompt: 'fuzzy cardigan lounge set', detailedPrompt: 'a fuzzy knit cardigan lounge set', tags: ['soft', 'fluffy', 'cozy'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'dreamy_pastel_pajamas', labelJa: '夢かわパステルパジャマ', category: 'top_bottom', shortPrompt: 'dreamy pastel pajamas', detailedPrompt: 'a dreamy pastel pajama set', tags: ['soft', 'cozy', 'dreamy'], recommendedWorldviews: ['modern', 'fairy_tale'], layer: 'main' },

    // バニー衣装（性別制限なし）
    { id: 'classic_bunny_suit', labelJa: 'クラシックバニー', category: 'lingerie', shortPrompt: 'classic bunny suit', detailedPrompt: 'a classic strapless bunny suit with cuffs and a collar', tags: ['fitted', 'stage'], recommendedWorldviews: ['modern'], layer: 'main', requiredSlots: [], recommendedSlots: ['legwear', 'cuffs', 'collar'] },
    { id: 'reverse_bunny_suit', labelJa: '逆バニー', category: 'lingerie', shortPrompt: 'reverse bunny suit', detailedPrompt: 'a reverse-cut bunny suit', tags: ['fitted', 'stage'], recommendedWorldviews: ['modern'], layer: 'main', requiredSlots: [], recommendedSlots: ['legwear', 'cuffs', 'collar'] },

    // 白衣
    { id: 'laboratory_coat_outfit', labelJa: '白衣', category: 'robe', shortPrompt: 'laboratory coat outfit', detailedPrompt: 'a crisp white laboratory coat worn over daily clothes', tags: ['work', 'plain'], recommendedWorldviews: ['modern', 'sci_fi'], layer: 'outer' },

    // 架空の警察官風制服（実在機関名・徽章不使用）
    { id: 'fictional_police_uniform', labelJa: '架空の警察官風制服', category: 'uniform', shortPrompt: 'fictional police-style uniform', detailedPrompt: 'a fictional police-style uniform with generic badges', tags: ['uniform', 'structured', 'work'], recommendedWorldviews: ['modern', 'sci_fi'], layer: 'main' },

    // マフィア風
    { id: 'mafia_style_suit', labelJa: 'マフィア風スーツ', category: 'uniform', shortPrompt: 'mafia-style suit', detailedPrompt: 'a sharply tailored mafia-style pinstripe suit', tags: ['structured', 'dark', 'formal'], recommendedWorldviews: ['modern'], layer: 'main' },

    // 中華系（既存 hanfu は維持）
    { id: 'qipao', labelJa: '旗袍（チャイナドレス）', category: 'chinese', shortPrompt: 'qipao', detailedPrompt: 'a fitted qipao with a high collar and side slit', tags: ['traditional', 'fitted'], recommendedWorldviews: ['chinese', 'modern'], layer: 'main' },
    { id: 'changshan', labelJa: '長衫', category: 'chinese', shortPrompt: 'changshan', detailedPrompt: 'a long changshan robe with knot buttons', tags: ['traditional'], recommendedWorldviews: ['chinese'], layer: 'main' },
    { id: 'modern_chinese_outfit', labelJa: '現代中華風', category: 'chinese', shortPrompt: 'modern chinese-style outfit', detailedPrompt: 'a modernized chinese-style outfit with a mandarin collar', tags: ['modern', 'traditional'], recommendedWorldviews: ['chinese', 'modern'], layer: 'main' },
    { id: 'tang_style_outfit', labelJa: '唐風衣装', category: 'chinese', shortPrompt: 'tang-style outfit', detailedPrompt: 'a flowing tang-style outfit with wide sleeves', tags: ['traditional', 'flowing'], recommendedWorldviews: ['chinese'], layer: 'main' },

    // シスター服
    { id: 'nun_habit', labelJa: 'シスター服', category: 'robe', shortPrompt: 'nun habit', detailedPrompt: 'a nun habit with a veil', tags: ['sacred', 'covered'], recommendedWorldviews: ['historical_western', 'dark_fantasy'], layer: 'main' },

    // カットアウトニット（性別を問わない）
    { id: 'side_cutout_knitwear', labelJa: 'サイドカットアウトニット', category: 'top_bottom', shortPrompt: 'side-cutout knitwear', detailedPrompt: 'a fitted knit top with side cutouts', tags: ['fitted', 'modern'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'open_back_cutout_knitwear', labelJa: 'オープンバックニット', category: 'top_bottom', shortPrompt: 'open-back cutout knitwear', detailedPrompt: 'a knit top with an open-back cutout', tags: ['fitted', 'modern', 'open_back'], recommendedWorldviews: ['modern'], layer: 'main' },

    // ドレス拡充
    { id: 'cocktail_dress', labelJa: 'カクテルドレス', category: 'dress', shortPrompt: 'cocktail dress', detailedPrompt: 'a knee-length cocktail dress', tags: ['formal', 'party'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'shirt_dress', labelJa: 'シャツワンピース', category: 'dress', shortPrompt: 'shirt dress', detailedPrompt: 'a belted shirt dress', tags: ['plain', 'daily'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'knit_dress', labelJa: 'ニットワンピース', category: 'dress', shortPrompt: 'knit dress', detailedPrompt: 'a soft fitted knit dress', tags: ['soft', 'daily'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'gothic_dress', labelJa: 'ゴシックドレス', category: 'dress', shortPrompt: 'gothic dress', detailedPrompt: 'a dark gothic dress with lace details', tags: ['dark', 'ornate'], recommendedWorldviews: ['dark_fantasy', 'historical_western'], layer: 'main' },
    { id: 'lolita_dress', labelJa: 'ロリータドレス', category: 'dress', shortPrompt: 'lolita dress', detailedPrompt: 'a frilled lolita dress with a tiered skirt', tags: ['frilled', 'ornate'], recommendedWorldviews: ['modern', 'fairy_tale'], layer: 'main' },
    { id: 'idol_stage_outfit', labelJa: 'アイドル衣装', category: 'dress', shortPrompt: 'idol stage outfit', detailedPrompt: 'a sparkling idol stage outfit with a flared skirt', tags: ['stage', 'sparkling', 'ornate'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'stage_magician_outfit', labelJa: '舞台マジシャン風衣装', category: 'uniform', shortPrompt: 'stage magician outfit', detailedPrompt: 'a stage magician outfit with a tailcoat', tags: ['stage', 'structured', 'classic'], recommendedWorldviews: ['modern', 'historical_western'], layer: 'main' },

    // ローブ・コート拡充
    { id: 'trench_coat', labelJa: 'トレンチコート', category: 'robe', shortPrompt: 'trench coat', detailedPrompt: 'a belted trench coat', tags: ['structured', 'classic'], recommendedWorldviews: ['modern'], layer: 'outer' },
    { id: 'cape_coat', labelJa: 'ケープコート', category: 'robe', shortPrompt: 'cape coat', detailedPrompt: 'a draped cape coat', tags: ['draped', 'classic'], recommendedWorldviews: ['modern', 'historical_western'], layer: 'outer' },
    { id: 'fur_coat', labelJa: 'ファーコート', category: 'robe', shortPrompt: 'fur coat', detailedPrompt: 'a plush faux fur coat', tags: ['fluffy', 'luxurious'], recommendedWorldviews: ['modern', 'western_fantasy'], layer: 'outer' },
    { id: 'priest_robe', labelJa: '司祭風ローブ', category: 'robe', shortPrompt: 'priest-style robe', detailedPrompt: 'a long priest-style robe with a high collar', tags: ['sacred', 'covered'], recommendedWorldviews: ['western_fantasy', 'dark_fantasy'], layer: 'main' },
    { id: 'traveling_robe', labelJa: '旅装ローブ', category: 'robe', shortPrompt: 'traveling robe', detailedPrompt: 'a weathered traveling robe with a hood', tags: ['functional', 'travel'], recommendedWorldviews: ['western_fantasy', 'fairy_tale'], layer: 'outer' },

    // 冒険・戦闘・作業
    { id: 'adventurer_outfit', labelJa: '冒険者服', category: 'top_bottom', shortPrompt: 'adventurer outfit', detailedPrompt: 'a practical adventurer outfit with leather accents', tags: ['functional', 'travel'], recommendedWorldviews: ['western_fantasy'], layer: 'main' },
    { id: 'light_combat_outfit', labelJa: '軽装戦闘服', category: 'top_bottom', shortPrompt: 'light combat outfit', detailedPrompt: 'a light combat outfit built for mobility', tags: ['functional', 'battle'], recommendedWorldviews: ['western_fantasy', 'sci_fi'], layer: 'main' },
    { id: 'work_coveralls', labelJa: '作業つなぎ', category: 'top_bottom', shortPrompt: 'work coveralls', detailedPrompt: 'sturdy one-piece work coveralls', plural: true, tags: ['functional', 'work'], recommendedWorldviews: ['modern', 'sci_fi'], layer: 'main' },

    // 和装拡充
    { id: 'yukata', labelJa: '浴衣', category: 'wafuku', shortPrompt: 'yukata', detailedPrompt: 'a light cotton yukata with an obi', tags: ['traditional', 'summer'], recommendedWorldviews: ['japanese', 'modern'], layer: 'main' },
    { id: 'hakama_outfit', labelJa: '袴', category: 'wafuku', shortPrompt: 'hakama outfit', detailedPrompt: 'a kimono top worn with pleated hakama', tags: ['traditional', 'structured'], recommendedWorldviews: ['japanese'], layer: 'main' },
    { id: 'modern_kimono_outfit', labelJa: '現代和装', category: 'wafuku', shortPrompt: 'modern kimono outfit', detailedPrompt: 'a modernized kimono outfit with contemporary styling', tags: ['traditional', 'modern'], recommendedWorldviews: ['japanese', 'modern'], layer: 'main' },

    // 水着拡充
    { id: 'tankini', labelJa: 'タンキニ', category: 'swimwear', shortPrompt: 'tankini', detailedPrompt: 'a tankini with a tank-style top', tags: ['swim', 'no_sleeve'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'monokini', labelJa: 'モノキニ', category: 'swimwear', shortPrompt: 'monokini', detailedPrompt: 'a cutout one-piece monokini', tags: ['swim', 'no_sleeve'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'competition_swimsuit', labelJa: '競泳水着', category: 'swimwear', shortPrompt: 'competition swimsuit', detailedPrompt: 'a streamlined competition swimsuit', tags: ['swim', 'fitted', 'sporty'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'rash_guard_set', labelJa: 'ラッシュガードセット', category: 'swimwear', shortPrompt: 'rash guard set', detailedPrompt: 'a long-sleeved rash guard set', tags: ['swim', 'sporty', 'covered'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'swim_dress', labelJa: 'スイムドレス', category: 'swimwear', shortPrompt: 'swim dress', detailedPrompt: 'a skirted swim dress', tags: ['swim', 'soft'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'high_waisted_bikini', labelJa: 'ハイウエストビキニ', category: 'swimwear', shortPrompt: 'high-waisted bikini', detailedPrompt: 'a retro high-waisted bikini', tags: ['swim', 'no_sleeve', 'retro'], recommendedWorldviews: ['modern'], layer: 'main' },
    { id: 'swim_briefs', labelJa: 'スイムブリーフ', category: 'swimwear', shortPrompt: 'swim briefs', detailedPrompt: 'fitted swim briefs', plural: true, tags: ['swim', 'no_sleeve', 'sporty'], recommendedWorldviews: ['modern'], layer: 'main' },

    // ランジェリー拡充
    { id: 'camisole_set', labelJa: 'キャミソールセット', category: 'lingerie', shortPrompt: 'camisole set', detailedPrompt: 'a silky camisole and shorts set', tags: ['soft', 'no_sleeve'], recommendedWorldviews: ['modern'], layer: 'inner' },
    { id: 'chemise', labelJa: 'シュミーズ', category: 'lingerie', shortPrompt: 'chemise', detailedPrompt: 'a loose-fitting chemise', tags: ['soft', 'plain'], recommendedWorldviews: ['modern', 'historical_western'], layer: 'inner', requiredSlots: [] },
    { id: 'babydoll', labelJa: 'ベビードール', category: 'lingerie', shortPrompt: 'babydoll', detailedPrompt: 'a flowing babydoll with a loose hem', tags: ['soft', 'sheer'], recommendedWorldviews: ['modern'], layer: 'main', requiredSlots: [] },
    { id: 'garter_lingerie_set', labelJa: 'ガーター付きセット', category: 'lingerie', shortPrompt: 'garter lingerie set', detailedPrompt: 'a matching lingerie set with a garter belt', tags: ['lace', 'garter'], recommendedWorldviews: ['modern'], layer: 'inner' },

    /* ==== チェックポイント4：人魚（merfolk）。specialParts.tail とは別構造 ==== */
    { id: 'mermaid_tail', labelJa: '人魚の尾', category: 'merfolk', shortPrompt: 'mermaid tail', detailedPrompt: 'a mermaid tail outfit', tags: ['merfolk', 'oceanic'], recommendedWorldviews: ['western_fantasy', 'fairy_tale'], layer: 'main' },
    { id: 'shell_top_mermaid_set', labelJa: '貝殻トップの人魚装', category: 'merfolk', shortPrompt: 'shell-top mermaid set', detailedPrompt: 'a mermaid set with a seashell top', tags: ['merfolk', 'oceanic'], recommendedWorldviews: ['western_fantasy', 'fairy_tale'], layer: 'main' },
    { id: 'sea_silk_mermaid_outfit', labelJa: '海絹の人魚衣装', category: 'merfolk', shortPrompt: 'sea-silk mermaid outfit', detailedPrompt: 'a mermaid outfit draped in flowing sea silk', tags: ['merfolk', 'oceanic', 'flowing'], recommendedWorldviews: ['western_fantasy', 'fairy_tale'], layer: 'main' }
  ];
})(window);
