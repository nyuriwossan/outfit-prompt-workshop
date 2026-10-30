/* 衣装プロンプト工房 / data/preset-themes.js
 * 発見用の横断タグと、コスプレ・季節イベント・着ぐるみのプリセット。
 *
 *   themeTags     … 'cosplay'（コスプレ・仮装）／'seasonal'（季節・イベント）／'kigurumi'（着ぐるみ・動物モチーフ）
 *                   どれも持たないプリセットは「通常衣装」として絞り込める。
 *   eventTags     … 行事（検索・絞り込み専用）。衣装の保存データには入れない（schema据え置き）。
 *                   行事を設計に反映したいときは主テーマ（concept.primaryThemeMotif）と季節（concept.season）を使う。
 *   kigurumiType  … 着ぐるみの6分類（motif_accessory / animal_hood / onesie / plush_suit / full_mascot / reinterpretation）
 *
 * プリセットは既存仕様どおり「部分パッチ」。一覧・プレビュー・配色試しでは編集中の衣装を変更せず、
 * 「この衣装を使う」で初めて反映する（preset-catalog.js）。
 */
(function (global) {
  var CPW = global.CPW, D = CPW.data;
  D.presetThemes = [
    { id: 'cosplay', labelJa: 'コスプレ・仮装' },
    { id: 'seasonal', labelJa: '季節・イベント' },
    { id: 'kigurumi', labelJa: '着ぐるみ・動物モチーフ' },
    { id: 'everyday', labelJa: '通常衣装' }
  ];
  D.presetEvents = [
    { id: 'christmas', labelJa: 'クリスマス' }, { id: 'halloween', labelJa: 'ハロウィン' },
    { id: 'easter', labelJa: 'イースター' }, { id: 'valentine', labelJa: 'バレンタイン・ホワイトデー' },
    { id: 'new_year', labelJa: 'お正月' }, { id: 'spring_festival', labelJa: '春祭り・花見' },
    { id: 'summer_festival', labelJa: '夏祭り・七夕' }, { id: 'summer_beach', labelJa: '夏・海辺' },
    { id: 'harvest', labelJa: '収穫祭・秋' }, { id: 'winter', labelJa: '冬のおでかけ' },
    { id: 'birthday', labelJa: '誕生日・パーティー' }, { id: 'carnival', labelJa: 'カーニバル・仮面祭' }
  ];
  D.kigurumiTypes = [
    { id: 'motif_accessory', labelJa: '耳・尾のアクセサリー（顔出し）' },
    { id: 'animal_hood', labelJa: '動物フード衣装（顔出し）' },
    { id: 'onesie', labelJa: '動物パジャマ・つなぎ（顔出し）' },
    { id: 'plush_suit', labelJa: 'ぬいぐるみ風スーツ（顔出し）' },
    { id: 'full_mascot', labelJa: '完全マスコット（顔を覆う）' },
    { id: 'reinterpretation', labelJa: '動物のファッション再解釈' }
  ];

  function garment(id) { return D.garments.filter(function (x) { return x.id === id; })[0]; }
  function deco(list) {
    return (list || []).map(function (d) { return { type: d[0], placements: d[1], role: d[3] || 'support', size: 'medium', quantity: d[2] || 'few' }; });
  }
  /* c: { g, parts, mat, mat2, trim, pal:[主,副,差し], fit, len, deco, pat, theme, season, occasion, role, world, style, cond, density, metal } */
  function patch(c) {
    var gm = garment(c.g);
    if (!gm) throw Error('preset-themes: unknown garment ' + c.g);
    var p = {
      concept: {}, garment: { category: gm.category, subtype: gm.id, wearRole: 'main_outfit' },
      silhouette: { fit: c.fit || 'relaxed' }, parts: c.parts || {},
      materials: { primary: c.mat || 'cotton', transparency: 'opaque' },
      decorations: { density: c.density != null ? c.density : (c.deco ? 2 : 1), items: deco(c.deco) },
      palette: { primary: c.pal[0], secondary: c.pal[1] || null, accent: c.pal[2] || null, scheme: 'base_and_accent' }
    };
    if (c.metal) p.palette.metal = c.metal;
    if (c.len) p.silhouette.length = c.len;
    if (c.mat2) p.materials.secondary = c.mat2;
    if (c.trim) p.materials.trim = c.trim;
    if (c.pat) p.materials.patterns = c.pat;
    if (!c.world) c.world = 'modern';
    [['theme', 'primaryThemeMotif'], ['season', 'season'], ['occasion', 'occasion'], ['role', 'role'], ['world', 'worldview'], ['style', 'primaryStyle']].forEach(function (k) { if (c[k[0]]) p.concept[k[1]] = c[k[0]]; });
    if (c.cond) p.condition = { items: c.cond };
    return p;
  }
  function P(id, categoryId, labelJa, summaryJa, moods, themes, events, kType, aliases, c) {
    return { id: id, group: c.cond ? 'scene' : 'style', categoryId: categoryId, labelJa: labelJa, summaryJa: summaryJa, moodTags: moods, searchAliases: aliases || [], themeTags: themes, eventTags: events || [], kigurumiType: kType || null, expansion: 'costume-2026-10', patch: patch(c) };
  }
  var CS = ['cosplay', 'seasonal'], K = ['kigurumi'], KS = ['kigurumi', 'seasonal'], CO = ['cosplay'], SE = ['seasonal'];
  var CUTE = ['可愛い'], FUN = ['可愛い', '華やか'];

  D.presets.push.apply(D.presets, [
    /* ---------- クリスマス・冬 ---------- */
    P('santa_classic', 'stage', 'サンタクロース', '毛皮縁の赤い上下と太いベルト', ['華やか', '可愛い'], CS, ['christmas'], null, ['サンタ', 'santa'], { g: 'santa_suit', parts: { headwear: 'santa_hat', footwear: 'fur_trimmed_boots', waist: 'wide_belt' }, mat: 'velvet', trim: 'faux_fur', pal: ['deep_crimson', 'snow_white', 'jet_black'], deco: [['fur_trim', ['cuffs', 'hem'], 'few', 'trim']], theme: 'christmas_holiday', season: 'winter', occasion: 'festival_occasion' }),
    P('santa_skirt', 'stage', 'ミニスカサンタ風', 'サンタの上着にプリーツスカートを合わせた仮装', ['可愛い', '華やか'], CS, ['christmas'], null, ['ミニスカサンタ', 'サンタ'], { g: 'santa_suit', parts: { headwear: 'santa_hat', bottoms: 'pleated_skirt', legwear: [{ id: 'knee_socks', layer: 'main' }], footwear: 'fur_trimmed_boots' }, mat: 'velvet', trim: 'faux_fur', pal: ['cherry_red', 'snow_white', 'jet_black'], len: 'mini', deco: [['fur_trim', ['cuffs', 'hem'], 'few', 'trim']], theme: 'christmas_holiday', season: 'winter' }),
    P('christmas_elf', 'stage', 'クリスマスのエルフ', 'ギザギザ裾のチュニックと先の反った靴', FUN, CS, ['christmas'], null, ['エルフ', 'elf'], { g: 'elf_tunic_tights', world: 'fairy_tale', parts: { headwear: 'elf_cap', footwear: 'curled_toe_shoes', waist: 'leather_belt' }, mat: 'wool', pal: ['kelly_green', 'deep_crimson', 'bright_gold'], deco: [['bell_ornaments', ['hem'], 'few']], theme: 'christmas_holiday', season: 'winter' }),
    P('christmas_tailored_suit', 'work', 'クリスマスのテーラードスーツ', 'ワインレッドのスーツにヒイラギの胸飾り', ['上品', '華やか'], SE, ['christmas'], null, ['クリスマス スーツ'], { g: 'business_suit', parts: { inner_shirt: 'dress_shirt', collar: 'peak_lapels', bottoms: 'fitted_trousers' }, mat: 'velvet', fit: 'tailored', pal: ['wine_red', 'pine_green', 'antique_gold'], deco: [['holly_sprigs', ['chest'], 'single', 'focal']], theme: 'christmas_holiday', season: 'winter', occasion: 'party' }),
    P('nutcracker_parade', 'stage', 'くるみ割り人形のパレード制服', '組紐飾りの赤い制服と金ボタン', ['華やか'], CS, ['christmas'], null, ['くるみ割り人形', 'ナッツクラッカー'], { g: 'marching_band_uniform', world: 'fairy_tale', parts: { headwear: 'tall_crown', bottoms: 'fitted_trousers', footwear: 'knee_high_boots' }, mat: 'wool', fit: 'tailored', pal: ['cherry_red', 'royal_blue', 'bright_gold'], metal: 'bright_gold', deco: [['brass_buttons', ['chest'], 'many'], ['aiguillettes', ['shoulders'], 'single']], theme: 'christmas_holiday', occasion: 'parade_occasion' }),
    P('advent_choir', 'fantasy', 'アドベントの聖歌隊', '赤い聖歌隊ローブに白いサープリス', ['上品', '神秘的'], SE, ['christmas'], null, ['聖歌隊'], { g: 'choir_robe', world: 'historical_western', mat: 'wool', mat2: 'linen', pal: ['wine_red', 'snow_white', 'antique_gold'], theme: 'christmas_holiday', season: 'winter', occasion: 'ceremonial' }),
    P('reindeer_onesie', 'daily', 'トナカイの着ぐるみパジャマ', '枝角フードの足付きつなぎ', CUTE, KS, ['christmas', 'winter'], 'onesie', ['トナカイ', '着ぐるみ'], { g: 'animal_onesie', parts: { creature_motif: 'reindeer', animal_hood: 'creature_feature_hood', kigurumi_feet: 'integrated_footies', costume_tail: 'pom_pom_tail' }, mat: 'fleece', fit: 'oversized', pal: ['caramel_brown', 'warm_ivory', 'cherry_red'], season: 'winter', occasion: 'rest' }),
    P('snowman_onesie', 'daily', '雪だるまのフードつなぎ', 'にんじん鼻のフードと炭ボタン風の飾り', CUTE, KS, ['christmas', 'winter'], 'onesie', ['雪だるま'], { g: 'animal_onesie', parts: { creature_motif: 'snowman', kigurumi_padding: 'rounded_belly_padding', kigurumi_feet: 'integrated_footies' }, mat: 'plush_fabric', fit: 'oversized', pal: ['snow_white', 'jet_black', 'tangerine'], season: 'winter' }),
    P('winter_puffer_bib', 'daily', '雪遊びのダウンとビブ', 'キルティングのダウンとスノービブ、スノーブーツ', ['シンプル', '可愛い'], SE, ['winter'], null, ['スキーウェア', 'スノーウェア'], { g: 'puffer_snow_bib_set', parts: { footwear: 'snow_boots', headwear: 'cat_ear_beanie' }, mat: 'nylon', fit: 'oversized', pal: ['sky_blue', 'snow_white', 'tangerine'], pat: ['fair_isle'], season: 'winter', occasion: 'outdoors' }),
    P('reindeer_antler_coat', 'daily', 'トナカイ枝角ボタンの冬コート', '枝角形のボタンと毛皮襟のロングコート', ['上品'], KS, ['winter', 'christmas'], 'reinterpretation', ['トナカイ コート'], { g: 'long_coat', parts: { collar: 'fur_trimmed_collar', closure: 'double_breasted' }, mat: 'wool', fit: 'tailored', pal: ['chestnut_brown', 'warm_ivory', 'deep_crimson'], deco: [['decorative_buttons', ['chest'], 'few', 'focal']], season: 'winter' }),

    /* ---------- ハロウィン・秋 ---------- */
    P('halloween_witch', 'stage', 'ハロウィンの魔女', '高い襟のコートドレスと尖り帽', ['ダーク', '可愛い'], CS, ['halloween'], null, ['魔女', 'witch'], { g: 'witch_coat_dress', world: 'fairy_tale', parts: { headwear: 'witch_hat', skirt_shape: 'a_line_skirt', footwear: 'lace_up_boots' }, mat: 'velvet', fit: 'fitted', pal: ['jet_black', 'grape_purple', 'burnt_orange'], deco: [['moon_charms', ['hem'], 'few']], theme: 'halloween_night', season: 'autumn', occasion: 'party' }),
    P('pumpkin_patch_overalls', 'daily', 'パンプキンパッチのオーバーオール', 'かぼちゃ色のオーバーオールと緑の差し色', CUTE, SE, ['halloween', 'harvest'], null, ['かぼちゃ'], { g: 'bib_overalls', parts: { footwear: 'rain_boots' }, mat: 'denim', pal: ['burnt_orange', 'moss_green', 'cream_yellow'], theme: 'halloween_night', season: 'autumn' }),
    P('skeleton_jumpsuit', 'stage', 'スケルトンのジャンプスーツ', '骨格プリントの黒い一体服', ['ダーク', 'クール'], CS, ['halloween'], null, ['骸骨', 'ガイコツ', 'skeleton'], { g: 'costume_jumpsuit', parts: { sleeves: 'fitted_long_sleeves' }, mat: 'jersey', fit: 'fitted', pal: ['jet_black', 'snow_white'], deco: [['bone_print', ['overall'], 'single', 'focal']], theme: 'halloween_night', season: 'autumn' }),
    P('witch_hunter_tabard', 'fantasy', '魔女狩りのタバード', '三角帽と革ベルトの外衣', ['ダーク', 'クール'], CS, ['halloween'], null, ['魔女狩り', '魔女狩りの外套'], { g: 'tabard_tunic', parts: { headwear: 'tricorn_hat', waist: 'leather_belt', footwear: 'knee_high_boots' }, mat: 'wool', mat2: 'leather', pal: ['oxblood', 'jet_black', 'oxidized_silver'], deco: [['buckles', ['waist'], 'few']], theme: 'halloween_night', world: 'dark_fantasy' }),
    P('pumpkin_mascot', 'stage', 'カボチャの完全マスコット', '頭と胴が一体のカボチャ形マスコット', FUN, ['kigurumi', 'seasonal', 'cosplay'], ['halloween', 'harvest'], 'full_mascot', ['かぼちゃ', '着ぐるみ'], { g: 'object_mascot_suit', world: 'fairy_tale', parts: { creature_motif: 'pumpkin', mascot_head: 'merged_head_body', mascot_hands: 'round_mitt_gloves', mascot_feet: 'stubby_round_feet' }, mat: 'plush_fabric', fit: 'oversized', pal: ['burnt_orange', 'moss_green'], theme: 'halloween_night', occasion: 'parade_occasion' }),
    P('harvest_dirndl', 'eastern', '収穫祭のディアンドル', '編み上げ胴衣とエプロンスカート', ['可愛い', '上品'], SE, ['harvest'], null, ['ディアンドル', 'オクトーバーフェスト'], { g: 'dirndl', world: 'historical_western', parts: { skirt_shape: 'gathered_skirt', footwear: 'lace_up_boots' }, mat: 'cotton', fit: 'fitted', pal: ['forest_green', 'warm_ivory', 'deep_crimson'], deco: [['ribbon_lacing', ['chest'], 'single']], theme: 'harvest_festival', season: 'autumn', occasion: 'festival_occasion' }),
    P('harvest_lederhosen', 'eastern', '収穫祭のレーダーホーゼン', '刺繍サスペンダーの革ズボンとシャツ', ['可愛い', 'クール'], SE, ['harvest'], null, ['レーダーホーゼン'], { g: 'lederhosen_set', world: 'historical_western', parts: { sleeves: 'long_sleeves', footwear: 'lace_up_boots' }, mat: 'leather', mat2: 'linen', pal: ['chestnut_brown', 'warm_ivory', 'forest_green'], deco: [['embroidery', ['chest'], 'few']], theme: 'harvest_festival', season: 'autumn' }),
    P('scarecrow_overalls', 'stage', 'つぎはぎ案山子のオーバーオール', '当て布とほつれのある胸当てオーバーオール', CUTE, CS, ['harvest', 'halloween'], null, ['案山子', 'かかし'], { g: 'bib_overalls', world: 'fairy_tale', parts: { sleeves: 'long_sleeves' }, mat: 'canvas', fit: 'oversized', pal: ['mustard_yellow', 'denim_blue', 'warm_brown'], theme: 'harvest_festival', season: 'autumn', cond: [{ type: 'patched', group: 'state', severity: 'moderate', extent: 'scattered', placements: [] }] }),

    /* ---------- 春・イースター ---------- */
    P('easter_pinafore', 'daily', 'イースターのピナフォア', 'パステルのピナフォアとボンネット', CUTE, SE, ['easter'], null, ['イースター'], { g: 'pinafore_dress', world: 'fairy_tale', parts: { headwear: 'bonnet', skirt_shape: 'a_line_skirt' }, mat: 'cotton', pal: ['pastel_pink', 'cream_yellow', 'mint'], deco: [['ribbon_bow', ['waist'], 'single']], theme: 'easter_spring', season: 'spring' }),
    P('easter_rabbit_tailcoat', 'service', 'イースターラビットの燕尾服', 'うさ耳カチューシャとポンポンの尾を添えた燕尾服', ['可愛い', '上品'], ['seasonal', 'kigurumi'], ['easter'], 'motif_accessory', ['ラビット', 'うさぎ'], { g: 'tailcoat_suit', world: 'fairy_tale', parts: { headwear: 'bunny_ear_headband' }, mat: 'wool', fit: 'tailored', pal: ['dusty_lavender', 'pearl_white', 'pastel_pink'], deco: [['pom_pom_tail', ['back'], 'single']], theme: 'easter_spring', season: 'spring' }),
    P('spring_happi', 'eastern', '春祭りの法被', '鉢巻と帯を締めた法被', ['可愛い', 'クール'], SE, ['spring_festival', 'summer_festival'], null, ['法被', 'はっぴ', '祭り'], { g: 'happi_coat', world: 'japanese', parts: { headwear: 'hachimaki', footwear: 'geta' }, mat: 'cotton', pal: ['vermilion', 'snow_white', 'deep_navy'], theme: 'summer_matsuri', occasion: 'festival_occasion' }),
    P('hanami_furisode', 'eastern', '花見の振袖', '桜柄の振袖と広い帯', ['華やか', '上品'], SE, ['spring_festival', 'new_year'], null, ['振袖', '花見'], { g: 'furisode', world: 'japanese', parts: { waist: 'obi', footwear: 'geta' }, mat: 'silk', pal: ['cherry_blossom_pink', 'pearl_white', 'antique_gold'], pat: ['cherry_blossom_print'], season: 'spring', occasion: 'ceremonial' }),
    P('maypole_dirndl', 'daily', '春祭りの花冠エプロンドレス', '花冠と淡い色のディアンドル', CUTE, SE, ['spring_festival'], null, ['メイポール'], { g: 'dirndl', world: 'fairy_tale', parts: { headwear: 'flower_crown', skirt_shape: 'full_skirt' }, mat: 'cotton', pal: ['soft_lavender', 'pearl_white', 'sage_green'], deco: [['fabric_flowers', ['waist'], 'few']], season: 'spring', occasion: 'festival_occasion' }),

    /* ---------- 夏 ---------- */
    P('summer_jinbei', 'eastern', '夏祭りの甚平', '紺の甚平と下駄', ['シンプル', '可愛い'], SE, ['summer_festival'], null, ['甚平', 'じんべい'], { g: 'jinbei', world: 'japanese', parts: { footwear: 'geta' }, mat: 'linen', pal: ['deep_navy', 'snow_white'], theme: 'summer_matsuri', season: 'summer', occasion: 'festival_occasion' }),
    P('fireworks_yukata', 'eastern', '花火の浴衣', '夜空色の浴衣と朱の帯', ['上品', '可愛い'], SE, ['summer_festival'], null, ['浴衣', '花火'], { g: 'yukata', world: 'japanese', parts: { waist: 'obi', footwear: 'geta' }, mat: 'cotton', pal: ['midnight_blue', 'vermilion', 'pale_gold'], pat: ['star_pattern'], theme: 'summer_matsuri', season: 'summer', occasion: 'festival_occasion' }),
    P('tanabata_tabard', 'eastern', '七夕の短冊タバード', '裾に短冊を下げたタバード', ['神秘的', '可愛い'], CS, ['summer_festival'], null, ['七夕', '短冊'], { g: 'tabard_tunic', world: 'japanese', mat: 'linen', pal: ['midnight_blue', 'snow_white', 'pale_gold'], deco: [['tanzaku_strips', ['hem'], 'many', 'focal']], theme: 'tanabata_stars', season: 'summer' }),
    P('sarong_swim_set', 'daily', 'サロンを巻いた水着', 'ビキニに腰巻きサロンを重ねる', ['可愛い', '華やか'], SE, ['summer_beach'], null, ['サロン', 'パレオ'], { g: 'bikini', parts: { cover_up: 'sarong' }, mat: 'nylon', pal: ['coral_pink', 'pure_white', 'aqua'], season: 'summer', occasion: 'beach' }),
    P('surf_towel_poncho', 'daily', 'サーフのタオルポンチョ', '浜辺で羽織るフード付きタオル地', ['シンプル'], SE, ['summer_beach'], null, ['ポンチョ', 'サーフ'], { g: 'towel_change_poncho', mat: 'terry_cloth', pal: ['lagoon_blue', 'sand_beige'], pat: ['horizontal_stripes'], season: 'summer', occasion: 'beach' }),
    P('guayabera_resort', 'daily', 'リゾートのグアヤベラ', 'ピンタック入りの開襟シャツと軽いパンツ', ['シンプル', '上品'], [], [], null, ['グアヤベラ', 'リゾート'], { g: 'guayabera_set', parts: { sleeves: 'short_sleeves' }, mat: 'linen', pal: ['linen_white', 'sand_beige', 'olive'], season: 'summer' }),
    P('wetsuit_diver', 'daily', 'フルウェットスーツ', '長袖長丈のウェットスーツ', ['クール', 'シンプル'], [], [], null, ['ウェットスーツ', 'ダイビング'], { g: 'full_wetsuit', mat: 'neoprene', fit: 'fitted', pal: ['jet_black', 'cobalt_blue'] }),

    /* ---------- バレンタイン・ホワイトデー・お正月・誕生日 ---------- */
    P('valentine_chocolatier', 'work', 'バレンタインのショコラティエ', 'ダブルのコックコートとショコラ色のエプロン', ['上品', '可愛い'], SE, ['valentine'], null, ['ショコラティエ', 'パティシエ'], { g: 'pastry_chef_uniform', parts: { closure: 'double_breasted' }, mat: 'cotton', fit: 'tailored', pal: ['chocolate_brown', 'warm_ivory', 'pastel_pink'], deco: [['heart_charms', ['chest'], 'single']], theme: 'valentine_hearts', occasion: 'work' }),
    P('valentine_heart_lolita', 'alternative', 'バレンタインのハートロリータ', 'ハート柄とリボンのロリータドレス', ['可愛い'], SE, ['valentine'], null, ['ハート', 'バレンタイン'], { g: 'lolita_dress', parts: { headwear: 'bonnet' }, mat: 'cotton', pal: ['pastel_pink', 'cherry_red', 'pure_white'], pat: ['heart_pattern'], deco: [['ribbon_bow', ['chest', 'waist'], 'few']], theme: 'valentine_hearts' }),
    P('white_day_tailcoat', 'service', 'ホワイトデーの給仕燕尾服', '白基調の燕尾服に淡い差し色', ['上品'], SE, ['valentine'], null, ['ホワイトデー', '燕尾服'], { g: 'tailcoat_suit', mat: 'wool', fit: 'tailored', pal: ['snow_white', 'pearl_gray', 'pastel_pink'], deco: [['ribbon_bow', ['collar'], 'single']], occasion: 'party' }),
    P('new_year_miko', 'eastern', '初詣の巫女装束', '白衣に緋袴、薄い千早を重ねる', ['上品', '神秘的'], SE, ['new_year'], null, ['巫女', '初詣'], { g: 'miko_outfit', world: 'japanese', mat: 'silk', pal: ['snow_white', 'vermilion', 'antique_gold'], theme: 'new_year_shrine', role: 'shrine_maiden', occasion: 'ritual' }),
    P('new_year_montsuki', 'eastern', '年始の紋付羽織袴', '黒の紋付羽織と縞の袴', ['上品', 'クール'], SE, ['new_year'], null, ['紋付袴', '紋付羽織袴'], { g: 'haori_hakama', world: 'japanese', parts: { footwear: 'geta' }, mat: 'silk', pal: ['jet_black', 'slate_gray', 'snow_white'], theme: 'new_year_shrine', occasion: 'ceremonial' }),
    P('birthday_cake_apron', 'daily', '誕生日ケーキのエプロンドレス', 'クリーム色のピナフォアにいちごの差し色', CUTE, CS, ['birthday'], null, ['誕生日', 'ケーキ'], { g: 'pinafore_dress', world: 'fairy_tale', parts: { skirt_shape: 'tiered_skirt' }, mat: 'cotton', pal: ['cream_yellow', 'strawberry_red', 'pure_white'], deco: [['frills', ['hem'], 'many'], ['ribbon_bow', ['waist'], 'single']], theme: 'dreams_and_sweets', occasion: 'party' }),

    /* ---------- コスプレ・舞台 ---------- */
    P('harlequin_jester', 'stage', '菱形パネルの道化', '菱形パネルの一体服と小さなラフ襟', ['華やか', 'クール'], CO, ['carnival'], null, ['道化', 'ハーレクイン', 'ピエロ'], { g: 'costume_jumpsuit', parts: { collar: 'ruffled_collar' }, mat: 'satin', fit: 'fitted', pal: ['jet_black', 'deep_crimson', 'pure_white'], deco: [['harlequin_diamonds', ['overall'], 'single', 'focal']], occasion: 'stage_occasion' }),
    P('drum_major_coat', 'stage', 'ドラムメジャーの舞台コート', '飾り組紐と肩飾りの舞台制服', ['華やか', 'クール'], CO, [], null, ['ドラムメジャー', 'マーチング'], { g: 'marching_band_uniform', parts: { headwear: 'officer_cap', bottoms: 'fitted_trousers', footwear: 'knee_high_boots' }, mat: 'wool', fit: 'tailored', pal: ['royal_blue', 'snow_white', 'bright_gold'], metal: 'bright_gold', deco: [['braided_trim', ['chest'], 'many'], ['epaulette_ornaments', ['shoulders'], 'single']], occasion: 'parade_occasion' }),
    P('heraldic_tabard', 'fantasy', '抽象紋章のタバード', '前後に紋章パネルを持つ短いT字外衣', ['上品', 'クール'], CO, [], null, ['タバード', '伝令'], { g: 'tabard_tunic', parts: { waist: 'narrow_belt', footwear: 'knee_high_boots' }, mat: 'velvet', pal: ['royal_blue', 'bright_gold', 'snow_white'], deco: [['heraldic_panels', ['chest', 'back'], 'single', 'focal']], world: 'western_fantasy', occasion: 'ceremonial' }),
    P('ballet_tutu', 'stage', '平板チュチュのバレエ衣装', '水平に広がるチュチュとバレエシューズ', ['華やか', '可愛い'], CO, [], null, ['チュチュ', 'バレエ'], { g: 'classical_tutu', parts: { skirt_shape: 'circle_skirt', footwear: 'ballet_slippers' }, mat: 'organza', fit: 'fitted', pal: ['pearl_white', 'blush_pink', 'pale_gold'], deco: [['rhinestones', ['chest'], 'few']], occasion: 'dance_performance' }),
    P('aerialist_unitard', 'stage', 'ケープ付き空中演技ユニタード', '一体型のユニタードと肩のケープ', ['華やか', 'クール'], CO, [], null, ['ユニタード', 'サーカス'], { g: 'stage_unitard', parts: { cover_up: 'shoulder_cape', sleeves: 'fitted_long_sleeves' }, mat: 'spandex', fit: 'fitted', pal: ['deep_crimson', 'bright_gold'], deco: [['sequins', ['chest'], 'many']], occasion: 'stage_occasion' }),
    P('cheerleader', 'stage', 'チアリーダー', 'シェルトップとプリーツスカート、ポンポン', ['可愛い', '華やか'], CO, [], null, ['チア', 'cheerleader'], { g: 'cheerleader_uniform', parts: { sleeves: 'sleeveless', footwear: 'sneakers' }, mat: 'jersey', fit: 'fitted', pal: ['royal_blue', 'pure_white', 'canary_yellow'], deco: [['pom_poms', ['hands'], 'few']] }),
    P('nurse_costume', 'stage', 'ナース風の衣装', '前ボタンのワンピースと白いエプロン', ['可愛い', 'シンプル'], CO, [], null, ['ナース', '看護師', 'ミニスカナース'], { g: 'nurse_dress', parts: { skirt_shape: 'a_line_skirt', sleeves: 'short_sleeves' }, mat: 'cotton', pal: ['pure_white', 'pastel_pink', 'sky_blue'] }),
    P('beekeeper', 'work', '養蜂家', 'ベール付きフードの作業着', ['シンプル'], CO, [], null, ['養蜂'], { g: 'beekeeping_suit', parts: { handwear: { type: 'hand_gloves', material: 'leather_hand', length: 'elbow_length', fingertips: 'full_fingered' }, footwear: 'rain_boots' }, mat: 'canvas', fit: 'oversized', pal: ['off_white', 'honey_yellow'], role: 'artisan', occasion: 'work' }),
    P('blacksmith', 'fantasy', '鍛冶職人', '中央で分かれた長い革の前垂れと脚絆', ['クール'], CO, [], null, ['鍛冶', 'ブラックスミス'], { g: 'blacksmith_workwear', parts: { footwear: 'lace_up_boots' }, mat: 'canvas', mat2: 'leather', pal: ['warm_brown', 'charcoal_gray', 'copper_metal'], role: 'artisan', world: 'western_fantasy', cond: [{ type: 'soot_stained', group: 'state', severity: 'light', extent: 'scattered', placements: [] }] }),
    P('space_undersuit', 'alternative', '宇宙作業の冷却アンダースーツ', '冷却チューブが走る密着スーツ', ['クール'], CO, [], null, ['宇宙服', 'アンダースーツ'], { g: 'cooling_undersuit', mat: 'spandex', mat2: 'mesh', fit: 'fitted', pal: ['pure_white', 'steel_blue', 'tangerine'], world: 'sci_fi' }),
    P('pressure_suit_astronaut', 'alternative', '環状関節の宇宙飛行士', '硬い胴シェルと環状関節の圧力スーツ', ['クール'], CO, [], null, ['宇宙飛行士', '宇宙服'], { g: 'pressure_suit', mat: 'nylon', fit: 'boxy', pal: ['pure_white', 'tangerine', 'polished_silver'], world: 'sci_fi' }),
    P('venetian_carnival', 'stage', 'ヴェネツィアの仮面祭', '黒いタバロと三角帽', ['神秘的', 'ダーク'], ['cosplay', 'seasonal'], ['carnival'], null, ['ヴェネツィア', '仮面祭', 'カーニバル'], { g: 'venetian_carnival_cloak', world: 'historical_western', parts: { headwear: 'tricorn_hat' }, mat: 'wool', mat2: 'lace', pal: ['jet_black', 'pearl_white', 'antique_gold'], occasion: 'masked_ball' }),
    P('firefighter', 'work', '消防士', '反射帯付きのターンアウトコートとパンツ', ['クール'], CO, [], null, ['消防服', '消防士'], { g: 'firefighter_turnout', parts: { footwear: 'rain_boots' }, mat: 'canvas', fit: 'boxy', pal: ['mustard_yellow', 'charcoal_gray'], deco: [['reflective_tape', ['sleeves', 'hem'], 'few']], occasion: 'work' }),
    P('gambeson_guard', 'fantasy', 'キルティング胴着の衛兵', '厚いキルティングの胴着とベルト', ['クール'], CO, [], null, ['ガンベゾン', 'ギャンベゾン', '茨守り'], { g: 'quilted_gambeson', parts: { waist: 'leather_belt', footwear: 'knee_high_boots', bottoms: 'fitted_trousers' }, mat: 'linen', pal: ['sand_beige', 'warm_brown'], role: 'royal_guard', world: 'western_fantasy' }),
    P('shinobi', 'eastern', '忍び', '巻き衿の上衣と脚絆の忍装束', ['クール', 'ダーク'], CO, [], null, ['忍者', '忍装束'], { g: 'shinobi_outfit', parts: { waist: 'sash' }, mat: 'cotton', fit: 'fitted', pal: ['ink_black', 'charcoal_gray', 'deep_crimson'], role: 'assassin', world: 'japanese' }),
    P('onmyoji_kariginu', 'eastern', '狩衣の陰陽師', '広い袖の狩衣と指貫', ['神秘的', '上品'], CO, [], null, ['陰陽師', '狩衣'], { g: 'kariginu', mat: 'silk', pal: ['pearl_white', 'royal_purple', 'antique_gold'], role: 'shaman', world: 'japanese', occasion: 'ritual' }),
    P('pirate_captain', 'fantasy', '海賊船長', 'フロックコートと三角帽、腰の飾り帯', ['クール', '華やか'], CO, [], null, ['海賊', 'pirate'], { g: 'frock_coat_suit', parts: { headwear: 'tricorn_hat', waist: 'sash', footwear: 'knee_high_boots' }, mat: 'wool', fit: 'tailored', pal: ['oxblood', 'jet_black', 'antique_gold'], deco: [['brass_buttons', ['chest'], 'many']], role: 'sailor', occasion: 'voyage' }),
    P('priest_cassock', 'fantasy', '神父のカソック', '立ち襟と前ボタンの長いカソック', ['上品', 'ダーク'], CO, [], null, ['神父', 'カソック'], { g: 'cassock', mat: 'wool', fit: 'tailored', pal: ['jet_black', 'pure_white'], deco: [['cross_ornament', ['chest'], 'single', 'focal']], role: 'cleric' }),
    P('doublet_bard', 'fantasy', '吟遊詩人のダブレット', '詰め物入りの上衣と膨らんだ半ズボン', ['華やか'], CO, [], null, ['吟遊詩人', 'ダブレット', 'ルネサンス'], { g: 'doublet_and_hose', mat: 'velvet', pal: ['forest_green', 'mustard_yellow', 'warm_brown'], deco: [['piping', ['chest'], 'few']], role: 'musician', world: 'historical_western' }),

    /* ---------- 通常衣装（ガチャ比較で不足していた構造） ---------- */
    P('tuxedo_formal', 'work', 'タキシードの正装', '拝絹ラペルのタキシードと蝶ネクタイ', ['上品', 'クール'], [], [], null, ['タキシード', 'tuxedo'], { g: 'tuxedo', parts: { bottoms: 'fitted_trousers' }, mat: 'wool', mat2: 'satin', fit: 'tailored', pal: ['jet_black', 'pure_white'], occasion: 'party' }),
    P('biker_leather', 'alternative', 'レザーライダース', '斜めジップの革ジャケットと細身デニム', ['クール'], [], [], null, ['レザージャケット', 'ライダース'], { g: 'biker_jacket_set', parts: { footwear: 'lace_up_boots' }, mat: 'leather', fit: 'fitted', pal: ['jet_black', 'denim_blue', 'polished_silver'], deco: [['zippers', ['chest'], 'few']] }),
    P('denim_jacket_daily', 'daily', 'デニムジャケット', 'デニムのトラッカージャケットとTシャツ', ['シンプル'], [], [], null, ['デニムジャケット', 'Gジャン'], { g: 'denim_jacket_set', parts: { footwear: 'sneakers' }, mat: 'denim', pal: ['denim_blue', 'pure_white'] }),
    P('mods_parka', 'daily', 'モッズパーカ', '裾が分かれたフィッシュテールパーカ', ['クール', 'シンプル'], [], [], null, ['モッズコート', 'モッズパーカ'], { g: 'fishtail_parka', mat: 'cotton', pal: ['olive', 'charcoal_gray'] }),
    P('track_suit_sport', 'daily', 'トラックスーツ', 'ジップのトラックジャケットと揃いのパンツ', ['シンプル', 'クール'], [], [], null, ['スポーツウェア', 'ジャージ'], { g: 'track_suit', parts: { footwear: 'sneakers' }, mat: 'polyester', pal: ['deep_navy', 'pure_white'], pat: ['vertical_stripes'] }),
    P('bomber_jacket', 'daily', 'フライトジャケット', 'リブ裾のボンバージャケット', ['クール'], [], [], null, ['フライトジャケット', 'ボンバー'], { g: 'bomber_jacket_set', parts: { footwear: 'lace_up_boots' }, mat: 'nylon', pal: ['olive', 'tangerine', 'jet_black'] }),
    P('bathrobe_rest', 'daily', 'フード付きバスローブ', 'タオル地のローブと腰紐', ['シンプル'], [], [], null, ['バスローブ'], { g: 'hooded_bathrobe', mat: 'terry_cloth', pal: ['pure_white', 'pearl_gray'], occasion: 'rest' }),
    P('sherwani_formal', 'eastern', 'シェルワニの礼装', '立ち襟の長い上着と細身パンツ', ['上品', '華やか'], [], [], null, ['シェルワニ'], { g: 'sherwani', mat: 'brocade', fit: 'tailored', pal: ['warm_ivory', 'antique_gold', 'burgundy'], deco: [['gold_embroidery', ['collar', 'chest'], 'few']], occasion: 'wedding' }),
    P('kurta_casual', 'eastern', 'クルタ', '脇スリットの長いチュニックとパンツ', ['シンプル'], [], [], null, ['クルタ'], { g: 'kurta_set', mat: 'linen', pal: ['sage_green', 'warm_ivory'] }),
    P('andean_poncho', 'fantasy', '織りのポンチョ', '縞の縁取りとフリンジのウールポンチョ', ['シンプル'], [], [], null, ['ポンチョ', 'アンデス'], { g: 'woven_poncho', mat: 'wool', pal: ['terracotta', 'mustard_yellow', 'teal'], pat: ['horizontal_stripes'], occasion: 'travel' }),
    P('greek_chiton', 'fantasy', 'キトンとヒマティオン', 'ピン留めのキトンに巻き布を重ねる', ['上品', '神秘的'], [], [], null, ['ヒマティオン', 'キトン', '古代ギリシャ'], { g: 'chiton_himation', mat: 'linen', fit: 'draped', pal: ['warm_ivory', 'pale_gold'], world: 'mythic_world' }),
    P('steppe_deel', 'fantasy', 'デール（草原の装束）', '脇留めの長衣と幅広の帯', ['上品'], [], [], null, ['デール', 'モンゴル'], { g: 'deel', parts: { waist: 'wide_belt', footwear: 'knee_high_boots' }, mat: 'brocade', pal: ['royal_blue', 'antique_gold', 'deep_crimson'], occasion: 'travel' }),
    P('chef_whites', 'work', 'シェフコート', '白いダブルのコックコート', ['シンプル', 'クール'], [], [], null, ['シェフ', 'コックコート'], { g: 'pastry_chef_uniform', parts: { closure: 'double_breasted' }, mat: 'cotton', fit: 'tailored', pal: ['pure_white', 'jet_black'], role: 'chef', occasion: 'work' }),
    P('scrubs_medical', 'work', 'スクラブ', 'Vネックのスクラブ上下', ['シンプル'], [], [], null, ['医師', 'スクラブ'], { g: 'scrub_suit', mat: 'cotton', pal: ['teal', 'pure_white'], role: 'doctor', occasion: 'work' }),
    P('hazmat_worker', 'alternative', '密閉型防護服', 'フード一体で透明な顔面バイザー付き', ['クール'], [], [], null, ['防護服', 'ハズマット'], { g: 'sealed_hazmat_suit', mat: 'rubberized_fabric', fit: 'oversized', pal: ['canary_yellow', 'jet_black'], world: 'post_apocalypse' }),
    P('fencing_whites', 'work', 'フェンシングウェア', '脇留めの白い上衣と膝丈ブリーチ', ['クール', 'シンプル'], [], [], null, ['フェンシング'], { g: 'fencing_uniform', mat: 'cotton', fit: 'fitted', pal: ['pure_white', 'pearl_gray'] }),

    /* ---------- 着ぐるみ：耳・尾のアクセサリー（顔出し） ---------- */
    P('bunny_ear_lounge', 'daily', 'うさ耳カチューシャのルームウェア', 'ふわもこ部屋着にうさ耳とポンポンの尾', CUTE, K, [], 'motif_accessory', ['うさ耳', 'ウサギ'], { g: 'pastel_fluffy_loungewear', parts: { headwear: 'bunny_ear_headband' }, mat: 'plush_fabric', pal: ['pastel_pink', 'pure_white'], deco: [['pom_pom_tail', ['back'], 'single']], occasion: 'rest' }),
    P('cat_ear_street', 'daily', '猫耳ニット帽のストリート', 'フーディに猫耳ニット帽と飾り尾', ['可愛い', 'クール'], K, [], 'motif_accessory', ['猫耳', 'ネコ'], { g: 'hoodie_and_cargo', parts: { headwear: 'cat_ear_beanie', footwear: 'sneakers' }, mat: 'cotton', pal: ['jet_black', 'charcoal_gray', 'hot_pink'], deco: [['clip_on_plush_tail', ['back'], 'single']], style: 'street' }),
    P('fox_ear_stole', 'daily', '狐耳と尾のストール', 'ファーコートに狐耳カチューシャと飾り尾', ['上品', '可愛い'], K, ['winter'], 'motif_accessory', ['キツネ', '狐耳'], { g: 'fur_coat', parts: { headwear: 'animal_ear_headband' }, mat: 'faux_fur', pal: ['burnt_orange', 'warm_ivory'], deco: [['clip_on_plush_tail', ['back'], 'single']], season: 'winter' }),
    P('bear_ear_beret_set', 'daily', 'クマ耳ベレーのもこもこセット', 'もこもこパーカーセットにクマ耳ベレー', CUTE, K, [], 'motif_accessory', ['クマ耳'], { g: 'oversized_plush_hoodie_set', parts: { headwear: 'bear_ear_beret' }, mat: 'plush_fabric', pal: ['caramel_brown', 'cream_yellow'], occasion: 'rest' }),

    /* ---------- 着ぐるみ：動物フード（顔出し） ---------- */
    P('shark_hood_poncho', 'daily', 'サメ背びれのフードポンチョ', '背びれと歯並びの縁取りのフードポンチョ', ['可愛い', 'クール'], K, ['summer_beach'], 'animal_hood', ['サメ', 'シャーク'], { g: 'animal_hood_poncho', parts: { creature_motif: 'shark', animal_hood: 'creature_feature_hood', costume_tail: 'flat_fin_tail_panel' }, mat: 'terry_cloth', fit: 'oversized', pal: ['steel_blue', 'snow_white'] }),
    P('dinosaur_hood_jacket', 'daily', '恐竜背びれのフードジャケット', '柔らかい背びれのフードジャケットと揃いのパンツ', CUTE, K, [], 'animal_hood', ['恐竜'], { g: 'animal_hood_jacket', parts: { creature_motif: 'dinosaur', costume_tail: 'soft_spiked_tail', footwear: 'sneakers' }, mat: 'fleece', pal: ['lime_green', 'canary_yellow'] }),
    P('penguin_hood_capelet', 'daily', 'ペンギンのフードケープ', 'くちばしのフードと羽根形の袖', CUTE, K, ['winter'], 'animal_hood', ['ペンギン'], { g: 'animal_hood_capelet', parts: { creature_motif: 'penguin', kigurumi_hands: 'wing_sleeves' }, mat: 'fleece', pal: ['jet_black', 'snow_white', 'marigold'] }),
    P('dragon_hood_cloak', 'fantasy', 'ドラゴン角のフードケープ', '角と背の稜線が付いたフード', ['可愛い', '神秘的'], K, [], 'animal_hood', ['ドラゴン', '竜'], { g: 'animal_hood_capelet', parts: { creature_motif: 'dragon', costume_tail: 'soft_spiked_tail' }, mat: 'velvet', pal: ['emerald_green', 'antique_gold'], world: 'western_fantasy' }),
    P('sheep_hood_cardigan', 'daily', 'ヒツジのフードカーディガン', '巻き角とウールの縁取りのフード', CUTE, K, [], 'animal_hood', ['ヒツジ', '羊'], { g: 'animal_hood_cardigan', parts: { creature_motif: 'sheep' }, mat: 'boucle', pal: ['warm_ivory', 'latte_beige'] }),
    P('red_panda_hoodie', 'daily', 'レッサーパンダのフードジャケット', '丸耳フードと縞の尾', CUTE, K, [], 'animal_hood', ['レッサーパンダ'], { g: 'animal_hood_jacket', parts: { creature_motif: 'red_panda', costume_tail: 'plush_tail' }, mat: 'fleece', pal: ['terracotta', 'cream_yellow', 'chocolate_brown'] }),

    /* ---------- 着ぐるみ：動物パジャマ・つなぎ（顔出し） ---------- */
    P('rabbit_onesie', 'daily', 'ウサギのフランネル寝つなぎ', '長い耳のフードとポンポンの尾', CUTE, K, [], 'onesie', ['ウサギ', '着ぐるみパジャマ'], { g: 'animal_onesie', parts: { creature_motif: 'rabbit', costume_tail: 'pom_pom_tail' }, mat: 'flannel', fit: 'relaxed', pal: ['pastel_pink', 'pure_white'], occasion: 'rest' }),
    P('cat_onesie', 'daily', 'ネコの前ファスナーつなぎ', '肉球付きの足先と尖り耳のフード', CUTE, K, [], 'onesie', ['ネコ', '猫'], { g: 'animal_onesie', parts: { creature_motif: 'cat', kigurumi_feet: 'paw_print_footies', kigurumi_hands: 'attached_paw_mitts', costume_tail: 'plush_tail' }, mat: 'fleece', pal: ['ash_gray', 'pure_white', 'pastel_pink'], occasion: 'rest' }),
    P('axolotl_onesie', 'daily', 'ウーパールーパーのつなぎ', 'えらフリルのフードと平たい尾びれ', CUTE, K, [], 'onesie', ['ウーパールーパー', 'アホロートル'], { g: 'animal_onesie', parts: { creature_motif: 'axolotl', costume_tail: 'flat_fin_tail_panel' }, mat: 'fleece', pal: ['pastel_pink', 'coral_pink'], occasion: 'rest' }),
    P('dinosaur_sleeper', 'daily', '恐竜のスリーパーつなぎ', 'フードから尾まで続く背びれと足先一体', CUTE, K, [], 'onesie', ['恐竜', 'ダイナソー'], { g: 'animal_onesie', parts: { creature_motif: 'dinosaur', kigurumi_feet: 'integrated_footies', costume_tail: 'soft_spiked_tail' }, mat: 'fleece', pal: ['sage_green', 'cream_yellow'], occasion: 'rest' }),
    P('panda_onesie', 'daily', 'パンダ配色のつなぎ', '白黒の切り替えと丸耳フード', CUTE, K, [], 'onesie', ['パンダ'], { g: 'animal_onesie', parts: { creature_motif: 'panda', kigurumi_hands: 'attached_paw_mitts' }, mat: 'fleece', pal: ['snow_white', 'jet_black'], occasion: 'rest' }),
    P('fox_onesie', 'daily', 'キツネの寝つなぎ', '尖り耳のフードとふさふさの尾', CUTE, K, [], 'onesie', ['キツネ'], { g: 'animal_onesie', parts: { creature_motif: 'fox', costume_tail: 'plush_tail' }, mat: 'flannel', pal: ['burnt_orange', 'warm_ivory'], occasion: 'rest' }),

    /* ---------- 着ぐるみ：ぬいぐるみ風スーツ（顔出し） ---------- */
    P('capybara_plush_suit', 'stage', 'カピバラのぬいぐるみスーツ', '箱形の詰め物とひづめ形ミトン', CUTE, K, [], 'plush_suit', ['カピバラ'], { g: 'plush_padded_suit', parts: { creature_motif: 'capybara', kigurumi_padding: 'boxy_body_padding', kigurumi_hands: 'hoof_mitts', kigurumi_feet: 'integrated_footies' }, mat: 'plush_fabric', fit: 'boxy', pal: ['caramel_brown', 'mocha_brown'] }),
    P('bumblebee_plush_suit', 'stage', 'マルハナバチのぬいぐるみスーツ', '縞のお腹と羽根形の袖', CUTE, K, ['spring_festival'], 'plush_suit', ['ハチ', 'ミツバチ'], { g: 'plush_padded_suit', parts: { creature_motif: 'bumblebee', kigurumi_padding: 'rounded_belly_padding', kigurumi_hands: 'wing_sleeves' }, mat: 'plush_fabric', fit: 'oversized', pal: ['canary_yellow', 'jet_black'], pat: ['horizontal_stripes'] }),
    P('koala_plush_suit', 'stage', 'コアラのぬいぐるみスーツ', '大きな耳のフードと丸いお腹', CUTE, K, [], 'plush_suit', ['コアラ'], { g: 'plush_padded_suit', parts: { creature_motif: 'koala', kigurumi_padding: 'rounded_belly_padding', kigurumi_hands: 'attached_paw_mitts' }, mat: 'plush_fabric', fit: 'oversized', pal: ['ash_gray', 'pure_white'] }),

    /* ---------- 着ぐるみ：完全マスコット（顔を覆う。共通構造＋題材の差分） ---------- */
    P('rabbit_mascot', 'stage', 'ウサギの完全マスコット', '大きな丸い頭が頭全体を覆うウサギの着ぐるみ', FUN, ['kigurumi', 'cosplay'], ['easter'], 'full_mascot', ['ウサギ', '着ぐるみ', 'マスコット'], { g: 'full_mascot_suit', parts: { creature_motif: 'rabbit', mascot_head: 'oversized_round_head', mascot_body: 'padded_plush_body', mascot_hands: 'paw_gloves', mascot_feet: 'oversized_paw_feet', costume_tail: 'pom_pom_tail' }, mat: 'plush_fabric', fit: 'oversized', pal: ['snow_white', 'pastel_pink'], occasion: 'parade_occasion' }),
    P('wolf_mascot', 'stage', 'オオカミの完全マスコット', '造形的な頭部と爪のある足', ['クール', '可愛い'], ['kigurumi', 'cosplay'], [], 'full_mascot', ['オオカミ', '着ぐるみ'], { g: 'full_mascot_suit', parts: { creature_motif: 'wolf', mascot_head: 'sculpted_creature_head', mascot_body: 'slim_fur_body', mascot_hands: 'paw_gloves', mascot_feet: 'clawed_feet', costume_tail: 'plush_tail' }, mat: 'faux_fur', fit: 'fitted', pal: ['slate_gray', 'pure_white'], occasion: 'stage_occasion' }),
    P('shark_mascot', 'stage', 'サメの完全マスコット', '背びれの頭部とひれの手足', FUN, ['kigurumi', 'cosplay'], ['summer_beach'], 'full_mascot', ['サメ', '着ぐるみ'], { g: 'full_mascot_suit', parts: { creature_motif: 'shark', mascot_head: 'oversized_round_head', mascot_body: 'round_full_body', mascot_hands: 'flipper_hands', mascot_feet: 'flipper_feet', costume_tail: 'flat_fin_tail_panel' }, mat: 'plush_fabric', fit: 'oversized', pal: ['steel_blue', 'snow_white'] }),
    P('penguin_mascot', 'stage', 'ペンギンの完全マスコット', 'まんまるの胴と短い翼の手', FUN, ['kigurumi', 'cosplay'], ['winter'], 'full_mascot', ['ペンギン', '着ぐるみ'], { g: 'full_mascot_suit', parts: { creature_motif: 'penguin', mascot_head: 'chibi_big_head', mascot_body: 'round_full_body', mascot_hands: 'wing_flippers', mascot_feet: 'flipper_feet' }, mat: 'plush_fabric', fit: 'oversized', pal: ['jet_black', 'snow_white', 'marigold'] }),
    P('dragon_mascot', 'stage', 'ドラゴンの完全マスコット', '角と稜線の頭部、爪の足とトゲの尾', ['華やか', 'クール'], ['kigurumi', 'cosplay'], [], 'full_mascot', ['ドラゴン', '着ぐるみ'], { g: 'full_mascot_suit', parts: { creature_motif: 'dragon', mascot_head: 'sculpted_creature_head', mascot_body: 'padded_plush_body', mascot_hands: 'cartoon_four_finger_gloves', mascot_feet: 'clawed_feet', costume_tail: 'soft_spiked_tail' }, mat: 'plush_fabric', fit: 'oversized', pal: ['emerald_green', 'canary_yellow'] }),
    P('elephant_mascot', 'stage', 'ゾウの完全マスコット', '大きな耳と鼻の頭部、丸い足', FUN, ['kigurumi', 'cosplay'], [], 'full_mascot', ['ゾウ', '着ぐるみ'], { g: 'full_mascot_suit', parts: { creature_motif: 'elephant', mascot_head: 'oversized_round_head', mascot_body: 'round_full_body', mascot_hands: 'round_mitt_gloves', mascot_feet: 'stubby_round_feet' }, mat: 'plush_fabric', fit: 'oversized', pal: ['periwinkle', 'pastel_pink'] }),
    P('strawberry_mascot', 'stage', 'イチゴの完全マスコット', 'ヘタの冠と種の点のイチゴ形', FUN, ['kigurumi', 'cosplay'], [], 'full_mascot', ['イチゴ', '着ぐるみ'], { g: 'object_mascot_suit', parts: { creature_motif: 'strawberry', mascot_head: 'merged_head_body', mascot_hands: 'round_mitt_gloves', mascot_feet: 'stubby_round_feet' }, mat: 'plush_fabric', fit: 'oversized', pal: ['strawberry_red', 'kelly_green'] }),
    P('hamburger_mascot', 'stage', 'ハンバーガーの完全マスコット', 'ごまのバンズと層を重ねた胴体', FUN, ['kigurumi', 'cosplay'], [], 'full_mascot', ['ハンバーガー', '着ぐるみ'], { g: 'object_mascot_suit', parts: { creature_motif: 'hamburger', mascot_head: 'oversized_round_head', mascot_body: 'layered_object_body', mascot_hands: 'cartoon_four_finger_gloves', mascot_feet: 'round_cartoon_shoes' }, mat: 'plush_fabric', fit: 'oversized', pal: ['caramel_brown', 'lime_green', 'cherry_red'] }),
    P('sushi_mascot', 'stage', 'にぎり寿司の完全マスコット', '魚の切り身をのせた頭部と白い胴体', FUN, ['kigurumi', 'cosplay'], [], 'full_mascot', ['寿司', '着ぐるみ'], { g: 'object_mascot_suit', parts: { creature_motif: 'sushi', mascot_head: 'merged_head_body', mascot_hands: 'round_mitt_gloves', mascot_feet: 'stubby_round_feet' }, mat: 'plush_fabric', fit: 'oversized', pal: ['snow_white', 'salmon_pink'] }),
    P('cupcake_mascot', 'stage', 'カップケーキの完全マスコット', '渦巻きクリームの頭部とプリーツカップの胴', FUN, ['kigurumi', 'cosplay'], ['birthday'], 'full_mascot', ['カップケーキ', '着ぐるみ'], { g: 'object_mascot_suit', parts: { creature_motif: 'cupcake', mascot_head: 'oversized_round_head', mascot_body: 'object_shaped_body', mascot_hands: 'round_mitt_gloves', mascot_feet: 'round_cartoon_shoes' }, mat: 'plush_fabric', fit: 'oversized', pal: ['pastel_pink', 'cream_yellow', 'cherry_red'], occasion: 'party' }),

    /* ---------- 着ぐるみ：動物のファッション再解釈 ---------- */
    P('zebra_tailored_suit', 'alternative', 'シマウマ縞のテーラード', '縦縞を織りで表したスーツ', ['クール'], K, [], 'reinterpretation', ['シマウマ', 'ゼブラ'], { g: 'business_suit', parts: { inner_shirt: 'dress_shirt', bottoms: 'fitted_trousers' }, mat: 'wool', fit: 'tailored', pal: ['jet_black', 'snow_white'], pat: ['zebra_stripe'] }),
    P('peacock_fan_gown', 'stage', 'クジャク扇パネルのイブニング', '羽根飾りと孔雀色のボールガウン', ['華やか', '上品'], K, [], 'reinterpretation', ['クジャク', '孔雀'], { g: 'ball_gown', world: 'fairy_tale', parts: { skirt_shape: 'full_skirt' }, mat: 'satin', fit: 'fitted', pal: ['peacock_blue', 'emerald_green', 'bright_gold'], deco: [['feather_trim', ['hem', 'shoulders'], 'many', 'focal']], occasion: 'ball' }),
    P('koi_wave_wrap', 'eastern', 'コイと波の和装', '波柄の創作和装と朱の差し色', ['上品', '華やか'], K, [], 'reinterpretation', ['鯉', 'コイ'], { g: 'modern_kimono_outfit', world: 'japanese', parts: { waist: 'obi' }, mat: 'silk', pal: ['snow_white', 'vermilion', 'jet_black'], pat: ['wave_pattern'] }),
    P('serpent_scale_techwear', 'alternative', 'ヘビ鱗のテックウェア', '鱗柄のフーディとカーゴパンツ', ['クール', 'ダーク'], K, [], 'reinterpretation', ['ヘビ', '蛇'], { g: 'hoodie_and_cargo', parts: { footwear: 'lace_up_boots' }, mat: 'nylon', pal: ['olive', 'jet_black'], pat: ['snake_scale_print'], style: 'techwear' }),
    P('butterfly_cape_dress', 'stage', 'チョウのプリーツケープドレス', '背中いっぱいのケープを羽に見立てたドレス', ['華やか', '神秘的'], K, [], 'reinterpretation', ['チョウ', '蝶'], { g: 'cocktail_dress', world: 'fairy_tale', parts: { cover_up: 'full_back_cape', construction_detail: 'pleated_panels' }, mat: 'organza', pal: ['royal_blue', 'jet_black', 'tangerine'] }),
    P('frog_rain_set', 'daily', 'カエルの雨具セット', '若草色のアノラックとレインブーツ', CUTE, K, [], 'reinterpretation', ['カエル', '雨'], { g: 'technical_anorak', parts: { footwear: 'rain_boots' }, mat: 'rubberized_fabric', pal: ['matcha_green', 'canary_yellow'] })
  ]);

  /* ---------- 既存プリセットへの横断タグ（IDと設計内容は変更しない） ---------- */
  var THEMES = {
    cosplay: 'maid_butler classic_maid gothic_maid short_cape_maid classic_bunny reverse_bunny fictional_police nun_style knight mage mermaid prince_idol circus_ringmaster cape_magician masquerade_gown sequin_stage_suit court_tailcoat three_piece_butler kimono_server lab_coat gakuran_student sailor_student',
    seasonal: 'winter_long_coat snow_winter_coat summer_linen',
    kigurumi: 'classic_bunny reverse_bunny'
  };
  var EVENTS = { winter: 'winter_long_coat snow_winter_coat', summer_beach: 'summer_linen', carnival: 'masquerade_gown' };
  var KTYPE = { classic_bunny: 'motif_accessory', reverse_bunny: 'motif_accessory' };
  /* ガチャ比較でA/B（既存で再現可能）と判定され、既存プリセットが対応する衣装名を検索語に加える。 */
  var GACHA_ALIASES = {"three_piece_butler":["スリーピーススーツ","ノーネクタイの三つ揃い"],"cafe_waistcoat":["ベストとシャツ","バーテンダー","仕立て屋のベスト"],"winter_long_coat":["チェスターコート","ニットとロングコート","長いウールコートとマフラー"],"court_tailcoat":["執事服","燕尾服","リージェンシーの燕尾"],"summer_linen":["リネンシャツ","落ち感のあるシャツとワイドスラックス"],"daily_casual":["パーカーのストリート","ハッカーの部屋着"],"techwear":["テックウェア"],"asymmetric_mode":["モードな黒装束"],"royalty":["王族の礼装"],"prince_half_cape":["マントの王子服"],"gothic_tailcoat":["吸血鬼の夜会服","ゴシックロングコート","仮面舞踏会の装い"],"gakuran_student":["詰襟の学生服風"],"mage":["魔術師のローブ"],"star_astronomer":["大魔導師の外套"],"ritual_priest":["高位聖職者の法衣"],"haori_student":["紋付袴","大正の書生"],"eastern_long_coat":["宮廷の華服"],"desert_traveler":["フード付きバーヌース"],"mafia_suit":["ホストのスーツ"],"pilot_flight":["パイロットスーツ","ディーゼルパンクの飛行服"],"lab_coat":["白衣","医師のスクラブ"],"florist_apron":["カフェエプロン"],"painter_workwear":["画家のスモック"],"sequin_stage_suit":["アイドルの衣装"],"circus_ringmaster":["サーカスの団長","サーカス団長"],"cape_magician":["奇術師の燕尾"],"dust_travel_clothes":["冒険者の旅装"],"clockwork_suit":["スチームパンクの機関士"],"snow_winter_coat":["毛皮の外套"],"silk_pajamas":["くつろぎの部屋着"],"classic_maid":["メイド服（ロング）"],"sailor_student":["ミニスカセーラー服"],"classic_bunny":["バニーボーイ"],"reverse_bunny":["逆バニー"],"qipao_style":["ミニスカチャイナ"],"fictional_police":["ミニスカポリス"],"dark_academia_coat":["ツイードのジャケット"]};
  function has(map, id) { return Object.keys(map).filter(function (k) { return map[k].split(' ').indexOf(id) >= 0; }); }
  D.presets.forEach(function (p) {
    if (!p.expansion) {
      if (!p.themeTags || !p.themeTags.length) p.themeTags = has(THEMES, p.id);
      if (!p.eventTags) p.eventTags = has(EVENTS, p.id);
      if (p.kigurumiType == null) p.kigurumiType = KTYPE[p.id] || null;
    }
    p.themeTags = p.themeTags || []; p.eventTags = p.eventTags || [];
    (GACHA_ALIASES[p.id] || []).forEach(function (a) { if ((p.searchAliases || []).indexOf(a) < 0) (p.searchAliases = p.searchAliases || []).push(a); });
  });
})(typeof window !== 'undefined' ? window : global);
