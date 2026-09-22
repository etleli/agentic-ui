import '../FeedbackExample.css';
import { Skeleton } from './Skeleton';
import type { SkeletonDensity, SkeletonVariant } from './Skeleton.types';

export type SkeletonExampleProps = {
  animated?: boolean;
  density?: SkeletonDensity;
  rows?: number;
  variant?: SkeletonVariant;
};

export function SkeletonExample({ animated = true, density = 'comfortable', rows = 3, variant = 'list' }: SkeletonExampleProps) {
  return (
    <div className="feedback-example">
      <div className="feedback-example__surface" data-wide="true">
        <Skeleton animated={animated} density={density} rows={rows} variant={variant} />
      </div>

      <div className="feedback-example__summary" role="status">
        <span>Placeholder</span>
        <strong>
          {variant} / {rows} rows
        </strong>
      </div>
    </div>
  );
}
