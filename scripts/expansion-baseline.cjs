/* Captures byte-exact prompt output for every existing preset and a seeded
 * sample of random legacy outfits, so later expansion work can prove that
 * existing designs still generate identical English. Node only. */
const fs=require('fs'),path=require('path'),{load,root}=require('./test.cjs');
const C=load(),D=C.data,S=C.schema,G=C.generator;
function rng(seed){return function(){seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};}
function pick(r,list){return list[Math.floor(r()*list.length)];}
const presets=D.presets.map(p=>{const o=S.applyPatch(S.createOutfit(),p.patch);o.id='fixed';o.createdAt=o.updatedAt='2026-01-01T00:00:00.000Z';return {id:p.id,outfit:o,short:G.short(o),detailed:G.detailed(o)};});
const r=rng(20261030),random=[];
for(let i=0;i<400;i++){const g=pick(r,D.garments),cat=D.garmentCategories.find(c=>c.id===g.category),parts={};
 cat.slots.forEach(id=>{const s=D.partSlots.find(x=>x.id===id);if(!s||!s.options||r()<0.55)return;const kind=S.slotKind(s);if(kind==='single')parts[id]=pick(r,s.options).id;else if(kind==='multi')parts[id]=[{id:pick(r,s.options).id,layer:'main'}];});
 const o=S.normalize({id:'r'+i,garment:{category:g.category,subtype:g.id},parts,silhouette:{fit:pick(r,D.silhouette.fit).id},materials:{primary:pick(r,D.materials.filter(m=>m.category==='material')).id},palette:{primary:pick(r,D.colors).id,secondary:r()<0.5?pick(r,D.colors).id:null},decorations:{density:Math.floor(r()*4),items:r()<0.4?[{type:pick(r,D.decorations).id,placements:[pick(r,D.decorationPlacements).id],role:'support',size:'medium',quantity:'few'}]:[]}});
 o.createdAt=o.updatedAt='2026-01-01T00:00:00.000Z';random.push({outfit:o,short:G.short(o),detailed:G.detailed(o)});}
const out={capturedFrom:process.argv[3]||'working tree',schema:C.SCHEMA_VERSION,presets,random};
const file=process.argv[2]||path.join(root,'verification/expansion-baseline.json');
if(process.argv[2]==='--compare'){const base=JSON.parse(fs.readFileSync(path.join(root,'verification/expansion-baseline.json'),'utf8'));let diff=0;
 base.presets.forEach(b=>{const p=D.presets.find(x=>x.id===b.id);if(!p){console.error('missing preset',b.id);diff++;return;}const o=S.normalize(b.outfit);if(G.short(o)!==b.short||G.detailed(o)!==b.detailed){console.error('preset changed',b.id);diff++;}
   const re=S.applyPatch(S.createOutfit(),p.patch);if(G.short(re)!==b.short){console.error('preset patch output changed',b.id);diff++;}});
 base.random.forEach((b,i)=>{const o=S.normalize(b.outfit);if(G.short(o)!==b.short||G.detailed(o)!==b.detailed){console.error('random changed',i,b.outfit.garment.subtype);diff++;}});
 console.log(JSON.stringify({presets:base.presets.length,random:base.random.length,changed:diff}));process.exitCode=diff?1:0;}
else{fs.writeFileSync(file,JSON.stringify(out));console.log('presets',presets.length,'random',random.length,'->',file);}
