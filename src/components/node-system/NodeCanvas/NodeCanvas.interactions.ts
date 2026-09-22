import type {
  NodeCanvasAutoScrollOptions,
  NodeCanvasConnectionAnchor,
  NodeCanvasDragDelta,
  NodeCanvasInteractionOptions,
  NodeCanvasInteractionState,
  NodeCanvasPasteRequest,
  NodeCanvasPointer,
  NodeCanvasSelectableNode,
} from '../NodeSystem.types';
import { getNodeCanvasDraggedNodes, getNodeCanvasDragOrigins } from './NodeCanvas.utils';

function getLogicalPointerDelta(start: NodeCanvasPointer, current: NodeCanvasPointer): NodeCanvasDragDelta {
  const zoom = Math.max(0.05, current.zoom ?? start.zoom ?? 1);
  return {
    x: Math.round((current.x + (current.scrollX ?? 0) - start.x - (start.scrollX ?? 0)) / zoom),
    y: Math.round((current.y + (current.scrollY ?? 0) - start.y - (start.scrollY ?? 0)) / zoom),
  };
}

/** Returns optional edge-scroll velocity for a pointer moving near a canvas viewport edge. */
export function getNodeCanvasAutoScrollDelta(
  pointer: { x: number; y: number },
  viewport: { height: number; width: number },
  { edgeMargin = 36, maxSpeed = 24 }: NodeCanvasAutoScrollOptions = {},
): NodeCanvasDragDelta {
  const safeMargin = Math.max(1, edgeMargin);
  const safeMaxSpeed = Math.max(0, maxSpeed);
  const speed = (distance: number) => Math.round(Math.min(1, Math.max(0, distance / safeMargin)) * safeMaxSpeed);

  return {
    x: pointer.x < safeMargin ? -speed(safeMargin - pointer.x) : pointer.x > viewport.width - safeMargin ? speed(pointer.x - (viewport.width - safeMargin)) : 0,
    y: pointer.y < safeMargin ? -speed(safeMargin - pointer.y) : pointer.y > viewport.height - safeMargin ? speed(pointer.y - (viewport.height - safeMargin)) : 0,
  };
}

/**
 * A host-owned controller for generic graph-authoring mechanics. It never
 * interprets node types or compatibility rules: callers supply those decisions
 * through callbacks and apply the returned state to their own graph model.
 */
export function createNodeCanvasInteractionController<TNode extends NodeCanvasSelectableNode, TPayload = unknown>(
  options: NodeCanvasInteractionOptions<TNode, TPayload> = {},
) {
  let state: NodeCanvasInteractionState<TPayload> = { suppressClick: false };

  function setPointerCapture(pointerId: number | undefined) {
    options.onPointerCaptureChange?.(pointerId);
  }

  function setState(nextState: NodeCanvasInteractionState<TPayload>) {
    state = nextState;
    return state;
  }

  return {
    getState: () => state,
    beginConnection(source: NodeCanvasConnectionAnchor, { reconnectEdgeId }: { reconnectEdgeId?: string } = {}) {
      return setState({
        ...state,
        connection: {
          compatibleTargetIds: options.getCompatibleTargets?.(source) ?? [],
          reconnectEdgeId,
          source,
        },
      });
    },
    updateConnectionPointer(pointer: NodeCanvasPointer) {
      if (!state.connection) {
        return state;
      }

      return setState({ ...state, connection: { ...state.connection, pointer: { x: pointer.x, y: pointer.y } } });
    },
    completeConnection(target: NodeCanvasConnectionAnchor) {
      const connection = state.connection;

      if (!connection || options.canConnect?.(connection.source, target) === false) {
        return false;
      }

      if (connection.reconnectEdgeId) {
        options.onReconnect?.(connection.reconnectEdgeId, connection.source, target);
      } else {
        options.onConnect?.(connection.source, target);
      }

      setState({ ...state, connection: undefined });
      return true;
    },
    cancelConnection() {
      return setState({ ...state, connection: undefined });
    },
    beginNodeDrag(nodes: TNode[], selectedNodeIds: string[], draggedNodeId: string, pointer: NodeCanvasPointer) {
      const nodeOrigins = getNodeCanvasDragOrigins(nodes, selectedNodeIds, draggedNodeId);
      setPointerCapture(pointer.pointerId);
      return setState({ ...state, drag: { nodeOrigins, pointerId: pointer.pointerId, startPointer: pointer }, suppressClick: false });
    },
    moveNodeDrag(nodes: TNode[], pointer: NodeCanvasPointer) {
      const drag = state.drag;

      if (!drag || (drag.pointerId !== undefined && pointer.pointerId !== undefined && drag.pointerId !== pointer.pointerId)) {
        return nodes;
      }

      const delta = getLogicalPointerDelta(drag.startPointer, pointer);
      const movedNodes = getNodeCanvasDraggedNodes(nodes, drag.nodeOrigins, delta);
      setState({ ...state, suppressClick: state.suppressClick || delta.x !== 0 || delta.y !== 0 });
      options.onMoveNodes?.(movedNodes, delta);
      return movedNodes;
    },
    endNodeDrag() {
      setPointerCapture(undefined);
      return setState({ ...state, drag: undefined });
    },
    cancelNodeDrag() {
      setPointerCapture(undefined);
      return setState({ ...state, drag: undefined, suppressClick: false });
    },
    consumeClickSuppression() {
      const suppressClick = state.suppressClick;
      setState({ ...state, suppressClick: false });
      return suppressClick;
    },
    copy(payload: TPayload) {
      const clipboard = { payload };
      options.onCopy?.(clipboard);
      return setState({ ...state, clipboard });
    },
    paste(position: { x: number; y: number }, payload = state.clipboard?.payload): NodeCanvasPasteRequest<TPayload> | undefined {
      if (payload === undefined) {
        return undefined;
      }

      const request = { payload, position };
      options.onPaste?.(request);
      return request;
    },
    delete(nodeIds: string[]) {
      options.onDelete?.(nodeIds);
    },
  };
}
