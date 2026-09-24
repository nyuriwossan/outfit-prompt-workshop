/* Actual adoption clicks for every candidate; Playwright is development-only. */
const fs=require('fs'),path=require('path'),http=require('http'),pw=require('playwright');
const root=path.resolve(__dirname,'..'),engine=process.env.CPW_ENGINE||'chromium';
const out=path.resolve(process.argv[2]||path.join(root,'verification/phase5e-hotfix-ui-'+engine+'.json'));
const assert=(v,m)=>{if(!v)throw Error(m);};
const server=http.createServer((req,res)=>{
  const f=path.resolve(root,'.'+(new URL(req.url,'http://localhost').pathname==='/'?'/index.html':new URL(req.url,'http://localhost').pathname));
  if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404).end();}
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{channel:'msedge'}:{})});
  const report={engine,browser:browser.version(),adoptions:[],conflicts:[],failureHandling:[],errors:[],nativeIPhone:false};
  try{
    for(const width of [375,390,430]){
      const context=await browser.newContext({viewport:{width,height:844},isMobile:true,hasTouch:true}),page=await context.newPage();
      await page.addInitScript(()=>localStorage.setItem('cpw.uiPrefs.v1',JSON.stringify({workshopLevel:'advanced',conceptLevel:'advanced'})));page.on('dialog',async d=>{report.errors.push('Unexpected native dialog: '+d.message());await d.dismiss();});page.on('pageerror',e=>report.errors.push(e.stack));
      const home='http://127.0.0.1:'+server.address().port+'/';
      const noOverflow=async()=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow '+width);
      const prepare=async(spec,mode,seed,conflict)=>{
        await page.goto(home);
        await page.evaluate(({mode,seed,conflict})=>{
          const C=CPW;
          C.state.load(mode==='new'&&seed===1?C.schema.createOutfit():C.schema.normalize({garment:{category:'dress',subtype:'cocktail_dress'},palette:{primary:'jet_black'},decorations:{items:conflict?[{type:'frills'}]:[]},output:{customTags:'Exact User,(Keep_Tag:1.2)'}}));
          window.hotfixBefore=JSON.stringify(C.state.outfit);
          const build=C.conceptFashion.buildCandidates;
          C.conceptFashion.buildCandidates=function(s,opts){const result=build.call(this,s,{...opts,seed});window.hotfixCandidates=JSON.parse(JSON.stringify(result));return result;};
          location.hash='#/concept_fashion';
        },{mode,seed,conflict});
        await page.locator('#cf-categoryId').selectOption(spec.category);
        if(spec.category==='food')await page.locator('#cf-foodGroupId').selectOption('sweets');
        if(spec.category==='traditional'){
          await page.locator('#cf-traditional-regionId').selectOption('east_asia');
          await page.locator('#cf-traditional-attireId').selectOption(spec.id);
        }else await page.locator('#cf-motifId').selectOption(spec.id);
        await page.getByRole('button',{name:'4 衣装',exact:true}).click();
        if(await page.locator('[data-cf-mode]').count()){
          for(const selected of [mode==='new'?'preserve':'new',mode]){
            await page.locator('[data-cf-mode="'+selected+'"]').click();
            assert(await page.locator('[data-cf-mode="'+selected+'"]').getAttribute('aria-pressed')==='true','mode did not switch');
            assert((await page.locator('[data-cf-mode="'+selected+'"]').getAttribute('class')).includes('btn--primary'),'selected mode not highlighted');
            assert((await page.locator('#cf-mode-status').innerText()).includes(selected==='new'?'新しい衣装':'現在の設計を残して'),'missing mode feedback');
          }
        }
        await page.getByRole('button',{name:'5 反映',exact:true}).click();
        if(conflict){await page.locator('#cf-pick-exclusions').selectOption('no_frills');await page.locator('#cf-add-exclusions').click();}
        await page.locator('#cf-generate').click();
        assert(await page.locator('[data-cf-adopt]').count()===3,'expected all candidates '+spec.id);
        assert(await page.evaluate(()=>hotfixBefore===JSON.stringify(CPW.state.outfit)),'preview changed state');
        await noOverflow();
      };
      const verify=async(index,choice)=>{
        await page.waitForURL('**/#/workshop');await page.locator('#panel-concept').waitFor({state:'visible'});
        const checks=await page.evaluate(({index,choice})=>{
          const C=CPW,c=hotfixCandidates[index],expected=C.schema.normalize(choice?C.conceptFashion.resolvePreserveConflict(c,choice):c.outfit);
          function content(o){const copy=JSON.parse(JSON.stringify(o));delete copy.id;delete copy.createdAt;delete copy.updatedAt;return JSON.stringify(copy);}
          const result={exactCandidate:content(expected)===content(C.state.outfit),inspiration:JSON.stringify(expected.concept.inspiration)===JSON.stringify(C.state.outfit.concept.inspiration)};
          window.hotfixAdopted=JSON.stringify(C.state.outfit);C._autosave.flush();return {...result,snapshot:hotfixAdopted};
        },{index,choice});
        assert(checks.exactCandidate,'wrong candidate or fields changed '+index);assert(checks.inspiration,'inspiration lost');
        await noOverflow();await page.reload();await page.locator('#panel-concept').waitFor({state:'visible'});
        assert(await page.evaluate(snapshot=>snapshot===JSON.stringify(CPW.state.outfit),checks.snapshot),'autosave reload differs');await noOverflow();
      };
      const confirmAdoption=async()=>{
        if(await page.locator('[data-cf-confirm="apply"]').count()){
          assert(await page.evaluate(()=>hotfixBefore===JSON.stringify(CPW.state.outfit)),'state changed before replacement confirmation');
          await page.locator('[data-cf-confirm="apply"]').click();
        }
      };
      if(!process.env.CPW_FAILURES_ONLY)for(const spec of [{category:'food',id:'mille_feuille'},{category:'nature',id:'deep_sea'},{category:'living',id:'butterfly'},{category:'material',id:'machine'},{category:'traditional',id:'qipao'}]){
        for(const seed of [1,7,19])for(const mode of ['new','preserve'])for(const index of [0,1,2]){
          await prepare(spec,mode,seed,false);
          await page.locator('[data-cf-adopt="'+index+'"]').click();await confirmAdoption();await verify(index);
          report.adoptions.push({width,category:spec.category,motif:spec.id,seed,mode,index,workshop:true,panel:true,exactCandidate:true,inspiration:true,reload:true,noOverflow:true});
        }
      }
      if(!process.env.CPW_FAILURES_ONLY)for(const index of [0,1,2])for(const choice of ['keep','exclude']){
        await prepare({category:'food',id:'mille_feuille'},'preserve',7,true);
        await page.locator('[data-cf-adopt="'+index+'"]').click();await page.locator('[data-cf-conflict="cancel"]').click();
        assert(await page.evaluate(()=>hotfixBefore===JSON.stringify(CPW.state.outfit)&&location.hash==='#/concept_fashion'),'conflict cancellation mutated state');
        await page.locator('[data-cf-adopt="'+index+'"]').click();
        await page.locator('[data-cf-conflict="'+choice+'"]').click();
        await page.locator('[data-cf-confirm="cancel"]').click();
        assert(await page.evaluate(()=>hotfixBefore===JSON.stringify(CPW.state.outfit)&&location.hash==='#/concept_fashion'),'confirm cancellation mutated state');
        assert((await page.locator('#cf-message').innerText()).includes('キャンセル'),'silent confirmation cancellation');
        await page.locator('[data-cf-conflict="'+choice+'"]').click();await confirmAdoption();await verify(index,choice);
        report.conflicts.push({width,index,choice,cancel:true,confirmCancel:true,reload:true});
      }
      // Deliberately injected failures verify diagnostics and rollback, not the cause of the field report.
      for(const stage of ['resolve','normalize','load','loadAfter']){
        await prepare({category:'food',id:'mille_feuille'},'preserve',7,stage==='resolve');
        if(stage==='resolve')await page.locator('[data-cf-adopt="2"]').click();
        await page.evaluate(stage=>{
          const C=CPW,owner=stage==='resolve'?C.conceptFashion:stage==='normalize'?C.schema:C.state,key=stage==='resolve'?'resolvePreserveConflict':stage==='normalize'?'normalize':'load',original=owner[key];
          window.hotfixFlags={dirty:C.state.dirty,savedId:C.state.savedId};
          window.hotfixRestore=()=>{owner[key]=original;};
          owner[key]=function(...args){if(stage==='loadAfter')original.apply(this,args);throw Error('Injected hotfix '+stage);};
        },stage);
        await page.locator(stage==='resolve'?'[data-cf-conflict="keep"]':'[data-cf-adopt="2"]').click();
        if(stage!=='resolve')await page.locator('[data-cf-confirm="apply"]').click();
        await page.evaluate(()=>hotfixRestore());
        await page.locator('#cf-message').waitFor({state:'visible'});
        assert((await page.locator('#cf-message').innerText()).includes('採用できませんでした'),'silent adoption error '+stage);
        assert(await page.evaluate(()=>hotfixBefore===JSON.stringify(CPW.state.outfit)&&CPW.state.dirty===hotfixFlags.dirty&&CPW.state.savedId===hotfixFlags.savedId&&location.hash==='#/concept_fashion'),'failed adoption modified design '+stage);
        const before=await page.evaluate(()=>{CPW._autosave.flush();return hotfixBefore;});await page.reload();
        assert(await page.evaluate(before=>before===JSON.stringify(CPW.state.outfit),before),'failure autosaved candidate '+stage);
        report.failureHandling.push({width,stage,visibleFailure:true,stateRestored:true,reload:true});
      }
      console.log(engine+' '+width+'px: '+report.adoptions.length+' adoptions, '+report.conflicts.length+' conflicts passed');
      await context.close();
    }
    assert(!report.errors.length,report.errors.join('\n'));report.totalAdoptions=report.adoptions.length;report.totalConflicts=report.conflicts.length;
    fs.writeFileSync(out,JSON.stringify(report,null,2));console.log(JSON.stringify({engine,adoptions:report.totalAdoptions,conflicts:report.totalConflicts,errors:report.errors}));
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
