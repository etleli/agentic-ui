import { Play, Save, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { BrandMarkIcon } from '../../surfaces/BrandWatermark';
import '../InputControl.css';
import { Button } from './Button';
import './Button.examples.css';
import type { ButtonInteraction, ButtonSize, ButtonVariant } from './Button.types';

export type ButtonContentMode = 'text' | 'icon-text' | 'icon';

export type ButtonIconName = 'brand' | 'play' | 'save' | 'search';

export type ButtonExampleProps = {
  buttonType?: ButtonInteraction;
  contentMode?: ButtonContentMode;
  disabled?: boolean;
  iconName?: ButtonIconName;
  label?: string;
  pressed?: boolean;
  showToggleIndicator?: boolean;
  size?: ButtonSize;
  variant?: ButtonVariant;
};

function getIcon(iconName: ButtonIconName) {
  if (iconName === 'brand') {
    return <BrandMarkIcon />;
  }

  if (iconName === 'save') {
    return <Save size={18} aria-hidden="true" />;
  }

  if (iconName === 'search') {
    return <Search size={18} aria-hidden="true" />;
  }

  return <Play size={18} aria-hidden="true" />;
}

export function ButtonExample({
  buttonType = 'momentary',
  contentMode = 'icon-text',
  disabled = false,
  iconName = 'play',
  label = 'Run strategy',
  pressed = false,
  showToggleIndicator = true,
  size = 'comfortable',
  variant = 'primary',
}: ButtonExampleProps) {
  const [isPressed, setIsPressed] = useState(pressed);
  const [clickCount, setClickCount] = useState(0);
  const icon = useMemo(() => (contentMode === 'text' ? undefined : getIcon(iconName)), [contentMode, iconName]);

  useEffect(() => {
    setIsPressed(pressed);
  }, [pressed]);

  return (
    <div className="input-example button-example">
      <Button
        aria-label={contentMode === 'icon' ? label : undefined}
        buttonType={buttonType}
        disabled={disabled}
        icon={icon}
        iconOnly={contentMode === 'icon'}
        pressed={isPressed}
        showToggleIndicator={showToggleIndicator}
        size={size}
        variant={variant}
        onClick={() => setClickCount((currentCount) => currentCount + 1)}
        onPressedChange={setIsPressed}
      >
        {label}
      </Button>

      <div className="input-example__summary" role="status">
        <span>{buttonType === 'toggle' ? 'Toggle state' : 'Clicks'}</span>
        <strong>{buttonType === 'toggle' ? (isPressed ? 'On' : 'Off') : clickCount}</strong>
      </div>
    </div>
  );
}
