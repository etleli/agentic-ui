import { Download, RefreshCw } from 'lucide-react';
import { PageHeader } from './PageHeader';
import type { PageHeaderProps } from '../Layout.types';

export type PageHeaderExampleProps = PageHeaderProps;

export function PageHeaderExample({
  density = 'comfortable',
  description = 'Monitor generated strategies, active positions, and runtime health in one workspace.',
  eyebrow = 'Portfolio control',
  meta = 'Updated 14:08:12',
  title = 'Demo workspace overview',
  variant = 'default',
}: PageHeaderExampleProps) {
  return (
    <PageHeader
      actions={[
        { icon: <RefreshCw size={16} aria-hidden="true" />, id: 'refresh', label: 'Refresh' },
        { icon: <Download size={16} aria-hidden="true" />, id: 'export', label: 'Export' },
      ]}
      density={density}
      description={description}
      eyebrow={eyebrow}
      meta={meta}
      title={title}
      variant={variant}
    />
  );
}
