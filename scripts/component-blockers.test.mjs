import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const worker = fileURLToPath(new URL('./component-blockers-worker.mjs', import.meta.url));

function check(args) {
  const result = spawnSync(process.execPath, [
    '--no-experimental-webstorage', '--no-experimental-global-navigator', worker, ...args,
  ], {
    env: { ...process.env, NODE_ENV: 'development', NODE_OPTIONS: '' },
    encoding: 'utf8', timeout: 20000, maxBuffer: 256 * 1024, windowsHide: true,
  });
  if (process.env.COMPONENT_TEST_REPORT_DIR) {
    mkdirSync(process.env.COMPONENT_TEST_REPORT_DIR, { recursive: true });
    writeFileSync(join(process.env.COMPONENT_TEST_REPORT_DIR, args.join('-') + '.json'), JSON.stringify({
      args, status: result.status, signal: result.signal, error: result.error?.message,
      stdout: result.stdout, stderr: result.stderr,
    }, null, 2) + '\n');
  }
  assert.ifError(result.error);
  assert.equal(result.status, 0, result.stderr || result.stdout || 'Component worker failed');
  const report = JSON.parse(result.stdout);
  assert.equal(report.passed, true);
}

for (const mode of ['normal', 'strict']) {
  for (const scenario of ['uncontrolled', 'accepting', 'declining', 'declining-empty', 'limits-disabled']) {
    test(`FilePicker ${scenario} (${mode})`, () => check(['filepicker', mode, scenario]));
  }
  for (const component of ['SplitPane', 'ResizablePanel']) {
    for (const scenario of ['hydration', 'stored-values', 'storage-failures', 'persistence', 'keys-controlled', 'directions']) {
      test(`${component} ${scenario} (${mode})`, () => check(['panel', mode, scenario, component]));
    }
  }
}
for (const component of ['SplitPane', 'ResizablePanel']) {
  for (const scenario of ['default', 'persisted', 'controlled']) {
    test(`${component} clean Node SSR (${scenario})`, () => check(['ssr', 'normal', scenario, component]));
  }
}
