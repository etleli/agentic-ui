import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, readdirSync, realpathSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';
import { JSDOM } from 'jsdom';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'));
const lock = JSON.parse(readFileSync(join(root, 'package-lock.json'), 'utf8'));
const npmCli = process.env.npm_execpath;
assert.ok(npmCli, 'Run this check through npm run test:tarball.');
let suppliedArchive;
let registryInstall = false;
let reportPath;
const argumentsToRead = process.argv.slice(2);
while (argumentsToRead.length) {
  const option = argumentsToRead.shift();
  if (option === '--registry') {
    registryInstall = true;
  } else if (option === '--tarball' || option === '--report') {
    const value = argumentsToRead.shift();
    assert.ok(value && !value.startsWith('--'), `${option} requires a path.`);
    if (option === '--tarball') suppliedArchive = realpathSync(resolve(value));
    else reportPath = resolve(value);
  } else {
    throw new Error(`Unknown option: ${option}`);
  }
}
assert.ok(!registryInstall || suppliedArchive, '--registry requires the approved --tarball for integrity comparison.');
if (reportPath && suppliedArchive) {
  const comparable = (value) => process.platform === 'win32' ? value.toLowerCase() : value;
  assert.notEqual(comparable(reportPath), comparable(suppliedArchive), 'The report must not overwrite the supplied archive.');
  if (existsSync(reportPath)) {
    const reportFile = statSync(reportPath, { bigint: true });
    const archiveFile = statSync(suppliedArchive, { bigint: true });
    assert.ok(reportFile.dev !== archiveFile.dev || reportFile.ino !== archiveFile.ino, 'The report must not alias the supplied archive.');
  }
}
const temporary = mkdtempSync(join(tmpdir(), 'agentic-ui-consumer-'));

function archiveIntegrity(file) {
  return `sha512-${createHash('sha512').update(readFileSync(file)).digest('base64')}`;
}

function run(command, args, cwd = temporary) {
  return execFileSync(command, args, { cwd, encoding: 'utf8', maxBuffer: 16 * 1024 * 1024, stdio: ['ignore', 'pipe', 'pipe'] });
}

function npm(args, cwd) {
  return run(process.execPath, [npmCli, ...args], cwd);
}

function write(name, contents) {
  writeFileSync(join(temporary, name), contents);
}

function assertConsumerDocumentScrolling(css, label) {
  const dom = new JSDOM('<!doctype html><html><head></head><body><div id="root"></div></body></html>');
  try {
    const style = dom.window.document.createElement('style');
    style.textContent = css;
    dom.window.document.head.append(style);
    assert.ok(style.sheet, `${label} must parse as CSS.`);
    const roots = [...dom.window.document.querySelectorAll('html, body, #root')];
    function inspect(rules) {
      for (const rule of rules) {
        // Inspect every media/supports branch, including desktop-only rules.
        if (rule.cssRules) inspect(rule.cssRules);
        if (!rule.selectorText) continue;
        const locksScroll = ['overflow', 'overflow-x', 'overflow-y'].some((property) => /hidden|clip/.test(rule.style.getPropertyValue(property)));
        const fixesRoot = rule.style.getPropertyValue('position') === 'fixed';
        // Color-only vendor pseudo-element rules cannot affect document scrolling.
        if ((!locksScroll && !fixesRoot) || !roots.some((root) => root.matches(rule.selectorText))) continue;
        for (const property of ['overflow', 'overflow-x', 'overflow-y']) {
          assert.doesNotMatch(rule.style.getPropertyValue(property), /hidden|clip/, `${label}: ${rule.selectorText} must not lock consumer scrolling.`);
        }
        assert.notEqual(rule.style.getPropertyValue('position'), 'fixed', `${label}: ${rule.selectorText} must not fix the consumer root to the viewport.`);
      }
    }
    inspect(style.sheet.cssRules);
  } finally {
    dom.window.close();
  }
}

