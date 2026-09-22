import { useEffect, useState } from 'react';
import { WorkflowDependencyGraph } from './WorkflowDependencyGraph';
import type { ActivityDensity, ActivityVariant } from '../Activity.types';

export type WorkflowDependencyGraphExampleProps = {
  density?: ActivityDensity;
  selectable?: boolean;
  selectedNodeId?: string;
  variant?: ActivityVariant;
};

const workflowNodes = [
  { id: 'hydrate', label: 'Hydrate inputs', state: 'complete' as const },
  { dependsOn: ['hydrate'], id: 'score', label: 'Score candidates', state: 'active' as const },
  { dependsOn: ['score'], id: 'validate', label: 'Validate risk', state: 'pending' as const },
  { dependsOn: ['validate'], id: 'route', label: 'Route orders', state: 'pending' as const },
];

export function WorkflowDependencyGraphExample({ density = 'comfortable', selectable = true, selectedNodeId = 'score', variant = 'default' }: WorkflowDependencyGraphExampleProps) {
  const [activeNodeId, setActiveNodeId] = useState(selectedNodeId);

  useEffect(() => {
    setActiveNodeId(selectedNodeId);
  }, [selectedNodeId]);

  return (
    <WorkflowDependencyGraph
      density={density}
      nodes={workflowNodes}
      selectable={selectable}
      selectedNodeId={activeNodeId}
      variant={variant}
      onNodeSelect={setActiveNodeId}
    />
  );
}
