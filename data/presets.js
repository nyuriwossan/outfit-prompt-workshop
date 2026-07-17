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
    { id: 'style', labelJa: '様式' }
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
    }
  ];
})(window);
