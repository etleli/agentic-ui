import type { HTMLAttributes, ReactNode } from 'react';

export type TagTone = 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral' | 'muted';
export type TagSize = 'compact' | 'comfortable' | 'spacious';
export type TagVariant = 'soft' | 'solid' | 'outline';

export type TagProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  dot?: boolean;
  icon?: ReactNode;
  label?: ReactNode;
  removable?: boolean;
  size?: TagSize;
  tone?: TagTone;
  variant?: TagVariant;
  onRemove?: () => void;
};
