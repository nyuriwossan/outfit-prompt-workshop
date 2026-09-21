/* Optional development QA: npm install --no-save playwright. No app dependency. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('playwright');
const root=path.resolve(__dirname,'..');
const output=path.resolve(process.argv[2]||path.join(root,'..','ui-report'));
fs.mkdirSync(output,{recursive:true});
const server=http.createServer((req,res)=>{
 const pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
 const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
 if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
 try {res.setHeader('Content-Type',file.endsWith('.css')?'text/css':file.endsWith('.js')?'text/javascript':'text/html');res.end(fs.readFileSync(file));}catch{res.writeHead(404).end();}
});
const assert=(v,m)=>{if(!v)throw new Error(m);};
(async()=>{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({headless:true,channel:process.env.CPW_BROWSER_CHANNEL||'msedge'});
 const report={browser:browser.version(),viewports:[],errors:[]};
 try {
 for(const width of [375,390,430]) {
  const page=await browser.newPage({viewport:{width,height:844},deviceScaleFactor:1});
  page.on('pageerror',e=>report.errors.push(e.message));
  await page.goto('http://127.0.0.1:'+server.address().port+'/');
  await page.evaluate(()=>{CPW.state.load({garment:{category:'top_bottom',subtype:'simple_shirt_and_ankle_pants'},parts:{sleeves:'long_sleeves',collar:'point_collar'}});location.hash='#/workshop';});
  await page.locator('#panel-structure').waitFor({state:'attached'});
  for(const id of ['structure','styling','material','condition']){
   const button=page.locator('[aria-controls="panel-'+id+'"]');if(await button.getAttribute('aria-expanded')==='false')await button.click();
  }
  async function dimensions(label){
   const d=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,
    small:[...document.querySelectorAll('button')].filter(b=>b.getClientRects().length&&getComputedStyle(b).visibility!=='hidden').filter(b=>b.getBoundingClientRect().height<43.9||b.getBoundingClientRect().width<43.9).map(b=>({text:b.textContent,size:[b.getBoundingClientRect().width,b.getBoundingClientRect().height]})),
    overflow:[...document.querySelectorAll('.chip')].filter(b=>b.getClientRects().length).filter(b=>{const r=b.getBoundingClientRect();return r.left<0||r.right>innerWidth+1;}).map(b=>b.textContent)}));
   assert(d.scrollWidth<=width,`${width} ${label}: horizontal overflow ${d.scrollWidth}`);assert(!d.small.length,`${width}: tap targets ${JSON.stringify(d.small)}`);assert(!d.overflow.length,`${width}: chips overflow`);return d;
  }
  await dimensions('initial');
  await page.locator('[data-fkey="styling:sleeves_rolled_up"]').click();
  await page.locator('[data-fkey="styling:half_tucked"]').click();
  await page.locator('[data-fkey="styling:collar_loosened"]').click();
  assert(await page.evaluate(()=>CPW.state.outfit.styling.items.length)===2,'third styling was accepted');
  assert(await page.getByText('着こなし・着崩しは2件まで指定できます。',{exact:true}).count()>0,'missing max notice');
  await page.locator('[data-fkey="styling:half_tucked"]').click();
  await page.locator('[data-fkey="styling:collar_loosened"]').click();
  await page.locator('[data-fkey="part:sleeves:sleeveless"]').click();
  assert(await page.locator('#panel-styling').innerText().then(t=>t.includes('英文への出力を休止')),'inactive styling explanation');
  await page.locator('[data-fkey="styling:sleeves_rolled_up"]').click();
  await page.locator('[data-fkey="part:sleeves:long_sleeves"]').click();
  await page.locator('[data-fkey="styling:sleeves_rolled_up"]').click();
  await page.locator('[aria-controls="panel-styling"]').scrollIntoViewIfNeeded();
  await page.screenshot({path:path.join(output,'styling-'+width+'.png')});
  await page.locator('[data-fkey="garment.category:merfolk"]').click();
  assert(!await page.locator('[data-fkey="part:bottoms:ankle_pants"]').count(),'merfolk bottoms shown');
  assert(!await page.locator('[data-fkey="part:asymmetry_detail:asymmetric_skirt_panel"]').count(),'merfolk skirt panel shown');
  await dimensions('merfolk');
  await page.evaluate(()=>{CPW.store.saveDraft(CPW.state.outfit);});
  const before=await page.evaluate(()=>JSON.stringify(CPW.state.outfit.styling));
  await page.reload();await page.locator('#panel-styling').waitFor({state:'attached'});
  assert(await page.evaluate(()=>JSON.stringify(CPW.state.outfit.styling))===before,'save/render styling mismatch');
  // All garment categories and long labels at each width.
  for(const cat of await page.evaluate(()=>CPW.data.garmentCategories.map(x=>x.id))) {
   await page.evaluate(id=>{const g=CPW.data.garments.find(g=>g.category===id);CPW.state.load({garment:{category:id,subtype:g.id},decorations:{items:[{type:'decorative_topstitching'}]}});CPW.render();},cat);
   for(const id of ['structure','styling','material']){const b=page.locator('[aria-controls="panel-'+id+'"]');if(await b.getAttribute('aria-expanded')==='false')await b.click();}
   await dimensions(cat);
  }
  report.viewports.push({width,horizontalOverflow:false,tapTargetsAtLeast44:true,chipWrapping:true,stylingAddRemove:true,thirdRejected:true,categorySwitch:true,merfolk:true,saveReload:true,categories:9});
  await page.close();
 }
 const testsPage=await browser.newPage();
 await testsPage.goto('http://127.0.0.1:'+server.address().port+'/tests.html');
 const summary=await testsPage.locator('#summary').innerText();
 assert(!summary.includes('失敗'),summary); report.browserTests=summary;
 await testsPage.close();
 assert(!report.errors.length,'browser errors: '+report.errors.join('; '));
 fs.writeFileSync(path.join(output,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
 } finally {await browser.close();server.close();}
})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
