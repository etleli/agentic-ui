import { useEffect, useMemo, useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { Button, Dropdown, NumberInput, TextInput } from '../../inputs';
import '../TradingWorkflow.css';
import { formatCurrency, getTradingClassName } from '../TradingWorkflow.utils';
import type { OrderTicketProps, TradingOrderTicketDraft, TradingOrderType, TradingSide, TradingTimeInForce } from '../TradingWorkflow.types';

const SIDE_OPTIONS = [
  { color: 'var(--color-trading-positive)', label: 'Buy', value: 'buy' },
  { color: 'var(--color-trading-negative)', label: 'Sell', value: 'sell' },
];

const ORDER_TYPE_OPTIONS = [
  { label: 'Market', value: 'market' },
  { label: 'Limit', value: 'limit' },
  { label: 'Stop', value: 'stop' },
  { label: 'Stop limit', value: 'stop-limit' },
];

const TIME_IN_FORCE_OPTIONS = [
  { label: 'Day', value: 'day' },
  { label: 'GTC', value: 'gtc' },
  { label: 'IOC', value: 'ioc' },
  { label: 'FOK', value: 'fok' },
];

function getOrderTicketDraft({
  limitPrice = 210.42,
  orderType = 'limit',
  quantity = 100,
  side = 'buy',
  symbol = 'AAPL',
  timeInForce = 'day',
}: Pick<OrderTicketProps, 'limitPrice' | 'orderType' | 'quantity' | 'side' | 'symbol' | 'timeInForce'>): TradingOrderTicketDraft {
  return {
    limitPrice,
    orderType,
    quantity,
    side,
    symbol,
    timeInForce,
  };
}

export function OrderTicket({
  className,
  disabled = false,
  estimatedFee = 1,
  estimatedNotional,
  limitPrice,
  orderType,
  quantity,
  side,
  symbol,
  timeInForce,
  variant = 'default',
  onSubmit,
  ...ticketProps
}: OrderTicketProps) {
  const inputDraft = useMemo(
    () => getOrderTicketDraft({ limitPrice, orderType, quantity, side, symbol, timeInForce }),
    [limitPrice, orderType, quantity, side, symbol, timeInForce],
  );
  const [draft, setDraft] = useState(inputDraft);

  useEffect(() => setDraft(inputDraft), [inputDraft]);

  const requiresPrice = draft.orderType !== 'market';
  const computedNotional = estimatedNotional ?? Math.abs(draft.quantity) * (requiresPrice ? draft.limitPrice ?? 0 : 0);
  const sideLabel = draft.side === 'buy' ? 'Buy' : 'Sell';

  return (
    <section
      {...ticketProps}
      className={getTradingClassName('trading-panel trading-ticket', className)}
      data-side={draft.side}
      data-variant={variant}
    >
      <header className="trading-panel__header">
        <span className="trading-panel__copy">
          <span className="trading-card__eyebrow">Order ticket</span>
          <h3 className="trading-panel__title">{draft.symbol || 'Symbol'}</h3>
        </span>
      </header>

      <div className="trading-ticket__form">
        <label className="trading-ticket__field">
          <span className="trading-ticket__field-label">Symbol</span>
          <TextInput ariaLabel="Order symbol" disabled={disabled} value={draft.symbol} onValueChange={(nextSymbol) => setDraft({ ...draft, symbol: nextSymbol.toUpperCase() })} />
        </label>
        <label className="trading-ticket__field">
          <span className="trading-ticket__field-label">Side</span>
          <Dropdown
            ariaLabel="Order side"
            disabled={disabled}
            options={SIDE_OPTIONS}
            showOptionColors
            value={draft.side}
            onChange={(nextSide) => setDraft({ ...draft, side: nextSide as TradingSide })}
          />
        </label>
        <label className="trading-ticket__field">
          <span className="trading-ticket__field-label">Order type</span>
          <Dropdown
            ariaLabel="Order type"
            disabled={disabled}
            options={ORDER_TYPE_OPTIONS}
            value={draft.orderType}
            onChange={(nextOrderType) => setDraft({ ...draft, orderType: nextOrderType as TradingOrderType })}
          />
        </label>
        <label className="trading-ticket__field">
          <span className="trading-ticket__field-label">Time in force</span>
          <Dropdown
            ariaLabel="Time in force"
            disabled={disabled}
            options={TIME_IN_FORCE_OPTIONS}
            value={draft.timeInForce}
            onChange={(nextTimeInForce) => setDraft({ ...draft, timeInForce: nextTimeInForce as TradingTimeInForce })}
          />
        </label>
        <label className="trading-ticket__field">
          <span className="trading-ticket__field-label">Quantity</span>
          <NumberInput ariaLabel="Order quantity" disabled={disabled} min={0} value={draft.quantity} onValueChange={(nextQuantity) => setDraft({ ...draft, quantity: nextQuantity })} />
        </label>
        {requiresPrice ? (
          <label className="trading-ticket__field">
            <span className="trading-ticket__field-label">Limit/stop price</span>
            <NumberInput
              ariaLabel="Order price"
              disabled={disabled}
              min={0}
              suffix="USD"
              value={draft.limitPrice ?? 0}
              onValueChange={(nextPrice) => setDraft({ ...draft, limitPrice: nextPrice })}
            />
          </label>
        ) : null}
      </div>

      <div className="trading-ticket__summary">
        <span className="trading-ticket__summary-row">
          <span className="trading-row__label">Estimated notional</span>
          <strong>{requiresPrice ? formatCurrency(computedNotional) : 'Market priced'}</strong>
        </span>
        <span className="trading-ticket__summary-row">
          <span className="trading-row__label">Estimated fee</span>
          <strong>{formatCurrency(estimatedFee)}</strong>
        </span>
      </div>

      <div className="trading-ticket__actions">
        <Button
          disabled={disabled || !draft.symbol.trim() || draft.quantity <= 0}
          icon={<SendHorizontal size={16} aria-hidden="true" />}
          showToggleIndicator={false}
          variant={draft.side === 'sell' ? 'danger' : 'primary'}
          onClick={() => onSubmit?.(draft)}
        >
          {sideLabel} {draft.symbol || 'order'}
        </Button>
      </div>
    </section>
  );
}

export type { OrderTicketProps };
