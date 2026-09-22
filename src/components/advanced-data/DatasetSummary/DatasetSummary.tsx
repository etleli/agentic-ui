import { useEffect, useMemo, useRef, useState } from 'react';
import { ProgressBar } from '../../feedback/ProgressBar';
import { StatusBadge } from '../../feedback/StatusBadge';
import '../AdvancedData.css';
import {
  clampAdvancedDataPercent,
  getAdvancedDataClassName,
  getAdvancedDataProgressTone,
  getAdvancedDataSize,
  getAdvancedDataStatus,
  getAdvancedDataStatusLabel,
} from '../AdvancedData.utils';
import type { DatasetSummaryMetric, DatasetSummaryProps } from '../AdvancedData.types';

function getSparklinePoints(values: number[]) {
  if (values.length < 2) {
    return '';
  }

  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);
  const range = maxValue - minValue || 1;

  return values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 100;
      const y = 30 - ((value - minValue) / range) * 26;

      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

function getResolvedMetricTone(metric: DatasetSummaryMetric) {
  if (metric.tone && metric.tone !== 'auto') {
    return metric.tone;
  }

  if (typeof metric.deltaValue === 'number' && metric.deltaValue > 0) {
    return 'positive';
  }

  if (typeof metric.deltaValue === 'number' && metric.deltaValue < 0) {
    return 'negative';
  }

  return 'neutral';
}

export function DatasetSummary({
  className,
  coverageScore = 96,
  density = 'comfortable',
  description = 'Dataset health, row coverage, and runtime freshness.',
  fieldCount = '18 fields',
  freshness = '42s ago',
  issues = [],
  metrics = [],
  qualityScore = 94,
  rowCount = '128,420 rows',
  selectable = true,
  selectedMetricId,
  showIssues = true,
  showMetrics = true,
  status = 'ready',
  title = 'Runtime dataset',
  variant = 'default',
  onMetricSelect,
  ...summaryProps
}: DatasetSummaryProps) {
  const fallbackMetricId = metrics[0]?.id ?? '';
  const [internalSelectedMetricId, setInternalSelectedMetricId] = useState(selectedMetricId ?? fallbackMetricId);
  const selectedMetricIdRef = useRef(selectedMetricId);
  const size = getAdvancedDataSize(density);
  const quality = clampAdvancedDataPercent(qualityScore);
  const coverage = clampAdvancedDataPercent(coverageScore);

  useEffect(() => {
    if (selectedMetricId !== undefined && selectedMetricIdRef.current !== selectedMetricId) {
      setInternalSelectedMetricId(selectedMetricId);
      selectedMetricIdRef.current = selectedMetricId;
    }
  }, [selectedMetricId]);

  const stats = useMemo(
    () => [
      { id: 'rows', label: 'Rows', value: rowCount },
      { id: 'fields', label: 'Fields', value: fieldCount },
      { id: 'quality', label: 'Quality', value: `${Math.round(quality)}%` },
      { id: 'freshness', label: 'Freshness', value: freshness },
    ],
    [fieldCount, freshness, quality, rowCount],
  );

  function selectMetric(metric: DatasetSummaryMetric) {
    setInternalSelectedMetricId(metric.id);
    onMetricSelect?.(metric.id, metric);
  }

  return (
    <section
      {...summaryProps}
      className={getAdvancedDataClassName('advanced-data-summary', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="advanced-data__header">
        <span className="advanced-data__heading-copy">
          <span className="advanced-data__eyebrow">Dataset</span>
          <strong className="advanced-data__title">{title}</strong>
          {description ? <span className="advanced-data__description">{description}</span> : null}
        </span>
        <StatusBadge animated={status === 'running'} label={getAdvancedDataStatusLabel(status)} size={size} status={getAdvancedDataStatus(status)} />
      </header>

      <div className="advanced-data__stat-grid">
        {stats.map((stat) => (
          <span className="advanced-data__stat" key={stat.id}>
            <span className="advanced-data__stat-label">{stat.label}</span>
            <strong className="advanced-data__stat-value">{stat.value}</strong>
          </span>
        ))}
      </div>

      <ProgressBar label="Quality score" showValue size={size} tone={getAdvancedDataProgressTone('positive')} value={quality} />
      <ProgressBar label="Coverage" showValue size={size} tone={getAdvancedDataProgressTone('accent')} value={coverage} />

      {showMetrics && metrics.length > 0 ? (
        <div className="advanced-data-summary__metrics" role={selectable ? 'listbox' : 'list'} aria-label="Dataset metrics">
          {metrics.map((metric) => {
            const tone = getResolvedMetricTone(metric);
            const sparklinePoints = getSparklinePoints(metric.sparklineValues ?? []);
            const isSelected = internalSelectedMetricId === metric.id;

            return (
              <button
                aria-current={!selectable && isSelected ? 'true' : undefined}
                aria-disabled={selectable ? undefined : true}
                aria-selected={selectable ? isSelected : undefined}
                className="advanced-data-summary__metric"
                data-selected={isSelected ? 'true' : undefined}
                data-tone={tone}
                key={metric.id}
                role={selectable ? 'option' : 'listitem'}
                tabIndex={selectable ? undefined : -1}
                type="button"
                onClick={selectable ? () => selectMetric(metric) : undefined}
              >
                <span className="advanced-data-summary__metric-label">{metric.label}</span>
                <strong className="advanced-data-summary__metric-value">
                  {metric.value}
                  {metric.unit ? <span className="advanced-data__small"> {metric.unit}</span> : null}
                </strong>
                {metric.description ? <span className="advanced-data__small">{metric.description}</span> : null}
                {sparklinePoints ? (
                  <svg className="advanced-data-summary__metric-sparkline" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden="true">
                    <polyline className="advanced-data-summary__metric-line" points={sparklinePoints} />
                  </svg>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}

      {showIssues && issues.length > 0 ? (
        <div className="advanced-data-summary__issues">
          {issues.map((issue) => (
            <span className="advanced-data-summary__issue" data-tone={issue.tone ?? 'neutral'} key={issue.id}>
              <span className="advanced-data__heading-copy">
                <strong className="advanced-data__stat-value">{issue.label}</strong>
                {issue.description ? <span className="advanced-data__small">{issue.description}</span> : null}
              </span>
              <span className="advanced-data__meta">{issue.tone ?? 'neutral'}</span>
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

export type { DatasetSummaryIssue, DatasetSummaryMetric, DatasetSummaryProps } from '../AdvancedData.types';
