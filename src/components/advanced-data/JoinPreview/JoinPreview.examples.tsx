import { JoinPreview } from './JoinPreview';
import type { AdvancedDataDensity, AdvancedDataVariant } from '../AdvancedData.types';

export type JoinPreviewExampleProps = {
  density?: AdvancedDataDensity;
  joinType?: 'inner' | 'left' | 'right' | 'outer';
  matchedRows?: number;
  variant?: AdvancedDataVariant;
};

export function JoinPreviewExample({ density = 'comfortable', joinType = 'left', matchedRows = 38, variant = 'default' }: JoinPreviewExampleProps) {
  return <JoinPreview density={density} joinType={joinType} matchedRows={matchedRows} variant={variant} />;
}
