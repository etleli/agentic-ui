import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import test from 'node:test';
import { pathToFileURL } from 'node:url';
import { JSDOM } from 'jsdom';
import { act, createElement } from 'react';
import { createRoot } from 'react-dom/client';

const libraryRoot = resolve(process.cwd(), 'dist-library');
const library = await import(pathToFileURL(resolve(libraryRoot, 'agentic-ui.js')).href);

const publicGraphHelpers = [
  'createNodeCanvasInteractionController',
  'getNodeCanvasAutoScrollDelta',
  'getNodeCanvasEndlessOrigin',
  'getNodeCanvasEndlessPlane',
  'getNodeCanvasFitView',
  'getNodeCanvasLogicalPoint',
  'getNodeCanvasRenderedNodes',
  'getNodeMiniMapProjection',
  'getNodePaletteDragPayload',
  'getNodePaletteDropRequest',
  'setNodePaletteDragData',
];

async function withDom(render) {
  const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', { url: 'http://localhost/' });
  Object.defineProperty(dom.window, 'matchMedia', {
    value: () => ({
      addEventListener: () => {},
      addListener: () => {},
      matches: true,
      media: '',
      removeEventListener: () => {},
      removeListener: () => {},
    }),
  });
  const priorDescriptors = new Map();
  const globals = {
    Event: dom.window.Event,
    HTMLButtonElement: dom.window.HTMLButtonElement,
    HTMLElement: dom.window.HTMLElement,
    HTMLInputElement: dom.window.HTMLInputElement,
    KeyboardEvent: dom.window.KeyboardEvent,
    MouseEvent: dom.window.MouseEvent,
    Node: dom.window.Node,
    document: dom.window.document,
    navigator: dom.window.navigator,
    window: dom.window,
  };

  for (const [key, value] of Object.entries(globals)) {
    priorDescriptors.set(key, Object.getOwnPropertyDescriptor(globalThis, key));
    Object.defineProperty(globalThis, key, { configurable: true, value, writable: true });
  }
  priorDescriptors.set('requestAnimationFrame', Object.getOwnPropertyDescriptor(globalThis, 'requestAnimationFrame'));
  priorDescriptors.set('cancelAnimationFrame', Object.getOwnPropertyDescriptor(globalThis, 'cancelAnimationFrame'));
  priorDescriptors.set('IS_REACT_ACT_ENVIRONMENT', Object.getOwnPropertyDescriptor(globalThis, 'IS_REACT_ACT_ENVIRONMENT'));
  globalThis.requestAnimationFrame = (callback) => {
    callback(0);
    return 0;
  };
  globalThis.cancelAnimationFrame = () => {};
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;

  const root = createRoot(dom.window.document.getElementById('root'));
  try {
    await render({ document: dom.window.document, root, window: dom.window });
  } finally {
    await act(async () => root.unmount());
    for (const [key, descriptor] of priorDescriptors) {
      if (descriptor === undefined) delete globalThis[key];
      else Object.defineProperty(globalThis, key, descriptor);
    }
    dom.window.close();
  }
}

test('the built package root exposes graph helpers that a separate consumer can apply directly', () => {
  for (const helper of publicGraphHelpers) {
    assert.equal(typeof library[helper], 'function', `${helper} must be a public package export.`);
  }

  const logicalNodes = [
    { height: 60, id: 'entry', width: 120, x: -140, y: 30 },
    { height: 80, id: 'exit', width: 140, x: 160, y: -80 },
  ];
  const origin = library.getNodeCanvasEndlessOrigin(logicalNodes, { padding: 32 });
  const renderedNodes = library.getNodeCanvasRenderedNodes(logicalNodes, origin);
  const logicalPoint = library.getNodeCanvasLogicalPoint({ x: renderedNodes[0].x, y: renderedNodes[0].y }, origin);
  const fit = library.getNodeCanvasFitView(logicalNodes, { height: 320, scrollX: 248, scrollY: 112, width: 640 }, { origin, padding: 24 });

  assert.deepEqual(logicalPoint, { x: -140, y: 30 });
  assert.equal(fit.scrollX, 0);
  assert.equal(fit.scrollY, 0);
  assert.ok(Number.isFinite(fit.offsetX) && Number.isFinite(fit.offsetY) && fit.zoom > 0);

  const miniMap = library.getNodeMiniMapProjection(logicalNodes, { height: 100, width: 180, x: -60, y: -20 }, { padding: 12 });
  assert.ok(miniMap.canvasWidth > 0 && miniMap.canvasHeight > 0);
  assert.ok(miniMap.nodes.every((node) => node.x >= 0 && node.y >= 0));
  assert.ok(miniMap.viewport.x >= 0 && miniMap.viewport.y >= 0);
});

