import { Play, X } from 'lucide-react';
import type { KeyboardEvent } from 'react';
import { Button } from '../../inputs/Button';
import { ProgressBar } from '../../feedback/ProgressBar';
import { StatusBadge } from '../../feedback/StatusBadge';
import '../Activity.css';
import { getActivityClassName, getProgressTone, getStatusBadgeStatus, getStatusLabel } from '../Activity.utils';
import type { ActivityAction, RunQueueProps } from '../Activity.types';

const DEFAULT_RUN_ACTIONS: ActivityAction[] = [
  { icon: <Play size={14} aria-hidden="true" />, id: 'resume', label: 'Resume' },
  { icon: <X size={14} aria-hidden="true" />, id: 'cancel', label: 'Cancel' },
];

function isItemSelectKey(event: KeyboardEvent<HTMLElement>) {
  return event.key === 'Enter' || event.key === ' ';
}

export function RunQueue({
  className,
  density = 'comfortable',
  items = [],
  selectable = true,
  selectedId,
  showProgress = true,
  variant = 'default',
  onActionSelect,
  onItemSelect,
  role,
  ...queueProps
}: RunQueueProps) {
  return (
    <div
      {...queueProps}
      className={getActivityClassName('run-queue', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
      role={role ?? (selectable ? 'listbox' : 'list')}
    >
      {items.map((item) => {
        const state = item.state ?? 'queued';
        const status = getStatusBadgeStatus(state);
        const statusLabel = getStatusLabel(state);
        const isSelected = item.id === selectedId;

        function selectItem() {
          if (!selectable) {
            return;
          }

          onItemSelect?.(item.id, item);
        }

        return (
          <article
            aria-current={!selectable && isSelected ? 'true' : undefined}
            aria-selected={selectable ? isSelected : undefined}
            className="run-queue__item"
            data-selected={isSelected ? 'true' : undefined}
            key={item.id}
            role={selectable ? 'option' : 'listitem'}
            tabIndex={selectable ? 0 : undefined}
            onClick={selectable ? selectItem : undefined}
            onKeyDown={(event) => {
              if (!selectable || !isItemSelectKey(event)) {
                return;
              }

              event.preventDefault();
              selectItem();
            }}
          >
            <div className="run-queue__header">
              <span className="activity-copy">
                <strong className="activity-title">{item.title}</strong>
                {item.description ? <span className="activity-description">{item.description}</span> : null}
                {item.meta ? <span className="activity-meta">{item.meta}</span> : null}
              </span>
              {status && statusLabel ? <StatusBadge label={statusLabel} size="compact" status={status} variant="soft" /> : null}
            </div>
            {showProgress ? (
              <ProgressBar
                label="Progress"
                showValue
                size={density === 'spacious' ? 'comfortable' : 'compact'}
                tone={getProgressTone(state)}
                value={item.progress ?? 0}
              />
            ) : null}
            <span className="run-queue__actions">
              {(item.actions ?? DEFAULT_RUN_ACTIONS).map((action) => (
                <Button
                  disabled={action.disabled}
                  icon={action.icon}
                  key={action.id}
                  showToggleIndicator={false}
                  size="compact"
                  variant={action.id === 'cancel' ? 'subtle' : 'secondary'}
                  onClick={(event) => {
                    event.stopPropagation();
                    onActionSelect?.(action.id, item.id, item);
                  }}
                >
                  {action.label}
                </Button>
              ))}
            </span>
          </article>
        );
      })}
    </div>
  );
}

export type { RunQueueItem, RunQueueProps, RunQueueState } from '../Activity.types';
