import type { ButtonHTMLAttributes, ReactNode } from 'react';
import type { TooltipPlacement } from '../../overlays/Tooltip';
import type { UnavailableActionSource } from '../UnavailableAction';

export type ButtonVariant = 'primary' | 'secondary' | 'subtle' | 'danger';

export type ButtonSize = 'compact' | 'comfortable' | 'spacious';

export type ButtonWidth = 'auto' | 'fill';

export type ButtonInteraction = 'momentary' | 'toggle';

export type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type'> & {
  buttonType?: ButtonInteraction;
  children?: ReactNode;
  htmlType?: 'button' | 'reset' | 'submit';
  icon?: ReactNode;
  iconOnly?: boolean;
  pressed?: boolean;
  showToggleIndicator?: boolean;
  size?: ButtonSize;
  tooltip?: ReactNode;
  tooltipPlacement?: TooltipPlacement;
  /** Keeps the action focusable and explains why activation is currently unavailable. */
  unavailableReason?: ReactNode;
  variant?: ButtonVariant;
  /** Keeps intrinsic sizing by default; use fill when a layout explicitly needs a full-width action. */
  width?: ButtonWidth;
  onPressedChange?: (pressed: boolean) => void;
  onUnavailable?: (source: UnavailableActionSource) => void;
};
