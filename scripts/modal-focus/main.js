/* global document, window, URLSearchParams */
import React, { createElement as h, useState, useEffect } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { DatePicker, Modal } from '@etleli/agentic-ui';
import '@etleli/agentic-ui/style.css';
import ssr from './ssr-output.json';

const options = JSON.parse(new URLSearchParams(window.location.search).get('options') ?? '{}');
if (options.shadowOpener) {
  const host = document.createElement('div'); host.id = 'shadow-opener-host';
  host.attachShadow({ mode: 'open' }).innerHTML = '<button id="opener">Open Modal</button>';
  document.getElementById('opener').replaceWith(host);
}
if (options.noPopupAnimation) {
  const style = document.createElement('style');
  style.textContent = '*{animation:none!important;transition:none!important}';
  document.head.append(style);
}
if (options.svgOpener) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  for (const [name, value] of Object.entries({ id: 'opener', role: 'button', 'aria-label': 'Open Modal', tabindex: '0', width: '120', height: '30' })) svg.setAttribute(name, value);
  svg.innerHTML = '<rect width="120" height="30" fill="gray" />';
  document.getElementById('opener').replaceWith(svg);
}
const api = { requests: [], focusLog: [], focusTrace: [], ready: false };
window.modalTest = api;
api.backgroundClicks = 0;
document.getElementById('background').onclick = () => { api.backgroundClicks++; };
const listeners = { focusin: new Set(), focusout: new Set() };
const addListener = document.addEventListener.bind(document);
const removeListener = document.removeEventListener.bind(document);
document.addEventListener = (type, listener, ...rest) => { listeners[type]?.add(listener); return addListener(type, listener, ...rest); };
document.removeEventListener = (type, listener, ...rest) => { listeners[type]?.delete(listener); return removeListener(type, listener, ...rest); };
api.listenerCount = () => listeners.focusin.size + listeners.focusout.size - api.fixtureListenerCount;
if (options.cleanup || options.unrelated) {
  const root = document.createElement('div'); root.id = 'agentic-ui-overlay-root'; root.className = 'overlay-root'; root.style.zIndex = '41'; document.body.appendChild(root);
}
if (options.cleanup) document.getElementById('after').setAttribute('inert', 'author');
api.tabEvents = [];
window.addEventListener('keydown', (event) => {
  if (event.key === 'Tab') api.tabEvents.push({ prevented: event.defaultPrevented });
});
document.addEventListener('focusin', (event) => {
  api.focusLog.push(event.target.id || event.target.getAttribute('aria-label') || event.target.textContent);
  api.focusTrace.push({ id: event.target.getAttribute('id'), label: event.target.getAttribute('aria-label'), dialog: event.target.closest('[role="dialog"]')?.getAttribute('aria-label') });
});
api.fixtureListenerCount = listeners.focusin.size + listeners.focusout.size;
function App() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [nested, setNested] = useState(Boolean(options.initialNested));
  const [cycle, setCycle] = useState(0);
  const [hiddenMode, setHiddenMode] = useState(options.hiddenMode ?? '');
  api.setHiddenMode = setHiddenMode;
  const [independent, setIndependent] = useState(false);
  api.setIndependent = setIndependent;
  api.setOpen = setOpen;
  api.unmount = () => setMounted(false);
  useEffect(() => {
    const opener = document.getElementById('opener') ?? document.getElementById('shadow-opener-host')?.shadowRoot.getElementById('opener');
    opener.onclick = () => { setMounted(true); setCycle((n) => n + 1); setOpen(true); };
    api.ready = true;
    if (options.presentation === 'contained' && options.outerPortal) document.getElementById('host-background').hidden = false;
    if (options.scopeReference) for (const id of ['opener', 'background', 'after', 'portal-host']) document.getElementById(id).inert = true;
  }, []);
  const body = h(React.Fragment, {},
    h('input', { id: 'field', 'aria-label': 'Modal field', autoFocus: options.autoFocus, disabled: options.disabledField, tabIndex: options.positive ? 2 : undefined }),
    options.long ? h('div', { style: { height: 1500 } }, 'Synthetic long modal content') : null,
    options.single ? null : h('button', { id: 'inside', tabIndex: options.positive ? 1 : undefined }, 'Inside'),
    options.compound ? options.compound === 'audio'
      ? h('audio', { id: 'compound', controls: true, 'aria-label': 'Synthetic audio' })
      : h('input', { id: 'compound', type: options.compound, 'aria-label': 'Native ' + options.compound, defaultValue: options.compound === 'date' ? '2026-10-01' : '12:34' }) : null,
    options.unrelated ? createPortal(h('button', { id: 'consumer-portal' }, 'Consumer portal'), document.getElementById('consumer-portal-host')) : null,
    options.scroller ? h('div', { id: 'scroll-pane', style: { overflow: options.scrollOverflow ?? 'auto', height: 60, width: 180 } },
      h('div', { style: { height: options.scrollFits ? 20 : 240 } }, 'Synthetic scroll content'),
      options.scrollChild ? h('button', { id: 'scroll-child', tabIndex: options.scrollChild === 'negative' ? -1 : undefined, disabled: options.scrollChild === 'disabled', hidden: options.scrollChild === 'hidden' }, 'Scroll child') : null) : null,
    options.shadow ? h('div', { id: 'shadow-host', tabIndex: options.shadowIndex, ref: (host) => {
      if (!host || host.shadowRoot) return;
      const shadow = host.attachShadow({ mode: 'open', delegatesFocus: Boolean(options.delegatesFocus) });
      shadow.innerHTML = `<button id="shadow-first" ${options.shadowPositive ? 'tabindex="2"' : ''}>Shadow first</button><slot></slot><input id="shadow-last" aria-label="Shadow last" ${options.shadowPositive ? 'tabindex="1"' : ''}>`;
    } }, h('button', { id: 'slotted' }, 'Slotted')) : null,
    options.svgTarget ? h('svg', { id: 'svg-target', tabIndex: 0, role: 'button', 'aria-label': 'Diagram target', width: 120, height: 30 }, h('rect', { width: 120, height: 30, fill: 'gray' })) : null,
    options.disclosure ? h('details', {}, h('summary', { id: 'summary' }, 'Disclosure'), h('button', { id: 'details-button' }, 'Detail action')) : null,
    options.editable ? h('div', { id: 'editable', contentEditable: true, suppressContentEditableWarning: true }, 'Editable text') : null,
    options.imageMap ? h(React.Fragment, {},
      h('img', { id: 'map-image', useMap: '#modal-map', alt: 'Synthetic map', width: 120, height: 40, hidden: options.hiddenMap, src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="40"><rect width="120" height="40" fill="gray"/></svg>' }),
      h('map', { name: 'modal-map' }, h('area', { id: 'map-area', shape: 'rect', coords: '0,0,120,40', href: '#synthetic-map', alt: 'Map link' }))) : null,
    options.picker ? h(DatePicker, { ariaLabel: 'Child date picker', value: '2026-09-15', showTodayButton: false }) : null,
    options.radios ? h(React.Fragment, {}, h('input', { id: 'radio-a', type: 'radio', name: 'choice' }), h('input', { id: 'radio-b', type: 'radio', name: 'choice', defaultChecked: true })) : null,
    h('button', { id: 'hidden', style: { display: 'none' } }, 'Hidden'),
    h('fieldset', { disabled: true }, h('input', { id: 'fieldset-disabled' })),
    options.nested || options.initialNested ? h(React.Fragment, {},
      h('button', { id: 'nested-opener', onClick: () => setNested(true) }, 'Open nested'),
      h(Modal, { open: nested, title: 'Nested Modal', onOpenChange: setNested }, h('input', { id: 'nested-field' }))) : null);
  const modal = mounted && (options.uncontrolled ? open : true) ? h(Modal, {
    key: options.uncontrolled ? cycle : 'controlled',
    ...(options.uncontrolled ? { defaultOpen: true } : { open }),
    title: 'Focus Modal', presentation: options.presentation ?? 'viewport',
    className: [options.noTargets ? 'no-targets' : options.single ? 'single-target' : '', hiddenMode === 'class' ? 'test-hidden-modal' : ''].filter(Boolean).join(' '),
    style: hiddenMode === 'display' ? { display: 'none' } : hiddenMode === 'visibility' ? { visibility: 'hidden' } : undefined,
    confirmDisabled: options.confirmDisabled,
    confirmUnavailableReason: options.unavailable ? 'Choose a synthetic resource first' : undefined,
    onConfirmUnavailable: (source) => api.requests.push('unavailable-' + source),
    onOpenChange: (value) => { api.requests.push(value); if (!options.decline && !options.uncontrolled) setOpen(value); },
    onCancel: () => api.requests.push('cancel'), onConfirm: () => api.requests.push('confirm'),
  }, body) : null;
  if (options.nativeOnly) return h(React.Fragment, {}, body, h('button', { id: 'native-end' }, 'Cancel'));
  if (options.scopeReference) return h('section', { role: 'dialog', tabIndex: -1, className: ['modal-overlay__dialog', options.noTargets ? 'no-targets' : options.single ? 'single-target' : ''].join(' ') },
    h('header', { className: 'modal-overlay__header' }, h('button', { className: 'modal-overlay__icon-button', 'aria-label': 'Close dialog' }, 'Close')),
    h('div', { className: 'modal-overlay__body' }, body),
    h('footer', { className: 'modal-overlay__footer' }, h('button', {}, 'Cancel'), h('button', {}, 'Confirm')));
  return h(React.Fragment, {}, options.presentation === 'contained' && !options.outerPortal ? h('button', { id: 'local-background' }, 'Host background') : null,
    options.outerPortal ? createPortal(modal, document.getElementById('portal-host')) : modal,
    options.unrelated ? createPortal(h('button', { id: 'unrelated-overlay' }, 'Unrelated overlay'), document.getElementById('agentic-ui-overlay-root')) : null,
    h(Modal, { open: independent, title: 'Independent Modal', onOpenChange: setIndependent }, h('input', { 'aria-label': 'Independent field' })));
}
function Hydrated() {
  useEffect(() => { api.ready = true; }, []);
  return h(Modal, { defaultOpen: true, presentation: 'contained', title: 'Focus Modal', onOpenChange: (value) => api.requests.push(value) }, h('input', { id: 'field', 'aria-label': 'Modal field' }));
}
if (options.hydrate) {
  document.getElementById('opener').focus();
  document.getElementById('root').innerHTML = ssr.contained;
  hydrateRoot(document.getElementById('root'), options.strict ? h(React.StrictMode, {}, h(Hydrated)) : h(Hydrated));
} else createRoot(document.getElementById('root')).render(options.strict ? h(React.StrictMode, {}, h(App)) : h(App));
