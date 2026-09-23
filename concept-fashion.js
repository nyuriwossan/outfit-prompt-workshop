/* Concept selection -> ordinary Outfit. Preview is pure; adoption is explicit. */
(function(global){
  'use strict';
  var C=global.CPW,D=C.data,F=D.conceptFashion,U=C.util,S=C.schema;
  function known(list,id){return U.byId(list,id)?id:null;}
  function unique(list){return list.filter(function(x,i){return list.indexOf(x)===i;});}
  function many(list,ids,max){return (Array.isArray(ids)?ids:[]).filter(function(id,i,a){return known(list,id)&&a.indexOf(id)===i;}).slice(0,max);}
  function normalizeSelection(raw){
    var r=raw&&typeof raw==='object'?raw:{},t=r.traditional||{},s=S.emptyInspiration?S.emptyInspiration():{};
    var single={categoryId:'categories',motifId:'motifs',baseId:'bases',strengthId:'strengths',foodGroupId:'foodGroups',idolStyleId:'idolStyles',artNouveauShapeId:'artNouveauShapes'};
    Object.keys(single).forEach(function(k){s[k]=known(F[single[k]],r[k]);});
    s.customMotif=typeof r.customMotif==='string'?r.customMotif:'';
    s.directions=many(F.directions,r.directions,2);s.placements=many(F.placements,r.placements,4);s.foodApplications=many(F.foodApplications,r.foodApplications,8);
    s.exposure=Number.isInteger(r.exposure)&&r.exposure>=0&&r.exposure<=5?r.exposure:null;
    s.traditional={};
    var trad={regionId:'regions',attireId:'attires',treatmentId:'treatments',qipaoNecklineId:'qipaoNecklines',qipaoLengthId:'qipaoLengths',qipaoSlitId:'qipaoSlits',qipaoDrapeId:'qipaoDrapes'};
    Object.keys(trad).forEach(function(k){s.traditional[k]=known(F[trad[k]],t[k]);});
    var m=U.byId(F.motifs,s.motifId);
    if(m&&(m.category!==s.categoryId||(m.category==='food'&&s.foodGroupId&&m.groupId!==s.foodGroupId)))s.motifId=null;
    if(s.categoryId!=='food'){s.foodGroupId=null;s.foodApplications=[];}
    if(s.categoryId!=='traditional')Object.keys(s.traditional).forEach(function(k){s.traditional[k]=null;});
    var attire=U.byId(F.attires,s.traditional.attireId);
    if(attire&&s.traditional.regionId&&attire.regionId!==s.traditional.regionId)s.traditional.attireId=null;
    if(s.traditional.attireId!=='qipao')Object.keys(s.traditional).filter(function(k){return k.indexOf('qipao')===0;}).forEach(function(k){s.traditional[k]=null;});
    if(s.categoryId==='traditional'||s.motifId!=='idol'&&s.baseId!=='idol')s.idolStyleId=null;
    if(s.motifId!=='art_nouveau')s.artNouveauShapeId=null;
    return s;
  }
  function label(s){var m=U.byId(F.motifs,s.motifId)||U.byId(F.attires,s.traditional.attireId);return s.customMotif.trim()||(m&&m.labelJa)||'自由なコンセプト';}
  function buildCandidates(selection,options){
    var opts=options||{},s=normalizeSelection(selection),seed=Number(opts.seed==null?0x5d2026:opts.seed)>>>0,rng=C.gacha.makeRng({seed:seed});
    var preserve=opts.mode==='preserve'&&opts.currentOutfit,m=U.byId(F.motifs,s.motifId),a=U.byId(F.attires,s.traditional.attireId);
    var p=U.clone((a?F.mappings.traditional[a.id]:m?F.mappings.motifs[m.id]:{})||{});
    var deferredTradition=!!(a&&preserve&&opts.currentOutfit.garment.subtype&&opts.currentOutfit.garment.subtype!==a.id);
    if(deferredTradition)p={};
    s.directions.forEach(function(id){var extra=(F.mappings.directionRecommendations||{})[id];if(!extra)return;Object.keys(extra).forEach(function(k){if(k==='parts')p.parts=Object.assign({},extra.parts,p.parts||{});else if(!p[k]||!p[k].length)p[k]=U.clone(extra[k]);});});
    var basePool=F.mappings.bases[s.baseId]||[],pool=a?[a.id]:basePool.length?basePool:p.garments||['cocktail_dress','business_suit','mage_robe'];
    if(m&&m.id==='mermaid_tale'&&!preserve)pool=['sea_silk_mermaid_outfit'].concat(basePool.length?basePool:['ball_gown','shell_top_mermaid_set']);
    var start=Math.floor(rng()*pool.length),count=Math.max(1,Math.min(3,Number(opts.count)||3)),out=[];
    for(var i=0;i<count;i++){
      var o=S.normalize(preserve?opts.currentOutfit:{}),reasons=[],applied=[];
      if(!preserve){o.id='concept_'+seed+'_'+i;o.createdAt='2000-01-01T00:00:00.000Z';o.updatedAt=o.createdAt;}
      o.entryMode='concept_fashion';o.concept.inspiration=U.clone(s);
      if(!preserve||!o.name)o.name=label(s)+'・案'+(i+1);
      var gid=pool[(start+i)%pool.length];if(m&&m.id==='mermaid_tale'&&i===0)gid='sea_silk_mermaid_outfit';
      var g=U.byId(D.garments,preserve&&o.garment.subtype?o.garment.subtype:gid);
      o.garment.subtype=g.id;o.garment.category=g.category;
      function set(path,value,why,source){
        var old=U.getPath(o,path);
        if(value==null||(preserve&&old!=null&&old!==''&&(!Array.isArray(old)||old.length)))return;
        U.setPath(o,path,U.clone(value));applied.push(path);
        reasons.push({source:source||'motif',labelJa:label(s),target:path,reasonJa:why});
      }
      function choose(list){return list&&list.length?list[(i+Math.floor(rng()*list.length))%list.length]:null;}
      function part(slot,id){var def=U.byId(D.partSlots,slot),opt=def&&U.byId(def.options||[],id);if(C.partOptionAllowed(o,slot,opt))set('parts.'+slot,S.normalizePartValue(def,id),'対応する衣装部位へ形を反映');}
      var dirs=s.directions.flatMap(function(d){return F.mappings.directions[d]||[];}),styles=unique(dirs.concat(p.styles||[]));
      set('concept.primaryStyle',styles[0],'選んだ方向性に対応する様式','direction');
      // A single style avoids synonymous modifiers; secondary styles remain editable on the desk.
      var targets=s.placements.length?s.placements:['palette','materials','silhouette','ornament'];
      if(s.categoryId==='food'&&s.foodApplications.length){var fa={palette:'palette',pattern:'pattern',embroidery:'ornament',accessory:'accessories',material:'materials'};targets=unique(s.foodApplications.map(function(x){return fa[x];}).filter(Boolean));}
      var budget={subtle:2,balanced:4,bold:6,total:12,maximum:12}[s.strengthId||'balanced'];
      targets.slice(0,budget).forEach(function(t){
        if(t==='palette'){
          var colors=p.colors||[];colors.slice(0,s.strengthId==='subtle'?1:3).forEach(function(id,k){set('palette.'+['primary','secondary','accent'][k],colors[(k+i)%colors.length],'モチーフの色を既存の色IDへ反映');});
        }else if(t==='materials'){
          var mats=p.materials||[];set('materials.primary',mats[i%mats.length],'質感を既存の素材へ反映');if(s.strengthId!=='subtle'&&mats.length>1)set('materials.secondary',mats[(i+1)%mats.length],'異なる質感を組み合わせる');
        }else if(t==='silhouette'){
          Object.keys(p.silhouette||{}).forEach(function(k){if(g.category!=='merfolk'||['fit','upperVolume','symmetry'].indexOf(k)>=0)set('silhouette.'+k,choose(p.silhouette[k]),'モチーフの輪郭を衣装の形へ反映');});
          Object.keys(p.parts||{}).filter(function(k){return k==='construction_detail';}).forEach(function(k){part(k,choose(p.parts[k]));});
        }else if(t==='ornament'||t==='accessories'){
          var decos=(p.decorations||[]).slice(0,s.strengthId==='subtle'?1:s.strengthId==='maximum'?4:2);
          set('decorations.items',decos.map(function(id){return {type:id,placements:[],quantity:null};}),'モチーフを装飾へ抽象化');
        }else if(t==='pattern'){set('materials.patterns',p.patterns||[],'形や色のリズムを布の柄へ反映');
        }else if(t==='special'){
          Object.keys(p.specialParts||{}).forEach(function(k){Object.keys(p.specialParts[k]).forEach(function(axis){set('specialParts.'+k+'.'+axis,p.specialParts[k][axis],'種類と従属軸を持つ特殊パーツへ反映');});});
        }else if(t==='light'){
          // Optional effects still obey the existing output gate.
          if(p.specialParts&&p.specialParts.halo)Object.keys(p.specialParts.halo).forEach(function(axis){set('specialParts.halo.'+axis,p.specialParts.halo[axis],'光輪を特殊パーツとして反映');});
        }else{
          var slots={sleeves:['sleeves'],neckline:['neckline','collar'],hem:['hem'],headpiece:['headwear']}[t]||[];
          slots.forEach(function(k){part(k,choose((p.parts||{})[k]));});
        }
      });
      if(s.strengthId==='maximum'&&!preserve)o.decorations.density=4;
      if(s.baseId==='armor')set('materials.primary','plate_armor','アーマーの衣装ベース','base');
      if(s.motifId==='crystal_dragon'&&(!s.placements.length||s.placements.indexOf('special')>=0))Object.keys(p.specialParts).forEach(function(k){Object.keys(p.specialParts[k]).forEach(function(axis){set('specialParts.'+k+'.'+axis,p.specialParts[k][axis],'結晶竜の結晶・角・翼を構造化');});});
      if(C.conceptFashion.applySpecializations&&!deferredTradition)C.conceptFashion.applySpecializations(o,s,{set:set,part:part,preserve:!!preserve});
      if(deferredTradition)reasons.push({source:'compatibility',labelJa:a.labelJa,target:'garment.subtype',reasonJa:'現在の衣装を維持したため、別の伝統衣装の固有構造は自動適用しません'});
      // Use existing gates and checks rather than introducing a second rule engine.
      o=S.normalize(o);
      if(!preserve)o.styling.items=C.styling.active(o).map(function(x){return x.id;});
      var issues=C.advisor.check(o),hard=issues.filter(function(x){return x.severity==='hard';});
      if(hard.length&&!preserve){
        // Try another explicitly mapped garment first. Only the shared advisor decides conflicts.
        for(var alt=0;alt<pool.length&&hard.length;alt++){
          if(pool[alt]===o.garment.subtype)continue;
          var replacement=U.byId(D.garments,pool[alt]),trial=U.clone(o);
          trial.garment.subtype=replacement.id;trial.garment.category=replacement.category;
          var allowed=U.byId(D.garmentCategories,replacement.category).slots;
          Object.keys(trial.parts).forEach(function(k){if(allowed.indexOf(k)<0)delete trial.parts[k];});
          var checked=C.advisor.check(trial);
          if(!checked.some(function(x){return x.severity==='hard';})){o=trial;issues=checked;hard=[];reasons.push({source:'compatibility',labelJa:replacement.labelJa,target:'garment.subtype',reasonJa:'既存ルールで部位と両立する衣装候補へ差し替え'});}
        }
        // If the base cannot be swapped, use an existing advisor resolution, never a new conflict rule.
        for(var pass=0;hard.length&&pass<8;pass++){
          var resolved=false;
          for(var h=0;!resolved&&h<hard.length;h++)for(var j=0;!resolved&&j<hard[h].resolutions.length;j++){
            var resolution=hard[h].resolutions[j];if(!resolution.patch||resolution.patch.garment)continue;
            var fixed=C.advisor.apply(o,resolution),fixedIssues=C.advisor.check(fixed),fixedHard=fixedIssues.filter(function(x){return x.severity==='hard';});
            if(fixedHard.length<hard.length){o=fixed;issues=fixedIssues;hard=fixedHard;resolved=true;reasons.push({source:'compatibility',labelJa:'整合性確認',target:'parts',reasonJa:resolution.labelJa});}
          }
          if(!resolved)break;
        }
      }
      if(hard.length&&!preserve)continue;
      out.push({outfit:o,reasons:reasons,warnings:issues,seed:seed,index:i,appliedPaths:applied});
    }
    return out;
  }
  function hasDesign(outfit){
    function content(o){var copy=S.normalize(o);['id','createdAt','updatedAt','version','entryMode'].forEach(function(k){delete copy[k];});return JSON.stringify(copy);}
    return content(outfit)!==content({});
  }
  C.conceptFashion={normalizeSelection:normalizeSelection,label:label,buildCandidates:buildCandidates,hasDesign:hasDesign};
})(typeof window!=='undefined'?window:global);
