import type { DragEvent, HTMLAttributes, PointerEvent, ReactNode, SVGAttributes } from 'react';
import type { BrandWatermarkPlacement } from '../surfaces/BrandWatermark';

export type NodeTone = 'neutral' | 'accent' | 'positive' | 'negative' | 'warning';

export type NodeCanvasMode = 'select' | 'connect' | 'pan';

export type NodeCanvasVariant = 'grid' | 'muted' | 'plain';

export type NodeDensity = 'compact' | 'comfortable' | 'spacious';

export type NodeFlowDirection = 'horizontal' | 'vertical';

export type NodeBodyOverflow = 'auto' | 'hidden' | 'visible';

export type NodePortDirection = 'input' | 'output';

export type NodePortSide = 'left' | 'right' | 'top' | 'bottom';

export type NodeEdgePath = 'smooth' | 'straight' | 'step';

export type NodeEdgeAnimation = 'flow' | 'pulse' | 'trace';

export type NodeToolbarTool = 'fit' | 'zoomIn' | 'zoomOut' | 'delete';

export type NodeMiniMapVariant = 'panel' | 'floating' | 'compact';

export type NodePortItem = {
  color?: string;
  connected?: boolean;
  direction: NodePortDirection;
  disabled?: boolean;
  id: string;
  label?: string;
  side: NodePortSide;
  tone?: NodeTone;
  type?: string;
};

export type NodeCanvasFitNode = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type NodeCanvasSelectableNode = NodeCanvasFitNode & {
  id: string;
};

export type NodeCanvasDragOrigin = {
  id: string;
  originX: number;
  originY: number;
};

export type NodeCanvasDragDelta = {
  x: number;
  y: number;
};

export type NodeCanvasFitViewport = {
  height: number;
  /** Current scroll offset of the canvas viewport. Included for a documented, apply-ready fit contract. */
  scrollX?: number;
  /** Current scroll offset of the canvas viewport. Included for a documented, apply-ready fit contract. */
  scrollY?: number;
  width: number;
};

export type NodeCanvasPoint = {
  x: number;
  y: number;
};

export type NodeCanvasOrigin = NodeCanvasPoint;

export type NodeCanvasEndlessOriginOptions = {
  originX?: number;
  originY?: number;
  padding?: number;
};

export type NodeCanvasBounds = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type NodeCanvasSelectionMode = 'contain' | 'intersect';

export type NodeCanvasSelectionRect = {
  currentX: number;
  currentY: number;
  startX: number;
  startY: number;
};

export type NodeCanvasSelectionBounds = NodeCanvasBounds;

export type NodeCanvasSelectionChangeDetails = {
  bounds: NodeCanvasSelectionBounds;
  event: PointerEvent<HTMLDivElement>;
  rect: NodeCanvasSelectionRect;
};

export type NodeCanvasPanOffset = {
  x: number;
  y: number;
};

export type NodeCanvasPanChangeDetails = NodeCanvasPanOffset & {
  event: PointerEvent<HTMLDivElement>;
};

export type NodeCanvasFitViewOptions = {
  maxZoom?: number;
  minZoom?: number;
  /** Endless-canvas render origin. When present, returned offsets apply directly to rendered node coordinates. */
  origin?: NodeCanvasOrigin;
  padding?: number;
};

export type NodeCanvasFitViewResult = {
  bounds: NodeCanvasBounds;
  offsetX: number;
  offsetY: number;
  /** Scroll target that must be applied with the returned transform. */
  scrollX: number;
  /** Scroll target that must be applied with the returned transform. */
  scrollY: number;
  zoom: number;
};

export type NodeCanvasPlaneSize = {
  height: number;
  width: number;
};

export type NodeCanvasExpandPlaneOptions = {
  minHeight?: number;
  minWidth?: number;
  padding?: number;
};

export type NodeCanvasExpandPlaneResult = NodeCanvasPlaneSize & {
  bounds: NodeCanvasBounds;
};

