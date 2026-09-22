import type { MarketChartBaseProps } from '../MarketChart.types';

export type VolumeBarsMode = 'absolute' | 'signed';

export type VolumeBarsProps = MarketChartBaseProps & {
  animated?: boolean;
  mode?: VolumeBarsMode;
  showGrid?: boolean;
  showValue?: boolean;
  values?: number[];
};
