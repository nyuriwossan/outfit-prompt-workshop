/* Isolated wizard draft: never touches state before explicit adoption. */
(function(global){
  'use strict';
  var C=global.CPW,U=C.util,F=C.data.conceptFashion,E=C.ui.el;
  C.routes['/concept_fashion']=function(params){
    var source=U.clone(C.state.outfit),s=C.conceptFashion.normalizeSelection(params[0]==='edit'?source.concept.inspiration:{});
    var step=0,seed=1,mode='new',candidates=[],host=E('section',{class:'screen concept-wizard',id:'concept-wizard'});
    var existing=C.conceptFashion.hasDesign(source);
    function button(text,fn,attrs){return E('button',Object.assign({type:'button',class:'btn',text:text,onclick:fn},attrs||{}));}
    function select(label,list,path){
      var id='cf-'+path.replace(/\./g,'-'),wrap=E('div',{class:'field'}),sel=E('select',{id:id,class:'cf-select'});
      wrap.appendChild(E('label',{for:id,text:label}));sel.appendChild(E('option',{value:'',text:'未選択'}));list.forEach(function(o){sel.appendChild(E('option',{value:o.id,text:o.labelJa}));});sel.value=U.getPath(s,path)||'';
      sel.addEventListener('change',function(){U.setPath(s,path,sel.value||null);s=C.conceptFashion.normalizeSelection(s);candidates=[];draw();var next=host.querySelector('#'+id);if(next)next.focus();});wrap.appendChild(sel);return wrap;
    }
    function multi(label,list,path,max){
      var wrap=E('fieldset',{class:'field'}),chips=E('div',{class:'chips'});wrap.appendChild(E('legend',{text:label}));
      list.forEach(function(o){var on=s[path].indexOf(o.id)>=0;chips.appendChild(button(o.labelJa,function(){var a=s[path].slice(),n=a.indexOf(o.id);if(n>=0)a.splice(n,1);else if(a.length<max)a.push(o.id);else{C.ui.toast(max+'件まで選べます');return;}s[path]=a;candidates=[];draw();host.querySelector('[data-cf="'+path+':'+o.id+'"]').focus();},{class:'chip'+(on?' is-selected':''),'aria-pressed':String(on),'data-cf':path+':'+o.id}));});wrap.appendChild(chips);return wrap;
    }
    function draw(){
      host.textContent='';host.appendChild(E('a',{class:'back-btn',href:params[0]==='edit'?'#/workshop':'#/',text:'← '+(params[0]==='edit'?'設計台へ戻る':'開始画面へ戻る')}));host.appendChild(E('h1',{class:'page-title',text:'コンセプトから作る'}));host.appendChild(E('p',{class:'p p--note',text:'採用するまでは現在の設計を変更しません。'}));
      var nav=E('nav',{class:'cf-steps','aria-label':'コンセプトの手順'});['1 題材','2 方向性','3 衣装ベース','4 反映先'].forEach(function(t,i){nav.appendChild(button(t,function(){step=i;candidates=[];draw();},{'aria-current':step===i?'step':null}));});host.appendChild(nav);
      var panel=E('div',{class:'card stack'});host.appendChild(panel);
      if(step===0){
        panel.appendChild(select('カテゴリ',F.categories,'categoryId'));
        if(s.categoryId==='food')panel.appendChild(select('食べ物・飲み物の分類',F.foodGroups,'foodGroupId'));
        if(s.categoryId==='traditional'){
          panel.appendChild(select('地域',F.regions,'traditional.regionId'));panel.appendChild(select('伝統衣装',F.attires.filter(function(a){return !s.traditional.regionId||a.regionId===s.traditional.regionId;}),'traditional.attireId'));panel.appendChild(select('伝統衣装の扱い',F.treatments,'traditional.treatmentId'));
          panel.appendChild(E('p',{class:'p p--note',text:'文化的な衣装に着想を得た創作です。完全な史実再現を保証するものではありません。'}));
          if(s.traditional.attireId==='qipao')[['襟・胸元','qipaoNecklines','qipaoNecklineId'],['丈','qipaoLengths','qipaoLengthId'],['スリット','qipaoSlits','qipaoSlitId'],['飾り布','qipaoDrapes','qipaoDrapeId']].forEach(function(x){panel.appendChild(select(x[0],F[x[1]],'traditional.'+x[2]));});
        }else if(s.categoryId&&(s.categoryId!=='food'||s.foodGroupId))panel.appendChild(select('モチーフ',F.motifs.filter(function(m){return m.category===s.categoryId&&(s.categoryId!=='food'||m.groupId===s.foodGroupId);}),'motifId'));
        if(s.motifId==='idol')panel.appendChild(select('アイドル衣装の形',F.idolStyles,'idolStyleId'));
        if(s.motifId==='art_nouveau')panel.appendChild(select('植物曲線の形・スリット',F.artNouveauShapes,'artNouveauShapeId'));
        var custom=E('input',{id:'cf-custom',class:'name-input',type:'text',maxlength:'200',placeholder:'例：忘れられた約束'});custom.value=s.customMotif;custom.addEventListener('input',function(){s.customMotif=custom.value;candidates=[];});panel.appendChild(E('label',{for:'cf-custom',text:'任意のカスタムモチーフ'}));panel.appendChild(custom);panel.appendChild(E('p',{class:'p p--note',text:'自由入力の題材から色や素材を推測しません。選んだ方向性と衣装ベースを使います。'}));
      }else if(step===1)panel.appendChild(multi('方向性（2件まで）',F.directions,'directions',2));
      else if(step===2){
        panel.appendChild(select('衣装ベース',F.bases,'baseId'));if(s.baseId==='idol')panel.appendChild(select('アイドル衣装の形',F.idolStyles,'idolStyleId'));
        if(existing){panel.appendChild(E('h2',{class:'card-title',text:'現在の設計との関係'}));[['preserve','現在の設計を残して候補を作る'],['new','新しい衣装として作る']].forEach(function(x){panel.appendChild(button(x[1],function(){mode=x[0];candidates=[];draw();},{'aria-pressed':String(mode===x[0]),'data-cf-mode':x[0]}));});panel.appendChild(E('p',{class:'p p--note',text:'「残す」では既に選んだ項目を保ち、未選択の部分へ提案します。'}));}
      }else{
        panel.appendChild(multi('反映先（4件まで・未選択なら配色／素材／形／装飾）',F.placements,'placements',4));panel.appendChild(select('反映の強さ',F.strengths,'strengthId'));
        if(s.categoryId==='food')panel.appendChild(multi('食品モチーフの扱い（実物は選んだ場合のみ）',F.foodApplications,'foodApplications',8));
        var exposure=E('select',{id:'cf-exposure',class:'cf-select'});exposure.appendChild(E('option',{value:'',text:'未選択'}));['控えめ','やや控えめ','標準','開放的','大胆','非常に大胆'].forEach(function(t,i){exposure.appendChild(E('option',{value:String(i),text:i+'：'+t}));});exposure.value=s.exposure==null?'':String(s.exposure);exposure.addEventListener('change',function(){s.exposure=exposure.value===''?null:Number(exposure.value);candidates=[];});panel.appendChild(E('label',{for:'cf-exposure',text:'衣装の被覆バランス'}));panel.appendChild(exposure);
      }
      var actions=E('div',{class:'cf-actions'});if(step>0)actions.appendChild(button('前へ',function(){step--;draw();}));if(step<3)actions.appendChild(button('次へ',function(){step++;draw();},{id:'cf-next'}));else actions.appendChild(button(candidates.length?'別案を見る':'3案をプレビュー',function(){candidates=C.conceptFashion.buildCandidates(s,{seed:seed++,currentOutfit:source,mode:mode});draw();var target=host.querySelector('#cf-candidates');if(target)target.scrollIntoView({block:'start'});},{id:'cf-generate',class:'btn btn--primary'}));host.appendChild(actions);
      if(candidates.length){var cards=E('div',{id:'cf-candidates',class:'stack','aria-live':'polite'});host.appendChild(cards);candidates.forEach(function(c,i){
        var o=c.outfit,D=C.data,card=E('article',{class:'card cf-candidate'});card.appendChild(E('h2',{class:'card-title',text:'案'+(i+1)+'：'+U.labelOf(D.garments,o.garment.subtype)}));card.appendChild(E('p',{class:'p',text:[U.labelOf(D.colors,o.palette.primary),U.labelOf(D.materials,o.materials.primary),U.labelOf(D.silhouette.fit,o.silhouette.fit)].filter(Boolean).join(' / ')||'設計台で色・素材を自由に選べます'}));
        var parts=Object.keys(o.parts).map(function(k){var slot=U.byId(D.partSlots,k);return slot?slot.labelJa:'';}).filter(Boolean);card.appendChild(E('p',{class:'p p--sub',text:'部位：'+(parts.join('・')||'未選択')+'／装飾：'+(o.decorations.items.map(function(x){return U.labelOf(D.decorations,x.type);}).join('・')||'なし')}));
        var detail=E('details',{});detail.appendChild(E('summary',{text:'反映理由・確認事項（'+c.warnings.filter(function(w){return w.severity==='warning'||w.severity==='hard';}).length+'件）'}));var list=E('ul',{class:'list'});c.reasons.forEach(function(r){list.appendChild(E('li',{text:r.labelJa+' → '+r.reasonJa}));});c.warnings.forEach(function(w){list.appendChild(E('li',{text:w.messageJa||w.titleJa||w.reasonJa||w.id}));});detail.appendChild(list);card.appendChild(detail);
        card.appendChild(button('この案を設計台へ',function(){if(existing&&!global.confirm('現在の設計にこの候補を反映します。未保存の変更を置き換えてよいですか？'))return;var next=U.clone(o);next.updatedAt=U.nowISO();if(mode==='new'){next.id=U.uid('outfit');next.createdAt=next.updatedAt;}C.state.load(next);global.location.hash='#/workshop';},{'data-cf-adopt':String(i),class:'btn btn--primary'}));cards.appendChild(card);
      });}
    }
    draw();return host;
  };
})(typeof window!=='undefined'?window:global);
