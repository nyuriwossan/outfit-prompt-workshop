// Run from any directory with Node. The static application doesn't require a build.
const fs = require('node:fs');
const path = require('node:path');
const {root, load} = require('./test.cjs');
const categories = {
  ...require('./garment-plates/bodice.cjs'),
  collar:require('./garment-plates/collars.cjs'),
  cutout:require('./garment-plates/cutouts.cjs'),
  sleeves:require('./garment-plates/sleeves.cjs'),
  ...require('./garment-plates/finishes.cjs')
};
const rows = ['# 衣装図鑑の素材対応表','','保存先は `parts.<カテゴリID>`。図は共通素体と項目別の型紙から生成します。',
  '襟の形は単一のID、カットアウト・開口は選んだ順の `[{id, layer}]` で保存します。各項目の層は `inner`・`main`・`outer` のいずれかです。',
  '表示名・分類・英文は既存の衣装データを参照します。再生成は `node scripts/build-garment-plates.cjs`。','',
  '| カテゴリ | カテゴリID | 表示名 | 保存ID | SVG |','|---|---|---|---|---|'];
const slots = load().data.partSlots.filter(s=>Object.hasOwn(categories,s.id));
for (const slot of slots) {
  const {base,drawings,viewBox} = categories[slot.id];
  require('node:assert/strict').deepEqual(Object.keys(drawings).sort(),Array.from(slot.options,o=>o.id).sort());
  const dir = 'assets/garment-parts/'+slot.id;
  fs.mkdirSync(path.join(root,dir),{recursive:true});
  for (const option of slot.options) {
    const file = dir+'/'+option.id+'.svg';
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" stroke-width="1.45" stroke-linecap="round" stroke-linejoin="round">\n${base}\n${drawings[option.id]}\n</svg>\n`;
    fs.writeFileSync(path.join(root,file),svg);
    rows.push(`| ${slot.labelJa} | ${slot.id} | ${option.labelJa} | ${option.id} | [${option.id}.svg](../${file}) |`);
  }
}
fs.writeFileSync(path.join(root,'docs/garment-parts.md'),rows.join('\n')+'\n');
