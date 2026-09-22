import type { HTMLAttributes } from 'react';

export type SignalStrengthLevel = 'none' | 'weak' | 'medium' | 'strong' | 'max';
export type SignalStrengthSize = 'compact' | 'comfortable' | 'spacious';
export type SignalStrengthVariant = 'bars' | 'dots';

export type SignalStrengthProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  animated?: boolean;
  label?: string;
  level?: SignalStrengthLevel;
  showLabel?: boolean;
  size?: SignalStrengthSize;
  variant?: SignalStrengthVariant;
};
