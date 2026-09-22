import { Activity, Grid2X2, Maximize2, Radio, Shield, Terminal, Trash2, ZoomIn, ZoomOut } from 'lucide-react';
import type {
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  WheelEvent as ReactWheelEvent,
} from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { DeltaIndicator, StatusBadge } from '../feedback';
import { Button } from '../inputs/Button';
import type { BrandWatermarkPlacement } from '../surfaces/BrandWatermark';
import { Node } from './Node';
import { NodeCanvas, getNodeCanvasDraggedNodes, getNodeCanvasDragOrigins, getNodeCanvasFitView, getNodeCanvasZoomView } from './NodeCanvas';
import { NodeEdge } from './NodeEdge';
import { NodeInspector } from './NodeInspector';
import { NodeMiniMap } from './NodeMiniMap';
import { NodePalette } from './NodePalette';
import { NodePort } from './NodePort';
import { NodeToolbar } from './NodeToolbar';
import { getThemeGeneratedColorForKey } from '../../theme/categoricalColors';
import type {
  NodeCanvasDragOrigin,
  NodeCanvasShortcutItem,
  NodeCanvasVariant,
  NodeDensity,
  NodeEdgeAnimation,
  NodeEdgePath,
  NodeFlowDirection,
  NodeInspectorProperty,
  NodeMiniMapVariant,
  NodeMiniMapViewport,
  NodePaletteTemplate,
  NodePortDirection,
  NodePortItem,
  NodePortSide,
  NodeTone,
} from './NodeSystem.types';

export type NodeCanvasExampleProps = {
  edgeAnimation?: NodeEdgeAnimation;
  animatedEdges?: boolean;
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  density?: NodeDensity;
  editable?: boolean;
  flowDirection?: NodeFlowDirection;
  locked?: boolean;
  selectedNodeId?: string;
  showGrid?: boolean;
  showInspector?: boolean;
  showMiniMap?: boolean;
  showPalette?: boolean;
  showToolbar?: boolean;
  variant?: NodeCanvasVariant;
  zoom?: number;
};

export type NodeWorkspaceMockExampleProps = {
  edgeAnimation?: NodeEdgeAnimation;
  animatedEdges?: boolean;
  brandWatermark?: boolean;
  brandWatermarkPlacement?: BrandWatermarkPlacement;
  density?: NodeDensity;
  editable?: boolean;
  flowDirection?: NodeFlowDirection;
  locked?: boolean;
  showGrid?: boolean;
  showInspector?: boolean;
  showMiniMap?: boolean;
  showPalette?: boolean;
  showToolbar?: boolean;
  variant?: NodeCanvasVariant;
};

export type NodeExampleProps = {
  density?: NodeDensity;
  disabled?: boolean;
  selected?: boolean;
  showPorts?: boolean;
  statusLabel?: string;
  subtitle?: string;
  title?: string;
  tone?: NodeTone;
};

export type NodePortExampleProps = {
  connected?: boolean;
  direction?: NodePortDirection;
  disabled?: boolean;
  showLabel?: boolean;
  side?: NodePortSide;
  tone?: NodeTone;
};

export type NodeEdgeExampleProps = {
  animationStyle?: NodeEdgeAnimation;
  animated?: boolean;
  label?: string;
  path?: NodeEdgePath;
  selected?: boolean;
  tone?: NodeTone;
};

export type NodeToolbarExampleProps = {
  density?: NodeDensity;
  showLabels?: boolean;
  showSnapToggle?: boolean;
  snapToGrid?: boolean;
};

export type NodePaletteExampleProps = {
  query?: string;
  selectedTemplateId?: string;
  showSearch?: boolean;
};

export type NodeInspectorExampleProps = {
  selectedNodeId?: string;
  showConfig?: boolean;
};

export type NodeMiniMapExampleProps = {
  density?: NodeDensity;
  interactive?: boolean;
  selectedNodeId?: string;
  showEdges?: boolean;
  showLabels?: boolean;
  showViewport?: boolean;
  variant?: NodeMiniMapVariant;
};

type ExampleNodeModel = {
  description: string;
  height: number;
  id: string;
  inputType?: string;
  metrics: string;
  outputType?: string;
  ports: NodePortItem[];
  status: string;
  subtitle: string;
  title: string;
  tone: NodeTone;
  width: number;
  x: number;
  y: number;
};

type ExampleEdgeModel = {
  id: string;
  label: string;
  sourceNodeId: string;
  sourcePortId: string;
  targetNodeId: string;
  targetPortId: string;
  tone: NodeTone;
  type: string;
};

const canvasWidth = 860;
const canvasHeight = 540;
const verticalCanvasHeight = 640;
const canvasShortcutItems: NodeCanvasShortcutItem[] = [
  {
    action: 'Zoom',
    id: 'zoom',
    shortcut: (
      <>
        <kbd>Ctrl</kbd> + wheel
      </>
    ),
  },
  {
    action: 'Deselect',
    id: 'deselect',
    shortcut: 'Left click canvas',
  },
  {
    action: 'Select nodes',
    id: 'marquee',
    shortcut: 'Right drag canvas',
  },
  {
    action: 'Pan view',
    id: 'pan',
    shortcut: 'Drag canvas',
  },
];

type ExampleNodeTemplate = NodePaletteTemplate & {
  height: number;
  inputType?: string;
  metrics: string;
  outputType?: string;
  status: string;
  subtitle: string;
  width: number;
};

const nodeTemplateDefinitions: ExampleNodeTemplate[] = [
  {
    description: 'Subscribe to market ticks and quote updates.',
    height: 146,
    icon: <Radio size={16} aria-hidden="true" />,
    id: 'market-stream',
    metrics: '1.2k msg/s',
    label: 'Market Stream',
    meta: 'source',
    outputType: 'market',
    status: 'online',
    subtitle: 'Alpaca paper feed',
    tone: 'positive',
    width: 220,
  },
  {
    description: 'Run strategy rules against normalized data.',
    height: 146,
    icon: <Activity size={16} aria-hidden="true" />,
    id: 'strategy-engine',
    inputType: 'market',
    label: 'Strategy Engine',
    meta: 'logic',
    metrics: '94 score',
    outputType: 'signal',
    status: 'running',
    subtitle: 'Momentum v2',
    tone: 'accent',
    width: 230,
  },
  {
    description: 'Validate exposure, limits, and circuit breakers.',
    height: 146,
    icon: <Shield size={16} aria-hidden="true" />,
    id: 'risk-gate',
    inputType: 'signal',
    label: 'Risk Gate',
    meta: 'guard',
    metrics: '42% max',
    outputType: 'approval',
    status: 'guarded',
    subtitle: 'Exposure checks',
    tone: 'warning',
    width: 230,
  },
  {
    description: 'Submit routed orders after local checks pass.',
    height: 146,
    icon: <Terminal size={16} aria-hidden="true" />,
    id: 'order-router',
    inputType: 'approval',
    label: 'Order Router',
    meta: 'broker',
    metrics: 'paper',
    outputType: 'receipt',
    status: 'watch',
    subtitle: 'Paper broker',
    tone: 'neutral',
    width: 220,
  },
];

const nodeTemplates: NodePaletteTemplate[] = nodeTemplateDefinitions;

const canvasNodes: ExampleNodeModel[] = [
  {
    description: 'Streams normalized quotes into the strategy graph.',
    height: 146,
    id: 'market-stream',
    outputType: 'market',
    metrics: '1.2k msg/s',
    ports: [
      { connected: true, direction: 'output', id: 'ticks', label: 'Ticks', side: 'right', tone: 'positive', type: 'market' },
      { direction: 'output', id: 'quotes', label: 'Quotes', side: 'right', tone: 'positive', type: 'market' },
    ],
    status: 'online',
    subtitle: 'Alpaca paper feed',
    title: 'Market Stream',
    tone: 'positive',
    width: 220,
    x: 64,
    y: 174,
  },
  {
    description: 'Calculates signal strength and emits order intent candidates.',
    height: 146,
    id: 'strategy-engine',
    inputType: 'market',
    metrics: '94 score',
    outputType: 'signal',
    ports: [
      { connected: true, direction: 'input', id: 'input', label: 'Market data', side: 'left', tone: 'accent', type: 'market' },
      { connected: true, direction: 'output', id: 'signal', label: 'Signal', side: 'right', tone: 'accent', type: 'signal' },
    ],
    status: 'running',
    subtitle: 'Momentum v2',
    title: 'Strategy Engine',
    tone: 'accent',
    width: 230,
    x: 334,
    y: 104,
  },
  {
    description: 'Applies exposure limits before any execution path is allowed.',
    height: 146,
    id: 'risk-gate',
    inputType: 'signal',
    metrics: '42% max',
    outputType: 'approval',
    ports: [
      { connected: true, direction: 'input', id: 'intent', label: 'Intent', side: 'left', tone: 'warning', type: 'signal' },
      { connected: true, direction: 'output', id: 'approved', label: 'Approved', side: 'right', tone: 'warning', type: 'approval' },
    ],
    status: 'guarded',
    subtitle: 'Exposure checks',
    title: 'Risk Gate',
    tone: 'warning',
    width: 230,
    x: 334,
    y: 296,
  },
  {
    description: 'Routes approved orders and tracks broker acknowledgement.',
    height: 146,
    id: 'order-router',
    inputType: 'approval',
    metrics: 'paper',
    outputType: 'receipt',
    ports: [
      { connected: true, direction: 'input', id: 'approved', label: 'Approved', side: 'left', tone: 'neutral', type: 'approval' },
      { direction: 'output', id: 'receipt', label: 'Receipt', side: 'right', tone: 'neutral', type: 'receipt' },
    ],
    status: 'watch',
    subtitle: 'Paper broker',
    title: 'Order Router',
    tone: 'neutral',
    width: 220,
    x: 620,
    y: 202,
  },
];

