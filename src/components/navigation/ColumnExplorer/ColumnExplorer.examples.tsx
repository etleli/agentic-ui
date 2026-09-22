import { Activity, Database, FileText, Folder, Radio, Settings, Shield, Terminal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { ColumnExplorer } from './ColumnExplorer';
import './ColumnExplorer.examples.css';
import type { ColumnExplorerDensity, ColumnExplorerItem, ColumnExplorerVariant } from './ColumnExplorer.types';

export type ColumnExplorerExampleProps = {
  density?: ColumnExplorerDensity;
  keyboardNavigation?: boolean;
  minColumnWidth?: string;
  rootLabel?: string;
  selectedPathSource?: string;
  showCounts?: boolean;
  showIcons?: boolean;
  showMetadata?: boolean;
  showPreview?: boolean;
  showStatus?: boolean;
  typeahead?: boolean;
  variant?: ColumnExplorerVariant;
};

const explorerItems: ColumnExplorerItem[] = [
  {
    count: 3,
    description: 'Runtime configuration and generated strategy assets.',
    icon: <Folder size={17} aria-hidden="true" />,
    id: 'workspace',
    label: 'Workspace',
    meta: 'active',
    tone: 'accent',
    children: [
      {
        count: 2,
        description: 'Trading strategies ready for simulation.',
        icon: <Activity size={17} aria-hidden="true" />,
        id: 'strategies',
        label: 'Strategies',
        meta: '2 live',
        tone: 'positive',
        children: [
          {
            description: 'Momentum strategy with validated YAML config.',
            icon: <FileText size={17} aria-hidden="true" />,
            id: 'demo-momentum',
            label: 'Demo Momentum',
            meta: 'yaml',
            tone: 'positive',
          },
          {
            description: 'Mean reversion candidate waiting for broker checks.',
            icon: <FileText size={17} aria-hidden="true" />,
            id: 'mean-reversion',
            label: 'Mean Reversion',
            meta: 'watch',
            tone: 'warning',
          },
        ],
      },
      {
        count: 3,
        description: 'Risk gates and execution limits.',
        icon: <Shield size={17} aria-hidden="true" />,
        id: 'risk',
        label: 'Risk',
        meta: 'guarded',
        tone: 'warning',
        children: [
          {
            description: 'Portfolio exposure limit and per-symbol caps.',
            icon: <Settings size={17} aria-hidden="true" />,
            id: 'exposure-limits',
            label: 'Exposure limits',
            meta: '42%',
            tone: 'warning',
          },
          {
            description: 'Manual override unavailable while live checks run.',
            disabled: true,
            icon: <Settings size={17} aria-hidden="true" />,
            id: 'kill-switch',
            label: 'Kill switch',
            meta: 'locked',
            tone: 'negative',
          },
          {
            description: 'Broker and market stream health is refreshing.',
            icon: <Radio size={17} aria-hidden="true" />,
            id: 'broker-stream',
            label: 'Broker stream',
            loading: true,
            meta: 'sync',
            tone: 'neutral',
          },
        ],
      },
      {
        count: 2,
        description: 'Local runtime outputs and diagnostics.',
        icon: <Terminal size={17} aria-hidden="true" />,
        id: 'logs',
        label: 'Logs',
        meta: 'today',
        tone: 'neutral',
        children: [
          {
            description: 'Recent runtime log stream.',
            icon: <Database size={17} aria-hidden="true" />,
            id: 'runtime-log',
            label: 'Runtime log',
            meta: '128',
            tone: 'neutral',
          },
          {
            description: 'Audit events emitted by the risk layer.',
            icon: <Database size={17} aria-hidden="true" />,
            id: 'audit-events',
            label: 'Audit events',
            meta: '64',
            tone: 'accent',
          },
        ],
      },
    ],
  },
  {
    count: 2,
    description: 'Reusable component source files.',
    icon: <Folder size={17} aria-hidden="true" />,
    id: 'library',
    label: 'Component library',
    meta: 'local',
    tone: 'accent',
    children: [
      {
        count: 4,
        description: 'Input primitives and dropdown controls.',
        icon: <Folder size={17} aria-hidden="true" />,
        id: 'inputs',
        label: 'Inputs',
        meta: 'ready',
        tone: 'positive',
      },
      {
        count: 12,
        description: 'Status badges, meters, progress, and loading states.',
        icon: <Folder size={17} aria-hidden="true" />,
        id: 'feedback',
        label: 'Feedback',
        meta: 'ready',
        tone: 'positive',
      },
    ],
  },
];

function parseSelectedPath(source: string | undefined): string[] {
  return String(source ?? '')
    .split(/[/>\\n]+/)
    .map((segment) => segment.trim())
    .filter(Boolean);
}

export function ColumnExplorerExample({
  density = 'comfortable',
  keyboardNavigation = true,
  minColumnWidth = '200px',
  rootLabel = 'Project',
  selectedPathSource = 'workspace/strategies/demo-momentum',
  showCounts = true,
  showIcons = true,
  showMetadata = true,
  showPreview = true,
  showStatus = true,
  typeahead = true,
  variant = 'panel',
}: ColumnExplorerExampleProps) {
  const selectedPath = useMemo(() => parseSelectedPath(selectedPathSource), [selectedPathSource]);
  const [currentPath, setCurrentPath] = useState(selectedPath);

  useEffect(() => {
    setCurrentPath(selectedPath);
  }, [selectedPath]);

  return (
    <div className="column-explorer-example">
      <ColumnExplorer
        ariaLabel="Trading workspace explorer"
        density={density}
        items={explorerItems}
        keyboardNavigation={keyboardNavigation}
        minColumnWidth={minColumnWidth}
        rootLabel={rootLabel}
        selectedPath={currentPath}
        showCounts={showCounts}
        showIcons={showIcons}
        showMetadata={showMetadata}
        showPreview={showPreview}
        showStatus={showStatus}
        typeahead={typeahead}
        variant={variant}
        renderPreview={({ item, pathLabels }) => (
          <div className="column-explorer-example__preview">
            <span className="column-explorer__preview-icon" data-tone={item.tone ?? 'default'}>
              {item.icon}
            </span>
            <span className="column-explorer-example__preview-header">
              <strong>{item.label}</strong>
              {item.description ? <span>{item.description}</span> : null}
            </span>
            <p className="column-explorer-example__preview-path" aria-label="Selected path">
              {pathLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </p>
          </div>
        )}
        onSelectedPathChange={setCurrentPath}
      />
    </div>
  );
}
