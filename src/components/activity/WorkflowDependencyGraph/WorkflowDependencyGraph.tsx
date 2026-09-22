import { StatusBadge } from '../../feedback/StatusBadge';
import '../Activity.css';
import { getActivityClassName, getStatusBadgeStatus, getStatusLabel } from '../Activity.utils';
import type { WorkflowDependencyGraphProps } from '../Activity.types';

export function WorkflowDependencyGraph({
  className,
  density = 'comfortable',
  nodes = [],
  selectable = true,
  selectedNodeId,
  variant = 'default',
  onNodeSelect,
  ...graphProps
}: WorkflowDependencyGraphProps) {
  return (
    <section
      {...graphProps}
      className={getActivityClassName('workflow-dependency-graph', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <div className="workflow-dependency-graph__nodes">
        {nodes.map((node) => {
          const isSelected = selectedNodeId === node.id;

          return (
            <button
              aria-disabled={selectable ? undefined : true}
              aria-pressed={isSelected}
              className="workflow-dependency-graph__node"
              data-selected={isSelected ? 'true' : undefined}
              key={node.id}
              tabIndex={selectable ? undefined : -1}
              type="button"
              onClick={selectable ? () => onNodeSelect?.(node.id, node) : undefined}
            >
              <span className="activity-copy">
                <strong className="activity-title">{node.label}</strong>
                <span className="activity-meta">{node.dependsOn?.length ? `Depends on ${node.dependsOn.length}` : 'Root step'}</span>
              </span>
              <StatusBadge label={getStatusLabel(node.state)} size="compact" status={getStatusBadgeStatus(node.state)} />
              {node.dependsOn?.length ? (
                <span className="workflow-dependency-graph__dependencies">
                  {node.dependsOn.map((dependency) => (
                    <span className="workflow-dependency-graph__dependency" key={dependency}>
                      {dependency}
                    </span>
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export type { WorkflowDependencyGraphProps, WorkflowDependencyNode } from '../Activity.types';
