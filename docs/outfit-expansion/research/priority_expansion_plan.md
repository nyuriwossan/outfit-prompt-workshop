# priority_expansion_plan

作成: Manus AI

優先対象は172候補から選んだ50件です。点数は元候補の優先度を基礎に、C/Dの未充足構造、完全マスコットの現行モデル不足を加点して決めました。A/Bは「すぐ基本衣装を増やす」意味ではなく、既存IDを利用する発見用プリセットや検索導線として優先します。宇宙服の冷却・外殻のような機能構造、儀礼用タバード、サンタの毛皮縁外衣、PPE、完全マスコットの頭・胴・手・足・視界・換気という区別は公開資料で確認しました。[1] [2] [3] [4] [5]

## 先に入れる理由

最小改修でバリエーションを増やす順は、既存IDだけで組めるA/Bの発見用プリセット、既存カテゴリに入るCの基本衣装、最後に専用構造を要するDです。完全マスコットは候補数を増やすだけでは品質が上がらないため、専用データモデルをまとめて導入するまでプリセット化しません。

## 優先50件

1. **`cupcake_full_head_mascot` — カップケーキ完全マスコットスーツ**（100/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 100/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；スイーツを明示し、絞りクリームと紙カップの上下二層シルエットをもつ独自のフルマスコット案。
2. **`dragon_full_head_mascot` — ドラゴン完全マスコットスーツ**（100/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 100/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；既存の竜の翼・角・尾は身体部品用であり、フルヘッドとパッド胴を一括制御する新カテゴリの価値が高い。
3. **`hamburger_full_head_mascot` — ハンバーガー完全マスコットスーツ**（100/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 100/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；食品着ぐるみの代表として、多層断面を持つ胴体とフルヘッドを同時に扱える。
4. **`penguin_full_head_mascot` — ペンギン完全マスコットスーツ**（100/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 100/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；ケープジャケットと異なり、顔・手・足まで完全にキャラクター造形となる。
5. **`pumpkin_full_head_mascot` — カボチャ完全マスコットスーツ**（100/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 100/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；野菜カテゴリと秋イベントをカバーし、分割された房状パッドという独立した胴体構造がある。
6. **`rabbit_full_head_mascot` — ウサギ完全マスコットスーツ**（100/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 100/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；最も認知度が高い完全マスコットの基準案。既存の顔出しバニー衣装との排他ルールを検証しやすい。
7. **`shark_full_head_mascot` — サメ完全マスコットスーツ**（100/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 100/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；背びれポンチョと同一視されない、水生動物の完全被覆・フィン四肢構造を追加できる。
8. **`strawberry_full_head_mascot` — イチゴ完全マスコットスーツ**（100/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 100/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；果物を明示的に含める高認知度の案で、動物以外の丸型フルヘッド構造にも展開できる。
9. **`wolf_full_head_mascot` — オオカミ完全マスコットスーツ**（100/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 100/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；顔出しのオオカミ耳フードとは別に、頭部の彫刻・視界メッシュ・別体足部を必須化する代表例。
10. **`axolotl_gill_frill_onesie` — ウーパールーパーえら襟つなぎ**（96/100、C、追加先: `水生生物用の新規一体服（新規構造: animal_hood.axolotl、gill_frills、flat_fin_tail_panel）`）
   - 構造: form: えらフリルをフード外周に持つ一体服、平たい尾びれパネル、ひれ袖／face_visibility: visible／closure: zip_front
   - 既存活用: work_coveralls
   - 先行理由: 96/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル C による未充足構造の補正 6 点；両生類のえらフリルと平尾で、耳・毛皮中心の候補群にない独自の生物構造を補える。
11. **`bumblebee_padded_plush_suit` — マルハナバチ羽根付きぬいぐるみスーツ**（96/100、C、追加先: `昆虫用の顔出しぬいぐるみスーツ（新規構造: padded_suit.belly、soft_antennae、wing_panels.small）`）
   - 構造: form: 縞腹パッド、開顔フード、短い触角、小型翼パネル／face_visibility: visible／padding: rounded_belly_padding
   - 既存活用: oversized_plush_hoodie_set
   - 先行理由: 96/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル C による未充足構造の補正 6 点；四足動物ではない人気生物を追加し、翼を背中の小型パネルとして制御できる。
