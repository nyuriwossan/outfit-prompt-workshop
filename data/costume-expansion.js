/* 衣装プロンプト工房 / data/costume-expansion.js
 * 衣装拡張（コスプレ・季節イベント・着ぐるみ）。
 *
 * 方針
 *   - 既存IDは削除・改名しない。追加だけを行う。
 *   - 独立した衣装構造があるものだけを基本衣装にする。色替え・行事名違いはプリセットへ回す
 *     （data/preset-themes.js）。
 *   - 着ぐるみは6種を分ける。
 *       1 動物モチーフ衣装 … 通常の服＋耳カチューシャ・飾り尾（headwear / decorations）
 *       2 動物フード衣装   … kigurumi カテゴリ（顔出しフードの上着）
 *       3 動物パジャマ     … kigurumi カテゴリ（顔出しフードの一体服）
 *       4 ぬいぐるみ風スーツ … kigurumi カテゴリ（顔出し・詰め物で体形を作る）
 *       5 完全マスコット   … full_mascot カテゴリ（頭部が頭全体を覆い、人の顔は見えない）
 *       6 ファッション再解釈 … 通常の基本衣装＋柄・装飾・主テーマ（プリセット）
 *   - 題材（ウサギ・サメ・イチゴ…）は共通スロット creature_motif の差分として扱い、
 *     題材ごとの専用システムは作らない。
 *   - 視界メッシュ・換気口は管理用の任意項目。明示選択したときだけ英語に出す。
 *   - 新しい部位は既存の parts（スロットレジストリ）に格納するため、保存schemaは 0.6 のまま。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  var D = CPW.data;
  function slot(id) { return D.partSlots.filter(function (s) { return s.id === id; })[0]; }
  function rows(list, keys) {
    return list.map(function (r) { var o = {}; keys.forEach(function (k, i) { if (r[i] !== undefined && r[i] !== null) o[k] = r[i]; }); return o; });
  }

  /* ============================================================
   * 1. 着ぐるみの題材（共通の構造化モチーフ）
   *    shortPrompt   … 名詞（"rabbit"）。衣装名のテンプレートへ差し込む。
   *    featureEn     … 顔出しフードに付く特徴（名詞を繰り返さない）
   *    mascotFeatureEn … マスコット頭部の特徴
   * ========================================================== */
  var CREATURES = rows([
    ['rabbit', 'ウサギ', 'rabbit', '動物', 'long upright ears', 'long upright ears and a round muzzle', ['animal']],
    ['cat', 'ネコ', 'cat', '動物', 'pointed ears', 'pointed ears and whisker markings', ['animal']],
    ['dog', 'イヌ', 'dog', '動物', 'floppy ears', 'floppy ears and a rounded snout', ['animal']],
    ['bear', 'クマ', 'bear', '動物', 'round ears', 'round ears and a broad muzzle', ['animal']],
    ['panda', 'パンダ', 'panda', '動物', 'round black ears and eye-patch markings', 'round black ears and eye-patch markings', ['animal']],
    ['fox', 'キツネ', 'fox', '動物', 'pointed ears and a pale muzzle trim', 'pointed ears and a slender snout', ['animal']],
    ['wolf', 'オオカミ', 'wolf', '動物', 'pointed ears', 'pointed ears and a long snout', ['animal']],
    ['tanuki', 'タヌキ', 'tanuki', '動物', 'small round ears and mask markings', 'small round ears and mask markings', ['animal']],
    ['red_panda', 'レッサーパンダ', 'red panda', '動物', 'round ears and white cheek markings', 'round ears and white cheek markings', ['animal']],
    ['sheep', 'ヒツジ', 'sheep', '動物', 'curled horns and a woolly trim', 'curled horns and a woolly crown', ['animal']],
    ['reindeer', 'トナカイ', 'reindeer', '動物', 'soft branching antlers', 'branching antlers and a round nose', ['animal', 'winter']],
    ['koala', 'コアラ', 'koala', '動物', 'large fluffy round ears', 'large fluffy ears and a big nose', ['animal']],
    ['capybara', 'カピバラ', 'capybara', '動物', 'small round ears and a blunt square snout', 'small round ears and a blunt square snout', ['animal']],
    ['otter', 'カワウソ', 'otter', '動物', 'small round ears and whiskers', 'small round ears and whiskers', ['animal']],
    ['elephant', 'ゾウ', 'elephant', '動物', 'large flat ears and a short trunk', 'large flat ears and a curled trunk', ['animal']],
    ['frog', 'カエル', 'frog', '動物', 'bulging eyes on top', 'bulging eyes and a wide smile line', ['animal']],
    ['chick', 'ヒヨコ', 'chick', '動物', 'a small beak and a feather tuft', 'a small beak and a feather tuft', ['animal']],
    ['shark', 'サメ', 'shark', '海の生き物', 'a dorsal fin and a stitched tooth row around the opening', 'a dorsal fin and a wide toothy grin', ['animal', 'sea']],
    ['penguin', 'ペンギン', 'penguin', '海の生き物', 'a small beak and a white face patch', 'a small beak and a white face patch', ['animal', 'sea']],
    ['axolotl', 'ウーパールーパー', 'axolotl', '海の生き物', 'feathery gill frills', 'feathery gill frills and a wide smile', ['animal', 'sea']],
    ['seal', 'アザラシ', 'seal', '海の生き物', 'whiskers and a round nose', 'whiskers and a round nose', ['animal', 'sea']],
    ['bumblebee', 'マルハナバチ', 'bumblebee', '虫・空想', 'short antennae', 'short antennae and round eyes', ['animal', 'insect']],
    ['dinosaur', '恐竜', 'dinosaur', '虫・空想', 'soft back spines', 'soft back spines and a wide jaw', ['animal', 'fantasy']],
    ['dragon', 'ドラゴン', 'dragon', '虫・空想', 'soft horns and a spined ridge', 'horns, a spined ridge, and a broad snout', ['fantasy']],
    ['unicorn', 'ユニコーン', 'unicorn', '虫・空想', 'a spiral horn and a plush mane', 'a spiral horn and a plush mane', ['fantasy']],
    ['strawberry', 'イチゴ', 'strawberry', '食べ物・季節', 'a leafy calyx crown and seed dots', 'a leafy calyx crown and seed dots', ['food']],
    ['pumpkin', 'カボチャ', 'pumpkin', '食べ物・季節', 'a curled stem and ribbed segments', 'a curled stem and ribbed segments', ['food', 'autumn']],
    ['hamburger', 'ハンバーガー', 'hamburger', '食べ物・季節', 'a sesame bun brim', 'a sesame bun top and layered fillings', ['food']],
    ['sushi', 'にぎり寿司', 'nigiri sushi', '食べ物・季節', 'a fish-slice topping', 'a fish-slice topping over a rice body', ['food']],
    ['cupcake', 'カップケーキ', 'cupcake', '食べ物・季節', 'a swirled frosting top', 'a swirled frosting top and a pleated cup', ['food']],
    ['snowman', '雪だるま', 'snowman', '食べ物・季節', 'a carrot nose and coal buttons', 'a carrot nose and a stacked snowball body', ['winter']]
  ], ['id', 'labelJa', 'shortPrompt', 'groupJa', 'featureEn', 'mascotFeatureEn', 'tags']);

  /* ============================================================
   * 2. 着ぐるみ・完全マスコット用の部位スロット
   *    英語は generator.js の blockCreature が題材と組み合わせて作る。
   *    "{c}" は題材名（rabbit）、"{f}" は題材の特徴（long upright ears）。
   * ========================================================== */
  var opt = function (list) { return rows(list, ['id', 'labelJa', 'shortPrompt', 'tags', 'noteJa']); };
  D.partSlots = D.partSlots.concat([
    { id: 'creature_motif', labelJa: '着ぐるみの題材', noteJa: '動物・食べ物などの題材です。耳や背びれなどの特徴は題材から自動で英語にします。', creatureSlot: true, options: CREATURES },
    { id: 'animal_hood', labelJa: '動物フード（顔出し）', creatureSlot: true, noteJa: '顔が見えるフードです。顔まで覆う頭部は「完全マスコット」の大分類で作ります。', options: opt([
      ['creature_feature_hood', '題材の特徴付きフード', 'open-face {c} hood with {f}', ['face_open', 'hood']],
      ['creature_face_hood', '顔の刺繍付きフード', 'open-face {c} hood with stitched eyes above the opening', ['face_open', 'hood']],
      ['small_ear_hood', '小さな耳だけのフード', 'open-face hood with small plush {c} ears', ['face_open', 'hood']],
      ['hood_worn_down', 'フードを下ろす', '{c} hood worn down', ['face_open']]
    ]) },
    { id: 'kigurumi_padding', labelJa: '詰め物・体形', creatureSlot: true, options: opt([
      ['no_padding', '詰め物なし（布一枚）', '', []],
      ['light_plush_body', '軽いふんわり詰め物', 'lightly padded plush body', ['padded']],
      ['rounded_belly_padding', '丸いお腹の詰め物', 'rounded padded belly', ['padded']],
      ['boxy_body_padding', '箱形の詰め物', 'boxy padded body', ['padded']]
    ]) },
    { id: 'kigurumi_hands', labelJa: '手元（着ぐるみ）', creatureSlot: true, options: opt([
      ['open_cuffs', '手は出す', '', []],
      ['attached_paw_mitts', '縫い付けの肉球ミトン', 'attached paw mitts', ['mitts']],
      ['fin_sleeve_ends', 'ひれ形の袖先', 'fin-shaped sleeve ends', ['mitts']],
      ['hoof_mitts', 'ひづめ形のミトン', 'hoof-shaped mitts', ['mitts']],
      ['wing_sleeves', '羽根形の袖', 'wing-shaped sleeves', []]
    ]) },
    { id: 'kigurumi_feet', labelJa: '足元（着ぐるみ）', creatureSlot: true, options: opt([
      ['open_ankle_hem', '足首まで（足は出す）', '', []],
      ['integrated_footies', '足先まで一体', 'integrated footies', ['footed']],
      ['paw_print_footies', '肉球付きの足先', 'footies with paw-print soles', ['footed']],
      ['paw_slippers', '別体の動物スリッパ', 'plush {c} slippers', ['footed']]
    ]) },
    { id: 'costume_tail', labelJa: '衣装の尾', creatureSlot: true, noteJa: '服に付いた布の尾です。身体から生える尾は「特殊パーツ」の尾で指定します。', options: opt([
      ['plush_tail', 'ぬいぐるみの尾', 'attached plush {c} tail', ['tail']],
      ['pom_pom_tail', 'ポンポンの尾', 'attached pom-pom tail', ['tail']],
      ['flat_fin_tail_panel', '平たい尾びれパネル', 'flat fin tail panel', ['tail']],
      ['soft_spiked_tail', 'トゲ付きの柔らかい尾', 'soft spiked plush tail', ['tail']]
    ]) },
    { id: 'mascot_head', labelJa: 'マスコット頭部', creatureSlot: true, noteJa: 'どの形でも、頭部は着用者の頭全体を覆い、人の顔は見えない構造として出力します。', options: opt([
      ['oversized_round_head', '大きな丸い頭', 'oversized rounded {c} mascot head with {f}', ['mascot_head']],
      ['sculpted_creature_head', '造形的な頭', 'sculpted {c} mascot head with {f}', ['mascot_head']],
      ['chibi_big_head', '頭身の低い特大頭', 'giant chibi-proportioned {c} mascot head with {f}', ['mascot_head']],
      ['merged_head_body', '頭と胴が一体の形', 'single {c}-shaped head-and-body form with {f}', ['mascot_head', 'merged']]
    ]) },
    { id: 'mascot_body', labelJa: 'マスコット胴体', creatureSlot: true, options: opt([
      ['padded_plush_body', '詰め物入りの胴体', 'padded plush mascot body', ['padded']],
      ['round_full_body', 'まんまるの胴体', 'round padded mascot body', ['padded']],
      ['slim_fur_body', '細身の毛並み胴体', 'slim fur-covered mascot body', []],
      ['object_shaped_body', '題材の形をした胴体', '{c}-shaped padded mascot body', ['padded']],
      ['layered_object_body', '層を重ねた胴体', 'layered {c}-shaped mascot body', ['padded']]
    ]) },
    { id: 'mascot_hands', labelJa: 'マスコットの手', creatureSlot: true, options: opt([
      ['paw_gloves', '大きな肉球手袋', 'oversized plush paw gloves', []],
      ['cartoon_four_finger_gloves', '4本指の漫画風手袋', 'four-fingered cartoon mascot gloves', []],
      ['flipper_hands', 'ひれの手', 'soft flipper hands', []],
      ['wing_flippers', '短い翼の手', 'stubby wing flippers', []],
      ['hoof_gloves', 'ひづめの手', 'hoof-shaped mascot gloves', []],
      ['round_mitt_gloves', '丸いミトン手袋', 'round mitten mascot gloves', []]
    ]) },
    { id: 'mascot_feet', labelJa: 'マスコットの足', creatureSlot: true, options: opt([
      ['oversized_paw_feet', '大きな肉球の足', 'oversized plush paw feet', []],
      ['round_cartoon_shoes', '丸い漫画風の靴', 'oversized round cartoon shoes', []],
      ['flipper_feet', '水かきの足', 'webbed flipper feet', []],
      ['clawed_feet', '爪のある足', 'chunky clawed mascot feet', []],
      ['hoof_boots', 'ひづめのブーツ', 'hoof-shaped mascot boots', []],
      ['stubby_round_feet', '短い丸足', 'stubby round mascot feet', []]
    ]) },
    { id: 'mascot_vision', labelJa: '視界・通気の見せ方', creatureSlot: true, noteJa: '既定では英語に出しません。メッシュや通気口を絵として見せたいときだけ選んでください。', options: opt([
      ['vision_hidden', '目立たせない（出力しない）', '', []],
      ['mesh_eyes', 'メッシュの目を見せる', 'mesh-screened mascot eyes', []],
      ['mouth_mesh', '口の奥のメッシュを見せる', 'dark mesh inside the open mascot mouth', []],
      ['ventilation_holes', '通気口を見せる', 'small ventilation holes on the mascot head', []]
    ]) }
  ]);
  D.creatureSlotIds = ['creature_motif', 'animal_hood', 'kigurumi_padding', 'kigurumi_hands', 'kigurumi_feet', 'costume_tail', 'mascot_head', 'mascot_body', 'mascot_hands', 'mascot_feet', 'mascot_vision'];

  /* ============================================================
   * 3. 既存スロットへの選択肢追加（耳カチューシャ・行事の帽子・靴）
   * ========================================================== */
  slot('headwear').options.push.apply(slot('headwear').options, rows([
    ['animal_ear_headband', '動物耳カチューシャ', 'plush animal-ear headband', ['animal_ears']],
    ['bunny_ear_headband', 'うさ耳カチューシャ', 'rabbit-ear headband', ['animal_ears', 'head_tall']],
    ['cat_ear_beanie', '猫耳ニット帽', 'cat-ear knit beanie', ['animal_ears', 'covered']],
    ['bear_ear_beret', 'クマ耳ベレー', 'bear-ear beret', ['animal_ears']],
    ['reindeer_antler_headband', 'トナカイ角カチューシャ', 'reindeer-antler headband', ['animal_ears', 'head_tall']],
    ['santa_hat', 'サンタ帽', 'fur-trimmed santa hat', ['covered']],
    ['witch_hat', '魔女帽', 'wide-brimmed pointed witch hat', ['head_tall', 'covered']],
    ['elf_cap', 'エルフ帽', 'pointed elf cap', ['covered']],
    ['tricorn_hat', '三角帽', 'tricorn hat', ['covered']],
    ['hachimaki', '鉢巻', 'hachimaki headband', []],
    ['flower_crown', '花冠', 'flower crown', ['ornate']],
    ['venetian_full_face_mask', 'ヴェネツィアの全面仮面', 'full-face Venetian bauta mask', ['face_covering']]
  ], ['id', 'labelJa', 'shortPrompt', 'tags']));
  slot('footwear').options.push.apply(slot('footwear').options, rows([
    ['geta', '下駄', 'geta sandals', ['traditional']],
    ['rain_boots', 'レインブーツ', 'rubber rain boots', ['boots']],
    ['snow_boots', 'スノーブーツ', 'insulated snow boots', ['boots']],
    ['ballet_slippers', 'バレエシューズ', 'ballet slippers', ['soft']],
    ['curled_toe_shoes', '先の反った靴', 'curled-toe shoes', ['fantasy']],
    ['fur_trimmed_boots', 'ファー縁のブーツ', 'fur-trimmed boots', ['boots']]
  ], ['id', 'labelJa', 'shortPrompt', 'tags']));

  /* 飾りとしての尾・行事の装飾。身体の尾（特殊パーツ）とは別物。 */
  D.decorations.push.apply(D.decorations, [
    { id: 'clip_on_plush_tail', prep: 'at', labelJa: '着脱式の飾り尾', shortPrompt: 'clip-on plush tail', detailedPrompt: 'clip-on plush tail', tags: ['cute', 'costume'], weight: 1, recommendedAttributes: [], recommendedPlacements: ['back', 'waist'], groupJa: '仮装・行事' },
    { id: 'pom_pom_tail', prep: 'at', labelJa: 'ポンポンの飾り尾', shortPrompt: 'pom-pom tail', detailedPrompt: 'round pom-pom tail', tags: ['cute', 'costume'], weight: 1, recommendedAttributes: [], recommendedPlacements: ['back', 'waist'], groupJa: '仮装・行事' },
    { id: 'holly_sprigs', prep: 'on', labelJa: 'ヒイラギの飾り', shortPrompt: 'holly sprigs', detailedPrompt: 'holly sprigs with red berries', tags: ['seasonal'], weight: 1, recommendedAttributes: [], recommendedPlacements: ['chest', 'head'], groupJa: '仮装・行事' },
    { id: 'heraldic_panels', uncountable: true, prep: 'on', labelJa: '抽象紋章のパネル', shortPrompt: 'abstract heraldic panels', detailedPrompt: 'abstract embroidered heraldic panels', tags: ['ornate', 'ceremonial'], weight: 2, recommendedAttributes: [], recommendedPlacements: ['chest', 'back'], groupJa: '仮装・行事' },
    { id: 'reflective_tape', uncountable: true, prep: 'around', labelJa: '反射テープ', shortPrompt: 'reflective safety tape', detailedPrompt: 'bands of reflective safety tape', tags: ['work'], weight: 1, recommendedAttributes: [], recommendedPlacements: ['sleeves', 'hem', 'chest'], groupJa: '仮装・行事' },
    { id: 'harlequin_diamonds', uncountable: true, prep: 'on', labelJa: '道化の菱形パネル', shortPrompt: 'harlequin diamond panels', detailedPrompt: 'pieced harlequin diamond panels', tags: ['stage'], weight: 2, recommendedAttributes: [], recommendedPlacements: ['overall'], groupJa: '仮装・行事' },
    { id: 'bone_print', uncountable: true, prep: 'on', labelJa: '骨格プリント', shortPrompt: 'skeleton bone print', detailedPrompt: 'printed skeleton bone graphics', tags: ['dark', 'costume'], weight: 2, recommendedAttributes: [], recommendedPlacements: ['overall'], groupJa: '仮装・行事' },
    { id: 'tanzaku_strips', prep: 'along', labelJa: '短冊飾り', shortPrompt: 'hanging tanzaku paper strips', detailedPrompt: 'hanging tanzaku paper strips', tags: ['seasonal', 'japanese'], weight: 1, recommendedAttributes: [], recommendedPlacements: ['hem', 'sleeves'], groupJa: '仮装・行事' }
  ]);

  D.patterns.push.apply(D.patterns, rows([
    ['zebra_stripe', 'ゼブラ柄', 'zebra stripe pattern', ['animal']],
    ['snake_scale_print', 'ヘビ鱗柄', 'snakeskin pattern', ['animal']],
    ['fair_isle', 'ノルディック柄', 'fair isle knit pattern', ['winter']],
    ['candy_cane_stripes', 'キャンディケイン縞', 'candy cane stripe pattern', ['seasonal']],
    ['harlequin_check', '道化の菱形柄', 'harlequin diamond pattern', ['stage']]
  ], ['id', 'labelJa', 'shortPrompt', 'tags']));

  /* 季節・行事の主テーマ。行事は「主テーマ（意匠）」として設計に入り、
   * プリセットの検索では eventTags（data/preset-themes.js）で探す。保存schemaは増やさない。 */
  D.motifGroups.push({ id: 'seasonal', labelJa: '季節・行事' });
  D.motifs.push.apply(D.motifs, [
    { id: 'christmas_holiday', themeAdjEn: 'Christmas', group: 'seasonal', labelJa: 'クリスマス', shortPrompt: 'Christmas holiday motifs', suggestedColors: ['deep_crimson', 'pine_green', 'snow_white', 'antique_gold'], suggestedGarments: [], suggestedParts: ['santa_hat'], suggestedMotifs: ['holly', 'snowflakes', 'bells'] },
    { id: 'halloween_night', themeAdjEn: 'Halloween', group: 'seasonal', labelJa: 'ハロウィン', shortPrompt: 'Halloween motifs', suggestedColors: ['burnt_orange', 'jet_black', 'grape_purple'], suggestedGarments: [], suggestedParts: ['witch_hat'], suggestedMotifs: ['pumpkins', 'bats', 'moons'] },
    { id: 'easter_spring', themeAdjEn: 'Easter', group: 'seasonal', labelJa: 'イースター', shortPrompt: 'Easter motifs', suggestedColors: ['pastel_pink', 'mint', 'cream_yellow', 'lilac'], suggestedGarments: [], suggestedParts: ['bonnet'], suggestedMotifs: ['eggs', 'rabbits', 'spring flowers'] },
    { id: 'valentine_hearts', themeAdjEn: 'Valentine', group: 'seasonal', labelJa: 'バレンタイン', shortPrompt: 'Valentine heart motifs', suggestedColors: ['cherry_red', 'pastel_pink', 'chocolate_brown'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['hearts', 'chocolate', 'ribbons'] },
    { id: 'tanabata_stars', themeAdjEn: 'Tanabata', group: 'seasonal', labelJa: '七夕', shortPrompt: 'Tanabata star festival motifs', suggestedColors: ['midnight_blue', 'snow_white', 'pale_gold'], suggestedGarments: ['wafuku'], suggestedParts: [], suggestedMotifs: ['paper strips', 'bamboo', 'stars'] },
    { id: 'summer_matsuri', themeAdjEn: 'summer-festival', group: 'seasonal', labelJa: '夏祭り', shortPrompt: 'Japanese summer festival motifs', suggestedColors: ['vermilion', 'deep_navy', 'snow_white'], suggestedGarments: ['wafuku'], suggestedParts: ['geta'], suggestedMotifs: ['fireworks', 'paper lanterns', 'goldfish'] },
    { id: 'harvest_festival', themeAdjEn: 'harvest-festival', group: 'seasonal', labelJa: '収穫祭', shortPrompt: 'harvest festival motifs', suggestedColors: ['burnt_orange', 'mustard_yellow', 'chestnut_brown'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['wheat', 'apples', 'autumn leaves'] },
    { id: 'new_year_shrine', themeAdjEn: 'New Year', group: 'seasonal', labelJa: 'お正月', shortPrompt: 'Japanese New Year motifs', suggestedColors: ['vermilion', 'snow_white', 'antique_gold'], suggestedGarments: ['wafuku'], suggestedParts: [], suggestedMotifs: ['pine', 'plum blossoms', 'cranes'] }
  ]);

  /* ============================================================
   * 4. 大分類：着ぐるみ（顔出し）／完全マスコット
   * ========================================================== */
  D.garmentCategories.push(
    {
      id: 'kigurumi', labelJa: '着ぐるみ・動物服（顔出し）',
      noteJa: '顔が見える動物フード・つなぎ・ぬいぐるみ風スーツです。頭全体を覆う着ぐるみは「完全マスコット」を選んでください。',
      slots: ['creature_motif', 'animal_hood', 'kigurumi_padding', 'kigurumi_hands', 'kigurumi_feet', 'costume_tail', 'closure', 'cuffs', 'legwear', 'footwear', 'handwear', 'headwear', 'construction_detail'],
      requiredSlots: ['creature_motif'],
      recommendedSlots: ['animal_hood', 'kigurumi_feet', 'costume_tail']
    },
    {
      /* 人魚と同じ考え方：頭・手・足をマスコット専用部位で置き換えるので、
       * 通常の headwear / handwear / footwear / legwear / 顔出しフードを slots に含めない。
       * 値は outfit.parts に残り（休止）、大分類を戻せば復帰する。 */
      id: 'full_mascot', labelJa: '完全マスコット（顔を覆う着ぐるみ）',
      noteJa: '頭部が着用者の頭全体を覆い、人の顔は見えません。通常の帽子・靴・手袋は使わず、マスコット専用の頭・胴・手・足で組み立てます。',
      slots: ['creature_motif', 'mascot_head', 'mascot_body', 'mascot_hands', 'mascot_feet', 'mascot_vision', 'costume_tail', 'cover_up', 'construction_detail'],
      requiredSlots: ['creature_motif'],
      recommendedSlots: ['mascot_head', 'mascot_body', 'mascot_hands', 'mascot_feet']
    }
  );

  /* ============================================================
   * 5. 基本衣装
   *    creatureShort / creatureDetailed … 題材があるときの核。"{c}" に題材名が入る。
   *    hasHood … 顔出しフードを標準で持つ（動物フード未選択でも題材のフードを出す）。
   *    specialStructure … 着ぐるみ系。コンセプトの汎用候補プールからは除外する。
   *    culturalNoteJa … 文化・史実に着想を得た衣装の注記（完全な再現を保証しない）。
   * ========================================================== */
  var CULTURE = '文化的な衣装に着想を得た創作です。特定地域の史実を完全に再現するものではありません。';
  var HISTORY = '史実の衣装に着想を得た創作です。時代考証の完全な再現を保証するものではありません。';
  function g(id, labelJa, category, shortPrompt, detailedPrompt, tags, worldviews, extra) {
    var o = { id: id, labelJa: labelJa, category: category, shortPrompt: shortPrompt, detailedPrompt: detailedPrompt, tags: tags, recommendedWorldviews: worldviews || ['modern'], layer: 'main', expansion: 'costume-2026-10' };
    Object.keys(extra || {}).forEach(function (k) { o[k] = extra[k]; });
    return o;
  }
  var NO_REQ = { requiredSlots: [] };
  D.garments.push.apply(D.garments, [
    /* --- 着ぐるみ（顔出し） --- */
    g('animal_onesie', '動物パジャマつなぎ', 'kigurumi', 'animal pajama onesie', 'a hooded one-piece animal pajama onesie with a front zipper', ['cozy', 'costume', 'kigurumi'], ['modern'], { creatureShort: '{c} pajama onesie', creatureDetailed: 'a hooded one-piece {c} pajama onesie with a front zipper', hasHood: true, specialStructure: 'kigurumi', kigurumiType: 'onesie' }),
    g('plush_padded_suit', 'ぬいぐるみ風スーツ（顔出し）', 'kigurumi', 'plush padded costume suit', 'a face-out plush padded costume suit with a rounded stuffed body', ['cozy', 'costume', 'kigurumi'], ['modern', 'fairy_tale'], { creatureShort: 'plush padded {c} costume suit', creatureDetailed: 'a face-out plush padded {c} costume suit with a rounded stuffed body', hasHood: true, specialStructure: 'kigurumi', kigurumiType: 'plush_suit' }),
    g('animal_hood_jacket', '動物フードジャケット＋パンツ', 'kigurumi', 'animal-hood jacket and pants', 'a zip-up jacket with a character hood, worn with matching pants', ['casual', 'costume', 'kigurumi'], ['modern'], { creatureShort: '{c}-hood jacket and pants', creatureDetailed: 'a zip-up {c}-hood jacket worn with matching pants', hasHood: true, specialStructure: 'kigurumi', kigurumiType: 'animal_hood' }),
    g('animal_hood_poncho', '動物フードポンチョ', 'kigurumi', 'animal-hood poncho', 'a loose front-snap poncho with a character hood', ['casual', 'costume', 'kigurumi'], ['modern'], { creatureShort: '{c}-hood poncho', creatureDetailed: 'a loose front-snap {c}-hood poncho', hasHood: true, specialStructure: 'kigurumi', kigurumiType: 'animal_hood' }),
    g('animal_hood_capelet', '動物フードケープ', 'kigurumi', 'animal-hood capelet', 'a short hooded capelet with a character hood', ['cute', 'costume', 'kigurumi'], ['modern', 'fairy_tale'], { creatureShort: '{c}-hood capelet', creatureDetailed: 'a short {c}-hood capelet', hasHood: true, specialStructure: 'kigurumi', kigurumiType: 'animal_hood' }),
    g('animal_hood_cardigan', '動物フードカーディガン', 'kigurumi', 'animal-hood cardigan', 'a soft knit cardigan with a character hood', ['soft', 'costume', 'kigurumi'], ['modern'], { creatureShort: '{c}-hood cardigan', creatureDetailed: 'a soft knit {c}-hood cardigan', hasHood: true, specialStructure: 'kigurumi', kigurumiType: 'animal_hood' }),
    g('creature_sack_tunic', '袋形の動物チュニック', 'kigurumi', 'creature sack tunic', 'a loose sack-shaped costume tunic with arm openings', ['costume', 'kigurumi'], ['modern', 'fairy_tale'], { creatureShort: '{c} sack tunic', creatureDetailed: 'a loose sack-shaped {c} costume tunic with a face panel and arm openings', specialStructure: 'kigurumi', kigurumiType: 'onesie' }),

    /* --- 完全マスコット --- */
    g('full_mascot_suit', '完全マスコットスーツ', 'full_mascot', 'full-body mascot costume', 'a full-body mascot costume with a separate oversized character head', ['costume', 'mascot'], ['modern', 'fairy_tale'], { creatureShort: '{c} mascot costume', creatureDetailed: 'a full-body {c} mascot costume with a separate oversized character head', specialStructure: 'full_mascot', kigurumiType: 'full_mascot' }),
    g('object_mascot_suit', '物体型マスコットスーツ', 'full_mascot', 'object-shaped mascot costume', 'a full-body mascot costume shaped as one rounded object', ['costume', 'mascot'], ['modern', 'fairy_tale'], { creatureShort: '{c}-shaped mascot costume', creatureDetailed: 'a full-body {c}-shaped mascot costume built as one rounded form', specialStructure: 'full_mascot', kigurumiType: 'full_mascot' }),

    /* --- トップス＋ボトムス --- */
    g('bib_overalls', 'オーバーオール', 'top_bottom', 'bib overalls', 'bib overalls with shoulder straps worn over a simple shirt', ['casual', 'work', 'daily'], ['modern', 'fairy_tale'], { plural: true }),
    g('lederhosen_set', 'レーダーホーゼンセット', 'top_bottom', 'lederhosen outfit', 'leather lederhosen with embroidered suspenders worn over a linen shirt', ['traditional', 'festival'], ['modern', 'historical_western'], { culturalNoteJa: CULTURE, plural: true }),
    g('elf_tunic_tights', 'エルフのチュニック＋タイツ', 'top_bottom', 'elf tunic and tights', 'a belted elf tunic with a pointed jagged hem worn over fitted tights', ['costume', 'fantasy', 'festival'], ['fairy_tale', 'western_fantasy']),
    g('puffer_snow_bib_set', 'ダウンジャケット＋スノービブ', 'top_bottom', 'puffer jacket and snow bibs', 'a quilted puffer jacket worn over insulated snow bib pants', ['winter', 'sporty', 'functional'], ['modern']),
    g('biker_jacket_set', 'ライダースジャケットセット', 'top_bottom', 'biker jacket outfit', 'an asymmetric-zip leather biker jacket worn over a plain tee with slim jeans', ['street', 'casual'], ['modern', 'urban_fantasy']),
    g('denim_jacket_set', 'デニムジャケットセット', 'top_bottom', 'denim jacket outfit', 'a classic denim trucker jacket worn over a plain tee with jeans', ['casual', 'daily'], ['modern']),
    g('bomber_jacket_set', 'ボンバージャケットセット', 'top_bottom', 'bomber jacket outfit', 'a ribbed-hem bomber jacket worn with tapered trousers', ['casual', 'street'], ['modern', 'sci_fi']),
    g('track_suit', 'トラックスーツ', 'top_bottom', 'track suit', 'a zip-up track jacket with matching track pants', ['sporty', 'casual'], ['modern']),
    g('martial_arts_gi', '武道着', 'top_bottom', 'martial arts gi', 'a wrap-front martial arts gi jacket with a cloth belt and loose trousers', ['traditional', 'sporty'], ['modern', 'japanese'], { culturalNoteJa: CULTURE }),
    g('cycling_kit', 'サイクルジャージ＋ビブショーツ', 'top_bottom', 'cycling jersey and bib shorts', 'a fitted zip cycling jersey worn with padded bib shorts', ['sporty', 'fitted'], ['modern']),
    g('kilt_set', 'キルトの装い', 'top_bottom', 'kilt outfit', 'a pleated wrap kilt worn with a shirt, kilt hose, and a front sporran', ['traditional'], ['historical_western', 'modern'], { culturalNoteJa: CULTURE }),
    g('kebaya_sarong', 'クバヤ＋サロン', 'top_bottom', 'kebaya and sarong', 'a fitted kebaya blouse with lace edges worn with a wrapped batik sarong', ['traditional', 'ornate'], ['modern'], { culturalNoteJa: CULTURE }),
    g('guayabera_set', 'グアヤベラシャツの装い', 'top_bottom', 'guayabera shirt outfit', 'a pleated four-pocket guayabera shirt worn with light trousers', ['traditional', 'resort'], ['modern'], { culturalNoteJa: CULTURE }),
    g('kurta_set', 'クルタ＋パンツ', 'top_bottom', 'kurta set', 'a long kurta tunic with side slits worn with straight trousers', ['traditional'], ['modern'], { culturalNoteJa: CULTURE }),
    g('cheerleader_uniform', 'チアリーダー衣装', 'top_bottom', 'cheerleader uniform', 'a fitted cheerleader shell top with a pleated skirt', ['sporty', 'stage', 'costume'], ['modern']),
    g('utility_romper', 'ユーティリティロンパース', 'top_bottom', 'utility romper', 'a short-sleeved one-piece utility romper with patch pockets', ['casual', 'resort'], ['modern'], NO_REQ),
    g('stage_unitard', 'ステージユニタード', 'top_bottom', 'stage unitard', 'a one-piece stretch performance unitard', ['stage', 'fitted'], ['modern', 'fairy_tale']),
    g('costume_jumpsuit', '仮装ジャンプスーツ', 'top_bottom', 'costume jumpsuit', 'a one-piece zip-back costume jumpsuit', ['stage', 'costume'], ['modern', 'fairy_tale']),
    g('tabard_tunic', 'タバード＋チュニック', 'top_bottom', 'tabard over tunic', 'a short open-sided T-shaped tabard worn over a plain tunic and trousers', ['fantasy', 'ceremonial', 'costume'], ['western_fantasy', 'historical_western']),

    /* --- ドレス --- */
    g('dirndl', 'ディアンドル', 'dress', 'dirndl', 'a dirndl with a laced fitted bodice, a puff-sleeved blouse, and a gathered apron skirt', ['traditional', 'festival'], ['modern', 'historical_western'], { culturalNoteJa: CULTURE }),
    g('witch_coat_dress', '魔女のコートドレス', 'dress', 'witch coat dress', 'a fitted long-sleeved coat dress with a high collar and a flared skirt', ['dark', 'costume', 'fantasy'], ['western_fantasy', 'dark_fantasy']),
    g('wrap_dress', 'ラップドレス', 'dress', 'wrap dress', 'a wrap dress with an overlapping front and a tie waist', ['daily', 'soft'], ['modern']),
    g('classical_tutu', 'クラシックチュチュ', 'dress', 'classical ballet tutu', 'a fitted ballet bodice with a flat layered platter tutu', ['stage', 'ornate'], ['modern', 'fairy_tale']),
    g('pannier_court_gown', 'パニエのコートガウン', 'dress', 'pannier court gown', 'a court gown with wide side panniers, a stomacher bodice, and a pleated back drape', ['ornate', 'historical', 'formal'], ['historical_western'], { culturalNoteJa: HISTORY }),
    g('pinafore_dress', 'ピナフォアドレス', 'dress', 'pinafore dress', 'a pinafore dress worn over a puff-sleeved blouse', ['cute', 'daily'], ['modern', 'fairy_tale']),
    g('mod_shift_dress', 'シフトドレス', 'dress', 'mod shift dress', 'a short A-line mod shift dress', ['retro'], ['modern']),
    g('nurse_dress', 'ナース風ワンピース', 'dress', 'nurse-style dress', 'a button-front nurse-style dress with a white apron panel', ['uniform', 'costume'], ['modern']),

    /* --- スーツ・制服 --- */
    g('santa_suit', 'サンタ衣装', 'uniform', 'santa suit', 'a fur-trimmed santa jacket and trousers with a wide black belt', ['costume', 'festival', 'winter'], ['modern', 'fairy_tale']),
    g('marching_band_uniform', 'マーチングバンド制服', 'uniform', 'marching band uniform', 'a marching band uniform with a braided front, shoulder cords, and a stand collar', ['stage', 'structured', 'ornate'], ['modern', 'fairy_tale']),
    g('tuxedo', 'タキシード', 'uniform', 'tuxedo', 'a satin-lapel tuxedo with a bow tie and a pleated dress shirt', ['formal', 'structured'], ['modern']),
    g('frock_coat_suit', 'フロックコートの装い', 'uniform', 'frock coat suit', 'a knee-length frock coat worn with a waistcoat and narrow trousers', ['classic', 'structured', 'historical'], ['historical_western', 'dark_fantasy']),
    g('pastry_chef_uniform', 'パティシエ制服', 'uniform', 'pastry chef uniform', 'a double-breasted pastry chef jacket with a short apron', ['work', 'uniform'], ['modern']),
    g('scrub_suit', 'スクラブ', 'uniform', 'scrub suit', 'a V-neck scrub top and drawstring scrub pants', ['work', 'uniform'], ['modern'], NO_REQ),
    g('firefighter_turnout', '消防ターンアウトギア', 'uniform', 'firefighter turnout suit', 'a firefighter turnout coat and trousers with reflective bands', ['work', 'functional'], ['modern'], NO_REQ),
    g('sealed_hazmat_suit', '密閉型防護服', 'uniform', 'sealed hazmat suit', 'a sealed full-body hazmat suit with an integrated hood and a clear face visor', ['work', 'functional'], ['modern', 'sci_fi', 'post_apocalypse'], NO_REQ),
    g('ski_race_suit', 'スキーレーシングスーツ', 'uniform', 'ski racing suit', 'a one-piece aerodynamic ski racing suit', ['sporty', 'fitted'], ['modern'], NO_REQ),
    g('fencing_uniform', 'フェンシングウェア', 'uniform', 'fencing uniform', 'a white fencing jacket with a side closure and fitted fencing breeches', ['sporty', 'structured'], ['modern']),
    g('high_visibility_workwear', '高視認性作業服', 'uniform', 'high-visibility work outfit', 'a high-visibility work jacket and trousers with reflective tape', ['work', 'functional'], ['modern'], NO_REQ),
    g('quilted_gambeson', 'キルティング胴着（ガンベゾン）', 'uniform', 'quilted gambeson', 'a thick quilted gambeson with a high collar worn over a tunic', ['functional', 'battle', 'historical'], ['western_fantasy', 'historical_western']),
    g('lamellar_armor_set', 'ラメラーアーマー', 'uniform', 'lamellar armor outfit', 'a lamellar cuirass laced from small plates over a padded tunic', ['battle', 'structured'], ['western_fantasy', 'mythic_world']),
    g('chainmail_tunic', 'チェーンメイルのチュニック', 'uniform', 'chainmail tunic', 'a chainmail tunic worn over a padded undershirt', ['battle', 'functional'], ['western_fantasy', 'historical_western']),
    g('doublet_and_hose', 'ダブレット＋トランクホーズ', 'uniform', 'doublet and trunk hose', 'a padded doublet worn with puffed trunk hose and fitted hose', ['historical', 'ornate'], ['historical_western'], { culturalNoteJa: HISTORY, requiredSlots: [] }),
    g('cooling_undersuit', '冷却チューブの宇宙アンダースーツ', 'uniform', 'cooling-tube undersuit', 'a fitted space undersuit lined with visible cooling tubes', ['sci_fi', 'fitted'], ['sci_fi'], NO_REQ),
    g('pressure_suit', '環状関節の圧力スーツ', 'uniform', 'pressure suit', 'a segmented pressure suit with ring joints and a hard torso shell', ['sci_fi', 'structured'], ['sci_fi', 'retro_future'], NO_REQ),
    g('beekeeping_suit', '養蜂作業着', 'uniform', 'beekeeping suit', 'a loose beekeeping suit with a veiled mesh hood and elastic cuffs', ['work', 'functional'], ['modern', 'fairy_tale'], NO_REQ),
    g('blacksmith_workwear', '鍛冶の作業着', 'uniform', 'blacksmith work outfit', 'a canvas work tunic under a long split leather apron with gaiters', ['work', 'functional'], ['western_fantasy', 'historical_western']),
    g('sherwani', 'シェルワニ', 'uniform', 'sherwani', 'a long fitted sherwani coat with a stand collar worn over slim trousers', ['traditional', 'formal'], ['modern'], { culturalNoteJa: CULTURE }),

    /* --- ローブ・コート --- */
    g('venetian_carnival_cloak', 'ヴェネツィアの仮面祭クローク', 'robe', 'Venetian carnival cloak', 'a black Venetian tabarro cloak with a short shoulder cape and a lace hood', ['costume', 'dark', 'historical'], ['historical_western'], { culturalNoteJa: CULTURE }),
    g('choir_robe', '聖歌隊ローブ', 'robe', 'choir robe with surplice', 'a long cassock-style choir robe under a white surplice', ['sacred', 'covered'], ['modern', 'historical_western']),
    g('cassock', 'カソック', 'robe', 'cassock', 'a long button-front cassock with a standing clerical collar', ['sacred', 'covered'], ['modern', 'dark_fantasy']),
    g('deel', 'デール', 'robe', 'deel', 'a deel robe with a curved side-fastening front and a wide sash', ['traditional'], ['modern', 'desert_fantasy'], { culturalNoteJa: CULTURE }),
    g('boubou', 'ブーブー', 'robe', 'boubou', 'a wide flowing boubou robe with an embroidered neckline', ['traditional', 'flowing'], ['modern'], { culturalNoteJa: CULTURE }),
    g('chiton_himation', 'キトン＋ヒマティオン', 'robe', 'chiton and himation', 'a pinned draped chiton under a wrapped himation mantle', ['draped', 'historical'], ['mythic_world', 'historical_western'], { culturalNoteJa: HISTORY }),
    g('houppelande', 'ウップランド', 'robe', 'houppelande', 'a voluminous belted houppelande with long dagged sleeves', ['historical', 'flowing'], ['historical_western'], { culturalNoteJa: HISTORY }),
    g('hooded_bathrobe', 'フード付きバスローブ', 'robe', 'hooded bathrobe', 'a hooded terry bathrobe with a tie belt', ['cozy', 'soft'], ['modern']),
    g('towel_change_poncho', 'タオル地の着替えポンチョ', 'robe', 'hooded towel poncho', 'a loose hooded terry towel poncho', ['cozy', 'resort'], ['modern'], NO_REQ),
    g('technical_anorak', 'テクニカルアノラック', 'robe', 'technical anorak', 'a pullover technical anorak with a half-zip and an integrated hood', ['functional', 'street'], ['modern', 'sci_fi']),
    g('fishtail_parka', 'モッズパーカ', 'robe', 'fishtail parka', 'a military fishtail parka with a drawcord waist and a split tail hem', ['casual', 'street'], ['modern']),
    g('woven_poncho', '織りのポンチョ', 'robe', 'woven poncho', 'a woven wool poncho with striped borders and fringe', ['traditional', 'travel'], ['modern', 'desert_fantasy'], { culturalNoteJa: CULTURE, requiredSlots: [] }),

    /* --- 和装 --- */
    g('happi_coat', '法被', 'wafuku', 'happi coat', 'a straight-sleeved happi coat with a crest-printed back and a sash', ['traditional', 'festival'], ['japanese', 'modern'], { culturalNoteJa: CULTURE }),
    g('jinbei', '甚平', 'wafuku', 'jinbei', 'a jinbei set with a tie-front short-sleeved top and matching shorts', ['traditional', 'summer'], ['japanese', 'modern'], { culturalNoteJa: CULTURE }),
    g('furisode', '振袖', 'wafuku', 'furisode', 'a furisode kimono with long swinging sleeves and a wide obi', ['traditional', 'formal'], ['japanese'], { culturalNoteJa: CULTURE }),
    g('miko_outfit', '巫女装束', 'wafuku', 'shrine maiden outfit', 'a white kosode with a red hakama and a sheer chihaya overlayer', ['traditional', 'sacred'], ['japanese'], { culturalNoteJa: CULTURE }),
    g('kariginu', '狩衣', 'wafuku', 'kariginu', 'a layered kariginu hunting robe with wide open sleeves over sashinuki trousers', ['traditional', 'historical'], ['japanese'], { culturalNoteJa: HISTORY }),
    g('shinobi_outfit', '忍装束', 'wafuku', 'shinobi outfit', 'a fitted shinobi outfit with a wrap top, tapered trousers, and shin wraps', ['traditional', 'battle'], ['japanese'], { culturalNoteJa: CULTURE }),

    /* --- 水着 --- */
    g('full_wetsuit', 'フルウェットスーツ', 'swimwear', 'full wetsuit', 'a long-sleeved full-length neoprene wetsuit with a back zipper', ['swim', 'sporty', 'covered'], ['modern'], NO_REQ)
  ]);

  /* 大分類ごとの案内（基本衣装の項目に表示） */
  CPW.garmentCategoryNoteJa = function (catId) {
    var c = D.garmentCategories.filter(function (x) { return x.id === catId; })[0];
    return c && c.noteJa ? c.noteJa : null;
  };
})(typeof window !== 'undefined' ? window : global);
