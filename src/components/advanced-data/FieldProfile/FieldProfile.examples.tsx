import { useEffect, useRef, useState } from 'react';
import { FieldProfile } from './FieldProfile';
import type { AdvancedDataDensity, AdvancedDataStatus, AdvancedDataVariant, FieldProfileBucket, FieldProfileFact } from '../AdvancedData.types';

export type FieldProfileExampleProps = {
  density?: AdvancedDataDensity;
  fieldName?: string;
  fieldType?: string;
  missingRate?: number;
  selectable?: boolean;
  selectedBucketIndex?: number;
  showDistribution?: boolean;
  status?: AdvancedDataStatus;
  uniqueRate?: number;
  variant?: AdvancedDataVariant;
};

const buckets: FieldProfileBucket[] = [
  { count: '8.2k', id: 'b0', label: '0-10', value: 18, tone: 'neutral' },
  { count: '16.4k', id: 'b1', label: '10-25', value: 36, tone: 'accent' },
  { count: '24.9k', id: 'b2', label: '25-50', value: 55, tone: 'positive' },
  { count: '12.8k', id: 'b3', label: '50-75', value: 28, tone: 'warning' },
  { count: '3.1k', id: 'b4', label: '75+', value: 7, tone: 'negative' },
];

const facts: FieldProfileFact[] = [
  { id: 'source', label: 'Source', meta: 'lineage', value: 'risk_limits.current' },
  { id: 'min', label: 'Minimum', value: '0.00%' },
  { id: 'p50', label: 'Median', value: '34.20%' },
  { id: 'max', label: 'Maximum', tone: 'warning', value: '92.00%' },
];

export function FieldProfileExample({
  density = 'comfortable',
  fieldName = 'exposure_limit',
  fieldType = 'number',
  missingRate = 2,
  selectable = true,
  selectedBucketIndex = 2,
  showDistribution = true,
  status = 'ready',
  uniqueRate = 84,
  variant = 'default',
}: FieldProfileExampleProps) {
  const [internalSelectedBucketIndex, setInternalSelectedBucketIndex] = useState(selectedBucketIndex);
  const selectedBucketIndexRef = useRef(selectedBucketIndex);

  useEffect(() => {
    if (selectedBucketIndexRef.current !== selectedBucketIndex) {
      setInternalSelectedBucketIndex(selectedBucketIndex);
      selectedBucketIndexRef.current = selectedBucketIndex;
    }
  }, [selectedBucketIndex]);

  return (
    <FieldProfile
      buckets={buckets}
      density={density}
      description="Distribution and quality profile for the selected numeric field."
      facts={facts}
      fieldName={fieldName}
      fieldType={fieldType}
      missingRate={missingRate}
      selectable={selectable}
      selectedBucketIndex={internalSelectedBucketIndex}
      showDistribution={showDistribution}
      status={status}
      uniqueRate={uniqueRate}
      variant={variant}
      onBucketSelect={setInternalSelectedBucketIndex}
    />
  );
}
