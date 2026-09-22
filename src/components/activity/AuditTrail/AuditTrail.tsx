import '../Activity.css';
import { getActivityClassName } from '../Activity.utils';
import type { AuditTrailProps } from '../Activity.types';

function getAuditTone(state: string | undefined) {
  if (state === 'approved') {
    return 'positive';
  }

  if (state === 'blocked') {
    return 'warning';
  }

  if (state === 'failed') {
    return 'negative';
  }

  if (state === 'system') {
    return 'accent';
  }

  return 'neutral';
}

export function AuditTrail({
  className,
  density = 'comfortable',
  entries = [],
  selectable = true,
  selectedEntryId,
  showActors = true,
  variant = 'default',
  onEntrySelect,
  ...trailProps
}: AuditTrailProps) {
  return (
    <section
      {...trailProps}
      className={getActivityClassName('audit-trail', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <div className="audit-trail__list">
        {entries.map((entry) => {
          const isSelected = selectedEntryId === entry.id;

          return (
            <button
              aria-disabled={selectable ? undefined : true}
              aria-pressed={isSelected}
              className="audit-trail__entry"
              data-selected={isSelected ? 'true' : undefined}
              data-tone={getAuditTone(entry.state)}
              key={entry.id}
              tabIndex={selectable ? undefined : -1}
              type="button"
              onClick={selectable ? () => onEntrySelect?.(entry.id, entry) : undefined}
            >
              <span className="activity-dot" aria-hidden="true" />
              <span className="activity-copy">
                <strong className="activity-title">{entry.title}</strong>
                {entry.description ? <span className="activity-description">{entry.description}</span> : null}
                {showActors && entry.actor ? <span className="activity-meta">{entry.actor}</span> : null}
              </span>
              <span className="activity-time">{entry.timestamp}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export type { AuditTrailEntry, AuditTrailProps, AuditTrailState } from '../Activity.types';