const canvasEdges: ExampleEdgeModel[] = [
  {
    id: 'ticks-strategy',
    label: 'market',
    sourceNodeId: 'market-stream',
    sourcePortId: 'ticks',
    targetNodeId: 'strategy-engine',
    targetPortId: 'input',
    tone: 'positive',
    type: 'market',
  },
  {
    id: 'signal-risk',
    label: 'signal',
    sourceNodeId: 'strategy-engine',
    sourcePortId: 'signal',
    targetNodeId: 'risk-gate',
    targetPortId: 'intent',
    tone: 'accent',
    type: 'signal',
  },
  {
    id: 'risk-router',
    label: 'approval',
    sourceNodeId: 'risk-gate',
    sourcePortId: 'approved',
    targetNodeId: 'order-router',
    targetPortId: 'approved',
    tone: 'warning',
    type: 'approval',
  },
];

const nodeConfig = `name: strategy-engine
mode: simulate
limits:
  max_exposure: 42
  require_risk_gate: true`;

const verticalNodeLayout: Record<string, Pick<ExampleNodeModel, 'height' | 'width' | 'x' | 'y'>> = {
  'market-stream': { height: 136, width: 240, x: 310, y: 36 },
  'strategy-engine': { height: 136, width: 250, x: 305, y: 184 },
  'risk-gate': { height: 136, width: 250, x: 305, y: 332 },
  'order-router': { height: 136, width: 240, x: 310, y: 480 },
};

const mockHorizontalLayout: Array<Pick<ExampleNodeModel, 'x' | 'y'>> = [
  { x: 64, y: 174 },
  { x: 334, y: 104 },
  { x: 334, y: 296 },
  { x: 620, y: 202 },
];

const mockVerticalLayout: Array<Pick<ExampleNodeModel, 'x' | 'y'>> = [
  { x: 310, y: 36 },
  { x: 305, y: 184 },
  { x: 305, y: 332 },
  { x: 310, y: 480 },
];

type NodePortPoint = {
  side?: NodePortSide;
  x: number;
  y: number;
};

type NodeConnectionDragState = {
  historySnapshot?: NodeWorkspaceSnapshot;
  pointer: NodePortPoint;
  snapTarget?: {
    nodeId: string;
    point: NodePortPoint;
    port: NodePortItem;
  };
  sourceNodeId: string;
  sourcePoint: NodePortPoint;
  sourcePort: NodePortItem;
};

type NodeDragState = {
  historySnapshot: NodeWorkspaceSnapshot;
  id: string;
  nodeOrigins: NodeCanvasDragOrigin[];
  pointerX: number;
  pointerY: number;
};

type NodeWorkspaceSnapshot = {
  edges: ExampleEdgeModel[];
  nodes: ExampleNodeModel[];
  selectedEdgeId?: string;
  selectedNodeIds: string[];
  selectedTemplateId: string;
};

type NodeCanvasContextMenuState = {
  canAddNodes: boolean;
  connectionSource?: NodeConnectionDragState;
  connectionType?: string;
  planePoint: NodePortPoint;
  x: number;
  y: number;
};

type NodeCanvasViewportState = {
  height: number;
  scrollX: number;
  scrollY: number;
  width: number;
};

const gridSize = 32;
const nodeWorkspaceSelectionMinimumSize = 12;

function clampNumber(value: number, minValue: number, maxValue: number) {
  return Math.min(Math.max(value, minValue), maxValue);
}

function getNodeTypeColor(type: string | undefined) {
  if (!type) {
    return undefined;
  }

  return getThemeGeneratedColorForKey(type);
}

function getTypeTone(type: string | undefined): NodeTone {
  if (type === 'market') {
    return 'positive';
  }

  if (type === 'approval') {
    return 'warning';
  }

  if (type === 'receipt') {
    return 'neutral';
  }

  return 'accent';
}

function getFlowSide(flowDirection: NodeFlowDirection, portDirection: NodePortDirection): NodePortSide {
  if (flowDirection === 'vertical') {
    return portDirection === 'input' ? 'top' : 'bottom';
  }

  return portDirection === 'input' ? 'left' : 'right';
}

function getFlowPorts(ports: NodePortItem[], flowDirection: NodeFlowDirection) {
  return ports.map((port) => ({
    ...port,
    color: getNodeTypeColor(port.type),
    side: getFlowSide(flowDirection, port.direction),
    tone: getTypeTone(port.type),
  }));
}

function getCanvasNodes(flowDirection: NodeFlowDirection): ExampleNodeModel[] {
  return canvasNodes.map((node) => ({
    ...node,
    ...(flowDirection === 'vertical' ? verticalNodeLayout[node.id] : {}),
    ports: getFlowPorts(node.ports, flowDirection),
  }));
}

function getNodeTemplateDefinition(templateId: string) {
  return nodeTemplateDefinitions.find((template) => template.id === templateId) ?? nodeTemplateDefinitions[0];
}

function getMockNodePosition(index: number, flowDirection: NodeFlowDirection) {
  const presetPosition = flowDirection === 'vertical' ? mockVerticalLayout[index] : mockHorizontalLayout[index];

  if (presetPosition) {
    return presetPosition;
  }

  return flowDirection === 'vertical'
    ? { x: 300 + (index % 2) * 280, y: 42 + Math.floor(index / 2) * 166 }
    : { x: 72 + (index % 3) * 250, y: 72 + Math.floor(index / 3) * 170 };
}

function getPortPoint(node: ExampleNodeModel, portId: string): NodePortPoint {
  const port = node.ports.find((candidate) => candidate.id === portId) ?? node.ports[0];
  if (!port) {
    return { x: node.x + node.width / 2, y: node.y + node.height / 2 };
  }

  const sameSidePorts = node.ports.filter((candidate) => candidate.side === port.side);
  const portIndex = Math.max(
    0,
    sameSidePorts.findIndex((candidate) => candidate.id === port.id),
  );
  const sideOffset = (portIndex + 1) / (sameSidePorts.length + 1);

  if (port.side === 'left') {
    return { side: port.side, x: node.x, y: node.y + node.height * sideOffset };
  }

  if (port.side === 'right') {
    return { side: port.side, x: node.x + node.width, y: node.y + node.height * sideOffset };
  }

  if (port.side === 'top') {
    return { side: port.side, x: node.x + node.width * sideOffset, y: node.y };
  }

  return { side: port.side, x: node.x + node.width * sideOffset, y: node.y + node.height };
}

function getEdgePoints(edge: ExampleEdgeModel, nodes: ExampleNodeModel[]) {
  const sourceNode = nodes.find((node) => node.id === edge.sourceNodeId);
  const targetNode = nodes.find((node) => node.id === edge.targetNodeId);

  if (!sourceNode || !targetNode) {
    return undefined;
  }

  return {
    from: getPortPoint(sourceNode, edge.sourcePortId),
    to: getPortPoint(targetNode, edge.targetPortId),
  };
}

function getConnectedPortIds(edges: ExampleEdgeModel[]) {
  const connectedPortIds = new Set<string>();

  edges.forEach((edge) => {
    connectedPortIds.add(`${edge.sourceNodeId}:${edge.sourcePortId}`);
    connectedPortIds.add(`${edge.targetNodeId}:${edge.targetPortId}`);
  });

  return connectedPortIds;
}

function getNodePortsWithConnectionState(node: ExampleNodeModel, edges: ExampleEdgeModel[], flowDirection: NodeFlowDirection) {
  const connectedPortIds = getConnectedPortIds(edges);

  return getFlowPorts(node.ports, flowDirection).map((port) => ({
    ...port,
    connected: connectedPortIds.has(`${node.id}:${port.id}`),
  }));
}

function getNodeStatusBadgeStatus(status: string) {
  if (status === 'online') {
    return 'online' as const;
  }

  if (status === 'watch') {
    return 'watching' as const;
  }

  return 'watching' as const;
}

function renderNodeContent(node: ExampleNodeModel): ReactNode {
  return (
    <span className="node-system-example__node-rich">
      <span className="node-system-example__node-metrics">
        <StatusBadge label={node.status} showDot size="compact" status={getNodeStatusBadgeStatus(node.status)} variant="soft" />
        <DeltaIndicator precision={node.id === 'risk-gate' ? 0 : 1} size="compact" unit={node.id === 'risk-gate' ? '%' : ''} value={node.id === 'risk-gate' ? -8 : 3.4} />
      </span>
      <span>{node.description}</span>
    </span>
  );
}

function getNodeById(nodeId: string | undefined) {
  return canvasNodes.find((node) => node.id === nodeId) ?? canvasNodes[1];
}

function getInspectorProperties(node: ExampleNodeModel): NodeInspectorProperty[] {
  return [
    { id: 'status', label: 'Status', meta: 'Runtime', tone: node.tone, value: node.status },
    { id: 'metric', label: 'Metric', meta: 'Live', tone: node.tone, value: node.metrics },
    { id: 'ports', label: 'Ports', meta: 'Graph', value: String(node.ports.length) },
    { id: 'input-type', label: 'Input type', meta: 'Contract', tone: node.tone, value: node.inputType ?? 'none' },
    { id: 'output-type', label: 'Output type', meta: 'Contract', tone: node.tone, value: node.outputType ?? 'none' },
  ];
}

function createMockNode(templateId: string, index: number, flowDirection: NodeFlowDirection): ExampleNodeModel {
  const template = getNodeTemplateDefinition(templateId);
  const position = getMockNodePosition(index, flowDirection);

  return {
    description: template.description ?? '',
    height: template.height,
    id: `${template.id}-${index + 1}`,
    inputType: template.inputType,
    metrics: template.metrics,
    outputType: template.outputType,
    ports: [
      ...(template.inputType
        ? [
            {
              color: getNodeTypeColor(template.inputType),
              direction: 'input' as const,
              id: 'input',
              label: `${template.inputType} input`,
              side: getFlowSide(flowDirection, 'input'),
              tone: getTypeTone(template.inputType),
              type: template.inputType,
            },
          ]
        : []),
      ...(template.outputType
        ? [
            {
              color: getNodeTypeColor(template.outputType),
              direction: 'output' as const,
              id: 'output',
              label: `${template.outputType} output`,
              side: getFlowSide(flowDirection, 'output'),
              tone: getTypeTone(template.outputType),
              type: template.outputType,
            },
          ]
        : []),
    ],
    status: template.status,
    subtitle: template.subtitle,
    title: template.label,
    tone: template.tone ?? 'neutral',
    width: template.width,
    x: position.x,
    y: position.y,
  };
}

