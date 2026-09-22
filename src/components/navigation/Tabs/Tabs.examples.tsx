import { Activity, Bell, Settings } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs } from './Tabs';
import './Tabs.examples.css';
import type { TabsDensity, TabsItem, TabsOrientation, TabsVariant } from './Tabs.types';

export type TabsExampleProps = {
  density?: TabsDensity;
  orientation?: TabsOrientation;
  selectedTabId?: string;
  showBadges?: boolean;
  showDescriptions?: boolean;
  showPanels?: boolean;
  variant?: TabsVariant;
};

const tabItems: TabsItem[] = [
  {
    badge: 4,
    description: 'Live strategy state',
    icon: <Activity size={16} aria-hidden="true" />,
    id: 'runtime',
    label: 'Runtime',
    panel: 'Strategy engine, risk gateway, and order router are online.',
  },
  {
    badge: 2,
    description: 'Actionable alerts',
    icon: <Bell size={16} aria-hidden="true" />,
    id: 'alerts',
    label: 'Alerts',
    panel: 'Two risk warnings need review before the next rebalance.',
  },
  {
    description: 'Workspace controls',
    icon: <Settings size={16} aria-hidden="true" />,
    id: 'settings',
    label: 'Settings',
    panel: 'Simulation cadence, broker mode, and data freshness are configured here.',
  },
];

export function TabsExample({
  density = 'comfortable',
  orientation = 'horizontal',
  selectedTabId = 'runtime',
  showBadges = true,
  showDescriptions = true,
  showPanels = true,
  variant = 'line',
}: TabsExampleProps) {
  const [currentTabId, setCurrentTabId] = useState(selectedTabId);
  const items = tabItems.map((item) => ({
    ...item,
    badge: showBadges ? item.badge : undefined,
    description: showDescriptions ? item.description : undefined,
  }));

  useEffect(() => {
    setCurrentTabId(selectedTabId);
  }, [selectedTabId]);

  return (
    <div className="tabs-example">
      <Tabs
        ariaLabel="Workspace sections"
        density={density}
        items={items}
        orientation={orientation}
        showPanels={showPanels}
        value={currentTabId}
        variant={variant}
        renderPanel={(item) => (
          <div className="tabs-example__panel">
            <strong>{item.label}</strong>
            <span>{item.panel}</span>
          </div>
        )}
        onValueChange={setCurrentTabId}
      />
    </div>
  );
}
