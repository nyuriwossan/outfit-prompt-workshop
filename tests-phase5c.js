/* Phase 5C regression cases; shared by tests.html and scripts/test.cjs. */
(function (global) {
  'use strict';
  var C = global.CPW, D = C.data, U = C.util;
  function assert(v, message) { if (!v) throw new Error(message || 'Phase 5C assertion failed'); }
  function test(name, fn) { C.tests.push({ name: '5C: ' + name, fn: fn }); }
  function optionList(list, min, max) {
    assert(list.length >= min && list.length <= max, 'count: ' + list.length);
    var seen = {};
    list.forEach(function (o) {
      assert(/^[a-z][a-z0-9_]*$/.test(o.id), o.id);
      assert(!seen[o.id], 'duplicate: ' + o.id); seen[o.id] = true;
      assert(o.labelJa && (o.shortPrompt || o.promptEn || /^no_/.test(o.id)), o.id + ': text');
      assert(o.groupJa, o.id + ': group');
    });
  }
  var limits = { fit: [15,18], upperVolume:[8,10], lowerVolume:[8,10], waist:[10,12], length:[15,18], symmetry:[7,9] };
  Object.keys(limits).forEach(function (k) {
    test('silhouette ' + k + ' data', function () { optionList(D.silhouette[k], limits[k][0], limits[k][1]); });
  });
  test('legacy length IDs remain readable', function () {
    ['micro','knee','midi','floor','train'].forEach(function (id) {
      var o=C.schema.normalize({silhouette:{length:id}});
      assert(o.silhouette.length===id && U.byId(D.silhouette.length,id),id);
    });
  });
  var partLimits = {neckline:[25,30],collar:[25,30],shoulders:[12,16],sleeves:[30,35],cuffs:[12,16],waist:[15,20],skirt_shape:[14,18],hem:[18,22],bottoms:[14,18],inner_shirt:[10,12],vest:[8,10]};
  Object.keys(partLimits).forEach(function (k) {
    test('parts ' + k + ' data and normalization', function () {
      var slot=U.byId(D.partSlots,k);
      optionList(slot.options,partLimits[k][0],partLimits[k][1]);
      slot.options.forEach(function (opt) { var parts={}; parts[k]=opt.id; assert(C.schema.normalize({parts:parts}).parts[k]===opt.id,opt.id); });
    });
  });
  test('category slots are unique and resolve', function () {
    D.garmentCategories.forEach(function (cat) {
      var seen={}; cat.slots.forEach(function (id) { assert(!seen[id] && U.byId(D.partSlots,id),cat.id+': '+id); seen[id]=true; });
    });
  });
  ['closure','cutout','construction_detail','asymmetry_detail'].forEach(function (id,i) {
    test('new slot '+id+' data, round trip and output', function () {
      var slot=U.byId(D.partSlots,id); optionList(slot.options,[20,20,18,15][i],[25,25,22,20][i]);
      slot.options.forEach(function (opt) {
        var p={};p[id]=slot.multi?[{id:opt.id,layer:'main'}]:opt.id;
        var o=C.schema.normalize({garment:{category:'dress',subtype:'ball_gown'},parts:p});
        var next=C.schema.normalize(JSON.parse(JSON.stringify(o)));
        assert(JSON.stringify(o.parts)===JSON.stringify(next.parts),opt.id);
        assert(C.generator.short(next).indexOf(opt.shortPrompt)>=0,opt.id);
      });
    });
  });
  test('merfolk rejects lower structural panels without deleting selections', function () {
    var o=C.schema.normalize({garment:{category:'merfolk'},parts:{asymmetry_detail:'asymmetric_skirt_panel'}});
    assert(o.parts.asymmetry_detail==='asymmetric_skirt_panel');
    assert(!/skirt/.test(C.generator.short(o)));
  });
  test('swimwear back is preferred to duplicate imported cutouts', function () {
    var o=C.schema.normalize({garment:{category:'swimwear'},parts:{back:'open_back',cutout:[{id:'open_back',layer:'main'}]}});
    assert((C.generator.detailed(o).match(/open back/g)||[]).length===1);
  });
  test('styling catalog has complete unique metadata', function () { optionList(D.styling,25,35); });
  test('styles retain old IDs and expand to 45–55', function () { optionList(D.styles,45,55); });
  test('decorations expand to 80–95 without duplicate English entries', function () {
    optionList(D.decorations,80,95); var seen={};
    D.decorations.forEach(function(d) {assert(!seen[d.shortPrompt],d.id);seen[d.shortPrompt]=true;});
  });
  ['0.1','0.2','0.3','0.4'].forEach(function (version) {
    test('migration from '+version+' adds empty styling and preserves condition/custom tags', function () {
      var raw={version:version,concept:{},garment:{category:'robe',subtype:'trench_coat'},
        condition:{items:[{type:'rain_soaked',severity:'moderate',extent:'overall',placements:[]}]},
        output:{customTags:'Exact_CASE (tag:1.2), 保持'}};
      var before=C.generator.short(raw), r=C.schema.migrate(raw);
      assert(r.ok && r.outfit.version==='0.4'); assert(r.outfit.styling.items.length===0);
      assert(C.generator.short(r.outfit)===before);
      assert(r.outfit.output.customTags===raw.output.customTags);
    });
  });
  test('styling normalization discards unknown, pseudo and duplicate IDs, keeps at most two', function () {
    [null,{},'bad',{items:'bad'}].forEach(function(raw) { assert(C.schema.normalizeStyling(raw).items.length===0); });
    var r=C.schema.normalizeStyling({items:['no_styling','unknown',null,{},'half_tucked','half_tucked','sleeves_rolled_up','hood_up']});
    assert(r.items.join(',')==='half_tucked,sleeves_rolled_up');
  });
  [[],['half_tucked'],['half_tucked','sleeves_rolled_up']].forEach(function (ids) {
    test('JSON roundtrip '+ids.length+' styling items', function () {
      var o=C.schema.normalize({garment:{category:'top_bottom',subtype:'simple_shirt_and_ankle_pants'},styling:{items:ids},output:{customTags:'(CUSTOM:1.25), Keep-Me'}});
      var next=C.schema.migrate(JSON.parse(JSON.stringify(o))).outfit;
      assert(JSON.stringify(next)===JSON.stringify(o));
      assert(C.generator.detailed(next).endsWith(o.output.customTags));
      ids.forEach(function(id) {assert(C.generator.short(next).indexOf(U.byId(D.styling,id).shortPrompt)>=0,id);});
    });
  });
  test('state rejects third styling and allows removing an inactive selection', function () {
    var saved=U.clone(C.state.outfit);
    C.state.load({garment:{category:'top_bottom',subtype:'simple_shirt_and_ankle_pants'}});
    assert(!C.state.toggleStyling('sleeves_rolled_up')); assert(!C.state.toggleStyling('half_tucked'));
    assert(C.state.toggleStyling('collar_loosened')==='着こなし・着崩しは2件まで指定できます。');
    C.state.setPart('sleeves','sleeveless'); assert(!C.state.toggleStyling('sleeves_rolled_up'));
    assert(C.state.outfit.styling.items.join(',')==='half_tucked'); C.state.load(saved);
  });
  var applicability=[
    ['sleeves_rolled_up',{sleeves:'sleeveless'},false],['sleeves_rolled_up',{sleeves:'long_sleeves'},true],
    ['collar_loosened',{collar:'no_collar'},false],['collar_loosened',{collar:'point_collar'},true],
    ['hood_up',{},false],['hood_up',{headwear:'hood'},true],
    ['tie_loosened',{},false],['jacket_worn_open',{},false]
  ];
  applicability.forEach(function (row,i) {
    test('shared applicability '+i,function () {
      var o=C.schema.normalize({garment:{category:'top_bottom',subtype:'simple_shirt_and_ankle_pants'},parts:row[1],styling:{items:[row[0]]}});
      var opt=U.byId(D.styling,row[0]); assert(C.styling.applicable(o,opt)===row[2]);
      assert((C.generator.short(o).indexOf(opt.shortPrompt)>=0)===row[2]);
      assert(o.styling.items[0]===row[0]);
    });
  });
  test('merfolk styling ignores dormant human slots and roundtrips with condition',function () {
    var o=C.schema.normalize({garment:{category:'merfolk',subtype:'mermaid_tail'},parts:{bottoms:'ankle_pants'},styling:{items:['half_tucked','asymmetrically_worn']},condition:{items:[{type:'rain_soaked'}]}});
    var next=C.schema.normalize(JSON.parse(JSON.stringify(o)));
    assert(!/half-tucked|ankle pants/.test(C.generator.short(next)));
    assert(C.generator.short(next).indexOf('asymmetrically worn')>=0);
    assert(next.condition.items.length===1 && next.styling.items.length===2);
  });
  test('K: main 0.3 exports retain every field and generated prompt after migration',function () {
    assert(C.legacy03Fixtures.length>=32);
    C.legacy03Fixtures.forEach(function(f) {
      var migrated=C.schema.migrate(f.raw); assert(migrated.ok,f.preset);
      var copy=U.clone(migrated.outfit);copy.version='0.3';delete copy.styling;
      assert(JSON.stringify(copy)===JSON.stringify(f.raw),f.preset+': saved fields');
      assert(C.generator.short(migrated.outfit)===f.short,f.preset+': short');
      assert(C.generator.detailed(migrated.outfit)===f.detailed,f.preset+': detailed');
    });
  });
  function outfit(patch) {return C.schema.applyPatch(C.schema.createOutfit(),patch);}
  var acceptance=[
    ['A','top_bottom','simple_shirt_and_ankle_pants',{silhouette:{fit:'relaxed'},parts:{collar:'open_collar',sleeves:'long_sleeves'},styling:{items:['sleeves_rolled_up','half_tucked']}},/relaxed fit/,/shirt half-tucked/],
    ['B','uniform','business_suit',{silhouette:{fit:'tailored'},parts:{collar:'peak_lapels',closure:'single_breasted'},styling:{items:['tie_neatly_fastened']}},/peak lapels/,/tie neatly fastened/],
    ['C','top_bottom','shirt_and_trousers',{palette:{primary:'jet_black'},concept:{primaryStyle:'punk'},parts:{closure:'asymmetric_zipper',asymmetry_detail:'uneven_hem'},decorations:{items:[{type:'metal_studs'},{type:'safety_pin_details'}]}},/asymmetric zipper/,/safety-pin details/],
    ['D','dress','ball_gown',{parts:{neckline:'sweetheart_neckline',sleeves:'bishop_sleeves',construction_detail:'gathered_panels',hem:'ruffled_hem'}},/sweetheart neckline/,/gathered panels/],
    ['E','top_bottom','side_cutout_knitwear',{parts:{cutout:[{id:'side_cutouts'},{id:'open_back'}],sleeves:'long_sleeves'}},/side cutouts/,/open back/],
    ['F','dress','cocktail_dress',{parts:{shoulders:'one_shoulder',sleeves:'one_sleeve',asymmetry_detail:'diagonal_draping',hem:'asymmetric_hem'}},/one-shoulder/,/diagonal draping/],
    ['G','top_bottom','shirt_and_trousers',{styling:{items:['sleeves_rolled_up','collar_loosened']}},/sleeves rolled up/,/collar loosened/],
    ['H','robe','trench_coat',{silhouette:{length:'ankle_length'},parts:{cover_up:'neck_scarf'},styling:{items:['coat_worn_open','scarf_loosely_wrapped']}},/coat worn open/,/scarf loosely wrapped/],
    ['I','merfolk','sea_silk_mermaid_outfit',{parts:{cutout:[{id:'open_back'}],asymmetry_detail:'diagonal_draping'},decorations:{items:[{type:'pearl_details'}]}},/single fish tail/,/pearl details/],
    ['J','uniform','business_suit',{styling:{items:['jacket_worn_open']},condition:{items:[{type:'rain_soaked'}]}},/jacket worn open/,/rain/],
    ['L','lingerie','reverse_bunny_suit',{parts:{closure:'asymmetric_zipper',construction_detail:'panel_construction'}},/reverse bunny suit/,/panel construction/]
  ];
  acceptance.forEach(function(c) {test(c[0]+': acceptance',function(){
    var o=outfit(U.deepMerge({garment:{category:c[1],subtype:c[2]}},c[3]));
    var sh=C.generator.short(o), de=C.generator.detailed(o);
    assert(c[4].test(sh)&&c[5].test(sh),sh);
    assert(!/with with|with half-tucked|with rolled up|undefined|null|,,|\.\.|\. ,/.test(de),de);
    if(c[0]==='E')assert(!/nude|naked|breast|genital|sexual/.test(sh+' '+de));
    if(c[0]==='I')assert(!/trousers|pants|shoes|skirt/.test(sh+' '+de));
  });});
  test('G: all three styling choices work in pairs; maximum remains two',function(){
    [['sleeves_rolled_up','collar_loosened'],['sleeves_rolled_up','half_tucked'],['collar_loosened','half_tucked']].forEach(function(ids){
      var o=outfit({garment:{category:'top_bottom',subtype:'shirt_and_trousers'},styling:{items:ids}});
      assert(C.styling.active(o).length===2);
    });
  });
  [
    ['styling_inapplicable',{parts:{sleeves:'sleeveless'},styling:{items:['sleeves_rolled_up']}}],
    ['styling_inapplicable',{parts:{collar:'no_collar'},styling:{items:['collar_loosened']}}],
    ['styling_inapplicable',{styling:{items:['hood_up']}}],
    ['symmetry_detail',{silhouette:{symmetry:'symmetrical'},parts:{sleeves:'one_sleeve'}}],
    ['symmetry_detail',{silhouette:{symmetry:'symmetrical'},parts:{shoulders:'one_shoulder'}}],
    ['rigid_draping',{materials:{primary:'plate_armor'},parts:{construction_detail:'draped_panels'}}],
    ['swim_cutout_duplicate',{garment:{category:'swimwear',subtype:'one_piece_swimsuit'},parts:{back:'open_back',cutout:[{id:'open_back'}]}}],
    ['open_back_armor',{garment:{category:'uniform',subtype:'business_suit'},materials:{primary:'plate_armor'},parts:{vest:'armored_vest',cutout:[{id:'open_back'}]}}]
  ].forEach(function(c,i){test('warning '+i+': '+c[0],function(){
    var o=outfit(U.deepMerge({garment:{category:'top_bottom',subtype:'shirt_and_trousers'}},c[1]));
    var before=JSON.stringify(o), issue=C.advisor.check(o).filter(function(x){return x.id===c[0];})[0];
    assert(issue&&issue.severity==='warning',c[0]);assert(issue.resolutions.some(function(r){return r.action==='ignore';}));assert(JSON.stringify(o)===before);
  });});
  ['silhouette','collar','sleeves','tailoring','cutout','styling','style','decorations'].forEach(function(target){test('gacha '+target+' is connected, scoped and immutable',function(){
    var o=outfit({garment:{category:'top_bottom',subtype:'shirt_and_trousers'},output:{customTags:'Keep_CASE'},parts:{sleeves:'long_sleeves'}}), before=JSON.stringify(o);
    var results=C.gacha.roll(o,{target:target,seed:503,keeps:[],count:3});assert(results.length===3,target);
    assert(before===JSON.stringify(o)); results.forEach(function(r){
      assert(r.diff.length&&r.preview.output.customTags==='Keep_CASE');
      if(target==='styling')assert(C.styling.active(r.preview).length===r.preview.styling.items.length);
    });
  });});
  test('styling gacha never offers rolled sleeves on a sleeveless main garment',function(){
    var o=outfit({garment:{category:'dress',subtype:'slip_dress_outer'},parts:{sleeves:'sleeveless',collar:'no_collar'}});
    for(var seed=0;seed<20;seed++)C.gacha.roll(o,{target:'styling',seed:seed}).forEach(function(r){assert(!/sleeves_rolled_up|sleeves_pushed_up|collar_loosened|hood_up/.test(r.preview.styling.items.join(',')));});
  });
  test('merfolk gacha excludes human panels and lower silhouette mutations',function(){
    var o=outfit({garment:{category:'merfolk',subtype:'mermaid_tail'}});
    ['tailoring','cutout','silhouette','styling','decorations'].forEach(function(target){C.gacha.roll(o,{target:target,seed:5,keeps:[]}).forEach(function(r){
      assert(r.preview.parts.asymmetry_detail!=='asymmetric_skirt_panel'&&r.preview.parts.asymmetry_detail!=='uneven_hem');
      assert(!r.preview.silhouette.length&&!r.preview.silhouette.lowerVolume);assert(!/skirt|trousers|pants|shoes/.test(C.generator.short(r.preview)));
    });});
  });
  ['casual','formal','punk','techwear','romantic','gothic','merfolk'].forEach(function(key){test('advisor affinity '+key+' offers connected choices',function(){
    var o=outfit({garment:{category:key==='merfolk'?'merfolk':key==='formal'?'uniform':'top_bottom',subtype:key==='merfolk'?'mermaid_tail':key==='formal'?'business_suit':'shirt_and_trousers'},concept:{worldview:'modern',primaryStyle:key==='formal'?null:key}});
    var before=JSON.stringify(o), suggestions=C.advisor.suggest(o,{limit:100});
    var ids=D.tailoringAffinity[key].map(function(p){return p[1];});assert(suggestions.some(function(s){return ids.indexOf(s.valueId)>=0;}),key);
    suggestions.forEach(function(s){if(s.targetPath==='styling.items')assert(C.styling.active(C.advisor.apply(o,s)).length===s.patch.styling.items.length);});assert(JSON.stringify(o)===before);
  });});
  test('audit regression: asymmetric styling suppresses symmetrical English but preserves data',function(){
    var o=outfit({garment:{category:'uniform',subtype:'business_suit'},silhouette:{symmetry:'symmetrical'},styling:{items:['asymmetrically_worn']}});
    assert(!/\bsymmetrical\b/.test(C.generator.short(o)+' '+C.generator.detailed(o)));assert(o.silhouette.symmetry==='symmetrical');
  });
  test('crewneck core deduplicates selected crew neck in detailed English',function(){
    var o=outfit({garment:{category:'top_bottom',subtype:'crewneck_knit_and_chinos'},parts:{neckline:'crew_neck'}});
    assert(!/with crew neck/.test(C.generator.detailed(o)));assert(o.parts.neckline==='crew_neck');
  });
  test('dormant armored vest and skirt panels do not affect merfolk structure',function(){
    var o=outfit({garment:{category:'merfolk',subtype:'mermaid_tail'},materials:{primary:'plate_armor'},parts:{vest:'armored_vest',asymmetry_detail:'asymmetric_skirt_panel',cutout:[{id:'open_back'}]}});
    assert(!C.structureFacts(o).rigidBack && !C.structureFacts(o).asymmetric);assert(C.generator.short(o).indexOf('open back')>=0);
  });
  test('garment with explicit necktie permits tie styling',function(){
    var g=D.garments.filter(function(g){return /necktie/.test(g.detailedPrompt||'');})[0];assert(g);
    var o=outfit({garment:{category:g.category,subtype:g.id},styling:{items:['tie_loosened']}});assert(C.styling.active(o).length===1);
  });
  test('styling survives library save, duplicate and exported JSON import',function(){
    var mem={},read=C.store._read,write=C.store._write;
    C.store._read=function(k,f){return mem[k]?JSON.parse(mem[k]):f;};C.store._write=function(k,v){mem[k]=JSON.stringify(v);return true;};
    try {
      var o=outfit({garment:{category:'uniform',subtype:'business_suit'},styling:{items:['jacket_worn_open','tie_loosened']},condition:{items:[{type:'rain_soaked'}]},output:{customTags:'Exact (tag:1.0)'}});
      C.store.saveOutfit(o);var saved=C.store.listOutfits()[0];assert(saved.styling.items.length===2);
      var duplicate=C.store.duplicateOutfit(saved.id);assert(duplicate.id!==saved.id && duplicate.styling.items.length===2);
      var json=C.store.exportOutfit(saved);var r=C.store.importJSON(json);assert(r.ok);
      C.store.listOutfits().forEach(function(x){assert(x.styling.items.join(',')===o.styling.items.join(','));assert(x.output.customTags===o.output.customTags);});
    } finally {C.store._read=read;C.store._write=write;}
  });
  test('merfolk decoration placements are filtered consistently without changing stored selections',function(){
    var o=outfit({garment:{category:'merfolk',subtype:'mermaid_tail'},decorations:{items:[{type:'safety_pin_details',placements:['legs','skirt','chest']}]}});
    assert(!/legs|skirt/.test(C.generator.blocks(o).decorations.short.join(',')));
    assert(o.decorations.items[0].placements.length===3);
  });
  test('new affinity paths reference existing catalog options',function(){
    Object.keys(D.tailoringAffinity).forEach(function(key){D.tailoringAffinity[key].forEach(function(pair){
      var path=pair[0].split('.'), list=path[0]==='parts'?U.byId(D.partSlots,path[1]).options:path[0]==='silhouette'?D.silhouette[path[1]]:D[path[0]];
      assert(U.byId(list,pair[1]),key+': '+pair.join('='));
    });});
  });
})(window);
