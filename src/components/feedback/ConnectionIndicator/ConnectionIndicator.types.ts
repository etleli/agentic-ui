import type { HTMLAttributes } from 'react';

export type ConnectionIndicatorStatus = 'live' | 'delayed' | 'reconnecting' | 'offline' | 'error';

export type ConnectionIndicatorSize = 'compact' | 'comfortable' | 'spacious';

export type ConnectionIndicatorVariant = 'inline' | 'pill' | 'card';

export type ConnectionIndicatorProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  animated?: boolean;
  detail?: string;
  label?: string;
  showSignal?: boolean;
  size?: ConnectionIndicatorSize;
  status?: ConnectionIndicatorStatus;
  variant?: ConnectionIndicatorVariant;
};
