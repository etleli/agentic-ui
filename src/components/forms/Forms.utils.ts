import type { FormControlSize, WeekStart } from './Forms.types';

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;
const MONTH_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' });
const DATE_LABEL_FORMATTER = new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short', year: 'numeric' });

export type CalendarDay = {
  date: Date;
  inMonth: boolean;
  isSelected: boolean;
  isToday: boolean;
  value: string;
};

export function getFormClassName(baseClassName: string, className?: string) {
  return [baseClassName, className].filter(Boolean).join(' ');
}

export function normalizeFormSize(size: FormControlSize | undefined): FormControlSize {
  return size ?? 'comfortable';
}

export function parseDateValue(value: string | undefined): Date | null {
  const match = DATE_PATTERN.exec(value ?? '');

  if (!match) {
    return null;
  }

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10) - 1;
  const day = Number.parseInt(match[3], 10);
  const date = new Date(year, month, day);

  return date.getFullYear() === year && date.getMonth() === month && date.getDate() === day ? date : null;
}

export function formatDateValue(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function getTodayValue(): string {
  return formatDateValue(new Date());
}

export function getDateDisplayLabel(value: string | undefined, fallbackLabel: string): string {
  const date = parseDateValue(value);

  return date ? DATE_LABEL_FORMATTER.format(date) : fallbackLabel;
}

export function getMonthLabel(date: Date): string {
  return MONTH_LABEL_FORMATTER.format(date);
}

export function addDays(date: Date, dayCount: number): Date {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + dayCount);
  return nextDate;
}

export function addMonths(date: Date, monthCount: number): Date {
  const nextDate = new Date(date.getFullYear(), date.getMonth() + monthCount, 1);
  return nextDate;
}

export function getCalendarDays(monthDate: Date, selectedValue: string | undefined, weekStartsOn: WeekStart): CalendarDay[] {
  const selectedDateValue = parseDateValue(selectedValue) ? selectedValue : undefined;
  const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const weekOffset = weekStartsOn === 'monday' ? 1 : 0;
  const startOffset = (monthStart.getDay() - weekOffset + 7) % 7;
  const calendarStart = addDays(monthStart, -startOffset);
  const todayValue = getTodayValue();

  return Array.from({ length: 42 }, (_, index) => {
    const date = addDays(calendarStart, index);
    const value = formatDateValue(date);

    return {
      date,
      inMonth: date.getMonth() === monthDate.getMonth(),
      isSelected: value === selectedDateValue,
      isToday: value === todayValue,
      value,
    };
  });
}

export function isDateValueDisabled(value: string, min: string | undefined, max: string | undefined): boolean {
  return Boolean((min && value < min) || (max && value > max));
}

export function getWeekdayLabels(weekStartsOn: WeekStart): string[] {
  const labels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return weekStartsOn === 'monday' ? [...labels.slice(1), labels[0]] : labels;
}

export function parseTimeValue(value: string | undefined): string | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value ?? '');

  if (!match) {
    return null;
  }

  const hour = Number.parseInt(match[1], 10);
  const minute = Number.parseInt(match[2], 10);

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    return null;
  }

  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
}

export function getTimeDisplayLabel(value: string | undefined, format: '24h' | '12h', fallbackLabel: string): string {
  const normalizedValue = parseTimeValue(value);

  if (!normalizedValue) {
    return fallbackLabel;
  }

  const [hourPart, minutePart] = normalizedValue.split(':');
  const hour = Number.parseInt(hourPart, 10);

  if (format === '24h') {
    return normalizedValue;
  }

  const period = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minutePart} ${period}`;
}

export function getTimeOptions(stepMinutes: number): string[] {
  const normalizedStep = Math.min(Math.max(Math.trunc(stepMinutes), 1), 60);
  const totalMinutes = 24 * 60;
  const options: string[] = [];

  for (let minuteOfDay = 0; minuteOfDay < totalMinutes; minuteOfDay += normalizedStep) {
    const hour = Math.floor(minuteOfDay / 60);
    const minute = minuteOfDay % 60;
    options.push(`${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`);
  }

  return options;
}
