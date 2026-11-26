import type { HTMLAttributes, ReactNode } from 'react';

type CalendarTimeGridEventBase = {
  id: string;
  title: string;
  color?: string;
};

export type CalendarTimeGridEvent = CalendarTimeGridEventBase & (
  | { kind: 'timed'; start: string; end: string }
  | { kind: 'all-day'; date: string; endDate?: string }
  | { kind: 'reminder'; date: string }
);

export type CalendarTimeGridEventContext = { date: string; timeLabel?: string };
export type CalendarTimeGridProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  /** Selected YYYY-MM-DD date. Timed events use local YYYY-MM-DDTHH:mm strings. */
  date: string;
  events: CalendarTimeGridEvent[];
  view?: 'day' | 'week';
  locale?: string;
  weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
  initialHour?: number;
  hourHeight?: number;
  onDateChange?: (date: string) => void;
  onEventSelect?: (event: CalendarTimeGridEvent) => void;
  /** Custom non-interactive content inside the event's existing button or card. */
  renderEvent?: (event: CalendarTimeGridEvent, context: CalendarTimeGridEventContext) => ReactNode;
  labels?: Partial<{ allDay: string; reminders: string; time: string; invalidDate: string }>;
};
