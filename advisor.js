/* 衣装プロンプト工房 / advisor.js
 * Phase 4：競合判定・装飾密度判定・補助候補。window.CPW.advisor へ登録する。
 * app.js は結果を並べるだけで、判断はここに閉じる。
 *
 * 方針
 *   - ルールの中身は data/rules.js に宣言的に置く。ここは「どう調べるか」だけ。
 *   - 判定して終わりにせず、可能なものには patch 付きの修正案を添える。
 *   - 候補はユーザーが押すまで反映しない。ここが返すのは常に patch であって、状態ではない。
 *   - 現在の選択を勝手に上書きしない。埋まっている項目には候補を出さない。
 */
(function (global) {
  'use strict';

  var CPW = global.CPW;
  var D = CPW.data;
  var U = CPW.util;
  var S = CPW.schema;

  /* ============================================================
   * トークン化
   * 設計のあらゆる選択を { path, slotId, id, layer, tags, labelJa } に均す。
   * ルールはトークン同士の衝突だけを見ればよくなる。
   * ========================================================== */
  var SLOT_LAYER = { inner_shirt: 'inner', vest: 'outer', cover_up: 'outer' };

  function tok(path, id, opt, extra) {
    if (!id || !opt) return null;
    var t = {
      path: path,
      id: id,
      labelJa: opt.labelJa || id,
      tags: (opt.tags || []).slice(),
      layer: 'main',
      slotId: null,
      kind: 'field'
    };
    Object.keys(extra || {}).forEach(function (k) { t[k] = extra[k]; });
    return t;
  }

  function tokens(outfit) {
    var o = S.normalize(outfit);
    var out = [];
    var add = function (t) { if (t) out.push(t); };

    /* コンセプト */
    add(tok('concept.worldview', o.concept.worldview, U.byId(D.worldviews, o.concept.worldview)));
    add(tok('concept.era', o.concept.era, U.byId(D.eras, o.concept.era)));
    add(tok('concept.occasion', o.concept.occasion, U.byId(D.occasions, o.concept.occasion)));
    add(tok('concept.season', o.concept.season, U.byId(D.seasons, o.concept.season)));
    add(tok('concept.role', o.concept.role, U.byId(D.roles, o.concept.role)));
    add(tok('concept.primaryStyle', o.concept.primaryStyle, U.byId(D.styles, o.concept.primaryStyle)));
    (o.concept.secondaryStyles || []).forEach(function (id) {
      add(tok('concept.secondaryStyles', id, U.byId(D.styles, id), { multi: true }));
    });
    add(tok('concept.primaryThemeMotif', o.concept.primaryThemeMotif, U.byId(D.motifs, o.concept.primaryThemeMotif)));
    add(tok('concept.attribute.id', o.concept.attribute.id, U.byId(D.attributes, o.concept.attribute.id)));

    /* 基本衣装。層は衣装データが持つ layer に従う。 */
    var g = U.byId(D.garments, o.garment.subtype);
    if (g) add(tok('garment.subtype', g.id, g, { layer: g.layer || 'main', kind: 'garment' }));
    add(tok('garment.category', o.garment.category, U.byId(D.garmentCategories, o.garment.category)));

    /* シルエット */
    Object.keys(D.silhouette).forEach(function (key) {
      add(tok('silhouette.' + key, o.silhouette[key], U.byId(D.silhouette[key], o.silhouette[key])));
    });

    /* 部位 */
    D.partSlots.forEach(function (slot) {
      var v = o.parts[slot.id];
      if (!S.isSlotFilled(slot, v)) return;
      var kind = S.slotKind(slot);
      var baseLayer = SLOT_LAYER[slot.id] || 'main';

      if (kind === 'multi') {
        v.forEach(function (item, i) {
          add(tok('parts.' + slot.id, item.id, U.byId(slot.options, item.id),
            { layer: item.layer || 'main', slotId: slot.id, kind: 'part', index: i }));
        });
        return;
      }
      if (kind === 'composite') {
        var active = S.activeComposite(slot, v);
        if (!active) return;
        slot.axes.forEach(function (a) {
          if (!active[a.key]) return;
          add(tok('parts.' + slot.id + '.' + a.key, active[a.key], U.byId(a.options, active[a.key]),
            { layer: baseLayer, slotId: slot.id, kind: 'part', axis: a.key }));
        });
        return;
      }
      add(tok('parts.' + slot.id, v, U.byId(slot.options, v), { layer: baseLayer, slotId: slot.id, kind: 'part' }));
    });

    /* 素材 */
    ['primary', 'secondary', 'trim'].forEach(function (k) {
      add(tok('materials.' + k, o.materials[k], U.byId(D.materials, o.materials[k]), { kind: 'material' }));
    });
    add(tok('materials.transparency', o.materials.transparency, U.byId(D.transparency, o.materials.transparency)));
    add(tok('materials.surface', o.materials.surface, U.byId(D.surfaces, o.materials.surface)));
    add(tok('materials.thickness', o.materials.thickness, U.byId(D.thickness, o.materials.thickness),
      { tags: o.materials.thickness === 'heavy' ? ['heavy'] : [] }));
    (o.materials.patterns || []).forEach(function (id) {
      add(tok('materials.patterns', id, U.byId(D.patterns, id), { multi: true }));
    });

    /* 装飾 */
    (o.decorations.items || []).forEach(function (item, i) {
      if (!item.type) return;
      add(tok('decorations.items', item.type, U.byId(D.decorations, item.type),
        { kind: 'decoration', index: i, role: item.role, quantity: item.quantity }));
    });
    add(tok('decorations.focalMotif', o.decorations.focalMotif, U.byId(D.decorations, o.decorations.focalMotif)));

    /* 配色 */
    D.colorRoles.forEach(function (r) {
      var c = U.byId(D.colors, o.palette[r.id]);
      if (c) add(tok('palette.' + r.id, c.id, c, { kind: 'color' }));
    });
    add(tok('palette.scheme', o.palette.scheme, U.byId(D.colorSchemes, o.palette.scheme)));

    /* 特殊パーツ。複合スロットは有効なものだけ軸ごとに展開する。
     * 種類未選択なら activeComposite が null を返すので、休止中の値は判定に混ざらない。 */
    var sp = o.specialParts;
    D.specialParts.slots.forEach(function (slot) {
      var active = S.activeComposite(slot, sp[slot.id]);
      if (!active) return;
      slot.axes.forEach(function (a) {
        if (!active[a.key]) return;
        add(tok('specialParts.' + slot.id + '.' + a.key, active[a.key], U.byId(a.options, active[a.key]),
          { kind: 'special', slotId: slot.id, axis: a.key }));
      });
    });
    ['decorativeChains', 'restraintChains', 'floating', 'magical'].forEach(function (k) {
      (sp[k] || []).forEach(function (id) {
        add(tok('specialParts.' + k, id, U.byId(D.specialParts[k], id),
          { kind: 'special', multi: true, narrative: k === 'restraintChains' }));
      });
    });
    return out;
  }

  /* ============================================================
   * 選択子
   * ========================================================== */
  function matches(sel, t) {
    if (!sel) return false;
    if (sel.slots && sel.slots.indexOf(t.slotId) < 0) return false;
    if (sel.paths && sel.paths.indexOf(t.path) < 0) return false;
    var hasTags = sel.tags && sel.tags.length;
    var hasIds = sel.ids && sel.ids.length;
    if (hasTags || hasIds) {
      var byTag = hasTags && sel.tags.some(function (g) { return t.tags.indexOf(g) >= 0; });
      var byId = hasIds && sel.ids.indexOf(t.id) >= 0;
      if (!byTag && !byId) return false;
    }
    return true;
  }

  /* ============================================================
   * 装飾密度
   * 件数ではなく重みで見る。翼やチェーンも背負っている量として数える。
   * ========================================================== */
  function densityReport(outfit) {
    var o = S.normalize(outfit);
    var weight = 0;
    var lines = [];
    var bump = function (w, labelJa) { if (!w) return; weight += w; lines.push({ labelJa: labelJa, weight: w }); };

    (o.decorations.items || []).forEach(function (item) {
      var d = U.byId(D.decorations, item.type);
      if (!d) return;
      var w = d.weight || 1;
      // 数量が「たくさん」なら、その装飾は面として効くので一段重く見る
      if (item.quantity === 'many') w += 1;
      if (item.size === 'large') w += 1;
      bump(w, d.labelJa);
    });
    var sp = o.specialParts;
    D.specialParts.slots.forEach(function (slot) {
      var active = S.activeComposite(slot, sp[slot.id]);
      if (!active) return;
      var typeOpt = U.byId(S.axisOf(slot, 'type').options, active.type);
      var label = typeOpt ? typeOpt.labelJa : slot.labelJa;
      // 大きさに重みがあればそれを使う。無ければ部位1つぶんとして1。
      var sizeAxis = S.axisOf(slot, 'size');
      var sizeOpt = sizeAxis ? U.byId(sizeAxis.options, active.size) : null;
      bump(sizeOpt && sizeOpt.weight ? sizeOpt.weight : 1, label);
    });
    (sp.decorativeChains || []).forEach(function (id) {
      bump(D.specialParts.decorativeChainWeight || 2, U.labelOf(D.specialParts.decorativeChains, id));
    });
    ['floating', 'magical'].forEach(function (k) {
      (sp[k] || []).forEach(function (id) {
        var opt = U.byId(D.specialParts[k], id);
        bump(opt && opt.weight ? opt.weight : 1, opt ? opt.labelJa : id);
      });
    });

    var level = D.decorationDensity[o.decorations.density];
    return {
      levelId: level.id,
      levelJa: level.labelJa,
      level: level.level,
      weight: weight,
      budget: level.budget,          // null は上限なし（最大主義）
      over: level.budget != null && weight > level.budget,
      under: level.budget != null && level.level >= 2 && weight > 0 && weight < Math.max(1, level.budget - 3),
      lines: lines
    };
  }

  /* ============================================================
   * 数え上げ系の判定
   * ルール側はパラメータだけを持ち、調べ方はここ。
   * ========================================================== */
  var CHECKS = {
    primaryMissing: function (o) {
      if (o.palette.primary) return null;
      var others = ['secondary', 'accent', 'metal', 'gem'].filter(function (k) { return !!o.palette[k]; });
      if (!others.length) return null;
      return { involvedPaths: ['palette.primary'].concat(others.map(function (k) { return 'palette.' + k; })) };
    },
    monochromeHues: function (o) {
      if (o.palette.scheme !== 'monochrome') return null;
      var chromatic = D.colorRoles.map(function (r) { return U.byId(D.colors, o.palette[r.id]); })
        .filter(Boolean)
        .filter(function (c) { return ['white', 'black', 'metal'].indexOf(c.family) < 0; });
      var families = {};
      chromatic.forEach(function (c) { families[c.family] = true; });
      if (Object.keys(families).length < 2) return null;
      return {
        involvedPaths: ['palette.scheme'],
        extraJa: '彩りのある色：' + chromatic.map(function (c) { return c.labelJa; }).join('、')
      };
    },
    colorCount: function (o, rule) {
      var used = D.colorRoles.filter(function (r) { return !!o.palette[r.id]; });
      if (used.length < (rule.max || 4)) return null;
      return {
        involvedPaths: used.map(function (r) { return 'palette.' + r.id; }),
        extraJa: '使っている色：' + used.length + '色'
      };
    },
    opposedStyles: function (o, rule) {
      var picked = [o.concept.primaryStyle].concat(o.concept.secondaryStyles || []).filter(Boolean);
      var hit = null;
      (rule.pairs || []).forEach(function (pair) {
        if (hit) return;
        if (picked.indexOf(pair[0]) >= 0 && picked.indexOf(pair[1]) >= 0) hit = pair;
      });
      if (!hit) return null;
      return {
        involvedPaths: ['concept.primaryStyle', 'concept.secondaryStyles'],
        extraJa: U.labelOf(D.styles, hit[0]) + ' と ' + U.labelOf(D.styles, hit[1]),
        resolutions: hit.map(function (id) {
          return { labelJa: U.labelOf(D.styles, id) + ' に寄せる', action: 'setStyleOnly:' + id };
        }).concat([{ labelJa: 'このまま維持する', action: 'ignore' }])
      };
    },
    tooManySecondaryStyles: function (o, rule) {
      if ((o.concept.secondaryStyles || []).length <= (rule.max || 1)) return null;
      return { involvedPaths: ['concept.secondaryStyles'] };
    },
    densityOverload: function (o, rule, ctx) {
      var r = ctx.density;
      if (!r.over) return null;
      return {
        involvedPaths: ['decorations.density', 'decorations.items'],
        messageJa: '装飾密度は「' + r.levelJa + '」ですが、装飾の重みが' + r.weight + 'あります（目安は' + r.budget + 'まで）。密度を上げるか、主役装飾を絞ると安定します。',
        extraJa: r.lines.map(function (l) { return l.labelJa + '（' + l.weight + '）'; }).join('、'),
        resolutions: nextDensity(o, +1).concat([{ labelJa: 'このまま維持する', action: 'ignore' }])
      };
    },
    densityUnderuse: function (o, rule, ctx) {
      var r = ctx.density;
      if (!r.under) return null;
      return {
        involvedPaths: ['decorations.density', 'decorations.items'],
        messageJa: '装飾密度は「' + r.levelJa + '」ですが、装飾の重みは' + r.weight + 'しかありません。装飾を足すか、密度を下げると噛み合います。',
        resolutions: nextDensity(o, -1).concat([{ labelJa: 'このまま維持する', action: 'ignore' }])
      };
    },
    focalOverload: function (o, rule) {
      var focal = (o.decorations.items || []).filter(function (i) { return i.type && i.role === 'focal'; });
      if (focal.length <= (rule.max || 2)) return null;
      return {
        involvedPaths: ['decorations.items'],
        extraJa: '主役：' + focal.map(function (i) { return U.labelOf(D.decorations, i.type); }).join('、')
      };
    },
    focalMotifMissing: function (o, rule, ctx) {
      if (o.decorations.focalMotif) return null;
      if (ctx.density.weight < (rule.minWeight || 4)) return null;
      var first = (o.decorations.items || []).filter(function (i) { return i.type; })[0];
      if (!first) return null;
      return {
        involvedPaths: ['decorations.focalMotif'],
        resolutions: (o.decorations.items || []).filter(function (i) { return i.type; }).slice(0, 3).map(function (i) {
          return { labelJa: U.labelOf(D.decorations, i.type) + ' を主役にする', action: 'setPath:decorations.focalMotif=' + i.type };
        }).concat([{ labelJa: 'このまま維持する', action: 'ignore' }])
      };
    },
    restraintWithoutNarrative: function (o) {
      if (!(o.specialParts.restraintChains || []).length) return null;
      if (o.output.includeNarrative) return null;
      return { involvedPaths: ['specialParts.restraintChains', 'output.includeNarrative'] };
    },
    effectsWithoutAttribute: function (o) {
      if (!o.output.includeEffects) return null;
      if (o.concept.attribute.id) return null;
      return { involvedPaths: ['output.includeEffects', 'concept.attribute.id'] };
    },

    /* ---- 特殊パーツ（Phase 5A） ---- */

    /* 巨大な翼と、背中に置いた大きな装飾 */
    wingsVsBackOrnament: function (o) {
      var w = S.activeComposite(D.specialPartSlot('wings'), o.specialParts.wings);
      if (!w) return null;
      var sizeOpt = U.byId(S.axisOf(D.specialPartSlot('wings'), 'size').options, w.size);
      if (!sizeOpt || (sizeOpt.tags || []).indexOf('back_heavy') < 0) return null;
      var back = (o.decorations.items || []).filter(function (i) {
        return i.type && (i.placements || []).indexOf('back') >= 0 && (i.size === 'large' || i.quantity === 'many');
      });
      if (!back.length) return null;
      return {
        involvedPaths: ['specialParts.wings.size', 'decorations.items'],
        extraJa: '背中の装飾：' + back.map(function (i) { return U.labelOf(D.decorations, i.type); }).join('、'),
        resolutions: [
          { labelJa: '翼を中くらいにする', action: 'setPath:specialParts.wings.size=wing_medium' },
          { labelJa: 'このまま維持する', action: 'ignore' }
        ]
      };
    },

    /* 生物の翼と、機械寄りに振り切った素材 */
    organicWingsVsMechanicalTheme: function (o) {
      var slot = D.specialPartSlot('wings');
      var w = S.activeComposite(slot, o.specialParts.wings);
      if (!w) return null;
      var typeOpt = U.byId(S.axisOf(slot, 'type').options, w.type);
      var texOpt = w.texture ? U.byId(S.axisOf(slot, 'texture').options, w.texture) : null;
      var organic = typeOpt && (typeOpt.tags || []).indexOf('organic') >= 0;
      var organicTex = !texOpt || (texOpt.tags || []).indexOf('organic') >= 0;
      if (!organic || !organicTex) return null;
      var mats = ['primary', 'secondary', 'trim'].map(function (k) { return U.byId(D.materials, o.materials[k]); }).filter(Boolean);
      var mech = mats.filter(function (m) { return (m.tags || []).indexOf('metallic') >= 0 || (m.tags || []).indexOf('rigid') >= 0; });
      if (!mech.length || mech.length < mats.length) return null;    // 全部が機械寄りのときだけ
      return {
        involvedPaths: ['specialParts.wings.type', 'materials.primary'],
        messageJa: '素材がすべて金属・硬質なのに、翼だけ生き物の質感です。混ぜること自体は禁止しませんが、狙いでなければどちらかに寄せると通ります。',
        extraJa: mech.map(function (m) { return m.labelJa; }).join('、'),
        resolutions: [
          { labelJa: '翼を機械の翼にする', action: 'setPath:specialParts.wings.type=mechanical_wings' },
          { labelJa: '翼の質感を金属にする', action: 'setPath:specialParts.wings.texture=wing_metallic' },
          { labelJa: 'このまま維持する（意図的な混成）', action: 'ignore' }
        ]
      };
    },

    /* 光輪と背の高い頭部装飾。背後へ回してあれば競合しない。 */
    haloVsHeadpiece: function (o) {
      var slot = D.specialPartSlot('halo');
      var h = S.activeComposite(slot, o.specialParts.halo);
      if (!h) return null;
      if (h.position === 'halo_behind') return null;         // 背後なら重ならない
      var hw = U.byId((U.byId(D.partSlots, 'headwear') || { options: [] }).options, o.parts.headwear);
      if (!hw || (hw.tags || []).indexOf('head_tall') < 0) return null;
      return {
        involvedPaths: ['specialParts.halo.type', 'parts.headwear'],
        extraJa: U.labelOf(S.axisOf(slot, 'type').options, h.type) + ' × ' + hw.labelJa,
        resolutions: [
          { labelJa: '光輪を背後にする', action: 'setPath:specialParts.halo.position=halo_behind' },
          { labelJa: '頭部装飾を外す', action: 'setPath:parts.headwear=no_headwear' },
          { labelJa: 'このまま維持する', action: 'ignore' }
        ]
      };
    },

    /* 飾り鎖だけあって、他の装飾が無い */
    chainsWithoutAccessories: function (o) {
      if (!(o.specialParts.decorativeChains || []).length) return null;
      var others = (o.decorations.items || []).filter(function (i) { return i.type; });
      if (others.length) return null;
      return { involvedPaths: ['specialParts.decorativeChains', 'decorations.items'] };
    },

    /* 種類未選択のまま従属軸だけ残っている特殊パーツ */
    specialPartDormant: function (o) {
      var dormant = [];
      D.specialParts.slots.forEach(function (slot) {
        var raw = o.specialParts[slot.id];
        if (!raw || !Object.keys(raw).length) return;
        if (S.activeComposite(slot, raw)) return;                   // 種類が選ばれていれば有効
        dormant.push(slot.labelJa);
      });
      if (!dormant.length) return null;
      return {
        involvedPaths: dormant.map(function (x, i) { return 'specialParts'; }).slice(0, 1),
        messageJa: dormant.join('、') + ' は種類が未選択なので、いまは休止中です。設定は残っていますが、出力・完成度・警告には混ざりません。',
        resolutions: []
      };
    },

    /* 主テーマと特殊パーツが同じことを二度言っている */
    themeDuplicatesSpecialPart: function (o) {
      var motif = o.concept.primaryThemeMotif;
      if (!motif) return null;
      var pairs = { angel: ['angel_wings'], fallen_angel: ['fallen_angel_wings'], demon: ['demon_wings'] };
      var want = pairs[motif];
      if (!want) return null;
      var w = S.activeComposite(D.specialPartSlot('wings'), o.specialParts.wings);
      if (!w || want.indexOf(w.type) < 0) return null;
      return {
        involvedPaths: ['concept.primaryThemeMotif', 'specialParts.wings.type'],
        messageJa: '主テーマ「' + U.labelOf(D.motifs, motif) + '」と翼の種類が同じことを指しています。英語でも二重に出るので、どちらかに寄せた方が締まります。',
        resolutions: [
          { labelJa: '主テーマを外す（翼で見せる）', action: 'setPath:concept.primaryThemeMotif=' },
          { labelJa: 'このまま維持する', action: 'ignore' }
        ]
      };
    }
  };

  function nextDensity(o, dir) {
    var i = o.decorations.density + dir;
    if (i < 0 || i > 5) return [];
    var lv = D.decorationDensity[i];
    return [{ labelJa: '密度を「' + lv.labelJa + '」にする', action: 'setPath:decorations.density=' + i }];
  }

  /* ============================================================
   * action → patch
   * ここで patch まで作る。UIは patch を当てるだけ。
   * ========================================================== */
  function clearPatch(t) {
    var o = S.createOutfit();
    if (t.path === 'parts.legwear' || t.multi) return null;   // 配列は個別に組む
    var patch = {};
    U.setPath(patch, t.path, null);
    return patch;
  }

  /* 配列から1件だけ抜く patch */
  function removeFromArray(outfit, t) {
    var patch = {};
    var cur = U.getPath(outfit, t.path) || [];
    var next;
    if (t.path === 'parts.legwear') {
      next = cur.filter(function (item, i) { return i !== t.index; });
    } else {
      next = cur.filter(function (id) { return id !== t.id; });
    }
    U.setPath(patch, t.path, next);
    return patch;
  }

  function removePatch(outfit, t) {
    if (t.multi || t.path === 'parts.legwear' || t.path === 'decorations.items') {
      if (t.path === 'decorations.items') {
        var items = (outfit.decorations.items || []).filter(function (it, i) { return i !== t.index; });
        return { decorations: { items: items } };
      }
      return removeFromArray(outfit, t);
    }
    return clearPatch(t);
  }

  function setPatch(path, value) {
    var patch = {};
    var v = value;
    if (v === '' || v == null) v = null;
    else if (v === 'true') v = true;
    else if (v === 'false') v = false;
    else if (/^-?\d+$/.test(v)) v = parseInt(v, 10);
    U.setPath(patch, path, v);
    return patch;
  }

  function replacePatch(outfit, t, newId) {
    if (t.path === 'parts.legwear') {
      var cur = U.clone(outfit.parts.legwear || []);
      if (cur[t.index]) cur[t.index].id = newId;
      return { parts: { legwear: cur } };
    }
    return setPatch(t.path, newId);
  }

  function moveLayerPatch(outfit, t, layer) {
    if (t.path !== 'parts.legwear') return null;
    var cur = U.clone(outfit.parts.legwear || []);
    if (cur[t.index]) cur[t.index].layer = layer;
    return { parts: { legwear: cur } };
  }

  function buildPatch(outfit, action, left, right) {
    var m;
    if (action === 'ignore') return null;
    if (action === 'keepLeft') return removePatch(outfit, right);
    if (action === 'keepRight') return removePatch(outfit, left);
    if ((m = action.match(/^replaceLeftWith:(.+)$/))) return replacePatch(outfit, left, m[1]);
    if ((m = action.match(/^replaceRightWith:(.+)$/))) return replacePatch(outfit, right, m[1]);
    if ((m = action.match(/^moveRightToLayer:(.+)$/))) return moveLayerPatch(outfit, right, m[1]);
    if ((m = action.match(/^moveLeftToSecondary$/))) {
      if (left.path !== 'materials.primary') return null;
      return { materials: { primary: null, secondary: left.id } };
    }
    if ((m = action.match(/^moveRightToSecondary$/))) {
      if (right.path !== 'materials.primary') return null;
      return { materials: { primary: null, secondary: right.id } };
    }
    if ((m = action.match(/^setPath:([^=]+)=(.*)$/))) return setPatch(m[1], m[2]);
    if ((m = action.match(/^setStyleOnly:(.+)$/))) {
      return { concept: { primaryStyle: m[1], secondaryStyles: [] } };
    }
    return null;
  }

  /* 存在しないIDを指す修正案は出さない */
  function patchIsValid(outfit, patch) {
    if (!patch) return true;
    try {
      var next = S.applyPatch(outfit, patch);
      return !!next;
    } catch (e) { return false; }
  }

  function resolutionsFor(outfit, rule, left, right, override) {
    var src = (override && override.resolutions) || rule.resolutions || [];
    var out = [];
    src.forEach(function (r) {
      var patch = buildPatch(outfit, r.action, left, right);
      if (r.action !== 'ignore' && !patch) return;          // 作れない案は出さない
      if (!patchIsValid(outfit, patch)) return;
      out.push({ labelJa: r.labelJa, action: r.action, patch: patch });
    });
    return out;
  }

  /* ============================================================
   * 判定本体
   * ========================================================== */
  /* 重複判定の単位。
   * 複合パーツは軸ごとにトークンになるので、パスのままだと
   * 「光輪の種類 × 帽子」と「光輪の位置 × 帽子」が別件として2度出てしまう。
   * 特殊パーツはスロット単位でまとめる。レッグウェアなど配列は項目ごとに分ける。 */
  function groupKey(t) {
    if (!t) return '';
    if (t.kind === 'special' && t.slotId) return 'specialParts.' + t.slotId;
    return t.path + (t.index != null ? '#' + t.index : '');
  }
  function issueKey(rule, left, right) {
    return [rule.id, groupKey(left), groupKey(right)].join('|');
  }

  function check(outfit, opts) {
    opts = opts || {};
    var ignored = opts.ignored || [];
    var o = S.normalize(outfit);
    var ts = tokens(o);
    var ctx = { density: densityReport(o) };
    var issues = [];

    D.rules.forEach(function (rule) {
      if (rule.kind === 'pair') {
        var lefts = ts.filter(function (t) { return matches(rule.left, t); });
        var rights = ts.filter(function (t) { return matches(rule.right, t); });
        lefts.forEach(function (l) {
          rights.forEach(function (r) {
            if (l === r) return;
            if (l.path === r.path && l.id === r.id) return;
            if (rule.sameLayerOnly && l.layer !== r.layer) return;   // 別レイヤーは重ね着として認める
            issues.push({
              id: rule.id,
              key: issueKey(rule, l, r),
              severity: rule.severity,
              category: rule.category,
              type: rule.type,
              titleJa: rule.titleJa,
              messageJa: rule.messageJa,
              extraJa: null,
              involvedPaths: [l.path, r.path],
              involvedJa: [l.labelJa, r.labelJa],
              sameLayer: l.layer === r.layer,
              resolutions: resolutionsFor(o, rule, l, r)
            });
          });
        });
        return;
      }
      // kind === 'check'
      var fn = CHECKS[rule.check];
      if (!fn) return;
      var hit = fn(o, rule, ctx);
      if (!hit) return;
      issues.push({
        id: rule.id,
        key: issueKey(rule, null, null),
        severity: rule.severity,
        category: rule.category,
        type: rule.type,
        titleJa: rule.titleJa,
        messageJa: hit.messageJa || rule.messageJa,
        extraJa: hit.extraJa || null,
        involvedPaths: hit.involvedPaths || [],
        involvedJa: (hit.involvedPaths || []).map(function (p) { return pathLabel(p); }),
        sameLayer: true,
        resolutions: resolutionsFor(o, rule, null, null, hit)
      });
    });

    // 同じ内容の重複を落とし、重要度順に並べる
    var seen = {};
    var uniq = issues.filter(function (i) {
      if (seen[i.key]) return false;
      seen[i.key] = true;
      return true;
    });
    var rank = { hard: 0, warning: 1, info: 2 };
    uniq.sort(function (a, b) { return rank[a.severity] - rank[b.severity]; });
    uniq.forEach(function (i) { i.ignored = ignored.indexOf(i.key) >= 0; });
    return uniq;
  }

  function summary(issues) {
    var s = { hard: 0, warning: 0, info: 0, total: 0, ignored: 0 };
    issues.forEach(function (i) {
      if (i.ignored) { s.ignored++; return; }
      s[i.severity]++;
      s.total++;
    });
    return s;
  }

  var PATH_LABELS = {
    'palette.primary': '主色', 'palette.secondary': '副色', 'palette.accent': '差し色',
    'palette.metal': '金属色', 'palette.gem': '宝石色', 'palette.scheme': '配色方式',
    'decorations.density': '装飾密度', 'decorations.items': '装飾', 'decorations.focalMotif': '主役装飾モチーフ',
    'concept.primaryStyle': '主様式', 'concept.secondaryStyles': '副様式', 'concept.occasion': '着用場面',
    'concept.attribute.id': '属性', 'materials.primary': '主素材', 'materials.secondary': '副素材',
    'materials.trim': '装飾素材', 'materials.transparency': '透け感', 'materials.thickness': '厚み',
    'materials.patterns': '柄', 'silhouette.fit': 'シルエットの当たり', 'garment.category': '大分類',
    'specialParts.wings.type': '翼', 'specialParts.horns.type': '角', 'specialParts.halo.type': '光輪',
    'specialParts.tail.type': '尾', 'specialParts.decorativeChains': '装飾チェーン',
    'specialParts.floating': '浮遊装飾', 'specialParts.magical': '魔法的装飾', 'parts.headwear': '頭部装飾',
    'concept.worldview': '世界観', 'concept.primaryThemeMotif': '主テーマ',
    'output.includeNarrative': '出力：雰囲気・物語', 'output.includeEffects': '出力：属性エフェクト',
    'specialParts.restraintChains': '拘束チェーン', 'garment.subtype': '基本衣装'
  };
  function pathLabel(path) {
    if (PATH_LABELS[path]) return PATH_LABELS[path];
    var m = path.match(/^parts\.([^.]+)/);
    if (m) { var s = U.byId(D.partSlots, m[1]); if (s) return s.labelJa; }
    return path;
  }

  /* ============================================================
   * 補助候補
   * ========================================================== */
  var SCORE = {
    recommendedLink: 5,   // データが直接おすすめしている
    worldview: 3,
    style: 3,
    attribute: 3,
    garment: 3,
    palette: 2,
    theme: 2,
    focalMotif: 2,
    fillRecommended: 2,
    warningConflict: -5
  };

  function alreadyUsed(o, path, id) {
    var cur = U.getPath(o, path);
    if (Array.isArray(cur)) {
      return cur.some(function (x) { return x === id || (x && x.id === id) || (x && x.type === id); });
    }
    return cur === id;
  }

  /* 候補を1件ずつ組む。理由は必ず日本語で持たせる。 */
  function cand(o, spec) {
    var reasons = spec.reasons.filter(Boolean);
    return {
      id: spec.path + ':' + spec.valueId,
      kind: spec.kind,
      category: spec.category,
      targetPath: spec.path,
      targetLabelJa: pathLabel(spec.path),
      valueId: spec.valueId,
      labelJa: spec.labelJa,
      promptEn: spec.promptEn || '',
      reasonJa: reasons.join('／'),
      score: spec.score,
      tiebreak: spec.tiebreak || 0,
      patch: spec.patch
    };
  }

  /* その属性が避けたい手ざわりか。avoidTags はデータ側の宣言。 */
  function attrAvoids(ctx, opt) {
    if (!ctx.attr || !opt) return false;
    var tags = opt.tags || [];
    return (ctx.attr.avoidTags || []).some(function (t) { return tags.indexOf(t) >= 0; });
  }

  function colorCandidates(o, ctx) {
    var out = [];
    var attr = ctx.attr;
    var avoid = (D.affinity.worldviewAvoid[o.concept.worldview] || []);
    D.colorRoles.forEach(function (role) {
      if (o.palette[role.id]) return;                       // 埋まっている役割は触らない
      if (role.id === 'gem' && !o.palette.primary) return;
      D.colors.forEach(function (c) {
        if (avoid.indexOf(c.id) >= 0) return;
        var score = 0, reasons = [];
        var primary = U.byId(D.colors, o.palette.primary);
        if (primary && (primary.recommendedWith || []).indexOf(c.id) >= 0) {
          score += SCORE.recommendedLink; reasons.push('主色「' + primary.labelJa + '」に合わせやすい色');
        }
        var attrIdx = attr && ctx.applyTo.colors ? (attr.colors || []).indexOf(c.id) : -1;
        if (attrIdx >= 0) {
          score += SCORE.recommendedLink + SCORE.attribute; reasons.push(attr.labelJa + '属性のおすすめ色');
        }
        if (o.concept.primaryStyle && (c.styles || []).indexOf(o.concept.primaryStyle) >= 0) {
          score += SCORE.style; reasons.push(U.labelOf(D.styles, o.concept.primaryStyle) + 'の色づかい');
        }
        if (role.id === 'metal' && c.family !== 'metal') return;
        if (role.id === 'gem' && c.family !== 'gem') return;
        if ((role.id === 'primary' || role.id === 'secondary' || role.id === 'accent') && (c.family === 'gem')) return;
        if (score <= 0) return;
        out.push(cand(o, {
          kind: 'standard', category: '配色', path: 'palette.' + role.id, valueId: c.id,
          labelJa: c.labelJa, promptEn: c.promptEn, score: score, reasons: reasons,
          tiebreak: attrIdx >= 0 ? (attr.colors.length - attrIdx) : 0,
          patch: setPatch('palette.' + role.id, c.id)
        }));
      });
    });
    return out;
  }

  function materialCandidates(o, ctx) {
    var out = [];
    var attr = ctx.attr;
    var avoid = (D.affinity.worldviewAvoid[o.concept.worldview] || []);
    var wvMats = D.affinity.worldviewMaterials[o.concept.worldview] || [];
    ['secondary', 'trim'].concat(o.materials.primary ? [] : ['primary']).forEach(function (key) {
      if (o.materials[key]) return;
      D.materials.forEach(function (m) {
        if (avoid.indexOf(m.id) >= 0) return;
        if (attrAvoids(ctx, m)) return;                 // 属性が避ける手ざわりは王道に出さない
        var score = 0, reasons = [];
        var mAttrIdx = attr && ctx.applyTo.materials ? (attr.materials || []).indexOf(m.id) : -1;
        if (mAttrIdx >= 0) {
          score += SCORE.recommendedLink + SCORE.attribute; reasons.push(attr.labelJa + '属性のおすすめ素材');
        }
        if (wvMats.indexOf(m.id) >= 0) {
          score += SCORE.worldview; reasons.push(U.labelOf(D.worldviews, o.concept.worldview) + 'に馴染む素材');
        }
        if ((m.recommendedGarments || []).indexOf(o.garment.subtype) >= 0) {
          score += SCORE.garment; reasons.push(U.labelOf(D.garments, o.garment.subtype) + 'によく使われる');
        }
        if ((m.recommendedWorldviews || []).indexOf(o.concept.worldview) >= 0) {
          score += SCORE.recommendedLink; reasons.push('この世界観のおすすめ素材');
        }
        if (score <= 0) return;
        if (o.materials.transparency === 'sheer' && (m.tags || []).indexOf('heavy') >= 0) score += SCORE.warningConflict;
        if (score <= 0) return;
        out.push(cand(o, {
          kind: 'standard', category: '素材', path: 'materials.' + key, valueId: m.id,
          labelJa: m.labelJa, promptEn: m.shortPrompt, score: score, reasons: reasons,
          tiebreak: mAttrIdx >= 0 ? (attr.materials.length - mAttrIdx) : 0,
          patch: setPatch('materials.' + key, m.id)
        }));
      });
    });
    return out;
  }

  function decorationCandidates(o, ctx) {
    var out = [];
    var attr = ctx.attr;
    var avoid = (D.affinity.worldviewAvoid[o.concept.worldview] || []);
    var styleDecos = (D.affinity.styleDecorations[o.concept.primaryStyle] || []);
    var density = densityReport(o);
    D.decorations.forEach(function (d) {
      if (avoid.indexOf(d.id) >= 0) return;
      if (attrAvoids(ctx, d)) return;
      if (alreadyUsed(o, 'decorations.items', d.id)) return;
      var score = 0, reasons = [];
      if (attr && ctx.applyTo.decorations && (d.recommendedAttributes || []).indexOf(attr.id) >= 0) {
        score += SCORE.recommendedLink; reasons.push(attr.labelJa + '属性の装飾');
      }
      if (styleDecos.indexOf(d.id) >= 0) {
        score += SCORE.style; reasons.push(U.labelOf(D.styles, o.concept.primaryStyle) + 'に合う装飾');
      }
      if (o.decorations.focalMotif === d.id) { score += SCORE.focalMotif; reasons.push('主役装飾モチーフと同じ形'); }
      if (score <= 0) return;
      if (density.budget != null && density.weight + (d.weight || 1) > density.budget) {
        score += SCORE.warningConflict;
        reasons.push('※ 装飾密度の目安を超える');
      }
      if (score <= 0) return;
      var items = (o.decorations.items || []).concat([{
        type: d.id, placements: (d.recommendedPlacements || []).slice(0, 2), role: 'support', size: 'medium', quantity: 'few'
      }]);
      out.push(cand(o, {
        kind: 'standard', category: '装飾', path: 'decorations.items', valueId: d.id,
        labelJa: d.labelJa, promptEn: d.shortPrompt, score: score, reasons: reasons,
        patch: { decorations: { items: items } }
      }));
    });
    return out;
  }

  function silhouetteCandidates(o, ctx) {
    var out = [];
    var attr = ctx.attr;
    if (!attr || !ctx.applyTo.silhouette) return out;        // 反映先OFFなら出さない
    Object.keys(D.silhouette).forEach(function (key) {
      if (o.silhouette[key]) return;
      D.silhouette[key].forEach(function (opt) {
        if ((attr.silhouettes || []).indexOf(opt.id) < 0 && (attr.silhouettes || []).indexOf(opt.shortPrompt) < 0) return;
        out.push(cand(o, {
          kind: 'standard', category: 'シルエット', path: 'silhouette.' + key, valueId: opt.id,
          labelJa: opt.labelJa, promptEn: opt.shortPrompt, score: SCORE.attribute,
          reasons: [attr.labelJa + '属性に合うシルエット'],
          patch: setPatch('silhouette.' + key, opt.id)
        }));
      });
    });
    return out;
  }

  function patternCandidates(o, ctx) {
    var out = [];
    var attr = ctx.attr;
    if (!attr || !ctx.applyTo.materials) return out;
    D.patterns.forEach(function (p) {
      if (alreadyUsed(o, 'materials.patterns', p.id)) return;
      if ((attr.decorations || []).indexOf(p.id) < 0 && (attr.materials || []).indexOf(p.id) < 0) return;
      out.push(cand(o, {
        kind: 'standard', category: '素材', path: 'materials.patterns', valueId: p.id,
        labelJa: p.labelJa, promptEn: p.shortPrompt, score: SCORE.attribute,
        reasons: [attr.labelJa + '属性に合う柄'],
        patch: { materials: { patterns: (o.materials.patterns || []).concat([p.id]) } }
      }));
    });
    return out;
  }

  /* 選択肢の手ざわりが、いまの世界観・様式に合うか。
   * これが無いと、現代ミニマルの腰に「飾り帯」を勧めてしまう。 */
  function feelScore(o, opt) {
    var tags = opt.tags || [];
    var score = 0, reasons = [];
    var wv = (D.affinity.worldviewOptionTags || {})[o.concept.worldview];
    var st = (D.affinity.styleOptionTags || {})[o.concept.primaryStyle];
    if (wv) {
      if (tags.some(function (t) { return (wv.bad || []).indexOf(t) >= 0; })) return null;   // 世界観に合わないものは出さない
      if (tags.some(function (t) { return (wv.good || []).indexOf(t) >= 0; })) {
        score += SCORE.worldview; reasons.push(U.labelOf(D.worldviews, o.concept.worldview) + 'に馴染む');
      }
    }
    if (st) {
      if (tags.some(function (t) { return (st.bad || []).indexOf(t) >= 0; })) return null;
      if (tags.some(function (t) { return (st.good || []).indexOf(t) >= 0; })) {
        score += SCORE.style; reasons.push(U.labelOf(D.styles, o.concept.primaryStyle) + 'に合う');
      }
    }
    return { score: score, reasons: reasons };
  }

  /* 属性の反映先がひとつも立っていないなら、属性は何も動かさない。
   * applyTo には主テーマ・様式に当たる軸が無いので、
   * 「全部OFF＝属性を効かせない」という意思表示として扱う。 */
  function attrIsOff(ctx) {
    var a = ctx.applyTo || {};
    return !['colors', 'materials', 'decorations', 'silhouette', 'effects'].some(function (k) { return a[k]; });
  }

  /* 属性が相性のよい主テーマを挙げていれば候補にする。
   * 属性が勝手にテーマを決めるのではなく、あくまで候補として出すだけ。 */
  function motifCandidates(o, ctx) {
    var out = [];
    var attr = ctx.attr;
    if (!attr || attrIsOff(ctx) || o.concept.primaryThemeMotif) return out;
    (attr.motifs || []).forEach(function (id, i) {
      var m = U.byId(D.motifs, id);
      if (!m) return;
      out.push(cand(o, {
        kind: 'standard', category: '主テーマ', path: 'concept.primaryThemeMotif', valueId: id,
        labelJa: m.labelJa, promptEn: m.themeAdjEn || m.shortPrompt, score: SCORE.attribute + SCORE.theme,
        reasons: [attr.labelJa + '属性と相性のよいテーマ'],
        tiebreak: attr.motifs.length - i,
        patch: setPatch('concept.primaryThemeMotif', id)
      }));
    });
    return out;
  }

  /* 属性が挙げる様式。主様式が未設定のときだけ。 */
  function attributeStyleCandidates(o, ctx) {
    var out = [];
    var attr = ctx.attr;
    if (!attr || attrIsOff(ctx) || o.concept.primaryStyle) return out;
    (attr.recommendedStyles || []).forEach(function (id, i) {
      var st = U.byId(D.styles, id);
      if (!st) return;
      out.push(cand(o, {
        kind: 'standard', category: '様式', path: 'concept.primaryStyle', valueId: id,
        labelJa: st.labelJa, promptEn: st.shortPrompt, score: SCORE.attribute + SCORE.style,
        reasons: [attr.labelJa + '属性に合う様式'],
        tiebreak: attr.recommendedStyles.length - i,
        patch: setPatch('concept.primaryStyle', id)
      }));
    });
    return out;
  }

  /* 未設定の recommended を埋める候補 */
  function fillCandidates(o, ctx) {
    var out = [];
    CPW.progress.recommended(o).forEach(function (rec) {
      if (rec.kind === 'slot') {
        var slot = U.byId(D.partSlots, rec.slotId);
        if (!slot || S.slotKind(slot) !== 'single') return;
        var best = null;
        slot.options.forEach(function (opt) {
          if (attrAvoids(ctx, opt)) return;
          var f = feelScore(o, opt);
          if (!f) return;
          var score = SCORE.fillRecommended + f.score;
          var reasons = ['この基本衣装で決めておきたい項目'].concat(f.reasons);
          if (!best || score > best.score) best = { opt: opt, score: score, reasons: reasons };
        });
        if (!best) return;
        out.push(cand(o, {
          kind: 'fill', category: '部位', path: 'parts.' + rec.slotId, valueId: best.opt.id,
          labelJa: best.opt.labelJa, promptEn: best.opt.shortPrompt, score: best.score, reasons: best.reasons,
          patch: setPatch('parts.' + rec.slotId, best.opt.id)
        }));
        return;
      }
      if (rec.path === 'concept.primaryStyle') {
        var styles = D.affinity.worldviewStyles[o.concept.worldview] || [];
        styles.slice(0, 2).forEach(function (id) {
          out.push(cand(o, {
            kind: 'fill', category: '様式', path: 'concept.primaryStyle', valueId: id,
            labelJa: U.labelOf(D.styles, id), promptEn: (U.byId(D.styles, id) || {}).shortPrompt,
            score: SCORE.fillRecommended + SCORE.worldview,
            reasons: [U.labelOf(D.worldviews, o.concept.worldview) + 'の王道'],
            patch: setPatch('concept.primaryStyle', id)
          }));
        });
      }
    });
    return out;
  }

  /* 警告を成立させる代替案 */
  function resolveCandidates(o, ctx) {
    var out = [];
    ctx.issues.filter(function (i) { return i.severity !== 'info' && !i.ignored; }).forEach(function (issue) {
      issue.resolutions.filter(function (r) { return r.patch; }).slice(0, 2).forEach(function (r) {
        out.push({
          id: 'resolve:' + issue.key + ':' + r.action,
          kind: 'resolve', category: issue.category,
          targetPath: issue.involvedPaths[0] || '',
          targetLabelJa: issue.category,
          valueId: r.action,
          labelJa: r.labelJa,
          promptEn: '',
          reasonJa: '警告「' + issue.titleJa + '」を解消できます',
          score: 9,
          patch: r.patch
        });
      });
    });
    return out;
  }

  /* 少し意外：世界観は壊さず、配色・素材・装飾だけ振る */
  function surpriseCandidates(o, ctx) {
    var out = [];
    var avoid = (D.affinity.worldviewAvoid[o.concept.worldview] || []);
    var primary = U.byId(D.colors, o.palette.primary);
    if (!o.palette.accent && primary) {
      D.colors.forEach(function (c) {
        if (avoid.indexOf(c.id) >= 0) return;
        if (c.family === primary.family) return;                 // 同系は「意外」ではない
        if ((primary.recommendedWith || []).indexOf(c.id) >= 0) return;  // それは王道側
        if (c.family === 'metal') return;
        if (['vivid', 'deep', 'bright'].indexOf(c.tone) < 0) return;
        out.push(cand(o, {
          kind: 'surprise', category: '配色', path: 'palette.accent', valueId: c.id,
          labelJa: c.labelJa, promptEn: c.promptEn, score: 4,
          reasons: ['主色「' + primary.labelJa + '」から離した差し色。世界観は変えずに輪郭が締まる'],
          patch: setPatch('palette.accent', c.id)
        }));
      });
    }
    if (!o.materials.trim) {
      D.materials.forEach(function (m) {
        if (avoid.indexOf(m.id) >= 0) return;
        if (m.id === o.materials.primary) return;
        var t = m.tags || [];
        if (!t.some(function (x) { return ['sparkling', 'metallic', 'lustrous', 'glossy'].indexOf(x) >= 0; })) return;
        out.push(cand(o, {
          kind: 'surprise', category: '素材', path: 'materials.trim', valueId: m.id,
          labelJa: m.labelJa, promptEn: m.shortPrompt, score: 3,
          reasons: ['装飾素材だけ質感を変えると、全体を壊さずに目を引く'],
          patch: setPatch('materials.trim', m.id)
        }));
      });
    }
    if (!(o.materials.patterns || []).length) {
      D.patterns.forEach(function (p) {
        if (avoid.indexOf(p.id) >= 0) return;
        out.push(cand(o, {
          kind: 'surprise', category: '柄', path: 'materials.patterns', valueId: p.id,
          labelJa: p.labelJa, promptEn: p.shortPrompt, score: 2,
          reasons: ['柄をひとつ入れるだけで、形を変えずに印象が動く'],
          patch: { materials: { patterns: [p.id] } }
        }));
      });
    }
    return out;
  }

  /* hard競合を生む候補は出さない */
  function introducesHard(o, patch) {
    if (!patch) return false;
    var next;
    try { next = S.applyPatch(o, patch); } catch (e) { return true; }
    return check(next).some(function (i) { return i.severity === 'hard'; });
  }

  function suggest(outfit, opts) {
    opts = opts || {};
    var mode = opts.mode || 'standard';       // standard | surprise | both
    var limit = opts.limit || 6;
    var o = S.normalize(outfit);
    var attr = U.byId(D.attributes, o.concept.attribute.id);
    var ctx = {
      attr: attr,
      applyTo: o.concept.attribute.applyTo || {},
      issues: check(o)
    };

    var pool = [];
    if (mode === 'standard' || mode === 'both') {
      pool = pool.concat(resolveCandidates(o, ctx), fillCandidates(o, ctx),
        colorCandidates(o, ctx), materialCandidates(o, ctx),
        decorationCandidates(o, ctx), silhouetteCandidates(o, ctx), patternCandidates(o, ctx),
        motifCandidates(o, ctx), attributeStyleCandidates(o, ctx));
    }
    if (mode === 'surprise' || mode === 'both') {
      pool = pool.concat(surpriseCandidates(o, ctx));
    }

    // 既に選ばれているもの・hard競合を生むものは除外
    pool = pool.filter(function (c) {
      if (alreadyUsed(o, c.targetPath, c.valueId)) return false;
      if (c.score <= 0) return false;
      return !introducesHard(o, c.patch);
    });

    pool.sort(function (a, b) { return (b.score - a.score) || (b.tiebreak - a.tiebreak); });

    // 同じ値の候補は、いちばん点の高い1件だけ残す。
    // 「真珠色を主色に」「真珠色を副色に」を並べても意味がない。
    var seenValue = {};
    pool = pool.filter(function (c) {
      var k = c.kind + ':' + c.valueId;
      if (seenValue[k]) return false;
      seenValue[k] = true;
      return true;
    });

    // 同じカテゴリばかりにならないよう上限を掛ける。
    // 上限は「見せる件数」を混ぜるための仕組みなので、深く掘るときは比例して伸ばす。
    // そうしないと、点の高い候補が、点の低い新カテゴリに押し出される。
    // 画面の既定（limit 6）では従来どおり2件のまま。
    var cap = D.affinity.categoryLimit || 2;
    var out = [];
    for (var pass = 0; pass < 4 && out.length < limit; pass++) {
      var used = {};
      out = [];
      pool.forEach(function (c) {
        if (out.length >= limit) return;
        used[c.category] = used[c.category] || 0;
        if (used[c.category] >= cap + pass) return;
        used[c.category]++;
        out.push(c);
      });
      if (out.length >= Math.min(limit, pool.length)) break;
    }
    return out;
  }

  /* 候補・修正案の適用。ここでも状態は触らず、新しい衣装を返すだけ。 */
  function apply(outfit, candidateOrResolution) {
    if (!candidateOrResolution || !candidateOrResolution.patch) return S.normalize(outfit);
    return S.applyPatch(outfit, candidateOrResolution.patch);
  }

  CPW.advisor = {
    tokens: tokens,
    check: check,
    summary: summary,
    densityReport: densityReport,
    suggest: suggest,
    apply: apply,
    pathLabel: pathLabel,
    SCORE: SCORE,
    CHECKS: CHECKS
  };
})(typeof window !== 'undefined' ? window : global);
