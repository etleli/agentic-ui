import { useEffect, useState } from 'react';
import { DeltaIndicator, StatusBadge } from '../../feedback';
import { PropertyList } from './PropertyList';
import type { PropertyListColumns, PropertyListDensity, PropertyListItem, PropertyListVariant } from './PropertyList.types';

export type PropertyListScenario = 'default' | 'empty-state' | 'long-labels' | 'many-items';

export type PropertyListExampleProps = {
  columns?: PropertyListColumns;
  density?: PropertyListDensity;
  scenario?: PropertyListScenario;
  selectedIndex?: number;
  selectable?: boolean;
  showDividers?: boolean;
  showStatus?: boolean;
  variant?: PropertyListVariant;
};

const defaultItems: PropertyListItem[] = [
  {
    description: 'Current strategy operating mode.',
    id: 'mode',
    label: 'Mode',
    meta: 'Runtime',
    tone: 'accent',
    value: 'Simulate',
  },
  {
    description: 'Configured maximum account exposure.',
    id: 'exposure',
    label: 'Max exposure',
    meta: 'Risk',
    tone: 'warning',
    value: '42%',
  },
  {
    description: 'Latest signal movement from the strategy engine.',
    id: 'signal',
    label: 'Signal delta',
    meta: 'Live',
    tone: 'positive',
    value: <DeltaIndicator precision={2} showIcon size="compact" unit="%" value={2.48} variant="plain" />,
  },
  {
    description: 'Broker route selected for the current run.',
    id: 'broker',
    label: 'Broker',
    meta: 'Paper',
    value: 'Alpaca',
  },
];

const longLabelItems: PropertyListItem[] = defaultItems.map((item, index) => ({
  ...item,
  description:
    index === 0
      ? 'This deliberately verbose description checks wrapping, row height, selected styling, and two-column layout behavior in compact preview widths.'
      : `${item.description} Extended text keeps the edge case visible without needing custom data entry.`,
  label: index === 0 ? 'Very long configuration property label for runtime strategy orchestration mode' : `${item.label} with extended label`,
  meta: index === 0 ? 'Runtime state metadata with long text' : item.meta,
}));

const manyItems: PropertyListItem[] = Array.from({ length: 14 }, (_, index) => {
  const template = defaultItems[index % defaultItems.length];

  return {
    ...template,
    id: `${template.id}-${index + 1}`,
    label: `${template.label} ${String(index + 1).padStart(2, '0')}`,
    description: `Generated property row ${index + 1} for density, wrapping, selected-state, and scrolling QA.`,
    meta: index % 2 === 0 ? 'Runtime' : 'Risk',
  };
});

function getScenarioItems(scenario: PropertyListScenario): PropertyListItem[] {
  if (scenario === 'empty-state') {
    return [];
  }

  if (scenario === 'long-labels') {
    return longLabelItems;
  }

  if (scenario === 'many-items') {
    return manyItems;
  }

  return defaultItems;
}

function getItems(showStatus: boolean, scenario: PropertyListScenario): PropertyListItem[] {
  return getScenarioItems(scenario).map((item) =>
    item.id === 'mode'
      ? {
          ...item,
          value: showStatus ? <StatusBadge animated={false} showDot size="compact" status="online" /> : 'Simulate',
        }
      : item,
  );
}

export function PropertyListExample({
  columns = 'one',
  density = 'comfortable',
  scenario = 'default',
  selectedIndex = 0,
  selectable = true,
  showDividers = true,
  showStatus = true,
  variant = 'panel',
}: PropertyListExampleProps) {
  const [activeIndex, setActiveIndex] = useState(selectedIndex);

  useEffect(() => {
    setActiveIndex(selectedIndex);
  }, [selectedIndex]);

  return (
    <PropertyList
      columns={columns}
      density={density}
      items={getItems(showStatus, scenario)}
      selectable={selectable}
      selectedIndex={activeIndex}
      showDividers={showDividers}
      variant={variant}
      onSelectedItemChange={setActiveIndex}
    />
  );
}
