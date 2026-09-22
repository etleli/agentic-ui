import { useEffect, useState } from 'react';
import { FileExplorer } from './FileExplorer';
import type { FileExplorerItem, FileExplorerProps } from './FileExplorer.types';

const EXPLORER_ITEMS: FileExplorerItem[] = [
  {
    children: [
      { extension: 'yaml', id: 'strategy-alpha', kind: 'file', modified: 'Today, 10:39', name: 'demo-momentum.yaml', size: '2.4 KB' },
      { extension: 'yaml', id: 'strategy-beta', kind: 'file', modified: 'Yesterday, 15:16', name: 'mean-reversion.yaml', size: '1.8 KB' },
      { id: 'archive', kind: 'folder', modified: '18 Jul 2026, 09:12', name: 'archive', type: 'File folder', children: [{ extension: 'json', id: 'strategy-archive', kind: 'file', modified: '12 Jul 2026, 13:11', name: 'legacy-strategy.json', size: '3.1 KB' }] },
    ],
    id: 'strategies', kind: 'folder', modified: 'Today, 10:42', name: 'strategies', type: 'File folder',
  },
  { children: [{ extension: 'md', id: 'research-notes', kind: 'file', modified: 'Yesterday, 16:21', name: 'market-notes.md', size: '12 KB' }, { extension: 'png', id: 'research-chart', kind: 'file', modified: 'Yesterday, 15:12', name: 'volatility-map.png', size: '682 KB' }], id: 'research', kind: 'folder', modified: 'Yesterday, 16:21', name: 'research', type: 'File folder' },
  { children: [{ extension: 'csv', id: 'dataset-bars', kind: 'file', modified: '18 Jul 2026, 09:12', name: 'hourly-bars.csv', size: '4.8 MB' }], id: 'datasets', kind: 'folder', modified: '18 Jul 2026, 09:12', name: 'datasets', type: 'File folder' },
  { extension: 'yaml', id: 'demo-momentum', kind: 'file', modified: 'Today, 10:39', name: 'demo-momentum.yaml', size: '2.4 KB' },
  { extension: 'csv', id: 'positions', kind: 'file', modified: 'Today, 09:08', name: 'positions.csv', size: '164 KB' },
  { extension: 'md', id: 'runbook', kind: 'file', modified: 'Yesterday, 15:57', name: 'trading-runbook.md', size: '8.1 KB' },
  { extension: 'json', id: 'risk-limits', kind: 'file', modified: '20 Jul 2026, 12:33', name: 'risk-limits.json', size: '1.2 KB' },
  { extension: 'png', id: 'equity-curve', kind: 'file', modified: '19 Jul 2026, 17:05', name: 'equity-curve.png', size: '428 KB' },
];

const DEFAULT_SELECTED_IDS = ['demo-momentum'];

export type FileExplorerExampleProps = Omit<FileExplorerProps, 'items' | 'onSelectionChange'>;

export function FileExplorerExample({ selectedIds = DEFAULT_SELECTED_IDS, sortBy = 'name', sortDirection = 'asc', view = 'details', onSortChange, onViewChange, ...props }: FileExplorerExampleProps) {
  const [activeSelectedIds, setActiveSelectedIds] = useState(selectedIds);
  const [activeSortBy, setActiveSortBy] = useState(sortBy);
  const [activeSortDirection, setActiveSortDirection] = useState(sortDirection);
  const [activeView, setActiveView] = useState(view);

  useEffect(() => setActiveSelectedIds(selectedIds), [selectedIds]);
  useEffect(() => setActiveSortBy(sortBy), [sortBy]);
  useEffect(() => setActiveSortDirection(sortDirection), [sortDirection]);
  useEffect(() => setActiveView(view), [view]);

  return (
    <FileExplorer
      {...props}
      items={EXPLORER_ITEMS}
      selectedIds={activeSelectedIds}
      sortBy={activeSortBy}
      sortDirection={activeSortDirection}
      view={activeView}
      onSelectionChange={setActiveSelectedIds}
      onSortChange={(nextSortBy, nextSortDirection) => {
        setActiveSortBy(nextSortBy);
        setActiveSortDirection(nextSortDirection);
        onSortChange?.(nextSortBy, nextSortDirection);
      }}
      onViewChange={(nextView) => {
        setActiveView(nextView);
        onViewChange?.(nextView);
      }}
    />
  );
}
