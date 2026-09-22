import '../NodeSystem.css';
import type { NodeEdgeAnimation, NodeEdgePath, NodeEdgeProps, NodePortSide, NodeTone } from '../NodeSystem.types';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';

function getNodeEdgeClassName(className: NodeEdgeProps['className']) {
  return ['node-system-edge', className].filter(Boolean).join(' ');
}

function getSideVector(side: NodePortSide | undefined) {
  if (side === 'left') {
    return { x: -1, y: 0 };
  }

  if (side === 'right') {
    return { x: 1, y: 0 };
  }

  if (side === 'top') {
    return { x: 0, y: -1 };
  }

  if (side === 'bottom') {
    return { x: 0, y: 1 };
  }

  return undefined;
}

function getEdgePath(path: NodeEdgePath, fromX: number, fromY: number, toX: number, toY: number, fromSide?: NodePortSide, toSide?: NodePortSide) {
  if (path === 'straight') {
    return `M ${fromX} ${fromY} L ${toX} ${toY}`;
  }

  const midpointX = fromX + (toX - fromX) / 2;

  if (path === 'step') {
    return `M ${fromX} ${fromY} H ${midpointX} V ${toY} H ${toX}`;
  }

  const fromVector = getSideVector(fromSide);
  const toVector = getSideVector(toSide);
  const deltaX = toX - fromX;
  const deltaY = toY - fromY;
  const handleDistance = Math.max(48, Math.min(180, Math.hypot(deltaX, deltaY) * 0.42));

  if (fromVector && toVector) {
    return `M ${fromX} ${fromY} C ${fromX + fromVector.x * handleDistance} ${fromY + fromVector.y * handleDistance}, ${toX + toVector.x * handleDistance} ${toY + toVector.y * handleDistance}, ${toX} ${toY}`;
  }

  const direction = deltaX >= 0 ? 1 : -1;
  return `M ${fromX} ${fromY} C ${fromX + handleDistance * direction} ${fromY}, ${toX - handleDistance * direction} ${toY}, ${toX} ${toY}`;
}

function normalizeEdgeAnimation(animationStyle: NodeEdgeProps['animationStyle'] | string | undefined): NodeEdgeAnimation {
  if (animationStyle === 'pulse' || animationStyle === 'trace') {
    return animationStyle;
  }

  return 'flow';
}

export function NodeEdge({
  animationStyle = 'flow',
  animated = false,
  canvasHeight = 540,
  canvasWidth = 860,
  className,
  connectionType,
  fromX,
  fromY,
  fromSide,
  label,
  path = 'smooth',
  selected = false,
  style,
  toX,
  toY,
  toSide,
  tone = 'accent',
  typeColor,
  ...edgeProps
}: NodeEdgeProps) {
  const d = getEdgePath(path, fromX, fromY, toX, toY, fromSide, toSide);
  const normalizedAnimationStyle = normalizeEdgeAnimation(animationStyle);
  const labelX = fromX + (toX - fromX) / 2;
  const labelY = fromY + (toY - fromY) / 2 - 8;
  const isInteractive = Boolean(edgeProps.onClick || edgeProps.onPointerDown || edgeProps.onPointerUp);
  const connectionColor = typeColor ?? (connectionType ? getThemeGeneratedColorForKey(connectionType) : undefined);
  const edgeStyle = {
    ...style,
    height: `${canvasHeight}px`,
    width: `${canvasWidth}px`,
    ...(connectionColor ? { '--node-edge-color': connectionColor } : {}),
  };

  return (
    <svg
      {...edgeProps}
      aria-hidden={label ? undefined : true}
      aria-label={label ? `Connection ${label}` : undefined}
      className={getNodeEdgeClassName(className)}
      data-animation={animated ? normalizedAnimationStyle : undefined}
      data-animated={animated ? 'true' : undefined}
      data-connection-type={connectionType}
      data-interactive={isInteractive ? 'true' : undefined}
      data-selected={selected ? 'true' : undefined}
      data-tone={tone}
      role={label ? 'img' : undefined}
      style={edgeStyle}
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
    >
      {isInteractive ? <path className="node-system-edge__hit" d={d} /> : null}
      <path className="node-system-edge__path" d={d} />
      {animated ? (
        <path className="node-system-edge__flow" d={d} pathLength={normalizedAnimationStyle === 'flow' ? undefined : 1} />
      ) : null}
      {label ? (
        <text className="node-system-edge__label" x={labelX} y={labelY} textAnchor="middle">
          {label}
        </text>
      ) : null}
    </svg>
  );
}

export type { NodeEdgeAnimation, NodeEdgePath, NodeEdgeProps, NodeTone };
