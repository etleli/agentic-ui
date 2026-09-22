import { useEffect, useState } from 'react';
import { Timeline } from './Timeline';
import type { TimelineItem, TimelineProps } from '../Activity.types';

const TIMELINE_ITEMS: TimelineItem[] = [
  {
    description: 'Strategy engine accepted the simulation request and locked the runtime inputs.',
    id: 'accepted',
    label: 'Runtime',
    meta: 'Input hash: 92fc',
    timestamp: '14:08:12',
    title: 'Simulation request accepted',
    tone: 'positive',
  },
  {
    description: 'Risk gateway moved exposure from pass to watch while volatility is elevated.',
    id: 'risk-watch',
    label: 'Risk',
    meta: 'Exposure limit: 42%',
    timestamp: '14:08:31',
    title: 'Risk gate entered watch state',
    tone: 'warning',
  },
  {
    description: 'Order router prepared paper orders and is waiting for confirmation.',
    id: 'orders-ready',
    label: 'Execution',
    meta: '3 staged orders',
    timestamp: '14:09:04',
    title: 'Order batch staged',
    tone: 'accent',
  },
];

export type TimelineExampleProps = TimelineProps;

export function TimelineExample({
  density = 'comfortable',
  orientation = 'vertical',
  selectable = true,
  selectedId = 'risk-watch',
  showTimestamps = true,
  variant = 'default',
}: TimelineExampleProps) {
  const [activeId, setActiveId] = useState(selectedId);

  useEffect(() => {
    setActiveId(selectedId);
  }, [selectedId]);

  return (
    <Timeline
      density={density}
      items={TIMELINE_ITEMS}
      orientation={orientation}
      selectable={selectable}
      selectedId={activeId}
      showTimestamps={showTimestamps}
      variant={variant}
      onItemSelect={setActiveId}
    />
  );
}
