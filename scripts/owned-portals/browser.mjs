/* global window, document */
import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { createServer } from 'vite';
import { chromium, webkit } from 'playwright';
const small = process.argv.includes('small'), standaloneOnly = process.argv.includes('standalone'), extrasOnly = process.argv.includes('extras'), isWebkit = process.argv.includes('webkit'), browserType = isWebkit ? webkit : chromium;
const report = { node: process.version, cases: [], errors: [], warnings: [] };
let server, browser;
try {
  server = await createServer({ configFile: false, root: process.cwd(), server: { host: '127.0.0.1', port: 0 } }); await server.listen();
  browser = await browserType.launch(); report.browser = browser.version();
  const context = await browser.newContext({ viewport: { width: 960, height: 720 }, reducedMotion: 'reduce' });
  for (const geometry of extrasOnly || standaloneOnly ? [] : small ? ['translate'] : isWebkit ? ['viewport', 'scroll-host', 'translate', 'scale', 'ancestor-transform'] : ['viewport', 'viewport-scroll', 'viewport-resize', 'contained', 'scroll-host', 'translate', 'scale', 'ancestor-transform', 'nested-positioned']) {
    for (const widget of small ? ['date'] : ['date', 'time', 'popover', 'tooltip']) {
      const name = `${widget} ${geometry}`, page = await context.newPage(); page.setDefaultTimeout(6000); page.setDefaultNavigationTimeout(30000);
      page.on('pageerror', (error) => report.errors.push({ name, message: error.message }));
      page.on('console', (entry) => { if (['warning', 'error'].includes(entry.type())) report.warnings.push({ name, message: entry.text() }); });
      const observation = {};
      try {
        await page.goto(`${server.resolvedUrls.local[0]}?options=${encodeURIComponent(JSON.stringify({ geometry, widget }))}`);
        await page.waitForFunction(() => window.portalTest?.ready);
        if (geometry === 'viewport-scroll') await page.evaluate(() => { document.body.style.height = '1900px'; window.scrollTo(0, 400); });
        await page.locator('#opener').click(); await page.getByRole('dialog', { name: 'Owned parent', exact: true }).waitFor();
        if (geometry === 'scroll-host') await page.locator('#host').evaluate((node) => { node.scrollTop = 35; });
        const trigger = widget === 'date' ? page.getByRole('button', { name: 'Probe Date', exact: true }) : widget === 'time' ? page.getByRole('button', { name: 'Probe Time', exact: true }) : widget === 'popover' ? page.getByRole('button', { name: 'Probe Popover', exact: true }) : page.locator('#tooltip-trigger');
        if (widget === 'tooltip') await trigger.focus(); else await trigger.click();
        const popup = widget === 'tooltip' ? page.getByRole('tooltip', { name: 'Probe tooltip', exact: true }) : page.getByRole(widget === 'time' ? 'listbox' : 'dialog', { name: widget === 'date' ? 'Probe Date' : widget === 'time' ? 'Probe Time' : 'Probe popup', exact: true });
        await popup.waitFor(); await page.waitForTimeout(100);
        if (geometry === 'viewport-resize') { await page.setViewportSize({ width: 850, height: 640 }); await page.waitForTimeout(100); }
        observation.popup = await popup.boundingBox(); observation.trigger = await trigger.boundingBox();
        observation.root = await page.getByRole('dialog', { name: 'Owned parent', exact: true }).locator('..').boundingBox();
        observation.style = await popup.evaluate((element) => ({ position: window.getComputedStyle(element).position, inScope: Boolean(element.closest('.modal-overlay')), shared: Boolean(element.closest('#agentic-ui-overlay-root')), background: window.getComputedStyle(element).backgroundColor, theme: window.getComputedStyle(element).getPropertyValue('--color-surface-raised'), pointer: window.getComputedStyle(element).pointerEvents }));
        assert.equal(observation.style.inScope, true); assert.equal(observation.style.position, 'absolute');
        const { popup: p, root: r, trigger: t } = observation;
        assert.ok(p.x >= r.x - 1 && p.y >= r.y - 1 && p.x + p.width <= r.x + r.width + 1 && p.y + p.height <= r.y + r.height + 1, 'Popup must remain within owned clipping bounds.');
        if (widget === 'date' || widget === 'time') assert.ok(Math.abs(p.x - Math.max(r.x + 8, Math.min(t.x, r.x + r.width - p.width - 8))) < 2, 'Start alignment must be coordinate-space safe.');
        if (widget !== 'tooltip') {
          const action = widget === 'date' ? popup.getByRole('button', { name: '2026-10-04', exact: true }) : widget === 'time' ? popup.getByRole('option').last() : popup.locator('#popover-action');
          await action.scrollIntoViewIfNeeded(); observation.action = await action.boundingBox();
          observation.hit = await action.evaluate((element) => { const r = element.getBoundingClientRect(); const hit = document.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2); return Boolean(hit && (element === hit || element.contains(hit))); });
          assert.equal(observation.hit, true); await action.click();
          observation.actions = await page.evaluate(() => window.portalTest.actions); assert.equal(observation.actions.length, 1);
        }
        report.cases.push({ name, passed: true, observation });
      } catch (error) { report.cases.push({ name, passed: false, observation, failure: error.message }); }
      finally { await page.close(); }
    }
  }
  async function extra(name, options, test) {
    const page = await context.newPage(); page.setDefaultTimeout(6000); page.setDefaultNavigationTimeout(30000);
    page.on('pageerror', (error) => report.errors.push({ name, message: error.message }));
    page.on('console', (entry) => { if (['warning', 'error'].includes(entry.type())) report.warnings.push({ name, message: entry.text() }); });
    const observation = {};
    try {
      await page.goto(`${server.resolvedUrls.local[0]}?options=${encodeURIComponent(JSON.stringify(options))}`);
      await page.waitForFunction(() => window.portalTest?.ready);
      await test(page, observation); report.cases.push({ name, passed: true, observation });
    } catch (error) { report.cases.push({ name, passed: false, observation, failure: error.message }); }
    finally { await page.close(); }
  }
  async function openWidget(page, widget) {
    if (widget === 'tooltip') await page.locator('#tooltip-trigger').focus();
    else if (widget === 'user') await page.locator('.user-card__trigger').click();
    else if (!['modal', 'drawer', 'toast'].includes(widget)) await page.getByRole('button', { name: { date: 'Probe Date', time: 'Probe Time', popover: 'Probe Popover', dropdown: 'Probe Dropdown', menu: 'Probe Menu' }[widget], exact: true }).click();
    const selector = { date: '.date-picker__popover', time: '.time-picker__popover', popover: '.popover__panel', tooltip: '.tooltip__bubble', dropdown: '.dropdown__menu', user: '.user-card__panel', menu: '.context-menu__menu', modal: '.modal-overlay', drawer: '.drawer-overlay', toast: '.toast-region' }[widget];
    const popup = page.locator(selector); await popup.waitFor(); await page.waitForTimeout(70); return popup;
  }
  if (!small) for (const widget of isWebkit ? ['date', 'time', 'popover', 'tooltip'] : ['date', 'time', 'popover', 'tooltip', 'dropdown', 'user', 'menu', 'modal', 'drawer', 'toast']) {
    await extra(`standalone ${widget}`, { standalone: true, widget }, async (page, o) => {
      const popup = await openWidget(page, widget);
      o.rectangle = await popup.boundingBox();
      o.destination = await popup.evaluate((element) => ({ shared: Boolean(element.closest('#agentic-ui-overlay-root')), owned: Boolean(element.closest('[data-owned-portal]')), position: window.getComputedStyle(element).position }));
      assert.deepEqual(o.destination, { shared: true, owned: false, position: 'fixed' });
      if (widget === 'date') await popup.getByRole('button', { name: '2026-09-16', exact: true }).click();
      if (widget === 'time') await popup.getByRole('option', { name: '12:45', exact: true }).click();
      if (widget === 'popover') await popup.locator('#popover-action').click();
      if (widget === 'dropdown') await popup.getByRole('option', { name: 'Beta', exact: true }).click();
      if (widget === 'user') await popup.getByRole('button', { name: 'Settings', exact: true }).click();
      if (widget === 'menu') await popup.getByRole('menuitem', { name: 'Beta action', exact: true }).click();
      if (widget === 'toast') { await popup.getByRole('button', { name: 'Inspect', exact: true }).click(); await popup.getByRole('button', { name: 'Dismiss notification', exact: true }).click(); }
      if (widget === 'modal' || widget === 'drawer') { await popup.getByRole('button', { name: widget === 'modal' ? 'Close dialog' : 'Close drawer', exact: true }).click(); await page.keyboard.press('Escape'); o.requests = await page.evaluate(() => window.portalTest.requests); assert.deepEqual(o.requests, [false, false]); }
      else if (widget === 'tooltip') { await page.locator('#outside').focus(); await popup.waitFor({ state: 'hidden' }); }
      else if (widget === 'popover') { await page.keyboard.press('Escape'); await popup.waitFor({ state: 'hidden' }); }
      else if (widget !== 'toast') await popup.waitFor({ state: 'hidden' });
      o.actions = await page.evaluate(() => window.portalTest.actions);
      if (!['modal', 'drawer', 'tooltip'].includes(widget)) assert.ok(o.actions.length >= 1);
      if (!['modal', 'drawer', 'toast', 'tooltip'].includes(widget)) { await openWidget(page, widget); await page.locator('#outside').click(); await popup.waitFor({ state: 'hidden' }); }
    });
  }
  if (!small && !standaloneOnly && !isWebkit) for (const strict of [false, true]) {
    await extra(`connected owned focus proof ${strict ? 'StrictMode' : 'normal'}`, { geometry: 'contained', focus: true, widget: 'date', strict, unrelated: true }, async (page, o) => {
      await page.locator('#opener').click(); const popup = await openWidget(page, 'date');
      o.connected = await popup.evaluate((element) => Boolean(element.closest('.modal-overlay'))); assert.equal(o.connected, true);
      await page.evaluate(() => {
        const root = document.querySelector('.modal-overlay'), host = document.getElementById('host');
        const first = root.querySelector('[aria-label="Close dialog"]');
        const last = document.createElement('button'); last.id = 'scope-exit'; last.textContent = 'Diagnostic exit action'; root.appendChild(last);
        const guard = (name, destination) => { const node = document.createElement('span'); node.id = name; node.tabIndex = 0; node.className = 'guard'; node.setAttribute('aria-hidden', 'true'); node.addEventListener('focus', () => destination.focus()); return node; };
        root.prepend(guard('scope-start', last)); root.appendChild(guard('scope-end', first));
        host.before(guard('host-entry', first)); host.after(guard('host-return', last));
        for (const element of [document.getElementById('outside'), document.getElementById('after'), document.getElementById('unrelated')]) element.inert = true;
      });
      const seen = [];
      await page.locator('[aria-label="Close dialog"]').first().focus();
      for (let index = 0; index < 85; index++) {
        await page.keyboard.press('Tab');
        const value = await page.evaluate(() => { let node = document.activeElement; while (node?.shadowRoot?.activeElement) node = node.shadowRoot.activeElement; return { id: node.id, calendar: Boolean(node.closest('.date-picker__popover')), shadow: node.id === 'shadow-first' || node.id === 'shadow-last', label: node.getAttribute('aria-label') }; });
        seen.push(value); assert.ok(!['host', 'outside', 'unrelated', 'after'].includes(value.id));
      }
      o.calendarEntered = seen.some((value) => value.calendar); o.shadowEntered = seen.some((value) => value.shadow); assert.ok(o.calendarEntered && o.shadowEntered);
      for (const id of ['native-date', 'native-time', 'native-media']) assert.ok(seen.filter((value) => value.id === id).length > 1);
      await page.locator('[aria-label="Close dialog"]').first().focus(); await page.keyboard.press('Shift+Tab'); assert.equal(await page.evaluate(() => document.activeElement.id), 'scope-exit');
      await page.keyboard.press('Shift+Tab'); o.reverseCalendar = await page.evaluate(() => Boolean(document.activeElement.closest('.date-picker__popover'))); assert.equal(o.reverseCalendar, true);
      o.prevented = await page.evaluate(() => window.portalTest.tabs.some((event) => event.prevented)); assert.equal(o.prevented, false);
      o.hostIndex = await page.locator('#host').getAttribute('tabindex'); assert.equal(o.hostIndex, '0');
    });
    await extra(`nested and later independent layers ${strict ? 'StrictMode' : 'normal'}`, { geometry: 'contained', nested: true, strict }, async (page, o) => {
      await page.locator('#opener').click(); await openWidget(page, 'date');
      await page.evaluate(() => window.portalTest.setNested(true));
      const child = page.getByRole('dialog', { name: 'Nested owner', exact: true }); await child.waitFor();
      await child.getByRole('button', { name: 'Nested Date', exact: true }).click();
      const childPopup = page.getByRole('dialog', { name: 'Nested Date', exact: true }); await childPopup.waitFor();
      o.childScope = await childPopup.evaluate((element) => element.closest('.modal-overlay').querySelector('[aria-label="Nested owner"]') !== null); assert.equal(o.childScope, true);
      const layer = async (dialog) => dialog.locator('..').evaluate((element) => Number(window.getComputedStyle(element).zIndex));
      const parent = page.getByRole('dialog', { name: 'Owned parent', exact: true }); o.parentLayer = await layer(parent); o.childLayer = await layer(child); assert.ok(o.childLayer > o.parentLayer);
      await page.evaluate(() => window.portalTest.setIndependent(true)); const independent = page.getByRole('dialog', { name: 'Independent owner', exact: true }); await independent.waitFor(); o.independentLayer = await layer(independent); assert.ok(o.independentLayer > o.childLayer);
      const point = await independent.getByRole('button', { name: 'Close dialog', exact: true }).boundingBox();
      o.independentHit = await page.evaluate(({ x, y }) => document.elementFromPoint(x, y)?.closest('[aria-label="Independent owner"]') !== null, { x: point.x + point.width / 2, y: point.y + point.height / 2 }); assert.equal(o.independentHit, true);
      await page.evaluate(() => { window.portalTest.setIndependent(false); window.portalTest.setNested(false); }); await child.waitFor({ state: 'hidden' }); await independent.waitFor({ state: 'hidden' });
      await page.getByRole('button', { name: 'Probe Date', exact: true }).click();
      const reopened = page.getByRole('dialog', { name: 'Probe Date', exact: true }); await reopened.waitFor(); assert.equal(await reopened.evaluate((element) => Boolean(element.closest('[data-presentation="contained"]'))), true);
    });
  }
  if (!small && !standaloneOnly) {
    if (!isWebkit) await extra('recovered translateZ origin before after conversion', { geometry: 'gpu' }, async (page, o) => {
      await page.locator('#opener').click(); const popup = await openWidget(page, 'date');
      o.correct = await popup.boundingBox(); o.root = await page.locator('.modal-overlay[data-presentation="contained"]').boundingBox();
      o.naive = await popup.evaluate((element, position) => {
        const box = document.createElement('div'); box.setAttribute('aria-hidden', 'true'); box.inert = true;
        Object.assign(box.style, { position: 'fixed', left: `${position.x}px`, top: `${position.y}px`, width: `${position.width}px`, height: `${position.height}px`, pointerEvents: 'none' });
        element.closest('[data-modal-portal-plane]').appendChild(box);
        const rect = box.getBoundingClientRect(), result = { x: rect.x, y: rect.y, width: rect.width, height: rect.height };
        box.remove(); return result;
      }, o.correct);
      assert.ok(Math.abs(o.naive.x - o.correct.x - o.root.x) < 1 && Math.abs(o.naive.y - o.correct.y - o.root.y) < 1);
      o.restored = await popup.boundingBox(); assert.ok(Math.abs(o.restored.x - o.correct.x) < 1 && Math.abs(o.restored.y - o.correct.y) < 1);
    });
    for (const strict of [false, true]) await extra(`contained SSR hydration ${strict ? 'StrictMode' : 'normal'}`, { hydrate: true, strict }, async (page, o) => {
      await page.getByRole('button', { name: 'Hydrated Date', exact: true }).click();
      const popup = page.getByRole('dialog', { name: 'Hydrated Date', exact: true }); await popup.waitFor();
      o.inScope = await popup.evaluate((element) => Boolean(element.closest('[data-presentation="contained"]'))); assert.equal(o.inScope, true);
      await page.keyboard.press('Escape'); o.requests = await page.evaluate(() => window.portalTest.requests); assert.deepEqual(o.requests, [false]);
    });
    for (const widget of isWebkit ? [] : ['date', 'popover', 'tooltip']) await extra(`live geometry ${widget}`, { geometry: 'scroll-host', widget }, async (page, o) => {
      await page.locator('#opener').click(); const popup = await openWidget(page, widget);
      const snapshot = async () => ({ popup: await popup.boundingBox(), root: await page.getByRole('dialog', { name: 'Owned parent', exact: true }).locator('..').boundingBox() });
      o.before = await snapshot();
      await page.locator('#host').evaluate((node) => { node.scrollTop = 65; }); await page.waitForTimeout(100); o.scrolled = await snapshot();
      await page.locator('#shell').evaluate((node) => { node.style.transform = 'translate(35px,18px) scale(.85)'; }); await page.waitForTimeout(120); o.transformed = await snapshot();
      await page.setViewportSize({ width: 900, height: 650 }); await page.waitForTimeout(120); o.resized = await snapshot();
      for (const step of [o.before, o.scrolled, o.transformed, o.resized]) {
        const p = step.popup, r = step.root; assert.ok(p && p.x >= r.x - 1 && p.y >= r.y - 1 && p.x + p.width <= r.x + r.width + 1 && p.y + p.height <= r.y + r.height + 1);
      }
      await page.setViewportSize({ width: 960, height: 720 });
    });
    for (const widget of isWebkit ? [] : ['dropdown', 'user', 'menu']) await extra(`owned ${widget} scaled host`, { geometry: 'scale', widget }, async (page, o) => {
      await page.locator('#opener').click(); const popup = await openWidget(page, widget);
      o.owned = await popup.evaluate((element) => Boolean(element.closest('.modal-overlay'))); assert.equal(o.owned, true);
      o.popup = await popup.boundingBox(); o.root = await page.getByRole('dialog', { name: 'Owned parent', exact: true }).locator('..').boundingBox();
      assert.ok(o.popup.x >= o.root.x - 1 && o.popup.y >= o.root.y - 1 && o.popup.x + o.popup.width <= o.root.x + o.root.width + 1 && o.popup.y + o.popup.height <= o.root.y + o.root.height + 1);
      const action = widget === 'dropdown' ? popup.getByRole('option', { name: 'Beta', exact: true }) : widget === 'user' ? popup.getByRole('button', { name: 'Settings', exact: true }) : popup.getByRole('menuitem', { name: 'Beta action', exact: true });
      await action.click(); o.actions = await page.evaluate(() => window.portalTest.actions); assert.equal(o.actions.length, 1);
    });
    if (!isWebkit) await extra('owner theming visibility unrelated portal and reopen', { geometry: 'contained', unrelated: true, theme: true }, async (page, o) => {
      await page.locator('#opener').click(); let popup = await openWidget(page, 'date');
      o.initialTheme = await popup.evaluate((element) => window.getComputedStyle(element).backgroundColor); assert.equal(o.initialTheme, 'rgb(223, 240, 231)');
      assert.equal(await page.locator('#unrelated').evaluate((element) => Boolean(element.closest('[data-owned-portal]'))), false);
      const root = page.locator('.modal-overlay[data-presentation="contained"]');
      await root.evaluate((element) => element.style.setProperty('--color-surface-raised', 'rgb(230, 210, 240)'));
      await page.waitForFunction(() => { const element = document.querySelector('.date-picker__popover'); return element && window.getComputedStyle(element).backgroundColor === 'rgb(230, 210, 240)'; });
      o.updatedTheme = await popup.evaluate((element) => window.getComputedStyle(element).backgroundColor); assert.equal(o.updatedTheme, 'rgb(230, 210, 240)');
      await root.evaluate((element) => { element.style.display = 'none'; }); await popup.waitFor({ state: 'hidden' });
      await root.evaluate((element) => { element.style.display = ''; }); await popup.waitFor();
      o.radius = await root.evaluate((element) => ({ radius: window.getComputedStyle(element).borderRadius, contain: window.getComputedStyle(element).contain })); assert.equal(o.radius.radius, '24px'); assert.equal(o.radius.contain, 'paint');
      await page.evaluate(() => window.portalTest.setOpen(false)); await root.waitFor({ state: 'hidden' });
      await page.locator('#opener').click(); popup = await openWidget(page, 'date'); assert.equal(await popup.evaluate((element) => Boolean(element.closest('.modal-overlay'))), true);
    });
  }
  if (!small && !standaloneOnly) for (const strict of [false, true]) {
    await extra(`shared stacking restoration ${strict ? 'StrictMode' : 'normal'}`, { geometry: 'contained', nested: true, strict }, async (page, o) => {
      await page.evaluate(() => {
        const shared = document.createElement('div'); shared.id = 'agentic-ui-overlay-root'; shared.className = 'overlay-root';
        shared.style.setProperty('z-index', '123', 'important'); shared.style.setProperty('--fixture-marker', 'retained'); document.body.appendChild(shared);
      });
      const style = () => page.locator('#agentic-ui-overlay-root').evaluate((node) => ({ value: node.style.zIndex, priority: node.style.getPropertyPriority('z-index'), marker: node.style.getPropertyValue('--fixture-marker') }));
      await page.locator('#opener').click();
      await page.evaluate(() => window.portalTest.setNested(true));
      await page.getByRole('dialog', { name: 'Nested owner', exact: true }).waitFor();
      assert.match((await style()).value, /calc/);
      await page.evaluate(() => window.portalTest.setIndependent(true));
      await page.getByRole('dialog', { name: 'Independent owner', exact: true }).waitFor();
      await page.evaluate(() => window.portalTest.setIndependent(false));
      await page.getByRole('dialog', { name: 'Independent owner', exact: true }).waitFor({ state: 'hidden' });
      assert.match((await style()).value, /calc/);
      await page.evaluate(() => window.portalTest.setNested(false));
      await page.getByRole('dialog', { name: 'Nested owner', exact: true }).waitFor({ state: 'hidden' });
      o.restored = await style(); assert.deepEqual(o.restored, { value: '123', priority: 'important', marker: 'retained' });
      await page.evaluate(() => window.portalTest.setIndependent(true));
      await page.getByRole('dialog', { name: 'Independent owner', exact: true }).waitFor();
      await page.locator('#agentic-ui-overlay-root').evaluate((node) => node.style.setProperty('z-index', '456', 'important'));
      await page.evaluate(() => window.portalTest.setIndependent(false));
      await page.getByRole('dialog', { name: 'Independent owner', exact: true }).waitFor({ state: 'hidden' });
      o.external = await style(); assert.deepEqual(o.external, { value: '456', priority: 'important', marker: 'retained' });
    });
    await extra(`owned content resize and scroll ${strict ? 'StrictMode' : 'normal'}`, { geometry: 'contained', widget: 'popover', strict }, async (page, o) => {
      await page.locator('#opener').click(); const popup = await openWidget(page, 'popover');
      o.before = await popup.boundingBox();
      await popup.locator('.popover__body').evaluate((node) => {
        const content = document.createElement('div'); content.id = 'stress-content'; content.style.height = '800px'; content.textContent = 'Synthetic growing content'; node.prepend(content);
      });
      await page.waitForFunction(() => { const node = document.querySelector('.popover__panel'); return node.scrollHeight > node.clientHeight; });
      await popup.locator('#popover-action').scrollIntoViewIfNeeded();
      o.expanded = await popup.boundingBox(); o.root = await page.locator('.modal-overlay[data-presentation="contained"]').boundingBox();
      assert.ok(o.expanded.y >= o.root.y && o.expanded.y + o.expanded.height <= o.root.y + o.root.height + 1);
      await popup.locator('#popover-action').click(); assert.deepEqual(await page.evaluate(() => window.portalTest.actions), ['popover']);
      await page.locator('#stress-content').evaluate((node) => node.remove());
      await page.waitForFunction((height) => document.querySelector('.popover__panel').getBoundingClientRect().height < height, o.expanded.height);
      o.shrunk = await popup.boundingBox(); assert.ok(Math.abs(o.shrunk.height - o.before.height) < 2);
    });
  }
} finally {
  await browser?.close(); await server?.close();
  report.summary = { cases: report.cases.length, passed: report.cases.filter((entry) => entry.passed).length, failed: report.cases.filter((entry) => !entry.passed).length };
  writeFileSync('report.json', `${JSON.stringify(report, null, 2)}\n`);
  console.log(JSON.stringify({ browser: report.browser, summary: report.summary, errors: report.errors, warnings: report.warnings, failures: report.cases.filter((entry) => !entry.passed) }, null, 2));
  if (report.summary.failed || report.errors.length || report.warnings.length) process.exitCode = 1;
}
