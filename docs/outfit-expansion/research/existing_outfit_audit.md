# existing_outfit_audit

作成: Manus AI

監査対象は衣装プロンプト工房のmainコミット `185380d5ff087a92d7452c7c9a73f4c193adc395` です。[1] READMEの記載値ではなく、実行時データをロードして再集計しました。基本衣装は**109件**、プリセットは**72件**、選択可能なデータレコードは独立軸計上で**1,457件**です。`node scripts/test.cjs` は **2,177 / 2,177 passed** でした。

## 現行データの構成

基本衣装は9カテゴリに分かれます。

- `top_bottom`: 28件
- `dress`: 18件
- `uniform`: 14件
- `robe`: 12件
- `wafuku`: 8件
- `chinese`: 6件
- `swimwear`: 10件
- `merfolk`: 3件
- `lingerie`: 10件

プリセットは実行時に8分類されます。

- `daily`: 8件
- `work`: 10件
- `service`: 8件
- `fantasy`: 10件
- `eastern`: 6件
- `alternative`: 9件
- `stage`: 8件
- `story`: 13件

衣装構造は6つのシルエット軸、30部位スロット、50素材、30柄、81装飾、128色、15世界観、25時代、35用途、4季節、56役割、54様式、39モチーフで構成されます。[2] [3] 部位のうち選択肢が厚いのは袖32、襟・胸元25、襟25、開閉22、裾21、カットアウト21、仕立て・構造21です。

## 生成・競合・保存

1衣装の状態は、コンセプト、基本衣装、シルエット、部位、素材、装飾、特殊パーツ、配色、見せ方、着こなし、状態、出力を一つのオブジェクトに保持します。カテゴリが表示する部位、生成対象、完成度、競合トークン化の範囲を決めるため、同じ部位でもカテゴリ外では通常使われません。[2] [4]

プリセットは全置換ではなく部分patchです。未指定の選択を残したまま正規化し、適用後にユーザーが任意の部位を編集できます。短縮タグ形式と詳細英文は同じ構造から組み立てられ、空ブロックを落とし、重複句を圧縮し、カテゴリ外部位を出力しません。[4] [5]

競合はhard、warning、infoの3段階で、現在は50ルールです。例として、同一層の袖なしと長袖、詰まった胸元と深い胸元、床丈とマイクロミニはhardです。ガチャはhard競合を含む案を落としますが、通常編集は警告表示を残して設計値を保持できます。[5] [6]

保存はlocalStorageの下書き・ライブラリとJSON入出力で、既存スキーマ0.1〜0.5の読込、旧スロット名や複合値の移行、取込時の新規衣装ID発行を持ちます。既存IDを改名・削除しない追加方式なら後方互換を保てます。一方、古いクライアントは未知スロットを正規化時に落とすため、前方互換は別途運用が必要です。[4]

## 既存仕組みだけで扱える拡張

既存9カテゴリに収まる通常衣装は、基本衣装レコード、既存部位の選択肢、素材・柄・装飾・モチーフ、またはプリセットの追加で扱えます。カテゴリとslotを反復するUIなので、既存部位だけで構成する追加カテゴリも専用DOMなしで表示できます。B分類の衣装は新しい基本衣装を複製せず、既存IDを使う発見用プリセットとして追加するのが適切です。[2] [4]

## 新規実装が必要な範囲

完全着ぐるみは現行の9カテゴリにありません。headwearは帽子・フード・目元仮面までで、全頭マスク、口吻、視界、換気、別体の手足、全身外皮、尾の身体一体接続を保存可能な構造として持ちません。人魚だけは脚を尾に置換し、脚・足を否定する専用生成ブロックを持ちますが、他の完全非人間スーツに相当する仕組みはありません。[3] [5]

したがって、顔を出す動物フード、耳・尾のアクセサリー、顔出しの動物つなぎは既存カテゴリ・特殊パーツ・プリセットで近似できます。頭部まで覆うマスコットは `headCoverage`、`identityVisibility`、頭・胴・手・足・視界メッシュ・換気を扱う専用構造、生成ブロック、hard競合が必要です。

## 監査上の注意

実行時に72プリセットは8カテゴリへ分類されます。エクスポート側の単純集計には未分類72と見える箇所がありましたが、実コードのロード後分類と72件全体の照合を正としました。今後も概要ファイルだけでなくロード後の実データを件数根拠にしてください。

**References**

[1]: https://github.com/nyuriwossan/outfit-prompt-workshop/tree/185380d5ff087a92d7452c7c9a73f4c193adc395 "Outfit Prompt Workshop audited main commit"
[2]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/data/garments.js "Garment categories and base garments"
[3]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/data/parts.js "Parts and structure slots"
[4]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/app.js "State schema migration storage and category UI"
[5]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/generator.js "Prompt generator"
[6]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/data/rules.js "Conflict rules"