12. **`capybara_boxy_plush_suit` — カピバラ箱形ぬいぐるみスーツ**（96/100、C、追加先: `箱形パッドを持つ新規ぬいぐるみ風スーツ（新規構造: padded_suit.boxy、animal_hood.capybara、hoof_mitts）`）
   - 構造: form: 箱形胴パッド、開顔フード、四角い鼻先パネル、蹄形ミトン／face_visibility: visible／padding: boxy_body_padding
   - 既存活用: oversized_plush_hoodie_set
   - 先行理由: 96/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル C による未充足構造の補正 6 点；近年人気が高く、丸いマスコット体形とは異なる横長・箱形のパッド設計を追加できる。
13. **`dinosaur_spine_hooded_jacket` — 恐竜背びれフードジャケット**（96/100、C、追加先: `新規 animal_hooded_jacket（新規構造: animal_hood.dinosaur、back_spines.soft）`）
   - 構造: form: 前開きジャケット、背中を縦走する柔らかい背びれ、顔出しフード／face_visibility: visible／hood: open_face_hood
   - 既存活用: hoodie_and_cargo
   - 先行理由: 96/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル C による未充足構造の補正 6 点；背びれを服の背面へ固定するため、恐竜フルヘッドと異なる安定したシルエットになる。
14. **`dinosaur_spined_sleepers` — 恐竜背びれスリーパーつなぎ**（96/100、C、追加先: `背びれ連続型の新規パジャマサブタイプ（新規構造: pajama_onesie、back_spines.continuous_soft）`）
   - 構造: form: フードから尾まで連続する柔らかい背びれを持つ寝つなぎ／face_visibility: visible／back_profile: continuous_soft_spines
   - 既存活用: work_coveralls
   - 先行理由: 96/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル C による未充足構造の補正 6 点；同じ恐竜でもフードジャケットとは異なり、背びれがフードから裾まで連続する寝具向け構造。
15. **`shark_fin_hooded_poncho` — サメ背びれフードポンチョ**（96/100、C、追加先: `新規 hooded_poncho サブタイプ（新規構造: animal_hood.shark、back_fin、hood_face_opening）`）
   - 構造: form: 顔用開口を持つ前開きポンチョ、背びれ、腹側パネル／face_visibility: visible／hood: open_face_hood
   - 既存活用: hoodie_and_cargo、rash_guard_set
   - 先行理由: 96/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル C による未充足構造の補正 6 点；サメらしさを背びれと腹側パネルへ置き、頭部を覆うサメマスコットと明確に別れる。
16. **`venetian_bauta_cloak` — ヴェネツィア・バウタクローク**（96/100、C、追加先: `new_base_required`）
   - 構造: 黒タフタのフード付きクロークの縁に幅広レースを置き、半面bauta maskを別部材として首元で組み合わせる。maskをボールガウンへ付けるだけのレシピとは異なるフード外衣。
   - 既存活用: cape_coat、masquerade_gown
   - 先行理由: 96/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル C による未充足構造の補正 6 点；Met資料で確認した歴史的な部材組合せを、既存の目元仮面プリセットとは別の外衣構造として追加する。
17. **`elephant_full_head_mascot` — ゾウ完全マスコットスーツ**（93/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 93/100。原レポート優先度 P1 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；長い鼻と大型耳という哺乳類の中でも特異な頭部造形を追加し、汎用フルヘッドの試金石になる。
18. **`sushi_full_head_mascot` — にぎり寿司完全マスコットスーツ**（93/100、D、追加先: `新設する mascot カテゴリ、専用頭部・胴体・手足コンポーネント、部品別プロンプト結合（新規構造: mascot_head、mascot_body、mascot_hands、mascot_feet、mascot_vision_mesh、mascot_ventilation）`）
   - 構造: form: 独立フルヘッド、パッド入り胴体、別体手袋、別体足部／head_attachment: performer_worn_full_head／body_volume: padded_character_silhouette／face_visibility: covered
   - 既存活用: なし
   - 先行理由: 93/100。原レポート優先度 P1 を基礎点に採用；再現性ラベル D による未充足構造の補正 10 点；完全マスコットで現行に頭部一体・視界メッシュ・換気のモデルがないため加点；料理の層と帯状海苔をもつ食品案で、ハンバーガーと異なる米粒状・上載せ構造を追加する。
