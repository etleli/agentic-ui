import { RiskLimitPanel } from './RiskLimitPanel';
import type { RiskLimitPanelProps } from '../TradingWorkflow.types';

export type RiskLimitPanelExampleProps = RiskLimitPanelProps;

export function RiskLimitPanelExample({
  currentExposure = 420000,
  dailyLoss = 12200,
  maxDailyLoss = 30000,
  maxExposure = 1000000,
  riskScore = 42,
  showDetails = true,
  variant = 'default',
}: RiskLimitPanelExampleProps) {
  return (
    <RiskLimitPanel
      currentExposure={currentExposure}
      dailyLoss={dailyLoss}
      maxDailyLoss={maxDailyLoss}
      maxExposure={maxExposure}
      riskScore={riskScore}
      showDetails={showDetails}
      variant={variant}
    />
  );
}
