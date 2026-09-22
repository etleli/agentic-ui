import '../Activity.css';
import { getActivityClassName, getActivityToneClass } from '../Activity.utils';
import type { TimelineProps } from '../Activity.types';

export function Timeline({
  className,
  density = 'comfortable',
  items = [],
  orientation = 'vertical',
  selectable = true,
  selectedId,
  showTimestamps = true,
  variant = 'default',
  onItemSelect,
  ...timelineProps
}: TimelineProps) {
  return (
    <div
      {...timelineProps}
      className={getActivityClassName('timeline', className)}
      data-density={density}
      data-orientation={orientation}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <div className="timeline__list">
        {items.map((item) => {
          const isSelected = item.id === selectedId;

          return (
            <button
              aria-disabled={selectable ? undefined : true}
              aria-pressed={isSelected}
              className="timeline__item"
              data-selected={isSelected ? 'true' : undefined}
              data-tone={getActivityToneClass(item.tone)}
              key={item.id}
              tabIndex={selectable ? undefined : -1}
              type="button"
              onClick={selectable ? () => onItemSelect?.(item.id, item) : undefined}
            >
              <span className="activity-dot" aria-hidden="true" />
              <span className="activity-copy">
                {showTimestamps && item.timestamp ? <span className="activity-time">{item.timestamp}</span> : null}
                {item.label ? <span className="activity-label">{item.label}</span> : null}
                <strong className="activity-title">{item.title}</strong>
                {item.description ? <span className="activity-description">{item.description}</span> : null}
                {item.meta ? <span className="activity-meta">{item.meta}</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { TimelineItem, TimelineProps } from '../Activity.types';
