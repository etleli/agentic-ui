import '../FeedbackExample.css';
import { RiskIndicator } from './RiskIndicator';
import type { RiskIndicatorLevel, RiskIndicatorSize, RiskIndicatorVariant } from './RiskIndicator.types';

export type RiskIndicatorExampleProps = {
  label?: string;
  level?: RiskIndicatorLevel;
  score?: string;
  showScore?: boolean;
  size?: RiskIndicatorSize;
  variant?: RiskIndicatorVariant;
};

export function RiskIndicatorExample({
  label = '',
  level = 'medium',
  score = '64',
  showScore = true,
  size = 'comfortable',
  variant = 'bars',
}: RiskIndicatorExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface">
        <RiskIndicator label={label} level={level} score={score} showScore={showScore} size={size} variant={variant} />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Risk</span>
        <strong>{level}</strong>
      </div>
    </div>
  );
}
