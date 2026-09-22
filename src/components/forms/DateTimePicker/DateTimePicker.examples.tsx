import { DateTimePicker } from './DateTimePicker';
import type { FormControlSize, TimePickerFormat, WeekStart } from '../Forms.types';

export type DateTimePickerExampleProps = {
  disabled?: boolean;
  format?: TimePickerFormat;
  label?: string;
  size?: FormControlSize;
  stepMinutes?: number;
  value?: string;
  weekStartsOn?: WeekStart;
};

export function DateTimePickerExample({
  disabled = false,
  format = '24h',
  label = 'Run schedule',
  size = 'comfortable',
  stepMinutes = 15,
  value = '2026-07-02T14:30',
  weekStartsOn = 'monday',
}: DateTimePickerExampleProps) {
  return (
    <DateTimePicker
      description="Composed date and time picker for scheduled workflows."
      disabled={disabled}
      format={format}
      label={label}
      size={size}
      stepMinutes={stepMinutes}
      value={value}
      weekStartsOn={weekStartsOn}
    />
  );
}
