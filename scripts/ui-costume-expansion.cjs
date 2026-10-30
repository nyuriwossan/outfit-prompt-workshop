/* Optional development QA for the costume expansion (fold UI, kigurumi / full mascot, preset themes).
 * The published app has no dependencies; this script needs a local Playwright.
 *   node scripts/ui-costume-expansion.cjs [report.json]
 *   CPW_ENGINE=webkit node scripts/ui-costume-expansion.cjs   (when a WebKit build is installed) */
const fs=require('fs'),path=require('path'),http=require('http'),pw=require('playwright');
const root=path.resolve(__dirname,'..'),engine=process.env.CPW_ENGINE||'chromium';
const out=path.resolve(process.argv[2]||path.join(root,'verification/costume-expansion-ui-'+engine+'.json'));
const shots=path.join(path.dirname(out),'screenshots');fs.mkdirSync(shots,{recursive:true});
const assert=(v,m)=>{if(!v)throw Error(m);};
const server=http.createServer((req,res)=>{const p=decodeURIComponent(new URL(req.url,'http://x').pathname),f=path.resolve(root,'.'+(p==='/'?'/index.html':p));if(!f.startsWith(root+path.sep)){res.writeHead(403).end();return;}try{res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(fs.readFileSync(f));}catch{res.writeHead(404).end();}});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const browser=await pw[engine].launch({headless:true});const report={engine,browser:browser.version(),widths:[],errors:[],note:'Automated emulation; not an iPhone Safari device test.'};
try{for(const width of [375,390,430]){
 const ctx=await browser.newContext({viewport:{width,height:844},isMobile:engine!=='firefox',hasTouch:true}),page=await ctx.newPage(),r={width};
 page.on('pageerror',e=>report.errors.push(width+': '+e.message));
 await page.addInitScript(()=>{if(!sessionStorage.getItem('cpw-test-init')){localStorage.clear();localStorage.setItem('cpw.uiPrefs.v1',JSON.stringify({workshopLevel:'advanced',conceptLevel:'simple'}));sessionStorage.setItem('cpw-test-init','1');}});
 const base='http://127.0.0.1:'+server.address().port+'/';await page.goto(base);
 const noOverflow=async(l)=>assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'horizontal overflow '+l+' '+width);
 const smallTargets=()=>page.evaluate(()=>[...document.querySelectorAll('button, a.btn, a.bb-btn, select')].filter(b=>b.getClientRects().length&&getComputedStyle(b).visibility!=='hidden').filter(b=>{const r=b.getBoundingClientRect();return r.height<43.5||r.width<43.5;}).map(b=>(b.getAttribute('data-fold')||b.getAttribute('data-fkey')||b.className)+':'+Math.round(b.getBoundingClientRect().height)));
 const snapshot=()=>page.evaluate(()=>({o:JSON.stringify(CPW.state.outfit),dirty:CPW.state.dirty,s:CPW.generator.short(CPW.state.outfit),d:CPW.generator.detailed(CPW.state.outfit)}));
 await page.evaluate(()=>{CPW.state.load({name:'折りたたみ確認',garment:{category:'uniform',subtype:'business_suit'},materials:{primary:'wool'},palette:{primary:'deep_navy',secondary:'pure_white'},decorations:{density:1,items:[{type:'silver_embroidery',placements:['collar'],role:'support',size:'medium',quantity:'few'}]},parts:{sleeves:'long_sleeves'}},{saved:false});location.hash='#/workshop';});
 await page.locator('#panel-structure').waitFor({state:'attached'});
 for(const id of ['structure','material']){const b=page.locator('[aria-controls="panel-'+id+'"]');if(await b.getAttribute('aria-expanded')==='false')await b.click();}
 /* 1. 未設定の任意項目は閉じ、設定済みは要約を出す */
 const collar=page.locator('[data-fold="part:collar"]');assert(await collar.getAttribute('aria-expanded')==='false','optional unset field starts closed');
 assert((await page.locator('[data-field="part:collar"] .fold-state').innerText()).includes('未設定'),'unset label');
 assert((await page.locator('[data-field="part:sleeves"] .fold-summary').innerText()).includes('長袖'),'filled summary in Japanese');
 assert((await page.locator('[data-field="part:bottoms"] .fold-state').innerText()).includes('必須'),'required unset is distinguishable');
 assert(await page.locator('#'+await collar.getAttribute('aria-controls')+' button').first().evaluate(b=>b.offsetParent===null),'closed panel controls are not focusable/visible');
 r.closedDefaults=true;
 /* 2. 開閉だけでは衣装・dirty・英文が変わらない */
 const before=await snapshot();
 await collar.click();assert(await collar.getAttribute('aria-expanded')==='true','opens');await collar.click();await collar.click();
 await page.locator('[data-fold="materials.secondary"]').click();await page.locator('[data-fold="materials.secondary"]').click();
 const after=await snapshot();assert(JSON.stringify(before)===JSON.stringify(after),'toggling folds must not change outfit, dirty or prompts');r.toggleImmutable=true;
 /* 3. 開いて選ぶ → 要約更新・フォーカス維持・スクロール維持 → 閉じても値保持 */
 const chip=page.locator('[data-fkey="part:collar:peak_lapels"]');await chip.scrollIntoViewIfNeeded();const y0=await page.evaluate(()=>scrollY);
 await chip.click();assert(await page.evaluate(()=>CPW.state.outfit.parts.collar==='peak_lapels'),'chip selection applied');
 assert(await page.evaluate(()=>document.activeElement&&document.activeElement.getAttribute('data-fkey')==='part:collar:peak_lapels'),'focus retained on the chip');
 assert(Math.abs((await page.evaluate(()=>scrollY))-y0)<80,'no jump to top after selection');
 assert((await page.locator('[data-field="part:collar"] .fold-summary').innerText()).includes('ピークドラペル')||(await page.locator('[data-field="part:collar"] .fold-summary').innerText()).length>0,'summary updated');
 await collar.click();assert(await collar.getAttribute('aria-expanded')==='false');assert(await page.evaluate(()=>CPW.state.outfit.parts.collar==='peak_lapels'),'value kept while folded');
 assert((await page.evaluate(()=>CPW.generator.short(CPW.state.outfit))).includes('peak lapels'),'folded value still generates');
 r.selectAndFold=true;
 /* 4. 「設定を解除」だけが値を消す */
 await collar.click();await page.locator('[data-fold-clear="part:collar"]').click();assert(await page.evaluate(()=>!CPW.state.outfit.parts.collar),'explicit clear');assert(await page.evaluate(()=>CPW.state.outfit.parts.sleeves==='long_sleeves'),'other values untouched');r.explicitClear=true;
 /* 5. かんたん／こだわりの往復で値・英文が残る */
 const s1=await snapshot();await page.locator('[data-ui-surface="workshop"] [data-ui-level="simple"]').click();await page.locator('[data-ui-surface="workshop"] [data-ui-level="advanced"]').click();
 const s2=await snapshot();assert(s1.o===s2.o&&s1.s===s2.s&&s1.d===s2.d,'level switch keeps values and output');
 assert(await page.locator('[data-fold="part:collar"]').getAttribute('aria-expanded')==='true','open state retained across re-render');r.levelSwitch=true;
 /* 6. 完全マスコットへ：専用部位だけを表示し、通常の頭部・靴は休止として案内 */
 await page.evaluate(()=>{CPW.state.applyPatch({parts:{headwear:'officer_cap',footwear:'sneakers'}});});
 await page.locator('[data-fold="garment.category"]').evaluate(b=>{if(b.getAttribute('aria-expanded')==='false')b.click();});
 await page.locator('[data-fkey="garment.category:full_mascot"]').click();
 await page.locator('[data-fold="garment.subtype"]').waitFor();await page.locator('[data-fkey="garment.subtype:full_mascot_suit"]').click();
 assert(await page.locator('[data-fold="part:creature_motif"]').count()===1&&await page.locator('[data-fold="part:mascot_head"]').count()===1,'mascot fields shown');
 assert(await page.locator('[data-fold="part:headwear"]').count()===0&&await page.locator('[data-fold="part:footwear"]').count()===0,'human headwear/footwear hidden');
 assert(await page.locator('[data-dormant-parts]').count()===1,'dormant notice');
 assert(await page.evaluate(()=>CPW.state.outfit.parts.headwear==='officer_cap'),'dormant value kept');
 await page.locator('[data-fold="part:creature_motif"]').click();await page.locator('[data-fkey="part:creature_motif:penguin"]').click();
 const mascot=await page.evaluate(()=>CPW.generator.short(CPW.state.outfit));assert(/penguin mascot costume/.test(mascot)&&/no human face visible/.test(mascot)&&!/officer cap|sneakers/.test(mascot),mascot);
 await noOverflow('mascot');await page.screenshot({path:path.join(shots,'costume-mascot-'+engine+'-'+width+'.png'),fullPage:true});
 /* 戻すと復帰 */
 await page.locator('[data-fold="garment.category"]').evaluate(b=>{if(b.getAttribute('aria-expanded')==='false')b.click();});await page.locator('[data-fkey="garment.category:uniform"]').click();
 assert(await page.evaluate(()=>CPW.state.outfit.parts.headwear==='officer_cap'&&!!CPW.state.outfit.parts.creature_motif),'values restored / kept');r.mascotCategory=true;
 const small=await smallTargets();assert(!small.length,'tap targets under 44px: '+small.slice(0,6).join(' '));await noOverflow('workshop');r.tap44=true;
 /* 下部固定バーと最後の操作が重ならない（ページ末尾までスクロールして確認） */
 await page.evaluate(()=>scrollTo(0,document.body.scrollHeight));const overlap=await page.evaluate(()=>{const bar=document.querySelector('.bottombar').getBoundingClientRect();const items=[...document.querySelectorAll('.acc-item, .card')].filter(e=>e.getClientRects().length);const last=items[items.length-1].getBoundingClientRect();return last.bottom>bar.top+1;});assert(!overlap,'last block overlaps bottom bar');r.bottomBar=true;
 await page.screenshot({path:path.join(shots,'costume-workshop-'+engine+'-'+width+'.png'),fullPage:true});
 /* 7. 保存→再読み込みで復元 */
 await page.evaluate(()=>{CPW.state.load(CPW.presetCatalog.create('shark_mascot'));CPW.state.outfit.name='サメ';CPW.state.saveToLibrary();CPW._autosave.flush();});
 const saved=await page.evaluate(()=>JSON.stringify(CPW.state.outfit.parts));await page.reload();await page.waitForFunction(()=>window.CPW&&CPW.state);
 assert(await page.evaluate(()=>JSON.stringify(CPW.store.listOutfits()[0].parts))===saved,'library survives reload');assert(await page.evaluate(()=>JSON.stringify(CPW.state.outfit.parts))===saved,'draft survives reload');r.reload=true;
 /* 8. プリセット：特集・着ぐるみの種類で絞り込み、プレビューでは状態不変、採用で反映 */
 await page.evaluate(()=>{CPW.state.load({garment:{category:'dress',subtype:'maid_dress'}});location.hash='#/presets';});await page.locator('#preset-theme').waitFor();
 const stateBefore=await page.evaluate(()=>JSON.stringify(CPW.state.outfit));
 await page.locator('#preset-theme').selectOption('kigurumi');await page.locator('#preset-sub').selectOption('full_mascot');
 const n=await page.locator('[data-preset]').count();assert(n>=11,'full mascot presets '+n);
 await page.locator('[data-preset="rabbit_mascot"]').click();await page.getByRole('button',{name:'配色を変える'}).click();await page.locator('#preview-color-primary').selectOption('jet_black');
 assert(await page.evaluate(()=>JSON.stringify(CPW.state.outfit))===stateBefore,'preview/color trial must not change outfit');
 await page.locator('[data-preset-adopt]').click();await page.locator('[data-preset-confirm]').click();
 assert(await page.evaluate(()=>CPW.state.outfit.garment.category==='full_mascot'&&CPW.state.outfit.parts.creature_motif==='rabbit'),'adopted');r.presetThemes=true;
 await page.evaluate(()=>{location.hash='#/';});await page.evaluate(()=>{location.hash='#/presets';});await page.locator('#preset-theme').waitFor();await page.locator('#preset-theme').selectOption('seasonal');
 assert(await page.locator('#preset-sub').count()===1,'event filter appears');await page.locator('#preset-sub').selectOption('halloween');assert(await page.locator('[data-preset="halloween_witch"]').count()===1,'halloween filter');
 await noOverflow('presets');const smallP=await smallTargets();assert(!smallP.length,'preset tap targets '+smallP.slice(0,4).join(' '));
 await page.screenshot({path:path.join(shots,'costume-presets-'+engine+'-'+width+'.png'),fullPage:false});
 report.widths.push(r);await ctx.close();console.log(engine+' '+width+'px passed');
}}catch(e){report.errors.push(String(e&&e.stack||e));console.error(e);process.exitCode=1;}finally{fs.writeFileSync(out,JSON.stringify(report,null,1));await browser.close();server.close();}
if(report.errors.length)process.exitCode=1;})();
