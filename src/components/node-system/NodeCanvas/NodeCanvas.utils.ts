import type {
  NodeCanvasBounds,
  NodeCanvasDragDelta,
  NodeCanvasDragOrigin,
  NodeCanvasEndlessOriginOptions,
  NodeCanvasExpandPlaneOptions,
  NodeCanvasExpandPlaneResult,
  NodeCanvasFitNode,
  NodeCanvasFitViewport,
  NodeCanvasFitViewOptions,
  NodeCanvasFitViewResult,
  NodeCanvasOrigin,
  NodeCanvasPoint,
  NodeCanvasSelectableNode,
  NodeCanvasSelectionBounds,
  NodeCanvasSelectionMode,
  NodeCanvasSelectionRect,
  NodeCanvasZoomViewOptions,
  NodeCanvasZoomViewResult,
} from '../NodeSystem.types';

function clampNumber(value: number, minValue: number, maxValue: number) {
  return Math.min(Math.max(value, minValue), maxValue);
}

function getNodeCanvasNodeBounds(nodes: NodeCanvasFitNode[]): NodeCanvasBounds {
  const visibleNodes = nodes.filter((node) => node.width > 0 && node.height > 0);

  if (visibleNodes.length === 0) {
    return { height: 0, width: 0, x: 0, y: 0 };
  }

  const minX = Math.min(...visibleNodes.map((node) => node.x));
  const minY = Math.min(...visibleNodes.map((node) => node.y));
  const maxX = Math.max(...visibleNodes.map((node) => node.x + node.width));
  const maxY = Math.max(...visibleNodes.map((node) => node.y + node.height));

  return {
    height: Math.max(1, maxY - minY),
    width: Math.max(1, maxX - minX),
    x: minX,
    y: minY,
  };
}

export function getNodeCanvasFitView(
  nodes: NodeCanvasFitNode[],
  viewport: NodeCanvasFitViewport,
  { maxZoom = 1, minZoom = 0.25, origin = { x: 0, y: 0 }, padding = 48 }: NodeCanvasFitViewOptions = {},
): NodeCanvasFitViewResult {
  const safeViewport = {
    height: Math.max(1, viewport.height),
    width: Math.max(1, viewport.width),
  };
  const safePadding = Math.max(0, padding);
  const safeMinZoom = Math.max(0.05, minZoom);
  const safeMaxZoom = Math.max(safeMinZoom, maxZoom);
  const safeOrigin = { x: Number.isFinite(origin.x) ? origin.x : 0, y: Number.isFinite(origin.y) ? origin.y : 0 };
  const bounds = getNodeCanvasNodeBounds(nodes);

  if (bounds.width === 0 || bounds.height === 0) {
    return {
      bounds: { height: 0, width: 0, x: 0, y: 0 },
      offsetX: 0,
      offsetY: 0,
      scrollX: 0,
      scrollY: 0,
      zoom: clampNumber(1, safeMinZoom, safeMaxZoom),
    };
  }

  const availableWidth = Math.max(1, safeViewport.width - safePadding * 2);
  const availableHeight = Math.max(1, safeViewport.height - safePadding * 2);
  const zoom = clampNumber(Math.min(availableWidth / bounds.width, availableHeight / bounds.height), safeMinZoom, safeMaxZoom);

  return {
    bounds,
    offsetX: Math.round((safeViewport.width - bounds.width * zoom) / 2 - (bounds.x + safeOrigin.x) * zoom),
    offsetY: Math.round((safeViewport.height - bounds.height * zoom) / 2 - (bounds.y + safeOrigin.y) * zoom),
    // The offset is calculated in a zero-scroll viewport. Returning the target
    // explicitly keeps the result apply-ready for already-scrolled canvases.
    scrollX: 0,
    scrollY: 0,
    zoom,
  };
}

export function getNodeCanvasSelectionBounds(rect: NodeCanvasSelectionRect): NodeCanvasSelectionBounds {
  const x = Math.min(rect.startX, rect.currentX);
  const y = Math.min(rect.startY, rect.currentY);

  return {
    height: Math.abs(rect.currentY - rect.startY),
    width: Math.abs(rect.currentX - rect.startX),
    x,
    y,
  };
}

export function doesNodeCanvasSelectionIncludeNode(
  bounds: NodeCanvasSelectionBounds,
  node: NodeCanvasFitNode,
  mode: NodeCanvasSelectionMode = 'intersect',
): boolean {
  if (mode === 'contain') {
    return node.x >= bounds.x && node.y >= bounds.y && node.x + node.width <= bounds.x + bounds.width && node.y + node.height <= bounds.y + bounds.height;
  }

  return node.x < bounds.x + bounds.width && node.x + node.width > bounds.x && node.y < bounds.y + bounds.height && node.y + node.height > bounds.y;
}

export function getNodeCanvasSelectedNodeIds(
  nodes: NodeCanvasSelectableNode[],
  bounds: NodeCanvasSelectionBounds,
  { minHeight = 4, minWidth = 4, mode = 'intersect' }: { minHeight?: number; minWidth?: number; mode?: NodeCanvasSelectionMode } = {},
): string[] {
  if (bounds.width < minWidth && bounds.height < minHeight) {
    return [];
  }

  return nodes.filter((node) => doesNodeCanvasSelectionIncludeNode(bounds, node, mode)).map((node) => node.id);
}

export function getNodeCanvasMovedNodes<TNode extends NodeCanvasSelectableNode>(
  nodes: TNode[],
  selectedNodeIds: string[],
  delta: { x: number; y: number },
): TNode[] {
  const selectedNodeIdSet = new Set(selectedNodeIds);

  return nodes.map((node) =>
    selectedNodeIdSet.has(node.id)
      ? {
          ...node,
          x: Math.round(node.x + delta.x),
          y: Math.round(node.y + delta.y),
        }
      : node,
  );
}

