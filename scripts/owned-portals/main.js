/* global window, document, location, URLSearchParams */
import React, { createElement as h, useEffect, useState } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { DatePicker, TimePicker, Popover, Tooltip, Dropdown, ContextMenu, UserCard, Modal, Drawer, Toast } from '@etleli/agentic-ui';
import '@etleli/agentic-ui/style.css';
import { HydrationFixture } from './hydration.js';
import ssr from './ssr.json';

const options = JSON.parse(new URLSearchParams(location.search).get('options') ?? '{}');
const api = { ready: false, requests: [], actions: [], tabs: [] }; window.portalTest = api;
window.addEventListener('keydown', (event) => { if (event.key === 'Tab') api.tabs.push({ prevented: event.defaultPrevented }); });
function Widget() {
  switch (options.widget ?? 'date') {
    case 'date': return h(DatePicker, { ariaLabel: 'Probe Date', value: '2026-09-15', showTodayButton: false, onValueChange: (value) => api.actions.push(value) });
    case 'time': return h(TimePicker, { ariaLabel: 'Probe Time', value: '12:30', onValueChange: (value) => api.actions.push(value) });
    case 'popover': return h(Popover, { triggerLabel: 'Probe Popover', title: 'Probe popup', placement: 'bottom' }, h('input', { id: 'popover-input', 'aria-label': 'Popover input' }), h('button', { id: 'popover-action', onClick: () => api.actions.push('popover') }, 'Synthetic action'));
    case 'tooltip': return h(Tooltip, { content: options.tooltipText ?? 'Probe tooltip', placement: 'bottom', open: options.controlledTooltip ? true : undefined, onOpenChange: options.controlledTooltip ? (value) => api.requests.push(value) : undefined }, h('button', { id: 'tooltip-trigger' }, 'Hint'));
    case 'dropdown': return h(Dropdown, { ariaLabel: 'Probe Dropdown', options: [{ value: 'alpha', label: 'Alpha' }, { value: 'beta', label: 'Beta' }], onChange: (value) => api.actions.push(value) });
    case 'user': return h(UserCard, { user: { name: 'Example User', email: 'example@example.invalid' }, placement: 'bottom-start', onSettings: () => api.actions.push('settings'), onLogOut: () => api.actions.push('logout') });
    case 'menu': return h(ContextMenu, { triggerLabel: 'Probe Menu', items: [{ id: 'alpha', label: 'Alpha action' }, { id: 'beta', label: 'Beta action' }], onSelect: (item) => api.actions.push(item.id) }, h('span', {}, 'Synthetic target'));
    case 'modal': return h(Modal, { open: true, title: 'Standalone Modal', onOpenChange: (value) => api.requests.push(value) }, h('input', { 'aria-label': 'Standalone field' }));
    case 'drawer': return h(Drawer, { open: true, title: 'Standalone Drawer', onOpenChange: (value) => api.requests.push(value) }, h('input', { 'aria-label': 'Drawer field' }));
    case 'toast': return h(Toast, { visible: true, autoDismissMs: 0, items: [{ id: 'notice', title: 'Synthetic notice', actionLabel: 'Inspect', onAction: () => api.actions.push('toast') }], onDismiss: () => api.actions.push('dismiss') });
    default: throw new Error('Unknown fixture widget');
  }
}
function App() {
  const [open, setOpen] = useState(Boolean(options.initial)), [nested, setNested] = useState(false), [independent, setIndependent] = useState(false);
  api.setOpen = setOpen; api.setNested = setNested; api.setIndependent = setIndependent;
  useEffect(() => {
    document.getElementById('opener').onclick = () => setOpen(true); api.ready = true;
  }, []);
  const body = h('div', { className: 'fixtures' }, h(Widget), options.focus ? h(React.Fragment, {},
    h('input', { type: 'date', id: 'native-date', defaultValue: '2026-10-01' }), h('input', { type: 'time', id: 'native-time', defaultValue: '12:34' }), h('audio', { id: 'native-media', controls: true }),
    h('div', { id: 'native-scroll', className: 'native-scroll' }, h('div', {}, 'Synthetic scroll content')),
    h('div', { id: 'shadow', ref: (node) => { if (node && !node.shadowRoot) node.attachShadow({ mode: 'open' }).innerHTML = '<button id="shadow-first">Shadow</button><slot></slot><input id="shadow-last">'; } }, h('button', { id: 'slotted' }, 'Slotted'))) : null,
    options.nested ? h(React.Fragment, {}, h('button', { id: 'nested-open', onClick: () => setNested(true) }, 'Nested'), h(Modal, { title: 'Nested owner', open: nested, onOpenChange: setNested }, h(DatePicker, { ariaLabel: 'Nested Date', value: '2026-09-15' }))) : null,
    options.unrelated ? createPortal(h('button', { id: 'unrelated' }, 'Unrelated'), document.body) : null);
  return options.standalone ? body : h(React.Fragment, {},
    h('div', { id: 'shell', 'data-transform': options.geometry === 'ancestor-transform' ? '' : undefined, 'data-nested': options.geometry === 'nested-positioned' ? '' : undefined, 'data-rotate': options.geometry === 'rotate' ? '' : undefined, 'data-skew': options.geometry === 'skew' ? '' : undefined, 'data-reflect': options.geometry === 'reflect' ? '' : undefined, 'data-perspective': options.geometry === 'perspective' ? '' : undefined },
      h('div', { id: 'host', tabIndex: options.focus ? 0 : undefined, 'data-scroll': options.geometry === 'scroll-host' ? '' : undefined, 'data-translate': options.geometry === 'translate' ? '' : undefined, 'data-gpu': options.geometry === 'gpu' ? '' : undefined, 'data-scale': options.geometry === 'scale' ? '' : undefined, 'data-theme': options.theme ? '' : undefined },
        options.geometry === 'scroll-host' ? h('div', { id: 'spacer' }) : null,
        h(Modal, { open, title: 'Owned parent', presentation: options.geometry?.startsWith('viewport') ? 'viewport' : 'contained', size: 'comfortable', onOpenChange: (value) => api.requests.push(value) }, body))),
    h(Modal, { title: 'Independent owner', open: independent, onOpenChange: setIndependent }, h(Popover, { triggerLabel: 'Independent Popover' }, 'Independent popup')));
}
if (options.hydrate) {
  const node = document.getElementById('app'); node.style.position = 'relative'; node.style.width = '700px'; node.style.height = '500px'; node.innerHTML = ssr.contained;
  const content = h(HydrationFixture, { onReady: () => { api.ready = true; }, onOpenChange: (value) => api.requests.push(value) });
  hydrateRoot(node, options.strict ? h(React.StrictMode, {}, content) : content);
} else createRoot(document.getElementById('app')).render(options.strict ? h(React.StrictMode, {}, h(App)) : h(App));
