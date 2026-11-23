import assert from 'node:assert/strict';
import { writeFileSync } from 'node:fs';
import { createElement as h } from 'react';
import { renderToString } from 'react-dom/server';
import { Modal } from '@etleli/agentic-ui';

assert.equal(typeof document, 'undefined');
const body = h('input', { id: 'field', 'aria-label': 'Modal field' });
const contained = renderToString(h(Modal, { defaultOpen: true, presentation: 'contained', title: 'Focus Modal' }, body));
assert.match(contained, /role="dialog"/);
assert.equal(renderToString(h(Modal, { defaultOpen: true, presentation: 'viewport' }, body)), '');
assert.equal(renderToString(h(Modal, { open: false, presentation: 'contained' }, body)), '');
writeFileSync('ssr-output.json', JSON.stringify({ contained }));
console.log('Modal plain-Node SSR passed for open/closed and both presentations.');
