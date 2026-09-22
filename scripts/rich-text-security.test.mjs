import assert from 'node:assert/strict';
import test from 'node:test';

import { JSDOM } from 'jsdom';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

const dom = new JSDOM('<!doctype html><html><body></body></html>');

Object.assign(globalThis, {
  DocumentFragment: dom.window.DocumentFragment,
  Element: dom.window.Element,
  HTMLTemplateElement: dom.window.HTMLTemplateElement,
  Node: dom.window.Node,
  document: dom.window.document,
  window: dom.window,
});

const { RichTextViewer } = await import('../dist-library/agentic-ui.js');

const activeHtml = [
  '<img src="x" onerror="globalThis.exploited=true">',
  '<a href="javascript:globalThis.exploited=true">unsafe link</a>',
  '<script>globalThis.exploited=true</script>',
].join('');

test('RichTextViewer escapes HTML unless rich rendering is explicitly enabled', () => {
  const markup = renderToStaticMarkup(createElement(RichTextViewer, { html: activeHtml }));

  assert.doesNotMatch(markup, /<img\b/i);
  assert.doesNotMatch(markup, /<script\b/i);
  assert.match(markup, /&lt;img/);
});

test('RichTextViewer sanitizes explicitly enabled HTML without a bypass', () => {
  const markup = renderToStaticMarkup(createElement(RichTextViewer, { html: activeHtml, trusted: true }));

  assert.match(markup, /<img src="x">/i);
  assert.doesNotMatch(markup, /onerror/i);
  assert.doesNotMatch(markup, /javascript:/i);
  assert.doesNotMatch(markup, /<script\b/i);
});
