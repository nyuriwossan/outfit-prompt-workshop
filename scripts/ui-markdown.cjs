// Start a local HTTP server at the repository root and pass its URL.
const assert = require('node:assert/strict');
const {chromium} = require('playwright');

async function main() {
  const browser = await chromium.launch();
  try {
    for (const width of [375, 390, 430]) {
      const context = await browser.newContext({
        viewport: {width, height: 844}, isMobile: true, hasTouch: true,
        permissions: ['clipboard-read', 'clipboard-write']
      });
      const page = await context.newPage();
      await page.goto(process.argv[2] || 'http://127.0.0.1:8000');
      const expected = await page.evaluate(() => {
        CPW.state.load({garment: {category: 'uniform'}, palette: {primary: 'jet_black'},
          output: {customTags: 'a'.repeat(120)}});
        location.hash = '#/output';
        return CPW.generator.markdown(CPW.state.outfit);
      });
      for (const mode of ['detailed', 'structure', 'short', 'markdown']) {
        const tab = page.locator('[data-fkey="tab:' + mode + '"]');
        await tab.tap();
        assert(await tab.evaluate(el => el === document.activeElement));
        const bounds = await tab.boundingBox();
        assert(bounds.width >= 44 && bounds.height >= 44 && bounds.x >= 0 && bounds.x + bounds.width <= width);
      }
      assert.equal(await page.locator('pre#prompt-text').textContent(), expected);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
      const copy = page.getByRole('button', {name: 'Markdownをコピー', exact: true});
      await copy.scrollIntoViewIfNeeded();
      assert(await copy.evaluate(el => {
        const r = el.getBoundingClientRect();
        return r.height >= 44 && r.width >= 44 && el.contains(document.elementFromPoint(r.x+r.width/2, r.y+r.height/2));
      }));
      await copy.tap();
      await page.getByText('Markdownをコピーしました', {exact: true}).waitFor();
      assert.equal(await page.evaluate(() => navigator.clipboard.readText()), expected);
      await page.evaluate(() => {
        Object.defineProperty(navigator, 'clipboard', {value: {writeText: () => Promise.reject(new Error('denied'))}});
        document.execCommand = () => false;
      });
      await copy.tap();
      await page.getByText('コピーできませんでした。テキストを長押しして選択してください', {exact: true}).waitFor();
      await context.close();
      console.log(width + 'px passed');
    }
  } finally {
    await browser.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
