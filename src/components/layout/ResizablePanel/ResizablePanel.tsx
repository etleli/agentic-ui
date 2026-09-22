import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import '../Layout.css';
import '../../surfaces/BrandWatermark/BrandWatermark.css';
import { clampLayoutValue, getLayoutClassName } from '../Layout.utils';
import type { ResizablePanelProps } from '../Layout.types';

function isHorizontalDirection(direction: ResizablePanelProps['direction']) {
  return direction === 'left' || direction === 'right';
}

export function ResizablePanel({
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  children,
  className,
  defaultSize = 360,
  description,
  direction = 'right',
  maxSize = 680,
  minSize = 220,
  persistKey,
  resizable = true,
  size,
  style,
  title = 'Inspector',
  variant = 'default',
  onSizeChange,
  ...panelProps
}: ResizablePanelProps) {
  const dragStartRef = useRef<{ pointer: number; size: number } | null>(null);
  const [internalSize, setInternalSize] = useState(() => {
    if (size !== undefined || !persistKey) {
      return size ?? defaultSize;
    }

    const persistedValue = window.localStorage.getItem(`agentic-ui:resizable-panel:${persistKey}`);
    const parsedValue = Number.parseFloat(persistedValue ?? '');
    return Number.isFinite(parsedValue) ? parsedValue : defaultSize;
  });
  const currentSize = clampLayoutValue(size ?? internalSize, minSize, maxSize);
  const panelStyle = {
    ...style,
    '--resizable-panel-height': `${isHorizontalDirection(direction) ? defaultSize : currentSize}px`,
    '--resizable-panel-width': `${isHorizontalDirection(direction) ? currentSize : defaultSize}px`,
  } as CSSProperties;

  useEffect(() => {
    if (size !== undefined) {
      setInternalSize(size);
    }
  }, [size]);

  function startResize(event: ReactPointerEvent<HTMLButtonElement>) {
    if (!resizable) {
      return;
    }

    event.preventDefault();
    dragStartRef.current = {
      pointer: isHorizontalDirection(direction) ? event.clientX : event.clientY,
      size: currentSize,
    };

    function handlePointerMove(pointerEvent: PointerEvent) {
      const dragStart = dragStartRef.current;

      if (!dragStart) {
        return;
      }

      const currentPointer = isHorizontalDirection(direction) ? pointerEvent.clientX : pointerEvent.clientY;
      const directionMultiplier = direction === 'left' || direction === 'top' ? -1 : 1;
      const nextSize = clampLayoutValue(dragStart.size + (currentPointer - dragStart.pointer) * directionMultiplier, minSize, maxSize);

      setInternalSize(nextSize);
      if (persistKey) {
        window.localStorage.setItem(`agentic-ui:resizable-panel:${persistKey}`, String(nextSize));
      }
      onSizeChange?.(nextSize);
    }

    function stopResize() {
      dragStartRef.current = null;
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', stopResize);
    }

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', stopResize);
  }

  return (
    <aside
      {...panelProps}
      className={getLayoutClassName('resizable-panel brand-watermark', className)}
      data-brand-watermark={brandWatermark ? 'true' : undefined}
      data-direction={direction}
      data-placement={brandWatermarkPlacement}
      data-variant={variant}
      style={panelStyle}
    >
      <header className="resizable-panel__header">
        <span className="resizable-panel__copy">
          {title ? <h3 className="resizable-panel__title">{title}</h3> : null}
          {description ? <span className="resizable-panel__description">{description}</span> : null}
        </span>
      </header>
      <div className="resizable-panel__body">{children}</div>
      {resizable ? (
        <button
          aria-label="Resize panel"
          className="resizable-panel__handle"
          data-direction={direction}
          type="button"
          onPointerDown={startResize}
        />
      ) : null}
    </aside>
  );
}

export type { ResizablePanelProps };
