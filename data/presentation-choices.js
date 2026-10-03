/* Composition-free pose phrases and explicit legacy defaults. */
Object.assign(window.CPW.data.presentation,{
  "poseChoices": [
    {
      "id": "standing",
      "kind": "pose",
      "categoryId": "stand",
      "labelJa": "立ち姿",
      "noteJa": "身体を起こし、腕を自然に下ろす",
      "shortPrompt": "standing upright",
      "detailedPrompt": "Stand upright with the arms resting naturally",
      "support": null,
      "requiresLegs": true,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "turning",
      "kind": "pose",
      "categoryId": "stand",
      "labelJa": "振り向き",
      "noteJa": "上体をひねって肩越しに衣装を見せる",
      "shortPrompt": "turning the upper body over one shoulder",
      "detailedPrompt": "Turn the upper body to show the back of the outfit over one shoulder",
      "support": null,
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "looking_up",
      "kind": "set",
      "categoryId": "stand",
      "labelJa": "見上げ構図",
      "noteJa": "胴体を起こして頭を上へ向ける",
      "shortPrompt": "tilting the head upward",
      "detailedPrompt": "Tilt the head upward while holding the torso upright",
      "support": null,
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "seated",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "座り構図",
      "noteJa": "腰を座面で支えて安定して座る",
      "shortPrompt": "sitting in a supported position",
      "detailedPrompt": "Sit with the weight supported and the garment arranged naturally",
      "support": "sit",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "chair_sit",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "椅子座り",
      "noteJa": "椅子に腰掛け、上体をまっすぐ起こす",
      "shortPrompt": "sitting upright on a chair",
      "detailedPrompt": "Sit upright with the hips supported by a chair",
      "support": "chair",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "sofa_sit",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "ソファ座り",
      "noteJa": "ソファの背に身体を預けて座る",
      "shortPrompt": "sitting back on a sofa",
      "detailedPrompt": "Sit back with the hips and back supported by a sofa",
      "support": "sofa",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "floor_sit",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "床座り",
      "noteJa": "床に座り、周囲へ裾を広げる",
      "shortPrompt": "sitting on the ground with the hem spread",
      "detailedPrompt": "Sit on the ground and arrange the hem around the body",
      "support": "floor",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "bed",
      "kind": "set",
      "categoryId": "sit",
      "labelJa": "ベッド上",
      "noteJa": "ベッドに腰掛けて衣装を見せる",
      "shortPrompt": "sitting on a bed",
      "detailedPrompt": "Sit on the bed with the garment visible",
      "support": "bed_sit",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "sleeping",
      "kind": "set",
      "categoryId": "lie",
      "labelJa": "寝姿・俯瞰",
      "noteJa": "横たわる姿を真上から捉えるセット",
      "shortPrompt": "reclining with the outfit arranged around the body",
      "detailedPrompt": "Recline with the fabric arranged around the body",
      "support": "lie",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "dakimakura",
      "kind": "set",
      "categoryId": "lie",
      "labelJa": "添い寝シーツ風",
      "noteJa": "身体を縦に伸ばし、真上から全身を捉えるセット",
      "shortPrompt": "lying straight along a vertical axis",
      "detailedPrompt": "Lie straight along the vertical axis of the frame",
      "support": "lie",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "reclining",
      "kind": "pose",
      "categoryId": "lie",
      "labelJa": "横たわり",
      "noteJa": "身体を横向きにして寝そべる",
      "shortPrompt": "lying on one side",
      "detailedPrompt": "Lie on one side with the garment resting naturally",
      "support": "lie",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "prone",
      "kind": "set",
      "categoryId": "lie",
      "labelJa": "うつ伏せ",
      "noteJa": "うつ伏せの身体を上から捉えるセット",
      "shortPrompt": "lying face down",
      "detailedPrompt": "Lie face down with the back of the outfit visible",
      "support": "lie",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "supine",
      "kind": "set",
      "categoryId": "lie",
      "labelJa": "仰向け",
      "noteJa": "仰向けの身体を真上から捉えるセット",
      "shortPrompt": "lying on the back",
      "detailedPrompt": "Lie on the back with fabric arranged to either side",
      "support": "lie",
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "one_knee",
      "kind": "pose",
      "categoryId": "kneel",
      "labelJa": "片膝立ち",
      "noteJa": "片方の膝を床につけ、上体を起こす",
      "shortPrompt": "kneeling on one knee",
      "detailedPrompt": "Lower one knee to the ground while keeping the torso upright",
      "support": "floor",
      "requiresLegs": true,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "crossed_legs",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "脚組み",
      "noteJa": "座面に腰を置き、一方の脚を他方へ重ねる",
      "shortPrompt": "sitting with crossed legs",
      "detailedPrompt": "Sit supported with one leg crossed over the other",
      "support": "chair",
      "requiresLegs": true,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "turning_legs",
      "kind": "pose",
      "categoryId": "stand",
      "labelJa": "振り返り美脚",
      "noteJa": "片脚を伸ばしながら上体をひねる",
      "shortPrompt": "turning the torso with one leg extended",
      "detailedPrompt": "Turn the torso while extending one leg to show the leg line",
      "support": null,
      "requiresLegs": true,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "spread_dress",
      "kind": "pose",
      "categoryId": "clothes",
      "labelJa": "ドレスを広げる",
      "noteJa": "両手でスカートの左右を持って広げる",
      "shortPrompt": "spreading the skirt with both hands",
      "detailedPrompt": "Hold both sides of the skirt and spread the fabric outward",
      "support": null,
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": "skirt"
    },
    {
      "id": "pinch_outfit",
      "kind": "pose",
      "categoryId": "clothes",
      "labelJa": "衣装をつまむ",
      "noteJa": "指先で衣装の片端を軽く持ち上げる",
      "shortPrompt": "holding one garment edge",
      "detailedPrompt": "Lightly lift one edge of the garment with the fingertips",
      "support": null,
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "wind_swept",
      "kind": "pose",
      "categoryId": "clothes",
      "labelJa": "マント・裾をなびかせる",
      "noteJa": "上体を保ちながらマントや裾を風になびかせる",
      "shortPrompt": "holding a pose as the cape or hem moves in the wind",
      "detailedPrompt": "Hold the torso steady while the cape or hem moves in the wind",
      "support": null,
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "runway",
      "kind": "pose",
      "categoryId": "move",
      "labelJa": "ランウェイ",
      "noteJa": "腕を自然に下ろし、一歩前へ踏み出す",
      "shortPrompt": "walking a runway step",
      "detailedPrompt": "Take a deliberate runway step with the arms relaxed",
      "support": null,
      "requiresLegs": true,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "editorial",
      "kind": "set",
      "categoryId": "stand",
      "labelJa": "ファッション誌風",
      "noteJa": "身体の線を意識したモデル風のポーズ",
      "shortPrompt": "holding a fashion editorial pose",
      "detailedPrompt": "Hold a composed fashion editorial pose",
      "support": null,
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "stage",
      "kind": "set",
      "categoryId": "move",
      "labelJa": "ステージ構図",
      "noteJa": "片腕を大きく伸ばして舞台の動きを見せるセット",
      "shortPrompt": "making a sweeping stage gesture",
      "detailedPrompt": "Extend one arm in a broad stage gesture",
      "support": null,
      "requiresLegs": false,
      "searchAliases": [],
      "requiresFeature": null
    },
    {
      "id": "hand_hip",
      "kind": "pose",
      "categoryId": "stand",
      "labelJa": "片手を腰に置く",
      "noteJa": "片方の手を腰に当て、肘を外へ向ける",
      "shortPrompt": "one hand resting on the hip",
      "detailedPrompt": "Rest one hand on the hip with the elbow pointing outward",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "立ち"
      ]
    },
    {
      "id": "hands_behind",
      "kind": "pose",
      "categoryId": "stand",
      "labelJa": "両手を背中で組む",
      "noteJa": "腰の後ろで両手をゆるく組む",
      "shortPrompt": "hands clasped behind the back",
      "detailedPrompt": "Clasp both hands loosely behind the lower back",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "立ち"
      ]
    },
    {
      "id": "shoulder_wall",
      "kind": "pose",
      "categoryId": "stand",
      "labelJa": "壁に肩を預ける",
      "noteJa": "片方の肩を壁に触れさせて支える",
      "shortPrompt": "one shoulder leaning against a wall",
      "detailedPrompt": "Support one shoulder against a wall while keeping the torso relaxed",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "立ち"
      ]
    },
    {
      "id": "weight_one_leg",
      "kind": "pose",
      "categoryId": "stand",
      "labelJa": "片足に重心を置く",
      "noteJa": "片脚で体重を支え、もう片方の膝を緩める",
      "shortPrompt": "weight shifted onto one leg",
      "detailedPrompt": "Shift the weight onto one leg and relax the opposite knee",
      "support": null,
      "requiresLegs": true,
      "requiresFeature": null,
      "searchAliases": [
        "立ち"
      ]
    },
    {
      "id": "hand_chest",
      "kind": "pose",
      "categoryId": "stand",
      "labelJa": "片手を胸元に添える",
      "noteJa": "片手を衣装の胸元へそっと添える",
      "shortPrompt": "one hand resting at the upper chest",
      "detailedPrompt": "Rest one open hand gently over the upper chest of the garment",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "立ち"
      ]
    },
    {
      "id": "chair_edge",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "椅子に浅く腰掛ける",
      "noteJa": "椅子の前方に腰を置いて上体を起こす",
      "shortPrompt": "sitting on the front of a chair seat",
      "detailedPrompt": "Sit near the front of the chair seat with the torso upright",
      "support": "chair",
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "座り"
      ]
    },
    {
      "id": "knees_diagonal",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "膝をそろえて斜めに座る",
      "noteJa": "両膝をそろえ、身体に対して斜めへ向ける",
      "shortPrompt": "sitting with both knees together to one side",
      "detailedPrompt": "Sit with the knees together and angled to one side of the torso",
      "support": "chair",
      "requiresLegs": true,
      "requiresFeature": null,
      "searchAliases": [
        "座り"
      ]
    },
    {
      "id": "arms_chair_back",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "椅子の背もたれに腕を預ける",
      "noteJa": "背もたれに両腕を置いて座る",
      "shortPrompt": "sitting with both arms resting on the chair back",
      "detailedPrompt": "Sit turned toward the chair back and rest both arms on top of its backrest",
      "support": "backrest",
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "座り"
      ]
    },
    {
      "id": "seated_chin",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "座って頬杖をつく",
      "noteJa": "座面に支えられながら片手で頬を支える",
      "shortPrompt": "seated with the cheek supported by one hand",
      "detailedPrompt": "Sit supported and rest the cheek in one hand",
      "support": "sit",
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "座り"
      ]
    },
    {
      "id": "seated_forward",
      "kind": "pose",
      "categoryId": "sit",
      "labelJa": "座って上体を少し前に傾ける",
      "noteJa": "腰を座面に置いたまま上体を少し前へ",
      "shortPrompt": "sitting with the torso leaning slightly forward",
      "detailedPrompt": "Keep the hips supported while leaning the torso slightly forward",
      "support": "sit",
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "座り"
      ]
    },
    {
      "id": "upright_kneel",
      "kind": "pose",
      "categoryId": "kneel",
      "labelJa": "両膝をついて上体を伸ばす",
      "noteJa": "両膝を床に置いて胴体をまっすぐ伸ばす",
      "shortPrompt": "kneeling upright on both knees",
      "detailedPrompt": "Rest both knees on the ground and extend the torso upright",
      "support": "floor",
      "requiresLegs": true,
      "requiresFeature": null,
      "searchAliases": [
        "床"
      ]
    },
    {
      "id": "seiza_hands",
      "kind": "pose",
      "categoryId": "kneel",
      "labelJa": "正座して手を膝に置く",
      "noteJa": "足を畳んで座り、両手をそれぞれの膝に置く",
      "shortPrompt": "sitting seiza with hands on the knees",
      "detailedPrompt": "Fold the legs underneath in seiza and rest each hand on its knee",
      "support": "floor",
      "requiresLegs": true,
      "requiresFeature": null,
      "searchAliases": [
        "床"
      ]
    },
    {
      "id": "side_sit_hand",
      "kind": "pose",
      "categoryId": "kneel",
      "labelJa": "横座りで片手を床につく",
      "noteJa": "両脚を横へ畳み、片手で床を支える",
      "shortPrompt": "side sitting with one hand on the ground",
      "detailedPrompt": "Fold both legs to one side and support the torso with one hand on the ground",
      "support": "floor",
      "requiresLegs": true,
      "requiresFeature": null,
      "searchAliases": [
        "床"
      ]
    },
    {
      "id": "crouch_arm",
      "kind": "pose",
      "categoryId": "kneel",
      "labelJa": "しゃがんで片腕を膝に置く",
      "noteJa": "腰を低く落として片腕を膝に載せる",
      "shortPrompt": "crouching with one forearm resting on a knee",
      "detailedPrompt": "Lower into a crouch and rest one forearm across a bent knee",
      "support": "floor",
      "requiresLegs": true,
      "requiresFeature": null,
      "searchAliases": [
        "床"
      ]
    },
    {
      "id": "floor_knee_up",
      "kind": "pose",
      "categoryId": "kneel",
      "labelJa": "片膝を立てて床に座る",
      "noteJa": "床に腰を下ろして片膝だけを立てる",
      "shortPrompt": "sitting on the ground with one knee raised",
      "detailedPrompt": "Sit directly on the ground and raise one bent knee",
      "support": "floor",
      "requiresLegs": true,
      "requiresFeature": null,
      "searchAliases": [
        "床"
      ]
    },
    {
      "id": "side_elbow",
      "kind": "pose",
      "categoryId": "lie",
      "labelJa": "横向きで肘をついて上体を起こす",
      "noteJa": "身体を横にして肘で上体を支える",
      "shortPrompt": "lying on one side propped up on an elbow",
      "detailedPrompt": "Lie on one side and support the raised torso on one elbow",
      "support": "lie",
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "寝る"
      ]
    },
    {
      "id": "supine_arm",
      "kind": "pose",
      "categoryId": "lie",
      "labelJa": "仰向けで片腕を頭の上へ伸ばす",
      "noteJa": "仰向けの身体に沿って片腕を頭の先へ伸ばす",
      "shortPrompt": "lying on the back with one arm extended beyond the head",
      "detailedPrompt": "Lie on the back and extend one arm along the surface beyond the head",
      "support": "lie",
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "寝る"
      ]
    },
    {
      "id": "prone_elbows",
      "kind": "pose",
      "categoryId": "lie",
      "labelJa": "うつ伏せで肘をついて顔を上げる",
      "noteJa": "両肘で上体を支え、頭を少し持ち上げる",
      "shortPrompt": "lying prone propped on both elbows",
      "detailedPrompt": "Lie face down and prop the upper body on both elbows with the head raised",
      "support": "lie",
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "寝る"
      ]
    },
    {
      "id": "chaise_upright",
      "kind": "pose",
      "categoryId": "lie",
      "labelJa": "寝椅子で上体を起こしてくつろぐ",
      "noteJa": "寝椅子に身体を預け、上体だけを起こす",
      "shortPrompt": "reclining on a chaise with the torso raised",
      "detailedPrompt": "Recline along a chaise longue with the upper body supported in a raised position",
      "support": "chaise",
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "寝る"
      ]
    },
    {
      "id": "recline_cheek",
      "kind": "pose",
      "categoryId": "lie",
      "labelJa": "横たわって片手を頬に添える",
      "noteJa": "横たわったまま片手を頬の横へ添える",
      "shortPrompt": "reclining with one hand beside the cheek",
      "detailedPrompt": "Recline along the surface and place one hand gently beside the cheek",
      "support": "lie",
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "寝る"
      ]
    },
    {
      "id": "gentle_bow",
      "kind": "pose",
      "categoryId": "move",
      "labelJa": "ゆっくり一礼する",
      "noteJa": "腰から上体を少し前へ倒して礼をする",
      "shortPrompt": "bowing gently from the waist",
      "detailedPrompt": "Incline the torso forward from the waist in a gentle bow",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "動作"
      ]
    },
    {
      "id": "dance_arm",
      "kind": "pose",
      "categoryId": "move",
      "labelJa": "踊りながら片腕を伸ばす",
      "noteJa": "片腕を横へ伸ばし、胴体をひねる踊りの瞬間",
      "shortPrompt": "dancing with one arm extended to the side",
      "detailedPrompt": "Extend one arm sideways while rotating the torso in a dance movement",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "動作"
      ]
    },
    {
      "id": "offer_hand",
      "kind": "pose",
      "categoryId": "move",
      "labelJa": "手を差し伸べる",
      "noteJa": "片腕を前へ伸ばして掌を上へ向ける",
      "shortPrompt": "extending one hand with the palm upward",
      "detailedPrompt": "Reach one arm forward with the palm facing upward",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": null,
      "searchAliases": [
        "動作"
      ]
    },
    {
      "id": "climb_stairs",
      "kind": "pose",
      "categoryId": "move",
      "labelJa": "階段を上る途中",
      "noteJa": "一方の足を高い段へ置いて体重を移す",
      "shortPrompt": "stepping up a staircase",
      "detailedPrompt": "Place one foot on the next stair and transfer the weight upward",
      "support": null,
      "requiresLegs": true,
      "requiresFeature": null,
      "searchAliases": [
        "動作"
      ]
    },
    {
      "id": "walk_turn",
      "kind": "pose",
      "categoryId": "move",
      "labelJa": "振り向きながら歩く",
      "noteJa": "一歩進みながら上体だけを後方へひねる",
      "shortPrompt": "walking while turning the upper body back",
      "detailedPrompt": "Take a forward step while rotating the upper torso backward",
      "support": null,
      "requiresLegs": true,
      "requiresFeature": null,
      "searchAliases": [
        "動作"
      ]
    },
    {
      "id": "adjust_collar",
      "kind": "pose",
      "categoryId": "clothes",
      "labelJa": "襟元を軽く整える",
      "noteJa": "指先で襟の端をそっと整える",
      "shortPrompt": "lightly adjusting the collar with the fingertips",
      "detailedPrompt": "Use the fingertips to straighten the edge of the garment collar",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": "collar",
      "searchAliases": [
        "衣装"
      ]
    },
    {
      "id": "adjust_cuff",
      "kind": "pose",
      "categoryId": "clothes",
      "labelJa": "袖口を整える",
      "noteJa": "反対側の手で袖口を軽く引いて整える",
      "shortPrompt": "straightening a sleeve cuff with the opposite hand",
      "detailedPrompt": "Use one hand to straighten the cuff of the opposite sleeve",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": "sleeves",
      "searchAliases": [
        "衣装"
      ]
    },
    {
      "id": "lift_cape",
      "kind": "pose",
      "categoryId": "clothes",
      "labelJa": "マントの片側を持ち上げる",
      "noteJa": "マントの片端を持ち上げて裏側を見せる",
      "shortPrompt": "lifting one side of the cape",
      "detailedPrompt": "Lift one side of the cape to reveal its inner surface",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": "cape",
      "searchAliases": [
        "衣装"
      ]
    },
    {
      "id": "hold_coat",
      "kind": "pose",
      "categoryId": "clothes",
      "labelJa": "コートの前端を左右に持つ",
      "noteJa": "両手でコートの左右の前端を持つ",
      "shortPrompt": "holding both front edges of the coat",
      "detailedPrompt": "Hold the left and right front edges of the coat with both hands",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": "coat",
      "searchAliases": [
        "衣装"
      ]
    },
    {
      "id": "back_ornament",
      "kind": "pose",
      "categoryId": "clothes",
      "labelJa": "肩越しに背面の装飾を見せる",
      "noteJa": "片手を反対の肩へ置き、胴体をひねって背面を見せる",
      "shortPrompt": "turning with one hand on the opposite shoulder to show the back ornament",
      "detailedPrompt": "Place one hand on the opposite shoulder and rotate the torso to display the back ornament",
      "support": null,
      "requiresLegs": false,
      "requiresFeature": "backDecoration",
      "searchAliases": [
        "衣装"
      ]
    }
  ],
  "distances": [
    {
      "id": "full",
      "labelJa": "全身",
      "shortPrompt": "full-body framing",
      "detailedPrompt": "Frame the whole figure"
    },
    {
      "id": "knees",
      "labelJa": "膝上",
      "shortPrompt": "knee-up framing",
      "detailedPrompt": "Frame the figure from the knees upward"
    },
    {
      "id": "upper",
      "labelJa": "上半身",
      "shortPrompt": "upper-body framing",
      "detailedPrompt": "Frame the upper body"
    },
    {
      "id": "face",
      "labelJa": "顔寄り",
      "shortPrompt": "close-up framing of the face",
      "detailedPrompt": "Frame a close view of the face"
    }
  ],
  "angles": [
    {
      "id": "front",
      "labelJa": "正面",
      "shortPrompt": "viewed from the front",
      "detailedPrompt": "viewed from the front"
    },
    {
      "id": "three_quarter",
      "labelJa": "斜め",
      "shortPrompt": "viewed from a three-quarter angle",
      "detailedPrompt": "viewed from a three-quarter angle"
    },
    {
      "id": "side",
      "labelJa": "横",
      "shortPrompt": "viewed from the side",
      "detailedPrompt": "viewed from the side"
    },
    {
      "id": "back",
      "labelJa": "背面",
      "shortPrompt": "viewed from behind",
      "detailedPrompt": "viewed from behind"
    },
    {
      "id": "high",
      "labelJa": "軽い俯瞰",
      "shortPrompt": "viewed from slightly above",
      "detailedPrompt": "viewed from slightly above"
    },
    {
      "id": "overhead",
      "labelJa": "真上",
      "shortPrompt": "viewed directly from above",
      "detailedPrompt": "viewed directly from above"
    },
    {
      "id": "low",
      "labelJa": "軽いあおり",
      "shortPrompt": "viewed from slightly below",
      "detailedPrompt": "viewed from slightly below"
    }
  ]
});
Object.assign(window.CPW.data,{
  "poseCategories": [
    {
      "id": "stand",
      "labelJa": "立つ・寄りかかる"
    },
    {
      "id": "sit",
      "labelJa": "座る"
    },
    {
      "id": "kneel",
      "labelJa": "膝をつく・しゃがむ"
    },
    {
      "id": "lie",
      "labelJa": "横たわる"
    },
    {
      "id": "move",
      "labelJa": "動く"
    },
    {
      "id": "clothes",
      "labelJa": "衣装を見せる"
    }
  ],
  "presentationLegacyMap": [
    {
      "id": "standing",
      "kind": "pose",
      "poseId": "standing",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "turning",
      "kind": "pose",
      "poseId": "turning",
      "distanceId": null,
      "angleId": null
    },
    {
      "id": "front_full",
      "kind": "composition",
      "poseId": null,
      "distanceId": "full",
      "angleId": "front"
    },
    {
      "id": "looking_up",
      "kind": "set",
      "poseId": "looking_up",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "high_angle",
      "kind": "composition",
      "poseId": null,
      "distanceId": null,
      "angleId": "overhead"
    },
    {
      "id": "low_angle",
      "kind": "composition",
      "poseId": null,
      "distanceId": "full",
      "angleId": "low"
    },
    {
      "id": "seated",
      "kind": "pose",
      "poseId": "seated",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "chair_sit",
      "kind": "pose",
      "poseId": "chair_sit",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "sofa_sit",
      "kind": "pose",
      "poseId": "sofa_sit",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "floor_sit",
      "kind": "pose",
      "poseId": "floor_sit",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "bed",
      "kind": "set",
      "poseId": "bed",
      "distanceId": null,
      "angleId": null
    },
    {
      "id": "sleeping",
      "kind": "set",
      "poseId": "sleeping",
      "distanceId": null,
      "angleId": "overhead"
    },
    {
      "id": "dakimakura",
      "kind": "set",
      "poseId": "dakimakura",
      "distanceId": "full",
      "angleId": "overhead"
    },
    {
      "id": "reclining",
      "kind": "pose",
      "poseId": "reclining",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "prone",
      "kind": "set",
      "poseId": "prone",
      "distanceId": null,
      "angleId": "high"
    },
    {
      "id": "supine",
      "kind": "set",
      "poseId": "supine",
      "distanceId": null,
      "angleId": "overhead"
    },
    {
      "id": "one_knee",
      "kind": "pose",
      "poseId": "one_knee",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "crossed_legs",
      "kind": "pose",
      "poseId": "crossed_legs",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "turning_legs",
      "kind": "pose",
      "poseId": "turning_legs",
      "distanceId": null,
      "angleId": null
    },
    {
      "id": "spread_dress",
      "kind": "pose",
      "poseId": "spread_dress",
      "distanceId": null,
      "angleId": null
    },
    {
      "id": "pinch_outfit",
      "kind": "pose",
      "poseId": "pinch_outfit",
      "distanceId": null,
      "angleId": null
    },
    {
      "id": "wind_swept",
      "kind": "pose",
      "poseId": "wind_swept",
      "distanceId": null,
      "angleId": null
    },
    {
      "id": "runway",
      "kind": "pose",
      "poseId": "runway",
      "distanceId": "full",
      "angleId": null
    },
    {
      "id": "editorial",
      "kind": "set",
      "poseId": "editorial",
      "distanceId": null,
      "angleId": null
    },
    {
      "id": "stage",
      "kind": "set",
      "poseId": "stage",
      "distanceId": "full",
      "angleId": null
    }
  ]
});