test('fit view and minimap projection cover empty, single-node, large, and scrolled graph states', () => {
  const emptyFit = library.getNodeCanvasFitView([], { height: 240, scrollX: 400, scrollY: 220, width: 320 }, { maxZoom: 2, minZoom: 0.5, padding: 32 });
  assert.deepEqual(emptyFit.bounds, { height: 0, width: 0, x: 0, y: 0 });
  assert.equal(emptyFit.scrollX, 0);
  assert.equal(emptyFit.scrollY, 0);

  const singleNode = [{ height: 80, id: 'single', width: 120, x: -60, y: -40 }];
  const origin = library.getNodeCanvasEndlessOrigin(singleNode, { padding: 24 });
  const singleFit = library.getNodeCanvasFitView(singleNode, { height: 300, scrollX: 96, scrollY: 72, width: 500 }, { maxZoom: 1, minZoom: 0.25, origin, padding: 24 });
  assert.equal(singleFit.scrollX, 0);
  assert.equal(singleFit.scrollY, 0);
  assert.ok(singleFit.offsetX < 250 && singleFit.offsetY < 150, 'The rendered-origin offset must be applied directly without preserving stale scroll.');

  const largeFit = library.getNodeCanvasFitView([{ height: 2000, id: 'large', width: 3000, x: -1000, y: -800 }], { height: 300, width: 480 }, { minZoom: 0.1, padding: 20 });
  assert.ok(largeFit.zoom < 1, 'Graphs larger than the viewport must fit down.');

  const emptyProjection = library.getNodeMiniMapProjection([], undefined, { padding: 16 });
  assert.deepEqual(emptyProjection.nodes, []);
  assert.equal(emptyProjection.canvasWidth, 32, 'Empty graphs retain only the requested minimap padding, never a synthetic endless plane.');
  assert.equal(emptyProjection.canvasHeight, 32, 'Empty graphs retain only the requested minimap padding, never a synthetic endless plane.');

  const singleProjection = library.getNodeMiniMapProjection(singleNode, { height: 50, width: 100, x: -80, y: -60 }, { padding: 16 });
  assert.equal(singleProjection.nodes.length, 1);
  assert.ok(singleProjection.nodes[0].x >= 16 && singleProjection.nodes[0].y >= 16);
  assert.ok(singleProjection.viewport.x >= 0 && singleProjection.viewport.y >= 0);
});

test('the built graph interaction and palette transport contracts are consumer-owned and fail closed', () => {
  const calls = [];
  const controller = library.createNodeCanvasInteractionController({
    canConnect: (_source, target) => target.portId !== 'blocked',
    getCompatibleTargets: () => ['accept'],
    onConnect: (source, target) => calls.push({ source, target }),
    onPaste: (request) => calls.push(request),
  });
  const source = { nodeId: 'source', portId: 'out', x: 0, y: 0 };

  controller.beginConnection(source);
  assert.deepEqual(controller.getState().connection.compatibleTargetIds, ['accept']);
  assert.equal(controller.completeConnection({ nodeId: 'target', portId: 'blocked', x: 40, y: 0 }), false);
  assert.equal(calls.length, 0);
  assert.equal(controller.completeConnection({ nodeId: 'target', portId: 'accept', x: 40, y: 0 }), true);
  assert.equal(calls.length, 1);

  controller.copy({ templateId: 'signal' });
  const paste = controller.paste({ x: -24, y: 64 });
  assert.deepEqual(paste, { payload: { templateId: 'signal' }, position: { x: -24, y: 64 } });

  const payload = library.getNodePaletteDragPayload({ id: 'signal', label: 'Signal' });
  const request = library.getNodePaletteDropRequest(
    { clientX: 280, clientY: 190, dataTransfer: { getData: () => JSON.stringify(payload) } },
    [{ id: 'signal', label: 'Signal' }],
    { left: 100, offsetX: 20, offsetY: 10, scrollX: 40, scrollY: 30, top: 50, zoom: 2 },
  );

  assert.deepEqual(request?.position, { x: 100, y: 80 });
  assert.equal(library.getNodePaletteDropRequest(
    { clientX: 0, clientY: 0, dataTransfer: { getData: () => JSON.stringify(payload) } },
    [{ disabled: true, id: 'signal', label: 'Signal' }],
    { left: 0, top: 0 },
  ), undefined);
});

