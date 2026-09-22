import type { HTMLAttributes, ReactNode } from 'react';

export type TooltipPlacement = 'top' | 'right' | 'bottom' | 'left';
export type TooltipSize = 'compact' | 'comfortable';
export type TooltipTone = 'neutral' | 'accent' | 'warning';

export type TooltipProps = Omit<HTMLAttributes<HTMLSpanElement>, 'content'> & {
  children: ReactNode;
  content?: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
  open?: boolean;
  placement?: TooltipPlacement;
  size?: TooltipSize;
  tone?: TooltipTone;
  onOpenChange?: (open: boolean) => void;
};
