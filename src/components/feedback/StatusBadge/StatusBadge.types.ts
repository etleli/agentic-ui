import type { HTMLAttributes } from 'react';

export type StatusBadgeStatus = 'online' | 'watching' | 'paused' | 'error' | 'disabled';

export type StatusBadgeSize = 'compact' | 'comfortable' | 'spacious';

export type StatusBadgeVariant = 'soft' | 'solid' | 'outline';

export type StatusBadgeProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  animated?: boolean;
  label?: string;
  showDot?: boolean;
  size?: StatusBadgeSize;
  status?: StatusBadgeStatus;
  variant?: StatusBadgeVariant;
};