test('graph interaction controller preserves multi-node drag, reconnection, cancellation, pointer capture, and auto-scroll mechanics', () => {
  const captures = [];
  const moves = [];
  const reconnects = [];
  const deletes = [];
  const controller = library.createNodeCanvasInteractionController({
    onDelete: (ids) => deletes.push(ids),
    onMoveNodes: (nodes, delta) => moves.push({ delta, nodes }),
    onPointerCaptureChange: (pointerId) => captures.push(pointerId),
    onReconnect: (edgeId, source, target) => reconnects.push({ edgeId, source, target }),
  });
  const nodes = [
    { height: 40, id: 'a', width: 80, x: -10, y: 20 },
    { height: 40, id: 'b', width: 80, x: 120, y: 30 },
    { height: 40, id: 'c', width: 80, x: 260, y: 40 },
  ];

  controller.beginNodeDrag(nodes, ['a', 'b'], 'a', { pointerId: 7, x: 10, y: 10, zoom: 2 });
  const moved = controller.moveNodeDrag(nodes, { pointerId: 7, scrollX: 20, x: 70, y: 30, zoom: 2 });
  assert.deepEqual(moved.map((node) => [node.id, node.x, node.y]), [['a', 30, 30], ['b', 160, 40], ['c', 260, 40]]);
  assert.deepEqual(moves[0].delta, { x: 40, y: 10 });
  assert.equal(controller.consumeClickSuppression(), true);
  assert.equal(controller.consumeClickSuppression(), false);
  controller.endNodeDrag();
  assert.deepEqual(captures, [7, undefined]);

  controller.beginConnection({ nodeId: 'a', portId: 'out', x: 0, y: 0 }, { reconnectEdgeId: 'edge-1' });
  assert.equal(controller.completeConnection({ nodeId: 'b', portId: 'in', x: 100, y: 0 }), true);
  assert.equal(reconnects[0].edgeId, 'edge-1');
  controller.beginConnection({ nodeId: 'a', portId: 'out', x: 0, y: 0 });
  controller.cancelConnection();
  assert.equal(controller.getState().connection, undefined);
  controller.delete(['a', 'b']);
  assert.deepEqual(deletes, [['a', 'b']]);

  assert.deepEqual(library.getNodeCanvasAutoScrollDelta({ x: 2, y: 198 }, { height: 200, width: 300 }, { edgeMargin: 20, maxSpeed: 10 }), { x: -9, y: 9 });
});

test('generated declarations expose the public consumer surface', async () => {
  const declarations = await readFile(resolve(libraryRoot, 'types', 'index.d.ts'), 'utf8');

  for (const symbol of publicGraphHelpers) {
    assert.match(declarations, new RegExp(`\\b${symbol}\\b`), `${symbol} must be included in generated declarations.`);
  }

  for (const typeName of ['NodeCanvasFitViewResult', 'NodeMiniMapProjection', 'NodePaletteDropRequest', 'UnavailableActionProps']) {
    assert.match(declarations, new RegExp(`\\b${typeName}\\b`), `${typeName} must be included in generated declarations.`);
  }
});

