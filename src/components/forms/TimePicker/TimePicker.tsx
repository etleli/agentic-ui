import { Clock } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import { OverlayPortal } from '../../overlays/overlayPortal';
import '../Forms.css';
import { getFormClassName, getTimeDisplayLabel, getTimeOptions, normalizeFormSize, parseTimeValue } from '../Forms.utils';
import type { TimePickerProps } from '../Forms.types';

export function TimePicker({
  ariaLabel = 'Time picker',
  className,
  description,
  disabled = false,
  format = '24h',
  label,
  placeholder = 'Select time',
  readOnly = false,
  required = false,
  size,
  stepMinutes = 15,
  value,
  onValueChange,
  ...pickerProps
}: TimePickerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);
  const [popoverStyle, setPopoverStyle] = useState<CSSProperties>({});
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(parseTimeValue(value) ?? '');
  const timeOptions = useMemo(() => getTimeOptions(stepMinutes), [stepMinutes]);

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
    setSelectedValue(parseTimeValue(value) ?? '');
  }, [value]);

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

  function selectTime(nextValue: string) {
    if (disabled || readOnly) {
      return;
    }

    setSelectedValue(nextValue);
    setIsOpen(false);
    onValueChange?.(nextValue);
  }

  return (
    <div
      {...pickerProps}
      className={getFormClassName('forms-picker time-picker', className)}
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
        aria-haspopup="listbox"
        aria-label={ariaLabel}
        className="forms-picker__trigger"
        disabled={disabled}
        type="button"
        onClick={() => !readOnly && setIsOpen((currentValue) => !currentValue)}
      >
        <span className="forms-picker__value" data-placeholder={selectedValue ? undefined : 'true'}>
          {getTimeDisplayLabel(selectedValue, format, placeholder)}
        </span>
        <span className="forms-picker__icon">
          <Clock size={18} aria-hidden="true" />
        </span>
      </button>
      {description ? <span className="forms-description">{description}</span> : null}

      {isOpen ? (
        <OverlayPortal>
          <div className="forms-picker__popover time-picker__popover" ref={popoverRef} role="listbox" aria-label={ariaLabel} style={popoverStyle}>
          <header className="time-picker__header">
            <strong>Time</strong>
            <span className="forms-meta">{stepMinutes} min steps</span>
          </header>
          <div className="time-picker__options">
            {timeOptions.map((timeOption) => (
              <button
                aria-selected={timeOption === selectedValue}
                className="time-picker__option"
                data-selected={timeOption === selectedValue ? 'true' : undefined}
                key={timeOption}
                role="option"
                type="button"
                onClick={() => selectTime(timeOption)}
              >
                {getTimeDisplayLabel(timeOption, format, timeOption)}
              </button>
            ))}
          </div>
          </div>
        </OverlayPortal>
      ) : null}
    </div>
  );
}

export type { TimePickerProps };
