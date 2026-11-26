import { useState } from 'react';
import { CalendarTimeGrid } from './CalendarTimeGrid';
import type { CalendarTimeGridEvent, CalendarTimeGridProps } from './CalendarTimeGrid.types';

const events: CalendarTimeGridEvent[] = [
  { id: 'room', kind: 'all-day', date: '2026-11-25', title: 'Room reserved' },
  { id: 'list', kind: 'reminder', date: '2026-11-25', title: 'Finalize supply list', color: 'var(--color-warning)' },
  { id: 'briefing', kind: 'timed', start: '2026-11-25T09:00', end: '2026-11-25T10:30', title: 'Team briefing' },
  { id: 'sound', kind: 'timed', start: '2026-11-25T09:30', end: '2026-11-25T11:00', title: 'Sound check', color: 'var(--color-positive)' },
  { id: 'workshop', kind: 'timed', start: '2026-11-27T10:00', end: '2026-11-27T12:00', title: 'Open workshop' },
];

type CalendarTimeGridExampleProps = Pick<CalendarTimeGridProps, 'view' | 'locale' | 'weekStartsOn' | 'hourHeight'> & { selectable: boolean };

export function CalendarTimeGridExample({ selectable, ...props }: CalendarTimeGridExampleProps) {
  const [date, setDate] = useState('2026-11-25');
  const [selected, setSelected] = useState<string>();
  return <div className="workspace-examples__stack">
    <CalendarTimeGrid {...props} date={date} events={events} onDateChange={setDate} onEventSelect={selectable ? (event) => setSelected(event.title) : undefined} />
    {selectable ? <p role="status">{selected ? `Selected: ${selected}` : 'Select an event for its name.'}</p> : null}
  </div>;
}
