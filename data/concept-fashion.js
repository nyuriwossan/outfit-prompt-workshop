/* Phase 5D concept vocabulary. Source revision is recorded below. No runtime framework. */
(function (global) {
  global.CPW.data.conceptFashion = {
  "source": {
    "repository": "nyuriwossan/concept-fashion-workshop",
    "commit": "f883463e3dd9f00c2de7c5e95c0855f11a0739d2"
  },
  "categories": [
    {
      "id": "concept",
      "labelJa": "概念・感情",
      "shortPrompt": "concept"
    },
    {
      "id": "fantasy",
      "labelJa": "ファンタジー・超常",
      "shortPrompt": "fantasy"
    },
    {
      "id": "myth",
      "labelJa": "物語・神話・伝承",
      "shortPrompt": "myth"
    },
    {
      "id": "food",
      "labelJa": "食べ物・飲み物",
      "shortPrompt": "food"
    },
    {
      "id": "nature",
      "labelJa": "自然・天体・気象",
      "shortPrompt": "nature"
    },
    {
      "id": "living",
      "labelJa": "生き物・植物",
      "shortPrompt": "living"
    },
    {
      "id": "material",
      "labelJa": "素材・現象",
      "shortPrompt": "material"
    },
    {
      "id": "art",
      "labelJa": "美術・建築・工芸",
      "shortPrompt": "art"
    },
    {
      "id": "traditional",
      "labelJa": "民族・伝統衣装",
      "shortPrompt": "traditional"
    },
    {
      "id": "stage",
      "labelJa": "特殊・舞台衣装",
      "shortPrompt": "stage"
    }
  ],
  "motifs": [
    {
      "id": "first_love",
      "labelJa": "初恋",
      "shortPrompt": "first-love-inspired",
      "summaryJa": "淡い色と花びらのような重なりで、初恋の高鳴りを表します",
      "category": "concept",
      "fallback": {
        "shape": "an opening flower and fluttering ribbon",
        "detail": "pressed-flower embroidery and tiny pearl drops"
      }
    },
    {
      "id": "jealousy",
      "labelJa": "嫉妬",
      "shortPrompt": "jealousy-inspired",
      "summaryJa": "緑の光沢と絡む蔓で、美しく危うい嫉妬を衣装化します",
      "category": "concept",
      "fallback": {
        "shape": "coiling vines and a sharply narrowed waist",
        "detail": "watchful eye-like gems and thorn motifs"
      }
    },
    {
      "id": "nostalgia",
      "labelJa": "郷愁",
      "shortPrompt": "nostalgia-inspired",
      "summaryJa": "褪せた色と古いレースで、遠い記憶の温度をまとわせます",
      "category": "concept",
      "fallback": {
        "shape": "timeworn layers and a lingering train",
        "detail": "faded botanical prints and heirloom buttons"
      }
    },
    {
      "id": "solitude",
      "labelJa": "孤独",
      "shortPrompt": "solitude-inspired",
      "summaryJa": "静かな青と余白のある構造で、凛とした孤独を表します",
      "category": "concept",
      "fallback": {
        "shape": "a narrow isolated column with floating outer layers",
        "detail": "widely spaced stars and broken-line embroidery"
      }
    },
    {
      "id": "hope",
      "labelJa": "希望",
      "shortPrompt": "hope-inspired",
      "summaryJa": "夜明けの光と上向きの線で、希望が開く瞬間を描きます",
      "category": "concept",
      "fallback": {
        "shape": "upward rays and unfolding wing-like panels",
        "detail": "sunrise beading and fine golden threads"
      }
    },
    {
      "id": "moon_witch",
      "labelJa": "月の魔女",
      "shortPrompt": "moon-witch-inspired",
      "summaryJa": "月相と夜色を、浮遊感のある魔女衣装に仕立てます",
      "category": "fantasy",
      "fallback": {
        "shape": "crescent arcs and a floating nocturnal cape",
        "detail": "lunar phases, star chains, and crystal droplets"
      }
    },
    {
      "id": "crystal_dragon",
      "labelJa": "結晶竜",
      "shortPrompt": "crystal-dragon-inspired",
      "summaryJa": "結晶の鱗と鋭い稜線で、竜の強さを華やかに映します",
      "category": "fantasy",
      "fallback": {
        "shape": "swept horns, angular wings, and a powerful tapered form",
        "detail": "gemstone scales and refracted-light edges"
      }
    },
    {
      "id": "celestial",
      "labelJa": "天上の使い",
      "shortPrompt": "celestial-messenger-inspired",
      "summaryJa": "光輪と左右対称のラインで、神聖な存在感を作ります",
      "category": "fantasy",
      "fallback": {
        "shape": "halo rings and long symmetrical panels",
        "detail": "constellation embroidery and suspended light shards"
      }
    },
    {
      "id": "abyss",
      "labelJa": "深淵",
      "shortPrompt": "the abyss-inspired",
      "summaryJa": "光を吸う黒と渦の構造で、深淵の引力を衣装化します",
      "category": "fantasy",
      "fallback": {
        "shape": "a plunging spiral and bottomless layered folds",
        "detail": "faint bioluminescent seams and fractured ornaments"
      }
    },
    {
      "id": "time_magic",
      "labelJa": "時の魔法",
      "shortPrompt": "time-magic-inspired",
      "summaryJa": "円環と時計の意匠で、時間が巡る魔法を表現します",
      "category": "fantasy",
      "fallback": {
        "shape": "concentric rings and repeating clock-hand lines",
        "detail": "hourglass gems and orbiting numeral ornaments"
      }
    },
    {
      "id": "valkyrie",
      "labelJa": "ワルキューレ",
      "shortPrompt": "Valkyrie-inspired",
      "summaryJa": "翼とルーンを、凛々しい戦装束へ翻訳します",
      "category": "myth",
      "fallback": {
        "shape": "winged shoulders and a heroic armored silhouette",
        "detail": "runes, spear-point geometry, and braided borders"
      }
    },
    {
      "id": "phoenix",
      "labelJa": "不死鳥",
      "shortPrompt": "phoenix-legend-inspired",
      "summaryJa": "炎と羽根の上昇線で、不死鳥の再生を表します",
      "category": "myth",
      "fallback": {
        "shape": "rising wings and a sweeping flame-shaped train",
        "detail": "ember crystals and rebirth-ring motifs"
      }
    },
    {
      "id": "bamboo_princess",
      "labelJa": "竹取物語",
      "shortPrompt": "moon-princess folklore-inspired",
      "summaryJa": "竹と月を、気品ある物語衣装へ仕立てます",
      "category": "myth",
      "fallback": {
        "shape": "courtly layers with a luminous moon-disc train",
        "detail": "bamboo-leaf embroidery and floating moon petals"
      }
    },
    {
      "id": "mermaid_tale",
      "labelJa": "人魚姫",
      "shortPrompt": "melancholic mermaid-tale-inspired",
      "summaryJa": "泡と真珠の質感で、人魚姫の切ない物語を描きます",
      "category": "myth",
      "fallback": {
        "shape": "wave curves and a foam-like cascading hem",
        "detail": "pearls, sea-glass, and tear-shaped crystals"
      }
    },
    {
      "id": "red_hood",
      "labelJa": "赤ずきん",
      "shortPrompt": "Red-Riding-Hood folklore-inspired",
      "summaryJa": "赤いフードと森の影を、物語性のある衣装にします",
      "category": "myth",
      "fallback": {
        "shape": "a dramatic hooded cape over a forest-ready silhouette",
        "detail": "wolf-claw clasps and berry-red embroidery"
      }
    },
    {
      "id": "parfait",
      "labelJa": "パフェ",
      "shortPrompt": "parfait-inspired",
      "summaryJa": "パフェの層構造・クリーム・果物色を、縦に映える衣装へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "visible dessert-like tiers, fluted glass lines, and a whipped-cream crown",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "ice_cream",
      "labelJa": "アイスクリーム",
      "shortPrompt": "ice cream-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "soft_serve",
      "labelJa": "ソフトクリーム",
      "shortPrompt": "soft-serve ice cream-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "gelato",
      "labelJa": "ジェラート",
      "shortPrompt": "gelato-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "shortcake",
      "labelJa": "ショートケーキ",
      "shortPrompt": "strawberry shortcake-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "whole_cake",
      "labelJa": "ホールケーキ",
      "shortPrompt": "decorated whole cake-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "mille_feuille",
      "labelJa": "ミルフィーユ",
      "shortPrompt": "mille-feuille pastry-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "macaron",
      "labelJa": "マカロン",
      "shortPrompt": "macaron-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "donut",
      "labelJa": "ドーナツ",
      "shortPrompt": "glazed donut-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "crepe",
      "labelJa": "クレープ",
      "shortPrompt": "fruit crepe-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "pudding",
      "labelJa": "プリン",
      "shortPrompt": "caramel custard pudding-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "jelly",
      "labelJa": "ゼリー",
      "shortPrompt": "translucent jelly dessert-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "pancake",
      "labelJa": "パンケーキ",
      "shortPrompt": "stacked pancakes-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "waffle",
      "labelJa": "ワッフル",
      "shortPrompt": "golden waffle-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "chocolate",
      "labelJa": "チョコレート",
      "shortPrompt": "chocolate-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "candy",
      "labelJa": "キャンディ",
      "shortPrompt": "colorful candy-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "cotton_candy",
      "labelJa": "綿あめ",
      "shortPrompt": "cotton candy-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "cookie",
      "labelJa": "クッキー",
      "shortPrompt": "decorated cookies-inspired",
      "summaryJa": "お菓子の層・色・質感を、甘く華やかな衣装構造へ翻訳します",
      "groupId": "sweets",
      "category": "food",
      "fallback": {
        "shape": "layered confectionery volumes and piped decorative edges",
        "detail": "small dessert motifs translated into embroidery, jewelry, and trim"
      }
    },
    {
      "id": "strawberry",
      "labelJa": "いちご",
      "shortPrompt": "strawberry-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "cherry",
      "labelJa": "さくらんぼ",
      "shortPrompt": "cherry-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "orange",
      "labelJa": "オレンジ",
      "shortPrompt": "orange citrus-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "lemon",
      "labelJa": "レモン",
      "shortPrompt": "lemon-inspired",
      "summaryJa": "レモンの黄・白・透明感・輪切りを、爽やかな夏衣装へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "citrus-slice geometry, tiny blossoms, and fresh leaf embroidery"
      }
    },
    {
      "id": "lime",
      "labelJa": "ライム",
      "shortPrompt": "lime-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "grapefruit",
      "labelJa": "グレープフルーツ",
      "shortPrompt": "grapefruit-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "grape",
      "labelJa": "ぶどう",
      "shortPrompt": "grapes-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "peach",
      "labelJa": "もも",
      "shortPrompt": "peach-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "apple",
      "labelJa": "りんご",
      "shortPrompt": "apple-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "pear",
      "labelJa": "梨",
      "shortPrompt": "pear-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "blueberry",
      "labelJa": "ブルーベリー",
      "shortPrompt": "blueberry-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "raspberry",
      "labelJa": "ラズベリー",
      "shortPrompt": "raspberry-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "blackberry",
      "labelJa": "ブラックベリー",
      "shortPrompt": "blackberry-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "kiwi",
      "labelJa": "キウイ",
      "shortPrompt": "kiwi fruit-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "pineapple",
      "labelJa": "パイナップル",
      "shortPrompt": "pineapple-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "mango",
      "labelJa": "マンゴー",
      "shortPrompt": "mango-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "banana",
      "labelJa": "バナナ",
      "shortPrompt": "banana-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "watermelon",
      "labelJa": "スイカ",
      "shortPrompt": "watermelon-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "melon",
      "labelJa": "メロン",
      "shortPrompt": "melon-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "pomegranate",
      "labelJa": "ざくろ",
      "shortPrompt": "pomegranate-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "fig",
      "labelJa": "いちじく",
      "shortPrompt": "fig-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "coconut",
      "labelJa": "ココナッツ",
      "shortPrompt": "coconut-inspired",
      "summaryJa": "果実の色・輪切り・葉・みずみずしさを衣装の柄や装飾へ活かします",
      "groupId": "fruits",
      "category": "food",
      "fallback": {
        "shape": "clean botanical curves and rounded fruit-inspired forms",
        "detail": "fruit slices, seeds, leaves, and blossoms used as textile and jewelry motifs"
      }
    },
    {
      "id": "cream_soda",
      "labelJa": "クリームソーダ",
      "shortPrompt": "retro cream soda-inspired",
      "summaryJa": "クリームソーダの透明感・ミント色・泡をレトロポップにまとめます",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "fizzing bubbles, a glass-rim line, and cherry-red accents used only as jewelry or handheld props"
      }
    },
    {
      "id": "soda",
      "labelJa": "ソーダ",
      "shortPrompt": "sparkling soda-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "lemonade",
      "labelJa": "レモネード",
      "shortPrompt": "fresh lemonade-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "fruit_juice",
      "labelJa": "フルーツジュース",
      "shortPrompt": "colorful fruit juice-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "milk",
      "labelJa": "ミルク",
      "shortPrompt": "fresh milk-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "milk_tea",
      "labelJa": "ミルクティー",
      "shortPrompt": "milk tea-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "black_tea",
      "labelJa": "紅茶",
      "shortPrompt": "black tea-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "herbal_tea",
      "labelJa": "ハーブティー",
      "shortPrompt": "herbal tea-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "coffee",
      "labelJa": "コーヒー",
      "shortPrompt": "roasted coffee-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "cafe_latte",
      "labelJa": "カフェラテ",
      "shortPrompt": "cafe latte-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "cocoa",
      "labelJa": "ココア",
      "shortPrompt": "hot cocoa-inspired",
      "summaryJa": "飲み物の透明感・泡・湯気・グラスの光を衣装へ映します",
      "groupId": "drinks",
      "category": "food",
      "fallback": {
        "shape": "rising fizz, steam, pouring curves, and glass-like layered panels",
        "detail": "bubbles, droplets, ice, and glass-rim geometry translated into ornament"
      }
    },
    {
      "id": "wine",
      "labelJa": "ワイン",
      "shortPrompt": "wine-inspired",
      "summaryJa": "ワインの深赤・液体感・グラスの艶を、成熟した衣装へ映します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "red_wine",
      "labelJa": "赤ワイン",
      "shortPrompt": "red wine-inspired",
      "summaryJa": "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "white_wine",
      "labelJa": "白ワイン",
      "shortPrompt": "white wine-inspired",
      "summaryJa": "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "rose_wine",
      "labelJa": "ロゼワイン",
      "shortPrompt": "rose wine-inspired",
      "summaryJa": "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "champagne",
      "labelJa": "シャンパン",
      "shortPrompt": "champagne-inspired",
      "summaryJa": "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "cocktail",
      "labelJa": "カクテル",
      "shortPrompt": "colorful cocktail-inspired",
      "summaryJa": "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "mojito",
      "labelJa": "モヒート",
      "shortPrompt": "mojito-inspired",
      "summaryJa": "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "blue_curacao",
      "labelJa": "ブルーキュラソー系カクテル",
      "shortPrompt": "blue curacao cocktail-inspired",
      "summaryJa": "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "sake",
      "labelJa": "日本酒",
      "shortPrompt": "Japanese sake-inspired",
      "summaryJa": "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "umeshu",
      "labelJa": "梅酒",
      "shortPrompt": "Japanese plum wine-inspired",
      "summaryJa": "酒の深い色・液体感・グラスの艶を、大人っぽい衣装へ翻訳します",
      "groupId": "alcohol",
      "category": "food",
      "fallback": {
        "shape": "elegant cocktail-hour tailoring with fluid pouring lines",
        "detail": "glass stems, bubbles, reflections, and refined barware-inspired jewelry"
      }
    },
    {
      "id": "sushi",
      "labelJa": "寿司",
      "shortPrompt": "sushi-inspired",
      "summaryJa": "寿司の和風配色と盛り付け感を、柄・小物・端正な面構成へ翻訳します",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "clean ingredient-colored blocks, subtle wave motifs, and serving-tray accessories"
      }
    },
    {
      "id": "fruit_sandwich",
      "labelJa": "フルーツサンド",
      "shortPrompt": "Japanese fruit sandwich-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "afternoon_tea",
      "labelJa": "アフタヌーンティーセット",
      "shortPrompt": "afternoon tea set-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "bread",
      "labelJa": "パン",
      "shortPrompt": "artisan bread-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "croissant",
      "labelJa": "クロワッサン",
      "shortPrompt": "croissant-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "hamburger",
      "labelJa": "ハンバーガー",
      "shortPrompt": "hamburger-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "pasta",
      "labelJa": "パスタ",
      "shortPrompt": "pasta dish-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "ramen",
      "labelJa": "ラーメン",
      "shortPrompt": "ramen-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "curry",
      "labelJa": "カレー",
      "shortPrompt": "Japanese curry-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "omurice",
      "labelJa": "オムライス",
      "shortPrompt": "omurice-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "pizza",
      "labelJa": "ピザ",
      "shortPrompt": "pizza-inspired",
      "summaryJa": "料理の配色・盛り付け・素材の重なりを、遊び心ある衣装へ変えます",
      "groupId": "savory",
      "category": "food",
      "fallback": {
        "shape": "playful structured layers inspired by plating and stacked ingredients",
        "detail": "ingredients and serving motifs translated into patterns, embroidery, and handheld props"
      }
    },
    {
      "id": "aurora",
      "labelJa": "オーロラ",
      "shortPrompt": "aurora-inspired",
      "summaryJa": "揺れる光の帯を、長いドレープと偏光色で表します",
      "category": "nature",
      "fallback": {
        "shape": "flowing light curtains and long atmospheric arcs",
        "detail": "color-shifting gradients and star dust"
      }
    },
    {
      "id": "storm",
      "labelJa": "雷嵐",
      "shortPrompt": "thunderstorm-inspired",
      "summaryJa": "雲の渦と稲妻の線で、激しい天候を衣装化します",
      "category": "nature",
      "fallback": {
        "shape": "twisted clouds and branching lightning lines",
        "detail": "electric embroidery and rain-drop crystals"
      }
    },
    {
      "id": "eclipse",
      "labelJa": "日食",
      "shortPrompt": "solar-eclipse-inspired",
      "summaryJa": "黒い円と金の光輪で、日食の劇的な瞬間を作ります",
      "category": "nature",
      "fallback": {
        "shape": "a dark central disc framed by radiant rings",
        "detail": "corona fringe and orbit-like metal arcs"
      }
    },
    {
      "id": "deep_sea",
      "labelJa": "深海",
      "shortPrompt": "deep-sea-inspired",
      "summaryJa": "深い青と微光で、静かな深海の世界をまとわせます",
      "category": "nature",
      "fallback": {
        "shape": "slow currents and trailing fin-like panels",
        "detail": "bioluminescent dots and pressure-wave patterns"
      }
    },
    {
      "id": "dawn",
      "labelJa": "夜明け",
      "shortPrompt": "dawn-inspired",
      "summaryJa": "空のグラデーションと朝露で、夜明けを軽やかに描きます",
      "category": "nature",
      "fallback": {
        "shape": "a horizon line opening into upward rays",
        "detail": "sunrise gradients and dew-like crystals"
      }
    },
    {
      "id": "jellyfish",
      "labelJa": "クラゲ",
      "shortPrompt": "jellyfish-inspired",
      "summaryJa": "透ける傘と長い触手を、幻想的なドレープへ変えます",
      "category": "living",
      "fallback": {
        "shape": "a bell-shaped volume with long drifting tendrils",
        "detail": "bioluminescent edges and pearl droplets"
      }
    },
    {
      "id": "butterfly",
      "labelJa": "蝶",
      "shortPrompt": "butterfly-inspired",
      "summaryJa": "左右対称の羽と鱗粉の色で、蝶の変身を表します",
      "category": "living",
      "fallback": {
        "shape": "symmetrical wings and a pinched central silhouette",
        "detail": "eye-spots and powdery gradient embroidery"
      }
    },
    {
      "id": "rose",
      "labelJa": "薔薇",
      "shortPrompt": "rose-inspired",
      "summaryJa": "花弁の重なりと棘を、華やかで強い衣装にします",
      "category": "living",
      "fallback": {
        "shape": "spiraling petals around a sculpted waist",
        "detail": "thorn filigree and dew-drop crystals"
      }
    },
    {
      "id": "peacock",
      "labelJa": "孔雀",
      "shortPrompt": "peacock-inspired",
      "summaryJa": "扇状の羽と玉虫色で、堂々としたシルエットを作ります",
      "category": "living",
      "fallback": {
        "shape": "a proud fan and elongated tail lines",
        "detail": "eye-pattern beading and feathered trim"
      }
    },
    {
      "id": "wisteria",
      "labelJa": "藤",
      "shortPrompt": "wisteria-inspired",
      "summaryJa": "垂れる花房を、縦に流れる装飾と袖へ映します",
      "category": "living",
      "fallback": {
        "shape": "hanging flower clusters and vertical cascades",
        "detail": "vine embroidery and dangling blossom ornaments"
      }
    },
    {
      "id": "stained_glass",
      "labelJa": "ステンドグラス",
      "shortPrompt": "stained-glass-inspired",
      "summaryJa": "色ガラスと黒い骨組みを、光を通す衣装構造へ翻訳します",
      "category": "material",
      "fallback": {
        "shape": "cathedral-window geometry and segmented light panels",
        "detail": "lead-line embroidery and colored light reflections"
      }
    },
    {
      "id": "porcelain",
      "labelJa": "磁器",
      "shortPrompt": "porcelain-inspired",
      "summaryJa": "白磁の滑らかさと絵付けを、端正な衣装にします",
      "category": "material",
      "fallback": {
        "shape": "clean curved volumes with delicate fragile edges",
        "detail": "blue painted florals and repaired-gold seams"
      }
    },
    {
      "id": "mercury",
      "labelJa": "水銀",
      "shortPrompt": "liquid-mercury-inspired",
      "summaryJa": "流れる鏡面と雫で、形を変える金属を表します",
      "category": "material",
      "fallback": {
        "shape": "droplets merging into an unstable flowing form",
        "detail": "mirror beads and fluid reflective seams"
      }
    },
    {
      "id": "smoke",
      "labelJa": "煙",
      "shortPrompt": "smoke-inspired",
      "summaryJa": "ほどける輪郭と薄い層で、煙の動きを衣装化します",
      "category": "material",
      "fallback": {
        "shape": "curling layers that dissolve at the edges",
        "detail": "ombre haze and drifting ribbon wisps"
      }
    },
    {
      "id": "ice_crystal",
      "labelJa": "氷晶",
      "shortPrompt": "ice-crystal-inspired",
      "summaryJa": "鋭い結晶と霜の縁を、透明感ある衣装へ仕立てます",
      "category": "material",
      "fallback": {
        "shape": "radial shards and precise hexagonal geometry",
        "detail": "frosted edges and snowflake filigree"
      }
    },
    {
      "id": "rococo",
      "labelJa": "ロココ",
      "shortPrompt": "Rococo-inspired",
      "summaryJa": "淡い色と曲線装飾で、ロココの優雅な過剰さを楽しみます",
      "category": "art",
      "fallback": {
        "shape": "ornate pannier volume and playful asymmetrical curves",
        "detail": "shell scrolls, bows, roses, and gilded filigree"
      }
    },
    {
      "id": "art_nouveau",
      "labelJa": "アール・ヌーヴォー",
      "shortPrompt": "Art-Nouveau-inspired",
      "summaryJa": "植物の曲線を、流れるシルエットと金工風装飾にします",
      "category": "art",
      "fallback": {
        "shape": "whiplash curves and elongated botanical lines",
        "detail": "iris, vine, and dragonfly motifs"
      }
    },
    {
      "id": "art_deco",
      "labelJa": "アール・デコ",
      "shortPrompt": "Art-Deco-inspired",
      "summaryJa": "幾何学と金黒の配色で、都会的な華やかさを作ります",
      "category": "art",
      "fallback": {
        "shape": "stepped symmetry and sleek fan geometry",
        "detail": "sunbursts, chevrons, and streamlined metallic lines"
      }
    },
    {
      "id": "gothic_cathedral",
      "labelJa": "ゴシック聖堂",
      "shortPrompt": "Gothic-cathedral-inspired",
      "summaryJa": "尖塔と薔薇窓を、縦に伸びる荘厳な衣装へ変えます",
      "category": "art",
      "fallback": {
        "shape": "pointed arches and soaring vertical lines",
        "detail": "rose-window jewels and ribbed-vault embroidery"
      }
    },
    {
      "id": "lacquer",
      "labelJa": "漆工芸",
      "shortPrompt": "Japanese-lacquerware-inspired",
      "summaryJa": "漆黒・朱・蒔絵の艶を、研ぎ澄まされた衣装に映します",
      "category": "art",
      "fallback": {
        "shape": "clean layered planes with controlled asymmetry",
        "detail": "maki-e landscapes and fine gold dust"
      }
    },
    {
      "id": "masquerade",
      "labelJa": "仮面舞踏会",
      "shortPrompt": "masquerade-ball-inspired",
      "summaryJa": "仮面と羽根を、謎めいた舞踏会衣装にまとめます",
      "category": "stage",
      "fallback": {
        "shape": "a dramatic formal silhouette with sweeping cape lines",
        "detail": "ornate masks, plume accents, and secretive eye motifs"
      }
    },
    {
      "id": "ballet",
      "labelJa": "幻想バレエ",
      "shortPrompt": "fantasy-ballet-inspired",
      "summaryJa": "バレエの軽さを、幻想的な層と長い線で広げます",
      "category": "stage",
      "fallback": {
        "shape": "a weightless tutu-inspired form with elongated lines",
        "detail": "feather-light petals and frost-like sparkle"
      }
    },
    {
      "id": "circus",
      "labelJa": "サーカス",
      "shortPrompt": "grand-circus-inspired",
      "summaryJa": "鮮やかな色と誇張した形で、楽しい舞台衣装にします",
      "category": "stage",
      "fallback": {
        "shape": "a ringmaster silhouette with playful exaggerated volume",
        "detail": "stars, tassels, ticket motifs, and tiny bells"
      }
    },
    {
      "id": "idol",
      "labelJa": "コンセプトアイドル",
      "shortPrompt": "concept-idol-inspired",
      "summaryJa": "光と動きに強い形で、テーマ性のあるアイドル衣装を作ります",
      "category": "stage",
      "fallback": {
        "shape": "a kinetic stage silhouette with asymmetric layers",
        "detail": "light-stick geometry and sparkling emblem ornaments"
      }
    },
    {
      "id": "opera",
      "labelJa": "幻想オペラ",
      "shortPrompt": "fantasy-opera-inspired",
      "summaryJa": "重厚な布と大きなトレーンで、歌劇の存在感を高めます",
      "category": "stage",
      "fallback": {
        "shape": "a commanding theatrical silhouette with a grand train",
        "detail": "music-scroll embroidery and chandelier-like jewels"
      }
    }
  ],
  "directions": [
    {
      "id": "elegant",
      "labelJa": "上品",
      "shortPrompt": "refined"
    },
    {
      "id": "cute",
      "labelJa": "可愛い",
      "shortPrompt": "charming"
    },
    {
      "id": "graceful",
      "labelJa": "優美",
      "shortPrompt": "graceful"
    },
    {
      "id": "alluring",
      "labelJa": "妖艶",
      "shortPrompt": "alluring"
    },
    {
      "id": "gothic",
      "labelJa": "ゴシック",
      "shortPrompt": "gothic"
    },
    {
      "id": "dark",
      "labelJa": "ダーク",
      "shortPrompt": "dark"
    },
    {
      "id": "mystical",
      "labelJa": "神秘的",
      "shortPrompt": "mystical"
    },
    {
      "id": "fantastical",
      "labelJa": "幻想的",
      "shortPrompt": "fantastical"
    },
    {
      "id": "sacred",
      "labelJa": "神聖",
      "shortPrompt": "sacred"
    },
    {
      "id": "decadent",
      "labelJa": "退廃的",
      "shortPrompt": "decadent"
    },
    {
      "id": "royal",
      "labelJa": "王族風",
      "shortPrompt": "regal"
    },
    {
      "id": "futuristic",
      "labelJa": "未来的",
      "shortPrompt": "futuristic"
    },
    {
      "id": "avant",
      "labelJa": "アヴァンギャルド",
      "shortPrompt": "avant-garde"
    },
    {
      "id": "stage",
      "labelJa": "舞台衣装風",
      "shortPrompt": "theatrical"
    },
    {
      "id": "high_fashion",
      "labelJa": "ハイファッション",
      "shortPrompt": "high-fashion"
    },
    {
      "id": "comic",
      "labelJa": "コミカル",
      "shortPrompt": "playful"
    }
  ],
  "bases": [
    {
      "id": "couture",
      "labelJa": "オートクチュール",
      "shortPrompt": "haute couture"
    },
    {
      "id": "dress",
      "labelJa": "ドレス",
      "shortPrompt": "statement dress"
    },
    {
      "id": "gown",
      "labelJa": "ガウン",
      "shortPrompt": "ceremonial gown"
    },
    {
      "id": "suit",
      "labelJa": "スーツ",
      "shortPrompt": "sculptural tailored suit"
    },
    {
      "id": "coat",
      "labelJa": "ロングコート",
      "shortPrompt": "dramatic long coat"
    },
    {
      "id": "robe",
      "labelJa": "ローブ",
      "shortPrompt": "layered fantasy robe"
    },
    {
      "id": "cape",
      "labelJa": "ケープ衣装",
      "shortPrompt": "cape-centered costume"
    },
    {
      "id": "wafuku",
      "labelJa": "和装アレンジ",
      "shortPrompt": "reimagined Japanese-style ensemble"
    },
    {
      "id": "ritual",
      "labelJa": "儀礼衣装",
      "shortPrompt": "ritual ceremonial costume"
    },
    {
      "id": "royal",
      "labelJa": "王族衣装",
      "shortPrompt": "regal court costume"
    },
    {
      "id": "stage",
      "labelJa": "舞台衣装",
      "shortPrompt": "theatrical stage costume"
    },
    {
      "id": "idol",
      "labelJa": "アイドル衣装",
      "shortPrompt": "concept idol costume"
    },
    {
      "id": "battle",
      "labelJa": "バトルコスチューム",
      "shortPrompt": "fantasy battle costume"
    },
    {
      "id": "armor",
      "labelJa": "アーマー",
      "shortPrompt": "ornamental fantasy armor"
    },
    {
      "id": "bodysuit",
      "labelJa": "ボディスーツ",
      "shortPrompt": "high-fashion bodysuit"
    },
    {
      "id": "swim",
      "labelJa": "水着風衣装",
      "shortPrompt": "couture swimwear-inspired costume"
    },
    {
      "id": "lingerie",
      "labelJa": "ランジェリー風",
      "shortPrompt": "luxury lingerie-inspired costume"
    },
    {
      "id": "layered",
      "labelJa": "多層レイヤード",
      "shortPrompt": "multi-layered statement ensemble"
    }
  ],
  "placements": [
    {
      "id": "palette",
      "labelJa": "配色",
      "shortPrompt": "the color palette"
    },
    {
      "id": "silhouette",
      "labelJa": "シルエット",
      "shortPrompt": "the overall silhouette"
    },
    {
      "id": "materials",
      "labelJa": "素材・質感",
      "shortPrompt": "the materials and surface textures"
    },
    {
      "id": "pattern",
      "labelJa": "柄",
      "shortPrompt": "the textile patterns"
    },
    {
      "id": "ornament",
      "labelJa": "装飾",
      "shortPrompt": "the ornaments and embellishments"
    },
    {
      "id": "sleeves",
      "labelJa": "袖",
      "shortPrompt": "the sleeve construction"
    },
    {
      "id": "neckline",
      "labelJa": "襟・胸元",
      "shortPrompt": "the collar and neckline"
    },
    {
      "id": "hem",
      "labelJa": "裾",
      "shortPrompt": "the hem and train"
    },
    {
      "id": "headpiece",
      "labelJa": "頭部装飾",
      "shortPrompt": "the headpiece"
    },
    {
      "id": "accessories",
      "labelJa": "小物",
      "shortPrompt": "the accessories"
    },
    {
      "id": "special",
      "labelJa": "特殊構造",
      "shortPrompt": "the transformable construction"
    },
    {
      "id": "light",
      "labelJa": "光・粒子",
      "shortPrompt": "the light and particle effects"
    }
  ],
  "strengths": [
    {
      "id": "subtle",
      "labelJa": "ほのかに",
      "shortPrompt": "subtle"
    },
    {
      "id": "balanced",
      "labelJa": "ほどよく",
      "shortPrompt": "balanced"
    },
    {
      "id": "bold",
      "labelJa": "大胆に",
      "shortPrompt": "bold"
    },
    {
      "id": "total",
      "labelJa": "全振り",
      "shortPrompt": "fully immersive"
    },
    {
      "id": "maximum",
      "labelJa": "ネタMAX",
      "shortPrompt": "deliberately maximal"
    }
  ],
  "foodGroups": [
    {
      "id": "sweets",
      "labelJa": "スイーツ",
      "shortPrompt": "sweet and dessert motifs"
    },
    {
      "id": "fruits",
      "labelJa": "フルーツ",
      "shortPrompt": "fruit motifs"
    },
    {
      "id": "drinks",
      "labelJa": "飲み物",
      "shortPrompt": "non-alcoholic drink motifs"
    },
    {
      "id": "alcohol",
      "labelJa": "酒・カクテル",
      "shortPrompt": "wine and cocktail motifs"
    },
    {
      "id": "savory",
      "labelJa": "甘くない食べ物",
      "shortPrompt": "savory food motifs"
    }
  ],
  "foodApplications": [
    {
      "id": "palette",
      "labelJa": "配色に反映",
      "shortPrompt": "the color palette"
    },
    {
      "id": "pattern",
      "labelJa": "柄に反映",
      "shortPrompt": "textile patterns"
    },
    {
      "id": "embroidery",
      "labelJa": "刺繍に反映",
      "shortPrompt": "embroidery"
    },
    {
      "id": "accessory",
      "labelJa": "アクセサリーに反映",
      "shortPrompt": "jewelry and accessories"
    },
    {
      "id": "material",
      "labelJa": "素材感に反映",
      "shortPrompt": "material and surface texture"
    },
    {
      "id": "prop",
      "labelJa": "小物に反映",
      "shortPrompt": "a handheld or table prop"
    },
    {
      "id": "background",
      "labelJa": "背景演出に反映",
      "shortPrompt": "background staging"
    },
    {
      "id": "literal",
      "labelJa": "実物を添える",
      "shortPrompt": "a literal food or drink item placed safely on a tray, plate, glass, or table"
    }
  ],
  "regions": [
    {
      "id": "all",
      "labelJa": "すべて",
      "shortPrompt": "all"
    },
    {
      "id": "east_asia",
      "labelJa": "東アジア",
      "shortPrompt": "East Asian dress traditions"
    },
    {
      "id": "south_asia",
      "labelJa": "南アジア",
      "shortPrompt": "South Asian dress traditions"
    },
    {
      "id": "west_asia",
      "labelJa": "西アジア・中東",
      "shortPrompt": "West Asian and Middle Eastern dress traditions"
    },
    {
      "id": "southeast_asia",
      "labelJa": "東南アジア",
      "shortPrompt": "Southeast Asian dress traditions"
    },
    {
      "id": "europe",
      "labelJa": "ヨーロッパ",
      "shortPrompt": "European folk-dress traditions"
    },
    {
      "id": "africa",
      "labelJa": "アフリカ",
      "shortPrompt": "African dress traditions"
    },
    {
      "id": "latin",
      "labelJa": "中南米",
      "shortPrompt": "Latin American dress traditions"
    }
  ],
  "attires": [
    {
      "id": "hanfu",
      "labelJa": "漢服",
      "shortPrompt": "hanfu",
      "summaryJa": "漢服の交領・長い袖・重なりを衣装の核にします",
      "regionId": "east_asia"
    },
    {
      "id": "qipao",
      "labelJa": "旗袍（チャイナドレス）",
      "shortPrompt": "qipao / cheongsam",
      "summaryJa": "旗袍の立ち襟・斜めの打ち合わせ・細身の縦線を衣装の核にします",
      "regionId": "east_asia"
    },
    {
      "id": "hanbok",
      "labelJa": "韓服（チマチョゴリ）",
      "shortPrompt": "hanbok",
      "summaryJa": "韓服のチョゴリと豊かなチマの対比を衣装の核にします",
      "regionId": "east_asia"
    },
    {
      "id": "kimono",
      "labelJa": "着物",
      "shortPrompt": "kimono",
      "summaryJa": "着物の直線的な身頃・重なり・帯を衣装の核にします",
      "regionId": "east_asia"
    },
    {
      "id": "sari",
      "labelJa": "サリー",
      "shortPrompt": "sari",
      "summaryJa": "サリーの連続する布とパッルの流れを衣装の核にします",
      "regionId": "south_asia"
    },
    {
      "id": "lehenga",
      "labelJa": "レヘンガ",
      "shortPrompt": "lehenga",
      "summaryJa": "レヘンガのチョリ・広がるスカート・ドゥパッタを衣装の核にします",
      "regionId": "south_asia"
    },
    {
      "id": "belly_dance",
      "labelJa": "ベリーダンス衣装",
      "shortPrompt": "belly dance costume",
      "summaryJa": "ベリーダンス衣装の装飾的な胴部と流れる腰布を衣装の核にします",
      "regionId": "west_asia"
    },
    {
      "id": "kaftan",
      "labelJa": "カフタン",
      "shortPrompt": "kaftan",
      "summaryJa": "カフタンのゆったりした面・広い袖・前中心の装飾を衣装の核にします",
      "regionId": "west_asia"
    },
    {
      "id": "ao_dai",
      "labelJa": "アオザイ",
      "shortPrompt": "ao dai",
      "summaryJa": "アオザイの長いスリット入りチュニックとパンツを衣装の核にします",
      "regionId": "southeast_asia"
    },
    {
      "id": "flamenco",
      "labelJa": "フラメンコ衣装",
      "shortPrompt": "flamenco dress",
      "summaryJa": "フラメンコ衣装の身体に沿う線と連なるフリルを衣装の核にします",
      "regionId": "europe"
    },
    {
      "id": "folk",
      "labelJa": "ヨーロッパ民族衣装",
      "shortPrompt": "European folk costume",
      "summaryJa": "ヨーロッパ民俗衣装の胴衣・重ね布・刺繍を衣装の核にします",
      "regionId": "europe"
    },
    {
      "id": "kente",
      "labelJa": "ケンテ風衣装",
      "shortPrompt": "kente-inspired attire",
      "summaryJa": "ケンテの鮮やかな織り柄と布の構成を衣装の核にします",
      "regionId": "africa"
    },
    {
      "id": "mariachi",
      "labelJa": "マリアッチ風衣装",
      "shortPrompt": "mariachi-inspired attire",
      "summaryJa": "マリアッチ衣装の端正な仕立てと銀装飾を衣装の核にします",
      "regionId": "latin"
    },
    {
      "id": "carnival",
      "labelJa": "カーニバル衣装",
      "shortPrompt": "carnival costume",
      "summaryJa": "カーニバル衣装の羽根・ビーズ・躍動的な輪郭を衣装の核にします",
      "regionId": "latin"
    }
  ],
  "treatments": [
    {
      "id": "traditional",
      "labelJa": "伝統寄り",
      "shortPrompt": "a tradition-forward treatment"
    },
    {
      "id": "modern",
      "labelJa": "現代アレンジ",
      "shortPrompt": "a contemporary reinterpretation"
    },
    {
      "id": "fantasy",
      "labelJa": "ファンタジー融合",
      "shortPrompt": "a fantasy fusion"
    },
    {
      "id": "fashion",
      "labelJa": "ハイファッション化",
      "shortPrompt": "a high-fashion transformation"
    },
    {
      "id": "alluring",
      "labelJa": "セクシーアレンジ",
      "shortPrompt": "an alluring stage-oriented reinterpretation"
    },
    {
      "id": "free",
      "labelJa": "自由創作",
      "shortPrompt": "an original creative reinterpretation"
    }
  ],
  "qipaoNecklines": [
    {
      "id": "classic",
      "labelJa": "立ち襟",
      "shortPrompt": "a clean high stand collar with a diagonal closure"
    },
    {
      "id": "halter",
      "labelJa": "ホルターネック",
      "shortPrompt": "a halter-neck qipao bodice with fully exposed shoulders"
    },
    {
      "id": "open_back",
      "labelJa": "背中開き",
      "shortPrompt": "an open-back qipao bodice"
    },
    {
      "id": "bare_shoulders",
      "labelJa": "肩出し",
      "shortPrompt": "a shoulder-baring qipao neckline"
    }
  ],
  "qipaoLengths": [
    {
      "id": "mini",
      "labelJa": "ミニ丈",
      "shortPrompt": "a clean mini hem"
    },
    {
      "id": "above_knee",
      "labelJa": "膝上丈",
      "shortPrompt": "an above-knee hem"
    },
    {
      "id": "knee",
      "labelJa": "膝丈",
      "shortPrompt": "a knee-length hem"
    },
    {
      "id": "long",
      "labelJa": "ロング丈",
      "shortPrompt": "a long ankle-length hem"
    }
  ],
  "qipaoSlits": [
    {
      "id": "high",
      "labelJa": "ハイスリット",
      "shortPrompt": "a high side slit"
    },
    {
      "id": "modest",
      "labelJa": "控えめスリット",
      "shortPrompt": "a modest side slit"
    },
    {
      "id": "none",
      "labelJa": "スリットなし",
      "shortPrompt": "a slit-free closed hem"
    }
  ],
  "qipaoDrapes": [
    {
      "id": "clean",
      "labelJa": "余分な布なし",
      "shortPrompt": "a self-contained one-piece silhouette with a clean arm line and no separate draped panels"
    },
    {
      "id": "short_panel",
      "labelJa": "短い飾り布",
      "shortPrompt": "one short controlled decorative panel attached to the dress"
    },
    {
      "id": "cape",
      "labelJa": "ケープ併用",
      "shortPrompt": "a separate short couture cape that leaves the arms readable"
    }
  ],
  "idolStyles": [
    {
      "id": "frill_mini",
      "labelJa": "フリルミニスカート",
      "shortPrompt": "an above-knee frilled mini skirt with sparkling layered ruffles"
    },
    {
      "id": "above_knee",
      "labelJa": "膝上スカート",
      "shortPrompt": "a crisp above-knee stage skirt"
    },
    {
      "id": "volume",
      "labelJa": "ボリュームスカート",
      "shortPrompt": "a buoyant high-volume performance skirt"
    },
    {
      "id": "flare",
      "labelJa": "フレアスカート",
      "shortPrompt": "a lively flared skirt"
    },
    {
      "id": "tiered",
      "labelJa": "ティアードスカート",
      "shortPrompt": "a glittering tiered skirt"
    },
    {
      "id": "sequin",
      "labelJa": "スパンコール衣装",
      "shortPrompt": "a sequin-rich performance ensemble"
    },
    {
      "id": "stage",
      "labelJa": "ステージ衣装",
      "shortPrompt": "a polished concert stage costume"
    },
    {
      "id": "ribbons",
      "labelJa": "リボン多め",
      "shortPrompt": "a ribbon-rich idol costume"
    },
    {
      "id": "stars",
      "labelJa": "星モチーフ",
      "shortPrompt": "a star-motif idol costume"
    },
    {
      "id": "future",
      "labelJa": "近未来アイドル",
      "shortPrompt": "a futuristic illuminated idol ensemble"
    },
    {
      "id": "classic_cute",
      "labelJa": "王道かわいい系",
      "shortPrompt": "a classic cute idol look"
    },
    {
      "id": "cool",
      "labelJa": "クール系アイドル",
      "shortPrompt": "a sharp cool-toned idol look"
    },
    {
      "id": "japanese",
      "labelJa": "和風アイドル",
      "shortPrompt": "a Japanese-inspired idol ensemble"
    },
    {
      "id": "mens",
      "labelJa": "メンズアイドル衣装",
      "shortPrompt": "a tailored mens-idol stage ensemble wearable by any person"
    },
    {
      "id": "unisex",
      "labelJa": "ユニセックスアイドル",
      "shortPrompt": "a gender-neutral unisex idol costume"
    }
  ],
  "artNouveauShapes": [
    {
      "id": "long",
      "labelJa": "ロングドレス",
      "shortPrompt": "a flowing long dress with organic curves and no mandatory slit"
    },
    {
      "id": "midi",
      "labelJa": "ミディ丈",
      "shortPrompt": "a softly draped midi-length silhouette"
    },
    {
      "id": "mini",
      "labelJa": "ミニ丈",
      "shortPrompt": "a decorative mini silhouette with curved botanical panels"
    },
    {
      "id": "tunic",
      "labelJa": "チュニック風",
      "shortPrompt": "an elegant Art Nouveau tunic silhouette"
    },
    {
      "id": "cape",
      "labelJa": "ケープ付き",
      "shortPrompt": "a curved botanical cape over an independent dress silhouette"
    },
    {
      "id": "separates",
      "labelJa": "上下セパレート",
      "shortPrompt": "a coordinated two-piece silhouette with flowing ornamental lines"
    },
    {
      "id": "no_slit",
      "labelJa": "スリットなし",
      "shortPrompt": "a slit-free hem with continuous whiplash curves"
    },
    {
      "id": "modest_slit",
      "labelJa": "控えめスリット",
      "shortPrompt": "one restrained slit integrated into a non-column silhouette"
    }
  ]
};
})(window);
