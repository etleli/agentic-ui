import type { MarketChartBaseProps, MarketChartTone } from '../MarketChart.types';

export type EquityCurveProps = MarketChartBaseProps & {
  animated?: boolean;
  benchmarkValues?: number[];
  showBenchmark?: boolean;
  showDrawdown?: boolean;
  showGrid?: boolean;
  showValue?: boolean;
  tone?: MarketChartTone;
  values?: number[];
};
