import { MetricCard } from './MetricCard';
import type { MetricCardSize, MetricCardTone, MetricCardVariant } from './MetricCard.types';

export type MetricCardExampleProps = {
  deltaLabel?: string;
  deltaUnit?: string;
  deltaValue?: number;
  description?: string;
  label?: string;
  selected?: boolean;
  showDelta?: boolean;
  showSparkline?: boolean;
  size?: MetricCardSize;
  sparklineValues?: number[];
  tone?: MetricCardTone;
  unit?: string;
  value?: string;
  variant?: MetricCardVariant;
};

export function MetricCardExample({
  deltaLabel = 'Today',
  deltaUnit = '%',
  deltaValue = 2.48,
  description = 'Live strategy score across active symbols.',
  label = 'Signal score',
  selected = false,
  showDelta = true,
  showSparkline = true,
  size = 'comfortable',
  sparklineValues = [12, 14, 13, 18, 21, 19, 24],
  tone = 'auto',
  unit = '/ 100',
  value = '94',
  variant = 'default',
}: MetricCardExampleProps) {
  return (
    <MetricCard
      deltaLabel={deltaLabel}
      deltaUnit={deltaUnit}
      deltaValue={deltaValue}
      description={description}
      label={label}
      selected={selected}
      showDelta={showDelta}
      showSparkline={showSparkline}
      size={size}
      sparklineValues={sparklineValues}
      tone={tone}
      unit={unit}
      value={value}
      variant={variant}
    />
  );
}
