import { type CSSProperties } from 'react';
import '../TradingWorkflow.css';
import { getTradingClassName } from '../TradingWorkflow.utils';
import type { AllocationBreakdownProps } from '../TradingWorkflow.types';
import { getThemeGeneratedColorForKey } from '../../../theme/categoricalColors';

export function AllocationBreakdown({
  allocations = [],
  className,
  density = 'comfortable',
  selectable = true,
  selectedId,
  showTargets = true,
  title = 'Allocation breakdown',
  variant = 'default',
  onAllocationSelect,
  ...breakdownProps
}: AllocationBreakdownProps) {
  const totalValue = allocations.reduce((sum, allocation) => sum + allocation.value, 0) || 1;

  return (
    <section
      {...breakdownProps}
      className={getTradingClassName('allocation-breakdown', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="trading-panel__header">
        <span className="trading-panel__copy">
          <strong className="trading-panel__title">{title}</strong>
          <span className="trading-panel__description">Current and target weights by sleeve.</span>
        </span>
      </header>
      <div className="allocation-breakdown__bars">
        {allocations.map((allocation) => {
          const percent = (allocation.value / totalValue) * 100;
          const isSelected = selectedId === allocation.id;
          const allocationColor = allocation.color ?? getThemeGeneratedColorForKey(allocation.id);
          const allocationContent = (
            <>
              <span className="allocation-breakdown__row">
                <strong>{allocation.label}</strong>
                <span className="trading-card__meta">{percent.toFixed(1)}%</span>
              </span>
              <span className="allocation-breakdown__track">
                <span className="allocation-breakdown__fill" style={{ '--allocation-color': allocationColor, '--allocation-value': `${percent}%` } as CSSProperties} />
                {showTargets && typeof allocation.target === 'number' ? <span className="allocation-breakdown__target" style={{ '--allocation-target': `${allocation.target}%` } as CSSProperties} /> : null}
              </span>
            </>
          );

          if (!selectable) {
            return (
              <div className="allocation-breakdown__item" data-selected={isSelected ? 'true' : undefined} key={allocation.id}>
                {allocationContent}
              </div>
            );
          }

          return (
            <button
              aria-pressed={isSelected}
              className="allocation-breakdown__item"
              data-selected={isSelected ? 'true' : undefined}
              key={allocation.id}
              type="button"
              onClick={() => onAllocationSelect?.(allocation.id, allocation)}
            >
              {allocationContent}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export type { AllocationBreakdownProps, AllocationItem } from '../TradingWorkflow.types';
