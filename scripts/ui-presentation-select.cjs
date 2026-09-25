/* Verify native select values and focus after redraw, locally or on Pages. */
const fs=require('fs'),path=require('path'),http=require('http'),pw=require('playwright');
const root=path.resolve(__dirname,'..'),engine=process.env.CPW_ENGINE||'chromium';
const assert=(value,message)=>{if(!value)throw Error(message);};
const server=http.createServer((req,res)=>{const u=new URL(req.url,'http://localhost'),f=path.resolve(root,'.'+(u.pathname==='/'?'/index.html':u.pathname));if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404).end();}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await pw[engine].launch({headless:true,...(engine==='chromium'?{channel:'msedge'}:{})}),report={engine,nativeIPhone:false,cases:[],errors:[]};
try{for(const width of [375,390,430,1280]){
  const context=await browser.newContext({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600}),page=await context.newPage();page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto(process.env.CPW_BASE_URL||'http://127.0.0.1:'+server.address().port+'/');await page.evaluate(()=>{CPW.state.load(CPW.schema.normalize({name:'select test',garment:{category:'dress',subtype:'cocktail_dress'}}));location.hash='#/output';});await page.locator('.presentation-panel summary').click();
  async function choose(id,value){const node=page.locator('#'+id);await node.focus();await node.selectOption(value);assert(await page.locator('#'+id).inputValue()===value,'lost value '+id);assert(await page.locator('#'+id).evaluate(n=>document.activeElement!==n),'redraw reopened/refocused select '+id);assert(await page.locator('.presentation-panel').evaluate(n=>n.open),'presentation section unexpectedly closed');report.cases.push({width,id,value,noAutomaticRefocus:true});}
  await choose('pr-presentation-preset','chair_sit');
  await choose('output-scope','all');
  for(const id of ['pr-presentation-seat','pr-presentation-poseMood','pr-presentation-background','pr-presentation-subject','pr-presentation-rendering-paint','pr-presentation-rendering-finish','pr-presentation-rendering-line']){
    const values=await page.locator('#'+id+' option').evaluateAll(nodes=>nodes.map(n=>n.value).filter(Boolean).slice(0,2));
    for(const value of values.concat(values.slice(-1)))await choose(id,value);
  }
  const expected=await page.evaluate(()=>{CPW._autosave.flush();return JSON.stringify(CPW.state.outfit);});await page.reload();await page.locator('#output-host').waitFor();assert(await page.evaluate(expected=>JSON.stringify(CPW.state.outfit)===expected,expected),'reload changed selection');
  for(const tab of ['短縮版','詳細版','日本語構造一覧'])await page.getByRole('button',{name:tab,exact:true}).click();
  assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+width);
  for(const id of ['cutout_knit','reverse_bunny']){await page.evaluate(()=>{location.hash='#/setup/preset';});const label=await page.evaluate(id=>CPW.util.byId(CPW.data.presets,id).labelJa,id);await page.getByRole('heading',{name:label,exact:true}).click();await page.locator('#panel-concept').waitFor();const text=await page.evaluate(()=>CPW.generator.detailed(CPW.state.outfit));assert(text.includes(id==='cutout_knit'?'virgin killer sweater':'open front bunnysuit'),'preset not reflected '+id);await page.evaluate(()=>CPW._autosave.flush());await page.reload();assert(await page.evaluate(()=>CPW.generator.detailed(CPW.state.outfit))===text,'preset reload '+id);report.cases.push({width,preset:id,adoptAndReload:true});}
  await context.close();
}assert(!report.errors.length,report.errors.join('\n'));if(process.argv[2])fs.writeFileSync(process.argv[2],JSON.stringify(report,null,2));console.log(JSON.stringify({engine,cases:report.cases.length,errors:report.errors}));}finally{await browser.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
