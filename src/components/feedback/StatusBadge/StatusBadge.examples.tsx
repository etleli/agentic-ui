import '../FeedbackExample.css';
import { StatusBadge } from './StatusBadge';
import type { StatusBadgeSize, StatusBadgeStatus, StatusBadgeVariant } from './StatusBadge.types';

export type StatusBadgeExampleProps = {
  animated?: boolean;
  label?: string;
  showDot?: boolean;
  size?: StatusBadgeSize;
  status?: StatusBadgeStatus;
  variant?: StatusBadgeVariant;
};

export function StatusBadgeExample({
  animated = true,
  label = '',
  showDot = true,
  size = 'comfortable',
  status = 'online',
  variant = 'soft',
}: StatusBadgeExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface">
        <StatusBadge animated={animated} label={label} showDot={showDot} size={size} status={status} variant={variant} />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Status</span>
        <strong>{label ? label : status}</strong>
      </div>
    </div>
  );
}
