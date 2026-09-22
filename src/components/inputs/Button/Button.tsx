import './Button.css';
import { useId, useState, type KeyboardEvent } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import type { ButtonInteraction, ButtonProps, ButtonSize, ButtonVariant, ButtonWidth } from './Button.types';

function getButtonClassName(className: ButtonProps['className']) {
  return ['button', className].filter(Boolean).join(' ');
}

export function Button({
  buttonType = 'momentary',
  children,
  className,
  disabled = false,
  htmlType = 'button',
  icon,
  iconOnly = false,
  onClick,
  onPressedChange,
  pressed = false,
  showToggleIndicator = true,
  size = 'comfortable',
  tooltip,
  tooltipPlacement = 'top',
  unavailableReason,
  variant = 'primary',
  width = 'auto',
  onUnavailable,
  ...restProps
}: ButtonProps) {
  const [pressFeedbackKey, setPressFeedbackKey] = useState(0);
  const unavailableDescriptionId = useId();
  const isUnavailable = unavailableReason !== undefined;
  const isNativeDisabled = disabled && !isUnavailable;
  const ariaDescribedBy = [restProps['aria-describedby'], isUnavailable ? unavailableDescriptionId : undefined].filter(Boolean).join(' ') || undefined;
  const tooltipContent = tooltip ?? (isUnavailable ? unavailableReason : undefined);

  const button = (
    <button
      {...restProps}
      aria-pressed={buttonType === 'toggle' ? pressed : undefined}
      aria-disabled={isUnavailable ? true : undefined}
      aria-describedby={ariaDescribedBy}
      className={getButtonClassName(className)}
      data-button-type={buttonType}
      data-icon-only={iconOnly ? 'true' : undefined}
      data-unavailable={isUnavailable ? 'true' : undefined}
      data-size={size}
      data-variant={variant}
      data-width={width}
      disabled={isNativeDisabled}
      type={htmlType}
      onClick={(event) => {
        if (isUnavailable) {
          event.preventDefault();
          event.stopPropagation();
          onUnavailable?.('pointer');
          return;
        }

        if (buttonType === 'momentary') {
          setPressFeedbackKey((currentKey) => currentKey + 1);
        }

        if (buttonType === 'toggle') {
          onPressedChange?.(!pressed);
        }

        onClick?.(event);
      }}
      onKeyDown={(event: KeyboardEvent<HTMLButtonElement>) => {
        if (isUnavailable && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault();
          event.stopPropagation();
          onUnavailable?.('keyboard');
          return;
        }

        restProps.onKeyDown?.(event);
      }}
    >
      {pressFeedbackKey > 0 ? <span className="button__press-feedback" key={pressFeedbackKey} aria-hidden="true" /> : null}
      {buttonType === 'toggle' && showToggleIndicator ? <span className="button__toggle-indicator" aria-hidden="true" /> : null}
      {icon ? <span className="button__icon">{icon}</span> : null}
      {!iconOnly && children ? <span className="button__label">{children}</span> : null}
      {isUnavailable ? <span className="button__unavailable-description" id={unavailableDescriptionId}>Unavailable: {unavailableReason}</span> : null}
    </button>
  );

  if (!tooltipContent) {
    return button;
  }

  return (
      <Tooltip content={tooltipContent} placement={tooltipPlacement} size="compact">
      {button}
    </Tooltip>
  );
}

export type { ButtonInteraction, ButtonProps, ButtonSize, ButtonVariant, ButtonWidth };
