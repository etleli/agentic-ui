import { StatusBadge } from '../../feedback/StatusBadge';
import '../TradingWorkflow.css';
import { getTradingClassName } from '../TradingWorkflow.utils';
import type { StrategyCardProps, TradingStrategyStatus } from '../TradingWorkflow.types';

const DEFAULT_METRICS = [
  { label: 'Score', tone: 'positive' as const, value: '94' },
  { label: 'Exposure', tone: 'warning' as const, value: '42%' },
  { label: 'Latency', tone: 'positive' as const, value: '38 ms' },
];

function getStatusLabel(status: TradingStrategyStatus) {
  const labels: Record<TradingStrategyStatus, string> = {
    disabled: 'Disabled',
    error: 'Error',
    online: 'Online',
    paused: 'Paused',
    watching: 'Watching',
  };

  return labels[status];
}

export function StrategyCard({
  className,
  description = 'Momentum strategy watching AAPL, MSFT, and NVDA with risk gate enabled.',
  metrics = DEFAULT_METRICS,
  name = 'Alpha Momentum',
  selected = false,
  status = 'online',
  variant = 'default',
  ...cardProps
}: StrategyCardProps) {
  return (
    <article
      {...cardProps}
      className={getTradingClassName('trading-card strategy-card', className)}
      data-selected={selected ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="trading-card__header">
        <span className="trading-card__copy">
          <span className="trading-card__eyebrow">Strategy</span>
          <h3 className="trading-card__title">{name}</h3>
        </span>
        <StatusBadge label={getStatusLabel(status)} size="compact" status={status} />
      </header>
      {description ? <p className="trading-panel__description">{description}</p> : null}
      {metrics.length > 0 ? (
        <div className="trading-metric-grid">
          {metrics.map((metric) => (
            <span className="trading-display" data-size="compact" data-tone={metric.tone ?? 'neutral'} key={String(metric.label)}>
              <span className="trading-display__label">{metric.label}</span>
              <strong className="trading-display__value">{metric.value}</strong>
            </span>
          ))}
        </div>
      ) : null}
    </article>
  );
}

export type { StrategyCardProps };
