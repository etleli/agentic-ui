import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const published = args.includes('--published');
const reportIndex = args.indexOf('--report');
assert.ok(reportIndex < 0 || args[reportIndex + 1] && !args[reportIndex + 1].startsWith('--'), '--report requires a path.');
const reportPath = reportIndex < 0 ? null : resolve(args[reportIndex + 1]);
assert.ok(args.every((arg, index) => ['--published', '--report'].includes(arg) || index === reportIndex + 1 && reportIndex >= 0), 'Unknown Modal test option.');
assert.ok(process.env.npm_execpath, 'Run through npm run test:modal-focus.');
const temporary = mkdtempSync(join(tmpdir(), 'agentic-ui-modal-'));
function run(command, values, cwd = temporary, timeout = 180000) {
  const result = spawnSync(command, values, { cwd, encoding: 'utf8', timeout, maxBuffer: 16 * 1024 * 1024, windowsHide: true });
  assert.ifError(result.error);
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}):\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const npm = (values, cwd) => run(process.execPath, [process.env.npm_execpath, ...values], cwd);
const sourceFiles = ['src/components/overlays/Modal/Modal.tsx', 'src/components/overlays/Modal/Modal.focus.ts', 'src/components/overlays/overlayPortal.tsx'];
const hashes = () => Object.fromEntries(sourceFiles.map((file) => [file, createHash('sha256').update(readFileSync(join(root, file), 'utf8').replaceAll('\r\n', '\n')).digest('hex')]));
const sourceHashes = published ? null : hashes();
try {
  cpSync(join(root, 'scripts/modal-focus'), temporary, { recursive: true });
  let dependency = '0.1.0-beta.1';
  if (!published) {
    npm(['run', 'build:lib'], root);
    const [pack] = JSON.parse(npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root));
    dependency = `file:${join(temporary, pack.filename).replaceAll('\\', '/')}`;
  }
  writeFileSync(join(temporary, 'package.json'), JSON.stringify({ name: 'modal-focus-consumer', private: true, type: 'module', dependencies: { '@etleli/agentic-ui': dependency, react: '19.3.0', 'react-dom': '19.3.0' }, devDependencies: { playwright: '1.63.0', vite: '6.4.3' } }, null, 2));
  npm(['install', '--ignore-scripts', '--no-fund', '--no-audit', '--registry=https://registry.npmjs.org/']);
  npm(['exec', '--', 'playwright', 'install', ...(process.platform === 'linux' ? ['--with-deps'] : []), 'chromium']);
  const result = spawnSync(process.execPath, ['browser.mjs', published ? 'published' : 'candidate'], { cwd: temporary, encoding: 'utf8', timeout: 240000, maxBuffer: 8 * 1024 * 1024, windowsHide: true });
  assert.ifError(result.error);
  console.log(result.stdout);
  if (result.stderr) console.error(result.stderr);
  if (!published) assert.deepEqual(hashes(), sourceHashes, 'Source changed while the candidate was built/tested.');
  if (reportPath) {
    const report = JSON.parse(readFileSync(join(temporary, 'report.json'), 'utf8'));
    if (sourceHashes) report.sourceHashes = sourceHashes;
    mkdirSync(dirname(reportPath), { recursive: true }); writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`);
  }
  assert.equal(result.status, 0, 'Modal focus regressions failed; inspect the case report above.');
} finally {
  assert.equal(dirname(resolve(temporary)), resolve(tmpdir()));
  assert.ok(basename(temporary).startsWith('agentic-ui-modal-'));
  rmSync(temporary, { recursive: true, force: true });
}
