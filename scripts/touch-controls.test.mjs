import assert from 'node:assert/strict';
import Module from 'node:module';
import { join, resolve } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { buildSync } from 'esbuild';
import { JSDOM } from 'jsdom';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const dom = new JSDOM('<!doctype html><html><body></body></html>', { url: 'http://localhost/' });
const { window } = dom;
const { document } = window;
for (const key of ['window', 'document', 'HTMLElement', 'Element', 'Node', 'MutationObserver', 'navigator']) {
  Object.defineProperty(globalThis, key, { configurable: true, value: dom.window[key] });
}
dom.window.matchMedia = () => ({ matches: true });
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

const { createElement, act } = await import('react');
const { createRoot } = await import('react-dom/client');

function loadComponent(path) {
  const source = buildSync({
    entryPoints: [join(root, path)],
    bundle: true,
    format: 'cjs',
    jsx: 'automatic',
    loader: { '.css': 'empty' },
    packages: 'external',
    platform: 'node',
    write: false,
  }).outputFiles[0].text;
  const module = new Module(join(root, 'node_modules', '.cache', 'touch-controls.cjs'));
  module.filename = join(root, 'node_modules', '.cache', 'touch-controls.cjs');
  module.paths = Module._nodeModulePaths(root);
  module._compile(source, module.filename);
  return module.exports;
}

const { Tooltip } = loadComponent('src/components/overlays/Tooltip/Tooltip.tsx');
const { Button } = loadComponent('src/components/inputs/Button/Button.tsx');

function render(component) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const root = createRoot(host);
  act(() => root.render(component));
  return {
    host,
    close: () => act(() => { root.unmount(); host.remove(); }),
    open: () => host.querySelector('.tooltip')?.dataset.open === 'true',
    trigger: () => host.querySelector('button'),
  };
}

function pointer(target, type, pointerType) {
  const event = new window.Event(type, { bubbles: true });
  Object.defineProperty(event, 'pointerType', { value: pointerType });
  act(() => target.dispatchEvent(event));
}

test('touch tooltip dismisses after release despite sticky focus and synthetic hover', async () => {
  const callbacks = [];
  const fixture = render(createElement(Tooltip, { content: 'Help', onOpenChange: (open) => callbacks.push(open) }, createElement('button', null, 'Target')));
  try {
    pointer(fixture.trigger(), 'pointerdown', 'touch');
    pointer(fixture.trigger(), 'pointerup', 'touch');
    act(() => {
      fixture.trigger().focus();
      fixture.trigger().dispatchEvent(new window.MouseEvent('mouseover', { bubbles: true }));
    });
    assert.equal(fixture.open(), true);
    await act(async () => delay(1900));
    assert.equal(fixture.open(), false);
    assert.equal(document.activeElement, fixture.trigger());
    assert.equal(callbacks.at(-1), false);
  } finally { fixture.close(); }
});

test('touch cancellation closes; keyboard focus and mouse hover still work', () => {
  const calls = [];
  const fixture = render(createElement(Tooltip, {
    content: 'Help',
    onPointerDown: () => calls.push('down'),
    onPointerCancel: () => calls.push('cancel'),
    onPointerMove: () => calls.push('move'),
  }, createElement('button', null, 'Target')));
  try {
    pointer(fixture.trigger(), 'pointerdown', 'touch');
    assert.equal(fixture.open(), true);
    pointer(fixture.trigger(), 'pointercancel', 'touch');
    assert.equal(fixture.open(), false);
    act(() => fixture.trigger().focus());
    assert.equal(fixture.open(), true);
    act(() => fixture.trigger().blur());
    assert.equal(fixture.open(), false);
    pointer(fixture.trigger(), 'pointermove', 'mouse');
    assert.equal(fixture.open(), true);
    act(() => fixture.trigger().dispatchEvent(new window.MouseEvent('mouseout', { bubbles: true })));
    assert.equal(fixture.open(), false);
    assert.deepEqual(calls, ['down', 'cancel', 'move']);
  } finally { fixture.close(); }
});

test('controlled open stays authoritative and unmount clears a touch timeout', async () => {
  const changes = [];
  const controlled = render(createElement(Tooltip, { content: 'Help', open: true, onOpenChange: (value) => changes.push(value) }, createElement('button', null, 'Target')));
  pointer(controlled.trigger(), 'pointerdown', 'touch');
  pointer(controlled.trigger(), 'pointerup', 'touch');
  controlled.close();
  await delay(1900);
  assert.ok(changes.includes(true));
  assert.equal(changes.includes(false), false);
});

test('Button tooltip uses the same touch dismissal', async () => {
  const fixture = render(createElement(Button, { 'aria-label': 'Help', icon: createElement('span', null, '?'), iconOnly: true, tooltip: 'Help' }));
  try {
    pointer(fixture.trigger(), 'pointerdown', 'touch');
    pointer(fixture.trigger(), 'pointerup', 'touch');
    assert.equal(fixture.open(), true);
    await act(async () => delay(1900));
    assert.equal(fixture.open(), false);
  } finally { fixture.close(); }
});
