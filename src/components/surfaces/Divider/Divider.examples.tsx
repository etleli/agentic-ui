import '../SurfaceExample.css';
import { Divider } from './Divider';
import type { DividerInset, DividerOrientation, DividerTone } from './Divider.types';

export type DividerExampleProps = {
  inset?: DividerInset;
  label?: string;
  orientation?: DividerOrientation;
  tone?: DividerTone;
};

export function DividerExample({
  inset = 'none',
  label = 'Risk controls',
  orientation = 'horizontal',
  tone = 'default',
}: DividerExampleProps) {
  return (
    <div className="surface-example">
      {orientation === 'vertical' ? (
        <div className="surface-example__row">
          <span className="surface-example__sample-line">
            <span>Left</span>
            <strong>Orders</strong>
          </span>
          <Divider inset={inset} orientation={orientation} tone={tone} />
          <span className="surface-example__sample-line">
            <span>Right</span>
            <strong>Risk</strong>
          </span>
        </div>
      ) : (
        <div className="surface-example__stack">
          <span className="surface-example__sample-line">
            <span>Primary section</span>
            <strong>Strategy engine</strong>
          </span>
          <Divider inset={inset} label={label} orientation={orientation} tone={tone} />
          <span className="surface-example__sample-line">
            <span>Secondary section</span>
            <strong>Guard rails</strong>
          </span>
        </div>
      )}

      <div className="surface-example__summary" role="status">
        <span>Divider</span>
        <strong>{orientation}</strong>
      </div>
    </div>
  );
}
