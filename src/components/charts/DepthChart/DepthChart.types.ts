import type { DepthPoint, MarketChartBaseProps } from '../MarketChart.types';

export type DepthChartProps = MarketChartBaseProps & {
  animated?: boolean;
  asks?: DepthPoint[];
  bids?: DepthPoint[];
  showGrid?: boolean;
  showMidPrice?: boolean;
  showValue?: boolean;
};
