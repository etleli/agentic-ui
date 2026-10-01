import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { PortalOwnerContext, useOwnedPortalRegion, ownedRegionStyle } from './portalOwnership';

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

export function OverlayPortal({ children, destination = 'floating' }: { children: ReactNode; destination?: 'floating' | 'surface' }) {
  const { owner, ref } = useOwnedPortalRegion();
  const globalDestination = destination === 'surface' || !owner;
  const [overlayRoot, setOverlayRoot] = useState<HTMLElement | null>(() => (typeof document === 'undefined' || !globalDestination ? null : getOverlayRoot()));

  useEffect(() => {
    if (globalDestination && !overlayRoot) {
      setOverlayRoot(getOverlayRoot());
    }
  }, [overlayRoot, globalDestination]);

  if (destination === 'floating' && owner) {
    if (owner.error && owner.open) throw owner.error;
    return owner.target && owner.open && owner.visible ? createPortal(<div data-owned-portal="" ref={ref} style={ownedRegionStyle()}>{children}</div>, owner.target) : null;
  }
  return overlayRoot ? createPortal(destination === 'surface' ? <PortalOwnerContext.Provider value={null}>{children}</PortalOwnerContext.Provider> : children, overlayRoot) : null;
}
