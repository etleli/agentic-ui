import { useEffect, useState } from 'react';
import { ActivityFeed } from './ActivityFeed';
import type { ActivityFeedItem, ActivityFeedProps } from '../Activity.types';

const ACTIVITY_ITEMS: ActivityFeedItem[] = [
  {
    description: 'Broker stream heartbeat received and normalized.',
    id: 'heartbeat',
    meta: 'Latency 38 ms',
    source: 'Runtime log',
    status: 'complete',
    timestamp: '14:08:12',
    title: 'Broker stream heartbeat received',
    tone: 'positive',
  },
  {
    description: 'Risk gateway moved exposure limit to watch after volatility check.',
    id: 'risk',
    meta: 'Exposure 42%',
    source: 'Risk gateway',
    status: 'active',
    timestamp: '14:08:31',
    title: 'Exposure limit moved to watch',
    tone: 'warning',
  },
  {
    description: 'Order router paused submission while confirmation is pending.',
    id: 'orders',
    meta: '3 staged orders',
    source: 'Order router',
    status: 'paused',
    timestamp: '14:09:04',
    title: 'Order batch waiting for confirmation',
    tone: 'accent',
  },
];

export type ActivityFeedExampleProps = ActivityFeedProps;

export function ActivityFeedExample({
  density = 'comfortable',
  selectable = true,
  selectedId = 'risk',
  showSource = true,
  variant = 'default',
}: ActivityFeedExampleProps) {
  const [activeId, setActiveId] = useState(selectedId);

  useEffect(() => {
    setActiveId(selectedId);
  }, [selectedId]);

  return (
    <ActivityFeed
      density={density}
      items={ACTIVITY_ITEMS}
      selectable={selectable}
      selectedId={activeId}
      showSource={showSource}
      variant={variant}
      onItemSelect={setActiveId}
    />
  );
}
