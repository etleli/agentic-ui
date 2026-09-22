import { Activity, Database, FileText, Folder, Shield } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { TreeView } from './TreeView';
import './TreeView.examples.css';
import type { TreeViewDensity, TreeViewItem, TreeViewVariant } from './TreeView.types';

export type TreeViewExampleProps = {
  density?: TreeViewDensity;
  expandedIdsSource?: string;
  selectedId?: string;
  showBadges?: boolean;
  showDescriptions?: boolean;
  showIcons?: boolean;
  showStatus?: boolean;
  variant?: TreeViewVariant;
};

const treeItems: TreeViewItem[] = [
  {
    badge: 3,
    children: [
      {
        badge: 2,
        children: [
          { description: 'Validated YAML config', icon: <FileText size={16} aria-hidden="true" />, id: 'demo-momentum', label: 'Demo Momentum', meta: 'yaml', tone: 'positive' },
          { description: 'Waiting for broker checks', icon: <FileText size={16} aria-hidden="true" />, id: 'mean-reversion', label: 'Mean Reversion', meta: 'watch', tone: 'warning' },
        ],
        description: 'Simulation candidates',
        icon: <Activity size={16} aria-hidden="true" />,
        id: 'strategies',
        label: 'Strategies',
        tone: 'positive',
      },
      {
        badge: 2,
        description: 'Limits and execution gates',
        icon: <Shield size={16} aria-hidden="true" />,
        id: 'risk',
        label: 'Risk',
        tone: 'warning',
      },
      {
        badge: 4,
        description: 'Logs and audit events',
        icon: <Database size={16} aria-hidden="true" />,
        id: 'data',
        label: 'Data',
        tone: 'neutral',
      },
    ],
    description: 'Current trading workspace',
    icon: <Folder size={16} aria-hidden="true" />,
    id: 'workspace',
    label: 'Workspace',
    tone: 'accent',
  },
];

function parseIds(source: string | undefined): string[] {
  return String(source ?? '')
    .split(/[,/>\\n]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function TreeViewExample({
  density = 'comfortable',
  expandedIdsSource = 'workspace, strategies',
  selectedId = 'demo-momentum',
  showBadges = true,
  showDescriptions = true,
  showIcons = true,
  showStatus = true,
  variant = 'panel',
}: TreeViewExampleProps) {
  const parsedExpandedIds = useMemo(() => parseIds(expandedIdsSource), [expandedIdsSource]);
  const [expandedIds, setExpandedIds] = useState(parsedExpandedIds);
  const [currentSelectedId, setCurrentSelectedId] = useState(selectedId);

  useEffect(() => {
    setExpandedIds(parsedExpandedIds);
  }, [parsedExpandedIds]);

  useEffect(() => {
    setCurrentSelectedId(selectedId);
  }, [selectedId]);

  return (
    <div className="tree-view-example">
      <TreeView
        ariaLabel="Trading workspace tree"
        density={density}
        expandedIds={expandedIds}
        items={treeItems}
        selectedId={currentSelectedId}
        showBadges={showBadges}
        showDescriptions={showDescriptions}
        showIcons={showIcons}
        showStatus={showStatus}
        variant={variant}
        onExpandedIdsChange={setExpandedIds}
        onSelect={(item) => setCurrentSelectedId(item.id)}
      />
    </div>
  );
}
