import type { HTMLAttributes, ReactNode } from 'react';

export type ToolbarDensity = 'compact' | 'comfortable' | 'spacious';
export type ToolbarJustify = 'start' | 'center' | 'between' | 'end';
export type ToolbarOrientation = 'horizontal' | 'vertical';
export type ToolbarVariant = 'plain' | 'filled' | 'outlined';

export type ToolbarProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  ariaLabel: string;
  children?: ReactNode;
  density?: ToolbarDensity;
  justify?: ToolbarJustify;
  orientation?: ToolbarOrientation;
  variant?: ToolbarVariant;
  wrap?: boolean;
};
