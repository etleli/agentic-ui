import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { format } from 'node:util';

const [kind, mode, scenario, component] = process.argv.slice(2);
const sourceRoot = fileURLToPath(new URL('../', import.meta.url));
const consumerRoot = process.env.AGENTIC_UI_CONSUMER_ROOT ? resolve(process.env.AGENTIC_UI_CONSUMER_ROOT) : sourceRoot;
const require = createRequire(join(consumerRoot, 'package.json'));
const React = require('react');
const { act, createElement: h, useState, Profiler, StrictMode } = React;
const { renderToString } = require('react-dom/server');
const libraryPath = process.env.AGENTIC_UI_CONSUMER_ROOT
  ? join(consumerRoot, 'node_modules/@etleli/agentic-ui/dist-library/agentic-ui.js')
  : join(sourceRoot, 'dist-library/agentic-ui.js');
const library = await import(pathToFileURL(libraryPath).href);
const warnings = [];
let commits = 0;
let stepCommits = 0;
const observedSizes = [];
function fail(error) {
  process.stderr.write(JSON.stringify({ kind, mode, scenario, component, message: error.message, stack: error.stack, warnings, commits }) + '\n');
  process.exit(1);
}
console.warn = console.error = (...values) => {
  const message = format(...values);
  warnings.push(message);
  fail(new Error('Unexpected React/DOM diagnostic: ' + message));
};
process.on('uncaughtException', fail);
process.on('unhandledRejection', fail);
let readSize;
function profile() {
  commits++;
  stepCommits++;
  if (readSize) observedSizes.push(readSize());
  if (stepCommits > 100) fail(new Error('Component did not settle within the 100-commit safety bound'));
}
function wrap(child) {
  const tree = h(Profiler, { id: 'component-regression', onRender: profile }, child);
  return mode === 'strict' ? h(StrictMode, null, tree) : tree;
}
async function step(action) {
  stepCommits = 0;
  await act(async () => { await action(); });
  const settled = commits;
  await act(async () => { await new Promise(done => setTimeout(done, 5)); });
  assert.equal(commits, settled, 'Rendering must settle after effects, without an exact render-count requirement');
  assert.deepEqual(warnings, []);
}
const browserKeys = ['window', 'document', 'localStorage', 'sessionStorage', 'navigator', 'self', 'HTMLElement'];
function noBrowserGlobals() {
  for (const key of browserKeys) assert.equal(typeof globalThis[key], 'undefined', key + ' must be absent for SSR');
}
const isSplit = component === 'SplitPane';
const defaultSize = isSplit ? 42 : 360;
const savedSize = isSplit ? 60 : 480;
const changedSize = isSplit ? 65 : 520;
const min = isSplit ? 18 : 220;
const max = isSplit ? 82 : 680;
const controlledProp = isSplit ? 'splitPercent' : 'size';
const storagePrefix = isSplit ? 'agentic-ui:split-pane:' : 'agentic-ui:resizable-panel:';
const baseProps = isSplit ? { first: 'First', second: 'Second' } : { children: 'Content' };

