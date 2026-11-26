import { useLayoutEffect, useMemo, useRef, type CSSProperties } from 'react';
import { civilDate, civilDay, civilMinute, clockText, minutesPerDay } from '../dateMath';
import { layoutTimedSlots } from './calendarLayout';
import type { CalendarTimeGridEvent, CalendarTimeGridProps } from './CalendarTimeGrid.types';
import './CalendarTimeGrid.css';

const hours = Array.from({ length: 24 }, (_, index) => index * 60);

export function CalendarTimeGrid({ date, events, view = 'week', locale, weekStartsOn = 1, initialHour = 8, hourHeight = 56,
  onDateChange, onEventSelect, renderEvent, labels, className, style, ...attributes }: CalendarTimeGridProps) {
  const scroller = useRef<HTMLDivElement>(null);
  const selectedHeading = useRef<HTMLDivElement>(null);
  const selected = civilMinute(date.slice(0, 10));
  const dayCount = view === 'week' ? 7 : 1;
  const weekOffset = selected === undefined ? 0 : (civilDate(selected).getUTCDay() - weekStartsOn + 7) % 7;
  const firstDay = selected === undefined ? undefined : selected - (view === 'week' ? weekOffset * minutesPerDay : 0);
  const hasDate = firstDay !== undefined;
  const displayHourHeight = Number.isFinite(hourHeight) ? Math.max(24, hourHeight) : 56;
  const formatter = useMemo(() => new Intl.DateTimeFormat(locale, { timeZone: 'UTC', weekday: 'short', month: 'short', day: 'numeric' }), [locale]);
  const days = useMemo(() => firstDay === undefined ? [] : Array.from({ length: dayCount }, (_, index) => {
    const minute = firstDay + index * minutesPerDay;
    const key = civilDay(minute);
    return {
      key, minute,
      allDay: events.filter((event) => event.kind === 'all-day' && event.date <= key && key <= (event.endDate ?? event.date)),
      reminders: events.filter((event) => event.kind === 'reminder' && event.date === key),
      slots: layoutTimedSlots(events, minute),
    };
  }), [dayCount, events, firstDay]);

  useLayoutEffect(() => {
    const viewport = scroller.current;
    if (viewport?.scrollTop === 0) viewport.scrollTop = displayHourHeight * Math.min(23, Math.max(0, initialHour));
  }, [displayHourHeight, hasDate, initialHour]);

  useLayoutEffect(() => {
    const viewport = scroller.current, heading = selectedHeading.current;
    if (!viewport || !heading) return;
    const outer = viewport.getBoundingClientRect(), inner = heading.getBoundingClientRect();
    const rail = viewport.querySelector('.calendar-time-grid__time-cell')?.getBoundingClientRect().width ?? 0;
    if (inner.left < outer.left + rail) viewport.scrollLeft -= outer.left + rail - inner.left;
    else if (inner.right > outer.right) viewport.scrollLeft += inner.right - outer.right;
  }, [date, view]);

  function eventCard(event: CalendarTimeGridEvent, day: string, timeLabel?: string) {
    const contents = renderEvent ? renderEvent(event, { date: day, timeLabel }) : <>
      {timeLabel ? <small>{timeLabel}</small> : null}<span>{event.title}</span>
    </>;
    const card = { className: 'calendar-time-grid__event', style: event.color ? { '--calendar-event-color': event.color } as CSSProperties : undefined };
    return onEventSelect
      ? <button {...card} type="button" aria-label={timeLabel ? `${event.title}, ${timeLabel}` : event.title} onClick={() => onEventSelect(event)}>{contents}</button>
      : <div {...card}>{contents}</div>;
  }

  const hasAllDay = days.some((day) => day.allDay.length);
  const hasReminders = days.some((day) => day.reminders.length);
  const columns = `3.5rem repeat(${days.length}, minmax(${view === 'day' ? '0' : '8rem'}, 1fr))`;
  return <div aria-label="Calendar" {...attributes} ref={scroller} className={['calendar-time-grid', className].filter(Boolean).join(' ')}
    style={{ ...style, '--calendar-columns': columns, '--calendar-hour-height': `${displayHourHeight}px` } as CSSProperties}>
    {selected === undefined ? <p>{labels?.invalidDate ?? 'Choose a valid date.'}</p> : <>
      <div className="calendar-time-grid__header">
        <div className="calendar-time-grid__time-cell">{labels?.time ?? 'Time'}</div>
        {days.map(({ key, minute }) => <div key={key} ref={minute === selected ? selectedHeading : undefined} className="calendar-time-grid__day-label">
          {onDateChange ? <button type="button" aria-pressed={minute === selected} onClick={() => onDateChange(key)}>{formatter.format(civilDate(minute))}</button> : formatter.format(civilDate(minute))}
        </div>)}
        {hasAllDay ? <><div className="calendar-time-grid__time-cell">{labels?.allDay ?? 'All day'}</div>
          {days.map((day) => <div className="calendar-time-grid__chips" key={day.key}>{day.allDay.map((event) => <div key={event.id}>{eventCard(event, day.key)}</div>)}</div>)}
        </> : null}
        {hasReminders ? <><div className="calendar-time-grid__time-cell">{labels?.reminders ?? 'Reminders'}</div>
          {days.map((day) => <div className="calendar-time-grid__chips" key={day.key}>{day.reminders.map((event) => <div key={event.id}>{eventCard(event, day.key)}</div>)}</div>)}
        </> : null}
      </div>
      <div className="calendar-time-grid__body">
        <div className="calendar-time-grid__time-cell" aria-hidden="true">{hours.map((hour) => <div className="calendar-time-grid__hour" key={hour}>{clockText(hour)}</div>)}</div>
        {days.map((day) => <section className="calendar-time-grid__day" aria-label={formatter.format(civilDate(day.minute))} key={day.key}>
          {day.slots.map(({ event, start, end, lane, laneCount }) => <div className="calendar-time-grid__slot" key={event.id}
            style={{ top: `${start / minutesPerDay * 100}%`, height: `${(end - start) / minutesPerDay * 100}%`, insetInlineStart: `${lane / laneCount * 100}%`, width: `${100 / laneCount}%` }}>
            {eventCard(event, day.key, `${clockText(start)}–${clockText(end)}`)}
          </div>)}
        </section>)}
      </div>
    </>}
  </div>;
}
