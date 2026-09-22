import { useEffect, useState } from 'react';
import { BrokerConnectionSummary } from './BrokerConnectionSummary';
import type { TradingDensity, TradingSurfaceVariant } from '../TradingWorkflow.types';

export type BrokerConnectionSummaryExampleProps = {
  density?: TradingDensity;
  selectable?: boolean;
  selectedId?: string;
  variant?: TradingSurfaceVariant;
};

const brokerConnections = [
  { detail: 'Paper account', id: 'account', label: 'Account', latencyMs: 42, state: 'connected' as const },
  { detail: 'IEX delayed stream', id: 'market-data', label: 'Market data', latencyMs: 88, state: 'connected' as const },
  { detail: 'Order endpoint retrying', id: 'execution', label: 'Execution', latencyMs: 310, state: 'degraded' as const },
];

export function BrokerConnectionSummaryExample({ density = 'comfortable', selectable = true, selectedId = 'execution', variant = 'default' }: BrokerConnectionSummaryExampleProps) {
  const [activeId, setActiveId] = useState(selectedId);

  useEffect(() => {
    setActiveId(selectedId);
  }, [selectedId]);

  return (
    <BrokerConnectionSummary
      connections={brokerConnections}
      density={density}
      selectable={selectable}
      selectedId={activeId}
      variant={variant}
      onConnectionSelect={setActiveId}
    />
  );
}
