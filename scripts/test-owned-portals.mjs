import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..'), args = process.argv.slice(2);
assert.equal(process.version, 'v24.19.0', 'Use the documented Node runtime.');
assert.ok(process.env.npm_execpath, 'Run through npm exec -- node scripts/test-owned-portals.mjs');
const temporary = mkdtempSync(join(tmpdir(), 'agentic-ui-owned-portals-'));
function run(values, cwd = temporary) {
  const result = spawnSync(process.execPath, [process.env.npm_execpath, ...values], { cwd, encoding: 'utf8', timeout: 180000, maxBuffer: 16 * 1024 * 1024, windowsHide: true });
  assert.ifError(result.error); assert.equal(result.status, 0, `${result.stdout}\n${result.stderr}`); return result.stdout;
}
try {
  cpSync(join(root, 'scripts/owned-portals'), temporary, { recursive: true });
  let dependency = '0.1.0-beta.2';
  if (!args.includes('--published')) {
    run(['run', 'build:lib'], root);
    const [pack] = JSON.parse(run(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root));
    dependency = `file:${join(temporary, pack.filename).replaceAll('\\', '/')}`;
  }
  writeFileSync(join(temporary, 'package.json'), JSON.stringify({ private: true, type: 'module', dependencies: { '@etleli/agentic-ui': dependency, react: '19.3.0', 'react-dom': '19.3.0' }, devDependencies: { vite: '6.4.3', playwright: '1.63.0' } }));
  run(['install', '--ignore-scripts', '--no-audit', '--no-fund']);
  const ssr = spawnSync(process.execPath, ['ssr.mjs'], { cwd: temporary, encoding: 'utf8', timeout: 30000, windowsHide: true });
  assert.ifError(ssr.error); assert.equal(ssr.status, 0, `${ssr.stdout}\n${ssr.stderr}`);
  const browser = args.includes('--webkit') ? 'webkit' : 'chromium';
  run(['exec', '--', 'playwright', 'install', ...(process.platform === 'linux' ? ['--with-deps'] : []), browser]);
  const installed = JSON.parse(readFileSync(join(temporary, 'package-lock.json'), 'utf8')).packages['node_modules/@etleli/agentic-ui'];
  if (args.includes('--published')) assert.equal(installed.integrity, 'sha512-xKUkylr5hcZcAE3QdGSs3YmVoUG3VSfEege9Qd4E09r0b3RZ1AXYIYg74wma8cdiG9n++sDUJO0U4NiiLa6Fvw==');
  const result = spawnSync(process.execPath, [args.includes('--boundary') ? 'boundary.mjs' : 'browser.mjs', browser, ...(args.includes('--small') ? ['small'] : []), ...(args.includes('--extras') ? ['extras'] : []), ...(args.includes('--standalone') ? ['standalone'] : [])], { cwd: temporary, encoding: 'utf8', timeout: 360000, maxBuffer: 12 * 1024 * 1024, windowsHide: true });
  assert.ifError(result.error);
  const report = readFileSync(join(temporary, 'report.json'), 'utf8');
  const destinationIndex = args.indexOf('--report');
  if (destinationIndex >= 0) { const destination = resolve(args[destinationIndex + 1]); mkdirSync(dirname(destination), { recursive: true }); writeFileSync(destination, report); }
  console.log(result.stdout); if (result.stderr) console.error(result.stderr);
  assert.equal(result.status, 0, 'Owned portal browser tests failed.');
} catch (error) { console.error(error); process.exitCode = 1; }
finally {
  assert.equal(dirname(resolve(temporary)), resolve(tmpdir())); assert.ok(basename(temporary).startsWith('agentic-ui-owned-portals-'));
  rmSync(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
}
