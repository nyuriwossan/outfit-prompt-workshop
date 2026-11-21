/* Reviewed defaults apply only when creating a new outfit from a catalog entry. */
(function(C) {
  'use strict';
  function test(name, fn) { C.tests.push({name:'見本の採用 / ' + name, fn:fn}); }
  function assert(value, message) { if (!value) throw Error(message); }
  Object.keys(C.previousPresetContext).forEach(function(id) {
    test(id + ' の新規初期値と旧JSONの往復', function() {
      var preset = C.util.byId(C.data.presets, id);
      var outfit = C.presetCatalog.create(id);
      var removed = C.previousPresetContext[id];
      Object.keys(removed).forEach(function(key) {
        assert(!(key in preset.patch.concept) && outfit.concept[key] === null, id + '.' + key);
      });
      var original = C.withPreviousPresetContext(id, outfit);
      var imported = C.schema.migrate(JSON.parse(JSON.stringify(original)));
      assert(imported.ok && imported.outfit.version === '0.6', id);
      assert(C.conceptFashion.sameDesign(original, imported.outfit), id + ' import');
      Object.keys(removed).forEach(function(key) {
        assert(imported.outfit.concept[key] === removed[key], id + '.' + key + ' import');
      });
    });
  });
  test('用途・文化・季節を伝える初期値を保持', function() {
    var checks = {
      daily_casual:{occasion:'daily', primaryStyle:'street', worldview:null, era:null, role:null},
      royalty:{worldview:'western_fantasy', role:'royal_prince', occasion:'ceremonial'},
      knight:{worldview:'western_fantasy', role:'knight', occasion:'battle'},
      classic_maid:{era:'victorian_era', worldview:'historical_western'},
      qipao_style:{worldview:'chinese'}, santa_classic:{primaryThemeMotif:'christmas_holiday', season:'winter'}
    };
    Object.keys(checks).forEach(function(id) {
      var concept = C.presetCatalog.create(id).concept;
      Object.keys(checks[id]).forEach(function(key) { assert(concept[key] === checks[id][key], id + '.' + key); });
    });
  });
  test('実際の編集と保存用メタデータを区別', function() {
    var same = C.conceptFashion.sameDesign;
    var outfit = C.presetCatalog.create('daily_casual');
    var other = C.presetCatalog.create('daily_casual');
    other.updatedAt = '2025-01-01T00:00:00Z';
    assert(same(outfit, other), 'metadata');
    other.parts = Object.fromEntries(Object.entries(other.parts).reverse());
    assert(same(outfit, other), 'object key order');
    other.output.customTags = 'personal tag';
    assert(!same(outfit, other), 'custom tags');
    assert(C.conceptFashion.hasDesign({name:'下書きの名前'}), 'name alone');
  });
})(window.CPW);
