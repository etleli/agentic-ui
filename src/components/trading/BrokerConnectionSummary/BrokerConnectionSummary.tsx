import '../TradingWorkflow.css';
import { formatCompactNumber, getTradingClassName } from '../TradingWorkflow.utils';
import type { BrokerConnectionSummaryProps } from '../TradingWorkflow.types';

export function BrokerConnectionSummary({
  className,
  connections = [],
  density = 'comfortable',
  selectable = true,
  selectedId,
  title = 'Broker connections',
  variant = 'default',
  onConnectionSelect,
  ...summaryProps
}: BrokerConnectionSummaryProps) {
  return (
    <section
      {...summaryProps}
      className={getTradingClassName('broker-connection-summary', className)}
      data-density={density}
      data-selectable={selectable ? 'true' : undefined}
      data-variant={variant}
    >
      <header className="trading-panel__header">
        <span className="trading-panel__copy">
          <strong className="trading-panel__title">{title}</strong>
          <span className="trading-panel__description">Account, market data, and execution channel health.</span>
        </span>
      </header>
      <div className="broker-connection-summary__list">
        {connections.map((connection) => {
          const isSelected = selectedId === connection.id;

          return (
            <button
              aria-disabled={selectable ? undefined : true}
              aria-pressed={isSelected}
              className="broker-connection-summary__item"
              data-selected={isSelected ? 'true' : undefined}
              data-state={connection.state ?? 'offline'}
              key={connection.id}
              tabIndex={selectable ? undefined : -1}
              type="button"
              onClick={selectable ? () => onConnectionSelect?.(connection.id, connection) : undefined}
            >
              <span className="broker-connection-summary__row">
                <span className="trading-row__copy">
                  <strong className="trading-card__title">{connection.label}</strong>
                  {connection.detail ? <span className="trading-card__meta">{connection.detail}</span> : null}
                </span>
                <span className="broker-connection-summary__signal" aria-hidden="true" />
              </span>
              <span className="broker-connection-summary__row">
                <span className="trading-card__meta">{connection.state ?? 'offline'}</span>
                {typeof connection.latencyMs === 'number' ? <span className="trading-card__meta">{formatCompactNumber(connection.latencyMs, 0)} ms</span> : null}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export type { BrokerConnection, BrokerConnectionState, BrokerConnectionSummaryProps } from '../TradingWorkflow.types';
