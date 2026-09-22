import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import './DeltaIndicator.css';
import type { DeltaIndicatorDirection, DeltaIndicatorProps, DeltaIndicatorSize, DeltaIndicatorVariant } from './DeltaIndicator.types';

type ResolvedDeltaDirection = Exclude<DeltaIndicatorDirection, 'auto'>;

function getDeltaIndicatorClassName(className: DeltaIndicatorProps['className']) {
  return ['delta-indicator', className].filter(Boolean).join(' ');
}

function getResolvedDirection(value: number, direction: DeltaIndicatorDirection): ResolvedDeltaDirection {
  if (direction !== 'auto') {
    return direction;
  }

  if (value > 0) {
    return 'up';
  }

  if (value < 0) {
    return 'down';
  }

  return 'flat';
}

function getFormattedDeltaValue(value: number, precision: number, unit: string, showSign: boolean) {
  const sign = showSign && value > 0 ? '+' : '';
  const safePrecision = Math.min(Math.max(Math.trunc(precision), 0), 6);
  return `${sign}${value.toFixed(safePrecision)}${unit}`;
}

function getDeltaIcon(direction: ResolvedDeltaDirection) {
  if (direction === 'up') {
    return <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden="true" />;
  }

  if (direction === 'down') {
    return <ArrowDownRight size={16} strokeWidth={2.4} aria-hidden="true" />;
  }

  return <Minus size={16} strokeWidth={2.4} aria-hidden="true" />;
}

export function DeltaIndicator({
  'aria-label': ariaLabel,
  className,
  direction = 'auto',
  label,
  precision = 2,
  role,
  showIcon = true,
  showSign = true,
  size = 'comfortable',
  unit = '%',
  value = 0,
  variant = 'pill',
  ...indicatorProps
}: DeltaIndicatorProps) {
  const resolvedDirection = getResolvedDirection(value, direction);
  const displayValue = getFormattedDeltaValue(value, precision, unit, showSign);
  const trimmedLabel = label?.trim();

  return (
    <span
      {...indicatorProps}
      aria-label={ariaLabel ?? `${trimmedLabel ? `${trimmedLabel} ` : ''}${displayValue}`}
      className={getDeltaIndicatorClassName(className)}
      data-direction={resolvedDirection}
      data-size={size}
      data-variant={variant}
      role={role ?? 'status'}
    >
      {showIcon ? <span className="delta-indicator__icon">{getDeltaIcon(resolvedDirection)}</span> : null}
      <span className="delta-indicator__content">
        {trimmedLabel ? <span className="delta-indicator__label">{trimmedLabel}</span> : null}
        <strong className="delta-indicator__value">{displayValue}</strong>
      </span>
    </span>
  );
}

export type { DeltaIndicatorDirection, DeltaIndicatorProps, DeltaIndicatorSize, DeltaIndicatorVariant };
