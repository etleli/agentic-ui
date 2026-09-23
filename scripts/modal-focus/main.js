/* global document, window, URLSearchParams */
import React, { createElement as h, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { DatePicker, Modal } from '@etleli/agentic-ui';
import '@etleli/agentic-ui/style.css';

const options = JSON.parse(new URLSearchParams(window.location.search).get('options') ?? '{}');
const api = { requests: [], focusLog: [], ready: false };
window.modalTest = api;
document.addEventListener('focusin', (event) => api.focusLog.push(event.target.id || event.target.getAttribute('aria-label') || event.target.textContent));
function App() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(true);
  const [nested, setNested] = useState(false);
  const [cycle, setCycle] = useState(0);
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
    options.picker ? h(DatePicker, { ariaLabel: 'Child date picker', value: '2026-09-15', showTodayButton: false }) : null,
    options.radios ? h(React.Fragment, {}, h('input', { id: 'radio-a', type: 'radio', name: 'choice' }), h('input', { id: 'radio-b', type: 'radio', name: 'choice', defaultChecked: true })) : null,
    h('button', { id: 'hidden', style: { display: 'none' } }, 'Hidden'),
    h('fieldset', { disabled: true }, h('input', { id: 'fieldset-disabled' })),
    options.nested ? h(React.Fragment, {},
      h('button', { id: 'nested-opener', onClick: () => setNested(true) }, 'Open nested'),
      h(Modal, { open: nested, title: 'Nested Modal', onOpenChange: setNested }, h('input', { id: 'nested-field' }))) : null);
  const modal = mounted && (options.uncontrolled ? open : true) ? h(Modal, {
    key: options.uncontrolled ? cycle : 'controlled',
    ...(options.uncontrolled ? { defaultOpen: true } : { open }),
    title: 'Focus Modal', presentation: options.presentation ?? 'viewport',
    className: options.noTargets ? 'no-targets' : options.single ? 'single-target' : undefined,
    confirmDisabled: options.confirmDisabled,
    onOpenChange: (value) => { api.requests.push(value); if (!options.decline && !options.uncontrolled) setOpen(value); },
    onCancel: () => api.requests.push('cancel'), onConfirm: () => api.requests.push('confirm'),
  }, body) : null;
  return options.outerPortal ? createPortal(modal, document.getElementById('portal-host')) : modal;
}
createRoot(document.getElementById('root')).render(options.strict ? h(React.StrictMode, {}, h(App)) : h(App));
