# 見本の初期値・英文差分（全210件）

比較元は `f4f9045`。見本一覧から新しく採用する衣装について、世界観・時代・着用場面・役割を1件ずつ確認した。142件で初期値を減らし、68件は既存の設定を採用した。

## 判断例

- デイリーカジュアルはフーディとカーゴパンツを普段着として選ぶ見本なので「日常」と「ストリート」を残した。着用者の身分と時代は自由に指定できる。
- 王族・貴族には式典と王族、騎士には戦闘と騎士を残した。旗袍は中華風を残し、パーティーと宮廷人を外した。シェルワニには結婚式、サンタクロースにはクリスマスと冬、初詣の巫女装束にはお正月と神職・巫女を残した。
- 密閉型防護服は一般の作業にも使えるため、世界観「文明崩壊後」を外した。スクラブには仕事を残し、着用者を医師に限定する役割を外した。

## 初期値の確認結果

「残した設定」は世界観・時代・着用場面・役割・主様式・季節・主テーマのうち、最初から選ばれる値を示す。服の種類・部位・装飾・配色・属性は従来の定義を使う。

### 基本の見本（32件）

| 衣装 | 外した初期値 | 残した設定 |
|---|---|---|
| デイリーカジュアル<br>`daily_casual` | 世界観「現代」、時代「現代」、役割「市井の人」 | 着用場面「日常」、主様式「ストリート」 |
| オフィス・ビジネス<br>`office_business` | 世界観「現代」、時代「現代」、役割「会社員」 | 着用場面「仕事」、主様式「ミニマル」 |
| 王族・貴族<br>`royalty` | 変更なし | 世界観「西洋ファンタジー」、着用場面「式典」、役割「王族」、主様式「王族様式」 |
| メイド・執事<br>`maid_butler` | 変更なし | 世界観「歴史西洋風」、着用場面「仕事」、役割「メイド・執事」、主様式「ヴィクトリアン」 |
| 騎士<br>`knight` | 変更なし | 世界観「西洋ファンタジー」、着用場面「戦闘」、役割「騎士」、主様式「ミリタリー」 |
| 魔術師<br>`mage` | 変更なし | 世界観「西洋ファンタジー」、着用場面「儀式」、役割「魔術師」、主様式「ゴシック」 |
| ゴシック<br>`gothic` | 変更なし | 主様式「ゴシック」 |
| ロリータ<br>`lolita` | 変更なし | 主様式「ロリータ」 |
| テックウェア<br>`techwear` | 変更なし | 世界観「近未来・SF」、時代「近未来」、主様式「テックウェア」 |
| 学ラン<br>`gakuran_student` | 世界観「現代」、時代「現代」、着用場面「日常」、役割「学生」 | 主様式「ミニマル」 |
| セーラー服<br>`sailor_student` | 世界観「現代」、時代「現代」、着用場面「日常」、役割「学生」 | 主様式「ミニマル」 |
| クラシックメイド<br>`classic_maid` | 変更なし | 世界観「歴史西洋風」、時代「ヴィクトリア朝」、着用場面「仕事」、役割「メイド・執事」、主様式「ヴィクトリアン」 |
| ゴシックメイド<br>`gothic_maid` | 変更なし | 世界観「ダークファンタジー」、着用場面「仕事」、役割「メイド・執事」、主様式「ゴシック」 |
| 現代ベーシック<br>`modern_basic` | 時代「現代」、役割「市井の人」 | 世界観「現代」、着用場面「日常」、主様式「ミニマル」 |
| 夢かわルームウェア<br>`dreamy_loungewear` | 世界観「現代」、時代「現代」、役割「市井の人」 | 着用場面「休息・私室」、主様式「ストリート」 |
| クラシックバニー<br>`classic_bunny` | 世界観「現代」、時代「現代」、着用場面「祝祭・パーティー」、役割「舞台衣装・アイドル」 | 主様式「クラシカル」 |
| 前開き逆バニー<br>`reverse_bunny` | 世界観「現代」、時代「現代」、着用場面「祝祭・パーティー」、役割「舞台衣装・アイドル」 | 主様式「クラシカル」 |
| 白衣<br>`lab_coat` | 世界観「現代」、時代「現代」、役割「会社員」 | 着用場面「仕事」、主様式「ミニマル」 |
| 架空の警察官風<br>`fictional_police` | 世界観「現代」、時代「現代」 | 着用場面「仕事」、役割「軍人・将校」、主様式「ミリタリー」 |
| マフィア風<br>`mafia_suit` | 世界観「現代」、時代「現代」、着用場面「祝祭・パーティー」、役割「貴族」 | 主様式「クラシカル」 |
| 旗袍（チャイナドレス）<br>`qipao_style` | 着用場面「祝祭・パーティー」、役割「宮廷人（中華風）」 | 世界観「中華風」、主様式「クラシカル」 |
| シスター<br>`nun_style` | 変更なし | 世界観「歴史西洋風」、着用場面「儀式」、役割「聖職者」、主様式「クラシカル」 |
| 人魚<br>`mermaid` | 着用場面「儀式」、役割「旅人」 | 世界観「童話世界」、主様式「クラシカル」 |
| 童貞を殺すセーター<br>`cutout_knit` | 世界観「現代」、時代「現代」、着用場面「日常」、役割「市井の人」 | — |
| 戦闘後の傷んだ衣装<br>`battle_worn_combat` | 世界観「西洋ファンタジー」 | 着用場面「戦闘」、主様式「ミリタリー」 |
| 雨に濡れた制服<br>`rain_soaked_uniform` | 世界観「現代」、時代「現代」、着用場面「日常」 | — |
| 泥に汚れた冒険者<br>`muddy_adventurer` | 変更なし | 世界観「西洋ファンタジー」、着用場面「旅」 |
| 使い込まれた作業着<br>`well_worn_workwear` | 世界観「現代」、時代「現代」 | 着用場面「仕事」 |
| 血痕の付いた白衣<br>`bloodstained_labcoat` | 世界観「現代」、時代「現代」 | 着用場面「仕事」 |
| 水滴をまとった人魚<br>`droplet_mermaid` | 変更なし | 世界観「童話世界」、着用場面「海・プール」 |
| 焦げた魔法衣装<br>`scorched_mage` | 変更なし | 世界観「西洋ファンタジー」、着用場面「戦闘」 |
| 補修された旅装<br>`mended_traveler` | 変更なし | 世界観「西洋ファンタジー」、着用場面「旅」 |

