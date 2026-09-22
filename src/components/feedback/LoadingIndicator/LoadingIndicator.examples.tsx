import '../FeedbackExample.css';
import { LoadingIndicator } from './LoadingIndicator';
import type { LoadingIndicatorSize, LoadingIndicatorTone, LoadingIndicatorVariant } from './LoadingIndicator.types';

export type LoadingIndicatorExampleProps = {
  label?: string;
  size?: LoadingIndicatorSize;
  tone?: LoadingIndicatorTone;
  variant?: LoadingIndicatorVariant;
};

export function LoadingIndicatorExample({
  label = 'Syncing agents',
  size = 'comfortable',
  tone = 'accent',
  variant = 'spinner',
}: LoadingIndicatorExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface">
        <LoadingIndicator label={label} size={size} tone={tone} variant={variant} />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>State</span>
        <strong>{label ? label : 'Loading without visible label'}</strong>
      </div>
    </div>
  );
}
