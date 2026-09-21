/* Node-only test runner. The application itself needs no packages or build. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
function load() {
  const c = {console, setTimeout, clearTimeout};
  c.window = c; c.global = c;
  vm.createContext(c);
  for (const m of fs.readFileSync(path.join(root, 'tests.html'), 'utf8').matchAll(/<script src="([^"]+)"/g)) {
    vm.runInContext(fs.readFileSync(path.join(root, m[1]), 'utf8'), c, {filename:m[1]});
  }
  return c.CPW;
}
module.exports = {load, root};
if (require.main === module) {
  const r = load().runTests();
  console.log(`${r.passed} / ${r.total} passed`);
  r.results.filter(x => !x.ok).forEach(x => console.error(x.name + ': ' + x.error));
  if (process.argv[2]) fs.writeFileSync(process.argv[2], JSON.stringify(r, null, 2));
  process.exitCode = r.failed ? 1 : 0;
}