### 追加の衣装見本（40件）

| 衣装 | 外した初期値 | 残した設定 |
|---|---|---|
| ゆったりニットとロングスカート<br>`knit_long_skirt` | 世界観「現代」 | — |
| サスペンダーの休日服<br>`suspender_holiday` | 世界観「現代」 | — |
| 冬のお出かけロングコート<br>`winter_long_coat` | 世界観「現代」 | — |
| リネンシャツとワイドパンツ<br>`summer_linen` | 世界観「現代」 | — |
| シルクのパジャマセット<br>`silk_pajamas` | 世界観「現代」 | — |
| ベスト付きカフェ店員<br>`cafe_waistcoat` | 世界観「現代」 | — |
| エプロン姿の花屋<br>`florist_apron` | 世界観「現代」 | — |
| 詰襟のホテルスタッフ<br>`hotel_stand_collar` | 世界観「現代」 | — |
| 飛行服のパイロット<br>`pilot_flight` | 世界観「現代」 | — |
| ケープ付き学園制服<br>`school_cape` | 世界観「現代」 | — |
| 三つ揃えの正統派執事<br>`three_piece_butler` | 世界観「現代」 | — |
| 燕尾服の宮廷従者<br>`court_tailcoat` | 世界観「現代」 | — |
| 和装エプロンの給仕<br>`kimono_server` | 変更なし | 世界観「和風」 |
| 短いケープのメイド<br>`short_cape_maid` | 世界観「現代」 | — |
| ロングベストの従者<br>`long_vest_attendant` | 世界観「現代」 | — |
| 星読みの天文学者<br>`star_astronomer` | 変更なし | 世界観「西洋ファンタジー」 |
| 司祭の儀礼服<br>`ritual_priest` | 変更なし | 世界観「西洋ファンタジー」 |
| 砂漠の旅人<br>`desert_traveler` | 変更なし | 世界観「西洋ファンタジー」 |
| 片肩マントの王子<br>`prince_half_cape` | 変更なし | 世界観「西洋ファンタジー」 |
| 森の薬草師<br>`forest_herbalist` | 変更なし | 世界観「西洋ファンタジー」 |
| 羽織と袴の書生風<br>`haori_student` | 変更なし | 世界観「和風」 |
| 薄衣を重ねた創作祭祀装束<br>`layered_ceremony` | 変更なし | 世界観「和風」 |
| 中華風の長衣と外套<br>`eastern_long_coat` | 変更なし | 世界観「中華風」 |
| 着物にコルセットベルト<br>`kimono_corset` | 変更なし | 世界観「和風」 |
| 羽衣を重ねた創作舞装束<br>`hagoromo_dance` | 変更なし | 世界観「和風」 |
| ゴシックな燕尾服<br>`gothic_tailcoat` | 世界観「現代」 | — |
| 歯車金具のスチームパンク服<br>`clockwork_suit` | 世界観「現代」 | — |
| ダークアカデミアのロングコート<br>`dark_academia_coat` | 世界観「現代」 | — |
| 多層ベルトのサイバーパンク服<br>`cyber_multi_belt` | 世界観「現代」 | — |
| 左右非対称のモード服<br>`asymmetric_mode` | 世界観「現代」 | — |
| 王子系アイドル衣装<br>`prince_idol` | 世界観「現代」 | — |
| サーカスの団長服<br>`circus_ringmaster` | 世界観「現代」 | — |
| 仮面舞踏会のドレス<br>`masquerade_gown` | 世界観「現代」 | — |
| スパンコールのステージスーツ<br>`sequin_stage_suit` | 世界観「現代」 | — |
| マント付きマジシャン衣装<br>`cape_magician` | 世界観「現代」 | — |
| 雪を払った冬の外套<br>`snow_winter_coat` | 世界観「現代」 | — |
| 砂埃の旅装<br>`dust_travel_clothes` | 世界観「西洋ファンタジー」 | — |
| 絵の具が付いた画家の作業着<br>`painter_workwear` | 世界観「現代」 | — |
| 擦り切れた儀礼服<br>`frayed_ceremonial` | 変更なし | 世界観「西洋ファンタジー」 |
| 継ぎ当てのあるマント<br>`patched_cape` | 世界観「西洋ファンタジー」 | — |

