import { useEffect, useRef, useState } from 'react';
import { DataTable } from '../../data-display/DataTable';
import { StatusBadge } from '../../feedback/StatusBadge';
import '../AdvancedData.css';
import {
  formatAdvancedDataCount,
  formatAdvancedDataDuration,
  getAdvancedDataClassName,
  getAdvancedDataSize,
  getAdvancedDataStatus,
  getAdvancedDataStatusLabel,
} from '../AdvancedData.utils';
import type { DataTableRow } from '../../data-display/DataTable';
import type { QueryResultPanelProps } from '../AdvancedData.types';

export function QueryResultPanel({
  className,
  columns = [],
  density = 'comfortable',
  description = 'Preview of reviewed rows returned by a local query.',
  durationMs = 184,
  freshness = 'reviewed now',
  maxHeight = '320px',
  query = '',
  rowCount = 0,
  rows = [],
  scannedRows = 0,
  selectable = true,
  selectedRowIndex,
  showQuery = true,
  showSummary = true,
  status = 'ready',
  title = 'Query result',
  variant = 'default',
  onSelectedRowChange,
  ...panelProps
}: QueryResultPanelProps) {
  const [internalSelectedRowIndex, setInternalSelectedRowIndex] = useState(selectedRowIndex ?? 0);
  const selectedRowIndexRef = useRef(selectedRowIndex);
  const size = getAdvancedDataSize(density);

  useEffect(() => {
    if (selectedRowIndex !== undefined && selectedRowIndexRef.current !== selectedRowIndex) {
      setInternalSelectedRowIndex(selectedRowIndex);
      selectedRowIndexRef.current = selectedRowIndex;
    }
  }, [selectedRowIndex]);

  function selectRow(rowIndex: number, row: DataTableRow) {
    setInternalSelectedRowIndex(rowIndex);
    onSelectedRowChange?.(rowIndex, row);
  }

  return (
    <section
      {...panelProps}
      className={getAdvancedDataClassName('query-result-panel', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="advanced-data__header">
        <span className="advanced-data__heading-copy">
          <span className="advanced-data__eyebrow">Query result</span>
          <strong className="advanced-data__title">{title}</strong>
          {description ? <span className="advanced-data__description">{description}</span> : null}
        </span>
        <StatusBadge animated={status === 'running'} label={getAdvancedDataStatusLabel(status)} size={size} status={getAdvancedDataStatus(status)} />
      </header>

      {showSummary ? (
        <div className="query-result-panel__summary">
          <span className="query-result-panel__stat">
            <span className="query-result-panel__stat-label">Rows</span>
            <strong className="query-result-panel__stat-value">{formatAdvancedDataCount(rowCount || rows.length)}</strong>
          </span>
          <span className="query-result-panel__stat">
            <span className="query-result-panel__stat-label">Scanned</span>
            <strong className="query-result-panel__stat-value">{formatAdvancedDataCount(scannedRows)}</strong>
          </span>
          <span className="query-result-panel__stat">
            <span className="query-result-panel__stat-label">Duration</span>
            <strong className="query-result-panel__stat-value">{formatAdvancedDataDuration(durationMs)}</strong>
          </span>
          <span className="query-result-panel__stat">
            <span className="query-result-panel__stat-label">Freshness</span>
            <strong className="query-result-panel__stat-value">{freshness}</strong>
          </span>
        </div>
      ) : null}

      {showQuery && query ? <pre className="query-result-panel__query">{query}</pre> : null}

      <DataTable
        columns={columns}
        density={density}
        enableSorting
        maxHeight={maxHeight}
        rows={rows}
        selectable={selectable}
        selectedRowIndex={internalSelectedRowIndex}
        showRowNumbers
        stickyHeader
        variant={variant}
        onSelectedRowChange={selectRow}
      />
    </section>
  );
}

export type { QueryResultPanelProps } from '../AdvancedData.types';
