(function (C) {
  'use strict';
  var md = C.generator.markdown;
  function test(name, fn) { C.tests.push({ name: 'Markdown: ' + name, fn: fn }); }
  function check(ok, message) { if (!ok) throw Error(message); }

  test('Empty and custom-tags-only output', function () {
    check(md({}) === '', 'Empty outfit');
    check(md({ output: { customTags: '  A, (B:1.2)  C, ' } }) ===
      '# Outfit\n\n## Additional Tags\n- A, (B:1.2)  C', 'Tag content');
  });

  test('Colors, trim, decoration locations and condition targets', function () {
    var text = md({
      palette: { primary: 'jet_black' },
      specialParts: { wings: { type: 'angel_wings', color: 'wing_color_primary' } },
      materials: { trim: 'metallic_thread' },
      decorations: { items: [{ type: 'gold_embroidery', placements: ['collar', 'cuffs'] }] },
      condition: { items: [{ type: 'mud_splattered', placements: ['hem'] }] }
    });
    ['- Primary: jet black', 'jet black angel wings', '- Trim: metallic thread',
      '- gold embroidery along the collar and cuffs', 'along the hem'].forEach(function (value) {
      check(text.includes(value), value);
    });
    check(!text.includes('Base Garment'), 'Invented garment');
  });

  test('Inactive parts and placement return with the category', function () {
    var outfit = { garment: { category: 'top_bottom' }, parts: { footwear: 'sneakers' },
      specialParts: { wings: { color: 'wing_color_primary' } },
      decorations: { items: [{ type: 'gold_embroidery', placements: ['legs'] }] } };
    var before = md(outfit);
    outfit.garment.category = 'merfolk';
    var mer = md(outfit);
    check(before.includes('sneakers') && before.includes('along the legs'), before);
    check(mer.includes('single fish tail') && !/sneakers|along the legs|Special Parts/.test(mer), mer);
    outfit.garment.category = 'top_bottom';
    check(md(outfit) === before, 'Restore');
  });

  test('Presentation scopes, narrative, effects and quality', function () {
    var o = C.schema.normalize({ concept: { attribute: { id: 'light' } }, palette: { primary: 'jet_black' },
      presentation: { preset: 'chair_sit', background: 'light', rendering: { enabled: true, paint: 'cel' } } });
    C.presentation.setScope(o, 'all');
    o.output.includeNarrative = o.output.includeEffects = o.output.includeQualityTags = true;
    var text = md(o);
    ['Atmosphere / Story', 'Effects', 'Pose / Presentation', 'Background', 'Rendering'].forEach(function (title) {
      check(text.includes('## ' + title), text);
    });
    check(text.includes(C.data.qualityTags[0]), 'Quality');
    C.presentation.setScope(o, 'pose');
    o.output.includeNarrative = o.output.includeEffects = o.output.includeQualityTags = false;
    text = md(o);
    check(text.includes('## Pose') && !/## (Background|Rendering|Effects|Atmosphere)/.test(text), text);
    C.presentation.setScope(o, 'outfit');
    check(!md(o).includes('## Pose'), 'Outfit scope');
  });

  test('Every preset produces stable nonempty sections without mutating saved data', function () {
    C.data.presets.forEach(function (preset) {
      var outfit = C.presetCatalog.create(preset.id);
      var saved = JSON.stringify(outfit);
      var text = md(outfit);
      check(text.startsWith('# Outfit\n\n## '), preset.id);
      text.split('\n\n').slice(1).forEach(function (section) {
        var rows = section.split('\n');
        check(rows[0].startsWith('## ') && rows.length > 1, preset.id);
        rows.slice(1).forEach(function (row, i) {
          check(row.startsWith('- ') && row.length > 2 && rows.indexOf(row) === i + 1, preset.id + ': ' + row);
        });
      });
      check(JSON.stringify(outfit) === saved && md(JSON.parse(saved)) === text, preset.id);
    });
  });
})(window.CPW);
