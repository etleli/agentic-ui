import { useEffect, useState } from 'react';
import '../InputControl.css';
import { Checkbox } from './Checkbox';

export type CheckboxExampleProps = {
  checked?: boolean;
  description?: string;
  disabled?: boolean;
  label?: string;
};

export function CheckboxExample({
  checked = true,
  description = 'Use live broker and market feed status.',
  disabled = false,
  label = 'Enable live checks',
}: CheckboxExampleProps) {
  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  return (
    <div className="input-example">
      <Checkbox checked={isChecked} description={description} disabled={disabled} label={label} onCheckedChange={setIsChecked} />

      <div className="input-example__summary" role="status">
        <span>State</span>
        <strong>{isChecked ? 'Checked' : 'Unchecked'}</strong>
      </div>
    </div>
  );
}
