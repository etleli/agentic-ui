import type { HTMLAttributes } from 'react';

export type HealthMeterSize = 'compact' | 'comfortable' | 'spacious';
export type HealthMeterTone = 'accent' | 'auto' | 'positive' | 'warning' | 'negative' | 'neutral';
export type HealthMeterVariant = 'bars' | 'meter';

export type HealthMeterProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  animated?: boolean;
  label?: string;
  segments?: number;
  showValue?: boolean;
  size?: HealthMeterSize;
  tone?: HealthMeterTone;
  value?: number;
  variant?: HealthMeterVariant;
};
