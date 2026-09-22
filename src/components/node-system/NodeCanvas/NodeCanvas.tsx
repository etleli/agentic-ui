import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, MouseEvent as ReactMouseEvent, PointerEvent as ReactPointerEvent } from 'react';
import '../NodeSystem.css';
import '../../surfaces/BrandWatermark/BrandWatermark.css';
import type {
  NodeCanvasMode,
  NodeCanvasProps,
  NodeCanvasSelectionRect,
  NodeCanvasShortcutItem,
  NodeCanvasShortcutPosition,
  NodeCanvasVariant,
  NodeFlowDirection,
} from '../NodeSystem.types';
import { NodeCanvasProvider } from './NodeCanvasContext';
import { getNodeCanvasSelectedNodeIds, getNodeCanvasSelectionBounds } from './NodeCanvas.utils';

const defaultSelectionIgnoreSelector =
  '.node-system-node, .node-system-port, .node-system-edge, .node-system-canvas__selection, .node-system-canvas__shortcuts, [data-node-canvas-selection-ignore="true"]';

type NodeCanvasPanState = {
  originX: number;
  originY: number;
  pointerX: number;
  pointerY: number;
};

function getNodeCanvasClassName(className: NodeCanvasProps['className']) {
  return ['node-system-canvas', 'brand-watermark', className].filter(Boolean).join(' ');
}

function isCanvasBackgroundTarget(target: EventTarget | null) {
  return (
    target instanceof Element &&
    !target.closest('.node-system-node, .node-system-port, .node-system-edge, .node-system-canvas__selection, .node-system-canvas__shortcuts')
  );
}

function getNodeCanvasPlanePointFromClient(canvasElement: HTMLDivElement, clientX: number, clientY: number, offsetX: number, offsetY: number, zoom: number) {
  const viewport = canvasElement.querySelector<HTMLDivElement>('.node-system-canvas__viewport');
  const viewportRect = viewport?.getBoundingClientRect();

  if (!viewport || !viewportRect) {
    return undefined;
  }

  return {
    x: (clientX - viewportRect.left + viewport.scrollLeft - offsetX) / zoom,
    y: (clientY - viewportRect.top + viewport.scrollTop - offsetY) / zoom,
  };
}

function isNodeCanvasSelectionTarget(target: EventTarget | null, ignoreSelector: string) {
  return target instanceof Element && !target.closest(ignoreSelector);
}