19. **`cat_ear_tail_street_set` — ネコ耳＋尻尾ストリートセット**（92/100、B、追加先: `既存カジュアル衣装＋尾特殊パーツ（新規構造: animal_ears.beanie、animal_paw_gloves）`）
   - 構造: form: 耳付きニット帽、ベルト装着尻尾、指先の出る手袋／face_visibility: visible／tail_attachment: belt_loop
   - 既存活用: hoodie_and_cargo
   - 先行理由: 92/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル B による未充足構造の補正 2 点；既存 tail_cat を再利用でき、耳と尻尾を独立制御する代表例になる。
20. **`cat_zip_fleece_onesie` — ネコ前ファスナーフリースつなぎ**（92/100、B、追加先: `既存つなぎをパジャマ向けに軟質化（新規構造: pajama_onesie、animal_hood.cat、tail_attachment.sewn）`）
   - 構造: form: 前ファスナー一体服、開顔耳フード、腹側配色パネル、縫い付け尾／face_visibility: visible／closure: zip_front
   - 既存活用: work_coveralls
   - 先行理由: 92/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル B による未充足構造の補正 2 点；前ボタン型と異なる前ファスナー構造で、ネコ尾を衣服の縫い付け部品として扱う。
21. **`dragon_horn_hooded_cloak` — ドラゴン角フードクローク**（92/100、B、追加先: `既存フードローブと dragon horn・wing を衣装部品化（新規構造: animal_hood.dragon、wing_panels.folded）`）
   - 構造: form: 開顔フード付きクローク、柔らかい角、肩に畳まれた翼パネル／face_visibility: visible／hood: open_face_hood
   - 既存活用: traveling_robe
   - 先行理由: 92/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル B による未充足構造の補正 2 点；既存の竜角・竜翼IDを衣服側の小型パネルへ限定して再利用できる。
22. **`fox_ear_tail_stole_set` — キツネ耳＋尾ストールセット**（92/100、B、追加先: `既存アウターと fox tail の組合せ（新規構造: animal_ears.headband、tail_attachment.shoulder_stole）`）
   - 構造: form: 耳カチューシャに長尾をストールとして組み合わせる重ね小物／face_visibility: visible／tail_attachment: shoulder_stole
   - 既存活用: fur_coat、long_coat
   - 先行理由: 92/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル B による未充足構造の補正 2 点；既存 tail_fox の活用価値が高く、腰尾と異なるストール構造が明確。
23. **`rabbit_ear_pom_tail_accessory` — ウサギ耳＋ポンポン尻尾アクセサリー**（92/100、B、追加先: `既存バニー衣装プリセットの派生（新規構造: animal_ears.headband、tail_attachment.clip_on）`）
   - 構造: form: 既存衣装に重ねる耳カチューシャ・腰付け尻尾・手首小物／face_visibility: visible／tail_attachment: clip_on_waist
   - 既存活用: classic_bunny_suit、open_front_reverse_bunny_suit
   - 先行理由: 92/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル B による未充足構造の補正 2 点；既存のバニー系と最も近く、顔出し動物アクセサリー群の入口として高頻度に使える。
24. **`rabbit_flannel_sleep_onesie` — ウサギフランネル寝つなぎ**（92/100、B、追加先: `既存パジャマの一体服派生（新規構造: pajama_onesie、animal_hood.rabbit、tail_attachment.sewn）`）
   - 構造: form: 前ボタン一体服、開顔フード、足首リブ、後ろポンポン／face_visibility: visible／closure: button_front
   - 既存活用: buttoned_pajama_set、dreamy_pastel_pajamas
   - 先行理由: 92/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル B による未充足構造の補正 2 点；顔出しの動物パジャマを代表する基本形で、実装時の基準シルエットになる。
25. **`reindeer_antler_hooded_cardigan` — トナカイ枝角フードカーディガン**（92/100、B、追加先: `既存ふわふわカーディガンと既存枝角概念の季節派生（新規構造: animal_hood.reindeer、soft_antlers）`）
   - 構造: form: 前開きカーディガン、開顔フードに柔らかい枝角、季節柄パネル／face_visibility: visible／hood: open_face_hood
   - 既存活用: fuzzy_cardigan_lounge_set
   - 先行理由: 92/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル B による未充足構造の補正 2 点；冬イベントに直結し、硬質な角ではなく柔らかいフード付属品として安全に表現できる。
