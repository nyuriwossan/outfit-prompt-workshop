/* Explicit structure choices; all final text still comes from generator.js. */
(function(global){
  'use strict';var C=global.CPW,U=C.util;
  var profiles={
    qipaoNeckline:{classic:{parts:{collar:'mandarin_collar',closure:'frog_closures'}},halter:{parts:{collar:'no_collar',neckline:'halter_neckline',sleeves:'sleeveless'}},open_back:{parts:{collar:'mandarin_collar',cutout:'open_back'}},bare_shoulders:{parts:{collar:'no_collar',shoulders:'off_shoulder',neckline:'wide_neckline'}}},
    qipaoLength:{mini:{silhouette:{length:'mini'}},above_knee:{silhouette:{length:'above_knee'}},knee:{silhouette:{length:'knee'}},long:{silhouette:{length:'ankle_length'}}},
    qipaoSlit:{high:{parts:{hem:'high_slit_hem'}},modest:{parts:{hem:'modest_slit_hem'}},none:{parts:{hem:'straight_hem'}}},
    qipaoDrape:{clean:{parts:{construction_detail:'shaped_seams',cover_up:'no_cover_up'}},short_panel:{parts:{construction_detail:'layered_panels'}},cape:{parts:{cover_up:'shoulder_cape'}}},
    artNouveau:{long:{silhouette:{length:'maxi'}},midi:{silhouette:{length:'midi'}},mini:{silhouette:{length:'mini'}},tunic:{garment:'shirt_dress',silhouette:{length:'hip_length'}},cape:{parts:{cover_up:'shoulder_cape'}},separates:{garment:'knit_and_skirt',parts:{construction_detail:'draped_panels'}},no_slit:{parts:{hem:'straight_hem'}},modest_slit:{parts:{hem:'modest_slit_hem'}}},
    idol:{frill_mini:{silhouette:{length:'mini'},parts:{skirt_shape:'tiered_skirt'},decorations:['frills']},above_knee:{silhouette:{length:'above_knee'}},volume:{parts:{skirt_shape:'full_skirt'}},flare:{parts:{skirt_shape:'a_line_skirt'}},tiered:{parts:{skirt_shape:'tiered_skirt'}},sequin:{decorations:['sequins']},stage:{style:'idol_stage'},ribbons:{decorations:['layered_bows']},stars:{decorations:['star_charms']},future:{style:'futuristic',material:'holographic_fabric'},classic_cute:{style:'romantic',decorations:['ribbon_bow']},cool:{style:'minimal',silhouette:{fit:'tailored'}},japanese:{garment:'modern_kimono_outfit',style:'idol_stage'},mens:{garment:'royal_uniform',silhouette:{fit:'tailored'},parts:{bottoms:'straight_trousers'}},unisex:{garment:'royal_uniform',silhouette:{fit:'boxy'},parts:{bottoms:'wide_trousers'}}}
  };
  C.conceptFashion.detailProfiles=profiles;
  C.conceptFashion.applySpecializations=function(o,s,ctx){
    var t=s.traditional,trad=t.attireId&&(t.treatmentId===null||t.treatmentId==='traditional');
    function apply(p){if(!p)return;
      if(p.garment&&!ctx.preserve){var g=U.byId(C.data.garments,p.garment);o.garment.category=g.category;o.garment.subtype=g.id;Object.keys(o.parts).forEach(function(k){if(U.byId(C.data.garmentCategories,g.category).slots.indexOf(k)<0)delete o.parts[k];});}
      Object.keys(p.silhouette||{}).forEach(function(k){if(o.garment.category!=='merfolk'||['fit','symmetry','upperVolume'].indexOf(k)>=0)ctx.set('silhouette.'+k,p.silhouette[k],'選んだ形・丈を優先','selection');});
      Object.keys(p.parts||{}).forEach(function(k){ctx.part(k,p.parts[k]);});
      if(p.style)ctx.set('concept.primaryStyle',p.style,'選んだ衣装バリエーション','selection');
      if(p.material)ctx.set('materials.primary',p.material,'衣装バリエーションの質感','selection');
      if(p.decorations)ctx.set('decorations.items',p.decorations.map(function(id){return {type:id,placements:[],quantity:null};}),'衣装バリエーションの装飾','selection');
    }
    if(s.exposure!==null&&!trad){
      var n=s.exposure;
      apply({parts:n<2?{neckline:'high_neckline',shoulders:'natural_shoulders',sleeves:'long_sleeves',back:'covered_back',coverage:'full_coverage'}:n===2?{neckline:'round_neck',shoulders:'natural_shoulders',coverage:'moderate_coverage'}:n===3?{neckline:'v_neck',sleeves:'short_sleeves',coverage:'moderate_coverage'}:n===4?{neckline:'wide_neckline',shoulders:'off_shoulder',cutout:'open_back',coverage:'minimal_coverage'}:{neckline:'plunging_neckline',shoulders:'off_shoulder',cutout:'midriff_cutout',coverage:'minimal_coverage'}});
      if(o.garment.category!=='merfolk')apply({silhouette:{length:n<2?'maxi':n>3?'mini':'knee'}});
    }
    if(t.attireId==='qipao'){
      apply(profiles.qipaoNeckline[trad?'classic':t.qipaoNecklineId||'classic']);
      apply(profiles.qipaoLength[t.qipaoLengthId||'long']);apply(profiles.qipaoSlit[t.qipaoSlitId||'none']);apply(profiles.qipaoDrape[t.qipaoDrapeId||'clean']);
    }
    if(s.motifId==='art_nouveau'){
      // No automatic slit, even when coverage is high. Explicit modest slit is honored.
      apply({parts:{hem:'straight_hem',construction_detail:'draped_panels'}});apply(profiles.artNouveau[s.artNouveauShapeId]);
    }
    if(s.idolStyleId)apply(profiles.idol[s.idolStyleId]);
    if(trad){
      if(t.attireId==='hanfu')apply({parts:{sleeves:'wide_sleeves',construction_detail:'overlapping_panels'}});
      if(t.attireId==='hanbok')apply({parts:{waist:'ribbon_tie'},silhouette:{lowerVolume:'voluminous'}});
      if(t.attireId==='kimono')apply({parts:{waist:'obi',sleeves:'kimono_sleeves'}});
      if(t.attireId==='ao_dai')apply({parts:{collar:'mandarin_collar'},silhouette:{length:'maxi'}});
      if(t.attireId==='mariachi')apply({parts:{bottoms:'fitted_trousers',collar:'shawl_lapels'}});
    }
  };
})(typeof window!=='undefined'?window:global);
