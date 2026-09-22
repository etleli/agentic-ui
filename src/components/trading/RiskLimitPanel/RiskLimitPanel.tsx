import { ProgressBar, RiskIndicator } from '../../feedback';
import '../TradingWorkflow.css';
import { formatCurrency, getTradingClassName } from '../TradingWorkflow.utils';
import type { RiskIndicatorLevel } from '../../feedback';
import type { RiskLimitPanelProps } from '../TradingWorkflow.types';

function getRiskLevel(score: number): RiskIndicatorLevel {
  if (score >= 85) {
    return 'critical';
  }

  if (score >= 65) {
    return 'high';
  }

  if (score >= 35) {
    return 'medium';
  }

  return 'low';
}

export function RiskLimitPanel({
  className,
  currentExposure = 420000,
  dailyLoss = 12200,
  maxDailyLoss = 30000,
  maxExposure = 1000000,
  riskScore = 42,
  showDetails = true,
  variant = 'default',
  ...panelProps
}: RiskLimitPanelProps) {
  const riskLevel = getRiskLevel(riskScore);
  const lossTone = dailyLoss / Math.max(maxDailyLoss, 1) > 0.7 ? 'negative' : 'warning';

  return (
    <section {...panelProps} className={getTradingClassName('trading-panel risk-limit-panel', className)} data-variant={variant}>
      <header className="trading-panel__header">
        <span className="trading-panel__copy">
          <span className="trading-card__eyebrow">Risk limits</span>
          <h3 className="trading-panel__title">Portfolio guardrails</h3>
        </span>
        <RiskIndicator level={riskLevel} score={`${Math.round(riskScore)}/100`} size="compact" variant="bars" />
      </header>
      <div className="trading-risk-bars">
        <ProgressBar
          animated
          label="Exposure"
          max={maxExposure}
          showValue
          tone={riskScore >= 65 ? 'warning' : 'accent'}
          value={currentExposure}
          valueFormatter={(value) => formatCurrency(value, 'USD', 0)}
        />
        <ProgressBar
          animated
          label="Daily loss"
          max={maxDailyLoss}
          showValue
          tone={lossTone}
          value={dailyLoss}
          valueFormatter={(value) => formatCurrency(value, 'USD', 0)}
        />
      </div>
      {showDetails ? (
        <div className="trading-ticket__summary">
          <span className="trading-ticket__summary-row">
            <span className="trading-row__label">Max exposure</span>
            <strong>{formatCurrency(maxExposure, 'USD', 0)}</strong>
          </span>
          <span className="trading-ticket__summary-row">
            <span className="trading-row__label">Max daily loss</span>
            <strong>{formatCurrency(maxDailyLoss, 'USD', 0)}</strong>
          </span>
        </div>
      ) : null}
    </section>
  );
}

export type { RiskLimitPanelProps };
