import type { HTMLAttributes } from 'react';

export type LoadingIndicatorVariant = 'spinner' | 'dots' | 'pulse';

export type LoadingIndicatorSize = 'compact' | 'comfortable' | 'spacious';

export type LoadingIndicatorTone = 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';

export type LoadingIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ariaLabel?: string;
  label?: string;
  size?: LoadingIndicatorSize;
  tone?: LoadingIndicatorTone;
  variant?: LoadingIndicatorVariant;
};