export type NodeCanvasZoomViewOptions = {
  currentOffsetX: number;
  currentOffsetY: number;
  currentZoom: number;
  delta: number;
  maxZoom?: number;
  minZoom?: number;
  pointerX: number;
  pointerY: number;
  scrollX?: number;
  scrollY?: number;
};

export type NodeCanvasZoomViewResult = {
  offsetX: number;
  offsetY: number;
  zoom: number;
};

export type NodeCanvasShortcutPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';

export type NodeCanvasShortcutItem = {
  action: ReactNode;
  id: string;
  shortcut: ReactNode;
};

export type NodeCanvasProps = HTMLAttributes<HTMLDivElement> & {
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  children?: ReactNode;
  defaultOffsetX?: number;
  defaultOffsetY?: number;
  editable?: boolean;
  flowDirection?: NodeFlowDirection;
  locked?: boolean;
  minHeight?: string;
  mode?: NodeCanvasMode;
  offsetX?: number;
  offsetY?: number;
  planeHeight?: number;
  planeWidth?: number;
  selectionLabel?: string;
  showGrid?: boolean;
  shortcuts?: NodeCanvasShortcutItem[];
  shortcutsLabel?: ReactNode;
  shortcutsPosition?: NodeCanvasShortcutPosition;
  variant?: NodeCanvasVariant;
  zoom?: number;
  pannable?: boolean;
  panButton?: 0 | 1 | 2;
  panDisabled?: boolean;
  panIgnoreSelector?: string;
  /** Prevents the browser's Ctrl + wheel behavior while the pointer is over this canvas. */
  preventCtrlWheel?: boolean;
  onCanvasBackgroundPointerDown?: (event: PointerEvent<HTMLDivElement>) => void;
  onCanvasSelectionCancel?: () => void;
  onCanvasSelectionEnd?: (nodeIds: string[], details: NodeCanvasSelectionChangeDetails) => void;
  onCanvasSelectionStart?: (details: { event: PointerEvent<HTMLDivElement>; rect: NodeCanvasSelectionRect }) => void;
  onPanChange?: (offset: NodeCanvasPanOffset, details: NodeCanvasPanChangeDetails) => void;
  onPanEnd?: (offset: NodeCanvasPanOffset, details: NodeCanvasPanChangeDetails) => void;
  onPanStart?: (offset: NodeCanvasPanOffset, details: NodeCanvasPanChangeDetails) => void;
  onSelectedNodeIdsChange?: (nodeIds: string[], details: NodeCanvasSelectionChangeDetails) => void;
  selectableNodes?: NodeCanvasSelectableNode[];
  selectionButton?: 0 | 1 | 2;
  selectionDisabled?: boolean;
  selectionIgnoreSelector?: string;
  selectionMinHeight?: number;
  selectionMinWidth?: number;
  selectionMode?: NodeCanvasSelectionMode;
};

export type NodeProps = HTMLAttributes<HTMLDivElement> & {
  bodyOverflow?: NodeBodyOverflow;
  children?: ReactNode;
  dataType?: string;
  density?: NodeDensity;
  disabled?: boolean;
  flowDirection?: NodeFlowDirection;
  height?: number | string;
  ports?: NodePortItem[];
  selected?: boolean;
  statusLabel?: string;
  subtitle?: ReactNode;
  title: ReactNode;
  tone?: NodeTone;
  typeColor?: string;
  width?: number | string;
  x?: number;
  y?: number;
  onPortPointerDown?: (event: PointerEvent<HTMLButtonElement>, port: NodePortItem) => void;
  onPortPointerMove?: (event: PointerEvent<HTMLButtonElement>, port: NodePortItem) => void;
  onPortPointerUp?: (event: PointerEvent<HTMLButtonElement>, port: NodePortItem) => void;
};

