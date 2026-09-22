import { X } from 'lucide-react';
import './Tag.css';
import type { TagProps } from './Tag.types';

function getTagClassName(className: TagProps['className']) {
  return ['tag', className].filter(Boolean).join(' ');
}

export function Tag({
  className,
  dot = false,
  icon,
  label = 'Tag',
  removable = false,
  size = 'comfortable',
  tone = 'default',
  variant = 'soft',
  onRemove,
  ...tagProps
}: TagProps) {
  return (
    <span {...tagProps} className={getTagClassName(className)} data-size={size} data-tone={tone} data-variant={variant}>
      {dot ? <span className="tag__dot" aria-hidden="true" /> : null}
      {icon ? <span className="tag__icon">{icon}</span> : null}
      {label ? <span className="tag__label">{label}</span> : null}
      {removable ? (
        <button className="tag__remove" type="button" aria-label={`Remove ${String(label)}`} onClick={onRemove}>
          <X size={13} aria-hidden="true" />
        </button>
      ) : null}
    </span>
  );
}

export type { TagProps, TagSize, TagTone, TagVariant } from './Tag.types';
