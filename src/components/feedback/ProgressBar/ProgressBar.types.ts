import type { HTMLAttributes } from 'react';

export type ProgressBarMode = 'determinate' | 'indeterminate';

export type ProgressBarSize = 'compact' | 'comfortable' | 'spacious';

export type ProgressBarTone = 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';

export type ProgressBarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  animated?: boolean;
  label?: string;
  max?: number;
  min?: number;
  mode?: ProgressBarMode;
  showValue?: boolean;
  size?: ProgressBarSize;
  tone?: ProgressBarTone;
  value?: number;
  valueFormatter?: (value: number) => string;
};
