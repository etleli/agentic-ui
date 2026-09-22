import { useEffect, useState } from 'react';
import { OrderBookLadder } from './OrderBookLadder';
import type { TradingDensity } from '../TradingWorkflow.types';

export type OrderBookLadderExampleProps = {
  density?: TradingDensity;
  selectable?: boolean;
  selectedPrice?: number;
  showTotals?: boolean;
  variant?: 'default' | 'muted' | 'outline';
};

const askLevels = [
  { price: 210.5, size: 540, total: 1900 },
  { price: 210.47, size: 620, total: 1360 },
  { price: 210.44, size: 740, total: 740 },
];

const bidLevels = [
  { price: 210.41, size: 680, total: 680 },
  { price: 210.38, size: 920, total: 1600 },
  { price: 210.35, size: 510, total: 2110 },
];

export function OrderBookLadderExample({ density = 'comfortable', selectable = true, selectedPrice = 210.41, showTotals = true, variant = 'default' }: OrderBookLadderExampleProps) {
  const [activePrice, setActivePrice] = useState(selectedPrice);

  useEffect(() => {
    setActivePrice(selectedPrice);
  }, [selectedPrice]);

  return (
    <OrderBookLadder
      asks={askLevels}
      bids={bidLevels}
      density={density}
      midpoint={210.425}
      selectable={selectable}
      selectedPrice={activePrice}
      showTotals={showTotals}
      variant={variant}
      onPriceSelect={setActivePrice}
    />
  );
}
