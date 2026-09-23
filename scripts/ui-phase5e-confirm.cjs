/* Verify adoption in a real sandbox that disallows browser-native dialogs. */
const fs=require('fs'),path=require('path'),http=require('http'),pw=require('playwright');
const root=path.resolve(__dirname,'..'),engine=process.env.CPW_ENGINE||'chromium';
const output=path.resolve(process.argv[2]||path.join(root,'verification/phase5e-hotfix-confirm-'+engine+'.json'));
const assert=(v,m)=>{if(!v)throw Error(m);};
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost');
  if(u.pathname==='/sandbox.html'){
    res.setHeader('Content-Type','text/html');res.end('<meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0}iframe{border:0;width:100%;height:100vh}</style><iframe sandbox="allow-scripts allow-same-origin" src="/"></iframe>');return;
  }
  const f=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));
  if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404).end();}
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));
  const browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{channel:'msedge'}:{})});
  const report={engine,browser:browser.version(),cases:[],errors:[],nativeIPhone:false};
  try{
    for(const width of [375,390,430]){
      const context=await browser.newContext({viewport:{width,height:844},hasTouch:true,isMobile:true}),page=await context.newPage();
      page.on('pageerror',e=>report.errors.push(e.stack));page.on('dialog',async d=>{report.errors.push('Unexpected native dialog');await d.dismiss();});
      for(const motif of ['mille_feuille','deep_sea'])for(const mode of ['new','preserve'])for(const index of [0,1,2]){
        await page.goto('http://127.0.0.1:'+server.address().port+'/sandbox.html');
        const frame=page.frames().find(f=>f!==page.mainFrame());await frame.waitForFunction(()=>window.CPW?.conceptFashion);
        await frame.evaluate(()=>{
          const C=CPW;C.state.load(C.schema.normalize({garment:{category:'dress',subtype:'cocktail_dress'},palette:{primary:'jet_black'}}));
          window.original=JSON.stringify(C.state.outfit);window.nativeCalls=0;const confirm=window.confirm;
          window.confirm=function(...args){nativeCalls++;return confirm.apply(this,args);};
          const build=C.conceptFashion.buildCandidates;C.conceptFashion.buildCandidates=function(s,opts){window.generationMode=opts.mode;const result=build.call(this,s,opts);window.previews=JSON.parse(JSON.stringify(result));return result;};
          location.hash='#/concept_fashion';
        });
        await frame.locator('#cf-categoryId').selectOption(motif==='mille_feuille'?'food':'nature');
        if(motif==='mille_feuille')await frame.locator('#cf-foodGroupId').selectOption('sweets');
        await frame.locator('#cf-motifId').selectOption(motif);await frame.getByRole('button',{name:'4 衣装',exact:true}).click();
        for(const selected of [mode==='new'?'preserve':'new',mode]){
          await frame.locator('[data-cf-mode="'+selected+'"]').click();
          const styles=await frame.locator('[data-cf-mode]').evaluateAll(nodes=>nodes.map(n=>({pressed:n.getAttribute('aria-pressed'),background:getComputedStyle(n).backgroundColor})));
          assert(styles.filter(s=>s.pressed==='true').length===1,'exclusive mode');assert(styles[0].background!==styles[1].background,'mode selection invisible');
        }
        if(index===0&&motif==='mille_feuille'&&mode==='new')await page.screenshot({path:path.join(path.dirname(output),'phase5e-hotfix-mode-'+engine+'-'+width+'.png')});
        await frame.getByRole('button',{name:'5 反映',exact:true}).click();await frame.locator('#cf-generate').click();
        assert(await frame.evaluate(mode=>generationMode===mode,mode),'wrong generation mode');
        await frame.locator('[data-cf-adopt="'+index+'"]').click();await frame.locator('[data-cf-confirm="apply"]').waitFor({state:'visible'});
        assert(await frame.evaluate(()=>nativeCalls===0&&original===JSON.stringify(CPW.state.outfit)),'confirmation calls native or changes state');
        await frame.locator('[data-cf-confirm="cancel"]').click();assert(await frame.evaluate(()=>original===JSON.stringify(CPW.state.outfit)),'cancel mutation');
        await frame.locator('[data-cf-adopt="'+index+'"]').click();
        if(index===0&&motif==='mille_feuille'&&mode==='new')await page.screenshot({path:path.join(path.dirname(output),'phase5e-hotfix-confirm-'+engine+'-'+width+'.png')});
        // A second candidate must replace, not reuse, the previous pending confirmation.
        const other=(index+1)%3;await frame.locator('[data-cf-adopt="'+other+'"]').click();
        assert((await frame.getByRole('group',{name:'採用の確認'}).innerText()).includes('案'+['A','B','C'][other]),'stale pending candidate');
        await frame.locator('[data-cf-adopt="'+index+'"]').click();await frame.locator('[data-cf-confirm="apply"]').click();
        await frame.locator('#panel-concept').waitFor({state:'visible'});
        const snapshot=await frame.evaluate(index=>{
          const C=CPW;function content(o){const a=JSON.parse(JSON.stringify(o));delete a.id;delete a.createdAt;delete a.updatedAt;return JSON.stringify(a);}
          if(content(C.state.outfit)!==content(C.schema.normalize(previews[index].outfit)))throw Error('wrong candidate');
          if(location.hash!=='#/workshop'||nativeCalls!==0)throw Error('native confirm dependency');
          C._autosave.flush();return JSON.stringify(C.state.outfit);
        },index);
        await frame.goto(frame.url());await frame.locator('#panel-concept').waitFor({state:'visible'});
        assert(await frame.evaluate(snapshot=>snapshot===JSON.stringify(CPW.state.outfit),snapshot),'reload mismatch');
        assert(await frame.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow');
        report.cases.push({width,motif,mode,index,noNativeConfirm:true,visibleSelection:true,cancel:true,candidateSwitch:true,workshop:true,exactCandidate:true,reload:true,noOverflow:true});
      }
      await context.close();console.log(engine+' '+width+'px restricted dialog: '+report.cases.length+' passed');
    }
    assert(!report.errors.length,report.errors.join('\n'));fs.writeFileSync(output,JSON.stringify(report,null,2));
  }finally{await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
