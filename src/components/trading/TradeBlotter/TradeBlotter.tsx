import { DataTable, type DataTableRow } from '../../data-display/DataTable';
import '../TradingWorkflow.css';
import { DEFAULT_ORDERS, formatCurrency, formatCompactNumber, getTradingClassName } from '../TradingWorkflow.utils';
import { OrderStatus } from '../OrderStatus';
import type { TradeBlotterProps, TradingOrder } from '../TradingWorkflow.types';

const ORDER_COLUMNS = [
  { id: 'time', label: 'Time', sortable: true, width: '18%' },
  { id: 'symbol', label: 'Symbol', sortable: true },
  { id: 'side', label: 'Side', sortable: true },
  { id: 'type', label: 'Type', sortable: true },
  { align: 'end' as const, id: 'quantity', label: 'Qty', sortable: true },
  { align: 'end' as const, id: 'price', label: 'Price', sortable: true },
  { id: 'status', label: 'Status', sortable: true },
  { align: 'end' as const, id: 'filled', label: 'Filled', sortable: true },
];

function getOrderRows(orders: TradingOrder[], showFilledQuantity: boolean): DataTableRow[] {
  return orders.map((order, index) => ({
    cells: {
      filled: showFilledQuantity ? `${formatCompactNumber(order.filledQuantity ?? 0)} / ${formatCompactNumber(order.quantity)}` : null,
      price: order.price === undefined ? 'Market' : formatCurrency(order.price),
      quantity: formatCompactNumber(order.quantity),
      side: <strong className={`trading-side trading-side--${order.side}`}>{order.side.toUpperCase()}</strong>,
      status: <OrderStatus size="compact" status={order.status} />,
      symbol: <strong>{order.symbol}</strong>,
      time: order.time ?? '--',
      type: order.orderType,
    },
    id: `${order.symbol}-${index}`,
    sortValues: {
      filled: order.filledQuantity ?? 0,
      price: order.price ?? 0,
      quantity: order.quantity,
      side: order.side,
      status: order.status,
      symbol: order.symbol,
      time: order.time ?? '',
      type: order.orderType,
    },
    tone: order.status === 'rejected' ? 'negative' : order.status === 'filled' ? 'positive' : 'default',
  }));
}

export function TradeBlotter({
  className,
  density = 'comfortable',
  orders = DEFAULT_ORDERS,
  selectable = true,
  selectedIndex = 0,
  showFilledQuantity = true,
  variant = 'default',
  onSelectedOrderChange,
  ...blotterProps
}: TradeBlotterProps) {
  const sourceOrders = orders.length > 0 ? orders : DEFAULT_ORDERS;
  const rows = getOrderRows(sourceOrders, showFilledQuantity);
  const columns = showFilledQuantity ? ORDER_COLUMNS : ORDER_COLUMNS.filter((column) => column.id !== 'filled');

  return (
    <section {...blotterProps} className={getTradingClassName('trading-table-wrap trade-blotter', className)} data-variant={variant}>
      <DataTable
        columns={columns}
        density={density}
        enableSorting
        maxHeight="360px"
        rows={rows}
        selectable={selectable}
        selectedRowIndex={Math.min(Math.max(selectedIndex, 0), rows.length - 1)}
        variant={variant}
        onSelectedRowChange={(rowIndex) => onSelectedOrderChange?.(rowIndex, sourceOrders[rowIndex])}
      />
    </section>
  );
}

export type { TradeBlotterProps };
