import { useEffect, useState } from 'react';
import '../Forms.css';
import { addDays, formatDateValue, getDateDisplayLabel, getFormClassName, getTodayValue, normalizeFormSize, parseDateValue } from '../Forms.utils';
import { DatePicker } from '../DatePicker';
import type { DateRangePickerProps, DateRangeValue } from '../Forms.types';

function getNormalizedRange(value: DateRangeValue | undefined): DateRangeValue {
  return {
    end: value?.end ?? '',
    start: value?.start ?? '',
  };
}

function getPresetRange(dayCount: number): DateRangeValue {
  const today = parseDateValue(getTodayValue()) ?? new Date();
  const start = addDays(today, -(dayCount - 1));

  return {
    end: formatDateValue(today),
    start: formatDateValue(start),
  };
}

export function DateRangePicker({
  className,
  description,
  disabled = false,
  endLabel = 'End date',
  max,
  min,
  required = false,
  showPresets = true,
  size,
  startLabel = 'Start date',
  value,
  weekStartsOn = 'monday',
  onValueChange,
  ...rangeProps
}: DateRangePickerProps) {
  const [rangeValue, setRangeValue] = useState<DateRangeValue>(() => getNormalizedRange(value));

  useEffect(() => {
    setRangeValue(getNormalizedRange(value));
  }, [value]);

  function updateRange(nextRange: DateRangeValue) {
    setRangeValue(nextRange);
    onValueChange?.(nextRange);
  }

  function updateStart(start: string) {
    updateRange({ ...rangeValue, start });
  }

  function updateEnd(end: string) {
    updateRange({ ...rangeValue, end });
  }

  function applyPreset(dayCount: number) {
    updateRange(getPresetRange(dayCount));
  }

  return (
    <div {...rangeProps} className={getFormClassName('date-range-picker', className)} data-size={normalizeFormSize(size)}>
      {description ? <span className="forms-description">{description}</span> : null}
      <div className="date-range-picker__fields">
        <DatePicker
          disabled={disabled}
          label={startLabel}
          max={rangeValue.end || max}
          min={min}
          required={required}
          showTodayButton={false}
          size={size}
          value={rangeValue.start}
          weekStartsOn={weekStartsOn}
          onValueChange={updateStart}
        />
        <DatePicker
          disabled={disabled}
          label={endLabel}
          max={max}
          min={rangeValue.start || min}
          required={required}
          showTodayButton={false}
          size={size}
          value={rangeValue.end}
          weekStartsOn={weekStartsOn}
          onValueChange={updateEnd}
        />
      </div>
      {showPresets ? (
        <div className="date-range-picker__presets" aria-label="Date range presets">
          <button className="date-range-picker__preset" disabled={disabled} type="button" onClick={() => applyPreset(1)}>
            Today
          </button>
          <button className="date-range-picker__preset" disabled={disabled} type="button" onClick={() => applyPreset(7)}>
            7D
          </button>
          <button className="date-range-picker__preset" disabled={disabled} type="button" onClick={() => applyPreset(30)}>
            30D
          </button>
        </div>
      ) : null}
      <span className="date-range-picker__summary">
        {getDateDisplayLabel(rangeValue.start, 'No start')} - {getDateDisplayLabel(rangeValue.end, 'No end')}
      </span>
    </div>
  );
}

export type { DateRangePickerProps, DateRangeValue };
