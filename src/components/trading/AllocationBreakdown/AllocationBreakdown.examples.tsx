import { useEffect, useState } from 'react';
import { AllocationBreakdown } from './AllocationBreakdown';
import type { TradingDensity, TradingSurfaceVariant } from '../TradingWorkflow.types';

export type AllocationBreakdownExampleProps = {
  density?: TradingDensity;
  selectable?: boolean;
  selectedId?: string;
  showTargets?: boolean;
  variant?: TradingSurfaceVariant;
};

const allocations = [
  { color: '#ff7300', id: 'equity', label: 'Equity', target: 46, value: 420000 },
  { color: '#05d671', id: 'hedge', label: 'Hedge', target: 24, value: 180000 },
  { color: '#ffcf00', id: 'cash', label: 'Cash', target: 30, value: 260000 },
];

export function AllocationBreakdownExample({ density = 'comfortable', selectable = true, selectedId = 'equity', showTargets = true, variant = 'default' }: AllocationBreakdownExampleProps) {
  const [activeId, setActiveId] = useState(selectedId);

  useEffect(() => {
    setActiveId(selectedId);
  }, [selectedId]);

  return (
    <AllocationBreakdown
      allocations={allocations}
      density={density}
      selectable={selectable}
      selectedId={activeId}
      showTargets={showTargets}
      variant={variant}
      onAllocationSelect={setActiveId}
    />
  );
}
