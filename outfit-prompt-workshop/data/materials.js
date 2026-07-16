/* 衣装プロンプト工房 / data/materials.js
 * 素材・柄・表面。MVP最終形は素材40〜50、柄25〜30。ここは代表セット。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  CPW.data.materials = [
    { id: 'flowing_chiffon', labelJa: '流れるようなシフォン', shortPrompt: 'flowing chiffon', detailedPrompt: 'lightweight flowing chiffon fabric', category: 'material', tags: ['lightweight', 'flowing', 'transparent', 'elegant'], recommendedWorldviews: ['western_fantasy', 'fairy_tale'], recommendedAttributes: ['water', 'wind', 'light'], recommendedGarments: ['dress', 'robe', 'swimwear'], conflicts: [{ target: 'heavy_armor', severity: 'warning', reasonJa: '主素材としては重装鎧と質感が合いにくい' }], suggestions: ['pearl_details', 'wave_embroidery', 'layered_hem'] },
    { id: 'silk', labelJa: '絹', shortPrompt: 'silk', detailedPrompt: 'smooth lustrous silk', category: 'material', tags: ['smooth', 'lustrous', 'elegant'], recommendedWorldviews: ['historical_western', 'japanese', 'chinese'], recommendedAttributes: ['light', 'water'], recommendedGarments: ['dress', 'wafuku', 'lingerie'], conflicts: [], suggestions: ['gold_embroidery'] },
    { id: 'velvet', labelJa: 'ベルベット', shortPrompt: 'velvet', detailedPrompt: 'deep-pile velvet', category: 'material', tags: ['heavy', 'matte', 'rich'], recommendedWorldviews: ['historical_western', 'dark_fantasy'], recommendedAttributes: ['darkness', 'fire'], recommendedGarments: ['dress', 'robe', 'uniform'], conflicts: [{ target: 'summer', severity: 'info', reasonJa: '夏の場面には重く見えやすい' }], suggestions: ['gold_embroidery', 'jewel_brooch'] },
    { id: 'lace', labelJa: 'レース', shortPrompt: 'lace', detailedPrompt: 'delicate floral lace', category: 'material', tags: ['delicate', 'transparent', 'ornate'], recommendedWorldviews: ['historical_western', 'dark_fantasy'], recommendedAttributes: ['darkness', 'light'], recommendedGarments: ['dress', 'lingerie'], conflicts: [], suggestions: ['ribbon_bow', 'pearl_details'] },
    { id: 'leather', labelJa: '革', shortPrompt: 'leather', detailedPrompt: 'supple tanned leather', category: 'material', tags: ['sturdy', 'matte', 'functional'], recommendedWorldviews: ['dark_fantasy', 'sci_fi', 'modern'], recommendedAttributes: ['earth', 'darkness'], recommendedGarments: ['top_bottom', 'robe'], conflicts: [], suggestions: ['metal_studs', 'buckle_straps'] },
    { id: 'wool', labelJa: 'ウール', shortPrompt: 'wool', detailedPrompt: 'thick woven wool', category: 'material', tags: ['heavy', 'matte', 'warm'], recommendedWorldviews: ['modern', 'historical_western'], recommendedAttributes: ['earth', 'nature'], recommendedGarments: ['uniform', 'robe'], conflicts: [], suggestions: [] },
    { id: 'linen', labelJa: 'リネン', shortPrompt: 'linen', detailedPrompt: 'crisp natural linen', category: 'material', tags: ['light', 'matte', 'natural'], recommendedWorldviews: ['modern', 'fairy_tale'], recommendedAttributes: ['nature', 'wind'], recommendedGarments: ['top_bottom', 'dress'], conflicts: [], suggestions: [] },
    { id: 'organza', labelJa: 'オーガンジー', shortPrompt: 'organza', detailedPrompt: 'crisp sheer organza', category: 'material', tags: ['sheer', 'light', 'structured'], recommendedWorldviews: ['western_fantasy', 'fairy_tale'], recommendedAttributes: ['ice', 'light', 'wind'], recommendedGarments: ['dress'], conflicts: [], suggestions: ['crystal_embroidery'] },
    { id: 'satin', labelJa: 'サテン', shortPrompt: 'satin', detailedPrompt: 'glossy satin', category: 'material', tags: ['glossy', 'smooth'], recommendedWorldviews: ['modern', 'historical_western'], recommendedAttributes: ['water', 'light'], recommendedGarments: ['dress', 'lingerie'], conflicts: [], suggestions: ['ribbon_bow'] },
    { id: 'brocade', labelJa: '錦・ブロケード', shortPrompt: 'brocade', detailedPrompt: 'woven brocade with raised patterning', category: 'material', tags: ['heavy', 'ornate', 'patterned'], recommendedWorldviews: ['historical_western', 'chinese'], recommendedAttributes: ['fire', 'earth'], recommendedGarments: ['uniform', 'dress', 'chinese'], conflicts: [], suggestions: ['gold_embroidery'] },
    { id: 'metallic_thread', labelJa: '金属糸', shortPrompt: 'metallic thread', detailedPrompt: 'fine metallic thread', category: 'trim', tags: ['metallic', 'ornate'], recommendedWorldviews: ['western_fantasy', 'historical_western'], recommendedAttributes: ['light', 'thunder'], recommendedGarments: [], conflicts: [], suggestions: [] },
    { id: 'crystal_details', labelJa: '結晶の飾り', shortPrompt: 'crystal details', detailedPrompt: 'faceted crystal details', category: 'trim', tags: ['sparkling', 'ornate'], recommendedWorldviews: ['western_fantasy'], recommendedAttributes: ['ice', 'light'], recommendedGarments: [], conflicts: [], suggestions: [] },
    { id: 'plate_armor', labelJa: '板金鎧', shortPrompt: 'plate armor', detailedPrompt: 'segmented plate armor', category: 'material', tags: ['rigid', 'heavy', 'metallic'], recommendedWorldviews: ['western_fantasy'], recommendedAttributes: ['earth', 'thunder'], recommendedGarments: ['uniform'], conflicts: [{ target: 'flowing_chiffon', severity: 'warning', reasonJa: '同一部位の主素材としては両立しにくい' }], suggestions: ['metal_studs'] }
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
    { id: 'rune_pattern', labelJa: 'ルーン文様', shortPrompt: 'rune pattern', tags: ['norse'] }
  ];
})(window);
