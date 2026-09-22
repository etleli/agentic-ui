import { ChevronRight } from 'lucide-react';
import { useState, type CSSProperties } from 'react';
import { Tooltip } from '../../overlays/Tooltip';
import './TreeView.css';
import type { TreeViewItem, TreeViewProps } from './TreeView.types';

function getTreeViewClassName(className: TreeViewProps['className']) {
  return ['navigation-tree-view', className].filter(Boolean).join(' ');
}

function hasChildren(item: TreeViewItem) {
  return Array.isArray(item.children) && item.children.length > 0;
}

function flattenItemIds(items: TreeViewItem[]): Set<string> {
  const ids = new Set<string>();

  function collect(nextItems: TreeViewItem[]) {
    nextItems.forEach((item) => {
      ids.add(item.id);

      if (item.children) {
        collect(item.children);
      }
    });
  }

  collect(items);
  return ids;
}

function normalizeIds(ids: string[], items: TreeViewItem[]) {
  const validIds = flattenItemIds(items);

  return ids.filter((id) => validIds.has(id));
}

type TreeBranchProps = {
  expandedIds: string[];
  items: TreeViewItem[];
  level: number;
  selectedId?: string;
  showBadges: boolean;
  showDescriptions: boolean;
  showIcons: boolean;
  showStatus: boolean;
  onSelectItem: (item: TreeViewItem) => void;
  onToggleItem: (item: TreeViewItem) => void;
};

function TreeBranch({ expandedIds, items, level, selectedId, showBadges, showDescriptions, showIcons, showStatus, onSelectItem, onToggleItem }: TreeBranchProps) {
  function handleContentClick(item: TreeViewItem) {
    if (hasChildren(item)) {
      onToggleItem(item);
    }

    onSelectItem(item);
  }

  return (
    <ul className="navigation-tree-view__branch" role={level === 1 ? 'tree' : 'group'}>
      {items.map((item) => {
        const itemHasChildren = hasChildren(item);
        const isExpanded = expandedIds.includes(item.id);
        const isSelected = selectedId === item.id;
        const tone = item.tone ?? 'default';

        return (
          <li className="navigation-tree-view__item" key={item.id} role="treeitem" aria-expanded={itemHasChildren ? isExpanded : undefined} aria-selected={isSelected}>
            <div className="navigation-tree-view__row" data-selected={isSelected ? 'true' : undefined} style={{ '--tree-view-level': level } as CSSProperties}>
              <Tooltip
                className="navigation-tree-view__toggle-tooltip"
                content={itemHasChildren ? (isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`) : undefined}
                placement="right"
                size="compact"
              >
                <button
                  aria-label={isExpanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
                  className="navigation-tree-view__toggle"
                  data-expanded={isExpanded ? 'true' : undefined}
                  disabled={!itemHasChildren || item.disabled}
                  type="button"
                  onClick={() => onToggleItem(item)}
                >
                  <ChevronRight size={15} aria-hidden="true" />
                </button>
              </Tooltip>
              <button className="navigation-tree-view__content" disabled={item.disabled} type="button" onClick={() => handleContentClick(item)}>
                {showStatus ? <span className="navigation-tree-view__status" data-tone={tone} aria-hidden="true" /> : null}
                {showIcons && item.icon ? <span className="navigation-tree-view__icon">{item.icon}</span> : null}
                <span className="navigation-tree-view__copy">
                  <span className="navigation-tree-view__label">{item.label}</span>
                  {showDescriptions && item.description ? <span className="navigation-tree-view__description">{item.description}</span> : null}
                </span>
                {item.meta ? <span className="navigation-tree-view__meta">{item.meta}</span> : null}
                {showBadges && item.badge !== undefined && item.badge !== '' ? <span className="navigation-tree-view__badge">{item.badge}</span> : null}
              </button>
            </div>

            {itemHasChildren ? (
              <div className="navigation-tree-view__disclosure" aria-hidden={!isExpanded} data-collapsed={!isExpanded ? 'true' : undefined}>
                <div className="navigation-tree-view__disclosure-inner" inert={!isExpanded ? true : undefined}>
                  <TreeBranch
                    expandedIds={expandedIds}
                    items={item.children ?? []}
                    level={level + 1}
                    selectedId={selectedId}
                    showBadges={showBadges}
                    showDescriptions={showDescriptions}
                    showIcons={showIcons}
                    showStatus={showStatus}
                    onSelectItem={onSelectItem}
                    onToggleItem={onToggleItem}
                  />
                </div>
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}

export function TreeView({
  ariaLabel = 'Tree view',
  className,
  defaultExpandedIds = [],
  defaultSelectedId,
  density = 'comfortable',
  expandedIds,
  items,
  selectedId,
  showBadges = true,
  showDescriptions = true,
  showIcons = true,
  showStatus = true,
  variant = 'panel',
  onExpandedIdsChange,
  onSelect,
  ...treeViewProps
}: TreeViewProps) {
  const [uncontrolledExpandedIds, setUncontrolledExpandedIds] = useState(() => normalizeIds(defaultExpandedIds, items));
  const [uncontrolledSelectedId, setUncontrolledSelectedId] = useState(defaultSelectedId);
  const activeExpandedIds = normalizeIds(expandedIds ?? uncontrolledExpandedIds, items);
  const activeSelectedId = selectedId ?? uncontrolledSelectedId;

  function toggleItem(item: TreeViewItem) {
    if (!hasChildren(item) || item.disabled) {
      return;
    }

    const nextExpandedIds = activeExpandedIds.includes(item.id) ? activeExpandedIds.filter((id) => id !== item.id) : [...activeExpandedIds, item.id];

    if (expandedIds === undefined) {
      setUncontrolledExpandedIds(nextExpandedIds);
    }

    onExpandedIdsChange?.(nextExpandedIds);
  }

  function selectItem(item: TreeViewItem) {
    if (item.disabled) {
      return;
    }

    if (selectedId === undefined) {
      setUncontrolledSelectedId(item.id);
    }

    onSelect?.(item);
  }

  return (
    <div {...treeViewProps} aria-label={ariaLabel} className={getTreeViewClassName(className)} data-density={density} data-variant={variant} role="group">
      <TreeBranch
        expandedIds={activeExpandedIds}
        items={items}
        level={1}
        selectedId={activeSelectedId}
        showBadges={showBadges}
        showDescriptions={showDescriptions}
        showIcons={showIcons}
        showStatus={showStatus}
        onSelectItem={selectItem}
        onToggleItem={toggleItem}
      />
    </div>
  );
}

export type { TreeViewItem, TreeViewProps };