test('rendered unavailable actions and ContextMenu preserve accessible mouse and keyboard safety', async () => {
  await withDom(async ({ document, root, window }) => {
    const unavailableSources = [];
    let protectedButtonCalls = 0;

    await act(async () => root.render(createElement(library.Button, {
      disabled: true,
      onClick: () => { protectedButtonCalls += 1; },
      onUnavailable: (source) => unavailableSources.push(source),
      unavailableReason: 'A workspace must be selected first.',
    }, 'Deploy')));

    const unavailableButton = document.querySelector('button');
    assert.equal(unavailableButton.getAttribute('aria-disabled'), 'true');
    assert.ok(unavailableButton.getAttribute('aria-describedby'));
    await act(async () => unavailableButton.focus());
    await act(async () => unavailableButton.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: 'Enter' })));
    await act(async () => unavailableButton.dispatchEvent(new window.MouseEvent('click', { bubbles: true })));
    assert.deepEqual(unavailableSources, ['keyboard', 'pointer']);
    assert.equal(protectedButtonCalls, 0);

    const selected = [];
    const unavailable = [];
    await act(async () => root.render(createElement(library.ContextMenu, {
      items: [
        { id: 'heading', kind: 'heading', label: 'Actions' },
        { id: 'open', label: 'Open' },
        { id: 'blocked', label: 'Blocked', unavailableReason: 'You need permission.' },
        { disabled: true, id: 'native-disabled', label: 'Native disabled' },
        { id: 'divider', kind: 'separator' },
        { id: 'delete', label: 'Delete', tone: 'danger' },
      ],
      onSelect: (item) => selected.push(item.id),
      onUnavailable: (item) => unavailable.push(item.id),
      triggerLabel: 'Node actions',
    })));

    const trigger = document.querySelector('.context-menu__trigger');
    await act(async () => trigger.dispatchEvent(new window.MouseEvent('click', { bubbles: true })));
    const menu = document.querySelector('[role="menu"]');
    const actionItems = [...menu.querySelectorAll('[role="menuitem"]')];
    assert.equal(actionItems.length, 4, 'Headings and separators must not become action items.');
    assert.equal(actionItems[1].getAttribute('aria-disabled'), 'true');
    assert.equal(actionItems[2].disabled, true);

    actionItems[0].focus();
    await act(async () => menu.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: 'ArrowDown' })));
    assert.equal(document.activeElement, actionItems[1]);
    await act(async () => menu.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: 'End' })));
    assert.equal(document.activeElement, actionItems[3], 'End skips native-disabled items while retaining unavailable actions in traversal.');
    await act(async () => menu.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: 'Home' })));
    assert.equal(document.activeElement, actionItems[0]);
    actionItems[1].focus();
    await act(async () => menu.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: 'Enter' })));
    await act(async () => menu.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: ' ' })));
    assert.deepEqual(unavailable, ['blocked', 'blocked']);
    assert.deepEqual(selected, []);
    await act(async () => menu.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: 'Escape' })));
    await new Promise((resolve) => setTimeout(resolve, 0));
    assert.equal(document.activeElement, trigger, 'Closing a menu must restore focus to its trigger.');

    const placementRequests = [];
    const unavailableTemplates = [];
    await act(async () => root.render(createElement(library.NodePalette, {
      onTemplatePlacementRequest: (request) => placementRequests.push(request),
      onTemplateUnavailable: (template) => unavailableTemplates.push(template.id),
      selectedTemplateId: 'signal',
      templates: [
        { id: 'signal', label: 'Signal' },
        { id: 'blocked', label: 'Blocked', unavailableReason: 'The graph is locked.' },
      ],
    })));

    const palette = document.querySelector('.node-system-palette');
    const draggableTemplate = document.querySelector('[draggable="true"]');
    assert.match(draggableTemplate.getAttribute('aria-label'), /Drag Signal/);
    await act(async () => palette.dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: 'Enter' })));
    assert.deepEqual(placementRequests.map((request) => request.source), ['keyboard']);

    await act(async () => root.render(createElement(library.NodePalette, {
      onTemplateUnavailable: (template) => unavailableTemplates.push(template.id),
      selectedTemplateId: 'blocked',
      templates: [{ id: 'blocked', label: 'Blocked', unavailableReason: 'The graph is locked.' }],
    })));
    const unavailableTemplate = document.querySelector('[data-unavailable="true"]');
    assert.match(unavailableTemplate.getAttribute('aria-label'), /Unavailable: The graph is locked/);
    await act(async () => document.querySelector('.node-system-palette').dispatchEvent(new window.KeyboardEvent('keydown', { bubbles: true, key: ' ' })));
    assert.deepEqual(unavailableTemplates, ['blocked']);
  });
});
