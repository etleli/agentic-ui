import './HealthMeter.css';
import type { HealthMeterProps, HealthMeterSize, HealthMeterTone, HealthMeterVariant } from './HealthMeter.types';

function clampValue(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function getHealthMeterClassName(className: HealthMeterProps['className']) {
  return ['health-meter', className].filter(Boolean).join(' ');
}

function getResolvedTone(value: number, tone: HealthMeterTone): Exclude<HealthMeterTone, 'auto'> {
  if (tone !== 'auto') {
    return tone;
  }

  if (value >= 75) {
    return 'positive';
  }

  if (value >= 45) {
    return 'warning';
  }

  return 'negative';
}

export function HealthMeter({
  animated = true,
  'aria-label': ariaLabel,
  className,
  label,
  role,
  segments = 5,
  showValue = true,
  size = 'comfortable',
  tone = 'auto',
  value = 78,
  variant = 'bars',
  ...meterProps
}: HealthMeterProps) {
  const normalizedValue = clampValue(Number.isFinite(value) ? value : 0, 0, 100);
  const normalizedSegments = Math.round(clampValue(Number.isFinite(segments) ? segments : 5, 3, 10));
  const activeSegments = normalizedValue <= 0 ? 0 : Math.ceil((normalizedValue / 100) * normalizedSegments);
  const displayLabel = label?.trim();
  const valueLabel = `${Math.round(normalizedValue)}%`;
  const resolvedTone = getResolvedTone(normalizedValue, tone);

  return (
    <div
      {...meterProps}
      aria-label={ariaLabel ?? `${displayLabel || 'Health'} ${valueLabel}`}
      aria-valuemax={100}
      aria-valuemin={0}
      aria-valuenow={Math.round(normalizedValue)}
      className={getHealthMeterClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-size={size}
      data-tone={resolvedTone}
      data-variant={variant}
      role={role ?? 'meter'}
    >
      {displayLabel || showValue ? (
        <span className="health-meter__header">
          {displayLabel ? <span className="health-meter__label">{displayLabel}</span> : null}
          {showValue ? <strong className="health-meter__value">{valueLabel}</strong> : null}
        </span>
      ) : null}

      {variant === 'meter' ? (
        <span className="health-meter__track" aria-hidden="true">
          <span className="health-meter__fill" style={{ width: `${normalizedValue}%` }} />
        </span>
      ) : (
        <span className="health-meter__bars" aria-hidden="true">
          {Array.from({ length: normalizedSegments }, (_, index) => (
            <span className="health-meter__bar" data-active={index < activeSegments ? 'true' : undefined} key={index} />
          ))}
        </span>
      )}
    </div>
  );
}

export type { HealthMeterProps, HealthMeterSize, HealthMeterTone, HealthMeterVariant };
