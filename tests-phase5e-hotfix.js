/* Phase 5E hotfix: preserve stored colors while avoiding global image directives. */
(function(g){
  'use strict';
  var C=g.CPW,D=C.data,U=C.util,S=C.schema;
  function assert(v,m){if(!v)throw Error(m||'hotfix assertion');}
  function test(name,fn){C.tests.push({name:'5E hotfix: '+name,fn:fn});}
  var dangerous=/\bmonochrome\b|\bgrayscale\b|black-and-white image/i;
  [['jet_black','charcoal_gray'],['ink_black','pearl_gray'],['deep_crimson','burgundy']].forEach(function(pair){
    ['short','detailed'].forEach(function(mode){test(pair.join(' + ')+' monochrome '+mode,function(){
      var o=S.normalize({garment:{category:'dress',subtype:'cocktail_dress'},palette:{primary:pair[0],secondary:pair[1],scheme:'monochrome'}}),text=C.generator[mode](o);
      assert(!dangerous.test(text),text);
      pair.forEach(function(id){assert(text.indexOf(U.byId(D.colors,id).promptEn)>=0,'lost color '+id+': '+text);});
      assert(o.palette.scheme==='monochrome','saved ID changed');
    });});
  });
  D.colors.forEach(function(color){test('all secondary colors with '+color.id+' monochrome have no global directive',function(){
    D.colors.forEach(function(secondary){var o=S.normalize({garment:{category:'dress',subtype:'cocktail_dress'},palette:{primary:color.id,secondary:secondary.id,scheme:'monochrome'}});['short','detailed'].forEach(function(mode){var t=C.generator[mode](o);assert(!/\bmonochrome\b/i.test(t)&&!/\bgrayscale\b/i.test(t)&&!/black-and-white image/i.test(t),t);});});
  });});
  test('generator guards monochrome even if data text is reintroduced',function(){
    var scheme=U.byId(D.colorSchemes,'monochrome'),before=scheme.promptEn;
    try{scheme.promptEn='monochrome palette grayscale black-and-white image';var o=S.normalize({garment:{category:'dress',subtype:'cocktail_dress'},palette:{primary:'jet_black',secondary:'charcoal_gray',scheme:'monochrome'}});['short','detailed'].forEach(function(mode){assert(!dangerous.test(C.generator[mode](o)));});}finally{scheme.promptEn=before;}
  });
  test('monochrome is a retained internal ID with no output phrase',function(){assert(U.byId(D.colorSchemes,'monochrome').promptEn==='');var raw=S.normalize({garment:{category:'dress',subtype:'cocktail_dress'},palette:{primary:'ink_black',secondary:'pearl_gray',scheme:'monochrome'}});raw.version='0.5';var o=S.migrate(raw);assert(o.ok&&o.outfit.version==='0.6'&&o.outfit.palette.scheme==='monochrome');});
  test('customTags remain verbatim including explicit user monochrome words',function(){var o=S.normalize({garment:{category:'dress',subtype:'cocktail_dress'},palette:{primary:'jet_black',scheme:'monochrome'},output:{customTags:'  User,(monochrome:1.2), grayscale  '}});['short','detailed'].forEach(function(mode){assert(C.generator[mode](o).endsWith(o.output.customTags.trim()));});});
  test('palette gacha chooses a neutral structural scheme for every seed',function(){var o=S.normalize({garment:{category:'dress',subtype:'cocktail_dress'},palette:{primary:'jet_black',secondary:'charcoal_gray',scheme:'monochrome'}}),before=JSON.stringify(o);for(var seed=0;seed<100;seed++){var candidates=C.gacha.roll(o,{target:'palette',seed:seed,keeps:[],count:3});assert(candidates.length===3,'seed '+seed);candidates.forEach(function(c){assert(c.preview.palette.scheme==='base_and_accent');['short','detailed'].forEach(function(mode){assert(!dangerous.test(C.generator[mode](c.preview)));});});}assert(JSON.stringify(o)===before,'gacha mutated source');});
})(typeof window!=='undefined'?window:global);
