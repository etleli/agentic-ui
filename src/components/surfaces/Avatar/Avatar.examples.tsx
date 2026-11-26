import { useEffect, useState } from 'react';
import { UserRound, UsersRound } from 'lucide-react';
import { Button } from '../../inputs/Button';
import { Avatar } from './Avatar';
import type { AvatarProps } from './Avatar.types';

export type AvatarExampleProps = Pick<AvatarProps, 'name' | 'size' | 'shape' | 'fit'> & {
  fallback: 'initials' | 'person' | 'group';
};

export function AvatarExample({ fallback, ...props }: AvatarExampleProps) {
  const [file, setFile] = useState<File>();
  const [src, setSrc] = useState<string>();
  useEffect(() => {
    if (!file) {
      setSrc(undefined);
      return undefined;
    }
    const url = URL.createObjectURL(file);
    setSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const fallbackContent = fallback === 'person' ? <UserRound aria-hidden="true" />
    : fallback === 'group' ? <UsersRound aria-hidden="true" /> : undefined;

  return <div className="workspace-examples__stack">
    <Avatar {...props} src={src} fallback={fallbackContent} />
    <div className="workspace-examples__actions">
      <label>Photo <input type="file" accept="image/*" onChange={(event) => {
        const nextFile = event.currentTarget.files?.[0];
        if (nextFile) setFile(nextFile);
        event.currentTarget.value = '';
      }} /></label>
      {file ? <Button size="compact" variant="secondary" onClick={() => setFile(undefined)}>Remove photo</Button> : null}
    </div>
  </div>;
}
