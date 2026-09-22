import { useEffect, useState } from 'react';
import { TradeBlotter } from './TradeBlotter';
import type { TradeBlotterProps } from '../TradingWorkflow.types';

export type TradeBlotterExampleProps = TradeBlotterProps;

export function TradeBlotterExample({
  density = 'comfortable',
  orders,
  selectable = true,
  selectedIndex = 0,
  showFilledQuantity = true,
  variant = 'default',
}: TradeBlotterExampleProps) {
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  return (
    <TradeBlotter
      density={density}
      orders={orders}
      selectable={selectable}
      selectedIndex={activeIndex}
      showFilledQuantity={showFilledQuantity}
      variant={variant}
      onSelectedOrderChange={setActiveIndex}
    />
  );
}
