/* 衣装プロンプト工房 / gacha.js
 * Phase 4：部分ガチャ。window.CPW.gacha へ登録する。
 *
 * 補助候補（advisor.suggest）とは役割を分ける。
 *   補助候補 … 現在の設計を理解した「1件単位」の提案
 *   部分ガチャ … 選んだ範囲だけを変える「3案まとめて」のプレビュー
 *
 * 一番大事な約束：採用するまで現在の設計を絶対に変えない。
 * ここが返すのは常に patch と、それを当てた「別物のプレビュー」だけ。
 */
(function (global) {
  'use strict';

  var CPW = global.CPW;
  var D = CPW.data;
  var U = CPW.util;
  var S = CPW.schema;
  var A = CPW.advisor;

  /* ============================================================
   * 乱数
   * テストでは seed を渡すか rng を注入して結果を固定できる。
   * 本番は Math.random。
   * ========================================================== */
  function makeRng(opts) {
    if (opts && typeof opts.rng === 'function') return opts.rng;
    if (opts && opts.seed != null) {
      // mulberry32：小さくて分布が素直な32bit疑似乱数
      var a = (opts.seed >>> 0) || 1;
      return function () {
        a |= 0; a = (a + 0x6D2B79F5) | 0;
        var t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }
    return Math.random;
  }
  function pick(rng, list) { return list[Math.floor(rng() * list.length)]; }
  function shuffled(rng, list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rng() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* ============================================================
   * ガチャ対象
   * ========================================================== */
  var TARGETS = [
    { id: 'garment', labelJa: '基本衣装', paths: ['garment.subtype'] },
    { id: 'collar', labelJa: '襟・胸元', paths: ['parts.collar', 'parts.neckline'] },
    { id: 'sleeves', labelJa: '袖', paths: ['parts.sleeves', 'parts.cuffs'] },
    { id: 'hem', labelJa: '裾', paths: ['parts.hem', 'parts.skirt_shape'] },
    { id: 'handwear', labelJa: '手袋', paths: ['parts.handwear'] },
    { id: 'legwear', labelJa: 'レッグウェア', paths: ['parts.legwear'] },
    { id: 'footwear', labelJa: '靴', paths: ['parts.footwear'] },
    { id: 'materials', labelJa: '素材', paths: ['materials.primary', 'materials.secondary', 'materials.surface', 'materials.transparency'] },
    { id: 'decorations', labelJa: '装飾', paths: ['decorations.items', 'decorations.focalMotif'] },
    { id: 'palette', labelJa: '配色', paths: ['palette.primary', 'palette.secondary', 'palette.accent', 'palette.metal', 'palette.scheme'] },
    { id: 'attribute', labelJa: '属性', paths: ['concept.attribute.id'] },
    { id: 'specialParts', labelJa: '特殊パーツ', paths: ['specialParts.wings', 'specialParts.horns', 'specialParts.halo', 'specialParts.tail'] },
    { id: 'condition', labelJa: '状態・加工', paths: ['condition.items'] }
  ];

  /* ============================================================
   * 維持条件
   * ========================================================== */
  var KEEPS = [
    { id: 'worldview', labelJa: '世界観を維持', paths: ['concept.worldview'] },
    { id: 'primaryStyle', labelJa: '主様式を維持', paths: ['concept.primaryStyle'] },
    { id: 'garment', labelJa: '基本衣装を維持', paths: ['garment.category', 'garment.subtype'] },
    { id: 'theme', labelJa: '主テーマを維持', paths: ['concept.primaryThemeMotif'] },
    { id: 'primaryColor', labelJa: '主色を維持', paths: ['palette.primary'] },
    { id: 'attribute', labelJa: '属性を維持', paths: ['concept.attribute.id'] }
  ];

  function defaultKeeps() { return ['worldview', 'primaryStyle', 'garment']; }

  function keepPaths(keepIds) {
    var out = [];
    (keepIds || []).forEach(function (id) {
      var k = U.byId(KEEPS, id);
      if (k) out = out.concat(k.paths);
    });
    return out;
  }

  /* 維持条件を破っていないか。値が実際に変わったかどうかだけを見る。 */
  function breaksKeeps(before, after, keepIds) {
    return keepPaths(keepIds).some(function (p) {
      return JSON.stringify(U.getPath(before, p)) !== JSON.stringify(U.getPath(after, p));
    });
  }

  /* ============================================================
   * 対象ごとの案の作り方
   * どれも「その範囲のパスに何を入れるか」を返すだけ。
   * ========================================================== */
  function optionsForSlot(slotId) {
    var slot = U.byId(D.partSlots, slotId);
    return slot ? slot : null;
  }

  function rollPatch(o, target, rng, keepIds) {
    var patch = {};

    if (target.id === 'palette') {
      var pool = D.colors.filter(function (c) { return ['gem'].indexOf(c.family) < 0; });
      var metals = D.colors.filter(function (c) { return c.family === 'metal'; });
      var p = {};
      if (keepIds.indexOf('primaryColor') < 0) p.primary = pick(rng, pool).id;
      var base = U.byId(D.colors, p.primary || o.palette.primary);
      if (base && (base.recommendedWith || []).length && rng() < 0.7) {
        p.secondary = pick(rng, base.recommendedWith);
      } else {
        p.secondary = pick(rng, pool).id;
      }
      p.accent = pick(rng, pool).id;
      p.metal = pick(rng, metals).id;
      p.scheme = pick(rng, D.colorSchemes).id;
      return { palette: p };
    }

    if (target.id === 'materials') {
      var wvMats = (D.affinity.worldviewMaterials[o.concept.worldview] || []);
      var mats = wvMats.length && rng() < 0.7
        ? wvMats.map(function (id) { return U.byId(D.materials, id); }).filter(Boolean)
        : D.materials;
      return {
        materials: {
          primary: pick(rng, mats).id,
          secondary: rng() < 0.5 ? pick(rng, D.materials).id : null,
          surface: pick(rng, D.surfaces).id,
          transparency: pick(rng, D.transparency).id
        }
      };
    }

    if (target.id === 'decorations') {
      var avoid = (D.affinity.worldviewAvoid[o.concept.worldview] || []);
      var decos = shuffled(rng, D.decorations.filter(function (d) { return avoid.indexOf(d.id) < 0; }));
      var n = 1 + Math.floor(rng() * 3);
      var items = decos.slice(0, n).map(function (d, i) {
        return {
          type: d.id,
          placements: (d.recommendedPlacements || ['overall']).slice(0, 1 + Math.floor(rng() * 2)),
          role: i === 0 ? 'focal' : 'support',
          size: pick(rng, D.decorationSizes).id,
          quantity: pick(rng, D.decorationQuantities).id
        };
      });
      return { decorations: { items: items, focalMotif: items[0] ? items[0].type : null } };
    }

    if (target.id === 'attribute') {
      if (keepIds.indexOf('attribute') >= 0) return null;
      return { concept: { attribute: { id: pick(rng, D.attributes).id } } };
    }

    if (target.id === 'garment') {
      if (keepIds.indexOf('garment') >= 0) return null;
      var pool2 = D.garments.filter(function (g) { return g.category === o.garment.category; });
      if (!pool2.length) pool2 = D.garments;
      var g = pick(rng, pool2);
      return { garment: { category: g.category, subtype: g.id } };
    }

    if (target.id === 'specialParts') {
      var out = {};
      D.specialParts.slots.forEach(function (slot) {
        if (rng() < 0.45) {
          var v = {};
          slot.axes.forEach(function (a) {
            // 種類は必ず、従属軸は7割の確率で決める（全部埋めると毎回うるさくなる）
            if (a.key === 'type' || rng() < 0.7) v[a.key] = pick(rng, a.options).id;
          });
          var colorOpt = v.color ? U.byId(S.axisOf(slot, 'color').options, v.color) : null;
          if (colorOpt && colorOpt.individual) v.colorId = pick(rng, D.colors).id;
          out[slot.id] = v;
        } else {
          out[slot.id] = {};                 // 付けない
        }
      });
      return { specialParts: out };
    }

    if (target.id === 'condition') {
      /* 状態・加工ガチャ（仕様書§13）。
       * ・血は「状態・加工」を明示的に対象へ選んだこのガチャでだけ候補になり、確率も低く抑える。
       *   他の対象（基本衣装・素材など）はそもそも condition に触れないので、突然血が付くことはない。
       * ・一般的な現代服・ルームウェア・制服では「状態なし」を高確率にする。
       * ・素材の avoidClasses と衝突する種類は最初から候補にしない。
       * ・3件以上は生成しない（最大2件）。性別による重み付けはしない。 */
      var aff = D.conditionAffinity || {};
      var isMer = o.garment.category === 'merfolk';
      var isNoAuto = (aff.noAutoSubtypes || []).indexOf(o.garment.subtype) >= 0;
      var calmWv = ['modern'].indexOf(o.concept.worldview) >= 0 || o.garment.category === 'uniform';
      var roughWv = ['dark_fantasy', 'western_fantasy'].indexOf(o.concept.worldview) >= 0;
      var noneW = isNoAuto ? 0.75 : calmWv ? 0.6 : roughWv ? 0.25 : 0.4;
      if (rng() < noneW) return { condition: { items: [] } };

      var mat = U.byId(D.materials, o.materials.primary);
      var classes = (mat && mat.matClasses) || [];
      var pool = D.conditions.filter(function (c) {
        if (isMer && (aff.merfolkGachaPool || []).indexOf(c.id) < 0) return false;
        if ((c.avoidClasses || []).some(function (cl) { return classes.indexOf(cl) >= 0; })) return false;
        if (c.tags && c.tags.indexOf('cond_blood') >= 0) {
          if (isNoAuto) return false;                    // 夢かわ・ルームウェアに血は出さない
          var hasBlood = (o.condition.items || []).some(function (it) {
            var d = U.byId(D.conditions, it.type);
            return d && d.tags && d.tags.indexOf('cond_blood') >= 0;
          });
          if (!hasBlood && rng() > 0.15) return false;   // 明示対象でも血は低確率
        }
        return true;
      });
      if (!pool.length) return { condition: { items: [] } };

      var placePool = D.conditionPlacements.filter(function (pl) {
        if (pl.wholeGarment) return false;               // 全体は extent 側で表す
        if (isMer) return !pl.legRelated;
        return !pl.merfolkOnly;
      });

      var n = 1 + (rng() < 0.3 ? 1 : 0);                 // 1〜2件。3件目は作らない
      var items = [];
      var used = {};
      for (var ci = 0; ci < n * 6 && items.length < n; ci++) {
        var def = pick(rng, pool);
        if (used[def.id]) continue;
        used[def.id] = true;
        var extent = pick(rng, D.conditionExtents).id;
        var pls = [];
        if (extent !== 'overall') {
          var pp = placePool;
          if (def.tags && def.tags.indexOf('cond_tear') >= 0) {
            // 破れの自動部位は裾・袖・袖口・膝を優先し、胸元・腰は自動では大きく破らない
            pp = placePool.filter(function (pl) { return (aff.tearAutoPlacements || []).indexOf(pl.id) >= 0; });
            if (!pp.length) pp = placePool;
          }
          pls = [pick(rng, pp).id];
        }
        items.push({
          type: def.id, group: def.group,
          severity: pick(rng, D.conditionSeverities).id,
          extent: extent, placements: pls
        });
      }
      return { condition: { items: items } };
    }

    if (target.id === 'legwear') {
      // 人魚カテゴリなど、legwear を持たないカテゴリでは回さない
      var catL = U.byId(D.garmentCategories, o.garment.category);
      if (catL && catL.slots.indexOf('legwear') < 0) return null;
      var slot = optionsForSlot('legwear');
      var n2 = 1 + (rng() < 0.3 ? 1 : 0);
      var picked = shuffled(rng, slot.options).slice(0, n2);
      return {
        parts: {
          legwear: picked.map(function (opt, i) {
            return { id: opt.id, layer: i === 0 ? 'main' : 'outer' };
          })
        }
      };
    }

    if (target.id === 'handwear') {
      var catH = U.byId(D.garmentCategories, o.garment.category);
      if (catH && catH.slots.indexOf('handwear') < 0) return null;
      var hw = optionsForSlot('handwear');
      var axis = function (key) { return S.axisOf(hw, key); };   // 軸は key で引く（id ではない）
      var type = pick(rng, axis('type').options);
      var value = { type: type.id, material: pick(rng, axis('material').options).id, length: pick(rng, axis('length').options).id };
      if ((type.skipAxes || []).indexOf('fingertips') < 0) value.fingertips = pick(rng, axis('fingertips').options).id;
      else value.fingertips = null;
      return { parts: { handwear: value } };
    }

    // 単一スロットの寄せ集め（襟・袖・裾・靴）
    var parts = {};
    var any = false;
    target.paths.forEach(function (p) {
      var slotId = p.replace(/^parts\./, '');
      var slot = optionsForSlot(slotId);
      if (!slot || S.slotKind(slot) !== 'single') return;
      var cat = U.byId(D.garmentCategories, o.garment.category);
      if (cat && cat.slots.indexOf(slotId) < 0) return;      // その衣装に無い部位は振らない
      parts[slotId] = pick(rng, slot.options).id;
      any = true;
    });
    if (!any) return null;
    return { parts: parts };
  }

  /* ============================================================
   * 差分
   * ========================================================== */
  function labelValue(path, value) {
    if (value == null || value === '') return 'なし';
    if (Array.isArray(value)) {
      if (!value.length) return 'なし';
      return value.map(function (v) { return labelValue(path, v); }).join('、');
    }
    if (typeof value === 'object') {
      if (value.id) return labelValue(path, value.id) + (value.layer ? '（' + U.labelOf(D.partLayers, value.layer) + '）' : '');
      if (value.type) return labelValue(path, value.type);
      return JSON.stringify(value);
    }
    var lists = [D.colors, D.materials, D.decorations, D.garments, D.attributes, D.colorSchemes,
      D.transparency, D.surfaces, D.thickness, D.patterns, D.styles, D.motifs,
      D.conditions, D.conditionSeverities, D.conditionExtents, D.conditionPlacements,
      D.specialParts.decorativeChains, D.specialParts.restraintChains, D.specialParts.floating, D.specialParts.magical];
    // 特殊パーツの軸の値
    D.specialParts.slots.forEach(function (sl) { sl.axes.forEach(function (ax) { lists.push(ax.options); }); });
    for (var i = 0; i < lists.length; i++) {
      var hit = U.byId(lists[i], value);
      if (hit) return hit.labelJa;
    }
    var m = path.match(/^parts\.([^.]+)/);
    if (m) {
      var slot = U.byId(D.partSlots, m[1]);
      if (slot && slot.options) {
        var o2 = U.byId(slot.options, value);
        if (o2) return o2.labelJa;
      }
      if (slot && slot.axes) {
        for (var j = 0; j < slot.axes.length; j++) {
          var a = U.byId(slot.axes[j].options, value);
          if (a) return a.labelJa;
        }
      }
    }
    return String(value);
  }

  function diffOf(before, after, target) {
    var out = [];
    target.paths.forEach(function (p) {
      var b = U.getPath(before, p);
      var a = U.getPath(after, p);
      if (JSON.stringify(b) === JSON.stringify(a)) return;
      out.push({
        path: p,
        labelJa: A.pathLabel(p),
        fromJa: labelValue(p, b),
        toJa: labelValue(p, a)
      });
    });
    // 特殊パーツも複合なので軸ごとに見せる
    if (target.id === 'specialParts') {
      out = [];
      D.specialParts.slots.forEach(function (slot) {
        slot.axes.forEach(function (ax) {
          var b = (before.specialParts[slot.id] || {})[ax.key];
          var a = (after.specialParts[slot.id] || {})[ax.key];
          if (b === a) return;
          out.push({
            path: 'specialParts.' + slot.id + '.' + ax.key,
            labelJa: slot.labelJa + 'の' + ax.labelJa,
            fromJa: b ? U.labelOf(ax.options, b) : 'なし',
            toJa: a ? U.labelOf(ax.options, a) : 'なし'
          });
        });
      });
      return out;
    }
    // handwear は複合なので軸ごとに見せる
    if (target.id === 'handwear') {
      out = [];
      var slot = U.byId(D.partSlots, 'handwear');
      slot.axes.forEach(function (ax) {
        var b = (before.parts.handwear || {})[ax.key];
        var a = (after.parts.handwear || {})[ax.key];
        if (b === a) return;
        out.push({
          path: 'parts.handwear.' + ax.key,
          labelJa: '手袋の' + ax.labelJa,
          fromJa: b ? U.labelOf(ax.options, b) : 'なし',
          toJa: a ? U.labelOf(ax.options, a) : 'なし'
        });
      });
    }
    return out;
  }

  /* ============================================================
   * 本体
   * ========================================================== */
  function roll(outfit, opts) {
    opts = opts || {};
    var target = U.byId(TARGETS, opts.target);
    if (!target) return [];
    var keepIds = opts.keeps || defaultKeeps();
    var count = opts.count || 3;
    var rng = makeRng(opts);
    var before = S.normalize(outfit);          // 元の設計。ここから先、絶対に触らない。

    var out = [];
    var seen = {};
    var tries = 0;
    var maxTries = count * 40;

    while (out.length < count && tries < maxTries) {
      tries++;
      var patch = rollPatch(before, target, rng, keepIds);
      if (!patch) break;                        // 維持条件でこの対象自体が振れない

      var preview;
      try { preview = S.applyPatch(before, patch); } catch (e) { continue; }
      if (!preview) continue;

      var diff = diffOf(before, preview, target);
      if (!diff.length) continue;                                   // 現在と同じ案は捨てる
      if (breaksKeeps(before, preview, keepIds)) continue;           // 維持条件を破る案は捨てる

      var issues = A.check(preview);
      if (issues.some(function (i) { return i.severity === 'hard'; })) continue;   // hard競合は捨てる

      var key = JSON.stringify(diff);
      if (seen[key]) continue;                                       // 同じ案は捨てる
      seen[key] = true;

      out.push({
        id: target.id + '_' + out.length,
        targetId: target.id,
        targetLabelJa: target.labelJa,
        patch: patch,
        diff: diff,
        preview: preview,
        issues: issues,
        summary: A.summary(issues)
      });
    }
    return out;
  }

  /* 採用。ここで初めて新しい衣装が返る。呼び出し側が state へ入れるまでは何も起きない。 */
  function apply(outfit, candidate) {
    if (!candidate || !candidate.patch) return S.normalize(outfit);
    return S.applyPatch(outfit, candidate.patch);
  }

  CPW.gacha = {
    TARGETS: TARGETS,
    KEEPS: KEEPS,
    defaultKeeps: defaultKeeps,
    makeRng: makeRng,
    roll: roll,
    apply: apply,
    diffOf: diffOf,
    breaksKeeps: breaksKeeps
  };
})(typeof window !== 'undefined' ? window : global);
