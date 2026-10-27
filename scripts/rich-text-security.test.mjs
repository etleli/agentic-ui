import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
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

test('both library formats embed the patched sanitizer instead of a stale bundled copy', async () => {
  for (const format of ['agentic-ui.js', 'agentic-ui.cjs']) {
    const source = await readFile(new URL(`../dist-library/${format}`, import.meta.url), 'utf8');
    assert.match(source, /DOMPurify 3\.4\.17\b/);
    assert.doesNotMatch(source, /DOMPurify 3\.4\.(?:14|15|16)\b/);
  }
});

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

test('the sanitizer update preserves benign rich formatting and HTTPS links', () => {
  const markup = renderToStaticMarkup(createElement(RichTextViewer, {
    html: '<p><strong>Safe text</strong> <a href="https://example.test/docs">Documentation</a></p>',
    trusted: true,
  }));
  assert.match(markup, /<strong>Safe text<\/strong>/);
  assert.match(markup, /href="https:\/\/example\.test\/docs"/);
});
