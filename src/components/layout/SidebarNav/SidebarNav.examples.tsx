import { Activity, Boxes, ChartCandlestick, GitBranch, Shield } from 'lucide-react';
import { SidebarNav } from './SidebarNav';
import type { SidebarNavProps } from '../Layout.types';

export type SidebarNavExampleProps = SidebarNavProps;

export function SidebarNavExample({
  collapsed = false,
  density = 'comfortable',
  selectedId = 'strategies',
  variant = 'default',
}: SidebarNavExampleProps) {
  return (
    <SidebarNav
      collapsed={collapsed}
      density={density}
      items={[
        { description: 'Active systems', icon: <GitBranch size={18} aria-hidden="true" />, id: 'strategies', label: 'Strategies' },
        { badge: '4', description: 'Open positions', icon: <Boxes size={18} aria-hidden="true" />, id: 'portfolio', label: 'Portfolio' },
        { description: 'Intraday charts', icon: <ChartCandlestick size={18} aria-hidden="true" />, id: 'markets', label: 'Markets' },
        { description: 'Limits and alerts', icon: <Shield size={18} aria-hidden="true" />, id: 'risk', label: 'Risk' },
        { description: 'Live health', icon: <Activity size={18} aria-hidden="true" />, id: 'runtime', label: 'Runtime' },
      ]}
      selectedId={selectedId}
      variant={variant}
    />
  );
}
