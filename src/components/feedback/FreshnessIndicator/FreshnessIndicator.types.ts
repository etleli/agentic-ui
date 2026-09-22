import type { HTMLAttributes } from 'react';

export type FreshnessIndicatorState = 'live' | 'fresh' | 'stale' | 'expired';

export type FreshnessIndicatorSize = 'compact' | 'comfortable' | 'spacious';

export type FreshnessIndicatorVariant = 'inline' | 'pill' | 'card';

export type FreshnessIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  age?: string;
  animated?: boolean;
  label?: string;
  showDot?: boolean;
  size?: FreshnessIndicatorSize;
  state?: FreshnessIndicatorState;
  variant?: FreshnessIndicatorVariant;
};
