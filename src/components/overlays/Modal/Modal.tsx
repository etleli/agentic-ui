import { X } from 'lucide-react';
import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
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
  const { isPresent, presenceState } = useOverlayPresence(isOpen);
  const parentFocus = useContext(ModalFocusScopeContext);
  const [overlayNode, setOverlayNode] = useState<HTMLDivElement | null>(null);
  const [dialogNode, setDialogNode] = useState<HTMLElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const initialFocus = useCallback(() => closeButton.current, []);
  const focusOpen = isOpen && !modalProps.hidden && !modalProps.inert && (parentFocus?.open ?? true);
  const { scope, rendered } = useModalFocus(overlayNode, dialogNode, focusOpen, presentation, parentFocus?.scope ?? null, initialFocus);
  const focusContext = useMemo(() => ({ scope, open: focusOpen && rendered, rendered }), [scope, focusOpen, rendered]);

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
      {...modalProps}
      className={getModalClassName(className)}
      data-presentation={presentation}
      data-size={size}
      data-state={presenceState}
      role="presentation"
      ref={setOverlayNode}
      hidden={modalProps.hidden || parentFocus?.rendered === false || parentFocus?.open === false || undefined}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          updateOpen(false);
        }

        modalProps.onMouseDown?.(event);
      }}
    >
      <section className="modal-overlay__dialog" ref={setDialogNode} tabIndex={-1} role="dialog" aria-modal={presentation === 'viewport' ? true : undefined} aria-label={typeof title === 'string' ? title : 'Modal dialog'}>
        <header className="modal-overlay__header">
          <span className="modal-overlay__heading-copy">
            {title ? <strong>{title}</strong> : null}
            {description ? <span>{description}</span> : null}
          </span>
          {showClose ? (
            <Tooltip content="Close dialog" placement="left" size="compact">
              <button className="modal-overlay__icon-button" ref={closeButton} type="button" aria-label="Close dialog" onClick={() => updateOpen(false)}>
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
  );

  const content = <ModalFocusScopeContext.Provider value={focusContext}>{overlay}</ModalFocusScopeContext.Provider>;
  return presentation === 'viewport' ? <OverlayPortal>{content}</OverlayPortal> : content;
}

export type { ModalConfirmVariant, ModalPresentation, ModalProps, ModalSize };
