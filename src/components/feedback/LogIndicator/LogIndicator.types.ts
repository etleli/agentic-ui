import type { HTMLAttributes } from 'react';

export type LogIndicatorSize = 'compact' | 'comfortable' | 'spacious';

export type LogIndicatorTone = 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';

export type LogIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  animated?: boolean;
  history?: string[];
  historyLabel?: string;
  label?: string;
  line?: string;
  previousLine?: string;
  showTimestamp?: boolean;
  size?: LogIndicatorSize;
  timestamp?: string;
  tone?: LogIndicatorTone;
};
