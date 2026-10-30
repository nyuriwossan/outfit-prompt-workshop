# implementation_recommendations

作成: Manus AI

これは実装提言です。アプリのコード、GitHub、デプロイには変更を加えていません。

## 推奨アーキテクチャ

既存のデータ駆動UI・正規化・生成・rulesを崩さず、通常衣装は既存カテゴリ拡張、既存で組めるものはプリセット、完全マスコットだけを専用分岐にする。

通常衣装はカテゴリ駆動の基本衣装・部位・プリセットを再利用します。現行カテゴリは`slots`、`requiredSlots`、`recommendedSlots`によって構造UI・生成・完成度の対象を定義しており、既存部位だけの追加は専用UIなしに扱えます。[1] [2] 一方、完全マスコットは人魚のような専用生成・排他ルールがないため、headwearやtailの寄せ集めとして実装しません。[4] [6]

## 4方式の使い分け

### 既存カテゴリの拡張

top_bottom、dress、uniform、robe等の既存カテゴリに、候補固有のrequiredSlots・構造詳細・材料を追加する。

推奨: 通常の新構造は第一選択。full_mascotには使わない。

長所: 既存のカテゴリ→部位→英語ブロック→競合判定の流れを再利用できる。／A/Cの通常衣装候補を小さいデータ追加で扱える。

制約: 頭部一体・視界・換気・人格可視性を持つ完全マスコットを既存headwearとして表現すると誤った合成になる。／カテゴリ肥大化を防ぐ構造的な採用基準が必要。

### プリセット分類の追加

既存garmentと既存部位を組むレシピに、季節・イベント・衣装タイプの発見用カテゴリを付与する。

推奨: 横断比較A/Bの見せ方と、existing_base_sufficient候補の取り込みに採用する。

長所: 既存IDを再利用するB相当のレシピを重複garment化せず発見可能にする。／保存形式と生成器への影響が最小。

制約: 新しい身体構造や部品関係を強制できない。／色替えだけのプリセット増殖を招き得る。

### イベント・衣装タイプ・モチーフの独立選択

イベント（季節/用途）、衣装タイプ（構造）、モチーフ（表面・テーマ）を別々のフィルタ兼選択軸にし、プリセットは任意の近道として扱う。

推奨: カテゴリ拡張と併用する第二段階。データは独立ID、UIは折りたたみ式にする。

長所: 季節候補の「イベント性」と本体構造を分離でき、同一構造の色替えを新garmentにしない。／検索、ランダム選択、組合せ生成の説明可能性が上がる。

制約: 無効な組合せをrules.jsで止める必要がある。／小画面で選択軸が増える。

### コンセプト機能の拡張

世界観・時代・役割・用途・季節に、文化/史実メタデータ、素材の機能性、設計意図を追加する。

推奨: 構造実装の代替にはせず、documented/heritage等の補助メタデータとして段階導入する。

長所: 伝統・史実服の根拠、PPE/競技衣装の用途、動物着想のテーマを説明できる。／検索とガイダンスの精度を上げる。

制約: 概念タグだけでは衣服構造・排他制約を生成できない。／文化的な名称を装飾タグへ矮小化しない運用が必要。

## 段階的な変更計画

### 第1段階: 既存再現済みの表現

- comparisonのA/B 97行を新garmentとして複製しない。
- 必要ならイベント/タイプ検索用のpreset分類とレシピ表示だけを追加する。

### 第2段階: 通常の新構造

- A/C候補を構造差があるものだけ既存カテゴリのgarmentレコードとして追加する。
- requiredSlotsと構造詳細を先に定義し、モチーフ/配色だけの差分はpresetへ送る。

### 第3段階: 完全マスコット

- full_mascotを独立カテゴリ/専用データモデルにする。
- headCoverageとidentityVisibilityに基づくUI、生成器ブロック、hard ruleを同時に導入する。

## 完全マスコット用の最小データモデル

現行headwearは顔出しの帽子・フードであり、独立フルヘッド、視界メッシュ、換気、別体の手足、非人間キャラクターの識別可能性を表せないため。

