import { DateRangePicker } from './DateRangePicker';
import type { DateRangePickerProps } from '../Forms.types';

export type DateRangePickerExampleProps = DateRangePickerProps;

export function DateRangePickerExample({
  description = 'Select the analysis window.',
  disabled = false,
  endLabel = 'End date',
  required = false,
  showPresets = true,
  size = 'comfortable',
  startLabel = 'Start date',
  value = { end: '2026-07-02', start: '2026-06-26' },
  weekStartsOn = 'monday',
}: DateRangePickerExampleProps) {
  return (
    <DateRangePicker
      description={description}
      disabled={disabled}
      endLabel={endLabel}
      required={required}
      showPresets={showPresets}
      size={size}
      startLabel={startLabel}
      value={value}
      weekStartsOn={weekStartsOn}
    />
  );
}
