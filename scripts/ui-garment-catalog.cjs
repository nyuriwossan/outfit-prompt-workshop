// node scripts/ui-garment-catalog.cjs URL [390px screenshot directory] [baseline checkout]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');
const {load,root} = require('./test.cjs');
const [url='http://localhost:8000',shots,baseline] = process.argv.slice(2);
const C = load();
const reference = baseline ? require(path.resolve(baseline,'scripts/test.cjs')).load() : C;
const categories = ['neckline','sleeves','cuffs','top_structure','bottom_structure','straps','waist','garter'];
const assets = path.join(root,'assets/garment-parts');
assert.deepEqual([...C.garmentCatalog.slots].sort(),categories.slice().sort());
assert.deepEqual(fs.readdirSync(assets).sort(),categories.slice().sort());
const seen = new Set();
for (const id of categories) {
  const slot = C.util.byId(C.data.partSlots,id);
  assert.deepEqual(fs.readdirSync(path.join(assets,id)).sort(),Array.from(slot.options,o=>o.id+'.svg').sort());
  for (const o of slot.options) {
    const drawing = fs.readFileSync(path.join(assets,id,o.id+'.svg'),'utf8');
    assert(!seen.has(drawing),'Duplicate plate: '+o.id);
    seen.add(drawing);
  }
}

