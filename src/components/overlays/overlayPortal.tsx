import { useContext, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { ModalFocusScopeContext, refreshModalScope } from './Modal/Modal.focus';

const OVERLAY_ROOT_ID = 'agentic-ui-overlay-root';

function getOverlayRoot(): HTMLElement {
  let overlayRoot = document.getElementById(OVERLAY_ROOT_ID);

  if (!overlayRoot) {
    overlayRoot = document.createElement('div');
    overlayRoot.id = OVERLAY_ROOT_ID;
    overlayRoot.className = 'overlay-root';
    document.body.appendChild(overlayRoot);
  }

  return overlayRoot;
}

export function OverlayPortal({ children }: { children: ReactNode }) {
  const modalFocus = useContext(ModalFocusScopeContext);
  const [overlayRoot, setOverlayRoot] = useState<HTMLElement | null>(() => (typeof document === 'undefined' ? null : getOverlayRoot()));

  useEffect(() => {
    if (!overlayRoot) {
      setOverlayRoot(getOverlayRoot());
    }
  }, [overlayRoot]);

  return overlayRoot ? createPortal(modalFocus ? (
    <div data-modal-owned="" style={{ display: modalFocus.rendered ? 'contents' : 'none' }} inert={!modalFocus.open || undefined} ref={(region) => {
      if (!region) return undefined;
      modalFocus.scope.regions.add(region); refreshModalScope(modalFocus.scope);
      return () => { modalFocus.scope.regions.delete(region); refreshModalScope(modalFocus.scope); };
    }}>{children}</div>
  ) : children, overlayRoot) : null;
}
