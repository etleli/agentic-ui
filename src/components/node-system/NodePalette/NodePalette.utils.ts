import type { NodePaletteDragPayload, NodePaletteDropRequest, NodePaletteDropTarget, NodePaletteTemplate } from '../NodeSystem.types';

export const NODE_PALETTE_DRAG_DATA_TYPE = 'application/x-agentic-ui-node-template';

export function getNodePaletteDragPayload(template: NodePaletteTemplate): NodePaletteDragPayload {
  return { templateId: template.id, type: NODE_PALETTE_DRAG_DATA_TYPE };
}

export function setNodePaletteDragData(dataTransfer: DataTransfer | null, payload: NodePaletteDragPayload) {
  if (!dataTransfer) {
    return;
  }

  dataTransfer.effectAllowed = 'copy';
  dataTransfer.setData(NODE_PALETTE_DRAG_DATA_TYPE, JSON.stringify(payload));
  dataTransfer.setData('text/plain', payload.templateId);
}

export function getNodePaletteDropRequest(
  event: Pick<DragEvent, 'clientX' | 'clientY' | 'dataTransfer'>,
  templates: NodePaletteTemplate[],
  target: NodePaletteDropTarget,
): NodePaletteDropRequest | undefined {
  const rawPayload = event.dataTransfer?.getData(NODE_PALETTE_DRAG_DATA_TYPE);

  if (!rawPayload) {
    return undefined;
  }

  let payload: NodePaletteDragPayload;

  try {
    payload = JSON.parse(rawPayload) as NodePaletteDragPayload;
  } catch {
    return undefined;
  }

  if (payload.type !== NODE_PALETTE_DRAG_DATA_TYPE) {
    return undefined;
  }

  const template = templates.find((candidate) => candidate.id === payload.templateId);

  if (!template || template.disabled || template.unavailableReason) {
    return undefined;
  }

  const zoom = Math.max(0.05, target.zoom ?? 1);
  const position = {
    x: Math.round((event.clientX - target.left + (target.scrollX ?? 0) - (target.offsetX ?? 0)) / zoom),
    y: Math.round((event.clientY - target.top + (target.scrollY ?? 0) - (target.offsetY ?? 0)) / zoom),
  };

  return {
    clientX: event.clientX,
    clientY: event.clientY,
    payload,
    position,
    source: 'pointer',
    template,
  };
}
