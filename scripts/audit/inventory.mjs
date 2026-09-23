import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const rel = (file) => relative(root, file).replaceAll('\\', '/');
const read = (file) => readFileSync(file, 'utf8');
const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(config.config, ts.sys, root);
const program = ts.createProgram(parsed.fileNames, parsed.options);
const checker = program.getTypeChecker();
const entry = program.getSourceFile(resolve(root, 'src/index.ts'));
const exports = checker.getExportsOfModule(checker.getSymbolAtLocation(entry));
const registry = program.getSourceFile(resolve(root, 'src/app/componentRegistry.tsx'));
const registryExampleSources = new Map();
for (const statement of registry.statements.filter(ts.isImportDeclaration)) {
  const bindings = statement.importClause?.namedBindings;
  if (!bindings || !ts.isNamedImports(bindings)) continue;
  for (const binding of bindings.elements) {
    const symbol = checker.getSymbolAtLocation(binding.name);
    if (!symbol) continue;
    const target = symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
    registryExampleSources.set(binding.name.text, (target.getDeclarations() ?? []).map((node) => rel(node.getSourceFile().fileName)));
  }
}
const previews = [];
function visit(node) {
  if (ts.isVariableDeclaration(node) && node.name.getText(registry) === 'componentPreviews') {
    assert.ok(ts.isArrayLiteralExpression(node.initializer));
    for (const object of node.initializer.elements) {
      const item = {};
      for (const property of object.properties) {
        if (ts.isPropertyAssignment(property) && ['id', 'name', 'group'].includes(property.name.getText(registry))) {
          item[property.name.getText(registry)] = property.initializer.text;
        }
      }
      previews.push(item);
    }
  }
  ts.forEachChild(node, visit);
}
visit(registry);
const testFiles = readdirSync(resolve(root, 'scripts')).filter((name) => /test\.mjs$|worker\.mjs$/.test(name));
const evidencePath = resolve(root, 'docs/audit/evidence/published-beta.1.json');
const evidence = existsSync(evidencePath) ? JSON.parse(read(evidencePath)) : null;
const modalEvidencePath = resolve(root, 'docs/audit/evidence/modal-focus-after.json');
const modalEvidence = existsSync(modalEvidencePath) ? JSON.parse(read(modalEvidencePath)) : null;
const modalSources = ['src/components/overlays/Modal/Modal.tsx', 'src/components/overlays/Modal/Modal.focus.ts', 'src/components/overlays/overlayPortal.tsx'];
const modalFixed = modalEvidence?.mode === 'candidate' && modalEvidence.passed === true && modalEvidence.summary?.passed >= 56
  && modalSources.every((file) => modalEvidence.sourceHashes?.[file] === createHash('sha256').update(read(resolve(root, file)).replaceAll('\r\n', '\n')).digest('hex'));
