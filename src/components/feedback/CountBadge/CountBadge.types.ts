import type { HTMLAttributes } from 'react';

export type CountBadgeSize = 'compact' | 'comfortable' | 'spacious';

export type CountBadgeTone = 'accent' | 'positive' | 'negative' | 'warning' | 'neutral';

export type CountBadgeVariant = 'soft' | 'solid' | 'outline';

export type CountBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  animated?: boolean;
  count?: number;
  label?: string;
  max?: number;
  showZero?: boolean;
  size?: CountBadgeSize;
  tone?: CountBadgeTone;
  variant?: CountBadgeVariant;
};
