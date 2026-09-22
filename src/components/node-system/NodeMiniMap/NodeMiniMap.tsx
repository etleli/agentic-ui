import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import '../NodeSystem.css';
import type { NodeDensity, NodeMiniMapNode, NodeMiniMapProps, NodeMiniMapVariant, NodeMiniMapViewport, NodeTone } from '../NodeSystem.types';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';
import { getNodeMiniMapProjection } from './NodeMiniMap.utils';

function getMiniMapClassName(className: NodeMiniMapProps['className']) {
  return ['node-system-minimap', className].filter(Boolean).join(' ');
}

function getNodeCenter(node: NodeMiniMapNode) {
  return {
    x: node.x + node.width / 2,
    y: node.y + node.height / 2,
  };
}

function getSafeSize(value: number | undefined, fallback: number) {
  return typeof value === 'number' && Number.isFinite(value) && value > 0 ? value : fallback;
}

function normalizeViewport(viewport: NodeMiniMapViewport | undefined) {
  if (!viewport) {
    return undefined;
  }

  return {
    height: Math.max(1, viewport.height),
    width: Math.max(1, viewport.width),
    x: viewport.x,
    y: viewport.y,
  };
}

function getViewportFromPointer(event: MouseEvent<SVGSVGElement>, canvasWidth: number, canvasHeight: number, viewport: NodeMiniMapViewport | undefined) {
  const bounds = event.currentTarget.getBoundingClientRect();
  const width = viewport?.width ?? canvasWidth * 0.42;
  const height = viewport?.height ?? canvasHeight * 0.42;
  const pointerX = ((event.clientX - bounds.left) / bounds.width) * canvasWidth;
  const pointerY = ((event.clientY - bounds.top) / bounds.height) * canvasHeight;

  return normalizeViewport({
    height,
    width,
    x: pointerX - width / 2,
    y: pointerY - height / 2,
  });
}

export function NodeMiniMap({
  canvasHeight: rawCanvasHeight,
  canvasWidth: rawCanvasWidth,
  className,
  density = 'comfortable',
  edges = [],
  interactive = true,
  nodes,
  selectedNodeId,
  showEdges = true,
  showLabels = false,
  showViewport = true,
  style,
  title = 'Mini map',
  variant = 'panel',
  viewport,
  onNodeSelect,
  onViewportMove,
  ...miniMapProps
}: NodeMiniMapProps) {
  const normalizedViewport = normalizeViewport(viewport);
  const projection = getNodeMiniMapProjection(nodes, normalizedViewport);
  const canvasWidth = getSafeSize(rawCanvasWidth, projection.canvasWidth);
  const canvasHeight = getSafeSize(rawCanvasHeight, projection.canvasHeight);
  const projectedViewport = projection.viewport;
  const nodeMap = new Map(projection.nodes.map((node) => [node.id, node]));
  const originalNodeMap = new Map(nodes.map((node) => [node.id, node]));
  const canSelectNodes = interactive && Boolean(onNodeSelect);
  const canMoveViewport = interactive && Boolean(onViewportMove);
  const miniMapStyle = {
    ...style,
    '--node-minimap-canvas-ratio': `${canvasWidth} / ${canvasHeight}`,
  } as CSSProperties;

  function selectNode(node: NodeMiniMapNode) {
    if (!canSelectNodes || node.disabled) {
      return;
    }

    onNodeSelect?.(node.id, originalNodeMap.get(node.id) ?? node);
  }

  function handleNodeKeyDown(event: KeyboardEvent<SVGGElement>, node: NodeMiniMapNode) {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }

    event.preventDefault();
    selectNode(node);
  }

  function handleMapClick(event: MouseEvent<SVGSVGElement>) {
    if (!canMoveViewport) {
      return;
    }

    const nextViewport = getViewportFromPointer(event, canvasWidth, canvasHeight, projectedViewport);

    if (nextViewport) {
      onViewportMove?.({
        ...nextViewport,
        x: nextViewport.x - projection.origin.x,
        y: nextViewport.y - projection.origin.y,
      });
    }
  }

  return (
    <div
      {...miniMapProps}
      aria-label="Node minimap"
      className={getMiniMapClassName(className)}
      data-density={density}
      data-interactive={interactive ? 'true' : 'false'}
      data-variant={variant}
      role="group"
      style={miniMapStyle}
    >
      {title ? <strong className="node-system-minimap__title">{title}</strong> : null}
      <svg
        className="node-system-minimap__map"
        viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
        role="img"
        aria-label="Node graph overview"
        onClick={handleMapClick}
      >
        <rect className="node-system-minimap__backdrop" x="0" y="0" width={canvasWidth} height={canvasHeight} rx="18" />
        {showEdges
          ? edges.map((edge) => {
              const sourceNode = nodeMap.get(edge.sourceNodeId);
              const targetNode = nodeMap.get(edge.targetNodeId);

              if (!sourceNode || !targetNode) {
                return null;
              }

              const sourceCenter = getNodeCenter(sourceNode);
              const targetCenter = getNodeCenter(targetNode);
              const edgeColor = edge.typeColor ?? (edge.connectionType ? getThemeGeneratedColorForKey(edge.connectionType) : undefined);
              const edgeStyle = edgeColor ? ({ '--node-minimap-edge-color': edgeColor } as CSSProperties) : undefined;

              return (
                <line
                  className="node-system-minimap__edge"
                  data-selected={edge.selected ? 'true' : undefined}
                  data-tone={edge.tone}
                  key={edge.id}
                  style={edgeStyle}
                  x1={sourceCenter.x}
                  x2={targetCenter.x}
                  y1={sourceCenter.y}
                  y2={targetCenter.y}
                />
              );
            })
          : null}
        {projection.nodes.map((node) => {
          const isSelected = node.selected || node.id === selectedNodeId;
          const isSelectable = canSelectNodes && !node.disabled;
          const nodeColor = node.typeColor ?? (node.dataType ? getThemeGeneratedColorForKey(node.dataType) : undefined);

          return (
            <g
              aria-label={node.label ?? node.id}
              className="node-system-minimap__node"
              data-disabled={node.disabled ? 'true' : undefined}
              data-selected={isSelected ? 'true' : undefined}
              data-tone={node.tone}
              data-type={node.dataType}
              key={node.id}
              role={isSelectable ? 'button' : undefined}
              style={nodeColor ? ({ color: nodeColor } as CSSProperties) : undefined}
              tabIndex={isSelectable ? 0 : undefined}
              onClick={(event) => {
                event.stopPropagation();
                selectNode(node);
              }}
              onKeyDown={(event) => handleNodeKeyDown(event, node)}
            >
              <rect x={node.x} y={node.y} width={node.width} height={node.height} rx="12" />
              {showLabels && node.label ? (
                <text x={node.x + node.width / 2} y={node.y + node.height / 2} textAnchor="middle" dominantBaseline="middle">
                  {node.label}
                </text>
              ) : null}
            </g>
          );
        })}
        {showViewport && projectedViewport ? (
          <rect
            className="node-system-minimap__viewport"
            x={projectedViewport.x}
            y={projectedViewport.y}
            width={projectedViewport.width}
            height={projectedViewport.height}
            rx="16"
          />
        ) : null}
      </svg>
    </div>
  );
}

export type { NodeDensity, NodeMiniMapNode, NodeMiniMapProps, NodeMiniMapVariant, NodeMiniMapViewport, NodeTone };
