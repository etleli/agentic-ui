import { useEffect, useState } from 'react';
import { DataTable } from '../../data-display/DataTable';
import { PropertyList } from '../../data-display/PropertyList';
import { SplitPane } from './SplitPane';
import type { SplitPaneProps } from '../Layout.types';

export type SplitPaneExampleProps = SplitPaneProps;

export function SplitPaneExample({
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  defaultSplitPercent = 42,
  maxSplitPercent = 82,
  minSplitPercent = 18,
  orientation = 'horizontal',
  persistKey,
  resizable = true,
  splitPercent,
  variant = 'default',
}: SplitPaneExampleProps) {
  const requestedSplitPercent = splitPercent ?? defaultSplitPercent;
  const [activeSplitPercent, setActiveSplitPercent] = useState(requestedSplitPercent);

  useEffect(() => {
    setActiveSplitPercent(requestedSplitPercent);
  }, [requestedSplitPercent]);

  return (
    <SplitPane
      brandWatermark={brandWatermark}
      brandWatermarkPlacement={brandWatermarkPlacement}
      defaultSplitPercent={defaultSplitPercent}
      first={
        <DataTable
          columns={[
            { id: 'symbol', label: 'Symbol' },
            { align: 'end', id: 'score', label: 'Score' },
          ]}
          density="compact"
          rows={[
            { cells: { score: '94', symbol: 'AAPL' }, id: 'aapl' },
            { cells: { score: '87', symbol: 'NVDA' }, id: 'nvda' },
            { cells: { score: '72', symbol: 'MSFT' }, id: 'msft' },
          ]}
          variant="muted"
        />
      }
      maxSplitPercent={maxSplitPercent}
      minSplitPercent={minSplitPercent}
      orientation={orientation}
      persistKey={persistKey}
      resizable={resizable}
      second={
        <PropertyList
          columns="one"
          items={[
            { id: 'strategy', label: 'Strategy', value: 'Demo Momentum' },
            { id: 'risk', label: 'Risk state', tone: 'warning', value: 'Watch' },
            { id: 'latency', label: 'Broker latency', tone: 'positive', value: '38 ms' },
          ]}
          variant="panel"
        />
      }
      splitPercent={activeSplitPercent}
      variant={variant}
      onSplitPercentChange={setActiveSplitPercent}
    />
  );
}
