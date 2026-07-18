/* 衣装プロンプト工房 / data/motifs.js
 * モチーフ。固有キャラクターの再現ではなく、物語要素を分解した創作用の着想として扱う（13.1）。
 * 神話・文化系は noteJa に「創作衣装用の着想」である旨を持たせ、UIで明示する（13.3）。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  CPW.data.motifGroups = [
    { id: 'fairy_tale', labelJa: '童話' },
    { id: 'zodiac', labelJa: '星座' },
    { id: 'mythology', labelJa: '神話' },
    { id: 'sacred', labelJa: '聖・魔' },
    { id: 'design', labelJa: '意匠' }
  ];

  var NOTE_CULTURE = '文化・神話の意匠を断定的に再現するものではなく、創作衣装用の着想として扱う。';

  CPW.data.motifs = [
    // 童話（13.1）
    { id: 'red_hood_forest', themeAdjEn: 'fairy-tale', group: 'fairy_tale', labelJa: '赤いフードと森', shortPrompt: 'red hood and forest motifs', suggestedColors: ['deep_crimson', 'forest_green', 'warm_brown'], suggestedGarments: ['robe'], suggestedParts: ['hood', 'lace_up_boots'], suggestedMotifs: ['forest', 'wolf', 'basket', 'wildflowers'] },
    { id: 'sea_and_mermaid', themeAdjEn: 'sea-and-mermaid', group: 'fairy_tale', labelJa: '海と人魚', shortPrompt: 'sea and mermaid motifs', suggestedColors: ['teal', 'pale_cyan', 'pearl_white'], suggestedGarments: ['dress'], suggestedParts: ['mermaid_skirt'], suggestedMotifs: ['scales', 'pearls', 'coral', 'foam'] },
    { id: 'glass_and_ball', themeAdjEn: 'ballroom fairy-tale', group: 'fairy_tale', labelJa: 'ガラスと舞踏会', shortPrompt: 'glass and ballroom motifs', suggestedColors: ['ice_blue', 'pearl_white', 'polished_silver'], suggestedGarments: ['ball_gown'], suggestedParts: ['heeled_pumps'], suggestedMotifs: ['glass', 'clock', 'carriage'] },
    { id: 'sleep_and_roses', themeAdjEn: 'rose-and-slumber', group: 'fairy_tale', labelJa: '眠りと薔薇', shortPrompt: 'slumber and rose motifs', suggestedColors: ['rose_red', 'forest_green', 'antique_gold'], suggestedGarments: ['dress'], suggestedParts: [], suggestedMotifs: ['roses', 'thorns', 'spindle'] },
    { id: 'clock_and_cards', themeAdjEn: 'wonderland-inspired', group: 'fairy_tale', labelJa: '時計とトランプ', shortPrompt: 'clock and playing card motifs', suggestedColors: ['jet_black', 'deep_crimson', 'pure_white'], suggestedGarments: ['dress'], suggestedParts: [], suggestedMotifs: ['clock', 'cards', 'keys', 'checkerboard'] },
    { id: 'sweets_and_witch', themeAdjEn: 'confectionery fairy-tale', group: 'fairy_tale', labelJa: '菓子と魔女', shortPrompt: 'confectionery and witch motifs', suggestedColors: ['warm_brown', 'blush_pink', 'jet_black'], suggestedGarments: ['dress'], suggestedParts: [], suggestedMotifs: ['candy', 'gingerbread', 'cauldron'] },

    // 星座（13.2 代表）
    { id: 'gemini', group: 'zodiac', labelJa: '双子座', shortPrompt: 'gemini motifs', suggestedColors: ['pale_cyan', 'polished_silver', 'pure_white'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['mirrored symmetry', 'paired ornaments'] },
    { id: 'leo', group: 'zodiac', labelJa: '獅子座', shortPrompt: 'leo motifs', suggestedColors: ['antique_gold', 'amber_orange', 'deep_crimson'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['sun', 'mane-like ruff', 'royal ornaments'] },
    { id: 'libra', group: 'zodiac', labelJa: '天秤座', shortPrompt: 'libra motifs', suggestedColors: ['pearl_white', 'antique_gold', 'dusty_lavender'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['balance scales', 'symmetry', 'fine chains'] },
    { id: 'scorpio', group: 'zodiac', labelJa: '蠍座', shortPrompt: 'scorpio motifs', suggestedColors: ['jet_black', 'deep_crimson', 'oxidized_silver'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['tail-like trailing ornament', 'sharp angles'] },
    { id: 'aquarius', group: 'zodiac', labelJa: '水瓶座', shortPrompt: 'aquarius motifs', suggestedColors: ['pale_cyan', 'polished_silver', 'ice_blue'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['flowing fabric', 'urn', 'waves'] },
    { id: 'pisces', group: 'zodiac', labelJa: '魚座', shortPrompt: 'pisces motifs', suggestedColors: ['teal', 'pearl_white', 'pale_cyan'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['paired fish', 'pearls', 'soft curves'] },
    { id: 'starry_sky', themeAdjEn: 'starlit', group: 'zodiac', labelJa: '汎用星空', shortPrompt: 'starry sky motifs', suggestedColors: ['deep_navy', 'polished_silver', 'pale_gold'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['stars', 'constellations'] },
    { id: 'moon', themeAdjEn: 'lunar', group: 'zodiac', labelJa: '月', shortPrompt: 'lunar motifs', suggestedColors: ['pearl_white', 'polished_silver', 'deep_navy'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['crescent', 'moonlight'] },
    { id: 'sun', themeAdjEn: 'solar', group: 'zodiac', labelJa: '太陽', shortPrompt: 'solar motifs', suggestedColors: ['pale_gold', 'antique_gold', 'vermilion'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['rays', 'solar disc'] },

    // 神話（13.3）
    { id: 'japanese_mythology', themeAdjEn: 'Japanese mythology-inspired', group: 'mythology', labelJa: '日本神話', shortPrompt: 'japanese mythological motifs', noteJa: NOTE_CULTURE, suggestedColors: ['pure_white', 'antique_gold', 'vermilion', 'deep_navy'], suggestedGarments: ['kimono'], suggestedParts: ['obi'], suggestedMotifs: ['mirror', 'magatama', 'crest-like emblem', 'celestial drapery'] },
    { id: 'norse_mythology', themeAdjEn: 'Norse mythology-inspired', group: 'mythology', labelJa: '北欧神話', shortPrompt: 'norse mythological motifs', noteJa: NOTE_CULTURE, suggestedColors: ['polished_silver', 'jet_black', 'forest_green', 'ice_blue'], suggestedGarments: ['long_coat'], suggestedParts: [], suggestedMotifs: ['runes', 'fur', 'world tree', 'wolf', 'raven'] },
    { id: 'greek_mythology', themeAdjEn: 'Greek mythology-inspired', group: 'mythology', labelJa: 'ギリシャ神話', shortPrompt: 'greek mythological motifs', noteJa: NOTE_CULTURE, suggestedColors: ['pure_white', 'pale_gold', 'deep_navy'], suggestedGarments: ['ball_gown'], suggestedParts: [], suggestedMotifs: ['classical drapery', 'laurel wreath', 'lightning', 'temple patterning'] },

    // 聖・魔
    { id: 'angel', themeAdjEn: 'angelic', group: 'sacred', labelJa: '天使', shortPrompt: 'angelic motifs', suggestedColors: ['pure_white', 'pale_gold', 'pearl_white'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['feathered wings', 'halo', 'radiance'] },
    { id: 'fallen_angel', themeAdjEn: 'fallen-angel', group: 'sacred', labelJa: '堕天使', shortPrompt: 'fallen angel motifs', suggestedColors: ['jet_black', 'ash_gray', 'oxidized_silver'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['black feathers', 'broken halo', 'torn drapery'] },
    { id: 'demon', themeAdjEn: 'demonic', group: 'sacred', labelJa: '悪魔', shortPrompt: 'demonic motifs', suggestedColors: ['jet_black', 'deep_crimson', 'royal_purple'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['horns', 'bat wings', 'tail', 'arcane sigils'] },

    // 星座（Phase 5B 前半：黄道十二星座の補完）
    { id: 'aries', group: 'zodiac', labelJa: '牡羊座', shortPrompt: 'aries motifs', suggestedColors: ['scarlet', 'bright_gold', 'jet_black'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['ram horns', 'flame accents', 'bold angles'] },
    { id: 'taurus', group: 'zodiac', labelJa: '牡牛座', shortPrompt: 'taurus motifs', suggestedColors: ['forest_green', 'warm_brown', 'gold_ochre'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['bull horns', 'earthy textures', 'sturdy silhouettes'] },
    { id: 'cancer', group: 'zodiac', labelJa: '蟹座', shortPrompt: 'cancer motifs', suggestedColors: ['pearl_white', 'polished_silver', 'lagoon_blue'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['crescent shell', 'protective layers', 'moonlit tones'] },
    { id: 'virgo', group: 'zodiac', labelJa: '乙女座', shortPrompt: 'virgo motifs', suggestedColors: ['warm_ivory', 'sage_green', 'pale_gold'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['wheat sheaf', 'clean drapery', 'delicate embroidery'] },
    { id: 'sagittarius', group: 'zodiac', labelJa: '射手座', shortPrompt: 'sagittarius motifs', suggestedColors: ['royal_purple', 'bright_gold', 'midnight_blue'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['arrow ornaments', 'travel gear', 'sweeping lines'] },
    { id: 'capricorn', group: 'zodiac', labelJa: '山羊座', shortPrompt: 'capricorn motifs', suggestedColors: ['charcoal_gray', 'pine_green', 'oxidized_silver'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['goat horns', 'mountain textures', 'structured layers'] },

    // 神話（Phase 5B 前半：追加）
    { id: 'chinese_mythology', themeAdjEn: 'Chinese mythology-inspired', group: 'mythology', labelJa: '中国神話', shortPrompt: 'chinese mythological motifs', noteJa: NOTE_CULTURE, suggestedColors: ['vermilion', 'bright_gold', 'jade', 'ink_black'], suggestedGarments: ['hanfu'], suggestedParts: [], suggestedMotifs: ['dragon', 'phoenix', 'cloud scrolls', 'jade ornaments'] },
    { id: 'egyptian_mythology', themeAdjEn: 'Egyptian mythology-inspired', group: 'mythology', labelJa: 'エジプト神話', shortPrompt: 'egyptian mythological motifs', noteJa: NOTE_CULTURE, suggestedColors: ['bright_gold', 'lapis_blue', 'pure_white', 'turquoise'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['scarab', 'eye emblem', 'pleated linen', 'broad collar'] },
    { id: 'celtic_mythology', themeAdjEn: 'Celtic mythology-inspired', group: 'mythology', labelJa: 'ケルト神話', shortPrompt: 'celtic mythological motifs', noteJa: NOTE_CULTURE, suggestedColors: ['forest_green', 'bronze_metal', 'chalk_white', 'moss_green'], suggestedGarments: ['robe'], suggestedParts: [], suggestedMotifs: ['interlaced knots', 'spiral patterns', 'torc-like ornament', 'oak leaves'] },
    { id: 'dragon_and_phoenix', themeAdjEn: 'dragon-and-phoenix', group: 'mythology', labelJa: '竜と鳳凰', shortPrompt: 'dragon and phoenix motifs', noteJa: NOTE_CULTURE, suggestedColors: ['scarlet', 'bright_gold', 'peacock_blue'], suggestedGarments: ['qipao', 'hanfu'], suggestedParts: [], suggestedMotifs: ['coiling dragon', 'rising phoenix', 'flame tails'] },

    // 意匠（Phase 5B 前半：新グループ）
    { id: 'ocean_shell_coral', themeAdjEn: 'oceanic', group: 'design', labelJa: '海と貝殻と珊瑚', shortPrompt: 'sea, shell and coral motifs', suggestedColors: ['lagoon_blue', 'seafoam_green', 'pearl_white', 'coral_pink'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['seashells', 'branching coral', 'sea foam', 'pearls'] },
    { id: 'clockwork_and_gears', themeAdjEn: 'clockwork', group: 'design', labelJa: '歯車と時計仕掛け', shortPrompt: 'gear and clockwork motifs', suggestedColors: ['copper_metal', 'bronze_metal', 'chocolate_brown', 'gunmetal'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['interlocking gears', 'clock faces', 'winding keys', 'rivets'] },
    { id: 'clouds_and_sky', themeAdjEn: 'cloud-strewn', group: 'design', labelJa: '雲と空', shortPrompt: 'cloud and sky motifs', suggestedColors: ['baby_blue', 'snow_white', 'soft_lavender'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['drifting clouds', 'sunbeams', 'sky gradients'] },
    { id: 'hearts_and_ribbons', themeAdjEn: 'heart-adorned', group: 'design', labelJa: 'ハートとリボン', shortPrompt: 'heart and ribbon motifs', suggestedColors: ['pastel_pink', 'strawberry_red', 'pure_white'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['heart charms', 'ribbon bows', 'candy tones'] },
    { id: 'dreams_and_sweets', themeAdjEn: 'dreamy confectionery', group: 'design', labelJa: '夢とお菓子', shortPrompt: 'dream and sweets motifs', suggestedColors: ['pastel_pink', 'cream_yellow', 'mint', 'soft_lavender'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['whipped cream frills', 'candy charms', 'star sprinkles', 'sleepy moons'] },
    { id: 'gothic_cathedral', themeAdjEn: 'cathedral-gothic', group: 'design', labelJa: 'ゴシック聖堂', shortPrompt: 'gothic cathedral motifs', suggestedColors: ['jet_black', 'deep_crimson', 'oxidized_silver', 'royal_purple'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['stained glass panels', 'pointed arches', 'rose windows', 'tracery lace'] },
    { id: 'arcane_circle', themeAdjEn: 'arcane', group: 'design', labelJa: '魔法陣', shortPrompt: 'magic circle motifs', suggestedColors: ['midnight_blue', 'violet', 'polished_silver'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['glowing sigils', 'concentric rings', 'floating glyphs'] },
    { id: 'plants_and_vines', themeAdjEn: 'botanical', group: 'design', labelJa: '植物と蔦', shortPrompt: 'plant and vine motifs', suggestedColors: ['ivy_green', 'moss_green', 'linen_white', 'gold_ochre'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['climbing vines', 'leaf embroidery', 'wildflowers', 'thorned stems'] }
  ];
})(window);