### ガチャ由来のレシピ（32件）

| 衣装 | 外した初期値 | 残した設定 |
|---|---|---|
| 細身のスーツ<br>`recipe_slim_suit` | 世界観「現代」、役割「会社員」 | 着用場面「仕事」 |
| ノーネクタイのスーツ<br>`recipe_open_collar_suit` | 世界観「現代」、着用場面「祝祭・パーティー」、役割「会社員」 | — |
| ダブルのスーツ<br>`recipe_double_breasted` | 世界観「現代」、着用場面「祝祭・パーティー」、役割「会社員」 | — |
| トレンチコートとスーツ<br>`recipe_trench_suit` | 世界観「現代」、着用場面「捜査」、役割「探偵」 | — |
| カーディガンとシャツ<br>`recipe_cardigan` | 世界観「現代」、着用場面「日常」、役割「学者」 | — |
| タートルネックとジャケット<br>`recipe_turtleneck_jacket` | 世界観「現代」、着用場面「仕事」、役割「学者」 | — |
| セーターとマフラー<br>`recipe_sweater_scarf` | 世界観「現代」、着用場面「日常」、役割「市井の人」 | — |
| 開襟アロハシャツ<br>`recipe_aloha` | 世界観「現代」、着用場面「日常」、役割「市井の人」 | — |
| オーバーサイズTシャツとワイドパンツ<br>`recipe_oversized_tee_wide` | 世界観「現代」、着用場面「日常」、役割「市井の人」 | — |
| ジップパーカーと無地のTシャツ<br>`recipe_zip_hoodie_tee` | 世界観「現代」、着用場面「日常」、役割「市井の人」 | — |
| 開襟シャツとTシャツ<br>`recipe_camp_collar_shirt` | 世界観「現代」、着用場面「日常」、役割「市井の人」 | — |
| 軍の礼装<br>`recipe_military_dress` | 変更なし | 世界観「歴史西洋風」、着用場面「式典」、役割「軍人・将校」 |
| 野戦服<br>`recipe_field_uniform` | 役割「軍人・将校」 | 世界観「現代」、着用場面「戦闘」 |
| 海軍士官服<br>`recipe_naval_uniform` | 変更なし | 世界観「歴史西洋風」、着用場面「式典」、役割「軍人・将校」 |
| 刑事のコート<br>`recipe_police_detective` | 世界観「現代」 | 着用場面「捜査」、役割「探偵」 |
| 堕天の装束<br>`recipe_fallen_angel` | 着用場面「儀式」、役割「魔術師」 | 世界観「ダークファンタジー」、主テーマ「堕天使」 |
| 着崩した着物<br>`recipe_loose_kimono` | 着用場面「日常」、役割「市井の人」 | 世界観「和風」 |
| かりゆし<br>`recipe_ryukyu_kariyushi` | 役割「市井の人」 | 世界観「和風」、着用場面「日常」 |
| 龍袍<br>`recipe_dragon_robe` | 変更なし | 世界観「中華風」、着用場面「式典」、役割「君主」、主テーマ「竜と鳳凰」 |
| オスマンのカフタン<br>`recipe_ottoman_kaftan` | 変更なし | 世界観「砂漠幻想」、着用場面「宮廷行事」、役割「貴族」 |
| ケンテ織りのストール<br>`recipe_kente_stole` | 世界観「現代」、役割「市井の人」 | 着用場面「式典」 |
| バティックシャツ<br>`recipe_batik_shirt` | 世界観「現代」、着用場面「日常」、役割「市井の人」 | — |
| スラヴの刺繍カフタン<br>`recipe_slavic_kaftan` | 変更なし | 世界観「歴史西洋風」、着用場面「式典」、役割「貴族」 |
| ケルトのマント<br>`recipe_celtic_cloak` | 変更なし | 世界観「歴史西洋風」、着用場面「旅」、役割「旅人」、主テーマ「ケルト神話」 |
| 宇宙艦長の制服<br>`recipe_space_captain` | 変更なし | 世界観「近未来・SF」、着用場面「外交」、役割「指揮官」 |
| 紐ビキニ<br>`recipe_string_bikini` | 世界観「現代」、役割「市井の人」 | 着用場面「海・プール」 |
| ハーネスと開襟シャツ<br>`recipe_harness_shirt` | 世界観「現代」、着用場面「祝祭・パーティー」、役割「市井の人」 | — |
| 都会派ユーティリティベスト<br>`recipe_utility_vest` | 世界観「現代」、着用場面「仕事」、役割「市井の人」 | — |
| ミニマルなジャケットの装い<br>`recipe_minimal_blazer` | 世界観「現代」、着用場面「仕事」、役割「市井の人」 | — |
| 曲線意匠の礼服<br>`recipe_art_nouveau_formal` | 役割「貴族」 | 世界観「歴史西洋風」、着用場面「式典」、主テーマ「植物と蔦」 |
| バンドガラ<br>`recipe_bandhgala` | 世界観「現代」、役割「貴族」 | 着用場面「式典」 |
| 軌道都市の外交官礼装<br>`recipe_orbital_diplomat` | 変更なし | 世界観「近未来・SF」、着用場面「外交」、役割「外交官」 |

