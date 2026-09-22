import { useEffect, useMemo, useState } from 'react';
import { ListView } from './ListView';
import './ListView.examples.css';
import type { CSSProperties, ReactNode } from 'react';
import type {
  ListViewContentMode,
  ListViewCollapsedGroupIds,
  ListViewDensity,
  ListViewFilterAttribute,
  ListViewFilterState,
  ListViewItem,
  ListViewOrderAttribute,
  ListViewOrderDirection,
  ListViewOrderState,
  ListViewVerticalAlign,
} from './ListView.types';

export type ListViewRendererMode = 'default' | 'rich';

export type ListViewImportanceFilter = 'all' | 'high' | 'mid' | 'low' | 'high-mid';

export type ListViewGroupAttribute = 'importance' | 'title';

export type ListViewScenario = 'default' | 'sticky-selected-group' | 'long-labels' | 'empty-state' | 'many-items' | 'collapsed-selected-group' | 'disabled-items';

export type ListViewFirstItemContent = {
  description?: string;
  eyebrow?: string;
  indicatorColor?: string;
  meta?: string;
  richText?: string;
  title?: string;
};

type ListViewExampleProps = {
  contentMode?: ListViewContentMode;
  density?: ListViewDensity;
  enableFiltering?: boolean;
  enableGrouping?: boolean;
  enableOrdering?: boolean;
  enableSearch?: boolean;
  firstItemContent?: ListViewFirstItemContent;
  groupAttribute?: ListViewGroupAttribute;
  importanceFilter?: ListViewImportanceFilter;
  orderAttribute?: string;
  orderDirection?: ListViewOrderDirection;
  renderer?: ListViewRendererMode;
  scenario?: ListViewScenario;
  selectedIndex?: number;
  showIndicators?: boolean;
  verticalAlign?: ListViewVerticalAlign;
};

const defaultRichHtml = `<span style="display:flex; width:100%; gap:12px; align-items:center;">
  <span style="flex:1 1 0; min-width:0;">
    <span style="display:block; color:var(--color-muted); font-size:11px; font-weight:700;">Strategy</span>
    <strong style="display:block; color:var(--color-foreground);">Alpha</strong>
  </span>
  <span style="flex:1 1 0; min-width:0;">
    <span style="display:block; color:var(--color-muted); font-size:11px; font-weight:700;">State</span>
    <span style="display:block; color:var(--list-view-indicator-color); font-weight:700;">Online</span>
  </span>
  <span style="flex:1 1 0; min-width:0;">
    <span style="display:block; color:var(--color-muted); font-size:11px; font-weight:700;">Score</span>
    <span style="display:block; color:var(--color-foreground);">94</span>
  </span>
  <span style="flex:1 1 0; min-width:0; text-align:right;">
    <span style="display:block; color:var(--color-muted); font-size:11px; font-weight:700;">Latency</span>
    <span style="display:block; color:var(--color-foreground);">12 ms</span>
  </span>
</span>`;

const defaultFirstItemContent: Required<ListViewFirstItemContent> = {
  description: 'Signal evaluation and ranking are active.',
  eyebrow: 'Runtime',
  indicatorColor: 'var(--color-trading-positive)',
  meta: 'Online',
  richText: defaultRichHtml,
  title: 'Strategy engine',
};

const importanceFilterAttributes: ListViewFilterAttribute[] = [
  {
    id: 'importance',
    label: 'Importance',
    options: [
      { label: 'High', value: 'high', color: 'var(--color-trading-negative)' },
      { label: 'Mid', value: 'mid', color: 'var(--color-trading-warning)' },
      { label: 'Low', value: 'low', color: 'var(--color-trading-positive)' },
    ],
  },
];

const listViewOrderAttributes: ListViewOrderAttribute[] = [
  {
    id: 'importance',
    label: 'Importance',
    type: 'enum',
    order: ['high', 'mid', 'low'],
  },
  {
    id: 'title',
    label: 'Title',
    type: 'text',
  },
];

const baseStrategyItems: ListViewItem[] = [
  {
    id: 'strategy-engine',
    attributes: {
      importance: 'high',
      title: 'Strategy engine',
    },
    eyebrow: defaultFirstItemContent.eyebrow,
    title: defaultFirstItemContent.title,
    description: defaultFirstItemContent.description,
    indicatorColor: defaultFirstItemContent.indicatorColor,
    meta: defaultFirstItemContent.meta,
    tone: 'positive',
  },
  {
    id: 'risk-gateway',
    attributes: {
      importance: 'mid',
      title: 'Risk gateway',
    },
    eyebrow: 'Controls',
    title: 'Risk gateway',
    description: 'Position limits are near the warning threshold.',
    meta: 'Watch',
    tone: 'warning',
  },
  {
    id: 'order-router',
    attributes: {
      importance: 'low',
      title: 'Order router',
    },
    eyebrow: 'Execution',
    title: 'Order router',
    description: 'Broker route is paused for review.',
    meta: 'Paused',
    tone: 'negative',
  },
];

