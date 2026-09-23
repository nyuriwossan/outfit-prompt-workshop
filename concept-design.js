/* Phase 5E structured composition. The original engine, schema and shared gates remain authoritative. */
(function(g){
  'use strict';var C=g.CPW,D=C.data,F=D.conceptFashion,U=C.util,E=C.conceptFashion;
  function one(list,id){return U.byId(list,id)?id:null;}
  function many(list,ids,max){return (Array.isArray(ids)?ids:[]).filter(function(id,i,a){return one(list,id)&&a.indexOf(id)===i;}).slice(0,max);}
  E.normalizeExpansion=function(s,r){
    var secondary=r.secondary&&typeof r.secondary==='object'?r.secondary:{},context=r.context&&typeof r.context==='object'?r.context:{};
    s.secondary={categoryId:one(F.categories,secondary.categoryId),motifId:one(F.motifs,secondary.motifId),customMotif:typeof secondary.customMotif==='string'?secondary.customMotif:''};
    var m=U.byId(F.motifs,s.secondary.motifId);if(m&&m.category!==s.secondary.categoryId)s.secondary.motifId=null;
    s.blendMode=one(F.blendModes,r.blendMode)||'primary_dominant';s.context={};
    ['worldview','era','role','occasion'].forEach(function(k){s.context[k+'Id']=one(D[k==='worldview'?'worldviews':k+'s'],context[k+'Id']);});
    s.context.storyStateIds=many(F.storyStates,context.storyStateIds,2);s.designLanguages=many(F.designLanguages,r.designLanguages,2);
    s.interpretationMode=one(F.interpretationModes,r.interpretationMode)||'auto';s.exclusions=many(F.exclusions,r.exclusions,4);return s;
  };
  E.secondaryAssignments=function(s){
    if(!s.secondary.motifId||s.secondary.motifId===s.motifId)return [];
    return {primary_dominant:['palette.accent','decorations.items'],balanced:['palette.secondary','materials.secondary','parts.construction_detail','decorations.items'],split_roles:['materials.patterns','parts.collar','parts.construction_detail','decorations.items'],secondary_accent:['decorations.items']}[s.blendMode].slice();
  };
  E.expandedSelection=function(s){return !!(s.secondary.motifId||s.secondary.customMotif||s.context.worldviewId||s.context.eraId||s.context.roleId||s.context.occasionId||s.context.storyStateIds.length||s.designLanguages.length||s.interpretationMode!=='auto'||s.exclusions.length);};
  function contains(list,id){return !!list&&list.indexOf(id)>=0;}
  function hasValue(v){return v!=null&&v!==''&&(!Array.isArray(v)||v.length>0);}
  function partId(v){return typeof v==='string'?v:v&&v.type;}
  function partIds(v){return Array.isArray(v)?v.map(function(x){return x.id||x.type;}):[partId(v)];}
  E.constraintViolations=function(o,exclusions){
    var result=[];
    (exclusions||[]).forEach(function(id){var r=F.exclusionRules[id];if(!r)return;
      function hit(path,value){result.push({id:id,path:path,value:U.clone(value),labelJa:U.labelOf(F.exclusions,id)});}
      function scalar(path,list){var v=U.getPath(o,path);if(contains(list,v))hit(path,v);}
      scalar('garment.subtype',r.garments);
      Object.keys(o.garment.layers).forEach(function(k){var a=o.garment.layers[k];if(a.some(function(x){return contains(r.garments,x);}))hit('garment.layers.'+k,a);});
      ['primary','secondary','trim'].forEach(function(k){scalar('materials.'+k,r.materials);});
      ['primaryStyle'].forEach(function(k){scalar('concept.'+k,r.styles);});
      scalar('concept.era',r.eras);scalar('concept.worldview',r.worldviews);scalar('concept.primaryThemeMotif',r.motifs);scalar('decorations.focalMotif',r.motifs);
      [['materials.patterns',r.patterns],['concept.secondaryStyles',r.styles],['concept.secondaryThemeMotifs',r.motifs],['styling.items',r.styling]].forEach(function(x){var a=U.getPath(o,x[0]);if(a.some(function(v){return contains(x[1],v);}))hit(x[0],a);});
      if(o.decorations.items.some(function(x){return contains(r.decorations,x.type)||r.maxSize&&x.size==='large'||r.maxQuantity&&(x.quantity==='many'||r.maxQuantity==='single'&&x.quantity==='few');})||r.decorationLimit!=null&&o.decorations.items.length>r.decorationLimit)hit('decorations.items',o.decorations.items);
      if(r.densityLimit!=null&&o.decorations.density>r.densityLimit)hit('decorations.density',o.decorations.density);
      if(o.condition.items.some(function(x){return contains(r.conditions,x.type);}))hit('condition.items',o.condition.items);
      Object.keys(o.parts).forEach(function(k){if(partIds(o.parts[k]).some(function(id){return contains(r.parts,id);}))hit('parts.'+k,o.parts[k]);});
      Object.keys(o.silhouette).forEach(function(k){scalar('silhouette.'+k,r.silhouette);});
      ['wings','horns','tail','halo'].forEach(function(k){if(o.specialParts[k].type&&(contains(r.specialSlots,k)||contains(r.specialTypes,o.specialParts[k].type)))hit('specialParts.'+k,o.specialParts[k]);});
      (r.clearPaths||[]).forEach(function(p){var v=U.getPath(o,p);if(hasValue(v))hit(p,v);});
    });return result;
  };
  E.enforceExclusions=function(outfit,s,original){
    var o=U.clone(outfit),existing=original?E.constraintViolations(original,s.exclusions):[],conflicts=[];
    E.constraintViolations(o,s.exclusions).forEach(function(v){
      if(existing.some(function(e){return e.id===v.id&&e.path===v.path;})){conflicts.push(v);return;}
      var r=F.exclusionRules[v.id],p=v.path,value=U.getPath(o,p);
      if(p==='garment.subtype')return;
      if(p==='decorations.items')value=value.filter(function(x){return !contains(r.decorations,x.type);}).slice(0,r.decorationLimit==null?99:r.decorationLimit).map(function(x){var d=U.clone(x);if(r.maxSize&&d.size==='large')d.size=r.maxSize;if(r.maxQuantity&&(d.quantity==='many'||r.maxQuantity==='single'&&d.quantity==='few'))d.quantity=r.maxQuantity;return d;});
      else if(p==='decorations.density')value=r.densityLimit;
      else if(p==='condition.items')value=value.filter(function(x){return !contains(r.conditions,x.type);});
      else if(p.indexOf('garment.layers.')===0)value=value.filter(function(x){return !contains(r.garments,x);});
      else if(Array.isArray(value)){var list=p.indexOf('parts.')===0?r.parts:p==='materials.patterns'?r.patterns:p==='styling.items'?r.styling:p==='concept.secondaryStyles'?r.styles:r.motifs;value=contains(r.clearPaths,p)?[]:value.filter(function(x){return !contains(list,typeof x==='object'?x.id||x.type:x);});}
      else if(p.indexOf('specialParts.')===0)value={};
      else value=null;
      U.setPath(o,p,value);
    });
    var unresolved=E.constraintViolations(o,s.exclusions).filter(function(v){return !conflicts.some(function(x){return x.id===v.id&&x.path===v.path;});});
    return {outfit:C.schema.normalize(o),conflicts:conflicts,unresolved:unresolved};
  };
  E.contextProfile=function(s){
    var p={};['worldview','era','occasion','role'].forEach(function(k){var x=U.byId(D[k==='worldview'?'worldviews':k+'s'],s.context[k+'Id']);if(x)Object.keys(x.recommended).forEach(function(key){p[key]=U.clone(x.recommended[key]);});});return p;
  };
  function pathTarget(path){if(path.indexOf('palette.')===0)return 'palette';if(path==='materials.patterns')return 'pattern';if(path.indexOf('materials.')===0)return 'materials';if(path.indexOf('silhouette.')===0||path==='parts.construction_detail')return 'silhouette';if(path==='decorations.items')return 'ornament';if(path.indexOf('specialParts.')===0)return 'special';return {collar:'neckline',neckline:'neckline',sleeves:'sleeves',hem:'hem',headwear:'headpiece'}[path.split('.')[1]];}
  function allowedTarget(s,path){
    var targets=s.placements.length?s.placements:['palette','materials','silhouette','ornament'];
    if(s.categoryId==='food'&&s.foodApplications.length){var map={palette:'palette',pattern:'pattern',embroidery:'ornament',accessory:'ornament',material:'materials'};targets=s.foodApplications.map(function(x){return map[x];});}
    return contains(targets,pathTarget(path))||pathTarget(path)==='ornament'&&contains(targets,'accessories');
  }
  function mappedValue(p,path,index){
    var a=path.split('.'),values;
    if(a[0]==='palette')values=p.colors;
    else if(path==='decorations.items')return (p.decorations||[]).slice(0,2).map(function(id){return {type:id,placements:[],quantity:null};});
    else if(path==='materials.patterns')return p.patterns||[];
    else if(a[0]==='materials')values=p.materials;
    else values=(p[a[0]]||{})[a[1]];
    return values&&values.length?values[index%values.length]:null;
  }
  var originalBuild=E.buildCandidates;
  E.buildCandidates=function(selection,options){
    var opts=options||{},s=E.normalizeSelection(selection),context=E.contextProfile(s),preserve=opts.mode==='preserve'&&opts.currentOutfit,source=preserve?C.schema.normalize(opts.currentOutfit):null;
    var callOpts=Object.assign({},opts);if(!s.baseId&&!s.traditional.attireId&&s.motifId!=='mermaid_tale')callOpts.garmentPool=context.garments;
    var initial=originalBuild(s,callOpts),result=[];
    initial.forEach(function(c,i){
      var o=c.outfit,writes={},primarySnapshot=U.clone(o),trad=s.traditional.attireId&&(s.traditional.treatmentId===null||s.traditional.treatmentId==='traditional');
      function set(path,value,sourceName,why){
        if(value==null&&sourceName!=='strategy'||source&&hasValue(U.getPath(source,path)))return false;
        if(path.indexOf('parts.')===0){var slot=path.split('.')[1],def=U.byId(D.partSlots,slot),opt=def&&U.byId(def.options||[],value);if(!C.partOptionAllowed(o,slot,opt))return false;value=C.schema.normalizePartValue(def,value);}
        if(o.garment.category==='merfolk'&&path.indexOf('silhouette.')===0&&!contains(['fit','upperVolume','symmetry'],path.split('.')[1]))return false;
        if(trad&&(path.indexOf('parts.')===0||path.indexOf('silhouette.')===0)&&hasValue(U.getPath(primarySnapshot,path)))return false;
        if(JSON.stringify(U.getPath(o,path))===JSON.stringify(value))return false;
        if(sourceName==='strategy'&&writes[path]&&writes[path].source==='secondary')sourceName='secondary';
        U.setPath(o,path,U.clone(value));writes[path]={source:sourceName,value:U.clone(value),reason:why};return true;
      }
      // Context changes the current structured fields, never inferred person gender.
      ['worldview','era','role','occasion'].forEach(function(k){set('concept.'+k,s.context[k+'Id'],'context','世界・人物の選択を現在の設計へ反映');});
      ['materials.primary','materials.secondary','silhouette.fit','parts.construction_detail','parts.collar'].forEach(function(path){if(allowedTarget(s,path))set(path,mappedValue(context,path,i),'context','役割・場面・時代に合う素材と仕立て');});
      if(context.styles)set('concept.primaryStyle',context.styles[0],'context','人物と場面に合う様式');
      var secondary=F.mappings.motifs[s.secondary.motifId];
      if(secondary)E.secondaryAssignments(s).forEach(function(path){if(allowedTarget(s,path))set(path,mappedValue(secondary,path,i),'secondary','副題を'+U.labelOf(F.blendModes,s.blendMode)+'で反映');});
      s.designLanguages.forEach(function(id,n){var p=U.byId(F.designLanguages,id).recommended;Object.keys(p.silhouette||{}).forEach(function(k){if(n>0&&k==='fit')return;if(allowedTarget(s,'silhouette.'+k))set('silhouette.'+k,p.silhouette[k][0],'designLanguage',U.labelOf(F.designLanguages,id)+'の輪郭');});Object.keys(p.parts||{}).forEach(function(k){if(allowedTarget(s,'parts.'+k))set('parts.'+k,p.parts[k][0],'designLanguage',U.labelOf(F.designLanguages,id)+'の組み立て');});if(p.materials&&allowedTarget(s,'materials.secondary'))set('materials.secondary',p.materials[0],'designLanguage',U.labelOf(F.designLanguages,id)+'の質感');});
      var conditions=[],styling=context.styling||[];
      s.context.storyStateIds.forEach(function(id){var p=U.byId(F.storyStates,id).recommended;conditions=conditions.concat(p.conditionTypes);styling=styling.concat(p.styling);});
      if(conditions.length)set('condition.items',conditions.filter(function(id,n,a){return a.indexOf(id)===n;}).slice(0,2).map(function(id){return {type:id,severity:'light',extent:'localized',placements:[]};}),'storyState','物語状態を衣装表面の状態へ翻訳');
      if(styling.length){var trial=U.clone(o);trial.styling.items=styling;set('styling.items',C.styling.active(trial).map(function(x){return x.id;}).slice(0,2),'storyState','適用できる着こなしだけを提案');}
      if(E.applyStrategy)E.applyStrategy(o,s,c,i,set,allowedTarget,opts);
      o=C.schema.normalize(o);
      // A blocked garment is replaced only inside an explicitly selected base pool.
      var garmentViolations=E.constraintViolations(o,s.exclusions).filter(function(v){return v.path==='garment.subtype';});
      if(garmentViolations.length&&!preserve){
        var pool=s.traditional.attireId?[s.traditional.attireId]:s.baseId?F.mappings.bases[s.baseId]:D.garments.map(function(x){return x.id;});
        if(o.garment.category==='merfolk')pool=D.garments.filter(function(x){return x.category==='merfolk';}).map(function(x){return x.id;});
        var replacement=pool.filter(function(id){return !s.exclusions.some(function(ex){return contains(F.exclusionRules[ex].garments,id);});})[0];
        if(!replacement)return;
        var garment=U.byId(D.garments,replacement);o.garment.subtype=garment.id;o.garment.category=garment.category;
        Object.keys(o.parts).forEach(function(k){var def=U.byId(D.partSlots,k),opt=def&&U.byId(def.options||[],partId(o.parts[k]));if(!C.partOptionAllowed(o,k,opt))delete o.parts[k];});
      }
      var enforced=E.enforceExclusions(o,s,source);if(enforced.unresolved.length)return;o=enforced.outfit;
      if(!source)o.styling.items=C.styling.active(o).map(function(x){return x.id;});
      c.outfit=o;c.mode=source?'preserve':'new';c.conflicts=enforced.conflicts;c.constraintsApplied=s.exclusions.filter(function(id){return !enforced.conflicts.some(function(v){return v.id===id;});});
      c.motifContributions=[];
      var primaryPaths=c.appliedPaths.filter(function(path){return !writes[path]&&JSON.stringify(U.getPath(primarySnapshot,path))===JSON.stringify(U.getPath(o,path));});
      if(s.motifId)c.motifContributions.push({source:'primary',motifId:s.motifId,paths:primaryPaths});
      var secondaryPaths=Object.keys(writes).filter(function(path){return writes[path].source==='secondary'&&JSON.stringify(writes[path].value)===JSON.stringify(U.getPath(o,path));});
      if(s.secondary.motifId&&s.secondary.motifId!==s.motifId)c.motifContributions.push({source:'secondary',motifId:s.secondary.motifId,paths:secondaryPaths});
      c.reasons=c.reasons.filter(function(r){return !writes[r.target]&&JSON.stringify(U.getPath(primarySnapshot,r.target))===JSON.stringify(U.getPath(o,r.target));});
      Object.keys(writes).forEach(function(path){var w=writes[path];if(JSON.stringify(w.value)!==JSON.stringify(U.getPath(o,path)))return;c.reasons.push({source:w.source,labelJa:w.source==='secondary'?U.labelOf(F.motifs,s.secondary.motifId):E.label(s),target:path,reasonJa:w.reason});});
      c.appliedPaths=c.reasons.map(function(r){return r.target;}).filter(function(p,n,a){return a.indexOf(p)===n;});
      c.warnings=C.advisor.check(o);
      if(!source&&c.warnings.some(function(w){return w.severity==='hard';}))return;
      result.push(c);
    });return result.length===initial.length?result:[];
  };
  E.resolvePreserveConflict=function(candidate,choice){
    var o=U.clone(candidate.outfit),s=o.concept.inspiration;
    if(choice==='keep'){s.exclusions=s.exclusions.filter(function(id){return !(candidate.conflicts||[]).some(function(v){return v.id===id;});});return o;}
    if(choice==='exclude'){var fixed=E.enforceExclusions(o,s);return fixed.unresolved.length?null:fixed.outfit;}return null;
  };
  E.applyStrategy=function(o,s,c,index,set,allows,opts){
    var id=(opts.strategies||['readable','wearable','experimental'])[index%3]||'readable';if(!one(F.strategies,id))id='readable';
    c.strategy=id;c.strategyLabelJa=U.labelOf(F.strategies,id);
    var mode=s.interpretationMode==='auto'?{readable:'literal',wearable:'fashion',experimental:'avant_garde'}[id]:s.interpretationMode;
    c.interpretationMode=mode;
    var shapes={literal:['contoured_fit','shaped_seams'],symbolic:['draped','overlapping_panels'],abstract:['structured_fit','pleated_panels'],fashion:['tailored','shaped_seams'],stage:['fitted','boned_structure'],avant_garde:['oversized','modular_panels']},shape=shapes[mode];
    var traditional=s.traditional.attireId&&(s.traditional.treatmentId===null||s.traditional.treatmentId==='traditional');
    var specialized=s.idolStyleId||s.artNouveauShapeId||traditional;
    if(!specialized&&allows(s,'silhouette.fit')){
      if(!s.designLanguages.length&&!(s.interpretationMode==='auto'&&id==='readable'))set('silhouette.fit',shape[0],'strategy',c.strategyLabelJa+'：'+U.labelOf(F.interpretationModes,mode)+'の輪郭');
      if(!s.designLanguages.length&&!(s.interpretationMode==='auto'&&id==='readable'))set('parts.construction_detail',id==='wearable'&&mode!=='fashion'?'shaped_seams':id==='experimental'&&mode!=='avant_garde'?'layered_panels':shape[1],'strategy','同じ題材を異なる仕立てで組み立てる');
      // Proportions vary within the chosen interpretation, without changing explicit language choices.
      set('silhouette.upperVolume',{readable:'fitted_upper',wearable:'natural_upper',experimental:'structured'}[id],'strategy','比較できる肩・身幅の構成差');
    }
    if(allows(s,'materials.primary')&&o.materials.primary){
      var p=E.contextProfile(s),motif=F.mappings.motifs[s.motifId];var materials=p.materials||motif&&motif.materials||[];
      if(materials.length){
        set('materials.primary',materials[(id==='experimental'&&materials.length===2?1:index)%materials.length],'strategy','同じ題材の質感を別の素材で表現');
        var ownsSecondary=s.secondary.motifId&&s.blendMode==='balanced'||s.designLanguages.some(function(id){return !!U.byId(F.designLanguages,id).recommended.materials;});
        if(!ownsSecondary)set('materials.secondary',id==='wearable'||materials.length<2?null:materials[id==='experimental'?0:1],'strategy','単一素材と異素材の組み合わせを比較');
      }
    }
    if(allows(s,'decorations.items')&&!specialized){
      var decos=o.decorations.items.slice();
      if(['symbolic','abstract','avant_garde'].indexOf(mode)>=0){var translated=[];decos.forEach(function(d){var p=F.decorationInterpretations[d.type],ids=p&&p[mode]||[d.type];ids.forEach(function(id){translated.push({type:id,placements:[],quantity:null});});});decos=translated;}
      if(mode==='fashion'||id==='wearable')decos=decos.slice(0,1);
      if(mode==='stage')decos=decos.concat([{type:'sequins',placements:[],quantity:null}]);
      decos=decos.map(function(d){return Object.assign({},d,{quantity:{readable:'few',wearable:'single',experimental:'many'}[id]});});
      if(decos.length)set('decorations.items',decos.filter(function(v,n,a){return a.findIndex(function(x){return x.type===v.type;})===n;}),'strategy','解釈に合わせて装飾の種類と量を調整');
      if(s.strengthId!=='maximum'&&decos.length)set('decorations.density',{readable:2,wearable:1,experimental:3}[id],'strategy','装飾の密度を変えて比較');
    }
    if(mode!=='literal'&&mode!=='stage'){
      ['wings','horns','halo','tail'].forEach(function(k){if(o.specialParts[k].type)set('specialParts.'+k,{},'strategy','形・素材へ抽象化し特殊パーツを省く');});
    }
  };
  E.diversity=function(candidates){
    var fields=['garment','silhouette','materials','parts','decorations'],vary=fields.filter(function(k){return candidates.some(function(c){return JSON.stringify(c.outfit[k])!==JSON.stringify(candidates[0].outfit[k]);});});
    var minimum=5;for(var i=0;i<candidates.length;i++)for(var j=i+1;j<candidates.length;j++)minimum=Math.min(minimum,fields.filter(function(k){return JSON.stringify(candidates[i].outfit[k])!==JSON.stringify(candidates[j].outfit[k]);}).length);
    var s=candidates.length?candidates[0].outfit.concept.inspiration:null,reason=null;
    if(minimum<2&&s){
      if(candidates[0].mode==='preserve')reason='既存の設計値を優先したため';
      else if(s.foodApplications.length)reason='食品モチーフの反映方法を限定しているため';
      else if(s.placements.length)reason='反映先を限定しているため';
      else if(s.traditional.attireId)reason='伝統衣装の識別構造を優先したため';
      if(reason)reason+='、候補間の構造差が限定されています。';
    }
    return {domains:vary,count:vary.length,pairMinimum:minimum,structural:vary.some(function(k){return k!=='materials';}),exception:reason};
  };
  E.randomSelection=function(profileId,seed){
    var rng=C.gacha.makeRng({seed:Number(seed)>>>0}),profile=one(F.randomProfiles,profileId)||'all';function pick(a){return a[Math.floor(rng()*a.length)];}
    var table={dark:['concept','fantasy','myth'],fantasy:['fantasy','myth'],cute:['living','food'],elegant:['art','material'],dreamlike:['nature','fantasy'],unusual:['material','art'],stage:['stage'],practical:['nature','art'],ceremonial:['myth','art'],sharp:['material','art']};
    var pool=F.motifs.filter(function(m){return !table[profile]||table[profile].indexOf(m.category)>=0;}),m=pick(pool),s=E.normalizeSelection({categoryId:m.category,motifId:m.id,foodGroupId:m.groupId});
    if(rng()<0.65){var secondary=pick(F.motifs.filter(function(x){return x.id!==m.id;}));s.secondary={categoryId:secondary.category,motifId:secondary.id,customMotif:''};s.blendMode=pick(F.blendModes).id;}
    s.context={worldviewId:pick(D.worldviews).id,eraId:pick(D.eras).id,roleId:pick(D.roles).id,occasionId:pick(D.occasions).id,storyStateIds:[pick(F.storyStates).id]};
    var directions={dark:'dark',fantasy:'fantastical',cute:'cute',elegant:'elegant',dreamlike:'mystical',unusual:'avant',stage:'stage',practical:'practical',ceremonial:'ceremonial',sharp:'strict'};
    s.directions=[directions[profile]||pick(F.directions).id];s.designLanguages=[pick(F.designLanguages).id];
    s.baseId=pick(['dress','gown','suit','coat','robe','royal','stage','battle','layered']);s.strengthId='balanced';s.exposure=null;
    s.foodApplications=s.categoryId==='food'?['palette','material','embroidery']:[];return E.normalizeSelection(s);
  };
  E.motifRepresented=function(o,id){
    var p=F.mappings.motifs[id];if(!p)return false;
    var decorations=(p.decorations||[]).slice();(p.decorations||[]).forEach(function(id){var mapped=F.decorationInterpretations[id]||{};Object.keys(mapped).forEach(function(k){decorations=decorations.concat(mapped[k]);});});
    return Object.keys(o.palette).some(function(k){return contains(p.colors,o.palette[k]);})||['primary','secondary','trim'].some(function(k){return contains(p.materials,o.materials[k]);})||o.decorations.items.some(function(x){return contains(decorations,x.type);})||Object.keys(p.parts||{}).some(function(k){return contains(p.parts[k],partId(o.parts[k]));});
  };
  E.checkNote=function(o,kind){
    var s=o.concept.inspiration,paths=[],message='';
    if(kind==='duplicate'&&s.motifId&&s.secondary.motifId===s.motifId){paths=['concept.inspiration.secondary'];message='主題と副題が同じです。同じモチーフは二重に反映しません。';}
    if(kind==='story'){
      var pairs=[['prime','fallen_status'],['captive','just_escaped'],['cursed','purified']];
      if(pairs.some(function(p){return p.every(function(id){return s.context.storyStateIds.indexOf(id)>=0;});})){paths=['concept.inspiration.context.storyStateIds'];message='物語状態に対照的な選択があります。意図した物語ならそのまま維持できます。';}
    }
    if(kind==='exclusions'){
      var conflicts=E.constraintViolations(o,s.exclusions);
      if(conflicts.length){paths=conflicts.map(function(v){return v.path;});message='現在の設計に'+conflicts.map(function(v){return '「'+v.labelJa+'」';}).filter(function(v,n,a){return a.indexOf(v)===n;}).join('・')+'と競合する要素があります。コンセプト候補の採用時に、既存を残すか除外を優先するか選べます。';}
    }
    var garment=U.byId(D.garments,o.garment.subtype);
    if(kind==='era'&&garment&&contains(['near_future','far_future'],o.concept.era)&&garment.tags.indexOf('traditional')>=0){paths=['concept.era','garment.subtype'];message='未来の時代設定と伝統衣装を組み合わせています。意図したミックスなら維持できます。';}
    if(kind==='role'&&o.concept.role==='knight'&&contains(['research','tea_party'],o.concept.occasion)){paths=['concept.role','concept.occasion'];message='騎士と研究・茶会の組み合わせです。戦闘以外の場面として維持できます。';}
    return message?{involvedPaths:paths,messageJa:message}:null;
  };
})(window);
