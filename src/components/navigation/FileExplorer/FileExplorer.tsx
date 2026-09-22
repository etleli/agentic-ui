import { ArrowLeft, File, FileArchive, FileCode2, FileSpreadsheet, FileText, Folder, Image, LayoutGrid, List } from 'lucide-react';
import { useEffect, useMemo, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';
import './FileExplorer.css';
import type {
  FileExplorerItem,
  FileExplorerProps,
  FileExplorerSortBy,
  FileExplorerSortDirection,
} from './FileExplorer.types';

function getFileExplorerClassName(className: FileExplorerProps['className']) {
  return ['file-explorer', className].filter(Boolean).join(' ');
}

const EMPTY_FILE_EXPLORER_ITEMS: FileExplorerItem[] = [];

function getFileType(item: FileExplorerItem) {
  return item.type ?? (item.kind === 'folder' ? 'File folder' : item.extension ? `${item.extension.toUpperCase()} file` : 'File');
}

function getFileIcon(item: FileExplorerItem): ReactNode {
  if (item.icon) return item.icon;
  if (item.kind === 'folder') return <Folder aria-hidden="true" fill="currentColor" size={24} />;

  const extension = item.extension?.toLowerCase() ?? '';
  if (['ts', 'tsx', 'js', 'jsx', 'json', 'yaml', 'yml', 'py', 'sql'].includes(extension)) return <FileCode2 aria-hidden="true" size={24} />;
  if (['csv', 'xlsx', 'xls'].includes(extension)) return <FileSpreadsheet aria-hidden="true" size={24} />;
  if (['md', 'txt', 'pdf', 'doc', 'docx'].includes(extension)) return <FileText aria-hidden="true" size={24} />;
  if (['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp'].includes(extension)) return <Image aria-hidden="true" size={24} />;
  if (['zip', 'rar', '7z', 'tar'].includes(extension)) return <FileArchive aria-hidden="true" size={24} />;
  return <File aria-hidden="true" size={24} />;
}

function getSortValue(item: FileExplorerItem, sortBy: FileExplorerSortBy) {
  if (sortBy === 'type') return getFileType(item);
  if (sortBy === 'size') return item.size ?? '';
  if (sortBy === 'modified') return item.modified ?? '';
  return item.name;
}

function compareItems(firstItem: FileExplorerItem, secondItem: FileExplorerItem, sortBy: FileExplorerSortBy, sortDirection: FileExplorerSortDirection) {
  if (firstItem.kind !== secondItem.kind) return firstItem.kind === 'folder' ? -1 : 1;
  const comparison = getSortValue(firstItem, sortBy).localeCompare(getSortValue(secondItem, sortBy), undefined, { numeric: true, sensitivity: 'base' });
  return sortDirection === 'asc' ? comparison : -comparison;
}

function getNextSelectedIds(currentIds: string[], itemId: string, multiSelect: boolean) {
  if (!multiSelect) return [itemId];
  return currentIds.includes(itemId) ? currentIds.filter((currentId) => currentId !== itemId) : [...currentIds, itemId];
}

function findFolder(items: FileExplorerItem[], folderId: string | undefined): FileExplorerItem | undefined {
  if (!folderId) return undefined;

  for (const item of items) {
    if (item.id === folderId && item.kind === 'folder') return item;
    const nestedFolder = findFolder(item.children ?? [], folderId);
    if (nestedFolder) return nestedFolder;
  }

  return undefined;
}

function findParentFolderId(items: FileExplorerItem[], folderId: string | undefined, parentId?: string): string | undefined {
  if (!folderId) return undefined;

  for (const item of items) {
    if (item.id === folderId) return parentId;
    const nestedParentId = findParentFolderId(item.children ?? [], folderId, item.kind === 'folder' ? item.id : parentId);
    if (nestedParentId !== undefined) return nestedParentId;
  }

  return undefined;
}

export function FileExplorer(props: FileExplorerProps) {
  const isFolderControlled = Object.prototype.hasOwnProperty.call(props, 'folderId');
  const {
    ariaLabel = 'File explorer',
    className,
    defaultFolderId,
    defaultSelectedIds = [],
    density = 'comfortable',
    emptyText = 'This folder is empty.',
    items = [],
    multiSelect = false,
    folderId,
    selectedIds,
    showFileDetails = true,
    showViewToolbar = true,
    sortBy,
    sortDirection,
    variant = 'default',
    view,
    onItemOpen,
    onFolderChange,
    onSelectionChange,
    onSortChange,
    onViewChange,
    ...explorerProps
  } = props;
  const [uncontrolledSelectedIds, setUncontrolledSelectedIds] = useState(defaultSelectedIds);
  const [uncontrolledSort, setUncontrolledSort] = useState<{ by: FileExplorerSortBy; direction: FileExplorerSortDirection }>({ by: 'name', direction: 'asc' });
  const [uncontrolledView, setUncontrolledView] = useState<'details' | 'grid'>('details');
  const [uncontrolledFolderId, setUncontrolledFolderId] = useState(defaultFolderId);
  const [selectionAnchorId, setSelectionAnchorId] = useState<string>();
  const activeSelectedIds = selectedIds ?? uncontrolledSelectedIds;
  const activeView = view ?? uncontrolledView;
  const activeFolderId = isFolderControlled ? folderId : uncontrolledFolderId;
  const activeFolder = useMemo(() => findFolder(items, activeFolderId), [activeFolderId, items]);
  const directoryItems = useMemo(() => activeFolder?.children ?? (activeFolderId ? EMPTY_FILE_EXPLORER_ITEMS : items), [activeFolder, activeFolderId, items]);
  const parentFolderId = useMemo(() => findParentFolderId(items, activeFolderId), [activeFolderId, items]);
  const activeSortBy = sortBy ?? uncontrolledSort.by;
  const activeSortDirection = sortDirection ?? uncontrolledSort.direction;
  const sortedItems = useMemo(() => [...directoryItems].sort((firstItem, secondItem) => compareItems(firstItem, secondItem, activeSortBy, activeSortDirection)), [activeSortBy, activeSortDirection, directoryItems]);

  useEffect(() => {
    const validItemIds = new Set(directoryItems.map((item) => item.id));
    const normalizedIds = activeSelectedIds.filter((itemId) => validItemIds.has(itemId));

    if (selectedIds === undefined && normalizedIds.length !== activeSelectedIds.length) {
      setUncontrolledSelectedIds(normalizedIds);
    }
  }, [activeSelectedIds, directoryItems, selectedIds]);

  function selectItem(item: FileExplorerItem, event: MouseEvent<HTMLButtonElement>) {
    if (item.disabled) return;
    const useMultiSelect = multiSelect && (event.ctrlKey || event.metaKey);
    const selectRange = multiSelect && event.shiftKey && selectionAnchorId;
    let nextSelectedIds: string[];

    if (selectRange) {
      const anchorIndex = sortedItems.findIndex((currentItem) => currentItem.id === selectionAnchorId);
      const itemIndex = sortedItems.findIndex((currentItem) => currentItem.id === item.id);
      const [startIndex, endIndex] = [anchorIndex, itemIndex].sort((firstIndex, secondIndex) => firstIndex - secondIndex);
      nextSelectedIds = anchorIndex === -1 || itemIndex === -1 ? [item.id] : sortedItems.slice(startIndex, endIndex + 1).filter((currentItem) => !currentItem.disabled).map((currentItem) => currentItem.id);
    } else {
      nextSelectedIds = getNextSelectedIds(activeSelectedIds, item.id, useMultiSelect);
    }

    if (!event.shiftKey) setSelectionAnchorId(item.id);
    if (selectedIds === undefined) setUncontrolledSelectedIds(nextSelectedIds);
    onSelectionChange?.(nextSelectedIds, item);
  }

  function openItem(item: FileExplorerItem) {
    if (item.disabled) return;
    if (item.kind === 'folder') {
      if (!isFolderControlled) setUncontrolledFolderId(item.id);
      setSelectionAnchorId(undefined);
      onFolderChange?.(item.id, item);
    }
    onItemOpen?.(item);
  }

  function handleItemKeyDown(event: KeyboardEvent<HTMLButtonElement>, item: FileExplorerItem) {
    if (event.key === 'Enter') {
      event.preventDefault();
      openItem(item);
    }
  }

  function toggleSort(nextSortBy: FileExplorerSortBy) {
    const nextDirection: FileExplorerSortDirection = nextSortBy === activeSortBy && activeSortDirection === 'asc' ? 'desc' : 'asc';
    if (sortBy === undefined && sortDirection === undefined) {
      setUncontrolledSort({ by: nextSortBy, direction: nextDirection });
    }
    onSortChange?.(nextSortBy, nextDirection);
  }

  function updateView(nextView: 'details' | 'grid') {
    if (view === undefined) setUncontrolledView(nextView);
    onViewChange?.(nextView);
  }

  function navigateToParentFolder() {
    const parentFolder = findFolder(items, parentFolderId);
    if (!isFolderControlled) setUncontrolledFolderId(parentFolderId);
    setSelectionAnchorId(undefined);
    onFolderChange?.(parentFolderId, parentFolder);
  }

  function renderItem(item: FileExplorerItem) {
    const isSelected = activeSelectedIds.includes(item.id);
    const iconColor = item.kind === 'folder' ? 'var(--color-trading-warning)' : getThemeGeneratedColorForKey(item.extension ?? item.id);
    const itemStyle = { '--file-explorer-item-color': iconColor } as CSSProperties;

    return (
      <button
        aria-pressed={isSelected}
        className="file-explorer__item"
        data-kind={item.kind}
        disabled={item.disabled}
        key={item.id}
        style={itemStyle}
        type="button"
        onClick={(event) => selectItem(item, event)}
        onDoubleClick={() => openItem(item)}
        onKeyDown={(event) => handleItemKeyDown(event, item)}
      >
        <span className="file-explorer__item-name-cell">
          <span className="file-explorer__item-icon">{getFileIcon(item)}</span>
          <span className="file-explorer__item-name">{item.name}</span>
        </span>
        {activeView === 'details' ? (
          <>
            <span className="file-explorer__item-type">{getFileType(item)}</span>
            <span className="file-explorer__item-modified">{item.modified ?? '—'}</span>
            <span className="file-explorer__item-size">{item.kind === 'folder' ? '—' : item.size ?? '—'}</span>
          </>
        ) : showFileDetails ? <span className="file-explorer__item-meta">{item.kind === 'folder' ? 'Folder' : [getFileType(item), item.size].filter(Boolean).join(' · ')}</span> : null}
      </button>
    );
  }

  const sortColumns: Array<{ id: FileExplorerSortBy; label: string }> = [
    { id: 'name', label: 'Name' },
    { id: 'type', label: 'Type' },
    { id: 'modified', label: 'Date modified' },
    { id: 'size', label: 'Size' },
  ];

  return (
    <section {...explorerProps} aria-label={ariaLabel} className={getFileExplorerClassName(className)} data-density={density} data-variant={variant} data-view={activeView}>
      {showViewToolbar ? (
        <div className="file-explorer__toolbar" aria-label="Explorer view" role="toolbar">
          <button aria-label="Back to parent folder" className="file-explorer__back" disabled={!activeFolderId} type="button" onClick={navigateToParentFolder}>
            <ArrowLeft aria-hidden="true" size={17} />
          </button>
          <span className="file-explorer__toolbar-spacer" />
          <span className="file-explorer__toolbar-label">View</span>
          <button aria-label="Details view" aria-pressed={activeView === 'details'} type="button" onClick={() => updateView('details')}>
            <List aria-hidden="true" size={17} />
          </button>
          <button aria-label="Large icons view" aria-pressed={activeView === 'grid'} type="button" onClick={() => updateView('grid')}>
            <LayoutGrid aria-hidden="true" size={17} />
          </button>
        </div>
      ) : null}
      {activeView === 'details' ? (
        <div className="file-explorer__details-header" role="row">
          {sortColumns.map((column) => {
            const isSorted = column.id === activeSortBy;
            return (
              <button aria-sort={isSorted ? (activeSortDirection === 'asc' ? 'ascending' : 'descending') : undefined} data-sorted={isSorted ? 'true' : undefined} key={column.id} type="button" onClick={() => toggleSort(column.id)}>
                {column.label}<span aria-hidden="true">{isSorted ? (activeSortDirection === 'asc' ? ' ↑' : ' ↓') : null}</span>
              </button>
            );
          })}
        </div>
      ) : null}
      <div className="file-explorer__items" aria-multiselectable={multiSelect || undefined} role="listbox">
        {sortedItems.length ? sortedItems.map(renderItem) : <p className="file-explorer__empty">{emptyText}</p>}
      </div>
    </section>
  );
}

export type {
  FileExplorerDensity,
  FileExplorerItem,
  FileExplorerItemKind,
  FileExplorerProps,
  FileExplorerSortBy,
  FileExplorerSortDirection,
  FileExplorerVariant,
  FileExplorerView,
} from './FileExplorer.types';
