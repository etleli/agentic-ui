import '../FeedbackExample.css';
import { DeltaIndicator } from './DeltaIndicator';
import type { DeltaIndicatorDirection, DeltaIndicatorSize, DeltaIndicatorVariant } from './DeltaIndicator.types';

export type DeltaIndicatorExampleProps = {
  direction?: DeltaIndicatorDirection;
  label?: string;
  precision?: number;
  showIcon?: boolean;
  showSign?: boolean;
  size?: DeltaIndicatorSize;
  unit?: string;
  value?: number;
  variant?: DeltaIndicatorVariant;
};

export function DeltaIndicatorExample({
  direction = 'auto',
  label = 'PnL today',
  precision = 2,
  showIcon = true,
  showSign = true,
  size = 'comfortable',
  unit = '%',
  value = 2.48,
  variant = 'pill',
}: DeltaIndicatorExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface">
        <DeltaIndicator
          direction={direction}
          label={label}
          precision={precision}
          showIcon={showIcon}
          showSign={showSign}
          size={size}
          unit={unit}
          value={value}
          variant={variant}
        />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Delta</span>
        <strong>{value}</strong>
      </div>
    </div>
  );
}
