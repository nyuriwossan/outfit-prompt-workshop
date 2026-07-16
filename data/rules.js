/* 衣装プロンプト工房 / data/rules.js
 * 競合・警告ルールの宣言的定義。判定エンジン本体は advisor.js。
 * ここには「何と何がぶつかるか」だけを書き、「どう調べるか」は書かない。
 *
 * ── ルールの形 ──────────────────────────────────
 *   id            … 一意
 *   kind          … 'pair'（2つのトークンの衝突） | 'check'（数え上げ系。advisor の CHECKS が解く）
 *   type          … physical | duplicate | semantic | style_mix | palette | density | output
 *   severity      … hard | warning | info
 *   category      … 警告一覧での分類
 *   left / right  … トークン選択子 { slots:[], paths:[], tags:[], ids:[] }。
 *                   書いた条件だけを見る。tags と ids は「どれかに一致」。
 *   sameLayerOnly … true なら同一レイヤーのときだけ競合。別レイヤーは重ね着として認める。
 *   resolutions   … 解決ボタン。action を advisor が patch へ翻訳する。
 *                   keepLeft / keepRight        … 反対側を外す
 *                   replaceLeftWith:<id>        … 左を別の選択肢へ
 *                   replaceRightWith:<id>       … 右を別の選択肢へ
 *                   moveRightToLayer:<layer>    … 右を別の層へ（multiスロットのみ）
 *                   moveRightToSecondary        … 右を副素材へ移す
 *                   setPath:<path>=<値>         … 任意のパスを設定
 *                   ignore                      … 維持する（patchなし）
 * ────────────────────────────────────────────
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  CPW.data.rules = [
    /* ---------- 部位 ---------- */
    {
      id: 'sleeveless_vs_long_sleeves',
      kind: 'pair', type: 'physical', severity: 'hard', category: '部位', sameLayerOnly: true,
      left: { tags: ['long_sleeve'] },
      right: { tags: ['no_sleeve'] },
      titleJa: '袖なしと長袖が同じ層にある',
      messageJa: '同じ層で「袖なし」と「長袖」が同時に指定されています。別の層に着る羽織りなら、重ね着として成立します。',
      resolutions: [
        { labelJa: '袖なしを残す', action: 'keepRight' },
        { labelJa: '長袖を残す', action: 'keepLeft' },
        { labelJa: '長袖は羽織りにする', action: 'setPath:parts.cover_up=long_sleeved_cardigan' }
      ]
    },
    {
      id: 'high_neck_vs_plunging',
      kind: 'pair', type: 'physical', severity: 'hard', category: '部位', sameLayerOnly: true,
      left: { slots: ['neckline', 'collar'], tags: ['covered'] },
      right: { slots: ['neckline'], tags: ['open_deep'] },
      titleJa: '詰まった襟元と深く開いた胸元',
      messageJa: '詰まった襟元と深く開いた胸元は、同じ一着では両立しません。透ける切り替えや開き窓にすると、両方の印象を残せます。',
      resolutions: [
        { labelJa: 'キーホールにする', action: 'replaceRightWith:keyhole_neckline' },
        { labelJa: 'イリュージョンネックにする', action: 'replaceRightWith:illusion_neckline' },
        { labelJa: '取り外し立ち襟にする', action: 'setPath:parts.collar=detachable_standing_collar' },
        { labelJa: '詰まった襟元を残す', action: 'keepLeft' },
        { labelJa: '深い胸元を残す', action: 'keepRight' }
      ]
    },
    {
      id: 'floor_vs_micro',
      kind: 'pair', type: 'physical', severity: 'hard', category: '部位', sameLayerOnly: true,
      left: { tags: ['floor'] },
      right: { tags: ['micro'] },
      titleJa: '床丈とごく短い丈',
      messageJa: '床丈とマイクロミニが同時に指定されています。どちらの丈で描くか決まりません。',
      resolutions: [
        { labelJa: '床丈を残す', action: 'keepLeft' },
        { labelJa: '短い丈を残す', action: 'keepRight' }
      ]
    },
    {
      id: 'strapless_vs_straps',
      kind: 'pair', type: 'physical', severity: 'hard', category: '部位', sameLayerOnly: true,
      left: { tags: ['no_strap'] },
      right: { slots: ['straps'], tags: ['strap'] },
      titleJa: '肩紐なしと肩紐',
      messageJa: '肩紐の無い形と肩紐の指定がぶつかっています。',
      resolutions: [
        { labelJa: '肩紐なしを残す', action: 'keepRight' },
        { labelJa: '肩紐を残す', action: 'keepLeft' }
      ]
    },
    {
      id: 'stockings_and_socks',
      kind: 'pair', type: 'duplicate', severity: 'warning', category: '部位', sameLayerOnly: true,
      left: { tags: ['stockings'] },
      right: { tags: ['socks'] },
      titleJa: 'ストッキングと靴下が同じ層にある',
      messageJa: '同じ層にストッキングと靴下があります。重ね着として描かせたいなら、片方の層を変えると意図が伝わります。',
      resolutions: [
        { labelJa: 'ストッキングを残す', action: 'keepLeft' },
        { labelJa: '靴下を残す', action: 'keepRight' },
        { labelJa: '靴下を外側の層にする', action: 'moveRightToLayer:outer' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'garter_stockings_and_garter_belt',
      kind: 'pair', type: 'duplicate', severity: 'info', category: '部位', sameLayerOnly: false,
      left: { slots: ['legwear'], ids: ['garter_stockings'] },
      right: { slots: ['garter'], ids: ['garter_belt'] },
      titleJa: 'ガーターの指定が二重',
      messageJa: 'ガーターの指定が二重になっています。片方に寄せると意図が伝わりやすくなります。',
      resolutions: [
        { labelJa: 'ストッキング側に寄せる', action: 'keepLeft' },
        { labelJa: 'ガーターベルト側に寄せる', action: 'keepRight' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },

    /* ---------- 素材 ---------- */
    {
      id: 'heavy_vs_sheer',
      kind: 'pair', type: 'physical', severity: 'warning', category: '素材', sameLayerOnly: true,
      left: { paths: ['materials.primary', 'materials.thickness'], tags: ['heavy'] },
      right: { paths: ['materials.transparency'], ids: ['sheer'] },
      titleJa: '厚い生地としっかりした透け感',
      messageJa: '厚手・不透明の生地に「しっかり透ける」が重なっています。生成AIがどちらを描くか迷いやすい組み合わせです。',
      resolutions: [
        { labelJa: '透け感を半透明にする', action: 'replaceRightWith:semi_sheer' },
        { labelJa: '透け感を不透明にする', action: 'replaceRightWith:opaque' },
        { labelJa: '厚い素材を副素材へ移す', action: 'moveLeftToSecondary' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'chiffon_vs_plate_armor',
      kind: 'pair', type: 'physical', severity: 'warning', category: '素材', sameLayerOnly: true,
      left: { paths: ['materials.primary'], ids: ['flowing_chiffon'] },
      right: { paths: ['materials.secondary', 'materials.trim'], ids: ['plate_armor'] },
      titleJa: 'シフォンと板金鎧',
      messageJa: 'シフォンと板金鎧は質感が両立しにくい組み合わせです。役割をはっきり分けると崩れにくくなります。',
      resolutions: [
        { labelJa: 'シフォンだけにする', action: 'keepLeft' },
        { labelJa: '板金鎧を主素材にする', action: 'setPath:materials.primary=plate_armor' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },

    /* ---------- 特殊パーツ ---------- */
    {
      id: 'massive_wings_vs_back_cape',
      kind: 'pair', type: 'physical', severity: 'warning', category: '特殊パーツ', sameLayerOnly: false,
      left: { tags: ['back_heavy'] },
      right: { tags: ['covered_back'] },
      titleJa: '巨大な翼と背面を覆う衣装',
      messageJa: '巨大な翼と背面を覆う造りは干渉しやすく、生成が崩れやすくなります。',
      resolutions: [
        { labelJa: '翼を小さくする', action: 'replaceLeftWith:wing_small' },
        { labelJa: '翼を中くらいにする', action: 'replaceLeftWith:wing_medium' },
        { labelJa: 'ケープを肩掛けにする', action: 'replaceRightWith:shoulder_cape' },
        { labelJa: '背面を開ける', action: 'replaceRightWith:open_back' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },

    /* ---- 特殊パーツ（Phase 5A） ---- */
    {
      id: 'massive_wings_vs_back_ornament',
      kind: 'check', type: 'physical', severity: 'warning', category: '特殊パーツ',
      check: 'wingsVsBackOrnament',
      titleJa: '巨大な翼と背面の大きな装飾',
      messageJa: '背中に大きな装飾があると、翼の付け根が潰れて生成が崩れます。',
      resolutions: []
    },
    {
      id: 'large_horns_vs_headpiece',
      kind: 'pair', type: 'physical', severity: 'warning', category: '特殊パーツ', sameLayerOnly: false,
      left: { paths: ['specialParts.horns.size', 'specialParts.horns.direction'], tags: ['head_heavy'] },
      right: { slots: ['headwear'], tags: ['head_tall', 'covered'] },
      titleJa: '大きな角とかさばる頭部装飾',
      messageJa: '大きな角と背の高い頭部装飾は同じ場所を取り合います。どちらを見せたいか決めると安定します。',
      resolutions: [
        { labelJa: '角を小さくする', action: 'replaceLeftWith:horn_small' },
        { labelJa: '頭部装飾を外す', action: 'setPath:parts.headwear=no_headwear' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'halo_vs_headpiece',
      kind: 'check', type: 'physical', severity: 'warning', category: '特殊パーツ',
      check: 'haloVsHeadpiece',
      titleJa: '光輪と背の高い頭部装飾',
      messageJa: '光輪と背の高い冠・ボンネットが頭上で重なります。光輪を背後に回すか、頭部装飾を控えめにすると通ります。',
      resolutions: []
    },
    {
      id: 'multi_tail_vs_train',
      kind: 'pair', type: 'physical', severity: 'warning', category: '特殊パーツ', sameLayerOnly: false,
      left: { paths: ['specialParts.tail.count'], tags: ['multi_tail'] },
      right: { paths: ['silhouette.length'], ids: ['train'] },
      titleJa: '複数の尾と引き裾',
      messageJa: '尾が複数あるところに引き裾が重なると、足元が読み取れなくなります。',
      resolutions: [
        { labelJa: '尾を1本にする', action: 'replaceLeftWith:tail_one' },
        { labelJa: '丈を床丈にする', action: 'replaceRightWith:floor' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'mechanical_wings_vs_historical',
      kind: 'pair', type: 'semantic', severity: 'warning', category: '特殊パーツ', sameLayerOnly: false,
      left: { paths: ['specialParts.wings.type', 'specialParts.wings.texture', 'specialParts.horns.type', 'specialParts.tail.type'], tags: ['mechanical'] },
      right: { paths: ['concept.worldview', 'concept.era'], ids: ['historical_western', 'medieval', 'ancient', 'early_modern'] },
      titleJa: '機械のパーツと低技術の世界観',
      messageJa: '機械仕掛けのパーツと、技術の低い時代設定がぶつかっています。禁止ではありませんが、狙ってやるのでなければ世界観がぼやけます。',
      resolutions: [
        { labelJa: '世界観をSFにする', action: 'setPath:concept.worldview=sci_fi' },
        { labelJa: 'このまま維持する（意図的な混成）', action: 'ignore' }
      ]
    },
    {
      id: 'feathered_wings_vs_mechanical_theme',
      kind: 'check', type: 'semantic', severity: 'warning', category: '特殊パーツ',
      check: 'organicWingsVsMechanicalTheme',
      titleJa: '生物の翼と機械寄りの素材',
      messageJa: '',
      resolutions: []
    },
    {
      id: 'decorative_chains_alone',
      kind: 'check', type: 'density', severity: 'info', category: '特殊パーツ',
      check: 'chainsWithoutAccessories',
      titleJa: '飾り鎖だけが浮いている',
      messageJa: '装飾チェーン以外に装飾がありません。鎖だけだと拘束の絵に寄りやすいので、装飾を足すか、狙いを決めておくと安定します。',
      resolutions: []
    },
    {
      id: 'wings_type_dormant',
      kind: 'check', type: 'output', severity: 'info', category: '特殊パーツ',
      check: 'specialPartDormant',
      titleJa: '種類未選択の特殊パーツがある',
      messageJa: '',
      resolutions: []
    },
    {
      id: 'theme_duplicates_special_part',
      kind: 'check', type: 'semantic', severity: 'info', category: '特殊パーツ',
      check: 'themeDuplicatesSpecialPart',
      titleJa: '主テーマと特殊パーツが同じことを言っている',
      messageJa: '',
      resolutions: []
    },

    /* ---------- 様式・意味 ---------- */
    {
      id: 'ceremonial_vs_workwear',
      kind: 'pair', type: 'semantic', severity: 'warning', category: '様式', sameLayerOnly: false,
      left: { paths: ['garment.subtype', 'concept.primaryStyle', 'concept.role'], tags: ['royal', 'ornate'], ids: ['royal_uniform', 'ball_gown', 'royal', 'royal_prince'] },
      right: { paths: ['concept.occasion'], ids: ['work'] },
      titleJa: '式典向きの衣装と仕事の場面',
      messageJa: '装飾の多い儀礼的な衣装に「仕事」の場面が指定されています。狙いが割れると生成もぶれます。',
      resolutions: [
        { labelJa: '場面を式典にする', action: 'replaceRightWith:ceremonial' },
        { labelJa: '場面を日常にする', action: 'replaceRightWith:daily' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'opposed_styles',
      kind: 'check', type: 'style_mix', severity: 'warning', category: '様式',
      check: 'opposedStyles',
      pairs: [['royal', 'street'], ['royal', 'punk'], ['minimal', 'maximalist'], ['classical', 'techwear'], ['victorian', 'techwear']],
      titleJa: '様式の向きが大きく違う',
      messageJa: '方向の違う様式が同時に指定されています。禁止ではありませんが、主様式をどちらか一つに寄せると輪郭が安定します。',
      resolutions: []
    },
    {
      id: 'style_mix_notice',
      kind: 'check', type: 'style_mix', severity: 'info', category: '様式',
      check: 'tooManySecondaryStyles', max: 1,
      titleJa: '副様式が多い',
      messageJa: '副様式が複数あります。主様式を1つに決めると輪郭が安定します。',
      resolutions: []
    },

    /* ---------- 配色 ---------- */
    {
      id: 'palette_primary_missing',
      kind: 'check', type: 'palette', severity: 'warning', category: '配色',
      check: 'primaryMissing',
      titleJa: '主色が決まっていない',
      messageJa: '差し色や金属色だけがあり、主色が未設定です。どの色の衣装なのかが伝わりません。',
      resolutions: []
    },
    {
      id: 'monochrome_vs_hues',
      kind: 'check', type: 'palette', severity: 'warning', category: '配色',
      check: 'monochromeHues',
      titleJa: 'モノクロームなのに彩りが多い',
      messageJa: '配色方式が「単色・モノクローム」ですが、彩りのある色が複数あります。方式を変えるか、色を絞ると意図どおりになります。',
      resolutions: []
    },
    {
      id: 'too_many_colors',
      kind: 'check', type: 'palette', severity: 'info', category: '配色',
      check: 'colorCount', max: 4,
      titleJa: '色数が多い',
      messageJa: '色の役割が埋まりすぎています。生成AIは色数が増えるほど配置を外しやすくなります。',
      resolutions: []
    },

    /* ---------- 装飾密度 ---------- */
    {
      id: 'density_overload',
      kind: 'check', type: 'density', severity: 'warning', category: '装飾',
      check: 'densityOverload',
      titleJa: '装飾が密度の目安を超えている',
      messageJa: '',
      resolutions: []
    },
    {
      id: 'density_underuse',
      kind: 'check', type: 'density', severity: 'info', category: '装飾',
      check: 'densityUnderuse',
      titleJa: '密度の指定に対して装飾が少ない',
      messageJa: '',
      resolutions: []
    },
    {
      id: 'focal_overload',
      kind: 'check', type: 'density', severity: 'info', category: '装飾',
      check: 'focalOverload', max: 2,
      titleJa: '主役の装飾が多い',
      messageJa: '主役として置いた装飾が多く、視線の落とし所が定まりません。主役は1〜2件に絞ると効きます。',
      resolutions: []
    },
    {
      id: 'focal_motif_missing',
      kind: 'check', type: 'density', severity: 'info', category: '装飾',
      check: 'focalMotifMissing', minWeight: 4,
      titleJa: '主役装飾モチーフが未設定',
      messageJa: '装飾がそれなりの量になっています。主役装飾モチーフを決めると、繰り返す形が定まって仕上がりが安定します。',
      resolutions: []
    },

    /* ---------- 出力との噛み合わせ ---------- */
    {
      id: 'restraint_chain_without_narrative',
      kind: 'check', type: 'output', severity: 'info', category: '出力',
      check: 'restraintWithoutNarrative',
      titleJa: '拘束チェーンが出力に出ない',
      messageJa: '拘束チェーンを選んでいますが、出力は「衣装のみ」です。拘束は物語側の要素なので、出力の「雰囲気・物語を追加」をONにすると英語に入ります。装飾チェーンは衣装のみでも出ています。',
      resolutions: [
        { labelJa: '雰囲気・物語をONにする', action: 'setPath:output.includeNarrative=true' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'effects_without_attribute',
      kind: 'check', type: 'output', severity: 'info', category: '出力',
      check: 'effectsWithoutAttribute',
      titleJa: '属性エフェクトONだが属性が未設定',
      messageJa: '出力に属性エフェクトを足す設定ですが、属性が選ばれていないので何も足されません。',
      resolutions: [
        { labelJa: '属性エフェクトをOFFにする', action: 'setPath:output.includeEffects=false' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    }
  ];

  /* 補助候補・ガチャが使う相性情報。
   * 「何と何が合うか」だけを持つ。点数の付け方は advisor.js。 */
  CPW.data.affinity = {
    worldviewStyles: {
      modern: ['minimal', 'street', 'techwear', 'military'],
      western_fantasy: ['royal', 'classical', 'baroque'],
      historical_western: ['victorian', 'baroque', 'classical'],
      dark_fantasy: ['gothic', 'punk', 'baroque'],
      japanese: ['classical', 'minimal'],
      chinese: ['classical', 'baroque'],
      sci_fi: ['techwear', 'minimal', 'military'],
      fairy_tale: ['lolita', 'classical', 'victorian']
    },
    worldviewMaterials: {
      modern: ['wool', 'linen', 'leather', 'satin', 'silk'],
      western_fantasy: ['brocade', 'velvet', 'silk', 'metallic_thread'],
      historical_western: ['brocade', 'velvet', 'lace'],
      dark_fantasy: ['velvet', 'leather', 'lace', 'plate_armor'],
      japanese: ['silk', 'linen'],
      chinese: ['silk', 'brocade'],
      sci_fi: ['leather', 'organza', 'metallic_thread'],
      fairy_tale: ['organza', 'lace', 'satin']
    },
    /* 世界観ごとの、部位の選択肢の手ざわり。王道候補の絞り込みに使う。 */
    worldviewOptionTags: {
      modern: { good: ['functional', 'plain', 'casual', 'slim', 'structured', 'street'], bad: ['ornate', 'frilled', 'japanese', 'royal', 'voluminous'] },
      sci_fi: { good: ['functional', 'structured', 'slim'], bad: ['frilled', 'ornate', 'japanese'] },
      western_fantasy: { good: ['ornate', 'structured', 'flared'], bad: ['casual', 'street'] },
      dark_fantasy: { good: ['ornate', 'structured', 'rough'], bad: ['casual', 'uniform'] },
      historical_western: { good: ['ornate', 'structured', 'frilled'], bad: ['casual', 'street'] },
      japanese: { good: ['japanese', 'draped', 'plain'], bad: ['ornate', 'military'] },
      chinese: { good: ['draped', 'ornate'], bad: ['casual', 'street'] },
      fairy_tale: { good: ['frilled', 'flared', 'ornate'], bad: ['military', 'rough'] }
    },
    /* 様式ごとの手ざわり。同上。 */
    styleOptionTags: {
      minimal: { good: ['plain', 'slim', 'functional'], bad: ['ornate', 'frilled', 'voluminous'] },
      gothic: { good: ['structured', 'frilled', 'covered'], bad: ['casual'] },
      lolita: { good: ['frilled', 'voluminous', 'flared'], bad: ['functional', 'military'] },
      royal: { good: ['ornate', 'structured'], bad: ['casual', 'rough'] },
      military: { good: ['military', 'structured', 'functional'], bad: ['frilled'] },
      punk: { good: ['rough', 'functional'], bad: ['frilled', 'ornate'] },
      techwear: { good: ['functional', 'slim'], bad: ['frilled', 'ornate'] },
      street: { good: ['casual', 'functional'], bad: ['ornate'] },
      victorian: { good: ['structured', 'frilled', 'covered'], bad: ['casual'] },
      baroque: { good: ['ornate', 'voluminous'], bad: ['casual', 'plain'] },
      classical: { good: ['structured', 'plain'], bad: ['rough', 'casual'] },
      maximalist: { good: ['ornate', 'voluminous', 'frilled'], bad: ['plain'] }
    },
    /* この世界観では王道候補に出さないもの */
    worldviewAvoid: {
      modern: ['metallic_thread', 'crystal_details', 'plate_armor', 'brocade', 'gold_embroidery', 'sapphire_brooch', 'cross_ornament', 'rose_ornament', 'feather_details'],
      sci_fi: ['brocade', 'lace', 'rose_ornament']
    },
    styleDecorations: {
      gothic: ['cross_ornament', 'lace_trim', 'rose_ornament'],
      lolita: ['ribbon_bow', 'lace_trim', 'rose_ornament'],
      victorian: ['lace_trim', 'pearl_details', 'brooch_cluster'],
      baroque: ['gold_embroidery', 'brooch_cluster', 'pearl_details'],
      royal: ['gold_embroidery', 'silver_embroidery', 'sapphire_brooch'],
      military: ['metal_studs', 'silver_embroidery'],
      punk: ['metal_studs'],
      minimal: [],
      techwear: ['metal_studs'],
      street: ['metal_studs'],
      classical: ['pearl_details', 'lace_trim'],
      maximalist: ['gold_embroidery', 'rose_ornament', 'brooch_cluster', 'pearl_details']
    },
    /* 「少し意外」で動かしてよい範囲。世界観・基本衣装は壊さない。 */
    surprisePaths: ['palette.accent', 'palette.gem', 'materials.secondary', 'materials.trim', 'materials.patterns', 'decorations.items'],
    /* 補助候補で1カテゴリから出す上限 */
    categoryLimit: 2
  };
})(window);
