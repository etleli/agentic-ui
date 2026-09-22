import type { HTMLAttributes, ReactNode } from 'react';

export type DividerInset = 'none' | 'start' | 'both';
export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerTone = 'default' | 'muted' | 'strong';

export type DividerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  inset?: DividerInset;
  label?: ReactNode;
  orientation?: DividerOrientation;
  tone?: DividerTone;
};
