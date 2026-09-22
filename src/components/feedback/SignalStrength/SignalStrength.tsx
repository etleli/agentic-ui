import './SignalStrength.css';
import type { SignalStrengthLevel, SignalStrengthProps, SignalStrengthSize, SignalStrengthVariant } from './SignalStrength.types';

const SIGNAL_LABELS: Record<SignalStrengthLevel, string> = {
  max: 'Maximum signal',
  medium: 'Medium signal',
  none: 'No signal',
  strong: 'Strong signal',
  weak: 'Weak signal',
};

const SIGNAL_LEVELS: Record<SignalStrengthLevel, number> = {
  max: 4,
  medium: 2,
  none: 0,
  strong: 3,
  weak: 1,
};

function getSignalStrengthClassName(className: SignalStrengthProps['className']) {
  return ['signal-strength', className].filter(Boolean).join(' ');
}

function getSignalTone(activeSegments: number) {
  if (activeSegments >= 3) {
    return 'positive';
  }

  if (activeSegments === 2) {
    return 'warning';
  }

  if (activeSegments === 1) {
    return 'negative';
  }

  return 'neutral';
}

export function SignalStrength({
  animated = true,
  'aria-label': ariaLabel,
  className,
  label,
  level = 'strong',
  role,
  showLabel = true,
  size = 'comfortable',
  variant = 'bars',
  ...signalProps
}: SignalStrengthProps) {
  const activeSegments = SIGNAL_LEVELS[level];
  const displayLabel = label?.trim() || SIGNAL_LABELS[level];

  return (
    <div
      {...signalProps}
      aria-label={ariaLabel ?? displayLabel}
      className={getSignalStrengthClassName(className)}
      data-animated={animated ? 'true' : undefined}
      data-size={size}
      data-tone={getSignalTone(activeSegments)}
      data-variant={variant}
      role={role ?? 'status'}
    >
      <span className="signal-strength__visual" aria-hidden="true">
        {Array.from({ length: 4 }, (_, index) => (
          <span className="signal-strength__segment" data-active={index < activeSegments ? 'true' : undefined} key={index} />
        ))}
      </span>
      {showLabel ? <strong className="signal-strength__label">{displayLabel}</strong> : null}
    </div>
  );
}

export type { SignalStrengthLevel, SignalStrengthProps, SignalStrengthSize, SignalStrengthVariant };
