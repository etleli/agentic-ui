import { type CSSProperties } from 'react';
import { StatusBadge } from '../../feedback/StatusBadge';
import '../Activity.css';
import { getActivityClassName, getActivityToneClass, getStatusBadgeStatus, getStatusLabel } from '../Activity.utils';
import type { ExecutionTimelineProps } from '../Activity.types';

function getPhaseProgress(index: number, state: string | undefined) {
  if (state === 'complete') {
    return 100;
  }

  if (state === 'running') {
    return 62;
  }

  if (state === 'failed') {
    return 100;
  }

  return index === 0 ? 24 : 0;
}

export function ExecutionTimeline({
  className,
  density = 'comfortable',
  phases = [],
  selectable = true,
  selectedPhaseId,
  variant = 'default',
  onPhaseSelect,
  ...timelineProps
}: ExecutionTimelineProps) {
  return (
    <section
      {...timelineProps}
      className={getActivityClassName('execution-timeline', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <div className="execution-timeline__phases">
        {phases.map((phase, index) => {
          const tone = getActivityToneClass(undefined, phase.state === 'running' ? 'running' : phase.state === 'complete' ? 'complete' : phase.state === 'failed' ? 'failed' : undefined);
          const isSelected = selectedPhaseId === phase.id;

          return (
            <button
              aria-disabled={selectable ? undefined : true}
              aria-pressed={isSelected}
              className="execution-timeline__phase"
              data-selected={isSelected ? 'true' : undefined}
              data-tone={tone}
              key={phase.id}
              tabIndex={selectable ? undefined : -1}
              type="button"
              onClick={selectable ? () => onPhaseSelect?.(phase.id, phase) : undefined}
            >
              <span className="activity-label">{phase.label ?? `Step ${index + 1}`}</span>
              <strong className="activity-title">{phase.title}</strong>
              {phase.description ? <span className="activity-description">{phase.description}</span> : null}
              <span className="execution-timeline__bar">
                <span className="execution-timeline__bar-fill" style={{ '--execution-timeline-progress': `${getPhaseProgress(index, phase.state)}%` } as CSSProperties} />
              </span>
              <span className="activity-meta">
                {getStatusLabel(phase.state === 'running' ? 'running' : phase.state === 'complete' ? 'complete' : phase.state === 'failed' ? 'failed' : undefined)}
                {phase.duration ? ` · ${phase.duration}` : ''}
              </span>
              <StatusBadge label={getStatusLabel(phase.state === 'running' ? 'running' : phase.state === 'complete' ? 'complete' : phase.state === 'failed' ? 'failed' : undefined)} size="compact" status={getStatusBadgeStatus(phase.state === 'running' ? 'running' : phase.state === 'complete' ? 'complete' : phase.state === 'failed' ? 'failed' : undefined)} />
            </button>
          );
        })}
      </div>
    </section>
  );
}

export type { ExecutionPhaseState, ExecutionTimelinePhase, ExecutionTimelineProps } from '../Activity.types';