// Curated review evidence; the mechanical scan below does not grant this status.
const reviewed = new Set(['DataTable', 'DatePicker', 'DateRangePicker', 'Tooltip', 'Modal', 'SidebarNav', 'DateTimePicker', 'DatasetSummary', 'FieldProfile', 'AppShell']);
const findingIds = { DataTable: ['F1', 'F2'], DateRangePicker: ['F3'], Tooltip: ['F4'], DatePicker: ['F6'], Modal: ['F7'] };
const exceptions = {
  Button: 'Intrinsic action by default; width=fill is explicit.',
  ResizablePanel: 'Explicit size/limits are part of its resize API.',
  SplitPane: 'Pane geometry/minimums and parent height require joint review.',
  Node: 'Graph-model width; not an ordinary page surface.',
  NodePort: 'Intrinsic connection target geometry.',
  NodeMiniMap: 'Floating canvas safety bounds; projection-specific sizing.',
  Divider: 'Vertical orientation keeps intrinsic separator dimensions.',
  HealthMeter: 'Compact status visualization with size variants.',
  TrendSparkIndicator: 'Compact status visualization with size variants.',
};
const patterns = [
  ['prop-to-state synchronization candidate', /set\w+\([^;]*(?:value|selected|default|items)/i],
  ['effect/state ownership candidate', /useEffect|useLayoutEffect/],
  ['default allocation candidate', /\w+\s*=\s*\[\]/],
  ['browser/lifecycle candidate', /localStorage|sessionStorage|setInterval|requestAnimationFrame|addEventListener/],
  ['layout constraint candidate', /max-width:|min-width:|height:|overflow(?:-\w+)?:/],
];
function localImports(file, extension) {
  const source = program.getSourceFile(file);
  if (!source) return [];
  return source.statements.filter(ts.isImportDeclaration).map((node) => node.moduleSpecifier.text)
    .filter((value) => value.startsWith('.') && extension.test(value))
    .map((value) => resolve(dirname(file), value));
}
const components = [], helpers = [], types = [], sourceLeads = {};
for (const exported of exports) {
  const symbol = exported.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(exported) : exported;
  const name = exported.name;
  const declarations = symbol.getDeclarations() ?? [];
  const locations = [...new Set(declarations.map((node) => rel(node.getSourceFile().fileName)))];
  if (!(symbol.flags & ts.SymbolFlags.Value)) { types.push({ name, locations }); continue; }
  const declaration = declarations.find((node) => node.getSourceFile().fileName.endsWith('.tsx'));
  if (!declaration || !/^[A-Z][a-z]/.test(name)) { helpers.push({ name, locations }); continue; }
  const file = declaration.getSourceFile().fileName;
  const folder = dirname(file);
  const neighbors = readdirSync(folder);
  const styles = [...new Set([...localImports(file, /\.css$/), ...neighbors.filter((f) => f === `${name}.css`).map((f) => resolve(folder, f))])];
  const styleDelegation = ['MarketStateBadge', 'OrderStatus'].includes(name) ? { component: 'StatusBadge', stylesheet: 'src/components/feedback/StatusBadge/StatusBadge.css' }
    : name === 'ToastProvider' ? { component: 'Toast', stylesheet: 'src/components/overlays/Toast/Toast.css' } : null;
  const typeLocations = [...new Set(types.filter((t) => t.name === `${name}Props`).flatMap((t) => t.locations))];
  // Resolve props independently of export declaration order.
  const propsExport = exports.find((s) => s.name === `${name}Props`);
  if (propsExport) {
    const props = propsExport.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(propsExport) : propsExport;
    for (const node of props.getDeclarations() ?? []) typeLocations.push(rel(node.getSourceFile().fileName));
  }
  for (const candidate of [file, ...styles]) {
    if (sourceLeads[rel(candidate)]) continue;
    const hits = Object.fromEntries(patterns.map(([kind]) => [kind, []]));
    read(candidate).split(/\r?\n/).forEach((line, index) => {
      for (const [kind, pattern] of patterns) if (pattern.test(line)) hits[kind].push(index + 1);
    });
    sourceLeads[rel(candidate)] = Object.fromEntries(Object.entries(hits).filter(([, lines]) => lines.length).map(([kind, lines]) => [kind, lines.join(', ')]));
  }
  const guide = resolve(folder, 'AGENT.md');
  const baselineProtection = ['FilePicker', 'SplitPane', 'ResizablePanel'].includes(name);
  components.push({
    component: name, group: locations[0].split('/')[2], implementation: locations,
    ...(name === 'Modal' ? { supportingImplementation: modalSources.slice(1), findingStatus: { F7: modalFixed ? 'fixed in current source; published beta remains affected' : 'confirmed/unfixed' } } : {}),
    styles: styles.map(rel), styleDelegation, types: [...new Set(typeLocations)],
    previews: previews.filter((p) => p.name === name),
    examples: [...new Set([...neighbors.filter((f) => /\.examples\./.test(f)).map((f) => rel(resolve(folder, f))), ...(registryExampleSources.get(`${name}Example`) ?? [])])],
    guides: existsSync(guide) ? [rel(guide)] : [],
    contracts: ['docs/consumer-hardening.md', 'docs/interaction-contract-matrix.md', 'docs/ui-generation-rulebook.md', ...(baselineProtection ? ['docs/file-picker-and-panel-persistence.md'] : []), ...(name === 'Modal' ? ['docs/modal-focus-contract.md'] : [])],
    testReferences: testFiles.filter((f) => new RegExp(`\\b${name}\\b`).test(read(resolve(root, 'scripts', f)))).map((f) => `scripts/${f}`),
    testReferenceMeaning: 'Textual references only; generic export checks and source assertions are not component behavior coverage.',
    sourceReview: reviewed.has(name) ? 'source reviewed' : 'not reviewed',
    runtimeVerification: name === 'Modal' && modalFixed ? 'behavior verified (Modal focus regressions)' : findingIds[name] ? (evidence?.harnessCompleted && findingIds[name].every((id) => evidence.summary[id]?.classification === 'confirmed') ? 'finding confirmed' : 'blocked/inconclusive') : baselineProtection ? 'behavior verified (established regression cases only)' : 'not reviewed',
    findings: findingIds[name] ?? [],
    diagnosticFixtures: findingIds[name] ? ['scripts/audit/fixture/main.js', 'scripts/audit/browser-diagnostics.mjs', 'docs/audit/evidence/published-beta.1.json', ...(name === 'Modal' ? ['scripts/test-modal-focus.mjs', 'scripts/modal-focus/browser.mjs', 'scripts/modal-focus/main.js', 'docs/audit/evidence/modal-focus-before.json', 'docs/audit/evidence/modal-focus-after.json'] : [])] : [],
    exceptions: exceptions[name] ?? (/Modal|Drawer|Popover|Tooltip|Toast|ContextMenu|CommandMenu/.test(name) ? 'Viewport-constrained overlay/menu; verify geometry and focus rather than remove all limits.' : null),
    firstPass: { status: 'mechanical source leads only; unvalidated', files: [file, ...styles].map(rel) },
  });
}
components.sort((a, b) => a.group.localeCompare(b.group) || a.component.localeCompare(b.component));
const inventory = {
  schemaVersion: 1, baseline: 'd9795c190c79266f96cc3b196b0d6a2e0335d225',
  generatedBy: 'npm run audit:inventory; do not hand-edit this derived file',
  coverage: { publicComponents: components.length, otherRuntimeExports: helpers.length, typeExports: types.length, registryEntries: previews.length, componentsWithExactRegistryEntry: components.filter((c) => c.previews.length).length, componentsWithExamples: components.filter((c) => c.examples.length).length, componentsWithGuides: components.filter((c) => c.guides.length).length, sourceReviewed: components.filter((c) => c.sourceReview === 'source reviewed').length, findingConfirmedComponents: components.filter((c) => c.runtimeVerification === 'finding confirmed').length, establishedProtectionComponents: 3 },
  workshopOnlyEntries: previews.filter((p) => !components.some((c) => c.component === p.name)),
  workshopFindings: [{ id: 'F5', sourceReview: 'source reviewed', runtimeVerification: evidence?.harnessCompleted && evidence.summary.F5?.classification === 'confirmed' ? 'finding confirmed' : 'blocked/inconclusive', locations: ['src/app/App.tsx', 'vite.config.ts', 'src/theme/categoricalColors.ts'], evidence: 'docs/audit/evidence/published-beta.1.json' }],
  components, sourceLeads, otherRuntimeExports: helpers, typeExports: types,
};
assert.equal(components.length + helpers.length + types.length, exports.length);
const destination = resolve(root, 'docs/audit/inventory.json');
const output = `${JSON.stringify(inventory, null, 2)}\n`;
if (process.argv.includes('--check')) assert.equal(read(destination).replaceAll('\r\n', '\n'), output, 'Audit inventory is stale; run npm run audit:inventory.');
else { mkdirSync(dirname(destination), { recursive: true }); writeFileSync(destination, output); }
console.log(JSON.stringify(inventory.coverage, null, 2));
console.log('Workshop-only/alias previews:', inventory.workshopOnlyEntries);
