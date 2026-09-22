import { useState } from 'react';
import { ObsidianGraphView } from './ObsidianGraphView';
import type { ObsidianGraphLink, ObsidianGraphNode, ObsidianGraphViewLabelMode, ObsidianGraphViewVariant } from './ObsidianGraphView.types';

const vaultNodes: ObsidianGraphNode[] = [
  { description: 'Daily desk note for the active rebalance session.', group: 'Daily', id: 'daily-2026-07-06', label: '2026-07-06.md', meta: 'Daily', tone: 'accent', weight: 2 },
  { description: 'Previous replay comparison note.', group: 'Daily', id: 'daily-2026-07-05', label: '2026-07-05.md', meta: 'Daily', tone: 'accent' },
  { description: 'Strategy knowledge note with operational guardrails.', group: 'Strategy', id: 'momentum-breakout', label: 'Momentum Breakout.md', meta: 'Strategy', tone: 'positive', weight: 3 },
  { description: 'Reusable strategy risk rules.', group: 'Strategy', id: 'risk-guardrails', label: 'Risk Guardrails.md', meta: 'Strategy', tone: 'positive', weight: 2 },
  { description: 'Screener note linked to symbol protocols.', group: 'Strategy', id: 'price-volume-screener', label: 'Price Volume Screener.md', meta: 'Strategy', tone: 'positive', weight: 2 },
  { description: 'Operational recovery note for broker connectivity.', group: 'Runbooks', id: 'broker-recovery', label: 'Broker Recovery.md', meta: 'Runbook', tone: 'warning', weight: 2 },
  { description: 'Paper replay checklist for promotions.', group: 'Runbooks', id: 'paper-replay', label: 'Paper Replay.md', meta: 'Runbook', tone: 'warning' },
  { description: 'Broker service health note.', group: 'Runbooks', id: 'alpaca-health', label: 'Alpaca Health.md', meta: 'Runbook', tone: 'warning' },
  { description: 'Symbol-level protocol note.', group: 'Protocols', id: 'aapl-protocol', label: 'AAPL Protocol.md', meta: 'Protocol', tone: 'neutral' },
  { description: 'Market data stream note.', group: 'Infrastructure', id: 'alpaca-stream', label: 'Alpaca Stream.md', meta: 'Infra', tone: 'accent', weight: 2 },
  { description: 'Internal WSS aggregation note.', group: 'Infrastructure', id: 'wss-aggregation', label: 'WSS Aggregation.md', meta: 'Infra', tone: 'accent' },
];

const vaultLinks: ObsidianGraphLink[] = [
  { source: 'daily-2026-07-06', target: 'momentum-breakout' },
  { source: 'daily-2026-07-05', target: 'momentum-breakout' },
  { source: 'daily-2026-07-06', target: 'broker-recovery' },
  { source: 'daily-2026-07-06', target: 'aapl-protocol' },
  { source: 'daily-2026-07-06', target: 'paper-replay' },
  { source: 'daily-2026-07-05', target: 'risk-guardrails' },
  { source: 'daily-2026-07-05', target: 'price-volume-screener' },
  { source: 'momentum-breakout', target: 'risk-guardrails' },
  { source: 'risk-guardrails', target: 'broker-recovery', strength: 0.74 },
  { source: 'momentum-breakout', target: 'price-volume-screener' },
  { source: 'momentum-breakout', target: 'alpaca-stream' },
  { source: 'momentum-breakout', target: 'wss-aggregation' },
  { source: 'risk-guardrails', target: 'paper-replay' },
  { source: 'risk-guardrails', target: 'broker-recovery' },
  { source: 'price-volume-screener', target: 'aapl-protocol' },
  { source: 'price-volume-screener', target: 'alpaca-stream' },
  { source: 'paper-replay', target: 'aapl-protocol' },
  { source: 'broker-recovery', target: 'alpaca-health' },
  { source: 'alpaca-health', target: 'alpaca-stream' },
  { source: 'alpaca-health', target: 'wss-aggregation' },
  { source: 'alpaca-stream', target: 'wss-aggregation' },
];

export type ObsidianGraphViewExampleProps = {
  height?: string;
  labelMode?: ObsidianGraphViewLabelMode;
  selectedNodeId?: string;
  variant?: ObsidianGraphViewVariant;
};

export function ObsidianGraphViewExample({
  height = '560px',
  labelMode = 'active',
  selectedNodeId = 'momentum-breakout',
  variant = 'panel',
}: ObsidianGraphViewExampleProps) {
  const [activeNodeId, setActiveNodeId] = useState(selectedNodeId);

  return (
    <ObsidianGraphView
      height={height}
      labelMode={labelMode}
      links={vaultLinks}
      nodes={vaultNodes}
      selectedNodeId={activeNodeId}
      variant={variant}
      onSelectNode={(node) => setActiveNodeId(node.id)}
    />
  );
}
