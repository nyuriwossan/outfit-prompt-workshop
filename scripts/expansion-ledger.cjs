/* Builds the machine-readable ledgers for the costume expansion and validates every
 * reference against the loaded app data. Research files are read, never modified.
 *   docs/outfit-expansion/normalized-candidates.json  (172 candidates)
 *   docs/outfit-expansion/gacha-174-ledger.json       (174 gacha outfits)
 *   docs/outfit-expansion/LEDGER.md                   (summary)
 * Exit code is non-zero when a candidate/gacha row is missing or a reference is unknown. */
const fs=require('fs'),path=require('path'),{load,root}=require('./test.cjs'),{parseCSV}=require('./build-recipe-presets.cjs');
const C=load(),D=C.data,U=C.util,R=p=>path.join(root,'docs/outfit-expansion',p);
const cand=JSON.parse(fs.readFileSync(R('research/new_outfit_candidates.json'),'utf8')).candidates;
const candCsv=parseCSV(fs.readFileSync(R('research/new_outfit_candidates.csv'),'utf8'));
const gacha=parseCSV(fs.readFileSync(R('research/bishounen_outfit_comparison.csv'),'utf8'));
const decisions=JSON.parse(fs.readFileSync(R('candidate-decisions.json'),'utf8')),gachaCD=JSON.parse(fs.readFileSync(R('gacha-cd-decisions.json'),'utf8'));
const errors=[];
/* every known ID, by kind */
const known=new Map();function add(kind,id){if(!known.has(id))known.set(id,new Set());known.get(id).add(kind);}
D.garments.forEach(x=>add('garment',x.id));D.presets.forEach(x=>add('preset',x.id));D.materials.forEach(x=>add('material',x.id));D.decorations.forEach(x=>add('decoration',x.id));D.patterns.forEach(x=>add('pattern',x.id));D.motifs.forEach(x=>add('motif',x.id));
(D.conceptFashion.motifs||[]).forEach(x=>add('concept_motif',x.id));D.partSlots.forEach(s=>{add('slot',s.id);(s.options||[]).forEach(o=>add('part_option',o.id));(s.axes||[]).forEach(a=>a.options.forEach(o=>add('part_option',o.id)));});
D.specialParts.slots.forEach(s=>s.axes.forEach(a=>a.options.forEach(o=>add('special_part',o.id))));
[['worldview',D.worldviews],['occasion',D.occasions],['role',D.roles],['style',D.styles],['era',D.eras]].forEach(([k,l])=>l.forEach(x=>add(k,x.id)));
function ref(r){const [k,v]=r.split(':');const U2=U;
  if(k==='g')return !!U2.byId(D.garments,v);if(k==='p')return !!U2.byId(D.presets,v);if(k==='d')return !!U2.byId(D.decorations,v);if(k==='m')return !!U2.byId(D.materials,v);
  if(k==='mt')return !!U2.byId(D.motifs,v);if(k==='pt')return !!U2.byId(D.patterns,v);if(k==='c')return !!U2.byId(U2.byId(D.partSlots,'creature_motif').options,v);
  if(k==='o'){const [s,o]=v.split('.');const sl=U2.byId(D.partSlots,s);return !!(sl&&U2.byId(sl.options||[],o));}return false;}
function priority(raw){const m=/^P([0-3])$/.exec(raw);if(m)return {raw,scale:'P0-P3',tier:'P'+m[1],comparableRank:+m[1]};if(raw==='high'||raw==='medium')return {raw,scale:'high/medium',tier:raw,comparableRank:null,note:'P0-P3と別尺度。換算せず needs_review'};return {raw,scale:'unknown',tier:'needs_review',comparableRank:null};}
function target(t){if(t&&typeof t==='object')return {kind:'structured_recipe',scope:t.scope||null,reuseExistingIds:t.reuse_existing_ids||[],newSchema:t.new_schema||[],raw:t};
  if(typeof t!=='string')return {kind:'unknown',raw:t};
  if(['basic_garment','new_base_required','existing_base_sufficient','preset','part','special_feature'].includes(t))return {kind:t,raw:t};
  let m;if((m=/^新規garment category候補[:：]\s*([a-z_]+)/.exec(t)))return {kind:'new_category_candidate',category:m[1],raw:t};
  if((m=/^新規garment[:：]\s*([a-z_]+)/.exec(t)))return {kind:'new_garment_text',category:m[1],raw:t};
  if(/^新規presetのみ/.test(t))return {kind:'preset',raw:t};return {kind:'unknown',raw:t};}
const STATUS_JA={implemented:'実装',merged:'実装（他候補と統合）',existing_alternative:'既存で代替',deferred:'保留・未実装'};
if(cand.length!==172)errors.push('candidate count '+cand.length);
const csvIds=new Set(candCsv.map(r=>r.provisional_id));cand.forEach(c=>{if(!csvIds.has(c.provisional_id))errors.push('csv missing '+c.provisional_id);});if(csvIds.size!==172)errors.push('csv ids '+csvIds.size);
const normalized=cand.map(c=>{
  const t=target(c.implementation_target),idsToCheck=[...(c.similar_existing_ids||[]),...(t.reuseExistingIds||[])];
  const resolved=[],unresolved=[];idsToCheck.forEach(id=>{(known.has(id)?resolved:unresolved).push(known.has(id)?{id,kinds:[...known.get(id)]}:id);});
  const d=decisions[c.provisional_id];if(!d)errors.push('no decision '+c.provisional_id);
  const badRefs=(d?d.refs:[]).filter(r=>!ref(r));badRefs.forEach(r=>errors.push('unknown ref '+c.provisional_id+' '+r));
  const conflict=(c.existing_reproducibility==='A'||c.existing_reproducibility==='B')&&['basic_garment','new_base_required','new_garment_text'].includes(t.kind);
  return {provisionalId:c.provisional_id,nameJa:c.japanese_name,category:c.category,existingReproducibility:c.existing_reproducibility,priority:priority(c.priority),implementationTarget:t,
    idCheck:{resolved,unresolved},reproducibilityTargetConflict:conflict,
    finalStatus:d?d.status:'needs_review',finalStatusJa:d?STATUS_JA[d.status]:'要追加検証',implementedRefs:d?d.refs:[],reasonJa:d?d.reasonJa:''};});
