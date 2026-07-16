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
    { id: 'sacred', labelJa: '聖・魔' }
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
    { id: 'demon', themeAdjEn: 'demonic', group: 'sacred', labelJa: '悪魔', shortPrompt: 'demonic motifs', suggestedColors: ['jet_black', 'deep_crimson', 'royal_purple'], suggestedGarments: [], suggestedParts: [], suggestedMotifs: ['horns', 'bat wings', 'tail', 'arcane sigils'] }
  ];
})(window);
