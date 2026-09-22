import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { OverlayPortal } from '../overlayPortal';
import { Tooltip } from '../Tooltip';
import { getOverlayMotionDurationMs } from '../overlayPresence';
import './Toast.css';
import type { ToastItem, ToastPlacement, ToastPresentation, ToastProps, ToastTone } from './Toast.types';

const DEFAULT_TOAST_ID = '__single_toast__';
const DEFAULT_STACK_LIMIT = 5;

type RenderedToastItem = ToastItem & {
  isVisible: boolean;
  order: number;
};

function getToastClassName(className: ToastProps['className']) {
  return ['toast-region', className].filter(Boolean).join(' ');
}

function getToastIcon(tone: ToastTone) {
  if (tone === 'positive') {
    return <CheckCircle2 size={17} aria-hidden="true" />;
  }

  if (tone === 'negative') {
    return <XCircle size={17} aria-hidden="true" />;
  }

  if (tone === 'warning') {
    return <AlertTriangle size={17} aria-hidden="true" />;
  }

  return <Info size={17} aria-hidden="true" />;
}

function isBottomPlacement(placement: ToastPlacement): boolean {
  return placement.startsWith('bottom');
}

function getToastSourceSignature(items: ToastItem[]): string {
  return items
    .map((item) => [item.id, item.actionLabel ?? '', item.description ?? '', item.showIcon ?? '', item.title ?? '', item.tone ?? ''].join('\u0001'))
    .join('\u0002');
}

function ToastEntry({
  item,
  showIcon,
  onDismiss,
  onRegisterElement,
}: {
  item: RenderedToastItem;
  showIcon: boolean;
  onDismiss: (item: ToastItem) => void;
  onRegisterElement: (itemId: string, element: HTMLElement | null) => void;
}) {
  const tone = item.tone ?? 'neutral';
  const shouldShowIcon = item.showIcon ?? showIcon;

  return (
    <div
      className="toast-region__toast-frame"
      data-state={item.isVisible ? 'open' : 'closed'}
      ref={(node) => onRegisterElement(item.id, node)}
    >
      <section
        className="toast-region__toast"
        data-state={item.isVisible ? 'open' : 'closed'}
        data-tone={tone}
        role={tone === 'negative' ? 'alert' : 'status'}
      >
        {shouldShowIcon ? <span className="toast-region__icon">{getToastIcon(tone)}</span> : null}
        <span className="toast-region__copy">
          {item.title ? <strong>{item.title}</strong> : null}
          {item.description ? <span>{item.description}</span> : null}
        </span>
        {item.actionLabel ? (
          <button className="toast-region__action" type="button" onClick={item.onAction}>
            {item.actionLabel}
          </button>
        ) : null}
        <Tooltip className="toast-region__close-tooltip" content="Dismiss notification" placement="left" size="compact">
          <button className="toast-region__close" type="button" aria-label="Dismiss notification" onClick={() => onDismiss(item)}>
            <X size={15} aria-hidden="true" />
          </button>
        </Tooltip>
      </section>
    </div>
  );
}

