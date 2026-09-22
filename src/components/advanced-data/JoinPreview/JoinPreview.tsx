import '../AdvancedData.css';
import { getAdvancedDataClassName } from '../AdvancedData.utils';
import type { JoinPreviewProps } from '../AdvancedData.types';

export function JoinPreview({
  className,
  density = 'comfortable',
  joinType = 'left',
  left = { keyLabel: 'symbol', label: 'positions', rowCount: '42 rows' },
  matchedRows = 38,
  right = { keyLabel: 'symbol', label: 'quotes', rowCount: '128 rows' },
  unmatchedLeft = 4,
  unmatchedRight = 90,
  variant = 'default',
  ...previewProps
}: JoinPreviewProps) {
  return (
    <section {...previewProps} className={getAdvancedDataClassName('join-preview', className)} data-density={density} data-variant={variant}>
      <header className="advanced-data__header">
        <span className="advanced-data__heading-copy">
          <span className="advanced-data__eyebrow">Join</span>
          <strong className="advanced-data__title">{String(joinType).toUpperCase()} join preview</strong>
          <span className="advanced-data__description">Validate key coverage before composing datasets.</span>
        </span>
      </header>
      <div className="join-preview__flow">
        <span className="join-preview__dataset">
          <strong className="join-preview__label">{left.label}</strong>
          <span className="join-preview__meta">{left.rowCount}</span>
          <span className="join-preview__meta">Key: {left.keyLabel}</span>
        </span>
        <span className="join-preview__center">
          <strong>{matchedRows.toLocaleString()}</strong>
          <span className="join-preview__meta">matched</span>
        </span>
        <span className="join-preview__dataset">
          <strong className="join-preview__label">{right.label}</strong>
          <span className="join-preview__meta">{right.rowCount}</span>
          <span className="join-preview__meta">Key: {right.keyLabel}</span>
        </span>
      </div>
      <div className="join-preview__metrics">
        <span className="join-preview__metric">
          <span className="join-preview__meta">Matched</span>
          <strong>{matchedRows.toLocaleString()}</strong>
        </span>
        <span className="join-preview__metric">
          <span className="join-preview__meta">Left only</span>
          <strong>{unmatchedLeft.toLocaleString()}</strong>
        </span>
        <span className="join-preview__metric">
          <span className="join-preview__meta">Right only</span>
          <strong>{unmatchedRight.toLocaleString()}</strong>
        </span>
      </div>
    </section>
  );
}

export type { JoinPreviewDataset, JoinPreviewProps } from '../AdvancedData.types';
