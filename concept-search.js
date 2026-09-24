/* Client-only discovery metadata. Never copied into an Outfit. */
(function(g){
  'use strict';var C=g.CPW,F=C.data.conceptFashion;
  function entries(){return F.motifs.concat(F.attires.map(function(a){return Object.assign({},a,{category:'traditional',attire:true});}));}
  C.conceptSearch={
    search:function(query,category,all){
      var q=String(query||'').trim().toLocaleLowerCase();if(!q)return [];
      return entries().filter(function(m){return (all||!category||m.category===category)&&[m.labelJa,m.shortPrompt].concat(m.searchKeywords||[]).join(' ').toLocaleLowerCase().indexOf(q)>=0;}).sort(function(a,b){return Number(b.category===category)-Number(a.category===category);}).slice(0,30);
    },
    featured:function(category,group){return F.motifs.filter(function(m){return m.category===category&&m.featured&&(!group||m.groupId===group);}).slice(0,12);},
    choose:function(draft,id){var m=entries().filter(function(x){return x.id===id;})[0];if(!m)return draft;var next=C.util.clone(draft);next.categoryId=m.category;next.motifId=m.attire?null:m.id;next.foodGroupId=m.groupId||null;if(m.attire){next.traditional.regionId=m.regionId;next.traditional.attireId=m.id;}return C.conceptFashion.normalizeSelection(next);}
  };
})(typeof window!=='undefined'?window:global);
