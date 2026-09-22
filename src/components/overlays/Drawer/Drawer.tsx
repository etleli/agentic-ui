import { X } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { OverlayPortal } from '../overlayPortal';
import { Tooltip } from '../Tooltip';
import { useOverlayPresence } from '../overlayPresence';
import './Drawer.css';
import type { DrawerPlacement, DrawerPresentation, DrawerProps, DrawerSize } from './Drawer.types';

function getDrawerClassName(className: DrawerProps['className']) {
  return ['drawer-overlay', className].filter(Boolean).join(' ');
}

export function Drawer({
  children,
  className,
  defaultOpen = false,
  description,
  footer,
  onOpenChange,
  open,
  placement = 'right',
  presentation = 'viewport',
  showClose = true,
  size = 'comfortable',
  title,
  ...drawerProps
}: DrawerProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const { isPresent, presenceState } = useOverlayPresence(isOpen);

  const updateOpen = useCallback((nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }, [isControlled, onOpenChange]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        updateOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, updateOpen]);

  if (!isPresent) {
    return null;
  }

  const overlay = (
    <div
      {...drawerProps}
      className={getDrawerClassName(className)}
      data-placement={placement}
      data-presentation={presentation}
      data-size={size}
      data-state={presenceState}
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          updateOpen(false);
        }

        drawerProps.onMouseDown?.(event);
      }}
    >
      <aside className="drawer-overlay__panel" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Drawer'}>
        <header className="drawer-overlay__header">
          <span className="drawer-overlay__heading-copy">
            {title ? <strong>{title}</strong> : null}
            {description ? <span>{description}</span> : null}
          </span>
          {showClose ? (
            <Tooltip content="Close drawer" placement="left" size="compact">
              <button className="drawer-overlay__close" type="button" aria-label="Close drawer" onClick={() => updateOpen(false)}>
                <X size={17} aria-hidden="true" />
              </button>
            </Tooltip>
          ) : null}
        </header>

        {children ? <div className="drawer-overlay__body">{children}</div> : null}
        {footer ? <footer className="drawer-overlay__footer">{footer}</footer> : null}
      </aside>
    </div>
  );

  return presentation === 'viewport' ? <OverlayPortal>{overlay}</OverlayPortal> : overlay;
}

export type { DrawerPlacement, DrawerPresentation, DrawerProps, DrawerSize };
