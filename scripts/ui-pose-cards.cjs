// Usage: node scripts/ui-pose-cards.cjs CURRENT_URL [SCREENSHOT_DIR] [ORIGINAL_PR3_URL]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const {chromium} = require('playwright');
const {root,load} = require('./test.cjs');
const [url = 'http://127.0.0.1:8000', shots, previous] = process.argv.slice(2);
const catalog = load().data.presentation.poseChoices;
const ids = Array.from(catalog, p => p.id);
const assetDir = path.join(root,'assets','poses');
assert.equal(new Set(ids).size,52);
assert.deepEqual(fs.readdirSync(assetDir).sort(), ids.map(id=>id+'.svg').sort());
const drawings = new Set(ids.map(id => createHash('sha256').update(fs.readFileSync(path.join(assetDir,id+'.svg'))).digest('hex')));
assert.equal(drawings.size,52,'same illustration mapped to multiple IDs');

async function start(page, url) {
  await page.goto(url);
  await page.evaluate(() => {
    const outfit = CPW.schema.normalize({name:'深紅のドレス',garment:{category:'dress',subtype:'cocktail_dress'},
      palette:{primary:'deep_crimson'},presentation:{layoutVersion:1,poseId:'standing',rendering:{enabled:true,paint:'watercolor'}}});
    CPW.presentation.setScope(outfit,'pose');
    CPW.state.load(outfit);
    location.hash='#/output';
  });
  await page.locator('#open-pose').waitFor();
}

async function backgroundOnly(page, base) {
  await start(page,base);
  await page.locator('#open-scene').click();
  await page.locator('#pr-presentation-background').selectOption('light');
  const text = await page.locator('#prompt-text').innerText();
  assert.match(text,/rim light/);
  return /watercolor/.test(text);
}

