/* Randomized English-quality audit for the costume expansion (Node only).
 * usage: node scripts/audit-costume-expansion.cjs [cases] [out.json] */
const fs=require('fs'),{load}=require('./test.cjs');const C=load(),D=C.data,S=C.schema,G=C.generator,A=C.advisor;
const N=+process.argv[2]||20000,out=process.argv[3];
let seed=20261030;const r=()=>(seed=(seed*1664525+1013904223)>>>0)/4294967296,pick=l=>l[Math.floor(r()*l.length)];
const NEW=D.garments.filter(g=>g.expansion==='costume-2026-10'),problems=[],counts={};
const BAD=[[/undefined|null|\[object|\{c\}|\{f\}/,'placeholder'],[/\b(a|an) (a|an|the)\b/i,'double article'],[/\s,|,\s*,|\.\s*\.|\s{2,}/,'punctuation'],[/\b(\w+) \1\b/i,'repeated word'],[/\b(adult|bust)\b/i,'forbidden word'],[/\ban (?:[bcdfgjklmnpqrstvwxz])/i,'an before consonant'],[/\ba (?!one|uni|use|eu)(?:[aeio])/i,'a before vowel']];
function check(o,t,mode){BAD.forEach(([re,k])=>{const m=t.match(re);if(m&&!(k==='repeated word'&&/^(that|had)$/i.test(m[1]))){counts[k]=(counts[k]||0)+1;if(problems.length<60)problems.push({k,mode,g:o.garment.subtype,t});}});
 if(o.garment.category==='full_mascot'){if(!/no human face (is )?visible/.test(t)){counts.mascotFace=(counts.mascotFace||0)+1;problems.length<60&&problems.push({k:'mascot face',t});}if(/open-face|face-revealing/.test(t)){counts.mascotOpen=(counts.mascotOpen||0)+1;problems.length<60&&problems.push({k:'mascot open',t});}}
 if(o.garment.category==='kigurumi'&&/no human face|mascot head/.test(t)){counts.kigFace=(counts.kigFace||0)+1;problems.length<60&&problems.push({k:'kigurumi face',t});}}
let hard=0;
for(let i=0;i<N;i++){const g=pick(NEW),cat=D.garmentCategories.find(c=>c.id===g.category),parts={};
 cat.slots.forEach(id=>{const s=D.partSlots.find(x=>x.id===id);if(!s||r()<0.4)return;const k=S.slotKind(s);if(k==='single')parts[id]=pick(s.options).id;else if(k==='multi')parts[id]=[{id:pick(s.options).id,layer:'main'}];else{const v={};s.axes.forEach(a=>{v[a.key]=pick(a.options).id;});parts[id]=v;}});
 const o=S.normalize({garment:{category:g.category,subtype:g.id},parts,silhouette:{fit:pick(D.silhouette.fit).id},materials:{primary:pick(D.materials.filter(m=>m.category==='material')).id,patterns:r()<0.3?[pick(D.patterns).id]:[]},palette:{primary:pick(D.colors).id,secondary:r()<0.5?pick(D.colors).id:null,accent:r()<0.3?pick(D.colors).id:null},concept:{primaryThemeMotif:r()<0.3?pick(D.motifs).id:null},decorations:{density:Math.floor(r()*5),items:r()<0.5?[{type:pick(D.decorations).id,placements:[pick(D.decorationPlacements).id],role:'support',size:'medium',quantity:pick(['single','few','many'])}]:[]}});
 check(o,G.short(o),'short');check(o,G.detailed(o),'detailed');if(i%10===0&&A.check(o).some(x=>x.severity==='hard'))hard++;}
const report={cases:N,texts:N*2,newGarments:NEW.length,problemCounts:counts,samples:problems,hardInSampledTenth:hard};
if(out)fs.writeFileSync(out,JSON.stringify(report,null,1));console.log(JSON.stringify({cases:N,problemCounts:counts,hardInSampledTenth:hard}));console.log(problems.slice(0,12).map(p=>p.k+': '+p.t).join('\n'));
