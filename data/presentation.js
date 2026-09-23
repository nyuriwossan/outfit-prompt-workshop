/* Presentation vocabulary; original keys remain aliases for saved 0.1–0.4 outfits. */
(function(global){var D=global.CPW.data;
D.presentation={
  "presets": [
    {
      "id": "standing",
      "labelJa": "立ち姿",
      "shortPrompt": "full-body standing pose",
      "detailedPrompt": "Use a clear full-body standing pose that keeps the complete costume readable",
      "noteJa": "基本・全身",
      "legacyPrompt": "standing pose"
    },
    {
      "id": "turning",
      "labelJa": "振り向き",
      "shortPrompt": "turning pose, over shoulder",
      "detailedPrompt": "Use a full-body over-the-shoulder turning pose that shows the back design and leg line",
      "noteJa": "背面・視線"
    },
    {
      "id": "front_full",
      "labelJa": "正面全身",
      "shortPrompt": "front full body",
      "detailedPrompt": "Use a straight-on full-body composition with an unobstructed costume silhouette",
      "noteJa": "設計を確認"
    },
    {
      "id": "looking_up",
      "labelJa": "見上げ構図",
      "shortPrompt": "full body, upward gaze",
      "detailedPrompt": "Frame the full figure while they look upward, preserving the garment silhouette",
      "noteJa": "視線を上へ"
    },
    {
      "id": "high_angle",
      "labelJa": "見下ろし・俯瞰",
      "shortPrompt": "high angle, overhead",
      "detailedPrompt": "Use a high-angle overhead composition that clearly arranges the costume around the figure",
      "noteJa": "上から"
    },
    {
      "id": "low_angle",
      "labelJa": "ローアングル",
      "shortPrompt": "low-angle full body",
      "detailedPrompt": "Use a tasteful low-angle full-body fashion composition without distorting the outfit",
      "noteJa": "堂々と",
      "legacyPrompt": "low camera angle"
    },
    {
      "id": "seated",
      "labelJa": "座り構図",
      "shortPrompt": "supported seated fashion pose",
      "detailedPrompt": "Use a stable full-body seated fashion pose, visibly supported by the selected seat, with the garment arranged clearly",
      "noteJa": "座面を選択",
      "seated": true,
      "legacyPrompt": "seated pose"
    },
    {
      "id": "chair_sit",
      "labelJa": "椅子座り",
      "shortPrompt": "chair seated, full body",
      "detailedPrompt": "Use an elegant chair-seated full-body pose with the hem and legs arranged for costume readability",
      "noteJa": "衣装映え",
      "seated": true
    },
    {
      "id": "sofa_sit",
      "labelJa": "ソファ座り",
      "shortPrompt": "sofa seated pose",
      "detailedPrompt": "Use a composed sofa-seated pose with layered fabric spread visibly around the figure",
      "noteJa": "くつろぎ",
      "seated": true
    },
    {
      "id": "floor_sit",
      "labelJa": "床座り",
      "shortPrompt": "floor seated, spread hem",
      "detailedPrompt": "Use a floor-seated pose with the skirt or train spread in a clear radial arrangement",
      "noteJa": "裾を広げる",
      "seated": true
    },
    {
      "id": "bed",
      "labelJa": "ベッド上",
      "shortPrompt": "on bed, costume visible",
      "detailedPrompt": "Compose the figure on a neatly made bed while keeping the outfit fully visible and unobstructed",
      "noteJa": "柔らかい構図"
    },
    {
      "id": "sleeping",
      "labelJa": "寝姿・俯瞰",
      "shortPrompt": "reclining, overhead view",
      "detailedPrompt": "View the reclining figure from directly above, arranging the costume as a clear graphic shape",
      "noteJa": "上から・布の面"
    },
    {
      "id": "dakimakura",
      "labelJa": "添い寝シーツ風",
      "shortPrompt": "vertical overhead reclining composition",
      "detailedPrompt": "Use a tasteful vertical dakimakura-sheet-inspired overhead composition, reclining straight with the full costume visible from head to toe",
      "noteJa": "縦長・真上"
    },
    {
      "id": "reclining",
      "labelJa": "横たわり",
      "shortPrompt": "side reclining, full body",
      "detailedPrompt": "Use an elegant side-reclining full-body pose with the garment spread naturally",
      "noteJa": "横向き"
    },
    {
      "id": "prone",
      "labelJa": "うつ伏せ",
      "shortPrompt": "prone, high angle, back design",
      "detailedPrompt": "Use a tasteful prone pose viewed from a high angle, emphasizing the back design while keeping the costume readable",
      "noteJa": "背面を見せる"
    },
    {
      "id": "supine",
      "labelJa": "仰向け",
      "shortPrompt": "supine, overhead",
      "detailedPrompt": "Use a supine overhead pose with fabric arranged symmetrically around the body",
      "noteJa": "正面・俯瞰"
    },
    {
      "id": "one_knee",
      "labelJa": "片膝立ち",
      "shortPrompt": "one-knee full-body pose",
      "detailedPrompt": "Use a full-body one-knee pose with balanced posture and an unobstructed silhouette",
      "noteJa": "動き・強さ"
    },
    {
      "id": "crossed_legs",
      "labelJa": "脚組み",
      "shortPrompt": "seated, crossed legs",
      "detailedPrompt": "Use a supported seated pose with elegantly crossed legs and the outfit clearly arranged",
      "noteJa": "座り・端正",
      "seated": true
    },
    {
      "id": "turning_legs",
      "labelJa": "振り返り美脚",
      "shortPrompt": "turning pose, leg line",
      "detailedPrompt": "Use a tasteful turning full-body pose that emphasizes the leg line and back design",
      "noteJa": "脚線・背面"
    },
    {
      "id": "spread_dress",
      "labelJa": "ドレスを広げる",
      "shortPrompt": "spreading dress",
      "detailedPrompt": "Use both hands to spread the dress or skirt so its construction is fully visible",
      "noteJa": "裾・面積"
    },
    {
      "id": "pinch_outfit",
      "labelJa": "衣装をつまむ",
      "shortPrompt": "holding garment edge",
      "detailedPrompt": "Lightly hold one edge of the garment to display its textile, layers, and hem",
      "noteJa": "布を見せる"
    },
    {
      "id": "wind_swept",
      "labelJa": "マント・裾をなびかせる",
      "shortPrompt": "wind-swept cape or hem",
      "detailedPrompt": "Use a full-body fashion pose with the cape or hem moving in a controlled wind",
      "noteJa": "風・動き"
    },
    {
      "id": "runway",
      "labelJa": "ランウェイ",
      "shortPrompt": "runway walk, full body",
      "detailedPrompt": "Use a full-body runway walk with a confident posture and a composed expression",
      "noteJa": "歩き・全身",
      "legacyPrompt": "mid-stride"
    },
    {
      "id": "editorial",
      "labelJa": "ファッション誌風",
      "shortPrompt": "fashion editorial pose",
      "detailedPrompt": "Use a three-quarter fashion editorial composition with an elegant model pose",
      "noteJa": "洗練"
    },
    {
      "id": "stage",
      "labelJa": "ステージ構図",
      "shortPrompt": "full-body stage pose",
      "detailedPrompt": "Show the full figure in a theatrical stage pose with one sweeping gesture and clear costume lighting",
      "noteJa": "照明・動き"
    }
  ],
  "poseMoods": [
    {
      "id": "cute",
      "labelJa": "可愛い",
      "shortPrompt": "Use a cute, charming pose",
      "detailedPrompt": "Use a cute, charming pose",
      "noteJa": ""
    },
    {
      "id": "cool",
      "labelJa": "クール",
      "shortPrompt": "Use a cool and controlled pose",
      "detailedPrompt": "Use a cool and controlled pose",
      "noteJa": ""
    },
    {
      "id": "sexy",
      "labelJa": "セクシー",
      "shortPrompt": "Use an alluring but fashion-focused pose",
      "detailedPrompt": "Use an alluring but fashion-focused pose",
      "noteJa": ""
    },
    {
      "id": "refined",
      "labelJa": "上品",
      "shortPrompt": "Use a refined and dignified pose",
      "detailedPrompt": "Use a refined and dignified pose",
      "noteJa": ""
    },
    {
      "id": "mystical",
      "labelJa": "神秘的",
      "shortPrompt": "Use a mysterious, otherworldly pose",
      "detailedPrompt": "Use a mysterious, otherworldly pose",
      "noteJa": ""
    },
    {
      "id": "graceful",
      "labelJa": "優雅",
      "shortPrompt": "Use a graceful flowing pose",
      "detailedPrompt": "Use a graceful flowing pose",
      "noteJa": ""
    },
    {
      "id": "energetic",
      "labelJa": "元気",
      "shortPrompt": "Use an energetic upbeat pose",
      "detailedPrompt": "Use an energetic upbeat pose",
      "noteJa": ""
    },
    {
      "id": "languid",
      "labelJa": "気だるい",
      "shortPrompt": "Use a languid relaxed pose",
      "detailedPrompt": "Use a languid relaxed pose",
      "noteJa": ""
    },
    {
      "id": "commanding",
      "labelJa": "高圧的",
      "shortPrompt": "Use a commanding, dominant pose",
      "detailedPrompt": "Use a commanding, dominant pose",
      "noteJa": ""
    },
    {
      "id": "guardian",
      "labelJa": "守護者風",
      "shortPrompt": "Use a protective guardian-like pose",
      "detailedPrompt": "Use a protective guardian-like pose",
      "noteJa": ""
    },
    {
      "id": "idol",
      "labelJa": "アイドル風",
      "shortPrompt": "Use a polished idol-performance pose",
      "detailedPrompt": "Use a polished idol-performance pose",
      "noteJa": ""
    },
    {
      "id": "model",
      "labelJa": "モデル風",
      "shortPrompt": "Use a high-fashion model pose",
      "detailedPrompt": "Use a high-fashion model pose",
      "noteJa": ""
    },
    {
      "id": "inviting",
      "labelJa": "誘うような",
      "shortPrompt": "Use an inviting gaze and gesture",
      "detailedPrompt": "Use an inviting gaze and gesture",
      "noteJa": ""
    },
    {
      "id": "innocent",
      "labelJa": "無邪気",
      "shortPrompt": "Use an innocent playful pose",
      "detailedPrompt": "Use an innocent playful pose",
      "noteJa": ""
    },
    {
      "id": "fragile",
      "labelJa": "儚い",
      "shortPrompt": "Use a delicate, fleeting pose",
      "detailedPrompt": "Use a delicate, fleeting pose",
      "noteJa": ""
    }
  ],
  "seats": [
    {
      "id": "chair",
      "labelJa": "椅子",
      "shortPrompt": "a stable elegant chair",
      "detailedPrompt": "a stable elegant chair",
      "noteJa": ""
    },
    {
      "id": "armchair",
      "labelJa": "アームチェア",
      "shortPrompt": "an upholstered armchair",
      "detailedPrompt": "an upholstered armchair",
      "noteJa": ""
    },
    {
      "id": "throne",
      "labelJa": "玉座",
      "shortPrompt": "an ornate throne",
      "detailedPrompt": "an ornate throne",
      "noteJa": ""
    },
    {
      "id": "stool",
      "labelJa": "スツール",
      "shortPrompt": "a compact stool",
      "detailedPrompt": "a compact stool",
      "noteJa": ""
    },
    {
      "id": "bench",
      "labelJa": "ベンチ",
      "shortPrompt": "a long bench",
      "detailedPrompt": "a long bench",
      "noteJa": ""
    },
    {
      "id": "sofa",
      "labelJa": "ソファ",
      "shortPrompt": "a plush sofa",
      "detailedPrompt": "a plush sofa",
      "noteJa": ""
    },
    {
      "id": "chaise",
      "labelJa": "寝椅子",
      "shortPrompt": "an elegant chaise longue",
      "detailedPrompt": "an elegant chaise longue",
      "noteJa": ""
    },
    {
      "id": "counter_chair",
      "labelJa": "カウンターチェア",
      "shortPrompt": "a counter-height chair",
      "detailedPrompt": "a counter-height chair",
      "noteJa": ""
    },
    {
      "id": "church_chair",
      "labelJa": "教会の椅子",
      "shortPrompt": "a carved church chair",
      "detailedPrompt": "a carved church chair",
      "noteJa": ""
    },
    {
      "id": "school_chair",
      "labelJa": "学校の椅子",
      "shortPrompt": "a simple school chair",
      "detailedPrompt": "a simple school chair",
      "noteJa": ""
    },
    {
      "id": "garden_chair",
      "labelJa": "ガーデンチェア",
      "shortPrompt": "a decorative garden chair",
      "detailedPrompt": "a decorative garden chair",
      "noteJa": ""
    },
    {
      "id": "bar_stool",
      "labelJa": "バースツール",
      "shortPrompt": "a tall bar stool",
      "detailedPrompt": "a tall bar stool",
      "noteJa": ""
    },
    {
      "id": "floor",
      "labelJa": "床座り",
      "shortPrompt": "the floor with the garment arranged naturally",
      "detailedPrompt": "the floor with the garment arranged naturally",
      "noteJa": ""
    },
    {
      "id": "bed",
      "labelJa": "ベッド",
      "shortPrompt": "the edge of a neatly made bed",
      "detailedPrompt": "the edge of a neatly made bed",
      "noteJa": ""
    },
    {
      "id": "cushion",
      "labelJa": "クッション",
      "shortPrompt": "a large floor cushion",
      "detailedPrompt": "a large floor cushion",
      "noteJa": ""
    },
    {
      "id": "windowsill",
      "labelJa": "窓辺",
      "shortPrompt": "a broad windowsill",
      "detailedPrompt": "a broad windowsill",
      "noteJa": ""
    },
    {
      "id": "table_edge",
      "labelJa": "テーブル端",
      "shortPrompt": "the stable edge of a table",
      "detailedPrompt": "the stable edge of a table",
      "noteJa": ""
    },
    {
      "id": "stairs",
      "labelJa": "階段",
      "shortPrompt": "a broad stair step",
      "detailedPrompt": "a broad stair step",
      "noteJa": ""
    },
    {
      "id": "rock",
      "labelJa": "岩",
      "shortPrompt": "a stable natural rock",
      "detailedPrompt": "a stable natural rock",
      "noteJa": ""
    },
    {
      "id": "flower_field",
      "labelJa": "花畑",
      "shortPrompt": "a flower-covered ground",
      "detailedPrompt": "a flower-covered ground",
      "noteJa": ""
    },
    {
      "id": "waterside",
      "labelJa": "水辺",
      "shortPrompt": "a dry stable ledge beside the water",
      "detailedPrompt": "a dry stable ledge beside the water",
      "noteJa": ""
    }
  ],
  "backgrounds": [
    {
      "id": "none",
      "labelJa": "衣装だけ",
      "shortPrompt": "",
      "detailedPrompt": "",
      "noteJa": "背景指定なし"
    },
    {
      "id": "light",
      "labelJa": "軽い演出",
      "shortPrompt": "minimal backdrop, themed rim light",
      "detailedPrompt": "Keep the setting minimal with theme-colored rim light and a few restrained atmospheric particles, leaving the costume as the clear focal point",
      "noteJa": "光と粒子のみ"
    },
    {
      "id": "theme",
      "labelJa": "テーマ背景",
      "shortPrompt": "theme-responsive environment",
      "detailedPrompt": "Place the figure in a simplified environment that echoes the motif through color, light, and a few symbolic forms without competing with the costume",
      "noteJa": "世界観を添える"
    },
    {
      "id": "illustration",
      "labelJa": "一枚絵",
      "shortPrompt": "narrative background, cinematic depth",
      "detailedPrompt": "Build a fully realized narrative environment around the motif with cinematic lighting and layered depth while keeping the costume as the brightest visual anchor",
      "noteJa": "物語の空間"
    }
  ],
  "subjects": [
    {
      "id": "girl",
      "labelJa": "1girl",
      "shortPrompt": "1girl",
      "detailedPrompt": "1girl",
      "noteJa": ""
    },
    {
      "id": "boy",
      "labelJa": "1boy",
      "shortPrompt": "1boy",
      "detailedPrompt": "1boy",
      "noteJa": ""
    },
    {
      "id": "woman",
      "labelJa": "成人女性",
      "shortPrompt": "an adult woman",
      "detailedPrompt": "an adult woman",
      "noteJa": ""
    },
    {
      "id": "man",
      "labelJa": "成人男性",
      "shortPrompt": "an adult man",
      "detailedPrompt": "an adult man",
      "noteJa": ""
    },
    {
      "id": "androgynous",
      "labelJa": "中性的",
      "shortPrompt": "an androgynous adult model",
      "detailedPrompt": "an androgynous adult model",
      "noteJa": ""
    }
  ],
  "paints": [
    {
      "id": "cel",
      "labelJa": "アニメ塗り",
      "shortPrompt": "anime cel shading",
      "detailedPrompt": "anime cel shading",
      "noteJa": ""
    },
    {
      "id": "soft",
      "labelJa": "柔らかい塗り",
      "shortPrompt": "soft shading",
      "detailedPrompt": "soft shading",
      "noteJa": ""
    },
    {
      "id": "semi",
      "labelJa": "セミリアル",
      "shortPrompt": "semi-realistic painting",
      "detailedPrompt": "semi-realistic painting",
      "noteJa": ""
    },
    {
      "id": "painterly",
      "labelJa": "絵画調",
      "shortPrompt": "painterly rendering",
      "detailedPrompt": "painterly rendering",
      "noteJa": ""
    },
    {
      "id": "watercolor",
      "labelJa": "水彩風",
      "shortPrompt": "watercolor-like rendering",
      "detailedPrompt": "watercolor-like rendering",
      "noteJa": ""
    },
    {
      "id": "glossy",
      "labelJa": "艶のある塗り",
      "shortPrompt": "glossy rendering",
      "detailedPrompt": "glossy rendering",
      "noteJa": ""
    },
    {
      "id": "decorative",
      "labelJa": "装飾イラスト",
      "shortPrompt": "decorative illustration",
      "detailedPrompt": "decorative illustration",
      "noteJa": ""
    }
  ],
  "finishes": [
    {
      "id": "matte",
      "labelJa": "マット",
      "shortPrompt": "matte finish",
      "detailedPrompt": "matte finish",
      "noteJa": ""
    },
    {
      "id": "glossy",
      "labelJa": "グロッシー",
      "shortPrompt": "glossy finish",
      "detailedPrompt": "glossy finish",
      "noteJa": ""
    },
    {
      "id": "luminous",
      "labelJa": "発光感",
      "shortPrompt": "luminous finish",
      "detailedPrompt": "luminous finish",
      "noteJa": ""
    },
    {
      "id": "silky",
      "labelJa": "シルキー",
      "shortPrompt": "silky finish",
      "detailedPrompt": "silky finish",
      "noteJa": ""
    },
    {
      "id": "ethereal",
      "labelJa": "幻想光",
      "shortPrompt": "ethereal glow",
      "detailedPrompt": "ethereal glow",
      "noteJa": ""
    }
  ],
  "lines": [
    {
      "id": "clean",
      "labelJa": "クリーン",
      "shortPrompt": "clean lineart",
      "detailedPrompt": "clean lineart",
      "noteJa": ""
    },
    {
      "id": "delicate",
      "labelJa": "繊細",
      "shortPrompt": "delicate lineart",
      "detailedPrompt": "delicate lineart",
      "noteJa": ""
    },
    {
      "id": "bold",
      "labelJa": "太め",
      "shortPrompt": "bold lineart",
      "detailedPrompt": "bold lineart",
      "noteJa": ""
    },
    {
      "id": "edges",
      "labelJa": "絵画的な輪郭",
      "shortPrompt": "painterly edges",
      "detailedPrompt": "painterly edges",
      "noteJa": ""
    }
  ]
};
D.presentationFocus=[
  {
    "id": "full_outfit",
    "labelJa": "全身",
    "shortPrompt": "full-body view of the outfit"
  },
  {
    "id": "upper_body",
    "labelJa": "上半身",
    "shortPrompt": "upper-body view"
  },
  {
    "id": "detail",
    "labelJa": "細部",
    "shortPrompt": "close-up on the garment details"
  }
];
D.poseAssist=[
  {
    "id": "standing",
    "labelJa": "立ち姿",
    "shortPrompt": "standing pose"
  },
  {
    "id": "walking",
    "labelJa": "歩く",
    "shortPrompt": "mid-stride"
  },
  {
    "id": "seated",
    "labelJa": "座る",
    "shortPrompt": "seated pose"
  }
];
D.compositionAssist=[
  {
    "id": "plain_bg",
    "labelJa": "無地背景",
    "shortPrompt": "plain background"
  },
  {
    "id": "centered",
    "labelJa": "中央配置",
    "shortPrompt": "centered composition"
  },
  {
    "id": "low_angle",
    "labelJa": "あおり",
    "shortPrompt": "low camera angle"
  }
];
D.poseAssist=D.poseAssist.map(function(o){var map={standing:'standing',walking:'runway',seated:'seated'},p=D.presentation.presets.find(function(x){return x.id===map[o.id];});return {id:o.id,labelJa:o.labelJa,shortPrompt:p.legacyPrompt,presetId:p.id};});
})(window);