const stickySelectedGroupItems: ListViewItem[] = [
  {
    id: 'ingest-market-data',
    attributes: { importance: 'high', title: 'Ingest market data' },
    eyebrow: 'Source',
    title: 'Ingest market data',
    description: 'Realtime quote stream is connected.',
    indicatorColor: 'var(--color-trading-positive)',
    meta: 'Live',
    tone: 'positive',
  },
  {
    id: 'normalize-bars',
    attributes: { importance: 'high', title: 'Normalize bars' },
    eyebrow: 'Source',
    title: 'Normalize bars',
    description: 'OHLCV data is aligned to the active interval.',
    meta: 'Ready',
    tone: 'positive',
  },
  {
    id: 'detect-stale-feed',
    attributes: { importance: 'high', title: 'Detect stale feed' },
    eyebrow: 'Guard',
    title: 'Detect stale feed',
    description: 'Feed freshness checks are running.',
    meta: '8s',
    tone: 'warning',
  },
  {
    id: 'screen-universe',
    attributes: { importance: 'high', title: 'Screen universe' },
    eyebrow: 'Signal',
    title: 'Screen universe',
    description: 'Liquidity and spread filters are applied.',
    meta: '214',
    tone: 'accent',
  },
  {
    id: 'score-candidates',
    attributes: { importance: 'high', title: 'Score candidates' },
    eyebrow: 'Signal',
    title: 'Score candidates',
    description: 'Momentum score update is in progress.',
    meta: '72%',
    tone: 'accent',
  },
  {
    id: 'risk-envelope',
    attributes: { importance: 'mid', title: 'Risk envelope' },
    eyebrow: 'Risk',
    title: 'Risk envelope',
    description: 'Portfolio exposure is inside the current limit.',
    meta: 'OK',
    tone: 'positive',
  },
  {
    id: 'rebalance-plan',
    attributes: { importance: 'mid', title: 'Rebalance plan' },
    eyebrow: 'Risk',
    title: 'Rebalance plan',
    description: 'Target weights are being compared with current positions.',
    meta: 'Draft',
    tone: 'warning',
  },
  {
    id: 'cash-check',
    attributes: { importance: 'mid', title: 'Cash check' },
    eyebrow: 'Risk',
    title: 'Cash check',
    description: 'Buying power and settlement buffer are available.',
    meta: '$48K',
    tone: 'positive',
  },
  {
    id: 'broker-route',
    attributes: { importance: 'mid', title: 'Broker route' },
    eyebrow: 'Execution',
    title: 'Broker route',
    description: 'Primary broker is selected for the next order packet.',
    meta: 'IBKR',
    tone: 'accent',
  },
  {
    id: 'manual-review',
    attributes: { importance: 'mid', title: 'Manual review' },
    eyebrow: 'Execution',
    title: 'Manual review',
    description: 'Selected row sits inside the group that should stay highlighted while sticky.',
    indicatorColor: 'var(--color-accent)',
    meta: 'Selected',
    tone: 'accent',
  },
  {
    id: 'order-slicing',
    attributes: { importance: 'mid', title: 'Order slicing' },
    eyebrow: 'Execution',
    title: 'Order slicing',
    description: 'Child order sizing follows liquidity tiers.',
    meta: 'Auto',
    tone: 'neutral',
  },
  {
    id: 'submit-paper',
    attributes: { importance: 'low', title: 'Submit paper' },
    eyebrow: 'Paper',
    title: 'Submit paper',
    description: 'Simulation order was accepted by the paper broker.',
    meta: 'Queued',
    tone: 'neutral',
  },
  {
    id: 'confirm-fill',
    attributes: { importance: 'low', title: 'Confirm fill' },
    eyebrow: 'Paper',
    title: 'Confirm fill',
    description: 'Fill confirmation is pending simulated execution.',
    meta: 'Pending',
    tone: 'warning',
  },
  {
    id: 'write-audit',
    attributes: { importance: 'low', title: 'Write audit' },
    eyebrow: 'Audit',
    title: 'Write audit',
    description: 'Decision metadata is ready for the audit trail.',
    meta: 'Ready',
    tone: 'positive',
  },
  {
    id: 'notify-operator',
    attributes: { importance: 'low', title: 'Notify operator' },
    eyebrow: 'Audit',
    title: 'Notify operator',
    description: 'Operator summary will include the selected workflow group.',
    meta: 'Later',
    tone: 'neutral',
  },
];

