// Run with the unmodified pre-review checkout, e.g. node scripts/compare-preset-defaults.cjs ../previous
const assert = require('node:assert/strict');
const path = require('node:path');
const {load} = require('./test.cjs');
if (!process.argv[2]) throw Error('Pass the path to the pre-review checkout.');
const previous = require(path.resolve(process.argv[2], 'scripts/test.cjs')).load();
const current = load();
const json = value => JSON.parse(JSON.stringify(value));
const ids = data => Array.from(data.presets, preset => preset.id);
assert.deepEqual(ids(current.data), ids(previous.data), 'catalog IDs and order');
const formats = ['short','detailed','markdown','structure'];
function output(app, format, outfit) {
  return format === 'structure' ? JSON.stringify(app.structureLines(outfit)) : app.generator[format](outfit);
}
const changes = Object.fromEntries(formats.map(f => [f,0]));
let reviewed = 0;
for (const before of previous.data.presets) {
  const id = before.id;
  const after = current.util.byId(current.data.presets, id);
  const patch = json(before.patch);
  const removed = current.previousPresetContext[id];
  if (removed) reviewed++;
  for (const [key, value] of Object.entries(removed || {})) {
    assert(['worldview','era','occasion','role'].includes(key), key);
    assert.equal(patch.concept[key], value, id + '.' + key);
    delete patch.concept[key];
  }
  assert.deepEqual(json(after.patch), patch, id + ' reviewed patch');
  const original = previous.presetCatalog.create(id);
  const expected = json(original);
  for (const key of Object.keys(removed || {})) expected.concept[key] = null;
  const adopted = current.presetCatalog.create(id);
  for (const format of formats) {
    const actual = output(current, format, adopted);
    // Only the reviewed removals are applied to the original engine's input.
    assert.equal(actual, output(previous, format, expected), id + ' / ' + format);
    if (actual !== output(previous, format, original)) changes[format]++;
  }
}
assert.equal(reviewed, Object.keys(current.previousPresetContext).length, 'unknown preset in review');
console.log(previous.data.presets.length + ' catalog entries, ' + reviewed + ' reviewed patches changed');
console.log(formats.join(' / ') + ' intentional changes: ' + Object.values(changes).join(' / '));
console.log(previous.data.presets.length * formats.length + ' / ' + previous.data.presets.length * formats.length +
  ' outputs match the previous engine with the reviewed inputs');
