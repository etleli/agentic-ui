import { ChevronDown } from 'lucide-react';
import { useId, useMemo, useState, type CSSProperties } from 'react';
import { civilDate, civilMinute, minutesPerDay } from '../dateMath';
import type { ScheduleTimelineItem, ScheduleTimelineProps } from './ScheduleTimeline.types';
import './ScheduleTimeline.css';

function itemSpan(item: ScheduleTimelineItem) {
  const start = item.start ? civilMinute(item.start) : undefined;
  if (start === undefined) return undefined;
  const end = item.end ? civilMinute(item.end) : undefined;
  if (end !== undefined && end > start) return { start, end };
  const point = item.start?.length === 10 ? start + minutesPerDay / 2 : start;
  return { start: point, end: point };
}

export function ScheduleTimeline({ groups, range, now, locale, collapsedGroupIds, defaultCollapsedGroupIds = [], onCollapsedGroupIdsChange,
  onItemSelect, renderItem, labels, className, style, ...attributes }: ScheduleTimelineProps) {
  const id = useId();
  const [collapsed, setCollapsed] = useState(defaultCollapsedGroupIds);
  const activeCollapsed = collapsedGroupIds ?? collapsed;
  const dateFormat = useMemo(() => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', month: 'short', day: 'numeric' }), [locale]);
  const dateTimeFormat = useMemo(() => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }), [locale]);
  const spans = groups.flatMap((group) => group.items.flatMap((item) => itemSpan(item) ?? []));
  let earliest = Infinity, latest = -Infinity;
  for (const span of spans) {
    earliest = Math.min(earliest, span.start);
    latest = Math.max(latest, span.end);
  }
  const explicitStart = range && civilMinute(range.start), explicitEnd = range && civilMinute(range.end);
  const explicitRange = explicitStart !== undefined && explicitEnd !== undefined && explicitEnd > explicitStart;
  const start = explicitRange ? explicitStart! : Number.isFinite(earliest) ? Math.floor(earliest / minutesPerDay) * minutesPerDay : 0;
  const end = explicitRange ? explicitEnd! : Number.isFinite(latest) ? (Math.floor(latest / minutesPerDay) + 1) * minutesPerDay : start + minutesPerDay;
  const duration = end - start;
  const tick = duration <= 2 * minutesPerDay ? 360 : Math.max(1, Math.ceil(duration / minutesPerDay / 28)) * minutesPerDay;
  const ticks = Array.from({ length: Math.ceil(duration / tick) }, (_, index) => start + index * tick);
  const position = (minute: number) => (minute - start) / duration * 100;
  const current = now ? civilMinute(now) : undefined;

  function toggleGroup(groupId: string) {
    const next = activeCollapsed.includes(groupId) ? activeCollapsed.filter((value) => value !== groupId) : [...activeCollapsed, groupId];
    if (!collapsedGroupIds) setCollapsed(next);
    onCollapsedGroupIdsChange?.(next);
  }

  function mark(item: ScheduleTimelineItem) {
    const span = itemSpan(item);
    if (!span || span.start >= end || span.end < start || (span.end === start && span.start < start)) return null;
    const left = position(Math.max(start, span.start));
    const right = position(Math.min(end, span.end));
    const milestone = span.start === span.end;
    return <span key={item.id} aria-hidden="true" title={item.title} className="schedule-timeline__mark" data-point={milestone || undefined}
      style={{ insetInlineStart: `${left}%`, width: milestone ? undefined : `${right - left}%`, '--schedule-item-color': item.color } as CSSProperties} />;
  }

  function nowLine() {
    return current !== undefined && current >= start && current < end
      ? <span className="schedule-timeline__now" aria-hidden="true" style={{ insetInlineStart: `${position(current)}%` }} /> : null;
  }

  function itemLabel(item: ScheduleTimelineItem) {
    function formatted(value?: string) {
      const time = value ? civilMinute(value) : undefined;
      return time === undefined ? undefined : (value!.length === 10 ? dateFormat : dateTimeFormat).format(civilDate(time));
    }
    const time = [formatted(item.start), formatted(item.end)].filter(Boolean).join(' – ') || (labels?.unscheduled ?? 'Unscheduled');
    return renderItem ? renderItem(item) : <>
      <strong>{item.title}</strong><small>{time}</small>
      {item.description ? <small>{item.description}</small> : null}
      {item.status ? <small>{item.status}</small> : null}
    </>;
  }

  return <div aria-label="Schedule timeline" {...attributes} tabIndex={attributes.tabIndex ?? 0}
    className={['schedule-timeline', className].filter(Boolean).join(' ')}
    style={{ ...style, '--schedule-axis-width': `${Math.max(28, ticks.length * 5)}rem`, '--schedule-tick-width': `${tick / duration * 100}%` } as CSSProperties}>
    <div className="schedule-timeline__canvas">
      <div className="schedule-timeline__row schedule-timeline__axis">
        <div className="schedule-timeline__label">{labels?.item ?? 'Item'}</div>
        <div className="schedule-timeline__track">{ticks.map((minute) => <span key={minute} style={{ insetInlineStart: `${position(minute)}%` }}>
          {(tick < minutesPerDay ? dateTimeFormat : dateFormat).format(civilDate(minute))}
        </span>)}</div>
      </div>
      {groups.map((group, index) => {
        const expanded = !activeCollapsed.includes(group.id);
        const groupId = `${id}-${index}`;
        return <section key={group.id} aria-label={group.label}>
          <button type="button" className="schedule-timeline__row schedule-timeline__group" aria-expanded={expanded} aria-controls={groupId} onClick={() => toggleGroup(group.id)}>
            <span className="schedule-timeline__label"><ChevronDown aria-hidden="true" size={16} />{group.label} <small>{group.items.length}</small></span>
            <span className="schedule-timeline__track">{nowLine()}{expanded ? null : group.items.map(mark)}</span>
          </button>
          <div id={groupId} className="schedule-timeline__disclosure" data-expanded={expanded} aria-hidden={!expanded} inert={!expanded}>
            <div>
            {group.items.map((item) => onItemSelect
              ? <button type="button" className="schedule-timeline__row schedule-timeline__item" key={item.id} onClick={() => onItemSelect(item)}>
                <span className="schedule-timeline__label">{itemLabel(item)}</span><span className="schedule-timeline__track">{nowLine()}{mark(item)}</span>
              </button>
              : <div className="schedule-timeline__row schedule-timeline__item" key={item.id}>
                <div className="schedule-timeline__label">{itemLabel(item)}</div><div className="schedule-timeline__track">{nowLine()}{mark(item)}</div>
              </div>)}
            </div>
          </div>
        </section>;
      })}
    </div>
  </div>;
}