export function getNodeCanvasDragOrigins<TNode extends NodeCanvasSelectableNode>(nodes: TNode[], selectedNodeIds: string[], draggedNodeId: string): NodeCanvasDragOrigin[] {
  const selectedNodeIdSet = new Set(selectedNodeIds);
  const dragNodes = selectedNodeIdSet.has(draggedNodeId) && selectedNodeIds.length > 1 ? nodes.filter((node) => selectedNodeIdSet.has(node.id)) : nodes.filter((node) => node.id === draggedNodeId);

  return dragNodes.map((node) => ({
    id: node.id,
    originX: node.x,
    originY: node.y,
  }));
}

export function getNodeCanvasDraggedNodes<TNode extends NodeCanvasSelectableNode>(
  nodes: TNode[],
  nodeOrigins: NodeCanvasDragOrigin[],
  delta: NodeCanvasDragDelta,
  resolvePosition: (position: { x: number; y: number }, node: TNode, origin: NodeCanvasDragOrigin) => { x: number; y: number } = (position) => ({
    x: Math.round(position.x),
    y: Math.round(position.y),
  }),
): TNode[] {
  if (nodeOrigins.length === 0) {
    return nodes;
  }

  const originLookup = new Map(nodeOrigins.map((origin) => [origin.id, origin]));

  return nodes.map((node) => {
    const origin = originLookup.get(node.id);

    if (!origin) {
      return node;
    }

    const nextPosition = resolvePosition(
      {
        x: origin.originX + delta.x,
        y: origin.originY + delta.y,
      },
      node,
      origin,
    );

    return {
      ...node,
      ...nextPosition,
    };
  });
}

export function getNodeCanvasExpandedPlane(
  nodes: NodeCanvasFitNode[],
  { minHeight = 0, minWidth = 0, padding = 48 }: NodeCanvasExpandPlaneOptions = {},
): NodeCanvasExpandPlaneResult {
  const bounds = getNodeCanvasNodeBounds(nodes);
  const safePadding = Math.max(0, padding);
  const minX = Math.min(0, bounds.x);
  const minY = Math.min(0, bounds.y);
  const maxX = Math.max(minWidth, bounds.x + bounds.width);
  const maxY = Math.max(minHeight, bounds.y + bounds.height);

  return {
    bounds,
    height: Math.max(minHeight, maxY - minY + safePadding),
    width: Math.max(minWidth, maxX - minX + safePadding),
  };
}

export function getNodeCanvasEndlessOrigin(
  nodes: NodeCanvasFitNode[],
  { originX = 0, originY = 0, padding = 48 }: NodeCanvasEndlessOriginOptions = {},
): NodeCanvasOrigin {
  const safeOriginX = Math.max(0, originX);
  const safeOriginY = Math.max(0, originY);
  const safePadding = Math.max(0, padding);
  const bounds = getNodeCanvasNodeBounds(nodes);

  if (bounds.width === 0 || bounds.height === 0) {
    return { x: safeOriginX, y: safeOriginY };
  }

  return {
    x: bounds.x < safePadding - safeOriginX ? Math.abs(bounds.x) + safePadding : safeOriginX,
    y: bounds.y < safePadding - safeOriginY ? Math.abs(bounds.y) + safePadding : safeOriginY,
  };
}

export function getNodeCanvasRenderedNodes<TNode extends NodeCanvasFitNode>(nodes: TNode[], origin: NodeCanvasOrigin): TNode[] {
  if (origin.x === 0 && origin.y === 0) {
    return nodes;
  }

  return nodes.map(
    (node) =>
      ({
        ...node,
        x: node.x + origin.x,
        y: node.y + origin.y,
      }) as TNode,
  );
}

export function getNodeCanvasLogicalPoint<TPoint extends NodeCanvasPoint>(point: TPoint, origin: NodeCanvasOrigin): TPoint {
  return {
    ...point,
    x: point.x - origin.x,
    y: point.y - origin.y,
  };
}

export function getNodeCanvasEndlessPlane(
  nodes: NodeCanvasFitNode[],
  origin: NodeCanvasOrigin,
  { minHeight = 0, minWidth = 0, padding = 48 }: NodeCanvasExpandPlaneOptions = {},
): NodeCanvasExpandPlaneResult {
  const safePadding = Math.max(0, padding);

  return getNodeCanvasExpandedPlane(nodes, {
    minHeight: minHeight + origin.y * 2 + safePadding,
    minWidth: minWidth + origin.x * 2 + safePadding,
    padding: safePadding,
  });
}

export function getNodeCanvasZoomView({
  currentOffsetX,
  currentOffsetY,
  currentZoom,
  delta,
  maxZoom = 1.45,
  minZoom = 0.55,
  pointerX,
  pointerY,
  scrollX = 0,
  scrollY = 0,
}: NodeCanvasZoomViewOptions): NodeCanvasZoomViewResult {
  const safeMinZoom = Math.max(0.05, minZoom);
  const safeMaxZoom = Math.max(safeMinZoom, maxZoom);
  const safeCurrentZoom = clampNumber(currentZoom, safeMinZoom, safeMaxZoom);
  const nextZoom = clampNumber(Number((safeCurrentZoom + delta).toFixed(2)), safeMinZoom, safeMaxZoom);

  return {
    offsetX: Math.round(pointerX + scrollX - ((pointerX + scrollX - currentOffsetX) / safeCurrentZoom) * nextZoom),
    offsetY: Math.round(pointerY + scrollY - ((pointerY + scrollY - currentOffsetY) / safeCurrentZoom) * nextZoom),
    zoom: nextZoom,
  };
}
