import { type CSSProperties } from 'react';
import '../TradingWorkflow.css';
import { formatCompactNumber, getTradingClassName } from '../TradingWorkflow.utils';
import type { OrderBookLadderProps, OrderBookLevel, TradingSide } from '../TradingWorkflow.types';

function getLevelDepth(level: OrderBookLevel, maxSize: number) {
  return `${Math.max(4, Math.min(100, (level.size / maxSize) * 100))}%`;
}

export function OrderBookLadder({
  asks = [],
  bids = [],
  className,
  density = 'comfortable',
  midpoint,
  selectable = true,
  selectedPrice,
  showTotals = true,
  variant = 'default',
  onPriceSelect,
  ...ladderProps
}: OrderBookLadderProps) {
  const maxSize = Math.max(1, ...asks.map((level) => level.size), ...bids.map((level) => level.size));

  function renderLevel(level: OrderBookLevel, side: TradingSide) {
    const isSelected = selectedPrice === level.price;

    return (
      <button
        aria-disabled={selectable ? undefined : true}
        aria-pressed={isSelected}
        className="order-book-ladder__row"
        data-selected={isSelected ? 'true' : undefined}
        data-side={side}
        key={`${side}-${level.price}`}
        style={{ '--order-book-level-depth': getLevelDepth(level, maxSize) } as CSSProperties}
        tabIndex={selectable ? undefined : -1}
        type="button"
        onClick={selectable ? () => onPriceSelect?.(level.price, side) : undefined}
      >
        <span className="order-book-ladder__cell order-book-ladder__price">{level.price.toFixed(2)}</span>
        <span className="order-book-ladder__cell">{formatCompactNumber(level.size, 0)}</span>
        {showTotals ? <span className="order-book-ladder__cell">{formatCompactNumber(level.total ?? level.size, 0)}</span> : null}
      </button>
    );
  }

  return (
    <section
      {...ladderProps}
      className={getTradingClassName('order-book-ladder', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="trading-panel__header">
        <span className="trading-panel__copy">
          <strong className="trading-panel__title">Order book ladder</strong>
          <span className="trading-panel__description">Bid and ask depth around the current midpoint.</span>
        </span>
      </header>
      <div className="order-book-ladder__grid">
        {asks.slice().reverse().map((level) => renderLevel(level, 'sell'))}
        {typeof midpoint === 'number' ? <span className="order-book-ladder__mid">Mid {midpoint.toFixed(2)}</span> : null}
        {bids.map((level) => renderLevel(level, 'buy'))}
      </div>
    </section>
  );
}

export type { OrderBookLadderProps, OrderBookLevel } from '../TradingWorkflow.types';
