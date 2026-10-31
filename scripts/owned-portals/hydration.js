import { createElement as h, useEffect } from 'react';
import { Modal, DatePicker } from '@etleli/agentic-ui';
export function HydrationFixture({ onReady, onOpenChange }) {
  useEffect(() => { onReady?.(); }, [onReady]);
  return h(Modal, { defaultOpen: true, presentation: 'contained', title: 'Hydration owner', onOpenChange },
    h(DatePicker, { ariaLabel: 'Hydrated Date', value: '2026-09-15', showTodayButton: false }));
}
