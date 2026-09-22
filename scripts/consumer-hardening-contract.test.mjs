import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

async function readSource(path) {
  return readFile(new URL(`../${path}`, import.meta.url), 'utf8');
}

async function findCssFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findCssFiles(path);
    return entry.name.endsWith('.css') ? [path] : [];
  }));
  return files.flat();
}

async function findTsxFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(entries.map(async (entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return findTsxFiles(path);
    return entry.name.endsWith('.tsx') ? [path] : [];
  }));
  return files.flat();
}

const rootWidthConstraintAllowlist = new Map([
  ['layout/Layout.css:.resizable-panel', 'ResizablePanel exposes an explicit user-controlled width and height contract.'],
  ['node-system/NodeSystem.css:.node-system-minimap[data-variant=\'floating\']', 'The floating minimap is an overlaid canvas safety surface constrained to its host viewport.'],
  ['feedback/HealthMeter/HealthMeter.css:.health-meter', 'HealthMeter is an intentionally compact status indicator with documented size variants.'],
  ['feedback/HealthMeter/HealthMeter.css:.health-meter[data-size=\'compact\']', 'HealthMeter compact is an intentionally compact status indicator.'],
  ['feedback/HealthMeter/HealthMeter.css:.health-meter[data-size=\'spacious\']', 'HealthMeter spacious is an intentionally compact status indicator.'],
  ['feedback/TrendSparkIndicator/TrendSparkIndicator.css:.trend-spark-indicator', 'TrendSparkIndicator is an intentionally intrinsic status visualization.'],
  ['node-system/NodeSystem.css:.node-system-node', 'Node width is a documented graph-model property, not a page or surface width cap.'],
  ['node-system/NodeSystem.css:.node-system-port', 'NodePort has a deliberate accessible hit-target size.'],
  ['surfaces/Divider/Divider.css:.surface-divider[data-orientation=\'vertical\']', 'A vertical Divider is an intrinsically one-dimensional separator.'],
]);

function getRootSelector(selector) {
  const trimmed = selector.trim();
  if (trimmed.includes('example') || trimmed.endsWith('-dot')) return undefined;
  return /^\.[a-z0-9-]+(?:\[[^\]]+\])?$/i.test(trimmed) ? trimmed : undefined;
}

test('exported component roots are fluid unless a reviewed semantic exception is documented', async () => {
  const componentRoot = new URL('../src/components', import.meta.url);
  const componentRootPath = fileURLToPath(componentRoot);
  const cssFiles = await findCssFiles(componentRootPath);
  const unexpectedConstraints = [];

  for (const cssFile of cssFiles) {
    if (/examples?\.css$/i.test(cssFile) || /(?:Feedback|Overlay|Surface)Example\.css$/i.test(cssFile)) continue;

    const content = await readFile(cssFile, 'utf8');
    const sourcePath = relative(componentRootPath, cssFile).replaceAll('\\', '/');
    const rulePattern = /(^|})\s*([^@}{][^{]+)\{([^{}]*)\}/gm;

    for (const match of content.matchAll(rulePattern)) {
      const rootSelectors = match[2].split(',').map(getRootSelector).filter(Boolean);
      const hasOuterWidthConstraint = /(?:^|;)\s*(?:width|max-width)\s*:\s*(?:min\(|\d+(?:\.\d+)?(?:px|rem|ch)|var\()/m.test(match[3]);

      if (!hasOuterWidthConstraint) continue;

      for (const rootSelector of rootSelectors) {
        const allowlistKey = `${sourcePath}:${rootSelector}`;
        if (!rootWidthConstraintAllowlist.has(allowlistKey)) unexpectedConstraints.push(allowlistKey);
      }
    }
  }

  assert.deepEqual(unexpectedConstraints, [], `Unexpected exported component-root width constraints:\n${unexpectedConstraints.join('\n')}`);
  assert.ok(rootWidthConstraintAllowlist.size <= 12, 'The reviewed width-constraint allowlist must remain small.');
});

test('container roots and shared Chromium autofill treatment stay package-owned and token based', async () => {
  const inputControlCss = await readSource('src/components/inputs/InputControl.css');
  const themeCss = await readSource('src/theme/theme.css');

  for (const [path, selector] of [
    ['src/components/layout/Layout.css', '.page-header'],
    ['src/components/data-display/DataTable/DataTable.css', '.data-table'],
    ['src/components/activity/Activity.css', '.workflow-stepper'],
  ]) {
    const css = await readSource(path);
    assert.match(css, new RegExp(`${selector.replace('.', '\\.')}(?:,|\\s*\\{)[\\s\\S]*?width:\\s*100%;[\\s\\S]*?min-width:\\s*0;`), `${selector} must fill its parent and shrink in flex/grid layouts.`);
  }

  assert.match(themeCss, /--color-form-autofill-surface:/);
  assert.match(themeCss, /--color-form-autofill-foreground:/);
  assert.match(themeCss, /--color-form-autofill-border:/);
  assert.match(inputControlCss, /:-webkit-autofill:hover/);
  assert.match(inputControlCss, /:-webkit-autofill:focus/);
  assert.match(inputControlCss, /caret-color: var\(--color-form-autofill-foreground\)/);
  assert.match(inputControlCss, /data-disabled='true'/);
  assert.match(inputControlCss, /data-read-only='true'/);
});

test('exported components do not hide outer width caps in inline styles', async () => {
  const componentRoot = new URL('../src/components', import.meta.url);
  const componentRootPath = fileURLToPath(componentRoot);
  const sourceFiles = await findTsxFiles(componentRootPath);
  const unexpectedInlineWidths = [];

  for (const sourceFile of sourceFiles) {
    const sourcePath = relative(componentRootPath, sourceFile).replaceAll('\\', '/');
    const source = await readFile(sourceFile, 'utf8');
    const matches = [...source.matchAll(/style=\{\{[^}]*\b(?:width|maxWidth)\b[^}]*\}\}/g)];

    for (const match of matches) {
      const isHealthMeterFill = sourcePath === 'feedback/HealthMeter/HealthMeter.tsx' && match[0].includes('normalizedValue');
      if (!isHealthMeterFill) unexpectedInlineWidths.push(`${sourcePath}: ${match[0]}`);
    }
  }

  assert.deepEqual(unexpectedInlineWidths, [], `Unexpected inline component widths:\n${unexpectedInlineWidths.join('\n')}`);
});

