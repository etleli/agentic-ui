import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'));
const workflow = await readFile(new URL('.github/workflows/validate.yml', root), 'utf8');

test('local staging metadata blocks publication and preserves package contracts', async () => {
  assert.equal(manifest.private, true);
  assert.equal(manifest.license, 'UNLICENSED');
  assert.equal(manifest.name, '@alphatraderone/agentic-ui');
  assert.equal(manifest.version, '0.3.2');
  assert.equal(manifest.name, lock.packages[''].name);
  assert.equal(manifest.version, lock.packages[''].version);
  assert.equal(manifest.repository.url, 'https://github.com/etleli/agentic-ui.git');
  assert.equal(manifest.publishConfig, undefined);
  assert.equal(manifest.dependencies.dompurify, '3.4.14');
  assert.equal(lock.packages[''].dependencies.dompurify, '3.4.14');
  assert.equal(lock.packages['node_modules/dompurify'].version, '3.4.14');
  assert.deepEqual(manifest.files, ['dist-library', 'src/theme/theme.css', 'README.md']);
  assert.deepEqual(manifest.sideEffects, ['**/*.css']);
  await assert.rejects(access(new URL('.npmrc', root)), { code: 'ENOENT' });
});

test('the only workflow validates PRs and main with the verified runtime', async () => {
  assert.deepEqual(await readdir(new URL('.github/workflows/', root)), ['validate.yml']);
  assert.match(workflow, /^\s{2}pull_request:/m);
  assert.match(workflow, /^\s{2}push:\s*\n\s+branches: \[main\]/m);
  assert.match(workflow, /^permissions:\s*\n\s+contents: read/m);
  assert.match(workflow, /node-version: '24\.19\.0'/);
  assert.match(workflow, /npm install --global npm@11\.17\.0/);
  assert.match(workflow, /npm ci/);
  assert.match(workflow, /npm run validate/);
  assert.doesNotMatch(workflow, /npm publish|id-token:|packages:\s*write|contents:\s*write|\brelease:|\bdeploy|registry-url:|NODE_AUTH_TOKEN|NPM_TOKEN|secrets\./i);
  assert.equal(manifest.scripts.validate, 'npm run check && npm run pack:check && git diff --check');
  assert.match(manifest.scripts.check, /npm run test:tarball/);
});

test('workshop composition stays separate from application routes', async () => {
  assert.deepEqual((await readdir(new URL('src/app/', root))).sort(), ['App.tsx', 'componentRegistry.tsx']);
  const app = await readFile(new URL('src/app/App.tsx', root), 'utf8');
  assert.doesNotMatch(app, /mockup/i);
  assert.match(app, /ariaLabel="Component previews"/);
  assert.match(app, /function openFullscreenPreview/);
});
