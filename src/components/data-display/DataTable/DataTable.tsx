import { ArrowDown, ArrowUp, ChevronsUpDown } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import { EmptyState } from '../../surfaces';
import './DataTable.css';
import type { DataTableColumn, DataTableProps, DataTableRow, DataTableSortDirection, DataTableSortValue } from './DataTable.types';

type InternalSortState = {
  columnId: string;
  direction: DataTableSortDirection;
};

function getDataTableClassName(className: DataTableProps['className']) {
  return ['data-table', className].filter(Boolean).join(' ');
}

function getInitialSortState(columns: DataTableColumn[], sortColumn: string | undefined, sortDirection: DataTableSortDirection): InternalSortState {
  const fallbackColumn = columns.find((column) => column.sortable !== false)?.id ?? columns[0]?.id ?? '';

  return {
    columnId: sortColumn ?? fallbackColumn,
    direction: sortDirection,
  };
}

function normalizeSortValue(value: DataTableSortValue) {
  if (typeof value === 'number') {
    return value;
  }

  return String(value ?? '').toLocaleLowerCase();
}

function getSortValue(row: DataTableRow, columnId: string): DataTableSortValue {
  return row.sortValues?.[columnId] ?? (typeof row.cells[columnId] === 'string' || typeof row.cells[columnId] === 'number' ? row.cells[columnId] : '');
}

function compareSortValues(firstValue: DataTableSortValue, secondValue: DataTableSortValue) {
  const normalizedFirst = normalizeSortValue(firstValue);
  const normalizedSecond = normalizeSortValue(secondValue);

  if (typeof normalizedFirst === 'number' && typeof normalizedSecond === 'number') {
    return normalizedFirst - normalizedSecond;
  }

  return String(normalizedFirst).localeCompare(String(normalizedSecond));
}

function getSortIcon(isActive: boolean, direction: DataTableSortDirection) {
  if (!isActive) {
    return <ChevronsUpDown size={14} aria-hidden="true" />;
  }

  return direction === 'asc' ? <ArrowUp size={14} aria-hidden="true" /> : <ArrowDown size={14} aria-hidden="true" />;
}

function isRowSelectKey(event: KeyboardEvent<HTMLTableRowElement>): boolean {
  return event.key === 'Enter' || event.key === ' ';
}

function getRowIndexById(rows: DataTableRow[], rowId: string | undefined): number | undefined {
  if (rowId === undefined) {
    return undefined;
  }

  const rowIndex = rows.findIndex((row) => row.id === rowId);
  return rowIndex === -1 ? undefined : rowIndex;
}

function getDataTableSelectedRowIndex(
  rows: DataTableRow[],
  selectedRowId: string | undefined,
  selectedRowIndex: number | undefined,
  fallbackRowIndex: number | undefined,
) {
  return getRowIndexById(rows, selectedRowId) ?? selectedRowIndex ?? fallbackRowIndex;
}

