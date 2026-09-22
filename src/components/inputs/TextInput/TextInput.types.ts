import type { InputHTMLAttributes, ReactNode } from 'react';
import type { UnavailableActionSource } from '../UnavailableAction';

export type TextInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'type' | 'value'> & {
  ariaLabel: string;
  description?: string;
  isPassword?: boolean;
  label?: string;
  /** Explains why this field is unavailable while keeping the explanation focusable. */
  unavailableReason?: ReactNode;
  value?: string;
  onValueChange?: (value: string) => void;
  onUnavailable?: (source: UnavailableActionSource) => void;
};
