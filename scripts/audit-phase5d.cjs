/* 150,000 deterministic outfit cases, each rendered in short and detailed form. */
const fs=require('fs'),{load}=require('./test.cjs'),C=load(),D=C.data,F=D.conceptFashion,U=C.util;
const total=Number(process.argv[2]||150000),outfile=process.argv[3],rng=C.gacha.makeRng({seed:0x5d2026});
const pick=a=>a[Math.floor(rng()*a.length)],coverage={},examples=[],reasons={};let failures=0,conceptIndex=0,normalIndex=0;
const cover=(k,v)=>{coverage[k]??={};coverage[k][v]=(coverage[k][v]||0)+1;};
const fail=(why,o,text,i)=>{failures++;reasons[why]=(reasons[why]||0)+1;if(examples.length<20)examples.push({index:i,reason:why,text,outfit:o});};
const choices=F.motifs.map(m=>({categoryId:m.category,motifId:m.id,foodGroupId:m.groupId})).concat(F.attires.map(a=>({categoryId:'traditional',traditional:{attireId:a.id}})));
const bad=[/\b(?:undefined|null|NaN)\b/,/,,|\.\.|\.\s*,/,/\b(with|and|of|the|a|an)\s+\1\b/i,/inspired-inspired/i,/\bconcept concept\b/i,/\bstyle style\b/i,/\bwears a a\b/i,/\b(?:a|an) (?:trousers|shorts|sleeves)\b/i,/\ban (?:uniform|European)\b/i,/Art Nouveau Art-Nouveau/i,/\bgothic gothic\b/i];
for(let i=0;i<total;i++){
 let o,selection=null;
 if(i%3===0){
  cover('mode','normal');const n=normalIndex++,g=D.garments[n%D.garments.length],cat=U.byId(D.garmentCategories,g.category);
  o=C.schema.normalize({garment:{category:g.category,subtype:g.id},concept:{primaryStyle:pick(D.styles).id},palette:{primary:pick(D.colors).id},materials:{primary:pick(D.materials).id}});
  for(const k of Object.keys(D.silhouette))if(rng()<.4)o.silhouette[k]=pick(D.silhouette[k]).id;
  for(const id of cat.slots){const slot=U.byId(D.partSlots,id);if(!slot.options||rng()>.25)continue;const pool=slot.options.filter(x=>C.partOptionAllowed(o,id,x));if(pool.length)o.parts[id]=C.schema.normalizePartValue(slot,pick(pool).id);}
 }else{
  cover('mode','concept');const n=conceptIndex++,cycle=Math.floor(n/choices.length);selection=U.clone(choices[n%choices.length]);
  selection.baseId=F.bases[cycle%F.bases.length].id;selection.strengthId=F.strengths[cycle%5].id;selection.exposure=cycle%7===6?null:cycle%6;
  selection.directions=[F.directions[(n+cycle)%F.directions.length].id];
  if(cycle%3===1)selection.placements=['palette','materials','special','ornament'];
  if(cycle%3===2)selection.placements=['sleeves','neckline','hem','headpiece'];
  if(selection.categoryId==='food'){selection.foodApplications=[F.foodApplications[cycle%8].id];cover('foodApplication',selection.foodApplications[0]);cover('foodGroup',selection.foodGroupId);}
  if(selection.traditional){selection.traditional.treatmentId=F.treatments[cycle%6].id;cover('treatment',selection.traditional.treatmentId);cover('attire',selection.traditional.attireId);
   if(selection.traditional.attireId==='qipao'){selection.traditional.qipaoNecklineId=F.qipaoNecklines[cycle%4].id;selection.traditional.qipaoLengthId=F.qipaoLengths[Math.floor(cycle/4)%4].id;selection.traditional.qipaoSlitId=F.qipaoSlits[cycle%3].id;selection.traditional.qipaoDrapeId=F.qipaoDrapes[Math.floor(cycle/3)%3].id;for(const k of ['qipaoNecklineId','qipaoLengthId','qipaoSlitId','qipaoDrapeId'])cover(k,selection.traditional[k]);}
  }
  if(selection.motifId==='idol'){selection.idolStyleId=F.idolStyles[cycle%15].id;cover('idolStyle',selection.idolStyleId);}
  if(selection.motifId==='art_nouveau'){selection.artNouveauShapeId=F.artNouveauShapes[cycle%8].id;cover('artShape',selection.artNouveauShapeId);}
  cover('conceptCategory',selection.categoryId);cover('motif',selection.motifId||selection.traditional.attireId);
  const before=JSON.stringify(selection),cs=C.conceptFashion.buildCandidates(selection,{seed:n+100,count:3});
  if(before!==JSON.stringify(selection))fail('selection mutated',{},'',i);
  if(cs.length!==3){fail('missing candidates',{},JSON.stringify(selection),i);continue;}
  o=cs[n%cs.length].outfit;
  if(cs.some(c=>c.warnings.some(w=>w.severity==='hard')))fail('hard concept conflict',o,'',i);
 }
 cover('garmentCategory',o.garment.category);cover('garment',o.garment.subtype);
 const styleOptions=C.styling.available(o);if(styleOptions.length&&i%4!==0){const t=pick(styleOptions);o.styling.items=[t.id];cover('styling',t.id);}
 if(i%5!==0){const t=D.conditions[Math.floor(i/5)%D.conditions.length];o.condition.items=[{type:t.id,severity:pick(D.conditionSeverities).id,extent:pick(D.conditionExtents).id,placements:[]}];cover('condition',t.id);}
 if(!selection&&i%4===0){const slot=D.specialParts.slots[Math.floor(i/12)%4],type=C.schema.axisOf(slot,'type');o.specialParts[slot.id]={type:pick(type.options).id};}
 C.schema.activeSpecialParts(o).forEach(x=>cover('specialPart',x.slot.id));
 const preset=D.presentation.presets[Math.floor(i/3)%25];o.presentation.preset=preset.id;o.presentation.seat=pick(D.presentation.seats).id;o.presentation.poseMood=pick(D.presentation.poseMoods).id;o.presentation.background=D.presentation.backgrounds[Math.floor(i/9)%4].id;
 o.presentation.subject=i%6===0?null:D.presentation.subjects[(i-1)%5].id;o.presentation.rendering={enabled:i%4!==0,paint:pick(D.presentation.paints).id,finish:pick(D.presentation.finishes).id,line:pick(D.presentation.lines).id};
 const scope=['outfit','pose','all'][Math.floor(i/75)%3];C.presentation.setScope(o,scope);
 cover('scope',scope);cover('subject',o.presentation.subject||'none');cover('presentation',preset.id);cover('background',o.presentation.background);cover('rendering',String(o.presentation.rendering.enabled));
 const custom='(EXACT_Tag:1.25), Keep-CaSe / 日本語';o.output.customTags=custom;
 const b=C.generator.blocks(o);
 if(scope==='outfit'&&(b.presentation.short.length||b.background.short.length||b.rendering.short.length))fail('outfit scope leak',o,'',i);
 if(scope==='pose'&&(b.background.short.length||b.rendering.short.length))fail('pose scope leak',o,'',i);
 if(o.presentation.subject===null&&/\b(?:1girl|1boy|man|woman)\b/.test(b.presentation.short.join(' ')))fail('inferred subject',o,'',i);
 if(!preset.seated&&b.presentation.short.join(' ').includes(U.byId(D.presentation.seats,o.presentation.seat).shortPrompt))fail('seat during non-seated preset',o,'',i);
 const s=o.concept.inspiration;if(s.traditional.attireId&&(s.traditional.treatmentId===null||s.traditional.treatmentId==='traditional')&&o.parts.cutout)fail('traditional auto-cutout',o,'',i);
 if(o.garment.subtype==='hanbok'&&s.traditional.attireId==='hanbok'&&/frog closure|hanfu|qipao/.test(C.generator.detailed(o)))fail('unrelated traditional mixture',o,'',i);
 if(s.traditional.attireId==='qipao'&&s.traditional.qipaoSlitId==='none'&&/\bslit\b/.test(b.identity.detailed.join(' ')+b.parts.detailed.join(' ')))fail('qipao no-slit ignored',o,'',i);
 for(const mode of ['short','detailed']){
  const text=C.generator[mode](o);if(!text.endsWith(custom)||o.output.customTags!==custom)fail('customTags changed',o,text,i);
  let body=text.slice(0,-custom.length);for(const re of bad)if(re.test(body))fail(String(re),o,text,i);
  if(selection){
    // Inspect the structured color/material blocks, excluding deliberate decorated objects or conditions.
    const palette=b.identity[mode].concat(b.palette[mode]).join(' ').toLowerCase(),materials=b.materials[mode].join(' ').toLowerCase();
    for(const id of new Set(Object.values(o.palette).filter(Boolean))){const color=U.byId(D.colors,id);if(color&&palette.split(color.promptEn.toLowerCase()).length>2)fail('duplicate structured color',o,text,i);}
    for(const id of new Set([o.materials.primary,o.materials.secondary,o.materials.trim].filter(Boolean))){const mat=U.byId(D.materials,id);if(mat&&materials.split(mat.shortPrompt.toLowerCase()).length>2)fail('duplicate structured material',o,text,i);}
  }
  if(/sleeveless/.test(body.replace(/sleeveless inner shirt/g,''))&&/sleeves (rolled|pushed) up/.test(body))fail('inapplicable styling',o,text,i);
  if(o.garment.category==='merfolk'){body=body.replace(/no human legs|no feet|replacing separate human legs and feet/g,'');if(/\b(?:trousers|pants|shorts|skirt|stockings|socks|shoes|boots|heels|barefoot|legs|feet|knee|ankle)\b/i.test(body))fail('merfolk lower-body leak',o,text,i);}
  if(s.motifId==='art_nouveau'&&o.concept.primaryStyle==='art_nouveau'&&(body.match(/art[ -]nouveau/gi)||[]).length>1)fail('Art Nouveau repetition',o,text,i);
 }
 if((i+1)%25000===0)console.log('Audited '+(i+1)+' cases; findings '+failures);
}
const report={seed:'0x5d2026',outfitCases:total,generatedTexts:total*2,failures,reasons,coverage,examples};if(outfile)fs.writeFileSync(outfile,JSON.stringify(report,null,2));console.log(JSON.stringify({outfitCases:total,generatedTexts:total*2,failures,reasons,coverage:Object.fromEntries(Object.entries(coverage).map(([k,v])=>[k,Object.keys(v).length])),examples:examples.slice(0,3).map(x=>({index:x.index,reason:x.reason,text:x.text}))},null,2));process.exitCode=failures?1:0;
