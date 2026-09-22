import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { Button } from '../../inputs/Button';
import { OverlayPortal } from '../../overlays/overlayPortal';
import '../Forms.css';
import {
  addMonths,
  getCalendarDays,
  getDateDisplayLabel,
  getFormClassName,
  getMonthLabel,
  getTodayValue,
  getWeekdayLabels,
  isDateValueDisabled,
  normalizeFormSize,
  parseDateValue,
} from '../Forms.utils';
import type { DatePickerProps } from '../Forms.types';

export function DatePicker({
  ariaLabel = 'Date picker',
  className,
  description,
  disabled = false,
  label,
  max,
  min,
  placeholder = 'Select date',
  readOnly = false,
  required = false,
  showTodayButton = true,
  size,
  value,
  weekStartsOn = 'monday',
  onValueChange,
  ...pickerProps
}: DatePickerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value ?? '');
  const selectedDate = parseDateValue(selectedValue);
  const [visibleMonth, setVisibleMonth] = useState(() => selectedDate ?? new Date());
  const todayValue = getTodayValue();
  const calendarDays = useMemo(() => getCalendarDays(visibleMonth, selectedValue, weekStartsOn), [selectedValue, visibleMonth, weekStartsOn]);
  const weekdayLabels = useMemo(() => getWeekdayLabels(weekStartsOn), [weekStartsOn]);

  const updatePopoverPosition = useCallback(() => {
    const triggerRect = rootRef.current?.getBoundingClientRect();
    const popoverRect = popoverRef.current?.getBoundingClientRect();

    if (!triggerRect) {
      return;
    }

    const gutter = 8;
    const popoverWidth = popoverRect?.width ?? Math.min(340, window.innerWidth - gutter * 2);
    const popoverHeight = popoverRect?.height ?? 0;
    const left = Math.min(Math.max(gutter, triggerRect.left), Math.max(gutter, window.innerWidth - popoverWidth - gutter));
    const below = triggerRect.bottom + gutter;
    const above = triggerRect.top - gutter - popoverHeight;
    const top = popoverHeight > 0 && below + popoverHeight > window.innerHeight && above >= gutter
      ? above
      : Math.max(gutter, Math.min(below, window.innerHeight - popoverHeight - gutter));

    setPopoverStyle({
      '--floating-panel-left': `${left}px`,
      '--floating-panel-top': `${top}px`,
    } as CSSProperties);
  }, []);

  useEffect(() => {
    setSelectedValue(value ?? '');
  }, [value]);

  useEffect(() => {
    const nextSelectedDate = parseDateValue(selectedValue);

    if (nextSelectedDate) {
      setVisibleMonth(nextSelectedDate);
    }
  }, [selectedValue]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (!rootRef.current?.contains(target) && !popoverRef.current?.contains(target)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    updatePopoverPosition();
    window.addEventListener('resize', updatePopoverPosition);
    window.addEventListener('scroll', updatePopoverPosition, true);

    return () => {
      window.removeEventListener('resize', updatePopoverPosition);
      window.removeEventListener('scroll', updatePopoverPosition, true);
    };
  }, [isOpen, updatePopoverPosition]);

  function selectDate(nextValue: string) {
    if (readOnly || disabled || isDateValueDisabled(nextValue, min, max)) {
      return;
    }

    setSelectedValue(nextValue);
    setIsOpen(false);
    onValueChange?.(nextValue);
  }

  function openPicker() {
    if (!disabled && !readOnly) {
      setIsOpen((currentValue) => !currentValue);
    }
  }

  return (
    <div
      {...pickerProps}
      className={getFormClassName('forms-picker date-picker', className)}
      data-open={isOpen ? 'true' : undefined}
      data-size={normalizeFormSize(size)}
      ref={rootRef}
    >
      {label ? (
        <span className="forms-label">
          {label}
          {required ? <span className="forms-required"> *</span> : null}
        </span>
      ) : null}
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={ariaLabel}
        className="forms-picker__trigger"
        disabled={disabled}
        type="button"
        onClick={openPicker}
      >
        <span className="forms-picker__value" data-placeholder={selectedValue ? undefined : 'true'}>
          {getDateDisplayLabel(selectedValue, placeholder)}
        </span>
        <span className="forms-picker__icon">
          <CalendarDays size={18} aria-hidden="true" />
        </span>
      </button>
      {description ? <span className="forms-description">{description}</span> : null}

      {isOpen ? (
        <OverlayPortal>
          <div className="forms-picker__popover date-picker__popover" ref={popoverRef} role="dialog" aria-label={ariaLabel} style={popoverStyle}>
          <header className="date-picker__header">
            <strong className="date-picker__month">{getMonthLabel(visibleMonth)}</strong>
            <span className="date-picker__nav">
              <button className="date-picker__nav-button" type="button" aria-label="Previous month" onClick={() => setVisibleMonth(addMonths(visibleMonth, -1))}>
                <ChevronLeft size={16} aria-hidden="true" />
              </button>
              <button className="date-picker__nav-button" type="button" aria-label="Next month" onClick={() => setVisibleMonth(addMonths(visibleMonth, 1))}>
                <ChevronRight size={16} aria-hidden="true" />
              </button>
            </span>
          </header>
          <div className="date-picker__weekdays" aria-hidden="true">
            {weekdayLabels.map((weekday) => (
              <span className="date-picker__weekday" key={weekday}>
                {weekday}
              </span>
            ))}
          </div>
          <div className="date-picker__grid">
            {calendarDays.map((day) => (
              <button
                aria-label={day.value}
                className="date-picker__day"
                data-muted={day.inMonth ? undefined : 'true'}
                data-selected={day.isSelected ? 'true' : undefined}
                data-today={day.isToday ? 'true' : undefined}
                disabled={isDateValueDisabled(day.value, min, max)}
                key={day.value}
                type="button"
                onClick={() => selectDate(day.value)}
              >
                {day.date.getDate()}
              </button>
            ))}
          </div>
          {showTodayButton ? (
            <footer className="date-picker__footer">
              <Button
                disabled={isDateValueDisabled(todayValue, min, max)}
                size="compact"
                variant="secondary"
                onClick={() => selectDate(todayValue)}
              >
                Today
              </Button>
            </footer>
          ) : null}
          </div>
        </OverlayPortal>
      ) : null}
    </div>
  );
}

export type { DatePickerProps };
