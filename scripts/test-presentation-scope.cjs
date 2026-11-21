// Cover the eight independent combinations, the three named ranges and plain_bg in both layouts.
const assert = require('node:assert/strict');
const {load} = require('./test.cjs');
const C = load();
const keys = Object.keys(C.presentationScope.labels);
const flags = output => keys.map(key => !!output[key]);
const states = Array.from({length:8}, (_, mask) => Object.fromEntries(keys.map((key,i) => [key, !!(mask & 1<<i)])));
let cases = 0;
for (const range of [...states,'outfit','pose','all']) {
  for (const legacy of [true,false]) {
    for (const plain of [true,false]) {
      for (const key of keys) for (const on of [false,true]) for (const individual of [false,true]) {
        const outfit = C.presetCatalog.create('cape_magician');
        outfit.presentation = C.presentation.normalize({
          ...(legacy ? {preset:'chair_sit'} : {layoutVersion:1,poseId:'hand_chest'}),
          compositionAssist:plain?'plain_bg':null,background:'light',rendering:{enabled:true,paint:'watercolor'}
        });
        if (typeof range === 'string') C.presentation.setScope(outfit,range);
        else Object.assign(outfit.output,range,{scope:null});
        const before = JSON.stringify(outfit.output);
        const patch = {[key]:on};
        const expected = flags({...outfit.output,...patch});
        const message = C.presentationScope.setFlags(outfit,patch,false,individual);
        if (message) {
          assert(plain);
          assert.equal(JSON.stringify(outfit.output),before,'pending range must be inert');
          C.presentationScope.setFlags(outfit,patch,true,individual);
        }
        assert.deepEqual(flags(outfit.output),expected);
        const imported = C.schema.migrate(JSON.parse(JSON.stringify(outfit))).outfit;
        assert.deepEqual(flags(imported.output),expected);
        assert.equal(imported.output.scope,outfit.output.scope);
        if (individual || typeof range !== 'string') assert.equal(imported.output.scope,null);
        for (const state of [outfit,imported]) {
          const b = C.generator.blocks(state);
          assert.equal(b.presentation.short.some(w=> /chest|seated/.test(w)),expected[0]);
          assert.equal(b.background.short.some(w=>w.includes('rim light')),expected[1]);
          assert.equal(b.rendering.short.some(w=>w.includes('watercolor')),expected[2]);
          assert.equal(b.presentation.short.includes('plain background'),!!(plain && !state.output.scope && !legacy && expected[0]));
          assert.equal(b.background.short.includes('plain background'),!!(plain && state.output.scope && expected[1]));
        }
        assert.equal(C.generator.short(imported),C.generator.short(outfit));
        cases++;
      }
    }
  }
}
console.log(cases+' flag edits, including round-trip and generated blocks, passed');