### 季節・仮装・着ぐるみなど（106件）

| 衣装 | 外した初期値 | 残した設定 |
|---|---|---|
| サンタクロース<br>`santa_classic` | 世界観「現代」 | 主テーマ「クリスマス」、季節「冬」、着用場面「祭礼」 |
| ミニスカサンタ風<br>`santa_skirt` | 世界観「現代」 | 主テーマ「クリスマス」、季節「冬」 |
| クリスマスのエルフ<br>`christmas_elf` | 変更なし | 主テーマ「クリスマス」、季節「冬」、世界観「童話世界」 |
| クリスマスのテーラードスーツ<br>`christmas_tailored_suit` | 世界観「現代」 | 主テーマ「クリスマス」、季節「冬」、着用場面「祝祭・パーティー」 |
| くるみ割り人形のパレード制服<br>`nutcracker_parade` | 変更なし | 主テーマ「クリスマス」、着用場面「パレード」、世界観「童話世界」 |
| アドベントの聖歌隊<br>`advent_choir` | 変更なし | 主テーマ「クリスマス」、季節「冬」、着用場面「式典」、世界観「歴史西洋風」 |
| トナカイの着ぐるみパジャマ<br>`reindeer_onesie` | 世界観「現代」 | 季節「冬」、着用場面「休息・私室」 |
| 雪だるまのフードつなぎ<br>`snowman_onesie` | 世界観「現代」 | 季節「冬」 |
| 雪遊びのダウンとビブ<br>`winter_puffer_bib` | 世界観「現代」 | 季節「冬」、着用場面「野外活動」 |
| トナカイ枝角ボタンの冬コート<br>`reindeer_antler_coat` | 世界観「現代」 | 季節「冬」 |
| ハロウィンの魔女<br>`halloween_witch` | 変更なし | 主テーマ「ハロウィン」、季節「秋」、着用場面「祝祭・パーティー」、世界観「童話世界」 |
| パンプキンパッチのオーバーオール<br>`pumpkin_patch_overalls` | 世界観「現代」 | 主テーマ「ハロウィン」、季節「秋」 |
| スケルトンのジャンプスーツ<br>`skeleton_jumpsuit` | 世界観「現代」 | 主テーマ「ハロウィン」、季節「秋」 |
| 魔女狩りのタバード<br>`witch_hunter_tabard` | 変更なし | 主テーマ「ハロウィン」、世界観「ダークファンタジー」 |
| カボチャの完全マスコット<br>`pumpkin_mascot` | 変更なし | 主テーマ「ハロウィン」、着用場面「パレード」、世界観「童話世界」 |
| 収穫祭のディアンドル<br>`harvest_dirndl` | 変更なし | 主テーマ「収穫祭」、季節「秋」、着用場面「祭礼」、世界観「歴史西洋風」 |
| 収穫祭のレーダーホーゼン<br>`harvest_lederhosen` | 変更なし | 主テーマ「収穫祭」、季節「秋」、世界観「歴史西洋風」 |
| つぎはぎ案山子のオーバーオール<br>`scarecrow_overalls` | 変更なし | 主テーマ「収穫祭」、季節「秋」、世界観「童話世界」 |
| イースターのピナフォア<br>`easter_pinafore` | 変更なし | 主テーマ「イースター」、季節「春」、世界観「童話世界」 |
| イースターラビットの燕尾服<br>`easter_rabbit_tailcoat` | 変更なし | 主テーマ「イースター」、季節「春」、世界観「童話世界」 |
| 春祭りの法被<br>`spring_happi` | 変更なし | 主テーマ「夏祭り」、着用場面「祭礼」、世界観「和風」 |
| 花見の振袖<br>`hanami_furisode` | 変更なし | 季節「春」、着用場面「式典」、世界観「和風」 |
| 春祭りの花冠エプロンドレス<br>`maypole_dirndl` | 変更なし | 季節「春」、着用場面「祭礼」、世界観「童話世界」 |
| 夏祭りの甚平<br>`summer_jinbei` | 変更なし | 主テーマ「夏祭り」、季節「夏」、着用場面「祭礼」、世界観「和風」 |
| 花火の浴衣<br>`fireworks_yukata` | 変更なし | 主テーマ「夏祭り」、季節「夏」、着用場面「祭礼」、世界観「和風」 |
| 七夕の短冊タバード<br>`tanabata_tabard` | 変更なし | 主テーマ「七夕」、季節「夏」、世界観「和風」 |
| サロンを巻いた水着<br>`sarong_swim_set` | 世界観「現代」 | 季節「夏」、着用場面「海・プール」 |
| サーフのタオルポンチョ<br>`surf_towel_poncho` | 世界観「現代」 | 季節「夏」、着用場面「海・プール」 |
| リゾートのグアヤベラ<br>`guayabera_resort` | 世界観「現代」 | 季節「夏」 |
| フルウェットスーツ<br>`wetsuit_diver` | 世界観「現代」 | — |
| バレンタインのショコラティエ<br>`valentine_chocolatier` | 世界観「現代」 | 主テーマ「バレンタイン」、着用場面「仕事」 |
| バレンタインのハートロリータ<br>`valentine_heart_lolita` | 世界観「現代」 | 主テーマ「バレンタイン」 |
| ホワイトデーの給仕燕尾服<br>`white_day_tailcoat` | 世界観「現代」 | 着用場面「祝祭・パーティー」 |
| 初詣の巫女装束<br>`new_year_miko` | 変更なし | 主テーマ「お正月」、着用場面「儀式」、役割「神職・巫女」、世界観「和風」 |
| 年始の紋付羽織袴<br>`new_year_montsuki` | 変更なし | 主テーマ「お正月」、着用場面「式典」、世界観「和風」 |
| 誕生日ケーキのエプロンドレス<br>`birthday_cake_apron` | 変更なし | 主テーマ「夢とお菓子」、着用場面「祝祭・パーティー」、世界観「童話世界」 |
| 菱形パネルの道化<br>`harlequin_jester` | 世界観「現代」 | 着用場面「舞台」 |
| ドラムメジャーの舞台コート<br>`drum_major_coat` | 世界観「現代」 | 着用場面「パレード」 |
| 抽象紋章のタバード<br>`heraldic_tabard` | 変更なし | 着用場面「式典」、世界観「西洋ファンタジー」 |
| 平板チュチュのバレエ衣装<br>`ballet_tutu` | 世界観「現代」 | 着用場面「ダンス公演」 |
| ケープ付き空中演技ユニタード<br>`aerialist_unitard` | 世界観「現代」 | 着用場面「舞台」 |
| チアリーダー<br>`cheerleader` | 世界観「現代」 | — |
| ナース風の衣装<br>`nurse_costume` | 世界観「現代」 | — |
| 養蜂家<br>`beekeeper` | 役割「職人」、世界観「現代」 | 着用場面「仕事」 |
| 鍛冶職人<br>`blacksmith` | 変更なし | 役割「職人」、世界観「西洋ファンタジー」 |
| 宇宙作業の冷却アンダースーツ<br>`space_undersuit` | 変更なし | 世界観「近未来・SF」 |
| 環状関節の宇宙飛行士<br>`pressure_suit_astronaut` | 変更なし | 世界観「近未来・SF」 |
| ヴェネツィアの仮面祭<br>`venetian_carnival` | 変更なし | 着用場面「仮面舞踏会」、世界観「歴史西洋風」 |
| 消防士<br>`firefighter` | 世界観「現代」 | 着用場面「仕事」 |
| キルティング胴着の衛兵<br>`gambeson_guard` | 変更なし | 役割「近衛」、世界観「西洋ファンタジー」 |
| 忍び<br>`shinobi` | 変更なし | 役割「暗殺者」、世界観「和風」 |
| 狩衣の陰陽師<br>`onmyoji_kariginu` | 変更なし | 着用場面「儀式」、役割「呪術師」、世界観「和風」 |
| 海賊船長<br>`pirate_captain` | 世界観「現代」 | 着用場面「航海」、役割「船乗り」 |
| 神父のカソック<br>`priest_cassock` | 世界観「現代」 | 役割「聖職者」 |
| 吟遊詩人のダブレット<br>`doublet_bard` | 変更なし | 役割「音楽家」、世界観「歴史西洋風」 |
| タキシードの正装<br>`tuxedo_formal` | 世界観「現代」 | 着用場面「祝祭・パーティー」 |
| レザーライダース<br>`biker_leather` | 世界観「現代」 | — |
| デニムジャケット<br>`denim_jacket_daily` | 世界観「現代」 | — |
| モッズパーカ<br>`mods_parka` | 世界観「現代」 | — |
| トラックスーツ<br>`track_suit_sport` | 世界観「現代」 | — |
| フライトジャケット<br>`bomber_jacket` | 世界観「現代」 | — |
| フード付きバスローブ<br>`bathrobe_rest` | 世界観「現代」 | 着用場面「休息・私室」 |
| シェルワニの礼装<br>`sherwani_formal` | 世界観「現代」 | 着用場面「結婚式」 |
| クルタ<br>`kurta_casual` | 世界観「現代」 | — |
| 織りのポンチョ<br>`andean_poncho` | 世界観「現代」 | 着用場面「旅」 |
| キトンとヒマティオン<br>`greek_chiton` | 変更なし | 世界観「神話世界」 |
| デール（草原の装束）<br>`steppe_deel` | 世界観「現代」 | 着用場面「旅」 |
| シェフコート<br>`chef_whites` | 世界観「現代」 | 着用場面「仕事」、役割「料理人」 |
| スクラブ<br>`scrubs_medical` | 役割「医師」、世界観「現代」 | 着用場面「仕事」 |
| 密閉型防護服<br>`hazmat_worker` | 世界観「文明崩壊後」 | — |
| フェンシングウェア<br>`fencing_whites` | 世界観「現代」 | — |
| うさ耳カチューシャのルームウェア<br>`bunny_ear_lounge` | 世界観「現代」 | 着用場面「休息・私室」 |
| 猫耳ニット帽のストリート<br>`cat_ear_street` | 世界観「現代」 | 主様式「ストリート」 |
| 狐耳と尾のストール<br>`fox_ear_stole` | 世界観「現代」 | 季節「冬」 |
| クマ耳ベレーのもこもこセット<br>`bear_ear_beret_set` | 世界観「現代」 | 着用場面「休息・私室」 |
| サメ背びれのフードポンチョ<br>`shark_hood_poncho` | 世界観「現代」 | — |
| 恐竜背びれのフードジャケット<br>`dinosaur_hood_jacket` | 世界観「現代」 | — |
| ペンギンのフードケープ<br>`penguin_hood_capelet` | 世界観「現代」 | — |
| ドラゴン角のフードケープ<br>`dragon_hood_cloak` | 変更なし | 世界観「西洋ファンタジー」 |
| ヒツジのフードカーディガン<br>`sheep_hood_cardigan` | 世界観「現代」 | — |
| レッサーパンダのフードジャケット<br>`red_panda_hoodie` | 世界観「現代」 | — |
| ウサギのフランネル寝つなぎ<br>`rabbit_onesie` | 世界観「現代」 | 着用場面「休息・私室」 |
| ネコの前ファスナーつなぎ<br>`cat_onesie` | 世界観「現代」 | 着用場面「休息・私室」 |
| ウーパールーパーのつなぎ<br>`axolotl_onesie` | 世界観「現代」 | 着用場面「休息・私室」 |
| 恐竜のスリーパーつなぎ<br>`dinosaur_sleeper` | 世界観「現代」 | 着用場面「休息・私室」 |
| パンダ配色のつなぎ<br>`panda_onesie` | 世界観「現代」 | 着用場面「休息・私室」 |
| キツネの寝つなぎ<br>`fox_onesie` | 世界観「現代」 | 着用場面「休息・私室」 |
| カピバラのぬいぐるみスーツ<br>`capybara_plush_suit` | 世界観「現代」 | — |
| マルハナバチのぬいぐるみスーツ<br>`bumblebee_plush_suit` | 世界観「現代」 | — |
| コアラのぬいぐるみスーツ<br>`koala_plush_suit` | 世界観「現代」 | — |
| ウサギの完全マスコット<br>`rabbit_mascot` | 世界観「現代」 | 着用場面「パレード」 |
| オオカミの完全マスコット<br>`wolf_mascot` | 世界観「現代」 | 着用場面「舞台」 |
| サメの完全マスコット<br>`shark_mascot` | 世界観「現代」 | — |
| ペンギンの完全マスコット<br>`penguin_mascot` | 世界観「現代」 | — |
| ドラゴンの完全マスコット<br>`dragon_mascot` | 世界観「現代」 | — |
| ゾウの完全マスコット<br>`elephant_mascot` | 世界観「現代」 | — |
| イチゴの完全マスコット<br>`strawberry_mascot` | 世界観「現代」 | — |
| ハンバーガーの完全マスコット<br>`hamburger_mascot` | 世界観「現代」 | — |
| にぎり寿司の完全マスコット<br>`sushi_mascot` | 世界観「現代」 | — |
| カップケーキの完全マスコット<br>`cupcake_mascot` | 世界観「現代」 | 着用場面「祝祭・パーティー」 |
| シマウマ縞のテーラード<br>`zebra_tailored_suit` | 世界観「現代」 | — |
| クジャク扇パネルのイブニング<br>`peacock_fan_gown` | 変更なし | 着用場面「舞踏会」、世界観「童話世界」 |
| コイと波の和装<br>`koi_wave_wrap` | 変更なし | 世界観「和風」 |
| ヘビ鱗のテックウェア<br>`serpent_scale_techwear` | 世界観「現代」 | 主様式「テックウェア」 |
| チョウのプリーツケープドレス<br>`butterfly_cape_dress` | 変更なし | 世界観「童話世界」 |
| カエルの雨具セット<br>`frog_rain_set` | 世界観「現代」 | — |

