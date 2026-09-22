import './RiskIndicator.css';
import type { RiskIndicatorLevel, RiskIndicatorProps, RiskIndicatorSize, RiskIndicatorVariant } from './RiskIndicator.types';

const RISK_LABELS: Record<RiskIndicatorLevel, string> = {
  critical: 'Critical',
  high: 'High',
  low: 'Low',
  medium: 'Medium',
};

const RISK_STRENGTH: Record<RiskIndicatorLevel, number> = {
  critical: 4,
  high: 3,
  low: 1,
  medium: 2,
};

const RISK_SEGMENTS = [1, 2, 3, 4] as const;

function getRiskIndicatorClassName(className: RiskIndicatorProps['className']) {
  return ['risk-indicator', className].filter(Boolean).join(' ');
}

function getRiskLabel(level: RiskIndicatorLevel, label: string | undefined) {
  const trimmedLabel = label?.trim();
  return trimmedLabel ? trimmedLabel : `${RISK_LABELS[level]} risk`;
}

export function RiskIndicator({
  'aria-label': ariaLabel,
  className,
  label,
  level = 'medium',
  role,
  score,
  showScore = true,
  size = 'comfortable',
  variant = 'pill',
  ...indicatorProps
}: RiskIndicatorProps) {
  const displayLabel = getRiskLabel(level, label);
  const activeSegments = RISK_STRENGTH[level];
  const trimmedScore = score?.trim();

  return (
    <div
      {...indicatorProps}
      aria-label={ariaLabel ?? `${displayLabel}${showScore && trimmedScore ? ` ${trimmedScore}` : ''}`}
      className={getRiskIndicatorClassName(className)}
      data-level={level}
      data-size={size}
      data-variant={variant}
      role={role ?? 'status'}
    >
      {variant === 'bars' ? (
        <span className="risk-indicator__bars" aria-hidden="true">
          {RISK_SEGMENTS.map((segment) => (
            <span className="risk-indicator__bar" data-active={segment <= activeSegments ? 'true' : undefined} key={segment} />
          ))}
        </span>
      ) : (
        <span className="risk-indicator__dot" aria-hidden="true" />
      )}

      <span className="risk-indicator__label">{displayLabel}</span>
      {showScore && trimmedScore ? <strong className="risk-indicator__score">{trimmedScore}</strong> : null}
    </div>
  );
}

export type { RiskIndicatorLevel, RiskIndicatorProps, RiskIndicatorSize, RiskIndicatorVariant };
