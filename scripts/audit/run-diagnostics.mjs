import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { cpSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, basename, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const baseline = 'd9795c190c79266f96cc3b196b0d6a2e0335d225';
const output = resolve(root, process.argv[2] ?? 'docs/audit/evidence/published-beta.1.json');
assert.ok(process.env.npm_execpath, 'Run through npm run audit:diagnostics.');
const temporary = mkdtempSync(join(tmpdir(), 'agentic-ui-audit-'));
function run(command, args, cwd = temporary, timeout = 180000) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', timeout, maxBuffer: 16 * 1024 * 1024, windowsHide: true });
  assert.ifError(result.error);
  if (result.status !== 0) throw new Error(`${command} ${args[0]} failed (${result.status})\n${result.stdout}\n${result.stderr}`);
  return result.stdout;
}
const npm = (args, cwd) => run(process.execPath, [process.env.npm_execpath, ...args], cwd);
try {
  const consumer = join(temporary, 'consumer');
  cpSync(join(root, 'scripts/audit/fixture'), consumer, { recursive: true });
  cpSync(join(root, 'scripts/audit/browser-diagnostics.mjs'), join(consumer, 'browser-diagnostics.mjs'));
  writeFileSync(join(consumer, 'package.json'), JSON.stringify({ name: 'agentic-ui-audit-consumer', private: true, type: 'module', dependencies: { '@etleli/agentic-ui': '0.1.0-beta.1', react: '19.3.0', 'react-dom': '19.3.0' }, devDependencies: { vite: '6.4.3', playwright: '1.63.0' } }, null, 2));
  console.log('Installing the exact published beta in an isolated consumer (no source alias or local archive).');
  npm(['install', '--ignore-scripts', '--no-fund', '--no-audit', '--registry=https://registry.npmjs.org/'], consumer);
  npm(['exec', '--', 'playwright', 'install', 'chromium'], consumer);
  // The workshop is not shipped in npm: reproduce its wiring from the exact public release source.
  const workshop = join(temporary, 'workshop');
  mkdirSync(workshop);
  run('git', ['archive', '--format=tar', '--output', join(temporary, 'source.tar'), baseline], root);
  run('tar', ['-xf', join(temporary, 'source.tar'), '-C', workshop]);
  npm(['ci', '--no-fund', '--no-audit'], workshop);
  mkdirSync(dirname(output), { recursive: true });
  console.log('Running bounded Chromium diagnostics; confirmed violations are reported separately from harness success.');
  const result = run(process.execPath, ['browser-diagnostics.mjs', workshop, output, baseline], consumer, 240000);
  console.log(result);
  const report = JSON.parse(readFileSync(output, 'utf8'));
  assert.equal(report.harnessCompleted, true);
} finally {
  assert.equal(dirname(resolve(temporary)), resolve(tmpdir()));
  assert.ok(basename(temporary).startsWith('agentic-ui-audit-'));
  rmSync(temporary, { recursive: true, force: true });
}
