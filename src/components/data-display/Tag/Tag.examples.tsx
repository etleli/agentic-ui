import { useEffect, useState } from 'react';
import { Tag } from './Tag';
import type { TagSize, TagTone, TagVariant } from './Tag.types';

export type TagExampleProps = {
  dot?: boolean;
  label?: string;
  removable?: boolean;
  size?: TagSize;
  tone?: TagTone;
  variant?: TagVariant;
};

export function TagExample({
  dot = true,
  label = 'High importance',
  removable = false,
  size = 'comfortable',
  tone = 'warning',
  variant = 'soft',
}: TagExampleProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    setIsVisible(true);
  }, [label, removable]);

  return isVisible ? (
    <Tag dot={dot} label={label} removable={removable} size={size} tone={tone} variant={variant} onRemove={() => setIsVisible(false)} />
  ) : null;
}
