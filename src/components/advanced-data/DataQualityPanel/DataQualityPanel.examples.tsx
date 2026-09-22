import { useEffect, useRef, useState } from 'react';
import { DataQualityPanel } from './DataQualityPanel';
import type { AdvancedDataDensity, AdvancedDataStatus, AdvancedDataVariant, DataQualityCheck } from '../AdvancedData.types';

export type DataQualityPanelExampleProps = {
  density?: AdvancedDataDensity;
  score?: number;
  selectable?: boolean;
  selectedCheckId?: string;
  showProgress?: boolean;
  status?: AdvancedDataStatus;
  title?: string;
  variant?: AdvancedDataVariant;
};

const checks: DataQualityCheck[] = [
  {
    description: 'Every row has a replayable source id and normalized symbol key.',
    id: 'identity',
    label: 'Identity completeness',
    metric: '100%',
    progress: 100,
    status: 'pass',
  },
  {
    description: 'Delayed broker timestamps are present but excluded from live decisions.',
    id: 'freshness',
    label: 'Freshness window',
    metric: '97%',
    progress: 97,
    status: 'warn',
  },
  {
    description: 'Required numerical fields are finite and inside expected runtime bounds.',
    id: 'bounds',
    label: 'Range validation',
    metric: '99%',
    progress: 99,
    status: 'pass',
  },
  {
    description: 'Three candidate rows need manual review before order routing.',
    id: 'review',
    label: 'Manual review queue',
    metric: '3',
    progress: 62,
    status: 'running',
  },
];

export function DataQualityPanelExample({
  density = 'comfortable',
  score = 92,
  selectable = true,
  selectedCheckId = 'freshness',
  showProgress = true,
  status = 'ready',
  title = 'Runtime validation',
  variant = 'default',
}: DataQualityPanelExampleProps) {
  const [internalSelectedCheckId, setInternalSelectedCheckId] = useState(selectedCheckId);
  const selectedCheckIdRef = useRef(selectedCheckId);

  useEffect(() => {
    if (selectedCheckIdRef.current !== selectedCheckId) {
      setInternalSelectedCheckId(selectedCheckId);
      selectedCheckIdRef.current = selectedCheckId;
    }
  }, [selectedCheckId]);

  return (
    <DataQualityPanel
      checks={checks}
      density={density}
      description="Validation summary for the selected runtime data slice."
      score={score}
      selectable={selectable}
      selectedCheckId={internalSelectedCheckId}
      showProgress={showProgress}
      status={status}
      title={title}
      variant={variant}
      onCheckSelect={setInternalSelectedCheckId}
    />
  );
}
