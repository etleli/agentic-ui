import { OrderTicket } from './OrderTicket';
import type { OrderTicketProps } from '../TradingWorkflow.types';

export type OrderTicketExampleProps = OrderTicketProps;

export function OrderTicketExample({
  disabled = false,
  estimatedFee = 1,
  estimatedNotional,
  limitPrice = 210.42,
  orderType = 'limit',
  quantity = 100,
  side = 'buy',
  symbol = 'AAPL',
  timeInForce = 'day',
  variant = 'default',
}: OrderTicketExampleProps) {
  return (
    <OrderTicket
      disabled={disabled}
      estimatedFee={estimatedFee}
      estimatedNotional={estimatedNotional}
      limitPrice={limitPrice}
      orderType={orderType}
      quantity={quantity}
      side={side}
      symbol={symbol}
      timeInForce={timeInForce}
      variant={variant}
    />
  );
}
