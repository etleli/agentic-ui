import assert from 'node:assert/strict';
import { access, readFile, readdir } from 'node:fs/promises';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'));
const workflow = await readFile(new URL('.github/workflows/validate.yml', root), 'utf8');

test('personal candidate metadata blocks publication and preserves package contracts', async () => {
  assert.equal(manifest.private, true);
  assert.equal(manifest.license, 'SEE LICENSE IN LICENSE');
  assert.equal(manifest.name, '@etleli/agentic-ui');
  assert.equal(manifest.version, '0.1.0-beta.1');
  assert.deepEqual(manifest.author, { name: 'Elias Etl', url: 'https://github.com/etleli' });
  assert.equal(lock.name, manifest.name);
  assert.equal(lock.version, manifest.version);
  assert.equal(manifest.name, lock.packages[''].name);
  assert.equal(manifest.version, lock.packages[''].version);
  assert.equal(manifest.license, lock.packages[''].license);
  assert.equal(manifest.repository.url, 'https://github.com/etleli/agentic-ui.git');
  assert.deepEqual(manifest.publishConfig, { registry: 'https://registry.npmjs.org/', access: 'public', tag: 'beta' });
  assert.equal(manifest.dependencies.dompurify, '3.4.14');
  assert.equal(lock.packages[''].dependencies.dompurify, '3.4.14');
  assert.equal(lock.packages['node_modules/dompurify'].version, '3.4.14');
  assert.deepEqual(manifest.files, ['dist-library', 'src/theme/theme.css', 'README.md', 'LICENSE', 'THIRD_PARTY_NOTICES.md']);
  assert.deepEqual(manifest.sideEffects, ['**/*.css']);
  const license = await readFile(new URL('LICENSE', root), 'utf8');
  assert.match(license, /DRAFT FOR OWNER REVIEW/);
  assert.match(license, /Copyright \(c\) 2026 Elias Etl/);
  const notices = (await readFile(new URL('THIRD_PARTY_NOTICES.md', root), 'utf8')).replaceAll('\r\n', '\n');
  const bundledLicense = (await readFile(new URL('node_modules/dompurify/LICENSE', root), 'utf8')).replaceAll('\r\n', '\n').trim();
  assert.ok(notices.includes(bundledLicense), 'Preserve the complete bundled DOMPurify Apache license.');
  assert.match(notices, /Cure53 and other contributors/);
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
