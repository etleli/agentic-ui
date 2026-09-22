import { useEffect, useRef, useState } from 'react';
import { DatasetSummary } from './DatasetSummary';
import type { AdvancedDataDensity, AdvancedDataStatus, AdvancedDataVariant, DatasetSummaryMetric } from '../AdvancedData.types';

export type DatasetSummaryExampleProps = {
  coverageScore?: number;
  density?: AdvancedDataDensity;
  qualityScore?: number;
  selectable?: boolean;
  selectedMetricId?: string;
  showIssues?: boolean;
  showMetrics?: boolean;
  status?: AdvancedDataStatus;
  title?: string;
  variant?: AdvancedDataVariant;
};

const metrics: DatasetSummaryMetric[] = [
  {
    description: 'Rows accepted by the latest runtime inspection.',
    id: 'accepted',
    label: 'Accepted',
    sparklineValues: [68, 72, 76, 83, 88, 91, 94],
    tone: 'positive',
    unit: '%',
    value: '94.2',
  },
  {
    description: 'Rows blocked by quality gates.',
    id: 'blocked',
    label: 'Blocked',
    sparklineValues: [12, 9, 8, 6, 5, 4, 3],
    tone: 'warning',
    unit: '%',
    value: '3.1',
  },
  {
    description: 'Median time since the last source refresh.',
    id: 'latency',
    label: 'Refresh age',
    sparklineValues: [42, 44, 39, 35, 33, 31, 29],
    tone: 'neutral',
    unit: 's',
    value: '29',
  },
  {
    description: 'Rows with replayable source metadata.',
    id: 'lineage',
    label: 'Lineage',
    sparklineValues: [86, 87, 88, 90, 91, 93, 95],
    tone: 'positive',
    unit: '%',
    value: '95.0',
  },
];

const issues = [
  {
    description: 'Three rows have delayed broker timestamps and are excluded from live risk.',
    id: 'timestamps',
    label: 'Delayed timestamps',
    tone: 'warning' as const,
  },
  {
    description: 'All required identifiers are present for the selected runtime window.',
    id: 'identifiers',
    label: 'Identifiers complete',
    tone: 'positive' as const,
  },
];

export function DatasetSummaryExample({
  coverageScore = 96,
  density = 'comfortable',
  qualityScore = 94,
  selectable = true,
  selectedMetricId = 'accepted',
  showIssues = true,
  showMetrics = true,
  status = 'ready',
  title = 'Strategy runtime records',
  variant = 'default',
}: DatasetSummaryExampleProps) {
  const [internalSelectedMetricId, setInternalSelectedMetricId] = useState(selectedMetricId);
  const selectedMetricIdRef = useRef(selectedMetricId);

  useEffect(() => {
    if (selectedMetricIdRef.current !== selectedMetricId) {
      setInternalSelectedMetricId(selectedMetricId);
      selectedMetricIdRef.current = selectedMetricId;
    }
  }, [selectedMetricId]);

  return (
    <DatasetSummary
      coverageScore={coverageScore}
      density={density}
      description="Runtime inspection dataset with quality gates, lineage, and source freshness."
      fieldCount="18 fields"
      freshness="42s ago"
      issues={issues}
      metrics={metrics}
      qualityScore={qualityScore}
      rowCount="128,420 rows"
      selectable={selectable}
      selectedMetricId={internalSelectedMetricId}
      showIssues={showIssues}
      showMetrics={showMetrics}
      status={status}
      title={title}
      variant={variant}
      onMetricSelect={setInternalSelectedMetricId}
    />
  );
}
