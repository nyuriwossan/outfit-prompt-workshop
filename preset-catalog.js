/* Catalog filters and previews never write the active outfit. */
(function(g){'use strict';var C=g.CPW,D=C.data,U=C.util,E=C.ui.el;
function normalize(q){return String(q||'').normalize('NFKC').toLowerCase().replace(/[ァ-ヶ]/g,function(c){return String.fromCharCode(c.charCodeAt(0)-96);}).trim();}
/* 横断フィルター：特集（コスプレ／季節・イベント／着ぐるみ／通常衣装）と、その下位（行事・着ぐるみの種類）。
 * 既存の主分類・雰囲気・検索とは独立に重ねて絞り込む。保存データには関係しない。 */
var THEMED=['cosplay','seasonal','kigurumi'];
function themeOk(p,theme){if(!theme)return true;var tags=p.themeTags||[];if(theme==='everyday')return !tags.some(function(t){return THEMED.indexOf(t)>=0;});return tags.indexOf(theme)>=0;}
function subOk(p,f){if(!f.sub)return true;if(f.theme==='seasonal')return (p.eventTags||[]).indexOf(f.sub)>=0;if(f.theme==='kigurumi')return p.kigurumiType===f.sub;return true;}
function subOptions(theme){return theme==='seasonal'?(D.presetEvents||[]):theme==='kigurumi'?(D.kigurumiTypes||[]):[];}
function labels(list,ids){return (ids||[]).map(function(id){var x=U.byId(list||[],id);return x?x.labelJa:'';});}
function filter(f){var terms=normalize(f.query).split(/\s+/).filter(Boolean),seen={};return D.presets.filter(function(p){if(seen[p.id])return false;seen[p.id]=true;var hay=normalize([p.labelJa,p.summaryJa].concat(p.moodTags,p.searchAliases||[],labels(D.presetEvents,p.eventTags),labels(D.presetThemes,p.themeTags),labels(D.kigurumiTypes,[p.kigurumiType])).join(' '));return (!f.category||p.categoryId===f.category)&&(!f.mood||p.moodTags.indexOf(f.mood)>=0)&&themeOk(p,f.theme)&&subOk(p,f)&&terms.every(function(t){return hay.includes(t);});});}
function pick(list,last,rng){var choices=list.length>1?list.filter(function(p){return p.id!==last;}):list;return choices.length?choices[Math.floor((rng||Math.random)()*choices.length)]:null;}
function create(id){var p=U.byId(D.presets,id);if(!p)throw Error('Unknown preset');var o=C.schema.applyPatch(C.schema.createOutfit(),p.patch);o.name=p.labelJa;o.entryMode='preset';return o;}
function adopt(outfit){var before=C.state.outfit,dirty=C.state.dirty,saved=C.state.savedId;try{var next=C.schema.normalize(U.clone(outfit));C.state.load(next);return next;}catch(e){C.state.outfit=before;C.state.dirty=dirty;C.state.savedId=saved;C._autosave();throw e;}}
function button(t,fn,attrs){return E('button',Object.assign({type:'button',class:'btn',text:t,onclick:fn},attrs));}
function swatches(o){var box=E('div',{class:'discovery-swatches'});['primary','secondary','accent'].forEach(function(k){var c=U.byId(D.colors,o.palette[k]);if(c){var s=E('span',{class:'discovery-swatch',title:c.labelJa,'aria-label':c.labelJa});s.style.backgroundColor=c.hex;box.appendChild(s);box.appendChild(E('span',{text:c.labelJa}));}});return box;}
var browsing={query:'',category:'',mood:'',theme:'',sub:'',scroll:0,page:0,filtersOpen:false},last=null;
function view(params) {
var host=E('section',{class:'screen discovery'}),draft=null,chosen=null,confirming=false,message='',colorOpen=false;
function goPreview(p) {
  var hash='#/presets/'+encodeURIComponent(p.id);
  if(draft){g.location.replace(hash);return;}
  browsing.scroll=g.scrollY;
  browsing.filtersOpen=host.querySelector('.catalog-filters').open;
  g.location.hash=hash;
  g.history.replaceState({fromCatalog:true},'');

}
function back(){if(g.history.state && g.history.state.fromCatalog)g.history.back();else g.location.replace('#/presets');}
function doAdopt(){if(!confirming&&C.conceptFashion.hasDesign(C.state.outfit)){confirming=true;drawPreview();host.querySelector('[data-preset-confirm]').focus();return;}try{adopt(draft);g.location.hash='#/workshop';}catch(e){message='衣装を採用できませんでした。現在の設計は保持しています。';confirming=false;drawPreview();console.error(e);}}
function drawPreview(){host.replaceChildren(button('← 見本一覧',back,{class:'back-btn'}),E('h1',{class:'page-title',tabindex:'-1',text:chosen.labelJa}),E('p',{class:'p',text:chosen.summaryJa}),swatches(draft),E('p',{class:'p p--note',text:'衣装データのプレビューです。画像生成の結果ではありません。'}));
if(message)host.appendChild(E('p',{role:'status',text:message}));
host.appendChild(button('配色を変える',function(){colorOpen=!colorOpen;drawPreview();host.querySelector('#preview-palette').focus({preventScroll:true});},{id:'preview-palette','aria-expanded':String(colorOpen)}));
if(colorOpen){['primary','secondary','accent'].forEach(function(k,i){var id='preview-color-'+k,select=E('select',{id:id,class:'cf-select'});select.appendChild(E('option',{value:'',text:'未選択'}));D.colors.forEach(function(c){select.appendChild(E('option',{value:c.id,text:c.labelJa}));});select.value=draft.palette[k]||'';select.addEventListener('change',function(){draft.palette[k]=select.value||null;
  host.querySelector('.discovery-swatches').replaceWith(swatches(draft));
  host.querySelector('.prompt-text').textContent=C.generator.short(draft);
});host.appendChild(E('label',{for:id,text:['主色','副色','差し色'][i]}));host.appendChild(select);});}
if(confirming){host.appendChild(E('p',{text:'現在の衣装を置き換えます。未保存の変更も置き換わります。',class:'p p--warn'}));host.appendChild(button('この衣装に置き換える',doAdopt,{'data-preset-confirm':'true'}));host.appendChild(button('キャンセル',function(){confirming=false;drawPreview();host.querySelector('[data-preset-adopt]').focus();}));}
else host.appendChild(button('この衣装をアレンジ →',doAdopt,{'data-preset-adopt':'true',class:'btn btn--primary'}));
host.appendChild(E('details',{class:'card'},[E('summary',{text:'英文を試し読み'}),E('p',{class:'prompt-text',text:C.generator.short(draft)})]));
var list=filter(browsing);host.appendChild(button('別の候補を見る',function(){var p=pick(list,last);if(p)goPreview(p);},{disabled:!list.length}));host.appendChild(button('一覧に戻る',back));}
function drawList(){host.replaceChildren(E('a',{href:'#/',class:'back-btn',text:'← 開始画面'}),E('h1',{class:'page-title',text:'見本から選ぶ'}),E('p',{class:'p',text:'衣装を試して、気に入ったら使い始めましょう。'}));var search=E('input',{id:'preset-search',type:'search',class:'name-input',placeholder:'名前・説明・別名で検索'});search.value=browsing.query;host.appendChild(E('label',{for:'preset-search',text:'衣装を検索'}));host.appendChild(search);
var filters=E('details',{class:'card catalog-filters',open:browsing.filtersOpen},[E('summary',{text:'種類・雰囲気で絞り込む'})]);host.appendChild(filters);
filters.addEventListener('toggle',function(){if(filters.isConnected)browsing.filtersOpen=filters.open;});
function select(id,label,rows,key){var s=E('select',{id:id,class:'cf-select'});s.appendChild(E('option',{value:'',text:'すべて'}));rows.forEach(function(r){s.appendChild(E('option',{value:r.id,text:r.labelJa}));});s.value=browsing[key];s.addEventListener('change',function(){browsing[key]=s.value;browsing.page=0;results();});filters.appendChild(E('label',{for:id,text:label}));filters.appendChild(s);}
select('preset-theme','特集',D.presetThemes||[],'theme');
var subWrap=E('div',{id:'preset-sub-wrap'});filters.appendChild(subWrap);
function drawSub(){subWrap.replaceChildren();var list=subOptions(browsing.theme);if(!list.length){browsing.sub='';return;}if(!U.byId(list,browsing.sub))browsing.sub='';var s=E('select',{id:'preset-sub',class:'cf-select'});s.appendChild(E('option',{value:'',text:'すべて'}));list.forEach(function(r){s.appendChild(E('option',{value:r.id,text:r.labelJa}));});s.value=browsing.sub;s.addEventListener('change',function(){browsing.page=0;browsing.sub=s.value;results();});subWrap.appendChild(E('label',{for:'preset-sub',text:browsing.theme==='seasonal'?'行事':'着ぐるみの種類'}));subWrap.appendChild(s);}
host.querySelector('#preset-theme').addEventListener('change',function(){drawSub();results();});drawSub();
select('preset-category','主分類',D.presetCategories,'category');select('preset-mood','雰囲気',D.presetMoods.map(function(m){return {id:m,labelJa:m};}),'mood');
var count=E('p',{role:'status',id:'preset-count'}),random=button('この条件でおまかせ',function(){var p=pick(filter(browsing),last);if(p)goPreview(p);},{id:'preset-random'}),cards=E('div',{class:'discovery-grid'});host.appendChild(count);filters.appendChild(button('絞り込みを解除',function(){browsing.query=browsing.category=browsing.mood=browsing.theme=browsing.sub='';search.value='';browsing.page=0;host.querySelector('#preset-category').value='';host.querySelector('#preset-mood').value='';host.querySelector('#preset-theme').value='';drawSub();results();}));host.appendChild(random);host.appendChild(cards);
var pager=E('nav',{class:'row','aria-label':'見本のページ'});host.appendChild(pager);
function results(){var list=filter(browsing),size=12,start=browsing.page*size;
count.textContent=list.length+'件'+(list.length?' · '+(start+1)+'〜'+Math.min(start+size,list.length)+'件を表示':'');
pager.replaceChildren();
function changePage(delta){browsing.page+=delta;results();var first=cards.querySelector('button');if(first)first.focus();}
if(start>0)pager.appendChild(button('前の見本',function(){changePage(-1);}));
if(start+size<list.length)pager.appendChild(button('次の見本',function(){changePage(1);}));
random.disabled=!list.length;cards.replaceChildren();if(!list.length)cards.appendChild(E('p',{text:'一致する衣装がありません。絞り込みを解除してください。'}));list.slice(start,start+size).forEach(function(p){var b=button('',function(){goPreview(p);},{class:'card card--tap','data-preset':p.id});b.appendChild(E('h2',{class:'card-title',text:p.labelJa}));b.appendChild(E('p',{class:'p',text:p.summaryJa}));b.appendChild(E('p',{class:'p p--note',text:p.moodTags.slice(0,3).concat(labels(D.kigurumiTypes,[p.kigurumiType]).filter(Boolean),labels(D.presetEvents,p.eventTags).slice(0,2)).join('・')}));b.appendChild(swatches(create(p.id)));cards.appendChild(b);});}
search.addEventListener('input',function(){browsing.page=0;browsing.query=search.value;results();});results();}
chosen=params && U.byId(D.presets,params[0]);
if(chosen){last=chosen.id;draft=create(last);drawPreview();}
else {
  drawList();
  if(last)g.requestAnimationFrame(function(){
    if(!host.isConnected)return;
    g.scrollTo(0,browsing.scroll);
    var card=host.querySelector('[data-preset="'+last+'"]');if(card)card.focus({preventScroll:true});
  });
}
return host;}
C.presetCatalog={normalizeSearch:normalize,filter:filter,subOptions:subOptions,pick:pick,create:create,adopt:adopt,view:view};C.routes['/presets']=view;
})(window);
