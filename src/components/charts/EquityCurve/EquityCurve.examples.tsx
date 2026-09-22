import { EquityCurve } from './EquityCurve';
import type { MarketChartDensity, MarketChartTone, MarketChartVariant } from '../MarketChart.types';

export type EquityCurveExampleProps = {
  animated?: boolean;
  benchmarkValues?: number[];
  density?: MarketChartDensity;
  description?: string;
  showBenchmark?: boolean;
  showDrawdown?: boolean;
  showGrid?: boolean;
  showValue?: boolean;
  title?: string;
  tone?: MarketChartTone;
  values?: number[];
  variant?: MarketChartVariant;
};

export function EquityCurveExample({
  animated = true,
  benchmarkValues,
  density = 'comfortable',
  description = 'Portfolio equity with benchmark and drawdown context.',
  showBenchmark = true,
  showDrawdown = true,
  showGrid = true,
  showValue = true,
  title = 'Portfolio equity',
  tone = 'auto',
  values,
  variant = 'default',
}: EquityCurveExampleProps) {
  return (
    <EquityCurve
      animated={animated}
      benchmarkValues={benchmarkValues}
      density={density}
      description={description}
      showBenchmark={showBenchmark}
      showDrawdown={showDrawdown}
      showGrid={showGrid}
      showValue={showValue}
      title={title}
      tone={tone}
      values={values}
      variant={variant}
    />
  );
}
