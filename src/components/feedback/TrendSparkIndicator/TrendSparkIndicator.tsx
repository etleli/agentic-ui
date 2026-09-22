import { useMemo } from 'react';
import './TrendSparkIndicator.css';
import type {
  TrendSparkIndicatorProps,
  TrendSparkIndicatorSize,
  TrendSparkIndicatorTone,
  TrendSparkIndicatorVariant,
} from './TrendSparkIndicator.types';

const DEFAULT_TREND_VALUES = [12, 14, 13, 18, 21, 19, 24];
const SPARK_HEIGHT = 56;
const SPARK_PADDING = 4;
const SPARK_WIDTH = 180;

function getTrendSparkIndicatorClassName(className: TrendSparkIndicatorProps['className']) {
  return ['trend-spark-indicator', className].filter(Boolean).join(' ');
}

function getFiniteValues(values: readonly number[] | undefined) {
  const finiteValues = values?.filter((value) => Number.isFinite(value)) ?? [];
  return finiteValues.length >= 2 ? finiteValues : DEFAULT_TREND_VALUES;
}

function getFormattedValue(value: number) {
  if (Number.isInteger(value)) {
    return String(value);
  }

  return value.toFixed(2).replace(/\.?0+$/, '');
}

function getSparkGeometry(values: readonly number[]) {
  const minimumValue = Math.min(...values);
  const maximumValue = Math.max(...values);
  const range = maximumValue - minimumValue;
  const usableHeight = SPARK_HEIGHT - SPARK_PADDING * 2;
  const usableWidth = SPARK_WIDTH - SPARK_PADDING * 2;
  const linePoints = values
    .map((value, index) => {
      const x = SPARK_PADDING + (index / (values.length - 1)) * usableWidth;
      const y =
        range === 0
          ? SPARK_HEIGHT / 2
          : SPARK_HEIGHT - SPARK_PADDING - ((value - minimumValue) / range) * usableHeight;

      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  return {
    areaPoints: `${SPARK_PADDING},${SPARK_HEIGHT - SPARK_PADDING} ${linePoints} ${SPARK_WIDTH - SPARK_PADDING},${SPARK_HEIGHT - SPARK_PADDING}`,
    linePoints,
  };
}

function getResolvedTone(values: readonly number[], tone: TrendSparkIndicatorTone): Exclude<TrendSparkIndicatorTone, 'auto'> {
  if (tone !== 'auto') {
    return tone;
  }

  const trend = values[values.length - 1] - values[0];

  if (trend > 0) {
    return 'positive';
  }

  if (trend < 0) {
    return 'negative';
  }

  return 'neutral';
}

export function TrendSparkIndicator({
  animated = true,
  'aria-label': ariaLabel,
  className,
  label,
  role,
  showValue = true,
  size = 'comfortable',
  tone = 'auto',
  valueLabel,
  values,
  variant = 'line',
  ...indicatorProps
}: TrendSparkIndicatorProps) {
  const sparkValues = useMemo(() => getFiniteValues(values), [values]);
  const geometry = useMemo(() => getSparkGeometry(sparkValues), [sparkValues]);
  const latestValue = sparkValues[sparkValues.length - 1];
  const displayLabel = label?.trim();
  const displayValue = valueLabel?.trim() || getFormattedValue(latestValue);
  const resolvedTone = getResolvedTone(sparkValues, tone);

  return (
    <div
      {...indicatorProps}
      aria-label={ariaLabel ?? `${displayLabel || 'Trend'} ${displayValue}`}
      className={getTrendSparkIndicatorClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-size={size}
      data-tone={resolvedTone}
      data-variant={variant}
      role={role ?? 'img'}
    >
      {displayLabel || showValue ? (
        <span className="trend-spark-indicator__header">
          {displayLabel ? <span className="trend-spark-indicator__label">{displayLabel}</span> : null}
          {showValue ? <strong className="trend-spark-indicator__value">{displayValue}</strong> : null}
        </span>
      ) : null}

      <svg className="trend-spark-indicator__chart" viewBox={`0 0 ${SPARK_WIDTH} ${SPARK_HEIGHT}`} aria-hidden="true">
        {variant === 'area' ? <polygon className="trend-spark-indicator__area" points={geometry.areaPoints} /> : null}
        <polyline className="trend-spark-indicator__line" points={geometry.linePoints} />
      </svg>
    </div>
  );
}

export type { TrendSparkIndicatorProps, TrendSparkIndicatorSize, TrendSparkIndicatorTone, TrendSparkIndicatorVariant };