function getInitialMockNodes(flowDirection: NodeFlowDirection) {
  return ['market-stream', 'strategy-engine', 'risk-gate', 'order-router'].map((templateId, index) => createMockNode(templateId, index, flowDirection));
}

function getInitialMockEdges(): ExampleEdgeModel[] {
  return [
    {
      id: 'mock-market-strategy',
      label: 'market',
      sourceNodeId: 'market-stream-1',
      sourcePortId: 'output',
      targetNodeId: 'strategy-engine-2',
      targetPortId: 'input',
      tone: 'positive',
      type: 'market',
    },
    {
      id: 'mock-strategy-risk',
      label: 'signal',
      sourceNodeId: 'strategy-engine-2',
      sourcePortId: 'output',
      targetNodeId: 'risk-gate-3',
      targetPortId: 'input',
      tone: 'accent',
      type: 'signal',
    },
    {
      id: 'mock-risk-order',
      label: 'approval',
      sourceNodeId: 'risk-gate-3',
      sourcePortId: 'output',
      targetNodeId: 'order-router-4',
      targetPortId: 'input',
      tone: 'warning',
      type: 'approval',
    },
  ];
}

function getTypedConnectionFromPorts(firstNode: ExampleNodeModel, firstPort: NodePortItem, secondNode: ExampleNodeModel, secondPort: NodePortItem): ExampleEdgeModel | undefined {
  if (firstNode.id === secondNode.id || !firstPort.type || firstPort.type !== secondPort.type || firstPort.direction === secondPort.direction) {
    return undefined;
  }

  const sourceNode = firstPort.direction === 'output' ? firstNode : secondNode;
  const sourcePort = firstPort.direction === 'output' ? firstPort : secondPort;
  const targetNode = firstPort.direction === 'input' ? firstNode : secondNode;
  const targetPort = firstPort.direction === 'input' ? firstPort : secondPort;
  const connectionType = sourcePort.type;

  if (!connectionType || targetPort.type !== connectionType) {
    return undefined;
  }

  return {
    id: `mock-${sourceNode.id}-${targetNode.id}-${sourcePort.id}-${targetPort.id}-${connectionType}`,
    label: connectionType,
    sourceNodeId: sourceNode.id,
    sourcePortId: sourcePort.id,
    targetNodeId: targetNode.id,
    targetPortId: targetPort.id,
    tone: getTypeTone(connectionType),
    type: connectionType,
  };
}

function updateMockNodeFlow(nodes: ExampleNodeModel[], flowDirection: NodeFlowDirection) {
  return nodes.map((node, index) => ({
    ...node,
    ports: getFlowPorts(node.ports, flowDirection),
    ...getMockNodePosition(index, flowDirection),
  }));
}

function getNodeIdSet(selectedNodeIds: string | string[] | undefined) {
  return new Set(Array.isArray(selectedNodeIds) ? selectedNodeIds : selectedNodeIds ? [selectedNodeIds] : []);
}

function getMiniMapNodes(nodes: ExampleNodeModel[], selectedNodeIds: string | string[] | undefined) {
  const selectedNodeIdSet = getNodeIdSet(selectedNodeIds);

  return nodes.map((node) => ({
    dataType: node.outputType ?? node.inputType,
    height: node.height,
    id: node.id,
    label: node.title,
    selected: selectedNodeIdSet.has(node.id),
    tone: node.tone,
    width: node.width,
    x: node.x,
    y: node.y,
  }));
}

function getMiniMapEdges(edges: ExampleEdgeModel[], selectedNodeIds: string | string[] | undefined, selectedEdgeId?: string) {
  const selectedNodeIdSet = getNodeIdSet(selectedNodeIds);

  return edges.map((edge) => ({
    connectionType: edge.type,
    id: edge.id,
    selected: edge.id === selectedEdgeId || selectedNodeIdSet.has(edge.sourceNodeId) || selectedNodeIdSet.has(edge.targetNodeId),
    sourceNodeId: edge.sourceNodeId,
    targetNodeId: edge.targetNodeId,
    tone: edge.tone,
    typeColor: getNodeTypeColor(edge.type),
  }));
}

function getCanvasViewport(
  canvasOffset: { x: number; y: number },
  zoom: number,
  viewportState: NodeCanvasViewportState,
): NodeMiniMapViewport {
  const viewportWidth = Math.max(80, viewportState.width / zoom);
  const viewportHeight = Math.max(80, viewportState.height / zoom);

  return {
    height: viewportHeight,
    width: viewportWidth,
    x: (viewportState.scrollX - canvasOffset.x) / zoom,
    y: (viewportState.scrollY - canvasOffset.y) / zoom,
  };
}

function getCanvasOffsetFromViewport(viewport: NodeMiniMapViewport, zoom: number, viewportState: NodeCanvasViewportState) {
  return {
    x: Math.round(viewportState.scrollX - viewport.x * zoom),
    y: Math.round(viewportState.scrollY - viewport.y * zoom),
  };
}

function getViewportCenteredOnNode(node: ExampleNodeModel, viewport: NodeMiniMapViewport): NodeMiniMapViewport {
  return {
    ...viewport,
    x: node.x + node.width / 2 - viewport.width / 2,
    y: node.y + node.height / 2 - viewport.height / 2,
  };
}

export function NodeCanvasExample({
  animatedEdges = true,
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  density = 'comfortable',
  edgeAnimation = 'flow',
  editable = true,
  flowDirection = 'horizontal',
  locked = false,
  selectedNodeId = 'strategy-engine',
  showGrid = true,
  showInspector = true,
  showMiniMap = true,
  showPalette = true,
  showToolbar = true,
  variant = 'grid',
  zoom = 0.9,
}: NodeCanvasExampleProps) {
  const canvasShellRef = useRef<HTMLDivElement>(null);
  const canvasViewRef = useRef({ offset: { x: 12, y: 4 }, zoom });
  const [currentZoom, setCurrentZoom] = useState(zoom);
  const [currentSelectedNodeId, setCurrentSelectedNodeId] = useState(selectedNodeId);
  const [previewCanvasOffset, setPreviewCanvasOffset] = useState({ x: 12, y: 4 });
  const [previewViewportState, setPreviewViewportState] = useState<NodeCanvasViewportState>({ height: 360, scrollX: 0, scrollY: 0, width: 560 });
  const previewNodes = useMemo(() => getCanvasNodes(flowDirection), [flowDirection]);
  const selectedNode = previewNodes.find((node) => node.id === currentSelectedNodeId) ?? previewNodes[1];
  const planeHeight = flowDirection === 'vertical' ? verticalCanvasHeight : canvasHeight;
  const previewViewport = getCanvasViewport(previewCanvasOffset, currentZoom, previewViewportState);

  useEffect(() => {
    setCurrentZoom(zoom);
  }, [zoom]);

  useEffect(() => {
    canvasViewRef.current = { offset: previewCanvasOffset, zoom: currentZoom };
  }, [currentZoom, previewCanvasOffset]);

  useEffect(() => {
    const viewport = canvasShellRef.current?.querySelector('.node-system-canvas__viewport');

    if (!(viewport instanceof HTMLElement) || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateViewportState = () => {
      const rect = viewport.getBoundingClientRect();

      setPreviewViewportState({
        height: Math.max(1, Math.round(rect.height)),
        scrollX: Math.round(viewport.scrollLeft),
        scrollY: Math.round(viewport.scrollTop),
        width: Math.max(1, Math.round(rect.width)),
      });
    };

    updateViewportState();
    const observer = new ResizeObserver(updateViewportState);

    observer.observe(viewport);
    viewport.addEventListener('scroll', updateViewportState, { passive: true });

    return () => {
      observer.disconnect();
      viewport.removeEventListener('scroll', updateViewportState);
    };
  }, []);

  useEffect(() => {
    setCurrentSelectedNodeId(getNodeById(selectedNodeId).id);
  }, [selectedNodeId]);

  function handleCanvasToolbarCommand(command: 'delete' | 'fit' | 'zoomIn' | 'zoomOut') {
    if (command === 'zoomIn') {
      const nextZoom = clampNumber(Number((canvasViewRef.current.zoom + 0.1).toFixed(2)), 0.55, 1.45);

      canvasViewRef.current = { ...canvasViewRef.current, zoom: nextZoom };
      setCurrentZoom(nextZoom);
      return;
    }

    if (command === 'zoomOut') {
      const nextZoom = clampNumber(Number((canvasViewRef.current.zoom - 0.1).toFixed(2)), 0.55, 1.45);

      canvasViewRef.current = { ...canvasViewRef.current, zoom: nextZoom };
      setCurrentZoom(nextZoom);
      return;
    }

    if (command === 'fit') {
      const nextOffset = { x: 12, y: 4 };

      canvasViewRef.current = { offset: nextOffset, zoom: 0.9 };
      setCurrentZoom(0.9);
      setPreviewCanvasOffset(nextOffset);
    }
  }

  function handleCanvasWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const viewport = canvasShellRef.current?.querySelector('.node-system-canvas__viewport');
    const viewportRect = viewport?.getBoundingClientRect();

    if (!(viewport instanceof HTMLElement) || !viewportRect) {
      return;
    }

    const currentView = canvasViewRef.current;
    const zoomView = getNodeCanvasZoomView({
      currentOffsetX: currentView.offset.x,
      currentOffsetY: currentView.offset.y,
      currentZoom: currentView.zoom,
      delta: event.deltaY > 0 ? -0.08 : 0.08,
      maxZoom: 1.45,
      minZoom: 0.55,
      pointerX: event.clientX - viewportRect.left,
      pointerY: event.clientY - viewportRect.top,
      scrollX: viewport.scrollLeft,
      scrollY: viewport.scrollTop,
    });
    const nextOffset = { x: zoomView.offsetX, y: zoomView.offsetY };

    canvasViewRef.current = { offset: nextOffset, zoom: zoomView.zoom };
    setPreviewCanvasOffset(nextOffset);
    setCurrentZoom(zoomView.zoom);
  }

  function handlePreviewCanvasPanChange(offset: { x: number; y: number }) {
    canvasViewRef.current = { ...canvasViewRef.current, offset };
    setPreviewCanvasOffset(offset);
  }

  function movePreviewViewport(viewport: NodeMiniMapViewport) {
    const nextOffset = getCanvasOffsetFromViewport(viewport, currentZoom, previewViewportState);

    canvasViewRef.current = { ...canvasViewRef.current, offset: nextOffset };
    setPreviewCanvasOffset(nextOffset);
  }

  return (
    <div
      className="node-system-example"
      data-has-inspector={showInspector ? 'true' : 'false'}
      data-has-palette={showPalette ? 'true' : 'false'}
    >
      {showPalette ? (
        <NodePalette
          selectedTemplateId={selectedNode.id}
          showSearch
          templates={nodeTemplates}
          onSelectedTemplateChange={(templateId) => setCurrentSelectedNodeId(templateId)}
        />
      ) : null}

      <div className="node-system-example__main">
        {showToolbar ? <NodeToolbar density={density} disabledTools={['delete']} showLabels={false} onToolCommand={handleCanvasToolbarCommand} /> : null}

        <div className="node-system-example__canvas-shell" ref={canvasShellRef}>
          <NodeCanvas
            brandWatermark={brandWatermark}
            brandWatermarkPlacement={brandWatermarkPlacement}
            mode="select"
            editable={editable && !locked}
            flowDirection={flowDirection}
            locked={locked}
            offsetX={previewCanvasOffset.x}
            offsetY={previewCanvasOffset.y}
            pannable
            planeHeight={planeHeight}
            planeWidth={canvasWidth}
            preventCtrlWheel
            selectionLabel={`${locked ? 'Locked view' : editable ? 'Selected' : 'Topology view'}: ${selectedNode.title}`}
            showGrid={showGrid}
            variant={variant}
            zoom={currentZoom}
            onPanChange={handlePreviewCanvasPanChange}
            onWheel={handleCanvasWheel}
          >
            {canvasEdges.map((edge) => {
              const edgePoints = getEdgePoints(edge, previewNodes);

              if (!edgePoints) {
                return null;
              }

              return (
                <NodeEdge
                  animated={animatedEdges}
                  animationStyle={edgeAnimation}
                  canvasHeight={planeHeight}
                  canvasWidth={canvasWidth}
                  connectionType={edge.type}
                  fromSide={edgePoints.from.side}
                  fromX={edgePoints.from.x}
                  fromY={edgePoints.from.y}
                  key={edge.id}
                  label={edge.label}
                  selected={edge.targetNodeId === selectedNode.id}
                  toSide={edgePoints.to.side}
                  toX={edgePoints.to.x}
                  toY={edgePoints.to.y}
                  tone={edge.tone}
                  typeColor={getNodeTypeColor(edge.type)}
                />
              );
            })}

            {previewNodes.map((node) => (
              <Node
                data-node-id={node.id}
                density={density}
                flowDirection={flowDirection}
                height={node.height}
                key={node.id}
                ports={node.ports}
                selected={node.id === selectedNode.id}
                statusLabel={node.status}
                subtitle={node.subtitle}
                title={node.title}
                tone={node.tone}
                width={node.width}
                x={node.x}
                y={node.y}
                onClick={locked ? undefined : () => setCurrentSelectedNodeId(node.id)}
              >
                {renderNodeContent(node)}
              </Node>
            ))}
          </NodeCanvas>

          {showMiniMap ? (
            <NodeMiniMap
              canvasHeight={planeHeight}
              canvasWidth={canvasWidth}
              edges={getMiniMapEdges(canvasEdges, selectedNode.id)}
              nodes={getMiniMapNodes(previewNodes, selectedNode.id)}
              selectedNodeId={selectedNode.id}
              showLabels={false}
              showViewport
              variant="floating"
              viewport={previewViewport}
              onNodeSelect={(nodeId) => setCurrentSelectedNodeId(nodeId)}
              onViewportMove={movePreviewViewport}
            />
          ) : null}
        </div>
      </div>

      {showInspector ? (
        <NodeInspector
          configValue={nodeConfig}
          properties={getInspectorProperties(selectedNode)}
          selectedNode={{
            description: selectedNode.description,
            id: selectedNode.id,
            status: selectedNode.status,
            title: selectedNode.title,
            tone: selectedNode.tone,
          }}
        />
      ) : null}
    </div>
  );
}

