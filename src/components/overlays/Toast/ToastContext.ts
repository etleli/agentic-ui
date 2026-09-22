import { createContext, useContext } from 'react';
import type { ToastItem } from './Toast.types';

export type ToastOptions = Omit<ToastItem, 'id'> & {
  id?: string;
};

export type ToastContextValue = {
  clear: () => void;
  dismiss: (toastId: string) => void;
  items: ToastItem[];
  notify: (toast: ToastOptions) => string;
};

export const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast(): ToastContextValue {
  const contextValue = useContext(ToastContext);

  if (!contextValue) {
    throw new Error('useToast must be used within a ToastProvider.');
  }

  return contextValue;
}
