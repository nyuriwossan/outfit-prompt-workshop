/* Structured additions: five outfits per primary category. */
(function(g){var D=g.CPW.data;
D.garments.push.apply(D.garments,[
  {
    "id": "oversized_knit_long_skirt",
    "labelJa": "ゆったりニットとロングスカート",
    "category": "top_bottom",
    "shortPrompt": "loose knit sweater paired with a long skirt",
    "detailedPrompt": "a loose knit sweater paired with a long skirt",
    "tags": [
      "soft"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "suspender_shirt_trousers",
    "labelJa": "サスペンダー付きシャツとパンツ",
    "category": "top_bottom",
    "shortPrompt": "shirt and trousers with suspenders",
    "detailedPrompt": "a shirt and trousers with suspenders",
    "tags": [
      "plain"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "linen_shirt_wide_trousers",
    "labelJa": "シャツとワイドトラウザーズ",
    "category": "top_bottom",
    "shortPrompt": "loose shirt and wide-leg trousers",
    "detailedPrompt": "a loose shirt and wide-leg trousers",
    "tags": [
      "plain"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "buttoned_pajama_set",
    "labelJa": "前開きパジャマセット",
    "category": "top_bottom",
    "shortPrompt": "button-front pajama shirt and matching relaxed trousers",
    "detailedPrompt": "a button-front pajama shirt and matching relaxed trousers",
    "tags": [
      "cozy"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "apron_shirt_outfit",
    "labelJa": "シャツと作業用エプロン",
    "category": "uniform",
    "shortPrompt": "shirt and trousers under a practical bib apron",
    "detailedPrompt": "a shirt and trousers under a practical bib apron",
    "tags": [
      "work"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "flight_suit",
    "labelJa": "フライトスーツ",
    "category": "uniform",
    "shortPrompt": "zip-front flight coveralls with reinforced knees and cargo pockets",
    "detailedPrompt": "a zip-front flight coveralls with reinforced knees and cargo pockets",
    "tags": [
      "work"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "stand_collar_service_uniform",
    "labelJa": "詰襟の接客制服",
    "category": "uniform",
    "shortPrompt": "stand-collar service uniform with a concealed front fastening",
    "detailedPrompt": "a stand-collar service uniform with a concealed front fastening",
    "tags": [
      "uniform",
      "work"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "tailcoat_suit",
    "labelJa": "燕尾服",
    "category": "uniform",
    "shortPrompt": "tailcoat suit with a cutaway front and long split back tails",
    "detailedPrompt": "a tailcoat suit with a cutaway front and long split back tails",
    "tags": [
      "formal",
      "structured"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "kimono_apron",
    "labelJa": "和装風エプロン衣装",
    "category": "wafuku",
    "shortPrompt": "kimono-inspired outfit under a broad waist apron",
    "detailedPrompt": "a kimono-inspired outfit under a broad waist apron",
    "tags": [
      "traditional"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "haori_hakama",
    "labelJa": "羽織と袴風衣装",
    "category": "wafuku",
    "shortPrompt": "haori-style jacket over a kimono top and pleated hakama trousers",
    "detailedPrompt": "a haori-style jacket over a kimono top and pleated hakama trousers",
    "tags": [
      "traditional"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "layered_ritual_robes",
    "labelJa": "薄衣を重ねた創作祭祀装束",
    "category": "wafuku",
    "shortPrompt": "layered ceremonial robes with a translucent outer veil over an opaque inner robe",
    "detailedPrompt": "a layered ceremonial robes with a translucent outer veil over an opaque inner robe",
    "tags": [
      "traditional",
      "layered"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "eastern_cloak_robe",
    "labelJa": "中華風長衣と外套",
    "category": "chinese",
    "shortPrompt": "long Chinese-inspired robe beneath an open sleeved outer coat",
    "detailedPrompt": "a long Chinese-inspired robe beneath an open sleeved outer coat",
    "tags": [
      "traditional",
      "layered"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  },
  {
    "id": "floating_sash_dance",
    "labelJa": "羽衣風の舞装束",
    "category": "wafuku",
    "shortPrompt": "flowing dance robes with long floating shoulder sashes",
    "detailedPrompt": "a flowing dance robes with long floating shoulder sashes",
    "tags": [
      "traditional",
      "flowing"
    ],
    "recommendedWorldviews": [
      "modern",
      "western_fantasy"
    ],
    "layer": "main"
  }
]);
D.partSlots.find(function(s){return s.id==="headwear";}).options.push({id:"masquerade_mask",labelJa:"舞踏会の目元仮面",shortPrompt:"a masquerade eye mask",detailedPrompt:"a masquerade eye mask",tags:[]});
D.presets.push.apply(D.presets,[
  {
    "id": "knit_long_skirt",
    "group": "modern",
    "categoryId": "daily",
    "labelJa": "ゆったりニットとロングスカート",
    "summaryJa": "ケーブル編みのニットと足元まで届くスカート",
    "moodTags": [
      "シンプル",
      "可愛い"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "top_bottom",
        "subtype": "oversized_knit_long_skirt",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "cable_knit",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "warm_ivory",
        "secondary": "warm_brown",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "long_sleeves",
        "hem": "floor_sweeping_hem"
      },
      "silhouette": {
        "fit": "relaxed"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "suspender_holiday",
    "group": "modern",
    "categoryId": "daily",
    "labelJa": "サスペンダーの休日服",
    "summaryJa": "シャツとパンツをサスペンダーでつなぐ休日の装い",
    "moodTags": [
      "シンプル",
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "top_bottom",
        "subtype": "suspender_shirt_trousers",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "cotton",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "off_white",
        "secondary": "deep_navy",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "point_collar",
        "sleeves": "three_quarter_sleeves"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "winter_long_coat",
    "group": "modern",
    "categoryId": "daily",
    "labelJa": "冬のお出かけロングコート",
    "summaryJa": "ダブル前のウールコートとロングブーツ",
    "moodTags": [
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "robe",
        "subtype": "long_coat",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "wool",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "camel",
        "secondary": "warm_ivory",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "wide_lapel",
        "closure": "double_breasted",
        "sleeves": "long_sleeves",
        "footwear": "knee_high_boots"
      },
      "silhouette": {
        "fit": "relaxed",
        "length": "ankle"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "summer_linen",
    "group": "modern",
    "categoryId": "daily",
    "labelJa": "リネンシャツとワイドパンツ",
    "summaryJa": "風を通す開襟シャツと幅広のパンツ",
    "moodTags": [
      "シンプル"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "top_bottom",
        "subtype": "linen_shirt_wide_trousers",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "linen",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "linen_white",
        "secondary": "sand_beige",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "open_collar",
        "sleeves": "short_sleeves"
      },
      "silhouette": {
        "fit": "relaxed"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "silk_pajamas",
    "group": "modern",
    "categoryId": "daily",
    "labelJa": "シルクのパジャマセット",
    "summaryJa": "前開きシャツとゆったりパンツの上下組",
    "moodTags": [
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "top_bottom",
        "subtype": "buttoned_pajama_set",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "silk",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "deep_navy",
        "secondary": "pearl_white",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "shawl_collar",
        "sleeves": "long_sleeves",
        "closure": "button_front"
      },
      "silhouette": {
        "fit": "relaxed"
      },
      "decorations": {
        "items": [
          {
            "type": "piping",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 1
      }
    }
  },
  {
    "id": "cafe_waistcoat",
    "group": "modern",
    "categoryId": "work",
    "labelJa": "ベスト付きカフェ店員",
    "summaryJa": "袖をまくったシャツとベストの接客服",
    "moodTags": [
      "シンプル",
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "business_suit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "cotton",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "warm_brown",
        "secondary": "off_white",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "inner_shirt": "dress_shirt",
        "vest": "tailored_vest",
        "bottoms": "straight_trousers",
        "cuffs": "rolled_cuffs"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "florist_apron",
    "group": "modern",
    "categoryId": "work",
    "labelJa": "エプロン姿の花屋",
    "summaryJa": "胸当てエプロンと動きやすい細身パンツ",
    "moodTags": [
      "可愛い",
      "シンプル"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "apron_shirt_outfit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "canvas",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "sage_green",
        "secondary": "warm_ivory",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "three_quarter_sleeves",
        "collar": "band_collar",
        "bottoms": "tapered_trousers"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "hotel_stand_collar",
    "group": "modern",
    "categoryId": "work",
    "labelJa": "詰襟のホテルスタッフ",
    "summaryJa": "詰襟と比翼前の端正な接客服",
    "moodTags": [
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "stand_collar_service_uniform",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "twill",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "burgundy",
        "secondary": "jet_black",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "stand_collar",
        "closure": "hidden_placket",
        "bottoms": "straight_trousers"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "items": [
          {
            "type": "brass_buttons",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 1
      }
    }
  },
  {
    "id": "pilot_flight",
    "group": "modern",
    "categoryId": "work",
    "labelJa": "飛行服のパイロット",
    "summaryJa": "補強された膝とカーゴポケットの飛行つなぎ",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "flight_suit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "nylon",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "olive",
        "secondary": "charcoal_gray",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "stand_collar",
        "sleeves": "fitted_long_sleeves",
        "waist": "utility_belt"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "school_cape",
    "group": "modern",
    "categoryId": "work",
    "labelJa": "ケープ付き学園制服",
    "summaryJa": "肩を覆うケープとプリーツスカートの制服",
    "moodTags": [
      "可愛い",
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "school_uniform",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "wool",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "deep_navy",
        "secondary": "warm_ivory",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "inner_shirt": "dress_shirt",
        "cover_up": "shoulder_cape",
        "bottoms": "pleated_skirt"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "three_piece_butler",
    "group": "style",
    "categoryId": "service",
    "labelJa": "三つ揃えの正統派執事",
    "summaryJa": "ジャケット・ベスト・パンツの三つ揃え",
    "moodTags": [
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "business_suit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "wool",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "jet_black",
        "secondary": "pearl_gray",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "inner_shirt": "dress_shirt",
        "vest": "tailored_vest",
        "bottoms": "fitted_trousers",
        "collar": "peak_lapels"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "court_tailcoat",
    "group": "style",
    "categoryId": "service",
    "labelJa": "燕尾服の宮廷従者",
    "summaryJa": "背面に長い燕尾とプリーツシャツを合わせる",
    "moodTags": [
      "上品",
      "華やか"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "tailcoat_suit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "brocade",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "deep_navy",
        "secondary": "antique_gold",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "inner_shirt": "pleated_front_shirt",
        "collar": "wing_collar",
        "bottoms": "fitted_trousers"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "kimono_server",
    "group": "style",
    "categoryId": "service",
    "labelJa": "和装エプロンの給仕",
    "summaryJa": "広い腰エプロンを重ねた創作和装",
    "moodTags": [
      "可愛い",
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "japanese"
      },
      "garment": {
        "category": "wafuku",
        "subtype": "kimono_apron",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "cotton",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "forest_green",
        "secondary": "warm_ivory",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "kimono_sleeves",
        "waist": "obi"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "short_cape_maid",
    "group": "style",
    "categoryId": "service",
    "labelJa": "短いケープのメイド",
    "summaryJa": "短い肩ケープと長袖・レース裾のメイド服",
    "moodTags": [
      "上品",
      "可愛い"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "dress",
        "subtype": "classic_maid_dress",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "cotton",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "jet_black",
        "secondary": "pure_white",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "cover_up": "shoulder_cape",
        "sleeves": "fitted_long_sleeves",
        "hem": "lace_hem"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "long_vest_attendant",
    "group": "style",
    "categoryId": "service",
    "labelJa": "ロングベストの従者",
    "summaryJa": "長いベストと幅広パンツの静かな装い",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "business_suit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "twill",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "charcoal_gray",
        "secondary": "warm_ivory",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "vest": "longline_vest",
        "inner_shirt": "band_collar_shirt",
        "bottoms": "wide_trousers"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "star_astronomer",
    "group": "story",
    "categoryId": "fantasy",
    "labelJa": "星読みの天文学者",
    "summaryJa": "広袖ローブに星と銀糸の意匠",
    "moodTags": [
      "神秘的"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "western_fantasy"
      },
      "garment": {
        "category": "robe",
        "subtype": "mage_robe",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "velvet",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "midnight_blue",
        "secondary": "polished_silver",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "wide_sleeves",
        "collar": "high_standing_collar",
        "waist": "sash"
      },
      "silhouette": {
        "fit": "draped"
      },
      "decorations": {
        "items": [
          {
            "type": "star_charms",
            "placements": [],
            "role": "support"
          },
          {
            "type": "silver_embroidery",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 2
      }
    }
  },
  {
    "id": "ritual_priest",
    "group": "story",
    "categoryId": "fantasy",
    "labelJa": "司祭の儀礼服",
    "summaryJa": "床に届く鐘袖のローブと肩ケープ",
    "moodTags": [
      "神秘的",
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "western_fantasy"
      },
      "garment": {
        "category": "robe",
        "subtype": "priest_robe",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "brocade",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "warm_ivory",
        "secondary": "pale_gold",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "bell_sleeves",
        "hem": "floor_sweeping_hem",
        "cover_up": "shoulder_cape"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "items": [
          {
            "type": "braided_trim",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 1
      }
    }
  },
  {
    "id": "desert_traveler",
    "group": "story",
    "categoryId": "fantasy",
    "labelJa": "砂漠の旅人",
    "summaryJa": "フードと広袖で包む軽い旅装",
    "moodTags": [
      "シンプル"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "western_fantasy"
      },
      "garment": {
        "category": "robe",
        "subtype": "traveling_robe",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "linen",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "sand_beige",
        "secondary": "terracotta",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "headwear": "hood",
        "sleeves": "wide_sleeves",
        "waist": "wide_belt"
      },
      "silhouette": {
        "fit": "draped"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "prince_half_cape",
    "group": "story",
    "categoryId": "fantasy",
    "labelJa": "片肩マントの王子",
    "summaryJa": "片肩だけにマントを置いた礼装",
    "moodTags": [
      "華やか"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "western_fantasy"
      },
      "garment": {
        "category": "uniform",
        "subtype": "royal_uniform",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "brocade",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "royal_blue",
        "secondary": "antique_gold",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "asymmetry_detail": "one_sided_cape",
        "collar": "stand_collar",
        "bottoms": "fitted_trousers"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "items": [
          {
            "type": "ornamental_clasps",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 1
      }
    }
  },
  {
    "id": "forest_herbalist",
    "group": "story",
    "categoryId": "fantasy",
    "labelJa": "森の薬草師",
    "summaryJa": "短いケープと道具用ベルトの採集服",
    "moodTags": [
      "シンプル"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "western_fantasy"
      },
      "garment": {
        "category": "top_bottom",
        "subtype": "adventurer_outfit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "linen",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "forest_green",
        "secondary": "warm_brown",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "waist": "utility_belt",
        "cover_up": "shoulder_cape",
        "sleeves": "elbow_sleeves"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "haori_student",
    "group": "style",
    "categoryId": "eastern",
    "labelJa": "羽織と袴の書生風",
    "summaryJa": "羽織風の上着と折り目のある袴",
    "moodTags": [
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "japanese"
      },
      "garment": {
        "category": "wafuku",
        "subtype": "haori_hakama",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "cotton",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "deep_navy",
        "secondary": "ash_gray",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "kimono_sleeves",
        "waist": "obi"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "layered_ceremony",
    "group": "style",
    "categoryId": "eastern",
    "labelJa": "薄衣を重ねた創作祭祀装束",
    "summaryJa": "不透明な内衣に薄い外衣を重ねる創作装束",
    "moodTags": [
      "神秘的"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "japanese"
      },
      "garment": {
        "category": "wafuku",
        "subtype": "layered_ritual_robes",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "silk",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "warm_ivory",
        "secondary": "pale_cyan",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "wide_sleeves",
        "hem": "layered_hem"
      },
      "silhouette": {
        "fit": "draped"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "eastern_long_coat",
    "group": "style",
    "categoryId": "eastern",
    "labelJa": "中華風の長衣と外套",
    "summaryJa": "立ち襟の長衣に袖のある外套を重ねる",
    "moodTags": [
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "chinese"
      },
      "garment": {
        "category": "chinese",
        "subtype": "eastern_cloak_robe",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "jacquard",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "burgundy",
        "secondary": "antique_gold",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "mandarin_collar",
        "closure": "frog_closures",
        "sleeves": "wide_sleeves"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "kimono_corset",
    "group": "style",
    "categoryId": "eastern",
    "labelJa": "着物にコルセットベルト",
    "summaryJa": "締まった胴と非対称の裾を持つ創作和装",
    "moodTags": [
      "クール",
      "ダーク"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "japanese"
      },
      "garment": {
        "category": "wafuku",
        "subtype": "modern_kimono_outfit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "cotton",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "jet_black",
        "secondary": "deep_crimson",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "waist": "corset_waist",
        "sleeves": "kimono_sleeves",
        "hem": "asymmetric_hem"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "hagoromo_dance",
    "group": "style",
    "categoryId": "eastern",
    "labelJa": "羽衣を重ねた創作舞装束",
    "summaryJa": "肩から浮かぶ長い布と引き裾の舞装束",
    "moodTags": [
      "神秘的",
      "華やか"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "japanese"
      },
      "garment": {
        "category": "wafuku",
        "subtype": "floating_sash_dance",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "flowing_chiffon",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "pearl_white",
        "secondary": "soft_lavender",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "flared_sleeves",
        "hem": "trailing_hem"
      },
      "silhouette": {
        "fit": "draped"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "gothic_tailcoat",
    "group": "style",
    "categoryId": "alternative",
    "labelJa": "ゴシックな燕尾服",
    "summaryJa": "長い燕尾とフリルシャツ、レース袖口",
    "moodTags": [
      "ダーク",
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "tailcoat_suit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "velvet",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "jet_black",
        "secondary": "burgundy",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "inner_shirt": "ruffled_shirt",
        "collar": "peak_lapels",
        "cuffs": "lace_cuffs",
        "bottoms": "fitted_trousers"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "clockwork_suit",
    "group": "style",
    "categoryId": "alternative",
    "labelJa": "歯車金具のスチームパンク服",
    "summaryJa": "ダブルベストを金具で留める機械仕掛け風",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "business_suit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "leather",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "warm_brown",
        "secondary": "copper_metal",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "vest": "double_breasted_vest",
        "closure": "multiple_buckles",
        "bottoms": "straight_trousers"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "items": [
          {
            "type": "gear_ornaments",
            "placements": [],
            "role": "support"
          },
          {
            "type": "clockwork_details",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 2
      }
    }
  },
  {
    "id": "dark_academia_coat",
    "group": "style",
    "categoryId": "alternative",
    "labelJa": "ダークアカデミアのロングコート",
    "summaryJa": "ツイードの長いコートを細いベルトで締める",
    "moodTags": [
      "ダーク",
      "上品"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "robe",
        "subtype": "long_coat",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "tweed",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "warm_brown",
        "secondary": "charcoal_gray",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "notched_lapels",
        "closure": "single_breasted",
        "sleeves": "long_sleeves",
        "waist": "narrow_belt"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "cyber_multi_belt",
    "group": "style",
    "categoryId": "alternative",
    "labelJa": "多層ベルトのサイバーパンク服",
    "summaryJa": "二重ベルトと機能ベストを重ねたつなぎ",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "work_coveralls",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "rubberized_fabric",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "jet_black",
        "secondary": "lime_green",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "waist": "double_belt",
        "vest": "utility_vest",
        "closure": "asymmetric_zipper",
        "bottoms": "cargo_pants"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "items": [
          {
            "type": "buckles",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 1
      }
    }
  },
  {
    "id": "asymmetric_mode",
    "group": "style",
    "categoryId": "alternative",
    "labelJa": "左右非対称のモード服",
    "summaryJa": "袖の左右差と斜めの前合わせ、前後差のある裾",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "robe",
        "subtype": "long_coat",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "crepe",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "ink_black",
        "secondary": "pearl_white",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "asymmetric_sleeves",
        "hem": "high_low_hem",
        "asymmetry_detail": "diagonal_closure"
      },
      "silhouette": {
        "fit": "draped"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "prince_idol",
    "group": "style",
    "categoryId": "stage",
    "labelJa": "王子系アイドル衣装",
    "summaryJa": "肩章と短いケープ、ショートパンツの舞台服",
    "moodTags": [
      "華やか"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "royal_uniform",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "satin",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "pure_white",
        "secondary": "royal_blue",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "shoulders": "epaulettes",
        "cover_up": "shoulder_cape",
        "bottoms": "tailored_shorts",
        "footwear": "knee_high_boots"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "items": [
          {
            "type": "aiguillettes",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 1
      }
    }
  },
  {
    "id": "circus_ringmaster",
    "group": "style",
    "categoryId": "stage",
    "labelJa": "サーカスの団長服",
    "summaryJa": "深紅の燕尾と幅広の飾り帯",
    "moodTags": [
      "華やか"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "tailcoat_suit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "velvet",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "deep_crimson",
        "secondary": "jet_black",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "peak_lapels",
        "waist": "royal_sash",
        "bottoms": "fitted_trousers",
        "footwear": "knee_high_boots"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "items": [
          {
            "type": "braided_trim",
            "placements": [],
            "role": "support"
          },
          {
            "type": "brass_buttons",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 2
      }
    }
  },
  {
    "id": "masquerade_gown",
    "group": "style",
    "categoryId": "stage",
    "labelJa": "仮面舞踏会のドレス",
    "summaryJa": "目元の仮面と大きく広がるタフタのスカート",
    "moodTags": [
      "華やか",
      "神秘的"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "dress",
        "subtype": "ball_gown",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "taffeta",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "royal_purple",
        "secondary": "antique_gold",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "neckline": "sweetheart_neckline",
        "skirt_shape": "full_skirt",
        "headwear": "masquerade_mask"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "sequin_stage_suit",
    "group": "style",
    "categoryId": "stage",
    "labelJa": "スパンコールのステージスーツ",
    "summaryJa": "ショール襟とフレアパンツにスパンコール",
    "moodTags": [
      "華やか"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "business_suit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "satin",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "sapphire_blue",
        "secondary": "polished_silver",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "shawl_lapels",
        "bottoms": "flared_trousers",
        "closure": "single_breasted"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "items": [
          {
            "type": "sequins",
            "placements": [],
            "role": "support"
          }
        ],
        "density": 3
      }
    }
  },
  {
    "id": "cape_magician",
    "group": "style",
    "categoryId": "stage",
    "labelJa": "マント付きマジシャン衣装",
    "summaryJa": "長いマントと錦のベストを重ねる舞台服",
    "moodTags": [
      "神秘的",
      "華やか"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "stage_magician_outfit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "velvet",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "jet_black",
        "secondary": "deep_crimson",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "cover_up": "full_back_cape",
        "inner_shirt": "pleated_front_shirt",
        "vest": "brocade_vest",
        "bottoms": "fitted_trousers"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      }
    }
  },
  {
    "id": "snow_winter_coat",
    "group": "scene",
    "categoryId": "story",
    "labelJa": "雪を払った冬の外套",
    "summaryJa": "溶けた雪の湿り気が残るウールの外套",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "robe",
        "subtype": "long_coat",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "wool",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "ash_gray",
        "secondary": "warm_ivory",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "fur_trimmed_collar",
        "closure": "double_breasted"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      },
      "condition": {
        "items": [
          {
            "type": "snow_damp",
            "group": "state",
            "severity": "light",
            "extent": "scattered",
            "placements": [
              "hem",
              "sleeves"
            ]
          }
        ]
      }
    }
  },
  {
    "id": "dust_travel_clothes",
    "group": "scene",
    "categoryId": "story",
    "labelJa": "砂埃の旅装",
    "summaryJa": "砂埃をまとった丈夫な上下と編み上げ靴",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "western_fantasy"
      },
      "garment": {
        "category": "top_bottom",
        "subtype": "adventurer_outfit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "canvas",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "khaki",
        "secondary": "warm_brown",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "waist": "utility_belt",
        "footwear": "lace_up_boots"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      },
      "condition": {
        "items": [
          {
            "type": "dust_covered",
            "group": "state",
            "severity": "light",
            "extent": "scattered",
            "placements": [
              "hem",
              "sleeves"
            ]
          }
        ]
      }
    }
  },
  {
    "id": "painter_workwear",
    "group": "scene",
    "categoryId": "story",
    "labelJa": "絵の具が付いた画家の作業着",
    "summaryJa": "胸当てエプロンに絵の具の飛沫が残る作業服",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "modern"
      },
      "garment": {
        "category": "uniform",
        "subtype": "apron_shirt_outfit",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "canvas",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "off_white",
        "secondary": "denim_blue",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "three_quarter_sleeves",
        "bottoms": "wide_trousers"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      },
      "condition": {
        "items": [
          {
            "type": "paint_splattered",
            "group": "state",
            "severity": "light",
            "extent": "scattered",
            "placements": [
              "hem",
              "sleeves"
            ]
          }
        ]
      }
    }
  },
  {
    "id": "frayed_ceremonial",
    "group": "scene",
    "categoryId": "story",
    "labelJa": "擦り切れた儀礼服",
    "summaryJa": "儀礼用の錦のローブに擦り切れた袖口と裾",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "western_fantasy"
      },
      "garment": {
        "category": "robe",
        "subtype": "priest_robe",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "brocade",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "burgundy",
        "secondary": "antique_gold",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "sleeves": "bell_sleeves",
        "hem": "floor_sweeping_hem"
      },
      "silhouette": {
        "fit": "tailored"
      },
      "decorations": {
        "density": 0,
        "items": []
      },
      "condition": {
        "items": [
          {
            "type": "frayed_edges",
            "group": "state",
            "severity": "light",
            "extent": "scattered",
            "placements": [
              "hem",
              "sleeves"
            ]
          }
        ]
      }
    }
  },
  {
    "id": "patched_cape",
    "group": "scene",
    "categoryId": "story",
    "labelJa": "継ぎ当てのあるマント",
    "summaryJa": "継ぎ当てで使い続ける留め金付きケープコート",
    "moodTags": [
      "クール"
    ],
    "searchAliases": [],
    "patch": {
      "concept": {
        "worldview": "western_fantasy"
      },
      "garment": {
        "category": "robe",
        "subtype": "cape_coat",
        "wearRole": "main_outfit"
      },
      "materials": {
        "primary": "wool",
        "transparency": "opaque",
        "surface": "matte"
      },
      "palette": {
        "primary": "forest_green",
        "secondary": "warm_brown",
        "accent": null,
        "scheme": "base_and_accent"
      },
      "parts": {
        "collar": "stand_collar",
        "closure": "clasp_closure"
      },
      "silhouette": {
        "fit": "draped"
      },
      "decorations": {
        "density": 0,
        "items": []
      },
      "condition": {
        "items": [
          {
            "type": "patched",
            "group": "state",
            "severity": "light",
            "extent": "scattered",
            "placements": [
              "hem"
            ]
          }
        ]
      }
    }
  }
]);
})(window);