26. **`reindeer_tailored_winter_coat` — トナカイ枝角ボタンの冬コート**（92/100、B、追加先: `既存ロングコートの意匠派生（新規構造: animal_inspired_hardware.antler_button）`）
   - 構造: form: 通常の顔出しコートへ枝角形ボタン・毛皮襟・配色を抽象化して載せる／face_visibility: visible／literal_animal_parts: none
   - 既存活用: long_coat、fur_coat
   - 先行理由: 92/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル B による未充足構造の補正 2 点；枝角を頭に着けず、留め具へ再解釈するため、トナカイフード型との混同が起きない。
27. **`christmas_elf_tunic` — クリスマスエルフ・チュニック**（90/100、A、追加先: `new_base_required`）
   - 構造: 尖り衿、ギザギザ裾のチュニック、縞レギンス、鈴付きベルト、反り靴から成る。通常シャツ＋パンツと異なり、裾と衿の鋸歯形状を主構造にする。
   - 既存活用: adventurer_outfit、hoodie_and_cargo
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；サンタ以外のクリスマス役衣装を、色ではなく明確な輪郭で補完する。
28. **`down_parka_bib_set` — ダウンパーカ＋ビブパンツ**（90/100、A、追加先: `new_base_required`）
   - 構造: キルティングされたダウンパーカと、胸当て＋肩紐を持つ中綿ビブパンツの二部式。long_coatの単体外衣ではなく、雪用の断熱レイヤー。
   - 既存活用: long_coat、snow_winter_coat
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；既存の冬コートでは不足する、防寒機能が部材として明確な雪用セット。
29. **`halloween_witch_coat_dress` — ハロウィン魔女コートドレス**（90/100、A、追加先: `new_base_required`）
   - 構造: 尖りフードを首から連続させたコートドレスに編み上げ胴、非対称の裾、バックルベルトを組み込む。単なる黒ドレスや魔女モチーフではない。
   - 既存活用: gothic_dress、mage_robe
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；ハロウィンの代表需要に対し、既存gothic_dressとmage_robeの中間を埋める明確な外衣一体構造。
30. **`harvest_dirndl` — 収穫祭ディアンドル**（90/100、A、追加先: `new_base_required`）
   - 構造: スクエアネックのブラウス、編み上げ胴着、ギャザースカート、独立エプロンの固定四部構造。一般folkやメイド服とは衿・胴着・エプロンの関係が異なる。
   - 既存活用: folk、maid_dress
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；収穫祭の典型的な層構造を明示でき、既存の抽象的folkを実用的に細分化する。
31. **`jinbei_set` — 甚平セット**（90/100、A、追加先: `new_base_required`）
   - 構造: 前合わせを紐で結ぶ半袖上衣と膝丈ハーフパンツの二部式。浴衣の一枚身頃や法被の開前立てとは異なる。
   - 既存活用: yukata、linen_shirt_wide_trousers
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；夏祭り向け和装の主要な二部式が未収録で、浴衣との構造差も大きい。
32. **`lederhosen_harvest_set` — 収穫祭レーダーホーゼンセット**（90/100、A、追加先: `new_base_required`）
   - 構造: 革の膝丈ブリーチズにH字サスペンダーを直結し、襟なしシャツと膝丈靴下を合わせる。通常のtrousersやsuspender_shirt_trousersとは丈と吊り構造が異なる。
   - 既存活用: suspender_shirt_trousers、shirt_and_trousers
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；収穫祭で女性向けだけに偏らない、既存トラウザーズと大きく異なる下半身構造。
33. **`reindeer_hooded_onesie` — トナカイ・フード付き着ぐるみ**（90/100、A、追加先: `new_base_required`）
   - 構造: 前ジップの全身フリース一体服に、角が付くフード、蹄形カフ、短い尾を連結する。耳だけのアクセサリーではない全身シルエット。
   - 既存活用: oversized_plush_hoodie_set、buttoned_pajama_set
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；トナカイを動物耳アクセサリーで済ませず、冬イベントに必要な全身衣装として提供できる。
34. **`santa_fur_trim_suit` — サンタ衣装**（90/100、A、追加先: `new_base_required`）
   - 構造: 白い毛皮縁のコート、同素材のトラウザーズ、幅広バックルベルト、帽子、ブーツをセットで持つ。テーラードジャケットを基礎とするChristmas suitとは別のコート構造。
   - 既存活用: long_coat、tailcoat_suit
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；要求どおりChristmas suitとは別構造。既存にない季節アイコンで、生成条件も具体的。
35. **`spring_festival_happi_coat` — 春祭り法被コート**（90/100、A、追加先: `new_base_required`）
   - 構造: 前開きの直線身頃、対照色の衿、腰紐、脇スリットを持つ短い法被。着物や浴衣と異なり、帯で打ち合わせを閉じず開襟の外衣として着る。
   - 既存活用: yukata、kimono
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；春祭と夏祭を横断できるのに既存和装にない、明快で生成しやすい外衣構造。
36. **`valentine_chocolatier_uniform` — バレンタイン・ショコラティエ制服**（90/100、A、追加先: `new_base_required`）
   - 構造: ダブルブレストのコックコート、腰エプロン、チェックトラウザーズ、ネッカチーフの職業服。ハート柄ではなく、前合わせとエプロンが主構造。
   - 既存活用: stand_collar_service_uniform、apron_shirt_outfit
   - 先行理由: 90/100。原レポート優先度 P0 を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；バレンタインを色やハートだけで表さず、菓子職人という明確な作業衣構造を追加できる。
