import { Grid2X2, Maximize2, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import type { ReactElement } from 'react';
import { Button } from '../../inputs/Button';
import { Toolbar } from '../../surfaces/Toolbar';
import '../NodeSystem.css';
import type { NodeDensity, NodeToolbarProps, NodeToolbarTool } from '../NodeSystem.types';

const commandTools: Array<{ icon: ReactElement; id: NodeToolbarTool; label: string }> = [
  { icon: <ZoomOut size={16} aria-hidden="true" />, id: 'zoomOut', label: 'Zoom out' },
  { icon: <ZoomIn size={16} aria-hidden="true" />, id: 'zoomIn', label: 'Zoom in' },
  { icon: <Maximize2 size={16} aria-hidden="true" />, id: 'fit', label: 'Fit' },
  { icon: <Trash2 size={16} aria-hidden="true" />, id: 'delete', label: 'Delete' },
];

function getToolbarClassName(className: NodeToolbarProps['className']) {
  return ['node-system-toolbar', className].filter(Boolean).join(' ');
}

export function NodeToolbar({
  className,
  density = 'comfortable',
  disabledTools = [],
  showLabels = true,
  showSnapToggle = false,
  snapToGrid = true,
  onSnapToGridChange,
  onToolCommand,
  ...toolbarProps
}: NodeToolbarProps) {
  const buttonSize = density === 'compact' ? 'compact' : density === 'spacious' ? 'spacious' : 'comfortable';

  return (
    <Toolbar {...toolbarProps} ariaLabel="Node canvas tools" className={getToolbarClassName(className)} density={density} variant="filled">
      {commandTools.map((tool) => (
        <Button
          aria-label={tool.label}
          disabled={disabledTools.includes(tool.id)}
          icon={tool.icon}
          iconOnly={!showLabels}
          key={tool.id}
          size={buttonSize}
          tooltip={tool.label}
          tooltipPlacement="bottom"
          variant={tool.id === 'delete' ? 'danger' : 'secondary'}
          onClick={() => onToolCommand?.(tool.id)}
        >
          {tool.label}
        </Button>
      ))}

      {showSnapToggle ? (
        <>
          <span className="node-system-toolbar__spacer" aria-hidden="true" />
          <Button
            aria-label="Snap nodes to grid"
            buttonType="toggle"
            icon={<Grid2X2 size={16} aria-hidden="true" />}
            iconOnly={!showLabels}
            pressed={snapToGrid}
            showToggleIndicator={false}
            size={buttonSize}
            tooltip="Snap nodes to grid"
            tooltipPlacement="bottom"
            variant={snapToGrid ? 'primary' : 'secondary'}
            onPressedChange={onSnapToGridChange}
          >
            Snap
          </Button>
        </>
      ) : null}
    </Toolbar>
  );
}

export type { NodeDensity, NodeToolbarProps, NodeToolbarTool };