export function NodeWorkspaceMockExample({
  animatedEdges = true,
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  density = 'comfortable',
  edgeAnimation = 'flow',
  editable = true,
  flowDirection = 'horizontal',
  locked = false,
  showGrid = true,
  showInspector = true,
  showMiniMap = true,
  showPalette = true,
  showToolbar = true,
  variant = 'grid',
}: NodeWorkspaceMockExampleProps) {
  const canvasShellRef = useRef<HTMLDivElement>(null);
  const connectionDragRef = useRef<NodeConnectionDragState | undefined>(undefined);
  const dragStateRef = useRef<NodeDragState | undefined>(undefined);
  const historyPauseRef = useRef(false);
  const suppressClickRef = useRef(false);
  const nextNodeIndexRef = useRef(4);
  const redoStackRef = useRef<NodeWorkspaceSnapshot[]>([]);
  const zoomTransitionTimeoutRef = useRef<number | undefined>(undefined);
  const undoStackRef = useRef<NodeWorkspaceSnapshot[]>([]);
  const workspaceRef = useRef<HTMLDivElement>(null);
  const canvasViewRef = useRef({ offset: { x: 0, y: 0 }, zoom: 0.9 });
  const [canvasOffset, setCanvasOffset] = useState({ x: 0, y: 0 });
  const [contextMenu, setContextMenu] = useState<NodeCanvasContextMenuState | undefined>();
  const [connectionDrag, setConnectionDragState] = useState<NodeConnectionDragState | undefined>();
  const [draggedNodeId, setDraggedNodeId] = useState<string | undefined>();
  const [edges, setEdges] = useState<ExampleEdgeModel[]>(() => getInitialMockEdges());
  const [isPanning, setIsPanning] = useState(false);
  const [nodes, setNodes] = useState<ExampleNodeModel[]>(() => getInitialMockNodes(flowDirection));
  const [selectedEdgeId, setSelectedEdgeId] = useState<string | undefined>();
  const [selectedNodeIds, setSelectedNodeIds] = useState<string[]>(['strategy-engine-2']);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState('strategy-engine');
  const [statusMessage, setStatusMessage] = useState('Drag nodes, connect ports, pan empty canvas, or use Ctrl + wheel to zoom at the pointer.');
  const [viewportState, setViewportState] = useState<NodeCanvasViewportState>({ height: 360, scrollX: 0, scrollY: 0, width: 560 });
  const [zoom, setZoom] = useState(0.9);
  const planeHeight =
    flowDirection === 'vertical' ? Math.max(verticalCanvasHeight, 220 + Math.ceil(nodes.length / 2) * 166) : Math.max(canvasHeight, 220 + Math.ceil(nodes.length / 3) * 170);
  const planeWidth = flowDirection === 'vertical' ? Math.max(canvasWidth, 660 + Math.min(nodes.length, 2) * 120) : Math.max(canvasWidth, 120 + Math.min(nodes.length, 3) * 250);
  const miniMapViewport = getCanvasViewport(canvasOffset, zoom, viewportState);
  const nodesWithConnections = useMemo(
    () =>
      nodes.map((node) => ({
        ...node,
        ports: getNodePortsWithConnectionState(node, edges, flowDirection),
      })),
    [edges, flowDirection, nodes],
  );
  const selectedNodeId = selectedNodeIds[0];
  const selectedNodeIdSet = useMemo(() => new Set(selectedNodeIds), [selectedNodeIds]);
  const selectedNode = nodesWithConnections.find((node) => node.id === selectedNodeId);

  useEffect(() => {
    canvasViewRef.current = { offset: canvasOffset, zoom };
  }, [canvasOffset, zoom]);

  useEffect(() => {
    setNodes((currentNodes) => updateMockNodeFlow(currentNodes, flowDirection));
    updateConnectionDrag(undefined);
    dragStateRef.current = undefined;
    const nextOffset = { x: 0, y: 0 };

    canvasViewRef.current = { ...canvasViewRef.current, offset: nextOffset };
    setCanvasOffset(nextOffset);
    setDraggedNodeId(undefined);
    setIsPanning(false);
  }, [flowDirection]);

  useEffect(() => {
    if (locked) {
      updateConnectionDrag(undefined);
      dragStateRef.current = undefined;
      setDraggedNodeId(undefined);
      setIsPanning(false);
      setStatusMessage('Locked workflow view: selection, panning, and zoom stay available; editing is disabled.');
    }
  }, [locked]);

  useEffect(() => {
    if (!editable) {
      updateConnectionDrag(undefined);
      setStatusMessage('Topology editing is disabled; panning, zoom, selection, and node movement stay available.');
    }
  }, [editable]);

  useEffect(() => {
    const viewport = canvasShellRef.current?.querySelector('.node-system-canvas__viewport');

    if (!(viewport instanceof HTMLElement) || typeof ResizeObserver === 'undefined') {
      return;
    }

    const updateViewportState = () => {
      const rect = viewport.getBoundingClientRect();
      const nextViewportState = {
        height: Math.max(1, Math.round(rect.height)),
        scrollX: Math.round(viewport.scrollLeft),
        scrollY: Math.round(viewport.scrollTop),
        width: Math.max(1, Math.round(rect.width)),
      };

      setViewportState((currentViewportState) =>
        currentViewportState.height === nextViewportState.height &&
        currentViewportState.scrollX === nextViewportState.scrollX &&
        currentViewportState.scrollY === nextViewportState.scrollY &&
        currentViewportState.width === nextViewportState.width
          ? currentViewportState
          : nextViewportState,
      );
    };

    updateViewportState();
    const observer = new ResizeObserver(updateViewportState);
    observer.observe(viewport);
    viewport.addEventListener('scroll', updateViewportState, { passive: true });

    return () => {
      observer.disconnect();
      viewport.removeEventListener('scroll', updateViewportState);
    };
  }, []);

  function updateConnectionDrag(nextDrag: NodeConnectionDragState | undefined) {
    connectionDragRef.current = nextDrag;
    setConnectionDragState(nextDrag);
  }

  function cloneNodesForSnapshot(sourceNodes: ExampleNodeModel[]) {
    return sourceNodes.map((node) => ({
      ...node,
      ports: node.ports.map((port) => ({ ...port })),
    }));
  }

  function createWorkspaceSnapshot(): NodeWorkspaceSnapshot {
    return {
      edges: edges.map((edge) => ({ ...edge })),
      nodes: cloneNodesForSnapshot(nodes),
      selectedEdgeId,
      selectedNodeIds: [...selectedNodeIds],
      selectedTemplateId,
    };
  }

  function restoreWorkspaceSnapshot(snapshot: NodeWorkspaceSnapshot) {
    historyPauseRef.current = true;
    setEdges(snapshot.edges.map((edge) => ({ ...edge })));
    setNodes(cloneNodesForSnapshot(snapshot.nodes));
    setSelectedEdgeId(snapshot.selectedEdgeId);
    setSelectedNodeIds([...snapshot.selectedNodeIds]);
    setSelectedTemplateId(snapshot.selectedTemplateId);
    updateConnectionDrag(undefined);
    setContextMenu(undefined);
    window.requestAnimationFrame(() => {
      historyPauseRef.current = false;
    });
  }

  function pushUndoSnapshot(snapshot = createWorkspaceSnapshot()) {
    if (historyPauseRef.current) {
      return;
    }

    undoStackRef.current = [...undoStackRef.current.slice(-39), snapshot];
    redoStackRef.current = [];
  }

  function undoWorkspaceChange() {
    const previousSnapshot = undoStackRef.current.pop();

    if (!previousSnapshot) {
      setStatusMessage('Nothing to undo.');
      return;
    }

    redoStackRef.current = [...redoStackRef.current.slice(-39), createWorkspaceSnapshot()];
    restoreWorkspaceSnapshot(previousSnapshot);
    setStatusMessage('Undid workspace change.');
  }

  function redoWorkspaceChange() {
    const nextSnapshot = redoStackRef.current.pop();

    if (!nextSnapshot) {
      setStatusMessage('Nothing to redo.');
      return;
    }

    undoStackRef.current = [...undoStackRef.current.slice(-39), createWorkspaceSnapshot()];
    restoreWorkspaceSnapshot(nextSnapshot);
    setStatusMessage('Redid workspace change.');
  }

  function addNodeFromTemplate(templateId: string, position?: NodePortPoint, connectionSource?: NodeConnectionDragState) {
    setSelectedTemplateId(templateId);

    if (locked || !editable) {
      setStatusMessage(locked ? 'Locked workflow view: unlock before adding nodes.' : 'Topology editing is disabled.');
      return;
    }

    if (!connectionSource?.historySnapshot) {
      pushUndoSnapshot();
    }
    const nextIndex = nextNodeIndexRef.current;
    nextNodeIndexRef.current += 1;

    const nextNode = createMockNode(templateId, nextIndex, flowDirection);
    const positionedNode = position
      ? {
          ...nextNode,
          x: Math.max(24, snapToGrid ? snapCoordinate(position.x - nextNode.width / 2) : Math.round(position.x - nextNode.width / 2)),
          y: Math.max(24, snapToGrid ? snapCoordinate(position.y - nextNode.height / 2) : Math.round(position.y - nextNode.height / 2)),
        }
      : nextNode;
    let nextEdge: ExampleEdgeModel | undefined;

    if (connectionSource) {
      const sourceNode = nodesWithConnections.find((node) => node.id === connectionSource.sourceNodeId);
      const targetPort = positionedNode.ports.find((port) => port.direction === 'input' && port.type === connectionSource.sourcePort.type);

      if (sourceNode && targetPort) {
        nextEdge = getTypedConnectionFromPorts(sourceNode, connectionSource.sourcePort, positionedNode, targetPort);
      }
    }

    setNodes((currentNodes) => [...currentNodes, positionedNode]);

    if (nextEdge) {
      setEdges((currentEdges) => [...currentEdges, nextEdge]);
      setSelectedEdgeId(nextEdge.id);
      setStatusMessage(`Added ${positionedNode.title} and connected ${nextEdge.type}.`);
    } else {
      setSelectedEdgeId(undefined);
      setStatusMessage(`Added ${positionedNode.title}.`);
    }

    setSelectedNodeIds([positionedNode.id]);
    updateConnectionDrag(undefined);
    setContextMenu(undefined);
    window.requestAnimationFrame(() => workspaceRef.current?.focus());
  }

  function deleteSelectedNode() {
    const selectedNodeIdSetForDelete = new Set(selectedNodeIds);

    if (locked || !editable || selectedNodeIdSetForDelete.size === 0) {
      setStatusMessage(locked ? 'Locked workflow view: unlock before deleting nodes.' : !editable ? 'Topology editing is disabled.' : 'Select a node before deleting.');
      return;
    }

    const nextNodes = nodes.filter((node) => !selectedNodeIdSetForDelete.has(node.id));
    const nextSelectedNodeId = nextNodes[0]?.id;
    const deletedCount = nodes.length - nextNodes.length;

    pushUndoSnapshot();
    setNodes(nextNodes);
    setEdges((currentEdges) => currentEdges.filter((edge) => !selectedNodeIdSetForDelete.has(edge.sourceNodeId) && !selectedNodeIdSetForDelete.has(edge.targetNodeId)));
    setSelectedEdgeId(undefined);
    setSelectedNodeIds(nextSelectedNodeId ? [nextSelectedNodeId] : []);
    setStatusMessage(nextSelectedNodeId ? `Deleted ${deletedCount} node${deletedCount === 1 ? '' : 's'}. Selected ${nextNodes[0].title}.` : 'Deleted the final node.');
  }

  function deleteSelectedEdge() {
    if (locked || !editable || !selectedEdgeId) {
      setStatusMessage(locked ? 'Locked workflow view: unlock before deleting connections.' : !editable ? 'Topology editing is disabled.' : 'Select a connection before deleting.');
      return false;
    }

    const selectedEdge = edges.find((edge) => edge.id === selectedEdgeId);

    if (!selectedEdge) {
      setSelectedEdgeId(undefined);
      return false;
    }

    pushUndoSnapshot();
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== selectedEdge.id));
    setSelectedEdgeId(undefined);
    setStatusMessage(`Deleted ${selectedEdge.type} connection.`);
    return true;
  }

  function deleteSelectedWorkspaceItem() {
    if (selectedEdgeId && deleteSelectedEdge()) {
      return;
    }

    deleteSelectedNode();
  }

  function getViewportElement() {
    const viewport = canvasShellRef.current?.querySelector('.node-system-canvas__viewport');
    return viewport instanceof HTMLElement ? viewport : undefined;
  }

  function getPlanePointFromClient(clientX: number, clientY: number): NodePortPoint {
    const viewport = getViewportElement();
    const viewportRect = viewport?.getBoundingClientRect();

    if (!viewport || !viewportRect) {
      return { x: 0, y: 0 };
    }

    return {
      x: (clientX - viewportRect.left + viewport.scrollLeft - canvasOffset.x) / zoom,
      y: (clientY - viewportRect.top + viewport.scrollTop - canvasOffset.y) / zoom,
    };
  }

  function snapCoordinate(value: number) {
    return Math.round(value / gridSize) * gridSize;
  }

  function getNodeDragPosition(position: { x: number; y: number }) {
    return snapToGrid
      ? {
          x: snapCoordinate(position.x),
          y: snapCoordinate(position.y),
        }
      : {
          x: Math.round(position.x),
          y: Math.round(position.y),
        };
  }

  function getCompatibleSnapTarget(pointer: NodePortPoint, sourceNodeId: string, sourcePort: NodePortItem) {
    let nearestTarget: NodeConnectionDragState['snapTarget'];
    let nearestDistance = Number.POSITIVE_INFINITY;
    const snapDistance = Math.max(30, 44 / zoom);

    nodesWithConnections.forEach((node) => {
      if (node.id === sourceNodeId) {
        return;
      }

      node.ports.forEach((port) => {
        if (port.disabled || port.direction === sourcePort.direction || port.type !== sourcePort.type) {
          return;
        }

        const point = getPortPoint(node, port.id);
        const distance = Math.hypot(point.x - pointer.x, point.y - pointer.y);

        if (distance <= snapDistance && distance < nearestDistance) {
          nearestDistance = distance;
          nearestTarget = { nodeId: node.id, point, port };
        }
      });
    });

    return nearestTarget;
  }

  function connectionExists(edge: ExampleEdgeModel) {
    return edges.some(
      (candidate) =>
        candidate.sourceNodeId === edge.sourceNodeId &&
        candidate.sourcePortId === edge.sourcePortId &&
        candidate.targetNodeId === edge.targetNodeId &&
        candidate.targetPortId === edge.targetPortId &&
        candidate.type === edge.type,
    );
  }

  function connectionExistsInEdges(currentEdges: ExampleEdgeModel[], edge: ExampleEdgeModel) {
    return currentEdges.some(
      (candidate) =>
        candidate.sourceNodeId === edge.sourceNodeId &&
        candidate.sourcePortId === edge.sourcePortId &&
        candidate.targetNodeId === edge.targetNodeId &&
        candidate.targetPortId === edge.targetPortId &&
        candidate.type === edge.type,
    );
  }

  function commitConnection(dragState: NodeConnectionDragState) {
    const sourceNode = nodesWithConnections.find((node) => node.id === dragState.sourceNodeId);
    const targetNode = dragState.snapTarget ? nodesWithConnections.find((node) => node.id === dragState.snapTarget?.nodeId) : undefined;

    if (!sourceNode || !targetNode || !dragState.snapTarget) {
      setStatusMessage(dragState.historySnapshot ? 'Connection detached.' : 'Connection canceled.');
      return;
    }

    const nextEdge = getTypedConnectionFromPorts(sourceNode, dragState.sourcePort, targetNode, dragState.snapTarget.port);

    if (!nextEdge) {
      setStatusMessage(`Type mismatch: ${dragState.sourcePort.type ?? 'none'} cannot connect there.`);
      return;
    }

    if (!dragState.historySnapshot && connectionExists(nextEdge)) {
      setStatusMessage(`Connection already exists: ${nextEdge.type}.`);
      return;
    }

    if (!dragState.historySnapshot) {
      pushUndoSnapshot();
    }
    setEdges((currentEdges) => (connectionExistsInEdges(currentEdges, nextEdge) ? currentEdges : [...currentEdges, nextEdge]));
    setSelectedEdgeId(nextEdge.id);
    setStatusMessage(`Connected ${sourceNode.title} to ${targetNode.title} as ${nextEdge.type}.`);
  }

  function updateZoom(delta: number) {
    const nextZoom = clampNumber(Number((canvasViewRef.current.zoom + delta).toFixed(2)), 0.55, 1.45);

    canvasViewRef.current = { ...canvasViewRef.current, zoom: nextZoom };
    setZoom(nextZoom);
  }

  function fitWorkspaceView() {
    const fitView = getNodeCanvasFitView(nodes, viewportState, {
      maxZoom: 1.12,
      minZoom: 0.55,
      padding: 72,
    });

    const nextZoom = Number(fitView.zoom.toFixed(2));
    const nextOffset = { x: fitView.offsetX, y: fitView.offsetY };

    canvasViewRef.current = { offset: nextOffset, zoom: nextZoom };
    setZoom(nextZoom);
    setCanvasOffset(nextOffset);
    setStatusMessage(nodes.length > 0 ? 'Fit view to visible nodes.' : 'Canvas fit reset.');
  }

  function handleWorkspaceCommand(command: 'delete' | 'fit' | 'zoomIn' | 'zoomOut') {
    if (command === 'zoomIn') {
      updateZoom(0.1);
      return;
    }

    if (command === 'zoomOut') {
      updateZoom(-0.1);
      return;
    }

    if (command === 'fit') {
      fitWorkspaceView();
      return;
    }

    deleteSelectedWorkspaceItem();
  }

  function moveWorkspaceViewport(viewport: NodeMiniMapViewport) {
    setCanvasOffset(getCanvasOffsetFromViewport(viewport, zoom, viewportState));
    setStatusMessage('Minimap viewport moved.');
  }

  function selectNodeFromMiniMap(nodeId: string) {
    const node = nodesWithConnections.find((candidate) => candidate.id === nodeId);

    if (!node) {
      return;
    }

    setSelectedEdgeId(undefined);
    setSelectedNodeIds([node.id]);
    setCanvasOffset(getCanvasOffsetFromViewport(getViewportCenteredOnNode(node, miniMapViewport), zoom, viewportState));
    setStatusMessage(`Focused ${node.title} from minimap.`);
    workspaceRef.current?.focus();
  }

  function startNodeDrag(event: ReactPointerEvent<HTMLDivElement>, node: ExampleNodeModel) {
    if (locked || event.button !== 0) {
      return;
    }

    const nodeOrigins = getNodeCanvasDragOrigins(nodes, selectedNodeIds, node.id);

    if (nodeOrigins.length === 0) {
      return;
    }

    event.stopPropagation();
    workspaceRef.current?.focus();
    closeCanvasContextMenu();
    setSelectedEdgeId(undefined);

    if (!selectedNodeIdSet.has(node.id)) {
      setSelectedNodeIds([node.id]);
    }

    dragStateRef.current = {
      historySnapshot: createWorkspaceSnapshot(),
      id: node.id,
      nodeOrigins,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };
    suppressClickRef.current = false;
    setDraggedNodeId(node.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDraggedNode(event: ReactPointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;

    if (!dragState || locked) {
      return;
    }

    const deltaX = (event.clientX - dragState.pointerX) / zoom;
    const deltaY = (event.clientY - dragState.pointerY) / zoom;

    if (Math.abs(deltaX) > 3 || Math.abs(deltaY) > 3) {
      suppressClickRef.current = true;
    }

    setNodes((currentNodes) => getNodeCanvasDraggedNodes(currentNodes, dragState.nodeOrigins, { x: deltaX, y: deltaY }, getNodeDragPosition));
  }

  function stopNodeDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const dragState = dragStateRef.current;

    if (dragState) {
      event.currentTarget.releasePointerCapture(event.pointerId);

      if (suppressClickRef.current) {
        const movedNode = nodes.find((node) => node.id === dragState.id);
        pushUndoSnapshot(dragState.historySnapshot);
        setStatusMessage(dragState.nodeOrigins.length > 1 ? `Moved ${dragState.nodeOrigins.length} nodes.` : `Moved ${movedNode?.title ?? 'node'}.`);
      }
    }

    dragStateRef.current = undefined;
    setDraggedNodeId(undefined);
  }

  function getIncomingEdgeForPort(node: ExampleNodeModel, port: NodePortItem) {
    if (port.direction !== 'input') {
      return undefined;
    }

    return [...edges].reverse().find((edge) => edge.targetNodeId === node.id && edge.targetPortId === port.id);
  }

  function startInputConnectionDetach(event: ReactPointerEvent<HTMLButtonElement>, node: ExampleNodeModel, port: NodePortItem) {
    const incomingEdge = getIncomingEdgeForPort(node, port);

    if (!incomingEdge) {
      setStatusMessage('Input ports only detach existing connections.');
      return;
    }

    const sourceNode = nodesWithConnections.find((candidate) => candidate.id === incomingEdge.sourceNodeId);
    const sourcePort = sourceNode?.ports.find((candidate) => candidate.id === incomingEdge.sourcePortId);

    if (!sourceNode || !sourcePort) {
      setStatusMessage('Connection source is missing.');
      return;
    }

    const historySnapshot = createWorkspaceSnapshot();
    const pointer = getPlanePointFromClient(event.clientX, event.clientY);

    pushUndoSnapshot(historySnapshot);
    setEdges((currentEdges) => currentEdges.filter((edge) => edge.id !== incomingEdge.id));
    setSelectedEdgeId(undefined);
    setSelectedNodeIds([sourceNode.id]);
    updateConnectionDrag({
      historySnapshot,
      pointer,
      sourceNodeId: sourceNode.id,
      sourcePoint: getPortPoint(sourceNode, sourcePort.id),
      sourcePort,
    });
    event.currentTarget.setPointerCapture(event.pointerId);
    setStatusMessage(`Detached ${incomingEdge.type} connection. Release near another matching input.`);
  }

  function startPortConnection(event: ReactPointerEvent<HTMLButtonElement>, node: ExampleNodeModel, port: NodePortItem) {
    event.preventDefault();
    event.stopPropagation();
    workspaceRef.current?.focus();
    closeCanvasContextMenu();

    if (locked || !editable || port.disabled || !port.type) {
      setStatusMessage(locked ? 'Locked workflow view: unlock before connecting ports.' : !editable ? 'Topology editing is disabled.' : 'Only typed ports can create edges.');
      return;
    }

    if (port.direction === 'input') {
      startInputConnectionDetach(event, node, port);
      return;
    }

    if (port.direction !== 'output') {
      setStatusMessage('Start new connections from output ports.');
      return;
    }

    const sourcePoint = getPortPoint(node, port.id);
    const pointer = getPlanePointFromClient(event.clientX, event.clientY);

    setSelectedEdgeId(undefined);
    updateConnectionDrag({
      pointer,
      sourceNodeId: node.id,
      sourcePoint,
      sourcePort: port,
    });
    setSelectedNodeIds([node.id]);
    event.currentTarget.setPointerCapture(event.pointerId);
    setStatusMessage(`Dragging ${port.type} edge. Release near a matching port.`);
  }

  function movePortConnection(event: ReactPointerEvent<HTMLButtonElement>) {
    const dragState = connectionDragRef.current;

    if (!dragState) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const pointer = getPlanePointFromClient(event.clientX, event.clientY);
    updateConnectionDrag({
      ...dragState,
      pointer,
      snapTarget: getCompatibleSnapTarget(pointer, dragState.sourceNodeId, dragState.sourcePort),
    });
  }

  function finishConnectionDrag(clientX: number, clientY: number) {
    const dragState = connectionDragRef.current;

    if (!dragState) {
      return false;
    }

    const pointer = getPlanePointFromClient(clientX, clientY);
    const finalDragState = {
      ...dragState,
      pointer,
      snapTarget: getCompatibleSnapTarget(pointer, dragState.sourceNodeId, dragState.sourcePort),
    };

    commitConnection(finalDragState);
    updateConnectionDrag(undefined);
    return true;
  }

  function stopPortConnection(event: ReactPointerEvent<HTMLButtonElement>) {
    const dragState = connectionDragRef.current;

    if (!dragState) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    event.currentTarget.releasePointerCapture(event.pointerId);
    finishConnectionDrag(event.clientX, event.clientY);
  }

  function handleCanvasPanStart() {
    workspaceRef.current?.focus();
    closeCanvasContextMenu();
    setIsPanning(true);
  }

  function handleCanvasSelectionStart() {
    workspaceRef.current?.focus();
    closeCanvasContextMenu();
    setSelectedEdgeId(undefined);
    setStatusMessage('Drag to select nodes.');
  }

  function clearCanvasSelection(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) {
      return;
    }

    closeCanvasContextMenu();
    setSelectedEdgeId(undefined);
    setSelectedNodeIds([]);
    setStatusMessage('Selection cleared.');
  }

  function getSelectionStatusMessage(selectedIds: string[]) {
    if (selectedIds.length === 0) {
      return 'No nodes in selection.';
    }

    if (selectedIds.length === 1) {
      const selectedNodeForMessage = nodesWithConnections.find((node) => node.id === selectedIds[0]);
      return `Selected ${selectedNodeForMessage?.title ?? 'node'}.`;
    }

    return `Selected ${selectedIds.length} nodes.`;
  }

  function handleSelectedNodeIdsChange(nextSelectedNodeIds: string[]) {
    setSelectedEdgeId(undefined);
    setSelectedNodeIds(nextSelectedNodeIds);
    setStatusMessage(getSelectionStatusMessage(nextSelectedNodeIds));
  }

  function handleCanvasPanChange(offset: { x: number; y: number }) {
    canvasViewRef.current = { ...canvasViewRef.current, offset };
    setCanvasOffset(offset);
  }

  function handleCanvasPanEnd() {
    setIsPanning(false);
    setStatusMessage('Canvas panned.');
  }

  function handleCanvasPointerUp(event: ReactPointerEvent<HTMLDivElement>) {
    if (connectionDragRef.current) {
      event.preventDefault();
      event.stopPropagation();
      finishConnectionDrag(event.clientX, event.clientY);
    }
  }

  function handleCanvasWheel(event: ReactWheelEvent<HTMLDivElement>) {
    if (!event.ctrlKey) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    const canvasElement = event.currentTarget;

    canvasElement.dataset.zooming = 'true';
    window.clearTimeout(zoomTransitionTimeoutRef.current);
    zoomTransitionTimeoutRef.current = window.setTimeout(() => {
      delete canvasElement.dataset.zooming;
    }, 120);

    const viewport = getViewportElement();
    const viewportRect = viewport?.getBoundingClientRect();
    const nextDelta = event.deltaY > 0 ? -0.08 : 0.08;

    if (!viewport || !viewportRect) {
      updateZoom(nextDelta);
      return;
    }

    const pointerX = event.clientX - viewportRect.left;
    const pointerY = event.clientY - viewportRect.top;

    const currentView = canvasViewRef.current;
    const zoomView = getNodeCanvasZoomView({
      currentOffsetX: currentView.offset.x,
      currentOffsetY: currentView.offset.y,
      currentZoom: currentView.zoom,
      delta: nextDelta,
      maxZoom: 1.45,
      minZoom: 0.55,
      pointerX,
      pointerY,
      scrollX: viewport.scrollLeft,
      scrollY: viewport.scrollTop,
    });

    const nextOffset = { x: zoomView.offsetX, y: zoomView.offsetY };

    canvasViewRef.current = { offset: nextOffset, zoom: zoomView.zoom };
    setCanvasOffset(nextOffset);
    setZoom(zoomView.zoom);
  }

  function isEditableKeyboardTarget(target: EventTarget | null) {
    return target instanceof HTMLElement && Boolean(target.closest('input, textarea, select, [contenteditable="true"]'));
  }

  function handleWorkspaceKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (isEditableKeyboardTarget(event.target)) {
      return;
    }

    const key = event.key.toLowerCase();
    const hasCommandModifier = event.ctrlKey || event.metaKey;

    if (hasCommandModifier && key === 'z' && !event.shiftKey) {
      event.preventDefault();
      undoWorkspaceChange();
      return;
    }

    if ((hasCommandModifier && key === 'y') || (hasCommandModifier && event.shiftKey && key === 'z')) {
      event.preventDefault();
      redoWorkspaceChange();
      return;
    }

    if (event.key === 'Escape' && contextMenu) {
      event.preventDefault();
      closeCanvasContextMenu();
      return;
    }

    if (event.key === 'Delete') {
      event.preventDefault();
      deleteSelectedWorkspaceItem();
    }
  }

  function openCanvasContextMenu(event: ReactMouseEvent<HTMLDivElement>) {
    const target = event.target;

    if (!(target instanceof Element)) {
      return;
    }

    const canAddNodes = editable && !locked;
    const activeDrag = canAddNodes ? connectionDragRef.current : undefined;

    if (!activeDrag && target.closest('.node-system-node, .node-system-port, .node-system-edge, .node-system-canvas__shortcuts')) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
    workspaceRef.current?.focus();

    setContextMenu({
      canAddNodes,
      connectionSource: activeDrag ? { ...activeDrag } : undefined,
      connectionType: activeDrag?.sourcePort.type,
      planePoint: getPlanePointFromClient(event.clientX, event.clientY),
      x: Math.max(8, event.clientX),
      y: Math.max(8, event.clientY),
    });
    setStatusMessage(activeDrag?.sourcePort.type ? `Choose a node that accepts ${activeDrag.sourcePort.type}.` : canAddNodes ? 'Choose a canvas action or node template.' : 'Choose a canvas action.');
  }

  function closeCanvasContextMenu() {
    setContextMenu(undefined);
  }

  function getContextMenuTemplates() {
    if (!contextMenu?.connectionType) {
      return nodeTemplateDefinitions;
    }

    return nodeTemplateDefinitions.filter((template) => template.inputType === contextMenu.connectionType);
  }

  function addNodeFromContextMenu(templateId: string) {
    if (!contextMenu) {
      return;
    }

    addNodeFromTemplate(templateId, contextMenu.planePoint, contextMenu.connectionSource);
  }

  function fitViewFromContextMenu() {
    fitWorkspaceView();
    closeCanvasContextMenu();
    window.requestAnimationFrame(() => workspaceRef.current?.focus());
  }

  const activeConnectionEnd = connectionDrag?.snapTarget?.point ?? connectionDrag?.pointer;
  const contextMenuTemplates = getContextMenuTemplates();

  return (
    <div
      className="node-system-workspace"
      data-has-inspector={showInspector ? 'true' : 'false'}
      data-has-palette={showPalette ? 'true' : 'false'}
      ref={workspaceRef}
      tabIndex={0}
      onKeyDown={handleWorkspaceKeyDown}
      onPointerDownCapture={(event) => {
        const target = event.target;

        if (contextMenu && target instanceof Element && !target.closest('.node-system-workspace__context-menu')) {
          closeCanvasContextMenu();
        }
      }}
    >
      {showPalette ? (
        <NodePalette
          selectedTemplateId={selectedTemplateId}
          showSearch
          templates={nodeTemplates}
          onSelectedTemplateChange={(templateId) => addNodeFromTemplate(templateId)}
        />
      ) : null}

      <div className="node-system-workspace__main">
        {showToolbar ? (
          <div className="node-system-workspace__toolbar-row">
            <div className="node-system-workspace__actions" role="toolbar" aria-label="Node workspace actions">
              <Button aria-label="Zoom out" icon={<ZoomOut size={16} aria-hidden="true" />} iconOnly size="comfortable" tooltip="Zoom out" tooltipPlacement="bottom" variant="secondary" onClick={() => handleWorkspaceCommand('zoomOut')}>
                Zoom out
              </Button>
              <Button aria-label="Zoom in" icon={<ZoomIn size={16} aria-hidden="true" />} iconOnly size="comfortable" tooltip="Zoom in" tooltipPlacement="bottom" variant="secondary" onClick={() => handleWorkspaceCommand('zoomIn')}>
                Zoom in
              </Button>
              <Button aria-label="Fit canvas" icon={<Maximize2 size={16} aria-hidden="true" />} iconOnly size="comfortable" tooltip="Fit canvas" tooltipPlacement="bottom" variant="secondary" onClick={() => handleWorkspaceCommand('fit')}>
                Fit
              </Button>
              <Button
                aria-label="Snap nodes to grid"
                buttonType="toggle"
                icon={<Grid2X2 size={16} aria-hidden="true" />}
                iconOnly
                pressed={snapToGrid}
                showToggleIndicator={false}
                size="comfortable"
                tooltip="Snap nodes to grid"
                tooltipPlacement="bottom"
                variant={snapToGrid ? 'primary' : 'secondary'}
                onPressedChange={setSnapToGrid}
              >
                Snap to grid
              </Button>
              <Button
                aria-label="Delete selected node"
                disabled={locked || !editable || !selectedNode}
                icon={<Trash2 size={16} aria-hidden="true" />}
                iconOnly
                size="comfortable"
                tooltip="Delete selected node"
                tooltipPlacement="bottom"
                variant="danger"
                onClick={() => handleWorkspaceCommand('delete')}
              >
                Delete
              </Button>
            </div>
            <span className="node-system-workspace__status" role="status">
              {statusMessage}
            </span>
          </div>
        ) : null}

        <div className="node-system-workspace__canvas-shell" ref={canvasShellRef}>
          <NodeCanvas
            brandWatermark={brandWatermark}
            brandWatermarkPlacement={brandWatermarkPlacement}
            editable={editable && !locked}
            flowDirection={flowDirection}
            locked={locked}
            mode="select"
            offsetX={canvasOffset.x}
            offsetY={canvasOffset.y}
            pannable
            panDisabled={Boolean(connectionDrag)}
            planeHeight={planeHeight}
            planeWidth={planeWidth}
            preventCtrlWheel
            selectionLabel={connectionDrag ? `Dragging ${connectionDrag.sourcePort.type} edge` : isPanning ? 'Panning canvas' : selectedNodeIds.length > 1 ? `${selectedNodeIds.length} nodes selected` : selectedNode?.title}
            showGrid={showGrid}
            shortcuts={canvasShortcutItems}
            shortcutsLabel="Canvas Shortcuts"
            shortcutsPosition="top-left"
            selectableNodes={nodes}
            selectionMinHeight={nodeWorkspaceSelectionMinimumSize}
            selectionMinWidth={nodeWorkspaceSelectionMinimumSize}
            variant={variant}
            zoom={zoom}
            onCanvasBackgroundPointerDown={clearCanvasSelection}
            onCanvasSelectionStart={handleCanvasSelectionStart}
            onContextMenu={openCanvasContextMenu}
            onPanChange={handleCanvasPanChange}
            onPanEnd={handleCanvasPanEnd}
            onPanStart={handleCanvasPanStart}
            onPointerUp={handleCanvasPointerUp}
            onSelectedNodeIdsChange={handleSelectedNodeIdsChange}
            onWheel={handleCanvasWheel}
          >
            {edges.map((edge) => {
              const edgePoints = getEdgePoints(edge, nodesWithConnections);

              if (!edgePoints) {
                return null;
              }

              return (
                <NodeEdge
                  animated={animatedEdges}
                  animationStyle={edgeAnimation}
                  canvasHeight={planeHeight}
                  canvasWidth={planeWidth}
                  connectionType={edge.type}
                  fromSide={edgePoints.from.side}
                  fromX={edgePoints.from.x}
                  fromY={edgePoints.from.y}
                  key={edge.id}
                  label={edge.label}
                  selected={edge.id === selectedEdgeId || selectedNodeIdSet.has(edge.sourceNodeId) || selectedNodeIdSet.has(edge.targetNodeId)}
                  toSide={edgePoints.to.side}
                  toX={edgePoints.to.x}
                  toY={edgePoints.to.y}
                  tone={edge.tone}
                  typeColor={getNodeTypeColor(edge.type)}
                  onPointerDown={(event) => {
                    event.stopPropagation();
                    workspaceRef.current?.focus();
                    closeCanvasContextMenu();
                    setSelectedEdgeId(edge.id);
                    setStatusMessage(`Selected ${edge.type} connection.`);
                  }}
                />
              );
            })}

            {connectionDrag && activeConnectionEnd ? (
              <NodeEdge
                animated
                animationStyle={edgeAnimation}
                canvasHeight={planeHeight}
                canvasWidth={planeWidth}
                connectionType={connectionDrag.sourcePort.type}
                fromSide={connectionDrag.sourcePoint.side}
                fromX={connectionDrag.sourcePoint.x}
                fromY={connectionDrag.sourcePoint.y}
                label={connectionDrag.sourcePort.type}
                selected
                toSide={connectionDrag.snapTarget?.point.side}
                toX={activeConnectionEnd.x}
                toY={activeConnectionEnd.y}
                tone={getTypeTone(connectionDrag.sourcePort.type)}
                typeColor={getNodeTypeColor(connectionDrag.sourcePort.type)}
              />
            ) : null}

            {nodesWithConnections.map((node) => (
              <Node
                data-dragging={draggedNodeId === node.id ? 'true' : undefined}
                data-node-id={node.id}
                density={density}
                flowDirection={flowDirection}
                height={node.height}
                key={node.id}
                ports={node.ports}
                selected={selectedNodeIdSet.has(node.id)}
                statusLabel={node.status}
                subtitle={node.subtitle}
                title={node.title}
                tone={node.tone}
                width={node.width}
                x={node.x}
                y={node.y}
                onClick={() => {
                  if (suppressClickRef.current) {
                    suppressClickRef.current = false;
                    return;
                  }

                  setSelectedEdgeId(undefined);
                  setSelectedNodeIds([node.id]);
                  setStatusMessage(`Selected ${node.title}.`);
                }}
                onPointerDown={(event) => startNodeDrag(event, node)}
                onPointerMove={draggedNodeId === node.id ? moveDraggedNode : undefined}
                onPointerUp={draggedNodeId === node.id ? stopNodeDrag : undefined}
                onPortPointerDown={(event, port) => startPortConnection(event, node, port)}
                onPortPointerMove={connectionDrag ? movePortConnection : undefined}
                onPortPointerUp={connectionDrag ? stopPortConnection : undefined}
              >
                {renderNodeContent(node)}
              </Node>
            ))}
          </NodeCanvas>

          {showMiniMap ? (
            <NodeMiniMap
              canvasHeight={planeHeight}
              canvasWidth={planeWidth}
              density={density}
              edges={getMiniMapEdges(edges, selectedNodeIds, selectedEdgeId)}
              nodes={getMiniMapNodes(nodesWithConnections, selectedNodeIds)}
              selectedNodeId={selectedNodeId}
              showLabels={false}
              showViewport
              variant="floating"
              viewport={miniMapViewport}
              onNodeSelect={selectNodeFromMiniMap}
              onViewportMove={moveWorkspaceViewport}
            />
          ) : null}

          {contextMenu ? (
            <div
              className="node-system-workspace__context-menu"
              role="menu"
              style={{ left: contextMenu.x, top: contextMenu.y }}
              onContextMenu={(event) => event.preventDefault()}
              onPointerDown={(event) => event.stopPropagation()}
            >
              <span className="node-system-workspace__context-title">
                {contextMenu.connectionType ? `Accepts ${contextMenu.connectionType}` : 'Canvas actions'}
              </span>
              <button className="node-system-workspace__context-item" role="menuitem" type="button" onClick={fitViewFromContextMenu}>
                <span className="node-system-workspace__context-icon">
                  <Maximize2 size={16} aria-hidden="true" />
                </span>
                <span>
                  <strong>Fit view</strong>
                  <small>Center visible nodes</small>
                </span>
              </button>
              {contextMenu.canAddNodes ? <span className="node-system-workspace__context-title">Add node</span> : null}
              {contextMenu.canAddNodes && contextMenuTemplates.length > 0 ? (
                contextMenuTemplates.map((template) => (
                  <button
                    className="node-system-workspace__context-item"
                    key={template.id}
                    role="menuitem"
                    type="button"
                    onClick={() => addNodeFromContextMenu(template.id)}
                  >
                    <span className="node-system-workspace__context-icon">{template.icon}</span>
                    <span>
                      <strong>{template.label}</strong>
                      <small>{template.description}</small>
                    </span>
                  </button>
                ))
              ) : contextMenu.canAddNodes ? (
                <span className="node-system-workspace__context-empty">No compatible nodes</span>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>

      {showInspector ? (
        <NodeInspector
          configValue={locked || !editable ? `mode: ${locked ? 'locked' : 'select'}\neditable: ${editable ? 'true' : 'false'}` : nodeConfig}
          properties={selectedNode ? getInspectorProperties(selectedNode) : []}
          selectedNode={
            selectedNode
              ? {
                  description: selectedNode.description,
                  id: selectedNode.id,
                  status: selectedNode.status,
                  title: selectedNode.title,
                  tone: selectedNode.tone,
                }
              : undefined
          }
        />
      ) : null}
    </div>
  );
}

export function NodeExample({
  density = 'comfortable',
  disabled = false,
  selected = true,
  showPorts = true,
  statusLabel = 'running',
  subtitle = 'Momentum v2',
  title = 'Strategy Engine',
  tone = 'accent',
}: NodeExampleProps) {
  return (
    <div className="node-system-example__mini-stage">
      <Node
        density={density}
        disabled={disabled}
        height={156}
        ports={showPorts ? canvasNodes[1].ports : []}
        selected={selected}
        statusLabel={statusLabel}
        subtitle={subtitle}
        title={title}
        tone={tone}
        width={260}
      >
        {renderNodeContent({
          ...canvasNodes[1],
          description: 'Header, status, ports, and a rich React content slot are theme-driven.',
          metrics: 'Reusable graph node',
        })}
      </Node>
    </div>
  );
}

export function NodePortExample({
  connected = true,
  direction = 'input',
  disabled = false,
  showLabel = true,
  side = 'left',
  tone = 'accent',
}: NodePortExampleProps) {
  return (
    <div className="node-port-example">
      <span className="node-port-example__item">
        <NodePort connected={connected} direction={direction} disabled={disabled} label="Example port" side={side} tone={tone} />
        {showLabel ? <span>{`${side} ${direction}`}</span> : null}
      </span>
      <span className="node-port-example__item">
        <NodePort connected={!connected} direction={direction === 'input' ? 'output' : 'input'} label="Peer port" side="right" tone="neutral" />
        {showLabel ? <span>peer</span> : null}
      </span>
    </div>
  );
}

export function NodeEdgeExample({ animated = true, animationStyle = 'flow', label = 'signal', path = 'smooth', selected = true, tone = 'accent' }: NodeEdgeExampleProps) {
  return (
    <div className="node-edge-example">
      <NodeEdge
        animated={animated}
        animationStyle={animationStyle}
        canvasHeight={180}
        canvasWidth={460}
        fromX={56}
        fromY={92}
        label={label}
        path={path}
        selected={selected}
        toX={404}
        toY={92}
        tone={tone}
      />
    </div>
  );
}

export function NodeToolbarExample({ density = 'comfortable', showLabels = true, showSnapToggle = true, snapToGrid = true }: NodeToolbarExampleProps) {
  const [currentSnapToGrid, setCurrentSnapToGrid] = useState(snapToGrid);

  useEffect(() => {
    setCurrentSnapToGrid(snapToGrid);
  }, [snapToGrid]);

  return (
    <NodeToolbar
      density={density}
      showLabels={showLabels}
      showSnapToggle={showSnapToggle}
      snapToGrid={currentSnapToGrid}
      onSnapToGridChange={setCurrentSnapToGrid}
    />
  );
}

export function NodePaletteExample({ query = '', selectedTemplateId = 'strategy-engine', showSearch = true }: NodePaletteExampleProps) {
  const [currentQuery, setCurrentQuery] = useState(query);
  const [currentSelectedTemplateId, setCurrentSelectedTemplateId] = useState(selectedTemplateId);

  useEffect(() => {
    setCurrentQuery(query);
  }, [query]);

  useEffect(() => {
    setCurrentSelectedTemplateId(selectedTemplateId);
  }, [selectedTemplateId]);

  return (
    <NodePalette
      query={currentQuery}
      selectedTemplateId={currentSelectedTemplateId}
      showSearch={showSearch}
      templates={nodeTemplates}
      onQueryChange={setCurrentQuery}
      onSelectedTemplateChange={setCurrentSelectedTemplateId}
    />
  );
}

export function NodeInspectorExample({ selectedNodeId = 'strategy-engine', showConfig = true }: NodeInspectorExampleProps) {
  const selectedNode = getNodeById(selectedNodeId);

  return (
    <NodeInspector
      configValue={nodeConfig}
      properties={getInspectorProperties(selectedNode)}
      selectedNode={{
        description: selectedNode.description,
        id: selectedNode.id,
        status: selectedNode.status,
        title: selectedNode.title,
        tone: selectedNode.tone,
      }}
      showConfig={showConfig}
    />
  );
}

export function NodeMiniMapExample({
  density = 'comfortable',
  interactive = true,
  selectedNodeId = 'strategy-engine',
  showEdges = true,
  showLabels = false,
  showViewport = true,
  variant = 'panel',
}: NodeMiniMapExampleProps) {
  const [currentSelectedNodeId, setCurrentSelectedNodeId] = useState(selectedNodeId);
  const previewNodes = useMemo(() => getCanvasNodes('horizontal'), []);
  const previewViewport = {
    height: 310,
    width: 440,
    x: 36,
    y: 86,
  };

  useEffect(() => {
    setCurrentSelectedNodeId(getNodeById(selectedNodeId).id);
  }, [selectedNodeId]);

  return (
    <div className="node-system-minimap-example">
      <NodeMiniMap
        canvasHeight={canvasHeight}
        canvasWidth={canvasWidth}
        density={density}
        edges={getMiniMapEdges(canvasEdges, currentSelectedNodeId)}
        interactive={interactive}
        nodes={getMiniMapNodes(previewNodes, currentSelectedNodeId)}
        selectedNodeId={currentSelectedNodeId}
        showEdges={showEdges}
        showLabels={showLabels}
        showViewport={showViewport}
        title="Runtime graph"
        variant={variant}
        viewport={previewViewport}
        onNodeSelect={interactive ? (nodeId) => setCurrentSelectedNodeId(nodeId) : undefined}
      />
    </div>
  );
}
