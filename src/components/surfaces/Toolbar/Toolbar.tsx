import './Toolbar.css';
import type { ToolbarDensity, ToolbarJustify, ToolbarOrientation, ToolbarProps, ToolbarVariant } from './Toolbar.types';

function getToolbarClassName(className: ToolbarProps['className']) {
  return ['surface-toolbar', className].filter(Boolean).join(' ');
}

export function Toolbar({
  ariaLabel,
  children,
  className,
  density = 'comfortable',
  justify = 'start',
  orientation = 'horizontal',
  variant = 'outlined',
  wrap = true,
  ...toolbarProps
}: ToolbarProps) {
  return (
    <div
      {...toolbarProps}
      aria-label={ariaLabel}
      className={getToolbarClassName(className)}
      data-density={density}
      data-justify={justify}
      data-orientation={orientation}
      data-variant={variant}
      data-wrap={wrap ? 'true' : undefined}
      role="toolbar"
    >
      {children}
    </div>
  );
}

export type { ToolbarDensity, ToolbarJustify, ToolbarOrientation, ToolbarProps, ToolbarVariant };
