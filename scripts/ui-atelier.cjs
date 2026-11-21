// Run against a local HTTP server. Optional second argument saves review screenshots.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

async function main() {
  const base = process.argv[2] || 'http://127.0.0.1:8000';
  const shots = process.argv[3];
  if (shots) fs.mkdirSync(shots, {recursive:true});
  const browser = await chromium.launch();
  try {
    for (const width of [375, 390, 430, 1280]) {
      const context = await browser.newContext({viewport:{width, height:844}, hasTouch:width<600,
        isMobile:width<600, permissions:['clipboard-write','clipboard-read']});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const snapshot = () => page.evaluate(() => JSON.stringify(CPW.state.outfit));
      async function layout(label) {
        const issues = await page.evaluate(() => {
          const nodes = Array.from(document.querySelectorAll('button,select,input:not([type=checkbox]),a:not(.skip-link),summary'));
          return nodes.filter(n => n.checkVisibility() && n.getClientRects().length && !n.classList.contains('visually-hidden'))
            .filter(n => {const r = n.getBoundingClientRect(); return r.width<43.9 || r.height<43.9 || r.right>innerWidth+1;})
            .map(n => n.id || n.textContent);
        });
        assert.deepEqual(issues, [], label + ' tap targets');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), label);
        if (shots && width===390) await page.screenshot({path:path.join(shots,label+'.png')});
      }

      await page.goto(base);
      await layout('choose');
      await page.getByRole('button',{name:/ゼロから/}).focus();
      await page.keyboard.press('Enter');
      await page.locator('#quick-garment-category').selectOption('dress');
      await page.locator('#quick-garment-subtype').selectOption('cocktail_dress');
      await page.locator('#quick-palette-primary').selectOption('deep_crimson');
      await layout('arrange');
      const initial = await snapshot();
      await page.locator('[data-ui-level="advanced"]').click();
      assert.equal(await page.locator('.acc-head').count(),7);
      await page.locator('[data-ui-level="simple"]').click();
      assert.equal(await snapshot(), initial);
      await page.locator('.bottombar a[href="#/output"]').click();
      await page.locator('#prompt-text').waitFor();
      await layout('finish');
      for (const format of ['short','detailed','markdown','structure']) {
        await page.locator('[data-fkey="tab:'+format+'"]').click();
        const expected = await page.evaluate(f => f==='structure' ?
          CPW.structureLines(CPW.state.outfit).map(v=>v.label+'：'+v.value).join('\n') :
          CPW.generator[f](CPW.state.outfit),format);
        await page.locator('[data-fkey="copy:'+format+'"]').click();
        assert.equal(await page.evaluate(()=>navigator.clipboard.readText()),expected);
      }
      await page.goBack();
      await page.locator('#quick-garment-category').waitFor();
      assert.equal(await snapshot(),initial);
      await page.locator('#workshop-topnav a').click();
      await page.getByRole('link',{name:/見本から/}).click();
      const cards=page.locator('[data-preset]');
      await cards.first().waitFor();
      assert.equal(await cards.count(),12);
      await page.getByRole('button',{name:'次の見本'}).click();
      await cards.first().click();
      await page.getByRole('button',{name:'配色を変える'}).click();
      await page.locator('#preview-color-primary').focus();
      await page.locator('#preview-color-primary').selectOption('deep_crimson');
      await page.keyboard.press('Tab');
      assert.equal(await page.evaluate(()=>document.activeElement.id),'preview-color-secondary');
      assert.equal(await snapshot(),initial);
      await page.goBack();
      await cards.first().waitFor();
      await cards.first().click();
      await page.locator('[data-preset-adopt]').click();
      await page.getByRole('button',{name:'キャンセル'}).click();
      assert.equal(await snapshot(),initial);
      await page.locator('[data-preset-adopt]').click();
      await page.locator('[data-preset-confirm]').click();
      await page.locator('.bottombar a[href="#/output"]').click();
      assert((await page.locator('#prompt-text').innerText()).length>0);
      await page.goBack();
      await page.locator('#workshop-topnav a').click();
      await page.getByRole('link',{name:/テーマから/}).click();
      const preset = await snapshot();
      await page.locator('#cf-categoryId').focus();
      await page.locator('#cf-categoryId').selectOption('object');
      assert.equal(await page.evaluate(()=>document.activeElement.htmlFor),'cf-categoryId');
      await page.locator('#cf-motifId').selectOption('hourglass');
      await page.locator('#cf-generate').click();
      assert.equal(await page.locator('[data-cf-adopt]').count(),3);
      assert.equal(await snapshot(),preset);
      await page.locator('[data-cf-adopt="0"]').click();
      await page.locator('[data-cf-confirm="apply"]').click();
      await page.locator('.bottombar a[href="#/output"]').click();
      assert((await page.locator('#prompt-text').innerText()).length>0);
      await page.locator('.output-options summary').first().click();
      await page.locator('#custom-tags').fill('atelier_test');
      assert((await page.locator('#prompt-text').innerText()).includes('atelier_test'));
      await page.goBack();
      await page.locator('#outfit-name').fill('砂時計の衣装');
      await page.getByRole('button',{name:'保存する'}).click();
      const saved = await snapshot();
      await page.reload();
      assert.equal(await snapshot(),saved);
      await page.locator('#workshop-topnav a').click();
      await page.getByRole('link',{name:/保存した衣装/}).click();
      await page.getByRole('heading',{name:'砂時計の衣装'}).waitFor();
      const json = await page.evaluate(()=>CPW.store.exportOutfit(CPW.state.outfit));
      await page.locator('#import-file').setInputFiles({name:'outfit.json',mimeType:'application/json',buffer:Buffer.from(json)});
      await page.waitForFunction(()=>CPW.store.listOutfits().length===2);
      await page.addScriptTag({url: new URL('/tests-fixtures-03.js',base).href});
      const legacy = await page.evaluate(() => {
        const raw = CPW.legacy03Fixtures[0].raw;
        localStorage.setItem('cpw:draft:v1', JSON.stringify(raw));
        localStorage.setItem('cpw:library:v1', JSON.stringify([raw]));
        return JSON.stringify(raw);
      });
      await page.reload();
      assert(await page.evaluate(expected => CPW.state.outfit.version === '0.6' &&
        CPW.store.listOutfits()[0].id === JSON.parse(expected).id &&
        localStorage.getItem('cpw:draft:v1') === expected, legacy));
      await page.locator('#import-file').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(legacy)});
      await page.waitForFunction(()=>CPW.store.listOutfits().length===2);
      page.once('dialog', d => d.accept());
      await page.getByRole('button',{name:'開く',exact:true}).first().click();
      assert.equal(await page.locator('#quick-garment-subtype').inputValue(),JSON.parse(legacy).garment.subtype);
      assert.deepEqual(errors,[]);
      console.log(width+'px: three entries, edit, copy, save/reload, library import passed');
      await context.close();
    }
  } finally { await browser.close(); }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
