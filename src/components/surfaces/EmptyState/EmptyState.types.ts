import type { HTMLAttributes, ReactNode } from 'react';

export type EmptyStateAlignment = 'center' | 'start';
export type EmptyStateSize = 'compact' | 'comfortable' | 'spacious';
export type EmptyStateTone = 'neutral' | 'accent' | 'warning';

export type EmptyStateProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'title'> & {
  actions?: ReactNode;
  alignment?: EmptyStateAlignment;
  description?: ReactNode;
  icon?: ReactNode;
  size?: EmptyStateSize;
  title?: ReactNode;
  tone?: EmptyStateTone;
};
