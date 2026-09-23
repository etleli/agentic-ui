/* global window, document */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium } from 'playwright';
import { createServer } from 'vite';

const mode = process.argv[2];
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const installed = lock.packages['node_modules/@etleli/agentic-ui'];
if (mode === 'published') {
  assert.match(installed.resolved, /^https:\/\/registry\.npmjs\.org\//);
  assert.equal(installed.integrity, 'sha512-pAnKfrR1icq77Aw7aQGTFC14NsFe+xmnN5RuFBzTKOR6nZGeWR3w7GoQMK49IsHLb1mZosGP0vmgwoS4pmnHlA==');
}
const report = { mode, packageVersion: installed.version, integrity: installed.integrity, node: process.version, react: lock.packages['node_modules/react'].version, playwright: lock.packages['node_modules/playwright'].version, cases: [], warnings: [], errors: [] };
let browser, server;
try {
  server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 } });
  await server.listen();
  browser = await chromium.launch({ headless: true });
  report.browser = browser.version();
  const context = await browser.newContext({ viewport: { width: 960, height: 720 }, reducedMotion: 'reduce' });
  for (const strict of [false, true]) {
    async function check(name, options, test) {
      const page = await context.newPage();
      page.setDefaultTimeout(4000);
      const caseName = `${name} (${strict ? 'StrictMode' : 'normal'})`;
      page.on('console', (entry) => { if (['warning', 'error'].includes(entry.type())) report.warnings.push({ case: caseName, message: entry.text() }); });
      page.on('pageerror', (error) => report.errors.push({ case: caseName, message: error.message }));
      const observation = {};
      try {
        if (options.motion) await page.emulateMedia({ reducedMotion: 'no-preference' });
        await page.goto(`${server.resolvedUrls.local[0]}?options=${encodeURIComponent(JSON.stringify({ ...options, strict }))}`);
        await page.waitForFunction(() => window.modalTest?.ready);
        await page.getByRole('button', { name: 'Open Modal', exact: true }).click();
        await page.getByRole('dialog', { name: 'Focus Modal', exact: true }).waitFor();
        await page.waitForTimeout(80);
        await test(page, observation);
        report.cases.push({ name: caseName, passed: true, observation });
      } catch (error) {
        report.cases.push({ name: caseName, passed: false, observation, failure: error.message.replaceAll(process.cwd(), '<consumer>') });
      } finally { await page.close(); }
    }
    const dialog = (page) => page.getByRole('dialog', { name: 'Focus Modal', exact: true });
    const active = (page) => page.evaluate(() => ({ id: document.activeElement.id, label: document.activeElement.getAttribute('aria-label'), inside: Boolean(document.activeElement.closest('[role="dialog"]')) }));
    const closed = async (page) => { await dialog(page).waitFor({ state: 'hidden' }); await page.waitForTimeout(30); };
    await check('initial safe focus', {}, async (page, o) => { o.focus = await active(page); assert.equal(o.focus.label, 'Close dialog'); });
    await check('explicit child autoFocus and original return target', { autoFocus: true }, async (page, o) => {
      o.opened = await active(page); assert.equal(o.opened.id, 'field');
      await page.keyboard.press('Escape'); await closed(page); o.closed = await active(page); assert.equal(o.closed.id, 'opener');
    });
    await check('forward Tab wraps and excludes background', {}, async (page, o) => {
      await dialog(page).getByRole('button', { name: 'Confirm', exact: true }).focus();
      await page.keyboard.press('Tab'); o.wrapped = await active(page); assert.equal(o.wrapped.label, 'Close dialog');
      for (let i = 0; i < 9; i++) { await page.keyboard.press('Tab'); assert.equal((await active(page)).inside, true); }
    });
    await check('backward Shift+Tab wraps', {}, async (page, o) => {
      await dialog(page).getByRole('button', { name: 'Close dialog' }).focus();
      await page.keyboard.press('Shift+Tab'); o.focus = await page.evaluate(() => document.activeElement.textContent); assert.equal(o.focus, 'Confirm');
    });
    await check('single focusable target', { single: true }, async (page, o) => {
      o.initial = await active(page); assert.equal(o.initial.id, 'field');
      for (const key of ['Tab', 'Shift+Tab', 'Tab']) { await page.keyboard.press(key); assert.equal((await active(page)).id, 'field'); }
    });
    await check('no focusable target uses dialog fallback', { noTargets: true }, async (page, o) => {
      o.focus = await page.evaluate(() => document.activeElement.getAttribute('role')); assert.equal(o.focus, 'dialog');
      for (const key of ['Tab', 'Shift+Tab']) { await page.keyboard.press(key); assert.equal(await page.evaluate(() => document.activeElement.getAttribute('role')), 'dialog'); }
    });
    await check('disabled and dynamically hidden targets', { disabledField: true, confirmDisabled: true }, async (page, o) => {
      await dialog(page).getByRole('button', { name: 'Cancel', exact: true }).focus();
      await page.keyboard.press('Tab'); assert.equal((await active(page)).label, 'Close dialog');
      await dialog(page).locator('button,input').evaluateAll((elements) => elements.forEach((element) => { element.disabled = true; }));
      await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.activeElement.getAttribute('role')), 'dialog');
      await page.locator('#inside').evaluate((element) => { element.disabled = false; });
      await page.keyboard.press('Tab'); o.focus = await active(page); assert.equal(o.focus.id, 'inside');
      await page.locator('#inside').evaluate((element) => { element.hidden = true; });
      await page.keyboard.press('Shift+Tab'); assert.equal(await page.evaluate(() => document.activeElement.getAttribute('role')), 'dialog');
    });
    for (const action of ['Escape', 'close button', 'parent']) await check(`restoration on ${action}`, {}, async (page, o) => {
      await page.locator('#field').focus(); await page.evaluate(() => { window.modalTest.focusLog = []; });
      if (action === 'Escape') await page.keyboard.press('Escape');
      else if (action === 'parent') await page.evaluate(() => window.modalTest.setOpen(false));
      else await dialog(page).getByRole('button', { name: 'Close dialog' }).click();
      await closed(page); o.focus = await active(page); o.requests = await page.evaluate(() => window.modalTest.requests);
      assert.equal(o.focus.id, 'opener'); assert.deepEqual(o.requests, action === 'parent' ? [] : [false]);
      assert.equal(await page.evaluate(() => window.modalTest.focusLog.filter((id) => id === 'opener').length), 1);
      await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'background');
    });
    for (const invalid of ['removed', 'disabled', 'hidden', 'inert']) await check(`return target ${invalid}`, {}, async (page, o) => {
      await page.locator('#field').focus();
      await page.locator('#opener').evaluate((element, value) => { if (value === 'removed') element.remove(); else element[value] = true; }, invalid);
      await page.keyboard.press('Escape'); await closed(page); o.focus = await active(page); assert.notEqual(o.focus.id, 'opener');
      await page.locator('#background').focus(); await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'after');
    });
    await check('controlled parent can decline Escape and close button', { decline: true }, async (page, o) => {
      await page.locator('#field').focus(); await page.keyboard.press('Escape');
      await dialog(page).getByRole('button', { name: 'Close dialog' }).click();
      assert.equal(await dialog(page).isVisible(), true); assert.equal((await active(page)).inside, true);
      await dialog(page).getByRole('button', { name: 'Confirm', exact: true }).focus(); await page.keyboard.press('Tab'); assert.equal((await active(page)).inside, true);
      o.requests = await page.evaluate(() => window.modalTest.requests); assert.deepEqual(o.requests, [false, false]);
      await page.evaluate(() => window.modalTest.setOpen(false)); await closed(page); assert.equal((await active(page)).id, 'opener');
    });
    await check('contained Modal in an outer React portal', { presentation: 'contained', outerPortal: true }, async (page, o) => {
      o.parentPortal = await dialog(page).evaluate((element) => Boolean(element.closest('#portal-host'))); assert.equal(o.parentPortal, true);
      assert.equal((await active(page)).inside, true);
      await dialog(page).getByRole('button', { name: 'Confirm', exact: true }).focus(); await page.keyboard.press('Tab'); assert.equal((await active(page)).label, 'Close dialog');
      await page.keyboard.press('Escape'); await closed(page); assert.equal((await active(page)).id, 'opener');
    });
    await check('nested Modal focus ownership and restoration', { nested: true }, async (page, o) => {
      await page.locator('#nested-opener').click();
      const child = page.getByRole('dialog', { name: 'Nested Modal', exact: true }); await child.waitFor(); await page.waitForTimeout(50);
      o.childFocused = await child.evaluate((element) => element.contains(document.activeElement)); assert.equal(o.childFocused, true);
      await child.getByRole('button', { name: 'Confirm', exact: true }).focus(); await page.keyboard.press('Tab'); assert.equal(await child.evaluate((element) => element.contains(document.activeElement)), true);
      await child.getByRole('button', { name: 'Close dialog' }).click(); await child.waitFor({ state: 'hidden' }); assert.equal((await active(page)).id, 'nested-opener');
    });
    for (const uncontrolled of [false, true]) await check(`repeated cycles and cleanup (${uncontrolled ? 'uncontrolled' : 'controlled'})`, { uncontrolled }, async (page, o) => {
      for (let i = 0; i < 3; i++) {
        assert.equal((await active(page)).inside, true); await page.evaluate(() => { window.modalTest.focusLog = []; window.modalTest.requests = []; });
        await page.keyboard.press('Escape'); await closed(page); assert.equal((await active(page)).id, 'opener');
        assert.deepEqual(await page.evaluate(() => window.modalTest.requests), [false]);
        assert.equal(await page.evaluate(() => window.modalTest.focusLog.filter((id) => id === 'opener').length), 1);
        await page.keyboard.press('Escape'); assert.deepEqual(await page.evaluate(() => window.modalTest.requests), [false]);
        if (i < 2) { await page.locator('#opener').click(); await dialog(page).waitFor(); await page.waitForTimeout(50); }
      }
      o.cycles = 3;
    });
    await check('unmount removes listeners and restores once', {}, async (page, o) => {
      await page.locator('#field').focus(); await page.evaluate(() => { window.modalTest.focusLog = []; window.modalTest.unmount(); }); await closed(page);
      o.focus = await active(page); assert.equal(o.focus.id, 'opener');
      await page.keyboard.press('Escape'); await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'background');
      assert.deepEqual(await page.evaluate(() => window.modalTest.requests), []);
    });
    await check('library-owned child portal remains in the focus scope', { picker: true }, async (page, o) => {
      await page.getByRole('button', { name: 'Child date picker', exact: true }).click();
      const popup = page.getByRole('dialog', { name: 'Child date picker', exact: true }); await popup.waitFor();
      const day = popup.getByRole('button', { name: '2026-09-16', exact: true }); await day.focus(); await page.waitForTimeout(30);
      o.focus = await active(page); assert.equal(o.focus.label, '2026-09-16');
      await popup.locator('button:enabled').last().focus(); await page.keyboard.press('Tab'); assert.equal((await active(page)).label, 'Close dialog');
    });
    await check('positive tab order', { positive: true }, async (page, o) => {
      o.initial = await active(page); assert.equal(o.initial.id, 'inside');
      await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'field');
      await page.keyboard.press('Tab'); assert.equal((await active(page)).label, 'Close dialog');
      await page.keyboard.press('Shift+Tab'); assert.equal((await active(page)).id, 'field');
    });
    await check('radio group retains one sequential stop', { radios: true }, async (page, o) => {
      await page.locator('#inside').focus(); await page.keyboard.press('Tab'); o.focus = await active(page); assert.equal(o.focus.id, 'radio-b');
      await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Cancel');
    });
    await check('Tab scrolls long modal content to keep its target visible', { long: true }, async (page, o) => {
      await page.locator('#field').focus(); await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'inside');
      o.dialog = await dialog(page).boundingBox(); o.target = await page.locator('#inside').boundingBox();
      assert.ok(o.target.y >= o.dialog.y && o.target.y + o.target.height <= o.dialog.y + o.dialog.height, 'Focused control must be visible within the scrolled dialog.');
    });
    await check('closing animation is not keyboard interactive', { motion: true }, async (page, o) => {
      await page.locator('#field').focus(); await page.evaluate(() => window.modalTest.setOpen(false));
      await page.waitForTimeout(30); o.focus = await active(page); assert.equal(o.focus.id, 'opener');
      await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'background');
      await closed(page);
    });
    for (const action of ['Cancel', 'Confirm']) await check(`${action} preserves callbacks`, {}, async (page, o) => {
      await dialog(page).getByRole('button', { name: action, exact: true }).click(); await closed(page);
      o.requests = await page.evaluate(() => window.modalTest.requests); assert.deepEqual(o.requests, [action.toLowerCase(), false]);
      assert.equal((await active(page)).id, 'opener');
    });
    await check('closing parent with nested Modal restores outer opener', { nested: true, motion: true }, async (page, o) => {
      await page.locator('#nested-opener').click(); await page.getByRole('dialog', { name: 'Nested Modal', exact: true }).waitFor();
      await page.evaluate(() => window.modalTest.setOpen(false)); await page.waitForTimeout(30);
      o.focus = await active(page); assert.equal(o.focus.id, 'opener');
      await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'background'); await closed(page);
    });
  }
} finally {
  await browser?.close(); await server?.close();
  report.passed = report.cases.length > 0 && report.cases.every((entry) => entry.passed) && !report.warnings.length && !report.errors.length;
  report.summary = { cases: report.cases.length, passed: report.cases.filter((entry) => entry.passed).length, failed: report.cases.filter((entry) => !entry.passed).length };
  writeFileSync('report.json', `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify(report, null, 2));
  if (!report.passed) process.exitCode = 1;
}
