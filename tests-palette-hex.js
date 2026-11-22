(function (C) {
  'use strict';
  function test(name, fn) { C.tests.push({name: 'Palette HEX: ' + name, fn: fn}); }
  function check(ok, message) { if (!ok) throw Error(message); }

  test('0.6 migration, normalization and explicit-only JSON export', function () {
    var o = C.presetCatalog.create('daily_casual');
    check(!o.palette.hexColors, 'Preset swatches must stay implicit');
    o.palette.hexColors = {primary: '＃ａｂｃ', gem: '123xyz', accent: '#12345678', other: '#abcdef'};
    var json = JSON.parse(C.store.exportOutfit(o));
    var imported = C.schema.migrate(json.outfit).outfit;
    check(JSON.stringify(imported.palette.hexColors) === '{"primary":"#AABBCC"}', 'Sanitize stored roles');
    check(imported.palette.primary === o.palette.primary, 'Preserve selected color ID');
    imported.palette.primary = 'deep_crimson';
    check(C.generator.short(imported, true).includes('deep crimson (#AABBCC)'), 'Keep explicit HEX on rename');
  });

  C.data.colorRoles.forEach(function (role) {
    test(role.id + ' named and HEX-only in every format', function () {
      var o = C.schema.normalize({garment: {category: 'dress'}, palette: {hexColors: {}}});
      o.palette.hexColors = {};
      o.palette.hexColors[role.id] = '#912E48';
      [null, 'deep_crimson'].forEach(function (id) {
        o.palette[role.id] = id;
        ['short', 'detailed', 'markdown'].forEach(function (format) {
          var text = C.generator[format](o, true);
          check((text.match(/#912E48/g) || []).length === 1, format + ': ' + text);
          check(id ? /deep crimson \(#912E48\)/i.test(text) : /color \(#912E48\)/i.test(text), text);
          check(!C.generator[format](o).includes('#912E48'), 'Name-only ' + format);
        });
        check(C.structureLines(o, true).some(function (row) {
          return row.label === role.labelJa && row.value.includes('#912E48');
        }), 'Japanese structure');
      });
    });
  });

  test('Identical specifications collapse and distinct shades survive', function () {
    var o = {garment: {category: 'dress'}, palette: {primary: 'deep_crimson', accent: 'deep_crimson',
      metal: 'deep_crimson', hexColors: {primary: '#AA3366', accent: '#AA3366', metal: '#773344'}}};
    ['short', 'detailed'].forEach(function (format) {
      var text = C.generator[format](o, true);
      check((text.match(/#AA3366/g) || []).length === 1 && text.includes('#773344'), text);
    });
  });
})(window.CPW);
