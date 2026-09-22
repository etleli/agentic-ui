import { useEffect, useState } from 'react';
import { DatePicker } from '../DatePicker';
import { TimePicker } from '../TimePicker';
import '../Forms.css';
import { getFormClassName, normalizeFormSize } from '../Forms.utils';
import type { DateTimePickerProps } from '../Forms.types';

function splitDateTime(value: string | undefined) {
  const [date = '', time = ''] = String(value ?? '').split('T');
  return {
    date,
    time: time.slice(0, 5),
  };
}

function joinDateTime(date: string, time: string) {
  if (!date && !time) {
    return '';
  }

  return `${date || '0000-00-00'}T${time || '00:00'}`;
}

export function DateTimePicker({
  className,
  dateLabel = 'Date',
  description,
  disabled = false,
  format = '24h',
  label,
  required = false,
  size,
  stepMinutes = 15,
  value,
  weekStartsOn = 'monday',
  onValueChange,
  ...pickerProps
}: DateTimePickerProps) {
  const [parts, setParts] = useState(() => splitDateTime(value));

  useEffect(() => {
    setParts(splitDateTime(value));
  }, [value]);

  function updateParts(nextParts: { date: string; time: string }) {
    setParts(nextParts);
    onValueChange?.(joinDateTime(nextParts.date, nextParts.time));
  }

  return (
    <div {...pickerProps} className={getFormClassName('date-time-picker', className)} data-size={normalizeFormSize(size)}>
      {label ? (
        <span className="forms-label">
          {label}
          {required ? <span className="forms-required"> *</span> : null}
        </span>
      ) : null}
      {description ? <span className="forms-description">{description}</span> : null}
      <div className="date-time-picker__row">
        <DatePicker
          disabled={disabled}
          label={dateLabel}
          required={required}
          showTodayButton
          size={size}
          value={parts.date}
          weekStartsOn={weekStartsOn}
          onValueChange={(date) => updateParts({ ...parts, date })}
        />
        <TimePicker
          disabled={disabled}
          format={format}
          label="Time"
          required={required}
          size={size}
          stepMinutes={stepMinutes}
          value={parts.time}
          onValueChange={(time) => updateParts({ ...parts, time })}
        />
      </div>
    </div>
  );
}

export type { DateTimePickerProps };
