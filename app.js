/* 衣装プロンプト工房 / app.js
 * Phase 1：データ構造・状態管理・画面遷移・自動保存・基本UI
 *
 * 命名の方針（確定事項）
 *   concept.primaryThemeMotif / secondaryThemeMotifs … 主テーマ / 副テーマ
 *       世界観・配色・素材・候補提案・雰囲気へ広く影響する。
 *   decorations.focalMotif … 主役装飾モチーフ（任意）
 *       衣装上で繰り返す具体的な形・装飾位置・視覚的焦点へ影響する。
 *   この二つはUI表記も内部名も混ぜない。
 */
(function (global) {
  'use strict';

  var CPW = (global.CPW = global.CPW || {});
  var D = CPW.data;

  /* ============================================================
   * util
   * ========================================================== */
  var util = (CPW.util = {
    esc: function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    },
    uid: function (prefix) {
      return (prefix || 'id') + '_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
    },
    nowISO: function () { return new Date().toISOString(); },
    clone: function (o) { return o === undefined ? o : JSON.parse(JSON.stringify(o)); },
    isPlainObject: function (o) { return !!o && typeof o === 'object' && !Array.isArray(o); },
    deepMerge: function (base, patch) {
      var out = util.clone(base);
      if (!util.isPlainObject(patch)) return out;
      Object.keys(patch).forEach(function (k) {
        var v = patch[k];
        if (util.isPlainObject(v) && util.isPlainObject(out[k])) out[k] = util.deepMerge(out[k], v);
        else out[k] = util.clone(v);
      });
      return out;
    },
    getPath: function (obj, path) {
      return path.split('.').reduce(function (o, k) { return o == null ? undefined : o[k]; }, obj);
    },
    setPath: function (obj, path, value) {
      var keys = path.split('.');
      var last = keys.pop();
      var target = keys.reduce(function (o, k) {
        if (!util.isPlainObject(o[k])) o[k] = {};
        return o[k];
      }, obj);
      target[last] = value;
      return obj;
    },
    byId: function (list, id) {
      if (!list || id == null) return null;
      for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
      return null;
    },
    labelOf: function (list, id, fallback) {
      var o = util.byId(list, id);
      return o ? o.labelJa : (fallback === undefined ? '' : fallback);
    },
    debounce: function (fn, ms) {
      var t = null;
      var wrapped = function () {
        var args = arguments, self = this;
        clearTimeout(t);
        t = setTimeout(function () { t = null; fn.apply(self, args); }, ms);
      };
      wrapped.flush = function () { if (t) { clearTimeout(t); t = null; fn(); } };
      wrapped.pending = function () { return t !== null; };
      return wrapped;
    },
    formatDate: function (iso) {
      if (!iso) return '';
      var d = new Date(iso);
      if (isNaN(d.getTime())) return '';
      var p = function (n) { return n < 10 ? '0' + n : String(n); };
      return d.getFullYear() + '/' + p(d.getMonth() + 1) + '/' + p(d.getDate()) + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }
  });

  /* ============================================================
   * schema
   * ========================================================== */
  CPW.SCHEMA_VERSION = '0.1';

  var schema = (CPW.schema = {
    /* Phase 5A：部位スロットIDの snake_case 統一にともなう読み替え表。
     * 保存データのキーなので、消さずに残す。 */
    LEGACY_SLOT_IDS: {
      skirtShape: 'skirt_shape', innerShirt: 'inner_shirt', swimForm: 'swim_form',
      legOpening: 'leg_opening', coverUp: 'cover_up', lingerieForm: 'lingerie_form',
      topStructure: 'top_structure', bottomStructure: 'bottom_structure'
    },

    createOutfit: function () {
      return {
        version: CPW.SCHEMA_VERSION,
        id: util.uid('outfit'),
        name: '',
        createdAt: util.nowISO(),
        updatedAt: util.nowISO(),
        entryMode: null,

        concept: {
          worldview: null,
          era: null,
          occasion: null,
          season: null,
          role: null,
          primaryStyle: null,
          secondaryStyles: [],
          primaryThemeMotif: null,     // 主テーマ
          secondaryThemeMotifs: [],    // 副テーマ
          attribute: {
            id: null,
            intensity: 'standard',
            applyTo: { colors: true, materials: true, decorations: true, silhouette: false, effects: false }
          }
        },

        garment: {
          category: null,
          subtype: null,
          wearRole: 'main_outfit',
          layers: { base: [], inner: [], main: [], outer: [] }
        },

        silhouette: { fit: null, upperVolume: null, lowerVolume: null, waist: null, length: null, symmetry: null },

        // slotId -> string(単一) | [{id, layer}](複数)
        parts: {},

        materials: { primary: null, secondary: null, trim: null, transparency: null, surface: null, thickness: null, patterns: [] },

        decorations: { density: 2, focalMotif: null, items: [] },

        specialParts: { wings: {}, horns: {}, halo: {}, tail: {}, decorativeChains: [], restraintChains: [], floating: [], magical: [] },

        palette: { primary: null, secondary: null, accent: null, metal: null, gem: null, scheme: null },

        presentation: { focus: 'full_outfit', poseAssist: null, compositionAssist: null },

        output: { includeNarrative: false, includeEffects: false, includePresentation: false, includeQualityTags: false, customTags: '' }
      };
    },

    /* スロットの種別
     *   single    … 値は id 文字列
     *   multi     … 値は [{ id, layer }]。layer が違えば重ね着、同じなら重複判定の対象。
     *   composite … 値は軸ごとのオブジェクト（例：手袋の 種類/素材/長さ/指先）
     * data/presets.js は素の文字列で書いてよく、ここで吸収する。 */
    slotKind: function (slot) { return slot.kind || (slot.multi ? 'multi' : 'single'); },

    normalizePartValue: function (slot, value) {
      if (!slot) return null;
      var kind = schema.slotKind(slot);

      if (kind === 'composite') {
        var out = {};
        slot.axes.forEach(function (a) { out[a.key] = null; });
        // 旧い合成IDは新構造へ移す（旧形式は残さない）
        if (typeof value === 'string') value = (slot.legacyMap && slot.legacyMap[value]) || null;
        if (util.isPlainObject(value)) {
          slot.axes.forEach(function (a) {
            if (util.byId(a.options, value[a.key])) out[a.key] = value[a.key];
          });
        }
        return out;
      }

      if (kind === 'multi') {
        var arr = Array.isArray(value) ? value : (value == null ? [] : [value]);
        var layerIds = (D.partLayers || []).map(function (l) { return l.id; });
        return arr.map(function (v) {
          var o = util.isPlainObject(v) ? { id: v.id, layer: v.layer } : { id: v, layer: null };
          if (layerIds.indexOf(o.layer) < 0) o.layer = 'main';
          return o;
        }).filter(function (v) { return !!v.id && util.byId(slot.options, v.id); });
      }

      return util.byId(slot.options, value) ? value : null;
    },

    /* 値が入っているか。複合スロットは requiredAxis（手袋なら「種類」）が要。 */
    isSlotFilled: function (slot, value) {
      var kind = schema.slotKind(slot);
      if (kind === 'multi') return Array.isArray(value) && value.length > 0;
      if (kind === 'composite') return !!(value && value[slot.requiredAxis || 'type']);
      return !!value;
    },

    axisOf: function (slot, key) {
      var found = null;
      (slot.axes || []).forEach(function (a) { if (a.key === key) found = a; });
      return found;
    },

    /* 複合スロットの「いま有効な値」。種類が未選択なら null を返し、
     * 従属軸（素材・長さ・指先）は保持されていても出力・完成度・判定に混ぜない。 */
    activeComposite: function (slot, value) {
      if (!value || !value[slot.requiredAxis || 'type']) return null;
      var reqKey = slot.requiredAxis || 'type';
      var typeOpt = util.byId(schema.axisOf(slot, reqKey).options, value[reqKey]);
      var skip = (typeOpt && typeOpt.skipAxes) || [];
      var out = {};
      slot.axes.forEach(function (a) {
        if (skip.indexOf(a.key) >= 0) return;   // 例：アームウォーマーに指先はない
        if (value[a.key]) out[a.key] = value[a.key];
      });
      return out;
    },

    /* 複合スロットを一つの句の材料へ。Phase 3 の文章生成がこれを受け取る。
     * 一般語と具体語を並べず、必ず一句へ畳める形にする。
     *   { type:'gloves', material:'lace_hand', length:'elbow_length', fingertips:'fingerless' }
     *   → { modifiers:['elbow-length','fingerless','lace'], head:'gloves' }
     *   → Phase 3 で "elbow-length fingerless lace gloves" */
    compositeToPhrase: function (slot, value) {
      var active = schema.activeComposite(slot, value);
      if (!active) return null;
      var order = slot.phraseOrder || ['length', 'fingertips', 'material'];
      var head = null, mods = [];
      var reqKey = slot.requiredAxis || 'type';
      slot.axes.forEach(function (a) {
        var opt = util.byId(a.options, active[a.key]);
        if (!opt || !opt.shortPrompt) return;
        if (a.key === reqKey) head = opt.shortPrompt;
      });
      order.forEach(function (key) {
        var axis = schema.axisOf(slot, key);
        if (!axis) return;
        var opt = util.byId(axis.options, active[key]);
        if (opt && opt.shortPrompt) mods.push(opt.shortPrompt);
      });
      if (!head) return null;
      return { head: head, modifiers: mods };
    },

    /* 欠けたキーを既定値で補い、型を揃える。壊れた保存データでも落ちないようにする。 */
    normalize: function (raw) {
      var base = schema.createOutfit();
      if (!util.isPlainObject(raw)) return base;
      var o = util.deepMerge(base, raw);
      o.id = raw.id || base.id;
      o.name = typeof raw.name === 'string' ? raw.name : '';
      o.version = CPW.SCHEMA_VERSION;

      ['secondaryStyles', 'secondaryThemeMotifs'].forEach(function (k) {
        if (!Array.isArray(o.concept[k])) o.concept[k] = [];
      });
      if (!Array.isArray(o.materials.patterns)) o.materials.patterns = [];
      if (!Array.isArray(o.decorations.items)) o.decorations.items = [];
      var dens = Number(o.decorations.density);
      o.decorations.density = isNaN(dens) ? 2 : Math.min(5, Math.max(0, Math.round(dens)));

      var parts = util.isPlainObject(o.parts) ? o.parts : {};
      var clean = {};
      Object.keys(parts).forEach(function (rawId) {
        // Phase 5A で部位スロットのIDを snake_case へ統一した。
        // 旧IDのまま保存された衣装は、捨てずに読み替える。
        var slotId = schema.LEGACY_SLOT_IDS[rawId] || rawId;
        var slot = util.byId(D.partSlots, slotId);
        if (!slot) return; // 未知のスロットは捨てる
        var v = schema.normalizePartValue(slot, parts[rawId]);
        var kind = schema.slotKind(slot);
        var keep = kind === 'multi' ? v.length > 0
          : kind === 'composite' ? Object.keys(v).some(function (k) { return v[k] != null; })
          : v != null;
        if (keep) clean[slotId] = v;
      });
      o.parts = clean;
      o.specialParts = schema.normalizeSpecialParts(o.specialParts);
      if (typeof o.output.customTags !== 'string') o.output.customTags = '';
      return o;
    },

    /* 特殊パーツの正規化。
     * 翼・角・光輪・尾は複合スロット。Phase 4 までの形（文字列 or {type,size,spread}）も受ける。
     * 未知のIDは捨てるが、種類さえ有効なら従属軸は残す（休止として保持する）。 */
    normalizeSpecialParts: function (raw) {
      var base = { wings: {}, horns: {}, halo: {}, tail: {}, decorativeChains: [], restraintChains: [], floating: [], magical: [] };
      var sp = util.isPlainObject(raw) ? raw : {};

      D.specialParts.slots.forEach(function (slot) {
        base[slot.id] = schema.normalizeSpecialValue(slot, sp[slot.id]);
      });

      ['decorativeChains', 'restraintChains', 'floating', 'magical'].forEach(function (k) {
        var list = Array.isArray(sp[k]) ? sp[k] : [];
        var pool = D.specialParts[k] || [];
        var seen = {};
        base[k] = list.filter(function (id) {
          if (typeof id !== 'string' || seen[id]) return false;
          if (!util.byId(pool, id)) return false;      // 存在しないIDは捨てる
          seen[id] = true;
          return true;
        });
      });
      return base;
    },

    /* 特殊パーツ1件ぶんの値を軸の形へ均す。旧形式は legacyMap で読み替える。 */
    normalizeSpecialValue: function (slot, value) {
      var out = {};
      var apply = function (obj) {
        if (!util.isPlainObject(obj)) return;
        Object.keys(obj).forEach(function (k) {
          if (k === 'colorId') { out.colorId = obj.colorId; return; }
          var axis = schema.axisOf(slot, k);
          if (!axis) return;
          if (obj[k] == null) return;
          if (!util.byId(axis.options, obj[k])) return;   // 未知の値は捨てる
          out[k] = obj[k];
        });
      };
      var legacy = function (id) {
        var m = (slot.legacyMap || {})[id];
        if (m) apply(m);
      };

      if (typeof value === 'string') legacy(value);          // 例：horns: 'small_horns'
      else if (util.isPlainObject(value)) {
        // 旧 {type:'feathered_wings', size:'massive_wings', spread:'wide_open'} を読み替える
        Object.keys(value).forEach(function (k) {
          var v = value[k];
          if (typeof v === 'string' && (slot.legacyMap || {})[v]) legacy(v);
        });
        apply(value);
      }
      // 個別指定でないなら colorId は持たない
      var colorAxis = schema.axisOf(slot, 'color');
      var colorOpt = colorAxis && out.color ? util.byId(colorAxis.options, out.color) : null;
      if (!colorOpt || !colorOpt.individual) delete out.colorId;
      else if (out.colorId && !util.byId(D.colors, out.colorId)) delete out.colorId;
      return out;
    },

    /* いま有効な特殊パーツだけを返す。種類未選択のものは丸ごと出さない。 */
    activeSpecialParts: function (outfit) {
      var out = [];
      D.specialParts.slots.forEach(function (slot) {
        var active = schema.activeComposite(slot, outfit.specialParts[slot.id]);
        if (!active) return;
        out.push({ slot: slot, value: active, raw: outfit.specialParts[slot.id] });
      });
      return out;
    },

    /* 特殊パーツの色を解決する。連動なら衣装側の色を引く。 */
    specialPartColor: function (outfit, slot, value) {
      var axis = schema.axisOf(slot, 'color');
      if (!axis || !value || !value.color) return null;
      var opt = util.byId(axis.options, value.color);
      if (!opt) return null;
      if (opt.individual) {
        var raw = outfit.specialParts[slot.id] || {};
        return util.byId(D.colors, raw.colorId) || null;
      }
      if (opt.linkTo) return util.byId(D.colors, util.getPath(outfit, opt.linkTo)) || null;
      return null;
    },

    /* 保存データ・インポートデータの検証。理由付きで返す。 */
    validate: function (raw) {
      if (!util.isPlainObject(raw)) return { ok: false, reasonJa: 'JSONの形式が違います（オブジェクトではありません）。' };
      if (!raw.concept || !raw.garment) return { ok: false, reasonJa: '衣装データではないようです（concept / garment がありません）。' };
      if (raw.version && String(raw.version).split('.')[0] > String(CPW.SCHEMA_VERSION).split('.')[0]) {
        return { ok: false, reasonJa: 'このアプリより新しい形式のデータです（version ' + util.esc(raw.version) + '）。' };
      }
      return { ok: true };
    },

    /* 旧バージョンの移行。0.1 が初版なので、現状は version 補完と正規化のみ。 */
    migrate: function (raw) {
      var v = schema.validate(raw);
      if (!v.ok) return { ok: false, reasonJa: v.reasonJa };
      var o = schema.normalize(raw);
      var migrated = !raw.version || raw.version !== CPW.SCHEMA_VERSION;
      return { ok: true, outfit: o, migrated: migrated };
    },

    /* プリセット等の部分パッチを適用する。パッチにない項目は保持する。 */
    applyPatch: function (outfit, patch) {
      var merged = util.deepMerge(outfit, patch || {});
      return schema.normalize(merged);
    }
  });

  /* ============================================================
   * progress ── 「基本設計 ○％」
   * 母数は required だけ。recommended は補助候補（Phase 4）へ回し、
   * optional は母数にも不足表示にも入れない。
   * required = 中核フィールド ＋ 基本衣装ごとの requiredSlots / requiredFields
   * ========================================================== */
  var CORE_REQUIRED = [
    { path: 'garment.category', labelJa: '基本衣装の大分類' },
    { path: 'garment.subtype', labelJa: '基本衣装' },
    { path: 'silhouette.fit', labelJa: 'シルエット' },
    { path: 'materials.primary', labelJa: '主素材' },
    { path: 'palette.primary', labelJa: '主色' }
  ];

  var CORE_RECOMMENDED = [
    { path: 'concept.worldview', labelJa: '世界観' },
    { path: 'concept.occasion', labelJa: '着用場面' },
    { path: 'concept.role', labelJa: '役割・身分' },
    { path: 'concept.primaryStyle', labelJa: '主様式' }
  ];

  var FIELD_LABELS = {
    'materials.transparency': '透け感',
    'materials.surface': '光沢',
    'materials.thickness': '厚み',
    'decorations.items': '装飾'
  };

  /* サブタイプの指定が大分類より優先される。どちらにも無ければ空。 */
  function slotPlan(outfit) {
    var cat = util.byId(D.garmentCategories, outfit.garment.category);
    var sub = util.byId(D.garments, outfit.garment.subtype);
    var pick = function (key) {
      if (sub && sub[key]) return sub[key];
      if (cat && cat[key]) return cat[key];
      return [];
    };
    return {
      category: cat,
      requiredSlots: pick('requiredSlots'),
      recommendedSlots: pick('recommendedSlots'),
      requiredFields: pick('requiredFields'),
      recommendedFields: pick('recommendedFields')
    };
  }
  CPW.slotPlan = slotPlan;

  /* スロットの段階（UIの見出し表示に使う） */
  CPW.slotTier = function (outfit, slotId) {
    var plan = slotPlan(outfit);
    if (plan.requiredSlots.indexOf(slotId) >= 0) return 'required';
    if (plan.recommendedSlots.indexOf(slotId) >= 0) return 'recommended';
    return 'optional';
  };

  function fieldFilled(outfit, path) {
    var v = util.getPath(outfit, path);
    if (Array.isArray(v)) return v.length > 0;
    return !!v;
  }

  CPW.progress = {
    compute: function (outfit) {
      var missing = [];
      var total = 0, filled = 0;
      var plan = slotPlan(outfit);

      CORE_REQUIRED.forEach(function (f) {
        total++;
        if (util.getPath(outfit, f.path)) filled++; else missing.push(f.labelJa);
      });

      plan.requiredFields.forEach(function (path) {
        total++;
        if (fieldFilled(outfit, path)) filled++; else missing.push(FIELD_LABELS[path] || path);
      });

      plan.requiredSlots.forEach(function (slotId) {
        var slot = util.byId(D.partSlots, slotId);
        if (!slot) return;
        total++;
        if (schema.isSlotFilled(slot, outfit.parts[slotId])) filled++; else missing.push(slot.labelJa);
      });

      return {
        filled: filled,
        total: total,
        percent: total === 0 ? 0 : Math.round((filled / total) * 100),
        missing: missing
      };
    },

    /* 未設定の recommended。母数には入れず、Phase 4 の補助候補が使う。 */
    recommended: function (outfit) {
      var plan = slotPlan(outfit);
      var out = [];
      CORE_RECOMMENDED.forEach(function (f) {
        if (!util.getPath(outfit, f.path)) out.push({ kind: 'field', path: f.path, labelJa: f.labelJa });
      });
      plan.recommendedFields.forEach(function (path) {
        if (!fieldFilled(outfit, path)) out.push({ kind: 'field', path: path, labelJa: FIELD_LABELS[path] || path });
      });
      plan.recommendedSlots.forEach(function (slotId) {
        var slot = util.byId(D.partSlots, slotId);
        if (!slot) return;
        if (!schema.isSlotFilled(slot, outfit.parts[slotId])) out.push({ kind: 'slot', slotId: slotId, labelJa: slot.labelJa });
      });
      return out;
    }
  };

  /* ============================================================
   * store ── localStorage
   * ========================================================== */
  var DRAFT_KEY = 'cpw:draft:v1';
  var LIB_KEY = 'cpw:library:v1';

  var store = (CPW.store = {
    available: function () {
      try {
        var k = '__cpw_probe__';
        global.localStorage.setItem(k, '1');
        global.localStorage.removeItem(k);
        return true;
      } catch (e) { return false; }
    },
    _read: function (key, fallback) {
      try {
        var raw = global.localStorage.getItem(key);
        if (!raw) return fallback;
        return JSON.parse(raw);
      } catch (e) { return fallback; }
    },
    _write: function (key, value) {
      try { global.localStorage.setItem(key, JSON.stringify(value)); return true; }
      catch (e) { return false; }
    },

    loadDraft: function () {
      var raw = store._read(DRAFT_KEY, null);
      if (!raw) return null;
      var m = schema.migrate(raw);
      return m.ok ? m.outfit : null;
    },
    saveDraft: function (outfit) { return store._write(DRAFT_KEY, outfit); },
    clearDraft: function () { try { global.localStorage.removeItem(DRAFT_KEY); } catch (e) {} },

    listOutfits: function () {
      var lib = store._read(LIB_KEY, []);
      if (!Array.isArray(lib)) return [];
      return lib.map(function (o) { var m = schema.migrate(o); return m.ok ? m.outfit : null; })
        .filter(Boolean)
        .sort(function (a, b) { return String(b.updatedAt).localeCompare(String(a.updatedAt)); });
    },
    getOutfit: function (id) { return util.byId(store.listOutfits(), id); },
    saveOutfit: function (outfit) {
      var lib = store.listOutfits();
      var next = util.clone(outfit);
      next.updatedAt = util.nowISO();
      if (!next.name) next.name = '名称未設定の衣装';
      var idx = -1;
      for (var i = 0; i < lib.length; i++) if (lib[i].id === next.id) idx = i;
      if (idx >= 0) lib[idx] = next; else lib.push(next);
      store._write(LIB_KEY, lib);
      return next;
    },
    duplicateOutfit: function (id) {
      var src = store.getOutfit(id);
      if (!src) return null;
      var copy = util.clone(src);
      copy.id = util.uid('outfit');
      copy.name = (src.name || '名称未設定の衣装') + 'の複製';
      copy.createdAt = util.nowISO();
      copy.updatedAt = util.nowISO();
      return store.saveOutfit(copy);
    },
    removeOutfit: function (id) {
      var lib = store.listOutfits().filter(function (o) { return o.id !== id; });
      return store._write(LIB_KEY, lib);
    },

    exportOutfit: function (outfit) {
      return JSON.stringify({ type: 'cpw-outfit', version: CPW.SCHEMA_VERSION, exportedAt: util.nowISO(), outfit: outfit }, null, 2);
    },
    exportAll: function () {
      return JSON.stringify({ type: 'cpw-library', version: CPW.SCHEMA_VERSION, exportedAt: util.nowISO(), outfits: store.listOutfits() }, null, 2);
    },
    /* 不正なJSONでもアプリを止めず、理由を返す */
    importJSON: function (text) {
      var raw;
      try { raw = JSON.parse(text); }
      catch (e) { return { ok: false, reasonJa: 'JSONとして読めませんでした。ファイルの中身を確認してください。' }; }

      var candidates = [];
      if (util.isPlainObject(raw) && Array.isArray(raw.outfits)) candidates = raw.outfits;
      else if (util.isPlainObject(raw) && util.isPlainObject(raw.outfit)) candidates = [raw.outfit];
      else if (Array.isArray(raw)) candidates = raw;
      else candidates = [raw];

      var imported = [], skipped = 0, firstReason = null;
      candidates.forEach(function (c) {
        var m = schema.migrate(c);
        if (!m.ok) { skipped++; if (!firstReason) firstReason = m.reasonJa; return; }
        m.outfit.id = util.uid('outfit');
        imported.push(store.saveOutfit(m.outfit));
      });
      if (!imported.length) return { ok: false, reasonJa: firstReason || '取り込める衣装データが見つかりませんでした。' };
      return { ok: true, imported: imported.length, skipped: skipped };
    }
  });

  /* ============================================================
   * state
   * ========================================================== */
  var listeners = [];
  var state = (CPW.state = {
    outfit: schema.createOutfit(),
    dirty: false,       // 保存一覧に対して未保存か
    savedId: null,      // 保存一覧に既にある場合のid

    subscribe: function (fn) { listeners.push(fn); return function () { listeners = listeners.filter(function (f) { return f !== fn; }); }; },
    emit: function () { listeners.forEach(function (f) { f(state.outfit); }); },

    load: function (outfit, opts) {
      state.outfit = schema.normalize(outfit);
      state.dirty = !(opts && opts.saved);
      state.savedId = (opts && opts.saved) ? state.outfit.id : null;
      state.emit();
      autosave();
    },
    reset: function () { state.load(schema.createOutfit()); },

    set: function (path, value) {
      util.setPath(state.outfit, path, value);
      state.touch();
    },
    /* 特殊パーツの1スロットを丸ごと差し替える。
     * applyPatch（deepMerge）だと「外した軸」が古い値のまま残ってしまうので、
     * ここだけは置き換えにする。 */
    setSpecialPart: function (slotId, value) {
      var slot = D.specialPartSlot(slotId);
      if (!slot) return;
      state.outfit.specialParts[slotId] = schema.normalizeSpecialValue(slot, value);
      state.touch();
    },
    setPart: function (slotId, value) {
      var slot = util.byId(D.partSlots, slotId);
      if (!slot) return;
      var v = schema.normalizePartValue(slot, value);
      var kind = schema.slotKind(slot);
      var keep = kind === 'multi' ? v.length > 0
        : kind === 'composite' ? Object.keys(v).some(function (k) { return v[k] != null; })
        : v != null;
      if (keep) state.outfit.parts[slotId] = v; else delete state.outfit.parts[slotId];
      state.touch();
    },
    toggleInArray: function (path, value) {
      var arr = util.getPath(state.outfit, path);
      if (!Array.isArray(arr)) arr = [];
      var i = arr.indexOf(value);
      if (i >= 0) arr.splice(i, 1); else arr.push(value);
      util.setPath(state.outfit, path, arr);
      state.touch();
    },
    applyPatch: function (patch) {
      state.outfit = schema.applyPatch(state.outfit, patch);
      state.touch();
    },
    touch: function () {
      state.outfit.updatedAt = util.nowISO();
      state.dirty = true;
      state.emit();
      autosave();
    },
    saveToLibrary: function () {
      var saved = store.saveOutfit(state.outfit);
      state.outfit = saved;
      state.savedId = saved.id;
      state.dirty = false;
      state.emit();
      autosave();
      return saved;
    }
  });

  // 入力のたびに書き込まない。短いdebounceを挟む（20.1）
  var autosave = util.debounce(function () { store.saveDraft(state.outfit); }, 600);
  CPW._autosave = autosave;

  /* ============================================================
   * ちいさなUI部品
   * ========================================================== */
  var ui = (CPW.ui = {
    el: function (tag, attrs, children) {
      var node = document.createElement(tag);
      Object.keys(attrs || {}).forEach(function (k) {
        if (k === 'text') node.textContent = attrs[k];
        else if (k === 'html') node.innerHTML = attrs[k];   // 定型文のみ。利用者入力は必ず text で入れる
        else if (k === 'onclick') node.addEventListener('click', attrs[k]);
        else if (k === 'oninput') node.addEventListener('input', attrs[k]);
        else if (attrs[k] != null && attrs[k] !== false) node.setAttribute(k, attrs[k]);
      });
      (children || []).forEach(function (c) { if (c) node.appendChild(c); });
      return node;
    },
    toast: function (message) {
      var t = document.getElementById('toast');
      if (!t) return;
      t.textContent = message;
      t.classList.add('is-visible');
      clearTimeout(ui._toastTimer);
      ui._toastTimer = setTimeout(function () { t.classList.remove('is-visible'); }, 2200);
    },
    confirm: function (message) { return global.confirm(message); }
  });

  /* ============================================================
   * フィールド定義（コンセプト） ── Phase 2 以降も同じ形で足せる
   * ========================================================== */
  function opts(list) { return function () { return list; }; }

  var CONCEPT_FIELDS = [
    { key: 'concept.worldview', labelJa: '世界観', type: 'single', options: opts(D.worldviews) },
    { key: 'concept.era', labelJa: '時代', type: 'single', optional: true, options: opts(D.eras) },
    { key: 'concept.occasion', labelJa: '着用場面', type: 'single', options: opts(D.occasions) },
    { key: 'concept.season', labelJa: '季節', type: 'single', optional: true, options: opts(D.seasons) },
    { key: 'concept.role', labelJa: '役割・身分', type: 'single', options: opts(D.roles) },
    { key: 'concept.primaryStyle', labelJa: '主様式', type: 'single', options: opts(D.styles) },
    { key: 'concept.secondaryStyles', labelJa: '副様式', type: 'multi', optional: true, options: opts(D.styles), noteJa: '複数選べますが、主様式を一つ決めると輪郭が安定します。' },
    {
      key: 'concept.primaryThemeMotif', labelJa: '主テーマ', type: 'single', optional: true,
      options: opts(D.motifs),
      noteJa: '衣装全体の題材。世界観・配色・素材・候補提案へ広く効く。装飾の形そのものは「主役装飾モチーフ」で指定します。',
      grouped: true
    },
    { key: 'concept.secondaryThemeMotifs', labelJa: '副テーマ', type: 'multi', optional: true, options: opts(D.motifs), grouped: true }
  ];

  var ATTRIBUTE_APPLY = [
    { key: 'colors', labelJa: '配色' },
    { key: 'materials', labelJa: '素材' },
    { key: 'decorations', labelJa: '装飾' },
    { key: 'silhouette', labelJa: 'シルエット' },
    { key: 'effects', labelJa: '魔法的演出' }
  ];

  /* ============================================================
   * フィールド描画
   * ========================================================== */
  function optionLabel(o) { return o.labelJa || o.id; }

  function renderChips(field, container) {
    container.innerHTML = '';
    var value = util.getPath(state.outfit, field.key);
    var list = field.options();

    var groups = [{ id: null, labelJa: null, items: list }];
    if (field.grouped && D.motifGroups && list === D.motifs) {
      groups = D.motifGroups.map(function (g) {
        return { id: g.id, labelJa: g.labelJa, items: list.filter(function (o) { return o.group === g.id; }) };
      });
    }

    groups.forEach(function (g) {
      if (g.labelJa) container.appendChild(ui.el('p', { class: 'chip-group-label', text: g.labelJa }));
      var row = ui.el('div', { class: 'chips' });
      g.items.forEach(function (o) {
        var selected = field.type === 'multi'
          ? (Array.isArray(value) && value.indexOf(o.id) >= 0)
          : value === o.id;
        var btn = ui.el('button', {
          type: 'button', class: 'chip' + (selected ? ' is-selected' : ''),
          'aria-pressed': selected ? 'true' : 'false',
          'data-value': o.id, text: optionLabel(o)
        });
        btn.addEventListener('click', function () {
          if (field.type === 'multi') state.toggleInArray(field.key, o.id);
          else state.set(field.key, selected ? null : o.id);  // 同じものを押すと解除
          renderChips(field, container);
          var again = container.querySelector('[data-value="' + o.id + '"]');
          if (again) again.focus();   // 再描画でフォーカスを飛ばさない
        });
        row.appendChild(btn);
      });
      container.appendChild(row);
    });

    var note = util.byId(list, field.type === 'multi' ? null : value);
    if (note && note.noteJa) container.appendChild(ui.el('p', { class: 'field-note field-note--data', text: note.noteJa }));
  }

  function renderField(field) {
    var wrap = ui.el('div', { class: 'field' });
    var head = ui.el('div', { class: 'field-head' }, [
      ui.el('span', { class: 'field-label', text: field.labelJa }),
      field.optional ? ui.el('span', { class: 'tag-optional', text: '任意' }) : null
    ]);
    wrap.appendChild(head);
    if (field.noteJa) wrap.appendChild(ui.el('p', { class: 'field-note', text: field.noteJa }));
    var body = ui.el('div', { class: 'field-body' });
    renderChips(field, body);
    wrap.appendChild(body);
    return wrap;
  }

  function renderAttributeField() {
    var wrap = ui.el('div', { class: 'field' });
    wrap.appendChild(ui.el('div', { class: 'field-head' }, [
      ui.el('span', { class: 'field-label', text: '属性' }),
      ui.el('span', { class: 'tag-optional', text: '任意' })
    ]));

    var body = ui.el('div', { class: 'field-body' });
    var draw = function () {
      body.innerHTML = '';
      var attr = state.outfit.concept.attribute;

      var row = ui.el('div', { class: 'chips' });
      D.attributes.forEach(function (a) {
        var sel = attr.id === a.id;
        var btn = ui.el('button', {
          type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
          'aria-pressed': sel ? 'true' : 'false', 'data-value': a.id, text: a.labelJa
        });
        btn.addEventListener('click', function () {
          state.set('concept.attribute.id', sel ? null : a.id);
          draw();
          var again = body.querySelector('[data-value="' + a.id + '"]');
          if (again) again.focus();
        });
        row.appendChild(btn);
      });
      body.appendChild(row);

      if (!attr.id) return;

      body.appendChild(ui.el('p', { class: 'field-sub', text: '強度' }));
      var irow = ui.el('div', { class: 'chips' });
      D.attributeIntensities.forEach(function (i) {
        var sel = attr.intensity === i.id;
        var btn = ui.el('button', {
          type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
          'aria-pressed': sel ? 'true' : 'false', 'data-value': i.id, text: i.labelJa
        });
        btn.addEventListener('click', function () { state.set('concept.attribute.intensity', i.id); draw(); var a = body.querySelector('[data-value="' + i.id + '"]'); if (a) a.focus(); });
        irow.appendChild(btn);
      });
      body.appendChild(irow);

      body.appendChild(ui.el('p', { class: 'field-sub', text: '反映先' }));
      body.appendChild(ui.el('p', { class: 'field-note', text: '「魔法的演出」がオフの間は、炎や氷のエフェクトを出力に加えません。' }));
      var trow = ui.el('div', { class: 'switches' });
      ATTRIBUTE_APPLY.forEach(function (t) {
        var on = !!attr.applyTo[t.key];
        var btn = ui.el('button', {
          type: 'button', class: 'switch' + (on ? ' is-on' : ''),
          'aria-pressed': on ? 'true' : 'false', 'data-value': t.key
        }, [
          ui.el('span', { class: 'switch-dot' }),
          ui.el('span', { text: t.labelJa })
        ]);
        btn.addEventListener('click', function () {
          state.set('concept.attribute.applyTo.' + t.key, !on);
          draw();
          var a = body.querySelector('[data-value="' + t.key + '"]');
          if (a) a.focus();
        });
        trow.appendChild(btn);
      });
      body.appendChild(trow);
    };
    draw();
    wrap.appendChild(body);
    return wrap;
  }

  /* ============================================================
   * Phase 2 ── 共通の選択UI
   * ========================================================== */
  function focusBack(scope, fkey) {
    var el = scope.querySelector('[data-fkey="' + fkey + '"]');
    if (el) el.focus();
  }

  /* cfg: { labelJa, noteJa, optional, fkey, items(), get(), set(id, isSelected), multi, hidden } */
  function selectField(cfg) {
    var wrap = ui.el('div', { class: 'field' });
    wrap.appendChild(ui.el('div', { class: 'field-head' }, [
      ui.el('span', { class: 'field-label', text: cfg.labelJa }),
      cfg.optional ? ui.el('span', { class: 'tag-optional', text: '任意' }) : null
    ]));
    if (cfg.noteJa) wrap.appendChild(ui.el('p', { class: 'field-note', text: cfg.noteJa }));
    var body = ui.el('div', { class: 'field-body' });

    function draw() {
      body.innerHTML = '';
      var val = cfg.get();
      var row = ui.el('div', { class: 'chips' });
      cfg.items().forEach(function (o) {
        var sel = cfg.multi ? (Array.isArray(val) && val.indexOf(o.id) >= 0) : val === o.id;
        var key = cfg.fkey + ':' + o.id;
        var b = ui.el('button', {
          type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
          'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: o.labelJa
        });
        b.addEventListener('click', function () { cfg.set(o.id, sel); draw(); focusBack(body, key); });
        row.appendChild(b);
      });
      body.appendChild(row);
    }
    draw();
    wrap.appendChild(body);
    return wrap;
  }

  function stateSelectField(path, labelJa, items, opts_) {
    opts_ = opts_ || {};
    return selectField({
      labelJa: labelJa, noteJa: opts_.noteJa, optional: opts_.optional, multi: opts_.multi,
      fkey: path, items: function () { return items; },
      get: function () { return util.getPath(state.outfit, path); },
      set: function (id, sel) {
        if (opts_.multi) state.toggleInArray(path, id);
        else state.set(path, sel ? null : id);
      }
    });
  }

  /* ---------- 部位スロット ---------- */
  function renderSlotField(slot) {
    var kind = schema.slotKind(slot);
    if (kind === 'composite') return renderCompositeSlot(slot);
    if (kind === 'multi') return renderMultiSlot(slot);
    return selectField({
      labelJa: slot.labelJa, noteJa: slot.noteJa, fkey: 'part:' + slot.id,
      items: function () { return slot.options; },
      get: function () { return state.outfit.parts[slot.id] || null; },
      set: function (id, sel) { state.setPart(slot.id, sel ? null : id); }
    });
  }

  /* 複数選択スロット：選んだものごとに層（内側／主衣装／外側）を指定できる */
  function renderMultiSlot(slot) {
    var wrap = ui.el('div', { class: 'field' });
    wrap.appendChild(ui.el('div', { class: 'field-head' }, [
      ui.el('span', { class: 'field-label', text: slot.labelJa }),
      ui.el('span', { class: 'tag-optional', text: '複数可' })
    ]));
    if (slot.noteJa) wrap.appendChild(ui.el('p', { class: 'field-note', text: slot.noteJa }));
    var body = ui.el('div', { class: 'field-body' });

    function current() { return state.outfit.parts[slot.id] || []; }
    function draw() {
      body.innerHTML = '';
      var val = current();
      var row = ui.el('div', { class: 'chips' });
      slot.options.forEach(function (o) {
        var sel = val.some(function (v) { return v.id === o.id; });
        var key = 'part:' + slot.id + ':' + o.id;
        var b = ui.el('button', {
          type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
          'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: o.labelJa
        });
        b.addEventListener('click', function () {
          var next = current().slice();
          if (sel) next = next.filter(function (v) { return v.id !== o.id; });
          else next.push({ id: o.id, layer: 'main' });
          state.setPart(slot.id, next);
          draw(); focusBack(body, key);
        });
        row.appendChild(b);
      });
      body.appendChild(row);

      if (!val.length) return;
      body.appendChild(ui.el('p', { class: 'field-sub', text: 'どの層に着る？' }));
      val.forEach(function (item) {
        var opt = util.byId(slot.options, item.id);
        var line = ui.el('div', { class: 'layer-line' }, [
          ui.el('span', { class: 'layer-name', text: opt ? opt.labelJa : item.id })
        ]);
        var lrow = ui.el('div', { class: 'chips chips--tight' });
        D.partLayers.forEach(function (L) {
          var on = item.layer === L.id;
          var key = 'layer:' + slot.id + ':' + item.id + ':' + L.id;
          var b = ui.el('button', {
            type: 'button', class: 'chip chip--sm' + (on ? ' is-selected' : ''),
            'aria-pressed': on ? 'true' : 'false', 'data-fkey': key, text: L.labelJa
          });
          b.addEventListener('click', function () {
            var next = current().map(function (v) { return v.id === item.id ? { id: v.id, layer: L.id } : v; });
            state.setPart(slot.id, next);
            draw(); focusBack(body, key);
          });
          lrow.appendChild(b);
        });
        line.appendChild(lrow);
        body.appendChild(line);
      });
      body.appendChild(ui.el('p', { class: 'field-note', text: '同じ層に似たものを重ねると重複として警告するよ（Phase 4）。層を分ければ重ね着として扱う。' }));
    }
    draw();
    wrap.appendChild(body);
    return wrap;
  }

  /* 複合スロット（手袋）：関連する4項目をひとまとまりで見せる */
  function renderCompositeSlot(slot) {
    var wrap = ui.el('div', { class: 'field' });
    wrap.appendChild(ui.el('div', { class: 'field-head' }, [
      ui.el('span', { class: 'field-label', text: slot.labelJa }),
      ui.el('span', { class: 'tag-optional', text: '任意' })
    ]));
    var body = ui.el('div', { class: 'field-body' });
    var reqKey = slot.requiredAxis || 'type';

    function value() {
      var v = state.outfit.parts[slot.id];
      if (!v) { v = {}; slot.axes.forEach(function (a) { v[a.key] = null; }); }
      return v;
    }
    function draw() {
      body.innerHTML = '';
      var val = value();
      var typeOpt = util.byId(schema.axisOf(slot, reqKey).options, val[reqKey]);
      var skip = (typeOpt && typeOpt.skipAxes) || [];

      var group = ui.el('div', { class: 'composite' });
      slot.axes.forEach(function (axis) {
        var dependent = axis.key !== reqKey;
        if (dependent && !val[reqKey]) return;         // 種類が未選択なら従属項目は出さない
        if (dependent && skip.indexOf(axis.key) >= 0) return;

        group.appendChild(ui.el('p', { class: 'field-sub', text: axis.labelJa }));
        if (axis.noteJa) group.appendChild(ui.el('p', { class: 'field-note', text: axis.noteJa }));
        var row = ui.el('div', { class: 'chips' });
        axis.options.forEach(function (o) {
          var sel = val[axis.key] === o.id;
          var key = 'part:' + slot.id + ':' + axis.key + ':' + o.id;
          var b = ui.el('button', {
            type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
            'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: o.labelJa
          });
          b.addEventListener('click', function () {
            var next = util.clone(value());
            next[axis.key] = sel ? null : o.id;
            state.setPart(slot.id, next);
            draw(); focusBack(body, key);
          });
          row.appendChild(b);
        });
        group.appendChild(row);
      });
      body.appendChild(group);

      if (val[reqKey]) {
        var held = slot.axes.filter(function (a) { return a.key !== reqKey && val[a.key]; }).length;
        if (held) body.appendChild(ui.el('p', { class: 'field-note field-note--data', text: '素材・長さ・指先は、出力では一つの句にまとめます。' }));
      } else {
        var dormant = slot.axes.filter(function (a) { return a.key !== reqKey && val[a.key]; })
          .map(function (a) { return util.labelOf(a.options, val[a.key]); });
        if (dormant.length) {
          body.appendChild(ui.el('p', { class: 'field-note field-note--data', text: '休止中：' + dormant.join('・') + '。種類を選び直すと、この指定がそのまま戻ります。出力には含めません。' }));
        }
      }
    }
    draw();
    wrap.appendChild(body);
    return wrap;
  }

  /* ---------- 特殊パーツ・演出（Phase 5A） ----------
   *
   * 画面を長くしないための約束
   *   - 翼・角・光輪・尾を一度に全部展開しない。開いた1つだけ詳細を出す。
   *   - 種類が未選択なら従属項目を畳む（値は残す＝休止）。
   *   - 選んだものはカードで見せて、そこから編集・削除できる。
   *   - 複数追加できるもの（チェーン・浮遊・魔法的）は単一のものと分けて置く。
   */
  var openSpecial = {};   // どの特殊パーツを開いているか（セッション中だけ）

  function buildSpecialSection(panel) {
    function draw() {
      panel.innerHTML = '';

      panel.appendChild(ui.el('p', {
        class: 'p p--note',
        text: '翼・角・光輪・尾は「種類」が要です。種類を選ぶと、その下の項目を編集できます。種類を外すと、指定は残したまま休止し、出力・完成度・警告には含めません。'
      }));

      /* ---- 単一・複合スロット ---- */
      D.specialParts.slots.forEach(function (slot) {
        panel.appendChild(renderSpecialSlot(slot, draw));
      });

      /* ---- 複数追加できるもの ---- */
      panel.appendChild(renderSpecialList({
        key: 'decorativeChains', labelJa: '装飾チェーン',
        noteJa: '衣装の飾りとしての鎖です。「衣装のみ」の出力にも含めます。',
        pool: D.specialParts.decorativeChains
      }, draw));
      panel.appendChild(renderSpecialList({
        key: 'restraintChains', labelJa: '拘束チェーン',
        noteJa: '物語・拘束の演出。出力設定の「物語」がONのときだけ英語に出る。装飾チェーンとは役割が違うので、別項目にしてある。',
        pool: D.specialParts.restraintChains,
        gatedBy: 'includeNarrative'
      }, draw));
      panel.appendChild(renderSpecialList({
        key: 'floating', labelJa: '浮遊装飾',
        noteJa: '身の回りに浮遊する装飾です。光そのものではないため、エフェクトがオフでも出力に含めます。',
        pool: D.specialParts.floating
      }, draw));
      panel.appendChild(renderSpecialList({
        key: 'magical', labelJa: '魔法的装飾',
        noteJa: '衣装に入った術式の意匠。これも装飾なので、エフェクトOFFでも出る。',
        pool: D.specialParts.magical
      }, draw));
    }
    draw();
  }

  /* 複合スロット1つぶん。カード → 開いたときだけ軸を出す。 */
  function renderSpecialSlot(slot, redraw) {
    var reqKey = slot.requiredAxis || 'type';
    var val = state.outfit.specialParts[slot.id] || {};
    var active = schema.activeComposite(slot, val);
    var isOpen = !!openSpecial[slot.id];
    var wrap = ui.el('div', { class: 'sp-item' + (active ? ' is-set' : '') });
    var panelId = 'sp-panel-' + slot.id;

    /* --- 見出し（カード） --- */
    var summaryText;
    if (active) summaryText = specialSummaryJa(slot, active);
    else if (Object.keys(val).length) summaryText = '休止中（種類が未選択）';
    else summaryText = 'なし';

    var head = ui.el('button', {
      type: 'button', class: 'sp-head', 'aria-expanded': isOpen ? 'true' : 'false',
      'aria-controls': panelId, 'data-fkey': 'sp:head:' + slot.id
    }, [
      ui.el('span', { class: 'sp-name', text: slot.labelJa }),
      ui.el('span', { class: 'sp-summary' + (active ? '' : ' is-empty'), text: summaryText }),
      ui.el('span', { class: 'acc-mark', 'aria-hidden': 'true' })
    ]);
    head.addEventListener('click', function () {
      // 開くのは常に1つだけ。全部を一画面に広げない。
      var wasOpen = !!openSpecial[slot.id];
      openSpecial = {};
      if (!wasOpen) openSpecial[slot.id] = true;
      redraw();
      focusBack(document.body, 'sp:head:' + slot.id);
    });
    wrap.appendChild(head);

    var body = ui.el('div', { class: 'sp-body', id: panelId, hidden: isOpen ? null : 'hidden' });
    if (!isOpen) { wrap.appendChild(body); return wrap; }

    /* --- 軸 --- */
    slot.axes.forEach(function (axis) {
      var dependent = axis.key !== reqKey;
      if (dependent && !val[reqKey]) return;          // 種類未選択なら従属項目は畳む

      body.appendChild(ui.el('p', { class: 'field-sub', text: axis.labelJa }));
      if (axis.noteJa && !dependent) body.appendChild(ui.el('p', { class: 'field-note', text: axis.noteJa }));

      var row = ui.el('div', { class: 'chips' });
      axis.options.forEach(function (o) {
        var sel = val[axis.key] === o.id;
        var key = 'sp:' + slot.id + ':' + axis.key + ':' + o.id;
        var b = ui.el('button', {
          type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
          'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: o.labelJa
        });
        b.addEventListener('click', function () {
          var next = util.clone(state.outfit.specialParts[slot.id] || {});
          next[axis.key] = sel ? null : o.id;
          state.setSpecialPart(slot.id, next);
          redraw(); focusBack(document.body, key);
        });
        row.appendChild(b);
      });
      body.appendChild(row);

      /* 色連動は、いま何色になっているかを見せる */
      if (axis.key === 'color' && val.color) {
        var opt = util.byId(axis.options, val.color);
        if (opt && opt.individual) {
          body.appendChild(ui.el('p', { class: 'field-note', text: 'この部位に使う色を選んでください。' }));
          var crow = ui.el('div', { class: 'chips' });
          D.colors.forEach(function (c) {
            var csel = val.colorId === c.id;
            var ckey = 'sp:' + slot.id + ':colorId:' + c.id;
            var cb = ui.el('button', {
              type: 'button', class: 'chip chip--color' + (csel ? ' is-selected' : ''),
              'aria-pressed': csel ? 'true' : 'false', 'data-fkey': ckey
            }, [
              ui.el('span', { class: 'swatch', style: 'background:' + c.hex, 'aria-hidden': 'true' }),
              ui.el('span', { text: c.labelJa })
            ]);
            cb.addEventListener('click', function () {
              var next = util.clone(state.outfit.specialParts[slot.id] || {});
              next.colorId = csel ? null : c.id;
              state.setSpecialPart(slot.id, next);
              redraw(); focusBack(document.body, ckey);
            });
            crow.appendChild(cb);
          });
          body.appendChild(crow);
        }
        var resolved = schema.specialPartColor(state.outfit, slot, active || val);
        if (opt && opt.linkTo) {
          body.appendChild(ui.el('p', {
            class: 'field-note field-note--data',
            text: resolved
              ? '連動中：現在は「' + resolved.labelJa + '」です。衣装側の色を変えると、ここも連動します。'
              : '連動先の色がまだ決まっていません。配色を決めると色が反映されます。'
          }));
        }
      }
    });

    /* --- 状態の説明と操作 --- */
    var held = slot.axes.filter(function (a) { return a.key !== reqKey && val[a.key]; })
      .map(function (a) { return util.labelOf(a.options, val[a.key]); });

    if (val[reqKey]) {
      body.appendChild(ui.el('p', { class: 'field-note field-note--data', text: '出力では一つの句にまとめます。' }));
      var del = ui.el('button', { type: 'button', class: 'btn btn--small btn--ghost', 'data-fkey': 'sp:clear:' + slot.id, text: slot.labelJa + 'を外す' });
      del.addEventListener('click', function () {
        if (!ui.confirm(slot.labelJa + 'の指定をすべて削除します。よろしいですか？ この操作は元に戻せません。')) return;
        state.setSpecialPart(slot.id, {});
        redraw();
      });
      body.appendChild(del);
    } else if (held.length) {
      body.appendChild(ui.el('p', {
        class: 'field-note field-note--data',
        text: '休止中：' + held.join('・') + '。種類を選び直すと、この指定がそのまま戻ります。現在は出力に含めていません。'
      }));
    }

    wrap.appendChild(body);
    return wrap;
  }

  /* 選んでいる中身を日本語一行に畳む（カードの見出し用） */
  function specialSummaryJa(slot, active) {
    var reqKey = slot.requiredAxis || 'type';
    var head = util.labelOf(schema.axisOf(slot, reqKey).options, active[reqKey]);
    var mods = [];
    slot.axes.forEach(function (a) {
      if (a.key === reqKey || a.key === 'color') return;
      if (active[a.key]) mods.push(util.labelOf(a.options, active[a.key]));
    });
    return mods.length ? head + '（' + mods.join('・') + '）' : head;
  }

  /* 複数追加できるもの */
  function renderSpecialList(def, redraw) {
    var list = state.outfit.specialParts[def.key] || [];
    var wrap = ui.el('div', { class: 'field' });
    wrap.appendChild(ui.el('div', { class: 'field-head' }, [
      ui.el('span', { class: 'field-label', text: def.labelJa }),
      ui.el('span', { class: 'tag-optional', text: '複数可' })
    ]));
    if (def.noteJa) wrap.appendChild(ui.el('p', { class: 'field-note', text: def.noteJa }));

    if (def.gatedBy && !state.outfit.output[def.gatedBy] && list.length) {
      wrap.appendChild(ui.el('p', {
        class: 'field-note field-note--warn',
        text: '現在の出力設定では、ここは英語に含めません。含める場合は、出力の「物語」をオンにしてください。'
      }));
    }

    var row = ui.el('div', { class: 'chips' });
    def.pool.forEach(function (o) {
      var sel = list.indexOf(o.id) >= 0;
      var key = 'sp:' + def.key + ':' + o.id;
      var b = ui.el('button', {
        type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
        'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: o.labelJa
      });
      b.addEventListener('click', function () {
        var next = (state.outfit.specialParts[def.key] || []).slice();
        var i = next.indexOf(o.id);
        if (i >= 0) next.splice(i, 1); else next.push(o.id);
        var patch = { specialParts: {} };
        patch.specialParts[def.key] = next;
        state.applyPatch(patch);
        redraw(); focusBack(document.body, key);
      });
      row.appendChild(b);
    });
    wrap.appendChild(row);
    return wrap;
  }

  /* ---------- 2. 衣装構造 ---------- */
  function buildStructureSection(panel) {
    function draw() {
      panel.innerHTML = '';
      var o = state.outfit;

      panel.appendChild(selectField({
        labelJa: '大分類', fkey: 'garment.category',
        noteJa: '選んだ大分類に応じて、下に表示する部位が切り替わります。',
        items: function () { return D.garmentCategories; },
        get: function () { return o.garment.category; },
        set: function (id, sel) {
          if (sel) { state.set('garment.category', null); state.set('garment.subtype', null); }
          else {
            state.set('garment.category', id);
            var sub = util.byId(D.garments, o.garment.subtype);
            if (!sub || sub.category !== id) state.set('garment.subtype', null);
          }
          draw();
        }
      }));

      if (o.garment.category) {
        panel.appendChild(selectField({
          labelJa: '基本衣装', fkey: 'garment.subtype',
          items: function () { return D.garments.filter(function (g) { return g.category === o.garment.category; }); },
          get: function () { return o.garment.subtype; },
          set: function (id, sel) { state.set('garment.subtype', sel ? null : id); }
        }));
        panel.appendChild(stateSelectField('garment.wearRole', '着用役割', D.wearRoles, { optional: true }));
      }

      panel.appendChild(ui.el('p', { class: 'chip-group-label', text: 'シルエット' }));
      panel.appendChild(stateSelectField('silhouette.fit', '全体の沿い方', D.silhouette.fit));
      panel.appendChild(stateSelectField('silhouette.upperVolume', '上半身の量感', D.silhouette.upperVolume, { optional: true }));
      panel.appendChild(stateSelectField('silhouette.lowerVolume', '下半身の量感', D.silhouette.lowerVolume, { optional: true }));
      panel.appendChild(stateSelectField('silhouette.waist', 'ウエスト位置', D.silhouette.waist, { optional: true }));
      panel.appendChild(stateSelectField('silhouette.length', '丈', D.silhouette.length, { optional: true }));
      panel.appendChild(stateSelectField('silhouette.symmetry', '対称性', D.silhouette.symmetry, { optional: true }));

      var cat = util.byId(D.garmentCategories, o.garment.category);
      if (!cat) {
        panel.appendChild(ui.el('p', { class: 'p p--note', text: '大分類を選ぶと、その服に必要な部位のみを表示します。' }));
        return;
      }
      panel.appendChild(ui.el('p', { class: 'chip-group-label', text: '部位（' + cat.labelJa + '）' }));
      cat.slots.forEach(function (slotId) {
        var slot = util.byId(D.partSlots, slotId);
        if (slot) panel.appendChild(renderSlotField(slot));
      });
    }
    draw();
  }

  /* ---------- 3. 素材・装飾 ---------- */
  function buildMaterialSection(panel) {
    var baseMaterials = D.materials.filter(function (m) { return m.category === 'material'; });

    panel.appendChild(ui.el('p', { class: 'chip-group-label', text: '素材・表面' }));
    panel.appendChild(stateSelectField('materials.primary', '主素材', baseMaterials));
    panel.appendChild(stateSelectField('materials.secondary', '副素材', baseMaterials, { optional: true }));
    panel.appendChild(stateSelectField('materials.trim', '装飾素材', D.materials, { optional: true }));
    panel.appendChild(stateSelectField('materials.transparency', '透け感', D.transparency, { optional: true }));
    panel.appendChild(stateSelectField('materials.surface', '光沢', D.surfaces, { optional: true }));
    panel.appendChild(stateSelectField('materials.thickness', '厚み', D.thickness, { optional: true }));
    panel.appendChild(stateSelectField('materials.patterns', '柄', D.patterns, { optional: true, multi: true }));

    panel.appendChild(ui.el('p', { class: 'chip-group-label', text: '装飾' }));
    var decoBody = ui.el('div', {});
    panel.appendChild(decoBody);
    buildDecorations(decoBody);
  }

  function buildDecorations(host) {
    function items() { return state.outfit.decorations.items; }
    function setItems(next) { state.set('decorations.items', next); }
    function weightUsed() {
      return items().reduce(function (sum, it) {
        var d = util.byId(D.decorations, it.type);
        var q = util.byId(D.decorationQuantities, it.quantity);
        var r = util.byId(D.decorationRoles, it.role);
        if (!d) return sum;
        return sum + d.weight * (q ? q.weight : 1) * (r ? r.weightFactor : 1);
      }, 0);
    }

    function draw() {
      host.innerHTML = '';
      var o = state.outfit;

      // 装飾密度
      var dens = ui.el('div', { class: 'field' });
      dens.appendChild(ui.el('div', { class: 'field-head' }, [ui.el('span', { class: 'field-label', text: '装飾密度' })]));
      var drow = ui.el('div', { class: 'chips' });
      D.decorationDensity.forEach(function (d) {
        var sel = o.decorations.density === d.level;
        var key = 'density:' + d.id;
        var b = ui.el('button', {
          type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
          'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: d.labelJa
        });
        b.addEventListener('click', function () { state.set('decorations.density', d.level); draw(); focusBack(host, key); });
        drow.appendChild(b);
      });
      dens.appendChild(drow);
      var budget = D.decorationDensity[o.decorations.density].budget;
      var used = Math.round(weightUsed() * 10) / 10;
      dens.appendChild(ui.el('p', {
        class: 'field-note' + (used > budget ? ' field-note--over' : ''),
        text: '選んだ装飾の量：' + used + ' / この密度の目安：' + budget + (used > budget ? '（目安を超えています）' : '')
      }));
      host.appendChild(dens);

      // 主役装飾モチーフ（任意。装飾があるか、密度が「華やか」以上のときだけ）
      if (items().length > 0 || o.decorations.density >= 3) {
        host.appendChild(selectField({
          labelJa: '主役装飾モチーフ', optional: true, fkey: 'decorations.focalMotif',
          noteJa: '衣装の上で繰り返す具体的な形。コンセプトの「主テーマ」とは別物で、こちらは装飾位置と視覚的な焦点に効く。',
          items: function () { return D.decorations; },
          get: function () { return o.decorations.focalMotif; },
          set: function (id, sel) { state.set('decorations.focalMotif', sel ? null : id); }
        }));
      }

      // 装飾は一件ごとに位置と紐付ける
      var list = ui.el('div', { class: 'field' });
      list.appendChild(ui.el('div', { class: 'field-head' }, [
        ui.el('span', { class: 'field-label', text: '装飾の中身' }),
        ui.el('span', { class: 'tag-optional', text: '一件ずつ' })
      ]));
      list.appendChild(ui.el('p', { class: 'field-note', text: '装飾は一件ごとに「種類」と「位置」を紐付けて登録します。' }));

      items().forEach(function (item, idx) {
        var card = ui.el('div', { class: 'deco-item' });
        var d = util.byId(D.decorations, item.type);
        card.appendChild(ui.el('div', { class: 'deco-head' }, [
          ui.el('span', { class: 'deco-index', text: '装飾 ' + (idx + 1) }),
          ui.el('button', {
            type: 'button', class: 'btn btn--sm btn--danger', text: '外す',
            'data-fkey': 'deco:' + idx + ':remove',
            onclick: function () { setItems(items().filter(function (_, i) { return i !== idx; })); draw(); }
          })
        ]));

        var patch = function (key, v) {
          var next = util.clone(items());
          next[idx][key] = v;
          setItems(next);
        };

        card.appendChild(ui.el('p', { class: 'field-sub', text: '種類' }));
        var trow = ui.el('div', { class: 'chips' });
        D.decorations.forEach(function (opt) {
          var sel = item.type === opt.id;
          var key = 'deco:' + idx + ':type:' + opt.id;
          var b = ui.el('button', {
            type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
            'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: opt.labelJa
          });
          b.addEventListener('click', function () { patch('type', sel ? null : opt.id); draw(); focusBack(host, key); });
          trow.appendChild(b);
        });
        card.appendChild(trow);

        card.appendChild(ui.el('p', { class: 'field-sub', text: '位置（複数可）' }));
        var prow = ui.el('div', { class: 'chips' });
        D.decorationPlacements.forEach(function (pl) {
          var sel = (item.placements || []).indexOf(pl.id) >= 0;
          var key = 'deco:' + idx + ':place:' + pl.id;
          var b = ui.el('button', {
            type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
            'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: pl.labelJa
          });
          b.addEventListener('click', function () {
            var ps = (item.placements || []).slice();
            var i = ps.indexOf(pl.id);
            if (i >= 0) ps.splice(i, 1); else ps.push(pl.id);
            patch('placements', ps); draw(); focusBack(host, key);
          });
          prow.appendChild(b);
        });
        card.appendChild(prow);

        [['role', '役割', D.decorationRoles], ['size', '大きさ', D.decorationSizes], ['quantity', '数量', D.decorationQuantities]].forEach(function (tri) {
          card.appendChild(ui.el('p', { class: 'field-sub', text: tri[1] }));
          var row = ui.el('div', { class: 'chips' });
          tri[2].forEach(function (opt) {
            var sel = item[tri[0]] === opt.id;
            var key = 'deco:' + idx + ':' + tri[0] + ':' + opt.id;
            var b = ui.el('button', {
              type: 'button', class: 'chip' + (sel ? ' is-selected' : ''),
              'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: opt.labelJa
            });
            b.addEventListener('click', function () { patch(tri[0], opt.id); draw(); focusBack(host, key); });
            row.appendChild(b);
          });
          card.appendChild(row);
        });

        if (d && (item.placements || []).length === 0) {
          card.appendChild(ui.el('p', { class: 'field-note', text: '位置が未指定のままでは、どこに付くかが出力に反映されません。' }));
        }
        list.appendChild(card);
      });

      list.appendChild(ui.el('button', {
        type: 'button', class: 'btn btn--sm', text: '＋ 装飾を足す',
        onclick: function () {
          setItems(items().concat([{ type: null, placements: [], role: 'support', size: 'medium', quantity: 'few' }]));
          draw();
        }
      }));
      host.appendChild(list);
    }
    draw();
  }

  /* ---------- 4. 配色 ---------- */
  function buildPaletteSection(panel) {
    var openRole = null;
    var filter = { family: null, tone: null };

    function draw() {
      panel.innerHTML = '';
      var o = state.outfit;

      // ミニプレビュー（面積比）
      var prev = ui.el('div', { class: 'palette-preview' });
      var bar = ui.el('div', { class: 'swatch-row swatch-row--tall' });
      var any = false;
      D.colorRoles.forEach(function (r) {
        var c = util.byId(D.colors, o.palette[r.id]);
        if (!c) return;
        any = true;
        var s = ui.el('span', { class: 'swatch', title: c.labelJa });
        s.style.background = c.hex;
        s.style.flexGrow = String(r.share || 5);
        bar.appendChild(s);
      });
      prev.appendChild(any ? bar : ui.el('p', { class: 'p p--note', text: 'まだ色が決まっていません。主色だけでも出力できます。' }));
      if (any) prev.appendChild(ui.el('p', { class: 'field-note', text: '面積の目安は主色70・副色20・差し色10です。数値の入力は不要です。' }));
      panel.appendChild(prev);

      panel.appendChild(stateSelectField('palette.scheme', '配色方式', D.colorSchemes, { optional: true }));

      D.colorRoles.forEach(function (role) {
        var path = 'palette.' + role.id;
        var c = util.byId(D.colors, o.palette[role.id]);
        var row = ui.el('div', { class: 'color-role' });

        var head = ui.el('div', { class: 'color-role-head' });
        var sw = ui.el('span', { class: 'swatch swatch--dot' });
        if (c) sw.style.background = c.hex; else sw.classList.add('swatch--empty');
        head.appendChild(sw);
        head.appendChild(ui.el('span', { class: 'color-role-name', text: role.labelJa }));
        head.appendChild(ui.el('span', {
          class: 'color-current',
          text: c ? c.labelJa + '（' + c.promptEn + '）' : '未設定'
        }));
        var toggleKey = 'color:' + role.id + ':open';
        head.appendChild(ui.el('button', {
          type: 'button', class: 'btn btn--sm', 'data-fkey': toggleKey,
          'aria-expanded': openRole === role.id ? 'true' : 'false',
          text: openRole === role.id ? '閉じる' : (c ? '変える' : '選ぶ'),
          onclick: function () {
            // 絞り込みは役割ごとに独立させる。前の役割の絞り込みが残ると候補が隠れてしまう。
            openRole = openRole === role.id ? null : role.id;
            filter.family = null; filter.tone = null;
            draw(); focusBack(panel, toggleKey);
          }
        }));
        row.appendChild(head);

        if (c) {
          row.appendChild(ui.el('button', {
            type: 'button', class: 'link-btn', text: 'この色を外す',
            'data-fkey': 'color:' + role.id + ':clear',
            onclick: function () { state.set(path, null); draw(); }
          }));
        }

        if (openRole === role.id) {
          var picker = ui.el('div', { class: 'picker' });

          var frow = ui.el('div', { class: 'chips chips--tight' });
          [{ id: null, labelJa: 'すべて' }].concat(D.colorFamilies).forEach(function (f) {
            var sel = filter.family === f.id;
            var key = 'color:' + role.id + ':family:' + f.id;
            var b = ui.el('button', {
              type: 'button', class: 'chip chip--sm' + (sel ? ' is-selected' : ''),
              'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: f.labelJa
            });
            b.addEventListener('click', function () { filter.family = f.id; draw(); focusBack(panel, key); });
            frow.appendChild(b);
          });
          picker.appendChild(ui.el('p', { class: 'field-sub', text: '色グループ' }));
          picker.appendChild(frow);

          var trow = ui.el('div', { class: 'chips chips--tight' });
          [{ id: null, labelJa: 'すべて' }].concat(D.colorTones).forEach(function (t) {
            var sel = filter.tone === t.id;
            var key = 'color:' + role.id + ':tone:' + t.id;
            var b = ui.el('button', {
              type: 'button', class: 'chip chip--sm' + (sel ? ' is-selected' : ''),
              'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key, text: t.labelJa
            });
            b.addEventListener('click', function () { filter.tone = t.id; draw(); focusBack(panel, key); });
            trow.appendChild(b);
          });
          picker.appendChild(ui.el('p', { class: 'field-sub', text: 'トーン' }));
          picker.appendChild(trow);

          var list = D.colors.filter(function (col) {
            return (!filter.family || col.family === filter.family) && (!filter.tone || col.tone === filter.tone);
          });
          var grid = ui.el('div', { class: 'color-grid' });
          list.forEach(function (col) {
            var sel = o.palette[role.id] === col.id;
            var key = 'color:' + role.id + ':pick:' + col.id;
            var b = ui.el('button', {
              type: 'button', class: 'color-cell' + (sel ? ' is-selected' : ''),
              'aria-pressed': sel ? 'true' : 'false', 'data-fkey': key
            });
            var chip = ui.el('span', { class: 'color-cell-chip' });
            chip.style.background = col.hex;
            b.appendChild(chip);
            b.appendChild(ui.el('span', { class: 'color-cell-ja', text: col.labelJa }));
            b.appendChild(ui.el('span', { class: 'color-cell-en', text: col.promptEn }));
            b.addEventListener('click', function () {
              state.set(path, sel ? null : col.id);
              draw(); focusBack(panel, key);
            });
            grid.appendChild(b);
          });
          if (!list.length) picker.appendChild(ui.el('p', { class: 'p p--note', text: 'この絞り込みに合う色はありません。' }));
          picker.appendChild(grid);

          // おすすめ配色（主色から）
          var base = util.byId(D.colors, o.palette.primary);
          if (base && role.id !== 'primary' && base.recommendedWith.length) {
            picker.appendChild(ui.el('p', { class: 'field-sub', text: '主色「' + base.labelJa + '」に合わせやすい色' }));
            var rrow = ui.el('div', { class: 'chips chips--tight' });
            base.recommendedWith.forEach(function (id) {
              var rc = util.byId(D.colors, id);
              if (!rc) return;
              var key = 'color:' + role.id + ':rec:' + id;
              var b = ui.el('button', { type: 'button', class: 'chip chip--sm', 'data-fkey': key, text: rc.labelJa });
              b.addEventListener('click', function () { state.set(path, id); draw(); focusBack(panel, key); });
              rrow.appendChild(b);
            });
            picker.appendChild(rrow);
          }
          row.appendChild(picker);
        }
        panel.appendChild(row);
      });
    }
    draw();
  }

  /* ============================================================
   * 画面
   * ========================================================== */
  var routes = {};
  var appRoot = null;

  function screen(title, nodes, opts_) {
    var s = ui.el('section', { class: 'screen' });
    (nodes || []).forEach(function (n) { if (n) s.appendChild(n); });
    return s;
  }

  /* 戻る導線。行き先を明示した、押せるナビゲーションボタン。
   * 「トップ」のような曖昧な呼び方はせず、実際の戻り先を書く。
   * sticky で画面上部に留まり、長くスクロールした後でも戻れる。 */
  function backBar(label, href, extra) {
    var bar = ui.el('div', { class: 'topnav' }, [
      ui.el('a', { class: 'back-btn', href: href, 'aria-label': label, text: '← ' + label })
    ]);
    if (extra) bar.appendChild(extra);
    return bar;
  }

  /* ---------- トップ ---------- */
  routes[''] = function () {
    var draft = store.loadDraft();
    var lib = store.listOutfits();

    return screen('', [
      ui.el('header', { class: 'hero' }, [
        ui.el('p', { class: 'hero-eyebrow', text: 'Costume Prompt Workshop' }),
        ui.el('h1', { class: 'hero-title', text: '衣装プロンプト工房' }),
        ui.el('p', { class: 'hero-sub', text: 'パーツを組み合わせて、一着の英語プロンプトを仕立てる。' })
      ]),
      ui.el('div', { class: 'stack' }, [
        ui.el('a', { class: 'btn btn--primary', href: '#/entry', text: '新しい衣装を設計する' }),
        draft ? ui.el('a', { class: 'btn', href: '#/workshop', text: '前回の続き' + (draft.name ? '（' + draft.name + '）' : '') }) : null,
        ui.el('a', { class: 'btn', href: '#/library', text: '保存した衣装（' + lib.length + '）' })
      ]),
      ui.el('div', { class: 'card' }, [
        ui.el('h2', { class: 'card-title', text: 'この工房でできること' }),
        ui.el('ul', { class: 'list' }, [
          ui.el('li', { text: '服の形・部位・素材・装飾・配色を選んで一着に組み立てる' }),
          ui.el('li', { text: '矛盾や盛りすぎを知らせる（Phase 4）' }),
          ui.el('li', { text: '短縮版と詳細版の英語プロンプトを書き出す（Phase 3）' })
        ])
      ]),
      ui.el('div', { class: 'card card--quiet' }, [
        ui.el('h2', { class: 'card-title', text: '保存について' }),
        ui.el('p', { class: 'p', text: '設計はこの端末のブラウザ内にのみ保存されます。閲覧履歴やサイトデータを消すと設計も消えるため、大切な一着はJSONで書き出して保管してください。' }),
        store.available() ? null : ui.el('p', { class: 'p p--warn', text: 'このブラウザでは端末内保存が無効になっています。設計は保存されません。' })
      ])
    ]);
  };

  /* ---------- 開始方法 ---------- */
  var ENTRY_MODES = [
    { id: 'zero', labelJa: 'ゼロから設計', descJa: '何も選ばず、空の設計台から始めます。' },
    { id: 'worldview', labelJa: '世界観から設計', descJa: '世界観を起点に、相性の良い候補を優先表示します。' },
    { id: 'garment', labelJa: '基本衣装から設計', descJa: 'ドレス、制服、水着など、服の形を起点にします。' },
    { id: 'preset', labelJa: 'プリセットから設計', descJa: '整合の取れた初期値を読み込みます。読み込み後もすべて変更できます。' },
    { id: 'motif', labelJa: 'モチーフから設計', descJa: '童話・星座・神話・属性など、題材を起点にします。' }
  ];

  routes['/entry'] = function () {
    var cards = ENTRY_MODES.map(function (m) {
      return ui.el('a', { class: 'card card--tap', href: '#/setup/' + m.id }, [
        ui.el('h2', { class: 'card-title', text: m.labelJa }),
        ui.el('p', { class: 'p', text: m.descJa })
      ]);
    });
    return screen('', [
      backBar('開始画面へ戻る', '#/'),
      ui.el('h1', { class: 'page-title', text: '何から始める？' }),
      ui.el('p', { class: 'p p--lead', text: 'ここで選んだ内容を初期値として設計台に反映します。すべての項目は後から変更できます。' }),
      ui.el('div', { class: 'stack' }, cards)
    ]);
  };

  /* ---------- 初期設定 ---------- */
  routes['/setup'] = function (params) {
    var mode = params[0] || 'zero';
    var body = ui.el('div', { class: 'stack' });
    var draft = schema.createOutfit();
    draft.entryMode = mode;

    var start = function (patch) {
      var o = schema.applyPatch(draft, patch || {});
      o.entryMode = mode;
      state.load(o);
      location.hash = '#/workshop';
    };

    if (mode === 'zero') {
      body.appendChild(ui.el('p', { class: 'p p--lead', text: '何も選ばず、空の設計台を開きます。どの項目からでも編集できます。' }));
      body.appendChild(ui.el('button', { class: 'btn btn--primary', type: 'button', onclick: function () { start(); }, text: '設計台をひらく' }));
    }

    if (mode === 'worldview') {
      body.appendChild(ui.el('p', { class: 'p p--lead', text: '世界観を一つ選ぶと、相性の良い候補を優先して表示します。' }));
      D.worldviews.forEach(function (w) {
        body.appendChild(ui.el('button', {
          class: 'card card--tap', type: 'button',
          onclick: function () { start({ concept: { worldview: w.id } }); }
        }, [ui.el('h2', { class: 'card-title', text: w.labelJa })]));
      });
    }

    if (mode === 'garment') {
      body.appendChild(ui.el('p', { class: 'p p--lead', text: '服の形から始めます。選んだ大分類に応じて、設計台に表示する部位が切り替わります。' }));
      D.garmentCategories.forEach(function (c) {
        var subs = D.garments.filter(function (g) { return g.category === c.id; });
        var card = ui.el('div', { class: 'card' }, [ui.el('h2', { class: 'card-title', text: c.labelJa })]);
        var row = ui.el('div', { class: 'chips' });
        subs.forEach(function (g) {
          row.appendChild(ui.el('button', {
            class: 'chip', type: 'button', text: g.labelJa,
            onclick: function () { start({ garment: { category: c.id, subtype: g.id } }); }
          }));
        });
        card.appendChild(row);
        body.appendChild(card);
      });
    }

    if (mode === 'preset') {
      body.appendChild(ui.el('p', { class: 'p p--lead', text: '整合の取れた初期値をまとめて読み込みます。読み込み後もすべて変更できます。' }));
      D.presetGroups.forEach(function (g) {
        body.appendChild(ui.el('p', { class: 'chip-group-label', text: g.labelJa }));
        D.presets.filter(function (p) { return p.group === g.id; }).forEach(function (p) {
          body.appendChild(ui.el('button', {
            class: 'card card--tap', type: 'button',
            onclick: function () { start(util.deepMerge(p.patch, { name: p.labelJa })); }
          }, [
            ui.el('h2', { class: 'card-title', text: p.labelJa }),
            ui.el('p', { class: 'p', text: p.summaryJa })
          ]));
        });
      });
    }

    if (mode === 'motif') {
      body.appendChild(ui.el('p', { class: 'p p--lead', text: '題材を一つ選んで主テーマに設定します。副テーマは設計台で追加できます。' }));
      body.appendChild(ui.el('p', { class: 'p p--note', text: '神話や文化の意匠は、断定的な再現ではなく創作衣装のための着想として扱っています。' }));
      D.motifGroups.forEach(function (g) {
        body.appendChild(ui.el('p', { class: 'chip-group-label', text: g.labelJa }));
        var row = ui.el('div', { class: 'chips' });
        D.motifs.filter(function (m) { return m.group === g.id; }).forEach(function (m) {
          row.appendChild(ui.el('button', {
            class: 'chip', type: 'button', text: m.labelJa,
            onclick: function () { start({ concept: { primaryThemeMotif: m.id } }); }
          }));
        });
        body.appendChild(row);
      });
      body.appendChild(ui.el('p', { class: 'chip-group-label', text: '属性' }));
      var arow = ui.el('div', { class: 'chips' });
      D.attributes.forEach(function (a) {
        arow.appendChild(ui.el('button', {
          class: 'chip', type: 'button', text: a.labelJa,
          onclick: function () { start({ concept: { attribute: { id: a.id } } }); }
        }));
      });
      body.appendChild(arow);
    }

    var mode_ = util.byId(ENTRY_MODES, mode);
    return screen('', [
      backBar('開始方法へ戻る', '#/entry'),
      ui.el('h1', { class: 'page-title', text: mode_ ? mode_.labelJa : '初期設定' }),
      body
    ]);
  };

  /* ---------- 設計台 ---------- */
  var SECTIONS = [
    { id: 'concept', labelJa: 'コンセプト', phase: 1 },
    { id: 'structure', labelJa: '衣装構造', phase: 2 },
    { id: 'material', labelJa: '素材・装飾', phase: 2 },
    { id: 'palette', labelJa: '配色', phase: 2 },
    { id: 'special', labelJa: '特殊パーツ・演出', phase: 5 }
  ];

  var openSections = { concept: true };

  function refreshHeader() {
    var root = document.getElementById('workshop-header');
    if (!root) return;
    root.innerHTML = '';
    root.appendChild(buildHeaderInner());
  }

  function buildHeaderInner() {
    var o = state.outfit;
    var p = CPW.progress.compute(o);

    var conds = [];
    if (o.concept.worldview) conds.push(util.labelOf(D.worldviews, o.concept.worldview));
    if (o.garment.subtype) conds.push(util.labelOf(D.garments, o.garment.subtype));
    else if (o.garment.category) conds.push(util.labelOf(D.garmentCategories, o.garment.category));
    if (o.concept.role) conds.push(util.labelOf(D.roles, o.concept.role));
    if (o.concept.primaryStyle) conds.push(util.labelOf(D.styles, o.concept.primaryStyle));
    if (o.concept.attribute.id) conds.push(util.labelOf(D.attributes, o.concept.attribute.id));
    if (o.concept.primaryThemeMotif) conds.push(util.labelOf(D.motifs, o.concept.primaryThemeMotif));

    var swatches = ui.el('div', { class: 'swatch-row' });
    [['primary', 70], ['secondary', 20], ['accent', 10], ['metal', 0], ['gem', 0]].forEach(function (pair) {
      var c = util.byId(D.colors, o.palette[pair[0]]);
      if (!c) return;
      var chip = ui.el('span', { class: 'swatch', title: c.labelJa });
      chip.style.background = c.hex;
      chip.style.flexGrow = String(pair[1] || 6);
      swatches.appendChild(chip);
    });

    var wrap = ui.el('div', {}, [
      (function () {
        var input = ui.el('input', {
          class: 'name-input', type: 'text', id: 'outfit-name',
          placeholder: '衣装名（例：狼と深紅の装束）', 'aria-label': '衣装名',
          maxlength: '60'
        });
        input.value = o.name || '';
        input.addEventListener('input', function () {
          state.outfit.name = input.value;   // 入力中はre-renderしない
          state.dirty = true;
          autosave();
          var b = document.querySelector('#workshop-topnav .badge');
          if (b) { b.textContent = '未保存'; b.classList.add('badge--dirty'); }
        });
        return input;
      })(),
      conds.length
        ? ui.el('p', { class: 'wh-conds', text: conds.join('・') })
        : ui.el('p', { class: 'wh-conds wh-conds--empty', text: 'まだ何も決まっていない一着' }),
      swatches.childNodes.length ? swatches : null,
      ui.el('div', { class: 'progress' }, [
        ui.el('div', { class: 'progress-bar', role: 'progressbar', 'aria-valuenow': String(p.percent), 'aria-valuemin': '0', 'aria-valuemax': '100', 'aria-label': '基本設計の進み具合' }, [
          (function () { var f = ui.el('span', { class: 'progress-fill' }); f.style.width = p.percent + '%'; return f; })()
        ]),
        ui.el('span', { class: 'progress-label', text: '基本設計 ' + p.percent + '％（' + p.filled + '/' + p.total + '）' })
      ]),
      ui.el('button', {
        class: 'btn btn--primary btn--sm', type: 'button', text: '保存する',
        onclick: function () {
          if (!state.outfit.name) { ui.toast('衣装名を入力してから保存してください'); var n = document.getElementById('outfit-name'); if (n) n.focus(); return; }
          state.saveToLibrary();
          ui.toast('「' + state.outfit.name + '」を保存しました');
        }
      })
    ]);
    return wrap;
  }

  routes['/workshop'] = function () {
    // 戻る先は開始画面。設計は自動保存（下書き）されるので、確認ダイアログは出さない。
    var nav = backBar('開始画面へ戻る', '#/',
      ui.el('span', { class: 'badge' + (state.dirty ? ' badge--dirty' : ''), text: state.dirty ? '未保存' : '保存済み' }));
    nav.id = 'workshop-topnav';
    nav.querySelector('.back-btn').addEventListener('click', function () {
      store.saveDraft(state.outfit);              // 戻る直前に下書きを確定（debounce待ちを潰す）
      ui.toast('下書きを保存して開始画面へ戻りました');
    });
    var header = ui.el('div', { class: 'workshop-header', id: 'workshop-header' }, [buildHeaderInner()]);
    var body = ui.el('div', { class: 'accordion' });

    SECTIONS.forEach(function (sec) {
      var open = !!openSections[sec.id];
      var panelId = 'panel-' + sec.id;
      var btn = ui.el('button', {
        class: 'acc-head', type: 'button', 'aria-expanded': open ? 'true' : 'false', 'aria-controls': panelId
      }, [
        ui.el('span', { class: 'acc-title', text: sec.labelJa }),
        sec.phase > 1 ? ui.el('span', { class: 'tag-phase', text: 'Phase ' + sec.phase }) : null,
        ui.el('span', { class: 'acc-mark', 'aria-hidden': 'true' })
      ]);
      var panel = ui.el('div', { class: 'acc-panel', id: panelId, hidden: open ? null : 'hidden' });

      if (sec.id === 'concept') {
        CONCEPT_FIELDS.forEach(function (f) { panel.appendChild(renderField(f)); });
        panel.appendChild(renderAttributeField());
      } else if (sec.id === 'structure') {
        buildStructureSection(panel);
      } else if (sec.id === 'material') {
        buildMaterialSection(panel);
      } else if (sec.id === 'palette') {
        buildPaletteSection(panel);
      } else if (sec.id === 'special') {
        buildSpecialSection(panel);
      } else {
        panel.appendChild(ui.el('p', { class: 'p p--note', text: 'ここは Phase ' + sec.phase + ' で実装するところ。' }));
      }

      btn.addEventListener('click', function () {
        var nowOpen = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', nowOpen ? 'false' : 'true');
        if (nowOpen) panel.setAttribute('hidden', 'hidden'); else panel.removeAttribute('hidden');
        openSections[sec.id] = !nowOpen;
      });

      body.appendChild(ui.el('div', { class: 'acc-item' }, [btn, panel]));
    });

    var sum = CPW.advisor.summary(CPW.advisor.check(state.outfit, { ignored: ignoredIssues }));
    var warnLabel = sum.total ? '警告 ' + sum.hard + '/' + sum.warning + '/' + sum.info : '警告なし';
    var bar = ui.el('div', { class: 'bottombar' }, [
      ui.el('a', { class: 'bb-btn', href: '#/gacha', text: '部分ガチャ', id: 'bb-gacha' }),
      ui.el('a', {
        class: 'bb-btn' + (sum.hard ? ' bb-btn--alert' : sum.warning ? ' bb-btn--warn' : ''),
        href: '#/checks', text: warnLabel, id: 'bb-checks'
      }),
      ui.el('a', { class: 'bb-btn bb-btn--primary', href: '#/output', text: 'プロンプトを見る' })
    ]);

    var suggestLink = ui.el('div', { class: 'workshop-links' }, [
      ui.el('a', { class: 'link-btn', href: '#/suggest', text: '補助候補を見る' })
    ]);
    return screen('', [nav, header, suggestLink, body, bar]);
  };

  /* ============================================================
   * Phase 4 のUI
   * 判定・候補・ガチャの中身は advisor.js / gacha.js にある。
   * ここは並べて、押されたら patch を当てるだけ。
   * ========================================================== */

  /* 「維持する」を選んだ警告。保存やJSON往復では持ち回らない（セッション中だけ）。 */
  var ignoredIssues = [];
  CPW._ignoredIssues = ignoredIssues;

  var SEVERITY_JA = { hard: '成立しない', warning: '注意', info: '改善余地' };

  function issueCard(issue) {
    var head = ui.el('div', { class: 'issue-head' }, [
      ui.el('span', { class: 'issue-sev issue-sev--' + issue.severity, text: SEVERITY_JA[issue.severity] }),
      ui.el('span', { class: 'issue-cat', text: issue.category })
    ]);
    var body = [
      head,
      ui.el('h3', { class: 'issue-title', text: issue.titleJa }),
      ui.el('p', { class: 'p p--note', text: issue.messageJa })
    ];
    if (issue.involvedJa && issue.involvedJa.length) {
      body.push(ui.el('p', { class: 'issue-paths', text: '関係する選択：' + issue.involvedJa.join(' × ') }));
    }
    if (issue.extraJa) body.push(ui.el('p', { class: 'issue-paths', text: issue.extraJa }));

    var actions = ui.el('div', { class: 'issue-actions' });
    issue.resolutions.forEach(function (r) {
      if (r.action === 'ignore') return;
      actions.appendChild(ui.el('button', {
        class: 'chip chip--action', type: 'button', text: r.labelJa,
        onclick: function () {
          state.applyPatch(r.patch);
          ui.toast('「' + r.labelJa + '」を反映しました');
          render();
        }
      }));
    });
    if (issue.ignored) {
      actions.appendChild(ui.el('button', {
        class: 'chip chip--muted', type: 'button', text: '無視済み（戻す）',
        onclick: function () {
          var i = ignoredIssues.indexOf(issue.key);
          if (i >= 0) ignoredIssues.splice(i, 1);
          render();
        }
      }));
    } else {
      actions.appendChild(ui.el('button', {
        class: 'chip chip--muted', type: 'button', text: '維持する',
        onclick: function () {
          ignoredIssues.push(issue.key);
          ui.toast(issue.severity === 'hard' ? '維持しました。ただし同じ層での競合は生成が崩れやすくなります。' : '維持しました');
          render();
        }
      }));
    }
    body.push(actions);
    return ui.el('article', { class: 'issue-card issue-card--' + issue.severity + (issue.ignored ? ' is-ignored' : '') }, body);
  }

  routes['/checks'] = function () {
    var issues = CPW.advisor.check(state.outfit, { ignored: ignoredIssues });
    var sum = CPW.advisor.summary(issues);
    var density = CPW.advisor.densityReport(state.outfit);

    var counts = ui.el('div', { class: 'check-counts' }, [
      ui.el('span', { class: 'count count--hard', text: '成立しない ' + sum.hard }),
      ui.el('span', { class: 'count count--warning', text: '注意 ' + sum.warning }),
      ui.el('span', { class: 'count count--info', text: '改善余地 ' + sum.info }),
      sum.ignored ? ui.el('span', { class: 'count count--muted', text: '無視済み ' + sum.ignored }) : null
    ]);

    var body = ui.el('div', { class: 'check-body' });
    body.appendChild(ui.el('p', { class: 'p p--note', id: 'density-line',
      text: '装飾密度「' + density.levelJa + '」／装飾の重み ' + density.weight +
        '（目安 ' + (density.budget == null ? '上限なし' : density.budget + 'まで') + '）' }));

    var live = issues.filter(function (i) { return !i.ignored; });
    var muted = issues.filter(function (i) { return i.ignored; });
    if (!live.length && !muted.length) {
      body.appendChild(ui.el('p', { class: 'p', id: 'no-issue', text: '気になる組み合わせは見つかりませんでした。' }));
    }
    live.forEach(function (i) { body.appendChild(issueCard(i)); });
    if (muted.length) {
      body.appendChild(ui.el('h3', { class: 'sub-head', text: '無視済み' }));
      muted.forEach(function (i) { body.appendChild(issueCard(i)); });
    }

    return screen('', [
      backBar('設計台へ戻る', '#/workshop'),
      ui.el('header', { class: 'page-head' }, [
        ui.el('h2', { class: 'page-title', text: '警告確認' }),
        counts
      ]),
      body
    ]);
  };

  var suggestMode = 'standard';
  var SUGGEST_MODES = [
    { id: 'standard', labelJa: '王道' },
    { id: 'surprise', labelJa: '少し意外' },
    { id: 'both', labelJa: '両方' }
  ];
  var KIND_JA = { standard: '王道', surprise: '少し意外', fill: '不足補完', resolve: '競合回避' };

  routes['/suggest'] = function () {
    var cands = CPW.advisor.suggest(state.outfit, { mode: suggestMode, limit: 6 });

    var switcher = ui.el('div', { class: 'mode-switch', role: 'group', 'aria-label': '候補モード' });
    SUGGEST_MODES.forEach(function (m) {
      switcher.appendChild(ui.el('button', {
        class: 'chip' + (suggestMode === m.id ? ' is-on' : ''), type: 'button',
        'data-mode': m.id, text: m.labelJa,
        onclick: function () { suggestMode = m.id; render(); }
      }));
    });

    var list = ui.el('div', { class: 'cand-list' });
    if (!cands.length) {
      list.appendChild(ui.el('p', { class: 'p', id: 'no-cand', text: '現在の設計に加えられる候補は見つかりませんでした。先に世界観や基本衣装を決めると表示されやすくなります。' }));
    }
    cands.forEach(function (c) {
      list.appendChild(ui.el('article', { class: 'cand-card', 'data-cand': c.id }, [
        ui.el('div', { class: 'cand-head' }, [
          ui.el('span', { class: 'cand-kind cand-kind--' + c.kind, text: KIND_JA[c.kind] || c.kind }),
          ui.el('span', { class: 'cand-target', text: '→ ' + c.targetLabelJa })
        ]),
        ui.el('h3', { class: 'cand-title', text: c.labelJa }),
        c.promptEn ? ui.el('p', { class: 'cand-en', text: c.promptEn }) : null,
        ui.el('p', { class: 'p p--note', text: '理由：' + c.reasonJa }),
        ui.el('button', {
          class: 'btn btn--small', type: 'button', text: '追加する',
          onclick: function () {
            state.applyPatch(c.patch);
            ui.toast('「' + c.labelJa + '」を追加しました');
            render();
          }
        })
      ]));
    });

    return screen('', [
      backBar('設計台へ戻る', '#/workshop'),
      ui.el('header', { class: 'page-head' }, [
        ui.el('h2', { class: 'page-title', text: '補助候補' }),
        ui.el('p', { class: 'p p--note', text: '押すまで設計は変わらない。合うものだけ拾って。' })
      ]),
      switcher,
      list
    ]);
  };

  /* 部分ガチャ。採用するまで state.outfit には一切触れない。 */
  var gachaState = { target: 'palette', keeps: null, candidates: null, seed: null };

  routes['/gacha'] = function () {
    var G = CPW.gacha;
    if (!gachaState.keeps) gachaState.keeps = G.defaultKeeps();

    var targets = ui.el('div', { class: 'chips', role: 'group', 'aria-label': 'ガチャ対象' });
    G.TARGETS.forEach(function (t) {
      targets.appendChild(ui.el('button', {
        class: 'chip' + (gachaState.target === t.id ? ' is-on' : ''), type: 'button',
        'data-target': t.id, text: t.labelJa,
        onclick: function () {
          gachaState.target = t.id;
          gachaState.candidates = null;      // 対象を変えたら案は捨てる
          render();
        }
      }));
    });

    var keeps = ui.el('div', { class: 'chips', role: 'group', 'aria-label': '維持条件' });
    G.KEEPS.forEach(function (k) {
      var on = gachaState.keeps.indexOf(k.id) >= 0;
      keeps.appendChild(ui.el('button', {
        class: 'chip' + (on ? ' is-on' : ''), type: 'button',
        'data-keep': k.id, 'aria-pressed': on ? 'true' : 'false', text: k.labelJa,
        onclick: function () {
          var i = gachaState.keeps.indexOf(k.id);
          if (i >= 0) gachaState.keeps.splice(i, 1); else gachaState.keeps.push(k.id);
          gachaState.candidates = null;
          render();
        }
      }));
    });

    var actions = ui.el('div', { class: 'row-actions' }, [
      ui.el('button', {
        class: 'btn btn--primary', type: 'button', id: 'gacha-roll', text: gachaState.candidates ? '引き直す' : '3案を引く',
        onclick: function () {
          gachaState.candidates = G.roll(state.outfit, {
            target: gachaState.target, keeps: gachaState.keeps, count: 3, seed: gachaState.seed
          });
          render();
        }
      }),
      gachaState.candidates ? ui.el('button', {
        class: 'btn', type: 'button', id: 'gacha-cancel', text: 'やめる',
        onclick: function () {
          gachaState.candidates = null;     // 元の設計には何もしていないので、捨てるだけでよい
          ui.toast('設計は変更していません');
          render();
        }
      }) : null
    ]);

    var list = ui.el('div', { class: 'cand-list', id: 'gacha-list' });
    if (gachaState.candidates && !gachaState.candidates.length) {
      list.appendChild(ui.el('p', { class: 'p', id: 'gacha-empty', text: 'この維持条件だと動かせる案が作れなかった。維持条件を減らすか、対象を変えてみて。' }));
    }
    (gachaState.candidates || []).forEach(function (c, i) {
      var diff = ui.el('div', { class: 'diff' });
      c.diff.forEach(function (d) {
        diff.appendChild(ui.el('div', { class: 'diff-row' }, [
          ui.el('span', { class: 'diff-label', text: d.labelJa }),
          ui.el('span', { class: 'diff-from', text: d.fromJa }),
          ui.el('span', { class: 'diff-arrow', 'aria-hidden': 'true', text: '→' }),
          ui.el('span', { class: 'diff-to', text: d.toJa })
        ]));
      });
      var warn = c.summary.total
        ? '警告：注意 ' + c.summary.warning + '／改善余地 ' + c.summary.info
        : '警告なし';
      list.appendChild(ui.el('article', { class: 'cand-card', 'data-gacha': String(i) }, [
        ui.el('h3', { class: 'cand-title', text: '案 ' + (i + 1) }),
        diff,
        ui.el('p', { class: 'p p--note', text: warn }),
        ui.el('button', {
          class: 'btn btn--small btn--primary', type: 'button', 'data-adopt': String(i), text: 'この案を採用',
          onclick: function () {
            state.applyPatch(c.patch);
            gachaState.candidates = null;
            ui.toast('案 ' + (i + 1) + ' を採用しました');
            location.hash = '#/workshop';
          }
        })
      ]));
    });

    return screen('', [
      backBar('設計台へ戻る', '#/workshop'),
      ui.el('header', { class: 'page-head' }, [
        ui.el('h2', { class: 'page-title', text: '部分ガチャ' }),
        ui.el('p', { class: 'p p--note', text: '選んだ範囲だけを振る。採用するまで設計は変わらない。' })
      ]),
      ui.el('h3', { class: 'sub-head', text: 'どこを振る' }),
      targets,
      ui.el('h3', { class: 'sub-head', text: '維持するもの' }),
      keeps,
      actions,
      list
    ]);
  };

  /* ---------- 出力 ---------- */
  /* 日本語構造一覧の行。英語生成は generator.js に閉じている。 */
  function structureLines(o) {
    var lines = [];
    var push = function (label, value) { if (value) lines.push({ label: label, value: value }); };
    push('衣装名', o.name);
    push('世界観', util.labelOf(D.worldviews, o.concept.worldview));
    push('時代', util.labelOf(D.eras, o.concept.era));
    push('着用場面', util.labelOf(D.occasions, o.concept.occasion));
    push('季節', util.labelOf(D.seasons, o.concept.season));
    push('役割・身分', util.labelOf(D.roles, o.concept.role));
    push('主様式', util.labelOf(D.styles, o.concept.primaryStyle));
    push('副様式', o.concept.secondaryStyles.map(function (id) { return util.labelOf(D.styles, id); }).join('、'));
    push('主テーマ', util.labelOf(D.motifs, o.concept.primaryThemeMotif));
    push('副テーマ', o.concept.secondaryThemeMotifs.map(function (id) { return util.labelOf(D.motifs, id); }).join('、'));
    if (o.concept.attribute.id) {
      push('属性', util.labelOf(D.attributes, o.concept.attribute.id) + '（' + util.labelOf(D.attributeIntensities, o.concept.attribute.intensity) + '）');
      push('属性の反映先', ATTRIBUTE_APPLY.filter(function (t) { return o.concept.attribute.applyTo[t.key]; }).map(function (t) { return t.labelJa; }).join('、') || 'なし');
    }
    push('基本衣装', util.labelOf(D.garments, o.garment.subtype) || util.labelOf(D.garmentCategories, o.garment.category));
    push('着用役割', util.labelOf(D.wearRoles, o.garment.wearRole));

    var sil = [
      util.labelOf(D.silhouette.fit, o.silhouette.fit),
      util.labelOf(D.silhouette.upperVolume, o.silhouette.upperVolume),
      util.labelOf(D.silhouette.lowerVolume, o.silhouette.lowerVolume),
      util.labelOf(D.silhouette.waist, o.silhouette.waist),
      util.labelOf(D.silhouette.length, o.silhouette.length),
      util.labelOf(D.silhouette.symmetry, o.silhouette.symmetry)
    ].filter(Boolean);
    push('シルエット', sil.join('・'));

    var cat = util.byId(D.garmentCategories, o.garment.category);
    (cat ? cat.slots : Object.keys(o.parts)).forEach(function (slotId) {
      var slot = util.byId(D.partSlots, slotId);
      if (!slot) return;
      var v = o.parts[slotId];
      if (!schema.isSlotFilled(slot, v)) return;
      var kind = schema.slotKind(slot);

      if (kind === 'multi') {
        push(slot.labelJa, v.map(function (item) {
          return util.labelOf(slot.options, item.id) + '（' + util.labelOf(D.partLayers, item.layer) + '）';
        }).join('、'));
        return;
      }
      if (kind === 'composite') {
        var active = schema.activeComposite(slot, v);
        if (!active) return;
        var parts_ = [];
        slot.axes.forEach(function (a) {
          if (!active[a.key]) return;
          parts_.push(a.labelJa + '：' + util.labelOf(a.options, active[a.key]));
        });
        push(slot.labelJa, parts_.join(' / '));
        return;
      }
      push(slot.labelJa, util.labelOf(slot.options, v));
    });

    push('主素材', util.labelOf(D.materials, o.materials.primary));
    push('副素材', util.labelOf(D.materials, o.materials.secondary));
    push('装飾素材', util.labelOf(D.materials, o.materials.trim));
    push('透け感', util.labelOf(D.transparency, o.materials.transparency));
    push('光沢', util.labelOf(D.surfaces, o.materials.surface));
    push('厚み', util.labelOf(D.thickness, o.materials.thickness));
    push('柄', o.materials.patterns.map(function (id) { return util.labelOf(D.patterns, id); }).join('、'));

    push('装飾密度', D.decorationDensity[o.decorations.density].labelJa);
    push('主役装飾モチーフ', util.labelOf(D.decorations, o.decorations.focalMotif));
    o.decorations.items.forEach(function (it, i) {
      if (!it.type) return;
      push('装飾 ' + (i + 1), [
        util.labelOf(D.decorations, it.type),
        (it.placements || []).length ? '位置：' + it.placements.map(function (p) { return util.labelOf(D.decorationPlacements, p); }).join('・') : '位置：未設定',
        util.labelOf(D.decorationRoles, it.role),
        '大きさ：' + util.labelOf(D.decorationSizes, it.size),
        '数量：' + util.labelOf(D.decorationQuantities, it.quantity)
      ].filter(Boolean).join(' / '));
    });

    D.colorRoles.forEach(function (r) {
      var c = util.byId(D.colors, o.palette[r.id]);
      if (c) push(r.labelJa, c.labelJa + '（' + c.promptEn + '）');
    });
    push('配色方式', util.labelOf(D.colorSchemes, o.palette.scheme));
    return lines;
  }
  CPW.structureLines = structureLines;

  var OUTPUT_OPTIONS = [
    { key: 'includeNarrative', labelJa: '雰囲気・物語を追加', noteJa: '拘束チェーンや物語のテーマ語が入るようになる。' },
    { key: 'includeEffects', labelJa: '属性エフェクトを追加', noteJa: '炎や氷の演出語を足す。属性を選んでいるときだけ効く。' },
    { key: 'includePresentation', labelJa: '見せ方補助を追加', noteJa: '構図・ポーズ・背景の指示を足す。' },
    { key: 'includeQualityTags', labelJa: '品質タグを追加', noteJa: 'masterpiece などの定番タグを足す。' }
  ];

  var outputTab = 'short';

  /* クリップボードへ。失敗しても理由を出す。 */
  function copyText(text, whatJa) {
    if (!text) { ui.toast('コピーする内容がまだありません'); return; }
    var fallback = function () {
      try {
        var ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', 'readonly');
        ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        var ok = document.execCommand('copy');
        document.body.removeChild(ta);
        if (ok) ui.toast(whatJa + 'をコピーしました');
        else ui.toast('コピーできませんでした。テキストを長押しして選択してください');
      } catch (e) {
        ui.toast('コピーできませんでした（' + (e && e.message ? e.message : '理由不明') + '）。テキストを長押しして選択してください');
      }
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(function () { ui.toast(whatJa + 'をコピーしました'); }, fallback);
      } else fallback();
    } catch (e) { fallback(); }
  }
  CPW.copyText = copyText;

  routes['/output'] = function () {
    var host = ui.el('div', { id: 'output-host' });

    function draw() {
      host.innerHTML = '';
      var o = state.outfit;
      var gen = CPW.generator;

      var tabs = ui.el('div', { class: 'tabs' });
      [['short', '短縮版'], ['detailed', '詳細版'], ['structure', '日本語構造一覧']].forEach(function (t) {
        var on = outputTab === t[0];
        tabs.appendChild(ui.el('button', {
          type: 'button', class: 'tab' + (on ? ' is-active' : ''),
          'aria-pressed': on ? 'true' : 'false', 'data-fkey': 'tab:' + t[0], text: t[1],
          onclick: function () { outputTab = t[0]; draw(); focusBack(host, 'tab:' + t[0]); }
        }));
      });
      host.appendChild(tabs);

      var onlyCostume = !OUTPUT_OPTIONS.some(function (opt) { return o.output[opt.key]; });
      host.appendChild(ui.el('p', { class: 'p p--note', text: onlyCostume ? '現在は「衣装のみ」です。背景・ポーズ・感情・物語・魔法演出・品質タグは含めていません。' : '任意オプションを含めた状態の出力です。' }));

      if (outputTab === 'structure') {
        var lines = structureLines(o);
        var table = ui.el('dl', { class: 'struct' });
        lines.forEach(function (l) {
          table.appendChild(ui.el('dt', { text: l.label }));
          table.appendChild(ui.el('dd', { text: l.value }));
        });
        if (!lines.length) table.appendChild(ui.el('dd', { class: 'p p--note', text: 'まだ何も選ばれていません。設計台で項目を選ぶと、ここに一覧を表示します。' }));
        host.appendChild(ui.el('div', { class: 'card' }, [table]));
        host.appendChild(ui.el('button', {
          type: 'button', class: 'btn', 'data-fkey': 'copy:structure', text: '構造一覧をコピー',
          onclick: function () {
            copyText(lines.map(function (l) { return l.label + '：' + l.value; }).join('\n'), '構造一覧');
          }
        }));
      } else {
        var text = outputTab === 'short' ? gen.short(o) : gen.detailed(o);
        var box = ui.el('div', { class: 'card' });
        if (text) box.appendChild(ui.el('p', { class: 'prompt-text', id: 'prompt-text', text: text }));
        else box.appendChild(ui.el('p', { class: 'p p--note', text: gen.EMPTY_JA }));
        host.appendChild(box);
        host.appendChild(ui.el('button', {
          type: 'button', class: 'btn btn--primary', 'data-fkey': 'copy:' + outputTab,
          text: (outputTab === 'short' ? '短縮版' : '詳細版') + 'をコピー',
          onclick: function () { copyText(text, outputTab === 'short' ? '短縮版' : '詳細版'); }
        }));
      }

      /* 追加タグ。生成文の末尾へそのまま付ける（改変しない）。 */
      var tagCard = ui.el('div', { class: 'card card--quiet' }, [
        ui.el('h2', { class: 'card-title', text: '追加タグ' }),
        ui.el('p', { class: 'p p--sub', text: '出力の末尾にそのまま付け足すタグです。表情や視線など、工房の外で管理する語をここに置けます。' })
      ]);
      var tagInput = ui.el('input', {
        class: 'name-input', type: 'text', id: 'custom-tags',
        placeholder: '例：languid gaze, dull eyes', 'aria-label': '追加タグ'
      });
      tagInput.value = o.output.customTags || '';
      tagInput.addEventListener('input', function () {
        state.outfit.output.customTags = tagInput.value;   // 入力中はre-renderしない
        state.dirty = true;
        autosave();
      });
      tagInput.addEventListener('change', function () { draw(); });
      tagCard.appendChild(tagInput);
      host.appendChild(tagCard);

      var opts_ = ui.el('div', { class: 'card card--quiet' }, [
        ui.el('h2', { class: 'card-title', text: '出力に足すもの' }),
        ui.el('p', { class: 'p p--sub', text: '既定では衣装のみを出力します。必要なものだけを追加してください。' })
      ]);
      OUTPUT_OPTIONS.forEach(function (opt) {
        var on = !!o.output[opt.key];
        var key = 'out:' + opt.key;
        var line = ui.el('div', { class: 'opt-line' });
        line.appendChild(ui.el('button', {
          type: 'button', class: 'switch' + (on ? ' is-on' : ''),
          'aria-pressed': on ? 'true' : 'false', 'data-fkey': key,
          onclick: function () {
            state.set('output.' + opt.key, !on);
            // 属性エフェクトは、属性側の反映先とも意味が同じなので一緒に動かす
            if (opt.key === 'includeEffects') state.set('concept.attribute.applyTo.effects', !on);
            draw(); focusBack(host, key);
          }
        }, [ui.el('span', { class: 'switch-dot' }), ui.el('span', { text: opt.labelJa })]));
        line.appendChild(ui.el('p', { class: 'field-note', text: opt.noteJa }));
        opts_.appendChild(line);
      });
      host.appendChild(opts_);

      host.appendChild(ui.el('button', {
        class: 'btn', type: 'button', text: 'この衣装をJSONで書き出す',
        onclick: function () { downloadJSON(store.exportOutfit(state.outfit), (state.outfit.name || 'outfit') + '.json'); }
      }));
    }
    draw();

    return screen('', [
      backBar('設計台へ戻る', '#/workshop'),
      ui.el('h1', { class: 'page-title', text: '出力' }),
      host
    ]);
  };

  /* ---------- 保存一覧 ---------- */
  routes['/library'] = function () {
    var lib = store.listOutfits();
    var body = ui.el('div', { class: 'stack' });

    if (!lib.length) {
      body.appendChild(ui.el('div', { class: 'card card--quiet' }, [
        ui.el('p', { class: 'p', text: '保存した衣装はまだありません。設計台で名前を付けて保存すると、ここに表示します。' }),
        ui.el('a', { class: 'btn btn--primary', href: '#/entry', text: '新しい衣装を設計する' })
      ]));
    }

    lib.forEach(function (o) {
      var conds = [];
      if (o.concept.worldview) conds.push(util.labelOf(D.worldviews, o.concept.worldview));
      if (o.concept.role) conds.push(util.labelOf(D.roles, o.concept.role));
      if (o.concept.attribute.id) conds.push(util.labelOf(D.attributes, o.concept.attribute.id));

      var sw = ui.el('div', { class: 'swatch-row swatch-row--sm' });
      ['primary', 'secondary', 'accent', 'metal', 'gem'].forEach(function (k) {
        var c = util.byId(D.colors, o.palette[k]);
        if (!c) return;
        var s = ui.el('span', { class: 'swatch', title: c.labelJa });
        s.style.background = c.hex;
        sw.appendChild(s);
      });

      var card = ui.el('div', { class: 'card' }, [
        ui.el('h2', { class: 'card-title', text: o.name || '名称未設定の衣装' }),
        conds.length ? ui.el('p', { class: 'p p--sub', text: conds.join('・') }) : null,
        sw.childNodes.length ? sw : null,
        ui.el('p', { class: 'p p--meta', text: '更新 ' + util.formatDate(o.updatedAt) }),
        ui.el('div', { class: 'row' }, [
          ui.el('button', { class: 'btn btn--sm btn--primary', type: 'button', text: '開く', onclick: function () { state.load(o, { saved: true }); location.hash = '#/workshop'; } }),
          ui.el('button', { class: 'btn btn--sm', type: 'button', text: '複製', onclick: function () { store.duplicateOutfit(o.id); ui.toast('複製しました'); render(); } }),
          ui.el('button', { class: 'btn btn--sm', type: 'button', text: 'JSON', onclick: function () { downloadJSON(store.exportOutfit(o), (o.name || 'outfit') + '.json'); } }),
          ui.el('button', {
            class: 'btn btn--sm btn--danger', type: 'button', text: '削除',
            onclick: function () {
              if (!ui.confirm('「' + (o.name || '名称未設定の衣装') + '」を削除します。よろしいですか？ この操作は元に戻せません。')) return;
              store.removeOutfit(o.id);
              ui.toast('削除しました');
              render();
            }
          })
        ])
      ]);
      body.appendChild(card);
    });

    var importInput = ui.el('input', { type: 'file', accept: 'application/json,.json', id: 'import-file', class: 'visually-hidden' });
    importInput.addEventListener('change', function () {
      var file = importInput.files && importInput.files[0];
      if (!file) return;
      var reader = new FileReader();
      reader.onload = function () {
        var r = store.importJSON(String(reader.result));
        if (!r.ok) { ui.toast(r.reasonJa); }
        else { ui.toast(r.imported + '件を取り込みました' + (r.skipped ? '（' + r.skipped + '件は読み込めなかったため除外しました）' : '')); render(); }
        importInput.value = '';
      };
      reader.onerror = function () { ui.toast('ファイルを読み込めませんでした'); importInput.value = ''; };
      reader.readAsText(file);
    });

    return screen('', [
      backBar('開始画面へ戻る', '#/'),
      ui.el('h1', { class: 'page-title', text: '保存した衣装' }),
      body,
      ui.el('div', { class: 'card card--quiet' }, [
        ui.el('h2', { class: 'card-title', text: 'バックアップ' }),
        ui.el('p', { class: 'p', text: '端末内保存は、ブラウザのデータを消すと一緒に消えます。JSONで書き出しておくと、別の端末でも読み込めます。' }),
        ui.el('div', { class: 'row' }, [
          ui.el('button', { class: 'btn btn--sm', type: 'button', text: '全部を書き出す', onclick: function () { downloadJSON(store.exportAll(), 'costume-prompt-workshop-backup.json'); } }),
          ui.el('button', { class: 'btn btn--sm', type: 'button', text: 'JSONを読み込む', onclick: function () { importInput.click(); } })
        ]),
        importInput
      ])
    ]);
  };

  function downloadJSON(text, filename) {
    try {
      var blob = new Blob([text], { type: 'application/json' });
      var url = URL.createObjectURL(blob);
      var a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
      ui.toast('書き出しました');
    } catch (e) { ui.toast('書き出しに失敗しました'); }
  }

  /* ============================================================
   * router
   * ========================================================== */
  CPW.parseHash = function (hash) {
    var h = String(hash || '').replace(/^#/, '');
    if (h === '' || h === '/') return { route: '', params: [] };
    var segs = h.split('/').filter(Boolean);
    return { route: '/' + segs[0], params: segs.slice(1) };
  };

  function render() {
    if (!appRoot) return;
    var parsed = CPW.parseHash(location.hash);
    var view = routes[parsed.route] || routes[''];
    appRoot.innerHTML = '';
    appRoot.appendChild(view(parsed.params));
    global.scrollTo(0, 0);
  }
  CPW.render = render;

  function init() {
    appRoot = document.getElementById('app');
    var draft = store.loadDraft();
    if (draft) { state.outfit = draft; state.dirty = true; }
    // 設計台のヘッダ（未保存表示・主要条件・配色・基本設計％）は状態の変化に追従させる。
    // 衣装名の入力は emit しないので、入力中にヘッダが作り直されることはない。
    state.subscribe(refreshHeader);
    global.addEventListener('hashchange', render);
    global.addEventListener('beforeunload', function () { if (autosave.pending()) store.saveDraft(state.outfit); });
    render();
  }

  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
  }
})(window);
