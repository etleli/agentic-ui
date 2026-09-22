import '../AdvancedData.css';
import { getAdvancedDataClassName } from '../AdvancedData.utils';
import type { SchemaExplorerProps } from '../AdvancedData.types';

export function SchemaExplorer({
  className,
  density = 'comfortable',
  selectable = true,
  selectedFieldId,
  selectedTableId,
  showNullable = true,
  tables = [],
  title = 'Schema explorer',
  variant = 'default',
  onFieldSelect,
  onTableSelect,
  ...explorerProps
}: SchemaExplorerProps) {
  const activeTable = tables.find((table) => table.id === selectedTableId) ?? tables[0];

  return (
    <section
      {...explorerProps}
      className={getAdvancedDataClassName('schema-explorer', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="advanced-data__header">
        <span className="advanced-data__heading-copy">
          <span className="advanced-data__eyebrow">Data model</span>
          <strong className="advanced-data__title">{title}</strong>
          <span className="advanced-data__description">Browse tables and fields with nullable and type metadata.</span>
        </span>
      </header>
      <div className="schema-explorer__body">
        <div className="schema-explorer__tables" aria-label="Tables">
          {tables.map((table) => {
            const isSelected = table.id === activeTable?.id;
            return (
              <button
                aria-disabled={selectable ? undefined : true}
                aria-pressed={isSelected}
                className="schema-explorer__table"
                data-selected={isSelected ? 'true' : undefined}
                key={table.id}
                tabIndex={selectable ? undefined : -1}
                type="button"
                onClick={selectable ? () => onTableSelect?.(table.id, table) : undefined}
              >
                <span className="schema-explorer__row">
                  <span className="schema-explorer__label">{table.label}</span>
                  <span className="schema-explorer__meta">{table.fields?.length ?? 0}</span>
                </span>
                {table.description ? <span className="schema-explorer__meta">{table.description}</span> : null}
              </button>
            );
          })}
        </div>
        <div className="schema-explorer__fields" aria-label="Fields">
          {(activeTable?.fields ?? []).map((field) => {
            const isSelected = selectedFieldId === field.id;

            return (
              <button
                aria-disabled={selectable ? undefined : true}
                aria-pressed={isSelected}
                className="schema-explorer__field"
                data-selected={isSelected ? 'true' : undefined}
                key={field.id}
                tabIndex={selectable ? undefined : -1}
                type="button"
                onClick={selectable ? () => activeTable && onFieldSelect?.(activeTable.id, field.id, field) : undefined}
              >
                <span className="schema-explorer__row">
                  <span className="schema-explorer__label">{field.label}</span>
                  <span className="schema-explorer__meta">{field.type}</span>
                </span>
                {field.description ? <span className="schema-explorer__meta">{field.description}</span> : null}
                {showNullable && field.nullable ? <span className="schema-explorer__nullable">Nullable</span> : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export type { SchemaExplorerField, SchemaExplorerProps, SchemaExplorerTable } from '../AdvancedData.types';
