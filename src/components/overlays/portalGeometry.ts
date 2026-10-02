import type { CSSProperties } from 'react';

export type PortalSide = 'top' | 'bottom' | 'left' | 'right';
type Rectangle = { left: number; top: number; right: number; bottom: number; width: number; height: number };
export type PortalGeometry = { x: number; y: number; scaleX: number; scaleY: number; bounds: Rectangle };

export class UnsupportedPortalGeometryError extends Error {
  constructor() {
    super('Owned portal geometry is not positive axis-aligned affine geometry (rotation/skew/reflection/perspective requires a separate support contract).');
    this.name = 'UnsupportedPortalGeometryError';
  }
}

export function composedParent(element: Element): Element | null {
  return element.assignedSlot ?? element.parentElement ?? (element.getRootNode() instanceof element.ownerDocument.defaultView!.ShadowRoot ? (element.getRootNode() as ShadowRoot).host : null);
}
export function readPortalGeometry(root: HTMLElement, probes: HTMLElement[]): PortalGeometry | null {
  if (!root.isConnected || !root.getClientRects().length || probes.length !== 4 || probes.some((probe) => !probe.isConnected || !probe.getClientRects().length)) return null;
  const view = root.ownerDocument.defaultView!;
  // Hydration can run before the imported ownership stylesheet is applied.
  // Static probes all share an origin; that is pending layout, not a transform.
  if (probes.some((probe) => view.getComputedStyle(probe).position !== 'absolute')) return null;
  const rect = root.getBoundingClientRect();
  let left = Math.max(0, rect.left), top = Math.max(0, rect.top);
  let right = Math.min(view.innerWidth, rect.right), bottom = Math.min(view.innerHeight, rect.bottom);
  for (let node: Element | null = root; node; node = composedParent(node)) {
    const style = view.getComputedStyle(node);
    if (node.hasAttribute('hidden') || node.hasAttribute('inert') || style.display === 'none' || ['hidden', 'collapse'].includes(style.visibility)) return null;
    if (node !== root && node.getClientRects().length) {
      const box = node.getBoundingClientRect();
      const html = node as HTMLElement;
      const sx = html.offsetWidth ? box.width / html.offsetWidth : 1;
      const sy = html.offsetHeight ? box.height / html.offsetHeight : 1;
      if (/(hidden|clip|auto|scroll)/.test(style.overflowX) || style.contain.includes('paint')) {
        left = Math.max(left, box.left + node.clientLeft * sx); right = Math.min(right, box.left + (node.clientLeft + node.clientWidth) * sx);
      }
      if (/(hidden|clip|auto|scroll)/.test(style.overflowY) || style.contain.includes('paint')) {
        top = Math.max(top, box.top + node.clientTop * sy); bottom = Math.min(bottom, box.top + (node.clientTop + node.clientHeight) * sy);
      }
    }
  }
  const [origin, horizontal, vertical, diagonal] = probes.map((probe) => probe.getBoundingClientRect());
  const scaleX = (horizontal.left - origin.left) / 100, scaleY = (vertical.top - origin.top) / 100;
  if (scaleX <= 0 || scaleY <= 0 || Math.abs(horizontal.top - origin.top) > 0.01 || Math.abs(vertical.left - origin.left) > 0.01
    || Math.abs(diagonal.left - horizontal.left - vertical.left + origin.left) > 0.01 || Math.abs(diagonal.top - horizontal.top - vertical.top + origin.top) > 0.01) {
    throw new UnsupportedPortalGeometryError();
  }
  if (right <= left || bottom <= top) return null;
  return { x: origin.left, y: origin.top, scaleX, scaleY, bounds: { left, top, right, bottom, width: right - left, height: bottom - top } };
}

