/* global window */
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { createServer } from 'vite';
import { chromium } from 'playwright';
const report = { node: process.version, class: 'explicitly unsupported owned clipping geometry; not a partial approximation', cases: [] };
const server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 } });
let browser;
try {
  await server.listen(); browser = await chromium.launch(); report.browser = browser.version();
  for (const geometry of ['rotate', 'skew']) {
    const page = await browser.newPage(); page.setDefaultNavigationTimeout(30000); page.setDefaultTimeout(6000);
    const entry = { geometry, errors: [], warnings: [] }; report.cases.push(entry);
    page.on('pageerror', (error) => entry.errors.push(error.message));
    page.on('console', (message) => { if (['warning', 'error'].includes(message.type())) entry.warnings.push(message.text()); });
    await page.goto(`${server.resolvedUrls.local[0]}?options=${encodeURIComponent(JSON.stringify({ geometry }))}`);
    await page.waitForFunction(() => window.portalTest?.ready); await page.locator('#opener').click();
    await page.getByRole('button', { name: 'Probe Date', exact: true }).click();
    await page.waitForTimeout(100);
    entry.rejected = entry.errors.some((message) => message.startsWith('Owned portal geometry is not positive axis-aligned affine geometry'));
    assert.equal(entry.rejected, true); await page.close();
  }
} finally {
  await browser?.close(); await server.close(); writeFileSync('report.json', `${JSON.stringify(report, null, 2)}\n`); console.log(JSON.stringify(report, null, 2));
}
