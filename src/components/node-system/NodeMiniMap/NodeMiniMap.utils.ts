import type { NodeCanvasBounds, NodeMiniMapNode, NodeMiniMapProjection, NodeMiniMapProjectionOptions, NodeMiniMapViewport } from '../NodeSystem.types';

function getContentBounds(nodes: NodeMiniMapNode[], viewport: NodeMiniMapViewport | undefined): NodeCanvasBounds {
  const validNodes = nodes.filter((node) => Number.isFinite(node.x) && Number.isFinite(node.y) && node.width > 0 && node.height > 0);
  const entries = [
    ...validNodes.map((node) => ({ height: node.height, width: node.width, x: node.x, y: node.y })),
    ...(viewport && viewport.width > 0 && viewport.height > 0 ? [viewport] : []),
  ];

  if (entries.length === 0) {
    return { height: 0, width: 0, x: 0, y: 0 };
  }

  const minX = Math.min(...entries.map((entry) => entry.x));
  const minY = Math.min(...entries.map((entry) => entry.y));
  const maxX = Math.max(...entries.map((entry) => entry.x + entry.width));
  const maxY = Math.max(...entries.map((entry) => entry.y + entry.height));

  return { height: Math.max(1, maxY - minY), width: Math.max(1, maxX - minX), x: minX, y: minY };
}

/**
 * Rebases only live graph content (and its current viewport) for minimap
 * rendering. Inputs and outputs are all logical graph coordinates; no
 * synthetic endless-plane dimensions are included.
 */
export function getNodeMiniMapProjection<TNode extends NodeMiniMapNode>(
  nodes: TNode[],
  viewport?: NodeMiniMapViewport,
  { padding = 24 }: NodeMiniMapProjectionOptions = {},
): NodeMiniMapProjection<TNode> {
  const safePadding = Math.max(0, padding);
  const bounds = getContentBounds(nodes, viewport);
  const origin = { x: safePadding - bounds.x, y: safePadding - bounds.y };
  const rebase = <TPoint extends { x: number; y: number }>(point: TPoint): TPoint => ({ ...point, x: point.x + origin.x, y: point.y + origin.y });

  return {
    bounds,
    canvasHeight: Math.max(1, bounds.height + safePadding * 2),
    canvasWidth: Math.max(1, bounds.width + safePadding * 2),
    nodes: nodes.map(rebase),
    origin,
    padding: safePadding,
    viewport: viewport ? rebase(viewport) : undefined,
  };
}
