import { SearchX } from 'lucide-react';
import '../SurfaceExample.css';
import { Button } from '../../inputs/Button';
import { EmptyState } from './EmptyState';
import type { EmptyStateAlignment, EmptyStateSize, EmptyStateTone } from './EmptyState.types';

export type EmptyStateExampleProps = {
  alignment?: EmptyStateAlignment;
  description?: string;
  showAction?: boolean;
  showIcon?: boolean;
  size?: EmptyStateSize;
  title?: string;
  tone?: EmptyStateTone;
};

export function EmptyStateExample({
  alignment = 'center',
  description = 'Create a component or adjust the filters to reveal matching entries.',
  showAction = true,
  showIcon = true,
  size = 'comfortable',
  title = 'No components found',
  tone = 'neutral',
}: EmptyStateExampleProps) {
  return (
    <div className="surface-example">
      <EmptyState
        actions={showAction ? <Button size="compact" variant="secondary">Reset view</Button> : undefined}
        alignment={alignment}
        description={description}
        icon={showIcon ? <SearchX size={22} aria-hidden="true" /> : undefined}
        size={size}
        title={title}
        tone={tone}
      />

      <div className="surface-example__summary" role="status">
        <span>Empty state</span>
        <strong>{tone}</strong>
      </div>
    </div>
  );
}