export function Toast({
  actionLabel,
  autoDismissMs = 0,
  className,
  defaultVisible = true,
  description,
  items,
  maxHeight,
  onAction,
  onDismiss,
  onVisibleChange,
  placement = 'bottom-right',
  presentation = 'viewport',
  showIcon = true,
  stackLimit = DEFAULT_STACK_LIMIT,
  style,
  title,
  tone = 'neutral',
  visible,
  ...toastProps
}: ToastProps) {
  const toastRefs = useRef<Map<string, HTMLElement>>(new Map());
  const previousToastRectsRef = useRef<Map<string, DOMRect>>(new Map());
  const [internalVisible, setInternalVisible] = useState(defaultVisible);
  const [dismissedItemIds, setDismissedItemIds] = useState<Set<string>>(new Set());
  const isControlled = visible !== undefined;
  const isVisible = isControlled ? visible : internalVisible;
  const hasExternalItems = items !== undefined;

  const updateVisible = useCallback((nextVisible: boolean) => {
    if (!isControlled) {
      setInternalVisible(nextVisible);
    }

    onVisibleChange?.(nextVisible);
  }, [isControlled, onVisibleChange]);

  const baseItems = useMemo<ToastItem[]>(
    () =>
      items ?? [
        {
          actionLabel,
          description,
          id: DEFAULT_TOAST_ID,
          onAction,
          showIcon,
          title,
          tone,
        },
      ],
    [actionLabel, description, items, onAction, showIcon, title, tone],
  );
  const baseItemIds = useMemo(() => new Set(baseItems.map((item) => item.id)), [baseItems]);
  const baseItemOrder = useMemo(() => new Map(baseItems.map((item, itemIndex) => [item.id, itemIndex])), [baseItems]);
  const safeStackLimit = Math.max(1, Math.trunc(stackLimit));
  const [retiredItemIds, setRetiredItemIds] = useState<Set<string>>(new Set());
  const overflowItemIds = useMemo(
    () => baseItems.slice(0, Math.max(0, baseItems.length - safeStackLimit)).map((item) => item.id),
    [baseItems, safeStackLimit],
  );
  const limitedItems = useMemo(() => {
    return baseItems.slice(Math.max(0, baseItems.length - safeStackLimit));
  }, [baseItems, safeStackLimit]);
  const sourceItems = useMemo(
    () =>
      hasExternalItems
        ? limitedItems.filter((item) => !dismissedItemIds.has(item.id) && !retiredItemIds.has(item.id))
        : isVisible
          ? limitedItems.filter((item) => !retiredItemIds.has(item.id))
          : [],
    [dismissedItemIds, hasExternalItems, isVisible, limitedItems, retiredItemIds],
  );
  const sourceItemsRef = useRef(sourceItems);
  const onDismissRef = useRef(onDismiss);
  const updateVisibleRef = useRef(updateVisible);
  const hasExternalItemsRef = useRef(hasExternalItems);
  const sourceSignature = useMemo(() => getToastSourceSignature(sourceItems), [sourceItems]);
  const nextAutoDismissItemId = sourceItems[0]?.id;
  const [renderedItems, setRenderedItems] = useState<RenderedToastItem[]>(() =>
    sourceItems.map((item, itemIndex) => ({ ...item, isVisible: true, order: baseItemOrder.get(item.id) ?? itemIndex })),
  );
  const toastStyle = useMemo<CSSProperties | undefined>(() => {
    if (!maxHeight) {
      return style;
    }

    return { ...style, '--toast-stack-max-height': maxHeight } as CSSProperties;
  }, [maxHeight, style]);
  const orderedRenderedItems = useMemo(
    () => (isBottomPlacement(placement) ? [...renderedItems].reverse() : renderedItems),
    [placement, renderedItems],
  );
  const orderedRenderedSignature = orderedRenderedItems.map((item) => `${item.id}:${item.isVisible ? 'open' : 'closed'}`).join('|');
  const exitingItemSignature = renderedItems
    .filter((item) => !item.isVisible)
    .map((item) => item.id)
    .join('|');

  useEffect(() => {
    sourceItemsRef.current = sourceItems;
  }, [sourceItems]);

  useEffect(() => {
    onDismissRef.current = onDismiss;
    updateVisibleRef.current = updateVisible;
    hasExternalItemsRef.current = hasExternalItems;
  }, [hasExternalItems, onDismiss, updateVisible]);

  useEffect(() => {
    setDismissedItemIds((currentIds) => {
      const nextIds = new Set([...currentIds].filter((itemId) => baseItemIds.has(itemId)));
      return nextIds.size === currentIds.size ? currentIds : nextIds;
    });
  }, [baseItemIds]);

  useEffect(() => {
    setRetiredItemIds((currentIds) => {
      const nextIds = new Set([...currentIds].filter((itemId) => baseItemIds.has(itemId)));

      overflowItemIds.forEach((itemId) => nextIds.add(itemId));

      if (nextIds.size !== currentIds.size) {
        return nextIds;
      }

      for (const itemId of nextIds) {
        if (!currentIds.has(itemId)) {
          return nextIds;
        }
      }

      return currentIds;
    });
  }, [baseItemIds, overflowItemIds]);

  useEffect(() => {
    setRenderedItems((currentItems) => {
      const sourceItemMap = new Map(sourceItems.map((item) => [item.id, item]));
      const renderedIdSet = new Set(currentItems.map((item) => item.id));
      const nextItems = currentItems.map((item) => {
        const sourceItem = sourceItemMap.get(item.id);
        const nextOrder = baseItemOrder.get(item.id) ?? item.order;

        return sourceItem ? { ...sourceItem, isVisible: true, order: nextOrder } : { ...item, isVisible: false, order: nextOrder };
      });

      sourceItems.forEach((item) => {
        if (!renderedIdSet.has(item.id)) {
          nextItems.push({ ...item, isVisible: true, order: baseItemOrder.get(item.id) ?? nextItems.length });
        }
      });

      return nextItems.sort((firstItem, secondItem) => firstItem.order - secondItem.order);
    });
  }, [baseItemOrder, sourceItems, sourceSignature]);

  useEffect(() => {
    if (!exitingItemSignature) {
      return undefined;
    }

    const duration = getOverlayMotionDurationMs();

    if (duration === 0) {
      setRenderedItems((currentItems) => currentItems.filter((item) => item.isVisible));
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setRenderedItems((currentItems) => currentItems.filter((item) => item.isVisible));
    }, duration);

    return () => window.clearTimeout(timeoutId);
  }, [exitingItemSignature]);

  useLayoutEffect(() => {
    const currentRects = new Map<string, DOMRect>();

    toastRefs.current.forEach((element, itemId) => {
      if (element.isConnected) {
        currentRects.set(itemId, element.getBoundingClientRect());
      }
    });

    const duration = getOverlayMotionDurationMs();
    const previousRects = previousToastRectsRef.current;

    if (duration > 0) {
      currentRects.forEach((currentRect, itemId) => {
        const previousRect = previousRects.get(itemId);
        const element = toastRefs.current.get(itemId);

        if (!previousRect || !element) {
          return;
        }

        const deltaY = previousRect.top - currentRect.top;

        if (Math.abs(deltaY) < 1) {
          return;
        }

        element.animate(
          [
            { transform: `translateY(${deltaY}px)` },
            { transform: 'translateY(0)' },
          ],
          {
            duration,
            easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
          },
        );
      });
    }

    previousToastRectsRef.current = currentRects;
  }, [orderedRenderedSignature]);

  const dismissToast = useCallback((item: ToastItem) => {
    setDismissedItemIds((currentIds) => new Set(currentIds).add(item.id));
    onDismissRef.current?.(item);

    if (!hasExternalItemsRef.current) {
      updateVisibleRef.current(false);
    }
  }, []);

  useEffect(() => {
    if (!nextAutoDismissItemId || autoDismissMs <= 0) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      const item = sourceItemsRef.current.find((sourceItem) => sourceItem.id === nextAutoDismissItemId);

      if (item) {
        dismissToast(item);
      }
    }, autoDismissMs);

    return () => window.clearTimeout(timeoutId);
  }, [autoDismissMs, dismissToast, nextAutoDismissItemId]);

  const registerToastElement = useCallback((itemId: string, element: HTMLElement | null) => {
    if (element) {
      toastRefs.current.set(itemId, element);
      return;
    }

    toastRefs.current.delete(itemId);
  }, []);

  if (renderedItems.length === 0 && sourceItems.length === 0) {
    return null;
  }

  const toast = (
    <div {...toastProps} className={getToastClassName(className)} data-placement={placement} data-presentation={presentation} style={toastStyle}>
      <div className="toast-region__stack">
        {orderedRenderedItems.map((item) => (
          <ToastEntry
            item={item}
            key={item.id}
            showIcon={showIcon}
            onDismiss={dismissToast}
            onRegisterElement={registerToastElement}
          />
        ))}
      </div>
    </div>
  );

  return presentation === 'viewport' ? <OverlayPortal>{toast}</OverlayPortal> : toast;
}

export type { ToastItem, ToastPlacement, ToastPresentation, ToastProps, ToastTone };