export function placeOwnedPortal(geometry: PortalGeometry, anchor: Rectangle, panel: HTMLElement | null, spec: {
  side: PortalSide; align?: 'start' | 'center' | 'end'; gap?: number; padding?: number; translated?: boolean | 'vertical'; minimumWidth?: number; interactive?: boolean;
}, xProperty: string, yProperty: string) {
  const { bounds } = geometry;
  const padding = spec.padding ?? 8, gap = spec.gap ?? 8, align = spec.align ?? 'start';
  const maxWidth = Math.max(1, bounds.width - padding * 2), maxHeight = Math.max(1, bounds.height - padding * 2);
  // Measure intrinsic CSS afresh rather than letting the last owned constraint
  // prevent growth after resize/content/theme changes. No consumer supplies
  // ancestor or scale arithmetic, and standalone CSS is never touched.
  let naturalWidth = 280, naturalHeight = 40, cssMaxWidth = Infinity;
  if (panel) {
    const previousWidth = panel.style.maxWidth, previousHeight = panel.style.maxHeight;
    const widthPriority = panel.style.getPropertyPriority('max-width'), heightPriority = panel.style.getPropertyPriority('max-height');
    const scrollLeft = panel.scrollLeft, scrollTop = panel.scrollTop;
    try {
      panel.style.maxWidth = ''; panel.style.maxHeight = '';
      const maximum = parseFloat(panel.ownerDocument.defaultView!.getComputedStyle(panel).maxWidth);
      if (Number.isFinite(maximum)) cssMaxWidth = maximum;
      naturalWidth = panel.offsetWidth || naturalWidth; naturalHeight = panel.offsetHeight || naturalHeight;
      if (spec.interactive === false) {
        // Tooltips cannot scroll. Measure their complete text at the final owned
        // width before deciding whether a separate operable explanation is needed.
        cssMaxWidth = Math.min(cssMaxWidth, naturalWidth);
        panel.style.maxWidth = `${Math.min(maxWidth, cssMaxWidth)}px`;
        naturalHeight = panel.offsetHeight || naturalHeight;
      }
    } finally {
      panel.style.setProperty('max-width', previousWidth, widthPriority);
      panel.style.setProperty('max-height', previousHeight, heightPriority);
      // Intrinsic measurement can clamp scrolling to zero when the panel grows.
      // Restore its constrained layout and scroll position before returning.
      panel.scrollLeft = scrollLeft; panel.scrollTop = scrollTop;
    }
  }
  const width = Math.min(maxWidth, Math.max(spec.minimumWidth ?? 0, naturalWidth));
  const height = Math.min(maxHeight, naturalHeight);
  const room = { top: anchor.top - gap - bounds.top - padding, bottom: bounds.bottom - padding - anchor.bottom - gap,
    left: anchor.left - gap - bounds.left - padding, right: bounds.right - padding - anchor.right - gap };
  const opposite: Record<PortalSide, PortalSide> = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };
  let side = spec.side;
  const needed = side === 'top' || side === 'bottom' ? height : width;
  if (room[side] < needed && room[opposite[side]] > room[side]) side = opposite[side];
  const vertical = side === 'top' || side === 'bottom';
  // Noninteractive bubbles may overlap the trigger instead of truncating text to
  // the adjacent space. Only explanations taller than the whole owner need scroll.
  const explanation = spec.interactive === false;
  const scrollable = explanation && naturalHeight > maxHeight;
  const availableWidth = explanation || vertical ? maxWidth : Math.max(1, Math.min(maxWidth, room[side]));
  const availableHeight = explanation || !vertical ? maxHeight : Math.max(1, Math.min(maxHeight, room[side]));
  const w = Math.min(width, availableWidth), h = Math.min(height, availableHeight);
  const alignX = align === 'start' ? anchor.left : align === 'end' ? anchor.right - w : (anchor.left + anchor.right - w) / 2;
  const alignY = align === 'start' ? anchor.top : align === 'end' ? anchor.bottom - h : (anchor.top + anchor.bottom - h) / 2;
  const proposedX = vertical ? alignX : side === 'left' ? anchor.left - gap - w : anchor.right + gap;
  const proposedY = vertical ? side === 'top' ? anchor.top - gap - h : anchor.bottom + gap : alignY;
  const x = Math.max(bounds.left + padding, Math.min(proposedX, bounds.right - padding - w));
  const y = Math.max(bounds.top + padding, Math.min(proposedY, bounds.bottom - padding - h));
  // Existing translated CSS anchors remain component-owned. Conversion itself is
  // common; it never inspects native control types or focus order.
  const fx = spec.translated && spec.translated !== 'vertical' ? vertical ? 0.5 : side === 'left' ? 1 : 0 : 0;
  const fy = spec.translated ? vertical ? side === 'top' ? 1 : 0 : 0.5 : 0;
  return { side, scrollable, style: {
    position: 'absolute', boxSizing: 'border-box', minWidth: 0, maxWidth: Math.min(availableWidth, cssMaxWidth), maxHeight: explanation && !scrollable ? 'none' : availableHeight, overflowY: explanation && !scrollable ? 'visible' : 'auto', pointerEvents: explanation && !scrollable ? 'none' : 'auto',
    [xProperty]: `${x + fx * w - geometry.x}px`, [yProperty]: `${y + fy * h - geometry.y}px`,
  } as CSSProperties };
}
