import { TimeSeriesChart } from './TimeSeriesChart';
import type { MarketChartDensity, MarketChartTone, MarketChartVariant } from '../MarketChart.types';
import type { TimeSeriesChartMode } from './TimeSeriesChart.types';

export type TimeSeriesChartExampleProps = {
  animated?: boolean;
  density?: MarketChartDensity;
  description?: string;
  mode?: TimeSeriesChartMode;
  showGrid?: boolean;
  showPoints?: boolean;
  showValue?: boolean;
  title?: string;
  tone?: MarketChartTone;
  values?: number[];
  variant?: MarketChartVariant;
};

export function TimeSeriesChartExample({
  animated = true,
  density = 'comfortable',
  description = 'Intraday mid-price movement across the active session.',
  mode = 'area',
  showGrid = true,
  showPoints = false,
  showValue = true,
  title = 'AAPL intraday',
  tone = 'auto',
  values = [102.4, 103.1, 102.8, 104.6, 106.2, 105.8, 108.4, 109.1, 110.6],
  variant = 'default',
}: TimeSeriesChartExampleProps) {
  return (
    <TimeSeriesChart
      animated={animated}
      density={density}
      description={description}
      mode={mode}
      showGrid={showGrid}
      showPoints={showPoints}
      showValue={showValue}
      title={title}
      tone={tone}
      values={values}
      variant={variant}
    />
  );
}
