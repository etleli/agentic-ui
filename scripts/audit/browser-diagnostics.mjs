/* global window, document, getComputedStyle */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const [workshopRoot, output, sourceSha] = process.argv.slice(2);
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const installed = lock.packages['node_modules/@etleli/agentic-ui'];
assert.equal(installed.version, '0.1.0-beta.1');
assert.match(installed.resolved, /^https:\/\/registry\.npmjs\.org\//);
assert.equal(installed.integrity, 'sha512-pAnKfrR1icq77Aw7aQGTFC14NsFe+xmnN5RuFBzTKOR6nZGeWR3w7GoQMK49IsHLb1mZosGP0vmgwoS4pmnHlA==');
const report = { date: new Date().toISOString(), sourceSha, package: { version: installed.version, resolved: installed.resolved, integrity: installed.integrity }, environment: { node: process.version, react: lock.packages['node_modules/react'].version, reactDom: lock.packages['node_modules/react-dom'].version, playwright: lock.packages['node_modules/playwright'].version, locale: 'en-US', timezone: 'UTC', fixedDate: '2026-09-23T12:00:00Z' }, warnings: [], pageErrors: [], cases: [], harnessCompleted: false };
let browser, consumerServer, workshopServer, activeCase = 'setup';
const record = (finding, configuration, expected, observed, violation) => report.cases.push({ finding, configuration, expected, observed, contractSatisfied: !violation });
function monitor(page, surface) {
  page.on('console', (message) => {
    if (['warning', 'error'].includes(message.type())) report.warnings.push({ surface, case: activeCase, type: message.type(), message: message.text() });
    if (report.warnings.length > 50) void page.close();
  });
  page.on('pageerror', (error) => report.pageErrors.push({ surface, case: activeCase, message: error.message }));
}
try {
  consumerServer = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 }, optimizeDeps: { include: ['react', 'react-dom/client', '@etleli/agentic-ui'] } });
  await consumerServer.listen();
  const workshopVite = await import(pathToFileURL(join(workshopRoot, 'node_modules/vite/dist/node/index.js')).href);
  workshopServer = await workshopVite.createServer({ root: workshopRoot, configFile: join(workshopRoot, 'vite.config.ts'), server: { host: '127.0.0.1', port: 0 } });
  await workshopServer.listen();
  browser = await chromium.launch({ headless: true });
  report.environment.browser = await browser.version();
  const context = await browser.newContext({ viewport: { width: 800, height: 600 }, locale: 'en-US', timezoneId: 'UTC', reducedMotion: 'reduce' });
  const page = await context.newPage();
  page.setDefaultTimeout(7000);
  monitor(page, 'published-package');
  await page.clock.setFixedTime(new Date(report.environment.fixedDate));
  await page.goto(consumerServer.resolvedUrls.local[0]);
  await page.waitForFunction(() => Boolean(window.audit));
  const settle = () => page.waitForTimeout(100);
  async function mount(options) { activeCase = JSON.stringify(options); await page.evaluate((value) => window.audit.mount(value), options); await settle(); }
  const selected = () => page.locator('tbody tr[data-selected="true"]').allTextContents();
  const calls = () => page.evaluate(() => window.audit.calls);
  for (const strict of [false, true]) {
    for (const control of ['id', 'index']) {
      for (const mode of ['declining', 'accepting', 'uncontrolled']) {
        const configuration = { kind: 'table', strict, control, mode };
        await mount(configuration);
        await page.getByText('Beta', { exact: true }).click(); await settle();
        const afterClick = await selected();
        await page.evaluate(() => window.audit.rerender()); await settle();
        const afterRerender = await selected();
        const notifications = await calls();
        record('F1', configuration, { selected: mode === 'declining' ? ['Alpha'] : ['Beta'], callbackCount: 1 }, { afterClick, afterRerender, notifications }, afterRerender[0] !== (mode === 'declining' ? 'Alpha' : 'Beta') || notifications.length !== 1);
        if (mode === 'declining') {
          await page.evaluate((value) => window.audit.setSelection(value), control === 'index' ? 1 : 'beta'); await settle();
          record('F1', { ...configuration, action: 'parent changes prop' }, { selected: ['Beta'] }, { selected: await selected() }, (await selected())[0] !== 'Beta');
        }
      }
      for (const selectable of [false, true]) {
        const configuration = { kind: 'table', strict, control, mode: 'declining', selectable };
        await mount(configuration);
        const initial = await page.locator('tbody tr').evaluateAll((rows) => rows.map((row) => ({ text: row.textContent, selected: row.dataset.selected ?? null, current: row.getAttribute('aria-current'), tabIndex: row.getAttribute('tabindex') })));
        await page.getByText('Beta', { exact: true }).click(); await settle();
        record('F2', configuration, { firstSelected: true, firstCurrent: 'true', manualCallbacks: selectable ? 1 : 0 }, { initial, notifications: await calls() }, initial[0].selected !== 'true' || initial[0].current !== 'true' || (await calls()).length !== (selectable ? 1 : 0));
      }
    }
    for (const mode of ['declining', 'accepting', 'uncontrolled']) {
      const configuration = { kind: 'date', strict, mode };
      await mount(configuration);
      await page.getByRole('button', { name: 'Date picker', exact: true }).click();
      await page.getByRole('button', { name: '2026-09-16', exact: true }).click(); await settle();
      const afterClick = await page.locator('.forms-picker__value').innerText();
      await page.evaluate(() => window.audit.rerender()); await settle();
      const afterRerender = await page.locator('.forms-picker__value').innerText();
      record('F6', configuration, { date: mode === 'declining' ? '2026-09-15' : '2026-09-16', callbackCount: 1 }, { afterClick, afterRerender, notifications: await calls() }, !afterRerender.includes(mode === 'declining' ? '15' : '16') || (await calls()).length !== 1);
      if (mode === 'declining') { await page.evaluate(() => window.audit.setDate('2026-09-17')); await settle(); record('F6', { ...configuration, action: 'parent changes prop' }, { date: '2026-09-17' }, { display: await page.locator('.forms-picker__value').innerText() }, !(await page.locator('.forms-picker__value').innerText()).includes('17')); }
    }
  }
  for (const restriction of ['disabled', 'readOnly']) {
    await mount({ kind: 'date', mode: 'declining', [restriction]: true });
    if (restriction === 'readOnly') await page.getByRole('button', { name: 'Date picker', exact: true }).click();
    record('F6', { restriction }, { dialogCount: 0, notifications: [] }, { dialogCount: await page.getByRole('dialog').count(), disabled: await page.getByRole('button', { name: 'Date picker', exact: true }).isDisabled(), notifications: await calls() }, (await page.getByRole('dialog').count()) !== 0 || (await calls()).length !== 0);
  }
  for (const bounds of [{ min: '2026-09-22', max: '2026-09-23' }, { min: '2026-09-01', max: '2026-09-20' }, { min: '2026-08-01', max: '2026-10-01' }]) {
    for (const preset of ['Today', '7D', '30D']) {
      await mount({ kind: 'range', ...bounds });
      await page.getByRole('button', { name: preset, exact: true }).click(); await settle();
      const notifications = await calls();
      record('F3', { ...bounds, preset, today: report.environment.fixedDate }, 'No callback endpoint outside min/max', { notifications }, notifications.some((v) => v.start < bounds.min || v.end > bounds.max));
    }
  }
  await mount({ kind: 'range', min: '2026-09-01', max: '2026-09-20' });
  await page.getByRole('button', { name: 'Date picker', exact: true }).first().click();
  record('F3', { action: 'individual calendar excludes today' }, { todayDisabled: true }, { todayDisabled: await page.getByRole('button', { name: '2026-09-23', exact: true }).isDisabled() }, !(await page.getByRole('button', { name: '2026-09-23', exact: true }).isDisabled()));
  await mount({ kind: 'range', disabled: true });
  record('F3', { disabled: true }, 'All preset buttons disabled', { disabled: await page.locator('.date-range-picker__preset').evaluateAll((nodes) => nodes.map((node) => node.disabled)), notifications: await calls() }, await page.locator('.date-range-picker__preset:enabled').count() !== 0);

  for (const reducedMotion of ['reduce', 'no-preference']) {
    await page.emulateMedia({ reducedMotion });
    for (const [label, left, top, placement] of [['left-edge', 0, 200, 'top'], ['right-edge', 730, 200, 'bottom'], ['top-edge', 400, 0, 'left'], ['bottom-edge', 400, 570, 'right'], ['center', 380, 300, 'top']]) {
      await mount({ kind: 'tooltip', left, top, placement }); await page.waitForTimeout(300);
      const box = await page.getByRole('tooltip').boundingBox(); assert.ok(box);
      const triggerBox = await page.getByRole('button', { name: 'Target', exact: true }).boundingBox();
      assert.ok(triggerBox && triggerBox.x >= 0 && triggerBox.y >= 0 && triggerBox.x + triggerBox.width <= 800 && triggerBox.y + triggerBox.height <= 600, 'The trigger itself must fit in the viewport.');
      const overflow = { left: Math.max(0, -box.x), right: Math.max(0, box.x + box.width - 800), top: Math.max(0, -box.y), bottom: Math.max(0, box.y + box.height - 600) };
      record('F4', { label, placement, viewport: [800, 600], reducedMotion }, 'All tooltip bounds within viewport', { triggerBox, box, overflow }, Object.values(overflow).some((value) => value > 1));
      if (label === 'left-edge' && reducedMotion === 'no-preference') await page.screenshot({ path: join(dirname(output), 'tooltip-left-edge.png') });
    }
  }
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await mount({ kind: 'modal' });
  await page.getByRole('button', { name: 'Open diagnostic modal' }).click(); await settle();
  const focus = () => page.evaluate(() => ({ id: document.activeElement.id, tag: document.activeElement.tagName, text: document.activeElement.textContent?.slice(0, 70), insideDialog: Boolean(document.activeElement.closest('[role="dialog"]')) }));
  const opened = await focus();
  await page.keyboard.press('Tab'); const firstTab = await focus();
  await page.screenshot({ path: join(dirname(output), 'modal-focus.png') });
  await page.getByRole('button', { name: 'Confirm', exact: true }).focus();
  const traversal = [];
  for (let index = 0; index < 4; index++) { await page.keyboard.press('Tab'); traversal.push(await focus()); }
  await page.getByLabel('Dialog value').focus(); await page.keyboard.press('Escape'); await page.waitForTimeout(300);
  const closed = await focus();
  record('F7', { presentation: 'viewport', controlled: true, keyboard: 'open, Tab from opener, Tab after last action, Escape from input' }, { initialInside: true, trapInside: true, restoredId: 'opener', escapeCloses: true }, { opened, firstTab, traversal, closed, dialogsAfterEscape: await page.getByRole('dialog').count(), notifications: await calls() }, !opened.insideDialog || traversal.some((item) => !item.insideDialog) || closed.id !== 'opener');
  record('F7', { counterexample: 'Escape still requests closure once' }, { dialogs: 0, notifications: [false] }, { dialogs: await page.getByRole('dialog').count(), notifications: await calls() }, (await page.getByRole('dialog').count()) !== 0 || JSON.stringify(await calls()) !== '[false]');

  await mount({ kind: 'generated-color' });
  const helper = await page.evaluate(() => {
    const before = window.audit.getThemeGeneratedColor(0);
    document.documentElement.style.setProperty('--color-data-type-base', '#ff0000');
    const wrongToken = window.audit.getThemeGeneratedColor(0);
    document.documentElement.style.setProperty('--color-generated-base', '#ff0000');
    return { before, wrongToken, canonicalToken: window.audit.getThemeGeneratedColor(0) };
  });
  record('F5', { surface: 'npm helper', input: '#ff0000' }, 'Canonical generated-base token changes helper output; legacy workshop token does not', helper, helper.canonicalToken !== '#ff0000' || helper.wrongToken !== helper.before);
  const workshop = await context.newPage(); monitor(workshop, 'release-source-workshop'); workshop.setDefaultTimeout(10000);
  activeCase = 'F5 actual workshop control/save';
  await workshop.goto(workshopServer.resolvedUrls.local[0]);
  await workshop.getByLabel('Data type base color', { exact: true }).waitFor();
  await workshop.waitForTimeout(500);
  const tokens = () => workshop.evaluate(() => Object.fromEntries(['--color-generated-base', '--color-data-type-base', '--color-accent'].map((key) => [key, getComputedStyle(document.documentElement).getPropertyValue(key).trim()])));
  const before = await tokens();
  await workshop.getByLabel('Data type base color', { exact: true }).fill('#ff0000');
  await workshop.getByLabel('Accent color', { exact: true }).fill('#00aa00'); await workshop.waitForTimeout(200);
  const edited = await tokens();
  const responsePromise = workshop.waitForResponse((response) => response.url().endsWith('/api/theme-config') && response.request().method() === 'PUT');
  await workshop.getByRole('button', { name: 'Save', exact: true }).click();
  const response = await responsePromise; const saved = await response.json();
  const persisted = JSON.parse(readFileSync(join(workshopRoot, 'src/theme/theme.config.json'), 'utf8'));
  assert.deepEqual(saved, persisted);
  await workshop.locator('.color-control').filter({ has: workshop.getByLabel('Data type base color', { exact: true }) }).screenshot({ path: join(dirname(output), 'generated-color-control.png') });
  record('F5', { surface: 'exact release workshop (not npm content)', action: 'edit Data type base and Accent, save to isolated copy' }, { generatedBase: '#ff0000', savedGeneratedBase: '#ff0000', savedAccent: '#00aa00' }, { before, edited, saved, saveStatus: response.status() }, edited['--color-generated-base'] !== '#ff0000' || saved['--color-generated-base'] !== '#ff0000');
  record('F5', { counterexample: 'ordinary Accent control' }, { current: '#00aa00', saved: '#00aa00' }, { current: edited['--color-accent'], saved: saved['--color-accent'] }, edited['--color-accent'] !== '#00aa00' || saved['--color-accent'] !== '#00aa00');
  report.summary = Object.fromEntries(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'].map((id) => {
    const cases = report.cases.filter((item) => item.finding === id);
    return [id, { classification: cases.some((item) => !item.contractSatisfied) ? 'confirmed' : 'not reproduced', cases: cases.length, contractViolations: cases.filter((item) => !item.contractSatisfied).length, unaffectedCases: cases.filter((item) => item.contractSatisfied).length }];
  }));
  assert.equal(report.pageErrors.length, 0, 'Unexpected page errors; see evidence.');
  assert.equal(report.warnings.length, 0, 'Unexpected browser warnings; see evidence.');
  report.harnessCompleted = true;
} catch (error) {
  // Keep diagnostic failures visible without persisting personal temp paths.
  report.harnessError = String(error.message).replaceAll(workshopRoot, '<isolated-workshop>').replaceAll(process.cwd(), '<isolated-consumer>');
  process.exitCode = 1;
} finally {
  await browser?.close();
  await workshopServer?.close();
  await consumerServer?.close();
  writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ harnessCompleted: report.harnessCompleted, summary: report.summary, warnings: report.warnings, pageErrors: report.pageErrors, harnessError: report.harnessError }, null, 2));
}