/* gacha 174 */
if(gacha.length!==174)errors.push('gacha count '+gacha.length);
const gl=gacha.map(r=>{const w=JSON.parse(r.workshop_equivalent_ids||'{}');let status,refs=[];
  if(r.classification==='A'){status='existing';refs=[...(w.garment_ids||[]).map(x=>'g:'+x),...(w.preset_ids||[]).map(x=>'p:'+x)];}
  else if(r.classification==='B'){if((w.preset_ids||[]).length){status='existing_preset_with_alias';refs=w.preset_ids.map(x=>'p:'+x);}else{status='recipe_preset';refs=['p:recipe_'+r.gacha_id];}}
  else{const d=gachaCD[r.gacha_id];if(!d){errors.push('no gacha decision '+r.gacha_id);status='needs_review';}else{status=d.status;refs=d.refs;}}
  refs.filter(x=>!ref(x)).forEach(x=>errors.push('unknown gacha ref '+r.gacha_id+' '+x));
  return {gachaId:r.gacha_id,nameJa:r.gacha_name_ja,gachaCategory:r.gacha_category,classification:r.classification,status,refs};});
const count=(list,k)=>list.reduce((m,x)=>(m[x[k]]=(m[x[k]]||0)+1,m),{});
const summary={candidates:{total:normalized.length,byFinalStatus:count(normalized,'finalStatus'),byReproducibility:count(normalized,'existingReproducibility'),targetKinds:normalized.reduce((m,x)=>(m[x.implementationTarget.kind]=(m[x.implementationTarget.kind]||0)+1,m),{}),priorityScales:normalized.reduce((m,x)=>(m[x.priority.scale]=(m[x.priority.scale]||0)+1,m),{}),reproducibilityTargetConflicts:normalized.filter(x=>x.reproducibilityTargetConflict).length,unresolvedIdReferences:[...new Set(normalized.flatMap(x=>x.idCheck.unresolved))]},
  gacha:{total:gl.length,byClassification:count(gl,'classification'),byStatus:count(gl,'status')},errors};
fs.writeFileSync(R('normalized-candidates.json'),JSON.stringify({generatedBy:'scripts/expansion-ledger.cjs',sourceCommitOfResearch:'185380d5ff087a92d7452c7c9a73f4c193adc395',summary:summary.candidates,candidates:normalized},null,1));
fs.writeFileSync(R('gacha-174-ledger.json'),JSON.stringify({generatedBy:'scripts/expansion-ledger.cjs',note:'ガチャ174件のA/B/C/D判定は、新規172候補の existing_reproducibility とは別集合・別集計。',summary:summary.gacha,rows:gl},null,1));
const md=['# 衣装拡張の台帳（自動生成）','','`node scripts/expansion-ledger.cjs` が研究資料（読取専用）と現行コードを照合して生成します。','','## 新規候補172件','','| 最終区分 | 件数 |','|---|---:|',...Object.entries(summary.candidates.byFinalStatus).map(([k,v])=>`| ${STATUS_JA[k]||k}（${k}） | ${v} |`),'',
 `- 優先度は尺度が2種類混在（${Object.entries(summary.candidates.priorityScales).map(([k,v])=>k+' '+v+'件').join('／')}）。high/medium は P0〜P3 へ換算せず needs_review として保持。`,
 `- implementation_target の種別：${Object.entries(summary.candidates.targetKinds).map(([k,v])=>k+' '+v).join('、')}`,
 `- 再現性A/Bなのに基本衣装追加を指示していた矛盾：${summary.candidates.reproducibilityTargetConflicts}件（コード上の構造差で最終区分を判断）`,
 `- 現行コードに存在しない参照ID（自動採用せず記録）：${summary.candidates.unresolvedIdReferences.length}件 ${summary.candidates.unresolvedIdReferences.join(', ')}`,'',
 '## ガチャ174件（別集合）','','| 判定 | 件数 |','|---|---:|',...Object.entries(summary.gacha.byClassification).map(([k,v])=>`| ${k} | ${v} |`),'','| 対応状況 | 件数 |','|---|---:|',...Object.entries(summary.gacha.byStatus).map(([k,v])=>`| ${k} | ${v} |`),'',
 '## 候補ごとの最終区分','','| ID | 名前 | 再現性 | 最終区分 | 実装先・理由 |','|---|---|---|---|---|',...normalized.map(x=>`| ${x.provisionalId} | ${x.nameJa} | ${x.existingReproducibility} | ${x.finalStatusJa} | ${x.implementedRefs.join(' ')} ${x.reasonJa} |`),'',
 '## 検証エラー','',errors.length?errors.map(e=>'- '+e).join('\n'):'なし'].join('\n');
fs.writeFileSync(R('LEDGER.md'),md+'\n');
console.log(JSON.stringify(summary,null,1));process.exitCode=errors.length?1:0;
