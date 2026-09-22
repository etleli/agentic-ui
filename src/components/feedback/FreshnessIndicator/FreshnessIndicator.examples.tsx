import '../FeedbackExample.css';
import { FreshnessIndicator } from './FreshnessIndicator';
import type { FreshnessIndicatorSize, FreshnessIndicatorState, FreshnessIndicatorVariant } from './FreshnessIndicator.types';

export type FreshnessIndicatorExampleProps = {
  age?: string;
  animated?: boolean;
  label?: string;
  showDot?: boolean;
  size?: FreshnessIndicatorSize;
  state?: FreshnessIndicatorState;
  variant?: FreshnessIndicatorVariant;
};

export function FreshnessIndicatorExample({
  age = '5s',
  animated = true,
  label = 'Quotes',
  showDot = true,
  size = 'comfortable',
  state = 'fresh',
  variant = 'pill',
}: FreshnessIndicatorExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface">
        <FreshnessIndicator age={age} animated={animated} label={label} showDot={showDot} size={size} state={state} variant={variant} />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Freshness</span>
        <strong>{state}</strong>
      </div>
    </div>
  );
}
