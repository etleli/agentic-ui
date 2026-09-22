import { TimePicker } from './TimePicker';
import type { TimePickerProps } from '../Forms.types';

export type TimePickerExampleProps = TimePickerProps;

export function TimePickerExample({
  description = 'Choose when the run should start.',
  disabled = false,
  format = '24h',
  label = 'Start time',
  placeholder = 'Select time',
  readOnly = false,
  required = false,
  size = 'comfortable',
  stepMinutes = 15,
  value = '14:30',
}: TimePickerExampleProps) {
  return (
    <TimePicker
      description={description}
      disabled={disabled}
      format={format}
      label={label}
      placeholder={placeholder}
      readOnly={readOnly}
      required={required}
      size={size}
      stepMinutes={stepMinutes}
      value={value}
    />
  );
}
