/* Optional presentation blocks, separate from garment design and materials. */
(function(global){
  'use strict';var C=global.CPW,D=C.data,P=D.presentation,U=C.util;
  function known(list,id){return U.byId(list,id)?id:null;}
  function normalize(raw){var p=raw&&typeof raw==='object'?raw:{},r=p.rendering||{};
    return {focus:known(D.presentationFocus,p.focus),poseAssist:known(D.poseAssist,p.poseAssist),compositionAssist:known(D.compositionAssist,p.compositionAssist),preset:known(P.presets,p.preset),poseMood:known(P.poseMoods,p.poseMood),seat:known(P.seats,p.seat),background:known(P.backgrounds,p.background),subject:known(P.subjects,p.subject),rendering:{enabled:r.enabled===true,paint:known(P.paints,r.paint),finish:known(P.finishes,r.finish),line:known(P.lines,r.line)}};
  }
  function setScope(o,scope){if(['outfit','pose','all'].indexOf(scope)<0)return;o.output.scope=scope;o.output.includePresentation=scope!=='outfit';o.output.includeBackground=scope==='all';o.output.includeRendering=scope==='all';}
  function empty(){return {short:[],detailed:[]};}
  function phrase(list,id){var x=U.byId(list,id);return x?x.shortPrompt:'';}
  function blocks(o){
    var p=normalize(o.presentation),out={presentation:empty(),background:empty(),rendering:empty()},preset=U.byId(P.presets,p.preset),mer=o.garment.category==='merfolk',sh=[];
    if(o.output.includePresentation){
      var subject=phrase(P.subjects,p.subject);if(subject)sh.push(subject);
      if(preset){
        if(preset.seated){
          var defaults={chair_sit:'chair',sofa_sit:'sofa',floor_sit:'floor'},seat=phrase(P.seats,p.seat||defaults[preset.id]||'chair');
          sh.push('a supported full-body seated fashion pose on '+seat+(mer?', with the tail arranged clearly':preset.id==='crossed_legs'?', with crossed legs':''));
        }else if(mer&&['standing','runway','one_knee','turning_legs','turning','dakimakura'].indexOf(preset.id)>=0)sh.push('a full-body aquatic fashion pose with the tail fully visible');
        else sh.push(preset.shortPrompt);
      }else{
        sh=[subject,phrase(D.presentationFocus,p.focus),phrase(D.poseAssist,p.poseAssist),p.compositionAssist==='plain_bg'&&o.output.scope?null:phrase(D.compositionAssist,p.compositionAssist)].filter(Boolean);
        if(mer)sh=sh.map(function(x){return /standing pose|mid-stride/.test(x)?'aquatic fashion pose':x;});
      }
      var mood=phrase(P.poseMoods,p.poseMood).replace(/^Use /,'');if(mood)sh.push(mood);
      var s=o.concept.inspiration,F=D.conceptFashion,m=s&&U.byId(F.motifs,s.motifId);
      if(m&&m.category==='food'&&s.foodApplications.indexOf('literal')>=0)sh.push(m.shortPrompt.replace(/-inspired$/,'')+' served separately on a tray beside the outfit');
      else if(m&&m.category==='food'&&s.foodApplications.indexOf('prop')>=0)sh.push('a '+m.shortPrompt+' handheld accessory');
      out.presentation={short:sh,detailed:sh.length?[C.generator.joinAnd(sh)]:[]};
    }
    if(o.output.includeBackground){
      var bg=phrase(P.backgrounds,p.background);if(bg)out.background={short:[bg],detailed:[bg]};
      var insp=o.concept.inspiration,motif=insp&&U.byId(D.conceptFashion.motifs,insp.motifId);
      if(motif&&motif.category==='food'&&insp.foodApplications.indexOf('background')>=0){var food='an abstract '+motif.shortPrompt+' backdrop';out.background.short.push(food);out.background.detailed.push(food);}
      if(p.compositionAssist==='plain_bg'&&o.output.scope){out.background.short.push('plain background');out.background.detailed.push('plain background');}
    }
    if(o.output.includeRendering&&p.rendering.enabled){var words=[phrase(P.paints,p.rendering.paint),phrase(P.finishes,p.rendering.finish),phrase(P.lines,p.rendering.line)].filter(Boolean);out.rendering={short:words,detailed:words.length?['rendered with '+C.generator.joinAnd(words)]:[]};}
    return out;
  }
  var expanded=false;
  function controls(o,redraw){
    var E=C.ui.el,p=normalize(o.presentation),wrap=E('details',{class:'card presentation-panel',open:expanded?true:null});wrap.appendChild(E('summary',{text:'演出・見せ方'}));wrap.addEventListener('toggle',function(){if(wrap.isConnected)expanded=wrap.open;});
    function refresh(){expanded=wrap.open;redraw();}
    function select(label,list,path){var id='pr-'+path.replace(/\./g,'-'),sel=E('select',{class:'cf-select',id:id});sel.appendChild(E('option',{value:'',text:'未選択'}));list.forEach(function(x){sel.appendChild(E('option',{value:x.id,text:x.labelJa}));});sel.value=U.getPath(o,path)||'';sel.addEventListener('change',function(){C.state.set(path,sel.value||null);refresh();var n=document.getElementById(id);if(n)n.focus();});wrap.appendChild(E('label',{for:id,text:label}));wrap.appendChild(sel);}
    var scope=E('select',{id:'output-scope',class:'cf-select'});[['outfit','衣装だけ'],['pose','衣装＋ポーズ'],['all','全部']].forEach(function(x){scope.appendChild(E('option',{value:x[0],text:x[1]}));});scope.value=o.output.includeBackground||o.output.includeRendering?'all':o.output.includePresentation?'pose':'outfit';scope.addEventListener('change',function(){setScope(C.state.outfit,scope.value);C.state.touch();refresh();document.getElementById('output-scope').focus();});wrap.appendChild(E('label',{for:'output-scope',text:'出力範囲'}));wrap.appendChild(scope);
    select('見せ方',P.presets,'presentation.preset');select('ポーズの雰囲気',P.poseMoods,'presentation.poseMood');var preset=U.byId(P.presets,p.preset);if(preset&&preset.seated)select('座面（身体と衣装を支える面）',P.seats,'presentation.seat');select('背景',P.backgrounds,'presentation.background');select('人物指定（未選択で衣装のみ）',P.subjects,'presentation.subject');
    wrap.appendChild(E('p',{class:'p p--note',text:'衣装の性別制限はありません。座面は座り構図でのみ出力します。画風は衣装素材とは別の指定です。'}));
    wrap.appendChild(E('button',{class:'btn',type:'button',text:'画風を出力：'+(p.rendering.enabled?'ON':'OFF'),'aria-pressed':String(p.rendering.enabled),id:'rendering-enabled',onclick:function(){C.state.set('presentation.rendering.enabled',!p.rendering.enabled);refresh();}}));
    select('塗り',P.paints,'presentation.rendering.paint');select('仕上げ',P.finishes,'presentation.rendering.finish');select('線',P.lines,'presentation.rendering.line');return wrap;
  }
  C.presentation={normalize:normalize,setScope:setScope,blocks:blocks,controls:controls};
})(typeof window!=='undefined'?window:global);