test('unavailable actions, ContextMenu, and graph utilities retain their public fail-closed contracts', async () => {
  const button = await readSource('src/components/inputs/Button/Button.tsx');
  const buttonCss = await readSource('src/components/inputs/Button/Button.css');
  const unavailableAction = await readSource('src/components/inputs/UnavailableAction/UnavailableAction.tsx');
  const contextMenu = await readSource('src/components/overlays/ContextMenu/ContextMenu.tsx');
  const canvasUtils = await readSource('src/components/node-system/NodeCanvas/NodeCanvas.utils.ts');
  const controller = await readSource('src/components/node-system/NodeCanvas/NodeCanvas.interactions.ts');
  const miniMapUtils = await readSource('src/components/node-system/NodeMiniMap/NodeMiniMap.utils.ts');
  const paletteUtils = await readSource('src/components/node-system/NodePalette/NodePalette.utils.ts');
  const packageEntry = await readSource('src/index.ts');

  assert.match(button, /aria-disabled=\{isUnavailable \? true : undefined\}/);
  assert.match(button, /const isNativeDisabled = disabled && !isUnavailable/);
  assert.match(button, /data-width=\{width\}/);
  assert.match(buttonCss, /\.button\[data-width='fill'\][\s\S]*?width: 100%;/);
  assert.match(button, /if \(isUnavailable\) \{[\s\S]*?onUnavailable\?\./);
  assert.match(unavailableAction, /role="button"/);
  assert.match(unavailableAction, /tabIndex=\{0\}/);
  assert.match(unavailableAction, /event\.key !== 'Enter' && event\.key !== ' '/);
  assert.match(contextMenu, /item\.kind === 'heading'/);
  assert.match(contextMenu, /item\.kind === 'separator'/);
  assert.match(contextMenu, /aria-disabled=\{isUnavailable \? true : undefined\}/);
  assert.match(contextMenu, /event\.key === 'ArrowDown' \|\| event\.key === 'ArrowUp'/);
  assert.match(contextMenu, /event\.key === 'Home' \|\| event\.key === 'End'/);
  assert.match(contextMenu, /event\.key === 'Enter' \|\| event\.key === ' '/);
  assert.match(contextMenu, /window\.innerWidth - menuRect\.width - VIEWPORT_GUTTER/);
  assert.match(contextMenu, /window\.innerHeight - menuRect\.height - VIEWPORT_GUTTER/);
  assert.match(contextMenu, /requestAnimationFrame\(\(\) => restoreFocusRef/);
  assert.match(canvasUtils, /scrollX: 0/);
  assert.match(canvasUtils, /scrollY: 0/);
  assert.match(controller, /createNodeCanvasInteractionController/);
  assert.match(controller, /beginConnection/);
  assert.match(controller, /beginNodeDrag/);
  assert.match(controller, /consumeClickSuppression/);
  assert.match(miniMapUtils, /getNodeMiniMapProjection/);
  assert.match(miniMapUtils, /canvasWidth: Math\.max\(1, bounds\.width \+ safePadding \* 2\)/);
  assert.match(paletteUtils, /NODE_PALETTE_DRAG_DATA_TYPE/);
  assert.match(paletteUtils, /scrollX/);

  for (const publicSymbol of [
    'getNodeCanvasEndlessOrigin',
    'getNodeCanvasEndlessPlane',
    'getNodeCanvasRenderedNodes',
    'getNodeCanvasLogicalPoint',
    'getNodeCanvasFitView',
    'getNodeMiniMapProjection',
    'createNodeCanvasInteractionController',
    'getNodePaletteDropRequest',
  ]) {
    assert.match(packageEntry, new RegExp(`\\b${publicSymbol}\\b`), `${publicSymbol} must be importable from the package root.`);
  }
});
