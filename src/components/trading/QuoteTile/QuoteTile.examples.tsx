import { QuoteTile } from './QuoteTile';
import type { QuoteTileProps } from '../TradingWorkflow.types';

export type QuoteTileExampleProps = QuoteTileProps;

export function QuoteTileExample({
  quote,
  selected = false,
  showSparkline = true,
  variant = 'default',
}: QuoteTileExampleProps) {
  return <QuoteTile quote={quote} selected={selected} showSparkline={showSparkline} variant={variant} />;
}
