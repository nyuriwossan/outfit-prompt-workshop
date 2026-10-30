/* 衣装拡張（コスプレ・季節イベント・着ぐるみ／細項目の折りたたみ）の回帰テスト。
 * 既存テストは削除・弱体化せず、ここで追加分を検査する。 */
(function (g) {
  'use strict';
  var C = g.CPW, D = C.data, U = C.util, S = C.schema, G = C.generator, A = C.advisor, PC = C.presetCatalog;
  function test(n, f) { C.tests.push({ name: '衣装拡張: ' + n, fn: f }); }
  function assert(v, m) { if (!v) throw Error(m || 'costume expansion assertion'); }
  function o(raw) { return S.normalize(raw); }
  function both(x) { return G.short(x) + ' || ' + G.detailed(x); }
  var BASE = C.expansionBaseline;
  var NEW_GARMENTS = D.garments.filter(function (x) { return x.expansion === 'costume-2026-10'; });
  var NEW_PRESETS = D.presets.filter(function (p) { return p.expansion === 'costume-2026-10'; });
  var RECIPES = D.presets.filter(function (p) { return p.recipe; });
  var CREATURES = U.byId(D.partSlots, 'creature_motif').options;
  var FORBIDDEN = /\b(adult|bust)\b/i;
  var BAD_TEXT = /undefined|null|\[object|\{c\}|\{f\}|\b(a|an) (a|an)\b|\s,|,\s*,|\.\s*\.|\s{2,}|\bwith with\b/;
  function hard(x) { return A.check(x).filter(function (i) { return i.severity === 'hard'; }); }
  function issue(x, id) { return A.check(x).filter(function (i) { return i.id === id; })[0]; }
  function withStore(fn) { var read = C.store._read, write = C.store._write, m = {}; C.store._read = function (k, d) { return m[k] ? U.clone(m[k]) : d; }; C.store._write = function (k, v) { m[k] = U.clone(v); return true; }; try { fn(); } finally { C.store._read = read; C.store._write = write; } }

  /* ---------- 既存出力・既存IDの不変 ---------- */
  test('既存プリセット72件は先頭に同じ順で残り、英文が拡張前と完全一致', function () {
    assert(BASE.presets.length === 72);
    BASE.presets.forEach(function (b, i) {
      var p = D.presets[i];
      assert(p && p.id === b.id, 'order ' + i);
      var x = PC.create(p.id);
      assert(G.short(x) === b.short, 'short ' + p.id);
      assert(G.detailed(x) === b.detailed, 'detailed ' + p.id);
    });
  });
  test('拡張前の無作為150衣装の英文が完全一致', function () {
    BASE.random.forEach(function (b, i) { var x = o(b.outfit); assert(G.short(x) === b.short && G.detailed(x) === b.detailed, 'random ' + i + ' ' + b.outfit.garment.subtype); });
  });
  test('既存の基本衣装109件・大分類9件・部位30件のIDが残る', function () {
    var cats = ['top_bottom', 'dress', 'uniform', 'robe', 'wafuku', 'chinese', 'swimwear', 'merfolk', 'lingerie'];
    cats.forEach(function (c) { assert(U.byId(D.garmentCategories, c), c); });
    assert(D.garments.length - NEW_GARMENTS.length === 109, 'existing garments ' + (D.garments.length - NEW_GARMENTS.length));
    assert(D.partSlots.length - D.creatureSlotIds.length === 30);
    assert(C.SCHEMA_VERSION === '0.6');
  });
  test('ID はすべて一意', function () {
    [D.garments, D.presets, D.partSlots, D.decorations, D.patterns, D.motifs, D.garmentCategories].forEach(function (list) {
      var ids = list.map(function (x) { return x.id; });
      assert(new Set(ids).size === ids.length, 'duplicate in list');
    });
    D.partSlots.forEach(function (s) { var ids = (s.options || []).map(function (x) { return x.id; }); assert(new Set(ids).size === ids.length, 'dup option ' + s.id); });
  });

  /* ---------- 新しい基本衣装の英文品質 ---------- */
  NEW_GARMENTS.forEach(function (gm) {
    test('基本衣装 ' + gm.id + ' の英文（短縮・詳細）', function () {
      var x = o({ garment: { category: gm.category, subtype: gm.id }, palette: { primary: 'deep_navy' }, materials: { primary: 'cotton' } });
      var t = both(x);
      assert(!BAD_TEXT.test(t), t);
      assert(!FORBIDDEN.test(gm.shortPrompt + ' ' + gm.detailedPrompt + ' ' + (gm.creatureShort || '') + ' ' + (gm.creatureDetailed || '')), gm.id);
      assert(/^(a|an) /.test(gm.detailedPrompt) || gm.plural, 'detailed article ' + gm.id);
      assert(G.detailed(x).toLowerCase().indexOf(G.article(gm.detailedPrompt.replace(/^(a|an) /, '')) + ' ') === 0 || gm.plural, 'article ' + G.detailed(x));
      assert(!hard(x).length, 'hard ' + gm.id);
      assert(U.byId(D.garmentCategories, gm.category), 'category ' + gm.id);
      assert(/^[a-z0-9_]+$/.test(gm.id), 'snake_case ' + gm.id);
    });
  });
  test('新しい部位・装飾・柄・主テーマに PixAI で不都合な語（adult / bust）を含まない', function () {
    var texts = [];
    D.creatureSlotIds.forEach(function (id) { (U.byId(D.partSlots, id).options || []).forEach(function (x) { texts.push(x.shortPrompt, x.featureEn, x.mascotFeatureEn); }); });
    D.decorations.concat(D.patterns, D.motifs).forEach(function (x) { texts.push(x.shortPrompt, x.detailedPrompt); });
    NEW_PRESETS.forEach(function (p) { var x = PC.create(p.id); texts.push(G.short(x), G.detailed(x)); });
    texts.filter(Boolean).forEach(function (t) { assert(!FORBIDDEN.test(t), t); });
  });

  /* ---------- 新プリセット（ガチャ比較のレシピを含む） ---------- */
  NEW_PRESETS.concat(RECIPES).forEach(function (p) {
    test('プリセット ' + p.id + ' は有効な構造・可視の部位・hard 競合なし', function () {
      var x = PC.create(p.id), cat = U.byId(D.garmentCategories, x.garment.category);
      assert(U.byId(D.garments, x.garment.subtype) && cat);
      assert(U.byId(D.worldviews, x.concept.worldview) || p.recipe, 'worldview');
      Object.keys(x.parts).forEach(function (k) { assert(cat.slots.indexOf(k) >= 0, 'hidden part ' + k); });
      assert(!hard(x).length, JSON.stringify(hard(x).map(function (i) { return i.id; })));
      ['short', 'detailed'].forEach(function (mode) {
        var t = G[mode](x);
        assert(t.length > 30 && !BAD_TEXT.test(t), t);
        x.decorations.items.forEach(function (it) { var d = U.byId(D.decorations, it.type); var stem = d.shortPrompt.toLowerCase().replace(/(e?s)$/, ''); assert(t.toLowerCase().indexOf(stem) >= 0, 'silent decoration ' + it.type + ' ' + t); });
      });
      assert(p.moodTags.length && p.moodTags.every(function (m) { return D.presetMoods.indexOf(m) >= 0; }));
      (p.themeTags || []).forEach(function (t) { assert(U.byId(D.presetThemes, t), t); });
      (p.eventTags || []).forEach(function (t) { assert(U.byId(D.presetEvents, t), t); });
      if (p.kigurumiType) assert(U.byId(D.kigurumiTypes, p.kigurumiType));
      assert(!Object.prototype.hasOwnProperty.call(x, 'themeTags') && !Object.prototype.hasOwnProperty.call(x, 'eventTags'), 'discovery metadata leaked into outfit');
    });
  });
  test('ガチャ比較Bのレシピ32件はすべて既存IDだけで組まれ、元のガチャIDを持つ', function () {
    assert(RECIPES.length === 32);
    RECIPES.forEach(function (p) { assert(p.sourceGachaId && p.id === 'recipe_' + p.sourceGachaId); });
  });

  /* ---------- 検索・横断フィルター ---------- */
  test('特集フィルター：コスプレ／季節・イベント／着ぐるみ／通常衣装', function () {
    var cos = PC.filter({ theme: 'cosplay' }), sea = PC.filter({ theme: 'seasonal' }), kig = PC.filter({ theme: 'kigurumi' }), ev = PC.filter({ theme: 'everyday' });
    assert(cos.length >= 30 && sea.length >= 30 && kig.length >= 30 && ev.length >= 30, [cos.length, sea.length, kig.length, ev.length].join('/'));
    ev.forEach(function (p) { assert(!(p.themeTags || []).some(function (t) { return ['cosplay', 'seasonal', 'kigurumi'].indexOf(t) >= 0; })); });
    assert(PC.filter({}).length === D.presets.length, 'unfiltered list keeps every preset');
  });
  test('行事・着ぐるみの種類で絞り込める', function () {
    D.presetEvents.forEach(function (e) { assert(PC.filter({ theme: 'seasonal', sub: e.id }).length >= 1, e.id); });
    D.kigurumiTypes.forEach(function (k) { var list = PC.filter({ theme: 'kigurumi', sub: k.id }); assert(list.length >= 2, k.id); list.forEach(function (p) { assert(p.kigurumiType === k.id); }); });
    assert(PC.filter({ theme: 'seasonal', sub: 'christmas' }).some(function (p) { return p.id === 'santa_classic'; }));
  });
  test('日本語・別名・ガチャの衣装名で検索できる', function () {
    [['サンタ', 'santa_classic'], ['ハロウィン', 'halloween_witch'], ['着ぐるみ', 'rabbit_mascot'], ['完全マスコット', 'shark_mascot'], ['燕尾服', 'court_tailcoat'], ['チェスターコート', 'winter_long_coat'], ['ミニスカナース', 'nurse_costume'], ['かりゆし', 'recipe_ryukyu_kariyushi']].forEach(function (pair) {
      assert(PC.filter({ query: pair[0] }).some(function (p) { return p.id === pair[1]; }), pair[0]);
    });
  });
  test('プレビュー・配色試し・おまかせでは編集中の衣装が変わらない', function () {
    var before = JSON.stringify(C.state.outfit), dirty = C.state.dirty;
    PC.filter({ theme: 'kigurumi' }); var draft = PC.create('rabbit_mascot'); draft.palette.primary = 'jet_black';
    PC.pick(PC.filter({ theme: 'seasonal' }), null, function () { return 0.5; });
    assert(JSON.stringify(C.state.outfit) === before && C.state.dirty === dirty);
  });

  /* ---------- 着ぐるみ6種の区別 ---------- */
  var SIX = {
    motif_accessory: 'bunny_ear_lounge', animal_hood: 'shark_hood_poncho', onesie: 'rabbit_onesie',
    plush_suit: 'capybara_plush_suit', full_mascot: 'rabbit_mascot', reinterpretation: 'zebra_tailored_suit'
  };
  test('着ぐるみ6種がそれぞれ選べ、英文上も区別できる', function () {
    var t = {}; Object.keys(SIX).forEach(function (k) { var p = U.byId(D.presets, SIX[k]); assert(p.kigurumiType === k, k); t[k] = both(PC.create(p.id)); });
    assert(/rabbit-ear headband/.test(t.motif_accessory) && !/mascot/.test(t.motif_accessory));
    assert(/shark-hood poncho/.test(t.animal_hood) && /open-face shark hood/.test(t.animal_hood));
    assert(/rabbit pajama onesie/.test(t.onesie) && /open-face rabbit hood/.test(t.onesie));
    assert(/plush padded capybara costume suit/.test(t.plush_suit) && /boxy padded body/.test(t.plush_suit));
    assert(/rabbit mascot costume/.test(t.full_mascot) && /no human face visible/.test(t.full_mascot));
    assert(/zebra stripe/.test(t.reinterpretation) && /suit/.test(t.reinterpretation));
  });
  test('ウサギ完全マスコットは顔出しフード衣装と混同されない（頭・胴・手・足を一体で表す）', function () {
    var m = both(PC.create('rabbit_mascot')), h = both(PC.create('rabbit_onesie'));
    assert(/no human face visible/.test(m) && /encloses the wearer's entire head/.test(m) && /head fully enclosed/.test(m));
    assert(/mascot head/.test(m) && /mascot body/.test(m) && /paw gloves/.test(m) && /paw feet/.test(m));
    assert(!/open-face|face-revealing|face-out|hood/.test(m), m);
    assert(/open-face/.test(h) && !/no human face|mascot/.test(h), h);
  });
  test('完全マスコットは全題材を同じ共通構造で生成できる', function () {
    ['full_mascot_suit', 'object_mascot_suit'].forEach(function (gid) {
      CREATURES.forEach(function (c) {
        var x = o({ garment: { category: 'full_mascot', subtype: gid }, parts: { creature_motif: c.id }, palette: { primary: 'snow_white' } });
        var t = both(x);
        assert(!BAD_TEXT.test(t), t);
        assert(t.indexOf(c.shortPrompt) >= 0 && /no human face visible/.test(t) && /matching mascot gloves/.test(t), t);
        assert(!/mesh|ventilation/.test(t), 'vision details must not be forced: ' + t);
        assert(!hard(x).length);
      });
    });
  });
  test('顔出し着ぐるみは全題材で "open-face" を持ち、顔を覆う語を持たない', function () {
    D.garments.filter(function (x) { return x.category === 'kigurumi' && x.hasHood; }).forEach(function (gm) {
      CREATURES.forEach(function (c) {
        var x = o({ garment: { category: 'kigurumi', subtype: gm.id }, parts: { creature_motif: c.id } });
        var t = both(x);
        assert(!BAD_TEXT.test(t), t);
        assert(/open-face/.test(t) && !/no human face|mascot head/.test(t), t);
      });
    });
  });
  test('視界メッシュ・通気口は明示選択したときだけ英語に出す', function () {
    var base = { garment: { category: 'full_mascot', subtype: 'full_mascot_suit' }, parts: { creature_motif: 'penguin' } };
    assert(!/mesh|ventilation/.test(both(o(base))));
    var hidden = U.clone(base); hidden.parts.mascot_vision = 'vision_hidden'; assert(!/mesh|ventilation/.test(both(o(hidden))));
    var mesh = U.clone(base); mesh.parts.mascot_vision = 'mesh_eyes'; assert(/mesh-screened mascot eyes/.test(both(o(mesh))));
    var vent = U.clone(base); vent.parts.mascot_vision = 'ventilation_holes'; assert(/ventilation holes/.test(both(o(vent))));
  });
  test('題材未選択でも欠けた句を作らない', function () {
    ['kigurumi', 'full_mascot'].forEach(function (cat) {
      D.garments.filter(function (x) { return x.category === cat; }).forEach(function (gm) {
        var x = o({ garment: { category: cat, subtype: gm.id }, parts: { animal_hood: 'small_ear_hood', costume_tail: 'plush_tail', kigurumi_feet: 'paw_slippers', mascot_head: 'merged_head_body', mascot_body: 'object_shaped_body' } });
        assert(!BAD_TEXT.test(both(x)), both(x));
      });
    });
  });

  /* ---------- 競合・休止 ---------- */
  test('完全マスコットへ切り替えても通常の頭部・靴・手袋は消さずに休止し、出力しない', function () {
    var src = o({ garment: { category: 'top_bottom', subtype: 'hoodie_and_cargo' }, parts: { headwear: 'witch_hat', footwear: 'sneakers', handwear: { type: 'hand_gloves' }, sleeves: 'long_sleeves' } });
    var m = S.applyPatch(src, { garment: { category: 'full_mascot', subtype: 'full_mascot_suit' }, parts: { creature_motif: 'bear' } });
    assert(m.parts.headwear === 'witch_hat' && m.parts.footwear === 'sneakers' && m.parts.sleeves === 'long_sleeves', 'values kept');
    var t = both(m);
    assert(!/witch hat|sneakers|gloves\b(?! )/.test(t.replace(/mascot gloves/g, '')), t);
    assert(C.dormantParts(m).map(function (s) { return s.id; }).join(',') === 'headwear,footwear,handwear,sleeves');
    var back = S.applyPatch(m, { garment: { category: 'top_bottom', subtype: 'hoodie_and_cargo' } });
    assert(/witch hat/.test(G.short(back)) && /sneakers/.test(G.short(back)), 'restored when category returns');
  });
  test('完全マスコットの休止部位は警告になり、解決ボタンは該当部位だけを外す', function () {
    var m = o({ garment: { category: 'full_mascot', subtype: 'full_mascot_suit' }, parts: { creature_motif: 'cat', headwear: 'santa_hat', footwear: 'sneakers', animal_hood: 'creature_face_hood' } });
    var i = issue(m, 'mascot_dormant_human_parts');
    assert(i && i.severity === 'warning');
    var r = i.resolutions.filter(function (x) { return x.action === 'setPath:parts.footwear='; })[0];
    assert(r, 'footwear resolution');
    var next = A.apply(m, r);
    assert(!next.parts.footwear && next.parts.headwear === 'santa_hat' && next.parts.animal_hood === 'creature_face_hood');
  });
  test('完全マスコット＋顔を見せる追加タグは hard、顔寄り・視線は warning', function () {
    var m = o({ garment: { category: 'full_mascot', subtype: 'full_mascot_suit' }, parts: { creature_motif: 'dog' }, output: { customTags: 'visible face, smile' } });
    assert(issue(m, 'mascot_face_request_in_tags').severity === 'hard');
    assert(!issue(o({ garment: { category: 'kigurumi', subtype: 'animal_onesie' }, output: { customTags: 'visible face' } }), 'mascot_face_request_in_tags'));
    var p = o({ garment: { category: 'full_mascot', subtype: 'full_mascot_suit' }, presentation: { layoutVersion: 1, distanceId: 'face', poseMood: 'inviting' }, output: { includePresentation: true } });
    var w = issue(p, 'mascot_face_presentation');
    assert(w && w.severity === 'warning' && w.resolutions.length === 3, JSON.stringify(w && w.resolutions));
  });
  test('完全マスコット＋身体の特殊パーツは情報として知らせる', function () {
    var m = o({ garment: { category: 'full_mascot', subtype: 'full_mascot_suit' }, specialParts: { wings: { type: 'angel_wings' } } });
    assert(issue(m, 'mascot_body_special_parts').severity === 'info');
  });
  test('顔出し着ぐるみ：ミトンと手袋／足先一体と靴／フードと帽子は warning と解決策を持つ', function () {
    var k = o({ garment: { category: 'kigurumi', subtype: 'animal_onesie' }, parts: { creature_motif: 'cat', kigurumi_hands: 'attached_paw_mitts', handwear: { type: 'hand_gloves' }, kigurumi_feet: 'integrated_footies', footwear: 'sneakers', headwear: 'witch_hat' } });
    ['kigurumi_hands_vs_handwear', 'kigurumi_feet_vs_footwear', 'kigurumi_hood_vs_headwear'].forEach(function (id) { var i = issue(k, id); assert(i && i.severity === 'warning' && i.resolutions.length >= 2, id); });
    var fixed = A.apply(k, issue(k, 'kigurumi_hood_vs_headwear').resolutions[1]);
    assert(fixed.parts.animal_hood === 'hood_worn_down' && !issue(fixed, 'kigurumi_hood_vs_headwear'));
    var bare = o({ garment: { category: 'kigurumi', subtype: 'animal_onesie' }, parts: { kigurumi_feet: 'integrated_footies', footwear: 'barefoot' } });
    assert(!issue(bare, 'kigurumi_feet_vs_footwear'));
  });
  test('人魚と完全マスコットは同時に成立せず、尾の値は休止として保持', function () {
    var mer = o({ garment: { category: 'merfolk', subtype: 'mermaid_tail' }, parts: { mermaid_tail_form: 'classic_scaled_tail' } });
    var m = S.applyPatch(mer, { garment: { category: 'full_mascot', subtype: 'full_mascot_suit' } });
    assert(m.parts.mermaid_tail_form === 'classic_scaled_tail' && !/mermaid|fish tail|no human legs/.test(both(m)));
    assert(issue(m, 'mascot_dormant_human_parts'));
  });
  test('部分ガチャは完全マスコットでも hard 競合案を出さず、編集中の衣装を変えない', function () {
    var m = PC.create('dragon_mascot'), snap = JSON.stringify(m);
    C.gacha.TARGETS.forEach(function (t) {
      C.gacha.roll(m, { target: t.id, seed: 7, count: 3 }).forEach(function (c) { assert(!c.issues.some(function (i) { return i.severity === 'hard'; }), t.id); assert(!BAD_TEXT.test(both(c.preview)), both(c.preview)); });
    });
    assert(JSON.stringify(m) === snap);
  });
  test('コンセプトの汎用候補プールに着ぐるみ系を混ぜない', function () {
    D.garments.filter(function (x) { return x.specialStructure; }).forEach(function (x) { assert(x.category === 'kigurumi' || x.category === 'full_mascot'); });
  });

  /* ---------- 保存互換 ---------- */
  ['draft', 'library', 'duplicate', 'json', 'allJson'].forEach(function (method) {
    test('完全マスコットの保存往復（' + method + '）で題材・頭・手足・休止値が残る', function () {
      withStore(function () {
        var x = PC.create('shark_mascot'); x.parts.headwear = 'santa_hat'; x.parts.mascot_vision = 'mouth_mesh'; x.name = 'サメ';
        x = S.normalize(x);
        var copy;
        if (method === 'draft') { C.store.saveDraft(x); copy = C.store.loadDraft(); }
        if (method === 'library') copy = C.store.getOutfit(C.store.saveOutfit(x).id);
        if (method === 'duplicate') { C.store.saveOutfit(x); copy = C.store.duplicateOutfit(x.id); }
        if (method === 'json') { C.store.importJSON(C.store.exportOutfit(x)); copy = C.store.listOutfits()[0]; }
        if (method === 'allJson') { C.store.saveOutfit(x); C.store.importJSON(C.store.exportAll()); copy = C.store.listOutfits()[0]; }
        assert(JSON.stringify(copy.parts) === JSON.stringify(x.parts), method);
        assert(G.short(copy) === G.short(x) && G.detailed(copy) === G.detailed(x));
        assert(copy.version === '0.6');
      });
    });
  });
  test('旧 schema（0.1〜0.5）の衣装は新しい部位なしでそのまま読める', function () {
    ['0.1', '0.3', '0.5'].forEach(function (v) {
      var r = S.migrate({ version: v, concept: {}, garment: { category: 'dress', subtype: 'maid_dress' }, parts: { sleeves: 'puff_sleeves', unknown_future_slot: 'x' } });
      assert(r.ok && r.outfit.parts.sleeves === 'puff_sleeves' && !r.outfit.parts.unknown_future_slot);
    });
  });

  /* ---------- 折りたたみUIの表示ロジック（DOMを使わない部分） ---------- */
  test('セクション要約は日本語で、空なら「未設定」', function () {
    var x = PC.create('santa_classic');
    var s = C.sectionSummaryJa('structure', x), m = C.sectionSummaryJa('material', x), p = C.sectionSummaryJa('palette', x);
    assert(/サンタ衣装/.test(s) && /部位/.test(s), s);
    assert(/主素材：ベルベット/.test(m) && /装飾1件/.test(m), m);
    assert(/深紅/.test(p) || p.length > 0, p);
    assert(C.sectionSummaryJa('styling', S.createOutfit()) === '未設定');
    ['concept', 'structure', 'styling', 'material', 'condition', 'palette', 'special'].forEach(function (id) { assert(!/[a-z]{4,}/.test(C.sectionSummaryJa(id, PC.create('rabbit_mascot'))), id); });
  });
  test('複数選択の要約は件数と代表2件', function () {
    assert(C.summarizeLabels(['A']) === 'A');
    assert(C.summarizeLabels(['A', 'B', 'C']) === '3件：A・B ほか');
    assert(C.summarizeLabels([]) === '');
  });
  test('項目の段階（必須・おすすめ・任意）は既存の母数規則と一致', function () {
    var prev = C.state.outfit;
    try {
      C.state.outfit = o({ garment: { category: 'full_mascot', subtype: 'full_mascot_suit' } });
      assert(C.fieldTier('parts.creature_motif') === 'required');
      assert(C.fieldTier('parts.mascot_head') === 'recommended');
      assert(C.fieldTier('parts.mascot_vision') === 'optional');
      assert(C.fieldTier('materials.primary') === 'required');
      assert(C.fieldTier('concept.worldview') === 'recommended');
      var pr = C.progress.compute(C.state.outfit);
      assert(pr.missing.indexOf('着ぐるみの題材') >= 0);
    } finally { C.state.outfit = prev; }
  });
  test('かんたん設計でも着ぐるみの主要部位は表示対象', function () {
    var x = o({ garment: { category: 'full_mascot', subtype: 'full_mascot_suit' } });
    ['creature_motif', 'mascot_head', 'mascot_body', 'mascot_hands', 'mascot_feet'].forEach(function (id) { assert(C.uiComplexity.isSimpleField('parts.' + id, x), id); });
    assert(!C.uiComplexity.isSimpleField('parts.mascot_vision', x));
  });

  test('基本衣装そのものが非対称なら「左右対称」を英文に並べず、選択値は保持して警告で知らせる', function () {
    ['kente', 'biker_jacket_set'].forEach(function (id) {
      var gm = U.byId(D.garments, id);
      var x = o({ garment: { category: gm.category, subtype: id }, silhouette: { symmetry: 'symmetrical' } });
      var t = G.detailed(x) + ' ' + G.short(x);
      assert(/asymmetric/.test(t) && !/\bsymmetrical\b/.test(t), t);
      assert(x.silhouette.symmetry === 'symmetrical');
      assert(issue(x, 'symmetry_detail'), id + ' advisory');
    });
  });

  test('短縮版：色名の末語と題材名が重なるときだけ色を後置する（garnet red red panda を作らない）', function () {
    var x = o({ garment: { category: 'kigurumi', subtype: 'creature_sack_tunic' }, parts: { creature_motif: 'red_panda' }, palette: { primary: 'garnet' } });
    var t = G.short(x);
    assert(!/\bred red\b/i.test(t), t);
    assert(/red panda sack tunic in garnet red/.test(t), t);
    // 重ならない場合は従来どおり前置き
    var y = o({ garment: { category: 'kigurumi', subtype: 'creature_sack_tunic' }, parts: { creature_motif: 'red_panda' }, palette: { primary: 'dusty_rose' } });
    assert(/^dusty rose red panda sack tunic/.test(G.short(y)), G.short(y));
    assert(G.shortCore(['navy blue'], 'blazer', 'navy blue') === 'navy blue blazer');
    assert(G.shortCore(['dusty rose', 'rose-and-slumber-inspired'], 'cardigan', 'dusty rose') === 'rose-and-slumber-inspired cardigan in dusty rose');
  });
})(typeof window !== 'undefined' ? window : global);
