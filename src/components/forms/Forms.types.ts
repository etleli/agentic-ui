import type { HTMLAttributes, ReactNode } from 'react';

export type FormControlSize = 'compact' | 'comfortable' | 'spacious';
export type FormFieldOrientation = 'stacked' | 'inline';
export type FormFieldState = 'default' | 'error' | 'warning' | 'success';
export type FormSurfaceVariant = 'default' | 'muted' | 'outline';
export type FormGroupColumns = 'one' | 'two' | 'three';
export type OptionPickerVariant = 'cards' | 'chips';
export type OptionPickerValue = string | string[];
export type WeekStart = 'sunday' | 'monday';
export type TimePickerFormat = '24h' | '12h';
export type TagPickerValue = string[];
export type FormActionTone = 'primary' | 'secondary' | 'danger' | 'subtle';

export type OptionPickerOption = {
  color?: string;
  description?: ReactNode;
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type FormFieldProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  children?: ReactNode;
  description?: ReactNode;
  error?: ReactNode;
  label?: ReactNode;
  orientation?: FormFieldOrientation;
  required?: boolean;
  size?: FormControlSize;
  state?: FormFieldState;
};

export type FormGroupProps = Omit<HTMLAttributes<HTMLFieldSetElement>, 'children'> & {
  children?: ReactNode;
  columns?: FormGroupColumns;
  description?: ReactNode;
  legend?: ReactNode;
  size?: FormControlSize;
  variant?: FormSurfaceVariant;
};

export type OptionPickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
  columns?: FormGroupColumns | 'auto';
  disabled?: boolean;
  multiSelect?: boolean;
  options?: OptionPickerOption[];
  size?: FormControlSize;
  value?: OptionPickerValue;
  variant?: OptionPickerVariant;
  onValueChange?: (value: OptionPickerValue) => void;
};

export type DatePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
  ariaLabel?: string;
  description?: ReactNode;
  disabled?: boolean;
  label?: ReactNode;
  max?: string;
  min?: string;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  showTodayButton?: boolean;
  size?: FormControlSize;
  value?: string;
  weekStartsOn?: WeekStart;
  onValueChange?: (value: string) => void;
};

export type TimePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
  ariaLabel?: string;
  description?: ReactNode;
  disabled?: boolean;
  format?: TimePickerFormat;
  label?: ReactNode;
  placeholder?: string;
  readOnly?: boolean;
  required?: boolean;
  size?: FormControlSize;
  stepMinutes?: number;
  value?: string;
  onValueChange?: (value: string) => void;
};

export type DateRangeValue = {
  end?: string;
  start?: string;
};

export type DateRangePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
  description?: ReactNode;
  disabled?: boolean;
  endLabel?: ReactNode;
  max?: string;
  min?: string;
  required?: boolean;
  showPresets?: boolean;
  size?: FormControlSize;
  startLabel?: ReactNode;
  value?: DateRangeValue;
  weekStartsOn?: WeekStart;
  onValueChange?: (value: DateRangeValue) => void;
};

export type FilePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
  accept?: string;
  description?: ReactNode;
  disabled?: boolean;
  label?: ReactNode;
  maxFiles?: number;
  multiple?: boolean;
  placeholder?: ReactNode;
  required?: boolean;
  selectedFiles?: string[];
  size?: FormControlSize;
  onFilesChange?: (files: string[]) => void;
};

export type TagPickerOption = {
  color?: string;
  disabled?: boolean;
  label: ReactNode;
  value: string;
};

export type TagPickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
  allowCustomTags?: boolean;
  description?: ReactNode;
  disabled?: boolean;
  label?: ReactNode;
  options?: TagPickerOption[];
  placeholder?: string;
  required?: boolean;
  size?: FormControlSize;
  value?: TagPickerValue;
  onValueChange?: (value: TagPickerValue) => void;
};

export type DateTimePickerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> & {
  dateLabel?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
  format?: TimePickerFormat;
  label?: ReactNode;
  required?: boolean;
  size?: FormControlSize;
  stepMinutes?: number;
  value?: string;
  weekStartsOn?: WeekStart;
  onValueChange?: (value: string) => void;
};

export type ValidationSummaryItem = {
  description?: ReactNode;
  field?: ReactNode;
  id: string;
  label: ReactNode;
  state?: FormFieldState;
};

export type ValidationSummaryProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  description?: ReactNode;
  items?: ValidationSummaryItem[];
  size?: FormControlSize;
  title?: ReactNode;
  variant?: FormSurfaceVariant;
};

export type FormAction = {
  disabled?: boolean;
  id: string;
  label: ReactNode;
  tone?: FormActionTone;
};

export type FormActionsProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  actions?: FormAction[];
  alignment?: 'start' | 'end' | 'between';
  busy?: boolean;
  size?: FormControlSize;
  sticky?: boolean;
  onActionSelect?: (actionId: string, action: FormAction) => void;
};
