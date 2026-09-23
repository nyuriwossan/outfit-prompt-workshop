/* Deterministic actual outfit/text audit; rejected requests do not count as rendered cases. */
const fs=require('fs'),{load}=require('./test.cjs'),C=load(),D=C.data,F=D.conceptFashion,E=C.conceptFashion,U=C.util;
const total=Number(process.argv[2]||250000),outfile=process.argv[3],rng=C.gacha.makeRng({seed:0x5e2026});
const pick=a=>a[Math.floor(rng()*a.length)],coverage={},reasons={},examples=[],diversity={batches:0,twoDomains:0,limited:0,identical:0,colorOnly:0,exceptions:[]};
let rendered=0,batch=0,failures=0,rejected=0,queue=[];
const cover=(k,v)=>{coverage[k]??={};coverage[k][v]=(coverage[k][v]||0)+1;};
const fail=(why,o,text)=>{failures++;reasons[why]=(reasons[why]||0)+1;if(examples.length<15)examples.push({index:rendered,batch,reason:why,text,outfit:o});};
const choices=F.motifs.map(m=>({categoryId:m.category,motifId:m.id,foodGroupId:m.groupId})).concat(F.attires.map(a=>({categoryId:'traditional',traditional:{attireId:a.id}})));
const bad=[/\b(?:undefined|null|NaN)\b/,/,,|\.\.|\.\s*,/,/\b(with|and|of|the|a|an)\s+\1\b/i,/inspired-inspired/i,/\bconcept concept\b/i,/\bstyle style\b/i,/\b(?:a|an) (?:trousers|shorts|sleeves)\b/i,/\ban (?:uniform|European)\b/i,/Art Nouveau Art-Nouveau/i,/\bgothic gothic\b/i];
function namedOccurrences(text,name,names){let body=text.toLowerCase();for(const longer of names.filter(x=>x.length>name.length).sort((a,b)=>b.length-a.length))body=body.split(longer.toLowerCase()).join(' COLOR ');return body.split(name.toLowerCase()).length-1;}
function recordSelection(s){
  cover('primary',s.motifId||s.traditional.attireId||'custom');cover('category',s.categoryId||'custom');cover('secondary',s.secondary?.motifId||'none');cover('blend',s.blendMode);cover('interpretation',s.interpretationMode);
  for(const k of ['worldviewId','eraId','roleId','occasionId'])cover(k,s.context[k]||'none');
  for(const [key,list] of [['storyState',s.context.storyStateIds],['direction',s.directions],['designLanguage',s.designLanguages],['exclusion',s.exclusions]])for(const id of list)cover(key,id);
}
while(rendered<total){
  let o,selection=null,candidate=null,preserved=null;
  if(rendered%4===0){
    const n=Math.floor(rendered/4),garment=D.garments[n%D.garments.length];cover('mode','normal');
    o=C.schema.normalize({garment:{category:garment.category,subtype:garment.id},concept:{primaryStyle:pick(D.styles).id},palette:{primary:pick(D.colors).id},materials:{primary:pick(D.materials).id}});
    for(const k of U.byId(D.garmentCategories,garment.category).slots){const slot=U.byId(D.partSlots,k),pool=(slot.options||[]).filter(x=>C.partOptionAllowed(o,k,x));if(pool.length&&rng()<.2)o.parts[k]=C.schema.normalizePartValue(slot,pick(pool).id);}
    const condition=D.conditions[n%D.conditions.length];o.condition.items=[{type:condition.id,severity:pick(D.conditionSeverities).id,extent:pick(D.conditionExtents).id,placements:[]}];cover('condition',condition.id);
    const available=C.styling.available(o);if(available.length){o.styling.items=[pick(available).id];cover('styling',o.styling.items[0]);}
    if(n%4===0){const slot=D.specialParts.slots[Math.floor(n/4)%4];o.specialParts[slot.id]={type:pick(C.schema.axisOf(slot,'type').options).id};}
  }else{
    while(!queue.length){
      const n=batch++,cycle=Math.floor(n/choices.length);let s=U.clone(choices[n%choices.length]);
      s.context={worldviewId:D.worldviews[n%D.worldviews.length].id,eraId:D.eras[n%D.eras.length].id,roleId:D.roles[n%D.roles.length].id,occasionId:D.occasions[n%D.occasions.length].id,storyStateIds:[F.storyStates[n%F.storyStates.length].id]};
      if(n%5===0)s.context.storyStateIds.push(F.storyStates[(n+7)%F.storyStates.length].id);
      if(n%3!==0){const second=F.motifs[(n+43)%F.motifs.length];s.secondary={categoryId:second.category,motifId:second.id};}
      s.blendMode=F.blendModes[n%4].id;s.directions=[F.directions[n%F.directions.length].id];s.designLanguages=n%4===0?[]:[F.designLanguages[n%F.designLanguages.length].id];s.interpretationMode=F.interpretationModes[n%7].id;
      s.strengthId=F.strengths[cycle%5].id;s.baseId=n%4===0?null:F.bases[cycle%F.bases.length].id;s.exposure=n%7===0?null:n%6;
      if(n%7===0)s.placements=['palette','materials','special','ornament'];
      if(n%11===0)s.placements=['sleeves','neckline','hem','headpiece'];
      if(n%2===0)s.exclusions=[F.exclusions[Math.floor(n/2)%F.exclusions.length].id];
      if(n%13===0)s.exclusions=[0,5,11,19].map(k=>F.exclusions[(n+k)%F.exclusions.length].id);
      if(s.categoryId==='food'){s.foodApplications=[F.foodApplications[cycle%F.foodApplications.length].id];cover('foodApplication',s.foodApplications[0]);cover('foodGroup',s.foodGroupId);}
      if(s.traditional){s.traditional.treatmentId=F.treatments[cycle%F.treatments.length].id;cover('treatment',s.traditional.treatmentId);}
      if(n%37===0){s.customMotif='忘れられた約束';cover('custom','primary');}
      if(n%41===0){s.secondary={customMotif:'光の記憶'};cover('custom','secondary');}
      s=E.normalizeSelection(s);recordSelection(s);
      let current=null,mode='new';
      if(n%5===0){mode='preserve';const garment=D.garments[n%D.garments.length];current=C.schema.normalize({garment:{category:garment.category,subtype:garment.id},palette:{primary:'jet_black'},decorations:{items:n%10===0?[{type:'frills'}]:[]},output:{customTags:'(EXACT_Tag:1.25), Keep-CaSe / 日本語'}});}
      const before=JSON.stringify({s,current,state:C.state.outfit}),cs=E.buildCandidates(s,{seed:n+0x5e,mode,currentOutfit:current});
      if(before!==JSON.stringify({s,current,state:C.state.outfit}))fail('preview mutation',{},'');
      if(!cs.length){rejected++;if(!s.exclusions.length)fail('unexpected empty candidates',{},JSON.stringify(s));continue;}
      if(cs.length!==3)fail('partial candidate set',{},JSON.stringify(s));
      diversity.batches++;const d=E.diversity(cs);
      if(d.count>=2)diversity.twoDomains++;else{diversity.limited++;if(diversity.exceptions.length<10)diversity.exceptions.push({seed:n,mode,reason:d.exception,selection:s});}
      for(let j=0;j<cs.length;j++)for(let k=j+1;k<cs.length;k++){
        const diff=E.diversity([cs[j],cs[k]]);
        if(!diff.count){diversity.identical++;if(mode==='new'&&!d.exception)fail('identical strategy pair',cs[j].outfit,'');}
        if(!diff.structural&&diff.count){diversity.colorOnly++;if(mode==='new'&&!d.exception)fail('material-only strategy pair',cs[j].outfit,'');}
      }
      queue=cs.map(c=>({candidate:c,selection:s,mode,preserved:current}));
    }
    const entry=queue.shift();candidate=entry.candidate;selection=entry.selection;preserved=entry.preserved;o=candidate.outfit;cover('mode',entry.mode);cover('strategy',candidate.strategy);
    const violations=E.constraintViolations(o,selection.exclusions);
    for(const v of violations)if(!(candidate.conflicts||[]).some(x=>x.id===v.id&&x.path===v.path))fail('exclusion violation',o,JSON.stringify(v));
    if(!preserved&&C.advisor.check(o).some(w=>w.severity==='hard'))fail('hard concept conflict',o,'');
    if(o.condition.items.some(x=>/blood/.test(x.type)))fail('automatic blood',o,'');
    if(preserved){if(o.garment.subtype!==preserved.garment.subtype||o.palette.primary!==preserved.palette.primary||o.output.customTags!==preserved.output.customTags)fail('preserve overwrote existing',o,'');}
    if(selection.secondary.motifId===selection.motifId&&candidate.motifContributions.filter(x=>x.motifId===selection.motifId).length>1)fail('same motif applied twice',o,'');
  }
  cover('garment',o.garment.subtype);cover('garmentCategory',o.garment.category);for(const x of o.condition.items)cover('condition',x.type);for(const x of o.styling.items)cover('styling',x);C.schema.activeSpecialParts(o).forEach(x=>cover('specialPart',x.slot.id));
  const preset=D.presentation.presets[Math.floor(rendered/3)%D.presentation.presets.length];o.presentation.preset=preset.id;o.presentation.seat=pick(D.presentation.seats).id;o.presentation.poseMood=pick(D.presentation.poseMoods).id;o.presentation.background=pick(D.presentation.backgrounds).id;
  o.presentation.subject=rendered%6===0?null:D.presentation.subjects[(rendered-1)%5].id;
  o.presentation.rendering={enabled:rendered%4!==0,paint:pick(D.presentation.paints).id,finish:pick(D.presentation.finishes).id,line:pick(D.presentation.lines).id};const scope=['outfit','pose','all'][Math.floor(rendered/25)%3];C.presentation.setScope(o,scope);
  cover('scope',scope);cover('subject',o.presentation.subject||'none');cover('presentation',preset.id);
  const custom='(EXACT_Tag:1.25), Keep-CaSe / 日本語';o.output.customTags=custom;const blocks=C.generator.blocks(o);
  if(scope==='outfit'&&(blocks.presentation.short.length||blocks.background.short.length||blocks.rendering.short.length))fail('scope leak',o,'');
  if(scope==='pose'&&(blocks.background.short.length||blocks.rendering.short.length))fail('pose scope leak',o,'');
  if(o.presentation.subject===null&&/\b(?:1girl|1boy|man|woman)\b/.test(blocks.presentation.short.join(' ')))fail('inferred gender',o,'');
  for(const mode of ['short','detailed']){
    const text=C.generator[mode](o);if(!text.endsWith(custom)||o.output.customTags!==custom)fail('customTags mutation',o,text);
    let body=text.slice(0,-custom.length);for(const re of bad)if(re.test(body))fail(String(re),o,text);
    if(o.garment.category==='merfolk'){body=body.replace(/no human legs|no feet|replacing separate human legs and feet/g,'');if(/\b(?:trousers|pants|shorts|skirt|stockings|socks|shoes|boots|heels|barefoot|legs|feet|knee|ankle)\b/i.test(body))fail('merfolk lower-body leak',o,text);}
    if(/sleeveless/.test(body.replace(/sleeveless inner shirt/g,''))&&/sleeves (rolled|pushed) up/.test(body))fail('inapplicable styling',o,text);
    if(selection){
      const paletteNames=Object.values(o.palette).map(id=>U.byId(D.colors,id)?.promptEn).filter(Boolean);
      for(const id of new Set(Object.values(o.palette).filter(Boolean))){const color=U.byId(D.colors,id);if(color&&namedOccurrences(blocks.identity[mode].concat(blocks.palette[mode]).join(' '),color.promptEn,paletteNames)>1)fail('duplicate palette',o,text);}
      for(const id of new Set([o.materials.primary,o.materials.secondary,o.materials.trim].filter(Boolean))){const mat=U.byId(D.materials,id);if(mat&&blocks.materials[mode].join(' ').toLowerCase().split(mat.shortPrompt.toLowerCase()).length>2)fail('duplicate material',o,text);}
      const m=U.byId(F.motifs,selection.secondary.motifId);if(m&&blocks.conceptInspiration[mode].filter(x=>x===m.shortPrompt).length>1)fail('secondary repeated',o,text);
    }
  }
  rendered++;if(rendered%25000===0)console.log('Audited '+rendered+' cases; findings '+failures);
}
const report={seed:'0x5e2026',outfitCases:rendered,generatedTexts:rendered*2,batches:batch,rejectedRequests:rejected,failures,reasons,diversity,coverage,examples};
if(outfile)fs.writeFileSync(outfile,JSON.stringify(report,null,2));console.log(JSON.stringify({outfitCases:rendered,generatedTexts:rendered*2,failures,reasons,rejected,diversity:{...diversity,exceptions:diversity.exceptions.length},coverage:Object.fromEntries(Object.entries(coverage).map(([k,v])=>[k,Object.keys(v).length])),examples:examples.slice(0,3).map(x=>({index:x.index,reason:x.reason,text:x.text}))},null,2));process.exitCode=failures?1:0;
