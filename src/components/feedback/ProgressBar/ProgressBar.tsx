import './ProgressBar.css';
import type { CSSProperties } from 'react';
import type { ProgressBarMode, ProgressBarProps, ProgressBarSize, ProgressBarTone } from './ProgressBar.types';

function clampProgressValue(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function getProgressBarClassName(className: ProgressBarProps['className']) {
  return ['progress-bar', className].filter(Boolean).join(' ');
}

function getProgressPercent(value: number, min: number, max: number): number {
  if (max <= min) {
    return 0;
  }

  return ((clampProgressValue(value, min, max) - min) / (max - min)) * 100;
}

export function ProgressBar({
  animated = true,
  className,
  label,
  max = 100,
  min = 0,
  mode = 'determinate',
  showValue = true,
  size = 'comfortable',
  tone = 'accent',
  value = 0,
  valueFormatter,
  ...progressProps
}: ProgressBarProps) {
  const clampedValue = clampProgressValue(value, min, max);
  const percentValue = getProgressPercent(value, min, max);
  const displayValue = valueFormatter ? valueFormatter(clampedValue) : `${Math.round(percentValue)}%`;
  const hasHeader = Boolean(label?.trim()) || showValue;
  const isIndeterminate = mode === 'indeterminate';

  return (
    <div {...progressProps} className={getProgressBarClassName(className)} data-size={size} data-tone={tone}>
      {hasHeader ? (
        <div className="progress-bar__header">
          {label ? <span className="progress-bar__label">{label}</span> : <span />}
          {showValue ? <strong className="progress-bar__value">{isIndeterminate ? 'Running' : displayValue}</strong> : null}
        </div>
      ) : null}
      <div
        className="progress-bar__track"
        aria-valuemax={isIndeterminate ? undefined : max}
        aria-valuemin={isIndeterminate ? undefined : min}
        aria-valuenow={isIndeterminate ? undefined : clampedValue}
        aria-valuetext={isIndeterminate ? 'In progress' : displayValue}
        data-animated={!isIndeterminate && animated ? 'true' : undefined}
        data-mode={mode}
        role="progressbar"
        style={{ '--progress-bar-value': `${percentValue}%` } as CSSProperties}
      >
        <span className="progress-bar__fill" />
      </div>
    </div>
  );
}

export type { ProgressBarMode, ProgressBarProps, ProgressBarSize, ProgressBarTone };
