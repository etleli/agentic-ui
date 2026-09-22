import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { PropertyList } from '../../data-display/PropertyList';
import { ProgressBar } from '../../feedback/ProgressBar';
import { StatusBadge } from '../../feedback/StatusBadge';
import '../AdvancedData.css';
import {
  clampAdvancedDataPercent,
  getAdvancedDataClassName,
  getAdvancedDataProgressTone,
  getAdvancedDataSize,
  getAdvancedDataStatus,
  getAdvancedDataStatusLabel,
} from '../AdvancedData.utils';
import type { FieldProfileBucket, FieldProfileProps } from '../AdvancedData.types';

export function FieldProfile({
  buckets = [],
  className,
  density = 'comfortable',
  description = 'Column profile for selected runtime data.',
  facts = [],
  fieldName = 'exposure_limit',
  fieldType = 'number',
  missingRate = 0,
  selectable = true,
  selectedBucketIndex,
  showDistribution = true,
  status = 'ready',
  uniqueRate = 84,
  variant = 'default',
  onBucketSelect,
  ...profileProps
}: FieldProfileProps) {
  const [internalSelectedBucketIndex, setInternalSelectedBucketIndex] = useState(selectedBucketIndex ?? 0);
  const selectedBucketIndexRef = useRef(selectedBucketIndex);
  const size = getAdvancedDataSize(density);
  const missing = clampAdvancedDataPercent(missingRate);
  const unique = clampAdvancedDataPercent(uniqueRate);
  const maxBucketValue = useMemo(() => Math.max(...buckets.map((bucket) => bucket.value), 1), [buckets]);

  useEffect(() => {
    if (selectedBucketIndex !== undefined && selectedBucketIndexRef.current !== selectedBucketIndex) {
      setInternalSelectedBucketIndex(selectedBucketIndex);
      selectedBucketIndexRef.current = selectedBucketIndex;
    }
  }, [selectedBucketIndex]);

  function selectBucket(bucket: FieldProfileBucket, bucketIndex: number) {
    setInternalSelectedBucketIndex(bucketIndex);
    onBucketSelect?.(bucketIndex, bucket);
  }

  return (
    <section
      {...profileProps}
      className={getAdvancedDataClassName('field-profile', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="advanced-data__header">
        <span className="advanced-data__heading-copy">
          <span className="advanced-data__eyebrow">Field profile</span>
          <strong className="advanced-data__title">{fieldName}</strong>
          {description ? <span className="advanced-data__description">{description}</span> : null}
        </span>
        <StatusBadge animated={status === 'running'} label={getAdvancedDataStatusLabel(status)} size={size} status={getAdvancedDataStatus(status)} />
      </header>

      <div className="advanced-data__stat-grid">
        <span className="field-profile__stat">
          <span className="field-profile__stat-label">Type</span>
          <strong className="field-profile__stat-value">{fieldType}</strong>
        </span>
        <span className="field-profile__stat">
          <span className="field-profile__stat-label">Missing</span>
          <strong className="field-profile__stat-value">{Math.round(missing)}%</strong>
        </span>
        <span className="field-profile__stat">
          <span className="field-profile__stat-label">Unique</span>
          <strong className="field-profile__stat-value">{Math.round(unique)}%</strong>
        </span>
        <span className="field-profile__stat">
          <span className="field-profile__stat-label">Buckets</span>
          <strong className="field-profile__stat-value">{buckets.length}</strong>
        </span>
      </div>

      <div className="field-profile__body">
        <span className="field-profile__facts">
          <PropertyList columns="one" density={density} items={facts} showDividers variant={variant === 'outline' ? 'plain' : 'striped'} />
        </span>

        <span className="advanced-data__heading-copy">
          <ProgressBar
            label="Completeness"
            showValue
            size={size}
            tone={getAdvancedDataProgressTone(missing > 8 ? 'warning' : 'positive')}
            value={100 - missing}
          />
          <ProgressBar label="Uniqueness" showValue size={size} tone={getAdvancedDataProgressTone('accent')} value={unique} />

          {showDistribution && buckets.length > 0 ? (
            <span className="field-profile__distribution" role={selectable ? 'listbox' : 'list'} aria-label="Field distribution buckets">
              {buckets.map((bucket, bucketIndex) => {
                const percent = (bucket.value / maxBucketValue) * 100;
                const isSelected = internalSelectedBucketIndex === bucketIndex;

                return (
                  <button
                    aria-current={!selectable && isSelected ? 'true' : undefined}
                    aria-disabled={selectable ? undefined : true}
                    aria-selected={selectable ? isSelected : undefined}
                    className="field-profile__bucket"
                    data-selected={isSelected ? 'true' : undefined}
                    data-tone={bucket.tone ?? 'accent'}
                    key={bucket.id}
                    role={selectable ? 'option' : 'listitem'}
                    style={{ '--field-profile-bucket-value': `${Math.max(percent, 4)}%` } as CSSProperties}
                    tabIndex={selectable ? undefined : -1}
                    type="button"
                    onClick={selectable ? () => selectBucket(bucket, bucketIndex) : undefined}
                  >
                    <span className="field-profile__bar" aria-hidden="true" />
                    <span className="field-profile__bucket-label">{bucket.label}</span>
                    {bucket.count ? <span className="field-profile__bucket-count">{bucket.count}</span> : null}
                  </button>
                );
              })}
            </span>
          ) : null}
        </span>
      </div>
    </section>
  );
}

export type { FieldProfileBucket, FieldProfileFact, FieldProfileProps } from '../AdvancedData.types';
