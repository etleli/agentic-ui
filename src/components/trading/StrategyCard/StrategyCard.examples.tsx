import { StrategyCard } from './StrategyCard';
import type { StrategyCardProps } from '../TradingWorkflow.types';

export type StrategyCardExampleProps = StrategyCardProps;

export function StrategyCardExample({
  description,
  metrics,
  name = 'Demo Momentum',
  selected = false,
  status = 'online',
  variant = 'default',
}: StrategyCardExampleProps) {
  return <StrategyCard description={description} metrics={metrics} name={name} selected={selected} status={status} variant={variant} />;
}
