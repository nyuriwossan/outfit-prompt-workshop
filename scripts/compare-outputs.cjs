// Compare the current UI release with an unmodified checkout of the previous release.
const assert = require('node:assert/strict');
const path = require('node:path');
const current = require('./test.cjs').load();
if (!process.argv[2]) throw new Error('Usage: node scripts/compare-outputs.cjs <previous-checkout>');
const previous = require(path.resolve(process.argv[2], 'scripts/test.cjs')).load();
let comparisons = 0;

for (const preset of previous.data.presets) {
  const outfit = previous.presetCatalog.create(preset.id);
  for (const scope of ['outfit', 'pose', 'all']) {
    previous.presentation.setScope(outfit, scope);
    for (const format of ['short', 'detailed', 'markdown']) {
      assert.equal(current.generator[format](outfit), previous.generator[format](outfit),
        [preset.id, scope, format].join(' / '));
      comparisons++;
    }
    // Both modules run in separate VM contexts. Compare values across their realms.
    assert.equal(JSON.stringify(current.structureLines(outfit)), JSON.stringify(previous.structureLines(outfit)),
      [preset.id, scope, 'structure'].join(' / '));
    comparisons++;
  }
}
console.log(comparisons + ' matching outputs for ' + previous.data.presets.length + ' presets');