37. **`cosplay_animal_playsack` — 抽象動物プレイサック**（85/100、A、追加先: `basic_garment`）
   - 構造: 袋状チュニックの前面に抽象動物パネルを刷り、目と腕のための開口部を設ける。
   - 既存活用: なし
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；既存にない袋状シルエットで、動物題材を固有キャラクターなしに扱える。
38. **`cosplay_apiary_veil_smock` — ベールフードの養蜂作業スモック**（85/100、A、追加先: `basic_garment`）
   - 構造: フードとメッシュベールを一体化したゆとりのあるスモックに、絞り袖口と足首までのパンツを合わせる。
   - 既存活用: work_coveralls、forest_herbalist
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；既存のつなぎ服と異なり、ベール一体フードと絞り部を主構造に持つ。
39. **`cosplay_cooling_tube_undersuit` — 冷却チューブの宇宙作業アンダースーツ**（85/100、A、追加先: `basic_garment`）
   - 構造: 伸縮アンダースーツ全体に管状チャンネルとメッシュ換気帯を走らせ、腰に接続口を置く。
   - 既存活用: techwear、competition_swimsuit
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；NASA資料の冷却衣の管状構造を使い、既存テックウェアにはない機能的な下層を追加できる。
40. **`cosplay_data_courier_modular_poncho` — データ運びのモジュラーポンチョ**（85/100、A、追加先: `preset`）
   - 構造: 非対称ポンチョに着脱式の矩形ポケットパネルを付け、脇ジッパーと短いフードを備える。
   - 既存活用: cyber_multi_belt、techwear
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；多層ベルトではなく、面として着脱する矩形ポケットとポンチョを主構造にできる。
41. **`cosplay_drum_major_stage_coat` — 飾り組紐のドラムメジャー舞台コート**（85/100、A、追加先: `preset`）
   - 構造: 二列前開きの短い舞台コートに飾り組紐、肩飾り紐、後ろ裾テールを付ける。
   - 既存活用: royal_uniform、sequin_stage_suit
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；軍装ではなく、組紐留めと舞台用の短いテールを核にした演奏ショー用プリセットになる。
42. **`cosplay_forge_split_apron_suit` — 分割前垂れの鍛冶作業スーツ**（85/100、A、追加先: `basic_garment`）
   - 構造: キャンバスチュニックの前に中央分割したロングエプロンを重ね、脚絆と長手袋を追加する。
   - 既存活用: apron_shirt_outfit、work_coveralls
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；通常の作業用エプロンより長い分割前垂れと脚絆で、全身の層構造が明確になる。
43. **`cosplay_fortune_cookie_tabard` — フォーチュンクッキーの折りタバード**（85/100、A、追加先: `basic_garment`）
   - 構造: 二枚のプリーツ三角パネルを前後に下げ、中央の折り目でクッキー風の殻形を作る。
   - 既存活用: sweets_and_witch
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；食品モチーフを色替えではなく、折り三角タバードの立体的な構造として追加できる。
44. **`cosplay_harlequin_panel_jumpsuit` — 菱形パネルの道化舞台服**（85/100、A、追加先: `basic_garment`）
   - 構造: 菱形の布パネルを交互に接いだ一体服に、小さな立ちラフ襟と袖口を合わせる。
   - 既存活用: circus_ringmaster、asymmetric_mode
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；リングマスター服ではない、菱形パネルの一体服として明確な舞台シルエットを追加できる。
45. **`cosplay_heraldic_tabard` — 抽象紋章のタバード**（85/100、A、追加先: `basic_garment`）
   - 構造: 肩から落ちる前後四面の短いT字型サーコート。脇を開け、腰ひもで固定する。
   - 既存活用: royal_uniform、layered_ritual_robes
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；既存の王族制服とは異なる、短いT字外衣という明確なシルエットを追加できる。
46. **`cosplay_houseplant_pot_apron` — 鉢植えハウスプラントのエプロン衣装**（85/100、A、追加先: `preset`）
   - 構造: 丸い鉢形エプロンをチュニックに重ね、葉の層襟、肩葉タブ、土入れ風ポケット帯を付ける。
   - 既存活用: plants_and_vines、florist_apron
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；植物モチーフを単なる蔦柄から、鉢形前掛けと葉層襟を持つ汎用仮装セットへ拡張できる。
47. **`cosplay_patchwork_scarecrow_overalls` — つぎはぎ案山子のオーバーオール**（85/100、A、追加先: `preset`）
   - 構造: ゆるい胸当てオーバーオールに大きな当て布、藁風の袖口バンド、短いベストを重ねる。
   - 既存活用: work_coveralls、mended_traveler
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；作業つなぎを基礎にしつつ、胸当て・つぎ当て・藁風カフという物語的な構造追加が明瞭。
48. **`cosplay_plate_tutu_costume` — 平板ネットの舞台チュチュ衣装**（85/100、A、追加先: `basic_garment`）
   - 構造: 平らに広がる多層ネットスカートと、分割装飾した胴部、短いラップジャケットを組み合わせる。
   - 既存活用: idol_stage_outfit、ball_gown
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；フレアスカート中心のアイドル衣装と違い、平板状の多層ネットという輪郭が明確。
49. **`cosplay_popcorn_box_tunic` — ポップコーン箱チュニック**（85/100、A、追加先: `basic_garment`）
   - 構造: 箱型の矩形チュニックに縦パネル線、波型上端、肩の小さな粒状パフを組み合わせる。
   - 既存活用: なし
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；矩形の箱チュニックと粒状肩パフは、既存衣装にはない明快な日用品型シルエット。
50. **`cosplay_pufferfish_inflatable_cape` — フグ風ふくらみケープ**（85/100、A、追加先: `basic_garment`）
   - 構造: 放射状キルトで膨らみを作る短い丸型ケープに、側面のひれ風タブを付ける。
   - 既存活用: ocean_shell_coral、cape_coat
   - 先行理由: 85/100。原レポート優先度 high を基礎点に採用；再現性ラベル A による未充足構造の補正 0 点；動物題材を耳や尾ではなく、丸いキルト外衣と放射チャンネルの輪郭で表現できる。

## 実装順の扱い

A/Bは既存の基本衣装・部位・特殊パーツを新しい基本衣装として複製しません。イベント名、衣装タイプ、モチーフを検索できるプリセット分類とし、レシピで既存IDを示します。Cは構造差があるものだけを既存カテゴリへ追加します。Dの完全マスコットは頭部完全被覆、視界メッシュ、換気、別体手足を必須にする専用カテゴリへまとめます。

**References**

[1]: https://www.nasa.gov/centers-and-facilities/johnson/spacewalk-spacesuit-basics/ "NASA Spacewalk Spacesuit Basics"
[2]: https://collections.vam.ac.uk/item/O354221/lord-lyon-king/ "V and A Lord Lyon King of Arms tabard"
[3]: https://americanhistory.si.edu/explore/stories/how-santa-brought-coca-cola-cold "Smithsonian Santa history"
[4]: https://mascot-store.com/blogs/mascot-marketing-center/how-mascot-costumes-are-made-inside-the-anatomy-of-a-professional-mascot-suit "Mascot costume anatomy"
[5]: https://www.osha.gov/personal-protective-equipment "OSHA Personal Protective Equipment"
