import type { CSSProperties, KeyboardEvent, MouseEvent } from 'react';
import { useNodeCanvasContext } from '../NodeCanvas/NodeCanvasContext';
import { NodePort } from '../NodePort';
import '../NodeSystem.css';
import type { NodeBodyOverflow, NodeDensity, NodeFlowDirection, NodePortItem, NodeProps, NodeTone } from '../NodeSystem.types';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';

function getNodeClassName(className: NodeProps['className']) {
  return ['node-system-node', className].filter(Boolean).join(' ');
}

function getPortCount(ports: NodePortItem[], side: NodePortItem['side']) {
  return ports.filter((port) => port.side === side).length;
}

function getPortIndex(ports: NodePortItem[], port: NodePortItem) {
  return ports.filter((candidate) => candidate.side === port.side).findIndex((candidate) => candidate.id === port.id);
}

function getPrimaryDataType(ports: NodePortItem[]) {
  return ports.find((port) => port.direction === 'output' && port.type)?.type ?? ports.find((port) => port.type)?.type;
}

export function Node({
  bodyOverflow = 'hidden',
  children,
  className,
  dataType,
  density = 'comfortable',
  disabled = false,
  flowDirection = 'horizontal',
  height,
  onClick,
  onContextMenu,
  onKeyDown,
  onPortPointerDown,
  onPortPointerMove,
  onPortPointerUp,
  ports = [],
  selected = false,
  statusLabel,
  style,
  subtitle,
  title,
  tone = 'neutral',
  typeColor,
  width = 220,
  x = 0,
  y = 0,
  ...nodeProps
}: NodeProps) {
  const { consumeContextMenuSuppression } = useNodeCanvasContext();
  const isClickable = Boolean(onClick) && !disabled;
  const primaryDataType = dataType ?? getPrimaryDataType(ports);
  const nodeTypeColor = typeColor ?? (primaryDataType ? getThemeGeneratedColorForKey(primaryDataType) : undefined);
  const nodeStyle = {
    ...style,
    ...(height !== undefined ? { '--node-height': typeof height === 'number' ? `${height}px` : height } : {}),
    ...(nodeTypeColor ? { '--node-type-color': nodeTypeColor } : {}),
    '--node-width': typeof width === 'number' ? `${width}px` : width,
    '--node-x': `${x}px`,
    '--node-y': `${y}px`,
  } as CSSProperties;

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    onKeyDown?.(event);

    if (!isClickable || event.defaultPrevented) {
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.currentTarget.click();
    }
  }

  function handleContextMenu(event: MouseEvent<HTMLDivElement>) {
    if (consumeContextMenuSuppression()) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onContextMenu?.(event);
  }

  return (
    <div
      {...nodeProps}
      aria-disabled={disabled ? true : undefined}
      aria-selected={selected ? true : undefined}
      className={getNodeClassName(className)}
      data-clickable={isClickable ? 'true' : undefined}
      data-body-overflow={bodyOverflow}
      data-density={density}
      data-disabled={disabled ? 'true' : undefined}
      data-flow-direction={flowDirection}
      data-selected={selected ? 'true' : undefined}
      data-tone={tone}
      data-type={primaryDataType}
      role={isClickable ? 'button' : 'group'}
      style={nodeStyle}
      tabIndex={isClickable ? 0 : undefined}
      onClick={disabled ? undefined : onClick}
      onContextMenu={handleContextMenu}
      onKeyDown={handleKeyDown}
    >
      {ports.length > 0 ? (
        <span className="node-system-node__ports">
          {ports.map((port) => (
            <NodePort
              connected={port.connected}
              count={getPortCount(ports, port.side)}
              color={port.color}
              direction={port.direction}
              disabled={disabled || port.disabled}
              index={getPortIndex(ports, port)}
              key={port.id}
              label={port.label}
              side={port.side}
              tone={port.tone ?? tone}
              type={port.type}
              onPointerDown={onPortPointerDown ? (event) => onPortPointerDown(event, port) : undefined}
              onPointerMove={onPortPointerMove ? (event) => onPortPointerMove(event, port) : undefined}
              onPointerUp={onPortPointerUp ? (event) => onPortPointerUp(event, port) : undefined}
            />
          ))}
        </span>
      ) : null}

      <header className="node-system-node__header">
        <span className="node-system-node__copy">
          <strong className="node-system-node__title">{title}</strong>
          {subtitle ? <span className="node-system-node__subtitle">{subtitle}</span> : null}
        </span>
        {statusLabel ? <span className="node-system-node__status">{statusLabel}</span> : null}
      </header>

      {children ? <div className="node-system-node__body">{children}</div> : null}
    </div>
  );
}

export type { NodeBodyOverflow, NodeDensity, NodeFlowDirection, NodePortItem, NodeProps, NodeTone };
