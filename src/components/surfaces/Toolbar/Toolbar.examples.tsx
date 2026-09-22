import { Play, Save, SlidersHorizontal } from 'lucide-react';
import '../SurfaceExample.css';
import { Button } from '../../inputs/Button';
import { Toolbar } from './Toolbar';
import type { ToolbarDensity, ToolbarJustify, ToolbarOrientation, ToolbarVariant } from './Toolbar.types';

export type ToolbarExampleProps = {
  density?: ToolbarDensity;
  justify?: ToolbarJustify;
  orientation?: ToolbarOrientation;
  variant?: ToolbarVariant;
  wrap?: boolean;
};

export function ToolbarExample({
  density = 'comfortable',
  justify = 'start',
  orientation = 'horizontal',
  variant = 'outlined',
  wrap = true,
}: ToolbarExampleProps) {
  return (
    <div className="surface-example">
      <Toolbar ariaLabel="Strategy tools" density={density} justify={justify} orientation={orientation} variant={variant} wrap={wrap}>
        <Button icon={<Play size={16} aria-hidden="true" />} size="compact" variant="primary">
          Run
        </Button>
        <Button icon={<Save size={16} aria-hidden="true" />} size="compact" variant="secondary">
          Save
        </Button>
        <Button icon={<SlidersHorizontal size={16} aria-hidden="true" />} size="compact" variant="subtle">
          Tune
        </Button>
      </Toolbar>

      <div className="surface-example__summary" role="status">
        <span>Toolbar</span>
        <strong>{orientation}</strong>
      </div>
    </div>
  );
}
