import { VolumeBars } from './VolumeBars';
import type { MarketChartDensity, MarketChartVariant } from '../MarketChart.types';
import type { VolumeBarsMode } from './VolumeBars.types';

export type VolumeBarsExampleProps = {
  animated?: boolean;
  density?: MarketChartDensity;
  description?: string;
  mode?: VolumeBarsMode;
  showGrid?: boolean;
  showValue?: boolean;
  title?: string;
  values?: number[];
  variant?: MarketChartVariant;
};

export function VolumeBarsExample({
  animated = true,
  density = 'comfortable',
  description = 'Session volume with optional signed buy/sell pressure.',
  mode = 'absolute',
  showGrid = true,
  showValue = true,
  title = 'Volume bars',
  values,
  variant = 'default',
}: VolumeBarsExampleProps) {
  return (
    <VolumeBars
      animated={animated}
      density={density}
      description={description}
      mode={mode}
      showGrid={showGrid}
      showValue={showValue}
      title={title}
      values={values}
      variant={variant}
    />
  );
}
