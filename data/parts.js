/* 衣装プロンプト工房 / data/parts.js
 * 部位スロットの定義と選択肢。garments.js の category.slots が id を参照する。
 * multi:true のスロットは複数選択でき、重複警告の対象になる。
 * MVP最終形は合計100件以上。ここは代表セット。
 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data = CPW.data || {};

  // 複数選択スロットの「層」。利用者には英語のinner/outerではなく日本語で見せる。
  CPW.data.partLayers = [
    { id: 'inner', labelJa: '内側', promptEn: 'worn underneath' },
    { id: 'main', labelJa: '主衣装', promptEn: '' },
    { id: 'outer', labelJa: '外側', promptEn: 'worn over' }
  ];

  // シルエット（9.2 / 19.1 silhouette）
  CPW.data.silhouette = {
    fit: [
    {"id":"tailored","labelJa":"仕立て良く","shortPrompt":"tailored","groupJa":"基本の形"},
    {"id":"fitted","labelJa":"体に沿う","shortPrompt":"body-hugging","groupJa":"基本の形"},
    {"id":"relaxed","labelJa":"ゆったり","shortPrompt":"relaxed fit","groupJa":"基本の形"},
    {"id":"oversized","labelJa":"大きめ","shortPrompt":"oversized","groupJa":"基本の形"},
    {"id":"draped","labelJa":"ドレープ","shortPrompt":"draped","groupJa":"基本の形"},
    {"id":"slim_fit","labelJa":"細身","shortPrompt":"slim fit","groupJa":"形の変化"},
    {"id":"regular_fit","labelJa":"標準","shortPrompt":"regular fit","groupJa":"形の変化"},
    {"id":"loose_fit","labelJa":"ゆるい身幅","shortPrompt":"loose fit","groupJa":"形の変化"},
    {"id":"boxy","labelJa":"ボックス型","shortPrompt":"boxy fit","groupJa":"形の変化"},
    {"id":"cocoon_fit","labelJa":"コクーン","shortPrompt":"cocoon fit","groupJa":"形の変化"},
    {"id":"tapered_fit","labelJa":"先細り","shortPrompt":"tapered fit","groupJa":"形の変化"},
    {"id":"structured_fit","labelJa":"構築的","shortPrompt":"structured fit","groupJa":"形の変化"},
    {"id":"soft_unstructured_fit","labelJa":"柔らかな非構築型","shortPrompt":"soft unstructured fit","groupJa":"形の変化"},
    {"id":"compression_fit","labelJa":"圧着フィット","shortPrompt":"compression fit","groupJa":"形の変化"},
    {"id":"contoured_fit","labelJa":"立体的に沿う","shortPrompt":"contoured fit","groupJa":"形の変化"}
  ],
    upperVolume: [
    {"id":"slim_upper","labelJa":"細身","shortPrompt":"slim upper body","groupJa":"基本の形"},
    {"id":"structured","labelJa":"構築的","shortPrompt":"structured shoulders","groupJa":"基本の形"},
    {"id":"voluminous_upper","labelJa":"膨らみ","shortPrompt":"voluminous upper body","groupJa":"基本の形"},
    {"id":"fitted_upper","labelJa":"上半身に沿う","shortPrompt":"fitted upper silhouette","groupJa":"形の変化"},
    {"id":"natural_upper","labelJa":"自然な上半身","shortPrompt":"natural upper volume","groupJa":"形の変化"},
    {"id":"broad_shoulders","labelJa":"肩幅を広く","shortPrompt":"broad-shouldered silhouette","groupJa":"形の変化"},
    {"id":"rounded_upper","labelJa":"丸みのある上半身","shortPrompt":"softly rounded upper volume","groupJa":"形の変化"},
    {"id":"cape_upper","labelJa":"ケープ状","shortPrompt":"cape-like upper volume","groupJa":"形の変化"},
    {"id":"exaggerated_upper","labelJa":"上半身を大きく強調","shortPrompt":"exaggerated upper volume","groupJa":"形の変化"}
  ],
    lowerVolume: [
    {"id":"slim","labelJa":"細身","shortPrompt":"slim lower body","groupJa":"基本の形"},
    {"id":"flared","labelJa":"広がる","shortPrompt":"flared","groupJa":"基本の形"},
    {"id":"voluminous","labelJa":"大きく膨らむ","shortPrompt":"voluminous skirt","groupJa":"基本の形"},
    {"id":"straight_lower","labelJa":"まっすぐ","shortPrompt":"straight lower silhouette","groupJa":"形の変化"},
    {"id":"tapered_lower","labelJa":"先細り","shortPrompt":"tapered lower silhouette","groupJa":"形の変化"},
    {"id":"relaxed_lower","labelJa":"ゆとりのある下半身","shortPrompt":"relaxed lower volume","groupJa":"形の変化"},
    {"id":"a_line_volume","labelJa":"Aライン","shortPrompt":"A-line volume","groupJa":"形の変化"},
    {"id":"bell_volume","labelJa":"ベル型","shortPrompt":"bell-shaped volume","groupJa":"形の変化"},
    {"id":"exaggerated_lower","labelJa":"下半身を大きく強調","shortPrompt":"exaggerated lower volume","groupJa":"形の変化"}
  ],
    waist: [
    {"id":"fitted_waist","labelJa":"絞る","shortPrompt":"fitted waist","groupJa":"基本の形"},
    {"id":"natural_waist","labelJa":"自然","shortPrompt":"natural waistline","groupJa":"基本の形"},
    {"id":"high_waist","labelJa":"高い位置","shortPrompt":"high waistline","groupJa":"基本の形"},
    {"id":"dropped_waist","labelJa":"低い位置","shortPrompt":"dropped waistline","groupJa":"基本の形"},
    {"id":"low_waist","labelJa":"ローウエスト","shortPrompt":"low waistline","groupJa":"形の変化"},
    {"id":"empire_waist","labelJa":"エンパイア","shortPrompt":"empire waistline","groupJa":"形の変化"},
    {"id":"cinched_waist","labelJa":"強く絞る","shortPrompt":"cinched waist","groupJa":"形の変化"},
    {"id":"loose_waist","labelJa":"ゆとりのある腰回り","shortPrompt":"loose waistline","groupJa":"形の変化"},
    {"id":"elongated_waist","labelJa":"胴長シルエット","shortPrompt":"elongated waist","groupJa":"形の変化"},
    {"id":"corseted_silhouette","labelJa":"コルセット状","shortPrompt":"corseted silhouette","groupJa":"形の変化"}
  ],
    length: [
    {"id":"micro","labelJa":"ごく短い","shortPrompt":"micro length","tags":["micro"],"groupJa":"基本の丈"},
    {"id":"knee","labelJa":"膝丈","shortPrompt":"knee-length","groupJa":"基本の丈"},
    {"id":"midi","labelJa":"ミディ","shortPrompt":"midi length","groupJa":"基本の丈"},
    {"id":"floor","labelJa":"床丈","shortPrompt":"floor-length","tags":["floor"],"groupJa":"基本の丈"},
    {"id":"train","labelJa":"引き裾","shortPrompt":"with a trailing hem","tags":["floor"],"groupJa":"基本の丈"},
    {"id":"ultra_cropped","labelJa":"超ショート丈","shortPrompt":"ultra-cropped length","groupJa":"丈の変化"},
    {"id":"cropped","labelJa":"クロップド丈","shortPrompt":"cropped length","groupJa":"丈の変化"},
    {"id":"waist_length","labelJa":"ウエスト丈","shortPrompt":"waist-length","groupJa":"丈の変化"},
    {"id":"hip_length","labelJa":"ヒップ丈","shortPrompt":"hip-length","groupJa":"丈の変化"},
    {"id":"upper_thigh","labelJa":"太もも上部丈","shortPrompt":"upper-thigh length","groupJa":"丈の変化"},
    {"id":"mini","labelJa":"ミニ丈","shortPrompt":"mini length","groupJa":"丈の変化"},
    {"id":"above_knee","labelJa":"膝上丈","shortPrompt":"above-knee length","groupJa":"丈の変化"},
    {"id":"below_knee","labelJa":"膝下丈","shortPrompt":"below-knee length","groupJa":"丈の変化"},
    {"id":"calf_length","labelJa":"ふくらはぎ丈","shortPrompt":"calf-length","groupJa":"丈の変化"},
    {"id":"ankle_length","labelJa":"足首丈","shortPrompt":"ankle-length","groupJa":"丈の変化"},
    {"id":"maxi","labelJa":"マキシ丈","shortPrompt":"maxi length","groupJa":"丈の変化"},
    {"id":"long_train","labelJa":"長いトレーン","shortPrompt":"long train","groupJa":"丈の変化"},
    {"id":"high_low","labelJa":"前後差のある丈","shortPrompt":"high-low length","groupJa":"丈の変化"}
  ],
    symmetry: [
    {"id":"symmetrical","labelJa":"左右対称","shortPrompt":"symmetrical","groupJa":"基本の形"},
    {"id":"mostly_symmetrical","labelJa":"ほぼ対称","shortPrompt":"mostly symmetrical","groupJa":"基本の形"},
    {"id":"asymmetrical","labelJa":"非対称","shortPrompt":"asymmetrical","groupJa":"基本の形"},
    {"id":"subtly_asymmetrical","labelJa":"控えめな左右差","shortPrompt":"subtly asymmetrical","groupJa":"形の変化"},
    {"id":"strongly_asymmetrical","labelJa":"大きな左右差","shortPrompt":"strongly asymmetrical","groupJa":"形の変化"},
    {"id":"diagonal_balance","labelJa":"斜めのバランス","shortPrompt":"diagonal balance","groupJa":"形の変化"},
    {"id":"one_sided_emphasis","labelJa":"片側を強調","shortPrompt":"one-sided emphasis","groupJa":"形の変化"}
  ]
  };

  CPW.data.partSlots = [
    {
      id: 'neckline', labelJa: '襟・胸元', multi: false, options: [
    {"id":"high_neckline","labelJa":"詰まった胸元","shortPrompt":"high neckline","tags":["covered"],"groupJa":"基本"},
    {"id":"keyhole_neckline","labelJa":"キーホール","shortPrompt":"keyhole neckline","tags":["open_small"],"groupJa":"基本"},
    {"id":"illusion_neckline","labelJa":"イリュージョン","shortPrompt":"illusion neckline","tags":["open_small","sheer_panel"],"groupJa":"基本"},
    {"id":"plunging_neckline","labelJa":"深いV","shortPrompt":"plunging neckline","tags":["open_deep"],"groupJa":"基本"},
    {"id":"sweetheart_neckline","labelJa":"ハートカット","shortPrompt":"sweetheart neckline","tags":["open_small"],"groupJa":"基本"},
    {"id":"square_neckline","labelJa":"角襟","shortPrompt":"square neckline","tags":["open_small"],"groupJa":"基本"},
    {"id":"crew_neck","labelJa":"クルーネック","shortPrompt":"crew neck","groupJa":"基本","tags":[]},
    {"id":"round_neck","labelJa":"ラウンドネック","shortPrompt":"round neck","groupJa":"基本","tags":[]},
    {"id":"v_neck","labelJa":"Vネック","shortPrompt":"V-neck","groupJa":"基本","tags":[]},
    {"id":"deep_v_neck","labelJa":"深いVネック","shortPrompt":"deep V-neck","groupJa":"基本","tags":[]},
    {"id":"scoop_neck","labelJa":"深い丸首","shortPrompt":"scoop neck","groupJa":"基本","tags":[]},
    {"id":"boat_neck","labelJa":"ボートネック","shortPrompt":"boat neck","groupJa":"基本","tags":[]},
    {"id":"mock_neck","labelJa":"低めの立ち首","shortPrompt":"mock-neck opening","groupJa":"覆う・開く","tags":[]},
    {"id":"funnel_neck","labelJa":"ファネルネック","shortPrompt":"funnel neckline","groupJa":"覆う・開く","tags":[]},
    {"id":"wide_neckline","labelJa":"広い胸元","shortPrompt":"wide neckline","groupJa":"覆う・開く","tags":[]},
    {"id":"off_center_neckline","labelJa":"中心をずらした胸元","shortPrompt":"off-center neckline","groupJa":"覆う・開く","tags":[]},
    {"id":"halter_neckline","labelJa":"ホルターネック","shortPrompt":"halter neckline","groupJa":"特殊","tags":[]},
    {"id":"one_shoulder_neckline","labelJa":"ワンショルダー","shortPrompt":"one-shoulder neckline","groupJa":"特殊","tags":["asymmetric"]},
    {"id":"asymmetric_neckline","labelJa":"非対称の胸元","shortPrompt":"asymmetric neckline","groupJa":"特殊","tags":["asymmetric"]},
    {"id":"wrap_neckline","labelJa":"巻き合わせの胸元","shortPrompt":"wrap neckline","groupJa":"特殊","tags":[]},
    {"id":"surplice_neckline","labelJa":"交差する打ち合わせ","shortPrompt":"surplice neckline","groupJa":"特殊","tags":[]},
    {"id":"cowl_neckline","labelJa":"たるみのある胸元","shortPrompt":"cowl neckline","groupJa":"特殊","tags":["draped"]},
    {"id":"split_neckline","labelJa":"切り込み入りの胸元","shortPrompt":"split neckline","groupJa":"特殊","tags":[]},
    {"id":"notch_neckline","labelJa":"小さな角切りの胸元","shortPrompt":"notch neckline","groupJa":"特殊","tags":[]},
    {"id":"open_neckline","labelJa":"開いたシャツの胸元","shortPrompt":"open neckline","groupJa":"特殊","tags":[]}
  ]
    },
    {
      id: 'collar', labelJa: '襟の形', multi: false, options: [
    {"id":"high_standing_collar","labelJa":"立ち襟","shortPrompt":"high standing collar","tags":["covered","structured"],"groupJa":"基本"},
    {"id":"detachable_standing_collar","labelJa":"取り外し立ち襟","shortPrompt":"detachable standing collar","tags":["structured","detachable"],"groupJa":"基本"},
    {"id":"wide_lapel","labelJa":"広いラペル","shortPrompt":"wide lapels","tags":["structured"],"groupJa":"基本"},
    {"id":"ruffled_collar","labelJa":"フリル襟","shortPrompt":"ruffled collar","tags":["frilled"],"groupJa":"基本"},
    {"id":"sailor_collar","labelJa":"セーラー襟","shortPrompt":"sailor collar","tags":["uniform"],"groupJa":"基本"},
    {"id":"no_collar","labelJa":"襟なし","shortPrompt":"collarless","tags":["plain"],"groupJa":"基本"},
    {"id":"point_collar","labelJa":"標準のシャツ襟","shortPrompt":"point collar","groupJa":"シャツ系","tags":[]},
    {"id":"spread_collar","labelJa":"開きの広いシャツ襟","shortPrompt":"spread collar","groupJa":"シャツ系","tags":[]},
    {"id":"button_down_collar","labelJa":"ボタンダウン襟","shortPrompt":"button-down collar","groupJa":"シャツ系","tags":[]},
    {"id":"band_collar","labelJa":"バンドカラー","shortPrompt":"band collar","groupJa":"シャツ系","tags":[]},
    {"id":"mandarin_collar","labelJa":"マンダリンカラー","shortPrompt":"mandarin collar","groupJa":"シャツ系","tags":[]},
    {"id":"stand_collar","labelJa":"低い立ち襟","shortPrompt":"stand collar","groupJa":"シャツ系","tags":[]},
    {"id":"wing_collar","labelJa":"ウィングカラー","shortPrompt":"wing collar","groupJa":"シャツ系","tags":[]},
    {"id":"open_collar","labelJa":"開襟","shortPrompt":"open collar","groupJa":"シャツ系","tags":[]},
    {"id":"peter_pan_collar","labelJa":"ピーターパンカラー","shortPrompt":"Peter Pan collar","groupJa":"柔らかい襟","tags":[]},
    {"id":"rounded_collar","labelJa":"丸い襟先","shortPrompt":"rounded collar","groupJa":"柔らかい襟","tags":[]},
    {"id":"shawl_collar","labelJa":"ショールカラー","shortPrompt":"shawl collar","groupJa":"柔らかい襟","tags":[]},
    {"id":"narrow_lapels","labelJa":"細いラペル","shortPrompt":"narrow lapels","groupJa":"テーラード","tags":[]},
    {"id":"notched_lapels","labelJa":"ノッチドラペル","shortPrompt":"notched lapels","groupJa":"テーラード","tags":[]},
    {"id":"peak_lapels","labelJa":"ピークドラペル","shortPrompt":"peak lapels","groupJa":"テーラード","tags":[]},
    {"id":"shawl_lapels","labelJa":"ショールラペル","shortPrompt":"shawl lapels","groupJa":"テーラード","tags":[]},
    {"id":"oversized_collar","labelJa":"大きな襟","shortPrompt":"oversized collar","groupJa":"特殊","tags":[]},
    {"id":"lace_collar","labelJa":"レース襟","shortPrompt":"lace collar","groupJa":"特殊","tags":[]},
    {"id":"fur_trimmed_collar","labelJa":"毛皮縁の襟","shortPrompt":"fur-trimmed collar","groupJa":"特殊","tags":[]},
    {"id":"split_collar","labelJa":"切り込みのある襟","shortPrompt":"split collar","groupJa":"特殊","tags":[]}
  ]
    },
    {
      id: 'shoulders', labelJa: '肩', multi: false, options: [
    {"id":"structured_shoulders","labelJa":"構築的な肩","shortPrompt":"structured shoulders","tags":["structured"],"groupJa":"基本"},
    {"id":"off_shoulder","labelJa":"オフショルダー","shortPrompt":"off-shoulder","tags":["open"],"groupJa":"基本"},
    {"id":"puff_shoulders","labelJa":"パフ","shortPrompt":"puffed shoulders","tags":["voluminous"],"groupJa":"基本"},
    {"id":"epaulettes","labelJa":"肩章","shortPrompt":"epaulettes","tags":["military","ornate"],"groupJa":"基本"},
    {"id":"natural_shoulders","labelJa":"自然な肩","shortPrompt":"natural shoulders","groupJa":"肩の形","tags":[]},
    {"id":"fitted_shoulders","labelJa":"肩に沿う","shortPrompt":"fitted shoulders","groupJa":"肩の形","tags":[]},
    {"id":"padded_shoulders","labelJa":"肩パッド","shortPrompt":"padded shoulders","groupJa":"肩の形","tags":[]},
    {"id":"broad_shoulders","labelJa":"広い肩幅","shortPrompt":"broad shoulders","groupJa":"肩の形","tags":[]},
    {"id":"dropped_shoulders","labelJa":"ドロップショルダー","shortPrompt":"dropped shoulders","groupJa":"肩の形","tags":[]},
    {"id":"raglan_shoulders","labelJa":"ラグランの肩","shortPrompt":"raglan shoulders","groupJa":"肩の形","tags":[]},
    {"id":"gathered_shoulders","labelJa":"ギャザー入りの肩","shortPrompt":"gathered shoulders","groupJa":"肩の形","tags":[]},
    {"id":"one_shoulder","labelJa":"片肩","shortPrompt":"one-shoulder design","groupJa":"開口・非対称","tags":["asymmetric"]},
    {"id":"cold_shoulder","labelJa":"肩あき","shortPrompt":"cold-shoulder design","groupJa":"開口・非対称","tags":[]},
    {"id":"cape_shoulders","labelJa":"ケープ状の肩","shortPrompt":"cape shoulders","groupJa":"開口・非対称","tags":[]}
  ]
    },
    {
      id: 'sleeves', labelJa: '袖', multi: false, options: [
    {"id":"sleeveless","labelJa":"袖なし","shortPrompt":"sleeveless","tags":["no_sleeve"],"groupJa":"基本"},
    {"id":"short_sleeves","labelJa":"半袖","shortPrompt":"short sleeves","tags":["sleeve"],"groupJa":"基本"},
    {"id":"fitted_long_sleeves","labelJa":"細い長袖","shortPrompt":"fitted long sleeves","tags":["sleeve","long_sleeve"],"groupJa":"基本"},
    {"id":"bell_sleeves","labelJa":"ベル袖","shortPrompt":"bell sleeves","tags":["sleeve","long_sleeve","voluminous"],"groupJa":"基本"},
    {"id":"wide_sleeves","labelJa":"広袖","shortPrompt":"wide flowing sleeves","tags":["sleeve","long_sleeve","voluminous"],"groupJa":"基本"},
    {"id":"cap_sleeves","labelJa":"ごく短い袖","shortPrompt":"cap sleeves","groupJa":"長さ","tags":["sleeve"]},
    {"id":"elbow_sleeves","labelJa":"肘丈の袖","shortPrompt":"elbow-length sleeves","groupJa":"長さ","tags":["sleeve"]},
    {"id":"three_quarter_sleeves","labelJa":"七分袖","shortPrompt":"three-quarter sleeves","groupJa":"長さ","tags":["sleeve"]},
    {"id":"long_sleeves","labelJa":"長袖","shortPrompt":"long sleeves","groupJa":"長さ","tags":["sleeve"]},
    {"id":"extra_long_sleeves","labelJa":"長く余る袖","shortPrompt":"extra-long sleeves","groupJa":"長さ","tags":["sleeve"]},
    {"id":"hand_covering_sleeves","labelJa":"手を覆う袖","shortPrompt":"hand-covering sleeves","groupJa":"長さ","tags":["sleeve"]},
    {"id":"fitted_sleeves","labelJa":"体に沿う袖","shortPrompt":"fitted sleeves","groupJa":"細身・標準","tags":["sleeve"]},
    {"id":"straight_sleeves","labelJa":"まっすぐな袖","shortPrompt":"straight sleeves","groupJa":"細身・標準","tags":["sleeve"]},
    {"id":"tapered_sleeves","labelJa":"先細りの袖","shortPrompt":"tapered sleeves","groupJa":"細身・標準","tags":["sleeve"]},
    {"id":"puff_sleeves","labelJa":"パフスリーブ","shortPrompt":"puff sleeves","groupJa":"ボリューム","tags":["sleeve"]},
    {"id":"balloon_sleeves","labelJa":"バルーンスリーブ","shortPrompt":"balloon sleeves","groupJa":"ボリューム","tags":["sleeve"]},
    {"id":"bishop_sleeves","labelJa":"ビショップスリーブ","shortPrompt":"bishop sleeves","groupJa":"ボリューム","tags":["sleeve"]},
    {"id":"lantern_sleeves","labelJa":"ランタンスリーブ","shortPrompt":"lantern sleeves","groupJa":"ボリューム","tags":["sleeve"]},
    {"id":"leg_of_mutton_sleeves","labelJa":"レッグオブマトンスリーブ","shortPrompt":"leg-of-mutton sleeves","groupJa":"ボリューム","tags":["sleeve"]},
    {"id":"trumpet_sleeves","labelJa":"トランペットスリーブ","shortPrompt":"trumpet sleeves","groupJa":"広がり","tags":["sleeve"]},
    {"id":"flared_sleeves","labelJa":"フレアスリーブ","shortPrompt":"flared sleeves","groupJa":"広がり","tags":["sleeve"]},
    {"id":"kimono_sleeves","labelJa":"身頃続きの広袖","shortPrompt":"kimono sleeves","groupJa":"広がり","tags":["sleeve"]},
    {"id":"raglan_sleeves","labelJa":"ラグラン袖","shortPrompt":"raglan sleeves","groupJa":"構造","tags":["sleeve"]},
    {"id":"dolman_sleeves","labelJa":"ドルマン袖","shortPrompt":"dolman sleeves","groupJa":"構造","tags":["sleeve"]},
    {"id":"batwing_sleeves","labelJa":"深い袖ぐりの袖","shortPrompt":"batwing sleeves","groupJa":"構造","tags":["sleeve"]},
    {"id":"slit_sleeves","labelJa":"細いスリット入りの袖","shortPrompt":"slit sleeves","groupJa":"構造","tags":["sleeve"]},
    {"id":"split_sleeves","labelJa":"大きく割れた袖","shortPrompt":"split sleeves","groupJa":"構造","tags":["sleeve"]},
    {"id":"layered_sleeves","labelJa":"重ね袖","shortPrompt":"layered sleeves","groupJa":"構造","tags":["sleeve"]},
    {"id":"detached_sleeves","labelJa":"付け袖","shortPrompt":"detached sleeves","groupJa":"構造","tags":["sleeve"]},
    {"id":"one_sleeve","labelJa":"片袖","shortPrompt":"one sleeve","groupJa":"構造","tags":["sleeve","asymmetric"]},
    {"id":"asymmetric_sleeves","labelJa":"左右非対称の袖","shortPrompt":"asymmetric sleeves","groupJa":"構造","tags":["sleeve","asymmetric"]},
    {"id":"overlay_sleeves","labelJa":"透ける重ね袖","shortPrompt":"transparent overlay sleeves","groupJa":"構造","tags":["sleeve"]}
  ]
    },
    {
      id: 'cuffs', labelJa: '袖口', multi: false, options: [
    {"id":"plain_cuffs","labelJa":"無地","shortPrompt":"plain cuffs","tags":["plain"],"groupJa":"基本"},
    {"id":"ornate_cuffs","labelJa":"装飾的","shortPrompt":"ornate cuffs","tags":["ornate"],"groupJa":"基本"},
    {"id":"lace_cuffs","labelJa":"レース","shortPrompt":"lace-trimmed cuffs","tags":["frilled"],"groupJa":"基本"},
    {"id":"buckled_cuffs","labelJa":"バックル","shortPrompt":"buckled cuffs","tags":["functional"],"groupJa":"基本"},
    {"id":"narrow_cuffs","labelJa":"細い袖口","shortPrompt":"narrow cuffs","groupJa":"形・折り返し","tags":[]},
    {"id":"wide_cuffs","labelJa":"広い袖口","shortPrompt":"wide cuffs","groupJa":"形・折り返し","tags":[]},
    {"id":"folded_cuffs","labelJa":"折り返し袖口","shortPrompt":"folded cuffs","groupJa":"形・折り返し","tags":[]},
    {"id":"rolled_cuffs","labelJa":"ロール状の袖口","shortPrompt":"rolled cuffs","groupJa":"形・折り返し","tags":[]},
    {"id":"buttoned_cuffs","labelJa":"ボタン付き袖口","shortPrompt":"buttoned cuffs","groupJa":"留め・素材","tags":[]},
    {"id":"french_cuffs","labelJa":"ダブルカフス","shortPrompt":"French cuffs","groupJa":"留め・素材","tags":[]},
    {"id":"ruffled_cuffs","labelJa":"フリル袖口","shortPrompt":"ruffled cuffs","groupJa":"留め・素材","tags":[]},
    {"id":"elastic_cuffs","labelJa":"ゴム入り袖口","shortPrompt":"elastic cuffs","groupJa":"留め・素材","tags":[]},
    {"id":"ribbed_cuffs","labelJa":"リブ袖口","shortPrompt":"ribbed cuffs","groupJa":"留め・素材","tags":[]},
    {"id":"flared_cuffs","labelJa":"広がる袖口","shortPrompt":"flared cuffs","groupJa":"留め・素材","tags":[]},
    {"id":"split_cuffs","labelJa":"スリット袖口","shortPrompt":"split cuffs","groupJa":"留め・素材","tags":[]}
  ]
    },
    {
      id: 'waist', labelJa: 'ウエスト', multi: false, options: [
    {"id":"royal_sash","labelJa":"飾り帯","shortPrompt":"royal sash","tags":["ornate"],"groupJa":"基本"},
    {"id":"leather_belt","labelJa":"革ベルト","shortPrompt":"leather belt","tags":["functional"],"groupJa":"基本"},
    {"id":"corset_waist","labelJa":"コルセット","shortPrompt":"corseted waist","tags":["structured"],"groupJa":"基本"},
    {"id":"ribbon_tie","labelJa":"リボン","shortPrompt":"ribbon tied at the waist","tags":["frilled"],"groupJa":"基本"},
    {"id":"obi","labelJa":"帯","shortPrompt":"obi","tags":["japanese"],"groupJa":"基本"},
    {"id":"narrow_belt","labelJa":"細いベルト","shortPrompt":"narrow belt","groupJa":"ベルト","tags":[]},
    {"id":"wide_belt","labelJa":"幅広ベルト","shortPrompt":"wide belt","groupJa":"ベルト","tags":[]},
    {"id":"double_belt","labelJa":"二重ベルト","shortPrompt":"double belt","groupJa":"ベルト","tags":[]},
    {"id":"utility_belt","labelJa":"ユーティリティベルト","shortPrompt":"utility belt","groupJa":"ベルト","tags":[]},
    {"id":"chain_belt","labelJa":"チェーンベルト","shortPrompt":"chain belt","groupJa":"ベルト","tags":[]},
    {"id":"sash","labelJa":"布のサッシュ","shortPrompt":"sash","groupJa":"帯・結び","tags":[]},
    {"id":"bow_belt","labelJa":"リボン結びのベルト","shortPrompt":"bow belt","groupJa":"帯・結び","tags":[]},
    {"id":"waist_harness","labelJa":"ウエストハーネス","shortPrompt":"waist harness","groupJa":"構造","tags":[]},
    {"id":"drawstring_waist","labelJa":"ドローストリング","shortPrompt":"drawstring waist","groupJa":"構造","tags":[]},
    {"id":"elastic_waistband","labelJa":"ゴムウエスト","shortPrompt":"elastic waistband","groupJa":"構造","tags":[]},
    {"id":"waist_panel","labelJa":"飾りウエストパネル","shortPrompt":"decorative waist panel","groupJa":"構造","tags":[]},
    {"id":"peplum_waist","labelJa":"ペプラム","shortPrompt":"peplum waist","groupJa":"構造","tags":[]}
  ]
    },
    {
      id: 'skirt_shape', labelJa: 'スカート形状', multi: false, options: [
    {"id":"tiered_skirt","labelJa":"段フリル","shortPrompt":"tiered skirt","tags":["voluminous","frilled"],"groupJa":"基本"},
    {"id":"a_line_skirt","labelJa":"Aライン","shortPrompt":"A-line skirt","tags":["flared"],"groupJa":"基本"},
    {"id":"pencil_skirt","labelJa":"タイト","shortPrompt":"pencil skirt","tags":["slim"],"groupJa":"基本"},
    {"id":"micro_mini_skirt","labelJa":"マイクロミニ","shortPrompt":"micro mini skirt","tags":["slim","micro"],"groupJa":"基本"},
    {"id":"mermaid_skirt","labelJa":"マーメイド","shortPrompt":"mermaid skirt","tags":["fitted","flared"],"groupJa":"基本"},
    {"id":"straight_skirt","labelJa":"ストレート","shortPrompt":"straight skirt","groupJa":"基本形","tags":[]},
    {"id":"pleated_skirt","labelJa":"プリーツ","shortPrompt":"pleated skirt","groupJa":"基本形","tags":[]},
    {"id":"circle_skirt","labelJa":"サーキュラー","shortPrompt":"circle skirt","groupJa":"基本形","tags":[]},
    {"id":"full_skirt","labelJa":"豊かなフルスカート","shortPrompt":"full skirt","groupJa":"基本形","tags":[]},
    {"id":"bubble_skirt","labelJa":"バルーン","shortPrompt":"bubble skirt","groupJa":"立体・変形","tags":[]},
    {"id":"tulip_skirt","labelJa":"チューリップ","shortPrompt":"tulip skirt","groupJa":"立体・変形","tags":[]},
    {"id":"wrap_skirt","labelJa":"巻きスカート","shortPrompt":"wrap skirt","groupJa":"立体・変形","tags":[]},
    {"id":"handkerchief_skirt","labelJa":"ハンカチーフ","shortPrompt":"handkerchief skirt","groupJa":"立体・変形","tags":[]},
    {"id":"asymmetric_skirt","labelJa":"非対称","shortPrompt":"asymmetric skirt","groupJa":"立体・変形","tags":["asymmetric"]},
    {"id":"fishtail_skirt","labelJa":"後ろ裾が長い形","shortPrompt":"fishtail skirt","groupJa":"立体・変形","tags":[]},
    {"id":"gathered_skirt","labelJa":"ギャザー","shortPrompt":"gathered skirt","groupJa":"立体・変形","tags":[]}
  ]
    },
    {
      id: 'hem', labelJa: '裾', multi: false, options: [
    {"id":"straight_hem","labelJa":"直線","shortPrompt":"straight hem","tags":["plain"],"groupJa":"基本"},
    {"id":"floor_sweeping_hem","labelJa":"床を掃く裾","shortPrompt":"floor-sweeping hem","tags":["floor"],"groupJa":"基本"},
    {"id":"layered_hem","labelJa":"重ね裾","shortPrompt":"layered hem","tags":["layered"],"groupJa":"基本"},
    {"id":"lace_hem","labelJa":"レース縁","shortPrompt":"lace-trimmed hem","tags":["frilled"],"groupJa":"基本"},
    {"id":"torn_hem","labelJa":"破れ裾","shortPrompt":"frayed hem","tags":["rough"],"groupJa":"基本"},
    {"id":"curved_hem","labelJa":"曲線の裾","shortPrompt":"curved hem","groupJa":"線・縁","tags":[]},
    {"id":"rounded_hem","labelJa":"丸い裾","shortPrompt":"rounded hem","groupJa":"線・縁","tags":[]},
    {"id":"scalloped_hem","labelJa":"スカラップ裾","shortPrompt":"scalloped hem","groupJa":"線・縁","tags":[]},
    {"id":"ruffled_hem","labelJa":"ラッフル裾","shortPrompt":"ruffled hem","groupJa":"線・縁","tags":[]},
    {"id":"raw_hem","labelJa":"切りっぱなし裾","shortPrompt":"raw hem","groupJa":"線・縁","tags":[]},
    {"id":"stepped_hem","labelJa":"段差のある裾","shortPrompt":"stepped hem","groupJa":"丈・非対称","tags":[]},
    {"id":"asymmetric_hem","labelJa":"非対称の裾","shortPrompt":"asymmetric hem","groupJa":"丈・非対称","tags":["asymmetric"]},
    {"id":"handkerchief_hem","labelJa":"ハンカチーフ裾","shortPrompt":"handkerchief hem","groupJa":"丈・非対称","tags":[]},
    {"id":"high_low_hem","labelJa":"前が短く後ろが長い裾","shortPrompt":"high-low hem","groupJa":"丈・非対称","tags":[]},
    {"id":"fishtail_hem","labelJa":"フィッシュテール裾","shortPrompt":"fishtail hem","groupJa":"丈・非対称","tags":[]},
    {"id":"trailing_hem","labelJa":"引きずる裾","shortPrompt":"trailing hem","groupJa":"丈・非対称","tags":[]},
    {"id":"split_hem","labelJa":"割れた裾","shortPrompt":"split hem","groupJa":"スリット","tags":[]},
    {"id":"side_slit_hem","labelJa":"片脇スリット裾","shortPrompt":"side-slit hem","groupJa":"スリット","tags":[]},
    {"id":"double_slit_hem","labelJa":"両脇スリット裾","shortPrompt":"double-slit hem","groupJa":"スリット","tags":[]}
  ]
    },
    {
      id: 'bottoms', labelJa: 'ボトムス', multi: false, options: [
    {"id":"fitted_trousers","labelJa":"細身のトラウザーズ","shortPrompt":"fitted trousers","tags":["slim"],"groupJa":"基本"},
    {"id":"wide_trousers","labelJa":"ワイドパンツ","shortPrompt":"wide-leg trousers","tags":["voluminous"],"groupJa":"基本"},
    {"id":"pleated_skirt","labelJa":"プリーツスカート","shortPrompt":"pleated skirt","tags":["uniform"],"groupJa":"基本"},
    {"id":"shorts","labelJa":"ショートパンツ","shortPrompt":"shorts","tags":["casual"],"groupJa":"基本"},
    {"id":"straight_trousers","labelJa":"ストレートパンツ","shortPrompt":"straight trousers","groupJa":"パンツ","tags":[]},
    {"id":"tapered_trousers","labelJa":"テーパードパンツ","shortPrompt":"tapered trousers","groupJa":"パンツ","tags":[]},
    {"id":"flared_trousers","labelJa":"フレアパンツ","shortPrompt":"flared trousers","groupJa":"パンツ","tags":[]},
    {"id":"cropped_trousers","labelJa":"クロップドパンツ","shortPrompt":"cropped trousers","groupJa":"パンツ","tags":[]},
    {"id":"ankle_pants","labelJa":"アンクルパンツ","shortPrompt":"ankle pants","groupJa":"パンツ","tags":[]},
    {"id":"cargo_pants","labelJa":"カーゴパンツ","shortPrompt":"cargo pants","groupJa":"パンツ","tags":[]},
    {"id":"joggers","labelJa":"ジョガーパンツ","shortPrompt":"joggers","groupJa":"パンツ","tags":[]},
    {"id":"tailored_shorts","labelJa":"仕立てのよいショーツ","shortPrompt":"tailored shorts","groupJa":"ショーツ・スカート","tags":[]},
    {"id":"pleated_shorts","labelJa":"プリーツショーツ","shortPrompt":"pleated shorts","groupJa":"ショーツ・スカート","tags":[]},
    {"id":"straight_skirt","labelJa":"ストレートスカート","shortPrompt":"straight skirt","groupJa":"ショーツ・スカート","tags":[]},
    {"id":"wrap_skirt","labelJa":"巻きスカート","shortPrompt":"wrap skirt","groupJa":"ショーツ・スカート","tags":[]},
    {"id":"culottes","labelJa":"キュロット","shortPrompt":"culottes","groupJa":"ショーツ・スカート","tags":[]}
  ]
    },
    {
      id: 'inner_shirt', labelJa: 'シャツ', multi: false, options: [
    {"id":"high_collar_shirt","labelJa":"立ち襟シャツ","shortPrompt":"high-collar shirt","tags":["covered"],"groupJa":"基本"},
    {"id":"dress_shirt","labelJa":"ドレスシャツ","shortPrompt":"crisp dress shirt","tags":["plain"],"groupJa":"基本"},
    {"id":"ruffled_shirt","labelJa":"フリルシャツ","shortPrompt":"ruffled shirt","tags":["frilled"],"groupJa":"基本"},
    {"id":"casual_shirt","labelJa":"カジュアルシャツ","shortPrompt":"casual shirt","groupJa":"シャツ","tags":[]},
    {"id":"band_collar_shirt","labelJa":"バンドカラーシャツ","shortPrompt":"band-collar shirt","groupJa":"シャツ","tags":[]},
    {"id":"poet_shirt","labelJa":"ポエットシャツ","shortPrompt":"poet shirt","groupJa":"シャツ","tags":[]},
    {"id":"pleated_front_shirt","labelJa":"プリーツ胸当てシャツ","shortPrompt":"pleated-front shirt","groupJa":"シャツ","tags":[]},
    {"id":"bib_front_shirt","labelJa":"ビブフロントシャツ","shortPrompt":"bib-front shirt","groupJa":"シャツ","tags":[]},
    {"id":"sheer_overlay_shirt","labelJa":"透ける重ね布のシャツ","shortPrompt":"sheer-overlay shirt","groupJa":"シャツ","tags":[]},
    {"id":"sleeveless_inner_shirt","labelJa":"ノースリーブのインナーシャツ","shortPrompt":"sleeveless inner shirt","groupJa":"シャツ","tags":[]}
  ]
    },
    {
      id: 'vest', labelJa: 'ベスト', multi: false, options: [
    {"id":"tailored_vest","labelJa":"仕立てベスト","shortPrompt":"tailored vest","tags":["structured"],"groupJa":"基本"},
    {"id":"brocade_vest","labelJa":"織柄ベスト","shortPrompt":"brocade vest","tags":["ornate"],"groupJa":"基本"},
    {"id":"no_vest","labelJa":"なし","shortPrompt":"","tags":[],"groupJa":"基本"},
    {"id":"longline_vest","labelJa":"ロングベスト","shortPrompt":"longline vest","groupJa":"ベストの形","tags":[]},
    {"id":"cropped_vest","labelJa":"クロップドベスト","shortPrompt":"cropped vest","groupJa":"ベストの形","tags":[]},
    {"id":"double_breasted_vest","labelJa":"ダブルのベスト","shortPrompt":"double-breasted vest","groupJa":"ベストの形","tags":[]},
    {"id":"utility_vest","labelJa":"ユーティリティベスト","shortPrompt":"utility vest","groupJa":"ベストの形","tags":[]},
    {"id":"armored_vest","labelJa":"装甲ベスト","shortPrompt":"armored vest","groupJa":"ベストの形","tags":[]},
    {"id":"knitted_vest","labelJa":"ニットベスト","shortPrompt":"knitted vest","groupJa":"ベストの形","tags":[]}
  ]
    },
    {
      /* 手袋・ハンドウェアは合成IDを増やさず、4軸に分解して保持する。
       * kind:'composite' … 値は { type, material, length, fingertips }
       * requiredAxis が未選択の間、他の軸は「休止」扱いで出力・完成度・競合判定に混ぜない。
       * legacyMap … Phase 1 の合成IDを新構造へ変換する（旧形式は併存させない）。 */
      id: 'handwear', labelJa: '手袋・ハンドウェア', multi: false, kind: 'composite',
      requiredAxis: 'type',
      legacyMap: {
        lace_gloves_short: { type: 'hand_gloves', material: 'lace_hand', length: 'wrist_length', fingertips: 'full_fingered' },
        lace_gloves_elbow_fingerless: { type: 'hand_gloves', material: 'lace_hand', length: 'elbow_length', fingertips: 'fingerless' },
        white_gloves: { type: 'hand_gloves', material: 'cotton_hand', length: 'wrist_length', fingertips: 'full_fingered' },
        leather_gauntlets: { type: 'hand_gauntlets', material: 'leather_hand', length: 'forearm_length', fingertips: 'full_fingered' },
        arm_warmers: { type: 'hand_arm_warmers', material: 'knit_hand', length: 'elbow_length', fingertips: null }
      },
      axes: [
        {
          key: 'type', labelJa: '種類', required: true,
          noteJa: '種類を選ぶと、素材・長さ・指先を編集できます。解除すると、下の3項目は残したまま休止し、出力には含めません。',
          options: [
            { id: 'hand_gloves', labelJa: '手袋', shortPrompt: 'gloves', tags: ['gloves'] },
            { id: 'hand_gauntlets', labelJa: 'ガントレット', shortPrompt: 'gauntlets', tags: ['gloves', 'functional'] },
            { id: 'hand_mittens', labelJa: 'ミトン', shortPrompt: 'mittens', tags: ['gloves'] },
            { id: 'hand_arm_warmers', labelJa: 'アームウォーマー', shortPrompt: 'arm warmers', tags: ['arm'], skipAxes: ['fingertips'] },
            { id: 'hand_arm_covers', labelJa: 'アームカバー', shortPrompt: 'arm covers', tags: ['arm'], skipAxes: ['fingertips'] }
          ]
        },
        {
          key: 'material', labelJa: '素材', options: [
            { id: 'lace_hand', labelJa: 'レース', shortPrompt: 'lace', tags: ['lace', 'sheer'] },
            { id: 'leather_hand', labelJa: '革', shortPrompt: 'leather', tags: ['sturdy'] },
            { id: 'satin_hand', labelJa: 'サテン', shortPrompt: 'satin', tags: ['glossy'] },
            { id: 'sheer_hand', labelJa: '透ける生地', shortPrompt: 'sheer fabric', tags: ['sheer'] },
            { id: 'cotton_hand', labelJa: '綿', shortPrompt: 'cotton', tags: ['plain'] },
            { id: 'knit_hand', labelJa: 'ニット', shortPrompt: 'knit', tags: ['soft'] },
            { id: 'metal_hand', labelJa: '金属', shortPrompt: 'metal', tags: ['metallic', 'rigid'] }
          ]
        },
        {
          key: 'length', labelJa: '長さ', options: [
            { id: 'wrist_length', labelJa: '手首丈', shortPrompt: 'wrist-length' },
            { id: 'forearm_length', labelJa: '前腕丈', shortPrompt: 'forearm-length' },
            { id: 'elbow_length', labelJa: '肘丈', shortPrompt: 'elbow-length' },
            { id: 'opera_length', labelJa: '二の腕丈（オペラ）', shortPrompt: 'opera-length' }
          ]
        },
        {
          key: 'fingertips', labelJa: '指先', options: [
            { id: 'full_fingered', labelJa: '指まで覆う', shortPrompt: 'full-fingered' },
            { id: 'fingerless', labelJa: '指なし', shortPrompt: 'fingerless' },
            { id: 'open_finger', labelJa: '指先だけ開く', shortPrompt: 'open-finger' }
          ]
        }
      ]
    },
    {
      id: 'legwear', labelJa: 'レッグウェア', multi: true, kind: 'multi',
      layered: true,
      noteJa: '重ね着の場合は、層を分けておくと「重複」ではなく「重ね」として扱います。',
      options: [
        { id: 'thigh_high_stockings', labelJa: 'ニーハイストッキング', shortPrompt: 'thigh-high stockings', tags: ['stockings', 'legwear_long'] },
        { id: 'garter_stockings', labelJa: 'ガーターストッキング', shortPrompt: 'garter stockings', tags: ['stockings', 'legwear_long', 'garter'] },
        { id: 'sheer_tights', labelJa: '薄いタイツ', shortPrompt: 'sheer tights', tags: ['tights', 'legwear_long'] },
        { id: 'lace_socks', labelJa: 'レースソックス', shortPrompt: 'lace socks', tags: ['socks', 'legwear_short'] },
        { id: 'knee_socks', labelJa: 'ハイソックス', shortPrompt: 'knee socks', tags: ['socks', 'legwear_mid'] }
      ]
    },
    {
      id: 'footwear', labelJa: '靴', multi: false, options: [
        { id: 'knee_high_boots', labelJa: 'ロングブーツ', shortPrompt: 'polished knee-high boots', tags: ['boots'] },
        { id: 'lace_up_boots', labelJa: '編み上げブーツ', shortPrompt: 'lace-up boots', tags: ['boots'] },
        { id: 'heeled_pumps', labelJa: 'ヒールパンプス', shortPrompt: 'heeled pumps', tags: ['heels'] },
        { id: 'sneakers', labelJa: 'スニーカー', shortPrompt: 'sneakers', tags: ['casual'] },
        { id: 'barefoot', labelJa: '素足', shortPrompt: 'barefoot', wearState: true, tags: ['none'] }
      ]
    },
    {
      id: 'headwear', labelJa: '頭部', multi: false, options: [
        { id: 'bonnet', labelJa: 'ボンネット', shortPrompt: 'bonnet', tags: ['frilled'] },
        { id: 'circlet', labelJa: 'サークレット', shortPrompt: 'circlet', tags: ['ornate'] },
        { id: 'tall_crown', labelJa: '背の高い冠', shortPrompt: 'a tall crown', tags: ['ornate', 'head_tall'] },
        { id: 'oversized_bonnet', labelJa: '大きなボンネット', shortPrompt: 'an oversized bonnet', tags: ['frilled', 'head_tall'] },
        { id: 'hood', labelJa: 'フード', shortPrompt: 'hood', tags: ['covered'] },
        { id: 'officer_cap', labelJa: '将校帽', shortPrompt: 'officer cap', tags: ['military'] },
        { id: 'no_headwear', labelJa: 'なし', shortPrompt: '', tags: [] }
      ]
    },

    // 水着専用
    {
      id: 'swim_form', labelJa: '水着の型', multi: false, options: [
        { id: 'one_piece_form', labelJa: 'ワンピース型', shortPrompt: 'one-piece', coreAdjEn: 'one-piece', tags: ['swim_one'] },
        { id: 'separate_form', labelJa: 'セパレート型', shortPrompt: 'two-piece', coreAdjEn: 'two-piece', tags: ['swim_two'] },
        { id: 'shorts_form', labelJa: 'ショーツ型', shortPrompt: 'shorts-style', coreAdjEn: 'shorts-style', tags: ['swim_shorts'] }
      ]
    },
    {
      id: 'straps', labelJa: '肩紐・ストラップ', multi: false, options: [
        { id: 'halter_strap', labelJa: 'ホルターネック', shortPrompt: 'halter neck straps', tags: ['strap'] },
        { id: 'thin_straps', labelJa: '細い肩紐', shortPrompt: 'thin shoulder straps', tags: ['strap'] },
        { id: 'strapless', labelJa: 'ストラップなし', shortPrompt: 'strapless', tags: ['no_strap'] },
        { id: 'cross_back_straps', labelJa: 'クロスバック', shortPrompt: 'cross-back straps', tags: ['strap'] }
      ]
    },
    {
      id: 'back', labelJa: '背中', multi: false, options: [
        { id: 'open_back', labelJa: '背中開き', shortPrompt: 'open back', tags: ['open_back'] },
        { id: 'covered_back', labelJa: '背中を覆う', shortPrompt: 'covered back', tags: ['covered_back'] },
        { id: 'lace_up_back', labelJa: '編み上げ背面', shortPrompt: 'lace-up back', tags: ['open_back'] }
      ]
    },
    {
      id: 'leg_opening', labelJa: '脚ぐり', multi: false, options: [
        { id: 'high_leg', labelJa: 'ハイレグ', shortPrompt: 'high-cut leg opening', tags: ['high_cut'] },
        { id: 'standard_leg', labelJa: '標準', shortPrompt: 'standard leg opening', tags: [] },
        { id: 'boyleg', labelJa: 'ボーイレッグ', shortPrompt: 'boyleg cut', tags: ['covered'] }
      ]
    },
    {
      id: 'coverage', labelJa: 'カバー範囲', multi: false, options: [
        { id: 'minimal_coverage', labelJa: '控えめな面積', shortPrompt: 'minimal coverage', tags: ['revealing'] },
        { id: 'moderate_coverage', labelJa: '標準', shortPrompt: 'moderate coverage', tags: [] },
        { id: 'full_coverage', labelJa: '広く覆う', shortPrompt: 'full coverage', tags: ['covered'] }
      ]
    },
    {
      id: 'cover_up', labelJa: '羽織り', multi: false, options: [
        { id: 'neck_scarf', labelJa: '首のスカーフ', shortPrompt: 'scarf', tags: ['layered'], groupJa: '首元' },
        { id: 'sheer_cover_up', labelJa: 'シアーカバー', shortPrompt: 'sheer beach cover-up', tags: ['sheer'] },
        { id: 'sarong', labelJa: 'パレオ', shortPrompt: 'sarong', tags: ['draped'] },
        { id: 'sheer_robe', labelJa: 'シアーガウン', shortPrompt: 'sheer gown', tags: ['sheer'] },
        { id: 'long_sleeved_cardigan', labelJa: '長袖カーディガン', shortPrompt: 'a long-sleeved cardigan', tags: ['long_sleeve', 'layered'] },
        { id: 'full_back_cape', labelJa: '背中を覆うケープ', shortPrompt: 'a full-length cape', tags: ['cape', 'covered_back', 'layered'] },
        { id: 'shoulder_cape', labelJa: '肩掛けケープ', shortPrompt: 'a shoulder cape', tags: ['cape', 'layered'] },
        { id: 'no_cover_up', labelJa: 'なし', shortPrompt: '', tags: [] }
      ]
    },

    // ランジェリー専用
    {
      id: 'lingerie_form', labelJa: '下着の型', multi: false, options: [
        { id: 'separate_set', labelJa: '上下分離', shortPrompt: 'two-piece set', detailedPrompt: 'a two-piece set', tags: ['lingerie_two'] },
        { id: 'one_piece_lingerie', labelJa: '一体型', shortPrompt: 'one-piece', detailedPrompt: 'a one-piece design', tags: ['lingerie_one'] }
      ]
    },
    {
      id: 'top_structure', labelJa: '上半身構造', multi: false, options: [
        { id: 'bralette', labelJa: 'ブラレット', shortPrompt: 'bralette', tags: ['soft'] },
        { id: 'underwire_bra', labelJa: 'ワイヤーブラ', shortPrompt: 'underwire bra', tags: ['structured'] },
        { id: 'bandeau', labelJa: 'バンドゥ', shortPrompt: 'bandeau', tags: ['no_strap'] },
        { id: 'bustier', labelJa: 'ビスチェ', shortPrompt: 'bustier', tags: ['structured'] }
      ]
    },
    {
      id: 'bottom_structure', labelJa: '下半身構造', multi: false, options: [
        { id: 'briefs', labelJa: 'ショーツ', shortPrompt: 'briefs', tags: [] },
        { id: 'high_waisted_briefs', labelJa: 'ハイウエストショーツ', shortPrompt: 'high-waisted briefs', tags: ['high_waist'] },
        { id: 'boyshorts', labelJa: 'ボーイショーツ', shortPrompt: 'boyshorts', tags: ['covered'] },
        { id: 'lace_shorts', labelJa: 'レースショーツ', shortPrompt: 'lace shorts', tags: ['lace'] }
      ]
    },
    {
      id: 'garter', labelJa: 'ガーター', multi: false, options: [
        { id: 'garter_belt', labelJa: 'ガーターベルト', shortPrompt: 'garter belt', tags: ['garter'] },
        { id: 'garter_details', labelJa: 'ガーター飾り', shortPrompt: 'garter details', tags: ['garter'] },
        { id: 'no_garter', labelJa: 'なし', shortPrompt: '', tags: [] }
      ]
    },
    {
      /* チェックポイント4：人魚専用。merfolk カテゴリの slots にのみ含まれる */
      id: 'mermaid_tail_form', labelJa: '尾の形', multi: false, options: [
        { id: 'classic_scaled_tail', labelJa: '古典的な鱗の尾', shortPrompt: 'classic scaled mermaid tail', tags: ['merfolk', 'scales'] },
        { id: 'long_flowing_fin_tail', labelJa: '長い飾りびれの尾', shortPrompt: 'long flowing-finned mermaid tail', tags: ['merfolk', 'flowing'] },
        { id: 'wide_crescent_fluke_tail', labelJa: '三日月びれの尾', shortPrompt: 'mermaid tail with a wide crescent fluke', tags: ['merfolk'] },
        { id: 'translucent_fin_tail', labelJa: '透けびれの尾', shortPrompt: 'mermaid tail with translucent fins', tags: ['merfolk', 'sheer_panel'] },
        { id: 'koi_patterned_tail', labelJa: '錦鯉柄の尾', shortPrompt: 'koi-patterned mermaid tail', tags: ['merfolk', 'japanese'] },
        { id: 'deep_sea_ridged_tail', labelJa: '深海びれの尾', shortPrompt: 'deep-sea ridged mermaid tail', tags: ['merfolk', 'dark'] }
      ]
    }
  ];
  // Phase 5C: structural details share the existing part-slot model.
  CPW.data.partSlots = CPW.data.partSlots.concat([
    { id: "closure", labelJa: "開閉・留め方", multi: false, options: [
    {"id":"button_front","labelJa":"前ボタン","shortPrompt":"button-front closure","groupJa":"ボタン","tags":[],"upperOnlyCompatible":true},
    {"id":"hidden_placket","labelJa":"隠しボタン","shortPrompt":"hidden button placket","groupJa":"ボタン","tags":[],"upperOnlyCompatible":true},
    {"id":"double_breasted","labelJa":"ダブルの打ち合わせ","shortPrompt":"double-breasted closure","groupJa":"ボタン","tags":[],"upperOnlyCompatible":true},
    {"id":"single_breasted","labelJa":"シングルの打ち合わせ","shortPrompt":"single-breasted closure","groupJa":"ボタン","tags":[],"upperOnlyCompatible":true},
    {"id":"zip_front","labelJa":"前ファスナー","shortPrompt":"zip-front closure","groupJa":"ジッパー","tags":[],"upperOnlyCompatible":true},
    {"id":"asymmetric_zipper","labelJa":"斜めのファスナー","shortPrompt":"asymmetric zipper","groupJa":"ジッパー","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"side_zipper","labelJa":"脇ファスナー","shortPrompt":"side zipper","groupJa":"ジッパー","tags":[],"upperOnlyCompatible":true},
    {"id":"back_zipper","labelJa":"背面ファスナー","shortPrompt":"back zipper","groupJa":"ジッパー","tags":[],"upperOnlyCompatible":true},
    {"id":"concealed_zipper","labelJa":"コンシールファスナー","shortPrompt":"concealed zipper","groupJa":"ジッパー","tags":[],"upperOnlyCompatible":true},
    {"id":"snap_buttons","labelJa":"スナップボタン","shortPrompt":"snap-button closure","groupJa":"留め具","tags":[],"upperOnlyCompatible":true},
    {"id":"hook_and_eye","labelJa":"ホック","shortPrompt":"hook-and-eye closure","groupJa":"留め具","tags":[],"upperOnlyCompatible":true},
    {"id":"buckle_fastening","labelJa":"バックル留め","shortPrompt":"buckle fastening","groupJa":"留め具","tags":[],"upperOnlyCompatible":true},
    {"id":"multiple_buckles","labelJa":"複数バックル","shortPrompt":"multiple buckle fastenings","groupJa":"留め具","tags":[],"upperOnlyCompatible":true},
    {"id":"clasp_closure","labelJa":"クラスプ留め","shortPrompt":"clasp closure","groupJa":"留め具","tags":[],"upperOnlyCompatible":true},
    {"id":"fictional_clasp","labelJa":"磁力式に見える架空留め具","shortPrompt":"magnetic-looking fictional clasp","groupJa":"留め具","tags":[],"upperOnlyCompatible":true},
    {"id":"lace_up_front","labelJa":"前の編み上げ","shortPrompt":"lace-up front","groupJa":"結び・編み上げ","tags":[],"upperOnlyCompatible":true},
    {"id":"lace_up_back","labelJa":"後ろの編み上げ","shortPrompt":"lace-up back","groupJa":"結び・編み上げ","tags":[],"upperOnlyCompatible":true},
    {"id":"corset_lacing","labelJa":"コルセット編み上げ","shortPrompt":"corset lacing","groupJa":"結び・編み上げ","tags":[],"upperOnlyCompatible":true},
    {"id":"wrap_closure","labelJa":"巻き合わせ","shortPrompt":"wrap closure","groupJa":"結び・編み上げ","tags":[],"upperOnlyCompatible":true},
    {"id":"tie_front","labelJa":"前結び","shortPrompt":"tie-front closure","groupJa":"結び・編み上げ","tags":[],"upperOnlyCompatible":true},
    {"id":"frog_closures","labelJa":"チャイナボタン","shortPrompt":"frog closures","groupJa":"結び・編み上げ","tags":[],"upperOnlyCompatible":true},
    {"id":"knot_buttons","labelJa":"結びボタン","shortPrompt":"knot buttons","groupJa":"結び・編み上げ","tags":[],"upperOnlyCompatible":true}
  ] },
    { id: "cutout", labelJa: "カットアウト・開口", multi: true, options: [
    {"id":"small_keyhole","labelJa":"小さなキーホール","shortPrompt":"small keyhole cutout","groupJa":"胸元・肩","tags":[],"upperOnlyCompatible":true},
    {"id":"chest_keyhole","labelJa":"胸元の縦長キーホール","shortPrompt":"chest keyhole","groupJa":"胸元・肩","tags":[],"upperOnlyCompatible":true},
    {"id":"shoulder_cutouts","labelJa":"肩の開口","shortPrompt":"shoulder cutouts","groupJa":"胸元・肩","tags":[],"upperOnlyCompatible":true},
    {"id":"cold_shoulder_cutouts","labelJa":"肩先の開口","shortPrompt":"cold-shoulder cutouts","groupJa":"胸元・肩","tags":[],"upperOnlyCompatible":true},
    {"id":"upper_back_cutout","labelJa":"背面上部の開口","shortPrompt":"upper-back cutout","groupJa":"背面","tags":["open_back"],"upperOnlyCompatible":true},
    {"id":"open_back","labelJa":"オープンバック","shortPrompt":"open back","groupJa":"背面","tags":["open_back"],"upperOnlyCompatible":true},
    {"id":"low_back","labelJa":"低い背あき","shortPrompt":"low back","groupJa":"背面","tags":["open_back"],"upperOnlyCompatible":true},
    {"id":"backless","labelJa":"背面を覆わない構造","shortPrompt":"backless design","groupJa":"背面","tags":["open_back"],"upperOnlyCompatible":true},
    {"id":"side_cutouts","labelJa":"脇のカットアウト","shortPrompt":"side cutouts","groupJa":"脇・ウエスト","tags":[],"upperOnlyCompatible":true},
    {"id":"deep_side_openings","labelJa":"深い脇あき","shortPrompt":"deep side openings","groupJa":"脇・ウエスト","tags":[],"upperOnlyCompatible":true},
    {"id":"underarm_cutouts","labelJa":"袖下のカットアウト","shortPrompt":"underarm cutouts","groupJa":"脇・ウエスト","tags":[],"upperOnlyCompatible":true},
    {"id":"waist_cutouts","labelJa":"腰のカットアウト","shortPrompt":"waist cutouts","groupJa":"脇・ウエスト","tags":[],"upperOnlyCompatible":true},
    {"id":"midriff_cutout","labelJa":"中央のカットアウト","shortPrompt":"midriff cutout","groupJa":"脇・ウエスト","tags":[],"upperOnlyCompatible":true},
    {"id":"geometric_cutouts","labelJa":"幾何学カットアウト","shortPrompt":"geometric cutouts","groupJa":"形・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"diamond_cutout","labelJa":"ひし形カットアウト","shortPrompt":"diamond cutout","groupJa":"形・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"circular_cutout","labelJa":"円形カットアウト","shortPrompt":"circular cutout","groupJa":"形・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"asymmetric_cutout","labelJa":"非対称カットアウト","shortPrompt":"asymmetric cutout","groupJa":"形・組み立て","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"side_open_panels","labelJa":"脇が開いたパネル","shortPrompt":"side-open panels","groupJa":"形・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"open_sides","labelJa":"脇を覆わない構造","shortPrompt":"open sides","groupJa":"形・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"layered_cutout_panels","labelJa":"重ねた開口パネル","shortPrompt":"layered cutout panels","groupJa":"形・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"mesh_inset_cutout","labelJa":"メッシュ入りカットアウト","shortPrompt":"mesh-inset cutout","groupJa":"形・組み立て","tags":[],"upperOnlyCompatible":true}
  ] },
    { id: "construction_detail", labelJa: "仕立て・構造", multi: false, options: [
    {"id":"panel_construction","labelJa":"パネル仕立て","shortPrompt":"panel construction","groupJa":"縫い目・パネル","tags":[],"upperOnlyCompatible":true},
    {"id":"princess_seams","labelJa":"プリンセスライン","shortPrompt":"princess seams","groupJa":"縫い目・パネル","tags":[],"upperOnlyCompatible":true},
    {"id":"shaped_seams","labelJa":"立体的な切り替え","shortPrompt":"shaped seams","groupJa":"縫い目・パネル","tags":[],"upperOnlyCompatible":true},
    {"id":"contrast_seams","labelJa":"配色の切り替え線","shortPrompt":"contrast seams","groupJa":"縫い目・パネル","tags":[],"upperOnlyCompatible":true},
    {"id":"decorative_seams","labelJa":"装飾的な縫い目","shortPrompt":"decorative seams","groupJa":"縫い目・パネル","tags":[],"upperOnlyCompatible":true},
    {"id":"topstitched","labelJa":"ステッチを見せる仕立て","shortPrompt":"topstitched construction","groupJa":"縫い目・パネル","tags":[],"upperOnlyCompatible":true},
    {"id":"quilted_panels","labelJa":"キルティングパネル","shortPrompt":"quilted panels","groupJa":"縫い目・パネル","tags":[],"upperOnlyCompatible":true},
    {"id":"pleated_panels","labelJa":"プリーツパネル","shortPrompt":"pleated panels","groupJa":"布の操作","tags":[],"upperOnlyCompatible":true},
    {"id":"gathered_panels","labelJa":"ギャザーパネル","shortPrompt":"gathered panels","groupJa":"布の操作","tags":["draped"],"upperOnlyCompatible":true},
    {"id":"ruched_construction","labelJa":"ルーシュ仕立て","shortPrompt":"ruched construction","groupJa":"布の操作","tags":["draped"],"upperOnlyCompatible":true},
    {"id":"shirred_construction","labelJa":"シャーリング仕立て","shortPrompt":"shirred construction","groupJa":"布の操作","tags":["draped"],"upperOnlyCompatible":true},
    {"id":"draped_panels","labelJa":"ドレープパネル","shortPrompt":"draped panels","groupJa":"布の操作","tags":["draped"],"upperOnlyCompatible":true},
    {"id":"wrapped_panels","labelJa":"巻き付けパネル","shortPrompt":"wrapped panels","groupJa":"布の操作","tags":[],"upperOnlyCompatible":true},
    {"id":"layered_panels","labelJa":"重ねパネル","shortPrompt":"layered panels","groupJa":"布の操作","tags":[],"upperOnlyCompatible":true},
    {"id":"overlapping_panels","labelJa":"重なり合うパネル","shortPrompt":"overlapping panels","groupJa":"布の操作","tags":[],"upperOnlyCompatible":true},
    {"id":"corseted_structure","labelJa":"コルセット構造","shortPrompt":"corseted structure","groupJa":"支持・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"boned_structure","labelJa":"ボーン入り構造","shortPrompt":"boned structure","groupJa":"支持・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"reinforced_structure","labelJa":"補強された構造","shortPrompt":"reinforced structure","groupJa":"支持・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"unstructured","labelJa":"柔らかな非構築仕立て","shortPrompt":"soft unstructured construction","groupJa":"支持・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"modular_panels","labelJa":"モジュール式パネル","shortPrompt":"modular panels","groupJa":"支持・組み立て","tags":[],"upperOnlyCompatible":true},
    {"id":"detachable_panels","labelJa":"着脱式パネル","shortPrompt":"detachable panels","groupJa":"支持・組み立て","tags":[],"upperOnlyCompatible":true}
  ] },
    { id: "asymmetry_detail", labelJa: "非対称構造", multi: false, options: [
    {"id":"one_sleeve_design","labelJa":"片袖の構造","shortPrompt":"one-sleeve design","groupJa":"袖・肩","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"one_shoulder_design","labelJa":"片肩の構造","shortPrompt":"one-shoulder design","groupJa":"袖・肩","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"mismatched_sleeves","labelJa":"左右で異なる袖","shortPrompt":"mismatched sleeves","groupJa":"袖・肩","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"uneven_sleeve_lengths","labelJa":"左右で袖丈を変える","shortPrompt":"uneven sleeve lengths","groupJa":"袖・肩","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"diagonal_closure","labelJa":"斜めの開閉線","shortPrompt":"diagonal closure","groupJa":"線・配置","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"diagonal_draping","labelJa":"斜めのドレープ","shortPrompt":"diagonal draping","groupJa":"線・配置","tags":["asymmetric","draped"],"upperOnlyCompatible":true},
    {"id":"asymmetric_lapels","labelJa":"左右非対称のラペル","shortPrompt":"asymmetric lapels","groupJa":"線・配置","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"offset_collar","labelJa":"位置をずらした襟","shortPrompt":"offset collar","groupJa":"線・配置","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"asymmetric_cutout","labelJa":"非対称の開口","shortPrompt":"asymmetric cutout","groupJa":"線・配置","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"one_sided_pleating","labelJa":"片側のプリーツ","shortPrompt":"one-sided pleating","groupJa":"片側の構造","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"one_sided_ruffles","labelJa":"片側のラッフル","shortPrompt":"one-sided ruffles","groupJa":"片側の構造","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"single_shoulder_guard","labelJa":"片側の肩当て","shortPrompt":"single shoulder guard","groupJa":"片側の構造","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"one_sided_cape","labelJa":"片側のケープ","shortPrompt":"one-sided cape","groupJa":"片側の構造","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"asymmetric_skirt_panel","labelJa":"非対称のスカートパネル","shortPrompt":"asymmetric skirt panel","groupJa":"片側の構造","tags":["asymmetric"],"upperOnlyCompatible":false},
    {"id":"uneven_hem","labelJa":"不揃いの裾","shortPrompt":"uneven hem","groupJa":"片側の構造","tags":["asymmetric"],"upperOnlyCompatible":false},
    {"id":"one_sided_ornamentation","labelJa":"片側に集めた装飾","shortPrompt":"one-sided ornamentation","groupJa":"片側の構造","tags":["asymmetric"],"upperOnlyCompatible":true},
    {"id":"side_focused_design","labelJa":"片側に寄せた構成","shortPrompt":"side-focused design","groupJa":"片側の構造","tags":["asymmetric"],"upperOnlyCompatible":true}
  ] }
  ]);
})(window);
