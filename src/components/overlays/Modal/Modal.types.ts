import type { HTMLAttributes, ReactNode } from 'react';
import type { UnavailableActionSource } from '../../inputs/UnavailableAction';

export type ModalPresentation = 'contained' | 'viewport';
export type ModalSize = 'compact' | 'comfortable' | 'spacious' | 'large' | 'extra-large' | 'full';
export type ModalConfirmVariant = 'primary' | 'danger';

export type ModalProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  cancelLabel?: string;
  children?: ReactNode;
  confirmDisabled?: boolean;
  confirmLabel?: string;
  /** Keeps the confirmation reachable while explaining why it cannot yet run. */
  confirmUnavailableReason?: ReactNode;
  confirmVariant?: ModalConfirmVariant;
  defaultOpen?: boolean;
  description?: ReactNode;
  open?: boolean;
  presentation?: ModalPresentation;
  showConfirm?: boolean;
  showClose?: boolean;
  size?: ModalSize;
  title?: ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
  onConfirmUnavailable?: (source: UnavailableActionSource) => void;
  onOpenChange?: (open: boolean) => void;
};