async function main() {
  if (shots) fs.mkdirSync(shots,{recursive:true});
  const browser = await chromium.launch();
  try {
    if (previous) {
      const page = await browser.newPage();
      assert.equal(await backgroundOnly(page,previous),true,'reproduce original PR 3');
      assert.equal(await backgroundOnly(page,url),false,'regression');
      await page.close();
      console.log('Watercolor after adding only background: original true, updated false');
    }
    for (const width of [375,390,430,1280]) {
      const page = await browser.newPage({viewport:{width,height:844},isMobile:width<600,hasTouch:width<600});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const $=id=>page.locator('#'+id);
      async function shot(name,id) {
        if (!shots || width!==390) return;
        await $(id).evaluate(el=>{
          const target=el.closest('.studio-field') || el;
          window.scrollTo(0,target.getBoundingClientRect().top+scrollY-14);
        });
        await page.screenshot({path:path.join(shots,name+'.png')});
      }
      async function layout() {
        const columns=await $('pose-cards').evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length);
        assert.equal(columns,width<600?2:3);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth));
        const small=await page.locator('.pose-gallery button,.pose-gallery input,.pose-gallery select').evaluateAll(nodes=>
          nodes.filter(n=>n.getClientRects().length).filter(n=>{const r=n.getBoundingClientRect();return r.width<44||r.height<44;}).map(n=>n.id));
        assert.deepEqual(small,[]);
        const card=page.locator('.pose-card:enabled').first();
        await card.scrollIntoViewIfNeeded();
        assert(await card.evaluate(el=>{const r=el.getBoundingClientRect();return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));}));
      }

      assert.equal(await backgroundOnly(page,url),false);
      assert.equal(await $('output-scope').inputValue(),'custom');
      assert.equal(await $('scope-includeRendering').getAttribute('aria-pressed'),'false');
      await shot('individual-scope','output-scope');
      await $('open-pose').click();
      await layout();
      await shot('catalog','pose-gallery-title');
      const seen=[];
      do {
        const cards=page.locator('.pose-card');
        const names=await cards.evaluateAll(nodes=>nodes.map(n=>n.id.replace('pose-card-','')));
        seen.push(...names);
        assert(await cards.evaluateAll(async nodes=>{
          await Promise.all(nodes.map(n=>n.querySelector('img').decode()));
          return nodes.every(n=>n.querySelector('img').getAttribute('src')==='assets/poses/'+n.id.slice(10)+'.svg');
        }));
        if(await $('pose-next').isDisabled()) break;
        await $('pose-next').click();
      } while(true);
      assert.deepEqual(seen.sort(),ids.slice().sort());
      await $('pose-category').selectOption('sit');
      await shot('sitting','pose-gallery-title');
      assert.match(await $('pose-count').innerText(),new RegExp('^'+catalog.filter(p=>p.categoryId==='sit').length+'件'));
      await $('pose-search').fill('頬杖');
      const chin=$('pose-card-seated_chin');
      assert.equal(await page.locator('.pose-card').count(),1);
      await chin.focus();await page.keyboard.press('Enter');
      assert.equal(await chin.getAttribute('aria-pressed'),'true');
      assert(await chin.evaluate(el=>document.activeElement===el));
      await $('pose-seat').selectOption('throne');
      assert.match(await $('pose-english').innerText(),/cheek supported by one hand/);
      assert.match(await $('prompt-text').innerText(),/throne/);
      await shot('selected','pose-english');
      await $('studio-result').click();
      await shot('english','output-host');
      const saved=await page.evaluate(()=>{CPW._autosave.flush();return CPW.generator.short(CPW.state.outfit);});
      await page.reload();
      assert.equal(await $('prompt-text').innerText(),saved);
      await $('open-pose').click();
      assert.equal(await chin.getAttribute('aria-pressed'),'true');
      await $('output-scope').selectOption('outfit');
      assert.match(await chin.innerText(),/出力対象外/);
      assert.doesNotMatch(await $('prompt-text').innerText(),/throne/);
      // The inverse scenario: include only art with both the saved background and pose muted.
      await $('open-art').click();
      await $('pr-presentation-rendering-paint').selectOption('painterly');
      assert.equal(await $('scope-includePresentation').getAttribute('aria-pressed'),'false');
      assert.equal(await $('scope-includeBackground').getAttribute('aria-pressed'),'false');
      assert.doesNotMatch(await $('prompt-text').innerText(),/cheek supported|throne|rim light/);
      assert(await page.evaluate(()=>CPW.generator.blocks(CPW.state.outfit).rendering.short.length));
      await $('scope-includeRendering').click();
      assert.deepEqual(await page.evaluate(()=>CPW.generator.blocks(CPW.state.outfit).rendering.short),[]);
      await $('open-pose').click();
      await $('pose-clear').click();
      assert.equal(await page.evaluate(()=>CPW.state.outfit.presentation.poseId),null);

      await page.evaluate(()=>{CPW.state.load(CPW.presetCatalog.create('mermaid'));location.hash='#/presentation';});
      await $('pose-search').fill('ランウェイ');
      assert(await $('pose-card-runway').isDisabled());
      assert.match(await $('pose-card-runway').innerText(),/人魚/);
      await $('pose-search').fill('マントの片側');
      assert(await $('pose-card-lift_cape').isDisabled());
      assert.match(await $('pose-card-lift_cape').innerText(),/マントのある衣装/);
      await $('pose-search').fill('該当なし');
      assert.match(await $('pose-count').innerText(),/一致するポーズがありません/);
      if(width===390) {
        await page.route('**/assets/poses/**',route=>route.abort());
        await page.reload();
        await $('pose-search').fill('胸元');
        await $('pose-card-hand_chest').click();
        assert.match(await $('prompt-text').innerText(),/hand resting at the upper chest/);
        assert(await page.locator('#pose-card-hand_chest .pose-no-image').isVisible());

        // A named pose range suppresses plain_bg. In null mode the same stored
        // value follows the pose block. Crossing that boundary needs an explicit choice.
        await page.evaluate(()=>{
          const o=CPW.state.outfit;
          o.presentation.compositionAssist='plain_bg';
          CPW.presentation.setScope(o,'pose');
          location.hash='#/output';
        });
        await $('open-art').click();
        await $('pr-presentation-rendering-paint').selectOption('watercolor');
        assert.match(await $('scope-notice').innerText(),/無地背景も英文に入ります/);
        assert.doesNotMatch(await $('prompt-text').innerText(),/plain background|watercolor/);
        await $('scope-cancel').click();
        assert.equal(await $('output-scope').inputValue(),'pose');
        await $('enable-art').click();
        await $('scope-accept').click();
        assert.match(await $('prompt-text').innerText(),/plain background/);
        assert.match(await $('prompt-text').innerText(),/watercolor/);

        // Requesting just a plain backdrop cannot silently enable the pose block.
        await $('output-scope').selectOption('outfit');
        await $('open-scene').click();
        await $('plain-backdrop').click();
        await $('plain-backdrop').click();
        assert.equal(await $('scope-includePresentation').getAttribute('aria-pressed'),'false');
        assert.equal(await $('scope-includeRendering').getAttribute('aria-pressed'),'false');
        assert.match(await $('open-scene').innerText(),/無地背景はポーズと一緒/);
        assert.doesNotMatch(await $('prompt-text').innerText(),/plain background|upper chest|watercolor/);
      }
      assert.deepEqual(errors,[]);
      await page.close();
      console.log(width+'px checked: 52 cards, filtering, restrictions, keyboard, English, flags, save/reload');
    }
  } finally {await browser.close();}
}
main().catch(e=>{console.error(e);process.exitCode=1;});
