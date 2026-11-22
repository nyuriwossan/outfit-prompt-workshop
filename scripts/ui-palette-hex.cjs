// Usage: node scripts/ui-palette-hex.cjs [local-server-url] [screenshot-directory]
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {chromium} = require('playwright');

async function main() {
  const [url = 'http://127.0.0.1:8000', shots] = process.argv.slice(2);
  if (shots) fs.mkdirSync(shots, {recursive: true});
  const browser = await chromium.launch();
  try {
    for (const width of [375, 390, 430]) {
      const page = await browser.newPage({viewport: {width, height: 844}, isMobile: true, hasTouch: true,
        permissions: ['clipboard-read', 'clipboard-write']});
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(url);
      await page.getByRole('link', {name: /見本から/}).click();
      await page.locator('[data-preset="daily_casual"]').click();
      await page.getByRole('button', {name: 'この衣装に決定する'}).click();
      const open = role => page.locator('[data-hex-open="' + role + '"]').click();
      const input = page.locator('#hex-dialog-input');
      const palette = () => page.evaluate(() => CPW.state.outfit.palette);
      const roles = ['primary', 'secondary', 'accent', 'metal', 'gem'];
      const values = ['#912E48', '#F2E4D2', '#829F81', '#B08D4A', '#375470'];
      await page.locator('[data-color-picker="primary"] summary').click();
      await page.locator('[data-color-option="primary:deep_crimson"]').click();
      for (const [i, role] of roles.entries()) {
        const before = await palette();
        await open(role);
        if (before[role]) {
          const swatch = await page.evaluate(id => CPW.util.byId(CPW.data.colors, id).hex, before[role]);
          assert.equal(await input.inputValue(), swatch.toUpperCase());
        }
        await input.fill('invalid');
        await page.locator('#hex-apply').click();
        assert(await page.locator('#hex-dialog-message').isVisible());
        assert.deepEqual(await palette(), before);
        await page.locator('#hex-sv').tap({position: {x: 45, y: 30}});
        await page.locator('#hex-native').evaluate(el => {
          el.value = '#516e45';
          el.dispatchEvent(new Event('input', {bubbles: true}));
        });
        assert.equal(await page.locator('#hex-preview-code').innerText(), '#516E45');
        if (before[role]) await page.locator('#hex-reference').click();
        await page.locator('#hex-sv').press('ArrowLeft');
        await page.locator('#hex-h').press('ArrowRight');
        await input.fill(values[i].toLowerCase());
        assert.equal(await page.locator('#hex-preview-code').innerText(), values[i]);
        if (role === 'primary' && width === 390 && shots) {
          await input.blur();
          await page.screenshot({path: path.join(shots, 'picker-390.png')});
        }
        await page.locator('#hex-apply').click();
        assert.equal((await palette())[role], before[role]);
        assert.equal((await palette()).hexColors[role], values[i]);
      }
      await page.locator('[data-color-picker="primary"] summary').click();
      await page.locator('[data-color-option="primary:forest_green"]').click();
      assert.equal((await palette()).hexColors.primary, values[0]);
      await page.locator('[data-ui-level="advanced"]').click();
      await page.locator('[aria-controls="panel-palette"]').click();
      for (const role of roles) {
        await open(role);
        await input.fill('#fff');
        await page.locator('[data-hex-cancel]').click();
        assert.equal((await palette()).hexColors[role], values[roles.indexOf(role)]);
      }
      await open('gem');
      await page.locator('#hex-unset').click();
      assert(!(await palette()).hexColors.gem);
      await open('gem');
      await input.fill('#abc');
      await page.setViewportSize({width, height: 420});
      assert(await page.locator('#hex-apply').evaluate(el => {
        const rect = el.getBoundingClientRect();
        return rect.bottom <= visualViewport.height + 1 && rect.right <= innerWidth && rect.top >= 0;
      }));
      await page.locator('#hex-apply').click();
      await page.setViewportSize({width, height: 844});
      assert.equal((await palette()).hexColors.gem, '#AABBCC');
      const saved = await palette();
      const restored = await page.evaluate(() => {
        const {store, state} = CPW;
        store.saveDraft(state.outfit);
        const library = store.saveOutfit(state.outfit);
        const json = store.exportOutfit(state.outfit);
        store.removeOutfit(library.id);
        if (!store.importJSON(json).ok) throw Error('JSON import');
        return [store.loadDraft().palette, library.palette, store.listOutfits()[0].palette];
      });
      for (const restoredPalette of restored) assert.deepEqual(restoredPalette, saved);
      await page.locator('.bottombar a[href="#/output"]').click();
      for (const mode of [false, true]) {
        if (mode) await page.locator('#palette-output-mode').click();
        for (const format of ['short', 'detailed', 'markdown', 'structure']) {
          await page.locator('[data-fkey="tab:' + format + '"]').click();
          await page.locator('[data-fkey="copy:' + format + '"]').click();
          const copied = await page.evaluate(() => navigator.clipboard.readText());
          assert.equal(copied.includes('#912E48'), mode);
          if (format !== 'structure') assert.equal(copied, await page.locator('#prompt-text').innerText());
        }
      }
      await page.reload();
      assert.equal(await page.locator('#palette-output-mode').getAttribute('aria-pressed'), 'true');
      assert.deepEqual(await palette(), saved);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      assert.deepEqual(errors, []);
      console.log(width + 'px: preset, five roles, both editors, storage, clipboard and output passed');
      await page.close();
    }
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
