import type { TextareaHTMLAttributes } from 'react';

export type TextAreaResize = 'none' | 'vertical' | 'horizontal' | 'both';

export type TextAreaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'value'> & {
  ariaLabel: string;
  autoResize?: boolean;
  description?: string;
  label?: string;
  maxRows?: number;
  minRows?: number;
  resize?: TextAreaResize;
  showCounter?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
};