- `headCoverage` (enum; none, partial, face_open, full_head) — full_head時に通常headwear/顔パーツとの競合をハード制御し、生成器に頭部一体の覆いを出す。
- `identityVisibility` (enum; human_face_visible, human_face_obscured, mascot_identity_visible) — full_headでも視界メッシュ・口吻・目等のマスコット識別を指示し、人間の顔が見える指示と矛盾させない。
- `mascotComponents` (object; head, body, hands, feet, vision_mesh, ventilation) — 頭・胴・手・足を別体として記録し、欠落や通常靴との競合を検査する。

hard rule:

-
 
h
e
a
d
C
o
v
e
r
a
g
e
=
f
u
l
l
_
h
e
a
d
な
ら
i
d
e
n
t
i
t
y
V
i
s
i
b
i
l
i
t
y
=
m
a
s
c
o
t
_
i
d
e
n
t
i
t
y
_
v
i
s
i
b
l
e
を
必
須
に
す
る
。


-
 
f
u
l
l
_
h
e
a
d
な
ら
m
a
s
c
o
t
C
o
m
p
o
n
e
n
t
s
.
v
i
s
i
o
n
_
m
e
s
h
と
m
a
s
c
o
t
C
o
m
p
o
n
e
n
t
s
.
v
e
n
t
i
l
a
t
i
o
n
を
必
須
に
す
る
。


-
 
f
u
l
l
_
h
e
a
d
な
ら
通
常
の
h
e
a
d
w
e
a
r
、
h
u
m
a
n
 
f
a
c
e
/
o
p
e
n
-
f
a
c
e
の
生
成
語
、
素
足
・
通
常
靴
の
不
整
合
を
禁
止
ま
た
は
置
換
提
案
す
る
。


-
 
m
a
s
c
o
t
の
手
足
が
指
定
さ
れ
た
ら
別
体
g
l
o
v
e
s
/
f
e
e
t
 
b
l
o
c
k
を
詳
細
プ
ロ
ン
プ
ト
へ
必
ず
出
す
。



## 変更候補ファイル

- `data/garments.js` — 通常候補のgarmentレコード、必要ならmascotカテゴリのcategory定義、requiredSlots/recommendedSlotsを追加する。
- `data/preset-expansion.js` — 既存IDで組めるA/B相当のイベント/衣装タイプレシピと、発見用preset分類を追加する。
- `data/parts.js` — 通常候補の専用構造部位、およびmascotComponents/headCoverageを扱うスロット定義を追加する。
- `data/decorations.js` — 動物耳・尾などの装飾と、mascotの頭/手/足を混同しない専用コンポーネント定義を追加する。
- `data/concept.js` — イベント・衣装タイプ・モチーフを独立して検索/選択できる補助概念、documented/heritage等のメタデータを追加する。
- `data/motifs.js` — 構造ではなくテーマとして扱う動物・季節モチーフを追加し、garment構造と分離する。
- `data/rules.js` — full_headの必須部品、通常headwear/顔可視性との排他、mascot手足との競合、文化メタデータ警告を宣言的ルールとして追加する。
- `app.js` — 新フィールドの初期値・正規化・旧形式移行・localStorage/共有JSONの入出力、カテゴリ駆動UI描画を追加する。
- `generator.js` — full_mascot用の強制英語ブロック（full head, vision mesh, ventilation, separate gloves/feet）と既存ブロックとの排他を追加する。
- `advisor.js` — mascot専用フィールドをトークン化し、選択不足・矛盾の提案対象にする。
- `gacha.js` — hard競合を含むmascot候補を採用しないフィルタと、独立イベント/タイプ/モチーフ軸の組合せ候補を扱う。
- `index.html` — スマホ向けの折りたたみセクション、選択済みチップ、mascot警告領域のコンテナを追加する。
- `scripts/test.cjs` — 下記テストケースを追加し、既存互換を回帰検査する。

既存保存・共有URL・JSON入出力では、新フィールドを省略可能にし、旧データには既定値を補います。既存IDは改名・削除しません。スキーマ正規化は未知IDを落とすため、旧クライアントで新スロットを再保存しない運用または前方互換方針が必要です。[3]

## スマートフォンUI

衣装本体、イベント、衣装タイプ、モチーフ、詳細部位を別アコーディオンにし、最上部に選択済みチップと矛盾件数を常時表示する。

