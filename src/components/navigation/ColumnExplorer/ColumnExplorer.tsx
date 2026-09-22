import { ChevronRight, Loader2 } from 'lucide-react';
import { useMemo, useRef, useState, type CSSProperties, type KeyboardEvent } from 'react';
import './ColumnExplorer.css';
import type { ColumnExplorerColumn, ColumnExplorerItem, ColumnExplorerPreviewContext, ColumnExplorerProps } from './ColumnExplorer.types';

type ColumnExplorerState = {
  columns: ColumnExplorerColumn[];
  pathLabels: string[];
  selectedItem?: ColumnExplorerItem;
  selectedPath: string[];
};

function getColumnExplorerClassName(className: ColumnExplorerProps['className']) {
  return ['column-explorer', className].filter(Boolean).join(' ');
}

function hasChildren(item: ColumnExplorerItem): boolean {
  return Array.isArray(item.children) && item.children.length > 0;
}

function getExplorerState(items: ColumnExplorerItem[], selectedPath: string[], rootLabel: string): ColumnExplorerState {
  const columns: ColumnExplorerColumn[] = [{ id: '__root__', items, label: rootLabel }];
  const normalizedPath: string[] = [];
  const pathLabels: string[] = [];
  let selectedItem: ColumnExplorerItem | undefined;
  let currentItems = items;

  for (const segment of selectedPath) {
    const nextItem = currentItems.find((item) => item.id === segment);

    if (!nextItem) {
      break;
    }

    selectedItem = nextItem;
    normalizedPath.push(nextItem.id);
    pathLabels.push(nextItem.label);

    if (!hasChildren(nextItem)) {
      break;
    }

    currentItems = nextItem.children ?? [];
    columns.push({
      id: normalizedPath.join('/'),
      items: currentItems,
      label: nextItem.label,
    });
  }

  return {
    columns,
    pathLabels,
    selectedItem,
    selectedPath: normalizedPath,
  };
}

function getDefaultPreview({ item, path, pathLabels }: ColumnExplorerPreviewContext) {
  return (
    <div className="column-explorer__preview-card">
      <span className="column-explorer__preview-icon" data-tone={item.tone ?? 'default'}>
        {item.icon ?? <ChevronRight size={18} aria-hidden="true" />}
      </span>
      <span className="column-explorer__preview-copy">
        <strong>{item.label}</strong>
        {item.description ? <span>{item.description}</span> : null}
      </span>
      <dl className="column-explorer__preview-facts">
        {item.meta ? (
          <>
            <dt>Meta</dt>
            <dd>{item.meta}</dd>
          </>
        ) : null}
        {typeof item.count === 'number' ? (
          <>
            <dt>Items</dt>
            <dd>{item.count}</dd>
          </>
        ) : null}
        <dt>Path</dt>
        <dd>{pathLabels.length > 0 ? pathLabels.join(' / ') : path.join(' / ')}</dd>
      </dl>
    </div>
  );
}

