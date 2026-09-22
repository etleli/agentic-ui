import { CorrelationHeatmap } from './CorrelationHeatmap';
import type { CorrelationHeatmapCell, MarketChartDensity, MarketChartVariant } from '../MarketChart.types';

export type CorrelationHeatmapExampleProps = {
  animated?: boolean;
  cells?: CorrelationHeatmapCell[];
  density?: MarketChartDensity;
  description?: string;
  matrix?: number[][];
  showValues?: boolean;
  symbols?: string[];
  title?: string;
  variant?: MarketChartVariant;
};

export function CorrelationHeatmapExample({
  animated = true,
  cells,
  density = 'comfortable',
  description = 'Pairwise symbol correlation for portfolio risk context.',
  matrix,
  showValues = true,
  symbols,
  title = 'Correlation matrix',
  variant = 'default',
}: CorrelationHeatmapExampleProps) {
  return (
    <CorrelationHeatmap
      animated={animated}
      cells={cells}
      density={density}
      description={description}
      matrix={matrix}
      showValues={showValues}
      symbols={symbols}
      title={title}
      variant={variant}
    />
  );
}
