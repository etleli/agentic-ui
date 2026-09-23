import { useContext, useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { addModalFocusRegion, ModalFocusScopeContext, removeModalFocusRegion } from './Modal/Modal.focus';

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
  const modalScope = useContext(ModalFocusScopeContext);
  const [overlayRoot, setOverlayRoot] = useState<HTMLElement | null>(() => (typeof document === 'undefined' ? null : getOverlayRoot()));

  useEffect(() => {
    if (!overlayRoot) {
      setOverlayRoot(getOverlayRoot());
    }
  }, [overlayRoot]);

  return overlayRoot ? createPortal(modalScope ? (
    <div style={{ display: modalScope.rendered ? 'contents' : 'none' }} inert={!modalScope.open || undefined} ref={(region) => {
      if (!region) return undefined;
      addModalFocusRegion(modalScope.regions, region);
      return () => { removeModalFocusRegion(modalScope.regions, region); };
    }}>{children}</div>
  ) : children, overlayRoot) : null;
}
