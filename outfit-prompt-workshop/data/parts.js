/* 衣装プロンプト工房 / data/parts.js
 * 部位スロットの定義と選択肢。garments.js の category.slots が id を参照する。
 * multi:true のスロットは複数選択でき、重複警告の対象になる。
 * MVP最終形は合計100件以上。ここは代表セット。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  // 複数選択スロットの「層」。利用者には英語のinner/outerではなく日本語で見せる。
  CPW.data.partLayers = [
    { id: 'inner', labelJa: '内側', promptEn: 'worn underneath' },
    { id: 'main', labelJa: '主衣装', promptEn: '' },
    { id: 'outer', labelJa: '外側', promptEn: 'worn over' }
  ];

  // シルエット（9.2 / 19.1 silhouette）
  CPW.data.silhouette = {
    fit: [
      { id: 'tailored', labelJa: '仕立て良く', shortPrompt: 'tailored' },
      { id: 'fitted', labelJa: '体に沿う', shortPrompt: 'body-hugging' },
      { id: 'relaxed', labelJa: 'ゆったり', shortPrompt: 'relaxed fit' },
      { id: 'oversized', labelJa: '大きめ', shortPrompt: 'oversized' },
      { id: 'draped', labelJa: 'ドレープ', shortPrompt: 'draped' }
    ],
    upperVolume: [
      { id: 'slim_upper', labelJa: '細身', shortPrompt: 'slim upper body' },
      { id: 'structured', labelJa: '構築的', shortPrompt: 'structured shoulders' },
      { id: 'voluminous_upper', labelJa: '膨らみ', shortPrompt: 'voluminous upper body' }
    ],
    lowerVolume: [
      { id: 'slim', labelJa: '細身', shortPrompt: 'slim lower body' },
      { id: 'flared', labelJa: '広がる', shortPrompt: 'flared' },
      { id: 'voluminous', labelJa: '大きく膨らむ', shortPrompt: 'voluminous skirt' }
    ],
    waist: [
      { id: 'fitted_waist', labelJa: '絞る', shortPrompt: 'fitted waist' },
      { id: 'natural_waist', labelJa: '自然', shortPrompt: 'natural waistline' },
      { id: 'high_waist', labelJa: '高い位置', shortPrompt: 'high waistline' },
      { id: 'dropped_waist', labelJa: '低い位置', shortPrompt: 'dropped waistline' }
    ],
    length: [
      { id: 'micro', labelJa: 'ごく短い', shortPrompt: 'micro length', tags: ['micro'] },
      { id: 'knee', labelJa: '膝丈', shortPrompt: 'knee-length' },
      { id: 'midi', labelJa: 'ミディ', shortPrompt: 'midi length' },
      { id: 'floor', labelJa: '床丈', shortPrompt: 'floor-length', tags: ['floor'] },
      { id: 'train', labelJa: '引き裾', shortPrompt: 'with a trailing hem', tags: ['floor'] }
    ],
    symmetry: [
      { id: 'symmetrical', labelJa: '左右対称', shortPrompt: 'symmetrical' },
      { id: 'mostly_symmetrical', labelJa: 'ほぼ対称', shortPrompt: 'mostly symmetrical' },
      { id: 'asymmetrical', labelJa: '非対称', shortPrompt: 'asymmetrical' }
    ]
  };

  CPW.data.partSlots = [
    {
      id: 'neckline', labelJa: '襟・胸元', multi: false, options: [
        { id: 'high_neckline', labelJa: '詰まった胸元', shortPrompt: 'high neckline', tags: ['covered'] },
        { id: 'keyhole_neckline', labelJa: 'キーホール', shortPrompt: 'keyhole neckline', tags: ['open_small'] },
        { id: 'illusion_neckline', labelJa: 'イリュージョン', shortPrompt: 'illusion neckline', tags: ['open_small', 'sheer_panel'] },
        { id: 'plunging_neckline', labelJa: '深いV', shortPrompt: 'plunging neckline', tags: ['open_deep'] },
        { id: 'sweetheart_neckline', labelJa: 'ハートカット', shortPrompt: 'sweetheart neckline', tags: ['open_small'] },
        { id: 'square_neckline', labelJa: '角襟', shortPrompt: 'square neckline', tags: ['open_small'] }
      ]
    },
    {
      id: 'collar', labelJa: '襟の形', multi: false, options: [
        { id: 'high_standing_collar', labelJa: '立ち襟', shortPrompt: 'high standing collar', tags: ['covered', 'structured'] },
        { id: 'detachable_standing_collar', labelJa: '取り外し立ち襟', shortPrompt: 'detachable standing collar', tags: ['structured', 'detachable'] },
        { id: 'wide_lapel', labelJa: '広いラペル', shortPrompt: 'wide lapels', tags: ['structured'] },
        { id: 'ruffled_collar', labelJa: 'フリル襟', shortPrompt: 'ruffled collar', tags: ['frilled'] },
        { id: 'sailor_collar', labelJa: 'セーラー襟', shortPrompt: 'sailor collar', tags: ['uniform'] },
        { id: 'no_collar', labelJa: '襟なし', shortPrompt: 'collarless', tags: ['plain'] }
      ]
    },
    {
      id: 'shoulders', labelJa: '肩', multi: false, options: [
        { id: 'structured_shoulders', labelJa: '構築的な肩', shortPrompt: 'structured shoulders', tags: ['structured'] },
        { id: 'off_shoulder', labelJa: 'オフショルダー', shortPrompt: 'off-shoulder', tags: ['open'] },
        { id: 'puff_shoulders', labelJa: 'パフ', shortPrompt: 'puffed shoulders', tags: ['voluminous'] },
        { id: 'epaulettes', labelJa: '肩章', shortPrompt: 'epaulettes', tags: ['military', 'ornate'] }
      ]
    },
    {
      id: 'sleeves', labelJa: '袖', multi: false, options: [
        { id: 'sleeveless', labelJa: '袖なし', shortPrompt: 'sleeveless', tags: ['no_sleeve'] },
        { id: 'short_sleeves', labelJa: '半袖', shortPrompt: 'short sleeves', tags: ['sleeve'] },
        { id: 'fitted_long_sleeves', labelJa: '細い長袖', shortPrompt: 'fitted long sleeves', tags: ['sleeve', 'long_sleeve'] },
        { id: 'bell_sleeves', labelJa: 'ベル袖', shortPrompt: 'bell sleeves', tags: ['sleeve', 'long_sleeve', 'voluminous'] },
        { id: 'wide_sleeves', labelJa: '広袖', shortPrompt: 'wide flowing sleeves', tags: ['sleeve', 'long_sleeve', 'voluminous'] }
      ]
    },
    {
      id: 'cuffs', labelJa: '袖口', multi: false, options: [
        { id: 'plain_cuffs', labelJa: '無地', shortPrompt: 'plain cuffs', tags: ['plain'] },
        { id: 'ornate_cuffs', labelJa: '装飾的', shortPrompt: 'ornate cuffs', tags: ['ornate'] },
        { id: 'lace_cuffs', labelJa: 'レース', shortPrompt: 'lace-trimmed cuffs', tags: ['frilled'] },
        { id: 'buckled_cuffs', labelJa: 'バックル', shortPrompt: 'buckled cuffs', tags: ['functional'] }
      ]
    },
    {
      id: 'waist', labelJa: 'ウエスト', multi: false, options: [
        { id: 'royal_sash', labelJa: '飾り帯', shortPrompt: 'royal sash', tags: ['ornate'] },
        { id: 'leather_belt', labelJa: '革ベルト', shortPrompt: 'leather belt', tags: ['functional'] },
        { id: 'corset_waist', labelJa: 'コルセット', shortPrompt: 'corseted waist', tags: ['structured'] },
        { id: 'ribbon_tie', labelJa: 'リボン', shortPrompt: 'ribbon tied at the waist', tags: ['frilled'] },
        { id: 'obi', labelJa: '帯', shortPrompt: 'obi', tags: ['japanese'] }
      ]
    },
    {
      id: 'skirt_shape', labelJa: 'スカート形状', multi: false, options: [
        { id: 'tiered_skirt', labelJa: '段フリル', shortPrompt: 'tiered skirt', tags: ['voluminous', 'frilled'] },
        { id: 'a_line_skirt', labelJa: 'Aライン', shortPrompt: 'A-line skirt', tags: ['flared'] },
        { id: 'pencil_skirt', labelJa: 'タイト', shortPrompt: 'pencil skirt', tags: ['slim'] },
        { id: 'micro_mini_skirt', labelJa: 'マイクロミニ', shortPrompt: 'micro mini skirt', tags: ['slim', 'micro'] },
        { id: 'mermaid_skirt', labelJa: 'マーメイド', shortPrompt: 'mermaid skirt', tags: ['fitted', 'flared'] }
      ]
    },
    {
      id: 'hem', labelJa: '裾', multi: false, options: [
        { id: 'straight_hem', labelJa: '直線', shortPrompt: 'straight hem', tags: ['plain'] },
        { id: 'floor_sweeping_hem', labelJa: '床を掃く裾', shortPrompt: 'floor-sweeping hem', tags: ['floor'] },
        { id: 'layered_hem', labelJa: '重ね裾', shortPrompt: 'layered hem', tags: ['layered'] },
        { id: 'lace_hem', labelJa: 'レース縁', shortPrompt: 'lace-trimmed hem', tags: ['frilled'] },
        { id: 'torn_hem', labelJa: '破れ裾', shortPrompt: 'frayed hem', tags: ['rough'] }
      ]
    },
    {
      id: 'bottoms', labelJa: 'ボトムス', multi: false, options: [
        { id: 'fitted_trousers', labelJa: '細身のトラウザーズ', shortPrompt: 'fitted trousers', tags: ['slim'] },
        { id: 'wide_trousers', labelJa: 'ワイドパンツ', shortPrompt: 'wide-leg trousers', tags: ['voluminous'] },
        { id: 'pleated_skirt', labelJa: 'プリーツスカート', shortPrompt: 'pleated skirt', tags: ['uniform'] },
        { id: 'shorts', labelJa: 'ショートパンツ', shortPrompt: 'shorts', tags: ['casual'] }
      ]
    },
    {
      id: 'inner_shirt', labelJa: 'シャツ', multi: false, options: [
        { id: 'high_collar_shirt', labelJa: '立ち襟シャツ', shortPrompt: 'high-collar shirt', tags: ['covered'] },
        { id: 'dress_shirt', labelJa: 'ドレスシャツ', shortPrompt: 'crisp dress shirt', tags: ['plain'] },
        { id: 'ruffled_shirt', labelJa: 'フリルシャツ', shortPrompt: 'ruffled shirt', tags: ['frilled'] }
      ]
    },
    {
      id: 'vest', labelJa: 'ベスト', multi: false, options: [
        { id: 'tailored_vest', labelJa: '仕立てベスト', shortPrompt: 'tailored vest', tags: ['structured'] },
        { id: 'brocade_vest', labelJa: '織柄ベスト', shortPrompt: 'brocade vest', tags: ['ornate'] },
        { id: 'no_vest', labelJa: 'なし', shortPrompt: '', tags: [] }
      ]
    },
    {
      /* 手袋・ハンドウェアは合成IDを増やさず、4軸に分解して保持する。
       * kind:'composite' … 値は { type, material, length, fingertips }
       * requiredAxis が未選択の間、他の軸は「休止」扱いで出力・完成度・競合判定に混ぜない。
       * legacyMap … Phase 1 の合成IDを新構造へ変換する（旧形式は併存させない）。 */
      id: 'handwear', labelJa: '手袋・ハンドウェア', multi: false, kind: 'composite',
      requiredAxis: 'type',
      legacyMap: {
        lace_gloves_short: { type: 'hand_gloves', material: 'lace_hand', length: 'wrist_length', fingertips: 'full_fingered' },
        lace_gloves_elbow_fingerless: { type: 'hand_gloves', material: 'lace_hand', length: 'elbow_length', fingertips: 'fingerless' },
        white_gloves: { type: 'hand_gloves', material: 'cotton_hand', length: 'wrist_length', fingertips: 'full_fingered' },
        leather_gauntlets: { type: 'hand_gauntlets', material: 'leather_hand', length: 'forearm_length', fingertips: 'full_fingered' },
        arm_warmers: { type: 'hand_arm_warmers', material: 'knit_hand', length: 'elbow_length', fingertips: null }
      },
      axes: [
        {
          key: 'type', labelJa: '種類', required: true,
          noteJa: '種類を選ぶと、素材・長さ・指先が編集できるようになるよ。解除すると、下の3項目は残したまま休止して、出力には混ざらない。',
          options: [
            { id: 'hand_gloves', labelJa: '手袋', shortPrompt: 'gloves', tags: ['gloves'] },
            { id: 'hand_gauntlets', labelJa: 'ガントレット', shortPrompt: 'gauntlets', tags: ['gloves', 'functional'] },
            { id: 'hand_mittens', labelJa: 'ミトン', shortPrompt: 'mittens', tags: ['gloves'] },
            { id: 'hand_arm_warmers', labelJa: 'アームウォーマー', shortPrompt: 'arm warmers', tags: ['arm'], skipAxes: ['fingertips'] },
            { id: 'hand_arm_covers', labelJa: 'アームカバー', shortPrompt: 'arm covers', tags: ['arm'], skipAxes: ['fingertips'] }
          ]
        },
        {
          key: 'material', labelJa: '素材', options: [
            { id: 'lace_hand', labelJa: 'レース', shortPrompt: 'lace', tags: ['lace', 'sheer'] },
            { id: 'leather_hand', labelJa: '革', shortPrompt: 'leather', tags: ['sturdy'] },
            { id: 'satin_hand', labelJa: 'サテン', shortPrompt: 'satin', tags: ['glossy'] },
            { id: 'sheer_hand', labelJa: '透ける生地', shortPrompt: 'sheer fabric', tags: ['sheer'] },
            { id: 'cotton_hand', labelJa: '綿', shortPrompt: 'cotton', tags: ['plain'] },
            { id: 'knit_hand', labelJa: 'ニット', shortPrompt: 'knit', tags: ['soft'] },
            { id: 'metal_hand', labelJa: '金属', shortPrompt: 'metal', tags: ['metallic', 'rigid'] }
          ]
        },
        {
          key: 'length', labelJa: '長さ', options: [
            { id: 'wrist_length', labelJa: '手首丈', shortPrompt: 'wrist-length' },
            { id: 'forearm_length', labelJa: '前腕丈', shortPrompt: 'forearm-length' },
            { id: 'elbow_length', labelJa: '肘丈', shortPrompt: 'elbow-length' },
            { id: 'opera_length', labelJa: '二の腕丈（オペラ）', shortPrompt: 'opera-length' }
          ]
        },
        {
          key: 'fingertips', labelJa: '指先', options: [
            { id: 'full_fingered', labelJa: '指まで覆う', shortPrompt: 'full-fingered' },
            { id: 'fingerless', labelJa: '指なし', shortPrompt: 'fingerless' },
            { id: 'open_finger', labelJa: '指先だけ開く', shortPrompt: 'open-finger' }
          ]
        }
      ]
    },
    {
      id: 'legwear', labelJa: 'レッグウェア', multi: true, kind: 'multi',
      layered: true,
      noteJa: '重ね着するときは、層を分けておくと「重複」ではなく「重ね」として扱うよ。',
      options: [
        { id: 'thigh_high_stockings', labelJa: 'ニーハイストッキング', shortPrompt: 'thigh-high stockings', tags: ['stockings', 'legwear_long'] },
        { id: 'garter_stockings', labelJa: 'ガーターストッキング', shortPrompt: 'garter stockings', tags: ['stockings', 'legwear_long', 'garter'] },
        { id: 'sheer_tights', labelJa: '薄いタイツ', shortPrompt: 'sheer tights', tags: ['tights', 'legwear_long'] },
        { id: 'lace_socks', labelJa: 'レースソックス', shortPrompt: 'lace socks', tags: ['socks', 'legwear_short'] },
        { id: 'knee_socks', labelJa: 'ハイソックス', shortPrompt: 'knee socks', tags: ['socks', 'legwear_mid'] }
      ]
    },
    {
      id: 'footwear', labelJa: '靴', multi: false, options: [
        { id: 'knee_high_boots', labelJa: 'ロングブーツ', shortPrompt: 'polished knee-high boots', tags: ['boots'] },
        { id: 'lace_up_boots', labelJa: '編み上げブーツ', shortPrompt: 'lace-up boots', tags: ['boots'] },
        { id: 'heeled_pumps', labelJa: 'ヒールパンプス', shortPrompt: 'heeled pumps', tags: ['heels'] },
        { id: 'sneakers', labelJa: 'スニーカー', shortPrompt: 'sneakers', tags: ['casual'] },
        { id: 'barefoot', labelJa: '素足', shortPrompt: 'barefoot', tags: ['none'] }
      ]
    },
    {
      id: 'headwear', labelJa: '頭部', multi: false, options: [
        { id: 'bonnet', labelJa: 'ボンネット', shortPrompt: 'bonnet', tags: ['frilled'] },
        { id: 'circlet', labelJa: 'サークレット', shortPrompt: 'circlet', tags: ['ornate'] },
        { id: 'tall_crown', labelJa: '背の高い冠', shortPrompt: 'a tall crown', tags: ['ornate', 'head_tall'] },
        { id: 'oversized_bonnet', labelJa: '大きなボンネット', shortPrompt: 'an oversized bonnet', tags: ['frilled', 'head_tall'] },
        { id: 'hood', labelJa: 'フード', shortPrompt: 'hood', tags: ['covered'] },
        { id: 'officer_cap', labelJa: '将校帽', shortPrompt: 'officer cap', tags: ['military'] },
        { id: 'no_headwear', labelJa: 'なし', shortPrompt: '', tags: [] }
      ]
    },

    // 水着専用
    {
      id: 'swim_form', labelJa: '水着の型', multi: false, options: [
        { id: 'one_piece_form', labelJa: 'ワンピース型', shortPrompt: 'one-piece', tags: ['swim_one'] },
        { id: 'separate_form', labelJa: 'セパレート型', shortPrompt: 'two-piece', tags: ['swim_two'] },
        { id: 'shorts_form', labelJa: 'ショーツ型', shortPrompt: 'swim shorts style', tags: ['swim_shorts'] }
      ]
    },
    {
      id: 'straps', labelJa: '肩紐・ストラップ', multi: false, options: [
        { id: 'halter_strap', labelJa: 'ホルターネック', shortPrompt: 'halter neck straps', tags: ['strap'] },
        { id: 'thin_straps', labelJa: '細い肩紐', shortPrompt: 'thin shoulder straps', tags: ['strap'] },
        { id: 'strapless', labelJa: 'ストラップなし', shortPrompt: 'strapless', tags: ['no_strap'] },
        { id: 'cross_back_straps', labelJa: 'クロスバック', shortPrompt: 'cross-back straps', tags: ['strap'] }
      ]
    },
    {
      id: 'back', labelJa: '背中', multi: false, options: [
        { id: 'open_back', labelJa: '背中開き', shortPrompt: 'open back', tags: ['open_back'] },
        { id: 'covered_back', labelJa: '背中を覆う', shortPrompt: 'covered back', tags: ['covered_back'] },
        { id: 'lace_up_back', labelJa: '編み上げ背面', shortPrompt: 'lace-up back', tags: ['open_back'] }
      ]
    },
    {
      id: 'leg_opening', labelJa: '脚ぐり', multi: false, options: [
        { id: 'high_leg', labelJa: 'ハイレグ', shortPrompt: 'high-cut leg opening', tags: ['high_cut'] },
        { id: 'standard_leg', labelJa: '標準', shortPrompt: 'standard leg opening', tags: [] },
        { id: 'boyleg', labelJa: 'ボーイレッグ', shortPrompt: 'boyleg cut', tags: ['covered'] }
      ]
    },
    {
      id: 'coverage', labelJa: 'カバー範囲', multi: false, options: [
        { id: 'minimal_coverage', labelJa: '控えめな面積', shortPrompt: 'minimal coverage', tags: ['revealing'] },
        { id: 'moderate_coverage', labelJa: '標準', shortPrompt: 'moderate coverage', tags: [] },
        { id: 'full_coverage', labelJa: '広く覆う', shortPrompt: 'full coverage', tags: ['covered'] }
      ]
    },
    {
      id: 'cover_up', labelJa: '羽織り', multi: false, options: [
        { id: 'sheer_cover_up', labelJa: 'シアーカバー', shortPrompt: 'sheer beach cover-up', tags: ['sheer'] },
        { id: 'sarong', labelJa: 'パレオ', shortPrompt: 'sarong', tags: ['draped'] },
        { id: 'sheer_robe', labelJa: 'シアーガウン', shortPrompt: 'sheer gown', tags: ['sheer'] },
        { id: 'long_sleeved_cardigan', labelJa: '長袖カーディガン', shortPrompt: 'a long-sleeved cardigan', tags: ['long_sleeve', 'layered'] },
        { id: 'full_back_cape', labelJa: '背中を覆うケープ', shortPrompt: 'a full-length cape', tags: ['cape', 'covered_back', 'layered'] },
        { id: 'shoulder_cape', labelJa: '肩掛けケープ', shortPrompt: 'a shoulder cape', tags: ['cape', 'layered'] },
        { id: 'no_cover_up', labelJa: 'なし', shortPrompt: '', tags: [] }
      ]
    },

    // ランジェリー専用
    {
      id: 'lingerie_form', labelJa: '下着の型', multi: false, options: [
        { id: 'separate_set', labelJa: '上下分離', shortPrompt: 'two-piece set', tags: ['lingerie_two'] },
        { id: 'one_piece_lingerie', labelJa: '一体型', shortPrompt: 'one-piece', tags: ['lingerie_one'] }
      ]
    },
    {
      id: 'top_structure', labelJa: '上半身構造', multi: false, options: [
        { id: 'bralette', labelJa: 'ブラレット', shortPrompt: 'bralette', tags: ['soft'] },
        { id: 'underwire_bra', labelJa: 'ワイヤーブラ', shortPrompt: 'underwire bra', tags: ['structured'] },
        { id: 'bandeau', labelJa: 'バンドゥ', shortPrompt: 'bandeau', tags: ['no_strap'] },
        { id: 'bustier', labelJa: 'ビスチェ', shortPrompt: 'bustier', tags: ['structured'] }
      ]
    },
    {
      id: 'bottom_structure', labelJa: '下半身構造', multi: false, options: [
        { id: 'briefs', labelJa: 'ショーツ', shortPrompt: 'briefs', tags: [] },
        { id: 'high_waisted_briefs', labelJa: 'ハイウエストショーツ', shortPrompt: 'high-waisted briefs', tags: ['high_waist'] },
        { id: 'boyshorts', labelJa: 'ボーイショーツ', shortPrompt: 'boyshorts', tags: ['covered'] },
        { id: 'lace_shorts', labelJa: 'レースショーツ', shortPrompt: 'lace shorts', tags: ['lace'] }
      ]
    },
    {
      id: 'garter', labelJa: 'ガーター', multi: false, options: [
        { id: 'garter_belt', labelJa: 'ガーターベルト', shortPrompt: 'garter belt', tags: ['garter'] },
        { id: 'garter_details', labelJa: 'ガーター飾り', shortPrompt: 'garter details', tags: ['garter'] },
        { id: 'no_garter', labelJa: 'なし', shortPrompt: '', tags: [] }
      ]
    }
  ];
})(window);