async function run() {
  const browser = await chromium.launch({executablePath:process.env.CHROMIUM_PATH});
  try {
    for (const width of [390,375,430,1280]) {
      const page = await browser.newPage({viewport:{width,height:844},hasTouch:width<600,isMobile:width<600});
      const errors=[];
      page.on('pageerror',e=>errors.push(e.message));
      const field = id=>page.locator('[data-field="part:'+id+'"]');
      const head = id=>field(id).locator('.fold-head');
      const card = (id,opt)=>field(id).locator('[data-option="'+opt+'"]');
      async function open(id) {
        if(await head(id).getAttribute('aria-expanded')==='false') await head(id).click();
      }
      async function shot(name,id) {
        if (!shots || width!==390) return;
        fs.mkdirSync(shots,{recursive:true});
        await field(id).locator('.garment-count').click();
        await head(id).evaluate(el=>window.scrollBy(0,el.getBoundingClientRect().top));
        await page.screenshot({path:path.join(shots,name+'.png')});
      }
      await page.goto(url+'/#/workshop');
      await page.locator('#quick-garment-category').selectOption('lingerie');
      await page.locator('#quick-garment-subtype').selectOption('bra_and_briefs');
      const initial = await page.evaluate(()=>CPW.util.clone(CPW.state.outfit));
      for (const id of categories) {
        await open(id);
        const grid = field(id).locator('.garment-grid').first();
        assert.equal(await grid.evaluate(el=>getComputedStyle(el).gridTemplateColumns.split(' ').length),width<700?2:4);
        assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
        const slot = C.util.byId(C.data.partSlots,id);
        assert.equal(await field(id).locator('.garment-card').count(),slot.options.length);
        const opts = width===390 ? slot.options : slot.options.slice(0,1);
        for (const o of opts) {
          const button = card(id,o.id);
          assert.equal(await field(id).getByRole('button',{name:o.labelJa,exact:true}).count(),1);
          const image = button.locator('img');
          await button.scrollIntoViewIfNeeded();
          await image.evaluate(img=>img.decode());
          assert.equal(await image.getAttribute('src'),'assets/garment-parts/'+id+'/'+o.id+'.svg');
          const box = await button.boundingBox();
          assert(box.width>=44 && box.height>=44);
          await button.evaluate(el=>el.scrollIntoView({block:'center'}));
          assert(await button.evaluate(el=>{
            const r=el.getBoundingClientRect();
            return el.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));
          }),'card is unobstructed: '+o.id);
          await button.focus();
          const before = await page.evaluate(()=>scrollY);
          await page.keyboard.press('Enter');
          assert.equal(await button.getAttribute('aria-pressed'),'true');
          assert(await button.evaluate(el=>el===document.activeElement));
          assert(Math.abs(await page.evaluate(()=>scrollY)-before)<3,'selection scroll: '+o.id);
          const [saved,short,detailed] = await page.evaluate(id=>[CPW.state.outfit.parts[id],CPW.generator.short(CPW.state.outfit),CPW.generator.detailed(CPW.state.outfit)],id);
          assert.equal(saved,o.id);
          const expected = reference.schema.normalize({...initial,parts:{[id]:o.id}});
          assert.equal(short,reference.generator.short(expected),o.id);
          assert.equal(detailed,reference.generator.detailed(expected),o.id);
          await page.keyboard.press('Space');
          assert.equal(await button.getAttribute('aria-pressed'),'false');
        }
        if (id==='sleeves') await field(id).locator('select').selectOption('ボリューム');
        if (['neckline','sleeves','cuffs','top_structure','bottom_structure'].includes(id)) await shot(id,id);
        await head(id).click();
      }
      await open('neckline');
      const search=field('neckline').locator('input');
      await search.fill('Vネック');
      assert.equal(await field('neckline').locator('.garment-card').count(),2);
      await card('neckline','deep_v_neck').click();
      await shot('selected','neckline');
      await head('neckline').click();
      await open('neckline');
      assert.equal(await search.inputValue(),'Vネック');
      await page.locator('[data-ui-level="advanced"]').click();
      const structure=page.locator('[aria-controls="panel-structure"]');
      if(await structure.getAttribute('aria-expanded')==='false') await structure.click();
      assert.equal(await card('neckline','deep_v_neck').getAttribute('aria-pressed'),'true');
      await page.waitForFunction(()=>CPW.store.loadDraft()?.parts.neckline==='deep_v_neck');
      await page.reload();
      await structure.click();
      await open('neckline');
      assert.equal(await card('neckline','deep_v_neck').getAttribute('aria-pressed'),'true');
      await page.evaluate(()=>CPW.state.saveToLibrary());
      assert.equal(await page.evaluate(()=>CPW.store.listOutfits()[0].parts.neckline),'deep_v_neck');
      await page.goto(url+'/#/library');
      const old = {version:'0.4',name:'旧JSON',concept:{},garment:{category:'lingerie'},
        parts:{topStructure:'bandeau',bottomStructure:'boyshorts'}};
      await page.locator('#import-file').setInputFiles({name:'old.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(old))});
      page.once('dialog', dialog=>dialog.accept());
      await page.locator('.card').filter({has:page.getByRole('heading',{name:'旧JSON'})}).getByRole('button',{name:'開く'}).click();
      assert.equal(await page.evaluate(()=>CPW.state.outfit.version),'0.6');
      await page.locator('[data-ui-level="simple"]').click();
      await open('top_structure');
      assert.equal(await card('top_structure','bandeau').getAttribute('aria-pressed'),'true');
      await open('bottom_structure');
      assert.equal(await card('bottom_structure','boyshorts').getAttribute('aria-pressed'),'true');
      await page.route('**/assets/garment-parts/**',route=>route.abort());
      await page.reload();
      await open('cuffs');
      await card('cuffs','plain_cuffs').scrollIntoViewIfNeeded();
      await card('cuffs','plain_cuffs').locator('.garment-unavailable').waitFor();
      await card('cuffs','plain_cuffs').click();
      assert.equal(await card('cuffs','plain_cuffs').getAttribute('aria-pressed'),'true');
      await field('cuffs').getByRole('button',{name:'文字一覧'}).click();
      await card('cuffs','rolled_cuffs').click();
      assert.equal(await card('cuffs','rolled_cuffs').getAttribute('aria-pressed'),'true');
      await shot('text-fallback','cuffs');
      await field('cuffs').locator('[data-fold-clear]').click();
      assert.equal(await page.evaluate(()=>CPW.state.outfit.parts.cuffs),undefined);
      assert.deepEqual(errors,[]);
      await page.close();
      console.log(width+'px passed');
    }
  } finally { await browser.close(); }
}
run().catch(error=>{console.error(error);process.exitCode=1;});
