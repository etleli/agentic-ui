import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { basename, dirname, join, relative, resolve } from 'node:path';
import test from 'node:test';

const root = new URL('../', import.meta.url);
const manifest = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const lock = JSON.parse(await readFile(new URL('package-lock.json', root), 'utf8'));
const workflow = await readFile(new URL('.github/workflows/validate.yml', root), 'utf8');

test('activated beta metadata preserves the approved publication settings and package contracts', async () => {
  assert.equal(manifest.private, false);
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
  const licenseText = license.replace(/\s+/g, ' ');
  assert.match(license, /^Agentic UI Personal Noncommercial License\r?\n/);
  assert.doesNotMatch(license, /DRAFT FOR OWNER REVIEW|NOT APPROVED FOR RELEASE|Review status:|proposed/i);
  assert.match(license, /Copyright \(c\) 2026 Elias Etl/);
  assert.match(license, /^3\. Modification and sharing permission\r?$/m);
  assert.match(license, /^6\. Termination and cure\r?$/m);
  for (const requiredTerm of [
    'Use for an employer, client, business, or other organization does not qualify, even when performed by an individual, without payment, or for an organization described as nonprofit.',
    'Commercial Use requires prior written authorization from Elias Etl.',
    'Any use outside the personal permission, including organizational use, also requires prior written authorization.',
    'Authorization may be granted free of charge or subject to separately agreed terms. Requiring authorization does not, by itself, imply a fee.',
    'There is no revenue threshold or automatic exemption based on size, legal form, or nonprofit status.',
    'It does not require visible branding in a consuming user interface.',
    '30 calendar days after you discover it or receive notice of it, whichever occurs first.',
  ]) {
    assert.ok(licenseText.includes(requiredTerm), `Final license must retain: ${requiredTerm}`);
  }
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

const requireFromVite = createRequire(new URL('../node_modules/vite/package.json', import.meta.url));
const postcss = requireFromVite('postcss');

async function withSourceMapFixtures(check) {
  const directory = await mkdtemp(join(tmpdir(), 'agentic-ui-source-maps-'));
  const styles = join(directory, 'styles');
  const outside = join(directory, 'outside.map');
  const input = join(styles, 'input.css');
  const makeMap = (marker) => JSON.stringify({ version: 3, sources: ['original.css'], sourcesContent: [marker], names: [], mappings: 'AAAA' });
  try {
    await mkdir(styles);
    await writeFile(outside, makeMap('SYNTHETIC_OUTSIDE_SOURCE'));
    await writeFile(join(styles, 'inside.map'), makeMap('SYNTHETIC_INSIDE_SOURCE'));
    async function processCss(annotation, options = {}) {
      const result = await postcss().process(`a { color: red }\n/*# sourceMappingURL=${annotation} */`, {
        from: undefined,
        map: { inline: false, annotation: false },
        ...options,
      });
      assert.match(result.css, /color: red/, 'Ordinary CSS must remain intact.');
      return `${result.root.source.input.map?.text ?? ''}\n${result.map?.toString() ?? ''}`;
    }
    await check({ input, outside, makeMap, processCss });
  } finally {
    assert.equal(dirname(resolve(directory)), resolve(tmpdir()));
    assert.ok(basename(directory).startsWith('agentic-ui-source-maps-'));
    await rm(directory, { recursive: true, force: true });
  }
}

test('PostCSS rejects annotation traversal outside the CSS directory', async () => {
  await withSourceMapFixtures(async ({ input, processCss }) => {
    const map = await processCss('../outside.map', { from: input });
    assert.doesNotMatch(map, /SYNTHETIC_OUTSIDE_SOURCE/);
  });
});

test('PostCSS rejects external annotations when no source filename is supplied', async () => {
  await withSourceMapFixtures(async ({ outside, processCss }) => {
    for (const annotation of [outside, relative(process.cwd(), outside)]) {
      const map = await processCss(annotation.replaceAll('\\', '/'));
      assert.doesNotMatch(map, /SYNTHETIC_OUTSIDE_SOURCE/);
    }
  });
});

test('PostCSS preserves safe inline/local maps and explicit caller map choices', async () => {
  await withSourceMapFixtures(async ({ input, outside, makeMap, processCss }) => {
    assert.match(await processCss('inside.map', { from: input }), /SYNTHETIC_INSIDE_SOURCE/);
    const inline = `data:application/json;base64,${Buffer.from(makeMap('SYNTHETIC_INLINE_SOURCE')).toString('base64')}`;
    assert.match(await processCss(inline, { from: input }), /SYNTHETIC_INLINE_SOURCE/);
    assert.doesNotMatch(await processCss('../outside.map', { from: input, map: false }), /SYNTHETIC_OUTSIDE_SOURCE/);
    // An explicit trusted prev callback is a different boundary from an annotation.
    assert.match(await processCss('inside.map', { from: input, map: { inline: false, annotation: false, prev: () => outside } }), /SYNTHETIC_OUTSIDE_SOURCE/);
  });
});
