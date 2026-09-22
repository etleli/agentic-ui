import { PositionSummary } from './PositionSummary';
import type { PositionSummaryProps } from '../TradingWorkflow.types';

export type PositionSummaryExampleProps = PositionSummaryProps;

export function PositionSummaryExample({
  density = 'comfortable',
  selected = false,
  showExposure = true,
  variant = 'default',
  position,
}: PositionSummaryExampleProps) {
  return <PositionSummary density={density} position={position} selected={selected} showExposure={showExposure} variant={variant} />;
}
