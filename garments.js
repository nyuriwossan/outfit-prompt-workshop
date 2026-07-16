/* 衣装プロンプト工房 / data/concept.js
 * 設計書の推奨ファイル構成には無いが、コンセプト層（世界観・時代・場面・季節・
 * 役割・様式）の選択肢が garments/presets のどちらにも属さないため独立させた。
 * 仮定：この分離は保守性のための追加であり、他ファイルの役割は変えない。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  CPW.data.worldviews = [
    { id: 'modern', labelJa: '現代', shortPrompt: 'modern', detailedPrompt: 'contemporary modern setting', tags: ['modern', 'realistic'] },
    { id: 'western_fantasy', labelJa: '西洋ファンタジー', shortPrompt: 'fantasy', detailedPrompt: 'western fantasy setting', tags: ['fantasy', 'ornate'] },
    { id: 'historical_western', labelJa: '歴史西洋風', shortPrompt: 'historical european style', detailedPrompt: 'historical european-inspired setting', tags: ['historical', 'classical'] },
    { id: 'dark_fantasy', labelJa: 'ダークファンタジー', shortPrompt: 'dark fantasy', detailedPrompt: 'dark fantasy setting', tags: ['fantasy', 'dark', 'gothic'] },
    { id: 'japanese', labelJa: '和風', shortPrompt: 'japanese style', detailedPrompt: 'japanese-inspired setting', tags: ['japanese', 'traditional'] },
    { id: 'chinese', labelJa: '中華風', shortPrompt: 'chinese style', detailedPrompt: 'chinese-inspired setting', tags: ['chinese', 'traditional'] },
    { id: 'sci_fi', labelJa: '近未来・SF', shortPrompt: 'futuristic', detailedPrompt: 'near-future science fiction setting', tags: ['futuristic', 'techwear'] },
    { id: 'fairy_tale', labelJa: '童話世界', shortPrompt: 'fairy tale', detailedPrompt: 'storybook fairy tale setting', tags: ['fairy', 'storybook'] }
  ];

  CPW.data.eras = [
    { id: 'ancient', labelJa: '古代', shortPrompt: 'ancient' },
    { id: 'medieval', labelJa: '中世', shortPrompt: 'medieval' },
    { id: 'renaissance', labelJa: 'ルネサンス', shortPrompt: 'renaissance' },
    { id: 'baroque_era', labelJa: 'バロック期', shortPrompt: 'baroque era' },
    { id: 'victorian_era', labelJa: 'ヴィクトリア朝', shortPrompt: 'victorian era' },
    { id: 'early_showa', labelJa: '大正・昭和初期', shortPrompt: 'taisho era' },
    { id: 'contemporary', labelJa: '現代', shortPrompt: 'contemporary' },
    { id: 'near_future', labelJa: '近未来', shortPrompt: 'near-future' }
  ];

  CPW.data.occasions = [
    { id: 'daily', labelJa: '日常', shortPrompt: 'everyday wear' },
    { id: 'work', labelJa: '仕事', shortPrompt: 'workwear' },
    { id: 'ceremonial', labelJa: '式典', shortPrompt: 'ceremonial' },
    { id: 'battle', labelJa: '戦闘', shortPrompt: 'combat-ready' },
    { id: 'ritual', labelJa: '儀式', shortPrompt: 'ritual' },
    { id: 'party', labelJa: '祝祭・パーティー', shortPrompt: 'festive' },
    { id: 'travel', labelJa: '旅', shortPrompt: 'travel-worn' },
    { id: 'rest', labelJa: '休息・私室', shortPrompt: 'private indoor' },
    { id: 'beach', labelJa: '海・プール', shortPrompt: 'beachside' }
  ];

  CPW.data.seasons = [
    { id: 'spring', labelJa: '春', shortPrompt: 'spring' },
    { id: 'summer', labelJa: '夏', shortPrompt: 'summer' },
    { id: 'autumn', labelJa: '秋', shortPrompt: 'autumn' },
    { id: 'winter', labelJa: '冬', shortPrompt: 'winter' }
  ];

  CPW.data.roles = [
    { id: 'commoner', labelJa: '市井の人', shortPrompt: 'commoner', recommendedWorldviews: ['modern', 'fairy_tale'] },
    { id: 'student', adjEn: 'school', labelJa: '学生', shortPrompt: 'student', recommendedWorldviews: ['modern'] },
    { id: 'office_worker', labelJa: '会社員', shortPrompt: 'office worker', recommendedWorldviews: ['modern'] },
    { id: 'royal_prince', adjEn: 'royal', labelJa: '王族', shortPrompt: 'royal', recommendedWorldviews: ['western_fantasy', 'historical_western'] },
    { id: 'noble', adjEn: 'noble', labelJa: '貴族', shortPrompt: 'noble', recommendedWorldviews: ['western_fantasy', 'historical_western'] },
    { id: 'maid', adjEn: 'maid', labelJa: 'メイド・執事', shortPrompt: 'maid', recommendedWorldviews: ['historical_western', 'dark_fantasy'] },
    { id: 'officer', adjEn: 'officer', labelJa: '軍人・将校', shortPrompt: 'military officer', recommendedWorldviews: ['historical_western', 'sci_fi'] },
    { id: 'knight', adjEn: 'knight', labelJa: '騎士', shortPrompt: 'knight', recommendedWorldviews: ['western_fantasy'] },
    { id: 'cleric', adjEn: 'clerical', labelJa: '聖職者', shortPrompt: 'cleric', recommendedWorldviews: ['western_fantasy', 'dark_fantasy'] },
    { id: 'mage', adjEn: 'mage', labelJa: '魔術師', shortPrompt: 'mage', recommendedWorldviews: ['western_fantasy', 'dark_fantasy'] },
    { id: 'adventurer', adjEn: 'adventurer', labelJa: '冒険者', shortPrompt: 'adventurer', recommendedWorldviews: ['western_fantasy'] },
    { id: 'assassin', adjEn: 'assassin', labelJa: '暗殺者', shortPrompt: 'assassin', recommendedWorldviews: ['dark_fantasy', 'sci_fi'] },
    { id: 'shrine_maiden', adjEn: 'shrine maiden', labelJa: '神職・巫女', shortPrompt: 'shrine attendant', recommendedWorldviews: ['japanese'] },
    { id: 'courtier_cn', adjEn: 'courtly', labelJa: '宮廷人（中華風）', shortPrompt: 'imperial courtier', recommendedWorldviews: ['chinese'] },
    { id: 'idol', adjEn: 'stage', labelJa: '舞台衣装・アイドル', shortPrompt: 'stage performer', recommendedWorldviews: ['modern', 'sci_fi'] },
    { id: 'traveler', adjEn: 'traveler', labelJa: '旅人', shortPrompt: 'traveler', recommendedWorldviews: ['western_fantasy', 'fairy_tale'] }
  ];

  // 主様式・副様式（7.4「様式」と共通）
  // 見せ方補助（出力オプション「見せ方補助」がONのときだけ使う）
  CPW.data.presentationFocus = [
    { id: 'full_outfit', labelJa: '全身', shortPrompt: 'full-body view of the outfit' },
    { id: 'upper_body', labelJa: '上半身', shortPrompt: 'upper-body view' },
    { id: 'detail', labelJa: '細部', shortPrompt: 'close-up on the garment details' }
  ];
  CPW.data.poseAssist = [
    { id: 'standing', labelJa: '立ち姿', shortPrompt: 'standing pose' },
    { id: 'walking', labelJa: '歩く', shortPrompt: 'mid-stride' },
    { id: 'seated', labelJa: '座る', shortPrompt: 'seated pose' }
  ];
  CPW.data.compositionAssist = [
    { id: 'plain_bg', labelJa: '無地背景', shortPrompt: 'plain background' },
    { id: 'centered', labelJa: '中央配置', shortPrompt: 'centered composition' },
    { id: 'low_angle', labelJa: 'あおり', shortPrompt: 'low camera angle' }
  ];

  // 品質タグ（出力オプション「品質タグ」がONのときだけ使う）
  CPW.data.qualityTags = ['masterpiece', 'best quality', 'highly detailed'];

  CPW.data.styles = [
    { id: 'gothic', labelJa: 'ゴシック', shortPrompt: 'gothic', tags: ['dark', 'ornate'] },
    { id: 'lolita', adjEn: 'lolita', labelJa: 'ロリータ', shortPrompt: 'lolita fashion', tags: ['frilled', 'ornate'] },
    { id: 'victorian', labelJa: 'ヴィクトリアン', shortPrompt: 'victorian', tags: ['historical', 'ornate'] },
    { id: 'baroque', labelJa: 'バロック', shortPrompt: 'baroque', tags: ['ornate', 'royal'] },
    { id: 'minimal', labelJa: 'ミニマル', shortPrompt: 'minimalist', tags: ['plain'] },
    { id: 'maximalist', labelJa: 'マキシマリスト', shortPrompt: 'maximalist', tags: ['ornate'] },
    { id: 'punk', labelJa: 'パンク', shortPrompt: 'punk', tags: ['rough', 'dark'] },
    { id: 'techwear', labelJa: 'テックウェア', shortPrompt: 'techwear', tags: ['futuristic', 'functional'] },
    { id: 'military', labelJa: 'ミリタリー', shortPrompt: 'military-style', tags: ['functional', 'structured'] },
    { id: 'classical', adjEn: 'classical', labelJa: 'クラシカル', shortPrompt: 'classical', tags: ['draped', 'historical'] },
    { id: 'street', adjEn: 'street', labelJa: 'ストリート', shortPrompt: 'streetwear', tags: ['modern', 'casual'] },
    { id: 'royal', labelJa: '王族様式', shortPrompt: 'royal', tags: ['ornate', 'structured'] }
  ];
})(window);
