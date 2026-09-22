import { useEffect, useState } from 'react';
import { ExecutionTimeline } from './ExecutionTimeline';
import type { ActivityDensity, ActivityVariant } from '../Activity.types';

export type ExecutionTimelineExampleProps = {
  density?: ActivityDensity;
  selectable?: boolean;
  selectedPhaseId?: string;
  variant?: ActivityVariant;
};

const executionPhases = [
  { description: 'Hydrate strategy inputs', duration: '120 ms', id: 'hydrate', label: '01', state: 'complete' as const, title: 'Hydrate' },
  { description: 'Score candidate graph', duration: '580 ms', id: 'score', label: '02', state: 'running' as const, title: 'Score' },
  { description: 'Validate order limits', id: 'validate', label: '03', state: 'pending' as const, title: 'Validate' },
  { description: 'Route approved orders', id: 'route', label: '04', state: 'pending' as const, title: 'Route' },
];

export function ExecutionTimelineExample({ density = 'comfortable', selectable = true, selectedPhaseId = 'score', variant = 'default' }: ExecutionTimelineExampleProps) {
  const [activePhaseId, setActivePhaseId] = useState(selectedPhaseId);

  useEffect(() => {
    setActivePhaseId(selectedPhaseId);
  }, [selectedPhaseId]);

  return (
    <ExecutionTimeline
      density={density}
      phases={executionPhases}
      selectable={selectable}
      selectedPhaseId={activePhaseId}
      variant={variant}
      onPhaseSelect={setActivePhaseId}
    />
  );
}
