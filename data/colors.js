/* 衣装プロンプト工房 / data/colors.js
 * 色の代表データ。MVP最終形は120色以上。ここでは全色グループ・全トーンを
 * 少なくとも1件ずつ含む代表セット（30色）を置き、ロジック検証に使う。
 * 追加方法は README.md の「カラーを追加する」を参照。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  // 色グループ（11.3）
  CPW.data.colorFamilies = [
    { id: 'white', labelJa: '白・オフホワイト' },
    { id: 'black', labelJa: '黒・グレー' },
    { id: 'red', labelJa: '赤' },
    { id: 'pink', labelJa: 'ピンク' },
    { id: 'orange', labelJa: 'オレンジ' },
    { id: 'yellow', labelJa: '黄' },
    { id: 'yellow_green', labelJa: '黄緑' },
    { id: 'green', labelJa: '緑' },
    { id: 'cyan', labelJa: '青緑・シアン' },
    { id: 'blue', labelJa: '青' },
    { id: 'purple', labelJa: '紫' },
    { id: 'brown', labelJa: '茶・ベージュ' },
    { id: 'metal', labelJa: '金属色' },
    { id: 'gem', labelJa: '宝石色' }
  ];

  // トーン（11.4）
  CPW.data.colorTones = [
    { id: 'bright', labelJa: '明るい' },
    { id: 'pale', labelJa: '淡い' },
    { id: 'vivid', labelJa: '鮮やか' },
    { id: 'muted', labelJa: 'くすみ' },
    { id: 'deep', labelJa: '深い' },
    { id: 'dark', labelJa: '暗い' }
  ];

  // 配色方式（11.5）
  CPW.data.colorSchemes = [
    { id: 'monochrome', labelJa: '単色・モノクローム', promptEn: 'monochrome palette' },
    { id: 'analogous', labelJa: '同系色', promptEn: 'analogous color palette' },
    { id: 'base_and_accent', labelJa: '主色＋差し色', promptEn: '' },
    { id: 'value_contrast', labelJa: '明暗コントラスト', promptEn: 'high contrast palette' },
    { id: 'complementary', labelJa: '補色寄り', promptEn: 'complementary color palette' },
    { id: 'pale_palette', labelJa: '淡色パレット', promptEn: 'soft pastel palette' },
    { id: 'deep_palette', labelJa: '深色パレット', promptEn: 'deep rich palette' },
    { id: 'gem_palette', labelJa: '宝石色パレット', promptEn: 'jewel-toned palette' },
    { id: 'neutral_metal', labelJa: '無彩色＋金属色', promptEn: 'neutral palette with metallic accents' },
    { id: 'auto', labelJa: 'おまかせ', promptEn: '' }
  ];

  // 色の役割（11.2）
  CPW.data.colorRoles = [
    { id: 'primary', labelJa: '主色', share: 70 },
    { id: 'secondary', labelJa: '副色', share: 20 },
    { id: 'accent', labelJa: '差し色', share: 10 },
    { id: 'metal', labelJa: '金属色', share: 0 },
    { id: 'gem', labelJa: '宝石色', share: 0 }
  ];

  CPW.data.colors = [
    { id: 'pure_white', labelJa: '純白', promptEn: 'pure white', hex: '#FFFFFF', family: 'white', tone: 'bright', temperature: 'neutral', value: 'light', saturation: 'none', moods: ['pure', 'sacred', 'clean'], recommendedWith: ['polished_silver', 'sapphire_blue', 'jet_black'], attributes: ['light', 'ice'], styles: ['royal', 'minimal', 'classical'] },
    { id: 'warm_ivory', labelJa: '生成り', promptEn: 'warm ivory', hex: '#F3E9D8', family: 'white', tone: 'pale', temperature: 'warm', value: 'light', saturation: 'soft', moods: ['gentle', 'antique'], recommendedWith: ['antique_gold', 'deep_crimson', 'warm_brown'], attributes: ['light', 'earth'], styles: ['victorian', 'classical'] },
    { id: 'pearl_white', labelJa: '真珠色', promptEn: 'pearl white', hex: '#EDE7E3', family: 'white', tone: 'pale', temperature: 'cool', value: 'light', saturation: 'soft', moods: ['ethereal', 'elegant'], recommendedWith: ['polished_silver', 'ice_blue', 'deep_navy'], attributes: ['light', 'ice', 'water'], styles: ['royal', 'classical'] },
    { id: 'jet_black', labelJa: '漆黒', promptEn: 'jet black', hex: '#111014', family: 'black', tone: 'dark', temperature: 'neutral', value: 'dark', saturation: 'none', moods: ['dramatic', 'gothic', 'severe'], recommendedWith: ['pure_white', 'deep_crimson', 'oxidized_silver', 'antique_gold'], attributes: ['darkness'], styles: ['gothic', 'punk', 'minimal'] },
    { id: 'charcoal_gray', labelJa: '炭墨色', promptEn: 'charcoal gray', hex: '#3B3A40', family: 'black', tone: 'deep', temperature: 'cool', value: 'dark', saturation: 'none', moods: ['sober', 'urban'], recommendedWith: ['pure_white', 'ice_blue', 'polished_silver'], attributes: ['darkness', 'earth'], styles: ['minimal', 'techwear'] },
    { id: 'ash_gray', labelJa: '灰白', promptEn: 'ash gray', hex: '#B4B1B8', family: 'black', tone: 'muted', temperature: 'cool', value: 'mid', saturation: 'none', moods: ['quiet', 'melancholic'], recommendedWith: ['jet_black', 'pearl_white', 'dusty_lavender'], attributes: ['wind', 'darkness'], styles: ['minimal', 'gothic'] },
    { id: 'deep_crimson', labelJa: '深紅', promptEn: 'deep crimson', hex: '#8B1E2D', family: 'red', tone: 'deep', temperature: 'warm', value: 'dark', saturation: 'rich', moods: ['dramatic', 'royal', 'gothic'], recommendedWith: ['jet_black', 'warm_ivory', 'antique_gold', 'oxidized_silver'], attributes: ['fire', 'darkness'], styles: ['gothic', 'baroque', 'royal'] },
    { id: 'vermilion', labelJa: '朱色', promptEn: 'vermilion', hex: '#D8402C', family: 'red', tone: 'vivid', temperature: 'warm', value: 'mid', saturation: 'rich', moods: ['vivid', 'sacred', 'festive'], recommendedWith: ['pure_white', 'antique_gold', 'jet_black'], attributes: ['fire'], styles: ['japanese', 'chinese'] },
    { id: 'burgundy', labelJa: '葡萄酒色', promptEn: 'burgundy', hex: '#5C1F30', family: 'red', tone: 'dark', temperature: 'warm', value: 'dark', saturation: 'rich', moods: ['gothic', 'mature'], recommendedWith: ['jet_black', 'pure_white', 'antique_gold'], attributes: ['darkness', 'fire'], styles: ['gothic', 'lolita', 'victorian'] },
    { id: 'blush_pink', labelJa: '桜鼠', promptEn: 'blush pink', hex: '#EFC7CB', family: 'pink', tone: 'pale', temperature: 'warm', value: 'light', saturation: 'soft', moods: ['sweet', 'gentle'], recommendedWith: ['warm_ivory', 'antique_gold', 'dusty_lavender'], attributes: ['light', 'nature'], styles: ['lolita', 'fairy'] },
    { id: 'rose_red', labelJa: '薔薇色', promptEn: 'rose red', hex: '#C2455E', family: 'pink', tone: 'vivid', temperature: 'warm', value: 'mid', saturation: 'rich', moods: ['romantic', 'dramatic'], recommendedWith: ['jet_black', 'warm_ivory', 'forest_green'], attributes: ['fire', 'nature'], styles: ['gothic', 'baroque'] },
    { id: 'amber_orange', labelJa: '琥珀色', promptEn: 'amber orange', hex: '#C9741E', family: 'orange', tone: 'deep', temperature: 'warm', value: 'mid', saturation: 'rich', moods: ['warm', 'autumnal'], recommendedWith: ['warm_brown', 'warm_ivory', 'antique_gold'], attributes: ['fire', 'earth'], styles: ['adventurer', 'classical'] },
    { id: 'apricot', labelJa: '杏色', promptEn: 'soft apricot', hex: '#F0BC8E', family: 'orange', tone: 'pale', temperature: 'warm', value: 'light', saturation: 'soft', moods: ['gentle', 'daily'], recommendedWith: ['warm_ivory', 'warm_brown', 'sage_green'], attributes: ['earth', 'light'], styles: ['casual', 'fairy'] },
    { id: 'antique_gold', labelJa: '古金色', promptEn: 'antique gold', hex: '#B08D4A', family: 'metal', tone: 'muted', temperature: 'warm', value: 'mid', saturation: 'soft', moods: ['royal', 'antique'], recommendedWith: ['deep_crimson', 'jet_black', 'warm_ivory', 'deep_navy'], attributes: ['light', 'earth'], styles: ['baroque', 'royal', 'victorian'] },
    { id: 'pale_gold', labelJa: '淡金', promptEn: 'pale gold', hex: '#E4CE93', family: 'yellow', tone: 'pale', temperature: 'warm', value: 'light', saturation: 'soft', moods: ['radiant', 'divine'], recommendedWith: ['pure_white', 'sapphire_blue', 'vermilion'], attributes: ['light'], styles: ['classical', 'royal'] },
    { id: 'mustard_yellow', labelJa: '芥子色', promptEn: 'mustard yellow', hex: '#C9A227', family: 'yellow', tone: 'muted', temperature: 'warm', value: 'mid', saturation: 'soft', moods: ['earthy', 'retro'], recommendedWith: ['warm_brown', 'forest_green', 'charcoal_gray'], attributes: ['earth', 'thunder'], styles: ['casual', 'adventurer'] },
    { id: 'young_leaf_green', labelJa: '若草色', promptEn: 'young leaf green', hex: '#8FBF4D', family: 'yellow_green', tone: 'bright', temperature: 'warm', value: 'mid', saturation: 'rich', moods: ['fresh', 'lively'], recommendedWith: ['warm_ivory', 'warm_brown', 'sky_blue'], attributes: ['nature', 'wind'], styles: ['fairy', 'casual'] },
    { id: 'forest_green', labelJa: '深緑', promptEn: 'deep forest green', hex: '#2C4A34', family: 'green', tone: 'deep', temperature: 'cool', value: 'dark', saturation: 'rich', moods: ['calm', 'wild'], recommendedWith: ['warm_brown', 'antique_gold', 'warm_ivory'], attributes: ['nature', 'earth'], styles: ['adventurer', 'victorian'] },
    { id: 'sage_green', labelJa: '青磁鼠', promptEn: 'sage green', hex: '#A3B79A', family: 'green', tone: 'muted', temperature: 'cool', value: 'mid', saturation: 'soft', moods: ['quiet', 'natural'], recommendedWith: ['warm_ivory', 'dusty_lavender', 'warm_brown'], attributes: ['nature', 'wind'], styles: ['minimal', 'casual'] },
    { id: 'teal', labelJa: '青緑', promptEn: 'deep teal', hex: '#1F5E63', family: 'cyan', tone: 'deep', temperature: 'cool', value: 'dark', saturation: 'rich', moods: ['mysterious', 'oceanic'], recommendedWith: ['pearl_white', 'antique_gold', 'jet_black'], attributes: ['water', 'nature'], styles: ['classical', 'techwear'] },
    { id: 'pale_cyan', labelJa: '水浅葱', promptEn: 'pale cyan', hex: '#BFE0E3', family: 'cyan', tone: 'pale', temperature: 'cool', value: 'light', saturation: 'soft', moods: ['serene', 'ethereal'], recommendedWith: ['pearl_white', 'polished_silver', 'deep_navy'], attributes: ['ice', 'water', 'wind'], styles: ['fairy', 'minimal'] },
    { id: 'ice_blue', labelJa: '氷青', promptEn: 'ice blue', hex: '#9FC6E8', family: 'blue', tone: 'pale', temperature: 'cool', value: 'light', saturation: 'soft', moods: ['cold', 'serene'], recommendedWith: ['pearl_white', 'polished_silver', 'deep_navy'], attributes: ['ice', 'water'], styles: ['royal', 'minimal'] },
    { id: 'sky_blue', labelJa: '空色', promptEn: 'sky blue', hex: '#6FB3E0', family: 'blue', tone: 'bright', temperature: 'cool', value: 'mid', saturation: 'rich', moods: ['open', 'daily'], recommendedWith: ['pure_white', 'warm_ivory', 'ash_gray'], attributes: ['wind', 'water'], styles: ['casual', 'fairy'] },
    { id: 'deep_navy', labelJa: '濃紺', promptEn: 'deep navy', hex: '#1E2A4A', family: 'blue', tone: 'dark', temperature: 'cool', value: 'dark', saturation: 'rich', moods: ['noble', 'nocturnal'], recommendedWith: ['pure_white', 'antique_gold', 'polished_silver', 'ice_blue'], attributes: ['darkness', 'water', 'ice'], styles: ['royal', 'military', 'minimal'] },
    { id: 'royal_purple', labelJa: '帝王紫', promptEn: 'royal purple', hex: '#54306E', family: 'purple', tone: 'deep', temperature: 'cool', value: 'dark', saturation: 'rich', moods: ['royal', 'arcane'], recommendedWith: ['antique_gold', 'pure_white', 'jet_black'], attributes: ['darkness', 'light'], styles: ['royal', 'baroque', 'mage'] },
    { id: 'dusty_lavender', labelJa: '藤鼠', promptEn: 'dusty lavender', hex: '#B6A5C4', family: 'purple', tone: 'muted', temperature: 'cool', value: 'mid', saturation: 'soft', moods: ['melancholic', 'gentle'], recommendedWith: ['pearl_white', 'ash_gray', 'sage_green'], attributes: ['wind', 'darkness'], styles: ['victorian', 'minimal'] },
    { id: 'warm_brown', labelJa: '焦茶', promptEn: 'warm brown', hex: '#6B4A32', family: 'brown', tone: 'deep', temperature: 'warm', value: 'dark', saturation: 'soft', moods: ['rustic', 'reliable'], recommendedWith: ['warm_ivory', 'forest_green', 'antique_gold'], attributes: ['earth', 'nature'], styles: ['adventurer', 'casual'] },
    { id: 'sand_beige', labelJa: '砂色', promptEn: 'sand beige', hex: '#D8C4A5', family: 'brown', tone: 'pale', temperature: 'warm', value: 'light', saturation: 'soft', moods: ['calm', 'daily'], recommendedWith: ['warm_brown', 'warm_ivory', 'sage_green'], attributes: ['earth'], styles: ['casual', 'minimal'] },
    { id: 'polished_silver', labelJa: '白銀', promptEn: 'polished silver', hex: '#C8CBD0', family: 'metal', tone: 'bright', temperature: 'cool', value: 'light', saturation: 'none', moods: ['cold', 'noble'], recommendedWith: ['pure_white', 'deep_navy', 'jet_black', 'ice_blue'], attributes: ['ice', 'light', 'thunder'], styles: ['royal', 'military', 'techwear'] },
    { id: 'oxidized_silver', labelJa: '燻し銀', promptEn: 'oxidized silver', hex: '#8A8D93', family: 'metal', tone: 'muted', temperature: 'cool', value: 'mid', saturation: 'none', moods: ['antique', 'somber'], recommendedWith: ['jet_black', 'deep_crimson', 'charcoal_gray'], attributes: ['darkness', 'earth'], styles: ['gothic', 'victorian'] },
    { id: 'sapphire_blue', labelJa: '青玉色', promptEn: 'sapphire blue', hex: '#1F4FA3', family: 'gem', tone: 'vivid', temperature: 'cool', value: 'mid', saturation: 'rich', moods: ['noble', 'clear'], recommendedWith: ['pure_white', 'polished_silver', 'antique_gold'], attributes: ['water', 'ice', 'light'], styles: ['royal', 'classical'] },
    { id: 'emerald_green', labelJa: '翠玉色', promptEn: 'emerald green', hex: '#1E7A5A', family: 'gem', tone: 'vivid', temperature: 'cool', value: 'mid', saturation: 'rich', moods: ['arcane', 'vivid'], recommendedWith: ['antique_gold', 'jet_black', 'warm_ivory'], attributes: ['nature', 'water'], styles: ['baroque', 'mage'] },
    { id: 'amethyst_violet', labelJa: '紫水晶色', promptEn: 'amethyst violet', hex: '#7B4FA8', family: 'gem', tone: 'vivid', temperature: 'cool', value: 'mid', saturation: 'rich', moods: ['arcane', 'dreamlike'], recommendedWith: ['polished_silver', 'jet_black', 'pearl_white'], attributes: ['darkness', 'light'], styles: ['mage', 'gothic'] }
  ];
})(window);
