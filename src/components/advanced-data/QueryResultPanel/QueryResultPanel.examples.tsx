import { useEffect, useRef, useState } from 'react';
import { StatusBadge } from '../../feedback/StatusBadge';
import { QueryResultPanel } from './QueryResultPanel';
import type { DataTableColumn, DataTableRow } from '../../data-display/DataTable';
import type { AdvancedDataDensity, AdvancedDataStatus, AdvancedDataVariant } from '../AdvancedData.types';

export type QueryResultPanelExampleProps = {
  density?: AdvancedDataDensity;
  durationMs?: number;
  maxHeight?: string;
  selectable?: boolean;
  selectedRowIndex?: number;
  showQuery?: boolean;
  showSummary?: boolean;
  status?: AdvancedDataStatus;
  title?: string;
  variant?: AdvancedDataVariant;
};

const columns: DataTableColumn[] = [
  { id: 'symbol', label: 'Symbol', sortable: true, width: '18%' },
  { id: 'strategy', label: 'Strategy', sortable: true, width: '28%' },
  { align: 'end', id: 'exposure', label: 'Exposure', sortable: true, width: '18%' },
  { id: 'state', label: 'State', sortable: true, width: '18%' },
  { align: 'end', id: 'score', label: 'Score', sortable: true, width: '18%' },
];

const rows: DataTableRow[] = [
  {
    id: 'aapl-alpha',
    cells: {
      exposure: '18.4%',
      score: '0.94',
      state: <StatusBadge animated={false} label="Ready" showDot size="compact" status="online" />,
      strategy: 'Demo Momentum',
      symbol: 'AAPL',
    },
    sortValues: { exposure: 18.4, score: 0.94, state: 'ready', strategy: 'Demo Momentum', symbol: 'AAPL' },
    tone: 'positive',
  },
  {
    id: 'msft-risk',
    cells: {
      exposure: '22.1%',
      score: '0.81',
      state: <StatusBadge animated={false} label="Watch" showDot size="compact" status="watching" />,
      strategy: 'Risk Guard',
      symbol: 'MSFT',
    },
    sortValues: { exposure: 22.1, score: 0.81, state: 'watch', strategy: 'Risk Guard', symbol: 'MSFT' },
    tone: 'warning',
  },
  {
    id: 'nvda-breakout',
    cells: {
      exposure: '12.7%',
      score: '0.88',
      state: <StatusBadge animated={false} label="Ready" showDot size="compact" status="online" />,
      strategy: 'Range Breakout',
      symbol: 'NVDA',
    },
    sortValues: { exposure: 12.7, score: 0.88, state: 'ready', strategy: 'Range Breakout', symbol: 'NVDA' },
    tone: 'positive',
  },
  {
    id: 'tsla-paused',
    cells: {
      exposure: '4.2%',
      score: '0.42',
      state: <StatusBadge animated={false} label="Paused" showDot size="compact" status="paused" />,
      strategy: 'Mean Reversion',
      symbol: 'TSLA',
    },
    sortValues: { exposure: 4.2, score: 0.42, state: 'paused', strategy: 'Mean Reversion', symbol: 'TSLA' },
    tone: 'neutral',
  },
];

const query = `select symbol, strategy, exposure, state, score
from runtime.strategy_candidates
where score >= 0.40
order by score desc
limit 50;`;

export function QueryResultPanelExample({
  density = 'comfortable',
  durationMs = 184,
  maxHeight = '320px',
  selectable = true,
  selectedRowIndex = 0,
  showQuery = true,
  showSummary = true,
  status = 'ready',
  title = 'Strategy candidates',
  variant = 'default',
}: QueryResultPanelExampleProps) {
  const [internalSelectedRowIndex, setInternalSelectedRowIndex] = useState(selectedRowIndex);
  const selectedRowIndexRef = useRef(selectedRowIndex);

  useEffect(() => {
    if (selectedRowIndexRef.current !== selectedRowIndex) {
      setInternalSelectedRowIndex(selectedRowIndex);
      selectedRowIndexRef.current = selectedRowIndex;
    }
  }, [selectedRowIndex]);

  return (
    <QueryResultPanel
      columns={columns}
      density={density}
      durationMs={durationMs}
      freshness="reviewed now"
      maxHeight={maxHeight}
      query={query}
      rowCount={rows.length}
      rows={rows}
      scannedRows={128420}
      selectable={selectable}
      selectedRowIndex={internalSelectedRowIndex}
      showQuery={showQuery}
      showSummary={showSummary}
      status={status}
      title={title}
      variant={variant}
      onSelectedRowChange={setInternalSelectedRowIndex}
    />
  );
}
