import type { CSSProperties } from 'react';
import { useNodeCanvasContext } from '../NodeCanvas/NodeCanvasContext';
import '../NodeSystem.css';
import type { NodePortDirection, NodePortProps, NodePortSide, NodeTone } from '../NodeSystem.types';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';

function getNodePortClassName(className: NodePortProps['className']) {
  return ['node-system-port', className].filter(Boolean).join(' ');
}

export function NodePort({
  className,
  color,
  connected = false,
  count = 1,
  direction = 'input',
  disabled = false,
  index = 0,
  label,
  side = 'left',
  style,
  tone = 'neutral',
  type,
  onClick,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  tabIndex,
  ...portProps
}: NodePortProps) {
  const { editable } = useNodeCanvasContext();
  const isReadOnly = !editable;
  const isInert = disabled || isReadOnly;
  const tooltip = type ? `Data type: ${label ? `${label} (${type})` : type}` : label;
  const typeColor = color ?? (type ? getThemeGeneratedColorForKey(type) : undefined);
  const portStyle = {
    ...style,
    ...(typeColor ? { '--node-type-color': typeColor } : {}),
    '--node-port-count': String(Math.max(1, count)),
    '--node-port-index': String(Math.max(0, index)),
  } as CSSProperties;

  return (
    <button
      {...portProps}
      aria-label={label ?? `${direction} port`}
      aria-disabled={isInert ? true : undefined}
      className={getNodePortClassName(className)}
      data-connected={connected ? 'true' : undefined}
      data-direction={direction}
      data-readonly={isReadOnly ? 'true' : undefined}
      data-side={side}
      data-tone={tone}
      data-type={type}
      disabled={disabled}
      style={portStyle}
      tabIndex={isInert ? -1 : tabIndex}
      title={tooltip}
      type="button"
      onClick={(event) => {
        if (isInert) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        onClick?.(event);
      }}
      onPointerDown={(event) => {
        if (isInert) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        onPointerDown?.(event);
      }}
      onPointerMove={(event) => {
        if (isInert) {
          return;
        }

        onPointerMove?.(event);
      }}
      onPointerUp={(event) => {
        if (isInert) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }

        onPointerUp?.(event);
      }}
    />
  );
}

export type { NodePortDirection, NodePortProps, NodePortSide, NodeTone };
