import { useState } from 'react';
import { UserCard } from './UserCard';
import type { UserCardPlacement, UserCardProps, UserCardVariant } from './UserCard.types';

export type UserCardExampleProps = Omit<UserCardProps, 'defaultOpen' | 'onOpenChange' | 'user'> & {
  placement?: UserCardPlacement;
  variant?: UserCardVariant;
};

export function UserCardExample({
  placement = 'top-start',
  showHelp = true,
  showPetAction = true,
  showUsage = true,
  variant = 'default',
  ...props
}: UserCardExampleProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [lastAction, setLastAction] = useState<string>();

  return (
    <div className="user-card-example">
      <UserCard
        {...props}
        helpLabel="Open help"
        logOutLabel="Log out"
        open={isOpen}
        petLabel="Show pet"
        placement={placement}
        settingsShortcut="Ctrl + ,"
        showHelp={showHelp}
        showPetAction={showPetAction}
        showUsage={showUsage}
        usageLabel="Usage remaining"
        user={{ initials: 'DU', name: 'demo-user', subtitle: 'Pro plan' }}
        variant={variant}
        onHelp={() => setLastAction('Help opened')}
        onLogOut={() => setLastAction('Log out requested')}
        onOpenChange={setIsOpen}
        onPet={() => setLastAction('Pet opened')}
        onSettings={() => setLastAction('Settings opened')}
        onUsage={() => setLastAction('Usage opened')}
      />
      {lastAction ? <p className="user-card-example__feedback" role="status">{lastAction}</p> : null}
    </div>
  );
}
