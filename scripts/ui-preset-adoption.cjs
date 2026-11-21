// Usage: node scripts/ui-preset-adoption.cjs <local-server-url> [screenshot-directory]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

async function main() {
  const [url = 'http://127.0.0.1:8000', shots] = process.argv.slice(2);
  if (shots) fs.mkdirSync(shots, {recursive:true});
  const browser = await chromium.launch();
  try {
    for (const width of [375, 390, 430]) {
      const context = await browser.newContext({viewport:{width, height:844}, isMobile:true, hasTouch:true});
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const button = name => page.getByRole('button', {name, exact:true});
      const outfit = () => page.evaluate(() => CPW.state.outfit);
      const library = () => page.evaluate(() => CPW.store.listOutfits());
      const decide = button('この衣装に決定する');
      const workshop = page.getByRole('heading', {name:'衣装をアレンジ'});
      async function choose(id) {
        await page.locator('#workshop-topnav a').click();
        await page.getByRole('link', {name:/見本から/}).click();
        const label = await page.evaluate(key => CPW.util.byId(CPW.data.presets, key).labelJa, id);
        await page.locator('#preset-search').fill(label);
        await page.locator('[data-preset="' + id + '"]').click();
        await decide.waitFor();
      }
      async function inspect(label) {
        const problems = await page.evaluate(() => {
          const nodes = Array.from(document.querySelectorAll('button,select,a:not(.skip-link),summary'));
          return nodes.filter(n => n.checkVisibility() && n.getClientRects().length)
            .filter(n => { const r=n.getBoundingClientRect(); return r.width<43.9 || r.height<43.9 || r.right>innerWidth+1; })
            .map(n => n.textContent);
        });
        assert.deepEqual(problems, [], label + ' tap targets');
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth), label);
        if (shots && width===390) await page.screenshot({path:path.join(shots, label+'.png')});
      }

      await page.goto(url);
      await page.getByRole('link', {name:/見本から/}).click();
      await page.locator('[data-preset="daily_casual"]').click();
      await inspect('preview');
      await decide.click();
      await workshop.waitFor();
      const daily = await outfit();
      assert.deepEqual([daily.concept.worldview,daily.concept.era,daily.concept.role,daily.concept.occasion,daily.concept.primaryStyle],
        [null,null,null,'daily','street']);
      assert.equal(await button('前の衣装に戻す').count(), 0);
      await page.reload();
      await workshop.waitFor();
      assert.deepEqual(await outfit(), daily);
      assert(await page.evaluate(() => CPW.state.dirty));
      await choose('knight');
      await decide.click();
      await workshop.waitFor();
      await inspect('arrange');
      // Regression: a selected color swatch must not retain the unset checkerboard image.
      const swatchStyle = await page.locator('[data-color-picker="primary"] .quick-color-dot').evaluate(
        el => ({image:getComputedStyle(el).backgroundImage, color:getComputedStyle(el).backgroundColor}));
      assert.equal(swatchStyle.image, 'none', 'selected color swatch checkerboard');
      assert.equal(swatchStyle.color, 'rgb(200, 203, 208)', 'selected silver color preview');
      await button('前の衣装に戻す').click();
      assert.deepEqual(await outfit(), daily);

      await page.locator('#outfit-name').fill('雨の日の普段着');
      await button('保存する').click();
      const saved = await outfit();
      const savedLibrary = await library();
      await page.reload(); // Reopened drafts are marked dirty even when already in the library.
      await workshop.waitFor();
      await choose('royalty');
      await decide.click();
      await workshop.waitFor();
      await button('前の衣装に戻す').click();
      assert.deepEqual(await outfit(), saved);
      assert.equal(await page.evaluate(() => CPW.state.savedId), saved.id);

      await page.locator('#outfit-name').fill('雨の日の普段着・試作');
      await page.evaluate(() => { CPW.state.set('output.customTags','rainy_day'); CPW.state.dirty=false; });
      const edited = await outfit();
      await choose('knight');
      await button('配色を変える').click();
      await page.locator('#preview-color-primary').selectOption('deep_crimson');
      await button('一覧に戻る').click();
      await page.locator('#preset-search').fill('王族');
      await page.locator('[data-preset="royalty"]').click();
      assert.deepEqual(await outfit(), edited);
      await decide.click();
      await page.locator('[data-preset-confirm]').waitFor();
      assert(await button('キャンセル').evaluate(n => n === document.activeElement));
      await inspect('protect-edits');
      await button('キャンセル').click();
      assert.deepEqual(await outfit(), edited);
      assert.deepEqual(await library(), savedLibrary);
      await button('配色を変える').click();
      await page.locator('#preview-color-primary').selectOption('deep_crimson');
      await decide.click();
      await button('この見本で始める').click();
      await workshop.waitFor();
      assert.equal((await outfit()).palette.primary, 'deep_crimson');
      await page.reload();
      await workshop.waitFor();
      await page.locator('#outfit-name').fill('王族の試作');
      const secondary = await outfit();
      await button('前の衣装に戻す').click();
      await button('キャンセル').click();
      assert.deepEqual(await outfit(), secondary);
      await button('前の衣装に戻す').click();
      await button('編集を取り消して戻す').click();
      assert.deepEqual(await outfit(), edited);
      assert.equal(await page.evaluate(() => CPW.state.dirty), true);
      await page.reload();
      await workshop.waitFor();
      assert.deepEqual(await outfit(), edited);
      assert.deepEqual(await library(), savedLibrary);
      assert.equal(await button('前の衣装に戻す').count(), 0);
      // Deliberately clearing a saved design is also a user's edit.
      await page.evaluate(() => {
        const cleared = CPW.schema.createOutfit();
        cleared.id = CPW.state.outfit.id;
        CPW.state.load(cleared);
      });
      const cleared = await outfit();
      await choose('knight');
      await decide.click();
      await button('この見本で始める').click();
      await workshop.waitFor();
      await button('前の衣装に戻す').click();
      assert.deepEqual(await outfit(), cleared);
      assert.deepEqual(await library(), savedLibrary);
      assert.deepEqual(errors, []);
      console.log(width+'px: one-tap adoption, library, preview, cancel, undo, immediate reload and layout passed');
      await context.close();
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => {console.error(error); process.exitCode=1;});
