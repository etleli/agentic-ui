import { Dropdown } from '../../inputs/Dropdown';
import { NumberInput } from '../../inputs/NumberInput';
import { TextInput } from '../../inputs/TextInput';
import { FormGroup } from './FormGroup';
import type { FormGroupProps } from '../Forms.types';

export type FormGroupExampleProps = Omit<FormGroupProps, 'children'>;

export function FormGroupExample({
  columns = 'two',
  description = 'Related fields share a surface, density, and validation rhythm.',
  legend = 'Order defaults',
  size = 'comfortable',
  variant = 'default',
}: FormGroupExampleProps) {
  return (
    <FormGroup columns={columns} description={description} legend={legend} size={size} variant={variant}>
      <TextInput ariaLabel="Symbol" label="Symbol" value="AAPL" />
      <NumberInput ariaLabel="Quantity" label="Quantity" value={100} />
      <Dropdown
        ariaLabel="Order type"
        options={[
          { label: 'Market', value: 'market' },
          { label: 'Limit', value: 'limit' },
          { label: 'Stop', value: 'stop' },
        ]}
        value="limit"
      />
    </FormGroup>
  );
}
