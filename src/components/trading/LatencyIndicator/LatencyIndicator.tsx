import '../TradingWorkflow.css';
import { getLatencyTone, getTradingClassName } from '../TradingWorkflow.utils';
import type { LatencyIndicatorProps } from '../TradingWorkflow.types';

export function LatencyIndicator({
  className,
  label = 'Latency',
  latencyMs = 42,
  showSignal = true,
  size = 'comfortable',
  thresholdErrorMs = 750,
  thresholdWarningMs = 250,
  ...indicatorProps
}: LatencyIndicatorProps) {
  const tone = getLatencyTone(latencyMs, thresholdWarningMs, thresholdErrorMs);

  return (
    <div
      {...indicatorProps}
      className={getTradingClassName('trading-status latency-indicator', className)}
      data-size={size}
      data-tone={tone}
      data-variant="soft"
      role="status"
    >
      {showSignal ? <span className="trading-status__dot" aria-hidden="true" /> : null}
      <span>{label}</span>
      <strong>{Math.round(latencyMs)} ms</strong>
    </div>
  );
}

export type { LatencyIndicatorProps };
