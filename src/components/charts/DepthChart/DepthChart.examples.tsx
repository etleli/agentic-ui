import { DepthChart } from './DepthChart';
import type { DepthPoint, MarketChartDensity, MarketChartVariant } from '../MarketChart.types';

export type DepthChartExampleProps = {
  animated?: boolean;
  asks?: DepthPoint[];
  bids?: DepthPoint[];
  density?: MarketChartDensity;
  description?: string;
  showGrid?: boolean;
  showMidPrice?: boolean;
  showValue?: boolean;
  title?: string;
  variant?: MarketChartVariant;
};

export function DepthChartExample({
  animated = true,
  asks,
  bids,
  density = 'comfortable',
  description = 'Bid and ask liquidity ladder around the midpoint.',
  showGrid = true,
  showMidPrice = true,
  showValue = true,
  title = 'Order book depth',
  variant = 'default',
}: DepthChartExampleProps) {
  return (
    <DepthChart
      animated={animated}
      asks={asks}
      bids={bids}
      density={density}
      description={description}
      showGrid={showGrid}
      showMidPrice={showMidPrice}
      showValue={showValue}
      title={title}
      variant={variant}
    />
  );
}