export function ColumnExplorer({
  ariaLabel = 'Column explorer',
  className,
  defaultSelectedPath = [],
  density = 'comfortable',
  emptyDescription = 'Add items to make the explorer navigable.',
  emptyTitle = 'No items',
  items,
  keyboardNavigation = true,
  minColumnWidth = '200px',
  renderPreview,
  rootLabel = 'Root',
  selectedPath,
  showCounts = true,
  showIcons = true,
  showMetadata = true,
  showPreview = true,
  showStatus = true,
  style,
  typeahead = true,
  variant = 'panel',
  onSelectedPathChange,
  ...explorerProps
}: ColumnExplorerProps) {
  const [uncontrolledSelectedPath, setUncontrolledSelectedPath] = useState(defaultSelectedPath);
  const [focusedColumnIndex, setFocusedColumnIndex] = useState(0);
  const typeaheadRef = useRef('');
  const typeaheadTimerRef = useRef<number | null>(null);
  const activePath = selectedPath ?? uncontrolledSelectedPath;
  const explorerState = useMemo(() => getExplorerState(items, activePath, rootLabel), [activePath, items, rootLabel]);
  const normalizedMinColumnWidth = minColumnWidth.trim() || '200px';
  const explorerStyle = { ...style, '--column-explorer-min-column-width': normalizedMinColumnWidth } as CSSProperties;

  function selectItem(item: ColumnExplorerItem, columnIndex: number) {
    if (item.disabled || item.loading) {
      return;
    }

    const nextPath = [...explorerState.selectedPath.slice(0, columnIndex), item.id];

    if (selectedPath === undefined) {
      setUncontrolledSelectedPath(nextPath);
    }

    onSelectedPathChange?.(nextPath, item);
  }

  function selectColumnItem(columnIndex: number, itemIndex: number) {
    const column = explorerState.columns[columnIndex];
    const item = column?.items[itemIndex];

    if (!item) {
      return;
    }

    setFocusedColumnIndex(columnIndex);
    selectItem(item, columnIndex);
  }

  function getActiveItemIndex(columnIndex: number) {
    const column = explorerState.columns[columnIndex];
    const selectedId = explorerState.selectedPath[columnIndex];
    const selectedIndex = column?.items.findIndex((item) => item.id === selectedId) ?? -1;
    return selectedIndex >= 0 ? selectedIndex : 0;
  }

  function handleKeyboardNavigation(event: KeyboardEvent<HTMLDivElement>) {
    if (!keyboardNavigation) {
      return;
    }

    const columnIndex = Math.min(focusedColumnIndex, explorerState.columns.length - 1);
    const column = explorerState.columns[columnIndex];

    if (!column) {
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const currentIndex = getActiveItemIndex(columnIndex);
      const direction = event.key === 'ArrowDown' ? 1 : -1;
      const nextIndex = (currentIndex + direction + column.items.length) % column.items.length;
      selectColumnItem(columnIndex, nextIndex);
      return;
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      const selectedItem = column.items[getActiveItemIndex(columnIndex)];
      if (selectedItem?.children?.length) {
        selectColumnItem(columnIndex + 1, 0);
      }
      return;
    }

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (columnIndex > 0) {
        setFocusedColumnIndex(columnIndex - 1);
        const nextPath = explorerState.selectedPath.slice(0, columnIndex);
        if (selectedPath === undefined) {
          setUncontrolledSelectedPath(nextPath);
        }
      }
      return;
    }

    if (typeahead && event.key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
      typeaheadRef.current += event.key.toLocaleLowerCase();
      if (typeaheadTimerRef.current) {
        window.clearTimeout(typeaheadTimerRef.current);
      }
      typeaheadTimerRef.current = window.setTimeout(() => {
        typeaheadRef.current = '';
      }, 800);

      const nextIndex = column.items.findIndex((item) => item.label.toLocaleLowerCase().startsWith(typeaheadRef.current));
      if (nextIndex >= 0) {
        event.preventDefault();
        selectColumnItem(columnIndex, nextIndex);
      }
    }
  }

  if (items.length === 0) {
    return (
      <div {...explorerProps} className={getColumnExplorerClassName(className)} data-density={density} data-variant={variant} style={explorerStyle}>
        <div className="column-explorer__empty" role="status">
          <strong>{emptyTitle}</strong>
          <span>{emptyDescription}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      {...explorerProps}
      aria-label={ariaLabel}
      className={getColumnExplorerClassName(className)}
      data-density={density}
      data-has-preview={showPreview && explorerState.selectedItem ? 'true' : undefined}
      data-variant={variant}
      role="group"
      tabIndex={keyboardNavigation ? 0 : undefined}
      style={explorerStyle}
      onKeyDown={handleKeyboardNavigation}
    >
      <div className="column-explorer__body">
        <div className="column-explorer__columns" role="list" aria-label={`${ariaLabel} columns`}>
          {explorerState.columns.map((column, columnIndex) => (
            <section className="column-explorer__column" key={column.id} role="group" aria-label={column.label}>
              <header className="column-explorer__column-header">
                <strong>{column.label}</strong>
                <span>{column.items.length}</span>
              </header>

              <div className="column-explorer__column-list" role="list">
                {column.items.map((item) => {
                  const isSelected = explorerState.selectedPath[columnIndex] === item.id;
                  const itemHasChildren = hasChildren(item);
                  const tone = item.tone ?? 'default';

                  return (
                    <button
                      aria-current={isSelected ? 'true' : undefined}
                      aria-label={item.ariaLabel ?? item.label}
                      className="column-explorer__item"
                      data-loading={item.loading ? 'true' : undefined}
                      data-selected={isSelected ? 'true' : undefined}
                      data-tone={tone}
                      disabled={item.disabled || item.loading}
                      key={item.id}
                      type="button"
                      onFocus={() => setFocusedColumnIndex(columnIndex)}
                      onClick={() => selectItem(item, columnIndex)}
                    >
                      {showIcons || showStatus ? (
                        <span className="column-explorer__item-leading" aria-hidden="true">
                          {showStatus ? <span className="column-explorer__status-dot" data-tone={tone} /> : null}
                          {showIcons && item.icon ? <span className="column-explorer__item-icon">{item.icon}</span> : null}
                        </span>
                      ) : null}

                      <span className="column-explorer__item-copy">
                        <span className="column-explorer__item-label">{item.label}</span>
                        {showMetadata && item.description ? <span className="column-explorer__item-description">{item.description}</span> : null}
                      </span>

                      <span className="column-explorer__item-trailing">
                        {showMetadata && item.meta ? <span className="column-explorer__item-meta">{item.meta}</span> : null}
                        {showCounts && typeof item.count === 'number' ? <span className="column-explorer__item-count">{item.count}</span> : null}
                        {item.loading ? <Loader2 className="column-explorer__loading" size={15} aria-hidden="true" /> : null}
                        {itemHasChildren && !item.loading ? <ChevronRight size={15} aria-hidden="true" /> : null}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {showPreview && explorerState.selectedItem ? (
          <aside className="column-explorer__preview" aria-label="Selected item preview">
            {renderPreview
              ? renderPreview({
                  item: explorerState.selectedItem,
                  path: explorerState.selectedPath,
                  pathLabels: explorerState.pathLabels,
                })
              : getDefaultPreview({
                  item: explorerState.selectedItem,
                  path: explorerState.selectedPath,
                  pathLabels: explorerState.pathLabels,
                })}
          </aside>
        ) : null}
      </div>
    </div>
  );
}

export type { ColumnExplorerItem, ColumnExplorerProps, ColumnExplorerPreviewContext };
