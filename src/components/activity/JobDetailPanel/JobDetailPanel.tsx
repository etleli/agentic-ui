import { ProgressBar } from '../../feedback/ProgressBar';
import { StatusBadge } from '../../feedback/StatusBadge';
import '../Activity.css';
import { getActivityClassName, getProgressTone, getStatusBadgeStatus, getStatusLabel } from '../Activity.utils';
import type { JobDetailPanelProps } from '../Activity.types';

export function JobDetailPanel({
  className,
  density = 'comfortable',
  description = 'Scoring generated strategies against broker and risk constraints.',
  metrics = [],
  progress = 62,
  state = 'running',
  title = 'Strategy scoring job',
  variant = 'default',
  ...panelProps
}: JobDetailPanelProps) {
  return (
    <section {...panelProps} className={getActivityClassName('job-detail-panel', className)} data-density={density} data-variant={variant}>
      <header className="job-detail-panel__header">
        <span className="activity-copy">
          <strong className="activity-title">{title}</strong>
          {description ? <span className="activity-description">{description}</span> : null}
        </span>
        <StatusBadge label={getStatusLabel(state)} size="compact" status={getStatusBadgeStatus(state)} />
      </header>
      <ProgressBar animated label="Progress" showValue size={density} tone={getProgressTone(state)} value={progress} />
      <div className="job-detail-panel__metrics">
        {metrics.map((metric) => (
          <span className="job-detail-panel__metric" data-tone={metric.tone ?? 'default'} key={metric.id}>
            <span className="activity-meta">{metric.label}</span>
            <strong className="activity-title">{metric.value}</strong>
          </span>
        ))}
      </div>
    </section>
  );
}

export type { JobDetailMetric, JobDetailPanelProps } from '../Activity.types';
