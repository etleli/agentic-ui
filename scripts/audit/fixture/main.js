/* global window, document */
import React, { createElement as h, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { DataTable, DatePicker, DateRangePicker, Modal, Tooltip, getThemeGeneratedColor } from '@etleli/agentic-ui';
import '@etleli/agentic-ui/style.css';

const root = createRoot(document.getElementById('root'));
const rows = [{ id: 'alpha', cells: { name: 'Alpha' } }, { id: 'beta', cells: { name: 'Beta' } }];
const columns = [{ id: 'name', label: 'Name' }];
let revision = 0;
let configuration;
const api = { calls: [], getThemeGeneratedColor };
window.audit = api;
function Fixture({ options }) {
  const [selection, setSelection] = useState(options.control === 'index' ? 0 : 'alpha');
  const [date, setDate] = useState('2026-09-15');
  const [open, setOpen] = useState(false);
  api.setSelection = setSelection;
  api.setDate = setDate;
  const record = (value) => api.calls.push(value);
  if (options.kind === 'table') {
    const props = options.mode === 'uncontrolled' ? { defaultSelectedRowId: 'alpha' }
      : options.control === 'index' ? { selectedRowIndex: selection } : { selectedRowId: selection };
    return h(DataTable, { columns, rows, ...props, selectable: options.selectable ?? true,
      onSelectionChange: (id, _row, index) => { record({ id, index }); if (options.mode === 'accepting') setSelection(options.control === 'index' ? index : id); } });
  }
  if (options.kind === 'date') return h(DatePicker, {
    ...(options.mode === 'uncontrolled' ? {} : { value: date }), disabled: options.disabled, readOnly: options.readOnly,
    onValueChange: (value) => { record(value); if (options.mode === 'accepting') setDate(value); },
  });
  if (options.kind === 'range') return h(DateRangePicker, { min: options.min, max: options.max, disabled: options.disabled, onValueChange: record });
  if (options.kind === 'tooltip') return h('div', { style: { position: 'fixed', left: options.left, top: options.top } },
    h(Tooltip, { open: true, placement: options.placement, content: 'A long synthetic explanation that should remain inside the visible browser viewport.' }, h('button', {}, 'Target')));
  if (options.kind === 'modal') return h(React.Fragment, {},
    h('button', { id: 'opener', onClick: () => setOpen(true) }, 'Open diagnostic modal'),
    h('button', { id: 'background' }, 'Background action'),
    h(Modal, { open, title: 'Diagnostic modal', onOpenChange: (value) => { record(value); setOpen(value); } },
      h('input', { id: 'dialog-input', 'aria-label': 'Dialog value' })));
  return h('div', {}, 'Generated color helper diagnostic');
}
function render() {
  const view = h(Fixture, { key: revision, options: configuration });
  root.render(configuration.strict ? h(React.StrictMode, {}, view) : view);
}
api.mount = (options) => { configuration = options; revision += 1; api.calls = []; render(); };
api.rerender = render;
api.mount({ kind: 'table', mode: 'declining', control: 'id' });
