import { useEffect, useState } from 'react';
import { ColorInput } from './ColorInput';

export type ColorInputExampleProps = {
  disabled?: boolean;
  label?: string;
  value?: string;
};

export function ColorInputExample({ disabled = false, label = 'Signal color', value = '#05d671' }: ColorInputExampleProps) {
  const [colorValue, setColorValue] = useState(value);

  useEffect(() => {
    setColorValue(value);
  }, [value]);

  return (
    <div className="input-example">
      <ColorInput ariaLabel="Example color input" disabled={disabled} label={label} value={colorValue} onValueChange={setColorValue} />

      <div className="input-example__summary" role="status">
        <span>Color</span>
        <strong>{colorValue}</strong>
      </div>
    </div>
  );
}
