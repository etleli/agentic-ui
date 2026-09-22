import type { InputHTMLAttributes } from 'react';

export type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'checked' | 'onChange' | 'type'> & {
  checked?: boolean;
  description?: string;
  label: string;
  onCheckedChange?: (checked: boolean) => void;
};
