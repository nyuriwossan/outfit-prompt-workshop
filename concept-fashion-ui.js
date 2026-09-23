/* Isolated wizard draft: never touches state before explicit adoption. */
(function(global){
  'use strict';
  var C=global.CPW,U=C.util,F=C.data.conceptFashion,E=C.ui.el;
  C.routes['/concept_fashion']=function(params){
    var source=U.clone(C.state.outfit),s=C.conceptFashion.normalizeSelection(params[0]==='edit'?source.concept.inspiration:{});
    var step=0,seed=1,mode='new',candidates=[],secondaryOpen=!!(s.secondary.categoryId||s.secondary.customMotif),randomProfile='all',message='',pendingAdopt=-1,host=E('section',{class:'screen concept-wizard',id:'concept-wizard'});
    var existing=C.conceptFashion.hasDesign(source);
    function button(text,fn,attrs){return E('button',Object.assign({type:'button',class:'btn',text:text,onclick:fn},attrs||{}));}
    function select(label,list,path){
      var id='cf-'+path.replace(/\./g,'-'),wrap=E('div',{class:'field'}),sel=E('select',{id:id,class:'cf-select'});
      wrap.appendChild(E('label',{for:id,text:label}));sel.appendChild(E('option',{value:'',text:'未選択'}));list.forEach(function(o){sel.appendChild(E('option',{value:o.id,text:o.labelJa}));});sel.value=U.getPath(s,path)||'';
      sel.addEventListener('change',function(){U.setPath(s,path,sel.value||null);s=C.conceptFashion.normalizeSelection(s);candidates=[];message='';pendingAdopt=-1;draw();});wrap.appendChild(sel);return wrap;
    }
    function multi(label,list,path,max){
      var wrap=E('fieldset',{class:'field'}),chips=E('div',{class:'chips'});wrap.appendChild(E('legend',{text:label}));
      list.forEach(function(o){var on=U.getPath(s,path).indexOf(o.id)>=0;chips.appendChild(button(o.labelJa,function(){var a=U.getPath(s,path).slice(),n=a.indexOf(o.id);if(n>=0)a.splice(n,1);else if(a.length<max)a.push(o.id);else{C.ui.toast(max+'件まで選べます');return;}U.setPath(s,path,a);candidates=[];draw();host.querySelector('[data-cf="'+path+':'+o.id+'"]').focus();},{class:'chip'+(on?' is-selected':''),'aria-pressed':String(on),'data-cf':path+':'+o.id}));});wrap.appendChild(chips);return wrap;
    }
    function compactMulti(label,list,path,max){
      var wrap=E('fieldset',{class:'field'}),id='cf-pick-'+path.replace(/\./g,'-'),pick=E('select',{id:id,class:'cf-select'}),chosen=U.getPath(s,path);
      wrap.appendChild(E('legend',{text:label+'（'+max+'件まで）'}));wrap.appendChild(E('label',{for:id,text:label+'の候補'}));
      pick.appendChild(E('option',{value:'',text:'追加する項目を選ぶ'}));list.forEach(function(x){pick.appendChild(E('option',{value:x.id,text:x.labelJa}));});wrap.appendChild(pick);
      wrap.appendChild(button('追加',function(){if(!pick.value)return;if(chosen.indexOf(pick.value)>=0)return;if(chosen.length>=max){C.ui.toast(label+'は'+max+'件まで指定できます。');return;}U.setPath(s,path,chosen.concat([pick.value]));candidates=[];message='';draw();},{id:'cf-add-'+path.replace(/\./g,'-')}));
      var chips=E('div',{class:'chips'});chosen.forEach(function(id){chips.appendChild(button(U.labelOf(list,id)+' ×',function(){U.setPath(s,path,chosen.filter(function(x){return x!==id;}));candidates=[];draw();},{class:'chip is-selected','data-cf-selected':path+':'+id,'aria-label':U.labelOf(list,id)+'を削除'}));});wrap.appendChild(chips);return wrap;
    }
    function adopt(c,choice){
      var next=c.conflicts&&c.conflicts.length?C.conceptFashion.resolvePreserveConflict(c,choice):U.clone(c.outfit);
      if(!next){message='除外条件と衣装の基本構造が競合しています。衣装ベースまたは除外条件を見直してください。';draw();return;}
      if(existing&&!global.confirm('現在の設計にこの候補を反映します。未保存の変更を置き換えてよいですか？'))return;
      next.updatedAt=U.nowISO();if(mode==='new'){next.id=U.uid('outfit');next.createdAt=next.updatedAt;}C.state.load(next);global.location.hash='#/workshop';
    }
    function draw(){
      host.textContent='';host.appendChild(E('a',{class:'back-btn',href:params[0]==='edit'?'#/workshop':'#/',text:'← '+(params[0]==='edit'?'設計台へ戻る':'開始画面へ戻る')}));host.appendChild(E('h1',{class:'page-title',text:'コンセプトから作る'}));host.appendChild(E('p',{class:'p p--note',text:'採用するまでは現在の設計を変更しません。'}));
      var nav=E('nav',{class:'cf-steps','aria-label':'コンセプトの手順'});['1 題材','2 世界・人物','3 デザイン','4 衣装','5 反映'].forEach(function(t,i){nav.appendChild(button(t,function(){step=i;candidates=[];pendingAdopt=-1;message='';draw();},{'aria-current':step===i?'step':null}));});host.appendChild(nav);
      var panel=E('div',{class:'card stack'});host.appendChild(panel);
      if(step===0){
        var random=E('select',{id:'cf-random-profile',class:'cf-select'});F.randomProfiles.forEach(function(x){random.appendChild(E('option',{value:x.id,text:x.labelJa}));});random.value=randomProfile;random.addEventListener('change',function(){randomProfile=random.value;});panel.appendChild(E('label',{for:'cf-random-profile',text:'おまかせの傾向'}));panel.appendChild(random);panel.appendChild(button('おまかせで題材を作る',function(){s=C.conceptFashion.randomSelection(randomProfile,seed++);secondaryOpen=!!s.secondary.motifId;candidates=[];message='';draw();},{id:'cf-random'}));
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
        if(!secondaryOpen)panel.appendChild(button('＋ 副題を追加',function(){secondaryOpen=true;draw();},{id:'cf-secondary-add'}));
        else{
          panel.appendChild(E('h2',{class:'card-title',text:'副題'}));panel.appendChild(select('副題カテゴリ',F.categories.filter(function(x){return x.id!=='traditional';}),'secondary.categoryId'));
          if(s.secondary.categoryId)panel.appendChild(select('副題モチーフ',F.motifs.filter(function(m){return m.category===s.secondary.categoryId;}),'secondary.motifId'));
          var customSecondary=E('input',{id:'cf-secondary-custom',class:'name-input',type:'text',maxlength:'200'});customSecondary.value=s.secondary.customMotif;customSecondary.addEventListener('input',function(){s.secondary.customMotif=customSecondary.value;candidates=[];});panel.appendChild(E('label',{for:'cf-secondary-custom',text:'任意のカスタム副題'}));panel.appendChild(customSecondary);
          panel.appendChild(select('混ぜ方',F.blendModes,'blendMode'));
          if(s.motifId&&s.motifId===s.secondary.motifId)panel.appendChild(E('p',{class:'p p--warn',text:'主題と副題が同じです。同じモチーフを二重に反映しません。'}));
          panel.appendChild(button('副題を削除',function(){s.secondary={categoryId:null,motifId:null,customMotif:''};secondaryOpen=false;candidates=[];draw();},{id:'cf-secondary-remove'}));
        }
      }else if(step===1){
        [['世界観','worldviews','worldviewId'],['時代','eras','eraId'],['人物の役割','roles','roleId'],['用途・場面','occasions','occasionId']].forEach(function(x){panel.appendChild(select(x[0],C.data[x[1]],'context.'+x[2]));});
        panel.appendChild(compactMulti('物語状態',F.storyStates,'context.storyStateIds',2));
      }else if(step===2){
        panel.appendChild(multi('方向性（2件まで）',F.directions,'directions',2));
        panel.appendChild(compactMulti('造形言語',F.designLanguages,'designLanguages',2));panel.appendChild(select('解釈方法',F.interpretationModes,'interpretationMode'));
      }else if(step===3){
        panel.appendChild(select('衣装ベース',F.bases,'baseId'));if(s.baseId==='idol')panel.appendChild(select('アイドル衣装の形',F.idolStyles,'idolStyleId'));
        if(existing){panel.appendChild(E('h2',{class:'card-title',text:'現在の設計との関係'}));[['preserve','現在の設計を残して候補を作る'],['new','新しい衣装として作る']].forEach(function(x){panel.appendChild(button(x[1],function(){mode=x[0];candidates=[];draw();},{'aria-pressed':String(mode===x[0]),'data-cf-mode':x[0]}));});panel.appendChild(E('p',{class:'p p--note',text:'「残す」では既に選んだ項目を保ち、未選択の部分へ提案します。'}));}
      }else{
        panel.appendChild(compactMulti('入れたくないもの',F.exclusions,'exclusions',4));
        panel.appendChild(multi('反映先（4件まで・未選択なら配色／素材／形／装飾）',F.placements,'placements',4));panel.appendChild(select('反映の強さ',F.strengths,'strengthId'));
        if(s.categoryId==='food')panel.appendChild(multi('食品モチーフの扱い（実物は選んだ場合のみ）',F.foodApplications,'foodApplications',8));
        var exposure=E('select',{id:'cf-exposure',class:'cf-select'});exposure.appendChild(E('option',{value:'',text:'未選択'}));['控えめ','やや控えめ','標準','開放的','大胆','非常に大胆'].forEach(function(t,i){exposure.appendChild(E('option',{value:String(i),text:i+'：'+t}));});exposure.value=s.exposure==null?'':String(s.exposure);exposure.addEventListener('change',function(){s.exposure=exposure.value===''?null:Number(exposure.value);candidates=[];});panel.appendChild(E('label',{for:'cf-exposure',text:'衣装の被覆バランス'}));panel.appendChild(exposure);
      }
      var actions=E('div',{class:'cf-actions'});if(step>0)actions.appendChild(button('前へ',function(){step--;draw();}));if(step<4)actions.appendChild(button('次へ',function(){step++;draw();},{id:'cf-next'}));else actions.appendChild(button(candidates.length?'別案を見る':'3案をプレビュー',function(){candidates=C.conceptFashion.buildCandidates(s,{seed:seed++,currentOutfit:source,mode:mode});pendingAdopt=-1;message=candidates.length?'':'この条件では候補を作れません。'+s.exclusions.map(function(id){return U.labelOf(F.exclusions,id);}).join('・')+'と衣装ベースの指定を見直してください。';draw();var target=host.querySelector('#cf-candidates');if(target)target.scrollIntoView({block:'start'});},{id:'cf-generate',class:'btn btn--primary'}));host.appendChild(actions);
      if(message)host.appendChild(E('p',{class:'p p--warn',role:'status',text:message}));
      if(candidates.length){var cards=E('div',{id:'cf-candidates',class:'stack','aria-live':'polite'});host.appendChild(cards);candidates.forEach(function(c,i){
        var o=c.outfit,D=C.data,card=E('article',{class:'card cf-candidate'});card.appendChild(E('h2',{class:'card-title',text:'案'+['A','B','C'][c.index]+'：'+c.strategyLabelJa}));card.appendChild(E('p',{class:'p',text:U.labelOf(D.garments,o.garment.subtype)}));card.appendChild(E('p',{class:'p',text:[U.labelOf(D.colors,o.palette.primary),U.labelOf(D.materials,o.materials.primary),U.labelOf(D.silhouette.fit,o.silhouette.fit),U.labelOf(D.silhouette.upperVolume,o.silhouette.upperVolume)].filter(Boolean).join(' / ')||'設計台で色・素材を自由に選べます'}));
        function reasonText(r){return r.labelJa+'：'+r.reasonJa.replace('既存の色IDへ反映','衣装の配色に反映').replace('既存の素材へ反映','衣装の素材に反映');}
        var thoughts=[];['motif','secondary','strategy','context'].forEach(function(source){var r=c.reasons.filter(function(x){return x.source===source;})[0];if(r&&thoughts.length<2)thoughts.push(reasonText(r));});
        card.appendChild(E('p',{class:'p',text:'この案の考え方：'+(thoughts.join('。')||'指定された反映先と現在の設計を優先しています。')}));
        (c.motifContributions||[]).forEach(function(m){card.appendChild(E('p',{class:'p p--note',text:(m.source==='primary'?'主題':'副題')+'「'+U.labelOf(F.motifs,m.motifId)+'」：'+(m.paths.length?m.paths.map(function(p){return {palette:'配色',materials:'素材・柄',parts:'部位・仕立て',silhouette:'形',decorations:'装飾',specialParts:'特殊パーツ',concept:'様式'}[p.split('.')[0]]||'設計';}).filter(function(x,n,a){return a.indexOf(x)===n;}).join('・'):'指定の反映先・制約により構造への追加は控えています。')}));});
        var parts=Object.keys(o.parts).map(function(k){var slot=U.byId(D.partSlots,k),value=o.parts[k];if(!slot||!value)return '';return U.labelOf(slot.options||[],typeof value==='string'?value:value.type)||slot.labelJa;}).filter(Boolean);card.appendChild(E('p',{class:'p p--sub',text:'部位：'+(parts.join('・')||'未選択')+'／装飾：'+(o.decorations.items.map(function(x){return U.labelOf(D.decorations,x.type);}).join('・')||'なし')}));
        var detail=E('details',{});detail.appendChild(E('summary',{text:'反映理由・確認事項（'+c.warnings.filter(function(w){return w.severity==='warning'||w.severity==='hard';}).length+'件）'}));var list=E('ul',{class:'list'});c.reasons.map(reasonText).filter(function(text,n,a){return a.indexOf(text)===n;}).forEach(function(text){list.appendChild(E('li',{text:text}));});c.warnings.forEach(function(w){list.appendChild(E('li',{text:w.messageJa||w.titleJa||w.reasonJa||w.id}));});detail.appendChild(list);card.appendChild(detail);
        if(c.conflicts&&c.conflicts.length)card.appendChild(E('p',{class:'p p--warn',text:'現在の設計に'+c.conflicts.map(function(v){return '「'+v.labelJa+'」';}).filter(function(x,n,a){return a.indexOf(x)===n;}).join('・')+'と競合する既存要素があります。採用時に扱いを選べます。'}));
        card.appendChild(button('この案を設計台へ',function(){if(c.conflicts&&c.conflicts.length){pendingAdopt=i;draw();return;}adopt(c);},{'data-cf-adopt':String(i),class:'btn btn--primary'}));
        if(pendingAdopt===i){card.appendChild(E('p',{class:'p',text:'既存要素を残す場合、競合する除外条件をこの衣装では解除します。'}));card.appendChild(button('既存を残す',function(){adopt(c,'keep');},{'data-cf-conflict':'keep'}));card.appendChild(button('除外条件を優先して外す',function(){adopt(c,'exclude');},{'data-cf-conflict':'exclude'}));card.appendChild(button('キャンセル',function(){pendingAdopt=-1;draw();},{'data-cf-conflict':'cancel'}));}
        cards.appendChild(card);
      });var diversity=C.conceptFashion.diversity(candidates);if(diversity.exception)cards.appendChild(E('p',{class:'p p--note',text:diversity.exception}));}
    }
    draw();return host;
  };
})(typeof window!=='undefined'?window:global);
