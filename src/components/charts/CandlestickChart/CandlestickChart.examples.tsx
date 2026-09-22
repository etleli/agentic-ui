import { CandlestickChart } from './CandlestickChart';
import type { MarketChartDensity, MarketChartVariant, OhlcPoint } from '../MarketChart.types';

export type CandlestickChartExampleProps = {
  animated?: boolean;
  candles?: OhlcPoint[];
  density?: MarketChartDensity;
  description?: string;
  showGrid?: boolean;
  showValue?: boolean;
  showVolume?: boolean;
  showWicks?: boolean;
  title?: string;
  variant?: MarketChartVariant;
};

export function CandlestickChartExample({
  animated = true,
  candles,
  density = 'comfortable',
  description = 'OHLC candles with optional volume bars.',
  showGrid = true,
  showValue = true,
  showVolume = true,
  showWicks = true,
  title = 'AAPL OHLC',
  variant = 'default',
}: CandlestickChartExampleProps) {
  return (
    <CandlestickChart
      animated={animated}
      candles={candles}
      density={density}
      description={description}
      showGrid={showGrid}
      showValue={showValue}
      showVolume={showVolume}
      showWicks={showWicks}
      title={title}
      variant={variant}
    />
  );
}
