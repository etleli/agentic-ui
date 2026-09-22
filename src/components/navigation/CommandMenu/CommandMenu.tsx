import { Command, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import './CommandMenu.css';
import type { CommandMenuItem, CommandMenuProps } from './CommandMenu.types';

function getCommandMenuClassName(className: CommandMenuProps['className']) {
  return ['command-menu', className].filter(Boolean).join(' ');
}

function matchesQuery(item: CommandMenuItem, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return true;
  }

  const searchable = [item.label, item.description, item.section, item.shortcut, ...(item.keywords ?? [])].filter(Boolean).join(' ').toLowerCase();

  return searchable.includes(normalizedQuery);
}

function groupItems(items: CommandMenuItem[], showSections: boolean) {
  return items.reduce<Array<{ items: CommandMenuItem[]; label: string }>>((groups, item) => {
    const groupLabel = showSections ? (item.section ?? 'Commands') : 'Commands';
    const existingGroup = groups.find((group) => group.label === groupLabel);

    if (existingGroup) {
      existingGroup.items.push(item);
      return groups;
    }

    return [...groups, { items: [item], label: groupLabel }];
  }, []);
}

export function CommandMenu({
  ariaLabel = 'Command menu',
  className,
  defaultQuery = '',
  density = 'comfortable',
  emptyDescription = 'Try a different query.',
  emptyTitle = 'No commands found',
  items,
  maxResults = 8,
  placeholder = 'Search commands',
  query,
  showSections = true,
  showShortcuts = true,
  variant = 'panel',
  onQueryChange,
  onSelect,
  ...commandMenuProps
}: CommandMenuProps) {
  const [uncontrolledQuery, setUncontrolledQuery] = useState(defaultQuery);
  const activeQuery = query ?? uncontrolledQuery;
  const filteredItems = useMemo(() => items.filter((item) => matchesQuery(item, activeQuery)).slice(0, maxResults), [activeQuery, items, maxResults]);
  const groups = useMemo(() => groupItems(filteredItems, showSections), [filteredItems, showSections]);

  function changeQuery(nextQuery: string) {
    if (query === undefined) {
      setUncontrolledQuery(nextQuery);
    }

    onQueryChange?.(nextQuery);
  }

  function selectItem(item: CommandMenuItem) {
    if (item.disabled) {
      return;
    }

    onSelect?.(item);
  }

  return (
    <div {...commandMenuProps} aria-label={ariaLabel} className={getCommandMenuClassName(className)} data-density={density} data-variant={variant} role="group">
      <label className="command-menu__search">
        <Search size={16} aria-hidden="true" />
        <input aria-label={placeholder} placeholder={placeholder} type="search" value={activeQuery} onChange={(event) => changeQuery(event.target.value)} />
        <Command size={15} aria-hidden="true" />
      </label>

      <div className="command-menu__results" role="listbox" aria-label="Command results">
        {groups.length > 0 ? (
          groups.map((group) => (
            <section className="command-menu__group" key={group.label}>
              {showSections ? <strong className="command-menu__group-label">{group.label}</strong> : null}
              <div className="command-menu__items">
                {group.items.map((item) => {
                  const tone = item.tone ?? 'default';

                  return (
                    <button
                      className="command-menu__item"
                      data-tone={tone}
                      disabled={item.disabled}
                      key={item.id}
                      role="option"
                      type="button"
                      onClick={() => selectItem(item)}
                    >
                      {item.icon ? <span className="command-menu__icon">{item.icon}</span> : null}
                      <span className="command-menu__copy">
                        <span className="command-menu__label">{item.label}</span>
                        {item.description ? <span className="command-menu__description">{item.description}</span> : null}
                      </span>
                      {showShortcuts && item.shortcut ? <kbd className="command-menu__shortcut">{item.shortcut}</kbd> : null}
                    </button>
                  );
                })}
              </div>
            </section>
          ))
        ) : (
          <div className="command-menu__empty" role="status">
            <strong>{emptyTitle}</strong>
            <span>{emptyDescription}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export type { CommandMenuItem, CommandMenuProps };
