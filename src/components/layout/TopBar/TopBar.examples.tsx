import { Bell, Play, Settings } from 'lucide-react';
import { TopBar } from './TopBar';
import type { TopBarProps } from '../Layout.types';

export type TopBarExampleProps = TopBarProps;

export function TopBarExample({
  brand = 'Agentic UI',
  density = 'comfortable',
  selectedActionId = 'run',
  subtitle = 'Paper runtime connected',
  title = 'Demo workspace',
  variant = 'default',
}: TopBarExampleProps) {
  return (
    <TopBar
      actions={[
        { icon: <Play size={16} aria-hidden="true" />, id: 'run', label: 'Run' },
        { icon: <Bell size={16} aria-hidden="true" />, id: 'alerts', label: 'Alerts' },
        { icon: <Settings size={16} aria-hidden="true" />, id: 'settings', label: 'Settings' },
      ]}
      brand={brand}
      density={density}
      selectedActionId={selectedActionId}
      subtitle={subtitle}
      title={title}
      variant={variant}
    />
  );
}