const longLabelItems: ListViewItem[] = [
  {
    id: 'long-runtime-summary',
    attributes: { importance: 'high', title: 'Long runtime summary' },
    eyebrow: 'Runtime status with a deliberately long eyebrow label',
    title: 'A very long strategy orchestration label that should wrap without clipping the trailing metadata column',
    description:
      'This preview row uses intentionally verbose copy so the component can be checked for wrapping, height stability, and readable selected-state styling.',
    indicatorColor: 'var(--color-accent)',
    meta: 'Selected with long trailing content',
    tone: 'accent',
  },
  {
    id: 'long-risk-review',
    attributes: { importance: 'mid', title: 'Long risk review' },
    eyebrow: 'Risk',
    title: 'Portfolio-wide risk review awaiting operator confirmation across several broker accounts',
    description: 'Long descriptions must not overlap the status stripe, count badge, or selected-state outline.',
    meta: 'Manual approval required',
    tone: 'warning',
  },
  {
    id: 'long-audit-log',
    attributes: { importance: 'low', title: 'Long audit log' },
    eyebrow: 'Audit',
    title: 'Audit writer preparing a detailed explanation for the latest automated rebalance recommendation',
    description: 'The row should stay legible in compact, comfortable, and spacious density modes.',
    meta: 'Ready',
    tone: 'positive',
  },
];

const disabledItems: ListViewItem[] = [
  {
    id: 'enabled-source',
    attributes: { importance: 'high', title: 'Enabled source' },
    eyebrow: 'Source',
    title: 'Enabled source',
    description: 'This item can still be selected manually.',
    meta: 'Ready',
    tone: 'positive',
  },
  {
    id: 'disabled-router',
    attributes: { importance: 'mid', title: 'Disabled router' },
    disabled: true,
    eyebrow: 'Execution',
    title: 'Disabled router',
    description: 'Disabled rows keep their display state but do not fire selection changes.',
    meta: 'Disabled',
    tone: 'negative',
  },
  {
    id: 'enabled-audit',
    attributes: { importance: 'low', title: 'Enabled audit' },
    eyebrow: 'Audit',
    title: 'Enabled audit',
    description: 'A second enabled row keeps the interaction comparison visible.',
    meta: 'Ready',
    tone: 'neutral',
  },
];

const manyItems: ListViewItem[] = Array.from({ length: 24 }, (_, index) => {
  const group: 'high' | 'mid' | 'low' = index < 8 ? 'high' : index < 16 ? 'mid' : 'low';
  const tone = group === 'high' ? 'accent' : group === 'mid' ? 'warning' : 'neutral';
  const rowNumber = String(index + 1).padStart(2, '0');

  return {
    id: `workflow-checkpoint-${rowNumber}`,
    attributes: {
      importance: group,
      title: `Workflow checkpoint ${rowNumber}`,
    },
    eyebrow: group === 'high' ? 'Signal' : group === 'mid' ? 'Risk' : 'Audit',
    title: `Workflow checkpoint ${rowNumber}`,
    description: `Generated row ${rowNumber} for scrolling, sticky headers, grouping, and selection stress testing.`,
    meta: index === 13 ? 'Selected' : `${index + 1}/24`,
    tone,
  };
});

function optionalText(value: string | undefined): string | undefined {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
}

function getRichTextLines(value: string | undefined): string[] {
  return (
    value
      ?.split('\n')
      .map((line) => line.trim())
      .filter(Boolean) ?? []
  );
}

function getRichTextSource(value: string | undefined): string {
  return optionalText(value) ?? defaultFirstItemContent.richText;
}

