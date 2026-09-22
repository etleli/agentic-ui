import '../AdvancedData.css';
import { getAdvancedDataClassName, getAdvancedDataStatusLabel } from '../AdvancedData.utils';
import type { LineageTraceProps } from '../AdvancedData.types';

export function LineageTrace({
  className,
  density = 'comfortable',
  nodes = [],
  orientation = 'horizontal',
  selectable = true,
  selectedNodeId,
  title = 'Lineage trace',
  variant = 'default',
  onNodeSelect,
  ...traceProps
}: LineageTraceProps) {
  return (
    <section
      {...traceProps}
      className={getAdvancedDataClassName('lineage-trace', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="advanced-data__header">
        <span className="advanced-data__heading-copy">
          <span className="advanced-data__eyebrow">Lineage</span>
          <strong className="advanced-data__title">{title}</strong>
          <span className="advanced-data__description">Trace source, transform, validation, and delivery steps.</span>
        </span>
      </header>
      <div className="lineage-trace__nodes" data-orientation={orientation}>
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;

          return (
            <button
              aria-disabled={selectable ? undefined : true}
              aria-pressed={isSelected}
              className="lineage-trace__node"
              data-selected={isSelected ? 'true' : undefined}
              data-tone={node.tone ?? 'neutral'}
              key={node.id}
              tabIndex={selectable ? undefined : -1}
              type="button"
              onClick={selectable ? () => onNodeSelect?.(node.id, node) : undefined}
            >
              <span className="lineage-trace__label">{node.label}</span>
              {node.description ? <span className="lineage-trace__meta">{node.description}</span> : null}
              <span className="lineage-trace__meta">{getAdvancedDataStatusLabel(node.status ?? 'ready')}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export type { LineageTraceNode, LineageTraceProps } from '../AdvancedData.types';
