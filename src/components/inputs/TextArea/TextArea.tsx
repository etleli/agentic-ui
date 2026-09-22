import '../InputControl.css';
import './TextArea.css';
import { useEffect, useRef, type CSSProperties } from 'react';
import type { TextAreaProps, TextAreaResize } from './TextArea.types';

function resizeTextArea(textArea: HTMLTextAreaElement, minRows: number, maxRows: number | undefined) {
  textArea.style.height = 'auto';

  const computedStyles = window.getComputedStyle(textArea);
  const lineHeight = Number.parseFloat(computedStyles.lineHeight) || 20;
  const paddingTop = Number.parseFloat(computedStyles.paddingTop) || 0;
  const paddingBottom = Number.parseFloat(computedStyles.paddingBottom) || 0;
  const minHeight = lineHeight * minRows + paddingTop + paddingBottom;
  const maxHeight = maxRows ? lineHeight * maxRows + paddingTop + paddingBottom : Number.POSITIVE_INFINITY;
  const nextHeight = Math.min(maxHeight, Math.max(minHeight, textArea.scrollHeight));

  textArea.style.height = `${nextHeight}px`;
  textArea.style.overflowY = textArea.scrollHeight > maxHeight ? 'auto' : 'hidden';
}

export function TextArea({
  ariaLabel,
  autoResize = false,
  description,
  disabled,
  label,
  maxLength,
  maxRows,
  minRows = 4,
  onValueChange,
  readOnly,
  resize = 'vertical',
  rows,
  showCounter = false,
  style,
  value = '',
  ...textAreaProps
}: TextAreaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);
  const currentLength = value.length;
  const textAreaStyle = {
    ...style,
    '--text-area-min-rows': minRows,
  } as CSSProperties;

  useEffect(() => {
    const textArea = textAreaRef.current;

    if (!textArea) {
      return;
    }

    if (!autoResize) {
      textArea.style.height = '';
      textArea.style.overflowY = '';
      return;
    }

    resizeTextArea(textArea, minRows, maxRows);
  }, [autoResize, maxRows, minRows, value]);

  return (
    <label className="input-field text-area">
      {label ? <span className="input-field__label">{label}</span> : null}
      <span className="input-field__control" data-disabled={disabled ? 'true' : undefined} data-read-only={readOnly ? 'true' : undefined}>
        <textarea
          {...textAreaProps}
          aria-label={ariaLabel}
          className="text-area__native"
          data-auto-resize={autoResize ? 'true' : undefined}
          data-resize={resize}
          disabled={disabled}
          maxLength={maxLength}
          readOnly={readOnly}
          ref={textAreaRef}
          rows={rows ?? minRows}
          style={textAreaStyle}
          value={value}
          onChange={(event) => onValueChange?.(event.target.value)}
        />
      </span>
      {description || showCounter ? (
        <span className="text-area__footer">
          {description ? <span className="input-field__description">{description}</span> : <span />}
          {showCounter ? (
            <span className="text-area__counter">
              {currentLength}
              {typeof maxLength === 'number' ? ` / ${maxLength}` : null}
            </span>
          ) : null}
        </span>
      ) : null}
    </label>
  );
}

export type { TextAreaProps, TextAreaResize };
