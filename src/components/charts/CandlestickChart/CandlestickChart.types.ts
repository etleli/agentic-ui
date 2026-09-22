import type { MarketChartBaseProps, OhlcPoint } from '../MarketChart.types';

export type CandlestickChartProps = MarketChartBaseProps & {
  animated?: boolean;
  candles?: OhlcPoint[];
  showGrid?: boolean;
  showValue?: boolean;
  showVolume?: boolean;
  showWicks?: boolean;
};
