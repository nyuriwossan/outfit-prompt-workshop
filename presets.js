/* 衣装プロンプト工房 / data/garments.js
 * 基本衣装。category が「どの部位項目を出すか（slots）」を決める。
 * MVP最終形は60〜80件。ここは代表セット。
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
    { id: 'swim_trunks', labelJa: 'サーフトランクス', category: 'swimwear', shortPrompt: 'board shorts', detailedPrompt: 'board shorts', tags: ['swim', 'no_sleeve'], recommendedWorldviews: ['modern'], layer: 'main' },

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
    { id: 'overbust_corset', labelJa: 'オーバーバストコルセット', category: 'lingerie', shortPrompt: 'overbust corset', detailedPrompt: 'a structured overbust corset', tags: ['structured', 'ornate'], recommendedWorldviews: ['historical_western', 'dark_fantasy'], layer: 'main', requiredSlots: [] }
  ];
})(window);
