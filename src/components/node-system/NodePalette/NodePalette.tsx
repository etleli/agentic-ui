import { useEffect, useMemo, useState, type CSSProperties, type DragEvent, type KeyboardEvent } from 'react';
import { SearchInput } from '../../inputs/SearchInput';
import { ListView } from '../../lists/ListView';
import type { ListViewItem } from '../../lists/ListView';
import '../NodeSystem.css';
import type { NodePaletteDragPayload, NodePalettePlacementRequest, NodePaletteProps, NodePaletteTemplate, NodeTone } from '../NodeSystem.types';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';
import { getNodePaletteDragPayload, setNodePaletteDragData } from './NodePalette.utils';

function getPaletteClassName(className: NodePaletteProps['className']) {
  return ['node-system-palette', className].filter(Boolean).join(' ');
}

function filterTemplates(templates: NodePaletteTemplate[], query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery) {
    return templates;
  }

  return templates.filter((template) =>
    [template.label, template.description, template.meta].some((value) => String(value ?? '').toLowerCase().includes(normalizedQuery)),
  );
}

export function NodePalette({
  className,
  defaultQuery = '',
  defaultSelectedTemplateId,
  emptyDescription = 'Try another search term.',
  emptyTitle = 'No templates',
  query,
  selectedTemplateId,
  showSearch = true,
  templates,
  onTemplateDragStart,
  onTemplatePlacementRequest,
  onTemplateUnavailable,
  onQueryChange,
  onSelectedTemplateChange,
  ...paletteProps
}: NodePaletteProps) {
  const [internalQuery, setInternalQuery] = useState(query ?? defaultQuery);
  const [internalSelectedTemplateId, setInternalSelectedTemplateId] = useState(selectedTemplateId ?? defaultSelectedTemplateId ?? templates[0]?.id);
  const activeQuery = query ?? internalQuery;
  const activeSelectedTemplateId = selectedTemplateId ?? internalSelectedTemplateId;
  const filteredTemplates = useMemo(() => filterTemplates(templates, activeQuery), [activeQuery, templates]);
  const templateMap = useMemo(() => new Map(templates.map((template) => [template.id, template])), [templates]);
  const listItems = useMemo<ListViewItem[]>(
    () =>
      filteredTemplates.map((template) => {
        const templateColor = template.color ?? getThemeGeneratedColorForKey(template.dataType ?? template.id);
        const isUnavailable = template.unavailableReason !== undefined;

        return {
          attributes: { type: template.meta ?? 'template' },
          content: (
          <span
            aria-label={isUnavailable ? `${template.label}. Unavailable: ${template.unavailableReason}` : `Drag ${template.label} into the graph canvas`}
            className="node-system-palette__item-content"
            data-unavailable={isUnavailable ? 'true' : undefined}
            draggable={!template.disabled && !isUnavailable}
            style={{ '--node-system-palette-color': templateColor } as CSSProperties}
            onDragStart={(event: DragEvent<HTMLSpanElement>) => {
              if (template.disabled || isUnavailable) {
                event.preventDefault();
                return;
              }

              const payload = getNodePaletteDragPayload(template);
              setNodePaletteDragData(event.dataTransfer, payload);
              onTemplateDragStart?.(payload, template, event);
            }}
          >
            {template.icon ? <span className="node-system-palette__item-icon">{template.icon}</span> : null}
            <span className="node-system-palette__item-copy">
              <span className="node-system-palette__item-label">{template.label}</span>
              {template.description ? <span className="node-system-palette__item-description">{template.description}</span> : null}
            </span>
          </span>
          ),
          disabled: template.disabled,
          id: template.id,
          indicatorColor: templateColor,
          meta: template.meta,
          title: template.label,
          tone: template.tone ?? 'neutral',
        };
      }),
    [filteredTemplates, onTemplateDragStart],
  );

  useEffect(() => {
    if (query !== undefined) {
      setInternalQuery(query);
    }
  }, [query]);

  useEffect(() => {
    if (selectedTemplateId !== undefined) {
      setInternalSelectedTemplateId(selectedTemplateId);
    }
  }, [selectedTemplateId]);

  function changeQuery(nextQuery: string) {
    if (query === undefined) {
      setInternalQuery(nextQuery);
    }

    onQueryChange?.(nextQuery);
  }

  function selectTemplate(template: NodePaletteTemplate) {
    if (template.disabled) {
      return;
    }

    if (template.unavailableReason) {
      onTemplateUnavailable?.(template);
      return;
    }

    if (selectedTemplateId === undefined) {
      setInternalSelectedTemplateId(template.id);
    }

    onSelectedTemplateChange?.(template.id, template);
  }

  function requestTemplatePlacement(template: NodePaletteTemplate, source: NodePalettePlacementRequest['source']) {
    if (template.disabled) {
      return;
    }

    if (template.unavailableReason) {
      onTemplateUnavailable?.(template);
      return;
    }

    onTemplatePlacementRequest?.({ source, template });
  }

  function handlePaletteKeyDown(event: KeyboardEvent<HTMLElement>) {
    if ((event.key !== 'Enter' && event.key !== ' ') || event.target instanceof HTMLInputElement) {
      return;
    }

    const template = activeSelectedTemplateId ? templateMap.get(activeSelectedTemplateId) : undefined;

    if (!template) {
      return;
    }

    event.preventDefault();
    requestTemplatePlacement(template, 'keyboard');
  }

  return (
    <aside {...paletteProps} aria-keyshortcuts="Enter Space" className={getPaletteClassName(className)} aria-label="Node palette" tabIndex={0} onKeyDown={handlePaletteKeyDown}>
      <header className="node-system-palette__header">
        <strong className="node-system-palette__title">Node Palette</strong>
        <span className="node-system-palette__description">Templates for graph workflows.</span>
      </header>

      {showSearch ? <SearchInput ariaLabel="Search node templates" placeholder="Search nodes" value={activeQuery} onValueChange={changeQuery} /> : null}

      <ListView
        ariaLabel="Node templates"
        className="node-system-palette__list"
        contentMode="summary"
        density="compact"
        emptyDescription={emptyDescription}
        emptyTitle={emptyTitle}
        items={listItems}
        selectedId={activeSelectedTemplateId}
        verticalAlign="top"
        onSelect={(item) => {
          const template = templateMap.get(item.id);

          if (template) {
            selectTemplate(template);
          }
        }}
      />
    </aside>
  );
}

export type { NodePaletteDragPayload, NodePalettePlacementRequest, NodePaletteProps, NodePaletteTemplate, NodeTone };
