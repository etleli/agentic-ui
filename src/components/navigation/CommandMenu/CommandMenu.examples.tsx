import { Activity, AlertTriangle, Database, Play, Search, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CommandMenu } from './CommandMenu';
import './CommandMenu.examples.css';
import type { CommandMenuDensity, CommandMenuItem, CommandMenuVariant } from './CommandMenu.types';

export type CommandMenuExampleProps = {
  density?: CommandMenuDensity;
  maxResults?: number;
  query?: string;
  showSections?: boolean;
  showShortcuts?: boolean;
  variant?: CommandMenuVariant;
};

const commandItems: CommandMenuItem[] = [
  {
    description: 'Run the current strategy against cached market data.',
    icon: <Play size={16} aria-hidden="true" />,
    id: 'run-simulation',
    keywords: ['backtest', 'strategy'],
    label: 'Run simulation',
    section: 'Actions',
    shortcut: 'Ctrl R',
    tone: 'positive',
  },
  {
    description: 'Open broker and stream latency diagnostics.',
    icon: <Activity size={16} aria-hidden="true" />,
    id: 'open-diagnostics',
    keywords: ['health', 'latency'],
    label: 'Open diagnostics',
    section: 'Actions',
    shortcut: 'Ctrl D',
    tone: 'accent',
  },
  {
    description: 'Show unresolved risk events and blocked orders.',
    icon: <AlertTriangle size={16} aria-hidden="true" />,
    id: 'review-risk',
    keywords: ['risk', 'alerts'],
    label: 'Review risk events',
    section: 'Review',
    shortcut: 'Ctrl Shift R',
    tone: 'warning',
  },
  {
    description: 'Find configs, generated artifacts, and logs.',
    icon: <Search size={16} aria-hidden="true" />,
    id: 'search-workspace',
    keywords: ['files', 'workspace'],
    label: 'Search workspace',
    section: 'Review',
    shortcut: 'Ctrl K',
  },
  {
    description: 'Refresh data snapshots from local cache.',
    icon: <Database size={16} aria-hidden="true" />,
    id: 'refresh-cache',
    keywords: ['data', 'cache'],
    label: 'Refresh cache',
    section: 'Data',
    shortcut: 'Ctrl U',
    tone: 'neutral',
  },
  {
    description: 'Edit simulation, broker, and notification settings.',
    icon: <Settings size={16} aria-hidden="true" />,
    id: 'open-settings',
    keywords: ['preferences', 'config'],
    label: 'Open settings',
    section: 'Data',
    shortcut: 'Ctrl ,',
  },
];

export function CommandMenuExample({
  density = 'comfortable',
  maxResults = 8,
  query = '',
  showSections = true,
  showShortcuts = true,
  variant = 'panel',
}: CommandMenuExampleProps) {
  const [currentQuery, setCurrentQuery] = useState(query);

  useEffect(() => {
    setCurrentQuery(query);
  }, [query]);

  return (
    <div className="command-menu-example">
      <CommandMenu
        density={density}
        items={commandItems}
        maxResults={maxResults}
        query={currentQuery}
        showSections={showSections}
        showShortcuts={showShortcuts}
        variant={variant}
        onQueryChange={setCurrentQuery}
      />
    </div>
  );
}
