/* Deterministic, stratified prompt audit; no browser or packages required. */
const fs=require('node:fs');
const {load}=require('./test.cjs');
const C=load(), D=C.data, U=C.util, rng=C.gacha.makeRng({seed:0x5c2026});
const total=Number(process.argv[2]||100000), outfile=process.argv[3];
const pick=a=>a[Math.floor(rng()*a.length)];
const failures=[], reasons={}, coverage={categories:{},styles:{},styling:0,condition:0,garments:{},options:{}};
let failureCount=0;
function record(reason,text,o,index) {failureCount++; reasons[reason]=(reasons[reason]||0)+1;if(failures.length<25) failures.push({index,reason,text,outfit:o});}
const bad=[
 /\b(undefined|null)\b/i, /\bwith\s+with\b/i, /,,|\.\.|\.\s*,/,
 /\b(?:a|an)\s+(?:sleeves|trousers|board shorts)\b/i, /\bone sleeves\b/i,
 /\ba pair of a\b/i, /-inspired-inspired/i,
 /\bwith (?:rolled up|half-tucked|open|barefoot|wet|dirt|two-piece)(?=[,.]|$)/i,
 /\btorn open\b/i, /\b(?:Nike|Adidas|Gucci|Prada|Chanel|Louis Vuitton|NYPD|LAPD|FBI)\b/i,
 /\b(?:female|male|woman|man|girl|boy)\b/i
];
for(let i=0;i<Math.ceil(total/2);i++) {
 const cat=D.garmentCategories[i%D.garmentCategories.length];
 const g=pick(D.garments.filter(x=>x.category===cat.id));
 const style=D.styles[Math.floor(i/D.garmentCategories.length)%D.styles.length];
 const o=C.schema.normalize({garment:{category:cat.id,subtype:g.id},concept:{primaryStyle:style.id},
   materials:{primary:pick(D.materials).id},palette:{primary:pick(D.colors).id}});
 coverage.categories[cat.id]=(coverage.categories[cat.id]||0)+1;
 coverage.styles[style.id]=(coverage.styles[style.id]||0)+1;coverage.garments[g.id]=(coverage.garments[g.id]||0)+1;
 function used(key,id) {coverage.options[key+':'+id]=(coverage.options[key+':'+id]||0)+1;return id;}
 for(const key of Object.keys(D.silhouette)) if(rng()<0.65) o.silhouette[key]=used('silhouette.'+key,pick(D.silhouette[key]).id);
 for(const id of cat.slots) {
   const slot=U.byId(D.partSlots,id);
   if(!slot.options||rng()>0.5)continue;
   const opts=slot.options.filter(opt=>C.partOptionAllowed(o,id,opt)); if(!opts.length)continue;
   const opt=pick(opts);used('parts.'+id,opt.id);
   o.parts[id]=slot.multi?[{id:opt.id,layer:'main'}]:opt.id;
 }
 // Vary by category cycle, avoiding a shared divisor that would exclude robes/swimwear.
 if(Math.floor(i/D.garmentCategories.length)%3!==0) {
   const available=C.styling.available(o); const a=available.length?pick(available):null;
   if(a) {o.styling.items=[used('styling',a.id)]; if(i%2===0){const rest=available.filter(x=>x.id!==a.id&&C.styling.compatible(x,o.styling.items));if(rest.length)o.styling.items.push(used('styling',pick(rest).id));}}
   coverage.styling++;
 }
 if(i%4!==0) {
   const def=pick(D.conditions), pl=pick(D.conditionPlacements);used('condition',def.id);
   o.condition.items=[{type:def.id,severity:pick(D.conditionSeverities).id,extent:pick(D.conditionExtents).id,placements:[pl.id]}];coverage.condition++;
 }
 if(i%2===0) {
   const d=pick(D.decorations); used('decorations',d.id);
   o.decorations.items=[{type:d.id,placements:[pick(D.decorationPlacements).id],size:pick(D.decorationSizes).id,quantity:pick(D.decorationQuantities).id,role:'support'}];
 }
 const custom='(EXACT_Tag:1.25), Keep-CaSe / 日本語';o.output.customTags=custom;
 const conditionText=C.generator.blocks(o).condition.detailed.join(' ');
 const classes=U.byId(D.materials,o.materials.primary).matClasses||[];
 if(classes.some(c=>c==='metallic'||c==='rigid')&&/\b(?:torn|frayed|wrinkled)\b/.test(conditionText))record('metal condition language',conditionText,o,i);
 if(/\b(?:nude|naked|breasts|genitals|gore|wounded|bleeding)\b/.test(conditionText))record('condition adds body/injury',conditionText,o,i);
 for(const [mode,text]of [['short',C.generator.short(o)],['detailed',C.generator.detailed(o)]]) {
   if(i*2+(mode==='detailed'?1:0)>=total)break;
   if(!text.endsWith(custom))record('customTags changed',text,o,i);
   let body=text.slice(0,text.length-custom.length).replace(/[,\s]+$/,'');
   for(const re of bad)if(re.test(body))record(String(re),text,o,i);
   if(/\bsleeveless\b/.test(body.replace(/sleeveless inner shirt/g,''))&&/sleeves (rolled|pushed) up/.test(body))record('sleeveless styling',text,o,i);
   if(/\bcollarless\b/.test(body)&&/collar (loosened|turned up)/.test(body))record('collarless styling',text,o,i);
   if(o.silhouette.symmetry==='symmetrical'&&/\bsymmetrical\b/.test(body)&&/asymmetric|one-sleeve|one-shoulder|(?:with|and|,) one sleeve/.test(body))record('symmetry conflict',text,o,i);
   if(cat.id==='merfolk') {
     body=body.replace(/no human legs|no feet|replacing separate human legs and feet/g,'');
     if(/\b(?:trousers|pants|shorts|skirt|stockings|socks|shoes|boots|heels|barefoot|legs|feet|knee|ankle)\b/i.test(body))record('merfolk lower-body leak',text,o,i);
   }
 }
}
const report={seed:'0x5c2026',generatedTexts:total,failures:failureCount,reasons,coverage,examples:failures};
if(outfile)fs.writeFileSync(outfile,JSON.stringify(report,null,2));
console.log(JSON.stringify({generatedTexts:total,failures:failureCount,reasons,categories:Object.keys(coverage.categories).length,styles:Object.keys(coverage.styles).length,garments:Object.keys(coverage.garments).length,options:Object.keys(coverage.options).length,examples:failures.slice(0,4).map(({reason,text,index})=>({reason,text,index}))},null,2));
process.exitCode=failureCount?1:0;
