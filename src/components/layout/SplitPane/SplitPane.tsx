import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import '../Layout.css';
import '../../surfaces/BrandWatermark/BrandWatermark.css';
import { clampLayoutValue, getLayoutClassName, getPointerPercent } from '../Layout.utils';
import type { SplitPaneProps } from '../Layout.types';

const subscribeToInitialSize = () => () => undefined;
const serverSize = () => undefined;

function readPersistedSize(key: string | undefined) {
  if (!key || typeof window === 'undefined') return undefined;
  try {
    const stored = window.localStorage.getItem(`agentic-ui:split-pane:${key}`);
    const value = stored?.trim() ? Number(stored) : Number.NaN;
    return Number.isFinite(value) ? value : undefined;
  } catch {
    return undefined;
  }
}

export function SplitPane({
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  className,
  defaultSplitPercent = 42,
  first,
  maxSplitPercent = 82,
  minSplitPercent = 18,
  orientation = 'horizontal',
  persistKey,
  resizable = true,
  second,
  splitPercent,
  style,
  variant = 'default',
  onSplitPercentChange,
  ...paneProps
}: SplitPaneProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [initialDefault] = useState(defaultSplitPercent);
  const [requestedSize, setRequestedSize] = useState<{ key?: string; value: number }>();
  // Client mounts read storage immediately. Hydration uses the server snapshot first.
  const persistedSize = useSyncExternalStore(subscribeToInitialSize,
    () => splitPercent === undefined ? readPersistedSize(persistKey) : undefined, serverSize);
  const [isDragging, setIsDragging] = useState(false);
  const currentRequest = requestedSize?.key === persistKey ? requestedSize?.value : undefined;
  const currentSplitPercent = clampLayoutValue(splitPercent ?? currentRequest ?? persistedSize ?? (persistKey ? defaultSplitPercent : initialDefault), minSplitPercent, maxSplitPercent);
  const paneStyle = {
    ...style,
    '--split-pane-percent': `${currentSplitPercent}%`,
  } as CSSProperties;

  useEffect(() => {
    if (splitPercent !== undefined && !persistKey) {
      setRequestedSize({ value: splitPercent });
    }
  }, [persistKey, splitPercent]);

  function updateSplitFromPointer(clientX: number, clientY: number) {
    const rect = rootRef.current?.getBoundingClientRect();

    if (!rect) {
      return;
    }

    const rawPercent =
      orientation === 'horizontal'
        ? getPointerPercent(clientX, rect.left, rect.width)
        : getPointerPercent(clientY, rect.top, rect.height);
    const nextSplitPercent = clampLayoutValue(rawPercent, minSplitPercent, maxSplitPercent);

    setRequestedSize({ key: persistKey, value: nextSplitPercent });
    if (persistKey) {
      try {
        window.localStorage.setItem(`agentic-ui:split-pane:${persistKey}`, String(nextSplitPercent));
      } catch {
        // A storage failure must not prevent resizing or its callback.
      }
    }
    onSplitPercentChange?.(nextSplitPercent);
  }

  function startDrag(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!resizable) {
      return;
    }

    event.preventDefault();
    setIsDragging(true);
    updateSplitFromPointer(event.clientX, event.clientY);

    function handlePointerMove(pointerEvent: PointerEvent) {
      updateSplitFromPointer(pointerEvent.clientX, pointerEvent.clientY);
    }

    function stopDrag() {
      setIsDragging(false);
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', stopDrag);
    }

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', stopDrag);
  }

  return (
    <div
      {...paneProps}
      className={getLayoutClassName('split-pane', className)}
      data-dragging={isDragging ? 'true' : undefined}
      data-orientation={orientation}
      data-variant={variant}
      ref={rootRef}
      style={paneStyle}
    >
      <section className="split-pane__pane split-pane__pane--first">{first}</section>
      <button
        aria-label="Resize panes"
        className="split-pane__handle"
        disabled={!resizable}
        type="button"
        onPointerDown={startDrag}
      />
      <section
        className="split-pane__pane split-pane__pane--second brand-watermark"
        data-brand-watermark={brandWatermark ? 'true' : undefined}
        data-placement={brandWatermarkPlacement}
      >
        {second}
      </section>
    </div>
  );
}

export type { SplitPaneProps };
