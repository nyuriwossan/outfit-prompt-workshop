/* Focused preset hotfix regressions; legacy snapshots are from the starting main. */
(function(g){
  'use strict';var C=g.CPW,S=C.schema,U=C.util,D=C.data;
  function assert(v,m){if(!v)throw Error(m||'preset regression');}
  function test(n,f){C.tests.push({name:'Preset shapes: '+n,fn:f});}
  function outfit(id){return S.applyPatch(S.createOutfit(),U.byId(D.presets,id).patch);}
  ['short','detailed'].forEach(function(mode){
    test('backless knit '+mode,function(){var o=outfit('cutout_knit'),t=C.generator[mode](o);assert(o.concept.primaryStyle===null&&!o.parts.footwear&&o.palette.accent===null&&o.palette.scheme===null);['virgin killer sweater','completely open back','ribbon tie at the nape','high neckline','sleeveless','opaque rib knit','matte finish','heather gray','jet black'].forEach(function(p){assert(t.includes(p),p+': '+t);});assert(!/side.cutout|open sides|long sleeves|oversized|street|sneakers|mint|neutral palette with metallic accents/i.test(t),t);});
    test('open front bunny '+mode,function(){var t=C.generator[mode](outfit('reverse_bunny'));['reverse bunny suit','open front bunnysuit','rabbit ear hairband','wrist cuffs','jet black','thigh-high stockings','heeled pumps','opaque satin'].forEach(function(p){assert(t.includes(p),p+': '+t);});assert((t.match(/cuffs/g)||[]).length===1,t);assert(!/sky blue|reverse-cut|plain cuffs/.test(t),t);assert(t.includes('pure white'),t);assert(outfit('reverse_bunny').palette.primary==='jet_black');});
    C.presetShapeBaseline.presets.forEach(function(p){test('unchanged '+p.id+' '+mode,function(){assert(C.generator[mode](outfit(p.id))===p[mode],p.id);});});
    C.presetShapeBaseline.garments.forEach(function(p){test('legacy garment '+p.id+' '+mode,function(){var o=S.normalize({garment:{category:p.category,subtype:p.id}});assert(C.generator[mode](o)===p[mode],p.id);});});
  });
  ['cutout_knit','reverse_bunny'].forEach(function(id){
    test(id+' save round trip and editable color',function(){var o=outfit(id),r=S.migrate(JSON.parse(JSON.stringify(o)));assert(r.ok&&r.outfit.version==='0.6');assert(JSON.stringify(r.outfit)===JSON.stringify(o));var edited=S.applyPatch(o,{palette:{primary:'deep_crimson',secondary:null,accent:null},output:{customTags:'user-defined tag'}});['short','detailed'].forEach(function(mode){var t=C.generator[mode](edited);assert(t.includes('deep crimson')&&!t.includes('jet black'),t);assert(t.endsWith('user-defined tag'),t);});});
  });
  [['virgin_killer_sweater','top_bottom',['no_cutouts','no_ribbons','modest_coverage']],['open_front_reverse_bunny_suit','lingerie',['no_cutouts','no_animal_motifs','modest_coverage']]].forEach(function(row){row[2].forEach(function(exclusion){test(row[0]+' respects '+exclusion,function(){var o=S.normalize({garment:{category:row[1],subtype:row[0]}});assert(C.conceptFashion.constraintViolations(o,[exclusion]).length>0,'intrinsic feature not detected');});});});
})(typeof window!=='undefined'?window:global);
