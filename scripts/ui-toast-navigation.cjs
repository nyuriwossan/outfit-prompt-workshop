/* Route changes dismiss old notifications; same-screen redraws keep them. */
const fs=require('fs'),path=require('path'),http=require('http'),pw=require('playwright');
const root=path.resolve(__dirname,'..'),engine=process.env.CPW_ENGINE||'chromium';
const assert=(value,message)=>{if(!value)throw Error(message);};
const server=http.createServer((req,res)=>{
  const u=new URL(req.url,'http://localhost'),file=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  try{res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{channel:'msedge'}:{})});
  const report={engine,cases:[],errors:[]};
  try{
    const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true}),page=await context.newPage();
    page.on('pageerror',error=>report.errors.push(error.message));
    await page.goto('http://127.0.0.1:'+server.address().port+'/');
    await page.evaluate(()=>{const C=CPW;C.state.load(C.schema.normalize({name:'通知テスト',garment:{category:'dress',subtype:'cocktail_dress'}}));location.hash='#/workshop';});
    await page.locator('#outfit-name').waitFor();
    await page.getByRole('button',{name:'保存する',exact:true}).click();
    assert(await page.locator('#toast').evaluate(el=>el.classList.contains('is-visible')),'save notification missing');
    const saved=await page.evaluate(()=>JSON.stringify(CPW.state.outfit));
    await page.locator('a[href="#/output"]').click();await page.locator('#panel-concept').waitFor({state:'detached'});
    assert(await page.locator('#toast').evaluate(el=>!el.classList.contains('is-visible')),'BUG-001: save notification survived route change');
    assert(await page.evaluate(()=>CPW.ui._toastTimer===null&&document.querySelector('#toast').textContent===''),'dismiss must clear timer and live-region text');
    assert(await page.evaluate(saved=>JSON.stringify(CPW.state.outfit)===saved,saved),'navigation changed outfit');report.cases.push('save then output dismisses without changing outfit');

    await page.evaluate(()=>{location.hash='#/library';});await page.locator('#import-file').waitFor({state:'attached'});
    await page.getByRole('button',{name:'複製',exact:true}).first().click();
    assert(await page.locator('#toast').evaluate(el=>el.classList.contains('is-visible')&&el.textContent==='複製しました'),'same-screen duplicate notification disappeared');report.cases.push('duplicate redraw keeps success notification');
    const payload=await page.evaluate(()=>CPW.store.exportOutfit(CPW.state.outfit));
    await page.locator('#import-file').setInputFiles({name:'outfit.json',mimeType:'application/json',buffer:Buffer.from(payload)});
    await page.waitForFunction(()=>document.querySelector('#toast').textContent.includes('取り込みました'));
    assert(await page.locator('#toast').evaluate(el=>el.classList.contains('is-visible')),'same-screen import notification disappeared');report.cases.push('import redraw keeps success notification');

    await page.evaluate(()=>{location.hash='#/gacha';});await page.locator('#gacha-roll').click();await page.locator('[data-adopt="1"]').click();
    await page.locator('#panel-concept').waitFor();
    assert(await page.locator('#toast').evaluate(el=>!el.classList.contains('is-visible')),'adoption notification survived automatic navigation');
    assert(await page.evaluate(()=>!!CPW.state.outfit.palette.primary),'gacha adoption failed');report.cases.push('gacha adoption applies outfit and dismisses on workshop navigation');

    await page.getByRole('button',{name:'保存する',exact:true}).click();
    await page.evaluate(()=>{location.hash='#/setup/zero';});await page.getByRole('button',{name:'設計台をひらく',exact:true}).click();await page.locator('#outfit-name').waitFor();
    assert(await page.evaluate(()=>CPW.state.outfit.name===''&&!document.querySelector('#toast').classList.contains('is-visible')&&CPW.store.listOutfits().length>=2),'old save notification leaked into new design or saved library lost');report.cases.push('zero design clears old notification and retains saved library');

    await page.evaluate(()=>{CPW.ui.toast('元画面の通知');});await page.goBack();await page.getByRole('button',{name:'設計台をひらく',exact:true}).waitFor();
    assert(await page.locator('#toast').evaluate(el=>!el.classList.contains('is-visible')),'back retained notification');report.cases.push('browser back dismisses notification');
    await page.evaluate(()=>CPW.ui.toast('新しい通知'));
    assert(await page.locator('#toast').evaluate(el=>el.classList.contains('is-visible')),'new notification unavailable');
    await page.waitForFunction(()=>!document.querySelector('#toast').classList.contains('is-visible'),null,{timeout:4000});report.cases.push('new notification still expires automatically');
    assert(!report.errors.length,report.errors.join('\n'));
    if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2));console.log(JSON.stringify(report));
  }finally{await browser.close();server.close();}
})().catch(error=>{console.error(error);server.close();process.exitCode=1;});
