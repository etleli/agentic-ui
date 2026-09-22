import { useMemo, useState, type CSSProperties } from 'react';
import './ObsidianGraphView.css';
import type {
  ObsidianGraphLink,
  ObsidianGraphNode,
  ObsidianGraphViewNodeTone,
  ObsidianGraphViewProps,
} from './ObsidianGraphView.types';

const GRAPH_WIDTH = 1000;
const GRAPH_HEIGHT = 620;
const GRAPH_PADDING = 74;
const FORCE_ITERATIONS = 170;

type LayoutNode = ObsidianGraphNode & {
  degree: number;
  index: number;
  normalizedX: number;
  normalizedY: number;
  radius: number;
  size: number;
  x: number;
  y: number;
};

type LayoutLink = ObsidianGraphLink & {
  id: string;
  sourceNode: LayoutNode;
  targetNode: LayoutNode;
};

type ClusterLayout = {
  cx: number;
  cy: number;
  group: string;
  radius: number;
  tone: ObsidianGraphViewNodeTone;
};

function getObsidianGraphViewClassName(className: ObsidianGraphViewProps['className']) {
  return ['obsidian-graph-view', className].filter(Boolean).join(' ');
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function hashString(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 100000;
  }

  return hash / 100000;
}

function getGroupCenters(groups: string[]) {
  if (groups.length <= 1) {
    return new Map([[groups[0] ?? 'Vault', { x: GRAPH_WIDTH / 2, y: GRAPH_HEIGHT / 2 }]]);
  }

  const radiusX = GRAPH_WIDTH * 0.29;
  const radiusY = GRAPH_HEIGHT * 0.25;

  return new Map(
    groups.map((group, index) => {
      const angle = -Math.PI / 2 + (index / groups.length) * Math.PI * 2;

      return [
        group,
        {
          x: GRAPH_WIDTH / 2 + Math.cos(angle) * radiusX,
          y: GRAPH_HEIGHT / 2 + Math.sin(angle) * radiusY,
        },
      ];
    }),
  );
}

function getNodeTone(node: ObsidianGraphNode): ObsidianGraphViewNodeTone {
  return node.tone ?? 'default';
}

function getToneForCluster(nodes: LayoutNode[]): ObsidianGraphViewNodeTone {
  return nodes.find((node) => node.tone && node.tone !== 'default')?.tone ?? 'neutral';
}

function getLinkId(link: ObsidianGraphLink, index: number) {
  return link.id ?? `${link.source}-${link.target}-${index}`;
}