export function DataTable({
  'aria-label': ariaLabel = 'Data table',
  className,
  columns,
  defaultSelectedRowId,
  defaultSelectedRowIndex,
  density = 'comfortable',
  emptyDescription = 'Rows will appear here when data is available.',
  emptyTitle = 'No rows',
  enableSorting = false,
  maxHeight,
  rows,
  selectable = true,
  selectedRowId,
  selectedRowIndex,
  showRowNumbers = false,
  sortColumn,
  sortDirection = 'asc',
  stickyHeader = true,
  style,
  variant = 'default',
  onSelectionChange,
  onSelectedRowChange,
  ...tableProps
}: DataTableProps) {
  const [internalSelectedRowIndex, setInternalSelectedRowIndex] = useState(
    () => getDataTableSelectedRowIndex(rows, selectedRowId, selectedRowIndex, getRowIndexById(rows, defaultSelectedRowId) ?? defaultSelectedRowIndex) ?? 0,
  );
  const [internalSort, setInternalSort] = useState(() => getInitialSortState(columns, sortColumn, sortDirection));
  const [hasActiveSort, setHasActiveSort] = useState(() => sortColumn !== undefined);
  const sortInputRef = useRef(`${sortColumn ?? ''}:${sortDirection}`);
  const tableStyle = {
    ...style,
    '--data-table-max-height': maxHeight,
  } as CSSProperties;

  useEffect(() => {
    if (selectedRowId !== undefined || selectedRowIndex !== undefined) {
      setInternalSelectedRowIndex((currentSelectedRowIndex) =>
        getDataTableSelectedRowIndex(rows, selectedRowId, selectedRowIndex, currentSelectedRowIndex) ?? 0,
      );
    }
  }, [rows, selectedRowId, selectedRowIndex]);

  useEffect(() => {
    if (sortColumn === undefined) {
      return;
    }

    const nextSortInput = `${sortColumn}:${sortDirection}`;

    if (sortInputRef.current !== nextSortInput) {
      setInternalSort(getInitialSortState(columns, sortColumn, sortDirection));
      setHasActiveSort(true);
      sortInputRef.current = nextSortInput;
    }
  }, [columns, sortColumn, sortDirection]);

  const sortedRows = useMemo(() => {
    if (!enableSorting || !hasActiveSort || !internalSort.columnId) {
      return rows.map((row, sourceIndex) => ({ row, sourceIndex }));
    }

    return rows
      .map((row, sourceIndex) => ({ row, sourceIndex }))
      .sort((firstRow, secondRow) => {
        const comparison = compareSortValues(getSortValue(firstRow.row, internalSort.columnId), getSortValue(secondRow.row, internalSort.columnId));

        return internalSort.direction === 'asc' ? comparison : -comparison;
      });
  }, [enableSorting, hasActiveSort, internalSort.columnId, internalSort.direction, rows]);

  function selectRow(row: DataTableRow, rowIndex: number) {
    if (!selectable || row.disabled) {
      return;
    }

    setInternalSelectedRowIndex(rowIndex);
    onSelectedRowChange?.(rowIndex, row);
    onSelectionChange?.(row.id, row, rowIndex);
  }

  function toggleSort(column: DataTableColumn) {
    if (!enableSorting || column.sortable === false) {
      return;
    }

    setHasActiveSort(true);
    setInternalSort((currentSort) => ({
      columnId: column.id,
      direction: currentSort.columnId === column.id && currentSort.direction === 'asc' ? 'desc' : 'asc',
    }));
  }

  if (columns.length === 0 || rows.length === 0) {
    return (
      <div
        {...tableProps}
        aria-label={ariaLabel}
        className={getDataTableClassName(className)}
        data-density={density}
        data-variant={variant}
        role="group"
        style={tableStyle}
      >
        <EmptyState alignment="center" description={emptyDescription} size={density} title={emptyTitle} tone="neutral" />
      </div>
    );
  }

  return (
    <div
      {...tableProps}
      aria-label={ariaLabel}
      className={getDataTableClassName(className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-sticky-header={stickyHeader ? 'true' : undefined}
      data-variant={variant}
      role="group"
      style={tableStyle}
    >
      <div className="data-table__scroll">
        <table className="data-table__table">
          <colgroup>
            {showRowNumbers ? <col className="data-table__row-number-column" /> : null}
            {columns.map((column) => (
              <col key={column.id} style={column.width ? { width: column.width } : undefined} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {showRowNumbers ? <th className="data-table__row-number-heading" scope="col">#</th> : null}
              {columns.map((column) => {
                const isSortable = enableSorting && column.sortable !== false;
                const isActiveSort = enableSorting && hasActiveSort && internalSort.columnId === column.id;

                return (
                  <th data-align={column.align ?? 'start'} data-sorted={isActiveSort ? 'true' : undefined} key={column.id} scope="col">
                    {isSortable ? (
                      <Tooltip className="data-table__sort-tooltip" content={`Sort by ${String(column.label)}`} placement="top" size="compact">
                        <button
                          aria-label={column.ariaLabel ?? `Sort by ${String(column.label)}`}
                          aria-sort={isActiveSort ? (internalSort.direction === 'asc' ? 'ascending' : 'descending') : undefined}
                          className="data-table__sort-button"
                          type="button"
                          onClick={() => toggleSort(column)}
                        >
                          <span>{column.label}</span>
                          <span className="data-table__sort-icon">{getSortIcon(isActiveSort, internalSort.direction)}</span>
                        </button>
                      </Tooltip>
                    ) : (
                      <span>{column.label}</span>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sortedRows.map(({ row, sourceIndex }) => {
              const isSelected = selectable && internalSelectedRowIndex === sourceIndex;

              return (
                <tr
                  aria-current={isSelected ? 'true' : undefined}
                  aria-disabled={row.disabled ? 'true' : undefined}
                  aria-label={row.ariaLabel ?? undefined}
                  data-disabled={row.disabled ? 'true' : undefined}
                  data-selected={isSelected ? 'true' : undefined}
                  data-tone={row.tone ?? 'default'}
                  key={row.id}
                  tabIndex={selectable && !row.disabled ? 0 : undefined}
                  onClick={() => selectRow(row, sourceIndex)}
                  onKeyDown={(event) => {
                    if (!selectable || row.disabled || !isRowSelectKey(event)) {
                      return;
                    }

                    event.preventDefault();
                    selectRow(row, sourceIndex);
                  }}
                >
                  {showRowNumbers ? <td className="data-table__row-number">{sourceIndex + 1}</td> : null}
                  {columns.map((column) => (
                    <td data-align={column.align ?? 'start'} key={column.id}>
                      <span className="data-table__cell-content">{row.cells[column.id] ?? null}</span>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export type {
  DataTableAlign,
  DataTableColumn,
  DataTableDensity,
  DataTableProps,
  DataTableRow,
  DataTableSortDirection,
  DataTableTone,
  DataTableVariant,
} from './DataTable.types';
