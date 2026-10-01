import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdtempSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const mode = args.includes('--published') ? 'published' : 'candidate';
const browser = args.includes('--webkit') ? 'webkit' : 'chromium';
const reportIndex = args.indexOf('--report');
assert.ok(reportIndex < 0 || args[reportIndex + 1] && !args[reportIndex + 1].startsWith('--'), '--report requires a path.');
const reportPath = reportIndex < 0 ? null : resolve(args[reportIndex + 1]);
assert.ok(args.every((arg, index) => ['--published', '--webkit', '--compound-only', '--report'].includes(arg) || index === reportIndex + 1 && reportIndex >= 0), 'Unknown Modal test option.');
assert.ok(process.env.npm_execpath, 'Run through npm run test:modal-focus.');
const temporary = mkdtempSync(join(tmpdir(), 'agentic-ui-modal-native-'));
function run(command, values, cwd = temporary, timeout = 180000) {
  const result = spawnSync(command, values, { cwd, encoding: 'utf8', timeout, maxBuffer: 16 * 1024 * 1024, windowsHide: true });
  assert.ifError(result.error);
  if (result.status !== 0) throw new Error(`${command} failed (${result.status}):\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const npm = (values, cwd) => run(process.execPath, [process.env.npm_execpath, ...values], cwd);
const sourceFiles = ['src/components/overlays/Modal/Modal.tsx', 'src/components/overlays/Modal/Modal.focus.ts', 'src/components/overlays/overlayPortal.tsx', 'src/components/overlays/Modal/Modal.css'];
const hashes = () => Object.fromEntries(sourceFiles.map((file) => [file, createHash('sha256').update(readFileSync(join(root, file), 'utf8').replaceAll('\r\n', '\n')).digest('hex')]));
const sourceHashes = mode === 'candidate' ? hashes() : null;
if (mode === 'candidate') assert.doesNotMatch(readFileSync(join(root, sourceFiles[1]), 'utf8'), /keydown|preventDefault|tabIndex|querySelector/,
  'Focus containment must not enumerate targets or intercept native Tab.');
try {
  cpSync(join(root, 'scripts/modal-focus'), temporary, { recursive: true });
  let dependency = '0.1.0-beta.2';
  if (mode !== 'published') {
    npm(['run', 'build:lib'], root);
    const [pack] = JSON.parse(npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root));
    dependency = `file:${join(temporary, pack.filename).replaceAll('\\', '/')}`;
  }
  writeFileSync(join(temporary, 'package.json'), JSON.stringify({ name: 'modal-native-consumer', private: true, type: 'module', dependencies: { '@etleli/agentic-ui': dependency, react: '19.3.0', 'react-dom': '19.3.0' }, devDependencies: { playwright: '1.63.0', vite: '6.4.3' } }, null, 2));
  npm(['install', '--ignore-scripts', '--no-fund', '--no-audit', '--registry=https://registry.npmjs.org/']);
  run(process.execPath, ['ssr.mjs']);
  npm(['exec', '--', 'playwright', 'install', ...(process.platform === 'linux' ? ['--with-deps'] : []), browser]);
  const result = spawnSync(process.execPath, ['browser.mjs', mode, browser, args.includes('--compound-only') ? 'compound' : 'complete'], { cwd: temporary, encoding: 'utf8', timeout: 360000, maxBuffer: 8 * 1024 * 1024, windowsHide: true });
  assert.ifError(result.error);
  if (result.stderr) console.error(result.stderr);
  if (sourceHashes) assert.deepEqual(hashes(), sourceHashes, 'Source changed while the candidate was built/tested.');
  const report = JSON.parse(readFileSync(join(temporary, 'report.json'), 'utf8'));
  report.npm = npm(['--version']).trim();
  report.ssr = 'plain Node SSR passed; contained HTML used by hydration cases';
  const compact = { ...report, cases: report.cases.map(({ name, passed, failure, observation }) => ({ name, passed, ...(failure ? { failure: failure.split('\n')[0] } : {}), ...(/compound|initial safe|native forward|native backward|restoration on/.test(name) ? { observation } : {}) })), ...(sourceHashes ? { sourceHashes } : {}) };
  if (reportPath) { mkdirSync(dirname(reportPath), { recursive: true }); writeFileSync(reportPath, `${JSON.stringify(compact, null, 2)}\n`); }
  console.log(JSON.stringify({ mode, browser: report.browser, summary: report.summary, warnings: report.warnings, errors: report.errors, failures: report.cases.filter((entry) => !entry.passed).map((entry) => ({ name: entry.name, failure: entry.failure })) }, null, 2));
  assert.equal(result.status, 0, 'Modal focus regressions failed; inspect the case report.');
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  assert.equal(dirname(resolve(temporary)), resolve(tmpdir()));
  assert.ok(basename(temporary).startsWith('agentic-ui-modal-native-'));
  rmSync(temporary, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });
  rmSync(`${temporary}.progress.json`, { force: true });
}