function buildObsidianGraphLayout(nodes: readonly ObsidianGraphNode[], links: readonly ObsidianGraphLink[]) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const resolvedLinks = links.filter((link) => nodeIds.has(link.source) && nodeIds.has(link.target) && link.source !== link.target);
  const degreeById = new Map<string, number>();

  resolvedLinks.forEach((link) => {
    degreeById.set(link.source, (degreeById.get(link.source) ?? 0) + 1);
    degreeById.set(link.target, (degreeById.get(link.target) ?? 0) + 1);
  });

  const groupNames = Array.from(new Set(nodes.map((node) => node.group ?? 'Vault'))).sort((first, second) => first.localeCompare(second));
  const groupCenters = getGroupCenters(groupNames);
  const groupCounts = new Map<string, number>();
  const groupIndexes = new Map<string, number>();

  nodes.forEach((node) => {
    const group = node.group ?? 'Vault';
    groupCounts.set(group, (groupCounts.get(group) ?? 0) + 1);
  });

  const layoutNodes: LayoutNode[] = nodes.map((node, index) => {
    const group = node.group ?? 'Vault';
    const groupIndex = groupIndexes.get(group) ?? 0;
    const groupCount = groupCounts.get(group) ?? 1;
    const center = groupCenters.get(group) ?? { x: GRAPH_WIDTH / 2, y: GRAPH_HEIGHT / 2 };
    const jitter = hashString(`${node.id}:${group}`);
    const angle = (groupIndex / groupCount) * Math.PI * 2 + jitter * 0.8;
    const distance = groupCount === 1 ? 0 : 54 + groupCount * 7 + jitter * 28;
    const degree = degreeById.get(node.id) ?? 0;
    const radius = node.radius ?? clamp(7 + degree * 2.4 + (node.weight ?? 1) * 1.4, 8, 18);

    groupIndexes.set(group, groupIndex + 1);

    return {
      ...node,
      degree,
      group,
      index,
      normalizedX: 0,
      normalizedY: 0,
      radius,
      size: Math.round(radius * 2.15),
      tone: getNodeTone(node),
      x: node.x ?? center.x + Math.cos(angle) * distance,
      y: node.y ?? center.y + Math.sin(angle) * distance,
    };
  });
  const nodeLookup = new Map(layoutNodes.map((node) => [node.id, node]));
  const velocities = layoutNodes.map(() => ({ x: 0, y: 0 }));

  for (let iteration = 0; iteration < FORCE_ITERATIONS; iteration += 1) {
    for (let firstIndex = 0; firstIndex < layoutNodes.length; firstIndex += 1) {
      const first = layoutNodes[firstIndex];

      for (let secondIndex = firstIndex + 1; secondIndex < layoutNodes.length; secondIndex += 1) {
        const second = layoutNodes[secondIndex];
        const dx = first.x - second.x;
        const dy = first.y - second.y;
        const distanceSquared = Math.max(dx * dx + dy * dy, 36);
        const distance = Math.sqrt(distanceSquared);
        const collisionDistance = first.radius * 6 + second.radius * 6 + 44;
        const charge = Math.min(7.5, 4600 / distanceSquared) + Math.max(0, collisionDistance - distance) * 0.012;
        const forceX = (dx / distance) * charge;
        const forceY = (dy / distance) * charge;

        velocities[firstIndex].x += forceX;
        velocities[firstIndex].y += forceY;
        velocities[secondIndex].x -= forceX;
        velocities[secondIndex].y -= forceY;
      }
    }

    resolvedLinks.forEach((link) => {
      const sourceIndex = layoutNodes.findIndex((node) => node.id === link.source);
      const targetIndex = layoutNodes.findIndex((node) => node.id === link.target);

      if (sourceIndex < 0 || targetIndex < 0) {
        return;
      }

      const source = layoutNodes[sourceIndex];
      const target = layoutNodes[targetIndex];
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
      const groupBonus = source.group === target.group ? 0 : 36;
      const targetDistance = 130 + groupBonus;
      const spring = (distance - targetDistance) * 0.014 * (link.strength ?? 1);
      const forceX = (dx / distance) * spring;
      const forceY = (dy / distance) * spring;

      velocities[sourceIndex].x += forceX;
      velocities[sourceIndex].y += forceY;
      velocities[targetIndex].x -= forceX;
      velocities[targetIndex].y -= forceY;
    });

    layoutNodes.forEach((node, index) => {
      const center = groupCenters.get(node.group ?? 'Vault') ?? { x: GRAPH_WIDTH / 2, y: GRAPH_HEIGHT / 2 };
      velocities[index].x += (center.x - node.x) * 0.004;
      velocities[index].y += (center.y - node.y) * 0.004;
      velocities[index].x += (GRAPH_WIDTH / 2 - node.x) * 0.0009;
      velocities[index].y += (GRAPH_HEIGHT / 2 - node.y) * 0.0009;
      velocities[index].x *= 0.7;
      velocities[index].y *= 0.7;
      node.x = clamp(node.x + velocities[index].x, GRAPH_PADDING, GRAPH_WIDTH - GRAPH_PADDING);
      node.y = clamp(node.y + velocities[index].y, GRAPH_PADDING, GRAPH_HEIGHT - GRAPH_PADDING);
    });
  }

  layoutNodes.forEach((node) => {
    node.normalizedX = (node.x / GRAPH_WIDTH) * 100;
    node.normalizedY = (node.y / GRAPH_HEIGHT) * 100;
  });

  const layoutLinks = resolvedLinks.flatMap((link, index) => {
    const sourceNode = nodeLookup.get(link.source);
    const targetNode = nodeLookup.get(link.target);

    return sourceNode && targetNode ? [{ ...link, id: getLinkId(link, index), sourceNode, targetNode }] : [];
  });
  const clusters = groupNames.flatMap((group) => {
    const clusterNodes = layoutNodes.filter((node) => node.group === group);

    if (clusterNodes.length === 0) {
      return [];
    }

    const cx = clusterNodes.reduce((total, node) => total + node.x, 0) / clusterNodes.length;
    const cy = clusterNodes.reduce((total, node) => total + node.y, 0) / clusterNodes.length;
    const radius = Math.max(88, ...clusterNodes.map((node) => Math.hypot(node.x - cx, node.y - cy) + node.radius * 5));

    return [{ cx, cy, group, radius, tone: getToneForCluster(clusterNodes) }];
  });

  return { clusters, links: layoutLinks, nodes: layoutNodes };
}

function getConnectedNodeIds(activeNodeId: string | undefined, links: LayoutLink[]) {
  if (!activeNodeId) {
    return new Set<string>();
  }

  const connectedIds = new Set([activeNodeId]);

  links.forEach((link) => {
    if (link.source === activeNodeId) {
      connectedIds.add(link.target);
    }

    if (link.target === activeNodeId) {
      connectedIds.add(link.source);
    }
  });

  return connectedIds;
}