try {
  let packed;
  // A supplied release archive is inspected and installed directly, never repacked.
  if (!suppliedArchive) [packed] = JSON.parse(npm(['pack', '--ignore-scripts', '--json', '--pack-destination', temporary], root));
  const archive = suppliedArchive ?? join(temporary, packed.filename);
  const integrity = archiveIntegrity(archive);
  if (packed) assert.equal(integrity, packed.integrity);
  const entries = run('tar', ['-tzf', archive]).trim().split(/\r?\n/);
  if (packed) assert.equal(entries.length, packed.files.length);
  assert.equal(new Set(entries).size, entries.length, 'Archive entries must be unique.');
  for (const entry of entries) {
    assert.match(entry, /^package\/(?:package\.json|README\.md|LICENSE|THIRD_PARTY_NOTICES\.md|src\/theme\/theme\.css|dist-library\/(?:agentic-ui\.(?:js|cjs|css)|types\/.+\.d\.ts(?:\.map)?|agent-guides\/.+\.(?:md|json)))$/);
    assert.ok(!entry.split('/').includes('..'), `Unsafe archive path: ${entry}`);
  }

  const packedManifest = JSON.parse(run('tar', ['-xzOf', archive, 'package/package.json']));
  assert.deepEqual(packedManifest, manifest, 'Packed manifest must exactly match the reviewed source manifest.');
  assert.equal(packedManifest.name, manifest.name);
  assert.equal(packedManifest.version, manifest.version);
  assert.equal(packedManifest.private, false);
  const devDependencies = {};
  for (const name of ['@types/react', '@types/react-dom', 'typescript', 'vite']) {
    devDependencies[name] = lock.packages[`node_modules/${name}`].version;
  }
  // The host app declares its React peers; library runtime dependencies are not preloaded.
  const dependencies = {
    [manifest.name]: registryInstall ? manifest.version : `file:${archive.replaceAll('\\', '/')}`,
    react: manifest.peerDependencies.react,
    'react-dom': manifest.peerDependencies['react-dom'],
  };
  write('package.json', JSON.stringify({ name: 'local-tarball-consumer', private: true, type: 'module', dependencies, devDependencies }, null, 2));
  npm(['install', '--ignore-scripts', '--no-audit', '--no-fund', '--prefer-online', '--registry=https://registry.npmjs.org/']);
  const consumerLock = JSON.parse(readFileSync(join(temporary, 'package-lock.json'), 'utf8'));
  const installedLockEntry = consumerLock.packages[`node_modules/${manifest.name}`];
  assert.equal(installedLockEntry.integrity, integrity, 'Installed package must match this exact archive.');
  if (registryInstall) assert.match(installedLockEntry.resolved, /^https:\/\/registry\.npmjs\.org\//);

  const installed = join(temporary, 'node_modules', ...manifest.name.split('/'));
  assert.ok(realpathSync(installed).startsWith(realpathSync(temporary)), 'Package must be installed from the archive, not linked to source.');
  const installedManifest = JSON.parse(readFileSync(join(installed, 'package.json'), 'utf8'));
  assert.deepEqual(installedManifest, packedManifest, 'Installed manifest must preserve the approved archive metadata.');
  assert.equal(installedManifest.private, false);
  assert.equal(installedManifest.name, manifest.name);
  assert.equal(installedManifest.version, manifest.version);
  assert.equal(installedManifest.license, 'SEE LICENSE IN LICENSE');
  assert.deepEqual(installedManifest.author, manifest.author);
  assert.deepEqual(installedManifest.publishConfig, manifest.publishConfig);
  assert.deepEqual(installedManifest.exports, manifest.exports);
  assert.deepEqual(installedManifest.dependencies, manifest.dependencies);
  assert.deepEqual(installedManifest.peerDependencies, manifest.peerDependencies);
  for (const noticeFile of ['LICENSE', 'THIRD_PARTY_NOTICES.md']) {
    assert.equal(run('tar', ['-xzOf', archive, `package/${noticeFile}`]), readFileSync(join(root, noticeFile), 'utf8'), `${noticeFile} in the supplied archive must match the source checkout.`);
    assert.deepEqual(readFileSync(join(installed, noticeFile)), readFileSync(join(root, noticeFile)), `${noticeFile} must exactly match the reviewed repository file.`);
  }
  const notices = readFileSync(join(installed, 'THIRD_PARTY_NOTICES.md'), 'utf8').replaceAll('\r\n', '\n');
  assert.ok(notices.includes(readFileSync(join(root, 'node_modules/dompurify/LICENSE'), 'utf8').replaceAll('\r\n', '\n').trim()));
  for (const bundle of ['agentic-ui.js', 'agentic-ui.cjs']) {
    assert.match(readFileSync(join(installed, 'dist-library', bundle), 'utf8'), /Cure53 and other contributors/);
  }
  console.log('Candidate license and third-party notices match exactly; bundled attribution is retained.');

  let maps = 0;
  for (const entry of entries) {
    const text = readFileSync(join(installed, entry.slice('package/'.length)), 'utf8');
    if (entry.startsWith('package/dist-library/')) assert.doesNotMatch(text, /src\/app\/|[?&]mockup=/);
    if (entry.endsWith('.map')) {
      const map = JSON.parse(text);
      for (const source of map.sources ?? []) assert.doesNotMatch(source, /(?:^|\/)app\//);
      maps += 1;
    }
  }
  const guides = JSON.parse(readFileSync(join(installed, 'dist-library/agent-guides/index.json'), 'utf8'));
  assert.ok(guides.guides.length >= 5);
  for (const guide of guides.guides) assert.match(readFileSync(join(installed, 'dist-library/agent-guides', guide.path), 'utf8'), /componentId:/);
  assert.match(readFileSync(join(installed, 'dist-library/agent-guides', guides.globalRulebook), 'utf8'), /Generation Rulebook/);
  assert.match(readFileSync(join(installed, 'dist-library/agentic-ui.css'), 'utf8'), /--color-foreground/);
  assert.match(readFileSync(join(installed, 'src/theme/theme.css'), 'utf8'), /--color-foreground/);
  for (const cssPath of ['dist-library/agentic-ui.css', 'src/theme/theme.css']) {
    assertConsumerDocumentScrolling(readFileSync(join(installed, cssPath), 'utf8'), cssPath);
  }
  console.log('Both packaged CSS exports preserve consumer document scrolling.');

  write('runtime.mjs', `
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import * as library from '${manifest.name}';
const require = createRequire(import.meta.url);
const cjs = require('${manifest.name}');
assert.deepEqual(Object.keys(library).sort(), Object.keys(cjs).sort());
for (const entry of ['Button', 'NodeCanvas', 'OrderTicket', 'Watchlist', 'ObsidianGraphView', 'createNodeCanvasInteractionController']) assert.ok(library[entry]);
assert.match(renderToStaticMarkup(createElement(library.Button, {}, 'Consumer works')), /Consumer works/);
assert.match(require.resolve('${manifest.name}/style.css'), /agentic-ui\\.css$/);
assert.match(require.resolve('${manifest.name}/theme.css'), /theme\\.css$/);
assert.ok(require('${manifest.name}/agent-guides/index.json').guides.length >= 5);
console.log('ESM/CommonJS exports and rendered button passed: ' + Object.keys(library).length + ' runtime exports.');
`);
  console.log(run(process.execPath, ['runtime.mjs']).trim());

  const source = ts.createSourceFile('index.ts', readFileSync(join(root, 'src/index.ts'), 'utf8'), ts.ScriptTarget.Latest);
  const publicNames = source.statements.filter(ts.isExportDeclaration).flatMap((statement) => statement.exportClause && ts.isNamedExports(statement.exportClause) ? statement.exportClause.elements.map((element) => element.name.text) : []);
  write('public-api.ts', `export { ${publicNames.join(', ')} } from '${manifest.name}';\n`);
  write('main.tsx', `import { createRoot } from 'react-dom/client';\nimport { Button } from '${manifest.name}';\nimport type { ButtonProps, NodeCanvasProps } from '${manifest.name}';\nimport '${manifest.name}/style.css';\nimport '${manifest.name}/theme.css';\nconst props: ButtonProps = { children: 'Tarball consumer' };\nexport type CanvasContract = NodeCanvasProps;\ncreateRoot(document.getElementById('root')!).render(<Button {...props} />);\n`);
  write('css.d.ts', "declare module '*.css';\n");
  write('tsconfig.json', JSON.stringify({ compilerOptions: { target: 'ES2020', module: 'ESNext', moduleResolution: 'Bundler', jsx: 'react-jsx', strict: true, noEmit: true, skipLibCheck: false, lib: ['ES2020', 'DOM', 'DOM.Iterable'] }, include: ['*.ts', '*.tsx'] }));
  write('index.html', '<!doctype html><html><head><title>Local package consumer</title></head><body><div id="root"></div><script type="module" src="/main.tsx"></script></body></html>');
  run(process.execPath, [join(temporary, 'node_modules/typescript/bin/tsc'), '--pretty', 'false']);
  run(process.execPath, [join(temporary, 'node_modules/vite/bin/vite.js'), 'build']);
  const cssFiles = readdirSync(join(temporary, 'dist/assets')).filter((name) => name.endsWith('.css'));
  assert.ok(cssFiles.length > 0, 'Consumer build must emit packaged CSS.');
  assert.ok(cssFiles.some((name) => readFileSync(join(temporary, 'dist/assets', name), 'utf8').includes('--color-foreground')));
  assert.equal(archiveIntegrity(archive), integrity, 'Verification must not modify the archive.');
  const consumerDependencies = JSON.parse(npm(['ls', '--omit=dev', '--all', '--json']));
  const verification = {
    mode: registryInstall ? 'registry' : suppliedArchive ? 'supplied-archive' : 'local-pack',
    archive,
    integrity,
    shasum: createHash('sha1').update(readFileSync(archive)).digest('hex'),
    name: installedManifest.name,
    version: installedManifest.version,
    files: entries,
    installedPackage: installedLockEntry,
    consumerDependencies,
    checks: { exports: publicNames.length, declarationMaps: maps, componentGuides: guides.guides.length, types: true, css: true, exactLicenseAndNotices: true, documentScrolling: true },
  };
  if (reportPath) writeFileSync(reportPath, `${JSON.stringify(verification, null, 2)}\n`);
  console.log(`Archive mode: ${verification.mode}; integrity verified before and after consumer checks.`);
  console.log(`Tarball verified: ${entries.length} files, ${maps} declaration maps, ${guides.guides.length} component guides, ${publicNames.length} public value/type exports; consumer types and CSS build passed.`);
} catch (error) {
  if (error.stdout) console.error(String(error.stdout));
  if (error.stderr) console.error(String(error.stderr));
  throw error;
} finally {
  const relativeTemporary = relative(tmpdir(), temporary);
  assert.ok(relativeTemporary.startsWith('agentic-ui-consumer-') && !relativeTemporary.includes('..'), 'Refuse cleanup outside the temporary consumer directory.');
  rmSync(temporary, { recursive: true, force: true });
}
