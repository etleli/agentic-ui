import './FreshnessIndicator.css';
import type {
  FreshnessIndicatorProps,
  FreshnessIndicatorSize,
  FreshnessIndicatorState,
  FreshnessIndicatorVariant,
} from './FreshnessIndicator.types';

const FRESHNESS_LABELS: Record<FreshnessIndicatorState, string> = {
  expired: 'Expired',
  fresh: 'Fresh',
  live: 'Live',
  stale: 'Stale',
};

function getFreshnessIndicatorClassName(className: FreshnessIndicatorProps['className']) {
  return ['freshness-indicator', className].filter(Boolean).join(' ');
}

export function FreshnessIndicator({
  age = '5s',
  animated = true,
  'aria-label': ariaLabel,
  className,
  label,
  role,
  showDot = true,
  size = 'comfortable',
  state = 'fresh',
  variant = 'pill',
  ...indicatorProps
}: FreshnessIndicatorProps) {
  const displayLabel = label?.trim() || FRESHNESS_LABELS[state];
  const displayAge = age?.trim();

  return (
    <div
      {...indicatorProps}
      aria-label={ariaLabel ?? `${displayLabel}${displayAge ? ` ${displayAge}` : ''}`}
      className={getFreshnessIndicatorClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-size={size}
      data-state={state}
      data-variant={variant}
      role={role ?? 'status'}
    >
      {showDot ? <span className="freshness-indicator__dot" aria-hidden="true" /> : null}
      <span className="freshness-indicator__content">
        <strong className="freshness-indicator__label">{displayLabel}</strong>
        {displayAge ? <span className="freshness-indicator__age">{displayAge}</span> : null}
      </span>
    </div>
  );
}

export type { FreshnessIndicatorProps, FreshnessIndicatorSize, FreshnessIndicatorState, FreshnessIndicatorVariant };
