# 衣装拡張の台帳（自動生成）

`node scripts/expansion-ledger.cjs` が研究資料（読取専用）と現行コードを照合して生成します。

## 新規候補172件

| 最終区分 | 件数 |
|---|---:|
| 実装（implemented） | 111 |
| 既存で代替（existing_alternative） | 26 |
| 保留・未実装（deferred） | 26 |
| 実装（他候補と統合）（merged） | 9 |

- 優先度は尺度が2種類混在（high/medium 42件／P0-P3 130件）。high/medium は P0〜P3 へ換算せず needs_review として保持。
- implementation_target の種別：basic_garment 31、part 3、special_feature 2、preset 7、existing_base_sufficient 9、new_base_required 33、structured_recipe 46、new_garment_text 36、new_category_candidate 5
- 再現性A/Bなのに基本衣装追加を指示していた矛盾：71件（コード上の構造差で最終区分を判断）
- 現行コードに存在しない参照ID（自動採用せず記録）：0件 

## ガチャ174件（別集合）

| 判定 | 件数 |
|---|---:|
| A | 53 |
| B | 44 |
| C | 68 |
| D | 9 |

| 対応状況 | 件数 |
|---|---:|
| existing | 53 |
| recipe_preset | 32 |
| implemented | 25 |
| existing_preset_with_alias | 12 |
| existing_alternative | 9 |
| deferred | 43 |

## 候補ごとの最終区分

