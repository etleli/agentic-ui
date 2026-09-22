import { useEffect, useState } from 'react';
import { PositionsTable } from './PositionsTable';
import type { PositionsTableProps } from '../TradingWorkflow.types';

export type PositionsTableExampleProps = PositionsTableProps;

export function PositionsTableExample({
  density = 'comfortable',
  positions,
  selectable = true,
  selectedSymbol = 'AAPL',
  showExposure = true,
  variant = 'default',
}: PositionsTableExampleProps) {
  const [activeSymbol, setActiveSymbol] = useState(selectedSymbol);

  useEffect(() => {
    setActiveSymbol(selectedSymbol);
  }, [selectedSymbol]);

  return (
    <PositionsTable
      density={density}
      positions={positions}
      selectable={selectable}
      selectedSymbol={activeSymbol}
      showExposure={showExposure}
      variant={variant}
      onSelectedSymbolChange={setActiveSymbol}
    />
  );
}
