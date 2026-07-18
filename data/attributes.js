/* 衣装プロンプト工房 / data/attributes.js
 * 属性は9件でMVP完了。effects は「魔法的演出」ONのときだけ文章生成に渡す。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  CPW.data.attributeIntensities = [
    { id: 'subtle', labelJa: '控えめ', maxHints: 1 },
    { id: 'standard', labelJa: '標準', maxHints: 2 },
    { id: 'strong', labelJa: '強め', maxHints: 3 }
  ];

  /* ============================================================
   * 9属性（Phase 5A で全面監査）
   *
   * 監査の約束
   *   - 参照IDはすべて実在する（data-quality テストで検査する）
   *   - 光属性に angel、闇属性に demon を入れない。
   *     「光＝天使」「闇＝悪魔」は別概念。天使・悪魔を出したいなら
   *     主テーマ（motifs）か特殊パーツで明示的に選ぶ。
   *   - 水と氷を混ぜない。水は流れ・drape・波、氷は硬さ・結晶・鋭さ。
   *   - 自然を緑と花だけにしない。樹皮・蔓・土・獣の質感まで含める。
   *   - avoidTags … その属性で「王道候補にしない」手ざわり。
   *     現代服へ魔法装飾を勧めないための歯止めは affinity.worldviewAvoid 側と二重に効く。
   *
   * 各項目
   *   colors / materials / decorations（patterns を含む）/ silhouettes … 補助候補の出どころ
   *   motifs            … 相性のよい主テーマ。属性が勝手に決めるものではない
   *   effects           … includeEffects がONのときだけ英語へ渡す演出語
   *   moods             … 語感。生成には直接使わない
   *   recommendedStyles … 王道候補の様式
   *   avoidTags         … 王道候補から外す手ざわり
   * ========================================================== */
  CPW.data.attributes = [
    {
      id: 'fire', labelJa: '炎',
      colors: ['deep_crimson', 'vermilion', 'jet_black', 'antique_gold'],
      materials: ['silk', 'metallic_thread', 'brocade'],
      decorations: ['gold_embroidery', 'metal_studs', 'star_pattern'],
      silhouettes: ['tailored', 'flared', 'asymmetrical'],
      motifs: ['leo', 'sun'],
      effects: ['ember glow', 'drifting sparks'],
      moods: ['passionate', 'fierce', 'radiant'],
      recommendedStyles: ['baroque', 'punk', 'military'],
      avoidTags: ['frilled', 'soft']
    },
    {
      id: 'ice', labelJa: '氷',
      // 氷は「硬さ・結晶・鋭さ」。水と違って drape も波もない。
      colors: ['pearl_white', 'polished_silver', 'ice_blue', 'pale_cyan'],
      materials: ['organza', 'crystal_details', 'silk'],
      decorations: ['snowflake_motif', 'crystal_embroidery', 'frost_pattern'],
      silhouettes: ['tailored', 'slim_upper', 'slim'],
      motifs: ['starry_sky', 'aquarius'],
      effects: ['frosted glow', 'icy mist'],
      moods: ['cold', 'elegant', 'serene', 'ethereal'],
      recommendedStyles: ['minimal', 'classical', 'royal'],
      avoidTags: ['rough', 'casual']
    },
    {
      id: 'water', labelJa: '水',
      // 水は「流れ・drape・波・雫」。氷と違って硬さも鋭さもない。
      colors: ['sapphire_blue', 'teal', 'deep_navy', 'pearl_white'],
      materials: ['flowing_chiffon', 'satin', 'silk'],
      decorations: ['pearl_details', 'wave_pattern'],
      silhouettes: ['draped', 'flared', 'dropped_waist'],
      motifs: ['pisces', 'sea_and_mermaid'],
      effects: ['rippling water', 'droplet shimmer'],
      moods: ['calm', 'fluid', 'deep'],
      recommendedStyles: ['classical', 'baroque'],
      avoidTags: ['rigid', 'structured', 'military']
    },
    {
      id: 'wind', labelJa: '風',
      colors: ['pure_white', 'sky_blue', 'pale_cyan', 'sage_green'],
      materials: ['flowing_chiffon', 'linen', 'organza'],
      decorations: ['ribbon_bow', 'feather_details'],
      silhouettes: ['draped', 'asymmetrical', 'voluminous'],
      motifs: ['gemini', 'starry_sky'],
      effects: ['swirling breeze', 'floating fabric'],
      moods: ['light', 'free', 'restless'],
      recommendedStyles: ['classical', 'minimal'],
      avoidTags: ['heavy', 'rigid', 'structured']
    },
    {
      id: 'earth', labelJa: '大地',
      colors: ['warm_brown', 'sand_beige', 'mustard_yellow', 'sage_green'],
      materials: ['leather', 'wool', 'linen'],
      decorations: ['metal_studs', 'brooch_cluster'],
      silhouettes: ['relaxed', 'structured', 'natural_waist'],
      motifs: ['norse_mythology', 'libra'],
      effects: ['drifting dust', 'stone glow'],
      moods: ['grounded', 'sturdy', 'quiet'],
      recommendedStyles: ['military', 'minimal', 'classical'],
      avoidTags: ['frilled', 'sparkling']
    },
    {
      id: 'thunder', labelJa: '雷',
      colors: ['sky_blue', 'amethyst_violet', 'polished_silver', 'jet_black'],
      materials: ['metallic_thread', 'leather', 'satin'],
      decorations: ['metal_studs', 'silver_embroidery', 'rune_pattern'],
      silhouettes: ['tailored', 'structured', 'asymmetrical'],
      motifs: ['norse_mythology', 'greek_mythology'],
      effects: ['electric sparks', 'crackling arcs'],
      moods: ['sudden', 'sharp', 'charged'],
      recommendedStyles: ['punk', 'techwear', 'military'],
      avoidTags: ['frilled', 'soft']
    },
    {
      id: 'light', labelJa: '光',
      // 神聖ではあるが、天使ではない。angel を motifs に入れないのは意図的。
      colors: ['warm_ivory', 'pure_white', 'pale_gold', 'antique_gold'],
      materials: ['silk', 'organza', 'metallic_thread'],
      decorations: ['gold_embroidery', 'pearl_details', 'star_pattern'],
      silhouettes: ['draped', 'symmetrical', 'high_waist'],
      motifs: ['sun', 'leo'],
      effects: ['radiant glow', 'divine light'],
      moods: ['solemn', 'clear', 'sacred'],
      recommendedStyles: ['classical', 'royal', 'baroque'],
      avoidTags: ['rough', 'street']
    },
    {
      id: 'darkness', labelJa: '闇',
      // 暗いが、悪魔ではない。demon を motifs に入れないのは意図的。
      colors: ['jet_black', 'charcoal_gray', 'royal_purple', 'burgundy'],
      materials: ['velvet', 'leather', 'lace'],
      decorations: ['lace_trim', 'rose_ornament', 'damask'],
      silhouettes: ['fitted', 'slim', 'asymmetrical'],
      motifs: ['moon', 'scorpio'],
      effects: ['shadow haze', 'dark aura'],
      moods: ['still', 'heavy', 'secretive'],
      recommendedStyles: ['gothic', 'victorian', 'baroque'],
      avoidTags: ['casual', 'sparkling']
    },
    {
      id: 'nature', labelJa: '自然・植物',
      // 緑と花だけにしない。樹皮・蔓・土・獣まで含める。
      colors: ['forest_green', 'sage_green', 'warm_brown', 'young_leaf_green'],
      materials: ['linen', 'wool', 'leather'],
      decorations: ['floral_lace_pattern', 'feather_details', 'rose_ornament'],
      silhouettes: ['relaxed', 'flared', 'natural_waist'],
      motifs: ['red_hood_forest', 'japanese_mythology'],
      effects: ['drifting petals', 'growing vines'],
      moods: ['living', 'overgrown', 'gentle'],
      recommendedStyles: ['classical', 'lolita', 'minimal'],
      avoidTags: ['mechanical', 'military']
    }
  ];
})(window);
