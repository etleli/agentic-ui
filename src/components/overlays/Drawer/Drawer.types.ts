import type { HTMLAttributes, ReactNode } from 'react';

export type DrawerPlacement = 'left' | 'right' | 'bottom';
export type DrawerPresentation = 'contained' | 'viewport';
export type DrawerSize = 'compact' | 'comfortable' | 'spacious';

export type DrawerProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  children?: ReactNode;
  defaultOpen?: boolean;
  description?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  placement?: DrawerPlacement;
  presentation?: DrawerPresentation;
  showClose?: boolean;
  size?: DrawerSize;
  title?: ReactNode;
  onOpenChange?: (open: boolean) => void;
};
