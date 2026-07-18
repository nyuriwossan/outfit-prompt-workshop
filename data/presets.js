/* 衣装プロンプト工房 / data/presets.js
 * プリセットは「初期値の部分パッチ」。読み込み後はすべて変更できる（8.3 / 7.4）。
 * patch は設計状態と同じ形の部分オブジェクト。app.js の applyPatch が深く合成する。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  CPW.data.presetGroups = [
    { id: 'modern', labelJa: '現代' },
    { id: 'story', labelJa: '物語・ファンタジー' },
    { id: 'style', labelJa: '様式' },
    { id: 'scene', labelJa: '状態・場面' }
  ];

  CPW.data.presets = [
    {
      id: 'daily_casual', group: 'modern', labelJa: 'デイリーカジュアル',
      summaryJa: '現代・日常・ゆるい上下',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'daily', role: 'commoner', primaryStyle: 'street' },
        garment: { category: 'top_bottom', subtype: 'hoodie_and_cargo', wearRole: 'main_outfit' },
        silhouette: { fit: 'relaxed', lowerVolume: 'slim', waist: 'natural_waist' },
        parts: { footwear: 'sneakers' },
        materials: { primary: 'linen', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 1 },
        palette: { primary: 'sand_beige', secondary: 'charcoal_gray', accent: 'sky_blue', scheme: 'base_and_accent' }
      }
    },
    {
      id: 'office_business', group: 'modern', labelJa: 'オフィス・ビジネス',
      summaryJa: '現代・仕事・仕立ての良いスーツ',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'work', role: 'office_worker', primaryStyle: 'minimal' },
        garment: { category: 'uniform', subtype: 'business_suit', wearRole: 'main_outfit' },
        silhouette: { fit: 'tailored', upperVolume: 'structured', lowerVolume: 'slim', waist: 'natural_waist' },
        parts: { inner_shirt: 'dress_shirt', collar: 'wide_lapel', sleeves: 'fitted_long_sleeves', footwear: 'heeled_pumps' },
        materials: { primary: 'wool', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 0 },
        palette: { primary: 'charcoal_gray', secondary: 'pure_white', accent: 'deep_navy', scheme: 'neutral_metal' }
      }
    },
    {
      id: 'royalty', group: 'story', labelJa: '王族・貴族',
      summaryJa: '式典・構築的・銀糸の装飾',
      patch: {
        concept: { worldview: 'western_fantasy', occasion: 'ceremonial', role: 'royal_prince', primaryStyle: 'royal' },
        garment: { category: 'uniform', subtype: 'royal_uniform', wearRole: 'main_outfit' },
        silhouette: { fit: 'tailored', upperVolume: 'structured', lowerVolume: 'slim', waist: 'fitted_waist', symmetry: 'mostly_symmetrical' },
        parts: { inner_shirt: 'high_collar_shirt', collar: 'high_standing_collar', shoulders: 'epaulettes', sleeves: 'fitted_long_sleeves', cuffs: 'ornate_cuffs', waist: 'royal_sash', handwear: { type: 'hand_gloves', material: 'cotton_hand', length: 'wrist_length', fingertips: 'full_fingered' }, footwear: 'knee_high_boots' },
        materials: { primary: 'brocade', secondary: 'silk', trim: 'metallic_thread', transparency: 'opaque', surface: 'subtle_sheen' },
        decorations: { density: 3 },
        palette: { primary: 'pure_white', secondary: 'deep_navy', accent: 'sapphire_blue', metal: 'polished_silver', scheme: 'base_and_accent' }
      }
    },
    {
      id: 'maid_butler', group: 'story', labelJa: 'メイド・執事',
      summaryJa: '仕える者の制服・白黒基調',
      patch: {
        concept: { worldview: 'historical_western', occasion: 'work', role: 'maid', primaryStyle: 'victorian' },
        garment: { category: 'dress', subtype: 'maid_dress', wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted', lowerVolume: 'flared', waist: 'fitted_waist', length: 'knee' },
        parts: { collar: 'ruffled_collar', sleeves: 'short_sleeves', cuffs: 'lace_cuffs', waist: 'ribbon_tie', skirt_shape: 'a_line_skirt', hem: 'lace_hem', headwear: 'bonnet', legwear: ['knee_socks'], footwear: 'lace_up_boots' },
        materials: { primary: 'wool', secondary: 'lace', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 2 },
        palette: { primary: 'jet_black', secondary: 'pure_white', accent: 'burgundy', scheme: 'value_contrast' }
      }
    },
    {
      id: 'knight', group: 'story', labelJa: '騎士',
      summaryJa: '戦闘・板金と革・実用的',
      patch: {
        concept: { worldview: 'western_fantasy', occasion: 'battle', role: 'knight', primaryStyle: 'military' },
        garment: { category: 'uniform', subtype: 'royal_uniform', wearRole: 'main_outfit' },
        silhouette: { fit: 'tailored', upperVolume: 'structured', lowerVolume: 'slim' },
        parts: { shoulders: 'structured_shoulders', sleeves: 'fitted_long_sleeves', cuffs: 'buckled_cuffs', waist: 'leather_belt', handwear: { type: 'hand_gauntlets', material: 'leather_hand', length: 'forearm_length', fingertips: 'full_fingered' }, footwear: 'knee_high_boots' },
        materials: { primary: 'plate_armor', secondary: 'leather', transparency: 'opaque', surface: 'metallic_shine' },
        decorations: { density: 2 },
        palette: { primary: 'polished_silver', secondary: 'deep_navy', accent: 'antique_gold', metal: 'polished_silver', scheme: 'neutral_metal' }
      }
    },
    {
      id: 'mage', group: 'story', labelJa: '魔術師',
      summaryJa: '儀式・長いローブ・紫と銀',
      patch: {
        concept: { worldview: 'western_fantasy', occasion: 'ritual', role: 'mage', primaryStyle: 'gothic' },
        garment: { category: 'robe', subtype: 'mage_robe', wearRole: 'main_outfit' },
        silhouette: { fit: 'draped', lowerVolume: 'flared', length: 'floor' },
        parts: { collar: 'high_standing_collar', sleeves: 'wide_sleeves', hem: 'layered_hem', headwear: 'hood', footwear: 'lace_up_boots' },
        materials: { primary: 'velvet', secondary: 'organza', trim: 'metallic_thread', transparency: 'opaque', surface: 'subtle_sheen' },
        decorations: { density: 3 },
        palette: { primary: 'royal_purple', secondary: 'jet_black', accent: 'polished_silver', metal: 'oxidized_silver', gem: 'amethyst_violet', scheme: 'deep_palette' }
      }
    },
    {
      id: 'gothic', group: 'style', labelJa: 'ゴシック',
      summaryJa: '黒基調・レース・十字',
      patch: {
        concept: { primaryStyle: 'gothic', secondaryStyles: ['victorian'] },
        materials: { primary: 'velvet', secondary: 'lace', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 3 },
        palette: { primary: 'jet_black', secondary: 'burgundy', accent: 'oxidized_silver', scheme: 'deep_palette' }
      }
    },
    {
      id: 'lolita', group: 'style', labelJa: 'ロリータ',
      summaryJa: 'フリル・段スカート・リボン',
      patch: {
        concept: { primaryStyle: 'lolita' },
        garment: { category: 'dress' },
        silhouette: { fit: 'fitted', lowerVolume: 'voluminous', waist: 'fitted_waist', length: 'knee' },
        parts: { collar: 'ruffled_collar', sleeves: 'bell_sleeves', cuffs: 'lace_cuffs', skirt_shape: 'tiered_skirt', hem: 'lace_hem', headwear: 'bonnet' },
        materials: { primary: 'satin', secondary: 'lace', transparency: 'opaque', surface: 'subtle_sheen' },
        decorations: { density: 4 },
        palette: { primary: 'jet_black', secondary: 'pure_white', accent: 'burgundy', scheme: 'value_contrast' }
      }
    },
    {
      id: 'techwear', group: 'style', labelJa: 'テックウェア',
      summaryJa: '近未来・機能的・無彩色',
      patch: {
        concept: { worldview: 'sci_fi', era: 'near_future', primaryStyle: 'techwear' },
        garment: { category: 'top_bottom', subtype: 'hoodie_and_cargo' },
        silhouette: { fit: 'oversized', lowerVolume: 'slim' },
        parts: { collar: 'high_standing_collar', cuffs: 'buckled_cuffs', waist: 'leather_belt', footwear: 'lace_up_boots' },
        materials: { primary: 'leather', secondary: 'linen', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 2 },
        palette: { primary: 'charcoal_gray', secondary: 'jet_black', accent: 'polished_silver', scheme: 'neutral_metal' }
      }
    },

    /* ==== Phase 5B 前半：追加プリセット15件 ==== */
    {
      id: 'gakuran_student', group: 'modern', labelJa: '学ラン',
      summaryJa: '現代・学生・黒の詰襟',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'daily', role: 'student', primaryStyle: 'minimal' },
        garment: { category: 'uniform', subtype: 'gakuran_uniform', wearRole: 'main_outfit' },
        silhouette: { fit: 'tailored', upperVolume: 'structured', lowerVolume: 'slim', waist: 'natural_waist' },
        parts: { collar: 'high_standing_collar', sleeves: 'fitted_long_sleeves', bottoms: 'fitted_trousers', footwear: 'sneakers' },
        materials: { primary: 'wool', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 0 },
        palette: { primary: 'jet_black', secondary: 'pure_white', accent: 'antique_gold', scheme: 'value_contrast' }
      }
    },
    {
      id: 'sailor_student', group: 'modern', labelJa: 'セーラー服',
      summaryJa: '現代・学生・セーラー襟',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'daily', role: 'student', primaryStyle: 'minimal' },
        garment: { category: 'uniform', subtype: 'sailor_school_uniform', wearRole: 'main_outfit' },
        silhouette: { fit: 'relaxed', lowerVolume: 'flared', waist: 'natural_waist', length: 'knee' },
        parts: { collar: 'sailor_collar', sleeves: 'short_sleeves', skirt_shape: 'a_line_skirt', legwear: [{ id: 'knee_socks', layer: 'main' }], footwear: 'sneakers' },
        materials: { primary: 'cotton', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 1 },
        palette: { primary: 'deep_navy', secondary: 'pure_white', accent: 'scarlet', scheme: 'base_and_accent' }
      }
    },
    {
      id: 'classic_maid', group: 'story', labelJa: 'クラシックメイド',
      summaryJa: 'ロング丈・白エプロン・落ち着いた給仕服',
      patch: {
        concept: { worldview: 'historical_western', era: 'victorian_era', occasion: 'work', role: 'maid', primaryStyle: 'victorian' },
        garment: { category: 'dress', subtype: 'classic_maid_dress', wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted', lowerVolume: 'flared', waist: 'fitted_waist', length: 'floor' },
        parts: { collar: 'ruffled_collar', sleeves: 'fitted_long_sleeves', cuffs: 'plain_cuffs', headwear: 'bonnet', footwear: 'lace_up_boots' },
        materials: { primary: 'cotton', secondary: 'linen', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 1 },
        palette: { primary: 'jet_black', secondary: 'pure_white', accent: 'charcoal_gray', scheme: 'value_contrast' }
      }
    },
    {
      id: 'gothic_maid', group: 'story', labelJa: 'ゴシックメイド',
      summaryJa: '黒レース・十字モチーフ・闇寄りの給仕服',
      patch: {
        concept: { worldview: 'dark_fantasy', occasion: 'work', role: 'maid', primaryStyle: 'gothic' },
        garment: { category: 'dress', subtype: 'gothic_maid_dress', wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted', lowerVolume: 'voluminous', waist: 'corset_waist' },
        parts: { collar: 'ruffled_collar', sleeves: 'bell_sleeves', cuffs: 'lace_cuffs', legwear: [{ id: 'thigh_high_stockings', layer: 'main' }], footwear: 'lace_up_boots' },
        materials: { primary: 'velvet', secondary: 'lace', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 3 },
        palette: { primary: 'jet_black', secondary: 'wine_red', accent: 'polished_silver', scheme: 'deep_palette' }
      }
    },
    {
      id: 'modern_basic', group: 'modern', labelJa: '現代ベーシック',
      summaryJa: 'シャツ＋アンクルパンツ・きれいめの普段着',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'daily', role: 'commoner', primaryStyle: 'minimal' },
        garment: { category: 'top_bottom', subtype: 'simple_shirt_and_ankle_pants', wearRole: 'main_outfit' },
        silhouette: { fit: 'relaxed', lowerVolume: 'slim', waist: 'natural_waist' },
        parts: { collar: 'no_collar', footwear: 'sneakers' },
        materials: { primary: 'cotton', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 0 },
        palette: { primary: 'off_white', secondary: 'khaki', accent: 'deep_navy', scheme: 'base_and_accent' }
      }
    },
    {
      id: 'dreamy_loungewear', group: 'modern', labelJa: '夢かわルームウェア',
      summaryJa: 'パステル・ふわもこ・部屋着',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'rest', role: 'commoner', primaryStyle: 'street' },
        garment: { category: 'top_bottom', subtype: 'pastel_fluffy_loungewear', wearRole: 'main_outfit' },
        silhouette: { fit: 'oversized', lowerVolume: 'slim', waist: 'natural_waist' },
        parts: { sleeves: 'wide_sleeves', footwear: 'barefoot' },
        materials: { primary: 'fleece', secondary: 'faux_fur', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 1 },
        palette: { primary: 'pastel_pink', secondary: 'cream_yellow', accent: 'baby_blue', scheme: 'pale_palette' }
      }
    },
    {
      id: 'classic_bunny', group: 'style', labelJa: 'クラシックバニー',
      summaryJa: '舞台衣装・カフスと襟・網タイツなしの構成',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'party', role: 'idol', primaryStyle: 'classical' },
        garment: { category: 'lingerie', subtype: 'classic_bunny_suit', wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted', waist: 'fitted_waist' },
        parts: { cuffs: 'plain_cuffs', collar: 'no_collar', legwear: [{ id: 'sheer_tights', layer: 'main' }], footwear: 'heeled_pumps' },
        materials: { primary: 'satin', transparency: 'opaque', surface: 'subtle_sheen' },
        decorations: { density: 1 },
        palette: { primary: 'jet_black', secondary: 'pure_white', accent: 'scarlet', scheme: 'value_contrast' }
      }
    },
    {
      id: 'reverse_bunny', group: 'style', labelJa: '逆バニー',
      summaryJa: '逆さの切替が主役の舞台衣装',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'party', role: 'idol', primaryStyle: 'classical' },
        garment: { category: 'lingerie', subtype: 'reverse_bunny_suit', wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted', waist: 'fitted_waist' },
        parts: { cuffs: 'plain_cuffs', legwear: [{ id: 'thigh_high_stockings', layer: 'main' }], footwear: 'heeled_pumps' },
        materials: { primary: 'satin', transparency: 'opaque', surface: 'subtle_sheen' },
        decorations: { density: 1 },
        palette: { primary: 'pure_white', secondary: 'jet_black', accent: 'sky_blue', scheme: 'value_contrast' }
      }
    },
    {
      id: 'lab_coat', group: 'modern', labelJa: '白衣',
      summaryJa: '研究者・仕事着・清潔な白',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'work', role: 'office_worker', primaryStyle: 'minimal' },
        garment: { category: 'robe', subtype: 'laboratory_coat_outfit', wearRole: 'main_outfit' },
        silhouette: { fit: 'relaxed', lowerVolume: 'slim' },
        parts: { inner_shirt: 'dress_shirt', collar: 'wide_lapel', sleeves: 'fitted_long_sleeves', footwear: 'sneakers' },
        materials: { primary: 'cotton', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 0 },
        palette: { primary: 'pure_white', secondary: 'heather_gray', accent: 'sky_blue', scheme: 'neutral_metal' }
      }
    },
    {
      id: 'fictional_police', group: 'modern', labelJa: '架空の警察官風',
      summaryJa: '実在しない機関の制服・構築的',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'work', role: 'officer', primaryStyle: 'military' },
        garment: { category: 'uniform', subtype: 'fictional_police_uniform', wearRole: 'main_outfit' },
        silhouette: { fit: 'tailored', upperVolume: 'structured', lowerVolume: 'slim', waist: 'leather_belt' },
        parts: { collar: 'wide_lapel', shoulders: 'epaulettes', sleeves: 'fitted_long_sleeves', headwear: 'officer_cap', bottoms: 'fitted_trousers', footwear: 'lace_up_boots' },
        materials: { primary: 'wool', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 2 },
        palette: { primary: 'deep_navy', secondary: 'charcoal_gray', accent: 'antique_gold', scheme: 'base_and_accent' }
      }
    },
    {
      id: 'mafia_suit', group: 'style', labelJa: 'マフィア風',
      summaryJa: 'ピンストライプ・鋭い仕立て・夜の色',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'party', role: 'noble', primaryStyle: 'classical' },
        garment: { category: 'uniform', subtype: 'mafia_style_suit', wearRole: 'main_outfit' },
        silhouette: { fit: 'tailored', upperVolume: 'structured', lowerVolume: 'slim', waist: 'natural_waist' },
        parts: { inner_shirt: 'dress_shirt', collar: 'wide_lapel', sleeves: 'fitted_long_sleeves', bottoms: 'fitted_trousers', footwear: 'lace_up_boots' },
        materials: { primary: 'wool', secondary: 'silk', transparency: 'opaque', surface: 'subtle_sheen' },
        decorations: { density: 1 },
        palette: { primary: 'jet_black', secondary: 'charcoal_gray', accent: 'oxblood', scheme: 'deep_palette' }
      }
    },
    {
      id: 'qipao_style', group: 'style', labelJa: '旗袍（チャイナドレス）',
      summaryJa: '立ち襟・サイドスリット・艶のある絹',
      patch: {
        concept: { worldview: 'chinese', occasion: 'party', role: 'courtier_cn', primaryStyle: 'classical' },
        garment: { category: 'chinese', subtype: 'qipao', wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted', lowerVolume: 'slim', waist: 'natural_waist', length: 'knee' },
        parts: { collar: 'high_standing_collar', sleeves: 'sleeveless', footwear: 'heeled_pumps' },
        materials: { primary: 'silk', secondary: 'brocade', transparency: 'opaque', surface: 'subtle_sheen' },
        decorations: { density: 2 },
        palette: { primary: 'scarlet', secondary: 'jet_black', accent: 'antique_gold', scheme: 'base_and_accent' }
      }
    },
    {
      id: 'nun_style', group: 'story', labelJa: 'シスター',
      summaryJa: 'ヴェール・覆う造り・静かな祈りの装い',
      patch: {
        concept: { worldview: 'historical_western', occasion: 'ritual', role: 'cleric', primaryStyle: 'classical' },
        garment: { category: 'robe', subtype: 'nun_habit', wearRole: 'main_outfit' },
        silhouette: { fit: 'relaxed', lowerVolume: 'flared', length: 'floor' },
        parts: { neckline: 'high_neckline', sleeves: 'wide_sleeves', headwear: 'hood', footwear: 'lace_up_boots' },
        materials: { primary: 'wool', secondary: 'cotton', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 1 },
        palette: { primary: 'jet_black', secondary: 'pure_white', accent: 'polished_silver', scheme: 'value_contrast' }
      }
    },
    {
      id: 'mermaid', group: 'story', labelJa: '人魚',
      summaryJa: '一本の魚の尾・海の色・脚の衣類は使わない',
      patch: {
        concept: { worldview: 'fairy_tale', occasion: 'ritual', role: 'traveler', primaryStyle: 'classical', attribute: { id: 'water' } },
        garment: { category: 'merfolk', subtype: 'mermaid_tail', wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted', symmetry: 'mostly_symmetrical' },
        parts: { mermaid_tail_form: 'classic_scaled_tail', neckline: 'sweetheart_neckline', waist: 'ribbon_tie' },
        materials: { primary: 'iridescent_fabric', secondary: 'flowing_chiffon', transparency: 'semi_sheer', surface: 'subtle_sheen' },
        decorations: { density: 2 },
        palette: { primary: 'turquoise', secondary: 'pearl_white', accent: 'coral_pink', scheme: 'analogous' }
      }
    },
    {
      id: 'cutout_knit', group: 'modern', labelJa: 'カットアウトニット',
      summaryJa: '切替が効いたニット・現代の街着',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'daily', role: 'commoner', primaryStyle: 'street' },
        garment: { category: 'top_bottom', subtype: 'side_cutout_knitwear', wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted', lowerVolume: 'slim', waist: 'high_waist' },
        parts: { sleeves: 'fitted_long_sleeves', bottoms: 'wide_trousers', footwear: 'sneakers' },
        materials: { primary: 'rib_knit', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 0 },
        palette: { primary: 'heather_gray', secondary: 'jet_black', accent: 'mint', scheme: 'neutral_metal' }
      }
    }
,

    /* ---------- Phase 5B 後半：状態付きプリセット（8件） ---------- */
    {
      id: 'battle_worn_combat', group: 'scene', labelJa: '戦闘後の傷んだ衣装',
      summaryJa: '軽装戦闘服・戦闘の使用感と所々の破れ',
      patch: {
        concept: { worldview: 'western_fantasy', occasion: 'battle', primaryStyle: 'military' },
        garment: { category: 'top_bottom', subtype: 'light_combat_outfit', wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted' },
        materials: { primary: 'canvas', secondary: 'leather', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 1 },
        palette: { primary: 'charcoal_gray', secondary: 'olive', accent: 'steel_blue', scheme: 'base_and_accent' },
        condition: { items: [
          { type: 'battle_worn', group: 'state', severity: 'moderate', extent: 'widespread', placements: [] },
          { type: 'torn_places', group: 'state', severity: 'light', extent: 'scattered', placements: ['hem', 'sleeves'] }
        ] }
      }
    },
    {
      id: 'rain_soaked_uniform', group: 'scene', labelJa: '雨に濡れた制服',
      summaryJa: 'ブレザー制服・雨上がりの濡れ',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'daily' },
        garment: { category: 'uniform', subtype: 'school_blazer_uniform', wearRole: 'main_outfit' },
        silhouette: { fit: 'tailored' },
        materials: { primary: 'wool', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 0 },
        palette: { primary: 'deep_navy', secondary: 'pure_white', accent: 'charcoal_gray', scheme: 'neutral_metal' },
        condition: { items: [
          { type: 'rain_soaked', group: 'state', severity: 'moderate', extent: 'widespread', placements: ['shoulders'] }
        ] }
      }
    },
    {
      id: 'muddy_adventurer', group: 'scene', labelJa: '泥に汚れた冒険者',
      summaryJa: '冒険者服・道中の泥はねと使用感',
      patch: {
        concept: { worldview: 'western_fantasy', occasion: 'travel' },
        garment: { category: 'top_bottom', subtype: 'adventurer_outfit', wearRole: 'main_outfit' },
        silhouette: { fit: 'relaxed' },
        materials: { primary: 'canvas', secondary: 'leather', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 1 },
        palette: { primary: 'warm_brown', secondary: 'olive', accent: 'sand_beige', scheme: 'base_and_accent' },
        condition: { items: [
          { type: 'mud_splattered', group: 'state', severity: 'light', extent: 'localized', placements: ['hem'] },
          { type: 'worn', group: 'state', severity: 'moderate', extent: 'overall', placements: [] }
        ] }
      }
    },
    {
      id: 'well_worn_workwear', group: 'scene', labelJa: '使い込まれた作業着',
      summaryJa: '作業つなぎ・油汚れと使用感',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'work' },
        garment: { category: 'top_bottom', subtype: 'work_coveralls', wearRole: 'main_outfit' },
        silhouette: { fit: 'relaxed' },
        materials: { primary: 'twill', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 0 },
        palette: { primary: 'olive', secondary: 'charcoal_gray', accent: 'sand_beige', scheme: 'neutral_metal' },
        condition: { items: [
          { type: 'worn', group: 'state', severity: 'moderate', extent: 'overall', placements: [] },
          { type: 'oil_stained', group: 'state', severity: 'light', extent: 'scattered', placements: ['front'] }
        ] }
      }
    },
    {
      id: 'bloodstained_labcoat', group: 'scene', labelJa: '血痕の付いた白衣',
      summaryJa: '白衣・片袖の小さな血痕（衣装の状態としてのみ）',
      patch: {
        concept: { worldview: 'modern', era: 'contemporary', occasion: 'work' },
        garment: { category: 'robe', subtype: 'laboratory_coat_outfit', wearRole: 'main_outfit' },
        silhouette: { fit: 'tailored' },
        materials: { primary: 'cotton', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 0 },
        palette: { primary: 'pure_white', secondary: 'charcoal_gray', accent: 'steel_blue', scheme: 'neutral_metal' },
        condition: { items: [
          { type: 'blood_stain_small', group: 'state', severity: 'light', extent: 'localized', placements: ['one_sleeve'] }
        ] }
      }
    },
    {
      id: 'droplet_mermaid', group: 'scene', labelJa: '水滴をまとった人魚',
      summaryJa: '人魚の尾・水から上がったばかりの水滴',
      patch: {
        concept: { worldview: 'fairy_tale', occasion: 'beach' },
        garment: { category: 'merfolk', subtype: 'mermaid_tail', wearRole: 'main_outfit' },
        parts: { mermaid_tail_form: 'classic_scaled_tail' },
        silhouette: { fit: 'fitted' },
        materials: { primary: 'iridescent_fabric', transparency: 'opaque', surface: 'subtle_sheen' },
        decorations: { density: 1 },
        palette: { primary: 'turquoise', secondary: 'seafoam_green', accent: 'pure_white', scheme: 'base_and_accent' },
        condition: { items: [
          { type: 'water_droplets', group: 'state', severity: 'light', extent: 'localized', placements: ['mermaid_tail'] }
        ] }
      }
    },
    {
      id: 'scorched_mage', group: 'scene', labelJa: '焦げた魔法衣装',
      summaryJa: '魔術師のローブ・術の余波の焦げと煤',
      patch: {
        concept: { worldview: 'western_fantasy', occasion: 'battle' },
        garment: { category: 'robe', subtype: 'mage_robe', wearRole: 'main_outfit' },
        silhouette: { fit: 'draped', length: 'floor' },
        materials: { primary: 'wool', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 1 },
        palette: { primary: 'deep_crimson', secondary: 'charcoal_gray', accent: 'jet_black', scheme: 'base_and_accent' },
        condition: { items: [
          { type: 'singed', group: 'state', severity: 'light', extent: 'localized', placements: ['hem'] },
          { type: 'soot_stained', group: 'state', severity: 'light', extent: 'scattered', placements: ['sleeves'] }
        ] }
      }
    },
    {
      id: 'mended_traveler', group: 'scene', labelJa: '補修された旅装',
      summaryJa: '旅装ローブ・長旅のパッチ補修と埃',
      patch: {
        concept: { worldview: 'western_fantasy', occasion: 'travel' },
        garment: { category: 'robe', subtype: 'traveling_robe', wearRole: 'main_outfit' },
        silhouette: { fit: 'relaxed', length: 'midi' },
        materials: { primary: 'linen', transparency: 'opaque', surface: 'matte' },
        decorations: { density: 0 },
        palette: { primary: 'sand_beige', secondary: 'warm_brown', accent: 'olive', scheme: 'base_and_accent' },
        condition: { items: [
          { type: 'patched', group: 'state', severity: 'moderate', extent: 'scattered', placements: ['hem', 'sleeves'] },
          { type: 'dust_stained', group: 'state', severity: 'light', extent: 'widespread', placements: [] }
        ] }
      }
    }
  ];
})(window);
