/* global window */
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { createServer } from 'vite';
import { chromium, webkit } from 'playwright';
const diagnostic = 'Agentic UI: owned popups are suppressed because the Modal host geometry is unsupported.';
const report = { node: process.version, class: 'unsupported owned clipping geometry suppresses only popups and recovers', cases: [] };
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  await server.listen(); browser = await (process.argv.includes('webkit') ? webkit : chromium).launch(); report.browser = browser.version();
  for (const geometry of ['rotate', 'skew', 'reflect', 'perspective']) for (const strict of [false, true]) {
    const page = await browser.newPage(); page.setDefaultNavigationTimeout(30000); page.setDefaultTimeout(6000);
    const entry = { geometry, strict, errors: [], warnings: [] }; report.cases.push(entry);
    page.on('pageerror', (error) => entry.errors.push(error.message));
    page.on('console', (message) => { if (['warning', 'error'].includes(message.type())) entry.warnings.push(message.text()); });
    await page.goto(`${server.resolvedUrls.local[0]}?options=${encodeURIComponent(JSON.stringify({ geometry, strict }))}`);
    await page.waitForFunction(() => window.portalTest?.ready); await page.locator('#opener').click();
    await page.getByRole('button', { name: 'Probe Date', exact: true }).click();
    await page.waitForTimeout(100);
    const modal = page.getByRole('dialog', { name: 'Owned parent', exact: true });
    const popup = page.getByRole('dialog', { name: 'Probe Date', exact: true });
    assert.equal(await modal.isVisible(), true); assert.equal(await popup.count(), 0);
    assert.equal(await page.locator('[data-owned-portal]').count(), 0);
    await modal.getByRole('button', { name: 'Cancel', exact: true }).click();
    assert.deepEqual(await page.evaluate(() => window.portalTest.requests), [false]);
    // Cancel is outside the picker, so its existing outside-pointer behavior
    // closes that request. Open another request before testing recovery.
    await page.getByRole('button', { name: 'Probe Date', exact: true }).click();
    await page.locator('#shell').evaluate((node) => { node.style.transform = 'none'; });
    await popup.waitFor();
    assert.equal(await popup.evaluate((node) => Boolean(node.closest('.modal-overlay'))), true);
    await page.locator('#shell').evaluate((node) => { node.style.transform = ''; });
    await popup.waitFor({ state: 'hidden' }); assert.equal(await modal.isVisible(), true);
    await page.locator('#shell').evaluate((node) => { node.style.transform = 'none'; });
    await popup.waitFor(); await popup.getByRole('button', { name: '2026-10-04', exact: true }).click();
    assert.deepEqual(await page.evaluate(() => window.portalTest.actions), ['2026-10-04']);
    await page.evaluate(() => window.portalTest.setOpen(false)); await modal.waitFor({ state: 'hidden' });
    entry.suppressedAndRecovered = true;
    assert.deepEqual(entry.errors, []);
    assert.equal(entry.warnings.length, 2);
    assert.ok(entry.warnings.every((message) => message.startsWith(diagnostic)));
    await page.close();
  }
} finally {
  await browser?.close(); await server.close(); writeFileSync('report.json', `${JSON.stringify(report, null, 2)}\n`); console.log(JSON.stringify(report, null, 2));
}