## 新規採用時の英文差分

短縮版138件、詳細版138件、Markdown版142件が変わる。以下は変更した142件の実出力を形式ごとに比較したもの。残り68件の英文は全形式で一致した。日本語構造一覧でも142件で該当する設定が外れる。

「−」は削除した語句・行、「→」は置き換えを示す。Markdownの差分では空行を省略した。区分内の全項目が未指定になると、生成器は `## Concept / Style` の見出しも省く。

| 衣装 | 短縮版 | 詳細版 | Markdown版 |
|---|---|---|---|
| デイリーカジュアル | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Role: commoner` |
| オフィス・ビジネス | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Role: office worker` |
| 学ラン | − `modern school` | − `modern` | − `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Occasion: everyday wear`<br>− `- Role: student` |
| セーラー服 | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Occasion: everyday wear`<br>− `- Role: student` |
| 現代ベーシック | 同一 | 同一 | − `- Era: contemporary`<br>− `- Role: commoner` |
| 夢かわルームウェア | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Role: commoner` |
| クラシックバニー | − `modern stage` | − `modern stage` | − `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Occasion: festive`<br>− `- Role: stage performer` |
| 前開き逆バニー | − `modern stage` | − `modern stage` | − `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Occasion: festive`<br>− `- Role: stage performer` |
| 白衣 | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Role: office worker` |
| 架空の警察官風 | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Era: contemporary` |
| マフィア風 | − `modern noble` | − `modern noble` | − `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Occasion: festive`<br>− `- Role: noble` |
| 旗袍（チャイナドレス） | − `courtly` | − `courtly` | − `- Occasion: festive`<br>− `- Role: imperial courtier` |
| 人魚 | − `traveler` | − `traveler` | − `- Occasion: ritual`<br>− `- Role: traveler` |
| 童貞を殺すセーター | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Occasion: everyday wear`<br>− `- Role: commoner` |
| 戦闘後の傷んだ衣装 | − `fantasy` | − `fantasy` | − `- Setting: fantasy` |
| 雨に濡れた制服 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Era: contemporary`<br>− `- Occasion: everyday wear` |
| 使い込まれた作業着 | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Era: contemporary` |
| 血痕の付いた白衣 | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Era: contemporary` |
| ゆったりニットとロングスカート | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| サスペンダーの休日服 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 冬のお出かけロングコート | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| リネンシャツとワイドパンツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| シルクのパジャマセット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ベスト付きカフェ店員 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| エプロン姿の花屋 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 詰襟のホテルスタッフ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 飛行服のパイロット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ケープ付き学園制服 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 三つ揃えの正統派執事 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 燕尾服の宮廷従者 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 短いケープのメイド | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ロングベストの従者 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ゴシックな燕尾服 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 歯車金具のスチームパンク服 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ダークアカデミアのロングコート | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 多層ベルトのサイバーパンク服 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 左右非対称のモード服 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 王子系アイドル衣装 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| サーカスの団長服 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 仮面舞踏会のドレス | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| スパンコールのステージスーツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| マント付きマジシャン衣装 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 雪を払った冬の外套 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 砂埃の旅装 | − `fantasy` | − `fantasy` | − `## Concept / Style`<br>− `- Setting: fantasy` |
| 絵の具が付いた画家の作業着 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 継ぎ当てのあるマント | − `fantasy` | − `fantasy` | − `## Concept / Style`<br>− `- Setting: fantasy` |
| 細身のスーツ | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Role: office worker` |
| ノーネクタイのスーツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: festive`<br>− `- Role: office worker` |
| ダブルのスーツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: festive`<br>− `- Role: office worker` |
| トレンチコートとスーツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: investigation`<br>− `- Role: detective` |
| カーディガンとシャツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: everyday wear`<br>− `- Role: scholar` |
| タートルネックとジャケット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: workwear`<br>− `- Role: scholar` |
| セーターとマフラー | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: everyday wear`<br>− `- Role: commoner` |
| 開襟アロハシャツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: everyday wear`<br>− `- Role: commoner` |
| オーバーサイズTシャツとワイドパンツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: everyday wear`<br>− `- Role: commoner` |
| ジップパーカーと無地のTシャツ | − `modern` | `A modern` → `An` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: everyday wear`<br>− `- Role: commoner` |
| 開襟シャツとTシャツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: everyday wear`<br>− `- Role: commoner` |
| 野戦服 | − `officer` | − `officer` | − `- Role: military officer` |
| 刑事のコート | − `modern` | − `modern` | − `- Setting: modern` |
| 堕天の装束 | 同一 | 同一 | − `- Occasion: ritual`<br>− `- Role: mage` |
| 着崩した着物 | 同一 | 同一 | − `- Occasion: everyday wear`<br>− `- Role: commoner` |
| かりゆし | 同一 | 同一 | − `- Role: commoner` |
| ケンテ織りのストール | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Role: commoner` |
| バティックシャツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: everyday wear`<br>− `- Role: commoner` |
| 紐ビキニ | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Role: commoner` |
| ハーネスと開襟シャツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: festive`<br>− `- Role: commoner` |
| 都会派ユーティリティベスト | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: workwear`<br>− `- Role: commoner` |
| ミニマルなジャケットの装い | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern`<br>− `- Occasion: workwear`<br>− `- Role: commoner` |
| 曲線意匠の礼服 | − `noble` | − `noble` | − `- Role: noble` |
| バンドガラ | − `modern noble` | − `modern noble` | − `- Setting: modern`<br>− `- Role: noble` |
| サンタクロース | − `modern` | − `modern` | − `- Setting: modern` |
| ミニスカサンタ風 | − `modern` | − `modern` | − `- Setting: modern` |
| クリスマスのテーラードスーツ | − `modern` | − `modern` | − `- Setting: modern` |
| トナカイの着ぐるみパジャマ | − `modern` | − `modern` | − `- Setting: modern` |
| 雪だるまのフードつなぎ | − `modern` | − `modern` | − `- Setting: modern` |
| 雪遊びのダウンとビブ | − `modern` | − `modern` | − `- Setting: modern` |
| トナカイ枝角ボタンの冬コート | − `modern` | − `modern` | − `- Setting: modern` |
| パンプキンパッチのオーバーオール | − `modern` | − `modern` | − `- Setting: modern` |
| スケルトンのジャンプスーツ | − `modern` | − `modern` | − `- Setting: modern` |
| サロンを巻いた水着 | − `modern` | − `modern` | − `- Setting: modern` |
| サーフのタオルポンチョ | − `modern` | − `modern` | − `- Setting: modern` |
| リゾートのグアヤベラ | − `modern` | − `modern` | − `- Setting: modern` |
| フルウェットスーツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| バレンタインのショコラティエ | − `modern` | − `modern` | − `- Setting: modern` |
| バレンタインのハートロリータ | − `modern` | − `modern` | − `- Setting: modern` |
| ホワイトデーの給仕燕尾服 | − `modern` | − `modern` | − `- Setting: modern` |
| 菱形パネルの道化 | − `modern` | − `modern` | − `- Setting: modern` |
| ドラムメジャーの舞台コート | − `modern` | − `modern` | − `- Setting: modern` |
| 平板チュチュのバレエ衣装 | − `modern` | − `modern` | − `- Setting: modern` |
| ケープ付き空中演技ユニタード | − `modern` | − `modern` | − `- Setting: modern` |
| チアリーダー | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ナース風の衣装 | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 養蜂家 | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Role: artisan` |
| 消防士 | − `modern` | − `modern` | − `- Setting: modern` |
| 海賊船長 | − `modern` | − `modern` | − `- Setting: modern` |
| 神父のカソック | − `modern` | − `modern` | − `- Setting: modern` |
| タキシードの正装 | − `modern` | − `modern` | − `- Setting: modern` |
| レザーライダース | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| デニムジャケット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| モッズパーカ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| トラックスーツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| フライトジャケット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| フード付きバスローブ | − `modern` | − `modern` | − `- Setting: modern` |
| シェルワニの礼装 | − `modern` | − `modern` | − `- Setting: modern` |
| クルタ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 織りのポンチョ | − `modern` | − `modern` | − `- Setting: modern` |
| デール（草原の装束） | − `modern` | − `modern` | − `- Setting: modern` |
| シェフコート | − `modern` | − `modern` | − `- Setting: modern` |
| スクラブ | − `modern` | − `modern` | − `- Setting: modern`<br>− `- Role: doctor` |
| 密閉型防護服 | − `post apocalypse` | − `post apocalypse` | − `## Concept / Style`<br>− `- Setting: post apocalypse` |
| フェンシングウェア | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| うさ耳カチューシャのルームウェア | − `modern` | − `modern` | − `- Setting: modern` |
| 猫耳ニット帽のストリート | − `modern` | − `modern` | − `- Setting: modern` |
| 狐耳と尾のストール | − `modern` | − `modern` | − `- Setting: modern` |
| クマ耳ベレーのもこもこセット | − `modern` | `A modern` → `An` | − `- Setting: modern` |
| サメ背びれのフードポンチョ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| 恐竜背びれのフードジャケット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ペンギンのフードケープ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ヒツジのフードカーディガン | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| レッサーパンダのフードジャケット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ウサギのフランネル寝つなぎ | − `modern` | − `modern` | − `- Setting: modern` |
| ネコの前ファスナーつなぎ | − `modern` | − `modern` | − `- Setting: modern` |
| ウーパールーパーのつなぎ | − `modern` | − `modern` | − `- Setting: modern` |
| 恐竜のスリーパーつなぎ | − `modern` | − `modern` | − `- Setting: modern` |
| パンダ配色のつなぎ | − `modern` | − `modern` | − `- Setting: modern` |
| キツネの寝つなぎ | − `modern` | − `modern` | − `- Setting: modern` |
| カピバラのぬいぐるみスーツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| マルハナバチのぬいぐるみスーツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| コアラのぬいぐるみスーツ | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ウサギの完全マスコット | − `modern` | − `modern` | − `- Setting: modern` |
| オオカミの完全マスコット | − `modern` | − `modern` | − `- Setting: modern` |
| サメの完全マスコット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ペンギンの完全マスコット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ドラゴンの完全マスコット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ゾウの完全マスコット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| イチゴの完全マスコット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ハンバーガーの完全マスコット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| にぎり寿司の完全マスコット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| カップケーキの完全マスコット | − `modern` | − `modern` | − `- Setting: modern` |
| シマウマ縞のテーラード | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |
| ヘビ鱗のテックウェア | − `modern` | − `modern` | − `- Setting: modern` |
| カエルの雨具セット | − `modern` | − `modern` | − `## Concept / Style`<br>− `- Setting: modern` |

## 再検証

比較元を別のディレクトリにチェックアウトして実行する。1本目は各プリセットの許可された削除項目と、新しい初期値を旧版の生成器に渡した4形式の結果を照合する。2本目は旧版で作成した衣装、撮影設定、旧JSONからの移行結果を照合する。

```sh
node scripts/compare-preset-defaults.cjs ../previous
node scripts/compare-outputs.cjs ../previous
```
