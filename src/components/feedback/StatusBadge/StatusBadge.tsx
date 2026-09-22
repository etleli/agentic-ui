import './StatusBadge.css';
import type { StatusBadgeProps, StatusBadgeSize, StatusBadgeStatus, StatusBadgeVariant } from './StatusBadge.types';

const STATUS_BADGE_LABELS: Record<StatusBadgeStatus, string> = {
  disabled: 'Disabled',
  error: 'Error',
  online: 'Online',
  paused: 'Paused',
  watching: 'Watching',
};

function getStatusBadgeClassName(className: StatusBadgeProps['className']) {
  return ['status-badge', className].filter(Boolean).join(' ');
}

function getStatusBadgeLabel(status: StatusBadgeStatus, label: string | undefined) {
  const trimmedLabel = label?.trim();
  return trimmedLabel ? trimmedLabel : STATUS_BADGE_LABELS[status];
}

export function StatusBadge({
  animated = true,
  'aria-label': ariaLabel,
  className,
  label,
  role,
  showDot = true,
  size = 'comfortable',
  status = 'online',
  variant = 'soft',
  ...badgeProps
}: StatusBadgeProps) {
  const displayLabel = getStatusBadgeLabel(status, label);

  return (
    <span
      {...badgeProps}
      aria-label={ariaLabel ?? displayLabel}
      className={getStatusBadgeClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-size={size}
      data-status={status}
      data-variant={variant}
      role={role ?? 'status'}
    >
      {showDot ? <span className="status-badge__dot" aria-hidden="true" /> : null}
      <span className="status-badge__label">{displayLabel}</span>
    </span>
  );
}

export type { StatusBadgeProps, StatusBadgeSize, StatusBadgeStatus, StatusBadgeVariant };
