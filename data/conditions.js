/* 衣装プロンプト工房 / data/conditions.js
 * Phase 5B 後半：衣装の状態・加工。素材・装飾とは別の独立レイヤー。
 *
 * ── 型 ──────────────────────────────────────
 *   id        … snake_case。保存データに入るので変えない。
 *   group     … 'state'（現在の状態） | 'treatment'（最初から施された加工）
 *   family    … UIの分類。dirt / damage / wet / blood / aging / treatment
 *   base      … 既定の英語句。textile を基準にした一般表現。
 *   noAdverb  … true なら程度副詞（lightly/heavily）を付けない。
 *               句自体が強さを含む場合（caked with mud 等）の二重付与を防ぐ。
 *   byClass   … 素材の matClasses 別の言い換え。金属は破れない・防水は吸わない、
 *               を生成側で保証するための表。無いクラスは base を使う。
 *   avoidClasses … この状態が物理的に不自然になる素材分類。
 *               ガチャは候補から外し、advisor は警告を出す。
 *   tags      … 競合ルール用。cond_tear / cond_wrinkle / cond_wet_absorb /
 *               cond_droplets / cond_blood / cond_pile / cond_repair /
 *               cond_fade / cond_heavy_tear / cond_treat_* など。
 *
 * ── 生成の約束（仕様書§6・§7） ──────────────
 *   ・濡れから透け・密着・露出を自動追加しない（別概念）。
 *   ・血は衣装・布地・装備・鱗への付着表現のみ。負傷・流血・gore は作らない。
 *   ・'with dirt' / 'with wet' / 'torn open' は生成しない。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  CPW.data.conditionSeverities = [
    { id: 'light', labelJa: '軽度', adverb: 'lightly' },
    { id: 'moderate', labelJa: '中程度', adverb: '' },
    { id: 'heavy', labelJa: '重度', adverb: 'heavily' }
  ];

  CPW.data.conditionExtents = [
    { id: 'localized', labelJa: '一部' },
    { id: 'scattered', labelJa: '所々' },
    { id: 'widespread', labelJa: '広範囲' },
    { id: 'overall', labelJa: '全体' }
  ];

  /* 部位。atEn は「〜に」の句、nounEn は widespread（across much of …）用の名詞。
   * legRelated は人魚カテゴリで候補から外す。merfolkOnly は人魚のときだけ出す。 */
  CPW.data.conditionPlacements = [
    { id: 'hem', labelJa: '裾', atEn: 'along the hem', nounEn: 'the hem' },
    { id: 'sleeves', labelJa: '袖', atEn: 'across the sleeves', nounEn: 'the sleeves' },
    { id: 'one_sleeve', labelJa: '片袖', atEn: 'at one sleeve', nounEn: 'one sleeve' },
    { id: 'cuffs', labelJa: '袖口', atEn: 'at the cuffs', nounEn: 'the cuffs' },
    { id: 'shoulders', labelJa: '肩', atEn: 'across the shoulders', nounEn: 'the shoulders' },
    { id: 'chest', labelJa: '胸元', atEn: 'across the chest', nounEn: 'the chest' },
    { id: 'back', labelJa: '背中', atEn: 'across the back', nounEn: 'the back' },
    { id: 'knees', labelJa: '膝', atEn: 'at the knees', nounEn: 'the knees', legRelated: true },
    { id: 'collar', labelJa: '襟', atEn: 'around the collar', nounEn: 'the collar' },
    { id: 'front', labelJa: '前面', atEn: 'down the front', nounEn: 'the front' },
    { id: 'sides', labelJa: '側面', atEn: 'along the sides', nounEn: 'the sides' },
    { id: 'waist', labelJa: '腰', atEn: 'around the waist', nounEn: 'the waist' },
    { id: 'gloves', labelJa: '手袋', atEn: 'on the gloves', nounEn: 'the gloves' },
    { id: 'shoes', labelJa: '靴', atEn: 'on the shoes', nounEn: 'the shoes', legRelated: true },
    { id: 'armor_surface', labelJa: '鎧表面', atEn: 'across the armor', nounEn: 'the armor' },
    { id: 'mermaid_tail', labelJa: '人魚の尾', atEn: 'along the mermaid tail', nounEn: 'the mermaid tail', merfolkOnly: true },
    { id: 'tail_fin', labelJa: '尾びれ', atEn: 'at the tail fin', nounEn: 'the tail fin', merfolkOnly: true },
    { id: 'overall', labelJa: '衣装全体', atEn: 'throughout', nounEn: 'the garment', wholeGarment: true }
  ];

  CPW.data.conditionFamilies = [
    { id: 'dirt', labelJa: '汚れ' },
    { id: 'damage', labelJa: '破れ・損傷' },
    { id: 'wet', labelJa: '水・雨による濡れ' },
    { id: 'blood', labelJa: '血の付着' },
    { id: 'aging', labelJa: '経年・使用感' },
    { id: 'treatment', labelJa: '意図的な加工' }
  ];

  CPW.data.conditions = [
    /* ---------- 汚れ ---------- */
    { id: 'dust_stained', labelJa: '埃汚れ', group: 'state', family: 'dirt', base: 'dust-stained',
      byClass: { fur: 'dusty, with flattened fur' }, tags: [] },
    { id: 'dust_covered', labelJa: '埃まみれ', group: 'state', family: 'dirt', base: 'covered in dust', noAdverb: true, tags: [] },
    { id: 'mud_splattered', labelJa: '泥はね汚れ', group: 'state', family: 'dirt', base: 'mud-splattered',
      byClass: { scales: 'mud-streaked scales', fur: 'mud-stained', plush: 'mud-stained' }, tags: [] },
    { id: 'mud_caked', labelJa: '泥まみれ', group: 'state', family: 'dirt', base: 'caked with mud', noAdverb: true,
      byClass: { scales: 'mud-streaked scales', fur: 'caked with mud, with matted fur' }, tags: [] },
    { id: 'soiled', labelJa: '全体的な汚れ', group: 'state', family: 'dirt', base: 'soiled', tags: [] },
    { id: 'soot_stained', labelJa: '煤汚れ', group: 'state', family: 'dirt', base: 'soot-stained', tags: [] },
    { id: 'oil_stained', labelJa: '油汚れ', group: 'state', family: 'dirt', base: 'oil-stained', tags: [] },
    { id: 'sand_covered', labelJa: '砂まみれ', group: 'state', family: 'dirt', base: 'sand-covered', noAdverb: true, tags: [] },
    { id: 'salt_stained', labelJa: '塩・海水の跡', group: 'state', family: 'dirt', base: 'salt-stained',
      byClass: { scales: 'salt-streaked scales' }, tags: [] },
    { id: 'paint_splattered', labelJa: '絵の具の飛沫', group: 'state', family: 'dirt', base: 'paint-splattered', tags: [] },

    /* ---------- 破れ・損傷 ---------- */
    { id: 'frayed_edges', labelJa: 'ほつれ', group: 'state', family: 'damage', base: 'with frayed edges', noAdverb: true,
      byClass: { knit: 'with snagged, frayed yarn', metallic: 'scuffed', rigid: 'scuffed' },
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_tear'] },
    { id: 'torn_light', labelJa: '軽い破れ', group: 'state', family: 'damage', base: 'slightly torn', noAdverb: true,
      byClass: { metallic: 'scratched', rigid: 'scratched', fur: 'with torn patches of fur' },
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_tear'] },
    { id: 'torn_places', labelJa: '所々の破れ', group: 'state', family: 'damage', base: 'torn in several places', noAdverb: true,
      byClass: { metallic: 'scratched and dented', rigid: 'scratched and dented' },
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_tear', 'cond_heavy_tear'] },
    { id: 'tattered', labelJa: 'ぼろぼろ', group: 'state', family: 'damage', base: 'tattered', noAdverb: true,
      byClass: { metallic: 'battle-worn', rigid: 'battle-worn' },
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_tear', 'cond_heavy_tear'] },
    { id: 'scuffed', labelJa: '擦れ', group: 'state', family: 'damage', base: 'scuffed', tags: [] },
    { id: 'scratched', labelJa: '傷', group: 'state', family: 'damage', base: 'scratched',
      byClass: { scales: 'with scratched scales' }, tags: [] },
    { id: 'dented', labelJa: 'へこみ', group: 'state', family: 'damage', base: 'dented',
      byClass: { textile: 'crumpled', knit: 'crumpled' }, tags: [] },
    { id: 'chipped', labelJa: '欠け', group: 'state', family: 'damage', base: 'chipped',
      byClass: { scales: 'with chipped scales' }, tags: [] },
    { id: 'singed', labelJa: '焦げ', group: 'state', family: 'damage', base: 'singed', tags: [] },
    { id: 'scorched', labelJa: '焼損', group: 'state', family: 'damage', base: 'scorched', tags: [] },
    { id: 'mend_marks', labelJa: '補修跡', group: 'state', family: 'damage', base: 'visibly repaired', noAdverb: true, tags: ['cond_repair'] },
    { id: 'patched', labelJa: 'パッチ補修', group: 'state', family: 'damage', base: 'patched', noAdverb: true, tags: ['cond_repair'] },
    { id: 'battle_worn', labelJa: '戦闘で傷んだ状態', group: 'state', family: 'damage', base: 'battle-worn', noAdverb: true, tags: [] },

    /* ---------- 水・雨による濡れ（透け・密着・露出は足さない） ---------- */
    { id: 'slightly_damp', labelJa: 'わずかに湿っている', group: 'state', family: 'wet', base: 'slightly damp', noAdverb: true,
      byClass: { waterproof: 'rain-beaded', metallic: 'covered in scattered water droplets', rigid: 'covered in scattered water droplets' },
      tags: [] },
    { id: 'rain_soaked', labelJa: '雨に濡れている', group: 'state', family: 'wet', base: 'rain-soaked', noAdverb: true,
      byClass: { waterproof: 'rain-beaded', leather: 'rain-darkened', fur: 'wet, with matted fur', plush: 'wet, with matted plush',
        metallic: 'covered in rain droplets', rigid: 'covered in rain droplets', scales: 'with water-slick scales' },
      avoidClasses: ['waterproof'], tags: ['cond_wet_absorb'] },
    { id: 'water_soaked', labelJa: '水を吸って濡れている', group: 'state', family: 'wet', base: 'water-soaked', noAdverb: true,
      byClass: { waterproof: 'covered in water droplets', metallic: 'covered in water droplets', rigid: 'covered in water droplets',
        fur: 'soaked, with matted fur', plush: 'soaked, with matted plush', scales: 'with water-slick scales' },
      avoidClasses: ['waterproof', 'metallic', 'rigid'], tags: ['cond_wet_absorb'] },
    { id: 'drenched', labelJa: 'ずぶ濡れ', group: 'state', family: 'wet', base: 'drenched with water', noAdverb: true,
      byClass: { waterproof: 'with water running across the surface', metallic: 'with water running across the surface',
        rigid: 'with water running across the surface', scales: 'with glistening, water-slick scales',
        fur: 'drenched, with matted fur' },
      avoidClasses: ['waterproof'], tags: ['cond_wet_absorb', 'cond_drench'] },
    { id: 'water_droplets', labelJa: '水滴が付いている', group: 'state', family: 'wet', base: 'covered in water droplets', noAdverb: true,
      byClass: { scales: 'with water-slick scales, glistening with water' }, tags: ['cond_droplets'] },
    { id: 'sea_spray', labelJa: '海水に濡れている', group: 'state', family: 'wet', base: 'wet with sea spray', noAdverb: true,
      byClass: { scales: 'with sea-washed, water-slick scales', waterproof: 'beaded with sea spray' }, tags: [] },
    { id: 'snow_damp', labelJa: '雪で湿っている', group: 'state', family: 'wet', base: 'damp from melting snow', noAdverb: true,
      byClass: { waterproof: 'beaded with melted snow' }, tags: [] },

    /* ---------- 血の付着（衣装の状態。負傷・流血・gore は作らない） ---------- */
    { id: 'blood_stain_small', labelJa: '小さな血痕', group: 'state', family: 'blood', base: 'lightly blood-stained', noAdverb: true,
      byClass: { scales: 'with lightly blood-stained scales' }, tags: ['cond_blood'] },
    { id: 'blood_spattered', labelJa: '血しぶき', group: 'state', family: 'blood', base: 'blood-spattered',
      byClass: { metallic: 'blood-smeared', rigid: 'blood-smeared' }, tags: ['cond_blood'] },
    { id: 'blood_stains_marked', labelJa: '複数の血痕', group: 'state', family: 'blood', base: 'marked with blood stains', noAdverb: true,
      byClass: { scales: 'with blood stains across the scales' }, tags: ['cond_blood'] },
    { id: 'blood_soaked', labelJa: '血が染み込んでいる', group: 'state', family: 'blood', base: 'blood-soaked', noAdverb: true,
      byClass: { metallic: 'blood-smeared', rigid: 'blood-smeared', waterproof: 'blood-smeared', scales: 'with blood-stained scales' },
      tags: ['cond_blood'] },
    { id: 'blood_drenched', labelJa: '大量の血で濡れている', group: 'state', family: 'blood', base: 'drenched in blood', noAdverb: true,
      byClass: { metallic: 'heavily blood-smeared', rigid: 'heavily blood-smeared' }, tags: ['cond_blood'] },
    { id: 'blood_smeared', labelJa: '血が擦れた跡', group: 'state', family: 'blood', base: 'smeared with blood', noAdverb: true, tags: ['cond_blood'] },

    /* ---------- 経年・使用感 ---------- */
    { id: 'worn', labelJa: '使い込まれている', group: 'state', family: 'aging', base: 'well-worn', noAdverb: true, tags: [] },
    { id: 'faded', labelJa: '色褪せ', group: 'state', family: 'aging', base: 'faded',
      avoidClasses: ['metallic'], tags: ['cond_fade'] },
    { id: 'sun_faded', labelJa: '日焼けによる色褪せ', group: 'state', family: 'aging', base: 'sun-faded', noAdverb: true,
      avoidClasses: ['metallic'], tags: ['cond_fade'] },
    { id: 'wrinkled', labelJa: 'しわ', group: 'state', family: 'aging', base: 'wrinkled',
      byClass: { metallic: 'dented', rigid: 'dented' },
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_wrinkle'] },
    { id: 'rumpled', labelJa: 'くたびれ', group: 'state', family: 'aging', base: 'rumpled',
      byClass: { metallic: 'scuffed', rigid: 'scuffed' },
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_wrinkle'] },
    { id: 'weathered', labelJa: '風化', group: 'state', family: 'aging', base: 'weathered',
      byClass: { scales: 'with weathered scales' }, tags: [] },
    { id: 'aged', labelJa: '古びている', group: 'state', family: 'aging', base: 'aged', noAdverb: true, tags: [] },
    { id: 'repaired', labelJa: '補修済み', group: 'state', family: 'aging', base: 'visibly repaired', noAdverb: true, tags: ['cond_repair'] },
    { id: 'pilled', labelJa: '毛玉・毛羽立ち', group: 'state', family: 'aging', base: 'pilled', noAdverb: true,
      byClass: { fur: 'with matted, tangled fur' },
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_pile'] },

    /* ---------- 意図的な加工（最初からのデザイン。treatment） ---------- */
    { id: 'distressed', labelJa: 'ダメージ加工', group: 'treatment', family: 'treatment', base: 'distressed',
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_treat_damage'] },
    { id: 'stone_washed', labelJa: 'ウォッシュ加工', group: 'treatment', family: 'treatment', base: 'stone-washed', noAdverb: true,
      avoidClasses: ['metallic', 'rigid'], tags: [] },
    { id: 'faded_wash', labelJa: '色落ち加工', group: 'treatment', family: 'treatment', base: 'with a faded wash', noAdverb: true,
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_treat_fade'] },
    { id: 'bleach_washed', labelJa: '漂白加工', group: 'treatment', family: 'treatment', base: 'bleach-washed', noAdverb: true,
      avoidClasses: ['metallic', 'rigid'], tags: [] },
    { id: 'patchwork', labelJa: 'パッチワーク', group: 'treatment', family: 'treatment', base: 'with patchwork panels', noAdverb: true,
      avoidClasses: ['metallic', 'rigid'], tags: [] },
    { id: 'repair_stitching', labelJa: '補修風ステッチ', group: 'treatment', family: 'treatment', base: 'with decorative repair stitching', noAdverb: true,
      avoidClasses: ['metallic', 'rigid'], tags: ['cond_treat_repair'] },
    { id: 'raw_edged', labelJa: '切りっぱなし加工', group: 'treatment', family: 'treatment', base: 'raw-edged', noAdverb: true,
      avoidClasses: ['metallic', 'rigid'], tags: [] },
    { id: 'crackle_finished', labelJa: 'クラック加工', group: 'treatment', family: 'treatment', base: 'crackle-finished', noAdverb: true, tags: [] }
  ];

  /* ---------- 補助候補・ガチャ用の親和データ ----------
   * 補助候補は「提案」まで。設計へ自動反映しない（Phase 4 の約束のまま）。
   * noAutoSubtypes は「状態指定なし」を基本とし、補助候補にも血の自動候補にも出さない。 */
  CPW.data.conditionAffinity = {
    bySubtype: {
      adventurer_outfit: ['worn', 'mud_splattered', 'battle_worn', 'torn_places'],
      light_combat_outfit: ['battle_worn', 'scratched', 'mud_splattered', 'worn'],
      laboratory_coat_outfit: ['wrinkled', 'paint_splattered', 'blood_stain_small'],
      fictional_police_uniform: ['rain_soaked', 'scuffed', 'worn'],
      mafia_style_suit: ['rain_soaked', 'blood_stain_small', 'wrinkled'],
      work_coveralls: ['oil_stained', 'worn', 'soiled'],
      mage_robe: ['singed', 'soot_stained'],
      traveling_robe: ['patched', 'worn', 'dust_stained']
    },
    byCategory: {
      merfolk: ['water_droplets', 'sea_spray', 'salt_stained', 'scratched']
    },
    /* 夢かわ・ルームウェア系。状態なしが基本。血は候補に出さない。 */
    noAutoSubtypes: ['dreamy_pastel_pajamas', 'pastel_fluffy_loungewear', 'fuzzy_cardigan_lounge_set', 'oversized_plush_hoodie_set'],
    /* 人魚ガチャで扱う状態（仕様書§13-3）。脚・靴系の部位は別途除外する。 */
    merfolkGachaPool: ['water_droplets', 'sea_spray', 'salt_stained', 'slightly_damp', 'drenched',
      'scratched', 'chipped', 'weathered', 'blood_stain_small', 'blood_spattered'],
    /* 破れ系の自動部位（胸元・腰は自動では大きく破らない） */
    tearAutoPlacements: ['hem', 'sleeves', 'one_sleeve', 'cuffs', 'knees']
  };
})(typeof window !== 'undefined' ? window : global);
