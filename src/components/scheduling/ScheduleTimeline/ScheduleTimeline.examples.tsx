import { useState } from 'react';
import { ScheduleTimeline } from './ScheduleTimeline';
import type { ScheduleTimelineGroup, ScheduleTimelineProps } from './ScheduleTimeline.types';

const groups: ScheduleTimelineGroup[] = [
  { id: 'schedule', label: 'Workshop schedule', items: [
    { id: 'setup', title: 'Setup begins', start: '2026-11-27T08:00' },
    { id: 'workshop', title: 'Open workshop', start: '2026-11-27T10:00', end: '2026-11-27T12:00', status: 'Planned' },
  ] },
  { id: 'prep', label: 'Preparation', items: [
    { id: 'materials', title: 'Finalize supply list', start: '2026-11-25', status: 'Open', color: 'var(--color-warning)' },
    { id: 'room', title: 'Room reservation', start: '2026-11-27T08:00', end: '2026-11-27T13:00', color: 'var(--color-positive)' },
    { id: 'followup', title: 'Review feedback' },
  ] },
];

type ScheduleTimelineExampleProps = Pick<ScheduleTimelineProps, 'range' | 'now' | 'locale'> & { selectable: boolean };

export function ScheduleTimelineExample({ selectable, ...props }: ScheduleTimelineExampleProps) {
  const [selected, setSelected] = useState<string>();
  return <div className="workspace-examples__stack">
    <ScheduleTimeline {...props} groups={groups} onItemSelect={selectable ? (item) => setSelected(item.title) : undefined} />
    {selectable ? <p role="status">{selected ? `Selected: ${selected}` : 'Select a row or collapse a group.'}</p> : null}
  </div>;
}
