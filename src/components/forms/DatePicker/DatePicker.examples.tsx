import { DatePicker } from './DatePicker';
import type { DatePickerProps } from '../Forms.types';

export type DatePickerExampleProps = DatePickerProps;

export function DatePickerExample({
  description = 'Select a trading session date.',
  disabled = false,
  label = 'Session date',
  placeholder = 'Select date',
  readOnly = false,
  required = false,
  showTodayButton = true,
  size = 'comfortable',
  value = '2026-07-02',
  weekStartsOn = 'monday',
}: DatePickerExampleProps) {
  return (
    <DatePicker
      description={description}
      disabled={disabled}
      label={label}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      showTodayButton={showTodayButton}
      size={size}
      value={value}
      weekStartsOn={weekStartsOn}
    />
  );
}
