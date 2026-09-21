/* Count selectable records by axis, excluding group headings, rules and filters. */
const fs=require('node:fs');const {load}=require('./test.cjs');
function countData(D) {
const arrays=['colors','colorSchemes','worldviews','eras','occasions','seasons','roles','presentationFocus','poseAssist','compositionAssist','styles','wearRoles','layers','garmentCategories','garments','partLayers','materials','transparency','surfaces','thickness','patterns','decorationDensity','decorationPlacements','decorationRoles','decorationSizes','decorationQuantities','decorations','conditionSeverities','conditionExtents','conditionPlacements','conditions','styling','motifs','attributeIntensities','attributes','presets'];
const counts={};for(const k of arrays)counts[k]=(D[k]||[]).length;
for(const [k,v]of Object.entries(D.silhouette))counts['silhouette.'+k]=v.length;
for(const slot of D.partSlots){if(slot.options)counts['parts.'+slot.id]=slot.options.length;else for(const axis of slot.axes)counts['parts.'+slot.id+'.'+axis.key]=axis.options.length;}
for(const slot of D.specialParts.slots)for(const axis of slot.axes)counts['specialParts.'+slot.id+'.'+axis.key]=axis.options.length;
for(const k of ['decorativeChains','restraintChains','floating','magical'])counts['specialParts.'+k]=D.specialParts[k].length;
const total=Object.values(counts).reduce((a,b)=>a+b,0);
return {total,counts};
}
module.exports={countData};
if(require.main===module) {
const current=countData(load().data), baseline=require('./baseline-counts.json');
const result={scope:'Selectable data records, counted independently per axis. Excludes group headings, filter metadata, conflict rules, quality-tag constants and boolean output switches.',total:current.total,addedInPhase5C:current.total-baseline.total,baselineTotal:baseline.total,baselineCommit:baseline.commit,counts:current.counts};
if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
}
