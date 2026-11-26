import { useState } from 'react';
import { UserRound } from 'lucide-react';
import type { AvatarProps } from './Avatar.types';
import './Avatar.css';

function AvatarImage({ src, fallback }: { src: string; fallback: AvatarProps['fallback'] }) {
  const [failed, setFailed] = useState(false);
  return failed ? fallback : <img alt="" src={src} draggable={false} onError={() => setFailed(true)} />;
}

export function Avatar({ src, name, fallback, size = 'comfortable', shape = 'circle', fit = 'cover', className, ...attributes }: AvatarProps) {
  const initials = name?.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => Array.from(part)[0]).join('').toLocaleUpperCase();
  const placeholder = fallback ?? (initials || <UserRound aria-hidden="true" />);
  return <span role={name ? 'img' : undefined} aria-label={name} aria-hidden={name ? undefined : true} {...attributes}
    className={['avatar', className].filter(Boolean).join(' ')} data-size={size} data-shape={shape} data-fit={fit}>
    {src ? <AvatarImage key={src} src={src} fallback={placeholder} /> : placeholder}
  </span>;
}
