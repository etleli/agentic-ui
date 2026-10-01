import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { Modal, Drawer, Popover, Tooltip, UserCard, DatePicker, TimePicker, Dropdown, ContextMenu, Toast } from '@etleli/agentic-ui';
import { HydrationFixture } from './hydration.js';
assert.equal(typeof document, 'undefined');
const elements = [h(Modal, { defaultOpen: true }, 'Body'), h(Drawer, { defaultOpen: true }), h(Popover, { defaultOpen: true }, 'Popover'),
  h(Tooltip, { defaultOpen: true, content: 'Tooltip' }, h('button', {}, 'Hint')), h(UserCard, { defaultOpen: true, user: { name: 'Example' } }),
  h(DatePicker), h(TimePicker), h(Dropdown, { options: [] }), h(ContextMenu, { defaultOpen: true, items: [] }), h(Toast, { defaultVisible: true, title: 'Notice' })];
for (const element of elements) assert.equal(typeof renderToString(element), 'string');
const contained = renderToString(h(HydrationFixture));
assert.match(contained, /Hydration owner/);
writeFileSync('ssr.json', JSON.stringify({ contained }));
console.log('Plain Node SSR passed for all ten portal consumers and contained owner.');
