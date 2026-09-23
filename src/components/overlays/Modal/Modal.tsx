import { X } from 'lucide-react';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { OverlayPortal } from '../overlayPortal';
import { Tooltip } from '../Tooltip';
import { Button } from '../../inputs/Button';
import { useOverlayPresence } from '../overlayPresence';
import './Modal.css';
import type { ModalConfirmVariant, ModalPresentation, ModalProps, ModalSize } from './Modal.types';
import { ModalFocusScopeContext, useModalFocus } from './Modal.focus';

function getModalClassName(className: ModalProps['className']) {
  return ['modal-overlay', className].filter(Boolean).join(' ');
}

export function Modal({
  cancelLabel = 'Cancel',
  children,
  className,
  confirmDisabled = false,
  confirmLabel = 'Confirm',
  confirmUnavailableReason,
  confirmVariant = 'primary',
  defaultOpen = false,
  description,
  onCancel,
  onConfirm,
  onConfirmUnavailable,
  onOpenChange,
  open,
  presentation = 'viewport',
  showConfirm = true,
  showClose = true,
  size = 'comfortable',
  title,
  ...modalProps
}: ModalProps) {
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const isControlled = open !== undefined;
  const isOpen = isControlled ? open : internalOpen;
  const parentFocusScope = useContext(ModalFocusScopeContext);
  const isFocusActive = isOpen && !modalProps.hidden && !modalProps.inert && (parentFocusScope?.open ?? true);
  const { isPresent, presenceState } = useOverlayPresence(isOpen);
  const [dialog, setDialog] = useState<HTMLElement | null>(null);
  const [focusRegions] = useState(() => new Set<HTMLElement>());
  const focusScope = useMemo(() => ({ regions: focusRegions, open: isFocusActive, parent: parentFocusScope }), [focusRegions, isFocusActive, parentFocusScope]);
  useModalFocus(dialog, isFocusActive, focusRegions, parentFocusScope);

  const updateOpen = useCallback((nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }

    onOpenChange?.(nextOpen);
  }, [isControlled, onOpenChange]);

  const handleCancel = useCallback(() => {
    onCancel?.();
    updateOpen(false);
  }, [onCancel, updateOpen]);

  const handleConfirm = useCallback(() => {
    onConfirm?.();
    updateOpen(false);
  }, [onConfirm, updateOpen]);

  useEffect(() => {
    if (!isFocusActive) {
      return undefined;
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        updateOpen(false);
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFocusActive, updateOpen]);

  if (!isPresent) {
    return null;
  }

  const overlay = (
    <ModalFocusScopeContext.Provider value={focusScope}>
    <div
      {...modalProps}
      className={getModalClassName(className)}
      data-presentation={presentation}
      data-size={size}
      data-state={presenceState}
      role="presentation"
      inert={modalProps.inert || !isFocusActive || undefined}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          updateOpen(false);
        }

        modalProps.onMouseDown?.(event);
      }}
    >
      <section ref={setDialog} tabIndex={-1} className="modal-overlay__dialog" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Modal dialog'}>
        <header className="modal-overlay__header">
          <span className="modal-overlay__heading-copy">
            {title ? <strong>{title}</strong> : null}
            {description ? <span>{description}</span> : null}
          </span>
          {showClose ? (
            <Tooltip content="Close dialog" placement="left" size="compact">
              <button className="modal-overlay__icon-button" type="button" aria-label="Close dialog" onClick={() => updateOpen(false)}>
                <X size={17} aria-hidden="true" />
              </button>
            </Tooltip>
          ) : null}
        </header>

        {children ? <div className="modal-overlay__body">{children}</div> : null}

        <footer className="modal-overlay__footer">
          <button className="modal-overlay__button modal-overlay__button--secondary" type="button" onClick={handleCancel}>
            {cancelLabel}
          </button>
          {showConfirm ? (
            <Button
              className={'modal-overlay__button modal-overlay__button--' + confirmVariant}
              disabled={confirmDisabled}
              htmlType="button"
              unavailableReason={confirmUnavailableReason}
              variant={confirmVariant}
              onClick={handleConfirm}
              onUnavailable={onConfirmUnavailable}
            >
              {confirmLabel}
            </Button>
          ) : null}
        </footer>
      </section>
    </div>
    </ModalFocusScopeContext.Provider>
  );

  return presentation === 'viewport' ? <OverlayPortal>{overlay}</OverlayPortal> : overlay;
}

export type { ModalConfirmVariant, ModalPresentation, ModalProps, ModalSize };
