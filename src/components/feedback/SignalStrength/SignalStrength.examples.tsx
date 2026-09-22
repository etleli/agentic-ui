import '../FeedbackExample.css';
import { SignalStrength } from './SignalStrength';
import type { SignalStrengthLevel, SignalStrengthSize, SignalStrengthVariant } from './SignalStrength.types';

export type SignalStrengthExampleProps = {
  animated?: boolean;
  label?: string;
  level?: SignalStrengthLevel;
  showLabel?: boolean;
  size?: SignalStrengthSize;
  variant?: SignalStrengthVariant;
};

export function SignalStrengthExample({
  animated = true,
  label = '',
  level = 'strong',
  showLabel = true,
  size = 'comfortable',
  variant = 'bars',
}: SignalStrengthExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface">
        <SignalStrength animated={animated} label={label} level={level} showLabel={showLabel} size={size} variant={variant} />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Signal</span>
        <strong>{level}</strong>
      </div>
    </div>
  );
}
