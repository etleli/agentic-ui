import { OrderStatus } from './OrderStatus';
import type { OrderStatusProps } from '../TradingWorkflow.types';

export type OrderStatusExampleProps = OrderStatusProps;

export function OrderStatusExample({
  animated = true,
  showDot = true,
  size = 'comfortable',
  status = 'working',
  variant = 'soft',
}: OrderStatusExampleProps) {
  return <OrderStatus animated={animated} showDot={showDot} size={size} status={status} variant={variant} />;
}
