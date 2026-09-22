import type { HTMLAttributes, ReactNode } from 'react';

export type UserCardPlacement = 'bottom-end' | 'bottom-start' | 'top-end' | 'top-start';
export type UserCardVariant = 'default' | 'muted' | 'outline';

export type UserCardUser = {
  avatar?: ReactNode;
  initials?: string;
  name: ReactNode;
  subtitle?: ReactNode;
};

export type UserCardProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  defaultOpen?: boolean;
  disabled?: boolean;
  helpLabel?: string;
  logOutLabel?: string;
  open?: boolean;
  petLabel?: string;
  placement?: UserCardPlacement;
  settingsLabel?: string;
  settingsShortcut?: ReactNode;
  showHelp?: boolean;
  showPetAction?: boolean;
  showUsage?: boolean;
  usageLabel?: ReactNode;
  user: UserCardUser;
  variant?: UserCardVariant;
  onHelp?: () => void;
  onLogOut?: () => void;
  onOpenChange?: (open: boolean) => void;
  onPet?: () => void;
  onSettings?: () => void;
  onUsage?: () => void;
};
