import '../AdvancedData.css';
import { getAdvancedDataClassName } from '../AdvancedData.utils';
import type { PivotSummaryProps } from '../AdvancedData.types';

export function PivotSummary({
  cells = [],
  className,
  columns = [],
  density = 'comfortable',
  metricLabel = 'Net P/L',
  rows = [],
  title = 'Pivot summary',
  variant = 'default',
  ...summaryProps
}: PivotSummaryProps) {
  const cellMap = new Map(cells.map((cell) => [`${cell.rowId}:${cell.columnId}`, cell]));

  return (
    <section {...summaryProps} className={getAdvancedDataClassName('pivot-summary', className)} data-density={density} data-variant={variant}>
      <header className="advanced-data__header">
        <span className="advanced-data__heading-copy">
          <span className="advanced-data__eyebrow">Pivot</span>
          <strong className="advanced-data__title">{title}</strong>
          <span className="advanced-data__description">{metricLabel}</span>
        </span>
      </header>
      <div className="pivot-summary__table">
        <table className="pivot-summary__grid">
          <thead>
            <tr>
              <th scope="col">Segment</th>
              {columns.map((column) => (
                <th key={column.id} scope="col">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td>
                  <strong>{row.label}</strong>
                  {row.meta ? <span className="pivot-summary__meta"> {row.meta}</span> : null}
                </td>
                {columns.map((column) => {
                  const cell = cellMap.get(`${row.id}:${column.id}`);
                  return (
                    <td key={column.id}>
                      <span className="pivot-summary__value" data-tone={cell?.tone ?? 'neutral'}>
                        {cell?.value ?? '-'}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export type { PivotSummaryAxisItem, PivotSummaryCell, PivotSummaryProps } from '../AdvancedData.types';
