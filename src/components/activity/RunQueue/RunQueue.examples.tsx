import { useEffect, useState } from 'react';
import { RunQueue } from './RunQueue';
import type { RunQueueItem, RunQueueProps } from '../Activity.types';

const RUN_QUEUE_ITEMS: RunQueueItem[] = [
  {
    description: 'Backtest and risk scoring are running for the latest candidate set.',
    id: 'simulation',
    meta: 'Started 14:08',
    progress: 68,
    state: 'running',
    title: 'Demo Momentum simulation',
  },
  {
    description: 'Paper order plan is waiting for manual review.',
    id: 'approval',
    meta: '3 staged orders',
    progress: 42,
    state: 'blocked',
    title: 'Rebalance approval',
  },
  {
    description: 'Nightly data quality check completed without blocking issues.',
    id: 'quality',
    meta: '12 checks passed',
    progress: 100,
    state: 'complete',
    title: 'Market data quality scan',
  },
];

export type RunQueueExampleProps = RunQueueProps;

export function RunQueueExample({
  density = 'comfortable',
  selectable = true,
  selectedId = 'simulation',
  showProgress = true,
  variant = 'default',
}: RunQueueExampleProps) {
  const [activeId, setActiveId] = useState(selectedId);

  useEffect(() => {
    setActiveId(selectedId);
  }, [selectedId]);

  return (
    <RunQueue
      density={density}
      items={RUN_QUEUE_ITEMS}
      selectable={selectable}
      selectedId={activeId}
      showProgress={showProgress}
      variant={variant}
      onItemSelect={setActiveId}
    />
  );
}
