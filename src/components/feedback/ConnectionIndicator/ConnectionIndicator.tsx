import './ConnectionIndicator.css';
import type {
  ConnectionIndicatorProps,
  ConnectionIndicatorSize,
  ConnectionIndicatorStatus,
  ConnectionIndicatorVariant,
} from './ConnectionIndicator.types';

const CONNECTION_LABELS: Record<ConnectionIndicatorStatus, string> = {
  delayed: 'Delayed',
  error: 'Error',
  live: 'Live',
  offline: 'Offline',
  reconnecting: 'Reconnecting',
};

function getConnectionIndicatorClassName(className: ConnectionIndicatorProps['className']) {
  return ['connection-indicator', className].filter(Boolean).join(' ');
}

export function ConnectionIndicator({
  animated = true,
  'aria-label': ariaLabel,
  className,
  detail,
  label,
  role,
  showSignal = true,
  size = 'comfortable',
  status = 'live',
  variant = 'pill',
  ...indicatorProps
}: ConnectionIndicatorProps) {
  const displayLabel = label?.trim() || CONNECTION_LABELS[status];
  const displayDetail = detail?.trim();

  return (
    <div
      {...indicatorProps}
      aria-label={ariaLabel ?? `${displayLabel}${displayDetail ? ` ${displayDetail}` : ''}`}
      className={getConnectionIndicatorClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-size={size}
      data-status={status}
      data-variant={variant}
      role={role ?? 'status'}
    >
      {showSignal ? (
        <span className="connection-indicator__signal" aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      ) : null}
      <span className="connection-indicator__content">
        <strong className="connection-indicator__label">{displayLabel}</strong>
        {displayDetail ? <span className="connection-indicator__detail">{displayDetail}</span> : null}
      </span>
    </div>
  );
}

export type { ConnectionIndicatorProps, ConnectionIndicatorSize, ConnectionIndicatorStatus, ConnectionIndicatorVariant };
