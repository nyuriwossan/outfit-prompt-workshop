/* Explicit mappings, 5,000 new-topic candidate sets, and 100,002 generated texts. */
const fs=require('fs'),{load}=require('./test.cjs'),C=load(),D=C.data,F=D.conceptFashion,E=C.conceptFashion;
const report={newMotifs:F.inspired.ids.length,mappings:[],diversity:{sets:0,twoAxes:0,limited:0,identicalPairs:0,colorOnlyPairs:0,exceptions:[]},texts:0,topics:{},failures:[],badTextExamples:[],structuredWordRepetitions:[]};
function fail(message){if(report.failures.length<100)report.failures.push(message);}
for(const id of F.inspired.ids){const p=F.mappings.motifs[id],axes=['colors','materials','decorations','patterns','parts','silhouette'].filter(k=>p[k]&&Object.keys(p[k]).length);report.mappings.push({id,axes});if(axes.length<2)fail('single-axis '+id);}
const bad=[/\b(?:undefined|null|NaN|monochrome|grayscale)\b/i,/inspired(?:-|\s+)inspired/i,/,,|\.\.|\.\s*,/,/\b(with|and|of|the|a|an)\s+\1\b/i,/searchKeywords|featured|randomProfiles|[\u3040-\u30ff\u3400-\u9fff]/];
let sets=0;
while(report.texts<100000){
  const n=sets++,id=F.inspired.ids[n%F.inspired.ids.length],m=C.util.byId(F.motifs,id),secondary=F.motifs[(n*7)%F.motifs.length];
  let selection={categoryId:m.category,motifId:id};
  if(n%3===0)selection={...selection,secondary:{categoryId:secondary.category,motifId:secondary.id},blendMode:F.blendModes[n%4].id};
  if(n%5===0)selection.baseId=F.bases[n%F.bases.length].id;
  if(n%7===0)selection.designLanguages=[F.designLanguages[n%F.designLanguages.length].id];
  if(n%11===0)selection.exclusions=[F.exclusions[n%F.exclusions.length].id];
  if(n%13===0)selection.interpretationMode=F.interpretationModes[n%F.interpretationModes.length].id;
  const original=C.schema.normalize({garment:{category:n%2?'dress':'merfolk',subtype:n%2?'cocktail_dress':'sea_silk_mermaid_outfit'},palette:{primary:'jet_black'}}),mode=n%17===0?'preserve':'new',cs=E.buildCandidates(selection,{seed:n+0x5f,mode,currentOutfit:original});
  if(!cs.length){if(!(selection.exclusions||[]).length)fail('unexpected empty '+id);continue;}
  report.topics[id]=(report.topics[id]||0)+1;
  if(report.diversity.sets<5000){const d=E.diversity(cs);report.diversity.sets++;if(d.count>=2)report.diversity.twoAxes++;else{report.diversity.limited++;report.diversity.exceptions.push({id,seed:n+0x5f,mode,reason:d.exception});if(!d.exception)fail('unexplained limited diversity '+id);}for(let j=0;j<3;j++)for(let k=j+1;k<3;k++){const p=E.diversity([cs[j],cs[k]]);if(!p.count){report.diversity.identicalPairs++;if(!d.exception)fail('unexplained identical '+id);}else if(!p.structural){report.diversity.colorOnlyPairs++;if(!d.exception)fail('unexplained nonstructural '+id);}}}
  cs.forEach(c=>{const o=c.outfit;o.palette.scheme='monochrome';for(const format of ['short','detailed']){const text=C.generator[format](o);report.texts++;for(const re of bad)if(re.test(text)){fail(id+' '+format+' '+re);if(report.badTextExamples.length<10)report.badTextExamples.push({id,format,text});}if(o.garment.category==='merfolk'&&/\b(trousers|pants|skirt|boots|shoes|feet|legs)\b/i.test(text.replace(/no human legs|no feet|replacing separate human legs and feet/g,'')))fail('merfolk '+id);for(const motifId of [id,selection.secondary?.motifId].filter(Boolean)){const re=new RegExp('\\b'+motifId.replace(/_/g,' ')+'\\b','g');if((text.toLowerCase().replace(/-/g,' ').match(re)||[]).length>=3){
          // A color name and a real decoration are not repeated motif fallback text.
          var body=text.toLowerCase(),phrases=Object.values(o.palette).map(id=>C.util.byId(D.colors,id)?.promptEn).concat(o.decorations.items.map(d=>C.util.byId(D.decorations,d.type)?.shortPrompt)).filter(Boolean).sort((a,b)=>b.length-a.length);
          phrases.forEach(phrase=>{body=body.replace(phrase.toLowerCase(),' STRUCTURED_VALUE ');});
          if((body.replace(/-/g,' ').match(re)||[]).length>=3)fail('motif repeated 3 times '+motifId+' '+format);
          else report.structuredWordRepetitions.push({seed:n+0x5f,motifId,format,phrases,text,reason:'Distinct selected color names and decoration; not repeated inspiration text.'});
        }}}});
  if(sets%2500===0)console.log(report.texts+' texts; '+report.diversity.sets+' diversity sets; '+report.failures.length+' findings');
}
report.multiAxisPercent=100*report.mappings.filter(m=>m.axes.length>=2).length/report.newMotifs;
fs.writeFileSync(process.argv[2]||'verification/phase5f-audit.json',JSON.stringify(report,null,2));console.log(JSON.stringify({texts:report.texts,topics:Object.keys(report.topics).length,diversity:{...report.diversity,exceptions:report.diversity.exceptions.length},multiAxisPercent:report.multiAxisPercent,failures:report.failures},null,2));process.exitCode=report.failures.length?1:0;
