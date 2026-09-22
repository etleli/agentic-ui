import '../SurfaceExample.css';
import type { BrandWatermarkPlacement } from '../BrandWatermark';
import { Card } from './Card';
import type { CardPadding, CardVariant } from './Card.types';

export type CardExampleProps = {
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  description?: string;
  eyebrow?: string;
  interactive?: boolean;
  meta?: string;
  padding?: CardPadding;
  selected?: boolean;
  title?: string;
  variant?: CardVariant;
};

export function CardExample({
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  description = 'Reusable compact surface for repeated summaries.',
  eyebrow = 'Strategy',
  interactive = true,
  meta = 'Ready',
  padding = 'comfortable',
  selected = false,
  title = 'Demo Momentum',
  variant = 'default',
}: CardExampleProps) {
  return (
    <div className="surface-example">
      <Card
        brandWatermark={brandWatermark}
        brandWatermarkPlacement={brandWatermarkPlacement}
        description={description}
        eyebrow={eyebrow}
        interactive={interactive}
        meta={meta}
        padding={padding}
        selected={selected}
        title={title}
        variant={variant}
      >
        <span className="surface-example__sample-line">
          <span>Exposure</span>
          <strong>$128,420</strong>
        </span>
      </Card>

      <div className="surface-example__summary" role="status">
        <span>Card state</span>
        <strong>{selected ? 'Selected' : variant}</strong>
      </div>
    </div>
  );
}
