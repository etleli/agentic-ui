import type { ChartValuePoint, MarketChartBaseProps, MarketChartTone } from '../MarketChart.types';

export type TimeSeriesChartMode = 'line' | 'area';

export type TimeSeriesChartProps = MarketChartBaseProps & {
  animated?: boolean;
  mode?: TimeSeriesChartMode;
  points?: ChartValuePoint[];
  showGrid?: boolean;
  showPoints?: boolean;
  showValue?: boolean;
  tone?: MarketChartTone;
  values?: number[];
};
