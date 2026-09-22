import type { HTMLAttributes, ReactNode } from 'react';

export type TextOutputVariant = 'plain' | 'panel' | 'code';

export type TextOutputProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ariaLabel?: string;
  description?: ReactNode;
  emptyText?: string;
  label?: ReactNode;
  maxHeight?: string;
  showCopyAction?: boolean;
  value?: string;
  variant?: TextOutputVariant;
  wrap?: boolean;
};
