import '../FeedbackExample.css';
import { CountBadge } from './CountBadge';
import type { CountBadgeSize, CountBadgeTone, CountBadgeVariant } from './CountBadge.types';

export type CountBadgeExampleProps = {
  animated?: boolean;
  count?: number;
  label?: string;
  max?: number;
  showZero?: boolean;
  size?: CountBadgeSize;
  tone?: CountBadgeTone;
  variant?: CountBadgeVariant;
};

export function CountBadgeExample({
  animated = true,
  count = 12,
  label = 'Alerts',
  max = 99,
  showZero = false,
  size = 'comfortable',
  tone = 'warning',
  variant = 'soft',
}: CountBadgeExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface">
        <CountBadge animated={animated} count={count} label={label} max={max} showZero={showZero} size={size} tone={tone} variant={variant} />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Count</span>
        <strong>{count}</strong>
      </div>
    </div>
  );
}