export type NodePortProps = HTMLAttributes<HTMLButtonElement> & {
  color?: string;
  connected?: boolean;
  count?: number;
  direction?: NodePortDirection;
  disabled?: boolean;
  index?: number;
  label?: string;
  side?: NodePortSide;
  tone?: NodeTone;
  type?: string;
};

export type NodeEdgeProps = Omit<SVGAttributes<SVGSVGElement>, 'path'> & {
  animationStyle?: NodeEdgeAnimation;
  animated?: boolean;
  canvasHeight?: number;
  canvasWidth?: number;
  connectionType?: string;
  fromX: number;
  fromY: number;
  label?: string;
  path?: NodeEdgePath;
  selected?: boolean;
  toX: number;
  toY: number;
  fromSide?: NodePortSide;
  toSide?: NodePortSide;
  tone?: NodeTone;
  typeColor?: string;
};

export type NodeToolbarProps = HTMLAttributes<HTMLDivElement> & {
  density?: NodeDensity;
  disabledTools?: NodeToolbarTool[];
  showLabels?: boolean;
  showSnapToggle?: boolean;
  snapToGrid?: boolean;
  onSnapToGridChange?: (snapToGrid: boolean) => void;
  onToolCommand?: (tool: NodeToolbarTool) => void;
};

export type NodeMiniMapNode = {
  dataType?: string;
  disabled?: boolean;
  height: number;
  id: string;
  label?: string;
  selected?: boolean;
  tone?: NodeTone;
  typeColor?: string;
  width: number;
  x: number;
  y: number;
};

export type NodeMiniMapEdge = {
  connectionType?: string;
  id: string;
  selected?: boolean;
  sourceNodeId: string;
  targetNodeId: string;
  tone?: NodeTone;
  typeColor?: string;
};

export type NodeMiniMapViewport = {
  height: number;
  width: number;
  x: number;
  y: number;
};

export type NodeMiniMapProjectionOptions = {
  /** Logical-space padding around graph content. */
  padding?: number;
};

export type NodeMiniMapProjection<TNode extends NodeMiniMapNode = NodeMiniMapNode> = {
  bounds: NodeCanvasBounds;
  canvasHeight: number;
  canvasWidth: number;
  nodes: TNode[];
  origin: NodeCanvasOrigin;
  padding: number;
  viewport?: NodeMiniMapViewport;
};

export type NodeCanvasConnectionAnchor = NodeCanvasPoint & {
  nodeId: string;
  portId: string;
};

export type NodeCanvasConnectionDrag = {
  compatibleTargetIds: string[];
  pointer?: NodeCanvasPoint;
  reconnectEdgeId?: string;
  source: NodeCanvasConnectionAnchor;
};

export type NodeCanvasPointer = NodeCanvasPoint & {
  pointerId?: number;
  scrollX?: number;
  scrollY?: number;
  zoom?: number;
};

export type NodeCanvasDragSession = {
  nodeOrigins: NodeCanvasDragOrigin[];
  pointerId?: number;
  startPointer: NodeCanvasPointer;
};

export type NodeCanvasClipboard<TPayload = unknown> = {
  payload: TPayload;
};

export type NodeCanvasPasteRequest<TPayload = unknown> = {
  payload: TPayload;
  position: NodeCanvasPoint;
};

export type NodeCanvasAutoScrollOptions = {
  edgeMargin?: number;
  maxSpeed?: number;
};

export type NodeCanvasInteractionState<TPayload = unknown> = {
  clipboard?: NodeCanvasClipboard<TPayload>;
  connection?: NodeCanvasConnectionDrag;
  drag?: NodeCanvasDragSession;
  suppressClick: boolean;
};

