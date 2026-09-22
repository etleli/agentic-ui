import '../SurfaceExample.css';
import type { BrandWatermarkPlacement } from '../BrandWatermark';
import { Panel } from './Panel';
import type { PanelPadding, PanelVariant } from './Panel.types';

export type PanelExampleProps = {
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  description?: string;
  heading?: string;
  padding?: PanelPadding;
  showFooter?: boolean;
  variant?: PanelVariant;
};

export function PanelExample({
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  description = 'Reusable surface for inspectors and tool regions.',
  heading = 'Runtime panel',
  padding = 'comfortable',
  showFooter = true,
  variant = 'outlined',
}: PanelExampleProps) {
  return (
    <div className="surface-example">
      <Panel
        brandWatermark={brandWatermark}
        brandWatermarkPlacement={brandWatermarkPlacement}
        description={description}
        footer={showFooter ? 'Updated 14:08:12' : undefined}
        heading={heading}
        padding={padding}
        variant={variant}
      >
        <div className="surface-example__split">
          <span className="surface-example__sample-line">
            <span>State</span>
            <strong>Monitoring</strong>
          </span>
          <span className="surface-example__sample-line">
            <span>Latency</span>
            <strong>12 ms</strong>
          </span>
        </div>
      </Panel>

      <div className="surface-example__summary" role="status">
        <span>Panel variant</span>
        <strong>{variant}</strong>
      </div>
    </div>
  );
}
