import { TextInput } from '../../inputs/TextInput';
import { FormField } from './FormField';
import type { FormFieldProps } from '../Forms.types';

export type FormFieldExampleProps = Omit<FormFieldProps, 'children'> & {
  placeholder?: string;
  value?: string;
};

export function FormFieldExample({
  description = 'Reusable label, helper text, required marker, and validation message.',
  error,
  label = 'Strategy name',
  orientation = 'stacked',
  placeholder = 'Demo Momentum',
  required = true,
  size = 'comfortable',
  state,
  value = 'Demo Momentum',
}: FormFieldExampleProps) {
  return (
    <FormField description={description} error={error} label={label} orientation={orientation} required={required} size={size} state={state}>
      <TextInput ariaLabel="Strategy name" placeholder={placeholder} value={value} />
    </FormField>
  );
}
