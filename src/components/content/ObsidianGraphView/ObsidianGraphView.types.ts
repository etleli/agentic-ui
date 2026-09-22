import type { HTMLAttributes } from 'react';

export type ObsidianGraphViewDensity = 'compact' | 'comfortable' | 'spacious';
export type ObsidianGraphViewLabelMode = 'all' | 'active' | 'none';
export type ObsidianGraphViewNodeTone = 'default' | 'accent' | 'positive' | 'warning' | 'neutral';
export type ObsidianGraphViewVariant = 'panel' | 'plain';

export type ObsidianGraphNode = {
  description?: string;
  group?: string;
  id: string;
  label: string;
  meta?: string;
  radius?: number;
  tone?: ObsidianGraphViewNodeTone;
  weight?: number;
  x?: number;
  y?: number;
};

export type ObsidianGraphLink = {
  id?: string;
  label?: string;
  source: string;
  strength?: number;
  target: string;
};

export type ObsidianGraphViewProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  ariaLabel?: string;
  density?: ObsidianGraphViewDensity;
  height?: number | string;
  labelMode?: ObsidianGraphViewLabelMode;
  links: ObsidianGraphLink[];
  nodes: ObsidianGraphNode[];
  selectedNodeId?: string;
  variant?: ObsidianGraphViewVariant;
  onSelectNode?: (node: ObsidianGraphNode) => void;
};
