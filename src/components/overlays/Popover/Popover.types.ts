import type { HTMLAttributes, ReactNode } from 'react';

export type PopoverPlacement = 'top' | 'right' | 'bottom' | 'left';
export type PopoverSize = 'compact' | 'comfortable' | 'spacious';

export type PopoverProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  children?: ReactNode;
  defaultOpen?: boolean;
  description?: ReactNode;
  footer?: ReactNode;
  open?: boolean;
  panelClassName?: string;
  placement?: PopoverPlacement;
  size?: PopoverSize;
  title?: ReactNode;
  trigger?: ReactNode;
  triggerLabel?: string;
  onOpenChange?: (open: boolean) => void;
};
