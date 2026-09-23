/* global document, window, URLSearchParams */
import React, { createElement as h, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { DatePicker, Modal } from '@etleli/agentic-ui';
import '@etleli/agentic-ui/style.css';

const options = JSON.parse(new URLSearchParams(window.location.search).get('options') ?? '{}');
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
document.addEventListener('focusin', (event) => {
  api.focusLog.push(event.target.id || event.target.getAttribute('aria-label') || event.target.textContent);
  api.focusTrace.push({ id: event.target.getAttribute('id'), label: event.target.getAttribute('aria-label'), dialog: event.target.closest('[role="dialog"]')?.getAttribute('aria-label') });
});
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
    document.getElementById('opener').onclick = () => { setMounted(true); setCycle((n) => n + 1); setOpen(true); };
    api.ready = true;
  }, []);
  const body = h(React.Fragment, {},
    h('input', { id: 'field', 'aria-label': 'Modal field', autoFocus: options.autoFocus, disabled: options.disabledField, tabIndex: options.positive ? 2 : undefined }),
    options.long ? h('div', { style: { height: 1500 } }, 'Synthetic long modal content') : null,
    options.single ? null : h('button', { id: 'inside', tabIndex: options.positive ? 1 : undefined }, 'Inside'),
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
    onOpenChange: (value) => { api.requests.push(value); if (!options.decline && !options.uncontrolled) setOpen(value); },
    onCancel: () => api.requests.push('cancel'), onConfirm: () => api.requests.push('confirm'),
  }, body) : null;
  return h(React.Fragment, {}, options.outerPortal ? createPortal(modal, document.getElementById('portal-host')) : modal,
    h(Modal, { open: independent, title: 'Independent Modal', onOpenChange: setIndependent }, h('input', { 'aria-label': 'Independent field' })));
}
createRoot(document.getElementById('root')).render(options.strict ? h(React.StrictMode, {}, h(App)) : h(App));
