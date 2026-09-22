import { FormActions } from './FormActions';
import type { FormControlSize } from '../Forms.types';

export type FormActionsExampleProps = {
  alignment?: 'start' | 'end' | 'between';
  busy?: boolean;
  size?: FormControlSize;
  sticky?: boolean;
};

const formActions = [
  { id: 'cancel', label: 'Cancel', tone: 'subtle' as const },
  { id: 'save-draft', label: 'Save draft', tone: 'secondary' as const },
  { id: 'submit', label: 'Submit', tone: 'primary' as const },
];

export function FormActionsExample({ alignment = 'end', busy = false, size = 'comfortable', sticky = false }: FormActionsExampleProps) {
  return <FormActions actions={formActions} alignment={alignment} busy={busy} size={size} sticky={sticky} />;
}
