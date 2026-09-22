import '../FeedbackExample.css';
import { ProgressBar } from './ProgressBar';
import type { ProgressBarMode, ProgressBarSize, ProgressBarTone } from './ProgressBar.types';

export type ProgressBarExampleProps = {
  animated?: boolean;
  label?: string;
  max?: number;
  min?: number;
  mode?: ProgressBarMode;
  showValue?: boolean;
  size?: ProgressBarSize;
  tone?: ProgressBarTone;
  value?: number;
};

export function ProgressBarExample({
  animated = true,
  label = 'Strategy warmup',
  max = 100,
  min = 0,
  mode = 'determinate',
  showValue = true,
  size = 'comfortable',
  tone = 'accent',
  value = 64,
}: ProgressBarExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface" data-wide="true">
        <ProgressBar animated={animated} label={label} max={max} min={min} mode={mode} showValue={showValue} size={size} tone={tone} value={value} />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Progress</span>
        <strong>{mode === 'indeterminate' ? 'Running without fixed completion' : `${value} / ${max}`}</strong>
      </div>
    </div>
  );
}
