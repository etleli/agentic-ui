import { DeltaIndicator, StatusBadge } from '../../feedback';
import { DataTable } from './DataTable';
import type { DataTableDensity, DataTableRow, DataTableSortDirection, DataTableVariant } from './DataTable.types';

export type DataTableScenario = 'default' | 'empty-state' | 'long-labels' | 'many-rows' | 'disabled-rows';

export type DataTableExampleProps = {
  density?: DataTableDensity;
  enableSorting?: boolean;
  maxHeight?: string;
  scenario?: DataTableScenario;
  selectable?: boolean;
  selectedRowIndex?: number;
  showDelta?: boolean;
  showRowNumbers?: boolean;
  showStatus?: boolean;
  sortColumn?: string;
  sortDirection?: DataTableSortDirection;
  stickyHeader?: boolean;
  variant?: DataTableVariant;
};

const columns = [
  { id: 'strategy', label: 'Strategy', sortable: true, width: '30%' },
  { id: 'state', label: 'State', sortable: true, width: '18%' },
  { align: 'end' as const, id: 'pnl', label: 'P/L', sortable: true, width: '18%' },
  { align: 'end' as const, id: 'exposure', label: 'Exposure', sortable: true, width: '18%' },
  { id: 'owner', label: 'Owner', sortable: true, width: '16%' },
];

type SampleRow = {
  disabled?: boolean;
  exposure: number;
  id: string;
  owner: string;
  pnl: number;
  state: string;
  strategy: string;
  summary: string;
  tone: DataTableRow['tone'];
};

const sampleRows: SampleRow[] = [
  {
    exposure: 42,
    id: 'demo-momentum',
    owner: 'Runtime',
    pnl: 2.48,
    state: 'online',
    strategy: 'Demo Momentum',
    summary: 'Momentum strategy with validated broker checks.',
    tone: 'positive',
  },
  {
    exposure: 27,
    id: 'mean-reversion',
    owner: 'Risk',
    pnl: -0.84,
    state: 'watching',
    strategy: 'Mean Reversion',
    summary: 'Waiting for volatility band confirmation.',
    tone: 'warning',
  },
  {
    exposure: 12,
    id: 'range-breakout',
    owner: 'Simulation',
    pnl: 0.12,
    state: 'paused',
    strategy: 'Range Breakout',
    summary: 'Paused while backtest parameters are edited.',
    tone: 'neutral',
  },
  {
    exposure: 8,
    id: 'pairs-hedge',
    owner: 'Portfolio',
    pnl: 1.16,
    state: 'online',
    strategy: 'Pairs Hedge',
    summary: 'Hedged pair holding inside exposure limits.',
    tone: 'positive',
  },
];

const longLabelRows: SampleRow[] = sampleRows.map((row, index) => ({
  ...row,
  strategy:
    index === 0
      ? 'Demo Momentum strategy with unusually long operator-facing name and multi-account execution context'
      : `${row.strategy} with extended scenario label for wrapping validation`,
  summary:
    index === 0
      ? 'This row deliberately uses verbose supporting text so table cells can be checked for wrapping, clipping, sticky headers, and selected-state legibility.'
      : `${row.summary} This extended summary checks dense table cells across all configured preview widths.`,
}));

const manyRows: SampleRow[] = Array.from({ length: 18 }, (_, index) => {
  const template = sampleRows[index % sampleRows.length];

  return {
    ...template,
    exposure: Math.max(4, template.exposure - (index % 5) * 2),
    id: `${template.id}-${index + 1}`,
    owner: index % 3 === 0 ? 'Runtime' : index % 3 === 1 ? 'Risk' : 'Portfolio',
    pnl: Number((template.pnl + (index % 4) * 0.17).toFixed(2)),
    strategy: `${template.strategy} ${String(index + 1).padStart(2, '0')}`,
    summary: `Generated table row ${index + 1} for scrolling, sticky header, sorting, and selected-state QA.`,
  };
});

function getScenarioRows(scenario: DataTableScenario): SampleRow[] {
  if (scenario === 'empty-state') {
    return [];
  }

  if (scenario === 'long-labels') {
    return longLabelRows;
  }

  if (scenario === 'many-rows') {
    return manyRows;
  }

  if (scenario === 'disabled-rows') {
    return sampleRows.map((row, index) => ({
      ...row,
      disabled: index === 1,
      summary: index === 1 ? 'This row is disabled to verify manual selection is blocked.' : row.summary,
    }));
  }

  return sampleRows;
}

function getRows(showStatus: boolean, showDelta: boolean, scenario: DataTableScenario): DataTableRow[] {
  return getScenarioRows(scenario).map((row) => ({
    id: row.id,
    cells: {
      exposure: `${row.exposure}%`,
      owner: row.owner,
      pnl: showDelta ? (
        <DeltaIndicator direction="auto" precision={2} showIcon size="compact" unit="%" value={row.pnl} variant="plain" />
      ) : (
        `${row.pnl > 0 ? '+' : ''}${row.pnl.toFixed(2)}%`
      ),
      state: showStatus ? <StatusBadge animated={false} showDot size="compact" status={row.state as 'online' | 'watching' | 'paused'} /> : row.state,
      strategy: (
        <span className="data-table__cell-stack">
          <span className="data-table__cell-title">{row.strategy}</span>
          <span className="data-table__cell-muted">{row.summary}</span>
        </span>
      ),
    },
    disabled: row.disabled,
    sortValues: {
      exposure: row.exposure,
      owner: row.owner,
      pnl: row.pnl,
      state: row.state,
      strategy: row.strategy,
    },
    tone: row.tone,
  }));
}

export function DataTableExample({
  density = 'comfortable',
  enableSorting = true,
  maxHeight = '360px',
  scenario = 'default',
  selectable = true,
  selectedRowIndex = 0,
  showDelta = true,
  showRowNumbers = false,
  showStatus = true,
  sortColumn = 'strategy',
  sortDirection = 'asc',
  stickyHeader = true,
  variant = 'default',
}: DataTableExampleProps) {
  return (
    <DataTable
      columns={columns}
      density={density}
      enableSorting={enableSorting}
      maxHeight={maxHeight}
      rows={getRows(showStatus, showDelta, scenario)}
      selectable={selectable}
      selectedRowIndex={selectedRowIndex}
      showRowNumbers={showRowNumbers}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      stickyHeader={stickyHeader}
      variant={variant}
    />
  );
}