function shouldShowNodeLabel(labelMode: ObsidianGraphViewProps['labelMode'], hasActiveNode: boolean, isRelated: boolean) {
  if (labelMode === 'none') {
    return false;
  }

  return labelMode === 'all' || !hasActiveNode || isRelated;
}

export function ObsidianGraphView({
  'aria-label': ariaLabelAttribute,
  ariaLabel,
  className,
  density = 'comfortable',
  height,
  labelMode = 'active',
  links,
  nodes,
  selectedNodeId,
  style,
  variant = 'panel',
  onSelectNode,
  ...graphProps
}: ObsidianGraphViewProps) {
  const [hoveredNodeId, setHoveredNodeId] = useState<string | undefined>();
  const layout = useMemo(() => buildObsidianGraphLayout(nodes, links), [links, nodes]);
  const activeNodeId = hoveredNodeId ?? selectedNodeId;
  const connectedNodeIds = useMemo(() => getConnectedNodeIds(activeNodeId, layout.links), [activeNodeId, layout.links]);
  const graphStyle = {
    ...style,
    '--obsidian-graph-height': typeof height === 'number' ? `${height}px` : height,
  } as CSSProperties;

  return (
    <div
      {...graphProps}
      aria-label={ariaLabel ?? ariaLabelAttribute ?? 'Obsidian vault graph'}
      className={getObsidianGraphViewClassName(className)}
      data-density={density}
      data-empty={nodes.length === 0 ? 'true' : undefined}
      data-variant={variant}
      role="group"
      style={graphStyle}
    >
      {nodes.length === 0 ? (
        <span className="obsidian-graph-view__empty">No vault documents</span>
      ) : (
        <>
          <svg
            className="obsidian-graph-view__canvas"
            preserveAspectRatio="none"
            viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
            aria-hidden="true"
          >
            <defs>
              <radialGradient id="obsidian-graph-node-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="currentColor" stopOpacity="0.42" />
                <stop offset="72%" stopColor="currentColor" stopOpacity="0.1" />
                <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
              </radialGradient>
            </defs>
            {layout.clusters.map((cluster: ClusterLayout) => (
              <circle
                className="obsidian-graph-view__cluster"
                cx={cluster.cx}
                cy={cluster.cy}
                data-tone={cluster.tone}
                key={cluster.group}
                r={cluster.radius}
              />
            ))}
            {layout.links.map((link) => {
              const isRelated = !activeNodeId || link.source === activeNodeId || link.target === activeNodeId;

              return (
                <line
                  className="obsidian-graph-view__link"
                  data-muted={activeNodeId && !isRelated ? 'true' : undefined}
                  data-related={activeNodeId && isRelated ? 'true' : undefined}
                  key={link.id}
                  x1={link.sourceNode.x}
                  x2={link.targetNode.x}
                  y1={link.sourceNode.y}
                  y2={link.targetNode.y}
                />
              );
            })}
          </svg>

          <div className="obsidian-graph-view__nodes">
            {layout.nodes.map((node) => {
              const isActive = node.id === activeNodeId;
              const isSelected = node.id === selectedNodeId;
              const isRelated = !activeNodeId || connectedNodeIds.has(node.id);
              const showLabel = shouldShowNodeLabel(labelMode, Boolean(activeNodeId), isRelated);
              const nodeStyle = {
                '--obsidian-node-size': `${node.size}px`,
                '--obsidian-node-x': `${node.normalizedX}%`,
                '--obsidian-node-y': `${node.normalizedY}%`,
              } as CSSProperties;

              return (
                <button
                  aria-label={`${node.label}${node.meta ? `, ${node.meta}` : ''}`}
                  aria-pressed={isSelected}
                  className="obsidian-graph-view__node"
                  data-active={isActive ? 'true' : undefined}
                  data-muted={!isRelated ? 'true' : undefined}
                  data-related={isRelated ? 'true' : undefined}
                  data-selected={isSelected ? 'true' : undefined}
                  data-tone={node.tone}
                  key={node.id}
                  style={nodeStyle}
                  title={node.description ?? node.label}
                  type="button"
                  onBlur={() => setHoveredNodeId(undefined)}
                  onClick={() => onSelectNode?.(node)}
                  onFocus={() => setHoveredNodeId(node.id)}
                  onMouseEnter={() => setHoveredNodeId(node.id)}
                  onMouseLeave={() => setHoveredNodeId(undefined)}
                >
                  <span className="obsidian-graph-view__node-dot" aria-hidden="true" />
                  {showLabel ? (
                    <span className="obsidian-graph-view__label">
                      <strong>{node.label}</strong>
                      {node.meta ? <small>{node.meta}</small> : null}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export type { ObsidianGraphLink, ObsidianGraphNode, ObsidianGraphViewProps };
