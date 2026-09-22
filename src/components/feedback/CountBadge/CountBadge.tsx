import './CountBadge.css';
import type { CountBadgeProps, CountBadgeSize, CountBadgeTone, CountBadgeVariant } from './CountBadge.types';

function getCountBadgeClassName(className: CountBadgeProps['className']) {
  return ['count-badge', className].filter(Boolean).join(' ');
}

function getDisplayCount(count: number, max: number): string {
  if (count > max) {
    return `${max}+`;
  }

  return String(Math.max(0, Math.trunc(count)));
}

export function CountBadge({
  animated = false,
  'aria-label': ariaLabel,
  className,
  count = 0,
  label,
  max = 99,
  role,
  showZero = false,
  size = 'comfortable',
  tone = 'accent',
  variant = 'soft',
  ...badgeProps
}: CountBadgeProps) {
  const normalizedCount = Number.isFinite(count) ? count : 0;
  const normalizedMax = Number.isFinite(max) && max > 0 ? max : 99;
  const hidden = normalizedCount <= 0 && !showZero;
  const displayCount = getDisplayCount(normalizedCount, normalizedMax);
  const displayLabel = label?.trim();

  if (hidden) {
    return null;
  }

  return (
    <span
      {...badgeProps}
      aria-label={ariaLabel ?? `${displayLabel ? `${displayLabel} ` : ''}${displayCount}`}
      className={getCountBadgeClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-size={size}
      data-tone={tone}
      data-variant={variant}
      role={role ?? 'status'}
    >
      {displayLabel ? <span className="count-badge__label">{displayLabel}</span> : null}
      <strong className="count-badge__value">{displayCount}</strong>
    </span>
  );
}

export type { CountBadgeProps, CountBadgeSize, CountBadgeTone, CountBadgeVariant };