try {
  if (kind === 'ssr') {
    noBrowserGlobals();
    const props = { ...baseProps };
    if (scenario !== 'default') props.persistKey = 'saved';
    if (scenario === 'controlled') props[controlledProp] = isSplit ? 50 : 400;
    const html = renderToString(h(library[component], props));
    assert.ok(html.includes(isSplit ? 'First' : 'Content'));
    assert.ok(html.includes(isSplit ? `--split-pane-percent:${props.splitPercent ?? defaultSize}%` : `--resizable-panel-width:${props.size ?? defaultSize}px`));
    noBrowserGlobals();
    process.stdout.write(JSON.stringify({ passed: true, kind, component, scenario, html, browserGlobalsAbsent: true, react: React.version }) + '\n');
    process.exit(0);
  }

  let serverHtml;
  if (kind === 'panel' && scenario === 'hydration') {
    noBrowserGlobals();
    serverHtml = renderToString(wrap(h('div', { 'data-tick': 0 }, h(library[component], { ...baseProps, persistKey: 'saved' }))));
  }

  const { JSDOM, VirtualConsole } = require('jsdom');
  const virtualConsole = new VirtualConsole();
  virtualConsole.on('jsdomError', fail);
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
    url: 'http://localhost/', virtualConsole,
  });
  for (const key of ['window', 'document', 'navigator', 'HTMLElement', 'HTMLInputElement', 'HTMLButtonElement', 'Node', 'Event', 'MouseEvent', 'File']) {
    Object.defineProperty(globalThis, key, { configurable: true, value: key === 'window' ? dom.window : dom.window[key] });
  }
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const { createRoot, hydrateRoot } = require('react-dom/client');
  const document = dom.window.document;
  const container = document.getElementById('root');
  const rootOptions = { onUncaughtError: fail, onRecoverableError: fail };
  let root = createRoot(container, rootOptions);
  let updateParent;
  const calls = [];

  if (kind === 'filepicker') {
    const accepting = scenario === 'accepting';
    const controlled = accepting || scenario.startsWith('declining');
    const initial = scenario === 'declining' ? ['kept.txt'] : [];
    let parentFiles = Object.freeze([...initial]);
    function Parent() {
      const [files, setFiles] = useState(parentFiles);
      const [props, setProps] = useState({ multiple: accepting, maxFiles: accepting ? 2 : undefined });
      const [tick, setTick] = useState(0);
      updateParent = {
        rerender: () => setTick(value => value + 1),
        files: next => setFiles(Object.freeze([...next])),
        props: next => setProps(current => ({ ...current, ...next })),
      };
      parentFiles = files;
      return h('div', { 'data-tick': tick }, h(library.FilePicker, {
        ...props, ...(controlled ? { selectedFiles: files } : {}),
        onFilesChange(next) { calls.push([...next]); if (accepting) setFiles(Object.freeze([...next])); },
      }));
    }
    const names = () => [...document.querySelectorAll('.file-picker__file-name')].map(el => el.textContent);
    async function choose(fileNames, drop = false) {
      await step(() => {
        const files = fileNames.map(name => new dom.window.File(['fixture'], name, { type: 'text/plain' }));
        if (drop) {
          const event = new dom.window.Event('drop', { bubbles: true, cancelable: true });
          Object.defineProperty(event, 'dataTransfer', { value: { files } });
          document.querySelector('.file-picker__dropzone').dispatchEvent(event);
        } else {
          const input = document.querySelector('input[type=file]');
          Object.defineProperty(input, 'files', { configurable: true, value: files });
          input.dispatchEvent(new dom.window.Event('change', { bubbles: true }));
        }
      });
    }
    async function remove(name) { await step(() => document.querySelector(`[aria-label="Remove ${name}"]`).click()); }
    await step(() => root.render(wrap(h(Parent))));
    assert.deepEqual(names(), initial);
    await step(() => updateParent.rerender());
    assert.deepEqual(names(), initial);
    if (scenario === 'uncontrolled') {
      await choose(['selected.txt']); assert.deepEqual(names(), ['selected.txt']);
      await step(() => updateParent.rerender()); assert.deepEqual(names(), ['selected.txt']);
      await choose(['dropped.txt'], true); assert.deepEqual(names(), ['dropped.txt']);
      await step(() => updateParent.rerender()); assert.deepEqual(names(), ['dropped.txt']);
      await remove('dropped.txt'); assert.deepEqual(names(), []);
      assert.deepEqual(calls, [['selected.txt'], ['dropped.txt'], []]);
    } else if (accepting) {
      await choose(['a.txt', 'b.txt', 'c.txt']); assert.deepEqual(names(), ['a.txt', 'b.txt']);
      await remove('a.txt'); assert.deepEqual(names(), ['b.txt']);
      await choose(['d.txt', 'e.txt'], true); assert.deepEqual(names(), ['b.txt', 'd.txt']);
      await step(() => updateParent.rerender()); assert.deepEqual(names(), ['b.txt', 'd.txt']);
      assert.deepEqual(calls, [['a.txt', 'b.txt'], ['b.txt'], ['b.txt', 'd.txt']]);
      assert.deepEqual(parentFiles, ['b.txt', 'd.txt']);
    } else if (controlled) {
      await choose(['requested.txt']); assert.deepEqual(names(), initial);
      await choose(['dropped.txt'], true); assert.deepEqual(names(), initial);
      if (initial.length) { await remove('kept.txt'); assert.deepEqual(names(), initial); }
      await step(() => updateParent.rerender()); assert.deepEqual(names(), initial);
      assert.deepEqual(parentFiles, initial);
      assert.deepEqual(calls, initial.length ? [['requested.txt'], ['dropped.txt'], []] : [['requested.txt'], ['dropped.txt']]);
    } else {
      await choose(['one.txt', 'two.txt']); assert.deepEqual(names(), ['one.txt']);
      await step(() => updateParent.props({ disabled: true }));
      assert.equal(document.querySelector('input').disabled, true);
      assert.equal(document.querySelector('.file-picker__dropzone').disabled, true);
      await choose(['blocked.txt']); await choose(['blocked-drop.txt'], true);
      assert.deepEqual(names(), ['one.txt']); assert.deepEqual(calls, [['one.txt']]);
      const disabledRemoval = document.querySelector('.file-picker__remove');
      assert.equal(disabledRemoval.disabled, true, 'Disabled selection must also disable removal');
      await step(() => disabledRemoval.click());
      assert.deepEqual(names(), ['one.txt']); assert.deepEqual(calls, [['one.txt']]);
      await step(() => updateParent.props({ disabled: false, multiple: true, maxFiles: 2 }));
      await choose(['two.txt', 'three.txt'], true); assert.deepEqual(names(), ['one.txt', 'two.txt']);
      await step(() => updateParent.props({ maxFiles: 0 }));
      await choose(['ignored.txt']); assert.deepEqual(names(), ['one.txt', 'two.txt']);
      assert.deepEqual(calls, [['one.txt'], ['one.txt', 'two.txt']]);
    }
    if (controlled) {
      const actionCount = calls.length;
      const priorFiles = [...names()];
      await step(() => updateParent.props({ disabled: true }));
      const disabledRemoval = document.querySelector('.file-picker__remove');
      if (disabledRemoval) {
        assert.equal(disabledRemoval.disabled, true, 'Controlled removal must be disabled too');
        await step(() => disabledRemoval.click());
      }
      assert.deepEqual(names(), priorFiles); assert.equal(calls.length, actionCount);
      await step(() => updateParent.files(['replacement.txt'])); assert.deepEqual(names(), ['replacement.txt']);
      await step(() => updateParent.files([])); assert.deepEqual(names(), []);
      assert.equal(calls.length, actionCount, 'Parent updates must not notify as user actions');
    }
  } else {
    const stored = new Map();
    const reads = [], writes = [];
    let denial;
    Object.defineProperty(dom.window, 'localStorage', {
      configurable: true,
      get() {
        if (denial === 'getter') throw new Error('Storage getter denied');
        if (denial === 'missing') return undefined;
        return {
          getItem(key) { reads.push(key); if (denial === 'read') throw new Error('Read denied'); return stored.get(key) ?? null; },
          setItem(key, value) { if (denial === 'write') throw new Error('Write denied'); writes.push([key, value]); stored.set(key, value); },
        };
      },
    });
    let direction = isSplit ? 'horizontal' : 'right';
    let currentProps = {};
    const styleKey = () => isSplit ? '--split-pane-percent' :
      ['left', 'right'].includes(direction) ? '--resizable-panel-width' : '--resizable-panel-height';
    readSize = () => Number.parseFloat(container.querySelector(isSplit ? '.split-pane' : '.resizable-panel')?.style.getPropertyValue(styleKey()) ?? '');
    function Parent() {
      const [props, setProps] = useState(currentProps);
      const [tick, setTick] = useState(0);
      updateParent = {
        props: next => setProps(current => ({ ...current, ...next })),
        rerender: () => setTick(value => value + 1),
      };
      return h('div', { 'data-tick': tick }, h(library[component], {
        ...baseProps, ...props, [isSplit ? 'onSplitPercentChange' : 'onSizeChange']: value => calls.push(value),
      }));
    }
    async function mount(props = {}) {
      currentProps = props;
      await step(() => root.render(wrap(h(Parent))));
    }
    async function remount(props = {}) {
      await step(() => root.unmount());
      root = createRoot(container, rootOptions);
      await mount(props);
    }
    async function resize(target) {
      const before = readSize();
      const horizontal = isSplit ? direction === 'horizontal' : ['left', 'right'].includes(direction);
      const handle = container.querySelector(isSplit ? '.split-pane__handle' : '.resizable-panel__handle');
      if (isSplit) container.querySelector('.split-pane').getBoundingClientRect = () => ({
        left: 0, top: 0, width: 1000, height: 500, right: 1000, bottom: 500,
      });
      const down = isSplit ? before * (horizontal ? 10 : 5) : 100;
      const move = isSplit ? target * (horizontal ? 10 : 5) :
        down + (target - before) * (['left', 'top'].includes(direction) ? -1 : 1);
      const point = value => ({ bubbles: true, cancelable: true, clientX: horizontal ? value : 0, clientY: horizontal ? 0 : value });
      await step(() => handle.dispatchEvent(new dom.window.MouseEvent('pointerdown', point(down))));
      await step(() => document.dispatchEvent(new dom.window.MouseEvent('pointermove', point(move))));
      await step(() => document.dispatchEvent(new dom.window.MouseEvent('pointerup', point(move))));
    }
    const key = storagePrefix + 'saved';
    if (scenario === 'hydration') {
      await step(() => root.unmount());
      container.innerHTML = serverHtml;
      stored.set(key, String(savedSize));
      currentProps = { persistKey: 'saved' };
      await step(() => {
        root = hydrateRoot(container, wrap(h(Parent)), rootOptions);
      });
      assert.equal(observedSizes[0], defaultSize, 'First client commit must match server default');
      assert.equal(readSize(), savedSize);
      assert.deepEqual(writes, []);
      assert.deepEqual(calls, []);
      await step(() => updateParent.rerender()); assert.equal(readSize(), savedSize);
    } else if (scenario === 'stored-values') {
      const cases = [[null, defaultSize], ['', defaultSize], ['  ', defaultSize], ['invalid', defaultSize],
        ['12px', defaultSize], ['NaN', defaultSize], ['Infinity', defaultSize], ['-Infinity', defaultSize],
        ['1e309', defaultSize], ['-100', min], ['99999', max], [String(savedSize), savedSize]];
      for (const [value, expected] of cases) {
        if (value === null) stored.delete(key); else stored.set(key, value);
        await remount({ persistKey: 'saved' });
        assert.equal(readSize(), expected, 'Saved value ' + value);
        assert.deepEqual(writes, []); assert.deepEqual(calls, []);
      }
    } else if (scenario === 'storage-failures') {
      for (denial of ['getter', 'read', 'write', 'missing']) {
        stored.set(key, String(savedSize));
        await remount({ persistKey: 'saved' });
        assert.equal(readSize(), denial === 'write' ? savedSize : defaultSize);
        const oldCalls = calls.length;
        await resize(changedSize); assert.equal(readSize(), changedSize);
        assert.equal(calls.length - oldCalls, isSplit ? 2 : 1);
      }
    } else if (scenario === 'persistence') {
      stored.set(key, String(savedSize));
      await mount({ persistKey: 'saved' }); assert.equal(readSize(), savedSize);
      assert.deepEqual(writes, []); assert.deepEqual(calls, []);
      await resize(changedSize); assert.equal(readSize(), changedSize);
      assert.equal(stored.get(key), String(changedSize));
      assert.equal(calls.length, isSplit ? 2 : 1);
      assert.equal(writes.length, isSplit ? 2 : 1);
      const writesAfterResize = [...writes], callsAfterResize = [...calls];
      await step(() => updateParent.rerender()); assert.equal(readSize(), changedSize);
      await remount({ persistKey: 'saved' }); assert.equal(readSize(), changedSize);
      assert.deepEqual(writes, writesAfterResize); assert.deepEqual(calls, callsAfterResize);
    } else if (scenario === 'keys-controlled') {
      stored.set(key, String(savedSize));
      await mount({ persistKey: 'saved', [controlledProp]: defaultSize });
      assert.equal(readSize(), defaultSize); assert.deepEqual(reads, []); assert.deepEqual(writes, []);
      await step(() => updateParent.props({ [controlledProp]: changedSize }));
      assert.equal(readSize(), changedSize); assert.deepEqual(calls, []);
      await remount({ persistKey: 'saved' }); assert.equal(readSize(), savedSize);
      await resize(changedSize);
      const nextKey = storagePrefix + 'next';
      stored.set(nextKey, String(min));
      const count = writes.length, notifications = calls.length;
      await step(() => updateParent.props({ persistKey: 'next' }));
      assert.equal(readSize(), min); assert.equal(stored.get(nextKey), String(min));
      assert.equal(writes.length, count); assert.equal(calls.length, notifications);
      await step(() => updateParent.rerender()); assert.equal(readSize(), min);
      await step(() => updateParent.props({ persistKey: 'missing-key' }));
      assert.equal(readSize(), defaultSize); assert.equal(writes.length, count);
    } else if (scenario === 'directions') {
      for (direction of isSplit ? ['horizontal', 'vertical'] : ['left', 'right', 'top', 'bottom']) {
        await remount({ [isSplit ? 'orientation' : 'direction']: direction });
        await resize(changedSize); assert.equal(readSize(), changedSize);
        await resize(99999); assert.equal(readSize(), max);
        await resize(-99999); assert.equal(readSize(), min);
        const count = calls.length;
        await step(() => updateParent.props({ resizable: false }));
        if (isSplit) {
          assert.equal(container.querySelector('.split-pane__handle').disabled, true);
          await resize(changedSize); assert.equal(readSize(), min);
        } else assert.equal(container.querySelector('.resizable-panel__handle'), null);
        assert.equal(calls.length, count);
      }
    }
  }
  await step(() => root.unmount());
  dom.window.close();
  process.stdout.write(JSON.stringify({ passed: true, kind, mode, scenario, component, commits, warnings, observedSizes,
    react: React.version, reactDom: require('react-dom/package.json').version, libraryPath }) + '\n');
} catch (error) { fail(error); }
