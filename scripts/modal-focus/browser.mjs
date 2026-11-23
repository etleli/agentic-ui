/* global window, document */
import assert from 'node:assert/strict';
import { readFileSync, writeFileSync } from 'node:fs';
import { chromium, webkit } from 'playwright';
import { createServer } from 'vite';

const mode = process.argv[2];
const browserName = process.argv[3] ?? 'chromium';
const compoundOnly = process.argv[4] === 'compound';
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const installed = lock.packages['node_modules/@etleli/agentic-ui'];
if (mode === 'published') {
  assert.match(installed.resolved, /^https:\/\/registry\.npmjs\.org\//);
  assert.equal(installed.version, '0.1.0-beta.2');
  assert.equal(installed.integrity, 'sha512-xKUkylr5hcZcAE3QdGSs3YmVoUG3VSfEege9Qd4E09r0b3RZ1AXYIYg74wma8cdiG9n++sDUJO0U4NiiLa6Fvw==');
}
const report = { mode, packageVersion: installed.version, integrity: installed.integrity, node: process.version, react: lock.packages['node_modules/react'].version, playwright: lock.packages['node_modules/playwright'].version, cases: [], warnings: [], errors: [] };
let browser, server;
try {
  server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 } });
  await server.listen();
  browser = await (browserName === 'webkit' ? webkit : chromium).launch({ headless: true });
  report.browser = browser.version();
  report.scope = compoundOnly ? 'compound comparisons only' : browserName === 'webkit' ? 'small WebKit smoke matrix' : 'complete Chromium suite';
  const context = await browser.newContext({ viewport: { width: 960, height: 720 }, reducedMotion: 'reduce' });
  async function activate(target) {
    await target.focus();
    // WebKit may blur a button during pointer activation. Its smoke matrix uses
    // native keyboard activation to establish an actual focused return target.
    if (browserName === 'webkit') await target.press('Enter'); else await target.click();
  }
  for (const strict of [false, true]) {
    async function check(name, options, test) {
      if (compoundOnly && !name.startsWith('compound')) return;
      if (!compoundOnly && browserName === 'webkit' && !/^(initial safe|native forward|native backward|restoration on Escape|controlled parent|contained Modal in|nested Modal focus|repeated cycles and cleanup \(controlled|library-owned child portal|later CSS hiding.*display|SSR and hydration|inert and layer cleanup)/.test(name)) return;
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
        await page.bringToFront();
        if (!options.hydrate) {
          const opener = page.getByRole('button', { name: 'Open Modal', exact: true });
          await activate(opener);
        }
        if (!options.hiddenMode) await page.getByRole('dialog', { name: 'Focus Modal', exact: true }).waitFor();
        await page.waitForTimeout(80);
        await test(page, observation);
        report.cases.push({ name: caseName, passed: true, observation });
      } catch (error) {
        report.cases.push({ name: caseName, passed: false, observation, failure: error.message.replaceAll(process.cwd(), '<consumer>') });
      } finally {
        // Keep diagnostics outside Vite's watched root; writing there reloads pages.
        writeFileSync(`${process.cwd()}.progress.json`, JSON.stringify({ completed: report.cases.length, last: report.cases.at(-1), failed: report.cases.filter((entry) => !entry.passed).map((entry) => entry.name) }));
        await page.close();
      }
    }
    const dialog = (page) => page.getByRole('dialog', { name: 'Focus Modal', exact: true });
    const active = (page) => page.evaluate(() => {
      let element = document.activeElement;
      while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
      let ancestor = element;
      while (ancestor && !ancestor.closest('[role="dialog"]')) ancestor = ancestor.getRootNode().host;
      return { id: element.id, label: element.getAttribute('aria-label'), inside: Boolean(ancestor?.closest('[role="dialog"]')) };
    });
    const closed = async (page) => { await dialog(page).waitFor({ state: 'hidden' }); await page.waitForTimeout(30); };
    const pageIsolated = async (page) => {
      assert.equal(await page.locator('#background').evaluate((element) => Boolean(element.closest('[inert]'))), true);
      assert.ok(!['opener', 'background', 'after', 'host-background'].includes((await active(page)).id));
    };
    async function trace(target, selector, keys) {
      await target.bringToFront(); await target.locator(selector).focus();
      const values = [];
      for (const key of keys) {
        await target.keyboard.press(key);
        values.push(await target.evaluate(() => {
          let element = document.activeElement;
          while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
          return element.id || element.getAttribute('aria-label') || (element === document.body ? 'BODY' : element.textContent);
        }));
      }
      return values;
    }
    async function reference(options, selector, keys) {
      const native = await context.newPage();
      native.on('console', (entry) => { if (['warning', 'error'].includes(entry.type())) report.warnings.push({ case: 'native boundary reference', message: entry.text() }); });
      native.on('pageerror', (error) => report.errors.push({ case: 'native boundary reference', message: error.message }));
      try {
        await native.goto(`${server.resolvedUrls.local[0]}?options=${encodeURIComponent(JSON.stringify({ ...options, scopeReference: true }))}`);
        await native.waitForFunction(() => window.modalTest.ready);
        if (options.imageMap) await native.waitForFunction(() => { const image = document.getElementById('map-image'); return image.complete && image.naturalWidth > 0; });
        return await trace(native, selector, keys);
      } finally { await native.close(); }
    }
    await check('initial safe focus', {}, async (page, o) => { o.focus = await active(page); assert.equal(o.focus.label, 'Close dialog'); });
    await check('idle scope keeps inert and managed styles stable under reduced motion', {}, async (page, o) => {
      await page.waitForTimeout(60);
      await page.evaluate(() => {
        window.modalStyleChanges = 0;
        window.modalStyleObserver = new window.MutationObserver((records) => { window.modalStyleChanges += records.filter((record) => record.attributeName === 'inert' || record.attributeName === 'style' && (record.target.id === 'agentic-ui-overlay-root' || record.target.classList.contains('modal-overlay'))).length; });
        window.modalStyleObserver.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['style', 'inert'] });
      });
      await page.waitForTimeout(120); o.changes = await page.evaluate(() => { window.modalStyleObserver.disconnect(); return window.modalStyleChanges; });
      assert.equal(o.changes, 0); await pageIsolated(page);
    });
    await check('explicit child autoFocus and original return target', { autoFocus: true }, async (page, o) => {
      o.opened = await active(page); assert.equal(o.opened.id, 'field');
      await page.keyboard.press('Escape'); await closed(page); o.closed = await active(page); assert.equal(o.closed.id, 'opener');
    });
    await check('native forward boundary excludes page background', {}, async (page, o) => {
      const keys = Array(10).fill('Tab'); const selector = '.modal-overlay__footer button:last-child';
      o.native = await reference({}, selector, keys); o.modal = await trace(page, selector, keys);
      assert.deepEqual(o.modal, o.native); await pageIsolated(page);
    });
    await check('native backward boundary excludes page background', {}, async (page, o) => {
      const keys = Array(10).fill('Shift+Tab'); const selector = '.modal-overlay__icon-button';
      o.native = await reference({}, selector, keys); o.modal = await trace(page, selector, keys);
      assert.deepEqual(o.modal, o.native); await pageIsolated(page);
    });
    await check('single focusable target', { single: true }, async (page, o) => {
      assert.equal(await page.evaluate(() => document.activeElement.getAttribute('role')), 'dialog');
      const keys = ['Tab', 'Tab', 'Shift+Tab', 'Shift+Tab'];
      o.native = await reference({ single: true }, '#field', keys); o.modal = await trace(page, '#field', keys);
      assert.deepEqual(o.modal, o.native); await pageIsolated(page);
    });
    await check('no focusable target uses dialog fallback', { noTargets: true }, async (page, o) => {
      o.focus = await page.evaluate(() => document.activeElement.getAttribute('role')); assert.equal(o.focus, 'dialog');
      for (const key of ['Tab', 'Shift+Tab']) { await page.keyboard.press(key); await pageIsolated(page); }
    });
    await check('disabled and dynamically hidden targets', { disabledField: true, confirmDisabled: true }, async (page, o) => {
      await dialog(page).getByRole('button', { name: 'Cancel', exact: true }).focus();
      await page.keyboard.press('Tab'); await pageIsolated(page);
      await dialog(page).locator('button,input').evaluateAll((elements) => elements.forEach((element) => { element.disabled = true; }));
      await page.waitForFunction(() => document.activeElement.getAttribute('role') === 'dialog');
      await page.keyboard.press('Tab'); await pageIsolated(page);
      await page.locator('#inside').evaluate((element) => { element.disabled = false; });
      await page.keyboard.press('Tab'); o.focus = await active(page); assert.equal(o.focus.id, 'inside');
      await page.locator('#inside').evaluate((element) => { element.hidden = true; });
      await page.waitForFunction(() => document.activeElement.getAttribute('role') === 'dialog');
      await page.keyboard.press('Shift+Tab'); await pageIsolated(page);
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
      await dialog(page).getByRole('button', { name: 'Confirm', exact: true }).focus(); await page.keyboard.press('Tab'); await pageIsolated(page);
      o.requests = await page.evaluate(() => window.modalTest.requests); assert.deepEqual(o.requests, [false, false]);
      await page.evaluate(() => window.modalTest.setOpen(false)); await closed(page); assert.equal((await active(page)).id, 'opener');
    });
    await check('contained Modal in an outer React portal', { presentation: 'contained', outerPortal: true }, async (page, o) => {
      o.parentPortal = await dialog(page).evaluate((element) => Boolean(element.closest('#portal-host'))); assert.equal(o.parentPortal, true);
      assert.equal((await active(page)).inside, true);
      assert.equal(await page.locator('#host-background').evaluate((element) => element.inert), true);
      assert.equal(await dialog(page).getAttribute('aria-modal'), null);
      await page.locator('#background').focus(); assert.equal((await active(page)).id, 'background');
      assert.equal(await page.locator('#background').evaluate((element) => Boolean(element.closest('[inert]'))), false);
      await page.keyboard.press('Escape'); await closed(page); assert.equal((await active(page)).id, 'opener');
    });
    await check('contained host excludes local background and leaves the page usable', { presentation: 'contained' }, async (page, o) => {
      assert.equal(await page.locator('#local-background').evaluate((element) => element.inert), true);
      await page.locator('#local-background').evaluate((element) => element.focus()); assert.notEqual((await active(page)).id, 'local-background');
      await page.locator('#background').click(); assert.equal(await page.evaluate(() => window.modalTest.backgroundClicks), 1);
      await page.keyboard.press('Escape'); await closed(page);
      o.localRestored = await page.locator('#local-background').evaluate((element) => element.hasAttribute('inert')); assert.equal(o.localRestored, false);
    });
    await check('SSR and hydration preserve the contained presentation and focus', { hydrate: true, presentation: 'contained' }, async (page, o) => {
      assert.equal((await active(page)).inside, true);
      await page.keyboard.press('Escape'); await closed(page); o.restored = await active(page); assert.equal(o.restored.id, 'opener');
      assert.deepEqual(await page.evaluate(() => window.modalTest.requests), [false]);
    });
    await check('new background branches become inert and are released on close', {}, async (page, o) => {
      await page.evaluate(() => { const button = document.createElement('button'); button.id = 'dynamic-background'; button.textContent = 'Dynamic background'; document.body.appendChild(button); });
      await page.waitForFunction(() => document.getElementById('dynamic-background').inert);
      await page.locator('#dynamic-background').evaluate((element) => element.focus()); assert.notEqual((await active(page)).id, 'dynamic-background');
      await page.keyboard.press('Escape'); await closed(page);
      o.restored = await page.locator('#dynamic-background').evaluate((element) => element.hasAttribute('inert')); assert.equal(o.restored, false);
      await page.locator('#dynamic-background').focus(); assert.equal((await active(page)).id, 'dynamic-background');
    });
    await check('inert and layer cleanup preserve author state and remove listeners', { cleanup: true }, async (page, o) => {
      assert.equal(await page.evaluate(() => window.modalTest.listenerCount()), 2);
      await page.evaluate(() => {
        document.getElementById('background').setAttribute('inert', 'consumer');
        document.getElementById('agentic-ui-overlay-root').style.zIndex = '99';
      });
      await page.waitForTimeout(60); await page.keyboard.press('Escape'); await closed(page);
      o.state = await page.evaluate(() => ({ background: document.getElementById('background').getAttribute('inert'), after: document.getElementById('after').getAttribute('inert'), layer: document.getElementById('agentic-ui-overlay-root').style.zIndex, listeners: window.modalTest.listenerCount(), root: document.getElementById('root').hasAttribute('inert') }));
      assert.deepEqual(o.state, { background: 'consumer', after: 'author', layer: '99', listeners: 0, root: false });
    });
    await check('unrelated shared-root and arbitrary consumer portals are not owned', { unrelated: true }, async (page, o) => {
      for (const id of ['unrelated-overlay', 'consumer-portal']) {
        assert.equal(await page.locator('#' + id).evaluate((element) => Boolean(element.closest('[inert]'))), true);
        await page.locator('#' + id).evaluate((element) => element.focus()); assert.notEqual((await active(page)).id, id);
      }
      await page.keyboard.press('Escape'); await closed(page);
      o.restored = await page.locator('#unrelated-overlay').evaluate((element) => Boolean(element.closest('[inert]'))); assert.equal(o.restored, false);
    });
    await check('backdrop dismissal keeps its existing callback', {}, async (page, o) => {
      await page.locator('.modal-overlay[data-state="open"]').click({ position: { x: 1, y: 1 } }); await closed(page);
      o.requests = await page.evaluate(() => window.modalTest.requests); assert.deepEqual(o.requests, [false]); assert.equal((await active(page)).id, 'opener');
    });
    await check('controlled parent can decline backdrop dismissal', { decline: true }, async (page, o) => {
      await page.locator('.modal-overlay[data-state="open"]').click({ position: { x: 1, y: 1 } }); assert.equal(await dialog(page).isVisible(), true);
      o.requests = await page.evaluate(() => window.modalTest.requests); assert.deepEqual(o.requests, [false]); await pageIsolated(page);
    });
    await check('unavailable confirmation stays reachable and rejects activation', { unavailable: true }, async (page, o) => {
      const confirm = dialog(page).locator('.modal-overlay__footer button[aria-disabled="true"]');
      // aria-disabled deliberately preserves pointer/keyboard explanation callbacks.
      // Bypass only Playwright's enabled gate, not the component or native event.
      await confirm.click({ force: true }); await confirm.focus(); await page.keyboard.press('Enter'); assert.equal(await dialog(page).isVisible(), true);
      o.requests = await page.evaluate(() => window.modalTest.requests); assert.deepEqual(o.requests, ['unavailable-pointer', 'unavailable-keyboard']);
    });
    await check('nested Modal focus ownership and restoration', { nested: true }, async (page, o) => {
      await activate(page.locator('#nested-opener'));
      const child = page.getByRole('dialog', { name: 'Nested Modal', exact: true }); await child.waitFor(); await page.waitForTimeout(50);
      o.childFocused = await child.evaluate((element) => element.contains(document.activeElement)); assert.equal(o.childFocused, true);
      await child.getByRole('button', { name: 'Confirm', exact: true }).focus(); await page.keyboard.press('Tab'); await pageIsolated(page);
      await child.getByRole('button', { name: 'Close dialog' }).click(); await child.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => document.activeElement.id === 'nested-opener');
      o.closedFocus = await active(page); o.trace = await page.evaluate(() => window.modalTest.focusTrace); assert.equal(o.closedFocus.id, 'nested-opener');
    });
    for (const uncontrolled of [false, true]) await check(`repeated cycles and cleanup (${uncontrolled ? 'uncontrolled' : 'controlled'})`, { uncontrolled }, async (page, o) => {
      for (let i = 0; i < 3; i++) {
        assert.equal((await active(page)).inside, true); await page.evaluate(() => { window.modalTest.focusLog = []; window.modalTest.requests = []; });
        await page.keyboard.press('Escape'); await closed(page); assert.equal((await active(page)).id, 'opener');
        assert.deepEqual(await page.evaluate(() => window.modalTest.requests), [false]);
        assert.equal(await page.evaluate(() => window.modalTest.focusLog.filter((id) => id === 'opener').length), 1);
        await page.keyboard.press('Escape'); assert.deepEqual(await page.evaluate(() => window.modalTest.requests), [false]);
        if (i < 2) { await activate(page.locator('#opener')); await dialog(page).waitFor(); await page.waitForTimeout(50); }
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
      await popup.locator('button:enabled').last().focus(); await page.keyboard.press('Tab'); await pageIsolated(page);
    });
    await check('focused child portal removal re-homes focus immediately', { picker: true }, async (page, o) => {
      await page.getByRole('button', { name: 'Child date picker', exact: true }).click();
      const popup = page.getByRole('dialog', { name: 'Child date picker', exact: true }); await popup.waitFor();
      await popup.getByRole('button', { name: '2026-09-16', exact: true }).focus(); await page.keyboard.press('Enter');
      await popup.waitFor({ state: 'hidden' });
      await page.waitForFunction(() => document.querySelector('[role="dialog"][aria-label="Focus Modal"]')?.contains(document.activeElement));
      o.inside = await dialog(page).evaluate((element) => element.contains(document.activeElement)); assert.equal(o.inside, true);
    });
    await check('contained Modal observes dynamic targets in a new child portal', { picker: true, presentation: 'contained', outerPortal: true, noPopupAnimation: true }, async (page, o) => {
      await page.getByRole('button', { name: 'Child date picker', exact: true }).click();
      const popup = page.getByRole('dialog', { name: 'Child date picker', exact: true }); await popup.waitFor();
      const day = popup.getByRole('button', { name: '2026-09-16', exact: true }); await day.focus();
      await day.evaluate((element) => { element.disabled = true; });
      await page.waitForFunction(() => document.querySelector('[role="dialog"][aria-label="Focus Modal"]')?.contains(document.activeElement));
      o.inside = await dialog(page).evaluate((element) => element.contains(document.activeElement)); assert.equal(o.inside, true);
    });
    for (const uncontrolled of [false, true]) await check(`initially open nested Modal owns Tab (${uncontrolled ? 'defaultOpen' : 'controlled'})`, { initialNested: true, uncontrolled }, async (page, o) => {
      const child = page.getByRole('dialog', { name: 'Nested Modal', exact: true }); await child.waitFor();
      await child.getByRole('button', { name: 'Confirm', exact: true }).focus(); await page.keyboard.press('Tab');
      o.insideChild = await child.evaluate((element) => element.contains(document.activeElement) || document.activeElement === document.body); assert.equal(o.insideChild, true);
      await pageIsolated(page);
      await child.getByRole('button', { name: 'Close dialog' }).click(); await child.waitFor({ state: 'hidden' });
      assert.equal(await dialog(page).evaluate((element) => element.contains(document.activeElement)), true);
    });
    await check('native summary and closed-details tab order', { disclosure: true }, async (page, o) => {
      await page.locator('#inside').focus(); await page.keyboard.press('Tab'); o.focus = await active(page); assert.equal(o.focus.id, 'summary');
      await page.keyboard.press('Tab'); assert.equal(await page.evaluate(() => document.activeElement.textContent), 'Cancel');
      await page.locator('#summary').focus(); await page.keyboard.press('Enter'); await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'details-button');
    });
    await check('native editable host participates in Tab order', { editable: true }, async (page, o) => {
      await page.locator('#inside').focus(); await page.keyboard.press('Tab'); o.focus = await active(page); assert.equal(o.focus.id, 'editable');
    });
    for (const hiddenMap of [false, true]) await check(`image-map link follows associated image visibility (${hiddenMap ? 'hidden' : 'visible'})`, { imageMap: true, hiddenMap }, async (page, o) => {
      await page.waitForFunction(() => { const image = document.getElementById('map-image'); return image.complete && image.naturalWidth > 0; });
      o.native = await reference({ imageMap: true, hiddenMap }, '#inside', ['Tab']);
      o.modal = await trace(page, '#inside', ['Tab']); assert.deepEqual(o.modal, o.native);
      assert.equal(o.modal[0], hiddenMap ? 'Cancel' : 'map-area');
    });
    await check('later independent Modal is above an existing nested Modal', { nested: true }, async (page, o) => {
      await activate(page.locator('#nested-opener')); const child = page.getByRole('dialog', { name: 'Nested Modal', exact: true }); await child.waitFor();
      await page.evaluate(() => window.modalTest.setIndependent(true));
      const independent = page.getByRole('dialog', { name: 'Independent Modal', exact: true }); await independent.waitFor();
      o.focused = await independent.evaluate((element) => element.contains(document.activeElement)); assert.equal(o.focused, true);
      await independent.getByRole('button', { name: 'Close dialog' }).click(); await independent.waitFor({ state: 'hidden' });
      assert.equal(await child.evaluate((element) => element.contains(document.activeElement)), true);
    });
    await check('native positive tab order after explicit focus', { positive: true }, async (page, o) => {
      o.initial = await active(page); assert.equal(o.initial.label, 'Close dialog');
      const keys = ['Tab', 'Tab', 'Shift+Tab'];
      o.native = await reference({ positive: true }, '#inside', keys); o.modal = await trace(page, '#inside', keys);
      assert.deepEqual(o.modal, o.native); assert.deepEqual(o.modal, ['field', 'Close dialog', 'field']);
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
    await check('focusable SVG remains a valid modal Tab target', { svgTarget: true }, async (page, o) => {
      await page.locator('#inside').focus(); await page.keyboard.press('Tab'); await page.waitForTimeout(30);
      o.focus = await page.evaluate(() => document.activeElement.getAttribute('id')); assert.equal(o.focus, 'svg-target');
    });
    await check('focusable SVG opener receives restored focus', { svgOpener: true }, async (page, o) => {
      await page.locator('#field').focus(); await page.keyboard.press('Escape'); await closed(page);
      o.focus = await page.evaluate(() => document.activeElement.getAttribute('id')); assert.equal(o.focus, 'opener');
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
      await activate(page.locator('#nested-opener')); await page.getByRole('dialog', { name: 'Nested Modal', exact: true }).waitFor();
      await page.evaluate(() => window.modalTest.setOpen(false)); await page.waitForTimeout(30);
      o.focus = await active(page); assert.equal(o.focus.id, 'opener');
      await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'background'); await closed(page);
    });
    for (const hiddenMode of ['display', 'visibility', 'class']) {
      await check(`initially CSS-hidden Modal does not trap (${hiddenMode})`, { hiddenMode }, async (page, o) => {
        await page.keyboard.press('Tab'); o.focus = await active(page); assert.equal(o.focus.id, 'background');
        assert.deepEqual(await page.evaluate(() => window.modalTest.requests), []);
        await page.evaluate(() => window.modalTest.setHiddenMode('')); await dialog(page).waitFor(); await page.waitForTimeout(60);
        assert.equal((await active(page)).inside, true);
      });
      await check(`later CSS hiding releases and revealing restores containment (${hiddenMode})`, {}, async (page, o) => {
        await page.locator('#field').focus(); await page.evaluate((mode) => window.modalTest.setHiddenMode(mode), hiddenMode); await page.waitForTimeout(60);
        o.hiddenFocus = await active(page); assert.equal(o.hiddenFocus.id, 'opener');
        await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'background');
        assert.deepEqual(await page.evaluate(() => window.modalTest.requests), []);
        await page.evaluate(() => window.modalTest.setHiddenMode('')); await dialog(page).waitFor(); await page.waitForTimeout(60);
        assert.equal((await active(page)).inside, true);
        await page.keyboard.press('Escape'); await closed(page); assert.equal((await active(page)).id, 'background');
      });
    }
    for (const attribute of ['hidden', 'inert']) await check(`non-Modal ancestor becoming ${attribute}`, { presentation: 'contained', outerPortal: true }, async (page, o) => {
      await page.locator('#field').focus(); await page.locator('#portal-host').evaluate((element, key) => { element[key] = true; }, attribute); await page.waitForTimeout(60);
      o.hiddenFocus = await active(page); assert.equal(o.hiddenFocus.id, 'opener');
      await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'background');
      await page.locator('#portal-host').evaluate((element, key) => { element[key] = false; }, attribute); await page.waitForTimeout(60);
      assert.equal((await active(page)).inside, true);
    });
    await check('Escape retains its existing open-prop semantics when CSS-hidden', { hiddenMode: 'display' }, async (page, o) => {
      await page.keyboard.press('Escape'); await page.waitForTimeout(60);
      o.requests = await page.evaluate(() => window.modalTest.requests); assert.deepEqual(o.requests, [false]);
      assert.equal(await page.locator('.modal-overlay').count(), 0);
    });
    for (const ancestor of [false, true]) await check(`unavailable parent suspends portalled child and preserves state (${ancestor ? 'inert ancestor' : 'CSS'})`, { nested: true, ...(ancestor ? { presentation: 'contained', outerPortal: true } : {}) }, async (page, o) => {
      await activate(page.locator('#nested-opener')); const child = page.getByRole('dialog', { name: 'Nested Modal', exact: true }); await child.waitFor();
      await page.locator('#nested-field').fill('preserved');
      if (ancestor) await page.locator('#portal-host').evaluate((element) => { element.inert = true; });
      else await page.evaluate(() => window.modalTest.setHiddenMode('display'));
      await page.waitForTimeout(100); o.childHidden = !(await child.isVisible()); assert.equal(o.childHidden, true);
      await page.keyboard.press('Tab'); assert.equal((await active(page)).id, 'background');
      assert.deepEqual(await page.evaluate(() => window.modalTest.requests), []);
      if (ancestor) await page.locator('#portal-host').evaluate((element) => { element.inert = false; });
      else await page.evaluate(() => window.modalTest.setHiddenMode(''));
      await child.waitFor(); await page.waitForTimeout(80); assert.equal(await page.locator('#nested-field').inputValue(), 'preserved');
      assert.equal(await child.evaluate((element) => element.contains(document.activeElement)), true);
    });
    for (const variant of [{}, { shadowIndex: 0 }, { shadowIndex: -1 }, { shadowIndex: -1, enterShadow: true }, { shadowPositive: true }, { shadowIndex: 0, delegatesFocus: true }]) await check(`open shadow/slot order matches native navigation ${JSON.stringify(variant)}`, { shadow: true, ...variant }, async (page, o) => {
      const native = await context.newPage(); native.setDefaultTimeout(4000);
      native.on('console', (entry) => { if (['warning', 'error'].includes(entry.type())) report.warnings.push({ case: `native shadow reference ${JSON.stringify(variant)}`, message: entry.text() }); });
      native.on('pageerror', (error) => report.errors.push({ case: `native shadow reference ${JSON.stringify(variant)}`, message: error.message }));
      async function sequence(target) {
        await target.bringToFront(); await target.locator(variant.enterShadow ? '#shadow-first' : '#inside').focus(); const values = [];
        for (let index = 0; index < 8; index++) {
          await target.keyboard.press('Tab');
          const value = await target.evaluate(() => {
            let element = document.activeElement;
            while (element?.shadowRoot?.activeElement) element = element.shadowRoot.activeElement;
            return element.textContent === 'Cancel' ? 'Cancel' : element.id || element.getAttribute('aria-label');
          });
          values.push(value); if (value === 'Cancel') break;
        }
        return values;
      }
      try {
        await native.goto(`${server.resolvedUrls.local[0]}?options=${encodeURIComponent(JSON.stringify({ nativeOnly: true, shadow: true, ...variant }))}`);
        await native.waitForFunction(() => window.modalTest.ready); o.native = await sequence(native); o.modal = await sequence(page);
        assert.deepEqual(o.modal, o.native);
        await page.bringToFront(); await page.keyboard.press('Shift+Tab'); await native.bringToFront(); await native.keyboard.press('Shift+Tab');
        assert.equal((await active(page)).id, (await active(native)).id);
      } finally { await native.close(); }
    });
    await check('open-shadow opener receives restored focus', { shadowOpener: true }, async (page, o) => {
      await page.locator('#field').focus(); await page.keyboard.press('Escape'); await closed(page);
      o.focus = await active(page); assert.equal(o.focus.id, 'opener');
    });
    for (const compound of ['date', 'time', 'audio']) for (const key of ['Tab', 'Shift+Tab']) await check(`compound ${compound} preserves native internal ${key} stops`, { compound }, async (page, o) => {
      const native = await context.newPage(); native.setDefaultTimeout(4000);
      native.on('console', (entry) => { if (['warning', 'error'].includes(entry.type())) report.warnings.push({ case: 'compound native reference', message: entry.text() }); });
      native.on('pageerror', (error) => report.errors.push({ case: 'compound native reference', message: error.message }));
      async function sequence(target) {
        await target.bringToFront(); await target.locator(key === 'Tab' ? '#compound' : '.modal-overlay__footer button:first-child, #native-end').focus();
        await target.evaluate(() => { window.modalTest.tabEvents = []; });
        const values = [];
        for (let i = 0; i < 8; i++) {
          await target.keyboard.press(key);
          const id = await target.evaluate(() => document.activeElement.id === 'compound' ? 'compound' : document.activeElement.textContent === 'Cancel' ? 'Cancel' : document.activeElement.id);
          values.push(id); if (id !== 'compound') break;
        }
        return { values, events: await target.evaluate(() => window.modalTest.tabEvents) };
      }
      try {
        await native.goto(`${server.resolvedUrls.local[0]}?options=${encodeURIComponent(JSON.stringify({ nativeOnly: true, compound }))}`);
        await native.waitForFunction(() => window.modalTest.ready);
        o.native = await sequence(native); o.modal = await sequence(page);
        assert.ok(o.native.values.filter((id) => id === 'compound').length > 0, 'Reference must expose multiple native internal stops.');
        assert.deepEqual(o.modal.values, o.native.values);
        assert.ok(o.modal.events.every((event) => !event.prevented), 'Ordinary compound-control Tab must be handled by the browser.');
      } finally { await native.close(); }
    });
    for (const variant of [{}, { scrollFits: true }, { scrollChild: 'enabled' }, { scrollChild: 'negative' }, { scrollChild: 'disabled' }, { scrollChild: 'hidden' }, { scrollOverflow: 'hidden' }]) await check(`native scroll-pane navigation ${JSON.stringify(variant)}`, { scroller: true, ...variant }, async (page, o) => {
      const native = await context.newPage(); native.setDefaultTimeout(4000);
      native.on('console', (entry) => { if (['warning', 'error'].includes(entry.type())) report.warnings.push({ case: 'native scroller reference', message: entry.text() }); });
      native.on('pageerror', (error) => report.errors.push({ case: 'native scroller reference', message: error.message }));
      async function next(target) {
        await target.bringToFront(); await target.locator('#inside').focus(); await target.keyboard.press('Tab');
        return target.evaluate(() => document.activeElement.textContent === 'Cancel' ? 'Cancel' : document.activeElement.id);
      }
      try {
        await native.goto(`${server.resolvedUrls.local[0]}?options=${encodeURIComponent(JSON.stringify({ nativeOnly: true, scroller: true, ...variant }))}`);
        await native.waitForFunction(() => window.modalTest.ready); o.native = await next(native); o.modal = await next(page); assert.equal(o.modal, o.native);
        if (o.modal === 'scroll-pane') {
          await page.keyboard.press('ArrowDown'); await page.waitForTimeout(100);
          o.scrollTop = await page.locator('#scroll-pane').evaluate((element) => element.scrollTop); assert.ok(o.scrollTop > 0);
        }
        await page.keyboard.press('Shift+Tab'); await native.bringToFront(); await native.keyboard.press('Shift+Tab');
        o.nativeBackward = (await active(native)).id; o.modalBackward = (await active(page)).id;
        assert.equal(o.modalBackward, o.nativeBackward); assert.equal(o.modalBackward, 'inside');
      } finally { await native.close(); }
    });
  }
} finally {
  await browser?.close(); await server?.close();
  report.passed = report.cases.length > 0 && report.cases.every((entry) => entry.passed) && !report.warnings.length && !report.errors.length;
  report.summary = { cases: report.cases.length, passed: report.cases.filter((entry) => entry.passed).length, failed: report.cases.filter((entry) => !entry.passed).length };
  writeFileSync('report.json', `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ mode, scope: report.scope, browser: report.browser, summary: report.summary, warnings: report.warnings, errors: report.errors }, null, 2));
  if (!report.passed) process.exitCode = 1;
}
