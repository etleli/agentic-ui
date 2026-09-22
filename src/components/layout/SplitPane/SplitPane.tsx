import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import '../Layout.css';
import '../../surfaces/BrandWatermark/BrandWatermark.css';
import { clampLayoutValue, getLayoutClassName, getPointerPercent } from '../Layout.utils';
import type { SplitPaneProps } from '../Layout.types';

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
  const [internalSplitPercent, setInternalSplitPercent] = useState(splitPercent ?? defaultSplitPercent);
  const restoredPersistKey = useRef<string | undefined>(undefined);
  const [isDragging, setIsDragging] = useState(false);
  const currentSplitPercent = clampLayoutValue(splitPercent ?? internalSplitPercent, minSplitPercent, maxSplitPercent);
  const paneStyle = {
    ...style,
    '--split-pane-percent': `${currentSplitPercent}%`,
  } as CSSProperties;

  useEffect(() => {
    if (splitPercent !== undefined) {
      setInternalSplitPercent(splitPercent);
    }
  }, [splitPercent]);

  useEffect(() => {
    if (splitPercent !== undefined || !persistKey) {
      restoredPersistKey.current = undefined;
      return;
    }
    if (restoredPersistKey.current === persistKey) {
      return;
    }
    restoredPersistKey.current = persistKey;

    let restoredValue = defaultSplitPercent;
    try {
      const saved = window.localStorage.getItem(`agentic-ui:split-pane:${persistKey}`);
      const parsed = saved?.trim() ? Number(saved) : Number.NaN;
      if (Number.isFinite(parsed)) restoredValue = parsed;
    } catch {
      // Persistence is optional when browser storage is unavailable or denied.
    }
    setInternalSplitPercent(clampLayoutValue(restoredValue, minSplitPercent, maxSplitPercent));
  }, [defaultSplitPercent, maxSplitPercent, minSplitPercent, persistKey, splitPercent]);

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

    setInternalSplitPercent(nextSplitPercent);
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
