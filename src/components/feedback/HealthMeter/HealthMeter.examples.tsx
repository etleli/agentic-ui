import '../FeedbackExample.css';
import { HealthMeter } from './HealthMeter';
import type { HealthMeterSize, HealthMeterTone, HealthMeterVariant } from './HealthMeter.types';

export type HealthMeterExampleProps = {
  animated?: boolean;
  label?: string;
  segments?: number;
  showValue?: boolean;
  size?: HealthMeterSize;
  tone?: HealthMeterTone;
  value?: number;
  variant?: HealthMeterVariant;
};

export function HealthMeterExample({
  animated = true,
  label = 'System health',
  segments = 5,
  showValue = true,
  size = 'comfortable',
  tone = 'auto',
  value = 78,
  variant = 'bars',
}: HealthMeterExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface" data-wide="true">
        <HealthMeter
          animated={animated}
          label={label}
          segments={segments}
          showValue={showValue}
          size={size}
          tone={tone}
          value={value}
          variant={variant}
        />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Health</span>
        <strong>{Math.round(value)}%</strong>
      </div>
    </div>
  );
}
