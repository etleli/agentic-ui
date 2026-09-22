import './Divider.css';
import type { DividerInset, DividerOrientation, DividerProps, DividerTone } from './Divider.types';

function getDividerClassName(className: DividerProps['className']) {
  return ['surface-divider', className].filter(Boolean).join(' ');
}

export function Divider({
  className,
  inset = 'none',
  label,
  orientation = 'horizontal',
  tone = 'default',
  ...dividerProps
}: DividerProps) {
  return (
    <div
      {...dividerProps}
      aria-orientation={orientation}
      className={getDividerClassName(className)}
      data-inset={inset}
      data-orientation={orientation}
      data-tone={tone}
      role="separator"
    >
      {label && orientation === 'horizontal' ? <span className="surface-divider__label">{label}</span> : null}
    </div>
  );
}

export type { DividerInset, DividerOrientation, DividerProps, DividerTone };