「完全マスコット」を選ぶとheadCoverage/identityVisibilityを最初に1画面で選ばせ、その後に頭・胴・手・足・視界メッシュ・換気の必須チェックリストを表示する。

375px前後では横並び選択を避け、検索可能な単一選択ボトムシート、44px以上のタップ領域、詳細説明の折りたたみ、固定された生成ボタンを使う。

## 必要なテスト

-
 
s
c
h
e
m
a
 
m
i
g
r
a
t
i
o
n
:
 
新
フ
ィ
ー
ル
ド
な
し
の
既
存
保
存
状
態
、
旧
I
D
別
名
、
部
分
パ
ッ
チ
を
読
み
込
み
、
既
存
出
力
が
不
変
で
あ
る
こ
と
。


-
 
d
a
t
a
 
i
n
t
e
g
r
i
t
y
:
 
m
a
s
c
o
t
カ
テ
ゴ
リ
で
は
f
u
l
l
_
h
e
a
d
、
v
i
s
i
o
n
_
m
e
s
h
、
v
e
n
t
i
l
a
t
i
o
n
、
h
e
a
d
/
b
o
d
y
/
h
a
n
d
s
/
f
e
e
t
が
そ
ろ
わ
な
い
レ
コ
ー
ド
を
拒
否
す
る
こ
と
。


-
 
r
u
l
e
s
:
 
f
u
l
l
_
h
e
a
d
と
通
常
h
e
a
d
w
e
a
r
/
顔
出
し
/
通
常
靴
の
競
合
を
h
a
r
d
 
r
u
l
e
に
し
、
置
換
提
案
を
確
認
す
る
こ
と
。


-
 
g
e
n
e
r
a
t
o
r
:
 
f
u
l
l
_
m
a
s
c
o
t
時
の
み
専
用
英
語
ブ
ロ
ッ
ク
が
短
縮
/
詳
細
双
方
に
出
て
、
人
間
の
顔
が
見
え
る
語
と
共
存
し
な
い
こ
と
。


-
 
a
d
v
i
s
o
r
 
a
n
d
 
g
a
c
h
a
:
 
必
須
コ
ン
ポ
ー
ネ
ン
ト
不
足
・
h
a
r
d
競
合
を
検
出
し
、
g
a
c
h
a
候
補
か
ら
h
a
r
d
競
合
が
除
外
さ
れ
る
こ
と
。


-
 
r
e
c
i
p
e
 
r
e
g
r
e
s
s
i
o
n
:
 
c
o
m
p
a
r
i
s
o
n
の
A
/
B
 
9
7
行
の
r
e
p
r
o
d
u
c
t
i
o
n
_
r
e
c
i
p
e
が
引
き
続
き
実
在
I
D
だ
け
を
参
照
し
、
生
成
で
き
る
こ
と
。


-
 
s
t
o
r
a
g
e
/
s
h
a
r
e
:
 
l
o
c
a
l
S
t
o
r
a
g
e
、
共
有
U
R
L
、
J
S
O
N
 
e
x
p
o
r
t
/
i
m
p
o
r
t
の
旧
新
往
復
で
選
択
値
が
失
わ
れ
な
い
こ
と
。


-
 
m
o
b
i
l
e
 
U
I
:
 
3
2
0
/
3
7
5
/
3
9
0
/
4
3
0
p
x
で
ア
コ
ー
デ
ィ
オ
ン
、
チ
ッ
プ
、
エ
ラ
ー
、
固
定
生
成
ボ
タ
ン
が
横
ス
ク
ロ
ー
ル
な
く
操
作
で
き
、
キ
ー
ボ
ー
ド
操
作
/
ラ
ベ
ル
も
機
能
す
る
こ
と
。



**References**

[1]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/data/garments.js "Garment categories and base garments"
[2]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/data/parts.js "Parts data model"
[3]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/app.js "Schema migration storage and category UI"
[4]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/generator.js "Prompt generation blocks"
[5]: https://github.com/nyuriwossan/outfit-prompt-workshop/blob/185380d5ff087a92d7452c7c9a73f4c193adc395/data/rules.js "Constraint rules"
[6]: https://mascot-store.com/blogs/mascot-marketing-center/how-mascot-costumes-are-made-inside-the-anatomy-of-a-professional-mascot-suit "Mascot costume anatomy"
