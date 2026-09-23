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

  // 品質タグ（出力オプション「品質タグ」がONのときだけ使う）
  CPW.data.qualityTags = ['masterpiece', 'best quality', 'highly detailed'];

  CPW.data.styles = [
    {"id":"gothic","labelJa":"ゴシック","shortPrompt":"gothic","tags":["dark","ornate"],"groupJa":"定番様式"},
    {"id":"lolita","adjEn":"lolita","labelJa":"ロリータ","shortPrompt":"lolita fashion","tags":["frilled","ornate"],"groupJa":"定番様式"},
    {"id":"victorian","labelJa":"ヴィクトリアン","shortPrompt":"victorian","tags":["historical","ornate"],"groupJa":"歴史・レトロ"},
    {"id":"baroque","labelJa":"バロック","shortPrompt":"baroque","tags":["ornate","royal"],"groupJa":"歴史・レトロ"},
    {"id":"minimal","labelJa":"ミニマル","shortPrompt":"minimalist","tags":["plain"],"groupJa":"定番様式"},
    {"id":"maximalist","labelJa":"マキシマリスト","shortPrompt":"maximalist","tags":["ornate"],"groupJa":"定番様式"},
    {"id":"punk","labelJa":"パンク","shortPrompt":"punk","tags":["rough","dark"],"groupJa":"定番様式"},
    {"id":"techwear","labelJa":"テックウェア","shortPrompt":"techwear","tags":["futuristic","functional"],"groupJa":"定番様式"},
    {"id":"military","labelJa":"ミリタリー","shortPrompt":"military-style","tags":["functional","structured"],"groupJa":"定番様式"},
    {"id":"classical","adjEn":"classical","labelJa":"クラシカル","shortPrompt":"classical","tags":["draped","historical"],"groupJa":"歴史・レトロ"},
    {"id":"street","adjEn":"street","labelJa":"ストリート","shortPrompt":"streetwear","tags":["modern","casual"],"groupJa":"定番様式"},
    {"id":"royal","labelJa":"王族様式","shortPrompt":"royal","tags":["ornate","structured"],"groupJa":"定番様式"},
    {"id":"casual","labelJa":"カジュアル","shortPrompt":"casual","groupJa":"現代","tags":["modern"]},
    {"id":"smart_casual","labelJa":"スマートカジュアル","shortPrompt":"smart casual","groupJa":"現代","tags":["modern"]},
    {"id":"contemporary","labelJa":"コンテンポラリー","shortPrompt":"contemporary","groupJa":"現代","tags":["modern"]},
    {"id":"preppy","labelJa":"プレッピー","shortPrompt":"preppy","groupJa":"現代","tags":["modern"]},
    {"id":"workwear","labelJa":"ワークウェア","shortPrompt":"workwear-inspired","groupJa":"現代","tags":["modern"]},
    {"id":"utility","labelJa":"ユーティリティ","shortPrompt":"utility-style","groupJa":"現代","tags":["modern"]},
    {"id":"resort","labelJa":"リゾート","shortPrompt":"resort-style","groupJa":"現代","tags":["modern"]},
    {"id":"athleisure","labelJa":"アスレジャー","shortPrompt":"athleisure","groupJa":"現代","tags":["modern"]},
    {"id":"sports_inspired","labelJa":"スポーツ風","shortPrompt":"sports-inspired","groupJa":"現代","tags":["modern"]},
    {"id":"old_money","labelJa":"オールドマネー風","shortPrompt":"old-money-inspired","groupJa":"現代","tags":["modern"]},
    {"id":"quiet_luxury","labelJa":"控えめな上質感","shortPrompt":"quiet-luxury-inspired","groupJa":"現代","tags":["modern"]},
    {"id":"grunge","labelJa":"グランジ","shortPrompt":"grunge","groupJa":"サブカル・創作","tags":["creative"]},
    {"id":"romantic_goth","labelJa":"ロマンティックゴス","shortPrompt":"romantic goth","groupJa":"サブカル・創作","tags":["creative"]},
    {"id":"cyberpunk","labelJa":"サイバーパンク","shortPrompt":"cyberpunk","groupJa":"サブカル・創作","tags":["creative"]},
    {"id":"steampunk","labelJa":"スチームパンク","shortPrompt":"steampunk","groupJa":"サブカル・創作","tags":["creative"]},
    {"id":"dieselpunk","labelJa":"ディーゼルパンク","shortPrompt":"dieselpunk","groupJa":"サブカル・創作","tags":["creative"]},
    {"id":"futuristic","labelJa":"未来的","shortPrompt":"futuristic","groupJa":"サブカル・創作","tags":["creative"]},
    {"id":"avant_garde","labelJa":"アヴァンギャルド","shortPrompt":"avant-garde","groupJa":"サブカル・創作","tags":["creative"]},
    {"id":"dark_academia","labelJa":"ダークアカデミア","shortPrompt":"dark academia","groupJa":"学術・自然","tags":["soft"]},
    {"id":"light_academia","labelJa":"ライトアカデミア","shortPrompt":"light academia","groupJa":"学術・自然","tags":["soft"]},
    {"id":"cottagecore","labelJa":"コテージコア","shortPrompt":"cottagecore","groupJa":"学術・自然","tags":["soft"]},
    {"id":"fairycore","labelJa":"フェアリーコア","shortPrompt":"fairycore","groupJa":"学術・自然","tags":["soft"]},
    {"id":"forest","labelJa":"森を思わせる様式","shortPrompt":"forest-inspired","groupJa":"学術・自然","tags":["soft"]},
    {"id":"botanical","labelJa":"ボタニカル","shortPrompt":"botanical","groupJa":"学術・自然","tags":["soft"]},
    {"id":"nautical","labelJa":"ノーティカル","shortPrompt":"nautical","groupJa":"学術・自然","tags":["soft"]},
    {"id":"edwardian","labelJa":"エドワーディアン風","shortPrompt":"Edwardian-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"art_nouveau","labelJa":"アールヌーヴォー風","shortPrompt":"Art Nouveau-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"art_deco","labelJa":"アールデコ風","shortPrompt":"Art Deco-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"fifties","labelJa":"1950年代風","shortPrompt":"1950s-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"sixties","labelJa":"1960年代風","shortPrompt":"1960s-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"seventies","labelJa":"1970年代風","shortPrompt":"1970s-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"eighties","labelJa":"1980年代風","shortPrompt":"1980s-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"nineties","labelJa":"1990年代風","shortPrompt":"1990s-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"y2k","labelJa":"Y2K風","shortPrompt":"Y2K-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"retro","labelJa":"レトロ","shortPrompt":"retro","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"vintage","labelJa":"ヴィンテージ風","shortPrompt":"vintage-inspired","groupJa":"歴史・レトロ","tags":["historical"]},
    {"id":"bohemian","labelJa":"ボヘミアン","shortPrompt":"bohemian","groupJa":"舞台・雰囲気","tags":["ornate"]},
    {"id":"romantic","labelJa":"ロマンティック","shortPrompt":"romantic","groupJa":"舞台・雰囲気","tags":["ornate"]},
    {"id":"ceremonial","labelJa":"儀礼的","shortPrompt":"ceremonial","groupJa":"舞台・雰囲気","tags":["ornate"]},
    {"id":"theatrical","labelJa":"演劇的","shortPrompt":"theatrical","groupJa":"舞台・雰囲気","tags":["ornate"]},
    {"id":"idol_stage","labelJa":"アイドルステージ風","shortPrompt":"idol-stage","groupJa":"舞台・雰囲気","tags":["ornate"]},
    {"id":"fantasy_adventurer","labelJa":"幻想冒険者風","shortPrompt":"fantasy-adventurer","groupJa":"舞台・雰囲気","tags":["ornate"]}
  ];
})(window);
