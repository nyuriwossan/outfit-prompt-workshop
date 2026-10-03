/* Discovery metadata is independent of legacy group IDs and outfit patches. */
(function(g){var D=g.CPW.data;
D.presetCategories=[['daily','日常・お出かけ'],['work','制服・仕事'],['service','メイド・執事'],['fantasy','ファンタジー・礼装'],['eastern','和風・東洋風'],['alternative','ゴシック・個性派'],['stage','ステージ・特別な装い'],['story','状態・物語']].map(function(r){return {id:r[0],labelJa:r[1]};});
D.presetMoods=['シンプル','可愛い','上品','クール','華やか','神秘的','ダーク','セクシー'];
var groups={daily:'daily_casual modern_basic dreamy_loungewear',work:'office_business gakuran_student sailor_student lab_coat fictional_police',service:'maid_butler classic_maid gothic_maid',fantasy:'royalty knight mage nun_style mermaid',eastern:'qipao_style',alternative:'gothic lolita techwear mafia_suit',stage:'classic_bunny reverse_bunny cutout_knit',story:'battle_worn_combat rain_soaked_uniform muddy_adventurer well_worn_workwear bloodstained_labcoat droplet_mermaid scorched_mage mended_traveler'};
var moods={daily:['シンプル','可愛い'],work:['クール','シンプル'],service:['上品','可愛い'],fantasy:['神秘的','華やか'],eastern:['上品','華やか'],alternative:['ダーク','クール'],stage:['華やか','セクシー'],story:['クール']};
D.presets.forEach(function(p){p.categoryId=Object.keys(groups).filter(function(k){return groups[k].split(' ').indexOf(p.id)>=0;})[0];p.moodTags=moods[p.categoryId].slice();p.searchAliases=p.id==='qipao_style'?['チャイナ','旗袍','チーパオ']:p.id==='cutout_knit'?['背中開き','セーター','ニット']:[];});
})(window);
