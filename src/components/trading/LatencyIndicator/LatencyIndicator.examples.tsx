import { LatencyIndicator } from './LatencyIndicator';
import type { LatencyIndicatorProps } from '../TradingWorkflow.types';

export type LatencyIndicatorExampleProps = LatencyIndicatorProps;

export function LatencyIndicatorExample({
  label = 'Broker stream',
  latencyMs = 42,
  showSignal = true,
  size = 'comfortable',
  thresholdErrorMs = 750,
  thresholdWarningMs = 250,
}: LatencyIndicatorExampleProps) {
  return (
    <LatencyIndicator
      label={label}
      latencyMs={latencyMs}
      showSignal={showSignal}
      size={size}
      thresholdErrorMs={thresholdErrorMs}
      thresholdWarningMs={thresholdWarningMs}
    />
  );
}
