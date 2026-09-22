import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '../../inputs';
import { Toast } from './Toast';
import '../OverlayExample.css';
import type { ToastItem, ToastPlacement, ToastTone } from './Toast.types';

export type ToastExampleProps = {
  actionLabel?: string;
  autoDismissMs?: number;
  description?: string;
  maxHeight?: string;
  placement?: ToastPlacement;
  showIcon?: boolean;
  stackLimit?: number;
  title?: string;
  tone?: ToastTone;
  visible?: boolean;
};

const toastToneCycle: ToastTone[] = ['warning', 'positive', 'accent', 'neutral'];

function createToastItem(
  index: number,
  { actionLabel, description, showIcon, title, tone }: Required<Pick<ToastExampleProps, 'actionLabel' | 'description' | 'showIcon' | 'title' | 'tone'>>,
): ToastItem {
  const itemTone = index === 1 ? tone : toastToneCycle[index % toastToneCycle.length];

  return {
    actionLabel,
    description: index === 1 ? description : `${description} #${index}`,
    id: `toast-${index}`,
    showIcon,
    title: index === 1 ? title : `${title} ${index}`,
    tone: itemTone,
  };
}

export function ToastExample({
  actionLabel = 'Review',
  autoDismissMs = 3800,
  description = 'Risk gateway moved exposure limit to watch.',
  maxHeight,
  placement = 'bottom-right',
  showIcon = true,
  stackLimit = 5,
  title = 'Runtime update',
  tone = 'warning',
  visible = true,
}: ToastExampleProps) {
  const toastCounterRef = useRef(visible ? 2 : 0);
  const didSyncToastItemsRef = useRef(false);
  const [toastItems, setToastItems] = useState<ToastItem[]>(() =>
    visible
      ? [
          createToastItem(1, { actionLabel, description, showIcon, title, tone }),
          createToastItem(2, { actionLabel, description, showIcon, title, tone }),
        ]
      : [],
  );
  const createNextToastItems = useCallback((count: number) => {
    const nextItems: ToastItem[] = [];

    for (let itemIndex = 0; itemIndex < count; itemIndex += 1) {
      toastCounterRef.current += 1;
      nextItems.push(createToastItem(toastCounterRef.current, { actionLabel, description, showIcon, title, tone }));
    }

    return nextItems;
  }, [actionLabel, description, showIcon, title, tone]);

  useEffect(() => {
    if (!didSyncToastItemsRef.current) {
      didSyncToastItemsRef.current = true;
      return;
    }

    if (!visible) {
      setToastItems([]);
      return;
    }

    setToastItems(createNextToastItems(2));
  }, [createNextToastItems, visible]);

  function addToast() {
    setToastItems((currentItems) => [...currentItems, ...createNextToastItems(1)]);
  }

  function resetToasts() {
    setToastItems(createNextToastItems(2));
  }

  return (
    <div className="overlay-example-stage overlay-example-stage--contained">
      <div className="overlay-example-actions">
        <Button size="comfortable" variant="primary" onClick={addToast}>
          Add toast
        </Button>
        <Button size="comfortable" variant="secondary" onClick={resetToasts}>
          Reset stack
        </Button>
      </div>
      <Toast
        autoDismissMs={autoDismissMs}
        items={toastItems}
        maxHeight={maxHeight}
        placement={placement}
        presentation="viewport"
        showIcon={showIcon}
        stackLimit={stackLimit}
        tone={tone}
        onDismiss={(item) => {
          setToastItems((currentItems) => currentItems.filter((currentItem) => currentItem.id !== item.id));
        }}
      />
    </div>
  );
}
