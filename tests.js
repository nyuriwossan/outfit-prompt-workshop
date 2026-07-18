/* 衣装プロンプト工房 / tests.js
 * Phase 1 のロジックテスト。tests.html から実行する。
 * 保存テストは store の入出力をメモリに差し替えて行うので、実データを壊さない。
 */
(function (global) {
  'use strict';
  var CPW = global.CPW;
  var D = CPW.data;
  var U = CPW.util;

  var tests = [];
  function test(name, fn) { tests.push({ name: name, fn: fn }); }

  function assert(cond, msg) { if (!cond) throw new Error(msg || '偽になった'); }
  function eq(a, b, msg) {
    if (a !== b) throw new Error((msg || '不一致') + '：期待 ' + JSON.stringify(b) + ' / 実際 ' + JSON.stringify(a));
  }

  /* ---- store をメモリへ差し替える ---- */
  var mem = {};
  function sandbox(fn) {
    var read = CPW.store._read, write = CPW.store._write;
    mem = {};
    CPW.store._read = function (k, f) { return k in mem ? JSON.parse(mem[k]) : f; };
    CPW.store._write = function (k, v) { mem[k] = JSON.stringify(v); return true; };
    try { fn(); } finally { CPW.store._read = read; CPW.store._write = write; }
  }

  /* ============ util ============ */
  test('esc：HTMLの特殊文字を無害化する', function () {
    eq(U.esc('<img src=x onerror="a">'), '&lt;img src=x onerror=&quot;a&quot;&gt;');
  });
  test('esc：nullは空文字になる', function () { eq(U.esc(null), ''); });
  test('deepMerge：入れ子を壊さず合成する', function () {
    var r = U.deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 9 } });
    eq(r.a.x, 1); eq(r.a.y, 9);
  });
  test('deepMerge：配列は置き換える（連結しない）', function () {
    var r = U.deepMerge({ a: [1, 2] }, { a: [3] });
    eq(r.a.length, 1); eq(r.a[0], 3);
  });
  test('deepMerge：元のオブジェクトを書き換えない', function () {
    var base = { a: { x: 1 } };
    U.deepMerge(base, { a: { x: 2 } });
    eq(base.a.x, 1);
  });
  test('getPath / setPath：深い階層へ届く', function () {
    var o = {};
    U.setPath(o, 'a.b.c', 5);
    eq(U.getPath(o, 'a.b.c'), 5);
    eq(U.getPath(o, 'a.z.c'), undefined);
  });
  test('byId：見つからなければnull', function () {
    eq(U.byId(D.colors, 'no_such_color'), null);
    eq(U.byId(D.colors, 'jet_black').labelJa, '漆黒');
  });
  test('labelOf：未設定は空文字', function () { eq(U.labelOf(D.worldviews, null), ''); });

  /* ============ schema ============ */
  test('createOutfit：versionとidを持つ', function () {
    var o = CPW.schema.createOutfit();
    eq(o.version, CPW.SCHEMA_VERSION);
    assert(/^outfit_/.test(o.id));
  });
  test('createOutfit：idは毎回異なる', function () {
    assert(CPW.schema.createOutfit().id !== CPW.schema.createOutfit().id);
  });
  test('createOutfit：属性の反映先の初期値は仕様どおり（演出とシルエットはOFF）', function () {
    var a = CPW.schema.createOutfit().concept.attribute.applyTo;
    eq(a.colors, true); eq(a.materials, true); eq(a.decorations, true);
    eq(a.silhouette, false); eq(a.effects, false);
  });
  test('createOutfit：主テーマと主役装飾モチーフは別フィールド', function () {
    var o = CPW.schema.createOutfit();
    assert('primaryThemeMotif' in o.concept, 'concept.primaryThemeMotif が無い');
    assert('focalMotif' in o.decorations, 'decorations.focalMotif が無い');
    assert(!('primaryMotif' in o.concept), '旧名 concept.primaryMotif が残っている');
    assert(!('primaryMotif' in o.decorations), '旧名 decorations.primaryMotif が残っている');
  });
  test('normalize：欠けたキーを既定値で補う', function () {
    var o = CPW.schema.normalize({ concept: { worldview: 'japanese' }, garment: {} });
    eq(o.concept.worldview, 'japanese');
    eq(o.decorations.density, 2);
    eq(o.palette.primary, null);
  });
  test('normalize：未知のスロットは捨てる', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { collar: 'high_standing_collar', bogus_slot: 'x' } });
    eq(o.parts.collar, 'high_standing_collar');
    assert(!('bogus_slot' in o.parts));
  });
  test('normalize：複数スロットの文字列は {id, layer} になる', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { legwear: ['thigh_high_stockings'] } });
    eq(o.parts.legwear[0].id, 'thigh_high_stockings');
    eq(o.parts.legwear[0].layer, 'main');
  });
  test('normalize：複数スロットのlayer指定は保つ（重ね着の識別）', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { legwear: [{ id: 'thigh_high_stockings', layer: 'inner' }, { id: 'lace_socks', layer: 'outer' }] } });
    eq(o.parts.legwear[0].layer, 'inner');
    eq(o.parts.legwear[1].layer, 'outer');
  });
  test('normalize：装飾密度は0〜5に丸める', function () {
    eq(CPW.schema.normalize({ concept: {}, garment: {}, decorations: { density: 99 } }).decorations.density, 5);
    eq(CPW.schema.normalize({ concept: {}, garment: {}, decorations: { density: -3 } }).decorations.density, 0);
    eq(CPW.schema.normalize({ concept: {}, garment: {}, decorations: { density: 'abc' } }).decorations.density, 2);
  });
  test('normalize：配列であるべき項目が壊れていても直す', function () {
    var o = CPW.schema.normalize({ concept: { secondaryStyles: 'gothic' }, garment: {}, materials: { patterns: null } });
    assert(Array.isArray(o.concept.secondaryStyles));
    assert(Array.isArray(o.materials.patterns));
  });
  test('normalize：nameが文字列でなければ空にする', function () {
    eq(CPW.schema.normalize({ concept: {}, garment: {}, name: 123 }).name, '');
  });

  /* ============ validate / migrate ============ */
  test('validate：オブジェクトでなければ拒否する', function () {
    var r = CPW.schema.validate('文字列');
    eq(r.ok, false); assert(r.reasonJa);
  });
  test('validate：concept/garmentが無ければ拒否する', function () {
    eq(CPW.schema.validate({ foo: 1 }).ok, false);
  });
  test('validate：将来バージョンは拒否する', function () {
    eq(CPW.schema.validate({ concept: {}, garment: {}, version: '9.0' }).ok, false);
  });
  test('validate：正しいデータは通す', function () {
    eq(CPW.schema.validate(CPW.schema.createOutfit()).ok, true);
  });
  test('migrate：version無しのデータを補って通す', function () {
    var r = CPW.schema.migrate({ concept: { worldview: 'modern' }, garment: {} });
    eq(r.ok, true); eq(r.migrated, true); eq(r.outfit.version, CPW.SCHEMA_VERSION);
  });
  test('migrate：壊れたデータは理由付きで落とす', function () {
    var r = CPW.schema.migrate(null);
    eq(r.ok, false); assert(r.reasonJa);
  });

  /* ============ applyPatch / presets ============ */
  test('applyPatch：パッチにない項目は保持する', function () {
    var o = CPW.schema.createOutfit();
    o.name = '既存の名前';
    var r = CPW.schema.applyPatch(o, { concept: { worldview: 'chinese' } });
    eq(r.name, '既存の名前'); eq(r.concept.worldview, 'chinese');
  });
  test('applyPatch：プリセットが整合した初期値を入れる', function () {
    var p = U.byId(D.presets, 'royalty');
    var r = CPW.schema.applyPatch(CPW.schema.createOutfit(), p.patch);
    eq(r.garment.category, 'uniform');
    eq(r.garment.subtype, 'royal_uniform');
    eq(r.parts.collar, 'high_standing_collar');
    eq(r.palette.primary, 'pure_white');
  });
  test('applyPatch：プリセットの文字列legwearも正規化される', function () {
    var p = U.byId(D.presets, 'maid_butler');
    var r = CPW.schema.applyPatch(CPW.schema.createOutfit(), p.patch);
    eq(r.parts.legwear[0].id, 'knee_socks');
    eq(r.parts.legwear[0].layer, 'main');
  });

  /* ============ progress ============ */
  function caseA() {
    var o = CPW.schema.createOutfit();
    o.name = 'ケースA：透ける黒レース衣装';
    o.garment.category = 'lingerie';
    o.garment.subtype = 'lace_bodysuit';
    o.garment.wearRole = 'main_outfit';
    o.silhouette.fit = 'fitted';
    o.parts.lingerie_form = 'one_piece_lingerie';
    o.parts.collar = 'high_standing_collar';
    o.parts.sleeves = 'fitted_long_sleeves';
    o.parts.handwear = { type: 'hand_gloves', material: 'lace_hand', length: 'elbow_length', fingertips: 'fingerless' };
    o.parts.garter = 'garter_details';
    o.parts.legwear = [{ id: 'thigh_high_stockings', layer: 'main' }];
    o.materials.primary = 'lace';
    o.materials.transparency = 'sheer';
    o.materials.patterns = ['floral_lace_pattern'];
    o.palette.primary = 'jet_black';
    o.palette.accent = 'polished_silver';
    o.palette.scheme = 'monochrome';
    return CPW.schema.normalize(o);
  }


  test('progress：空の設計は0％', function () {
    eq(CPW.progress.compute(CPW.schema.createOutfit()).percent, 0);
  });
  test('progress：母数はrequiredだけ（中核5項目）', function () {
    var p = CPW.progress.compute(CPW.schema.createOutfit());
    eq(p.total, 5);
    eq(p.missing.join('・'), '基本衣装の大分類・基本衣装・シルエット・主素材・主色');
  });
  test('progress：基本衣装を選ぶと requiredSlots の分だけ母数が増える', function () {
    var base = CPW.progress.compute(CPW.schema.createOutfit()).total;
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'dress' } });
    var req = U.byId(D.garmentCategories, 'dress').requiredSlots;
    eq(CPW.progress.compute(o).total, base + req.length);
  });
  test('progress：recommendedスロットは母数に入らない', function () {
    var cat = U.byId(D.garmentCategories, 'dress');
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'dress' } });
    var p = CPW.progress.compute(o);
    assert(cat.recommendedSlots.length > 0, '推奨スロットが定義されていない');
    cat.recommendedSlots.forEach(function (s) {
      var slot = U.byId(D.partSlots, s);
      eq(p.missing.indexOf(slot.labelJa), -1, '推奨が不足表示に混ざっている：' + slot.labelJa);
    });
  });
  test('progress：optionalスロットは母数にも不足表示にも入らない', function () {
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'lingerie', subtype: 'lace_bodysuit' } });
    var p = CPW.progress.compute(o);
    ['ガーター', '羽織り', '袖口', '肩'].forEach(function (label) {
      eq(p.missing.indexOf(label), -1, '任意項目が不足表示に混ざっている：' + label);
    });
  });
  test('progress：宝石色・特殊パーツ・出力オプションは母数に入らない', function () {
    var o = CPW.schema.createOutfit();
    var before = CPW.progress.compute(o).total;
    o.palette.gem = 'sapphire_blue';
    o.specialParts.wings = { type: 'feathered_wings' };
    o.output.includeNarrative = true;
    eq(CPW.progress.compute(o).total, before);
  });
  test('progress：ドレスと水着で不足の中身が違う', function () {
    var d = CPW.progress.compute(CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'dress' } })).missing;
    var s = CPW.progress.compute(CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'swimwear' } })).missing;
    assert(d.indexOf('スカート形状') >= 0 && s.indexOf('スカート形状') < 0, 'カテゴリ別のrequiredが効いていない');
    assert(s.indexOf('水着の型') >= 0, '水着の型がrequiredに入っていない');
  });
  test('progress：サブタイプのrequiredSlotsが大分類より優先される', function () {
    var cat = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'lingerie', subtype: 'bra_and_briefs' } });
    var sub = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'lingerie', subtype: 'lace_bodysuit' } });
    assert(CPW.progress.compute(cat).missing.indexOf('下着の型') >= 0, '大分類のrequiredが効いていない');
    eq(CPW.progress.compute(sub).missing.indexOf('下着の型'), -1, 'サブタイプの上書きが効いていない');
  });
  test('progress：サブタイプのrequiredFields（透け感）が母数に入る', function () {
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'lingerie', subtype: 'lace_bodysuit' } });
    assert(CPW.progress.compute(o).missing.indexOf('透け感') >= 0, '透け感がrequiredに入っていない');
  });
  test('progress：埋めた分だけ充足数が増える', function () {
    var o = CPW.schema.createOutfit();
    var a = CPW.progress.compute(o).filled;
    o.palette.primary = 'jet_black';
    eq(CPW.progress.compute(o).filled, a + 1);
  });
  test('progress：未設定の項目名を返す', function () {
    var p = CPW.progress.compute(CPW.schema.createOutfit());
    assert(p.missing.indexOf('主色') >= 0);
  });
  test('progress：ケースAは基本設計100％になる', function () {
    var p = CPW.progress.compute(caseA());
    eq(p.percent, 100, '不足：' + p.missing.join('・'));
  });
  test('progress：プリセットは50％以上を埋める', function () {
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), U.byId(D.presets, 'royalty').patch);
    assert(CPW.progress.compute(o).percent >= 50, '王族プリセットの充足率が低すぎる');
  });
  test('progress：recommendedは補助候補として別に返る', function () {
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'dress' } });
    var rec = CPW.progress.recommended(o);
    assert(rec.length > 0, '補助候補が空');
    assert(rec.some(function (r) { return r.labelJa === '世界観'; }), '世界観が補助候補に無い');
    assert(rec.some(function (r) { return r.slotId === 'sleeves'; }), '袖が補助候補に無い');
    assert(!rec.some(function (r) { return r.slotId === 'skirt_shape'; }), 'requiredが補助候補に混ざっている');
  });
  test('progress：埋めた推奨は補助候補から消える', function () {
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'dress' }, parts: { sleeves: 'bell_sleeves' } });
    assert(!CPW.progress.recommended(o).some(function (r) { return r.slotId === 'sleeves'; }));
  });
  test('slotTier：required / recommended / optional を返す', function () {
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'lingerie', subtype: 'lace_bodysuit' } });
    eq(CPW.slotTier(o, 'garter'), 'optional');
    eq(CPW.slotTier(o, 'sleeves'), 'recommended');
    var d = CPW.schema.applyPatch(CPW.schema.createOutfit(), { garment: { category: 'dress' } });
    eq(CPW.slotTier(d, 'skirt_shape'), 'required');
  });
  test('データ：requiredSlots / recommendedSlots は slots の中に含まれる', function () {
    D.garmentCategories.forEach(function (c) {
      (c.requiredSlots || []).concat(c.recommendedSlots || []).forEach(function (s) {
        assert(c.slots.indexOf(s) >= 0, c.id + ' の ' + s + ' が slots に無い');
      });
    });
    D.garments.forEach(function (g) {
      var cat = U.byId(D.garmentCategories, g.category);
      (g.requiredSlots || []).concat(g.recommendedSlots || []).forEach(function (s) {
        assert(cat.slots.indexOf(s) >= 0, g.id + ' の ' + s + ' が大分類の slots に無い');
      });
    });
  });
  test('データ：requiredSlots と recommendedSlots は重ならない', function () {
    D.garmentCategories.forEach(function (c) {
      (c.requiredSlots || []).forEach(function (s) {
        eq((c.recommendedSlots || []).indexOf(s), -1, c.id + '：' + s + ' が required と recommended の両方にある');
      });
    });
  });

  /* ============ store ============ */
  test('store：下書きを保存して復元できる', function () {
    sandbox(function () {
      var o = CPW.schema.createOutfit();
      o.name = '下書きの一着';
      CPW.store.saveDraft(o);
      eq(CPW.store.loadDraft().name, '下書きの一着');
    });
  });
  test('store：下書きが無ければnull', function () {
    sandbox(function () { eq(CPW.store.loadDraft(), null); });
  });
  test('store：壊れた下書きでも落ちずにnullを返す', function () {
    sandbox(function () {
      mem['cpw:draft:v1'] = JSON.stringify({ ゴミ: true });
      eq(CPW.store.loadDraft(), null);
    });
  });
  test('store：名前を付けて保存すると一覧に出る', function () {
    sandbox(function () {
      var o = CPW.schema.createOutfit(); o.name = '一着目';
      CPW.store.saveOutfit(o);
      eq(CPW.store.listOutfits().length, 1);
      eq(CPW.store.listOutfits()[0].name, '一着目');
    });
  });
  test('store：同じidを二度保存しても増えない（上書き）', function () {
    sandbox(function () {
      var o = CPW.schema.createOutfit(); o.name = 'A';
      CPW.store.saveOutfit(o);
      o.name = 'B';
      CPW.store.saveOutfit(o);
      eq(CPW.store.listOutfits().length, 1);
      eq(CPW.store.listOutfits()[0].name, 'B');
    });
  });
  test('store：無名で保存すると既定名が付く', function () {
    sandbox(function () {
      CPW.store.saveOutfit(CPW.schema.createOutfit());
      eq(CPW.store.listOutfits()[0].name, '名称未設定の衣装');
    });
  });
  test('store：複製は別idになり、元は残る', function () {
    sandbox(function () {
      var o = CPW.schema.createOutfit(); o.name = '原本';
      CPW.store.saveOutfit(o);
      var c = CPW.store.duplicateOutfit(o.id);
      assert(c.id !== o.id);
      eq(c.name, '原本の複製');
      eq(CPW.store.listOutfits().length, 2);
    });
  });
  test('store：削除は対象だけ消す', function () {
    sandbox(function () {
      var a = CPW.schema.createOutfit(); a.name = 'A'; CPW.store.saveOutfit(a);
      var b = CPW.schema.createOutfit(); b.name = 'B'; CPW.store.saveOutfit(b);
      CPW.store.removeOutfit(a.id);
      eq(CPW.store.listOutfits().length, 1);
      eq(CPW.store.listOutfits()[0].name, 'B');
    });
  });
  test('store：一覧は更新日の新しい順に並ぶ', function () {
    sandbox(function () {
      var a = CPW.schema.createOutfit(); a.name = '古い'; a.updatedAt = '2020-01-01T00:00:00.000Z';
      CPW.store._write('cpw:library:v1', [a]);
      var b = CPW.schema.createOutfit(); b.name = '新しい';
      CPW.store.saveOutfit(b);
      eq(CPW.store.listOutfits()[0].name, '新しい');
    });
  });

  /* ============ export / import ============ */
  test('export→import：単体の衣装が往復する', function () {
    sandbox(function () {
      var o = CPW.schema.createOutfit();
      o.name = '往復する一着'; o.concept.worldview = 'dark_fantasy';
      var json = CPW.store.exportOutfit(o);
      var r = CPW.store.importJSON(json);
      eq(r.ok, true); eq(r.imported, 1);
      eq(CPW.store.listOutfits()[0].concept.worldview, 'dark_fantasy');
    });
  });
  test('export→import：全件バックアップが往復する', function () {
    sandbox(function () {
      var a = CPW.schema.createOutfit(); a.name = 'A'; CPW.store.saveOutfit(a);
      var b = CPW.schema.createOutfit(); b.name = 'B'; CPW.store.saveOutfit(b);
      var json = CPW.store.exportAll();
      mem = {};
      var r = CPW.store.importJSON(json);
      eq(r.ok, true); eq(r.imported, 2);
    });
  });
  test('import：取り込んだ衣装には新しいidが振られる（既存を潰さない）', function () {
    sandbox(function () {
      var o = CPW.schema.createOutfit(); o.name = '元';
      CPW.store.saveOutfit(o);
      CPW.store.importJSON(CPW.store.exportOutfit(o));
      eq(CPW.store.listOutfits().length, 2);
    });
  });
  test('import：JSONとして壊れていても落ちず、理由を返す', function () {
    sandbox(function () {
      var r = CPW.store.importJSON('{ これはJSONではない ');
      eq(r.ok, false); assert(r.reasonJa);
    });
  });
  test('import：衣装データでないJSONは理由付きで断る', function () {
    sandbox(function () {
      var r = CPW.store.importJSON('{"hello":"world"}');
      eq(r.ok, false); assert(r.reasonJa);
    });
  });
  test('import：一部が壊れていても、読める分だけ取り込む', function () {
    sandbox(function () {
      var good = CPW.schema.createOutfit(); good.name = '無事';
      var json = JSON.stringify({ type: 'cpw-library', outfits: [good, { ゴミ: 1 }] });
      var r = CPW.store.importJSON(json);
      eq(r.ok, true); eq(r.imported, 1); eq(r.skipped, 1);
    });
  });

  /* ============ router ============ */
  test('parseHash：空はトップ', function () {
    eq(CPW.parseHash('').route, ''); eq(CPW.parseHash('#/').route, '');
  });
  test('parseHash：一段のルート', function () { eq(CPW.parseHash('#/entry').route, '/entry'); });
  test('parseHash：パラメータを切り出す', function () {
    var p = CPW.parseHash('#/setup/preset');
    eq(p.route, '/setup'); eq(p.params[0], 'preset');
  });

  /* ============ データ整合 ============ */
  test('データ：衣装のcategoryはすべて実在する', function () {
    D.garments.forEach(function (g) {
      assert(U.byId(D.garmentCategories, g.category), g.id + ' の category が無い：' + g.category);
    });
  });
  test('データ：categoryのslotsはすべて実在する', function () {
    D.garmentCategories.forEach(function (c) {
      c.slots.forEach(function (s) {
        assert(U.byId(D.partSlots, s), c.id + ' が未定義スロットを参照：' + s);
      });
    });
  });
  test('データ：色のfamilyとtoneは定義済みの値だけ', function () {
    D.colors.forEach(function (c) {
      assert(U.byId(D.colorFamilies, c.family), c.id + ' の family が不正：' + c.family);
      assert(U.byId(D.colorTones, c.tone), c.id + ' の tone が不正：' + c.tone);
    });
  });
  test('データ：色のrecommendedWithはすべて実在する色', function () {
    D.colors.forEach(function (c) {
      (c.recommendedWith || []).forEach(function (id) {
        assert(U.byId(D.colors, id), c.id + ' が未定義の色を推奨：' + id);
      });
    });
  });
  test('データ：属性のcolorsはすべて実在する色', function () {
    D.attributes.forEach(function (a) {
      a.colors.forEach(function (id) { assert(U.byId(D.colors, id), a.id + ' が未定義の色を参照：' + id); });
    });
  });
  test('データ：属性は9件', function () { eq(D.attributes.length, 9); });
  test('データ：モチーフのgroupはすべて実在する', function () {
    D.motifs.forEach(function (m) { assert(U.byId(D.motifGroups, m.group), m.id + ' の group が不正'); });
  });
  test('データ：モチーフの推奨色はすべて実在する', function () {
    D.motifs.forEach(function (m) {
      (m.suggestedColors || []).forEach(function (id) { assert(U.byId(D.colors, id), m.id + ' が未定義の色を参照：' + id); });
    });
  });
  test('データ：プリセットのpatchが参照するidはすべて実在する', function () {
    D.presets.forEach(function (p) {
      var c = p.patch.concept || {}, g = p.patch.garment || {}, pl = p.patch.palette || {}, mt = p.patch.materials || {};
      if (c.worldview) assert(U.byId(D.worldviews, c.worldview), p.id + '：worldview ' + c.worldview);
      if (c.role) assert(U.byId(D.roles, c.role), p.id + '：role ' + c.role);
      if (c.primaryStyle) assert(U.byId(D.styles, c.primaryStyle), p.id + '：primaryStyle ' + c.primaryStyle);
      if (g.category) assert(U.byId(D.garmentCategories, g.category), p.id + '：category ' + g.category);
      if (g.subtype) assert(U.byId(D.garments, g.subtype), p.id + '：subtype ' + g.subtype);
      if (mt.primary) assert(U.byId(D.materials, mt.primary), p.id + '：material ' + mt.primary);
      ['primary', 'secondary', 'accent', 'metal', 'gem'].forEach(function (k) {
        if (pl[k]) assert(U.byId(D.colors, pl[k]), p.id + '：color ' + pl[k]);
      });
    });
  });
  test('データ：プリセットのparts値は該当スロットに実在する', function () {
    D.presets.forEach(function (p) {
      var parts = p.patch.parts || {};
      Object.keys(parts).forEach(function (slotId) {
        var slot = U.byId(D.partSlots, slotId);
        assert(slot, p.id + '：未定義スロット ' + slotId);
        var kind = CPW.schema.slotKind(slot);
        if (kind === 'composite') {
          Object.keys(parts[slotId]).forEach(function (axisKey) {
            var axis = CPW.schema.axisOf(slot, axisKey);
            assert(axis, p.id + '：' + slotId + ' に無い軸 ' + axisKey);
            var v = parts[slotId][axisKey];
            if (v) assert(U.byId(axis.options, v), p.id + '：' + slotId + '.' + axisKey + ' に無い値 ' + v);
          });
          return;
        }
        var vals = Array.isArray(parts[slotId]) ? parts[slotId] : [parts[slotId]];
        vals.forEach(function (v) {
          var id = U.isPlainObject(v) ? v.id : v;
          assert(U.byId(slot.options, id), p.id + '：' + slotId + ' に無い値 ' + id);
        });
      });
    });
  });

  test('データ：装飾の推奨位置はすべて実在する', function () {
    D.decorations.forEach(function (d) {
      (d.recommendedPlacements || []).forEach(function (p) {
        assert(U.byId(D.decorationPlacements, p), d.id + ' が未定義の装飾位置を参照：' + p);
      });
    });
  });
  test('データ：ルールのidは重複しない', function () {
    var seen = {};
    D.rules.forEach(function (r) { assert(!seen[r.id], 'ルールid重複：' + r.id); seen[r.id] = true; });
  });
  test('データ：ルールのseverityはhard/warning/infoのみ', function () {
    D.rules.forEach(function (r) {
      assert(['hard', 'warning', 'info'].indexOf(r.severity) >= 0, r.id + ' のseverityが不正');
    });
  });
  test('データ：全idがカテゴリ内で一意', function () {
    [D.colors, D.worldviews, D.roles, D.styles, D.garments, D.materials, D.decorations, D.motifs, D.attributes, D.presets, D.partSlots].forEach(function (list) {
      var seen = {};
      list.forEach(function (o) { assert(!seen[o.id], 'id重複：' + o.id); seen[o.id] = true; });
    });
  });
  test('データ：装飾量の語は装飾密度の語と衝突しない', function () {
    var densityIds = D.decorationDensity.map(function (d) { return d.id; });
    D.decorationQuantities.forEach(function (q) {
      assert(densityIds.indexOf(q.id) < 0, '装飾量と密度で語が衝突：' + q.id);
    });
  });
  test('データ：手袋は4軸に分解されている（合成IDではない）', function () {
    var slot = U.byId(D.partSlots, 'handwear');
    assert(slot, 'handwearスロットが無い');
    eq(CPW.schema.slotKind(slot), 'composite');
    ['type', 'material', 'length', 'fingertips'].forEach(function (k) {
      assert(CPW.schema.axisOf(slot, k), '軸が無い：' + k);
    });
    eq(slot.requiredAxis, 'type');
  });
  test('データ：ケースAに必要な手袋の要素が各軸に揃っている', function () {
    var slot = U.byId(D.partSlots, 'handwear');
    assert(U.byId(CPW.schema.axisOf(slot, 'type').options, 'hand_gloves'), '種類：手袋が無い');
    assert(U.byId(CPW.schema.axisOf(slot, 'material').options, 'lace_hand'), '素材：レースが無い');
    assert(U.byId(CPW.schema.axisOf(slot, 'length').options, 'elbow_length'), '長さ：肘丈が無い');
    assert(U.byId(CPW.schema.axisOf(slot, 'fingertips').options, 'fingerless'), '指先：指なしが無い');
  });
  test('データ：旧い合成手袋IDはどの軸にも残っていない', function () {
    var slot = U.byId(D.partSlots, 'handwear');
    var legacy = Object.keys(slot.legacyMap);
    assert(legacy.length > 0, 'legacyMapが空');
    legacy.forEach(function (oldId) {
      slot.axes.forEach(function (a) {
        assert(!U.byId(a.options, oldId), '旧合成IDが選択肢に残っている：' + oldId);
      });
    });
  });
  test('データ：legacyMapの変換先はすべて実在する軸の値', function () {
    var slot = U.byId(D.partSlots, 'handwear');
    Object.keys(slot.legacyMap).forEach(function (oldId) {
      var m = slot.legacyMap[oldId];
      Object.keys(m).forEach(function (k) {
        if (m[k] == null) return;
        var axis = CPW.schema.axisOf(slot, k);
        assert(axis && U.byId(axis.options, m[k]), oldId + ' の変換先が不正：' + k + '=' + m[k]);
      });
    });
  });
  test('データ：装飾の役割は 主役／補助／縁取り の3種', function () {
    eq(D.decorationRoles.length, 3);
    ['focal', 'support', 'trim'].forEach(function (id) { assert(U.byId(D.decorationRoles, id), '役割が無い：' + id); });
  });
  test('データ：層は日本語表記を持つ', function () {
    eq(U.labelOf(D.partLayers, 'inner'), '内側');
    eq(U.labelOf(D.partLayers, 'main'), '主衣装');
    eq(U.labelOf(D.partLayers, 'outer'), '外側');
  });
  test('データ：legwearは複数選択できる（重複警告の前提）', function () {
    eq(U.byId(D.partSlots, 'legwear').multi, true);
  });
  test('データ：拘束チェーンはnarrative印を持つ（衣装のみ出力で除外するため）', function () {
    D.specialParts.restraintChains.forEach(function (c) { eq(c.narrative, true, c.id); });
  });
  test('データ：装飾チェーンはnarrative印を持たない', function () {
    D.specialParts.decorativeChains.forEach(function (c) { assert(!c.narrative, c.id); });
  });


  /* ============ Phase 2：手袋の4軸 ============ */
  function handwearSlot() { return U.byId(D.partSlots, 'handwear'); }
  var GLOVES_A = { type: 'hand_gloves', material: 'lace_hand', length: 'elbow_length', fingertips: 'fingerless' };

  test('手袋：4軸を個別に保持できる', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { handwear: GLOVES_A } });
    eq(o.parts.handwear.type, 'hand_gloves');
    eq(o.parts.handwear.material, 'lace_hand');
    eq(o.parts.handwear.length, 'elbow_length');
    eq(o.parts.handwear.fingertips, 'fingerless');
  });
  test('手袋：軸に無い値は捨てる', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { handwear: { type: 'hand_gloves', material: 'にせ素材' } } });
    eq(o.parts.handwear.type, 'hand_gloves');
    eq(o.parts.handwear.material, null);
  });
  test('手袋：種類が未選択なら有効値はnull（従属情報を出力へ混ぜない）', function () {
    var v = { type: null, material: 'lace_hand', length: 'elbow_length', fingertips: 'fingerless' };
    eq(CPW.schema.activeComposite(handwearSlot(), v), null);
    eq(CPW.schema.compositeToPhrase(handwearSlot(), v), null);
  });
  test('手袋：種類が未選択でも従属軸は休止として保持される', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { handwear: { type: null, material: 'lace_hand', length: 'elbow_length' } } });
    eq(o.parts.handwear.material, 'lace_hand');
    eq(o.parts.handwear.length, 'elbow_length');
  });
  test('手袋：種類を選び直すと休止していた指定がそのまま戻る', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { handwear: { type: null, material: 'lace_hand', length: 'elbow_length', fingertips: 'fingerless' } } });
    o.parts.handwear.type = 'hand_gloves';
    var active = CPW.schema.activeComposite(handwearSlot(), o.parts.handwear);
    eq(active.material, 'lace_hand'); eq(active.length, 'elbow_length'); eq(active.fingertips, 'fingerless');
  });
  test('手袋：種類が未選択なら完成度の充足に数えない', function () {
    eq(CPW.schema.isSlotFilled(handwearSlot(), { type: null, material: 'lace_hand' }), false);
    eq(CPW.schema.isSlotFilled(handwearSlot(), GLOVES_A), true);
  });
  test('手袋：一つの句の材料へ畳める（Phase 3へ引き継ぐ形）', function () {
    var ph = CPW.schema.compositeToPhrase(handwearSlot(), GLOVES_A);
    eq(ph.head, 'gloves');
    eq(ph.modifiers.join(' '), 'elbow-length fingerless lace');
    eq((ph.modifiers.join(' ') + ' ' + ph.head), 'elbow-length fingerless lace gloves');
  });
  test('手袋：一般語と具体語を重複させない', function () {
    var ph = CPW.schema.compositeToPhrase(handwearSlot(), GLOVES_A);
    eq(ph.modifiers.indexOf('gloves'), -1, 'modifierに一般語が混ざっている');
    eq(ph.modifiers.filter(function (m) { return m === 'lace'; }).length, 1);
  });
  test('手袋：アームウォーマーでは指先軸を含めない', function () {
    var v = { type: 'hand_arm_warmers', material: 'knit_hand', length: 'elbow_length', fingertips: 'fingerless' };
    var active = CPW.schema.activeComposite(handwearSlot(), v);
    assert(!('fingertips' in active), '指先が混ざっている');
    eq(CPW.schema.compositeToPhrase(handwearSlot(), v).head, 'arm warmers');
  });
  test('手袋：旧合成IDは新構造へ移行される', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { handwear: 'lace_gloves_elbow_fingerless' } });
    eq(o.parts.handwear.type, 'hand_gloves');
    eq(o.parts.handwear.material, 'lace_hand');
    eq(o.parts.handwear.length, 'elbow_length');
    eq(o.parts.handwear.fingertips, 'fingerless');
    eq(typeof o.parts.handwear, 'object', '旧形式の文字列が残っている');
  });
  test('手袋：未知の文字列IDは空の複合値になる（壊れない）', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { handwear: 'nonexistent_glove' } });
    eq(o.parts.handwear, undefined);
  });
  test('手袋：プリセットの手袋が新構造で入る', function () {
    var r = CPW.schema.applyPatch(CPW.schema.createOutfit(), U.byId(D.presets, 'royalty').patch);
    eq(r.parts.handwear.type, 'hand_gloves');
    eq(r.parts.handwear.length, 'wrist_length');
    var k = CPW.schema.applyPatch(CPW.schema.createOutfit(), U.byId(D.presets, 'knight').patch);
    eq(k.parts.handwear.type, 'hand_gauntlets');
    eq(k.parts.handwear.material, 'leather_hand');
  });

  /* ============ Phase 2：スロットの切り替え ============ */
  test('スロット：ドレスと水着とランジェリーで必要項目が違う', function () {
    var d = U.byId(D.garmentCategories, 'dress').slots;
    var s = U.byId(D.garmentCategories, 'swimwear').slots;
    var l = U.byId(D.garmentCategories, 'lingerie').slots;
    assert(d.join() !== s.join() && s.join() !== l.join(), '表示項目が切り替わっていない');
  });
  test('スロット：ドレスに水着専用の項目は出ない', function () {
    var d = U.byId(D.garmentCategories, 'dress').slots;
    ['swim_form', 'leg_opening', 'coverage'].forEach(function (s) { eq(d.indexOf(s), -1, 'ドレスに ' + s + ' が混ざっている'); });
  });
  test('スロット：水着に水着専用の項目が出る', function () {
    var s = U.byId(D.garmentCategories, 'swimwear').slots;
    ['swim_form', 'straps', 'back', 'leg_opening', 'coverage', 'cover_up'].forEach(function (x) { assert(s.indexOf(x) >= 0, '水着に ' + x + ' が無い'); });
  });
  test('スロット：ランジェリーにガーター・下着型・手袋が出る', function () {
    var l = U.byId(D.garmentCategories, 'lingerie').slots;
    ['lingerie_form', 'top_structure', 'bottom_structure', 'garter', 'handwear', 'legwear'].forEach(function (x) { assert(l.indexOf(x) >= 0, 'ランジェリーに ' + x + ' が無い'); });
  });
  test('スロット：充足判定は種別ごとに正しい', function () {
    eq(CPW.schema.isSlotFilled(U.byId(D.partSlots, 'legwear'), []), false);
    eq(CPW.schema.isSlotFilled(U.byId(D.partSlots, 'legwear'), [{ id: 'lace_socks', layer: 'main' }]), true);
    eq(CPW.schema.isSlotFilled(U.byId(D.partSlots, 'collar'), null), false);
    eq(CPW.schema.isSlotFilled(U.byId(D.partSlots, 'collar'), 'high_standing_collar'), true);
  });

  /* ============ Phase 2：レッグウェアの層 ============ */
  test('レッグウェア：層を分けた重ね着を保持する', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { legwear: [
      { id: 'thigh_high_stockings', layer: 'inner' }, { id: 'lace_socks', layer: 'outer' }
    ] } });
    eq(o.parts.legwear.length, 2);
    eq(o.parts.legwear[0].layer, 'inner');
    eq(o.parts.legwear[1].layer, 'outer');
  });
  test('レッグウェア：不正な層は主衣装へ落とす', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { legwear: [{ id: 'lace_socks', layer: 'どこか' }] } });
    eq(o.parts.legwear[0].layer, 'main');
  });
  test('レッグウェア：実在しない選択肢は捨てる', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, parts: { legwear: [{ id: 'にせ靴下', layer: 'main' }] } });
    assert(!('legwear' in o.parts));
  });

  /* ============ Phase 2：装飾 ============ */
  test('装飾：種類と位置の対応が一件ごとに保たれる', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, decorations: { items: [
      { type: 'silver_embroidery', placements: ['collar', 'cuffs'], role: 'focal', size: 'medium', quantity: 'many' },
      { type: 'sapphire_brooch', placements: ['chest'], role: 'support', size: 'small', quantity: 'single' }
    ] } });
    eq(o.decorations.items.length, 2);
    eq(o.decorations.items[0].placements.join(), 'collar,cuffs');
    eq(o.decorations.items[1].placements.join(), 'chest');
    eq(o.decorations.items[0].type, 'silver_embroidery');
  });
  test('装飾：主役装飾モチーフはコンセプトの主テーマと混ざらない', function () {
    var o = CPW.schema.normalize({ concept: { primaryThemeMotif: 'norse_mythology' }, garment: {}, decorations: { focalMotif: 'crystal_embroidery' } });
    eq(o.concept.primaryThemeMotif, 'norse_mythology');
    eq(o.decorations.focalMotif, 'crystal_embroidery');
  });

  /* ============ Phase 2：配色 ============ */
  test('配色：5つの役割が混線しない', function () {
    var o = CPW.schema.normalize({ concept: {}, garment: {}, palette: {
      primary: 'jet_black', secondary: 'ash_gray', accent: 'polished_silver', metal: 'oxidized_silver', gem: 'amethyst_violet', scheme: 'monochrome'
    } });
    eq(o.palette.primary, 'jet_black');
    eq(o.palette.secondary, 'ash_gray');
    eq(o.palette.accent, 'polished_silver');
    eq(o.palette.metal, 'oxidized_silver');
    eq(o.palette.gem, 'amethyst_violet');
    eq(o.palette.scheme, 'monochrome');
  });
  test('配色：色の役割は主色70・副色20・差し色10の目安を持つ', function () {
    eq(U.byId(D.colorRoles, 'primary').share, 70);
    eq(U.byId(D.colorRoles, 'secondary').share, 20);
    eq(U.byId(D.colorRoles, 'accent').share, 10);
  });

  /* ============ Phase 2：ケースA ============ */
  test('ケースA：全要素が正しい項目へ整理される', function () {
    var o = caseA();
    eq(o.garment.subtype, 'lace_bodysuit');
    eq(o.parts.collar, 'high_standing_collar');
    eq(o.parts.sleeves, 'fitted_long_sleeves');
    eq(o.parts.garter, 'garter_details');
    eq(o.parts.legwear[0].id, 'thigh_high_stockings');
    eq(o.materials.primary, 'lace');
    eq(o.materials.transparency, 'sheer');
    eq(o.materials.patterns[0], 'floral_lace_pattern');
    eq(o.palette.primary, 'jet_black');
    eq(o.palette.accent, 'polished_silver');
  });
  test('ケースA：手袋が素材・長さ・指先へ整理される', function () {
    var ph = CPW.schema.compositeToPhrase(handwearSlot(), caseA().parts.handwear);
    eq(ph.modifiers.join(' ') + ' ' + ph.head, 'elbow-length fingerless lace gloves');
  });
  test('ケースA：必要スロットがすべてランジェリーの表示項目に含まれる', function () {
    var slots = U.byId(D.garmentCategories, 'lingerie').slots;
    Object.keys(caseA().parts).forEach(function (s) {
      assert(slots.indexOf(s) >= 0, 'ランジェリーの表示項目に無い：' + s);
    });
  });
  test('ケースA：透け感と密着シルエットを同時に表現できる', function () {
    var o = caseA();
    eq(o.materials.transparency, 'sheer');
    eq(o.silhouette.fit, 'fitted');
  });
  test('ケースA：保存→復元で同一になる', function () {
    sandbox(function () {
      var o = caseA();
      CPW.store.saveOutfit(o);
      var back = CPW.store.getOutfit(o.id);
      eq(JSON.stringify(back.parts), JSON.stringify(o.parts));
      eq(JSON.stringify(back.materials), JSON.stringify(o.materials));
      eq(JSON.stringify(back.palette), JSON.stringify(o.palette));
    });
  });
  test('ケースA：下書き自動保存→復元で同一になる', function () {
    sandbox(function () {
      var o = caseA();
      CPW.store.saveDraft(o);
      var back = CPW.store.loadDraft();
      eq(JSON.stringify(back.parts), JSON.stringify(o.parts));
    });
  });
  test('ケースA：JSON書き出し→取り込みで4軸と層が維持される', function () {
    sandbox(function () {
      var o = caseA();
      var r = CPW.store.importJSON(CPW.store.exportOutfit(o));
      eq(r.ok, true);
      var back = CPW.store.listOutfits()[0];
      eq(back.parts.handwear.length, 'elbow_length');
      eq(back.parts.handwear.fingertips, 'fingerless');
      eq(back.parts.handwear.material, 'lace_hand');
      eq(back.parts.legwear[0].layer, 'main');
      eq(back.materials.patterns[0], 'floral_lace_pattern');
    });
  });
  test('ケースA：ストッキングと靴下の重複を判定できる材料が揃っている', function () {
    var slot = U.byId(D.partSlots, 'legwear');
    var st = U.byId(slot.options, 'thigh_high_stockings');
    var sk = U.byId(slot.options, 'lace_socks');
    assert(st.tags.indexOf('stockings') >= 0 && sk.tags.indexOf('socks') >= 0);
    var rule = U.byId(D.rules, 'stockings_and_socks');
    assert(rule && rule.sameLayerOnly === true, '同一レイヤー限定の重複ルールが無い');
    assert(rule.resolutions.some(function (r) { return r.action === 'ignore'; }), '重ね着として維持する選択肢が無い');
  });


  /* ============ Phase 3：英語プロンプト生成 ============ */
  var G = CPW.generator;

  function caseB() {
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), U.byId(D.presets, 'lolita').patch);
    o.concept.primaryStyle = 'gothic';
    o.concept.secondaryStyles = ['lolita'];
    o.garment.category = 'dress'; o.garment.subtype = 'maid_dress';
    o.silhouette.fit = 'fitted'; o.silhouette.lowerVolume = 'voluminous';
    o.parts.sleeves = 'bell_sleeves'; o.parts.skirt_shape = 'tiered_skirt'; o.parts.headwear = 'bonnet';
    o.palette.primary = 'jet_black'; o.palette.secondary = 'pure_white'; o.palette.accent = 'burgundy';
    o.decorations.density = 5;
    o.decorations.focalMotif = 'rose_ornament';
    o.decorations.items = [
      { type: 'ribbon_bow', placements: ['waist', 'head'], role: 'support', size: 'medium', quantity: 'many' },
      { type: 'rose_ornament', placements: ['chest', 'skirt'], role: 'focal', size: 'large', quantity: 'many' },
      { type: 'cross_ornament', placements: ['chest'], role: 'support', size: 'small', quantity: 'few' },
      { type: 'lace_trim', placements: ['collar', 'cuffs', 'hem'], role: 'trim', size: 'small', quantity: 'many' },
      { type: 'brooch_cluster', placements: ['chest'], role: 'support', size: 'medium', quantity: 'few' }
    ];
    o.specialParts.decorativeChains = ['waist_chain'];
    return CPW.schema.normalize(o);
  }
  function caseC() {
    var o = CPW.schema.applyPatch(CPW.schema.createOutfit(), U.byId(D.presets, 'royalty').patch);
    o.decorations.items = [
      { type: 'silver_embroidery', placements: ['collar', 'cuffs'], role: 'focal', size: 'medium', quantity: 'many' },
      { type: 'sapphire_brooch', placements: ['chest'], role: 'support', size: 'medium', quantity: 'single' }
    ];
    o.decorations.focalMotif = 'silver_embroidery';
    o.specialParts.decorativeChains = ['shoulder_chain', 'cape_clasp_chain'];
    o.specialParts.restraintChains = ['wrist_chain'];
    o.palette.metal = 'oxidized_silver';
    return CPW.schema.normalize(o);
  }
  function caseD() {
    var o = CPW.schema.createOutfit();
    o.concept.worldview = 'modern'; o.concept.era = 'contemporary'; o.concept.occasion = 'daily';
    o.concept.season = 'autumn'; o.concept.primaryStyle = 'minimal'; o.concept.role = 'office_worker';
    o.garment.category = 'uniform'; o.garment.subtype = 'business_suit';
    o.silhouette.fit = 'tailored'; o.silhouette.upperVolume = 'structured'; o.silhouette.lowerVolume = 'slim';
    o.parts.collar = 'wide_lapel'; o.parts.sleeves = 'fitted_long_sleeves';
    o.parts.bottoms = 'wide_trousers'; o.parts.waist = 'leather_belt'; o.parts.footwear = 'lace_up_boots';
    o.materials.primary = 'wool'; o.materials.surface = 'matte';
    o.palette.primary = 'charcoal_gray'; o.palette.secondary = 'jet_black'; o.palette.accent = 'sapphire_blue';
    return CPW.schema.normalize(o);
  }
  function count(hay, needle) { return hay.split(needle).length - 1; }
  function bothOf(o) { return G.short(o) + ' || ' + G.detailed(o); }

  test('生成：空の設計は空文字を返す（壊れた英文を作らない）', function () {
    var o = CPW.schema.createOutfit();
    eq(G.short(o), '');
    eq(G.detailed(o), '');
    assert(G.EMPTY_JA.length > 0, '案内文が無い');
  });
  test('生成：出力に undefined / null / [object が混ざらない', function () {
    [caseA(), caseB(), caseC(), caseD()].forEach(function (o) {
      var t = bothOf(o);
      ['undefined', 'null', '[object'].forEach(function (bad) {
        eq(t.indexOf(bad), -1, bad + ' が出力に混ざっている：' + t.slice(0, 80));
      });
    });
  });
  test('生成：連続カンマ・宙に浮いた接続語・重複ピリオドが無い', function () {
    [caseA(), caseB(), caseC(), caseD()].forEach(function (o) {
      var t = G.detailed(o);
      assert(!/,\s*,/.test(t), '連続カンマ：' + t);
      assert(!/(with|adorned with|featuring|trimmed with)\s*,/.test(t), '接続語が宙に浮いている：' + t);
      assert(!/\.\./.test(t), 'ピリオド重複');
      eq(count(t, '.'), 1, 'ピリオドは末尾の1つだけ');
    });
  });
  test('生成：詳細版は大文字で始まりピリオドで終わる', function () {
    var t = G.detailed(caseA());
    assert(/^[A-Z]/.test(t), '大文字で始まっていない：' + t);
    assert(/\.$/.test(t), 'ピリオドで終わっていない');
  });
  test('生成：短縮版はカンマ区切りで、衣装の核が先頭に来る', function () {
    var t = G.short(caseC());
    assert(t.indexOf(',') > 0, 'カンマ区切りでない');
    assert(t.split(',')[0].indexOf('royal uniform') >= 0, '核が先頭にない：' + t.split(',')[0]);
  });

  test('生成：手袋は一句へ統合される', function () {
    var t = bothOf(caseA());
    assert(t.indexOf('elbow-length fingerless lace gloves') >= 0, '一句になっていない：' + t);
  });
  test('生成：手袋の一般語と具体語を重複させない', function () {
    var t = G.short(caseA());
    eq(count(t, 'gloves'), 1, 'gloves が複数回出ている：' + t);
    eq(t.indexOf(', lace gloves'), -1, '一般語の lace gloves が別に出ている');
  });
  test('生成：種類未選択なら休止中の素材・長さ・指先を出力しない', function () {
    var o = caseA();
    o.parts.handwear.type = null;
    var t = bothOf(o);
    eq(t.indexOf('elbow-length'), -1, '長さが漏れている');
    eq(t.indexOf('fingerless'), -1, '指先が漏れている');
    eq(t.indexOf('gloves'), -1, '手袋が漏れている');
    assert(o.parts.handwear.material === 'lace_hand', '休止中の指定まで消えている');
  });

  test('生成：色が1色なら and や accents を作らない', function () {
    var o = CPW.schema.createOutfit();
    o.garment.category = 'dress'; o.garment.subtype = 'ball_gown'; o.palette.primary = 'jet_black';
    var t = G.short(o);
    assert(t.indexOf('jet black ball gown') >= 0, t);
    eq(t.indexOf(' and '), -1, '1色なのに and を作っている：' + t);
    eq(t.indexOf('accents'), -1, '1色なのに accents を作っている');
  });
  test('生成：色が2色なら and でつなぐ', function () {
    assert(G.short(caseC()).indexOf('pure white and deep navy') >= 0, G.short(caseC()));
  });
  test('生成：差し色は accents として出る', function () {
    assert(G.short(caseB()).indexOf('burgundy accents') >= 0, G.short(caseB()));
  });
  test('生成：金属色は details として出る', function () {
    var t = bothOf(caseC());
    assert(t.indexOf('oxidized silver details') >= 0, t);
    assert(G.detailed(caseC()).indexOf('finished with oxidized silver details') >= 0);
  });
  test('生成：宝石色は highlights として出る', function () {
    var o = caseC(); o.palette.gem = 'amethyst_violet';
    assert(bothOf(o).indexOf('amethyst violet highlights') >= 0);
  });
  test('生成：詳細版の配色は palette の句になる', function () {
    assert(G.detailed(caseC()).indexOf('built around a pure white and deep navy palette') >= 0, G.detailed(caseC()));
  });

  test('生成：装飾は位置と結びついた句になる', function () {
    var t = bothOf(caseC());
    assert(t.indexOf('silver embroidery along the collar and cuffs') >= 0, t);
    assert(t.indexOf('sapphire brooch at the chest') >= 0, t);
  });
  test('生成：位置が未設定なら前置詞句を作らず装飾名だけ出す', function () {
    var o = caseC();
    o.decorations.items = [{ type: 'silver_embroidery', placements: [], role: 'focal', size: 'medium', quantity: 'few' }];
    var t = G.short(o);
    assert(t.indexOf('silver embroidery') >= 0, t);
    eq(t.indexOf('silver embroidery along'), -1, '空の前置詞句ができている');
    eq(t.indexOf('along the ,'), -1);
  });
  test('生成：装飾チェーンは位置とともに出る', function () {
    assert(bothOf(caseC()).indexOf('draped across the shoulders') >= 0);
  });

  test('生成：主テーマは核の修飾語、主役装飾モチーフは装飾側（混ざらない）', function () {
    var o = caseC();
    o.concept.primaryThemeMotif = 'norse_mythology';
    o.decorations.focalMotif = 'crystal_embroidery';
    o.decorations.items = [{ type: 'crystal_embroidery', placements: ['collar', 'cuffs'], role: 'focal', size: 'medium', quantity: 'many' }];
    var t = G.detailed(o);
    assert(t.indexOf('Norse mythology-inspired') >= 0, '主テーマが核に無い：' + t);
    assert(t.indexOf('crystal embroidery along the collar and cuffs') >= 0, '装飾モチーフが位置と結びついていない：' + t);
    eq(t.indexOf('Norse mythology-inspired along'), -1, '主テーマが装飾位置に結び付いている');
    eq(t.indexOf('Norse mythology-inspired at'), -1);
  });
  test('生成：主役装飾モチーフが装飾の先頭に来る', function () {
    var t = G.short(caseB());
    assert(t.indexOf('rose ornaments') < t.indexOf('ribbon bows'), '主役装飾が先頭でない：' + t);
  });

  test('生成：属性エフェクトOFFなら演出語を出さない', function () {
    var o = caseA();
    o.concept.attribute = { id: 'ice', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: false, effects: false } };
    var t = bothOf(o);
    ['icy mist', 'frosted glow', 'flames', 'electric sparks', 'glowing aura'].forEach(function (w) {
      eq(t.indexOf(w), -1, w + ' が漏れている');
    });
  });
  test('生成：属性エフェクトONのときだけ演出語を足す', function () {
    var o = caseA();
    o.concept.attribute = { id: 'ice', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: false, effects: true } };
    o.output.includeEffects = true;
    var t = bothOf(o);
    assert(t.indexOf('frosted glow') >= 0, t);
    assert(t.indexOf('icy mist') >= 0);
  });
  test('生成：属性の強度で演出語の数が変わる', function () {
    var o = caseA();
    o.concept.attribute = { id: 'fire', intensity: 'subtle', applyTo: { colors: true, materials: true, decorations: true, silhouette: false, effects: true } };
    o.output.includeEffects = true;
    var b = G.blocks(o);
    eq(b.effects.short.length, 1);
    o.concept.attribute.intensity = 'standard';
    eq(G.blocks(o).effects.short.length, 2);
  });

  test('生成：初期状態は衣装のみ（背景・ポーズ・物語・品質タグを混ぜない）', function () {
    var t = bothOf(caseC());
    ['masterpiece', 'best quality', 'highly detailed', 'dramatic lighting', 'full-body view', 'plain background', 'standing pose'].forEach(function (w) {
      eq(t.indexOf(w), -1, w + ' が既定で混ざっている');
    });
  });
  test('生成：物語OFFなら拘束チェーンもテーマ語も出さない', function () {
    var t = bothOf(caseC());
    ['chained wrists', 'imprisonment', 'restraint', 'shackles'].forEach(function (w) {
      eq(t.indexOf(w), -1, w + ' が衣装のみ出力に混ざっている');
    });
  });
  test('生成：物語ONなら拘束チェーンとテーマ語が入る', function () {
    var o = caseC(); o.output.includeNarrative = true;
    var t = bothOf(o);
    assert(t.indexOf('chained wrists') >= 0, t);
    assert(t.indexOf('imprisonment theme') >= 0, t);
  });
  test('生成：装飾チェーンは衣装のみでも残り、拘束チェーンとは別ブロック', function () {
    var b = G.blocks(caseC());
    assert(b.specialParts.short.some(function (p) { return p.indexOf('epaulettes') >= 0; }), '装飾チェーンが消えている');
    eq(b.optionalNarrative.short.length, 0, '拘束チェーンが衣装のみで出ている');
    var o = caseC(); o.output.includeNarrative = true;
    assert(G.blocks(o).optionalNarrative.short.length > 0, '物語ONで拘束チェーンが出ない');
  });
  test('生成：品質タグはONのときだけ', function () {
    var o = caseA();
    eq(G.short(o).indexOf('masterpiece'), -1);
    o.output.includeQualityTags = true;
    assert(G.short(o).indexOf('masterpiece') >= 0);
  });
  test('生成：見せ方補助はONのときだけ', function () {
    var o = caseA();
    eq(G.short(o).indexOf('full-body view'), -1);
    o.output.includePresentation = true;
    assert(G.short(o).indexOf('full-body view') >= 0);
  });

  test('圧縮：同じ句は1つに、含まれる句は落とす', function () {
    eq(G.compress(['lace gloves', 'lace gloves']).length, 1);
    eq(G.compress(['lace gloves', 'elbow-length fingerless lace gloves']).join('|'), 'elbow-length fingerless lace gloves');
    eq(G.compress(['jet black', 'JET BLACK']).length, 1);
  });
  test('圧縮：関係ない句は残す', function () {
    eq(G.compress(['lace trim', 'sheer floral lace']).length, 2);
  });
  test('生成：素材の柄と主素材で同じ語を連打しない', function () {
    var t = G.short(caseA());
    assert(t.indexOf('sheer floral lace') >= 0, t);
    eq(t.indexOf('lace lace'), -1, 'lace が連打されている');
  });
  test('冠詞：a / an を音で選ぶ', function () {
    eq(G.article('ornate fantasy uniform'), 'an');
    eq(G.article('uniform'), 'a');
    eq(G.article('elegant dress'), 'an');
    eq(G.article('hour of dusk'), 'an');
    eq(G.article('one-piece lace bodysuit'), 'a');
  });
  test('接続：1件なら and を作らない', function () {
    eq(G.joinAnd(['a']), 'a');
    eq(G.joinAnd(['a', 'b']), 'a and b');
    eq(G.joinAnd(['a', 'b', 'c']), 'a, b and c');
    eq(G.joinAnd([]), '');
  });
  test('生成：複数形を壊さない', function () {
    var t = bothOf(caseD());
    assert(t.indexOf('wide-leg trousers') >= 0, 'trousers が壊れている');
    assert(t.indexOf('lace-up boots') >= 0, 'boots が壊れている');
    eq(t.indexOf('a wide-leg trousers'), -1, '複数形に a が付いている');
    assert(bothOf(caseA()).indexOf('thigh-high stockings') >= 0);
  });
  test('生成：詳細版で同じ接続語を続けて使わない', function () {
    [caseA(), caseB(), caseC(), caseD()].forEach(function (o) {
      var t = G.detailed(o);
      ['with', 'adorned with', 'featuring'].forEach(function (c) {
        assert(t.indexOf(', ' + c + ' ') === t.lastIndexOf(', ' + c + ' ') || count(t, ', ' + c + ' ') <= 2, '接続語 ' + c + ' の使いすぎ');
      });
      assert(!/,\s*with[^,]*,\s*with\s/.test(t), '同じ接続語が連続している：' + t);
    });
  });
  test('生成：ブロックは設計書の区分で取り出せる', function () {
    var b = G.blocks(caseC());
    ['identity', 'palette', 'silhouette', 'garments', 'parts', 'materials', 'decorations', 'theme', 'specialParts', 'optionalNarrative'].forEach(function (k) {
      assert(b[k], 'ブロックが無い：' + k);
      assert(Array.isArray(b[k].short) && Array.isArray(b[k].detailed), k + ' の形が違う');
    });
  });
  test('生成：空ブロックは短縮版にも詳細版にも現れない', function () {
    var o = CPW.schema.createOutfit();
    o.garment.category = 'dress'; o.garment.subtype = 'ball_gown'; o.palette.primary = 'jet_black';
    var b = G.blocks(o);
    eq(b.decorations.short.length, 0);
    eq(b.specialParts.short.length, 0);
    eq(b.optionalNarrative.short.length, 0);
    eq(G.detailed(o).indexOf('adorned with'), -1, '空の装飾ブロックが接続語だけ出している');
  });

  test('ケースA：短縮版が成立する', function () {
    var t = G.short(caseA());
    ['lace bodysuit', 'jet black', 'polished silver accents', 'high standing collar', 'fitted long sleeves',
     'elbow-length fingerless lace gloves', 'garter details', 'thigh-high stockings', 'sheer floral lace', 'monochrome'].forEach(function (w) {
      assert(t.indexOf(w) >= 0, '短縮版に無い：' + w + ' / ' + t);
    });
  });
  test('ケースA：詳細版が成立する', function () {
    var t = G.detailed(caseA());
    ['one-piece lace bodysuit', 'built around a monochrome jet black palette', 'elbow-length fingerless lace gloves', 'made of sheer floral lace'].forEach(function (w) {
      assert(t.indexOf(w) >= 0, '詳細版に無い：' + w + ' / ' + t);
    });
  });
  test('ケースA：頼んでいない靴下を勝手に足さない', function () {
    var t = bothOf(caseA());
    eq(t.indexOf('socks'), -1, 'socks が勝手に入っている');
  });
  test('ケースB：装飾密度に応じた強調語を一つだけ使う', function () {
    var t = G.short(caseB());
    assert(t.indexOf('maximalist') >= 0, '強調語が無い：' + t);
    eq(count(t, 'maximalist'), 1, '強調語を重ねている');
    ['ultra-luxurious', 'ultra', 'extremely', 'super'].forEach(function (w) {
      eq(t.indexOf(w), -1, w + ' を勝手に足している');
    });
  });
  test('ケースB：配色・構造・装飾がこの順に並ぶ', function () {
    var t = G.short(caseB());
    var iColor = t.indexOf('burgundy accents');
    var iStruct = t.indexOf('tiered skirt');
    var iDeco = t.indexOf('rose ornaments');
    assert(iColor < iStruct && iStruct < iDeco, '語順が崩れている：' + t);
  });
  test('ケースB：主役装飾と補助装飾が区別される', function () {
    var b = G.blocks(caseB());
    assert(b.decorations.short[0].indexOf('rose ornaments') >= 0, '主役が先頭でない');
    assert(G.detailed(caseB()).indexOf('large rose ornaments at the chest and skirt') >= 0);
  });
  test('ケースC：衣装のみでは拘束・物語を除外する', function () {
    var t = bothOf(caseC());
    assert(t.indexOf('silver embroidery along the collar and cuffs') >= 0, '装飾が出ていない');
    assert(t.indexOf('chains across the epaulettes') >= 0, '装飾チェーンが消えている');
    eq(t.indexOf('imprisonment'), -1);
    eq(t.indexOf('chained'), -1);
  });
  test('ケースD：現代服に神話・属性・過剰語が混ざらない', function () {
    var t = bothOf(caseD());
    ['mythology', 'fantasy', 'arcane', 'ember', 'icy', 'glow', 'ornate', 'extravagant', 'lavish', 'maximalist', 'royal'].forEach(function (w) {
      eq(t.indexOf(w), -1, w + ' が現代服に混ざっている：' + t);
    });
  });
  test('ケースD：現代服として読める語順になる', function () {
    var t = G.short(caseD());
    assert(t.split(',')[0].indexOf('tailored suit') >= 0, '核が先頭でない：' + t);
    assert(t.indexOf('charcoal gray and jet black') >= 0);
    assert(t.indexOf('sapphire blue accents') >= 0);
    assert(t.indexOf('wide-leg trousers') >= 0);
  });
  test('ケースD：役割が形容詞にならない場合は核へ出さない', function () {
    eq(G.short(caseD()).indexOf('office worker'), -1, '役割が核に混ざっている');
  });

  test('生成：保存→復元しても同じ出力になる', function () {
    sandbox(function () {
      var o = caseA();
      var before = bothOf(o);
      CPW.store.saveOutfit(o);
      eq(bothOf(CPW.store.getOutfit(o.id)), before);
    });
  });
  test('生成：JSON往復しても同じ出力になる', function () {
    sandbox(function () {
      var o = caseC(); o.output.includeNarrative = true;
      var before = bothOf(o);
      CPW.store.importJSON(CPW.store.exportOutfit(o));
      eq(bothOf(CPW.store.listOutfits()[0]), before);
    });
  });
  test('生成：出力オプションも保存・復元される', function () {
    sandbox(function () {
      var o = caseA();
      o.output.includeNarrative = true; o.output.includeQualityTags = true;
      CPW.store.saveOutfit(o);
      var back = CPW.store.getOutfit(o.id);
      eq(back.output.includeNarrative, true);
      eq(back.output.includeQualityTags, true);
      eq(back.output.includeEffects, false);
    });
  });
  test('データ：装飾はすべて位置の前置詞を持つ', function () {
    D.decorations.forEach(function (d) {
      assert(['along', 'around', 'at', 'on'].indexOf(d.prep) >= 0, d.id + ' の前置詞が無い');
    });
  });
  test('データ：拘束チェーンは物語テーマ語を持つ', function () {
    D.specialParts.restraintChains.forEach(function (c) {
      assert(c.narrativeTheme, c.id + ' に物語テーマ語が無い');
    });
  });

  /* ============================================================
   * Phase 4：競合判定・補助候補・部分ガチャ
   * ========================================================== */
  var SC = CPW.schema;
  var AD = CPW.advisor;
  var GA = CPW.gacha;

  function outfit(patch) { return SC.applyPatch(SC.createOutfit(), patch || {}); }
  function ids(issues) { return issues.map(function (i) { return i.id; }); }
  function has(issues, id) { return ids(issues).indexOf(id) >= 0; }
  function sev(issues, id) {
    var hit = issues.filter(function (i) { return i.id === id; })[0];
    return hit ? hit.severity : null;
  }
  function caseSleeveSame() {
    return outfit({ garment: { category: 'dress', subtype: 'slip_dress_outer' }, parts: { sleeves: 'fitted_long_sleeves' } });
  }
  function caseCollar() {
    return outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { collar: 'high_standing_collar', neckline: 'plunging_neckline' } });
  }
  function caseDense(density) {
    return outfit({
      concept: { worldview: 'dark_fantasy', primaryStyle: 'gothic' },
      garment: { category: 'dress', subtype: 'ball_gown' },
      palette: { primary: 'jet_black' }, materials: { primary: 'velvet' }, silhouette: { fit: 'fitted' },
      decorations: {
        density: density,
        items: [
          { type: 'lace_trim', placements: ['hem'], role: 'support', size: 'medium', quantity: 'many' },
          { type: 'rose_ornament', placements: ['chest'], role: 'focal', size: 'medium', quantity: 'few' },
          { type: 'cross_ornament', placements: ['collar'], role: 'focal', size: 'large', quantity: 'few' },
          { type: 'brooch_cluster', placements: ['shoulders'], role: 'focal', size: 'medium', quantity: 'few' },
          { type: 'silver_embroidery', placements: ['cuffs'], role: 'support', size: 'medium', quantity: 'many' }
        ]
      },
      specialParts: { decorativeChains: ['chest_chain'] }
    });
  }
  function iceOutfit(silOn) {
    return outfit({
      concept: {
        worldview: 'western_fantasy', primaryStyle: 'classical',
        attribute: { id: 'ice', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: !!silOn, effects: false } }
      },
      garment: { category: 'dress', subtype: 'ball_gown' }
    });
  }
  function modernOutfit() {
    return outfit({
      concept: { worldview: 'modern', primaryStyle: 'minimal', occasion: 'daily' },
      garment: { category: 'top_bottom', subtype: 'shirt_and_trousers' },
      palette: { primary: 'charcoal_gray' }, silhouette: { fit: 'tailored' }, materials: { primary: 'wool' }
    });
  }

  /* ---- データ層 ---- */
  test('rules：すべてのルールに id・severity・kind がある', function () {
    D.rules.forEach(function (r) {
      assert(r.id && r.severity && r.kind, JSON.stringify(r).slice(0, 40) + ' に必須項目が無い');
      assert(['hard', 'warning', 'info'].indexOf(r.severity) >= 0, r.id + ' の severity が不正');
      assert(['pair', 'check'].indexOf(r.kind) >= 0, r.id + ' の kind が不正');
    });
  });
  test('rules：id が重複していない', function () {
    var seen = {};
    D.rules.forEach(function (r) { assert(!seen[r.id], r.id + ' が重複'); seen[r.id] = true; });
  });
  test('rules：check ルールの参照先が advisor に実在する', function () {
    D.rules.filter(function (r) { return r.kind === 'check'; }).forEach(function (r) {
      assert(typeof AD.CHECKS[r.check] === 'function', r.id + ' の check「' + r.check + '」が無い');
    });
  });
  test('rules：pair ルールには left と right がある', function () {
    D.rules.filter(function (r) { return r.kind === 'pair'; }).forEach(function (r) {
      assert(r.left && r.right, r.id + ' に left/right が無い');
    });
  });
  test('装飾密度：maximalist だけ上限が無く、他は昇順に増える', function () {
    var b = D.decorationDensity.map(function (d) { return d.budget; });
    eq(b[5], null, 'maximalist は上限なし');
    for (var i = 1; i < 5; i++) assert(b[i] > b[i - 1], 'budget が昇順でない');
  });
  test('属性：colors / materials / decorations / silhouettes が実在IDを指す', function () {
    var silIds = [];
    Object.keys(D.silhouette).forEach(function (k) { D.silhouette[k].forEach(function (o) { silIds.push(o.id); }); });
    D.attributes.forEach(function (a) {
      (a.colors || []).forEach(function (id) { assert(U.byId(D.colors, id), a.id + '.colors の ' + id + ' が無い'); });
      (a.materials || []).forEach(function (id) { assert(U.byId(D.materials, id), a.id + '.materials の ' + id + ' が無い'); });
      (a.decorations || []).forEach(function (id) {
        assert(U.byId(D.decorations, id) || U.byId(D.patterns, id), a.id + '.decorations の ' + id + ' が無い');
      });
      (a.silhouettes || []).forEach(function (id) { assert(silIds.indexOf(id) >= 0, a.id + '.silhouettes の ' + id + ' が無い'); });
    });
  });

  /* ---- トークン化 ---- */
  test('tokens：部位・素材・配色を横並びのトークンに均す', function () {
    var o = caseCollar();
    var ts = AD.tokens(o);
    assert(ts.some(function (t) { return t.path === 'parts.collar' && t.id === 'high_standing_collar'; }), '襟が出ない');
    assert(ts.some(function (t) { return t.path === 'garment.subtype'; }), '基本衣装が出ない');
  });
  test('tokens：レッグウェアは項目ごとに層を持つ', function () {
    var o = outfit({ parts: { legwear: [{ id: 'thigh_high_stockings', layer: 'inner' }, { id: 'lace_socks', layer: 'outer' }] } });
    var ts = AD.tokens(o).filter(function (t) { return t.slotId === 'legwear'; });
    eq(ts.length, 2, 'レッグウェアが2件出ない');
    eq(ts[0].layer, 'inner');
    eq(ts[1].layer, 'outer');
  });
  test('tokens：羽織りは外側の層になる', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'slip_dress_outer' }, parts: { cover_up: 'long_sleeved_cardigan' } });
    var t = AD.tokens(o).filter(function (x) { return x.slotId === 'cover_up'; })[0];
    assert(t, '羽織りのトークンが無い');
    eq(t.layer, 'outer');
  });
  test('tokens：手袋は軸ごとにトークンになる', function () {
    var o = outfit({ garment: { category: 'lingerie', subtype: 'lace_bodysuit' }, parts: { handwear: { type: 'hand_gloves', material: 'lace_hand', length: 'elbow_length', fingertips: 'fingerless' } } });
    var ts = AD.tokens(o).filter(function (t) { return t.slotId === 'handwear'; });
    assert(ts.length >= 3, '手袋の軸が展開されていない');
  });

  /* ---- 競合：hard ---- */
  test('競合：袖なし衣装＋長袖は同じ層で hard', function () {
    var issues = AD.check(caseSleeveSame());
    eq(sev(issues, 'sleeveless_vs_long_sleeves'), 'hard');
  });
  test('競合：袖なし衣装＋長袖カーディガンは別層なので競合しない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'slip_dress_outer' }, parts: { cover_up: 'long_sleeved_cardigan' } });
    assert(!has(AD.check(o), 'sleeveless_vs_long_sleeves'), '別層なのに競合した');
  });
  test('競合：立ち襟＋深い胸元は hard', function () {
    eq(sev(AD.check(caseCollar()), 'high_neck_vs_plunging'), 'hard');
  });
  test('競合：立ち襟＋深い胸元にキーホールの代替案が付く', function () {
    var issue = AD.check(caseCollar()).filter(function (i) { return i.id === 'high_neck_vs_plunging'; })[0];
    assert(issue.resolutions.some(function (r) { return r.action === 'replaceRightWith:keyhole_neckline'; }), 'キーホール案が無い');
    assert(issue.resolutions.some(function (r) { return r.action === 'replaceRightWith:illusion_neckline'; }), 'イリュージョン案が無い');
    assert(issue.resolutions.some(function (r) { return /detachable_standing_collar/.test(r.action); }), '取り外し立ち襟案が無い');
  });
  test('競合：床丈＋マイクロミニは hard', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, silhouette: { length: 'floor' }, parts: { skirt_shape: 'micro_mini_skirt' } });
    eq(sev(AD.check(o), 'floor_vs_micro'), 'hard');
  });
  test('競合：床丈だけなら競合しない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, silhouette: { length: 'floor' } });
    assert(!has(AD.check(o), 'floor_vs_micro'), '単独で競合した');
  });
  test('競合：肩紐なし＋肩紐は hard', function () {
    var o = outfit({ garment: { category: 'lingerie', subtype: 'bra_and_briefs' }, parts: { top_structure: 'bandeau', straps: 'halter_strap' } });
    eq(sev(AD.check(o), 'strapless_vs_straps'), 'hard');
  });

  /* ---- 競合：warning / info ---- */
  test('競合：ストッキングと靴下が同じ層なら warning', function () {
    var o = outfit({ parts: { legwear: [{ id: 'thigh_high_stockings', layer: 'main' }, { id: 'lace_socks', layer: 'main' }] } });
    eq(sev(AD.check(o), 'stockings_and_socks'), 'warning');
  });
  test('競合：ストッキングと靴下が別層なら競合しない', function () {
    var o = outfit({ parts: { legwear: [{ id: 'thigh_high_stockings', layer: 'inner' }, { id: 'lace_socks', layer: 'outer' }] } });
    assert(!has(AD.check(o), 'stockings_and_socks'), '別層なのに競合した');
  });
  test('競合：ストッキングと靴下に「外側の層にする」案が付く', function () {
    var o = outfit({ parts: { legwear: [{ id: 'thigh_high_stockings', layer: 'main' }, { id: 'lace_socks', layer: 'main' }] } });
    var issue = AD.check(o).filter(function (i) { return i.id === 'stockings_and_socks'; })[0];
    var move = issue.resolutions.filter(function (r) { return r.action === 'moveRightToLayer:outer'; })[0];
    assert(move && move.patch, '層を移す案が無い');
    var next = SC.applyPatch(o, move.patch);
    eq(next.parts.legwear[1].layer, 'outer');
    assert(!has(AD.check(next), 'stockings_and_socks'), '層を移しても競合が残った');
  });
  test('競合：厚い素材＋しっかり透けるは warning', function () {
    var o = outfit({ materials: { primary: 'velvet', transparency: 'sheer' } });
    eq(sev(AD.check(o), 'heavy_vs_sheer'), 'warning');
  });
  test('競合：厚い素材＋不透明なら競合しない', function () {
    var o = outfit({ materials: { primary: 'velvet', transparency: 'opaque' } });
    assert(!has(AD.check(o), 'heavy_vs_sheer'), '不透明なのに競合した');
  });
  test('競合：巨大な翼＋背面を覆う造りは warning', function () {
    var o = outfit({ parts: { back: 'covered_back' }, specialParts: { wings: { type: 'feathered_wings', size: 'massive_wings', spread: 'spread' } } });
    eq(sev(AD.check(o), 'massive_wings_vs_back_cape'), 'warning');
  });
  test('競合：翼が中くらいなら背面を覆っても競合しない', function () {
    var o = outfit({ parts: { back: 'covered_back' }, specialParts: { wings: { type: 'feathered_wings', size: 'medium_wings', spread: 'spread' } } });
    assert(!has(AD.check(o), 'massive_wings_vs_back_cape'), '中くらいで競合した');
  });
  test('競合：翼を中くらいにする案で警告が消える', function () {
    var o = outfit({ parts: { back: 'covered_back' }, specialParts: { wings: { type: 'feathered_wings', size: 'massive_wings', spread: 'spread' } } });
    var issue = AD.check(o).filter(function (i) { return i.id === 'massive_wings_vs_back_cape'; })[0];
    var fix = issue.resolutions.filter(function (r) { return r.action === 'replaceLeftWith:wing_medium'; })[0];
    assert(!has(AD.check(SC.applyPatch(o, fix.patch)), 'massive_wings_vs_back_cape'), '案を当てても残った');
  });
  test('競合：ガーターの二重指定は info', function () {
    var o = outfit({ garment: { category: 'lingerie', subtype: 'lace_bodysuit' }, parts: { legwear: [{ id: 'garter_stockings', layer: 'main' }], garter: 'garter_belt' } });
    eq(sev(AD.check(o), 'garter_stockings_and_garter_belt'), 'info');
  });

  /* ---- 配色 ---- */
  test('配色：主色が無く差し色だけなら warning', function () {
    var o = outfit({ palette: { accent: 'deep_crimson' } });
    eq(sev(AD.check(o), 'palette_primary_missing'), 'warning');
  });
  test('配色：色を1つも選んでいなければ主色未設定の警告は出さない', function () {
    assert(!has(AD.check(outfit()), 'palette_primary_missing'), '未着手で警告した');
  });
  test('配色：モノクローム指定なのに有彩色が複数あれば warning', function () {
    var o = outfit({ palette: { primary: 'deep_crimson', secondary: 'forest_green', scheme: 'monochrome' } });
    eq(sev(AD.check(o), 'monochrome_vs_hues'), 'warning');
  });
  test('配色：黒＋銀のモノクロームは警告しない（ケースAの構成）', function () {
    var o = outfit({ palette: { primary: 'jet_black', accent: 'polished_silver', scheme: 'monochrome' } });
    assert(!has(AD.check(o), 'monochrome_vs_hues'), '無彩色＋金属色で警告した');
  });
  test('配色：色数が4以上なら info', function () {
    var o = outfit({ palette: { primary: 'jet_black', secondary: 'pure_white', accent: 'deep_crimson', metal: 'polished_silver' } });
    eq(sev(AD.check(o), 'too_many_colors'), 'info');
  });
  test('配色：3色なら色数過多にしない', function () {
    var o = outfit({ palette: { primary: 'jet_black', secondary: 'pure_white', accent: 'deep_crimson' } });
    assert(!has(AD.check(o), 'too_many_colors'), '3色で警告した');
  });

  /* ---- 装飾密度 ---- */
  test('密度：重みは件数ではなく装飾ごとの重さで積む', function () {
    var r = AD.densityReport(caseDense(1));
    assert(r.weight > 5, '重みが軽すぎる：' + r.weight);
    eq(r.budget, 2, 'restrained の目安が違う');
    eq(r.over, true);
  });
  test('密度：restrained に装飾を積むと warning', function () {
    eq(sev(AD.check(caseDense(1)), 'density_overload'), 'warning');
  });
  test('密度：警告文に密度名と重みが入る', function () {
    var issue = AD.check(caseDense(1)).filter(function (i) { return i.id === 'density_overload'; })[0];
    assert(/控えめ/.test(issue.messageJa), '密度名が無い');
    assert(/重みが\d+/.test(issue.messageJa), '重みが無い');
  });
  test('密度：maximalist なら件数だけでは強く警告しない', function () {
    var issues = AD.check(caseDense(5));
    assert(!has(issues, 'density_overload'), '最大主義で密度超過を出した');
    eq(AD.summary(issues).warning, 0, '最大主義で warning が出た');
  });
  test('密度：maximalist でも主役が多すぎれば info', function () {
    eq(sev(AD.check(caseDense(5)), 'focal_overload'), 'info');
  });
  test('密度：主役が2件以下なら focal 警告を出さない', function () {
    var o = caseDense(5);
    o.decorations.items[2].role = 'support';
    o.decorations.items[3].role = 'support';
    assert(!has(AD.check(o), 'focal_overload'), '主役2件で警告した');
  });
  test('密度：装飾が多いのに主役モチーフ未設定なら info', function () {
    eq(sev(AD.check(caseDense(5)), 'focal_motif_missing'), 'info');
  });
  test('密度：密度を上げる案で超過が解ける', function () {
    var o = caseDense(1);
    var issue = AD.check(o).filter(function (i) { return i.id === 'density_overload'; })[0];
    var fix = issue.resolutions.filter(function (r) { return r.patch; })[0];
    assert(fix, '密度を上げる案が無い');
    eq(SC.applyPatch(o, fix.patch).decorations.density, 2);
  });

  /* ---- 様式 ---- */
  test('様式：方向の違う様式を並べると warning', function () {
    var o = outfit({ concept: { primaryStyle: 'royal', secondaryStyles: ['street'] } });
    eq(sev(AD.check(o), 'opposed_styles'), 'warning');
  });
  test('様式：主様式へ寄せる案で警告が消える', function () {
    var o = outfit({ concept: { primaryStyle: 'royal', secondaryStyles: ['street'] } });
    var issue = AD.check(o).filter(function (i) { return i.id === 'opposed_styles'; })[0];
    var fix = issue.resolutions.filter(function (r) { return r.patch; })[0];
    var next = SC.applyPatch(o, fix.patch);
    assert(!has(AD.check(next), 'opposed_styles'), '寄せても残った');
  });
  test('様式：副様式が2つ以上あれば info', function () {
    var o = outfit({ concept: { primaryStyle: 'gothic', secondaryStyles: ['lolita', 'victorian'] } });
    eq(sev(AD.check(o), 'style_mix_notice'), 'info');
  });
  test('様式：儀礼的な衣装に仕事の場面なら warning', function () {
    var o = outfit({ concept: { occasion: 'work' }, garment: { category: 'uniform', subtype: 'royal_uniform' } });
    eq(sev(AD.check(o), 'ceremonial_vs_workwear'), 'warning');
  });

  /* ---- 出力との噛み合わせ ---- */
  test('出力：拘束チェーンがあるのに物語OFFなら info', function () {
    var o = outfit({ specialParts: { restraintChains: ['collar_chain'] } });
    eq(sev(AD.check(o), 'restraint_chain_without_narrative'), 'info');
  });
  test('出力：装飾チェーンは衣装のみでも警告しない（役割の分離を維持）', function () {
    var o = outfit({ specialParts: { decorativeChains: ['chest_chain'] } });
    assert(!has(AD.check(o), 'restraint_chain_without_narrative'), '装飾チェーンで警告した');
  });
  test('出力：物語をONにする案で警告が消える', function () {
    var o = outfit({ specialParts: { restraintChains: ['collar_chain'] } });
    var issue = AD.check(o).filter(function (i) { return i.id === 'restraint_chain_without_narrative'; })[0];
    var fix = issue.resolutions.filter(function (r) { return r.patch; })[0];
    eq(SC.applyPatch(o, fix.patch).output.includeNarrative, true);
  });
  test('出力：属性未設定でエフェクトONなら info', function () {
    var o = outfit({ output: { includeEffects: true } });
    eq(sev(AD.check(o), 'effects_without_attribute'), 'info');
  });

  /* ---- 判定の並びと集計 ---- */
  test('判定：重要度順に並ぶ', function () {
    var o = caseSleeveSame();
    o.palette.accent = 'deep_crimson';
    o.concept.secondaryStyles = ['lolita', 'victorian'];
    var rank = { hard: 0, warning: 1, info: 2 };
    var seq = AD.check(o).map(function (i) { return rank[i.severity]; });
    for (var i = 1; i < seq.length; i++) assert(seq[i] >= seq[i - 1], '並びが崩れている');
  });
  test('判定：summary が段階ごとに数える', function () {
    var s = AD.summary(AD.check(caseSleeveSame()));
    eq(s.hard, 1);
    eq(s.total, s.hard + s.warning + s.info);
  });
  test('判定：無視した警告は集計から外れ、ignored に数える', function () {
    var o = caseSleeveSame();
    var key = AD.check(o)[0].key;
    var s = AD.summary(AD.check(o, { ignored: [key] }));
    eq(s.hard, 0);
    eq(s.ignored, 1);
  });
  test('判定：修正案の patch は必ず当てられる', function () {
    var o = caseCollar();
    AD.check(o).forEach(function (i) {
      i.resolutions.forEach(function (r) {
        if (!r.patch) return;
        assert(SC.applyPatch(o, r.patch), i.id + ' の ' + r.action + ' が当たらない');
      });
    });
  });
  test('判定：修正案を当てても元の設計は変わらない', function () {
    var o = caseCollar();
    var before = JSON.stringify(o);
    var r = AD.check(o)[0].resolutions.filter(function (x) { return x.patch; })[0];
    SC.applyPatch(o, r.patch);
    eq(JSON.stringify(o), before, '元が書き換わった');
  });

  /* ---- 補助候補 ---- */
  test('候補：王道モードで候補が3〜6件出る', function () {
    var r = AD.suggest(modernOutfit(), { mode: 'standard', limit: 6 });
    assert(r.length >= 3 && r.length <= 6, '件数が範囲外：' + r.length);
  });
  test('候補：現代の王道にレザーベルトとウールが出る', function () {
    var r = AD.suggest(modernOutfit(), { mode: 'standard', limit: 8 });
    var v = r.map(function (c) { return c.valueId; });
    assert(v.indexOf('leather_belt') >= 0, 'レザーベルトが出ない');
    assert(v.indexOf('wool') >= 0 || v.indexOf('leather') >= 0, '落ち着いた素材が出ない');
  });
  test('候補：現代の王道に神話装飾・翼・王族装飾を出さない', function () {
    var r = AD.suggest(modernOutfit(), { mode: 'standard', limit: 12 });
    var ng = ['gold_embroidery', 'sapphire_brooch', 'brocade', 'metallic_thread', 'royal_sash', 'crystal_details'];
    r.forEach(function (c) { assert(ng.indexOf(c.valueId) < 0, c.valueId + ' が王道候補に出た'); });
  });
  test('候補：少し意外は差し色や質感で振れる', function () {
    var r = AD.suggest(modernOutfit(), { mode: 'surprise', limit: 6 });
    assert(r.length > 0, '意外候補が出ない');
    r.forEach(function (c) { eq(c.kind, 'surprise', '意外モードに王道が混ざった'); });
  });
  test('候補：少し意外でも世界観は壊さない', function () {
    var r = AD.suggest(modernOutfit(), { mode: 'surprise', limit: 8 });
    var ng = D.affinity.worldviewAvoid.modern;
    r.forEach(function (c) { assert(ng.indexOf(c.valueId) < 0, c.valueId + ' は現代から外れる'); });
  });
  test('候補：両方モードは王道と意外を混ぜて出す', function () {
    var r = AD.suggest(modernOutfit(), { mode: 'both', limit: 6 });
    assert(r.length > 0, '候補が出ない');
    var kinds = {};
    AD.suggest(modernOutfit(), { mode: 'both', limit: 20 }).forEach(function (c) { kinds[c.kind] = true; });
    assert(kinds.surprise, '意外が混ざらない');
  });
  test('候補：未設定の recommended を補完する候補が出る', function () {
    var r = AD.suggest(modernOutfit(), { mode: 'standard', limit: 12 });
    assert(r.some(function (c) { return c.kind === 'fill'; }), '不足補完が出ない');
  });
  // Phase 5A で候補カテゴリ（主テーマ・様式）が増え、プールが厚くなった。
  // 上限の緩和は「limit を埋めるまで」しか働かないので、掘る深さを 12 → 16 へ広げる。
  // 見ているもの（氷属性が挙げる4つが候補に出る）は変えていない。
  test('候補：氷属性で ice blue / polished silver / organza / crystal embroidery が出る', function () {
    var v = AD.suggest(iceOutfit(true), { mode: 'standard', limit: 16 }).map(function (c) { return c.valueId; });
    ['ice_blue', 'polished_silver', 'organza', 'crystal_embroidery'].forEach(function (id) {
      assert(v.indexOf(id) >= 0, id + ' が出ない');
    });
  });
  test('候補：属性の反映先 silhouette が ON ならシルエット候補を出す', function () {
    var r = AD.suggest(iceOutfit(true), { mode: 'standard', limit: 12 });
    assert(r.some(function (c) { return c.category === 'シルエット'; }), 'ONなのに出ない');
  });
  test('候補：属性の反映先 silhouette が OFF ならシルエット候補を出さない', function () {
    var r = AD.suggest(iceOutfit(false), { mode: 'standard', limit: 12 });
    eq(r.filter(function (c) { return c.category === 'シルエット'; }).length, 0, 'OFFなのに出た');
  });
  test('候補：属性の反映先 colors が OFF なら属性色を推さない', function () {
    var o = iceOutfit(true);
    o.concept.attribute.applyTo.colors = false;
    var r = AD.suggest(o, { mode: 'standard', limit: 12 });
    r.forEach(function (c) { assert(!/属性のおすすめ色/.test(c.reasonJa), '色OFFなのに属性色が出た'); });
  });
  test('候補：既に選んでいる値は候補に出さない', function () {
    var o = modernOutfit();
    o.materials.secondary = 'leather';
    var r = AD.suggest(o, { mode: 'standard', limit: 12 });
    r.forEach(function (c) { assert(!(c.targetPath === 'materials.secondary' && c.valueId === 'leather'), '選択済みが出た'); });
  });
  test('候補：埋まっている項目を上書きする候補は出さない', function () {
    var o = iceOutfit(true);
    o.palette.primary = 'jet_black';
    var r = AD.suggest(o, { mode: 'standard', limit: 12 });
    r.forEach(function (c) { assert(c.targetPath !== 'palette.primary', '主色を上書きしようとした'); });
  });
  test('候補：hard競合を生む候補は出さない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'slip_dress_outer' } });
    var r = AD.suggest(o, { mode: 'both', limit: 20 });
    r.forEach(function (c) {
      var next = SC.applyPatch(o, c.patch);
      assert(!AD.check(next).some(function (i) { return i.severity === 'hard'; }), c.labelJa + ' が hard を生む');
    });
  });
  test('候補：点数の高い順に並ぶ', function () {
    var r = AD.suggest(iceOutfit(true), { mode: 'standard', limit: 12 });
    for (var i = 1; i < r.length; i++) assert(r[i].score <= r[i - 1].score, '順が崩れている');
  });
  test('候補：すべての候補に日本語の理由が付く', function () {
    AD.suggest(iceOutfit(true), { mode: 'both', limit: 12 }).forEach(function (c) {
      assert(c.reasonJa && c.reasonJa.length > 0, c.labelJa + ' に理由が無い');
    });
  });
  test('候補：日本語名・英語表現・追加先を持つ', function () {
    AD.suggest(iceOutfit(true), { mode: 'standard', limit: 6 }).forEach(function (c) {
      assert(c.labelJa, '日本語名が無い');
      assert(c.targetLabelJa, '追加先が無い');
      assert(c.patch, 'patch が無い');
    });
  });
  test('候補：同じ値の候補を並べない', function () {
    var seen = {};
    AD.suggest(iceOutfit(true), { mode: 'standard', limit: 6 }).forEach(function (c) {
      assert(!seen[c.valueId], c.valueId + ' が重複');
      seen[c.valueId] = true;
    });
  });
  test('候補：同じカテゴリに偏らない', function () {
    var count = {};
    AD.suggest(iceOutfit(true), { mode: 'standard', limit: 6 }).forEach(function (c) {
      count[c.category] = (count[c.category] || 0) + 1;
    });
    assert(Object.keys(count).length >= 2, 'カテゴリが1つに偏った');
  });
  test('候補：suggest を呼んだだけでは設計が変わらない', function () {
    var o = iceOutfit(true);
    var before = JSON.stringify(o);
    AD.suggest(o, { mode: 'both', limit: 6 });
    eq(JSON.stringify(o), before, 'suggest が状態を書き換えた');
  });
  test('候補：apply して初めて反映される', function () {
    var o = iceOutfit(true);
    var before = JSON.stringify(o);
    var c = AD.suggest(o, { mode: 'standard', limit: 6 })[0];
    var next = AD.apply(o, c);
    assert(JSON.stringify(next) !== before, '反映されていない');
    eq(JSON.stringify(o), before, '元が書き換わった');
  });
  test('候補：警告があると競合回避の候補が出る', function () {
    var r = AD.suggest(caseCollar(), { mode: 'standard', limit: 12 });
    assert(r.some(function (c) { return c.kind === 'resolve'; }), '競合回避が出ない');
  });

  /* ---- 部分ガチャ ---- */
  test('ガチャ：対象と維持条件の一覧を持つ', function () {
    assert(GA.TARGETS.length >= 12, '対象が足りない：' + GA.TARGETS.length);
    assert(GA.KEEPS.length >= 6, '維持条件が足りない：' + GA.KEEPS.length);
  });
  test('ガチャ：初期の維持条件は世界観・主様式・基本衣装', function () {
    eq(GA.defaultKeeps().sort().join(','), ['garment', 'primaryStyle', 'worldview'].sort().join(','));
  });
  test('ガチャ：配色で3案出る', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    eq(GA.roll(o, { target: 'palette', seed: 42 }).length, 3);
  });
  test('ガチャ：seed が同じなら結果も同じ', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var a = GA.roll(o, { target: 'palette', seed: 42 });
    var b = GA.roll(o, { target: 'palette', seed: 42 });
    eq(JSON.stringify(a.map(function (x) { return x.patch; })), JSON.stringify(b.map(function (x) { return x.patch; })));
  });
  test('ガチャ：seed が違えば結果も違う', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var a = GA.roll(o, { target: 'palette', seed: 42 });
    var b = GA.roll(o, { target: 'palette', seed: 7 });
    assert(JSON.stringify(a.map(function (x) { return x.patch; })) !== JSON.stringify(b.map(function (x) { return x.patch; })), '同じ結果になった');
  });
  test('ガチャ：乱数を外から注入できる', function () {
    var calls = 0;
    var rng = function () { calls++; return 0.5; };
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    GA.roll(o, { target: 'palette', rng: rng });
    assert(calls > 0, '注入した乱数が使われていない');
  });
  test('ガチャ：採用するまで元の設計を変えない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var before = JSON.stringify(o);
    GA.roll(o, { target: 'palette', seed: 42 });
    eq(JSON.stringify(o), before, 'roll が元を書き換えた');
  });
  test('ガチャ：プレビューは元とは別物', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var c = GA.roll(o, { target: 'palette', seed: 42 })[0];
    c.preview.palette.primary = 'jet_black';
    assert(o.palette.primary !== 'jet_black', 'プレビューが元を参照している');
  });
  test('ガチャ：やめても設計は変わらない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var before = JSON.stringify(o);
    var cands = GA.roll(o, { target: 'palette', seed: 42 });
    cands = null;
    eq(JSON.stringify(o), before, 'キャンセルで変わった');
  });
  test('ガチャ：採用した案だけが反映される', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var cands = GA.roll(o, { target: 'palette', seed: 42 });
    var next = GA.apply(o, cands[1]);
    eq(JSON.stringify(next.palette), JSON.stringify(cands[1].preview.palette), '採用案と違う');
    assert(JSON.stringify(next.palette) !== JSON.stringify(cands[0].preview.palette), '別の案が混ざった');
  });
  test('ガチャ：採用しても対象外は変わらない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var next = GA.apply(o, GA.roll(o, { target: 'palette', seed: 42 })[0]);
    eq(JSON.stringify(next.garment), JSON.stringify(o.garment), '基本衣装が動いた');
    eq(JSON.stringify(next.parts), JSON.stringify(o.parts), '部位が動いた');
  });
  test('ガチャ：維持条件（世界観・主様式・基本衣装）を破らない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    GA.roll(o, { target: 'decorations', keeps: GA.defaultKeeps(), seed: 3 }).forEach(function (c) {
      eq(c.preview.concept.worldview, o.concept.worldview);
      eq(c.preview.concept.primaryStyle, o.concept.primaryStyle);
      eq(c.preview.garment.subtype, o.garment.subtype);
    });
  });
  test('ガチャ：主色を維持ONなら主色が動かない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    GA.roll(o, { target: 'palette', keeps: ['primaryColor'], seed: 42 }).forEach(function (c) {
      eq(c.preview.palette.primary, o.palette.primary);
    });
  });
  test('ガチャ：主色を維持OFFなら主色も振れる', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var moved = GA.roll(o, { target: 'palette', keeps: [], seed: 42 }).some(function (c) {
      return c.preview.palette.primary !== o.palette.primary;
    });
    assert(moved, '主色が一度も動かなかった');
  });
  test('ガチャ：基本衣装を維持ONなら基本衣装ガチャは案を返さない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    eq(GA.roll(o, { target: 'garment', keeps: ['garment'], seed: 42 }).length, 0);
  });
  test('ガチャ：属性を維持ONなら属性ガチャは案を返さない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'mage').patch);
    eq(GA.roll(o, { target: 'attribute', keeps: ['attribute'], seed: 1 }).length, 0);
  });
  test('ガチャ：breaksKeeps が維持条件の破りを見つける', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var moved = SC.applyPatch(o, { concept: { worldview: 'modern' } });
    assert(GA.breaksKeeps(o, moved, ['worldview']), '破りを見逃した');
    assert(!GA.breaksKeeps(o, moved, ['primaryColor']), '関係ない条件で破りと判定した');
  });
  test('ガチャ：hard競合を含む案は出さない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'gothic').patch);
    ['palette', 'materials', 'decorations', 'collar', 'sleeves', 'legwear'].forEach(function (t) {
      GA.roll(o, { target: t, seed: 11 }).forEach(function (c) {
        eq(c.summary.hard, 0, t + ' の案に hard が混ざった');
      });
    });
  });
  test('ガチャ：現在と同じ案は出さない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    GA.roll(o, { target: 'palette', seed: 42 }).forEach(function (c) {
      assert(c.diff.length > 0, '差分ゼロの案が出た');
      assert(JSON.stringify(c.preview.palette) !== JSON.stringify(o.palette), '現在と同じ案が出た');
    });
  });
  test('ガチャ：同じ案を重ねて出さない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    var keys = GA.roll(o, { target: 'palette', seed: 42 }).map(function (c) { return JSON.stringify(c.diff); });
    eq(new Set(keys).size, keys.length, '同じ案が並んだ');
  });
  test('ガチャ：存在しないIDを含む案は出さない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    ['palette', 'materials', 'decorations'].forEach(function (t) {
      GA.roll(o, { target: t, seed: 5 }).forEach(function (c) {
        D.colorRoles.forEach(function (r) {
          var v = c.preview.palette[r.id];
          if (v) assert(U.byId(D.colors, v), '存在しない色 ' + v);
        });
        (c.preview.decorations.items || []).forEach(function (i) {
          assert(U.byId(D.decorations, i.type), '存在しない装飾 ' + i.type);
        });
      });
    });
  });
  test('ガチャ：各案に日本語の差分が付く', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    GA.roll(o, { target: 'palette', seed: 42 }).forEach(function (c) {
      c.diff.forEach(function (d) {
        assert(d.labelJa && d.fromJa && d.toJa, '差分の表示が欠けている：' + JSON.stringify(d));
        assert(!/^[a-z_]+$/.test(d.toJa), '英語IDのまま出ている：' + d.toJa);
      });
    });
  });
  test('ガチャ：各案に警告判定が付く', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'royalty').patch);
    GA.roll(o, { target: 'palette', seed: 42 }).forEach(function (c) {
      assert(c.summary && typeof c.summary.total === 'number', '警告集計が無い');
    });
  });
  test('ガチャ：知らない対象を渡すと空で返る', function () {
    eq(GA.roll(SC.createOutfit(), { target: 'nonexistent', seed: 1 }).length, 0);
  });
  test('ガチャ：レッグウェアの案は層を持つ', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'gothic').patch);
    GA.roll(o, { target: 'legwear', seed: 9 }).forEach(function (c) {
      (c.preview.parts.legwear || []).forEach(function (i) {
        assert(U.byId(D.partLayers, i.layer), '層が不正：' + i.layer);
      });
    });
  });
  test('ガチャ：makeRng は seed が同じなら同じ列を返す', function () {
    var a = GA.makeRng({ seed: 1 }), b = GA.makeRng({ seed: 1 });
    for (var i = 0; i < 5; i++) eq(a(), b());
  });

  /* ---- Phase 3 の出力が壊れていないこと ---- */
  test('回帰：ケースAの短縮版が Phase 3 と同じ', function () {
    var o = outfit({
      garment: { category: 'lingerie', subtype: 'lace_bodysuit' },
      silhouette: { fit: 'fitted' },
      parts: {
        collar: 'high_standing_collar', sleeves: 'fitted_long_sleeves',
        handwear: { type: 'hand_gloves', material: 'lace_hand', length: 'elbow_length', fingertips: 'fingerless' },
        legwear: [{ id: 'thigh_high_stockings', layer: 'main' }]
      },
      materials: { primary: 'lace', transparency: 'sheer', patterns: ['floral_lace_pattern'] },
      palette: { primary: 'jet_black', accent: 'polished_silver', scheme: 'monochrome' }
    });
    eq(CPW.generator.short(o),
      'jet black lace bodysuit, with polished silver accents, monochrome palette, body-hugging, high standing collar, fitted long sleeves, elbow-length fingerless lace gloves, thigh-high stockings, sheer floral lace');
  });

  /* ============================================================
   * Phase 5A
   * ========================================================== */

  var SPW = function () { return D.specialPartSlot('wings'); };
  var SPH = function () { return D.specialPartSlot('horns'); };
  var SPL = function () { return D.specialPartSlot('halo'); };
  var SPT = function () { return D.specialPartSlot('tail'); };

  /* ---- 特殊パーツ：複合軸 ---- */
  test('特殊：翼が複合スロットになっている', function () {
    var w = SPW();
    eq(w.kind, 'composite');
    eq(w.requiredAxis, 'type');
    eq(w.axes.map(function (a) { return a.key; }).join(','), 'type,size,spread,count,texture,color');
  });
  test('特殊：翼のデータが揃っている（Phase 5B前半：種類10以上・大きさ4・開き方4・質感6）', function () {
    var w = SPW();
    assert(SC.axisOf(w, 'type').options.length >= 10, '翼の種類が10未満：' + SC.axisOf(w, 'type').options.length);
    eq(SC.axisOf(w, 'size').options.length, 4);
    eq(SC.axisOf(w, 'spread').options.length, 4);
    eq(SC.axisOf(w, 'texture').options.length, 6);
    eq(SC.axisOf(w, 'count').options.length, 3);
  });
  test('特殊：角・光輪・尾も複合スロット', function () {
    [SPH(), SPL(), SPT()].forEach(function (sl) {
      eq(sl.kind, 'composite', sl.id);
      eq(sl.requiredAxis, 'type', sl.id);
      assert(SC.axisOf(sl, 'color'), sl.id + ' に色の軸がない');
    });
  });
  test('特殊：角10以上・光輪8以上・尾10以上（Phase 5B前半で拡張）', function () {
    var h = SC.axisOf(SPH(), 'type').options.length;
    var l = SC.axisOf(SPL(), 'type').options.length;
    var t = SC.axisOf(SPT(), 'type').options.length;
    assert(h >= 10, '角が ' + h);
    assert(l >= 8, '光輪が ' + l);
    assert(t >= 10, '尾が ' + t);
  });
  test('特殊：浮遊装飾5・魔法的装飾5', function () {
    eq(D.specialParts.floating.length, 5);
    eq(D.specialParts.magical.length, 5);
  });
  test('特殊：翼の6軸すべてを保持できる', function () {
    var o = outfit({ specialParts: { wings: {
      type: 'angel_wings', size: 'wing_large', spread: 'wing_spread_wide',
      count: 'wing_one_pair', texture: 'wing_feathered', color: 'wing_color_primary'
    } } });
    var a = SC.activeComposite(SPW(), o.specialParts.wings);
    eq(Object.keys(a).length, 6);
    eq(a.texture, 'wing_feathered');
  });

  /* ---- 特殊パーツ：種類未選択の休止 ---- */
  test('特殊：種類未選択なら従属値は休止する', function () {
    var o = outfit({ specialParts: { wings: { size: 'wing_massive', spread: 'wing_folded' } } });
    eq(SC.activeComposite(SPW(), o.specialParts.wings), null);
    eq(SC.activeSpecialParts(o).length, 0);
  });
  test('特殊：休止中でも値は状態に残る', function () {
    var o = outfit({ specialParts: { wings: { size: 'wing_massive' } } });
    eq(o.specialParts.wings.size, 'wing_massive');
  });
  test('特殊：休止中は英語に出ない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, specialParts: { wings: { size: 'wing_massive', texture: 'wing_feathered' } } });
    assert(CPW.generator.short(o).indexOf('wings') < 0, '出てしまった');
  });
  test('特殊：休止中は完成度・警告に混ざらない', function () {
    var o = outfit({ specialParts: { wings: { size: 'wing_massive' } } });
    var toks = AD.tokens(o).filter(function (t) { return t.kind === 'special'; });
    eq(toks.length, 0);
  });
  test('特殊：種類を選び直すと休止中の値がそのまま戻る', function () {
    var o = outfit({ specialParts: { wings: { size: 'wing_massive', texture: 'wing_feathered' } } });
    var back = SC.applyPatch(o, { specialParts: { wings: { type: 'demon_wings' } } });
    var a = SC.activeComposite(SPW(), back.specialParts.wings);
    eq(a.size, 'wing_massive');
    eq(a.texture, 'wing_feathered');
  });

  /* ---- 特殊パーツ：保存・復元・JSON往復 ---- */
  test('特殊：JSON往復で翼の6軸が維持される', function () {
    var o = outfit({ specialParts: { wings: {
      type: 'mechanical_wings', size: 'wing_medium', spread: 'wing_half_open',
      count: 'wing_two_pairs', texture: 'wing_metallic', color: 'wing_color_metal'
    } } });
    var back = SC.normalize(JSON.parse(JSON.stringify(o)));
    eq(JSON.stringify(back.specialParts.wings), JSON.stringify(o.specialParts.wings));
  });
  test('特殊：JSON往復でチェーン・浮遊・魔法的が維持される', function () {
    var o = outfit({ specialParts: {
      decorativeChains: ['chest_chain'], restraintChains: ['wrist_chain'],
      floating: ['floating_petals'], magical: ['rune_bands']
    } });
    var back = SC.normalize(JSON.parse(JSON.stringify(o)));
    eq(back.specialParts.decorativeChains.join(), 'chest_chain');
    eq(back.specialParts.restraintChains.join(), 'wrist_chain');
    eq(back.specialParts.floating.join(), 'floating_petals');
    eq(back.specialParts.magical.join(), 'rune_bands');
  });
  test('特殊：存在しないIDは取り込み時に捨てる', function () {
    var o = SC.normalize({ concept: {}, garment: {}, specialParts: {
      wings: { type: 'no_such_wing', size: 'wing_large' },
      floating: ['floating_petals', 'no_such_float'], magical: ['nope']
    } });
    eq(o.specialParts.wings.type, undefined);
    eq(o.specialParts.wings.size, 'wing_large');
    eq(o.specialParts.floating.join(), 'floating_petals');
    eq(o.specialParts.magical.length, 0);
  });
  test('特殊：同じチェーンを二重に持たない', function () {
    var o = SC.normalize({ concept: {}, garment: {}, specialParts: { decorativeChains: ['chest_chain', 'chest_chain'] } });
    eq(o.specialParts.decorativeChains.length, 1);
  });
  test('特殊：Phase 4 の保存データ（翼）が移行する', function () {
    var o = SC.normalize({ concept: {}, garment: {}, specialParts: { wings: { type: 'feathered_wings', size: 'massive_wings', spread: 'wide_open' } } });
    eq(o.specialParts.wings.type, 'bird_wings');
    eq(o.specialParts.wings.texture, 'wing_feathered');
    eq(o.specialParts.wings.size, 'wing_massive');
    eq(o.specialParts.wings.spread, 'wing_spread_wide');
  });
  test('特殊：Phase 4 の保存データ（文字列の角・光輪・尾）が移行する', function () {
    var o = SC.normalize({ concept: {}, garment: {}, specialParts: { horns: 'crystal_horns', halo: 'broken_halo', tail: 'fish_tail' } });
    eq(o.specialParts.horns.type, 'horn_crystal');
    eq(o.specialParts.halo.type, 'halo_broken');
    eq(o.specialParts.tail.type, 'tail_animal');
    eq(o.specialParts.tail.tip, 'tail_tip_fin');
  });
  test('特殊：legacyMap の参照先はすべて実在する', function () {
    D.specialParts.slots.forEach(function (slot) {
      Object.keys(slot.legacyMap || {}).forEach(function (oldId) {
        var m = slot.legacyMap[oldId];
        Object.keys(m).forEach(function (axisKey) {
          var axis = SC.axisOf(slot, axisKey);
          assert(axis, slot.id + '.legacyMap.' + oldId + ' が知らない軸 ' + axisKey + ' を指す');
          assert(U.byId(axis.options, m[axisKey]), slot.id + '.legacyMap.' + oldId + ' → ' + m[axisKey] + ' が無い');
        });
      });
    });
  });
  test('特殊：部位スロットIDの旧名（camelCase）が移行する', function () {
    var o = SC.normalize({ concept: {}, garment: { category: 'dress', subtype: 'ball_gown' }, parts: { skirtShape: 'a_line_skirt', coverUp: 'shoulder_cape' } });
    eq(o.parts.skirt_shape, 'a_line_skirt');
    eq(o.parts.cover_up, 'shoulder_cape');
    eq(o.parts.skirtShape, undefined);
  });

  /* ---- 特殊パーツ：短縮版 ---- */
  test('特殊：短縮版が一句にまとまる（一般語と具体語を並べない）', function () {
    var o = outfit({ specialParts: { wings: { type: 'angel_wings', size: 'wing_large', spread: 'wing_spread_wide', texture: 'wing_feathered' } } });
    var sh = CPW.generator.short(o);
    assert(sh.indexOf('large spread feathered angel wings') >= 0, sh);
    assert(sh.indexOf('angel wings, large') < 0, '重複した：' + sh);
  });
  test('特殊：翼に冠詞を付けない（もともと複数形）', function () {
    var o = outfit({ specialParts: { wings: { type: 'demon_wings', texture: 'wing_leathery' } } });
    assert(/leathery demon wings/.test(CPW.generator.short(o)));
    assert(!/a leathery demon wings/.test(CPW.generator.short(o)));
  });
  test('特殊：一対を選ぶと a pair of が付く', function () {
    var o = outfit({ specialParts: { wings: { type: 'angel_wings', count: 'wing_one_pair' } } });
    assert(/a pair of angel wings/.test(CPW.generator.short(o)));
  });
  test('特殊：光輪は単数の可算なので冠詞が付く', function () {
    var o = outfit({ specialParts: { halo: { type: 'halo_broken', glow: 'halo_matte' } } });
    assert(/a matte broken halo/.test(CPW.generator.short(o)), CPW.generator.short(o));
  });
  test('特殊：尾の先端は後置の with 句になる', function () {
    var o = outfit({ specialParts: { tail: { type: 'tail_demon', length: 'tail_long', tip: 'tail_tip_spade' } } });
    assert(/a long demon tail with a spade-shaped tip/.test(CPW.generator.short(o)), CPW.generator.short(o));
  });
  test('特殊：尾を複数にすると核が複数形になる', function () {
    var o = outfit({ specialParts: { tail: { type: 'tail_animal', count: 'tail_many' } } });
    assert(/multiple animal tails/.test(CPW.generator.short(o)), CPW.generator.short(o));
  });
  test('特殊：光輪の位置は後置される', function () {
    var o = outfit({ specialParts: { halo: { type: 'halo_ring', position: 'halo_behind' } } });
    assert(/behind the head/.test(CPW.generator.short(o)));
  });

  /* ---- 特殊パーツ：詳細版 ---- */
  test('特殊：詳細版で翼が衣装本文の最後へ接続される', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, specialParts: { wings: { type: 'angel_wings', count: 'wing_one_pair', texture: 'wing_feathered' } } });
    var de = CPW.generator.detailed(o);
    assert(/completed with a pair of feathered angel wings behind the wearer/.test(de), de);
  });
  test('特殊：詳細版で光輪は crowned by になる', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, specialParts: { halo: { type: 'halo_ring' } } });
    assert(/crowned by a halo/.test(CPW.generator.detailed(o)), CPW.generator.detailed(o));
  });
  test('特殊：詳細版で角と尾は featuring になる', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, specialParts: { horns: { type: 'horn_curved' }, tail: { type: 'tail_demon' } } });
    assert(/featuring curved horns and a demon tail/.test(CPW.generator.detailed(o)), CPW.generator.detailed(o));
  });
  test('特殊：詳細版で接続語が二重にならない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, specialParts: { wings: { type: 'angel_wings' } } });
    assert(!/with completed with/.test(CPW.generator.detailed(o)));
  });

  /* ---- 特殊パーツ：色連動 ---- */
  test('特殊：主色と連動すると衣装の主色が入る', function () {
    var o = outfit({ palette: { primary: 'jet_black' }, specialParts: { wings: { type: 'angel_wings', color: 'wing_color_primary' } } });
    assert(/jet black angel wings/.test(CPW.generator.short(o)), CPW.generator.short(o));
  });
  test('特殊：主色を変えると連動先も動く', function () {
    var o = outfit({ palette: { primary: 'jet_black' }, specialParts: { wings: { type: 'angel_wings', color: 'wing_color_primary' } } });
    var next = SC.applyPatch(o, { palette: { primary: 'pure_white' } });
    assert(/pure white angel wings/.test(CPW.generator.short(next)));
  });
  test('特殊：金属色と連動する', function () {
    var o = outfit({ palette: { metal: 'polished_silver' }, specialParts: { halo: { type: 'halo_ring', color: 'halo_color_metal' } } });
    assert(/polished silver halo/.test(CPW.generator.short(o)), CPW.generator.short(o));
  });
  test('特殊：個別指定の色が使える', function () {
    var o = outfit({ palette: { primary: 'pure_white' }, specialParts: { wings: { type: 'angel_wings', color: 'wing_color_individual', colorId: 'jet_black' } } });
    assert(/jet black angel wings/.test(CPW.generator.short(o)), CPW.generator.short(o));
  });
  test('特殊：連動を選んだら colorId は持たない', function () {
    var o = SC.normalize({ concept: {}, garment: {}, specialParts: { wings: { type: 'angel_wings', color: 'wing_color_primary', colorId: 'jet_black' } } });
    eq(o.specialParts.wings.colorId, undefined);
  });
  test('特殊：連動先が未設定なら色を足さない', function () {
    var o = outfit({ specialParts: { wings: { type: 'angel_wings', color: 'wing_color_metal' } } });
    eq(SC.specialPartColor(o, SPW(), o.specialParts.wings), null);
  });

  /* ---- 特殊パーツ：チェーンの分離 ---- */
  test('特殊：装飾チェーンは衣装のみ出力でも出る', function () {
    var o = outfit({ specialParts: { decorativeChains: ['chest_chain'] } });
    assert(!o.output.includeNarrative, '前提：物語はOFF');
    assert(/chest chains/.test(CPW.generator.short(o)));
  });
  test('特殊：拘束チェーンは物語OFFなら出ない', function () {
    var o = outfit({ specialParts: { restraintChains: ['wrist_chain'] } });
    assert(!/chained wrists/.test(CPW.generator.short(o)));
  });
  test('特殊：拘束チェーンは物語ONで出る', function () {
    var o = outfit({ output: { includeNarrative: true }, specialParts: { restraintChains: ['wrist_chain'] } });
    assert(/chained wrists/.test(CPW.generator.short(o)));
  });
  test('特殊：装飾チェーンと拘束チェーンはカテゴリが別', function () {
    var dec = D.specialParts.decorativeChains.map(function (c) { return c.id; });
    D.specialParts.restraintChains.forEach(function (c) {
      assert(dec.indexOf(c.id) < 0, c.id + ' が両方にある');
      assert(c.narrative === true, c.id + ' に narrative が無い');
    });
  });
  test('特殊：魔法的装飾はエフェクトOFFでも出る（装飾だから）', function () {
    var o = outfit({ specialParts: { magical: ['magic_circle'] } });
    assert(!o.output.includeEffects, '前提：エフェクトはOFF');
    assert(/arcane circle motifs/.test(CPW.generator.short(o)));
  });
  test('特殊：浮遊装飾はエフェクトOFFでも出る（物だから）', function () {
    var o = outfit({ specialParts: { floating: ['floating_petals'] } });
    assert(/drifting petals/.test(CPW.generator.short(o)));
  });

  /* ---- 特殊パーツ：競合 ---- */
  function issueIds(o) { return AD.check(o).map(function (i) { return i.id; }); }

  test('競合：巨大な翼 × 背中を覆うケープ は warning', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { cover_up: 'full_back_cape' }, specialParts: { wings: { type: 'angel_wings', size: 'wing_massive' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'massive_wings_vs_back_cape'; })[0];
    assert(i, '出ない');
    eq(i.severity, 'warning');
  });
  test('競合：翼が中くらいならケープと競合しない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { cover_up: 'full_back_cape' }, specialParts: { wings: { type: 'angel_wings', size: 'wing_medium' } } });
    assert(issueIds(o).indexOf('massive_wings_vs_back_cape') < 0);
  });
  test('競合：ケープを肩掛けにする案で警告が消える', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { cover_up: 'full_back_cape' }, specialParts: { wings: { type: 'angel_wings', size: 'wing_massive' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'massive_wings_vs_back_cape'; })[0];
    var fix = i.resolutions.filter(function (r) { return r.action === 'replaceRightWith:shoulder_cape'; })[0];
    assert(fix && fix.patch, '案が無い');
    assert(issueIds(SC.applyPatch(o, fix.patch)).indexOf('massive_wings_vs_back_cape') < 0, '消えない');
  });
  test('競合：翼を小さくする案で警告が消える', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { cover_up: 'full_back_cape' }, specialParts: { wings: { type: 'angel_wings', size: 'wing_massive' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'massive_wings_vs_back_cape'; })[0];
    var fix = i.resolutions.filter(function (r) { return r.action === 'replaceLeftWith:wing_small'; })[0];
    assert(fix && fix.patch, '案が無い');
    assert(issueIds(SC.applyPatch(o, fix.patch)).indexOf('massive_wings_vs_back_cape') < 0, '消えない');
  });
  test('競合：巨大な翼 × 背中の大きな装飾 は warning', function () {
    var o = outfit({
      garment: { category: 'dress', subtype: 'ball_gown' },
      decorations: { items: [{ type: 'brooch_cluster', placements: ['back'], size: 'large', quantity: 'few' }] },
      specialParts: { wings: { type: 'angel_wings', size: 'wing_massive' } }
    });
    assert(issueIds(o).indexOf('massive_wings_vs_back_ornament') >= 0);
  });
  test('競合：大きな角 × かさばる頭部装飾 は warning', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { headwear: 'oversized_bonnet' }, specialParts: { horns: { type: 'horn_ram', size: 'horn_large' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'large_horns_vs_headpiece'; })[0];
    assert(i, '出ない');
    eq(i.severity, 'warning');
    assert(i.resolutions.filter(function (r) { return r.patch; }).length > 0, '案が無い');
  });
  test('競合：角を小さくする案で警告が消える', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { headwear: 'oversized_bonnet' }, specialParts: { horns: { type: 'horn_ram', size: 'horn_large' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'large_horns_vs_headpiece'; })[0];
    var fix = i.resolutions.filter(function (r) { return r.action === 'replaceLeftWith:horn_small'; })[0];
    assert(issueIds(SC.applyPatch(o, fix.patch)).indexOf('large_horns_vs_headpiece') < 0);
  });
  test('競合：光輪 × 背の高い冠 は warning', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { headwear: 'tall_crown' }, specialParts: { halo: { type: 'halo_ring' } } });
    assert(issueIds(o).indexOf('halo_vs_headpiece') >= 0);
  });
  test('競合：光輪を背後へ回せば頭部装飾と競合しない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { headwear: 'tall_crown' }, specialParts: { halo: { type: 'halo_ring', position: 'halo_behind' } } });
    assert(issueIds(o).indexOf('halo_vs_headpiece') < 0);
  });
  test('競合：光輪の警告は1件にまとまる（軸ごとに増えない）', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { headwear: 'oversized_bonnet' }, specialParts: { halo: { type: 'halo_ring', position: 'halo_above', form: 'halo_ornate' } } });
    eq(AD.check(o).filter(function (x) { return x.id === 'halo_vs_headpiece'; }).length, 1);
  });
  test('競合：複数の尾 × 引き裾 は warning', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, silhouette: { length: 'train' }, specialParts: { tail: { type: 'tail_animal', count: 'tail_many' } } });
    assert(issueIds(o).indexOf('multi_tail_vs_train') >= 0);
  });
  test('競合：尾が1本なら引き裾と競合しない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, silhouette: { length: 'train' }, specialParts: { tail: { type: 'tail_animal', count: 'tail_one' } } });
    assert(issueIds(o).indexOf('multi_tail_vs_train') < 0);
  });
  test('競合：機械の翼 × 低技術の世界観 は warning（禁止ではない）', function () {
    var o = outfit({ concept: { worldview: 'historical_western' }, specialParts: { wings: { type: 'mechanical_wings' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'mechanical_wings_vs_historical'; })[0];
    assert(i, '出ない');
    eq(i.severity, 'warning');
    assert(i.resolutions.some(function (r) { return r.action === 'ignore'; }), '維持する道が無い');
  });
  test('競合：機械の翼はSFなら競合しない', function () {
    var o = outfit({ concept: { worldview: 'sci_fi' }, specialParts: { wings: { type: 'mechanical_wings' } } });
    assert(issueIds(o).indexOf('mechanical_wings_vs_historical') < 0);
  });
  test('競合：羽毛の翼 × 全部が金属の素材 は warning', function () {
    var o = outfit({ materials: { primary: 'plate_armor' }, specialParts: { wings: { type: 'angel_wings', texture: 'wing_feathered' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'feathered_wings_vs_mechanical_theme'; })[0];
    assert(i, '出ない');
    eq(i.severity, 'warning');
  });
  test('競合：機械の翼なら金属の素材と競合しない', function () {
    var o = outfit({ materials: { primary: 'plate_armor' }, specialParts: { wings: { type: 'mechanical_wings', texture: 'wing_metallic' } } });
    assert(issueIds(o).indexOf('feathered_wings_vs_mechanical_theme') < 0);
  });
  test('競合：飾り鎖だけで他に装飾が無いと info', function () {
    var o = outfit({ specialParts: { decorativeChains: ['chest_chain'] } });
    var i = AD.check(o).filter(function (x) { return x.id === 'decorative_chains_alone'; })[0];
    assert(i, '出ない');
    eq(i.severity, 'info');
  });
  test('競合：拘束チェーン × 物語OFF は info（競合ではない）', function () {
    var o = outfit({ specialParts: { restraintChains: ['wrist_chain'] } });
    var i = AD.check(o).filter(function (x) { return x.severity === 'info' && /物語|narrative/.test(x.titleJa + x.messageJa); })[0];
    assert(i, '出ない');
  });
  test('競合：休止中の特殊パーツは info で知らせる', function () {
    var o = outfit({ specialParts: { wings: { size: 'wing_large' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'wings_type_dormant'; })[0];
    assert(i, '出ない');
    eq(i.severity, 'info');
  });
  test('競合：主テーマと翼が同じことを指すと info', function () {
    var o = outfit({ concept: { primaryThemeMotif: 'angel' }, specialParts: { wings: { type: 'angel_wings' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'theme_duplicates_special_part'; })[0];
    assert(i, '出ない');
    eq(i.severity, 'info');
  });
  test('競合：闇属性 × 堕天使の翼 は重複と見なさない', function () {
    var o = outfit({ concept: { attribute: { id: 'darkness' } }, specialParts: { wings: { type: 'fallen_angel_wings' } } });
    assert(issueIds(o).indexOf('theme_duplicates_special_part') < 0);
  });
  test('競合：特殊パーツのルールがすべて解決案か理由を持つ', function () {
    D.rules.filter(function (r) { return r.category === '特殊パーツ'; }).forEach(function (r) {
      assert(r.titleJa, r.id + ' に題が無い');
      assert(r.kind === 'check' || r.resolutions.length > 0, r.id + ' に案が無い');
    });
  });

  /* ---- 属性 ---- */
  var ATTR_FIELDS = ['colors', 'materials', 'decorations', 'silhouettes', 'motifs', 'effects', 'moods', 'recommendedStyles', 'avoidTags'];
  function silIds() {
    var m = {};
    Object.keys(D.silhouette).forEach(function (k) { D.silhouette[k].forEach(function (o) { m[o.id] = 1; }); });
    return m;
  }
  test('属性：9属性ある', function () { eq(D.attributes.length, 9); });
  test('属性：9属性すべてが必要な項目を持つ', function () {
    D.attributes.forEach(function (a) {
      ATTR_FIELDS.forEach(function (f) {
        assert(Array.isArray(a[f]) && a[f].length, a.id + ' の ' + f + ' が無い/空');
      });
    });
  });
  test('属性：色の参照先がすべて実在する', function () {
    D.attributes.forEach(function (a) {
      a.colors.forEach(function (id) { assert(U.byId(D.colors, id), a.id + '.colors:' + id); });
    });
  });
  test('属性：素材の参照先がすべて実在する', function () {
    D.attributes.forEach(function (a) {
      a.materials.forEach(function (id) { assert(U.byId(D.materials, id), a.id + '.materials:' + id); });
    });
  });
  test('属性：装飾の参照先がすべて実在する（柄を含む）', function () {
    D.attributes.forEach(function (a) {
      a.decorations.forEach(function (id) {
        assert(U.byId(D.decorations, id) || U.byId(D.patterns, id), a.id + '.decorations:' + id);
      });
    });
  });
  test('属性：シルエットの参照先がすべて実在する', function () {
    var sil = silIds();
    D.attributes.forEach(function (a) {
      a.silhouettes.forEach(function (id) { assert(sil[id], a.id + '.silhouettes:' + id); });
    });
  });
  test('属性：モチーフの参照先がすべて実在する', function () {
    D.attributes.forEach(function (a) {
      a.motifs.forEach(function (id) { assert(U.byId(D.motifs, id), a.id + '.motifs:' + id); });
    });
  });
  test('属性：推奨様式の参照先がすべて実在する', function () {
    D.attributes.forEach(function (a) {
      a.recommendedStyles.forEach(function (id) { assert(U.byId(D.styles, id), a.id + '.recommendedStyles:' + id); });
    });
  });
  test('属性：光は天使モチーフと同一視しない', function () {
    var a = U.byId(D.attributes, 'light');
    assert(a.motifs.indexOf('angel') < 0, '光に angel が入っている');
    assert(a.motifs.indexOf('fallen_angel') < 0);
  });
  test('属性：闇は悪魔モチーフと同一視しない', function () {
    var a = U.byId(D.attributes, 'darkness');
    assert(a.motifs.indexOf('demon') < 0, '闇に demon が入っている');
  });
  test('属性：闇属性だけでは悪魔パーツが付かない', function () {
    var o = outfit({ concept: { attribute: { id: 'darkness' } } });
    eq(SC.activeSpecialParts(o).length, 0);
    assert(!/demon/.test(CPW.generator.short(o)));
  });
  test('属性：光属性だけでは天使パーツが付かない', function () {
    var o = outfit({ concept: { attribute: { id: 'light' } } });
    eq(SC.activeSpecialParts(o).length, 0);
    assert(!/angel|halo/.test(CPW.generator.short(o)));
  });
  test('属性：氷と水を混ぜない', function () {
    var ice = U.byId(D.attributes, 'ice'), water = U.byId(D.attributes, 'water');
    ['decorations', 'silhouettes', 'motifs'].forEach(function (f) {
      var ov = ice[f].filter(function (x) { return water[f].indexOf(x) >= 0; });
      eq(ov.length, 0, f + ' が重なっている：' + ov.join());
    });
    assert(ice.colors.filter(function (x) { return water.colors.indexOf(x) >= 0; }).length <= 1, '色が重なりすぎ');
  });
  test('属性：氷は結晶と鋭さ、水は流れと波', function () {
    var ice = U.byId(D.attributes, 'ice'), water = U.byId(D.attributes, 'water');
    assert(ice.decorations.indexOf('crystal_embroidery') >= 0 || ice.decorations.indexOf('snowflake_motif') >= 0);
    assert(water.decorations.indexOf('wave_pattern') >= 0);
    assert(water.materials.indexOf('flowing_chiffon') >= 0);
    assert(ice.materials.indexOf('flowing_chiffon') < 0, '氷に流れる素材が入っている');
  });
  test('属性：自然を緑と花だけにしていない', function () {
    var a = U.byId(D.attributes, 'nature');
    assert(a.colors.indexOf('warm_brown') >= 0, '土や樹皮の色がない');
    assert(a.materials.indexOf('leather') >= 0 || a.materials.indexOf('linen') >= 0, '有機的な素材がない');
  });
  test('属性：同じ候補を5属性以上で使い回さない', function () {
    var cnt = {};
    D.attributes.forEach(function (a) {
      ['colors', 'materials', 'decorations'].forEach(function (f) {
        a[f].forEach(function (id) { cnt[id] = (cnt[id] || 0) + 1; });
      });
    });
    Object.keys(cnt).forEach(function (id) { assert(cnt[id] <= 4, id + ' が ' + cnt[id] + ' 属性で重なる'); });
  });
  test('属性：avoidTags が王道候補の歯止めになる', function () {
    var o = outfit({ concept: { worldview: 'western_fantasy', attribute: { id: 'water', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: true, effects: false } } }, garment: { category: 'dress', subtype: 'ball_gown' } });
    var r = AD.suggest(o, { mode: 'standard', limit: 16 });
    r.forEach(function (c) {
      if (c.category !== '素材') return;
      var m = U.byId(D.materials, c.valueId);
      if (!m) return;
      assert((m.tags || []).indexOf('rigid') < 0, '水属性に硬い素材が出た：' + c.labelJa);
    });
  });
  // 同じIDが世界観・様式など別の理由でも出ることがあるので、
  // 「属性を理由に挙げていないか」で見る。IDの一致だけでは判定にならない。
  test('属性：反映先 applyTo が OFF なら、属性を理由にした候補を出さない', function () {
    var o = outfit({ concept: { worldview: 'western_fantasy', attribute: { id: 'fire', intensity: 'standard', applyTo: { colors: false, materials: false, decorations: false, silhouette: false, effects: false } } }, garment: { category: 'dress', subtype: 'ball_gown' } });
    AD.suggest(o, { mode: 'standard', limit: 16 }).forEach(function (c) {
      assert((c.reasonJa || '').indexOf('炎') < 0, '炎属性を理由に挙げた：' + c.labelJa + '（' + c.reasonJa + '）');
    });
  });
  test('属性：反映先 applyTo が ON なら、属性を理由にした候補が出る', function () {
    var o = outfit({ concept: { worldview: 'western_fantasy', attribute: { id: 'fire', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: true, effects: false } } }, garment: { category: 'dress', subtype: 'ball_gown' } });
    var hit = AD.suggest(o, { mode: 'standard', limit: 16 }).some(function (c) {
      return (c.reasonJa || '').indexOf('炎') >= 0;
    });
    assert(hit, 'ONなのに属性由来の候補が出ない');
  });
  test('属性：9属性それぞれで候補が出る', function () {
    D.attributes.forEach(function (a) {
      var o = outfit({ concept: { worldview: 'western_fantasy', attribute: { id: a.id, intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: true, effects: false } } }, garment: { category: 'dress', subtype: 'ball_gown' } });
      assert(AD.suggest(o, { mode: 'standard', limit: 6 }).length > 0, a.id + ' で候補ゼロ');
    });
  });
  test('属性：エフェクトは includeEffects がONのときだけ', function () {
    var on = outfit({ output: { includeEffects: true }, concept: { attribute: { id: 'light', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: false, effects: true } } } });
    var off = outfit({ concept: { attribute: { id: 'light', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: false, effects: true } } } });
    assert(/radiant glow|divine light/.test(CPW.generator.short(on)), 'ONで出ない');
    assert(!/radiant glow|divine light/.test(CPW.generator.short(off)), 'OFFで出た');
  });
  test('属性：エフェクトOFFなら特殊パーツも余計な光を足さない', function () {
    var o = outfit({
      concept: { attribute: { id: 'light', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: false, effects: false } } },
      specialParts: { wings: { type: 'angel_wings' }, halo: { type: 'halo_ring', glow: 'halo_matte' } }
    });
    var sh = CPW.generator.short(o);
    assert(!/glow|glowing|mist|sparks|aura|light/.test(sh), '光が混ざった：' + sh);
  });

  /* ---- データ品質 ---- */
  test('品質：全リストでIDが重複しない', function () {
    var lists = {
      colors: D.colors, materials: D.materials, decorations: D.decorations, patterns: D.patterns,
      motifs: D.motifs, styles: D.styles, attributes: D.attributes, garments: D.garments,
      presets: D.presets, rules: D.rules, partSlots: D.partSlots,
      worldviews: D.worldviews, eras: D.eras, occasions: D.occasions, seasons: D.seasons, roles: D.roles,
      decorativeChains: D.specialParts.decorativeChains, restraintChains: D.specialParts.restraintChains,
      floating: D.specialParts.floating, magical: D.specialParts.magical
    };
    Object.keys(lists).forEach(function (k) {
      var seen = {};
      (lists[k] || []).forEach(function (o) {
        assert(!seen[o.id], k + ' に重複ID：' + o.id);
        seen[o.id] = true;
      });
    });
  });
  test('品質：部位スロットの選択肢にIDの重複が無い', function () {
    D.partSlots.forEach(function (slot) {
      var seen = {};
      (slot.options || []).forEach(function (o) {
        assert(!seen[o.id], slot.id + ' に重複：' + o.id);
        seen[o.id] = true;
      });
      (slot.axes || []).forEach(function (a) {
        var s2 = {};
        a.options.forEach(function (o) {
          assert(!s2[o.id], slot.id + '.' + a.key + ' に重複：' + o.id);
          s2[o.id] = true;
        });
      });
    });
  });
  test('品質：特殊パーツの軸の値にIDの重複が無い', function () {
    var seen = {};
    D.specialParts.slots.forEach(function (slot) {
      slot.axes.forEach(function (a) {
        a.options.forEach(function (o) {
          assert(!seen[o.id], '特殊パーツに重複ID：' + o.id);
          seen[o.id] = true;
        });
      });
    });
  });
  test('品質：すべてのIDが snake_case', function () {
    var bad = [];
    function walk(node, path) {
      if (Array.isArray(node)) return node.forEach(function (v, i) { walk(v, path + '[' + i + ']'); });
      if (!node || typeof node !== 'object') return;
      if (typeof node.id === 'string' && !/^[a-z][a-z0-9_]*$/.test(node.id)) bad.push(path + ':' + node.id);
      Object.keys(node).forEach(function (k) { walk(node[k], path + '.' + k); });
    }
    Object.keys(D).forEach(function (k) { if (typeof D[k] !== 'function') walk(D[k], k); });
    eq(bad.length, 0, bad.join(' / '));
  });
  test('品質：shortPrompt が空でない（空を許す軸を除く）', function () {
    var bad = [];
    D.colors.forEach(function (c) { if (!c.promptEn) bad.push('colors:' + c.id); });
    D.materials.forEach(function (m) { if (!m.shortPrompt) bad.push('materials:' + m.id); });
    D.decorations.forEach(function (x) { if (!x.shortPrompt) bad.push('decorations:' + x.id); });
    D.garments.forEach(function (g) { if (!g.shortPrompt) bad.push('garments:' + g.id); });
    ['decorativeChains', 'restraintChains', 'floating', 'magical'].forEach(function (k) {
      D.specialParts[k].forEach(function (x) { if (!x.shortPrompt) bad.push(k + ':' + x.id); });
    });
    D.specialParts.slots.forEach(function (slot) {
      SC.axisOf(slot, 'type').options.forEach(function (o) { if (!o.shortPrompt) bad.push(slot.id + '.type:' + o.id); });
    });
    eq(bad.length, 0, bad.join(' / '));
  });
  test('品質：labelJa が空でない', function () {
    var bad = [];
    function walk(node, path) {
      if (Array.isArray(node)) return node.forEach(function (v, i) { walk(v, path + '[' + i + ']'); });
      if (!node || typeof node !== 'object') return;
      if (typeof node.id === 'string' && 'labelJa' in node && !node.labelJa) bad.push(path + ':' + node.id);
      Object.keys(node).forEach(function (k) { walk(node[k], path + '.' + k); });
    }
    Object.keys(D).forEach(function (k) { if (typeof D[k] !== 'function') walk(D[k], k); });
    eq(bad.length, 0, bad.join(' / '));
  });
  test('品質：色のhexが正しい', function () {
    D.colors.forEach(function (c) {
      assert(/^#[0-9A-Fa-f]{6}$/.test(c.hex), c.id + ' の hex が不正：' + c.hex);
    });
  });
  test('品質：複合スロットの requiredAxis が実在する', function () {
    D.partSlots.concat(D.specialParts.slots).forEach(function (slot) {
      if (SC.slotKind(slot) !== 'composite') return;
      var key = slot.requiredAxis || 'type';
      assert(SC.axisOf(slot, key), slot.id + ' の requiredAxis ' + key + ' が無い');
    });
  });
  test('品質：phraseOrder が実在する軸だけを指す', function () {
    D.partSlots.concat(D.specialParts.slots).forEach(function (slot) {
      (slot.phraseOrder || []).forEach(function (key) {
        assert(SC.axisOf(slot, key), slot.id + '.phraseOrder が知らない軸 ' + key + ' を指す');
      });
      if (slot.countAxis) assert(SC.axisOf(slot, slot.countAxis), slot.id + '.countAxis が無い');
    });
  });
  test('品質：色連動の linkTo が実在するパスを指す', function () {
    var o = SC.createOutfit();
    D.specialParts.slots.forEach(function (slot) {
      SC.axisOf(slot, 'color').options.forEach(function (opt) {
        if (!opt.linkTo) return;
        assert(U.getPath(o, opt.linkTo) !== undefined, slot.id + ' の linkTo が届かない：' + opt.linkTo);
      });
    });
  });
  test('品質：衣装カテゴリが参照する部位スロットが実在する', function () {
    D.garmentCategories.forEach(function (c) {
      (c.slots || []).forEach(function (id) { assert(U.byId(D.partSlots, id), c.id + ' が知らないスロット ' + id + ' を指す'); });
      (c.requiredSlots || []).forEach(function (id) { assert(U.byId(D.partSlots, id), c.id + '.requiredSlots:' + id); });
      (c.recommendedSlots || []).forEach(function (id) { assert(U.byId(D.partSlots, id), c.id + '.recommendedSlots:' + id); });
    });
  });
  test('品質：プリセットの参照先がすべて実在する', function () {
    D.presets.forEach(function (p) {
      var o = SC.applyPatch(SC.createOutfit(), p.patch);
      Object.keys(o.parts).forEach(function (slotId) {
        var slot = U.byId(D.partSlots, slotId);
        assert(slot, p.id + ' が知らないスロット ' + slotId + ' を作る');
      });
      if (p.patch.garment && p.patch.garment.subtype) {
        assert(U.byId(D.garments, p.patch.garment.subtype), p.id + '.subtype:' + p.patch.garment.subtype);
      }
      if (p.patch.concept && p.patch.concept.attribute && p.patch.concept.attribute.id) {
        assert(U.byId(D.attributes, p.patch.concept.attribute.id), p.id + '.attribute');
      }
    });
  });
  // 部位は未設定なら parts に鍵が無い（それが正しい）。値の有無ではなく、
  // 「そのパスが指す先が、スキーマ上ちゃんと存在する場所か」を見る。
  function pathIsKnown(path) {
    var o = SC.createOutfit();
    var seg = path.split('.');
    if (seg[0] === 'parts') return !!U.byId(D.partSlots, seg[1]);
    if (seg[0] === 'specialParts') {
      if (seg.length === 1) return true;
      return !!D.specialPartSlot(seg[1]) || ['decorativeChains', 'restraintChains', 'floating', 'magical'].indexOf(seg[1]) >= 0;
    }
    // それ以外は、親までたどり着ければ良い（葉が null でも構わない）
    var parent = seg.slice(0, -1).join('.');
    return !parent || U.getPath(o, parent) !== undefined;
  }
  test('品質：ガチャの対象が実在するパスを指す', function () {
    GA.TARGETS.forEach(function (t) {
      (t.paths || []).forEach(function (p) {
        assert(pathIsKnown(p), t.id + ' の対象パスが届かない：' + p);
      });
    });
  });
  test('品質：ガチャの維持条件が実在するパスを指す', function () {
    GA.KEEPS.forEach(function (k) {
      (k.paths || []).forEach(function (p) {
        assert(pathIsKnown(p), k.id + ' の維持パスが届かない：' + p);
      });
    });
  });
  test('品質：ルールの selector が実在するパスを指す', function () {
    D.rules.filter(function (r) { return r.kind === 'pair'; }).forEach(function (r) {
      [r.left, r.right].forEach(function (sel) {
        (sel.paths || []).forEach(function (p) {
          assert(pathIsKnown(p), r.id + ' が届かないパスを指す：' + p);
        });
      });
    });
  });
  test('品質：ルールの action がすべて有効', function () {
    var VALID = ['keepLeft', 'keepRight', 'ignore'];
    var PREFIX = ['replaceLeftWith:', 'replaceRightWith:', 'moveRightToLayer:', 'moveLeftToSecondary', 'moveRightToSecondary', 'setPath:', 'setStyleOnly:'];
    D.rules.forEach(function (r) {
      (r.resolutions || []).forEach(function (res) {
        var ok = VALID.indexOf(res.action) >= 0 || PREFIX.some(function (p) { return res.action.indexOf(p) === 0; });
        assert(ok, r.id + ' が知らない action：' + res.action);
      });
    });
  });
  test('品質：ルールの check が advisor に実装されている', function () {
    D.rules.filter(function (r) { return r.kind === 'check'; }).forEach(function (r) {
      assert(typeof AD.CHECKS[r.check] === 'function', r.id + ' の check が無い：' + r.check);
    });
  });
  test('品質：ルールの selector が実在するスロットを指す', function () {
    D.rules.filter(function (r) { return r.kind === 'pair'; }).forEach(function (r) {
      [r.left, r.right].forEach(function (sel) {
        (sel.slots || []).forEach(function (id) { assert(U.byId(D.partSlots, id), r.id + ' が知らないスロット ' + id + ' を指す'); });
      });
    });
  });
  test('品質：ルールの setPath がすべて届く', function () {
    var o = SC.createOutfit();
    D.rules.forEach(function (r) {
      (r.resolutions || []).forEach(function (res) {
        if (res.action.indexOf('setPath:') !== 0) return;
        var path = res.action.slice(8).split('=')[0];
        var parent = path.split('.').slice(0, -1).join('.');
        assert(!parent || U.getPath(o, parent) !== undefined, r.id + ' の setPath が届かない：' + path);
      });
    });
  });
  test('品質：相性データの参照先が実在する', function () {
    Object.keys(D.affinity.worldviewStyles || {}).forEach(function (w) {
      assert(U.byId(D.worldviews, w), 'worldviewStyles が知らない世界観 ' + w);
      D.affinity.worldviewStyles[w].forEach(function (id) { assert(U.byId(D.styles, id), w + ' → ' + id); });
    });
    Object.keys(D.affinity.worldviewMaterials || {}).forEach(function (w) {
      D.affinity.worldviewMaterials[w].forEach(function (id) { assert(U.byId(D.materials, id), w + ' → ' + id); });
    });
    Object.keys(D.affinity.styleDecorations || {}).forEach(function (st) {
      assert(U.byId(D.styles, st), 'styleDecorations が知らない様式 ' + st);
    });
  });
  test('品質：英式綴りが混ざっていない（American へ統一）', function () {
    var bad = [];
    var BRITISH = [/\bgrey\b/i, /\bjewellery\b/i, /\bcolour/i, /\barmour\b/i, /\bcentre\b/i, /\bfibre\b/i, /\bdefence\b/i, /\bspiralling\b/i, /\w+isation\b/];
    function walk(node, path) {
      if (Array.isArray(node)) return node.forEach(function (v, i) { walk(v, path + '[' + i + ']'); });
      if (typeof node === 'string') {
        BRITISH.forEach(function (re) { if (re.test(node)) bad.push(path + ':"' + node + '"'); });
        return;
      }
      if (!node || typeof node !== 'object') return;
      Object.keys(node).forEach(function (k) {
        if (k === 'labelJa' || k === 'noteJa' || /Ja$/.test(k)) return;   // 日本語は対象外
        walk(node[k], path + '.' + k);
      });
    }
    Object.keys(D).forEach(function (k) { if (typeof D[k] !== 'function') walk(D[k], k); });
    eq(bad.length, 0, bad.join(' / '));
  });
  test('品質：複合語のハイフンが揃っている', function () {
    var bad = [];
    var LOOSE = [/\bfloor length\b/i, /\bbody hugging\b/i, /\bknee high\b/i, /\bthigh high\b/i, /\belbow length\b/i, /\bhigh waisted\b/i];
    function walk(node, path) {
      if (Array.isArray(node)) return node.forEach(function (v, i) { walk(v, path + '[' + i + ']'); });
      if (typeof node === 'string') { LOOSE.forEach(function (re) { if (re.test(node)) bad.push(path + ':"' + node + '"'); }); return; }
      if (!node || typeof node !== 'object') return;
      Object.keys(node).forEach(function (k) { if (!/Ja$/.test(k)) walk(node[k], path + '.' + k); });
    }
    Object.keys(D).forEach(function (k) { if (typeof D[k] !== 'function') walk(D[k], k); });
    eq(bad.length, 0, bad.join(' / '));
  });
  test('品質：複数形で扱う衣類を単数扱いしない', function () {
    var bad = [];
    ['trouser', 'glove', 'stocking', 'boot'].forEach(function (sing) {
      var re = new RegExp('\\b(a|an)\\s+(\\w+\\s+){0,3}' + sing + '\\b', 'i');
      function walk(node, path) {
        if (Array.isArray(node)) return node.forEach(function (v, i) { walk(v, path + '[' + i + ']'); });
        if (typeof node === 'string') { if (re.test(node)) bad.push(path + ':"' + node + '"'); return; }
        if (!node || typeof node !== 'object') return;
        Object.keys(node).forEach(function (k) { if (!/Ja$/.test(k)) walk(node[k], path + '.' + k); });
      }
      Object.keys(D).forEach(function (k) { if (typeof D[k] !== 'function') walk(D[k], k); });
    });
    eq(bad.length, 0, bad.join(' / '));
  });
  test('品質：不正データは黙って捨てず、テストで見つかる形になっている', function () {
    // わざと壊したデータを normalize しても落ちないこと（落とすのはテストの役目）
    var o = SC.normalize({ concept: {}, garment: { category: 'no_such', subtype: 'no_such' }, parts: { no_such_slot: 'x' }, specialParts: { wings: 'garbage' } });
    assert(o && o.parts && !o.parts.no_such_slot, '未知スロットが残った');
    eq(Object.keys(o.specialParts.wings).length, 0);
  });

  /* ---- 検証ケース A〜F ---- */
  test('ケースA：天使 — 翼が一句、光属性と天使が別概念、エフェクトOFFで光らない', function () {
    var o = outfit({
      garment: { category: 'dress', subtype: 'ball_gown' }, silhouette: { fit: 'draped' },
      materials: { primary: 'silk' }, palette: { primary: 'pearl_white', metal: 'pale_gold' },
      concept: { attribute: { id: 'light', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: false, effects: false } } },
      specialParts: {
        wings: { type: 'angel_wings', size: 'wing_large', spread: 'wing_spread_wide', texture: 'wing_feathered', count: 'wing_one_pair', color: 'wing_color_primary' },
        halo: { type: 'halo_ring', form: 'halo_simple', glow: 'halo_matte', color: 'halo_color_metal' }
      }
    });
    var sh = CPW.generator.short(o);
    assert(/a pair of large spread feathered pearl white angel wings/.test(sh), '翼が一句にならない：' + sh);
    assert(/a simple matte pale gold halo/.test(sh), '光輪が出ない：' + sh);
    assert(U.byId(D.attributes, 'light').motifs.indexOf('angel') < 0, '光と天使が同一視されている');
    assert(!/glow|radiant|divine/.test(sh), 'エフェクトOFFなのに光った：' + sh);
  });
  test('ケースB：悪魔 — 闇属性だけでは付かず、選んだときだけ出る', function () {
    var dark = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, concept: { attribute: { id: 'darkness' } } });
    assert(!/horns|demon|tail/.test(CPW.generator.short(dark)), '闇属性だけで悪魔パーツが付いた');
    var o = outfit({
      garment: { category: 'dress', subtype: 'ball_gown' }, silhouette: { fit: 'fitted' },
      materials: { primary: 'leather' }, palette: { primary: 'jet_black' },
      concept: { attribute: { id: 'darkness' } },
      specialParts: {
        horns: { type: 'horn_curved', size: 'horn_small', color: 'horn_color_individual', colorId: 'jet_black' },
        wings: { type: 'demon_wings', texture: 'wing_leathery' },
        tail: { type: 'tail_demon', length: 'tail_long' }
      }
    });
    var sh = CPW.generator.short(o);
    assert(/small jet black curved horns/.test(sh), '角：' + sh);
    assert(/leathery demon wings/.test(sh), '翼：' + sh);
    assert(/a long demon tail/.test(sh), '尾：' + sh);
  });
  test('ケースC：堕天使 — 翼と光輪が共存し、闇属性と重複表現しない', function () {
    var o = outfit({
      garment: { category: 'uniform', subtype: 'royal_uniform' },
      concept: { primaryStyle: 'gothic', secondaryStyles: ['royal'], attribute: { id: 'darkness' } },
      materials: { primary: 'velvet' }, palette: { primary: 'jet_black', metal: 'oxidized_silver' },
      specialParts: {
        wings: { type: 'fallen_angel_wings', texture: 'wing_feathered', color: 'wing_color_primary' },
        halo: { type: 'halo_broken', glow: 'halo_matte', color: 'halo_color_metal' }
      }
    });
    var sh = CPW.generator.short(o);
    assert(/feathered jet black fallen angel wings/.test(sh), '翼：' + sh);
    assert(/broken halo/.test(sh), '光輪：' + sh);
    assert(AD.check(o).filter(function (i) { return i.id === 'theme_duplicates_special_part'; }).length === 0, '重複と誤判定');
    eq((sh.match(/fallen/g) || []).length, 1, '堕天使が二度出た：' + sh);
  });
  test('ケースD：機械翼 — 歴史ものでは王道にせず、SFなら成立し、光らない', function () {
    var hist = outfit({ concept: { worldview: 'historical_western' }, specialParts: { wings: { type: 'mechanical_wings' } } });
    assert(AD.check(hist).some(function (i) { return i.id === 'mechanical_wings_vs_historical'; }), '歴史もので警告が出ない');
    var sf = outfit({
      garment: { category: 'uniform', subtype: 'business_suit' },
      concept: { worldview: 'sci_fi', primaryStyle: 'techwear' },
      palette: { primary: 'polished_silver', accent: 'sapphire_blue' },
      specialParts: { wings: { type: 'mechanical_wings', texture: 'wing_metallic', count: 'wing_one_pair' } }
    });
    assert(!AD.check(sf).some(function (i) { return i.id === 'mechanical_wings_vs_historical'; }), 'SFで警告が出た');
    var sh = CPW.generator.short(sf);
    assert(/a pair of metallic mechanical wings/.test(sh), '翼：' + sh);
    assert(!/glow|energy|spark/.test(sh), 'エフェクトOFFなのに光った：' + sh);
  });
  test('ケースE：背面競合 — warning と、翼を小さく／ケープを肩掛けにする案', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { cover_up: 'full_back_cape' }, specialParts: { wings: { type: 'angel_wings', size: 'wing_massive', texture: 'wing_feathered' } } });
    var i = AD.check(o).filter(function (x) { return x.id === 'massive_wings_vs_back_cape'; })[0];
    assert(i, '警告が出ない');
    eq(i.severity, 'warning');
    var acts = i.resolutions.map(function (r) { return r.action; });
    assert(acts.indexOf('replaceLeftWith:wing_small') >= 0, '翼を小さくする案が無い');
    assert(acts.indexOf('replaceRightWith:shoulder_cape') >= 0, 'ケープを肩掛けにする案が無い');
    assert(acts.indexOf('ignore') >= 0, '維持する道が無い');
  });
  test('ケースF：頭部競合 — 重なり警告と修正候補', function () {
    var o = outfit({
      garment: { category: 'dress', subtype: 'ball_gown' }, parts: { headwear: 'oversized_bonnet' },
      specialParts: { horns: { type: 'horn_ram', size: 'horn_large' }, halo: { type: 'halo_ring', position: 'halo_above' } }
    });
    var ids = AD.check(o).map(function (x) { return x.id; });
    assert(ids.indexOf('large_horns_vs_headpiece') >= 0, '角の警告が出ない');
    assert(ids.indexOf('halo_vs_headpiece') >= 0, '光輪の警告が出ない');
    AD.check(o).filter(function (x) { return x.id === 'large_horns_vs_headpiece' || x.id === 'halo_vs_headpiece'; })
      .forEach(function (x) {
        assert(x.resolutions.filter(function (r) { return r.patch; }).length > 0, x.id + ' に当たる案が無い');
      });
  });

  /* ============================================================
   * 実機試行修正①
   * ========================================================== */

  /* ---- generator：mood 表現 ---- */
  test('修正①：carrying a ... mood を生成しない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, palette: { primary: 'jet_black' }, output: { includeNarrative: true } });
    var de = CPW.generator.detailed(o);
    assert(de.indexOf('carrying') < 0, 'carrying が出た：' + de);
    assert(/evoking a dramatic atmosphere/.test(de), 'evoking 形式でない：' + de);
  });
  test('修正①：短縮版の雰囲気タグは {mood} atmosphere', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, palette: { primary: 'jet_black' }, output: { includeNarrative: true } });
    var sh = CPW.generator.short(o);
    assert(sh.indexOf('dramatic atmosphere') >= 0, sh);
    assert(!/a dramatic mood/.test(sh), 'mood 表現が残った：' + sh);
  });
  test('修正①：属性の雰囲気も evoking ... atmosphere', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' },
      concept: { attribute: { id: 'darkness', intensity: 'standard', applyTo: { colors: true, materials: true, decorations: true, silhouette: false, effects: false } } } });
    var de = CPW.generator.detailed(o);
    assert(!/ in mood/.test(de), 'in mood が残った：' + de);
    assert(de.indexOf('carrying') < 0, de);
  });
  test('修正①：拘束チェーンにも carrying を使わない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, output: { includeNarrative: true }, specialParts: { restraintChains: ['collar_chain'] } });
    var de = CPW.generator.detailed(o);
    assert(de.indexOf('carrying') < 0, de);
    assert(/with a chain from a collar/.test(de), de);
  });

  /* ---- generator：barefoot ---- */
  test('修正①：with barefoot を生成しない', function () {
    var o = outfit({ garment: { category: 'swimwear', subtype: 'swim_trunks' }, parts: { footwear: 'barefoot' } });
    var de = CPW.generator.detailed(o);
    assert(!/with barefoot/.test(de), de);
    assert(/worn barefoot/.test(de), 'worn barefoot が出ない：' + de);
  });
  test('修正①：barefoot and circlet を生成しない', function () {
    var o = outfit({ garment: { category: 'swimwear', subtype: 'bikini' }, parts: { footwear: 'barefoot', headwear: 'circlet' } });
    var de = CPW.generator.detailed(o);
    assert(!/barefoot and circlet/.test(de), de);
    assert(/circlet/.test(de) && /worn barefoot/.test(de), '両方が出ていない：' + de);
  });
  test('修正①：短縮版では barefoot が独立タグ', function () {
    var o = outfit({ garment: { category: 'swimwear', subtype: 'bikini' }, parts: { footwear: 'barefoot', headwear: 'circlet' } });
    var sh = CPW.generator.short(o);
    assert(/(^|, )barefoot(,|$)/.test(sh), sh);
    assert(!/with barefoot/.test(sh), sh);
  });
  test('修正①：靴を選べば従来どおり部位として出る', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, parts: { footwear: 'lace_up_boots' } });
    assert(!/worn /.test(CPW.generator.detailed(o)));
  });

  /* ---- generator：水着の核 ---- */
  test('修正①：with two-piece を生成しない（核へ統合）', function () {
    var o = outfit({ garment: { category: 'swimwear' }, parts: { swim_form: 'separate_form' } });
    var de = CPW.generator.detailed(o);
    assert(!/with two-piece/.test(de), de);
    assert(/two-piece swimsuit/.test(de), '核へ統合されない：' + de);
  });
  test('修正①：with one-piece を生成しない（核へ統合）', function () {
    var o = outfit({ garment: { category: 'swimwear' }, parts: { swim_form: 'one_piece_form' } });
    var de = CPW.generator.detailed(o);
    assert(!/with one-piece/.test(de), de);
    assert(/one-piece swimsuit/.test(de), de);
  });
  test('修正①：同じ文で two-piece を重複させない', function () {
    var o = outfit({ garment: { category: 'swimwear', subtype: 'bikini' }, parts: { swim_form: 'separate_form' } });
    var de = CPW.generator.detailed(o);
    eq((de.match(/two-piece/g) || []).length, 1, de);
  });
  test('修正①：board shorts の詳細版は a pair of', function () {
    var o = outfit({ garment: { category: 'swimwear', subtype: 'swim_trunks' } });
    var de = CPW.generator.detailed(o);
    assert(/^A pair of .*board shorts/.test(de), de);
  });
  test('修正①：A ... board shorts（単数冠詞）を生成しない', function () {
    var o = outfit({ garment: { category: 'swimwear', subtype: 'swim_trunks' }, concept: { primaryStyle: 'lolita', role: 'maid' } });
    var de = CPW.generator.detailed(o);
    assert(!/^A (?!pair of)/.test(de) || !/board shorts/.test(de), de);
    assert(/^A pair of/.test(de), de);
  });

  /* ---- generator：様式・テーマの -inspired 接続 ---- */
  test('修正①：主テーマは -inspired で核へ結ぶ', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, concept: { primaryThemeMotif: 'fallen_angel' } });
    assert(/fallen-angel-inspired/.test(CPW.generator.detailed(o)), CPW.generator.detailed(o));
  });
  test('修正①：既に -inspired のテーマへ二重に付けない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, concept: { primaryThemeMotif: 'clock_and_cards' } });
    var de = CPW.generator.detailed(o);
    assert(/wonderland-inspired/.test(de), de);
    assert(!/inspired-inspired/.test(de), de);
  });

  /* ---- generator：素材の付着先 ---- */
  test('修正①：副素材は combined with で直結させない', function () {
    var o = outfit({ garment: { category: 'swimwear', subtype: 'swim_trunks' }, materials: { primary: 'velvet', secondary: 'flowing_chiffon' } });
    var de = CPW.generator.detailed(o);
    assert(!/combined with/.test(de), de);
    assert(/with chiffon accents/.test(de), de);
  });
  test('修正①：流れる構造がなければ flowing を落とす', function () {
    var o = outfit({ garment: { category: 'swimwear', subtype: 'swim_trunks' }, silhouette: { fit: 'tailored' }, materials: { secondary: 'flowing_chiffon' } });
    assert(!/flowing/.test(CPW.generator.short(o)), CPW.generator.short(o));
  });
  test('修正①：流れる構造があれば flowing を残す', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, silhouette: { fit: 'draped' }, materials: { secondary: 'flowing_chiffon' } });
    assert(/flowing chiffon accents/.test(CPW.generator.detailed(o)), CPW.generator.detailed(o));
  });
  test('修正①：主素材の flowing も構造に従う', function () {
    var flat = outfit({ garment: { category: 'swimwear', subtype: 'swim_trunks' }, silhouette: { fit: 'tailored' }, materials: { primary: 'flowing_chiffon' } });
    assert(/made of chiffon/.test(CPW.generator.detailed(flat)), CPW.generator.detailed(flat));
    var flow = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, silhouette: { fit: 'draped' }, materials: { primary: 'flowing_chiffon' } });
    assert(/made of flowing chiffon/.test(CPW.generator.detailed(flow)), CPW.generator.detailed(flow));
  });

  /* ---- generator：句読点とユーザー追加タグ ---- */
  function noBrokenPunct(t) {
    assert(!/[.,]\s*[.,]/.test(t), '記号が重なった：' + t);
  }
  test('修正①：詳細版に「., 」「,,」を作らない', function () {
    var o = outfit({ garment: { category: 'swimwear', subtype: 'bikini' }, materials: { primary: 'lace', surface: 'subtle_sheen' }, parts: { footwear: 'barefoot' } });
    var de = CPW.generator.detailed(o);
    noBrokenPunct(de);
    assert(/\.$/.test(de) && !/\.\.$/.test(de), '文末のピリオドが1つでない：' + de);
  });
  test('修正①：短縮版の末尾に不要な記号を付けない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' } });
    assert(!/[.,]$/.test(CPW.generator.short(o)));
  });
  test('修正①：追加タグは短縮版の末尾へカンマで続く', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, output: { customTags: 'dull eyes, subtle allure' } });
    var sh = CPW.generator.short(o);
    assert(/, dull eyes, subtle allure$/.test(sh), sh);
    noBrokenPunct(sh);
  });
  test('修正①：追加タグは詳細版のピリオドの後に続く', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, output: { customTags: 'dull eyes, subtle allure' } });
    var de = CPW.generator.detailed(o);
    assert(/\. dull eyes, subtle allure$/.test(de), de);
    noBrokenPunct(de);
  });
  test('修正①：追加タグそのものは改変しない', function () {
    var tags = 'dullure, languid gaze, dull eyes, subtle allure';
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, output: { customTags: tags } });
    assert(CPW.generator.detailed(o).indexOf(tags) >= 0);
    assert(CPW.generator.short(o).indexOf(tags) >= 0);
  });
  test('修正①：追加タグ末尾の余分なカンマは境界で整える', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, output: { customTags: 'soft light, ' } });
    var sh = CPW.generator.short(o);
    assert(/soft light$/.test(sh), sh);
    noBrokenPunct(sh);
  });
  test('修正①：追加タグが空なら何も足さない', function () {
    var a = outfit({ garment: { category: 'dress', subtype: 'ball_gown' } });
    var b = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, output: { customTags: '   ' } });
    eq(CPW.generator.short(a), CPW.generator.short(b));
  });
  test('修正①：customTags が文字列でなければ空に均す', function () {
    var o = SC.normalize({ concept: {}, garment: {}, output: { customTags: 123 } });
    eq(o.output.customTags, '');
  });

  /* ---- 文体：データ側の日本語文言 ---- */
  test('修正①：データの説明文に「〜だよ」「〜してね」が残っていない', function () {
    var casual = /[ぁ-ん](よ|ね)(?=[。」』？！、）]|$)/;
    var bad = [];
    function walk(node, path) {
      if (Array.isArray(node)) return node.forEach(function (v, i) { walk(v, path + '[' + i + ']'); });
      if (!node || typeof node !== 'object') return;
      Object.keys(node).forEach(function (k) {
        var v = node[k];
        if (typeof v === 'string' && /Ja$/.test(k) && casual.test(v)) bad.push(path + '.' + k + ':' + v.slice(0, 30));
        else walk(v, path + '.' + k);
      });
    }
    Object.keys(D).forEach(function (k) { if (typeof D[k] !== 'function') walk(D[k], k); });
    eq(bad.length, 0, bad.join(' / '));
  });
  test('修正①：出力の空状態案内が です・ます 調', function () {
    var t = CPW.generator.EMPTY_JA;
    assert(!/[ぁ-ん]よ[。）]/.test(t), t);
    assert(/ます|ません/.test(t), t);
  });

  /* ---- 受入ケース ---- */
  test('修正①ケース1：堕天使の水着（受入基準）', function () {
    var o = outfit({
      garment: { category: 'swimwear', subtype: 'bikini' }, silhouette: { fit: 'tailored' },
      concept: { primaryStyle: 'lolita', primaryThemeMotif: 'fallen_angel', role: 'maid' },
      parts: { swim_form: 'separate_form', neckline: 'plunging_neckline', straps: 'thin_straps', back: 'lace_up_back', waist: 'leather_belt', leg_opening: 'standard_leg', coverage: 'moderate_coverage', cover_up: 'sheer_cover_up', footwear: 'barefoot', headwear: 'circlet' },
      materials: { primary: 'lace', transparency: 'semi_sheer', surface: 'subtle_sheen' },
      palette: { primary: 'jet_black', accent: 'royal_purple', scheme: 'monochrome' }
    });
    var sh = CPW.generator.short(o), de = CPW.generator.detailed(o);
    [sh, de].forEach(function (t) {
      assert(!/with two-piece/.test(t), t);
      assert(!/with barefoot/.test(t), t);
      assert(!/barefoot and circlet/.test(t), t);
      assert(!/carrying/.test(t), t);
      noBrokenPunct(t);
    });
    eq((de.match(/two-piece/g) || []).length, 1, de);
    assert(/fallen-angel-inspired/.test(de), de);
  });
  test('修正①ケース2：board shorts（受入基準）', function () {
    var o = outfit({
      garment: { category: 'swimwear', subtype: 'swim_trunks' }, silhouette: { fit: 'tailored' },
      concept: { primaryStyle: 'lolita', primaryThemeMotif: 'sweets_and_witch', role: 'maid' },
      parts: { footwear: 'barefoot' },
      materials: { primary: 'velvet', secondary: 'flowing_chiffon', surface: 'subtle_sheen' },
      palette: { primary: 'deep_crimson' }
    });
    var de = CPW.generator.detailed(o);
    assert(/^A pair of/.test(de), de);
    assert(!/combined with/.test(de) && /with chiffon accents/.test(de), de);
    assert(!/flowing/.test(de), de);
    assert(!/with barefoot/.test(de) && /worn barefoot/.test(de), de);
    assert(!/carrying/.test(de), de);
  });
  test('修正①ケース3：追加タグ（受入基準）', function () {
    var o = outfit({
      garment: { category: 'swimwear', subtype: 'swim_trunks' },
      materials: { primary: 'velvet', surface: 'subtle_sheen' },
      output: { customTags: 'dullure, languid gaze, dull eyes, subtle allure' }
    });
    var de = CPW.generator.detailed(o);
    assert(!/\.\s*,/.test(de), de);
    assert(!/,,/.test(de), de);
    assert(/\. dullure, languid gaze, dull eyes, subtle allure$/.test(de), de);
  });

  /* ---- 実機確認後の文言微修正 ---- */
  test('文言：ガチャ対象・維持条件の日本語ラベルに「振る」系の言い回しが残っていない', function () {
    var casual = /振る|振れ|どこを|維持するもの/;
    GA.TARGETS.concat(GA.KEEPS).forEach(function (x) {
      assert(!casual.test(x.labelJa), x.id + ' に旧い言い回し：' + x.labelJa);
    });
  });
  test('文言：ガチャの差分ラベルに「振る」系の言い回しが残っていない', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, palette: { primary: 'jet_black' }, concept: { worldview: 'western_fantasy' } });
    var cands = GA.roll(o, { targetId: 'palette', keeps: [], seed: 1 });
    cands.forEach(function (c) {
      (c.diff || []).forEach(function (d) {
        assert(!/振る|振れ|維持するもの/.test(d.labelJa + d.fromJa + d.toJa), '差分に旧い言い回し：' + d.labelJa);
      });
    });
  });
  test('データ出力：中身は従来のJSON形式のまま', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' } });
    o.name = '狼と深紅の装束';
    var raw = CPW.store.exportOutfit(o);
    var parsed = JSON.parse(raw);
    eq(parsed.type, 'cpw-outfit');
    eq(parsed.version, CPW.SCHEMA_VERSION);
    assert(parsed.outfit && parsed.outfit.garment.subtype === 'ball_gown', '衣装が入っていない');
  });
  test('データ出力：書き出したものをそのまま読み戻せる', function () {
    var o = outfit({ garment: { category: 'dress', subtype: 'ball_gown' }, palette: { primary: 'jet_black' } });
    var r = CPW.store.importJSON(CPW.store.exportOutfit(o));
    assert(r.ok, '読み戻せない：' + r.reasonJa);
  });


  /* ============================================================
   * Phase 5B 前半
   * ========================================================== */

  /* ---- データ健全性 ---- */
  test('5B：全データセットでIDが重複しない', function () {
    [['colors', D.colors], ['materials', D.materials], ['patterns', D.patterns],
     ['decorations', D.decorations], ['motifs', D.motifs], ['garments', D.garments],
     ['presets', D.presets]].forEach(function (pair) {
      var seen = {};
      pair[1].forEach(function (item) {
        assert(!seen[item.id], pair[0] + ' でIDが重複：' + item.id);
        seen[item.id] = true;
      });
    });
  });
  test('5B：全データセットのIDはsnake_case', function () {
    [D.colors, D.materials, D.patterns, D.decorations, D.motifs, D.garments, D.presets].forEach(function (list) {
      list.forEach(function (item) {
        assert(/^[a-z0-9_]+$/.test(item.id), 'snake_caseでないID：' + item.id);
      });
    });
  });
  test('5B：全データセットでlabelJaが空でない', function () {
    [D.colors, D.materials, D.patterns, D.decorations, D.motifs, D.garments, D.presets].forEach(function (list) {
      list.forEach(function (item) { assert(item.labelJa && item.labelJa.length > 0, item.id + ' のlabelJaが空'); });
    });
  });
  test('5B：色は120件以上・hexが妥当・recommendedWithの参照先が実在', function () {
    assert(D.colors.length >= 120, '色が ' + D.colors.length);
    var ids = {};
    D.colors.forEach(function (c) { ids[c.id] = true; });
    D.colors.forEach(function (c) {
      assert(/^#[0-9a-fA-F]{6}$/.test(c.hex), c.id + ' のhexが不正：' + c.hex);
      (c.recommendedWith || []).forEach(function (id) { assert(ids[id], c.id + ' が未定義色を推奨：' + id); });
    });
  });
  test('5B：素材は40件以上・全件がmatClassesを持つ', function () {
    assert(D.materials.length >= 40, '素材が ' + D.materials.length);
    D.materials.forEach(function (m) {
      assert(Array.isArray(m.matClasses) && m.matClasses.length > 0, m.id + ' にmatClassesが無い');
    });
  });
  test('5B：柄25以上・装飾40以上・モチーフ30以上', function () {
    assert(D.patterns.length >= 25, '柄が ' + D.patterns.length);
    assert(D.decorations.length >= 40, '装飾が ' + D.decorations.length);
    assert(D.motifs.length >= 30, 'モチーフが ' + D.motifs.length);
  });
  test('5B：基本衣装は60件以上（人魚系を除いても60以上）', function () {
    var basic = D.garments.filter(function (g) { return g.category !== 'merfolk'; });
    assert(basic.length >= 60, '基本衣装が ' + basic.length);
  });
  test('5B：プリセットは20件以上', function () {
    assert(D.presets.length >= 20, 'プリセットが ' + D.presets.length);
  });

  /* ---- 禁止語（ブランド名・実在警察機関・性別語） ---- */
  function allPromptTexts() {
    var texts = [];
    var push = function (s) { if (s) texts.push(String(s)); };
    [D.colors, D.materials, D.patterns, D.decorations, D.motifs, D.garments].forEach(function (list) {
      list.forEach(function (item) {
        push(item.promptEn); push(item.shortPrompt); push(item.detailedPrompt);
      });
    });
    D.specialParts.slots.forEach(function (slot) {
      slot.axes.forEach(function (a) { a.options.forEach(function (o) { push(o.shortPrompt); }); });
    });
    return texts;
  }
  test('5B：ブランド名が英語プロンプトに混入しない', function () {
    var re = /\b(nike|adidas|gucci|chanel|prada|dior|uniqlo|burberry|hermes|louis vuitton|versace|armani|rolex)\b/i;
    allPromptTexts().forEach(function (t) { assert(!re.test(t), 'ブランド名混入：' + t); });
  });
  test('5B：実在警察機関名が混入しない', function () {
    var re = /\b(nypd|lapd|fbi|cia|interpol|scotland yard|metropolitan police|keishicho|carabinieri)\b/i;
    allPromptTexts().forEach(function (t) { assert(!re.test(t), '実在機関名混入：' + t); });
  });
  test('5B：性別語が英語プロンプトに混入しない', function () {
    var re = /\b(male|female|man|woman|men|women|boy|boys|girl|girls|feminine|masculine|ladies|gentlemen)\b/i;
    allPromptTexts().forEach(function (t) { assert(!re.test(t), '性別語混入：' + t); });
  });

  /* ---- 衣装の核の区別 ---- */
  test('5B：学ラン・セーラー・ブレザーの核が互いに混ざらない', function () {
    var gaku = U.byId(D.garments, 'gakuran_uniform');
    var sailor = U.byId(D.garments, 'sailor_school_uniform');
    var blazer = U.byId(D.garments, 'school_blazer_uniform');
    assert(/gakuran/.test(gaku.shortPrompt), '学ランの核に gakuran が無い');
    assert(/sailor/.test(sailor.shortPrompt), 'セーラーの核に sailor が無い');
    assert(/blazer/.test(blazer.shortPrompt), 'ブレザーの核に blazer が無い');
    assert(!/sailor|blazer/.test(gaku.shortPrompt), '学ランの核に他の語が混ざる');
    assert(!/gakuran|blazer/.test(sailor.shortPrompt), 'セーラーの核に他の語が混ざる');
  });
  test('5B：白衣の核は laboratory coat', function () {
    var g = U.byId(D.garments, 'laboratory_coat_outfit');
    assert(/laboratory coat/.test(g.shortPrompt) || /laboratory coat/.test(g.detailedPrompt), '白衣の核が laboratory coat でない');
  });
  test('5B：旗袍は漢服と別の核を持つ', function () {
    var q = U.byId(D.garments, 'qipao');
    assert(/qipao/.test(q.shortPrompt), '旗袍の核に qipao が無い');
    assert(!/hanfu/.test(q.shortPrompt + ' ' + q.detailedPrompt), '旗袍に hanfu が混ざる');
  });
  test('5B：バニー2種は互いに区別される', function () {
    var c = U.byId(D.garments, 'classic_bunny_suit');
    var r = U.byId(D.garments, 'reverse_bunny_suit');
    assert(/bunny/.test(c.shortPrompt) && /bunny/.test(r.shortPrompt), 'バニーの核が無い');
    assert(/reverse/.test(r.shortPrompt), '逆バニーの核に reverse が無い');
    assert(!/reverse/.test(c.shortPrompt), 'クラシックの核に reverse が混ざる');
  });
  test('5B：必須衣装がすべて実在する', function () {
    ['gakuran_uniform', 'sailor_school_uniform', 'school_blazer_uniform',
     'classic_maid_dress', 'victorian_maid_dress', 'cafe_maid_outfit', 'gothic_maid_dress',
     'classic_bunny_suit', 'reverse_bunny_suit', 'laboratory_coat_outfit',
     'fictional_police_uniform', 'mafia_style_suit', 'qipao', 'changshan',
     'modern_chinese_outfit', 'tang_style_outfit', 'nun_habit',
     'side_cutout_knitwear', 'open_back_cutout_knitwear', 'mermaid_tail'].forEach(function (id) {
      assert(U.byId(D.garments, id), id + ' が無い');
    });
  });

  /* ---- 人魚（チェックポイント4） ---- */
  function merOutfit() {
    return SC.applyPatch(SC.createOutfit(), {
      garment: { category: 'merfolk', subtype: 'mermaid_tail', wearRole: 'main_outfit' },
      parts: { mermaid_tail_form: 'classic_scaled_tail' },
      silhouette: { fit: 'fitted' },
      materials: { primary: 'iridescent_fabric' },
      palette: { primary: 'turquoise' }
    });
  }
  test('5B人魚：脚の衣類・靴・素足が出力に混ざらない', function () {
    var o = merOutfit();
    o.parts.footwear = 'knee_high_boots';                       // 値が残っていても
    o.parts.legwear = [{ id: 'thigh_high_stockings', layer: 'main' }];
    var s = G.short(o) + ' ' + G.detailed(o);
    assert(!/\b(boots?|stockings?|tights|socks|sneakers|pumps|heels|barefoot)\b/i.test(s), '脚系が出力に混ざる：' + s);
  });
  test('5B人魚：一本の尾と「人間の脚は無い」が明示される', function () {
    var o = merOutfit();
    var s = G.short(o);
    var d = G.detailed(o);
    assert(s.indexOf('single fish tail') >= 0, '短縮版に single fish tail が無い：' + s);
    assert(s.indexOf('no human legs') >= 0, '短縮版に no human legs が無い：' + s);
    assert(/no human legs|replacing separate human legs/.test(d), '詳細版に脚の否定が無い：' + d);
  });
  test('5B人魚：feet の肯定的な言及が無い', function () {
    var o = merOutfit();
    var s = (G.short(o) + ' ' + G.detailed(o))
      .replace(/no feet/g, '').replace(/no human legs/g, '')
      .replace(/replacing separate human legs and feet/g, '');
    assert(!/\b(feet|foot|legs?)\b/i.test(s), 'feet/legs の残留：' + s);
  });
  test('5B人魚：通常の尾（獣の尾）に人魚の尾が混ざらない', function () {
    var t = SC.axisOf(SPT(), 'type');
    t.options.forEach(function (o) {
      assert(!/mermaid|fish tail/i.test(o.shortPrompt), '通常尾に人魚が混入：' + o.id);
    });
  });
  test('5B人魚：merfolkカテゴリは脚系スロットを持たない', function () {
    var cat = U.byId(D.garmentCategories, 'merfolk');
    assert(cat, 'merfolk カテゴリが無い');
    ['bottoms', 'skirt_shape', 'legwear', 'footwear', 'leg_opening', 'hem'].forEach(function (id) {
      assert(cat.slots.indexOf(id) < 0, 'merfolk に ' + id + ' がある');
    });
    assert(cat.slots.indexOf('mermaid_tail_form') === 0, 'mermaid_tail_form が先頭に無い');
    eq(cat.requiredSlots.length, 1);
  });
  test('5B人魚：完成度の母数に尾の形が入り、脚系は入らない', function () {
    var o = merOutfit();
    var p = CPW.progress.compute(o);
    eq(p.percent, 100, '必須が全て埋まっているのに100%でない');
    var o2 = merOutfit();
    o2.parts.mermaid_tail_form = null;
    var p2 = CPW.progress.compute(o2);
    assert(p2.percent < 100, '尾の形が空でも100%になる');
    assert(p2.missing.indexOf('尾の形') >= 0, '不足に尾の形が出ない');
  });
  test('5B人魚：ガチャは脚まわりを回さない', function () {
    var o = merOutfit();
    eq(GA.roll(o, { target: 'legwear', seed: 1 }).length, 0, '人魚で legwear ガチャが回る');
  });
  test('5B人魚：JSON往復で構造が保たれる', function () {
    var o = merOutfit();
    var raw = JSON.parse(JSON.stringify(o));
    var m = SC.migrate(raw);
    assert(m.ok, '往復で読めない');
    eq(m.outfit.garment.category, 'merfolk');
    eq(m.outfit.parts.mermaid_tail_form, 'classic_scaled_tail');
  });
  test('5B人魚：旧スキーマ0.1のデータがそのまま読める', function () {
    var legacy = SC.createOutfit();
    legacy.version = '0.1';
    var m = SC.migrate(JSON.parse(JSON.stringify(legacy)));
    assert(m.ok, '0.1 が読めない');
    assert(m.migrated, '0.1 が移行扱いにならない');
    eq(m.outfit.version, CPW.SCHEMA_VERSION);
  });
  test('5B人魚：カテゴリを行き来しても脚の値は保持される', function () {
    var o = SC.applyPatch(SC.createOutfit(), {
      garment: { category: 'top_bottom', subtype: 'simple_tshirt_and_jeans' },
      parts: { footwear: 'sneakers' }
    });
    var mer = SC.applyPatch(o, { garment: { category: 'merfolk', subtype: 'mermaid_tail' } });
    eq(SC.normalize(mer).parts.footwear, 'sneakers', '人魚化で footwear が消えた');
    var back = SC.applyPatch(mer, { garment: { category: 'top_bottom', subtype: 'simple_tshirt_and_jeans' } });
    eq(SC.normalize(back).parts.footwear, 'sneakers', '戻したら footwear が消えた');
  });
  test('5B人魚：警告器は表示外スロットの値に反応しない', function () {
    var o = merOutfit();
    o.parts.footwear = 'barefoot';
    o.parts.legwear = [{ id: 'thigh_high_stockings', layer: 'main' }];
    var issues = AD.check(o);
    issues.forEach(function (i) {
      assert(!/legwear|footwear|barefoot|stocking/i.test(JSON.stringify(i)), '脚系の警告が出る：' + JSON.stringify(i));
    });
  });

  /* ---- ランダム走査（全衣装の生成健全性） ---- */
  test('5B走査：全衣装で短縮・詳細出力が壊れない', function () {
    var badPatterns = [
      /undefined/, /\bnull\b/, /,\s*,/, /\.\s*\./, /\.,/,
      /-inspired[^,]*-inspired/, /\bwith barefoot\b/, /\bwith two-piece\b/,
      /\ba board shorts\b/, /\ba pair of a\b/,
      /\b(male|female|man|woman|men|women|boy|girl)\b/i,
      /\b(nike|adidas|gucci|chanel|nypd|fbi)\b/i
    ];
    D.garments.forEach(function (g) {
      var o = SC.applyPatch(SC.createOutfit(), {
        garment: { category: g.category, subtype: g.id, wearRole: 'main_outfit' },
        silhouette: { fit: 'fitted' },
        materials: { primary: 'cotton' },
        palette: { primary: 'deep_navy' }
      });
      if (g.category === 'merfolk') o.parts.mermaid_tail_form = 'classic_scaled_tail';
      var s = G.short(o);
      var d = G.detailed(o);
      badPatterns.forEach(function (re) {
        assert(!re.test(s), g.id + ' の短縮版が不正（' + re + '）：' + s);
        assert(!re.test(d), g.id + ' の詳細版が不正（' + re + '）：' + d);
      });
      if (g.category === 'merfolk') {
        assert(!/\b(boots?|stockings?|tights|socks|sneakers|pumps)\b/i.test(s + ' ' + d), g.id + ' に脚系が混ざる');
      }
    });
  });
  test('5B走査：シードを変えたガチャ全対象で出力が壊れない', function () {
    var o = SC.applyPatch(SC.createOutfit(), U.byId(D.presets, 'daily_casual').patch);
    [11, 22, 33].forEach(function (seed) {
      GA.TARGETS.forEach(function (t) {
        GA.roll(o, { target: t.id, seed: seed }).forEach(function (r) {
          var s = G.short(r.outfit || SC.applyPatch(o, r.patch));
          assert(!/undefined|,\s*,/.test(s), t.id + ' のガチャ結果が不正：' + s);
        });
      });
    });
  });

  /* ---- 実行 ---- */
  CPW.tests = tests;
  CPW.runTests = function () {
    var results = tests.map(function (t) {
      try { t.fn(); return { name: t.name, ok: true }; }
      catch (e) { return { name: t.name, ok: false, error: e.message }; }
    });
    return {
      total: results.length,
      passed: results.filter(function (r) { return r.ok; }).length,
      failed: results.filter(function (r) { return !r.ok; }).length,
      results: results
    };
  };
})(typeof window !== 'undefined' ? window : global);
