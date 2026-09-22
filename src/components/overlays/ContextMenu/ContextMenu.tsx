import { Check, MoreHorizontal } from 'lucide-react';
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { OverlayPortal } from '../overlayPortal';
import { useOverlayPresence } from '../overlayPresence';
import './ContextMenu.css';
import type { ContextMenuActionItem, ContextMenuItem, ContextMenuItemTone, ContextMenuProps } from './ContextMenu.types';

const VIEWPORT_GUTTER = 8;

function getContextMenuClassName(className: ContextMenuProps['className']) {
  return ['context-menu', className].filter(Boolean).join(' ');
}

function getFocusableMenuItems(menuElement: HTMLDivElement | null) {
  return Array.from(menuElement?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') ?? []);
}

export function ContextMenu({
  children,
  className,
  contextOnly = false,
  defaultOpen = false,
  emptyLabel = 'No actions',
  items,
  onOpenChange,
  onSelect,
  onUnavailable,
  open,
  selectedId,
  showShortcuts = true,
  triggerLabel = 'Actions',
  ...menuProps
}: ContextMenuProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const [menuPosition, setMenuPosition] = useState({ source: 'auto' as 'auto' | 'pointer', x: 16, y: 48 });
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const { isPresent, presenceState } = useOverlayPresence(isOpen);

  const updateOpen = useCallback((nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);

    if (!nextOpen) {
      requestAnimationFrame(() => restoreFocusRef.current?.focus({ preventScroll: true }));
    }
  }, [isControlled, onOpenChange]);

  function rememberFocus(target?: EventTarget | null) {
    restoreFocusRef.current = target instanceof HTMLElement ? target : document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }

  function openAtPointer(clientX: number, clientY: number, focusTarget?: EventTarget | null) {
    rememberFocus(focusTarget);
    setMenuPosition({
      source: 'pointer',
      x: Math.max(VIEWPORT_GUTTER, clientX),
      y: Math.max(VIEWPORT_GUTTER, clientY),
    });
    updateOpen(true);
  }

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;

      if (!menuRef.current?.contains(target)) {
        updateOpen(false);
      }
    }

    function handleKeyDown(event: globalThis.KeyboardEvent) {
      if (event.key === 'Escape') {
        updateOpen(false);
      }
    }

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, updateOpen]);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => getFocusableMenuItems(menuRef.current)[0]?.focus({ preventScroll: true }));
    return () => cancelAnimationFrame(frame);
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen || menuPosition.source !== 'auto') {
      return;
    }

    const rootRect = rootRef.current?.getBoundingClientRect();

    if (rootRect) {
      setMenuPosition({ source: 'auto', x: Math.max(VIEWPORT_GUTTER, rootRect.left + 12), y: Math.max(VIEWPORT_GUTTER, rootRect.top + 48) });
    }
  }, [isOpen, menuPosition.source]);

  useLayoutEffect(() => {
    if (!isOpen || !menuRef.current) {
      return;
    }

    const menuRect = menuRef.current.getBoundingClientRect();
    const maxX = Math.max(VIEWPORT_GUTTER, window.innerWidth - menuRect.width - VIEWPORT_GUTTER);
    const maxY = Math.max(VIEWPORT_GUTTER, window.innerHeight - menuRect.height - VIEWPORT_GUTTER);
    const nextX = Math.min(Math.max(VIEWPORT_GUTTER, menuPosition.x), maxX);
    const nextY = Math.min(Math.max(VIEWPORT_GUTTER, menuPosition.y), maxY);

    if (nextX !== menuPosition.x || nextY !== menuPosition.y) {
      setMenuPosition((currentPosition) => ({ ...currentPosition, x: nextX, y: nextY }));
    }
  }, [isOpen, menuPosition.x, menuPosition.y]);

  function handleMenuKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    const focusableItems = getFocusableMenuItems(menuRef.current);

    if (focusableItems.length === 0) {
      return;
    }

    const activeIndex = Math.max(0, focusableItems.indexOf(document.activeElement as HTMLButtonElement));

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      focusableItems[(activeIndex + delta + focusableItems.length) % focusableItems.length]?.focus();
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusableItems[event.key === 'Home' ? 0 : focusableItems.length - 1]?.focus();
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      (document.activeElement instanceof HTMLButtonElement ? document.activeElement : focusableItems[activeIndex])?.click();
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      updateOpen(false);
    }
  }

  return (
    <div
      {...menuProps}
      className={getContextMenuClassName(className)}
      data-open={isOpen ? 'true' : undefined}
      ref={rootRef}
      style={menuProps.style}
      onContextMenu={(event) => {
        event.preventDefault();
        openAtPointer(event.clientX, event.clientY, event.currentTarget);
        menuProps.onContextMenu?.(event);
      }}
    >
      {contextOnly ? children : (
        <>
          <button
            className="context-menu__trigger"
            type="button"
            aria-expanded={isOpen}
            aria-haspopup="menu"
            onClick={(event) => {
              if (isOpen) {
                updateOpen(false);
                return;
              }

              const rect = event.currentTarget.getBoundingClientRect();
              openAtPointer(rect.left + 12, rect.bottom + 8, event.currentTarget);
            }}
          >
            <MoreHorizontal size={17} aria-hidden="true" />
            <span>{triggerLabel}</span>
          </button>

          <div className="context-menu__surface" aria-label={`${triggerLabel} target`}>
            {children}
            <small>Right-click this area or use the action button.</small>
          </div>
        </>
      )}

      {isPresent ? (
        <OverlayPortal>
          <div
            className="context-menu__menu"
            data-state={presenceState}
            ref={menuRef}
            role="menu"
            aria-label={triggerLabel}
            style={{ '--context-menu-x': `${menuPosition.x}px`, '--context-menu-y': `${menuPosition.y}px` } as CSSProperties}
            onKeyDown={handleMenuKeyDown}
          >
            {items.length > 0 ? items.map((item) => {
              if (item.kind === 'heading') {
                return <span className="context-menu__heading" key={item.id} role="presentation">{item.label}</span>;
              }

              if (item.kind === 'separator') {
                return <span className="context-menu__separator" key={item.id} role="separator" />;
              }

              const isSelected = item.id === selectedId;
              const isUnavailable = item.unavailableReason !== undefined;
              const isNativeDisabled = Boolean(item.disabled) && !isUnavailable;
              const descriptionId = `context-menu-${item.id}-reason`;

              return (
                <button
                  aria-describedby={isUnavailable ? descriptionId : undefined}
                  aria-disabled={isUnavailable ? true : undefined}
                  className="context-menu__item"
                  data-selected={isSelected ? 'true' : undefined}
                  data-tone={item.tone ?? 'default'}
                  data-unavailable={isUnavailable ? 'true' : undefined}
                  disabled={isNativeDisabled}
                  key={item.id}
                  role="menuitem"
                  type="button"
                  onClick={(event) => {
                    if (isUnavailable) {
                      event.preventDefault();
                      event.stopPropagation();
                      onUnavailable?.(item);
                      return;
                    }

                    if (isNativeDisabled) {
                      return;
                    }

                    onSelect?.(item);
                    updateOpen(false);
                  }}
                >
                  <span className="context-menu__check">{isSelected ? <Check size={15} aria-hidden="true" /> : null}</span>
                  <span className="context-menu__item-copy">
                    <span>{item.label}</span>
                    {item.description ? <small>{item.description}</small> : null}
                    {isUnavailable ? <small className="context-menu__unavailable-reason" id={descriptionId}>Unavailable: {item.unavailableReason}</small> : null}
                  </span>
                  {showShortcuts && item.shortcut ? <kbd>{item.shortcut}</kbd> : null}
                </button>
              );
            }) : <span className="context-menu__empty">{emptyLabel}</span>}
          </div>
        </OverlayPortal>
      ) : null}
    </div>
  );
}

export type { ContextMenuActionItem, ContextMenuItem, ContextMenuItemTone, ContextMenuProps };
