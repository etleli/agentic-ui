import { StatusBadge } from '../../feedback/StatusBadge';
import '../Activity.css';
import { getActivityClassName, getActivityToneClass, getStatusBadgeStatus, getStatusLabel } from '../Activity.utils';
import type { ActivityFeedProps } from '../Activity.types';

export function ActivityFeed({
  className,
  density = 'comfortable',
  items = [],
  selectable = true,
  selectedId,
  showSource = true,
  variant = 'default',
  onItemSelect,
  ...feedProps
}: ActivityFeedProps) {
  return (
    <div
      {...feedProps}
      className={getActivityClassName('activity-feed', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      {items.map((item) => {
        const isSelected = item.id === selectedId;
        const status = getStatusBadgeStatus(item.status);
        const statusLabel = getStatusLabel(item.status);

        return (
          <button
            aria-disabled={selectable ? undefined : true}
            aria-pressed={isSelected}
            className="activity-feed__item"
            data-selected={isSelected ? 'true' : undefined}
            data-tone={getActivityToneClass(item.tone, item.status)}
            key={item.id}
            tabIndex={selectable ? undefined : -1}
            type="button"
            onClick={selectable ? () => onItemSelect?.(item.id, item) : undefined}
          >
            <span className="activity-dot" aria-hidden="true" />
            <span className="activity-copy">
              {showSource && item.source ? <span className="activity-label">{item.source}</span> : null}
              <strong className="activity-title">{item.title}</strong>
              {item.description ? <span className="activity-description">{item.description}</span> : null}
              {item.meta ? <span className="activity-meta">{item.meta}</span> : null}
            </span>
            <span className="activity-feed__tail">
              {item.timestamp ? <span className="activity-time">{item.timestamp}</span> : null}
              {status && statusLabel ? <StatusBadge label={statusLabel} size="compact" status={status} variant="soft" /> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export type { ActivityFeedItem, ActivityFeedProps } from '../Activity.types';
