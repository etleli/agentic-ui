import type { HTMLAttributes, ReactNode } from 'react';

export type DataTableAlign = 'start' | 'center' | 'end';
export type DataTableDensity = 'compact' | 'comfortable' | 'spacious';
export type DataTableSortDirection = 'asc' | 'desc';
export type DataTableTone = 'default' | 'accent' | 'positive' | 'negative' | 'warning' | 'neutral' | 'muted';
export type DataTableVariant = 'default' | 'muted' | 'outline';

export type DataTableSortValue = number | string | null | undefined;

export type DataTableColumn = {
  align?: DataTableAlign;
  ariaLabel?: string;
  id: string;
  label: ReactNode;
  sortable?: boolean;
  width?: string;
};

export type DataTableRow = {
  ariaLabel?: string;
  cells: Record<string, ReactNode>;
  disabled?: boolean;
  id: string;
  sortValues?: Record<string, DataTableSortValue>;
  tone?: DataTableTone;
};

export type DataTableProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  columns: DataTableColumn[];
  defaultSelectedRowId?: string;
  defaultSelectedRowIndex?: number;
  density?: DataTableDensity;
  emptyDescription?: ReactNode;
  emptyTitle?: ReactNode;
  enableSorting?: boolean;
  maxHeight?: string;
  rows: DataTableRow[];
  selectable?: boolean;
  selectedRowId?: string;
  selectedRowIndex?: number;
  showRowNumbers?: boolean;
  sortColumn?: string;
  sortDirection?: DataTableSortDirection;
  stickyHeader?: boolean;
  variant?: DataTableVariant;
  onSelectionChange?: (rowId: string, row: DataTableRow, rowIndex: number) => void;
  onSelectedRowChange?: (rowIndex: number, row: DataTableRow) => void;
};
