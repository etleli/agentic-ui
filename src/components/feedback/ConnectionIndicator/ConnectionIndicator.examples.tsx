import '../FeedbackExample.css';
import { ConnectionIndicator } from './ConnectionIndicator';
import type { ConnectionIndicatorSize, ConnectionIndicatorStatus, ConnectionIndicatorVariant } from './ConnectionIndicator.types';

export type ConnectionIndicatorExampleProps = {
  animated?: boolean;
  detail?: string;
  label?: string;
  showSignal?: boolean;
  size?: ConnectionIndicatorSize;
  status?: ConnectionIndicatorStatus;
  variant?: ConnectionIndicatorVariant;
};

export function ConnectionIndicatorExample({
  animated = true,
  detail = 'Market data feed',
  label = '',
  showSignal = true,
  size = 'comfortable',
  status = 'live',
  variant = 'pill',
}: ConnectionIndicatorExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface">
        <ConnectionIndicator
          animated={animated}
          detail={detail}
          label={label}
          showSignal={showSignal}
          size={size}
          status={status}
          variant={variant}
        />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Connection</span>
        <strong>{status}</strong>
      </div>
    </div>
  );
}
