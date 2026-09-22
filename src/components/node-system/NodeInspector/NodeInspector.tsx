import { Panel } from '../../surfaces/Panel';
import { PropertyList } from '../../data-display/PropertyList';
import { TextArea } from '../../inputs/TextArea';
import '../NodeSystem.css';
import type { NodeInspectorNode, NodeInspectorProps, NodeInspectorProperty } from '../NodeSystem.types';

function getInspectorClassName(className: NodeInspectorProps['className']) {
  return ['node-system-inspector', className].filter(Boolean).join(' ');
}

export function NodeInspector({
  children,
  className,
  configLabel = 'Configuration',
  configValue = '',
  emptyDescription = 'Select a node to inspect runtime details and configuration.',
  emptyTitle = 'No node selected',
  properties = [],
  selectedNode,
  showConfig = true,
  onConfigChange,
  ...inspectorProps
}: NodeInspectorProps) {
  if (!selectedNode) {
    return (
      <Panel {...inspectorProps} as="aside" className={getInspectorClassName(className)} padding="comfortable" variant="filled">
        <div className="node-system-inspector__empty" role="status">
          <strong>{emptyTitle}</strong>
          <span>{emptyDescription}</span>
        </div>
      </Panel>
    );
  }

  return (
    <Panel
      {...inspectorProps}
      actions={
        selectedNode.status ? (
          <span className="node-system-inspector__status" data-tone={selectedNode.tone ?? 'neutral'}>
            {selectedNode.status}
          </span>
        ) : null
      }
      as="aside"
      className={getInspectorClassName(className)}
      description={selectedNode.description}
      heading={selectedNode.title}
      padding="comfortable"
      variant="raised"
    >
      {children ?? (
        <>
          {properties.length > 0 ? <PropertyList density="compact" items={properties} selectable={false} showDividers variant="striped" /> : null}
          {showConfig ? (
            <TextArea
              ariaLabel={configLabel}
              label={configLabel}
              maxRows={8}
              minRows={4}
              resize="none"
              value={configValue}
              onValueChange={onConfigChange}
            />
          ) : null}
        </>
      )}
    </Panel>
  );
}

export type { NodeInspectorNode, NodeInspectorProps, NodeInspectorProperty };
