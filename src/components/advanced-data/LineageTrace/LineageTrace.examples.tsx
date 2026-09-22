import { useEffect, useState } from 'react';
import { LineageTrace } from './LineageTrace';
import type { AdvancedDataDensity, AdvancedDataVariant } from '../AdvancedData.types';

export type LineageTraceExampleProps = {
  density?: AdvancedDataDensity;
  orientation?: 'horizontal' | 'vertical';
  selectable?: boolean;
  selectedNodeId?: string;
  variant?: AdvancedDataVariant;
};

const lineageNodes = [
  { description: 'Broker stream', id: 'source', label: 'Source', status: 'ready' as const, tone: 'accent' as const },
  { description: 'Normalize ticks', id: 'transform', label: 'Transform', status: 'running' as const, tone: 'warning' as const },
  { description: 'Quality gates', id: 'validate', label: 'Validate', status: 'ready' as const, tone: 'positive' as const },
  { description: 'Feature store', id: 'publish', label: 'Publish', status: 'paused' as const, tone: 'neutral' as const },
];

export function LineageTraceExample({ density = 'comfortable', orientation = 'horizontal', selectable = true, selectedNodeId = 'transform', variant = 'default' }: LineageTraceExampleProps) {
  const [activeNodeId, setActiveNodeId] = useState(selectedNodeId);

  useEffect(() => {
    setActiveNodeId(selectedNodeId);
  }, [selectedNodeId]);

  return (
    <LineageTrace
      density={density}
      nodes={lineageNodes}
      orientation={orientation}
      selectable={selectable}
      selectedNodeId={activeNodeId}
      variant={variant}
      onNodeSelect={setActiveNodeId}
    />
  );
}
