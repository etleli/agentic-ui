import type { CorrelationHeatmapCell, MarketChartBaseProps } from '../MarketChart.types';

export type CorrelationHeatmapProps = MarketChartBaseProps & {
  animated?: boolean;
  cells?: CorrelationHeatmapCell[];
  matrix?: number[][];
  showValues?: boolean;
  symbols?: string[];
};