export function NodeCanvas({
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  children,
  className,
  defaultOffsetX = 0,
  defaultOffsetY = 0,
  editable = true,
  flowDirection = 'horizontal',
  locked = false,
  minHeight = '420px',
  mode = 'select',
  offsetX: controlledOffsetX,
  offsetY: controlledOffsetY,
  pannable = false,
  panButton = 0,
  panDisabled = false,
  panIgnoreSelector = defaultSelectionIgnoreSelector,
  preventCtrlWheel = false,
  planeHeight = 540,
  planeWidth = 860,
  selectionLabel,
  showGrid = true,
  shortcuts,
  shortcutsLabel,
  shortcutsPosition = 'top-left',
  style,
  variant = 'grid',
  zoom = 1,
  onCanvasBackgroundPointerDown,
  onCanvasSelectionCancel,
  onCanvasSelectionEnd,
  onCanvasSelectionStart,
  onContextMenu,
  onPanChange,
  onPanEnd,
  onPanStart,
  onPointerDown,
  onPointerCancel,
  onPointerMove,
  onPointerUp,
  onSelectedNodeIdsChange,
  selectableNodes,
  selectionButton = 2,
  selectionDisabled = false,
  selectionIgnoreSelector = defaultSelectionIgnoreSelector,
  selectionMinHeight = 8,
  selectionMinWidth = 8,
  selectionMode = 'intersect',
  ...canvasProps
}: NodeCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const panStateRef = useRef<NodeCanvasPanState | undefined>(undefined);
  const selectionRectRef = useRef<NodeCanvasSelectionRect | undefined>(undefined);
  const suppressContextMenuRef = useRef(false);
  const [isPanning, setIsPanning] = useState(false);
  const [selectionRect, setSelectionRect] = useState<NodeCanvasSelectionRect | undefined>();
  const [uncontrolledOffset, setUncontrolledOffset] = useState(() => ({ x: defaultOffsetX, y: defaultOffsetY }));
  const offsetX = controlledOffsetX ?? uncontrolledOffset.x;
  const offsetY = controlledOffsetY ?? uncontrolledOffset.y;
  const canvasDataProps = canvasProps as Record<string, unknown>;
  const externalPanning = canvasDataProps['data-panning'] === 'true';
  const externalSelecting = canvasDataProps['data-selecting'] === 'true';
  const canvasStyle = {
    ...style,
    '--node-canvas-min-height': minHeight,
    '--node-canvas-offset-x': `${offsetX}px`,
    '--node-canvas-offset-y': `${offsetY}px`,
    '--node-canvas-plane-height': `${planeHeight}px`,
    '--node-canvas-plane-width': `${planeWidth}px`,
    '--node-canvas-zoom': String(zoom),
  } as CSSProperties;
  const visibleShortcuts = shortcuts?.filter((shortcut) => shortcut.shortcut && shortcut.action) ?? [];
  const panEnabled = !panDisabled && (pannable || mode === 'pan');
  const selectionEnabled = !selectionDisabled && Boolean(selectableNodes && onSelectedNodeIdsChange);
  const selectionBounds = useMemo(() => (selectionRect ? getNodeCanvasSelectionBounds(selectionRect) : undefined), [selectionRect]);

  useEffect(() => {
    const canvasElement = canvasRef.current;

    if (!preventCtrlWheel || !canvasElement) {
      return;
    }

    function preventBrowserCtrlWheel(event: WheelEvent) {
      if (event.ctrlKey) {
        event.preventDefault();
      }
    }

    canvasElement.addEventListener('wheel', preventBrowserCtrlWheel, { passive: false });

    return () => canvasElement.removeEventListener('wheel', preventBrowserCtrlWheel);
  }, [preventCtrlWheel]);

  const consumeContextMenuSuppression = useCallback(() => {
    if (!suppressContextMenuRef.current) {
      return false;
    }

    suppressContextMenuRef.current = false;
    return true;
  }, []);

  function commitPanOffset(offset: { x: number; y: number }, event: ReactPointerEvent<HTMLDivElement>) {
    if (controlledOffsetX === undefined || controlledOffsetY === undefined) {
      setUncontrolledOffset((currentOffset) => ({
        x: controlledOffsetX === undefined ? offset.x : currentOffset.x,
        y: controlledOffsetY === undefined ? offset.y : currentOffset.y,
      }));
    }

    onPanChange?.(offset, { event, ...offset });
  }

  function startPanning(event: ReactPointerEvent<HTMLDivElement>) {
    if (!panEnabled || event.button !== panButton || !isNodeCanvasSelectionTarget(event.target, panIgnoreSelector)) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();

    panStateRef.current = {
      originX: offsetX,
      originY: offsetY,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };

    const offset = { x: offsetX, y: offsetY };

    setIsPanning(true);
    onPanStart?.(offset, { event, ...offset });
    event.currentTarget.setPointerCapture(event.pointerId);

    return true;
  }

  function movePanning(event: ReactPointerEvent<HTMLDivElement>) {
    const panState = panStateRef.current;

    if (!panState) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();

    commitPanOffset(
      {
        x: Math.round(panState.originX + event.clientX - panState.pointerX),
        y: Math.round(panState.originY + event.clientY - panState.pointerY),
      },
      event,
    );

    return true;
  }

  function stopPanning(event: ReactPointerEvent<HTMLDivElement>) {
    const panState = panStateRef.current;

    if (!panState) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();

    const offset = {
      x: Math.round(panState.originX + event.clientX - panState.pointerX),
      y: Math.round(panState.originY + event.clientY - panState.pointerY),
    };

    commitPanOffset(offset, event);
    panStateRef.current = undefined;
    setIsPanning(false);
    onPanEnd?.(offset, { event, ...offset });

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    return true;
  }

  function cancelPanning(event: ReactPointerEvent<HTMLDivElement>) {
    const panState = panStateRef.current;

    if (!panState) {
      return false;
    }

    const offset = {
      x: Math.round(panState.originX + event.clientX - panState.pointerX),
      y: Math.round(panState.originY + event.clientY - panState.pointerY),
    };

    panStateRef.current = undefined;
    setIsPanning(false);
    onPanEnd?.(offset, { event, ...offset });

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    return true;
  }

  function startSelection(event: ReactPointerEvent<HTMLDivElement>) {
    if (!selectionEnabled || event.button !== selectionButton || !isNodeCanvasSelectionTarget(event.target, selectionIgnoreSelector)) {
      return false;
    }

    const planePoint = getNodeCanvasPlanePointFromClient(event.currentTarget, event.clientX, event.clientY, offsetX, offsetY, zoom);

    if (!planePoint) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();
    suppressContextMenuRef.current = false;

    const nextSelectionRect = {
      currentX: planePoint.x,
      currentY: planePoint.y,
      startX: planePoint.x,
      startY: planePoint.y,
    };

    selectionRectRef.current = nextSelectionRect;
    setSelectionRect(nextSelectionRect);
    onCanvasSelectionStart?.({ event, rect: nextSelectionRect });
    event.currentTarget.setPointerCapture(event.pointerId);

    return true;
  }

  function moveSelection(event: ReactPointerEvent<HTMLDivElement>) {
    const activeSelectionRect = selectionRectRef.current;

    if (!activeSelectionRect) {
      return false;
    }

    const planePoint = getNodeCanvasPlanePointFromClient(event.currentTarget, event.clientX, event.clientY, offsetX, offsetY, zoom);

    if (!planePoint) {
      return false;
    }

    event.preventDefault();
    event.stopPropagation();

    const nextSelectionRect = {
      ...activeSelectionRect,
      currentX: planePoint.x,
      currentY: planePoint.y,
    };

    suppressContextMenuRef.current =
      Math.abs(nextSelectionRect.currentX - nextSelectionRect.startX) >= selectionMinWidth ||
      Math.abs(nextSelectionRect.currentY - nextSelectionRect.startY) >= selectionMinHeight;

    selectionRectRef.current = nextSelectionRect;
    setSelectionRect(nextSelectionRect);

    return true;
  }

  function stopSelection(event: ReactPointerEvent<HTMLDivElement>) {
    const activeSelectionRect = selectionRectRef.current;

    if (!activeSelectionRect) {
      return false;
    }

    const bounds = getNodeCanvasSelectionBounds(activeSelectionRect);
    const hasDraggedSelection = bounds.width >= selectionMinWidth || bounds.height >= selectionMinHeight;

    event.preventDefault();
    event.stopPropagation();
    suppressContextMenuRef.current = hasDraggedSelection;

    const selectedNodeIds =
      hasDraggedSelection && selectableNodes
        ? getNodeCanvasSelectedNodeIds(selectableNodes, bounds, {
            minHeight: selectionMinHeight,
            minWidth: selectionMinWidth,
            mode: selectionMode,
          })
        : [];

    if (hasDraggedSelection) {
      const details = { bounds, event, rect: activeSelectionRect };

      onSelectedNodeIdsChange?.(selectedNodeIds, details);
      onCanvasSelectionEnd?.(selectedNodeIds, details);
    }

    selectionRectRef.current = undefined;
    setSelectionRect(undefined);

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    return true;
  }

  function cancelSelection(event: ReactPointerEvent<HTMLDivElement>) {
    if (!selectionRectRef.current) {
      return false;
    }

    selectionRectRef.current = undefined;
    setSelectionRect(undefined);
    suppressContextMenuRef.current = false;
    onCanvasSelectionCancel?.();

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    return true;
  }

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (startSelection(event)) {
      return;
    }

    if (onCanvasBackgroundPointerDown && isCanvasBackgroundTarget(event.target)) {
      onCanvasBackgroundPointerDown(event);
    }

    if (startPanning(event)) {
      return;
    }

    onPointerDown?.(event);
  }

  function handlePointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (moveSelection(event)) {
      return;
    }

    if (movePanning(event)) {
      return;
    }

    onPointerMove?.(event);
  }

  function handlePointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (stopSelection(event)) {
      return;
    }

    if (stopPanning(event)) {
      return;
    }

    onPointerUp?.(event);
  }

  function handlePointerCancel(event: ReactPointerEvent<HTMLDivElement>) {
    if (cancelSelection(event)) {
      return;
    }

    if (cancelPanning(event)) {
      return;
    }

    onPointerCancel?.(event);
  }

  function handleContextMenu(event: ReactMouseEvent<HTMLDivElement>) {
    if (consumeContextMenuSuppression()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onContextMenu?.(event);
  }

  return (
    <div
      {...canvasProps}
      ref={canvasRef}
      className={getNodeCanvasClassName(className)}
      aria-readonly={locked ? true : undefined}
      data-brand-watermark={brandWatermark ? 'true' : undefined}
      data-flow-direction={flowDirection}
      data-editable={editable ? 'true' : 'false'}
      data-grid={showGrid ? 'true' : 'false'}
      data-locked={locked ? 'true' : undefined}
      data-mode={mode}
      data-placement={brandWatermarkPlacement}
      data-pannable={panEnabled ? 'true' : undefined}
      data-panning={isPanning || externalPanning ? 'true' : undefined}
      data-selecting={selectionRect || externalSelecting ? 'true' : undefined}
      data-variant={variant}
      role="application"
      style={canvasStyle}
      onContextMenu={handleContextMenu}
      onPointerCancel={handlePointerCancel}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      <NodeCanvasProvider value={{ consumeContextMenuSuppression, editable }}>
        <div className="node-system-canvas__viewport">
          <div className="node-system-canvas__plane">
            {children}
            {selectionBounds ? (
              <div
                aria-hidden="true"
                className="node-system-canvas__selection-rect"
                style={
                  {
                    '--node-canvas-selection-height': `${selectionBounds.height}px`,
                    '--node-canvas-selection-left': `${selectionBounds.x}px`,
                    '--node-canvas-selection-top': `${selectionBounds.y}px`,
                    '--node-canvas-selection-width': `${selectionBounds.width}px`,
                  } as CSSProperties
                }
              />
            ) : null}
          </div>
        </div>
        {selectionLabel ? <span className="node-system-canvas__selection">{selectionLabel}</span> : null}
        {visibleShortcuts.length > 0 ? (
          <aside
            className="node-system-canvas__shortcuts"
            aria-label={typeof shortcutsLabel === 'string' ? shortcutsLabel : 'Canvas shortcuts'}
            data-position={shortcutsPosition}
          >
            {shortcutsLabel ? <strong>{shortcutsLabel}</strong> : null}
            <dl>
              {visibleShortcuts.map((shortcut) => (
                <div key={shortcut.id}>
                  <dt>{shortcut.shortcut}</dt>
                  <dd>{shortcut.action}</dd>
                </div>
              ))}
            </dl>
          </aside>
        ) : null}
      </NodeCanvasProvider>
    </div>
  );
}

export type { NodeCanvasMode, NodeCanvasProps, NodeCanvasShortcutItem, NodeCanvasShortcutPosition, NodeCanvasVariant, NodeFlowDirection };
