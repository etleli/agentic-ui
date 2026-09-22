import type { HTMLAttributes } from 'react';

export type ToastPlacement = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
export type ToastPresentation = 'contained' | 'viewport';
export type ToastTone = 'neutral' | 'accent' | 'positive' | 'negative' | 'warning';

export type ToastItem = {
  actionLabel?: string;
  description?: string;
  id: string;
  showIcon?: boolean;
  title?: string;
  tone?: ToastTone;
  onAction?: () => void;
};

export type ToastProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  actionLabel?: string;
  autoDismissMs?: number;
  defaultVisible?: boolean;
  description?: string;
  items?: ToastItem[];
  maxHeight?: string;
  placement?: ToastPlacement;
  presentation?: ToastPresentation;
  showIcon?: boolean;
  stackLimit?: number;
  title?: string;
  tone?: ToastTone;
  visible?: boolean;
  onAction?: () => void;
  onDismiss?: (item: ToastItem) => void;
  onVisibleChange?: (visible: boolean) => void;
};
