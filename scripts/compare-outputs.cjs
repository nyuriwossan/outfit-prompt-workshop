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

// Exercise old helper fields, every legacy set, and every separated pose. A null
// scope is intentionally distinct from an explicit scope for plain backgrounds.
const P = previous.data.presentation;
let presentationCases = 0;
const settings = [
  {focus:'detail',poseAssist:'walking',compositionAssist:'plain_bg'},
  ...P.presets.map(x=>({preset:x.id,seat:'throne'})),
  ...P.poseChoices.map(x=>({layoutVersion:1,poseId:x.id,distanceId:'upper',angleId:'back',seat:'bed'}))
];
for (const presentation of settings) {
  for (const category of ['dress','merfolk']) {
    for (const scope of [null,'outfit','pose','all']) {
      const raw = {version:'0.6', garment:{category}, concept:{attribute:{id:'fire'}},
        presentation:{...presentation,poseMood:'cool',background:'light',rendering:{enabled:true,paint:'watercolor'}},
        output:{scope,includeBackground:true,includePresentation:false,includeRendering:true,includeEffects:true,includeNarrative:true}};
      for (const format of ['short','detailed','markdown']) {
        assert.equal(current.generator[format](raw),previous.generator[format](raw),JSON.stringify([presentation,scope,category,format]));
        presentationCases++;
      }
    }
  }
}
console.log(presentationCases + ' matching presentation outputs');

// Run saved fixtures through each version's own migration before comparison.
let migratedCases = 0;
for (const fixture of [...previous.legacy03Fixtures, ...previous.phase5dBaseline, ...previous.fixtures05]) {
  const raw = fixture.raw || fixture.outfit;
  const oldImport = previous.schema.migrate(raw);
  const newImport = current.schema.migrate(raw);
  assert(oldImport.ok && newImport.ok, 'Could not import saved outfit '+raw.id);
  const before = oldImport.outfit;
  const after = newImport.outfit;
  for (const format of ['short','detailed','markdown']) {
    assert.equal(current.generator[format](after),previous.generator[format](before),raw.id+' '+format);
    migratedCases++;
  }
  assert.equal(JSON.stringify(current.structureLines(after)),JSON.stringify(previous.structureLines(before)),raw.id+' structure');
  migratedCases++;
}
console.log(migratedCases + ' matching migrated fixture outputs');
