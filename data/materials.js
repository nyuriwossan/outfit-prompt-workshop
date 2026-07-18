/* 衣装プロンプト工房 / data/materials.js
 * 素材・柄・表面。Phase 5B 前半で素材50件・柄30件へ拡張済み。matClasses は状態・加工用の分類タグ。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  CPW.data.materials = [
    { id: 'flowing_chiffon', labelJa: '流れるようなシフォン', shortPrompt: 'flowing chiffon', detailedPrompt: 'lightweight flowing chiffon fabric', category: 'material', matClasses: ['textile'], tags: ['lightweight', 'flowing', 'transparent', 'elegant'], recommendedWorldviews: ['western_fantasy', 'fairy_tale'], recommendedAttributes: ['water', 'wind', 'light'], recommendedGarments: ['dress', 'robe', 'swimwear'], conflicts: [{ target: 'heavy_armor', severity: 'warning', reasonJa: '主素材としては重装鎧と質感が合いにくい' }], suggestions: ['pearl_details', 'wave_embroidery', 'layered_hem'] },
    { id: 'silk', labelJa: '絹', shortPrompt: 'silk', detailedPrompt: 'smooth lustrous silk', category: 'material', matClasses: ['textile'], tags: ['smooth', 'lustrous', 'elegant'], recommendedWorldviews: ['historical_western', 'japanese', 'chinese'], recommendedAttributes: ['light', 'water'], recommendedGarments: ['dress', 'wafuku', 'lingerie'], conflicts: [], suggestions: ['gold_embroidery'] },
    { id: 'velvet', labelJa: 'ベルベット', shortPrompt: 'velvet', detailedPrompt: 'deep-pile velvet', category: 'material', matClasses: ['textile'], tags: ['heavy', 'matte', 'rich'], recommendedWorldviews: ['historical_western', 'dark_fantasy'], recommendedAttributes: ['darkness', 'fire'], recommendedGarments: ['dress', 'robe', 'uniform'], conflicts: [{ target: 'summer', severity: 'info', reasonJa: '夏の場面には重く見えやすい' }], suggestions: ['gold_embroidery', 'jewel_brooch'] },
    { id: 'lace', labelJa: 'レース', shortPrompt: 'lace', detailedPrompt: 'delicate floral lace', category: 'material', matClasses: ['textile'], tags: ['delicate', 'transparent', 'ornate'], recommendedWorldviews: ['historical_western', 'dark_fantasy'], recommendedAttributes: ['darkness', 'light'], recommendedGarments: ['dress', 'lingerie'], conflicts: [], suggestions: ['ribbon_bow', 'pearl_details'] },
    { id: 'leather', labelJa: '革', shortPrompt: 'leather', detailedPrompt: 'supple tanned leather', category: 'material', matClasses: ['leather'], tags: ['sturdy', 'matte', 'functional'], recommendedWorldviews: ['dark_fantasy', 'sci_fi', 'modern'], recommendedAttributes: ['earth', 'darkness'], recommendedGarments: ['top_bottom', 'robe'], conflicts: [], suggestions: ['metal_studs', 'buckle_straps'] },
    { id: 'wool', labelJa: 'ウール', shortPrompt: 'wool', detailedPrompt: 'thick woven wool', category: 'material', matClasses: ['textile'], tags: ['heavy', 'matte', 'warm'], recommendedWorldviews: ['modern', 'historical_western'], recommendedAttributes: ['earth', 'nature'], recommendedGarments: ['uniform', 'robe'], conflicts: [], suggestions: [] },
    { id: 'linen', labelJa: 'リネン', shortPrompt: 'linen', detailedPrompt: 'crisp natural linen', category: 'material', matClasses: ['textile'], tags: ['light', 'matte', 'natural'], recommendedWorldviews: ['modern', 'fairy_tale'], recommendedAttributes: ['nature', 'wind'], recommendedGarments: ['top_bottom', 'dress'], conflicts: [], suggestions: [] },
    { id: 'organza', labelJa: 'オーガンジー', shortPrompt: 'organza', detailedPrompt: 'crisp sheer organza', category: 'material', matClasses: ['textile'], tags: ['sheer', 'light', 'structured'], recommendedWorldviews: ['western_fantasy', 'fairy_tale'], recommendedAttributes: ['ice', 'light', 'wind'], recommendedGarments: ['dress'], conflicts: [], suggestions: ['crystal_embroidery'] },
    { id: 'satin', labelJa: 'サテン', shortPrompt: 'satin', detailedPrompt: 'glossy satin', category: 'material', matClasses: ['textile'], tags: ['glossy', 'smooth'], recommendedWorldviews: ['modern', 'historical_western'], recommendedAttributes: ['water', 'light'], recommendedGarments: ['dress', 'lingerie'], conflicts: [], suggestions: ['ribbon_bow'] },
    { id: 'brocade', labelJa: '錦・ブロケード', shortPrompt: 'brocade', detailedPrompt: 'woven brocade with raised patterning', category: 'material', matClasses: ['textile'], tags: ['heavy', 'ornate', 'patterned'], recommendedWorldviews: ['historical_western', 'chinese'], recommendedAttributes: ['fire', 'earth'], recommendedGarments: ['uniform', 'dress', 'chinese'], conflicts: [], suggestions: ['gold_embroidery'] },
    { id: 'metallic_thread', labelJa: '金属糸', shortPrompt: 'metallic thread', detailedPrompt: 'fine metallic thread', category: 'trim', matClasses: ['metallic'], tags: ['metallic', 'ornate'], recommendedWorldviews: ['western_fantasy', 'historical_western'], recommendedAttributes: ['light', 'thunder'], recommendedGarments: [], conflicts: [], suggestions: [] },
    { id: 'crystal_details', labelJa: '結晶の飾り', shortPrompt: 'crystal details', detailedPrompt: 'faceted crystal details', category: 'trim', matClasses: ['rigid'], tags: ['sparkling', 'ornate'], recommendedWorldviews: ['western_fantasy'], recommendedAttributes: ['ice', 'light'], recommendedGarments: [], conflicts: [], suggestions: [] },
    { id: 'plate_armor', labelJa: '板金鎧', shortPrompt: 'plate armor', detailedPrompt: 'segmented plate armor', category: 'material', matClasses: ['rigid', 'metallic'], tags: ['rigid', 'heavy', 'metallic'], recommendedWorldviews: ['western_fantasy'], recommendedAttributes: ['earth', 'thunder'], recommendedGarments: ['uniform'], conflicts: [{ target: 'flowing_chiffon', severity: 'warning', reasonJa: '同一部位の主素材としては両立しにくい' }], suggestions: ['metal_studs'] },

    /* ---- Phase 5B 前半：追加素材（37件）。matClasses は後半の状態・加工実装で参照する分類タグ ---- */
    // 現代・日常
    { id: 'cotton', labelJa: 'コットン', shortPrompt: 'cotton', detailedPrompt: 'soft woven cotton', category: 'material', matClasses: ['textile'], tags: ['plain', 'natural', 'daily'], recommendedWorldviews: ['modern'], recommendedAttributes: ['nature', 'earth'], recommendedGarments: ['top_bottom', 'dress'], conflicts: [], suggestions: [] },
    { id: 'jersey', labelJa: 'ジャージー', shortPrompt: 'jersey fabric', detailedPrompt: 'soft stretchy jersey fabric', category: 'material', matClasses: ['textile', 'knit'], tags: ['soft', 'stretchy', 'daily'], recommendedWorldviews: ['modern'], recommendedAttributes: ['wind'], recommendedGarments: ['top_bottom', 'dress'], conflicts: [], suggestions: [] },
    { id: 'denim', labelJa: 'デニム', shortPrompt: 'denim', detailedPrompt: 'sturdy cotton denim', category: 'material', matClasses: ['textile'], tags: ['sturdy', 'casual', 'daily'], recommendedWorldviews: ['modern'], recommendedAttributes: ['earth'], recommendedGarments: ['top_bottom'], conflicts: [], suggestions: ['decorative_buttons'] },
    { id: 'twill', labelJa: 'ツイル', shortPrompt: 'twill fabric', detailedPrompt: 'diagonal-weave twill fabric', category: 'material', matClasses: ['textile'], tags: ['sturdy', 'matte', 'structured'], recommendedWorldviews: ['modern'], recommendedAttributes: ['earth'], recommendedGarments: ['uniform', 'top_bottom'], conflicts: [], suggestions: [] },
    { id: 'fleece', labelJa: 'フリース', shortPrompt: 'fleece', detailedPrompt: 'soft brushed fleece', category: 'material', matClasses: ['textile', 'plush'], tags: ['soft', 'warm', 'casual'], recommendedWorldviews: ['modern'], recommendedAttributes: ['wind'], recommendedGarments: ['top_bottom'], conflicts: [], suggestions: [] },
    { id: 'rib_knit', labelJa: 'リブニット', shortPrompt: 'rib knit', detailedPrompt: 'fitted rib knit', category: 'material', matClasses: ['knit'], tags: ['soft', 'fitted', 'daily'], recommendedWorldviews: ['modern'], recommendedAttributes: ['earth'], recommendedGarments: ['top_bottom', 'dress'], conflicts: [], suggestions: [] },
    { id: 'cable_knit', labelJa: 'ケーブルニット', shortPrompt: 'cable knit', detailedPrompt: 'chunky cable knit', category: 'material', matClasses: ['knit'], tags: ['warm', 'textured', 'casual'], recommendedWorldviews: ['modern'], recommendedAttributes: ['earth', 'nature'], recommendedGarments: ['top_bottom'], conflicts: [], suggestions: [] },
    { id: 'cashmere', labelJa: 'カシミア', shortPrompt: 'cashmere', detailedPrompt: 'fine soft cashmere', category: 'material', matClasses: ['knit'], tags: ['soft', 'luxurious'], recommendedWorldviews: ['modern'], recommendedAttributes: ['wind', 'light'], recommendedGarments: ['top_bottom', 'robe'], conflicts: [], suggestions: [] },
    { id: 'flannel', labelJa: 'フランネル', shortPrompt: 'flannel', detailedPrompt: 'brushed soft flannel', category: 'material', matClasses: ['textile'], tags: ['warm', 'casual', 'daily'], recommendedWorldviews: ['modern'], recommendedAttributes: ['earth'], recommendedGarments: ['top_bottom'], conflicts: [], suggestions: [] },
    { id: 'canvas', labelJa: 'キャンバス', shortPrompt: 'canvas', detailedPrompt: 'heavy-duty canvas', category: 'material', matClasses: ['textile'], tags: ['sturdy', 'matte', 'functional'], recommendedWorldviews: ['modern'], recommendedAttributes: ['earth'], recommendedGarments: ['top_bottom', 'robe'], conflicts: [], suggestions: ['buckles'] },
    { id: 'terry_cloth', labelJa: 'タオル地', shortPrompt: 'terry cloth', detailedPrompt: 'absorbent looped terry cloth', category: 'material', matClasses: ['textile', 'plush'], tags: ['soft', 'casual'], recommendedWorldviews: ['modern'], recommendedAttributes: ['water'], recommendedGarments: ['top_bottom', 'swimwear'], conflicts: [], suggestions: [] },
    { id: 'nylon', labelJa: 'ナイロン', shortPrompt: 'nylon', detailedPrompt: 'lightweight technical nylon', category: 'material', matClasses: ['textile', 'waterproof'], tags: ['light', 'functional', 'modern'], recommendedWorldviews: ['modern', 'sci_fi'], recommendedAttributes: ['wind', 'water'], recommendedGarments: ['top_bottom', 'robe'], conflicts: [], suggestions: ['zippers'] },
    { id: 'polyester', labelJa: 'ポリエステル', shortPrompt: 'polyester fabric', detailedPrompt: 'smooth polyester fabric', category: 'material', matClasses: ['textile'], tags: ['plain', 'functional'], recommendedWorldviews: ['modern'], recommendedAttributes: [], recommendedGarments: ['top_bottom', 'uniform'], conflicts: [], suggestions: [] },
    { id: 'spandex', labelJa: 'スパンデックス', shortPrompt: 'spandex', detailedPrompt: 'high-stretch spandex', category: 'material', matClasses: ['textile'], tags: ['stretchy', 'fitted'], recommendedWorldviews: ['modern', 'sci_fi'], recommendedAttributes: ['thunder'], recommendedGarments: ['swimwear', 'lingerie'], conflicts: [], suggestions: [] },
    { id: 'mesh', labelJa: 'メッシュ', shortPrompt: 'mesh', detailedPrompt: 'fine openwork mesh', category: 'material', matClasses: ['textile'], tags: ['sheer', 'sporty', 'transparent'], recommendedWorldviews: ['modern', 'sci_fi'], recommendedAttributes: ['wind'], recommendedGarments: ['top_bottom', 'lingerie'], conflicts: [], suggestions: ['mesh_panels'] },
    { id: 'neoprene', labelJa: 'ネオプレン', shortPrompt: 'neoprene', detailedPrompt: 'smooth structured neoprene', category: 'material', matClasses: ['textile', 'waterproof'], tags: ['structured', 'functional', 'modern'], recommendedWorldviews: ['modern', 'sci_fi'], recommendedAttributes: ['water'], recommendedGarments: ['swimwear', 'top_bottom'], conflicts: [], suggestions: [] },
    // 柔らかい・ルームウェア
    { id: 'plush_fabric', labelJa: 'ぬいぐるみ生地', shortPrompt: 'plush fabric', detailedPrompt: 'thick huggable plush fabric', category: 'material', matClasses: ['plush'], tags: ['soft', 'fluffy', 'cozy'], recommendedWorldviews: ['modern', 'fairy_tale'], recommendedAttributes: ['light'], recommendedGarments: ['top_bottom'], conflicts: [{ target: 'plate_armor', severity: 'warning', reasonJa: '主素材としては重装鎧と質感が合いにくい' }], suggestions: ['pom_poms'] },
    { id: 'fuzzy_knit', labelJa: 'ふわふわニット', shortPrompt: 'fuzzy knit', detailedPrompt: 'soft fuzzy brushed knit', category: 'material', matClasses: ['knit', 'plush'], tags: ['soft', 'fluffy', 'cozy'], recommendedWorldviews: ['modern'], recommendedAttributes: ['light', 'wind'], recommendedGarments: ['top_bottom'], conflicts: [], suggestions: ['pom_poms'] },
    { id: 'boucle', labelJa: 'ブークレ', shortPrompt: 'boucle fabric', detailedPrompt: 'looped textured boucle fabric', category: 'material', matClasses: ['knit'], tags: ['textured', 'soft'], recommendedWorldviews: ['modern'], recommendedAttributes: ['earth'], recommendedGarments: ['top_bottom', 'robe'], conflicts: [], suggestions: [] },
    { id: 'faux_fur', labelJa: 'フェイクファー', shortPrompt: 'faux fur', detailedPrompt: 'plush faux fur', category: 'material', matClasses: ['fur'], tags: ['fluffy', 'luxurious', 'warm'], recommendedWorldviews: ['modern', 'western_fantasy'], recommendedAttributes: ['ice', 'wind'], recommendedGarments: ['robe', 'top_bottom'], conflicts: [{ target: 'summer', severity: 'info', reasonJa: '夏の場面には重く見えやすい' }], suggestions: ['fur_trim'] },
    { id: 'brushed_fleece', labelJa: '裏起毛フリース', shortPrompt: 'brushed fleece', detailedPrompt: 'warm brushed-back fleece', category: 'material', matClasses: ['textile', 'plush'], tags: ['warm', 'cozy', 'casual'], recommendedWorldviews: ['modern'], recommendedAttributes: ['earth'], recommendedGarments: ['top_bottom'], conflicts: [], suggestions: [] },
    { id: 'velour', labelJa: 'ベロア', shortPrompt: 'velour', detailedPrompt: 'soft-pile velour', category: 'material', matClasses: ['textile', 'plush'], tags: ['soft', 'rich'], recommendedWorldviews: ['modern', 'historical_western'], recommendedAttributes: ['darkness', 'fire'], recommendedGarments: ['top_bottom', 'dress'], conflicts: [], suggestions: [] },
    // フォーマル・歴史
    { id: 'taffeta', labelJa: 'タフタ', shortPrompt: 'taffeta', detailedPrompt: 'crisp rustling taffeta', category: 'material', matClasses: ['textile'], tags: ['structured', 'formal', 'glossy'], recommendedWorldviews: ['historical_western'], recommendedAttributes: ['light'], recommendedGarments: ['dress'], conflicts: [], suggestions: ['ribbon_bow'] },
    { id: 'crepe', labelJa: 'クレープ', shortPrompt: 'crepe fabric', detailedPrompt: 'finely crinkled crepe fabric', category: 'material', matClasses: ['textile'], tags: ['matte', 'draped', 'formal'], recommendedWorldviews: ['modern', 'historical_western'], recommendedAttributes: ['wind'], recommendedGarments: ['dress'], conflicts: [], suggestions: [] },
    { id: 'jacquard', labelJa: 'ジャカード', shortPrompt: 'jacquard', detailedPrompt: 'woven jacquard with intricate patterning', category: 'material', matClasses: ['textile'], tags: ['ornate', 'patterned', 'formal'], recommendedWorldviews: ['historical_western', 'chinese'], recommendedAttributes: ['light', 'earth'], recommendedGarments: ['dress', 'uniform', 'chinese'], conflicts: [], suggestions: ['gold_embroidery'] },
    { id: 'tweed', labelJa: 'ツイード', shortPrompt: 'tweed', detailedPrompt: 'rough woven tweed', category: 'material', matClasses: ['textile'], tags: ['textured', 'classic', 'warm'], recommendedWorldviews: ['modern', 'historical_western'], recommendedAttributes: ['earth'], recommendedGarments: ['uniform', 'top_bottom'], conflicts: [], suggestions: ['decorative_buttons'] },
    { id: 'suede', labelJa: 'スエード', shortPrompt: 'suede', detailedPrompt: 'napped soft suede', category: 'material', matClasses: ['leather'], tags: ['matte', 'soft', 'rustic'], recommendedWorldviews: ['modern', 'western_fantasy'], recommendedAttributes: ['earth'], recommendedGarments: ['top_bottom', 'robe'], conflicts: [], suggestions: ['tassels'] },
    { id: 'muslin', labelJa: 'モスリン', shortPrompt: 'muslin', detailedPrompt: 'plain lightweight muslin', category: 'material', matClasses: ['textile'], tags: ['light', 'plain', 'natural'], recommendedWorldviews: ['historical_western', 'fairy_tale'], recommendedAttributes: ['wind', 'nature'], recommendedGarments: ['dress'], conflicts: [], suggestions: [] },
    { id: 'gauze', labelJa: 'ガーゼ', shortPrompt: 'gauze fabric', detailedPrompt: 'airy translucent gauze fabric', category: 'material', matClasses: ['textile'], tags: ['sheer', 'light', 'soft'], recommendedWorldviews: ['fairy_tale', 'western_fantasy'], recommendedAttributes: ['wind', 'light'], recommendedGarments: ['dress', 'robe'], conflicts: [], suggestions: [] },
    // 特殊・ファンタジー
    { id: 'chainmail', labelJa: '鎖帷子', shortPrompt: 'chainmail', detailedPrompt: 'interlinked chainmail', category: 'material', matClasses: ['rigid', 'metallic'], tags: ['metallic', 'heavy', 'functional'], recommendedWorldviews: ['western_fantasy'], recommendedAttributes: ['earth', 'thunder'], recommendedGarments: ['uniform'], conflicts: [{ target: 'flowing_chiffon', severity: 'warning', reasonJa: '同一部位の主素材としては両立しにくい' }], suggestions: ['metal_studs'] },
    { id: 'scale_armor', labelJa: '鱗札鎧', shortPrompt: 'scale armor', detailedPrompt: 'overlapping scale armor', category: 'material', matClasses: ['rigid', 'scales'], tags: ['metallic', 'heavy', 'textured'], recommendedWorldviews: ['western_fantasy'], recommendedAttributes: ['earth', 'water'], recommendedGarments: ['uniform'], conflicts: [], suggestions: [] },
    { id: 'polished_metal', labelJa: '磨かれた金属', shortPrompt: 'polished metal', detailedPrompt: 'mirror-polished metal plating', category: 'material', matClasses: ['rigid', 'metallic'], tags: ['metallic', 'rigid', 'glossy'], recommendedWorldviews: ['western_fantasy', 'sci_fi'], recommendedAttributes: ['thunder', 'light'], recommendedGarments: ['uniform'], conflicts: [], suggestions: [] },
    { id: 'translucent_film', labelJa: '半透明フィルム', shortPrompt: 'translucent film', detailedPrompt: 'smooth translucent film material', category: 'material', matClasses: ['textile', 'waterproof'], tags: ['sheer', 'futuristic', 'glossy'], recommendedWorldviews: ['sci_fi'], recommendedAttributes: ['water', 'light'], recommendedGarments: ['robe', 'top_bottom'], conflicts: [], suggestions: [] },
    { id: 'iridescent_fabric', labelJa: '玉虫色の生地', shortPrompt: 'iridescent fabric', detailedPrompt: 'color-shifting iridescent fabric', category: 'material', matClasses: ['textile'], tags: ['glossy', 'futuristic', 'sparkling'], recommendedWorldviews: ['sci_fi', 'fairy_tale'], recommendedAttributes: ['light', 'water'], recommendedGarments: ['dress', 'top_bottom'], conflicts: [], suggestions: [] },
    { id: 'holographic_fabric', labelJa: 'ホログラム生地', shortPrompt: 'holographic fabric', detailedPrompt: 'rainbow-sheen holographic fabric', category: 'material', matClasses: ['textile'], tags: ['glossy', 'futuristic', 'sparkling'], recommendedWorldviews: ['sci_fi'], recommendedAttributes: ['light', 'thunder'], recommendedGarments: ['top_bottom', 'dress'], conflicts: [], suggestions: [] },
    { id: 'rubberized_fabric', labelJa: 'ラバー加工生地', shortPrompt: 'rubberized fabric', detailedPrompt: 'matte rubberized technical fabric', category: 'material', matClasses: ['textile', 'waterproof'], tags: ['matte', 'functional', 'futuristic'], recommendedWorldviews: ['sci_fi', 'modern'], recommendedAttributes: ['water', 'thunder'], recommendedGarments: ['top_bottom', 'robe'], conflicts: [], suggestions: ['zippers'] },
    { id: 'vinyl', labelJa: 'ビニール・エナメル', shortPrompt: 'vinyl', detailedPrompt: 'high-shine vinyl', category: 'material', matClasses: ['textile', 'waterproof'], tags: ['glossy', 'futuristic'], recommendedWorldviews: ['modern', 'sci_fi'], recommendedAttributes: ['thunder'], recommendedGarments: ['top_bottom', 'dress'], conflicts: [], suggestions: [] }
  ];

  CPW.data.transparency = [
    { id: 'opaque', labelJa: '透けない', shortPrompt: 'opaque' },
    { id: 'semi_sheer', labelJa: 'うっすら透ける', shortPrompt: 'semi-sheer' },
    { id: 'sheer', labelJa: 'しっかり透ける', shortPrompt: 'sheer' }
  ];

  CPW.data.surfaces = [
    { id: 'matte', labelJa: 'マット', shortPrompt: 'matte finish' },
    { id: 'subtle_sheen', labelJa: '控えめな艶', shortPrompt: 'subtle sheen' },
    { id: 'high_gloss', labelJa: '強い光沢', shortPrompt: 'high-gloss finish' },
    { id: 'metallic_shine', labelJa: '金属光沢', shortPrompt: 'metallic shine' }
  ];

  CPW.data.thickness = [
    { id: 'light', labelJa: '薄手', shortPrompt: 'lightweight fabric' },
    { id: 'medium', labelJa: '中厚', shortPrompt: 'medium-weight fabric' },
    { id: 'heavy', labelJa: '厚手', shortPrompt: 'heavy fabric' }
  ];

  CPW.data.patterns = [
    { id: 'floral_lace_pattern', labelJa: '花柄レース', shortPrompt: 'floral lace pattern', tags: ['floral'] },
    { id: 'damask', labelJa: 'ダマスク', shortPrompt: 'damask pattern', tags: ['ornate'] },
    { id: 'pinstripe', labelJa: 'ピンストライプ', shortPrompt: 'pinstripe', tags: ['plain'] },
    { id: 'tartan', labelJa: 'タータン', shortPrompt: 'tartan', tags: ['casual'] },
    { id: 'frost_pattern', labelJa: '霜柄', shortPrompt: 'frost pattern', tags: ['ice'] },
    { id: 'wave_pattern', labelJa: '波柄', shortPrompt: 'wave pattern', tags: ['water', 'japanese'] },
    { id: 'star_pattern', labelJa: '星柄', shortPrompt: 'star pattern', tags: ['celestial'] },
    { id: 'rune_pattern', labelJa: 'ルーン文様', shortPrompt: 'rune pattern', tags: ['norse'] },
    /* ---- Phase 5B 前半:追加柄(22件) ---- */
    { id: 'vertical_stripes', labelJa: '縦縞', shortPrompt: 'vertical stripes', tags: ['plain', 'linear'] },
    { id: 'horizontal_stripes', labelJa: '横縞', shortPrompt: 'horizontal stripes', tags: ['plain', 'linear'] },
    { id: 'gingham', labelJa: 'ギンガムチェック', shortPrompt: 'gingham check', tags: ['casual', 'check'] },
    { id: 'houndstooth', labelJa: '千鳥格子', shortPrompt: 'houndstooth pattern', tags: ['classic', 'check'] },
    { id: 'polka_dots', labelJa: '水玉', shortPrompt: 'polka dots', tags: ['casual', 'playful'] },
    { id: 'argyle', labelJa: 'アーガイル', shortPrompt: 'argyle pattern', tags: ['classic', 'check'] },
    { id: 'checkerboard', labelJa: '市松模様', shortPrompt: 'checkerboard pattern', tags: ['check', 'graphic'] },
    { id: 'camouflage', labelJa: '迷彩', shortPrompt: 'camouflage pattern', tags: ['military', 'graphic'] },
    { id: 'paisley', labelJa: 'ペイズリー', shortPrompt: 'paisley pattern', tags: ['ornate', 'classic'] },
    { id: 'small_floral', labelJa: '小花柄', shortPrompt: 'small floral print', tags: ['floral', 'sweet'] },
    { id: 'large_floral', labelJa: '大花柄', shortPrompt: 'large floral print', tags: ['floral', 'bold'] },
    { id: 'cherry_blossom_print', labelJa: '桜柄', shortPrompt: 'cherry blossom pattern', tags: ['floral', 'japanese'] },
    { id: 'cloud_pattern', labelJa: '雲柄', shortPrompt: 'cloud pattern', tags: ['sky', 'soft'] },
    { id: 'heart_pattern', labelJa: 'ハート柄', shortPrompt: 'heart pattern', tags: ['sweet', 'playful'] },
    { id: 'moon_pattern', labelJa: '月柄', shortPrompt: 'moon pattern', tags: ['celestial'] },
    { id: 'constellation_pattern', labelJa: '星座柄', shortPrompt: 'constellation pattern', tags: ['celestial'] },
    { id: 'candy_pattern', labelJa: 'キャンディ柄', shortPrompt: 'candy pattern', tags: ['sweet', 'playful'] },
    { id: 'geometric_pattern', labelJa: '幾何学柄', shortPrompt: 'geometric pattern', tags: ['graphic', 'modern'] },
    { id: 'chinese_cloud_pattern', labelJa: '中華雲文', shortPrompt: 'chinese cloud pattern', tags: ['chinese', 'ornate'] },
    { id: 'dragon_pattern', labelJa: '竜文様', shortPrompt: 'dragon pattern', tags: ['chinese', 'ornate'] },
    { id: 'phoenix_pattern', labelJa: '鳳凰文様', shortPrompt: 'phoenix pattern', tags: ['chinese', 'ornate'] },
    { id: 'gear_pattern', labelJa: '歯車柄', shortPrompt: 'gear pattern', tags: ['mechanical', 'steampunk'] }
  ];
})(window);
