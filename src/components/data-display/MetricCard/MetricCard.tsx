import { DeltaIndicator } from '../../feedback';
import './MetricCard.css';
import type { MetricCardProps, MetricCardSize, MetricCardTone, MetricCardVariant } from './MetricCard.types';

type ResolvedMetricTone = Exclude<MetricCardTone, 'auto'>;

function getMetricCardClassName(className: MetricCardProps['className']) {
  return ['metric-card', className].filter(Boolean).join(' ');
}

function getResolvedTone(tone: MetricCardTone, deltaValue: number | undefined): ResolvedMetricTone {
  if (tone !== 'auto') {
    return tone;
  }

  if (typeof deltaValue === 'number' && deltaValue > 0) {
    return 'positive';
  }

  if (typeof deltaValue === 'number' && deltaValue < 0) {
    return 'negative';
  }

  return 'neutral';
}

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
      const y = 40 - ((value - minValue) / range) * 36;

      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');
}

export function MetricCard({
  className,
  description,
  deltaLabel,
  deltaUnit = '%',
  deltaValue = 0,
  label,
  selected = false,
  showDelta = true,
  showSparkline = true,
  size = 'comfortable',
  sparklineValues = [],
  tone = 'auto',
  unit,
  value,
  variant = 'default',
  ...cardProps
}: MetricCardProps) {
  const resolvedTone = getResolvedTone(tone, deltaValue);
  const sparklinePoints = getSparklinePoints(sparklineValues);

  return (
    <article
      {...cardProps}
      className={getMetricCardClassName(className)}
      data-selected={selected ? 'true' : undefined}
      data-size={size}
      data-tone={resolvedTone}
      data-variant={variant}
    >
      <span className="metric-card__header">
        <span className="metric-card__label">{label}</span>
        {showDelta ? (
          <DeltaIndicator
            direction="auto"
            label={deltaLabel}
            precision={2}
            showIcon
            size={size === 'spacious' ? 'comfortable' : 'compact'}
            unit={deltaUnit}
            value={deltaValue}
            variant="plain"
          />
        ) : null}
      </span>

      <span className="metric-card__value-row">
        <strong className="metric-card__value">{value}</strong>
        {unit ? <span className="metric-card__unit">{unit}</span> : null}
      </span>

      {description ? <span className="metric-card__description">{description}</span> : null}

      {showSparkline && sparklinePoints ? (
        <svg className="metric-card__sparkline" viewBox="0 0 100 44" preserveAspectRatio="none" aria-hidden="true">
          <polyline className="metric-card__sparkline-line" points={sparklinePoints} />
        </svg>
      ) : null}
    </article>
  );
}

export type { MetricCardProps, MetricCardSize, MetricCardTone, MetricCardVariant };
