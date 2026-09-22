import '../FeedbackExample.css';
import { TrendSparkIndicator } from './TrendSparkIndicator';
import type { TrendSparkIndicatorSize, TrendSparkIndicatorTone, TrendSparkIndicatorVariant } from './TrendSparkIndicator.types';

const DEFAULT_VALUE_SOURCE = '12, 14, 13, 18, 21, 19, 24';

function parseTrendValues(valueSource: string | undefined) {
  const parsedValues =
    valueSource
      ?.split(/[\s,;|]+/)
      .map((value) => Number.parseFloat(value))
      .filter((value) => Number.isFinite(value)) ?? [];

  return parsedValues.length >= 2 ? parsedValues : DEFAULT_VALUE_SOURCE.split(',').map((value) => Number.parseFloat(value));
}

export type TrendSparkIndicatorExampleProps = {
  animated?: boolean;
  label?: string;
  showValue?: boolean;
  size?: TrendSparkIndicatorSize;
  tone?: TrendSparkIndicatorTone;
  valueLabel?: string;
  valueSource?: string;
  variant?: TrendSparkIndicatorVariant;
};

export function TrendSparkIndicatorExample({
  animated = true,
  label = 'Signal score',
  showValue = true,
  size = 'comfortable',
  tone = 'auto',
  valueLabel = '',
  valueSource = DEFAULT_VALUE_SOURCE,
  variant = 'area',
}: TrendSparkIndicatorExampleProps) {
  const values = parseTrendValues(valueSource);
  const latestValue = values[values.length - 1];

  return (
    <div className="feedback-example">
      <div className="feedback-example__surface" data-wide="true">
        <TrendSparkIndicator
          animated={animated}
          label={label}
          showValue={showValue}
          size={size}
          tone={tone}
          valueLabel={valueLabel}
          values={values}
          variant={variant}
        />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Trend</span>
        <strong>{valueLabel || latestValue}</strong>
      </div>
    </div>
  );
}
