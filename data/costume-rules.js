/* 衣装プロンプト工房 / data/costume-rules.js
 * 着ぐるみ・完全マスコットの競合ルール（宣言）。判定は costume-checks.js が advisor の CHECKS へ登録する。
 * 通常編集では値を勝手に消さない。解決ボタンを押したときだけ該当値を外す。 */
(function (global) {
  var CPW = (global.CPW = global.CPW || {});
  CPW.data.rules.push(
    {
      id: 'mascot_face_request_in_tags', kind: 'check', check: 'mascotFaceInTags', type: 'semantic', severity: 'hard', category: '着ぐるみ',
      titleJa: '完全マスコットと「顔を見せる」追加タグ',
      messageJa: '完全マスコットは頭部が頭全体を覆い、人の顔は見えない構造です。追加タグに顔を見せる語があると、英文の中で矛盾します。顔を見せたい場合は大分類を「着ぐるみ・動物服（顔出し）」にしてください。',
      resolutions: [
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'mascot_dormant_human_parts', kind: 'check', check: 'mascotDormantParts', type: 'output', severity: 'warning', category: '着ぐるみ',
      titleJa: '完全マスコットでは使わない部位が残っている',
      messageJa: '通常の頭部・靴・手袋・レッグウェア・顔出しフードは、完全マスコットでは出力しません（値は保持中）。大分類を戻すと復帰します。不要なら外してください。',
      resolutions: []
    },
    {
      id: 'mascot_face_presentation', kind: 'check', check: 'mascotFacePresentation', type: 'semantic', severity: 'warning', category: '着ぐるみ',
      titleJa: '完全マスコットと顔寄り・視線の指定',
      messageJa: '人の顔は見えないため、顔寄りの距離や視線の指定はマスコット頭部の表情として解釈されます。',
      resolutions: [
        { labelJa: '距離を上半身にする', action: 'setPath:presentation.distanceId=upper' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'mascot_body_special_parts', kind: 'check', check: 'mascotSpecialParts', type: 'semantic', severity: 'info', category: '着ぐるみ',
      titleJa: '完全マスコットと身体の特殊パーツ',
      messageJa: '特殊パーツ（翼・角・光輪・尾）は身体から生える部位として英語にします。マスコットの造形として付けたい特徴は、題材・頭部・衣装の尾で指定すると安定します。',
      resolutions: []
    },
    {
      id: 'kigurumi_hands_vs_handwear', kind: 'check', check: 'kigurumiHandsVsHandwear', type: 'physical', severity: 'warning', category: '着ぐるみ',
      titleJa: '着ぐるみのミトンと手袋が重なっている',
      messageJa: '袖先のミトン・ひれと、別の手袋が同時に指定されています。手元が二重になり、生成が崩れやすくなります。',
      resolutions: [
        { labelJa: '手袋を外す', action: 'setPath:parts.handwear=' },
        { labelJa: '着ぐるみの手元を外す', action: 'setPath:parts.kigurumi_hands=' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'kigurumi_feet_vs_footwear', kind: 'check', check: 'kigurumiFeetVsFootwear', type: 'physical', severity: 'warning', category: '着ぐるみ',
      titleJa: '足先まで一体の着ぐるみと靴',
      messageJa: '足先まで一体の着ぐるみ（またはスリッパ）と、別の靴が同時に指定されています。',
      resolutions: [
        { labelJa: '靴を外す', action: 'setPath:parts.footwear=' },
        { labelJa: '足首までにする', action: 'setPath:parts.kigurumi_feet=open_ankle_hem' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'kigurumi_hood_vs_headwear', kind: 'check', check: 'kigurumiHoodVsHeadwear', type: 'physical', severity: 'warning', category: '着ぐるみ',
      titleJa: '動物フードと帽子が重なっている',
      messageJa: 'かぶった動物フードの上に帽子・カチューシャを重ねると、耳や角の位置が読み取れなくなります。',
      resolutions: [
        { labelJa: '頭部装飾を外す', action: 'setPath:parts.headwear=' },
        { labelJa: 'フードを下ろす', action: 'setPath:parts.animal_hood=hood_worn_down' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    },
    {
      id: 'face_covering_headwear', kind: 'check', check: 'faceCoveringHeadwear', type: 'output', severity: 'info', category: '部位',
      titleJa: '顔を覆う仮面',
      messageJa: '全面仮面は顔を隠します。顔立ちや表情を見せたい場合は、目元仮面や仮面なしにしてください。',
      resolutions: [
        { labelJa: '目元仮面にする', action: 'setPath:parts.headwear=masquerade_mask' },
        { labelJa: 'このまま維持する', action: 'ignore' }
      ]
    }
  );
})(typeof window !== 'undefined' ? window : global);
