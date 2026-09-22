import { JobDetailPanel } from './JobDetailPanel';
import type { ActivityDensity, ActivityVariant, RunQueueState } from '../Activity.types';

export type JobDetailPanelExampleProps = {
  density?: ActivityDensity;
  progress?: number;
  state?: RunQueueState;
  variant?: ActivityVariant;
};

const jobMetrics = [
  { id: 'candidates', label: 'Candidates', value: 18 },
  { id: 'errors', label: 'Errors', tone: 'negative' as const, value: 0 },
  { id: 'latency', label: 'Latency', tone: 'accent' as const, value: '580 ms' },
];

export function JobDetailPanelExample({ density = 'comfortable', progress = 62, state = 'running', variant = 'default' }: JobDetailPanelExampleProps) {
  return <JobDetailPanel density={density} metrics={jobMetrics} progress={progress} state={state} variant={variant} />;
}
