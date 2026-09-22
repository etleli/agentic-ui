import { useEffect, useRef, useState } from 'react';
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
import type { DataQualityCheck, DataQualityPanelProps } from '../AdvancedData.types';

function getCheckTone(check: DataQualityCheck) {
  if (check.status === 'pass') {
    return 'positive';
  }

  if (check.status === 'fail') {
    return 'negative';
  }

  if (check.status === 'warn' || check.status === 'running') {
    return 'warning';
  }

  return 'neutral';
}

export function DataQualityPanel({
  checks = [],
  className,
  density = 'comfortable',
  description = 'Validation checks for the selected dataset slice.',
  score = 92,
  selectable = true,
  selectedCheckId,
  showProgress = true,
  status = 'ready',
  title = 'Quality checks',
  variant = 'default',
  onCheckSelect,
  ...panelProps
}: DataQualityPanelProps) {
  const fallbackCheckId = checks[0]?.id ?? '';
  const [internalSelectedCheckId, setInternalSelectedCheckId] = useState(selectedCheckId ?? fallbackCheckId);
  const selectedCheckIdRef = useRef(selectedCheckId);
  const size = getAdvancedDataSize(density);
  const qualityScore = clampAdvancedDataPercent(score);

  useEffect(() => {
    if (selectedCheckId !== undefined && selectedCheckIdRef.current !== selectedCheckId) {
      setInternalSelectedCheckId(selectedCheckId);
      selectedCheckIdRef.current = selectedCheckId;
    }
  }, [selectedCheckId]);

  function selectCheck(check: DataQualityCheck) {
    setInternalSelectedCheckId(check.id);
    onCheckSelect?.(check.id, check);
  }

  return (
    <section
      {...panelProps}
      className={getAdvancedDataClassName('data-quality-panel', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="advanced-data__header">
        <span className="advanced-data__heading-copy">
          <span className="advanced-data__eyebrow">Data quality</span>
          <strong className="advanced-data__title">{title}</strong>
          {description ? <span className="advanced-data__description">{description}</span> : null}
        </span>
        <StatusBadge animated={status === 'running'} label={getAdvancedDataStatusLabel(status)} size={size} status={getAdvancedDataStatus(status)} />
      </header>

      <div className="data-quality-panel__score">
        <strong className="data-quality-panel__score-value">{Math.round(qualityScore)}%</strong>
        <ProgressBar label="Overall quality" showValue size={size} tone={getAdvancedDataProgressTone(qualityScore >= 90 ? 'positive' : 'warning')} value={qualityScore} />
      </div>

      <div className="data-quality-panel__checks" role={selectable ? 'listbox' : 'list'} aria-label="Data quality checks">
        {checks.map((check) => {
          const isSelected = internalSelectedCheckId === check.id;
          const tone = getCheckTone(check);

          return (
            <button
              aria-current={!selectable && isSelected ? 'true' : undefined}
              aria-disabled={selectable ? undefined : true}
              aria-selected={selectable ? isSelected : undefined}
              className="data-quality-panel__check"
              data-selected={isSelected ? 'true' : undefined}
              data-status={check.status ?? 'pass'}
              key={check.id}
              role={selectable ? 'option' : 'listitem'}
              tabIndex={selectable ? undefined : -1}
              type="button"
              onClick={selectable ? () => selectCheck(check) : undefined}
            >
              <span className="data-quality-panel__check-copy">
                <span className="data-quality-panel__check-label">{getAdvancedDataStatusLabel(check.status)}</span>
                <strong className="data-quality-panel__check-title">{check.label}</strong>
                {check.description ? <span className="data-quality-panel__check-description">{check.description}</span> : null}
              </span>
              <span className="data-quality-panel__check-tail">
                {check.metric ? <strong className="query-result-panel__stat-value">{check.metric}</strong> : null}
                <StatusBadge
                  animated={check.status === 'running'}
                  label={getAdvancedDataStatusLabel(check.status)}
                  showDot
                  size={size}
                  status={getAdvancedDataStatus(check.status)}
                />
                {showProgress && typeof check.progress === 'number' ? (
                  <ProgressBar
                    aria-label={`${String(check.label)} progress`}
                    label=""
                    showValue={false}
                    size="compact"
                    tone={getAdvancedDataProgressTone(tone)}
                    value={check.progress}
                  />
                ) : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export type { DataQualityCheck, DataQualityCheckStatus, DataQualityPanelProps } from '../AdvancedData.types';
