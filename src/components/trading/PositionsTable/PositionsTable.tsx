import { DataTable, type DataTableRow } from '../../data-display/DataTable';
import '../TradingWorkflow.css';
import { DEFAULT_POSITIONS, formatCompactNumber, getTradingClassName } from '../TradingWorkflow.utils';
import { PnLDisplay } from '../PnLDisplay';
import { PriceDisplay } from '../PriceDisplay';
import type { PositionsTableProps, TradingPosition } from '../TradingWorkflow.types';

const POSITION_COLUMNS = [
  { id: 'symbol', label: 'Symbol', sortable: true, width: '18%' },
  { align: 'end' as const, id: 'quantity', label: 'Qty', sortable: true },
  { align: 'end' as const, id: 'average', label: 'Avg', sortable: true },
  { align: 'end' as const, id: 'value', label: 'Value', sortable: true },
  { align: 'end' as const, id: 'pnl', label: 'P/L', sortable: true },
  { align: 'end' as const, id: 'exposure', label: 'Exposure', sortable: true },
];

function getPositionRows(positions: TradingPosition[], showExposure: boolean): DataTableRow[] {
  return positions.map((position) => ({
    cells: {
      average: <PriceDisplay precision={2} showSymbol={false} size="compact" value={position.averagePrice} />,
      exposure: showExposure && position.exposure !== undefined ? `${position.exposure.toFixed(1)}%` : null,
      pnl: <PnLDisplay amount={position.pnl} mode="both" percent={position.pnlPercent} size="compact" />,
      quantity: formatCompactNumber(position.quantity, 2),
      symbol: <strong>{position.symbol}</strong>,
      value: <PriceDisplay precision={2} showSymbol={false} size="compact" value={position.marketValue} />,
    },
    id: position.symbol,
    sortValues: {
      average: position.averagePrice,
      exposure: position.exposure ?? 0,
      pnl: position.pnl,
      quantity: position.quantity,
      symbol: position.symbol,
      value: position.marketValue,
    },
    tone: position.pnl > 0 ? 'positive' : position.pnl < 0 ? 'negative' : 'default',
  }));
}

export function PositionsTable({
  className,
  density = 'comfortable',
  positions = DEFAULT_POSITIONS,
  selectable = true,
  selectedSymbol,
  showExposure = true,
  variant = 'default',
  onSelectedSymbolChange,
  ...tableProps
}: PositionsTableProps) {
  const rows = getPositionRows(positions.length > 0 ? positions : DEFAULT_POSITIONS, showExposure);
  const selectedRowIndex = Math.max(0, rows.findIndex((row) => row.id === selectedSymbol));
  const columns = showExposure ? POSITION_COLUMNS : POSITION_COLUMNS.filter((column) => column.id !== 'exposure');

  return (
    <section {...tableProps} className={getTradingClassName('trading-table-wrap positions-table', className)} data-variant={variant}>
      <DataTable
        columns={columns}
        density={density}
        enableSorting
        maxHeight="360px"
        rows={rows}
        selectable={selectable}
        selectedRowIndex={selectedRowIndex}
        variant={variant}
        onSelectedRowChange={(_, row) => onSelectedSymbolChange?.(row.id)}
      />
    </section>
  );
}

export type { PositionsTableProps };
