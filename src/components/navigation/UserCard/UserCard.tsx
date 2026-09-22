import { ChevronRight, CircleHelp, Gauge, LogOut, PawPrint, Settings } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { OverlayPortal } from '../../overlays/overlayPortal';
import { useOverlayPresence } from '../../overlays/overlayPresence';
import './UserCard.css';
import type { UserCardPlacement, UserCardProps } from './UserCard.types';

const PANEL_WIDTH = 272;
const VIEWPORT_GUTTER = 8;

function getUserCardClassName(className: UserCardProps['className']) {
  return ['user-card', className].filter(Boolean).join(' ');
}

function getInitials(user: UserCardProps['user']) {
  if (user.initials) {
    return user.initials;
  }

  return typeof user.name === 'string'
    ? user.name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
    : 'U';
}

function isTopPlacement(placement: UserCardPlacement) {
  return placement.startsWith('top');
}

function isEndPlacement(placement: UserCardPlacement) {
  return placement.endsWith('end');
}

export function UserCard({
  className,
  defaultOpen = false,
  disabled = false,
  helpLabel = 'Help',
  logOutLabel = 'Log out',
  open,
  petLabel = 'Show pet',
  placement = 'top-start',
  settingsLabel = 'Settings',
  settingsShortcut,
  showHelp = false,
  showPetAction = true,
  showUsage = true,
  usageLabel = 'Usage remaining',
  user,
  variant = 'default',
  onHelp,
  onLogOut,
  onOpenChange,
  onPet,
  onSettings,
  onUsage,
  ...cardProps
}: UserCardProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [panelStyle, setPanelStyle] = useState<CSSProperties>({});
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const { isPresent, presenceState } = useOverlayPresence(isOpen);

  const updateOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen);
      }

      onOpenChange?.(nextOpen);
    },
    [isControlled, onOpenChange],
  );

  const updatePosition = useCallback(() => {
    const triggerRect = triggerRef.current?.getBoundingClientRect();

    if (!triggerRect) {
      return;
    }

    const proposedLeft = isEndPlacement(placement) ? triggerRect.right - PANEL_WIDTH : triggerRect.left;
    const maxLeft = Math.max(VIEWPORT_GUTTER, window.innerWidth - PANEL_WIDTH - VIEWPORT_GUTTER);
    const left = Math.min(Math.max(proposedLeft, VIEWPORT_GUTTER), maxLeft);
    const top = isTopPlacement(placement) ? triggerRect.top - VIEWPORT_GUTTER : triggerRect.bottom + VIEWPORT_GUTTER;

    setPanelStyle({
      '--user-card-panel-left': `${left}px`,
      '--user-card-panel-top': `${top}px`,
    } as CSSProperties);
  }, [placement]);

  useEffect(() => {
    if (disabled && isOpen) {
      updateOpen(false);
    }
  }, [disabled, isOpen, updateOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (!triggerRef.current?.contains(target) && !panelRef.current?.contains(target)) {
        updateOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        updateOpen(false);
        triggerRef.current?.focus();
      }
    }

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updateOpen]);

  useLayoutEffect(() => {
    if (!isPresent) {
      return undefined;
    }

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
    };
  }, [isPresent, updatePosition]);

  function runAction(action?: () => void) {
    action?.();
    updateOpen(false);
  }

  return (
    <div
      {...cardProps}
      className={getUserCardClassName(className)}
      data-open={isOpen ? 'true' : undefined}
      data-variant={variant}
    >
      <div className="user-card__trigger-row">
        <button
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={`Open account menu for ${typeof user.name === 'string' ? user.name : 'user'}`}
          className="user-card__trigger"
          disabled={disabled}
          ref={triggerRef}
          type="button"
          onClick={() => updateOpen(!isOpen)}
        >
          <span className="user-card__avatar" aria-hidden="true">
            {user.avatar ?? getInitials(user)}
          </span>
          <span className="user-card__identity">
            <strong>{user.name}</strong>
            {user.subtitle ? <small>{user.subtitle}</small> : null}
          </span>
        </button>
        {showHelp ? (
          <button aria-label={helpLabel} className="user-card__help" type="button" onClick={onHelp}>
            <CircleHelp size={15} aria-hidden="true" />
          </button>
        ) : null}
      </div>

      {isPresent ? (
        <OverlayPortal>
          <div
            aria-label="Account menu"
            className="user-card__panel"
            data-placement={placement}
            data-state={presenceState}
            data-variant={variant}
            ref={panelRef}
            role="dialog"
            style={panelStyle}
          >
            <div className="user-card__panel-user">
              <span className="user-card__avatar" aria-hidden="true">
                {user.avatar ?? getInitials(user)}
              </span>
              <span className="user-card__identity">
                <strong>{user.name}</strong>
                {user.subtitle ? <small>{user.subtitle}</small> : null}
              </span>
            </div>
            <div className="user-card__actions">
              {showUsage ? (
                <button className="user-card__action" type="button" onClick={() => runAction(onUsage)}>
                  <Gauge size={16} aria-hidden="true" />
                  <span>{usageLabel}</span>
                  <ChevronRight size={16} aria-hidden="true" />
                </button>
              ) : null}
              {showPetAction ? (
                <button className="user-card__action" type="button" onClick={() => runAction(onPet)}>
                  <PawPrint size={16} aria-hidden="true" />
                  <span>{petLabel}</span>
                </button>
              ) : null}
              <button className="user-card__action" type="button" onClick={() => runAction(onSettings)}>
                <Settings size={16} aria-hidden="true" />
                <span>{settingsLabel}</span>
                {settingsShortcut ? <kbd>{settingsShortcut}</kbd> : null}
              </button>
              <button className="user-card__action user-card__action--danger" type="button" onClick={() => runAction(onLogOut)}>
                <LogOut size={16} aria-hidden="true" />
                <span>{logOutLabel}</span>
              </button>
            </div>
          </div>
        </OverlayPortal>
      ) : null}
    </div>
  );
}

export type { UserCardPlacement, UserCardProps, UserCardUser, UserCardVariant } from './UserCard.types';
