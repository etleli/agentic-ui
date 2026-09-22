import { useCallback, useMemo, useRef, useState, type PropsWithChildren } from 'react';
import { Toast } from './Toast';
import { ToastContext } from './ToastContext';
import type { ToastContextValue, ToastOptions } from './ToastContext';
import type { ToastItem, ToastPlacement, ToastPresentation, ToastProps } from './Toast.types';

export type ToastProviderProps = PropsWithChildren<{
  autoDismissMs?: ToastProps['autoDismissMs'];
  maxHeight?: ToastProps['maxHeight'];
  placement?: ToastPlacement;
  presentation?: ToastPresentation;
  showIcon?: ToastProps['showIcon'];
  stackLimit?: ToastProps['stackLimit'];
}>;

export function ToastProvider({
  autoDismissMs = 4200,
  children,
  maxHeight,
  placement = 'top-right',
  presentation = 'viewport',
  showIcon = true,
  stackLimit = 5,
}: ToastProviderProps) {
  const toastCounterRef = useRef(0);
  const [items, setItems] = useState<ToastItem[]>([]);

  const dismiss = useCallback((toastId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.id !== toastId));
  }, []);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const notify = useCallback((toast: ToastOptions) => {
    toastCounterRef.current += 1;

    const item: ToastItem = {
      ...toast,
      id: toast.id ?? `toast-${Date.now()}-${toastCounterRef.current}`,
    };

    setItems((currentItems) => [...currentItems, item]);
    return item.id;
  }, []);

  const contextValue = useMemo<ToastContextValue>(
    () => ({
      clear,
      dismiss,
      items,
      notify,
    }),
    [clear, dismiss, items, notify],
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Toast
        autoDismissMs={autoDismissMs}
        items={items}
        maxHeight={maxHeight}
        placement={placement}
        presentation={presentation}
        showIcon={showIcon}
        stackLimit={stackLimit}
        onDismiss={(item) => dismiss(item.id)}
      />
    </ToastContext.Provider>
  );
}
