/* 衣装プロンプト工房 / generator.js
 * Phase 3：英語プロンプト生成。window.CPW.generator へ登録する。
 * app.js は結果を表示するだけで、文章の組み立てはここに閉じる。
 *
 * 方針
 *   - 自然言語生成AIではなく、テンプレート生成。扱える範囲を狭く保ち、壊れた英文を出さない。
 *   - 空のブロックは接続語ごと落とす（"adorned with" が宙に浮かない）。
 *   - 一般語と具体語を並べない。句は組み立ててから一度だけ出す。
 *   - 初期状態は「衣装のみ」。背景・ポーズ・感情・物語・魔法演出・品質タグは
 *     output の各オプションが true のときだけ足す。
 *
 * 語順の設計（設計書§6）
 *   衣装の核 → 配色 → シルエット → 基本衣装 → 部位 → 素材・柄 → 装飾と位置
 *   → 様式・テーマ・属性 → 特殊パーツ → 任意演出
 *   ただし主テーマだけは§10の例に合わせて核の修飾語に入れる
 *   （"a Norse mythology-inspired royal outfit adorned with ice-crystal motifs …"）。
 *   副テーマ・属性は theme ブロックで後ろに置く。
 */
(function (global) {
  'use strict';

  var CPW = global.CPW;
  var D = CPW.data;
  var U = CPW.util;
  var S = CPW.schema;

  /* ============================================================
   * 語彙の小道具
   * ========================================================== */
  function en(list, id) {
    var o = U.byId(list, id);
    if (!o) return null;
    return o.shortPrompt || o.promptEn || null;
  }

  function words(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').split(/[\s-]+/).filter(Boolean);
  }

  /* a / an。母音字ではなく音で決める必要があるものだけ例外表に置く。 */
  var AN_EXCEPTIONS = ['hour', 'honest', 'heir'];
  var A_EXCEPTIONS = ['one', 'uniform', 'unique', 'european', 'university', 'used'];
  CPW.generator = CPW.generator || {};

  function article(phrase) {
    var first = words(phrase)[0];
    if (!first) return 'a';
    if (A_EXCEPTIONS.indexOf(first) >= 0) return 'a';
    if (AN_EXCEPTIONS.indexOf(first) >= 0) return 'an';
    return /^[aeiou]/.test(first) ? 'an' : 'a';
  }
  function withArticle(phrase) { return phrase ? article(phrase) + ' ' + phrase : ''; }

  /* 「A と B と C」。1件なら and を作らない。 */
  function joinAnd(list) {
    var l = list.filter(Boolean);
    if (!l.length) return '';
    if (l.length === 1) return l[0];
    if (l.length === 2) return l[0] + ' and ' + l[1];
    return l.slice(0, -1).join(', ') + ' and ' + l[l.length - 1];
  }

  /* 語の重複を潰す。
   * 1. 同じ句（大小文字違いを含む）は1つに。
   * 2. ある句が別の句へ語単位で丸ごと含まれるなら、短い方を落とす。
   *    "lace gloves" は "elbow-length fingerless lace gloves" に含まれるので消える。 */
  function containsWords(hayWords, needleWords) {
    if (!needleWords.length || needleWords.length > hayWords.length) return false;
    for (var i = 0; i + needleWords.length <= hayWords.length; i++) {
      var hit = true;
      for (var j = 0; j < needleWords.length; j++) {
        if (hayWords[i + j] !== needleWords[j]) { hit = false; break; }
      }
      if (hit) return true;
    }
    return false;
  }

  function compress(list) {
    var seen = {}, out = [];
    list.filter(Boolean).map(function (s) { return String(s).trim(); }).filter(Boolean).forEach(function (p) {
      var k = p.toLowerCase();
      if (seen[k]) return;
      seen[k] = true;
      out.push(p);
    });
    var wordSets = out.map(words);
    return out.filter(function (p, i) {
      for (var j = 0; j < out.length; j++) {
        if (i === j) continue;
        if (wordSets[j].length <= wordSets[i].length) continue;
        if (containsWords(wordSets[j], wordSets[i])) return false;
      }
      return true;
    });
  }
  CPW.generator.compress = compress;

  /* 修飾語のうち、核の語に既に含まれているものを落とす。
   * role "royal" ＋ head "royal uniform" → "royal royal uniform" を防ぐ。 */
  function dropRedundant(mods, head) {
    var used = words(head);
    var out = [];
    mods.filter(Boolean).forEach(function (m) {
      var w = words(m);
      if (containsWords(used, w)) return;
      out.push(m);
      used = used.concat(w);
    });
    return out;
  }

  /* ============================================================
   * 部品ごとの句
   * ========================================================== */
  function colorEn(id) { var c = U.byId(D.colors, id); return c ? c.promptEn : null; }

  /* 主色＋副色。1色なら and を作らない。 */
  function baseColorPhrase(o) {
    return joinAnd([colorEn(o.palette.primary), colorEn(o.palette.secondary)].filter(Boolean));
  }

  /* 差し色・金属色・宝石色 */
  function accentClauses(o) {
    var out = [];
    if (o.palette.accent) out.push({ verb: 'accented with', text: colorEn(o.palette.accent) + ' accents', plain: colorEn(o.palette.accent) });
    if (o.palette.metal) out.push({ verb: 'finished with', text: colorEn(o.palette.metal) + ' details', plain: colorEn(o.palette.metal) + ' details' });
    if (o.palette.gem) out.push({ verb: 'highlighted with', text: colorEn(o.palette.gem) + ' highlights', plain: colorEn(o.palette.gem) + ' highlights' });
    return out;
  }

  function densityAdj(o) {
    var d = D.decorationDensity[o.decorations.density];
    // 装飾が1件も無いのに「豪奢」とは書かない。強調語は一つだけ。
    if (!d || !d.adjEn) return null;
    if (!o.decorations.items.some(function (i) { return !!i.type; }) && d.level < 4) return null;
    return d.adjEn;
  }

  /* 主テーマを核の修飾語にするときは -inspired で結ぶ。
   * "fairy-tale lolita maid board shorts" のような名詞の積み重ねは、
   * 画像生成AIがどれを衣装本体か読み違える。 */
  function themeAdj(o) {
    var m = U.byId(D.motifs, o.concept.primaryThemeMotif);
    if (!m) return null;
    var adj = m.themeAdjEn || (m.shortPrompt || '').replace(/\s*motifs?$/, '');
    if (!adj) return null;
    if (!/inspired$/.test(adj)) adj += '-inspired';
    return adj;
  }

  function garmentHead(o) {
    var g = U.byId(D.garments, o.garment.subtype);
    if (g) return g.shortPrompt;
    var c = U.byId(D.garmentCategories, o.garment.category);
    if (!c) return null;
    return { top_bottom: 'outfit', dress: 'dress', uniform: 'uniform', robe: 'robe', wafuku: 'kimono', chinese: 'hanfu', swimwear: 'swimsuit', lingerie: 'lingerie set' }[c.id] || 'outfit';
  }

  /* 手袋などの複合スロットは必ず一句へ */
  function compositePhrase(slot, value) {
    var ph = S.compositeToPhrase(slot, value);
    if (!ph) return null;
    return (ph.modifiers.concat([ph.head])).join(' ');
  }

  /* 装飾＋位置 → "silver embroidery along the collar and cuffs" */
  function placementPhrase(placements, prep) {
    var list = (placements || []).map(function (id) {
      var p = U.byId(D.decorationPlacements, id);
      return p ? { text: p.promptEn, noArticle: !!p.noArticle } : null;
    }).filter(Boolean);
    if (!list.length) return '';
    if (list.length === 1 && list[0].noArticle) return list[0].text;
    var names = joinAnd(list.map(function (p) { return p.text; }));
    return prep + ' the ' + names;
  }

  function decorationPhrase(item, opts) {
    var d = U.byId(D.decorations, item.type);
    if (!d) return null;
    var name = d.shortPrompt;
    if (opts && opts.detailed) {
      var size = en(D.decorationSizes, item.size);
      var qty = U.byId(D.decorationQuantities, item.quantity);
      var qtyWord = qty && qty.id !== 'few' && !d.uncountable ? qty.shortPrompt : null;
      name = [qtyWord, size, name].filter(Boolean).join(' ');
    }
    var place = placementPhrase(item.placements, d.prep || 'on');
    return place ? name + ' ' + place : name;   // 位置が無ければ装飾名だけ。前置詞を宙に浮かせない。
  }

  /* ============================================================
   * ブロック生成
   * 各ブロックは { short: [句], detailed: [句] } を返す。空なら両方 []。
   * ========================================================== */
  /* 水着の型（ワンピース／セパレート／ショーツ）は部位ではなく核の一部。
   * "with two-piece" のような欠けた句を作らないため、核へ統合する。
   * 核が既に同種の語を含む場合（one-piece swimsuit や board shorts）は重ねない。 */
  function swimFormAdj(o, head) {
    if (o.garment.category !== 'swimwear') return null;
    var slot = U.byId(D.partSlots, 'swim_form');
    if (!slot) return null;
    var opt = U.byId(slot.options, o.parts.swim_form);
    if (!opt || !opt.coreAdjEn) return null;
    // 核が既に型を語っている（one-piece swimsuit / bikini / board shorts）なら重ねない。
    // 型の齟齬（ワンピース水着にセパレート型）は競合判定の領分で、生成では核を優先する。
    if (/one-piece|two-piece|bikini|shorts|trunks/i.test(head)) return null;
    return opt.coreAdjEn;
  }

  function blockIdentity(o, mode) {
    var head = garmentHead(o);
    if (!head) return { short: [], detailed: [] };
    var g = U.byId(D.garments, o.garment.subtype);
    // 詳細版の核は detailedPrompt（冠詞を外して使う）。garments ブロックとは二重にしない。
    var headDetail = g && g.detailedPrompt ? g.detailedPrompt.replace(/^(a|an|the)\s+/i, '') : head;
    var formAdj = swimFormAdj(o, head);
    if (formAdj) { head = formAdj + ' ' + head; headDetail = formAdj + ' ' + headDetail; }

    var styleIds = [o.concept.primaryStyle].concat(o.concept.secondaryStyles || []);
    var styles = styleIds.map(function (id) {
      var st = U.byId(D.styles, id);
      return st ? (st.adjEn || st.shortPrompt) : null;
    }).filter(Boolean);

    var wv = en(D.worldviews, o.concept.worldview);
    // adjEn を持たない役割（会社員など）は核の修飾語に置かない
    var roleObj = U.byId(D.roles, o.concept.role);
    var role = roleObj ? roleObj.adjEn || null : null;

    var common = [densityAdj(o), themeAdj(o)].concat(styles).concat([wv, role]);
    // 短縮版だけ、核へ主色・副色を入れる（"white and silver fantasy royal uniform"）
    var shortMods = dropRedundant([densityAdj(o), baseColorPhrase(o), themeAdj(o)].concat(styles).concat([wv, role]), head);
    var detailMods = dropRedundant(common, head);

    var detailPhrase = dropRedundant(common, headDetail).concat([headDetail]).join(' ');
    // board shorts のような複数形の核に "A ... shorts" と冠詞を付けない
    var detailCore = g && g.plural ? 'a pair of ' + detailPhrase : withArticle(detailPhrase);
    return {
      short: [shortMods.concat([head]).join(' ')],
      detailed: [detailCore]
    };
  }

  function blockPalette(o) {
    var base = baseColorPhrase(o);
    var extras = accentClauses(o);
    if (!base && !extras.length) return { short: [], detailed: [] };

    // 短縮版：核が主色・副色を持っているので、ここは差し色以降だけ
    var scheme = en(D.colorSchemes, o.palette.scheme);
    var schemeAdj = scheme ? scheme.replace(/\s*(color\s*)?palette$/, '') : null;

    var sh = [];
    if (extras.length) sh.push('with ' + joinAnd(extras.map(function (e) { return e.text; })));
    if (scheme) sh.push(scheme);

    var de = [];
    var core = [schemeAdj, base].filter(Boolean).join(' ');
    if (core) {
      var lead = 'built around ' + article(core) + ' ' + core + ' palette';
      if (extras.length) lead += ', ' + extras.map(function (e) { return e.verb + ' ' + e.plain; }).join(', ');
      de.push(lead);
    } else if (extras.length) {
      de.push(extras.map(function (e) { return e.verb + ' ' + e.plain; }).join(', '));
    }
    return { short: sh, detailed: de };
  }

  function blockSilhouette(o) {
    var s = o.silhouette;
    var list = [
      en(D.silhouette.fit, s.fit),
      en(D.silhouette.upperVolume, s.upperVolume),
      en(D.silhouette.lowerVolume, s.lowerVolume),
      en(D.silhouette.waist, s.waist),
      en(D.silhouette.length, s.length),
      en(D.silhouette.symmetry, s.symmetry)
    ].filter(Boolean);
    if (!list.length) return { short: [], detailed: [] };
    return { short: list, detailed: [joinAnd(list) + ' in silhouette'] };
  }

  /* 基本衣装そのものは核に入っているので、ここは着用役割・重ね方だけ */
  function blockGarments(o) {
    var w = U.byId(D.wearRoles, o.garment.wearRole);
    if (!w || !w.promptEn) return { short: [], detailed: [] };
    return { short: [w.promptEn], detailed: [w.promptEn] };
  }

  function blockParts(o, headWords) {
    var plan = CPW.slotPlan(o);
    var cat = plan.category;
    if (!cat) return { short: [], detailed: [] };
    var out = [];
    cat.slots.forEach(function (slotId) {
      if (slotId === 'swim_form') return;   // 水着の型は核へ統合済み（blockIdentity）
      var slot = U.byId(D.partSlots, slotId);
      if (!slot) return;
      var v = o.parts[slotId];
      if (!S.isSlotFilled(slot, v)) return;
      var kind = S.slotKind(slot);

      if (kind === 'composite') {
        var p = compositePhrase(slot, v);
        if (p) out.push(p);
        return;
      }
      if (kind === 'multi') {
        v.forEach(function (item) {
          var text = en(slot.options, item.id);
          if (!text) return;
          var layer = U.byId(D.partLayers, item.layer);
          if (layer && layer.promptEn) text = text + ' ' + layer.promptEn;
          out.push(text);
        });
        return;
      }
      var opt = U.byId(slot.options, v);
      var t = opt ? opt.shortPrompt : null;
      if (!t) return;
      // barefoot は衣装パーツではなく着用状態。blockWearState が別に扱う。
      if (opt.wearState) return;
      out.push(t);
    });
    if (!out.length) return { short: [], detailed: [] };
    var forDetail = out.filter(function (p) { return !containsWords(headWords || [], words(p)); });
    return { short: out, detailed: forDetail.length ? [joinAnd(forDetail)] : [] };
  }

  /* 着用状態（素足など）。衣装パーツと同列の名詞として扱わず、
   * 接続語（with）を受けない独立の句にする。"with barefoot" を作らないための分離。 */
  function blockWearState(o) {
    var plan = CPW.slotPlan(o);
    var cat = plan.category;
    if (!cat) return { short: [], detailed: [] };
    var states = [];
    cat.slots.forEach(function (slotId) {
      var slot = U.byId(D.partSlots, slotId);
      if (!slot || !slot.options) return;
      var v = o.parts[slotId];
      if (!S.isSlotFilled(slot, v)) return;
      if (S.slotKind(slot) !== 'single') return;
      var opt = U.byId(slot.options, v);
      if (opt && opt.wearState && opt.shortPrompt) states.push(opt.shortPrompt);
    });
    if (!states.length) return { short: [], detailed: [] };
    return {
      short: states.slice(),                                        // 短縮版は独立タグ（barefoot）
      detailed: states.map(function (w) { return 'worn ' + w; })    // 詳細版は着用状態（worn barefoot）
    };
  }

  /* 「流れる構造」が選ばれているか。flowing という語は、
   * 実際に流れる造り（ドレープ・広がる裾・引き裾・羽織り）があるときだけ使う。
   * ショートパンツに flowing chiffon が付くと、画像AIが長いドレスを生成しやすい。 */
  function hasFlowingStructure(o) {
    if (o.silhouette.fit === 'draped') return true;
    if (o.silhouette.lowerVolume === 'flared' || o.silhouette.lowerVolume === 'voluminous') return true;
    if (o.silhouette.length === 'train' || o.silhouette.length === 'floor') return true;
    var cu = o.parts.cover_up;
    if (cu && cu !== 'no_cover_up') return true;
    return false;
  }
  function materialName(id, o) {
    var name = en(D.materials, id);
    if (!name) return null;
    if (/^flowing\s+/.test(name) && !hasFlowingStructure(o)) return name.replace(/^flowing\s+/, '');
    return name;
  }

  function blockMaterials(o) {
    var m = o.materials;
    var primary = materialName(m.primary, o);
    var secondary = materialName(m.secondary, o);
    var trim = materialName(m.trim, o);
    var sheer = en(D.transparency, m.transparency);
    var surface = en(D.surfaces, m.surface);
    var thick = en(D.thickness, m.thickness);
    var patterns = (m.patterns || []).map(function (id) { return en(D.patterns, id); }).filter(Boolean);

    if (!primary && !secondary && !trim && !sheer && !surface && !thick && !patterns.length) {
      return { short: [], detailed: [] };
    }

    // 「透け感 ＋ 柄 ＋ 主素材」を一句に畳む："sheer floral lace"
    var patternAdj = patterns.map(function (p) { return p.replace(/\s*pattern$/, ''); });
    var core = null;
    if (primary) {
      // 柄名が既に素材名を含むなら（floral lace ＋ lace）、素材名を重ねない
      var pat = patternAdj[0];
      var body = pat && containsWords(words(pat), words(primary)) ? pat : [pat, primary].filter(Boolean).join(' ');
      core = [sheer, body].filter(Boolean).join(' ');
    }

    var sh = [];
    if (core) sh.push(core);
    else if (sheer) sh.push(sheer);
    if (secondary) sh.push(secondary + ' accents');
    if (trim) sh.push(trim);
    patternAdj.slice(core ? 1 : 0).forEach(function (p) { sh.push(p + ' pattern'); });
    if (surface) sh.push(surface);
    if (thick) sh.push(thick);

    var de = [];
    if (core) de.push('made of ' + core);
    else if (sheer) de.push('in ' + sheer + ' fabric');
    // 副素材は位置未指定のまま "combined with" で主衣装へ直結させない。
    // どこに付くか分からない素材は accents として付ける（設計書§10）。
    var extras = [];
    if (secondary) extras.push(secondary + ' accents');
    if (trim) extras.push(trim + ' trim');
    if (extras.length) de.push('with ' + joinAnd(extras));
    var finish = [surface, thick].filter(Boolean);
    if (finish.length) de.push(joinAnd(finish));
    patternAdj.slice(core ? 1 : 0).forEach(function (p) { de.push(p + ' patterning'); });

    return { short: sh, detailed: [de.join(', ')] };
  }

  function blockDecorations(o, mode) {
    var items = (o.decorations.items || []).filter(function (i) { return !!i.type; });
    var focal = U.byId(D.decorations, o.decorations.focalMotif);
    if (!items.length && !focal) return { short: [], detailed: [] };

    // 主役装飾モチーフに対応する装飾があれば先頭に。無ければモチーフ名だけを先に出す。
    var ordered = items.slice().sort(function (a, b) {
      var rank = function (i) {
        if (focal && i.type === focal.id) return 0;
        return i.role === 'focal' ? 1 : i.role === 'support' ? 2 : 3;
      };
      return rank(a) - rank(b);
    });

    var sh = ordered.map(function (i) { return decorationPhrase(i, { detailed: false }); }).filter(Boolean);
    var de = ordered.map(function (i) { return decorationPhrase(i, { detailed: true }); }).filter(Boolean);

    if (focal && !items.some(function (i) { return i.type === focal.id; })) {
      sh.unshift(focal.shortPrompt);
      de.unshift(focal.shortPrompt);
    }
    if (!sh.length) return { short: [], detailed: [] };
    return { short: sh, detailed: [joinAnd(de)] };
  }

  function blockTheme(o) {
    // 主テーマは核の修飾語で出しているので、ここは副テーマ・様式の残り・属性の質感
    var secondary = (o.concept.secondaryThemeMotifs || []).map(function (id) {
      var m = U.byId(D.motifs, id);
      return m ? m.shortPrompt : null;
    }).filter(Boolean);

    var attr = U.byId(D.attributes, o.concept.attribute.id);
    var moodList = [];
    // 雰囲気語は感情に踏み込むので、初期の「衣装のみ」には混ぜない
    if (attr && o.output.includeNarrative && o.concept.attribute.applyTo.decorations) {
      var lim = U.byId(D.attributeIntensities, o.concept.attribute.intensity);
      moodList = (attr.moods || []).slice(0, lim ? lim.maxHints : 2);
    }

    var sh = secondary.concat(moodList);
    if (!sh.length) return { short: [], detailed: [] };
    var de = [];
    if (secondary.length) de.push('with ' + joinAnd(secondary));
    if (moodList.length) de.push('evoking ' + article(moodList[0]) + ' ' + joinAnd(moodList) + ' atmosphere');
    return { short: sh, detailed: [de.join(', ')] };
  }

  function blockSpecialParts(o) {
    var sp = o.specialParts;
    var out = [];
    var detailed = [];

    /* 核を複数形にする。既に複数形ならそのまま。 */
    function pluralize(word) {
      if (/s$/.test(word)) return word;
      if (/(ch|sh|x|z)$/.test(word)) return word + 'es';
      if (/[^aeiou]y$/.test(word)) return word.replace(/y$/, 'ies');
      return word + 's';
    }
    /* 冠詞が要るか。翼・角はもともと複数形なので付けない。 */
    function needsArticle(slot, countOpt, head) {
      if (countOpt && countOpt.fixedArticle) return false;
      if (countOpt && countOpt.plural) return false;
      if (/s$/.test(head)) return false;              // wings / horns は既に複数
      return true;                                     // halo / tail は単数の可算
    }

    /* 複合スロット（翼・角・光輪・尾）を一句へ畳む。
     * 一般語と具体語を並べない。"angel wings, large angel wings" ではなく
     * "large spread wide angel wings" ではなく "large spread angel wings" のように、
     * 修飾語＋核の一句にする。 */
    D.specialParts.slots.forEach(function (slot) {
      var active = S.activeComposite(slot, sp[slot.id]);
      if (!active) return;                       // 種類未選択なら丸ごと出さない

      var typeOpt = U.byId(S.axisOf(slot, 'type').options, active.type);
      if (!typeOpt || !typeOpt.shortPrompt) return;

      var mods = [];
      (slot.phraseOrder || []).forEach(function (key) {
        var axis = S.axisOf(slot, key);
        if (!axis) return;
        var opt = U.byId(axis.options, active[key]);
        if (opt && opt.shortPrompt) mods.push(opt.shortPrompt);
      });

      // 色は連動でも個別でも、解決した1語だけを足す
      var color = S.specialPartColor(o, slot, active);
      if (color) mods.push(color.promptEn);

      var head = typeOpt.shortPrompt;
      var countKey = slot.countAxis;
      var countOpt = countKey ? U.byId(S.axisOf(slot, countKey).options, active[countKey]) : null;

      // 複数指定なら核を複数形にする（demon tail → demon tails）
      if (countOpt && countOpt.plural) head = pluralize(head);
      var phrase = mods.concat([head]).join(' ');

      // 枚数・本数は核の前に置く。冠詞は「単数の可算」のときだけ足す。
      if (countOpt && countOpt.shortPrompt) {
        phrase = countOpt.shortPrompt + ' ' + phrase;
      } else if (needsArticle(slot, countOpt, head)) {
        phrase = withArticle(phrase);
      }

      // 尾の先端だけは後置の with 句にする（前に積むと読めなくなる）
      var tip = slot.id === 'tail' ? U.byId((S.axisOf(slot, 'tip') || { options: [] }).options, active.tip) : null;
      if (tip && tip.shortPrompt) phrase += ' with ' + tip.shortPrompt;

      // 光輪の位置は後置
      var pos = slot.id === 'halo' ? U.byId((S.axisOf(slot, 'position') || { options: [] }).options, active.position) : null;
      if (pos && pos.shortPrompt) phrase += ' ' + pos.shortPrompt;

      out.push(phrase);
      detailed.push({ slotId: slot.id, phrase: phrase });
    });

    /* 装飾チェーン。衣装のみ出力でも出る（拘束チェーンとは役割が違う）。 */
    (sp.decorativeChains || []).forEach(function (id) {
      var c = U.byId(D.specialParts.decorativeChains, id);
      if (!c) return;
      var pl = U.byId(D.decorationPlacements, c.placement);
      var phrase = pl ? c.shortPrompt + ' ' + D.specialParts.decorativeChainPrep + ' the ' + pl.promptEn : c.shortPrompt;
      out.push(phrase);
      detailed.push({ slotId: 'decorativeChains', phrase: phrase });
    });

    /* 浮遊装飾。物として浮いているもの。属性エフェクトとは別。 */
    var floats = (sp.floating || []).map(function (id) { return en(D.specialParts.floating, id); }).filter(Boolean);
    floats.forEach(function (f) { out.push(f); });

    /* 魔法的装飾。衣装に付いた術式の意匠なので、includeEffects がOFFでも出る。 */
    var magics = (sp.magical || []).map(function (id) { return en(D.specialParts.magical, id); }).filter(Boolean);
    magics.forEach(function (m) { out.push(m); });

    if (!out.length) return { short: [], detailed: [] };

    /* 詳細版は衣装本文の最後へ自然に接続する。部位ごとに動詞を変える。 */
    var sentences = [];
    var bySlot = function (id) {
      return detailed.filter(function (d) { return d.slotId === id; }).map(function (d) { return d.phrase; });
    };
    var wings = bySlot('wings');
    if (wings.length) sentences.push(joinAnd(wings) + ' behind the wearer');
    var halo = bySlot('halo');
    if (halo.length) sentences.push('crowned by ' + joinAnd(halo));
    var rest = bySlot('horns').concat(bySlot('tail'));
    if (rest.length) sentences.push('featuring ' + joinAnd(rest));
    var chains = bySlot('decorativeChains');
    if (chains.length) sentences.push(joinAnd(chains));
    if (floats.length) sentences.push(D.specialParts.floatingPrep + ' ' + joinAnd(floats));
    if (magics.length) sentences.push(D.specialParts.magicalPrep + ' ' + joinAnd(magics));

    return { short: out, detailed: [joinAnd(sentences)] };
  }

  /* 任意演出。output のスイッチが立っているものだけ。 */
  function blockOptionalNarrative(o) {
    if (!o.output.includeNarrative) return { short: [], detailed: [] };
    var out = [], themeWords = [];
    (o.specialParts.restraintChains || []).forEach(function (id) {
      var c = U.byId(D.specialParts.restraintChains, id);
      if (!c) return;
      out.push(c.shortPrompt);
      if (c.narrativeTheme) themeWords.push(c.narrativeTheme);
    });

    // 雰囲気語は、選んだ色と属性が持つ mood から。勝手な感情語は足さない。
    var moods = [];
    ['primary', 'secondary', 'accent', 'metal'].forEach(function (k) {
      var c = U.byId(D.colors, o.palette[k]);
      if (c) moods = moods.concat(c.moods || []);
    });
    var uniqMoods = compress(moods).slice(0, 1);

    /* 雰囲気は carrying を使わない。carry は画像生成AIに「物を抱えている」と
     * 解釈されやすい。原則 evoking a {mood} atmosphere へ寄せる。 */
    var sh = out.slice();
    var de = [];
    var nouns = out.slice();
    if (themeWords.length) {
      var t = compress(themeWords)[0];
      sh.push(t + ' theme');
      nouns.push(article(t) + ' ' + t + ' theme');
    }
    if (nouns.length) de.push('with ' + joinAnd(nouns));
    if (!themeWords.length && uniqMoods.length) {
      sh.push(uniqMoods[0] + ' atmosphere');
      de.push('evoking ' + article(uniqMoods[0]) + ' ' + uniqMoods[0] + ' atmosphere');
    }
    if (!sh.length) return { short: [], detailed: [] };
    return { short: sh, detailed: [de.join(', ')] };
  }

  function blockEffects(o) {
    if (!o.output.includeEffects) return { short: [], detailed: [] };
    var attr = U.byId(D.attributes, o.concept.attribute.id);
    if (!attr) return { short: [], detailed: [] };
    var lim = U.byId(D.attributeIntensities, o.concept.attribute.intensity);
    var fx = (attr.effects || []).slice(0, lim ? lim.maxHints : 2);
    if (!fx.length) return { short: [], detailed: [] };
    return { short: fx, detailed: [joinAnd(fx)] };
  }

  function blockPresentation(o) {
    if (!o.output.includePresentation) return { short: [], detailed: [] };
    var out = [
      en(D.presentationFocus, o.presentation.focus),
      en(D.poseAssist, o.presentation.poseAssist),
      en(D.compositionAssist, o.presentation.compositionAssist)
    ].filter(Boolean);
    if (!out.length) return { short: [], detailed: [] };
    return { short: out, detailed: [joinAnd(out)] };
  }

  function blockQuality(o) {
    if (!o.output.includeQualityTags) return { short: [], detailed: [] };
    return { short: D.qualityTags.slice(), detailed: [joinAnd(D.qualityTags)] };
  }

  /* ============================================================
   * 公開API
   * ========================================================== */
  var BLOCK_ORDER = [
    'identity', 'palette', 'silhouette', 'garments', 'parts', 'wearState', 'materials',
    'decorations', 'theme', 'specialParts', 'effects', 'presentation', 'optionalNarrative', 'quality'
  ];

  function blocks(outfit) {
    var o = S.normalize(outfit);
    var identity = blockIdentity(o);
    var headWords = words((identity.detailed[0] || '') + ' ' + (identity.short[0] || ''));
    return {
      identity: identity,
      palette: blockPalette(o),
      silhouette: blockSilhouette(o),
      garments: blockGarments(o),
      parts: blockParts(o, headWords),
      wearState: blockWearState(o),
      materials: blockMaterials(o),
      decorations: blockDecorations(o),
      theme: blockTheme(o),
      specialParts: blockSpecialParts(o),
      effects: blockEffects(o),
      presentation: blockPresentation(o),
      optionalNarrative: blockOptionalNarrative(o),
      quality: blockQuality(o)
    };
  }

  var EMPTY_JA = '（まだ出力できる項目がありません。設計台で基本衣装か主色を選ぶと、ここに英語を表示します。）';

  /* 句読点の正規化。データや結合の都合で「.,」「,,」「..」ができても、ここで一つに畳む。
   * 記号の連なりにピリオドが混ざっていればピリオドを、そうでなければカンマを残す。 */
  function tidy(s) {
    return s
      .replace(/\s+([,.])/g, '$1')                 // 記号の前の空白
      .replace(/[.,](?:\s*[.,])+/g, function (m) { return m.indexOf('.') >= 0 ? '.' : ','; })
      .replace(/([,.])(?=\S)/g, '$1 ')             // 記号の後に空白を一つ
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  /* ユーザー追加タグ。タグ自体は改変しない（外側の空白と末尾の区切りだけ整える）。 */
  function userTags(o) {
    var t = o.output && typeof o.output.customTags === 'string' ? o.output.customTags.trim() : '';
    return t.replace(/[\s,]+$/, '');
  }

  function short(outfit) {
    var b = blocks(outfit);
    var list = [];
    BLOCK_ORDER.forEach(function (k) { list = list.concat(b[k].short); });
    var out = compress(list);
    var body = tidy(out.join(', ')).replace(/[.,\s]+$/, '');
    var extra = userTags(S.normalize(outfit));
    if (!body) return extra;                       // 本文が空でもタグだけは出す
    return extra ? body + ', ' + extra : body;     // タグ形式なので末尾ピリオドは付けない
  }

  /* 詳細版。接続語は同じものを続けて使わない。 */
  var CONNECTORS = {
    garments: ['featuring', 'built as'],
    parts: ['with', 'paired with', 'completed with'],
    materials: ['', ''],
    decorations: ['adorned with', 'trimmed with', 'detailed with'],
    theme: ['', ''],
    specialParts: ['completed with', 'and'],
    effects: ['surrounded by', 'wrapped in'],
    presentation: ['shown as', 'framed as'],
    optionalNarrative: ['', ''],
    quality: ['', '']
  };

  function detailed(outfit) {
    var b = blocks(outfit);
    var parts_ = [];
    var lastConnector = null;

    BLOCK_ORDER.forEach(function (k) {
      var texts = b[k].detailed.filter(Boolean);
      if (!texts.length) return;                     // 空ブロックは接続語ごと落とす
      var text = texts.join(', ');
      var pool = CONNECTORS[k];
      if (!pool) { parts_.push(text); return; }
      var conn = pool[0];
      if (conn && conn === lastConnector) conn = pool[1] || pool[0];
      if (conn) { parts_.push(conn + ' ' + text); lastConnector = conn; }
      else { parts_.push(text); }
    });

    var extra = userTags(S.normalize(outfit));
    if (!parts_.length) return extra;
    var s = tidy(parts_.join(', ')).replace(/[.,\s]+$/, '');
    s = s.charAt(0).toUpperCase() + s.slice(1) + '.';
    // 追加タグは本文の後ろへ。境界はピリオドと空白で明確にし、「. ,」を作らない。
    return extra ? s + ' ' + extra : s;
  }

  /* 日本語構造一覧は app.js の表示用。ここでは英語生成のみ扱う。 */
  CPW.generator.blocks = blocks;
  CPW.generator.short = short;
  CPW.generator.detailed = detailed;
  CPW.generator.article = article;
  CPW.generator.joinAnd = joinAnd;
  CPW.generator.EMPTY_JA = EMPTY_JA;
  CPW.generator.BLOCK_ORDER = BLOCK_ORDER;
})(typeof window !== 'undefined' ? window : global);