function looksLikeHtml(value: string): boolean {
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

function getPlainTextFromHtml(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function sanitizeRichHtml(value: string): string {
  if (typeof document === 'undefined') {
    return '';
  }

  const template = document.createElement('template');
  template.innerHTML = value;
  const blockedTags = new Set(['base', 'embed', 'iframe', 'link', 'meta', 'object', 'script', 'style']);
  const urlAttributes = new Set(['action', 'href', 'src', 'xlink:href']);

  template.content.querySelectorAll('*').forEach((element) => {
    if (blockedTags.has(element.localName)) {
      element.remove();
      return;
    }

    [...element.attributes].forEach((attribute) => {
      const attributeName = attribute.name.toLowerCase();
      const attributeValue = attribute.value.trim();

      if (
        attributeName.startsWith('on') ||
        attributeName === 'srcdoc' ||
        (urlAttributes.has(attributeName) && /^(javascript:|data:text\/html)/i.test(attributeValue))
      ) {
        element.removeAttribute(attribute.name);
      }
    });
  });

  return template.innerHTML;
}

function normalizeSelectedIndex(selectedIndex: number | undefined, itemCount: number): number {
  if (itemCount === 0) {
    return -1;
  }

  if (selectedIndex === undefined || !Number.isFinite(selectedIndex)) {
    return 0;
  }

  return Math.min(Math.max(Math.trunc(selectedIndex), 0), itemCount - 1);
}

function getCodeFilterState(importanceFilter: ListViewImportanceFilter): ListViewFilterState {
  if (importanceFilter === 'all') {
    return {};
  }

  if (importanceFilter === 'high-mid') {
    return {
      importance: ['high', 'mid'],
    };
  }

  return {
    importance: [importanceFilter],
  };
}

function getCodeOrdering(orderAttribute: string, direction: ListViewOrderDirection): ListViewOrderState | undefined {
  if (!orderAttribute || orderAttribute === 'default') {
    return undefined;
  }

  return {
    attributeId: orderAttribute,
    direction,
  };
}

function getScenarioItems(scenario: ListViewScenario, firstItemContent: ListViewFirstItemContent | undefined, renderer: ListViewRendererMode): ListViewItem[] {
  if (scenario === 'empty-state') {
    return [];
  }

  if (scenario === 'long-labels') {
    return longLabelItems;
  }

  if (scenario === 'disabled-items') {
    return disabledItems;
  }

  if (scenario === 'many-items') {
    return manyItems;
  }

  if (scenario === 'sticky-selected-group' || scenario === 'collapsed-selected-group') {
    return stickySelectedGroupItems;
  }

  return buildStrategyItems(firstItemContent, renderer);
}

function isGroupedScenario(scenario: ListViewScenario): boolean {
  return scenario === 'sticky-selected-group' || scenario === 'collapsed-selected-group' || scenario === 'many-items';
}

function getCodeCollapsedGroupIds(scenario: ListViewScenario): ListViewCollapsedGroupIds {
  return scenario === 'collapsed-selected-group' ? ['mid'] : [];
}

function renderRichTextComponent(richText: string | undefined, indicatorColor: string | undefined): ReactNode {
  const richTextSource = getRichTextSource(richText);

  if (looksLikeHtml(richTextSource)) {
    return (
      <span
        className="strategy-runtime-rich-text"
        style={
          {
            '--strategy-runtime-accent': indicatorColor ?? 'var(--color-trading-positive)',
          } as CSSProperties
        }
        dangerouslySetInnerHTML={{ __html: sanitizeRichHtml(richTextSource) }}
      />
    );
  }

  const richTextLines = getRichTextLines(richTextSource);

  return (
    <span
      className="strategy-runtime-rich-text"
      style={
        {
          '--strategy-runtime-accent': indicatorColor ?? 'var(--color-trading-positive)',
        } as CSSProperties
      }
    >
      {richTextLines.map((line, index) => (
        <span className={index === 0 ? 'strategy-runtime-rich-text__headline' : 'strategy-runtime-rich-text__line'} key={`${line}-${index}`}>
          {line}
        </span>
      ))}
    </span>
  );
}

function buildStrategyItems(firstItemContent: ListViewFirstItemContent | undefined, renderer: ListViewRendererMode): ListViewItem[] {
  const firstItemValues = {
    ...defaultFirstItemContent,
    ...firstItemContent,
  };
  const [firstItem, ...remainingItems] = baseStrategyItems;
  const indicatorColor = optionalText(firstItemValues.indicatorColor);
  const firstItemAttributes = {
    ...firstItem.attributes,
    title: optionalText(firstItemValues.title) ?? defaultFirstItemContent.title,
  };

  if (renderer === 'rich') {
    const richText = getRichTextSource(firstItemValues.richText);
    const richTextLabel = looksLikeHtml(richText) ? getPlainTextFromHtml(richText) : getRichTextLines(richText)[0];

    return [
      {
        ...firstItem,
        ariaLabel: richTextLabel,
        attributes: firstItemAttributes,
        content: renderRichTextComponent(richText, indicatorColor),
        description: undefined,
        eyebrow: undefined,
        indicatorColor,
        meta: undefined,
        title: undefined,
      },
      ...remainingItems,
    ];
  }

  return [
    {
      ...firstItem,
      attributes: firstItemAttributes,
      description: optionalText(firstItemValues.description),
      eyebrow: optionalText(firstItemValues.eyebrow),
      indicatorColor,
      meta: optionalText(firstItemValues.meta),
      title: optionalText(firstItemValues.title),
    },
    ...remainingItems,
  ];
}

export function ListViewExample({
  contentMode = 'full',
  density = 'comfortable',
  enableFiltering = false,
  enableGrouping = false,
  enableOrdering = false,
  enableSearch = false,
  firstItemContent,
  groupAttribute = 'importance',
  importanceFilter = 'all',
  orderAttribute = 'default',
  orderDirection = 'asc',
  renderer = 'default',
  scenario = 'default',
  selectedIndex,
  showIndicators = true,
  verticalAlign = 'top',
}: ListViewExampleProps) {
  const isForcedGroupedScenario = isGroupedScenario(scenario);
  const strategyItems = useMemo(
    () => getScenarioItems(scenario, firstItemContent, renderer),
    [firstItemContent, renderer, scenario],
  );
  const codeSelectedIndex = normalizeSelectedIndex(selectedIndex, strategyItems.length);
  const codeSelectedItemId = strategyItems[codeSelectedIndex]?.id;
  const codeCollapsedGroupIds = useMemo(() => getCodeCollapsedGroupIds(scenario), [scenario]);
  const codeFilterState = useMemo(() => getCodeFilterState(importanceFilter), [importanceFilter]);
  const codeOrdering = useMemo(() => getCodeOrdering(orderAttribute, orderDirection), [orderAttribute, orderDirection]);
  const [activeCollapsedGroupIds, setActiveCollapsedGroupIds] = useState<ListViewCollapsedGroupIds>(codeCollapsedGroupIds);
  const [selectedItemId, setSelectedItemId] = useState(codeSelectedItemId);
  const [activeFilters, setActiveFilters] = useState<ListViewFilterState>(codeFilterState);
  const [activeOrdering, setActiveOrdering] = useState<ListViewOrderState | undefined>(codeOrdering);
  const selectedItem = strategyItems.find((item) => item.id === selectedItemId);
  const selectedLabel = selectedItem?.title ?? selectedItem?.ariaLabel ?? selectedItem?.id;

  useEffect(() => {
    setSelectedItemId(codeSelectedItemId);
  }, [codeSelectedItemId]);

  useEffect(() => {
    setActiveCollapsedGroupIds(codeCollapsedGroupIds);
  }, [codeCollapsedGroupIds]);

  useEffect(() => {
    setActiveFilters(codeFilterState);
  }, [codeFilterState]);

  useEffect(() => {
    setActiveOrdering(codeOrdering);
  }, [codeOrdering]);

  return (
    <div className={['list-view-example', isForcedGroupedScenario ? 'list-view-example--sticky-selected-group' : undefined].filter(Boolean).join(' ')}>
      <ListView
        ariaLabel="Strategy service status"
        className="list-view-example__list"
        collapsedGroupIds={activeCollapsedGroupIds}
        contentMode={contentMode}
        density={density}
        enableFiltering={enableFiltering}
        enableGrouping={isForcedGroupedScenario || enableGrouping}
        enableOrdering={enableOrdering}
        enableSearch={enableSearch}
        filterAttributes={importanceFilterAttributes}
        filters={activeFilters}
        groupAttributeId={isForcedGroupedScenario ? 'importance' : groupAttribute}
        items={strategyItems}
        ordering={activeOrdering}
        orderAttributes={listViewOrderAttributes}
        searchPlaceholder="Search rows"
        showIndicators={showIndicators}
        selectedId={selectedItemId}
        verticalAlign={verticalAlign}
        onCollapsedGroupIdsChange={setActiveCollapsedGroupIds}
        onFiltersChange={setActiveFilters}
        onOrderingChange={setActiveOrdering}
        onSelect={(item) => setSelectedItemId(item.id)}
      />

      {selectedItem && selectedLabel ? (
        <div className="list-view-example__note" role="status">
          <span>Selected</span>
          <strong>{selectedLabel}</strong>
        </div>
      ) : null}
    </div>
  );
}