export type NodeCanvasInteractionOptions<TNode extends NodeCanvasSelectableNode, TPayload = unknown> = {
  canConnect?: (source: NodeCanvasConnectionAnchor, target: NodeCanvasConnectionAnchor) => boolean;
  getCompatibleTargets?: (source: NodeCanvasConnectionAnchor) => string[];
  onConnect?: (source: NodeCanvasConnectionAnchor, target: NodeCanvasConnectionAnchor) => void;
  onCopy?: (clipboard: NodeCanvasClipboard<TPayload>) => void;
  onDelete?: (nodeIds: string[]) => void;
  onMoveNodes?: (nodes: TNode[], delta: NodeCanvasDragDelta) => void;
  onPaste?: (request: NodeCanvasPasteRequest<TPayload>) => void;
  onPointerCaptureChange?: (pointerId: number | undefined) => void;
  onReconnect?: (edgeId: string, source: NodeCanvasConnectionAnchor, target: NodeCanvasConnectionAnchor) => void;
};

export type NodeMiniMapProps = HTMLAttributes<HTMLDivElement> & {
  canvasHeight?: number;
  canvasWidth?: number;
  density?: NodeDensity;
  edges?: NodeMiniMapEdge[];
  interactive?: boolean;
  nodes: NodeMiniMapNode[];
  selectedNodeId?: string;
  showEdges?: boolean;
  showLabels?: boolean;
  showViewport?: boolean;
  title?: ReactNode;
  variant?: NodeMiniMapVariant;
  viewport?: NodeMiniMapViewport;
  onNodeSelect?: (nodeId: string, node: NodeMiniMapNode) => void;
  onViewportMove?: (viewport: NodeMiniMapViewport) => void;
};

export type NodePaletteTemplate = {
  color?: string;
  dataType?: string;
  description?: string;
  disabled?: boolean;
  icon?: ReactNode;
  id: string;
  label: string;
  meta?: string;
  tone?: NodeTone;
  /** Explains why this template cannot currently be placed. */
  unavailableReason?: string;
};

export type NodePaletteDragPayload = {
  templateId: string;
  type: 'application/x-agentic-ui-node-template';
};

export type NodePalettePlacementRequest = {
  clientX?: number;
  clientY?: number;
  source: 'keyboard' | 'pointer';
  template: NodePaletteTemplate;
};

export type NodePaletteDropTarget = {
  left: number;
  offsetX?: number;
  offsetY?: number;
  scrollX?: number;
  scrollY?: number;
  top: number;
  zoom?: number;
};

export type NodePaletteDropRequest = NodePalettePlacementRequest & {
  payload: NodePaletteDragPayload;
  position: NodeCanvasPoint;
};

export type NodePaletteProps = HTMLAttributes<HTMLDivElement> & {
  defaultQuery?: string;
  defaultSelectedTemplateId?: string;
  emptyDescription?: string;
  emptyTitle?: string;
  query?: string;
  selectedTemplateId?: string;
  showSearch?: boolean;
  templates: NodePaletteTemplate[];
  onTemplateDragStart?: (payload: NodePaletteDragPayload, template: NodePaletteTemplate, event: DragEvent<HTMLElement>) => void;
  onTemplatePlacementRequest?: (request: NodePalettePlacementRequest) => void;
  onTemplateUnavailable?: (template: NodePaletteTemplate) => void;
  onQueryChange?: (query: string) => void;
  onSelectedTemplateChange?: (templateId: string, template: NodePaletteTemplate) => void;
};

export type NodeInspectorProperty = {
  description?: string;
  id: string;
  label: string;
  meta?: string;
  tone?: NodeTone;
  value: ReactNode;
};

export type NodeInspectorNode = {
  description?: string;
  id: string;
  status?: string;
  title: string;
  tone?: NodeTone;
};

export type NodeInspectorProps = HTMLAttributes<HTMLElement> & {
  configLabel?: string;
  configValue?: string;
  emptyDescription?: string;
  emptyTitle?: string;
  properties?: NodeInspectorProperty[];
  selectedNode?: NodeInspectorNode;
  showConfig?: boolean;
  onConfigChange?: (value: string) => void;
};
