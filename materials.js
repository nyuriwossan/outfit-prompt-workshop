/* 衣装プロンプト工房 / data/decorations.js
 * 装飾の種類・位置・特殊パーツ。装飾は「一件ごとに位置と紐付ける」（9.4）。
 * weight は装飾飽和判定（15.3）で使う内部の重み。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  // 装飾密度（15.3）
  CPW.data.decorationDensity = [
    { level: 0, id: 'minimal', adjEn: null, labelJa: '最小限', shortPrompt: 'minimally decorated', budget: 1 },
    { level: 1, id: 'restrained', adjEn: null, labelJa: '控えめ', shortPrompt: 'restrained decoration', budget: 2 },
    { level: 2, id: 'decorative', adjEn: 'decorated', labelJa: '装飾的', shortPrompt: 'decorated', budget: 4 },
    { level: 3, id: 'ornate', adjEn: 'ornate', labelJa: '華やか', shortPrompt: 'ornate', budget: 6 },
    { level: 4, id: 'lavish', adjEn: 'lavish', labelJa: '豪奢', shortPrompt: 'lavishly decorated', budget: 8 },
    { level: 5, id: 'maximalist', adjEn: 'maximalist', labelJa: '最大主義', shortPrompt: 'maximalist ornamentation', budget: null }
  ];

  CPW.data.decorationPlacements = [
    { id: 'collar', labelJa: '襟', promptEn: 'collar' },
    { id: 'chest', labelJa: '胸元', promptEn: 'chest' },
    { id: 'shoulders', labelJa: '肩', promptEn: 'shoulders' },
    { id: 'sleeves', labelJa: '袖', promptEn: 'sleeves' },
    { id: 'cuffs', labelJa: '袖口', promptEn: 'cuffs' },
    { id: 'waist', labelJa: '腰', promptEn: 'waist' },
    { id: 'skirt', labelJa: 'スカート', promptEn: 'skirt' },
    { id: 'hem', labelJa: '裾', promptEn: 'hem' },
    { id: 'back', labelJa: '背中', promptEn: 'back' },
    { id: 'cape_edges', labelJa: 'ケープの縁', promptEn: 'cape edges' },
    { id: 'legs', labelJa: '脚', promptEn: 'legs' },
    { id: 'head', labelJa: '頭部', promptEn: 'headpiece' },
    { id: 'hands', labelJa: '手', promptEn: 'hands' },
    { id: 'overall', labelJa: '全体', promptEn: 'throughout', noArticle: true }
  ];

  // 装飾の役割。主役／補助／縁取りの3種。
  CPW.data.decorationRoles = [
    { id: 'focal', labelJa: '主役', weightFactor: 1.5 },
    { id: 'support', labelJa: '補助', weightFactor: 0.8 },
    { id: 'trim', labelJa: '縁取り', weightFactor: 0.5 }
  ];

  CPW.data.decorationSizes = [
    { id: 'small', labelJa: '小', shortPrompt: 'small' },
    { id: 'medium', labelJa: '中', shortPrompt: '' },
    { id: 'large', labelJa: '大', shortPrompt: 'large' }
  ];

  // 装飾量（19.1 items[].quantity）。装飾密度と語が衝突しないよう別語彙にする。
  CPW.data.decorationQuantities = [
    { id: 'single', labelJa: '一点', shortPrompt: 'a single', weight: 1 },
    { id: 'few', labelJa: '数点', shortPrompt: 'a few', weight: 2 },
    { id: 'many', labelJa: '多数', shortPrompt: 'numerous', weight: 4 }
  ];

  CPW.data.decorations = [
    { id: 'silver_embroidery', uncountable: true, prep: 'along', labelJa: '銀糸刺繍', shortPrompt: 'silver embroidery', detailedPrompt: 'fine silver embroidery', tags: ['metallic', 'ornate'], weight: 1, recommendedAttributes: ['ice', 'light'], recommendedPlacements: ['collar', 'cuffs', 'cape_edges'] },
    { id: 'gold_embroidery', uncountable: true, prep: 'along', labelJa: '金糸刺繍', shortPrompt: 'gold embroidery', detailedPrompt: 'fine gold embroidery', tags: ['metallic', 'ornate'], weight: 1, recommendedAttributes: ['light', 'fire'], recommendedPlacements: ['collar', 'cuffs', 'hem'] },
    { id: 'crystal_embroidery', uncountable: true, prep: 'along', labelJa: '氷晶刺繍', shortPrompt: 'crystal embroidery', detailedPrompt: 'crystalline embroidery', tags: ['sparkling'], weight: 1, recommendedAttributes: ['ice'], recommendedPlacements: ['cuffs', 'hem', 'shoulders'] },
    { id: 'sapphire_brooch', prep: 'at', labelJa: 'サファイアのブローチ', shortPrompt: 'sapphire brooch', detailedPrompt: 'a sapphire brooch', tags: ['jewel'], weight: 2, recommendedAttributes: ['ice', 'water'], recommendedPlacements: ['chest'] },
    { id: 'ribbon_bow', prep: 'at', labelJa: 'リボン', shortPrompt: 'ribbon bows', detailedPrompt: 'ribbon bows', tags: ['frilled'], weight: 1, recommendedAttributes: [], recommendedPlacements: ['chest', 'waist', 'head'] },
    { id: 'rose_ornament', prep: 'at', labelJa: '薔薇飾り', shortPrompt: 'rose ornaments', detailedPrompt: 'fabric rose ornaments', tags: ['floral'], weight: 2, recommendedAttributes: ['nature', 'darkness'], recommendedPlacements: ['chest', 'skirt', 'head'] },
    { id: 'cross_ornament', prep: 'at', labelJa: '十字飾り', shortPrompt: 'cross ornaments', detailedPrompt: 'ornamental crosses', tags: ['gothic'], weight: 2, recommendedAttributes: ['darkness', 'light'], recommendedPlacements: ['chest', 'legs'] },
    { id: 'lace_trim', uncountable: true, prep: 'around', labelJa: 'レース縁取り', shortPrompt: 'lace trim', detailedPrompt: 'delicate lace trim', tags: ['frilled'], weight: 1, recommendedAttributes: [], recommendedPlacements: ['collar', 'cuffs', 'hem'] },
    { id: 'metal_studs', prep: 'along', labelJa: '金属鋲', shortPrompt: 'metal studs', detailedPrompt: 'metal studs', tags: ['rough', 'metallic'], weight: 1, recommendedAttributes: ['thunder', 'earth'], recommendedPlacements: ['shoulders', 'waist'] },
    { id: 'pearl_details', uncountable: true, prep: 'along', labelJa: '真珠飾り', shortPrompt: 'pearl details', detailedPrompt: 'small pearl details', tags: ['jewel'], weight: 1, recommendedAttributes: ['water', 'light'], recommendedPlacements: ['collar', 'chest', 'hem'] },
    { id: 'snowflake_motif', prep: 'on', labelJa: '雪片文様', shortPrompt: 'snowflake motifs', detailedPrompt: 'snowflake motifs', tags: ['ice'], weight: 1, recommendedAttributes: ['ice'], recommendedPlacements: ['skirt', 'sleeves'] },
    { id: 'feather_details', uncountable: true, prep: 'at', labelJa: '羽根飾り', shortPrompt: 'feather details', detailedPrompt: 'soft feather details', tags: ['soft'], weight: 2, recommendedAttributes: ['wind', 'light'], recommendedPlacements: ['shoulders', 'hem'] },
    { id: 'brooch_cluster', prep: 'at', labelJa: 'ブローチの群れ', shortPrompt: 'clustered brooches', detailedPrompt: 'a cluster of brooches', tags: ['jewel', 'ornate'], weight: 3, recommendedAttributes: [], recommendedPlacements: ['chest'] }
  ];

  // 特殊パーツ（9.5 / 16）
  /* ============================================================
   * 特殊パーツ（Phase 5A で構造確定）
   *
   * 翼・角・光輪・尾は「複合スロット」。手袋と同じ考え方で、種類を要とし、
   * 種類が未選択なら従属軸は状態に残ったまま休止する（出力・完成度・警告に混ぜない）。
   * schema.activeComposite / schema.slotKind がそのまま使える形にしてある。
   *
   * 色は3通り。
   *   linkTo: 'palette.primary' … 衣装の主色と連動
   *   linkTo: 'palette.metal'   … 金属色と連動
   *   individual: true          … 個別指定（値は colorId に入る）
   *
   * チェーンは装飾用と拘束・物語用でカテゴリを分ける（Phase 3 からの約束）。
   *   decorativeChains … 衣装装飾。衣装のみ出力でも出る。
   *   restraintChains  … 物語・拘束。includeNarrative がONのときだけ出る。
   * ========================================================== */

  /* 色連動の軸は全パーツで同じ選択肢を使う */
  function colorAxis(prefix, labelJa) {
    return {
      key: 'color', labelJa: labelJa || '色', kind: 'colorLink',
      noteJa: '衣装の色と連動させるか、この部位だけ別の色にするかを選べるよ。',
      options: [
        { id: prefix + '_color_primary', labelJa: '衣装の主色と連動', shortPrompt: '', linkTo: 'palette.primary' },
        { id: prefix + '_color_metal', labelJa: '金属色と連動', shortPrompt: '', linkTo: 'palette.metal' },
        { id: prefix + '_color_individual', labelJa: '個別指定', shortPrompt: '', individual: true }
      ]
    };
  }

  CPW.data.specialParts = {
    /* ---- 単一・複合スロット ---- */
    slots: [
      {
        id: 'wings', labelJa: '翼', kind: 'composite', multi: false,
        requiredAxis: 'type',
        phraseOrder: ['size', 'spread', 'texture'],   // 色と枚数は generator が別に扱う
        countAxis: 'count',
        legacyMap: {
          feathered_wings: { type: 'bird_wings', texture: 'wing_feathered' },
          black_feathered_wings: { type: 'fallen_angel_wings', texture: 'wing_feathered' },
          bat_wings: { type: 'demon_wings', texture: 'wing_leathery' },
          crystal_wings: { type: 'energy_wings', texture: 'wing_crystalline' },
          small_wings: { size: 'wing_small' },
          medium_wings: { size: 'wing_medium' },
          massive_wings: { size: 'wing_massive' },
          folded: { spread: 'wing_folded' },
          half_open: { spread: 'wing_half_open' },
          wide_open: { spread: 'wing_spread_wide' }
        },
        axes: [
          {
            key: 'type', labelJa: '種類', required: true,
            noteJa: '種類を選ぶと、大きさ・開き方・質感などが編集できるようになるよ。解除すると、下の項目は残したまま休止して、出力には混ざらない。',
            options: [
              { id: 'angel_wings', labelJa: '天使の翼', shortPrompt: 'angel wings', tags: ['wings', 'sacred', 'organic'] },
              { id: 'fallen_angel_wings', labelJa: '堕天使の翼', shortPrompt: 'fallen angel wings', tags: ['wings', 'sacred', 'dark', 'organic'] },
              { id: 'demon_wings', labelJa: '悪魔の翼', shortPrompt: 'demon wings', tags: ['wings', 'demonic', 'organic'] },
              { id: 'bird_wings', labelJa: '鳥の翼', shortPrompt: 'bird wings', tags: ['wings', 'organic'] },
              { id: 'insect_wings', labelJa: '蟲の翼', shortPrompt: 'insect wings', tags: ['wings', 'organic'] },
              { id: 'mechanical_wings', labelJa: '機械の翼', shortPrompt: 'mechanical wings', tags: ['wings', 'mechanical'] },
              { id: 'energy_wings', labelJa: '光の翼', shortPrompt: 'energy wings', tags: ['wings', 'energy'] }
            ]
          },
          {
            key: 'size', labelJa: '大きさ', options: [
              { id: 'wing_small', labelJa: '小', shortPrompt: 'small', weight: 1 },
              { id: 'wing_medium', labelJa: '中', shortPrompt: '', weight: 2 },
              { id: 'wing_large', labelJa: '大', shortPrompt: 'large', weight: 3 },
              { id: 'wing_massive', labelJa: '巨大', shortPrompt: 'massive', weight: 4, tags: ['back_heavy'] }
            ]
          },
          {
            key: 'spread', labelJa: '開き方', options: [
              { id: 'wing_folded', labelJa: '畳む', shortPrompt: 'folded' },
              { id: 'wing_half_open', labelJa: '半開き', shortPrompt: 'half-open' },
              { id: 'wing_spread_wide', labelJa: '大きく開く', shortPrompt: 'spread', tags: ['back_wide'] },
              { id: 'wing_lowered', labelJa: '下ろす', shortPrompt: 'lowered' }
            ]
          },
          {
            key: 'count', labelJa: '枚数・構造', options: [
              { id: 'wing_one_pair', labelJa: '一対', shortPrompt: 'a pair of', fixedArticle: true },
              { id: 'wing_two_pairs', labelJa: '二対', shortPrompt: 'two pairs of', fixedArticle: true, tags: ['back_heavy'] },
              { id: 'wing_multiple', labelJa: '多数', shortPrompt: 'multiple', fixedArticle: true, tags: ['back_heavy'] }
            ]
          },
          {
            key: 'texture', labelJa: '質感', options: [
              { id: 'wing_feathered', labelJa: '羽毛', shortPrompt: 'feathered', tags: ['organic'] },
              { id: 'wing_leathery', labelJa: '革質', shortPrompt: 'leathery', tags: ['organic'] },
              { id: 'wing_translucent', labelJa: '透ける', shortPrompt: 'translucent' },
              { id: 'wing_metallic', labelJa: '金属', shortPrompt: 'metallic', tags: ['mechanical'] },
              { id: 'wing_crystalline', labelJa: '結晶', shortPrompt: 'crystalline' },
              { id: 'wing_ethereal', labelJa: '霊気', shortPrompt: 'ethereal', tags: ['energy'] }
            ]
          },
          colorAxis('wing')
        ]
      },
      {
        id: 'horns', labelJa: '角', kind: 'composite', multi: false,
        requiredAxis: 'type',
        phraseOrder: ['size', 'direction', 'material'],
        countAxis: 'count',
        legacyMap: {
          small_horns: { type: 'horn_curved', size: 'horn_small' },
          curved_horns: { type: 'horn_curved' },
          crystal_horns: { type: 'horn_crystal' }
        },
        axes: [
          {
            key: 'type', labelJa: '種類', required: true,
            noteJa: '種類を選ぶと、本数・大きさ・向き・素材・色が編集できるようになるよ。',
            options: [
              { id: 'horn_curved', labelJa: '曲がった角', shortPrompt: 'curved horns', tags: ['horns'] },
              { id: 'horn_ram', labelJa: '羊の角', shortPrompt: 'ram horns', tags: ['horns'] },
              { id: 'horn_antler', labelJa: '枝角', shortPrompt: 'antler-like horns', tags: ['horns', 'organic'] },
              { id: 'horn_crown', labelJa: '冠状の小角', shortPrompt: 'crown-like horns', tags: ['horns', 'ornate'] },
              { id: 'horn_crystal', labelJa: '結晶の角', shortPrompt: 'crystalline horns', tags: ['horns'] },
              { id: 'horn_straight', labelJa: '真っ直ぐな角', shortPrompt: 'straight horns', tags: ['horns'] },
              { id: 'horn_mechanical', labelJa: '機械の角', shortPrompt: 'mechanical horns', tags: ['horns', 'mechanical'] }
            ]
          },
          {
            key: 'count', labelJa: '本数', options: [
              { id: 'horn_two', labelJa: '2本', shortPrompt: '', plural: true },
              { id: 'horn_four', labelJa: '4本', shortPrompt: 'four', plural: true },
              { id: 'horn_many', labelJa: '多数', shortPrompt: 'many', plural: true }
            ]
          },
          {
            key: 'size', labelJa: '大きさ', options: [
              { id: 'horn_small', labelJa: '小', shortPrompt: 'small' },
              { id: 'horn_medium', labelJa: '中', shortPrompt: '' },
              { id: 'horn_large', labelJa: '大', shortPrompt: 'large', tags: ['head_heavy'] }
            ]
          },
          {
            key: 'direction', labelJa: '向き', options: [
              { id: 'horn_upward', labelJa: '上向き', shortPrompt: 'upward-curving' },
              { id: 'horn_backward', labelJa: '後ろ向き', shortPrompt: 'backswept' },
              { id: 'horn_sideways', labelJa: '横向き', shortPrompt: 'outward-spreading', tags: ['head_heavy'] },
              { id: 'horn_spiral', labelJa: '螺旋', shortPrompt: 'spiraling' }
            ]
          },
          {
            key: 'material', labelJa: '素材', options: [
              { id: 'horn_mat_bone', labelJa: '骨', shortPrompt: 'bone' },
              { id: 'horn_mat_crystal', labelJa: '結晶', shortPrompt: 'crystal' },
              { id: 'horn_mat_metal', labelJa: '金属', shortPrompt: 'metal', tags: ['mechanical'] },
              { id: 'horn_mat_obsidian', labelJa: '黒曜石', shortPrompt: 'obsidian' }
            ]
          },
          colorAxis('horn')
        ]
      },
      {
        id: 'halo', labelJa: '光輪', kind: 'composite', multi: false,
        requiredAxis: 'type',
        phraseOrder: ['form', 'glow'],
        legacyMap: {
          ring_halo: { type: 'halo_ring' },
          broken_halo: { type: 'halo_broken' },
          dark_halo: { type: 'halo_dark' }
        },
        axes: [
          {
            key: 'type', labelJa: '種類', required: true,
            noteJa: '種類を選ぶと、位置・形・色・発光が編集できるようになるよ。',
            options: [
              { id: 'halo_ring', labelJa: '通常の光輪', shortPrompt: 'halo', tags: ['halo', 'sacred'] },
              { id: 'halo_double', labelJa: '二重光輪', shortPrompt: 'double halo', tags: ['halo', 'sacred'] },
              { id: 'halo_broken', labelJa: '壊れた光輪', shortPrompt: 'broken halo', tags: ['halo', 'sacred', 'dark'] },
              { id: 'halo_dark', labelJa: '黒い光輪', shortPrompt: 'dark halo', tags: ['halo', 'dark'] },
              { id: 'halo_mechanical', labelJa: '機械的光輪', shortPrompt: 'mechanical halo', tags: ['halo', 'mechanical'] },
              { id: 'halo_geometric', labelJa: '浮遊する幾何学光輪', shortPrompt: 'floating geometric halo', tags: ['halo', 'energy'] }
            ]
          },
          {
            key: 'position', labelJa: '位置', options: [
              { id: 'halo_above', labelJa: '頭上', shortPrompt: 'above the head', tags: ['head_heavy'] },
              { id: 'halo_behind', labelJa: '背後', shortPrompt: 'behind the head' },
              { id: 'halo_tilted', labelJa: '傾いた', shortPrompt: 'tilted over the head', tags: ['head_heavy'] }
            ]
          },
          {
            key: 'form', labelJa: '形', options: [
              { id: 'halo_simple', labelJa: '単純な輪', shortPrompt: 'simple' },
              { id: 'halo_ornate', labelJa: '装飾的', shortPrompt: 'ornate' },
              { id: 'halo_jagged', labelJa: '鋭い', shortPrompt: 'jagged' }
            ]
          },
          {
            key: 'glow', labelJa: '発光', options: [
              { id: 'halo_glowing', labelJa: '光る', shortPrompt: 'glowing', tags: ['emits_light'] },
              { id: 'halo_matte', labelJa: '光らない', shortPrompt: 'matte' }
            ]
          },
          colorAxis('halo')
        ]
      },
      {
        id: 'tail', labelJa: '尾', kind: 'composite', multi: false,
        requiredAxis: 'type',
        phraseOrder: ['length', 'thickness'],
        countAxis: 'count',
        legacyMap: {
          slim_tail: { type: 'tail_demon', thickness: 'tail_slender' },
          fur_tail: { type: 'tail_animal' },
          fish_tail: { type: 'tail_animal', tip: 'tail_tip_fin' }
        },
        axes: [
          {
            key: 'type', labelJa: '種類', required: true,
            noteJa: '種類を選ぶと、長さ・太さ・先端が編集できるようになるよ。',
            options: [
              { id: 'tail_demon', labelJa: '悪魔の尾', shortPrompt: 'demon tail', tags: ['tail', 'demonic'] },
              { id: 'tail_dragon', labelJa: '竜の尾', shortPrompt: 'dragon tail', tags: ['tail'] },
              { id: 'tail_animal', labelJa: '獣の尾', shortPrompt: 'animal tail', tags: ['tail', 'organic'] },
              { id: 'tail_mechanical', labelJa: '機械の尾', shortPrompt: 'mechanical tail', tags: ['tail', 'mechanical'] },
              { id: 'tail_feathered', labelJa: '羽毛の尾', shortPrompt: 'feathered tail', tags: ['tail', 'organic'] },
              { id: 'tail_energy', labelJa: '光の尾', shortPrompt: 'energy tail', tags: ['tail', 'energy'] }
            ]
          },
          {
            key: 'count', labelJa: '本数', options: [
              { id: 'tail_one', labelJa: '1本', shortPrompt: '' },
              { id: 'tail_two', labelJa: '2本', shortPrompt: 'two', plural: true, tags: ['multi_tail'] },
              { id: 'tail_many', labelJa: '多数', shortPrompt: 'multiple', plural: true, tags: ['multi_tail'] }
            ]
          },
          {
            key: 'length', labelJa: '長さ', options: [
              { id: 'tail_short', labelJa: '短い', shortPrompt: 'short' },
              { id: 'tail_medium', labelJa: '中', shortPrompt: '' },
              { id: 'tail_long', labelJa: '長い', shortPrompt: 'long', tags: ['trailing'] }
            ]
          },
          {
            key: 'thickness', labelJa: '太さ', options: [
              { id: 'tail_slender', labelJa: '細い', shortPrompt: 'slender' },
              { id: 'tail_thick', labelJa: '太い', shortPrompt: 'thick' }
            ]
          },
          {
            key: 'tip', labelJa: '先端', options: [
              { id: 'tail_tip_spade', labelJa: '鏃形', shortPrompt: 'a spade-shaped tip' },
              { id: 'tail_tip_tuft', labelJa: '房', shortPrompt: 'a tufted tip' },
              { id: 'tail_tip_blade', labelJa: '刃', shortPrompt: 'a bladed tip' },
              { id: 'tail_tip_fin', labelJa: '鰭', shortPrompt: 'a finned tip' }
            ]
          },
          colorAxis('tail')
        ]
      }
    ],

    /* ---- 複数追加できるもの ---- */
    decorativeChainPrep: 'draped across',
    decorativeChainWeight: 2,
    decorativeChains: [
      { id: 'chest_chain', labelJa: '胸元の飾り鎖', shortPrompt: 'decorative chest chains', placement: 'chest' },
      { id: 'shoulder_chain', labelJa: '肩章の鎖', shortPrompt: 'chains across the epaulettes', placement: 'shoulders' },
      { id: 'waist_chain', labelJa: '腰の飾り鎖', shortPrompt: 'decorative waist chains', placement: 'waist' },
      { id: 'cape_clasp_chain', labelJa: 'ケープ留めの鎖', shortPrompt: 'a chain cape clasp', placement: 'chest' }
    ],
    restraintChains: [
      { id: 'collar_chain', labelJa: '首輪から伸びる鎖', shortPrompt: 'a chain from a collar', narrative: true, narrativeTheme: 'imprisonment' },
      { id: 'wrist_chain', labelJa: '手首の鎖', shortPrompt: 'chained wrists', narrative: true, narrativeTheme: 'imprisonment' },
      { id: 'ankle_shackle', labelJa: '足枷', shortPrompt: 'ankle shackles', narrative: true, narrativeTheme: 'captivity' },
      { id: 'magic_binding', labelJa: '魔法的拘束', shortPrompt: 'magical bindings', narrative: true, narrativeTheme: 'binding' }
    ],
    /* 浮遊装飾は「物として浮いているもの」。発光そのものではない。 */
    floatingPrep: 'surrounded by',
    floating: [
      { id: 'floating_ornaments', labelJa: '浮遊装飾', shortPrompt: 'floating ornaments', weight: 2 },
      { id: 'floating_shards', labelJa: '浮遊する破片', shortPrompt: 'floating crystal shards', weight: 2 },
      { id: 'floating_feathers', labelJa: '舞う羽根', shortPrompt: 'drifting feathers', weight: 1 },
      { id: 'floating_petals', labelJa: '舞う花弁', shortPrompt: 'drifting petals', weight: 1 },
      { id: 'floating_ribbons', labelJa: '漂う細布', shortPrompt: 'floating ribbons', weight: 1 }
    ],
    /* 魔法的装飾は「衣装に付いた術式の意匠」。属性エフェクト（光・霧・火花）とは別物。
     * includeEffects がOFFでも、これは装飾なので衣装のみ出力に出る。 */
    magicalPrep: 'marked with',
    magical: [
      { id: 'magic_circle', labelJa: '魔法陣風装飾', shortPrompt: 'arcane circle motifs', weight: 2 },
      { id: 'rune_bands', labelJa: '刻印の帯', shortPrompt: 'engraved rune bands', weight: 1 },
      { id: 'sigil_seals', labelJa: '印章', shortPrompt: 'sigil seals', weight: 1 },
      { id: 'glyph_embroidery', labelJa: '呪文刺繍', shortPrompt: 'glyph embroidery', weight: 1 },
      { id: 'orbiting_glyphs', labelJa: '周回する紋様', shortPrompt: 'orbiting glyphs', weight: 2 }
    ]
  };

  /* id から複合スロットを引く（app / advisor / generator / gacha が使う） */
  CPW.data.specialPartSlot = function (id) {
    return CPW.data.specialParts.slots.filter(function (s) { return s.id === id; })[0] || null;
  };
})(window);
