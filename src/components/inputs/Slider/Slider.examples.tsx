import { useEffect, useState } from 'react';
import '../InputControl.css';
import { Slider } from './Slider';

export type SliderExampleProps = {
  disabled?: boolean;
  max?: number;
  min?: number;
  step?: number;
  suffix?: string;
  value?: number;
};

export function SliderExample({ disabled = false, max = 100, min = 0, step = 1, suffix = '%', value = 42 }: SliderExampleProps) {
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  return (
    <div className="input-example">
      <Slider
        ariaLabel="Example slider"
        disabled={disabled}
        label="Risk threshold"
        max={max}
        min={min}
        step={step}
        suffix={suffix}
        value={sliderValue}
        onValueChange={setSliderValue}
      />

      <div className="input-example__summary" role="status">
        <span>Value</span>
        <strong>
          {sliderValue}
          {suffix ? ` ${suffix}` : ''}
        </strong>
      </div>
    </div>
  );
}
