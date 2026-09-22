import type { HTMLAttributes, ReactNode } from 'react';

export type MetricCardSize = 'compact' | 'comfortable' | 'spacious';
export type MetricCardTone = 'auto' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';
export type MetricCardVariant = 'default' | 'muted' | 'accent' | 'outline';

export type MetricCardProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  description?: ReactNode;
  deltaLabel?: string;
  deltaUnit?: string;
  deltaValue?: number;
  label: ReactNode;
  selected?: boolean;
  showDelta?: boolean;
  showSparkline?: boolean;
  size?: MetricCardSize;
  sparklineValues?: number[];
  tone?: MetricCardTone;
  unit?: ReactNode;
  value: ReactNode;
  variant?: MetricCardVariant;
};
