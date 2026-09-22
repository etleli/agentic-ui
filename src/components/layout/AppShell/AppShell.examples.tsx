import { Activity, Boxes, ChartCandlestick, GitBranch, Play, Settings, Shield } from 'lucide-react';
import { Breadcrumb } from '../../navigation/Breadcrumb';
import { PropertyList } from '../../data-display/PropertyList';
import { StatusBadge } from '../../feedback/StatusBadge';
import { PageHeader } from '../PageHeader';
import { SidebarNav } from '../SidebarNav';
import { StatusBar } from '../StatusBar';
import { TopBar } from '../TopBar';
import { AppShell } from './AppShell';
import type { AppShellProps } from '../Layout.types';

export type AppShellExampleProps = AppShellProps & {
  showBreadcrumbs?: boolean;
  sidebarCollapsed?: boolean;
};

export function AppShellExample({
  brandWatermark = false,
  brandWatermarkPlacement = 'bottom-right',
  density = 'comfortable',
  fullHeight = true,
  preset = 'workspace',
  showBreadcrumbs = true,
  sidebarCollapsed = false,
  variant = 'default',
}: AppShellExampleProps) {
  return (
    <AppShell
      brandWatermark={brandWatermark}
      brandWatermarkPlacement={brandWatermarkPlacement}
      breadcrumbs={showBreadcrumbs ? <Breadcrumb items={[{ id: 'home', label: 'Workspace' }, { id: 'strategies', label: 'Strategies' }, { id: 'alpha', label: 'Demo Momentum' }]} /> : undefined}
      density={density}
      fullHeight={fullHeight}
      inspector={
        <PropertyList
          columns="one"
          items={[
            { id: 'selected', label: 'Selected', value: 'Demo Momentum' },
            { id: 'risk', label: 'Risk state', tone: 'warning', value: 'Watch' },
            { id: 'latency', label: 'Latency', tone: 'positive', value: '38 ms' },
          ]}
          variant="panel"
        />
      }
      sidebar={
        <SidebarNav
          collapsed={sidebarCollapsed}
          density={density}
          items={[
            { description: 'Active systems', icon: <GitBranch size={18} aria-hidden="true" />, id: 'strategies', label: 'Strategies' },
            { badge: '4', description: 'Open positions', icon: <Boxes size={18} aria-hidden="true" />, id: 'portfolio', label: 'Portfolio' },
            { description: 'Intraday charts', icon: <ChartCandlestick size={18} aria-hidden="true" />, id: 'markets', label: 'Markets' },
            { description: 'Limits and alerts', icon: <Shield size={18} aria-hidden="true" />, id: 'risk', label: 'Risk' },
            { description: 'Live health', icon: <Activity size={18} aria-hidden="true" />, id: 'runtime', label: 'Runtime' },
          ]}
          selectedId="strategies"
          variant={variant}
        />
      }
      statusBar={
        <StatusBar
          density={density}
          items={[
            { id: 'stream', label: 'Broker stream', tone: 'positive', value: '38 ms' },
            { id: 'risk', label: 'Risk gate', tone: 'warning', value: 'Watch' },
            { id: 'mode', label: 'Mode', tone: 'accent', value: 'Paper' },
          ]}
          variant={variant}
        />
      }
      topBar={
        <TopBar
          actions={[
            { icon: <Play size={16} aria-hidden="true" />, id: 'run', label: 'Run' },
            { icon: <Settings size={16} aria-hidden="true" />, id: 'settings', label: 'Settings' },
          ]}
          brand="Agentic UI"
          density={density}
          selectedActionId="run"
          subtitle="Paper runtime connected"
          title="Demo workspace"
          variant={variant}
        />
      }
      preset={preset}
      variant={variant}
    >
      <PageHeader
        density={density}
        description="Monitor generated strategies, active positions, and runtime health in one workspace."
        eyebrow="Portfolio control"
        meta="Updated 14:08:12"
        title="Demo workspace overview"
        variant={variant}
      />
      <StatusBadge label="Reusable app shell composition" status="online" />
    </AppShell>
  );
}
