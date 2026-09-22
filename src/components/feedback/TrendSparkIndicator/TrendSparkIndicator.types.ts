import type { HTMLAttributes } from 'react';

export type TrendSparkIndicatorSize = 'compact' | 'comfortable' | 'spacious';
export type TrendSparkIndicatorTone = 'accent' | 'auto' | 'positive' | 'negative' | 'neutral';
export type TrendSparkIndicatorVariant = 'line' | 'area';

export type TrendSparkIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  animated?: boolean;
  label?: string;
  showValue?: boolean;
  size?: TrendSparkIndicatorSize;
  tone?: TrendSparkIndicatorTone;
  valueLabel?: string;
  values?: readonly number[];
  variant?: TrendSparkIndicatorVariant;
};