| ID | 名前 | 再現性 | 最終区分 | 実装先・理由 |
|---|---|---|---|---|
| cosplay_heraldic_tabard | 抽象紋章のタバード | A | 実装 | g:tabard_tunic p:heraldic_tabard d:heraldic_panels 短いT字外衣を基本衣装化し、紋章パネルを装飾として追加 |
| cosplay_scale_panel_mantle | 鱗パネルの肩マント | A | 既存で代替 | g:cape_coat m:scale_armor ケープコート＋鱗鎧素材で再現。独立構造の差が小さい |
| cosplay_wayfinder_split_coat | 分割前身頃の道案内人コート | A | 既存で代替 | g:traveling_robe g:long_coat 旅装ローブ／ロングコートと非対称部位で再現 |
| cosplay_runeweaver_stole_tunic | 二重ストールの術式チュニック | A | 既存で代替 | g:mage_robe g:priest_robe 既存ローブ＋羽織りで再現 |
| cosplay_citadel_paneled_cape | 八枚パネルの城塞肩ケープ | A | 保留・未実装 |  八枚パネルのケープは新しい羽織り構造が必要。今回は保留 |
| cosplay_thorn_guard_gambeson | 茨守りのキルティング胴着 | A | 実装 | g:quilted_gambeson p:gambeson_guard キルティング胴着を基本衣装化（fantasy_quilted_gambeson と統合） |
| cosplay_crystal_cage_overskirt | 結晶格子オーバースカート | A | 保留・未実装 |  結晶格子のオーバースカートは新しい特殊構造が必要。保留 |
| cosplay_apiary_veil_smock | ベールフードの養蜂作業スモック | A | 実装 | g:beekeeping_suit p:beekeeper ベール付きフードの養蜂作業着（beekeeping_veil_suit と統合） |
| cosplay_forge_split_apron_suit | 分割前垂れの鍛冶作業スーツ | A | 実装 | g:blacksmith_workwear p:blacksmith 分割前垂れの鍛冶作業着 |
| cosplay_market_pastry_uniform | 市場菓子職人のショートコート制服 | A | 実装 | g:pastry_chef_uniform p:chef_whites パティシエ制服を基本衣装化 |
| cosplay_field_archivist_coat | 現地記録官の文書ポケットコート | A | 既存で代替 | g:laboratory_coat_outfit p:dark_academia_coat 白衣／ダークアカデミアのコートで再現 |
| cosplay_weather_observer_anorak | 気象観測員の計器ハーネスアノラック | A | 実装 | g:technical_anorak テクニカルアノラックを基本衣装化（計器ハーネスは装飾・部位で近似） |
| cosplay_parcel_courier_sash_tunic | 交差鞄帯の配達人チュニック | A | 保留・未実装 |  交差鞄帯の専用部位が必要。保留 |
| cosplay_lamplighter_cape_vest | 灯火係の肩ケープベスト | A | 既存で代替 | p:long_vest_attendant o:cover_up.shoulder_cape ロングベストの従者＋肩ケープで再現 |
| cosplay_harlequin_panel_jumpsuit | 菱形パネルの道化舞台服 | A | 実装 | g:costume_jumpsuit d:harlequin_diamonds p:harlequin_jester 仮装ジャンプスーツ＋菱形パネル |
| cosplay_plate_tutu_costume | 平板ネットの舞台チュチュ衣装 | A | 実装 | g:classical_tutu p:ballet_tutu 平板チュチュ（classical_ballet_tutu と統合） |
| cosplay_lantern_parade_robe | 灯籠パネルの行列ローブ | A | 保留・未実装 |  灯籠パネルの行列ローブは発光演出との境界が未整理。保留 |
| cosplay_puppetmaster_tail_waistcoat | 操り糸リボンのテールベスト | A | 既存で代替 | g:tailcoat_suit p:cape_magician 燕尾服・マジシャン衣装で再現 |
| cosplay_aerialist_unitard_capelet | ケープレット付き空中演技ユニタード | A | 実装 | g:stage_unitard p:aerialist_unitard ステージユニタード＋肩ケープ（aerial_acrobat_unitard と統合） |
| cosplay_drum_major_stage_coat | 飾り組紐のドラムメジャー舞台コート | A | 実装 | g:marching_band_uniform p:drum_major_coat マーチングバンド制服を基本衣装化し、ドラムメジャーはプリセット |
| cosplay_pantomime_bolero_set | 二色ボレロのパントマイムセット | A | 保留・未実装 |  二色ボレロの専用構造が未整理。保留 |
| cosplay_storybook_card_tabard | 絵本トランプの前後タバード | A | 既存で代替 | g:tabard_tunic mt:clock_and_cards タバード＋主テーマ「時計とトランプ」で再現（専用プリセットなし） |
| cosplay_cloud_shepherd_pelerine | 雲牧人のペルリーヌスモック | A | 保留・未実装 |  ペルリーヌの専用構造が必要。保留 |
| cosplay_patchwork_scarecrow_overalls | つぎはぎ案山子のオーバーオール | A | 実装 | g:bib_overalls p:scarecrow_overalls オーバーオール＋つぎ当ての状態 |
| cosplay_gingerbread_baker_bolero | 菓子の家風ベーカーボレロ | A | 保留・未実装 |  菓子の家風ボレロは食品題材の扱いが未整理。保留 |
| cosplay_windmill_miller_smock | 風車番の袖分割スモック | A | 保留・未実装 |  袖分割スモックの専用構造が必要。保留 |
| cosplay_glasshouse_pannier_overskirt | 温室のパニエオーバースカート | A | 既存で代替 | g:pannier_court_gown パニエのコートガウンで近似 |
| cosplay_clocktower_caretaker_coat | 時計塔管理人の段違いコート | A | 既存で代替 | p:clockwork_suit p:asymmetric_mode 歯車金具のスチームパンク服・非対称コートで再現 |
| cosplay_cooling_tube_undersuit | 冷却チューブの宇宙作業アンダースーツ | A | 実装 | g:cooling_undersuit p:space_undersuit 冷却チューブの宇宙アンダースーツ |
| cosplay_ring_joint_pressure_shell | 環状関節の圧力シェルスーツ | A | 実装 | g:pressure_suit p:pressure_suit_astronaut 環状関節の圧力スーツ |
| cosplay_solar_sail_fold_cape | 折り畳みソーラーセイルケープ | A | 保留・未実装 |  折り畳み帆のケープは新しい構造が必要。保留 |
| cosplay_orbital_hard_torso_vest | 軌道整備士の硬質トルソーベスト | A | 既存で代替 | g:pressure_suit 圧力スーツの硬質胴シェルで近似 |
| cosplay_data_courier_modular_poncho | データ運びのモジュラーポンチョ | A | 保留・未実装 |  着脱パネルのポンチョは新しい部位が必要。保留 |
| cosplay_relay_antenna_jacket | 中継アンテナ襟の通信ジャケット | A | 保留・未実装 |  アンテナ襟の専用部位が必要。保留 |
| cosplay_survival_cocoon_poncho | 緊急コクーンポンチョ | A | 保留・未実装 |  繭形ポンチョの専用構造が必要。保留 |
| cosplay_animal_playsack | 抽象動物プレイサック | A | 実装 | g:creature_sack_tunic 袋形の動物チュニック（着ぐるみ・顔出し） |
| cosplay_pufferfish_inflatable_cape | フグ風ふくらみケープ | A | 保留・未実装 |  フグの題材と膨らむケープ構造が未整理。保留 |
| cosplay_beetle_shell_backpack_overall | 甲虫殻バックパックのオーバーオール | A | 保留・未実装 |  甲虫殻バックパックは背面特殊構造が必要。保留 |
| cosplay_fortune_cookie_tabard | フォーチュンクッキーの折りタバード | A | 既存で代替 | g:tabard_tunic タバードで近似（食品の形の表現は保留） |
| cosplay_popcorn_box_tunic | ポップコーン箱チュニック | A | 保留・未実装 |  箱形チュニックは物体型仮装の扱いが未整理。保留 |
| cosplay_teacup_hoop_overskirt | ティーカップ輪郭のフープオーバースカート | A | 保留・未実装 |  ティーカップ輪郭のフープは新しい構造が必要。保留 |
| cosplay_houseplant_pot_apron | 鉢植えハウスプラントのエプロン衣装 | A | 保留・未実装 |  鉢形エプロンは新しい構造が必要。保留 |
| hanami_layered_haori | 花見レイヤード羽織スタイル | B | 既存で代替 | p:haori_student g:modern_kimono_outfit 羽織袴・現代和装で再現 |
| furisode_hanami_ensemble | 花見振袖アンサンブル | A | 実装 | g:furisode p:hanami_furisode 振袖を基本衣装化 |
| easter_pinafore_bonnet_set | イースター・ピナフォアボンネットセット | A | 実装 | g:pinafore_dress p:easter_pinafore ピナフォアドレス＋ボンネット |
| easter_rabbit_tailcoat_recipe | イースターラビット燕尾服レシピ | B | 実装 | p:easter_rabbit_tailcoat o:headwear.bunny_ear_headband d:pom_pom_tail 燕尾服＋うさ耳＋ポンポン尾のプリセット |
| spring_festival_happi_coat | 春祭り法被コート | A | 実装 | g:happi_coat p:spring_happi 法被を基本衣装化 |
| maypole_folk_apron_dress | 春祭ポールダンス民俗エプロンドレス | A | 実装 | p:maypole_dirndl g:dirndl ディアンドル＋花冠のプリセット |
| jinbei_set | 甚平セット | A | 実装 | g:jinbei p:summer_jinbei 甚平を基本衣装化 |
| fireworks_yukata_recipe | 花火浴衣レシピ | B | 実装 | p:fireworks_yukata 浴衣のプリセット |
| tanabata_tanzaku_tabard | 七夕短冊タバード衣装 | C | 実装 | p:tanabata_tabard d:tanzaku_strips タバード＋短冊飾りのプリセット |
| beach_cabana_set_recipe | 海辺カバナセットレシピ | B | 既存で代替 | p:summer_linen リネンシャツとワイドパンツで再現 |
| guayabera_resort_set | グアヤベラ・リゾートセット | A | 実装 | g:guayabera_set p:guayabera_resort グアヤベラシャツの装い |
| sarong_swim_wrap_set | サロン水着ラップセット | A | 実装 | p:sarong_swim_set ビキニ＋サロン（既存の羽織り）のプリセット |
| surf_change_poncho | サーフチェンジポンチョ | A | 実装 | g:towel_change_poncho p:surf_towel_poncho タオル地の着替えポンチョ |
| tropical_utility_romper | 南国ユーティリティロンパース | A | 実装 | g:utility_romper ユーティリティロンパース（専用プリセットなし） |
| halloween_witch_coat_dress | ハロウィン魔女コートドレス | A | 実装 | g:witch_coat_dress p:halloween_witch 魔女のコートドレス |
| halloween_witch_hunter_tabard | ハロウィン魔女狩りタバード | A | 実装 | p:witch_hunter_tabard タバード＋三角帽のプリセット |
| pumpkin_patch_overalls | パンプキンパッチ・オーバーオール | A | 実装 | p:pumpkin_patch_overalls オーバーオールのプリセット |
| skeleton_bone_jumpsuit | スケルトンボーン・ジャンプスーツ | C | 実装 | p:skeleton_jumpsuit d:bone_print 仮装ジャンプスーツ＋骨格プリント |
| scarecrow_smok_overalls | かかしスモック・オーバーオール | A | 実装（他候補と統合） | p:scarecrow_overalls cosplay_patchwork_scarecrow_overalls と同一構造として統合 |
| harvest_dirndl | 収穫祭ディアンドル | A | 実装 | g:dirndl p:harvest_dirndl ディアンドルを基本衣装化 |
| lederhosen_harvest_set | 収穫祭レーダーホーゼンセット | A | 実装 | g:lederhosen_set p:harvest_lederhosen レーダーホーゼンを基本衣装化 |
| momiji_haori_recipe | 紅葉羽織レシピ | B | 既存で代替 | p:haori_student 羽織袴＋配色で再現 |
| santa_fur_trim_suit | サンタ衣装 | A | 実装 | g:santa_suit p:santa_classic p:santa_skirt 毛皮縁のサンタ衣装を基本衣装化 |
| christmas_tailored_suit_recipe | クリスマス風スーツレシピ | B | 実装 | p:christmas_tailored_suit ビジネススーツ＋ヒイラギのプリセット |
| christmas_elf_tunic | クリスマスエルフ・チュニック | A | 実装 | g:elf_tunic_tights p:christmas_elf エルフのチュニック＋タイツ |
| reindeer_hooded_onesie | トナカイ・フード付き着ぐるみ | A | 実装 | p:reindeer_onesie 動物パジャマつなぎ＋題材トナカイ |
| snowman_hooded_onesie | 雪だるま・フード付き着ぐるみ | A | 実装 | p:snowman_onesie 動物パジャマつなぎ＋題材雪だるま |
| nutcracker_parade_uniform | くるみ割り人形パレード制服 | A | 実装 | p:nutcracker_parade マーチングバンド制服のプリセット |
| advent_choir_robe | アドベント聖歌隊ローブ | A | 実装 | g:choir_robe p:advent_choir 聖歌隊ローブ |
| down_parka_bib_set | ダウンパーカ＋ビブパンツ | A | 実装 | g:puffer_snow_bib_set p:winter_puffer_bib ダウン＋スノービブ（quilted_puffer_bib_set / ski_shell_bib_set と統合） |
| ski_racing_suit | スキーレーシングスーツ | A | 実装 | g:ski_race_suit スキーレーシングスーツ（専用プリセットなし） |
| miko_new_year_ensemble | 初詣巫女アンサンブル | A | 実装 | g:miko_outfit p:new_year_miko 巫女装束を基本衣装化 |
| montsuki_haori_hakama_recipe | 年始紋付羽織袴レシピ | B | 実装 | p:new_year_montsuki 羽織袴のプリセット |
| valentine_chocolatier_uniform | バレンタイン・ショコラティエ制服 | A | 実装 | p:valentine_chocolatier パティシエ制服のプリセット |
| valentine_heart_lolita_recipe | バレンタイン・ハートロリータレシピ | B | 実装 | p:valentine_heart_lolita ロリータドレス＋ハート柄 |
| white_day_gift_wrap_tabard | ホワイトデー・ギフトラップタバード | C | 既存で代替 | g:tabard_tunic d:ribbon_bow タバード＋リボンで近似（専用プリセットなし） |
| white_day_service_tailcoat_recipe | ホワイトデー給仕燕尾服レシピ | B | 実装 | p:white_day_tailcoat 燕尾服のプリセット |
| cupid_letter_carrier_tunic | バレンタイン・キューピッド配達チュニック | A | 保留・未実装 |  郵便鞄・翼の組合せが特殊パーツと重なるため保留 |
| birthday_cake_apron_dress | 誕生日ケーキエプロンドレス | C | 実装 | p:birthday_cake_apron ピナフォアドレスのプリセット |
| birthday_party_overall | 誕生日パーティー・オーバーオール | C | 既存で代替 | g:bib_overalls オーバーオールで再現（専用プリセットなし） |
| pannier_ballroom_gown | パニエ支え舞踏会ガウン | C | 実装 | g:pannier_court_gown パニエのコートガウン（robe_a_la_francaise と統合） |
| venetian_bauta_cloak | ヴェネツィア・バウタクローク | C | 実装 | g:venetian_carnival_cloak p:venetian_carnival o:headwear.venetian_full_face_mask o:headwear.tricorn_hat タバロのクロークと、顔を覆う仮面を別の選択肢として追加 |
| rabbit_ear_pom_tail_accessory | ウサギ耳＋ポンポン尻尾アクセサリー | B | 実装 | p:bunny_ear_lounge o:headwear.bunny_ear_headband d:pom_pom_tail 耳・尾のアクセサリー（顔出し） |
| cat_ear_tail_street_set | ネコ耳＋尻尾ストリートセット | B | 実装 | p:cat_ear_street o:headwear.cat_ear_beanie d:clip_on_plush_tail 耳・尾のアクセサリー（顔出し） |
| dog_ear_collar_tail_accessory | イヌ耳・首輪・尻尾アクセサリー | C | 既存で代替 | o:headwear.animal_ear_headband d:clip_on_plush_tail 動物耳カチューシャ＋飾り尾で再現（専用プリセットなし） |
| fox_ear_tail_stole_set | キツネ耳＋尾ストールセット | B | 実装 | p:fox_ear_stole ファーコート＋耳・尾 |
| wolf_ear_tail_hood_accessory | オオカミ耳フード＋尾アクセサリー | B | 既存で代替 | g:animal_hood_capelet c:wolf 動物フードケープ＋題材オオカミで再現 |
| bear_ear_beret_paw_set | クマ耳ベレー＋肉球ミトンセット | C | 実装 | p:bear_ear_beret_set o:headwear.bear_ear_beret クマ耳ベレー |
| panda_ear_patch_accessory | パンダ耳＋アイパッチアクセサリー | C | 既存で代替 | o:headwear.animal_ear_headband c:panda 動物耳カチューシャ／題材パンダで再現 |
| tanuki_ear_striped_tail_accessory | タヌキ耳＋縞尾アクセサリー | C | 既存で代替 | c:tanuki g:animal_hood_jacket 題材タヌキの動物フードで再現 |
| shark_fin_hooded_poncho | サメ背びれフードポンチョ | C | 実装 | g:animal_hood_poncho p:shark_hood_poncho 動物フードポンチョ＋題材サメ |
| penguin_hooded_cape_jacket | ペンギンフードケープジャケット | C | 実装 | g:animal_hood_capelet p:penguin_hood_capelet 動物フードケープ＋題材ペンギン |
| seal_whisker_hooded_fleece | アザラシひげフードフリース | B | 既存で代替 | g:animal_hood_jacket c:seal 動物フードジャケット＋題材アザラシで再現 |
| dinosaur_spine_hooded_jacket | 恐竜背びれフードジャケット | C | 実装 | g:animal_hood_jacket p:dinosaur_hood_jacket 動物フードジャケット＋題材恐竜 |
| dragon_horn_hooded_cloak | ドラゴン角フードクローク | B | 実装 | p:dragon_hood_cloak 動物フードケープ＋題材ドラゴン |
| sheep_wool_hooded_vest | ヒツジ毛糸フードベスト | B | 実装 | g:animal_hood_cardigan p:sheep_hood_cardigan ベストではなくカーディガン型で実装（袖の有無は部位で調整） |
| reindeer_antler_hooded_cardigan | トナカイ枝角フードカーディガン | B | 既存で代替 | g:animal_hood_cardigan c:reindeer 動物フードカーディガン＋題材トナカイで再現 |
| red_panda_ringed_hoodie | レッサーパンダ縞尾フーディ | B | 実装 | p:red_panda_hoodie 動物フードジャケット＋題材レッサーパンダ |
| rabbit_flannel_sleep_onesie | ウサギフランネル寝つなぎ | B | 実装 | g:animal_onesie p:rabbit_onesie 動物パジャマつなぎ |
| cat_zip_fleece_onesie | ネコ前ファスナーフリースつなぎ | B | 実装 | p:cat_onesie 動物パジャマつなぎ＋肉球の足先 |
| dog_footed_flannel_onesie | イヌ足付きフランネルつなぎ | C | 既存で代替 | g:animal_onesie c:dog o:kigurumi_feet.integrated_footies つなぎ＋題材イヌ＋足先一体で再現 |
| fox_dropseat_sleep_onesie | キツネ尻尾穴つき寝つなぎ | C | 実装 | p:fox_onesie キツネのつなぎ（後ろ開閉の構造は表現しない） |
| bear_loose_lounge_onesie | クマゆったりルームつなぎ | B | 既存で代替 | g:animal_onesie c:bear つなぎ＋題材クマで再現 |
| panda_patch_pocket_onesie | パンダ配色ポケットつなぎ | C | 実装 | p:panda_onesie パンダ配色のつなぎ |
| dinosaur_spined_sleepers | 恐竜背びれスリーパーつなぎ | C | 実装 | p:dinosaur_sleeper 背びれの足付きつなぎ |
| axolotl_gill_frill_onesie | ウーパールーパーえら襟つなぎ | C | 実装 | p:axolotl_onesie c:axolotl えらフリルの題材を追加 |
| koala_padded_plush_suit | コアラ腹パッドぬいぐるみスーツ | C | 実装 | g:plush_padded_suit p:koala_plush_suit ぬいぐるみ風スーツ（顔出し） |
| otter_belly_plush_suit | カワウソ腹ポケットぬいぐるみスーツ | C | 既存で代替 | g:plush_padded_suit c:otter ぬいぐるみ風スーツ＋題材カワウソで再現 |
| capybara_boxy_plush_suit | カピバラ箱形ぬいぐるみスーツ | C | 実装 | p:capybara_plush_suit o:kigurumi_padding.boxy_body_padding 箱形の詰め物 |
| bumblebee_padded_plush_suit | マルハナバチ羽根付きぬいぐるみスーツ | C | 実装 | p:bumblebee_plush_suit 丸いお腹＋羽根形の袖 |
| rabbit_full_head_mascot | ウサギ完全マスコットスーツ | D | 実装 | g:full_mascot_suit p:rabbit_mascot c:rabbit 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| wolf_full_head_mascot | オオカミ完全マスコットスーツ | D | 実装 | g:full_mascot_suit p:wolf_mascot c:wolf 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| shark_full_head_mascot | サメ完全マスコットスーツ | D | 実装 | g:full_mascot_suit p:shark_mascot c:shark 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| penguin_full_head_mascot | ペンギン完全マスコットスーツ | D | 実装 | g:full_mascot_suit p:penguin_mascot c:penguin 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| dragon_full_head_mascot | ドラゴン完全マスコットスーツ | D | 実装 | g:full_mascot_suit p:dragon_mascot c:dragon 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| elephant_full_head_mascot | ゾウ完全マスコットスーツ | D | 実装 | g:full_mascot_suit p:elephant_mascot c:elephant 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| strawberry_full_head_mascot | イチゴ完全マスコットスーツ | D | 実装 | g:object_mascot_suit p:strawberry_mascot c:strawberry 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| pumpkin_full_head_mascot | カボチャ完全マスコットスーツ | D | 実装 | g:object_mascot_suit p:pumpkin_mascot c:pumpkin 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| hamburger_full_head_mascot | ハンバーガー完全マスコットスーツ | D | 実装 | g:object_mascot_suit p:hamburger_mascot c:hamburger 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| sushi_full_head_mascot | にぎり寿司完全マスコットスーツ | D | 実装 | g:object_mascot_suit p:sushi_mascot c:sushi 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| cupcake_full_head_mascot | カップケーキ完全マスコットスーツ | D | 実装 | g:object_mascot_suit p:cupcake_mascot c:cupcake 完全マスコットの共通構造＋題材。視界メッシュ・通気口は任意の明示選択 |
| reindeer_tailored_winter_coat | トナカイ枝角ボタンの冬コート | B | 実装 | p:reindeer_antler_coat ロングコート＋装飾ボタン（ファッション再解釈） |
| serpent_scale_techwear_set | ヘビ鱗テックウェアセット | B | 実装 | p:serpent_scale_techwear pt:snake_scale_print ヘビ鱗柄を追加 |
| butterfly_pleated_cape_dress | チョウ羽根プリーツケープドレス | B | 実装 | p:butterfly_cape_dress ドレス＋背面ケープ |
| frog_rain_utility_set | カエル雨具ユーティリティセット | B | 実装 | p:frog_rain_set アノラック＋レインブーツ |
| peacock_fan_panel_eveningwear | クジャク扇パネルのイブニングウェア | B | 実装 | p:peacock_fan_gown ボールガウン＋羽根飾り |
| koi_wave_wrap_outfit | コイ波柄ラップ衣装 | B | 実装 | p:koi_wave_wrap 創作和装＋波柄 |
| zebra_stripe_tailored_suit | シマウマ縞テーラードスーツ | B | 実装 | p:zebra_tailored_suit pt:zebra_stripe ゼブラ柄を追加 |
| denim_bib_overalls | デニムのビブオーバーオール | A | 実装 | g:bib_overalls オーバーオールを基本衣装化 |
| technical_anorak_shell | テクニカルアノラックシェル | C | 実装 | g:technical_anorak テクニカルアノラック |
| quilted_puffer_bib_set | キルティングパファー・ビブセット | C | 実装（他候補と統合） | g:puffer_snow_bib_set down_parka_bib_set と統合 |
| leather_biker_jacket_set | レザーバイカージャケットセット | A | 実装 | g:biker_jacket_set p:biker_leather ライダースジャケット |
| wrap_panel_dress | ラップパネルドレス | A | 実装 | g:wrap_dress ラップドレス（専用プリセットなし） |
| mongolian_deel_documented | モンゴルのデール（史実・伝統服） | A | 実装 | g:deel p:steppe_deel 文化注記付きの基本衣装 |
| scottish_kilt_documented | スコティッシュ・キルト（史実・伝統服） | A | 実装 | g:kilt_set 文化注記付きの基本衣装 |
| sarong_kebaya_documented | サロン・クバヤ（史実・文化服） | A | 実装 | g:kebaya_sarong 文化注記付きの基本衣装 |
| west_african_boubou_documented | 西アフリカのブーブー（史実・伝統服） | A | 実装 | g:boubou 文化注記付きの基本衣装 |
| ancient_greek_chiton_himation | 古代ギリシアのキトンとヒマティオン（史実衣装） | A | 実装 | g:chiton_himation p:greek_chiton 史実注記付きの基本衣装 |
| robe_a_la_francaise_documented | ローブ・ア・ラ・フランセーズ（史実衣装） | C | 実装（他候補と統合） | g:pannier_court_gown pannier_ballroom_gown と統合 |
| renaissance_doublet_trunk_hose | ルネサンス期ダブレットとトランクホーズ（史実衣装） | C | 実装 | g:doublet_and_hose p:doublet_bard 史実注記付きの基本衣装 |
| medieval_houppelande_documented | 中世ウップランド（史実衣装） | A | 実装 | g:houppelande 史実注記付きの基本衣装 |
| sixties_paper_shift_dress | 1960年代ペーパーシフトドレス（史実衣装） | C | 実装 | g:mod_shift_dress シフトドレスとして実装。紙素材（paper textile）は保留 |
| firefighter_turnout_gear | 消防用ターンアウトギア | D | 実装 | g:firefighter_turnout p:firefighter d:reflective_tape 新カテゴリではなく制服カテゴリの基本衣装として実装 |
| beekeeping_veil_suit | 養蜂用ベールスーツ | C | 実装（他候補と統合） | g:beekeeping_suit cosplay_apiary_veil_smock と統合 |
| surgical_scrub_gown_set | 手術用スクラブとラップガウン | A | 実装 | g:scrub_suit p:scrubs_medical スクラブ上下として実装。後ろ合わせのガウンは保留 |
| high_visibility_construction_set | 高視認性コンストラクションセット | C | 実装 | g:high_visibility_workwear 高視認性作業服（専用プリセットなし） |
| hazmat_encapsulating_suit | 密閉型ハズマットスーツ | D | 実装 | g:sealed_hazmat_suit p:hazmat_worker 透明バイザーで顔が見える防護服として実装 |
| cycling_bib_kit | サイクリング・ビブキット | C | 実装 | g:cycling_kit サイクルジャージ＋ビブショーツ |
| martial_arts_gi_set | 武道着セット | A | 実装 | g:martial_arts_gi 武道着 |
| fencing_whites | フェンシング・ホワイト | C | 実装 | g:fencing_uniform p:fencing_whites フェンシングウェア |
| ski_shell_bib_set | スキーシェル・ビブセット | C | 実装（他候補と統合） | g:puffer_snow_bib_set down_parka_bib_set と統合 |
| full_wetsuit | フルウェットスーツ | C | 実装 | g:full_wetsuit p:wetsuit_diver フルウェットスーツ |
| fantasy_quilted_gambeson | ファンタジー・キルテッドガンベソン | A | 実装（他候補と統合） | g:quilted_gambeson cosplay_thorn_guard_gambeson と統合 |
| fantasy_lamellar_harness | ファンタジー・ラメラーアーマーハーネス | C | 実装 | g:lamellar_armor_set ラメラーアーマー（専用プリセットなし） |
| wing_portal_surcoat | 翼ポータル付きサーコート | C | 保留・未実装 |  翼の開口は特殊パーツとの接続仕様が必要。保留 |
| fae_petal_mantle | フェイ・ペタルマントル | C | 保留・未実装 |  花弁パネルの専用構造が必要。保留 |
| classical_ballet_tutu | クラシックバレエ・チュチュ | C | 実装（他候補と統合） | g:classical_tutu cosplay_plate_tutu_costume と統合 |
| aerial_acrobat_unitard | エアリアルアクロバット・ユニタード | C | 実装（他候補と統合） | g:stage_unitard cosplay_aerialist_unitard_capelet と統合 |
| marching_band_uniform | マーチングバンド制服 | C | 実装 | g:marching_band_uniform 基本衣装として実装 |
| quick_change_stage_costume | クイックチェンジ舞台衣装 | C | 保留・未実装 |  早替え構造は画像として表現しにくいため保留 |
| punk_webbing_harness_ensemble | パンク・ウェビングハーネスアンサンブル | C | 既存で代替 | g:biker_jacket_set o:waist.waist_harness ライダース＋腰のハーネスで近似 |
| mod_fishtail_parka | モッズ・フィッシュテールパーカ | A | 実装 | g:fishtail_parka p:mods_parka モッズパーカ |
| decora_layered_preset | デコラ風レイヤードプリセット | B | 保留・未実装 |  大量の小物を重ねる指定は装飾件数の上限設計が必要。保留 |
| footed_sleep_onesie | フッテッド・スリープワンジー | C | 実装（他候補と統合） | g:animal_onesie o:kigurumi_feet.integrated_footies 動物パジャマつなぎの足元部位として統合 |
| hooded_bathrobe | フード付きバスローブ | A | 実装 | g:hooded_bathrobe p:bathrobe_rest フード付きバスローブ |
| weighted_blanket_poncho | ウェイテッドブランケット・ポンチョ | C | 保留・未実装 |  重さは画像で表現できないため保留 |
| printed_lattice_shell | 3Dプリント・ラティスシェル | D | 保留・未実装 |  実験的構造カテゴリが必要。保留 |
| origami_pleat_transformer | オリガミ・プリーツ変形衣装 | D | 保留・未実装 |  変形構造は保留 |
| inflatable_air_cell_coat | インフレータブル・エアセルコート | D | 保留・未実装 |  空気室の構造は保留 |
| chainmail_mesh_tunic | チェーンメイル・メッシュチュニック | C | 実装 | g:chainmail_tunic チェーンメイルのチュニック（専用プリセットなし） |

## 検証エラー

なし
