// Run against a local HTTP server; optional second argument writes screenshots.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  chromium
} = require('playwright');

async function main() {
  const base = process.argv[2] || 'http://127.0.0.1:8000',
    shots = process.argv[3];
  if (shots) fs.mkdirSync(shots, {
    recursive: true
  });
  const browser = await chromium.launch();
  try {
    for (const width of [375, 390, 430, 1280]) {
      const page = await browser.newPage({
        viewport: {
          width,
          height: 844
        },
        hasTouch: width < 600,
        isMobile: width < 600
      });
      const errors = [];
      page.on('pageerror', e => errors.push(e.message));
      const select = (id, v) => page.locator('#' + id).selectOption(v);
      const click = id => page.locator('#' + id).click();
      const text = () => page.locator('#prompt-text').innerText();
      async function check(label) {
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement
          .clientWidth), label + ' overflow');
        assert.deepEqual(await page.locator('.studio button,.studio summary,.studio select,.studio input')
          .evaluateAll(nodes =>
            nodes.filter(n => n.checkVisibility() && n.getBoundingClientRect().width).filter(n => {
              const r = n.getBoundingClientRect();
              return r.height < 44 || r.width < 44 || r.right > document.documentElement.clientWidth + 1;
            }).map(n => n.id || n.textContent)), [], label + ' targets');
        const head = page.locator('.studio-head[aria-expanded="true"]');
        if (await head.count()) {
          await head.scrollIntoViewIfNeeded();
          assert(await head.evaluate(el => {
            const r = el.getBoundingClientRect();
            return el.contains(document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2));
          }), label + ' overlap');
        }
      }
      async function shot(label, locator) {
        if (!shots || width !== 390) return;
        if (locator) await locator.evaluate(el => el.scrollIntoView({
          block: 'start'
        }));
        await page.screenshot({
          path: path.join(shots, label + '.png')
        });
      }
      await page.goto(base);
      await page.evaluate(() => {
        CPW.state.load(CPW.schema.normalize({
          name: '深紅のドレス',
          garment: {
            category: 'dress',
            subtype: 'cocktail_dress'
          },
          palette: {
            primary: 'deep_crimson'
          }
        }));
        location.hash = '#/output';
      });
      const original = await text();
      await page.getByRole('heading', {
        name: 'プロンプトの完成'
      }).evaluate(el => el.blur());
      await check('overview');
      await shot('finish');
      await page.getByText('目的から見せ方を選ぶ', {
        exact: true
      }).click();
      await shot('presets', page.locator('.studio'));
      await click('recipe-editorial');
      assert.match(await text(), /walking a runway step/);
      assert.match(await text(), /themed rim light/);
      const editorial = await text();
      await click('recipe-catalog');
      assert.equal(await text(), editorial, 'confirm changed output before adoption');
      await page.getByRole('button', {
        name: 'キャンセル',
        exact: true
      }).click();
      assert.equal(await text(), editorial, 'cancel changed output');
      for (const [recipe, words] of [['catalog', /plain background/], ['dramatic', /cinematic depth/], [
          'silhouette', /full.body/i]]) {
        await click('recipe-' + recipe);
        await click('confirm-recipe');
        assert.match(await text(), words);
      }
      await click('recipe-editorial');
      await click('confirm-recipe');
      assert.equal(await text(), editorial);
      await click('open-camera');
      await select('camera-distance', 'upper');
      assert.match(await text(), /upper.body/i);
      await select('output-scope', 'outfit');
      assert.equal(await text(), original);
      assert.match(await page.locator('#open-camera').innerText(), /出力対象外/);
      await click('open-camera');
      await shot('scope',page.locator('#output-scope').locator('..'));
      await click('open-camera');
      await click('enable-camera');
      assert.match(await text(), /upper.body/i);
      await select('camera-distance', '');
      assert.doesNotMatch(await text(), /upper.body/i);
      await click('open-art');
      await select('pr-presentation-rendering-paint', 'watercolor');
      assert.match(await text(), /watercolor/i);
      await click('rendering-enabled');
      assert.doesNotMatch(await text(), /watercolor/i);
      assert.match(await page.locator('#open-art').innerText(), /オフ/);
      await click('enable-art');
      await select('pr-presentation-rendering-line', 'delicate');
      await check('art');
      await shot('rendering', page.locator('#open-art'));
      await click('studio-result');
      assert.equal(await page.evaluate(() => document.activeElement.dataset.fkey), 'copy:short');
      await click('open-mood');
      await click('scene-effects');
      assert.match(await page.locator('#open-mood').innerText(), /属性を選/);
      await page.locator('#studio-mood summary').click();
      await select('studio-attribute', 'fire');
      await click('scene-story');
      const block = await page.evaluate(() => CPW.generator.blocks(CPW.state.outfit));
      assert(block.effects.short.length && block.optionalNarrative.short.length);
      for (const word of [...block.effects.short, ...block.optionalNarrative.short]) assert((await text())
        .includes(word));
      await click('scene-effects');
      await click('scene-story');
      for (const word of [...block.effects.short, ...block.optionalNarrative.short]) assert(!(await text())
        .includes(word));
      const expected = await text();
      await page.evaluate(() => CPW._autosave.flush());
      await page.reload();
      assert.equal(await text(), expected);

      // Original 0.4 JSON, plus a 0.6 document using independently enabled blocks.
      for (const raw of [
          {
            version: '0.4',
            name: '旧構図',
            garment: {
              category: 'dress'
            },
            concept: {},
            presentation: {
              focus: 'upper_body',
              poseAssist: 'walking',
              compositionAssist: 'plain_bg'
            },
            output: {
              includePresentation: true
            }
          },
          {
            version: '0.6',
            name: '個別出力',
            garment: {
              category: 'dress'
            },
            concept: {
              attribute: {
                id: 'fire',
                applyTo: {
                  effects: true
                }
              }
            },
            presentation: {
              preset: 'chair_sit',
              seat: 'throne',
              background: 'light',
              rendering: {
                enabled: true,
                paint: 'watercolor'
              }
            },
            output: {
              scope: null,
              includePresentation: false,
              includeBackground: true,
              includeRendering: false
            }
          }
      ]) {
        await page.evaluate(() => location.hash = '#/library');
        await page.locator('#import-file').setInputFiles({
          name: 'legacy.json',
          mimeType: 'application/json',
          buffer: Buffer.from(JSON.stringify(raw))
        });
        const card = page.locator('.card').filter({
          has: page.getByRole('heading', {
            name: raw.name,
            exact: true
          })
        });
        page.once('dialog', d => d.accept());
        await card.getByRole('button', {
          name: '開く',
          exact: true
        }).click();
        const before = await page.evaluate(() => JSON.stringify(CPW.state.outfit));
        await page.locator('.bottombar a[href="#/output"]').click();
        await click('open-pose');
        await click('open-camera');
        await click('open-scene');
        assert.equal(await page.evaluate(() => JSON.stringify(CPW.state.outfit)), before,
          'inspection mutated legacy');
        if (raw.version === '0.4') assert.match(await text(), /mid-stride.*plain background/);
        else {
          assert.equal(await page.locator('#output-scope').inputValue(), 'custom');
          assert.match(await page.locator('#open-mood').innerText(), /属性エフェクトをオン/);
          assert.match(await text(), /themed rim light/);
          assert.doesNotMatch(await text(), /seated|watercolor/);
          await select('pr-presentation-background', '');
          assert.doesNotMatch(await text(), /rim light/);
          await page.getByText('目的から見せ方を選ぶ', {
            exact: true
          }).click();
          await click('recipe-portrait');
          await click('confirm-recipe');
          assert.equal(await page.evaluate(() => CPW.state.outfit.output.includeRendering), false);
          assert.doesNotMatch(await text(), /watercolor/i);
          await click('recipe-catalog');
          await click('confirm-recipe');
          assert.match(await text(), /plain background/);
          assert.doesNotMatch(await text(), /watercolor/i);
          await page.getByRole('link', {name:'アレンジへ戻る'}).click();
          await page.locator('[data-ui-level="advanced"]').click();
          for (const head of ['[aria-controls="panel-concept"]', '[data-fold="concept.attribute.id"]']) {
            const toggle = page.locator(head);
            if (await toggle.getAttribute('aria-expanded') === 'false') await toggle.click();
          }
          await page.getByRole('link', {name:'属性エフェクトを完成画面で編集（出力オフ）'}).click();
          assert.equal(await page.locator('#open-mood').getAttribute('aria-expanded'), 'true');
          assert.equal(await page.evaluate(()=>document.activeElement.id), 'open-mood');
          await click('scene-effects');
          assert(await page.evaluate(()=>CPW.generator.blocks(CPW.state.outfit).effects.short.length > 0));
        }
      }
      await page.evaluate(() => {
        CPW.state.load(CPW.presetCatalog.create('mermaid'));
        location.hash = '#/presentation';
      });
      await page.locator('#pose-cards').waitFor();
      await page.getByText('目的から見せ方を選ぶ', {
        exact: true
      }).click();
      assert(await page.locator('#recipe-editorial').isDisabled());
      assert.match(await page.locator('#recipe-editorial').innerText(), /人魚/);
      await click('recipe-portrait');
      assert.match(await text(), /upper.body/i);
      assert.deepEqual(errors, []);
      await page.close();
      console.log(width + 'px passed');
    }
  } finally {
    await browser.close();
  }
}
main().catch(e => {
  console.error(e);
  process.exitCode = 1;
});
