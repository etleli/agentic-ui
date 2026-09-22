import { PivotSummary } from './PivotSummary';
import type { AdvancedDataDensity, AdvancedDataVariant } from '../AdvancedData.types';

export type PivotSummaryExampleProps = {
  density?: AdvancedDataDensity;
  metricLabel?: string;
  variant?: AdvancedDataVariant;
};

const pivotRows = [
  { id: 'momentum', label: 'Momentum', meta: '8 runs' },
  { id: 'mean', label: 'Mean reversion', meta: '5 runs' },
  { id: 'hedge', label: 'Hedged', meta: '3 runs' },
];

const pivotColumns = [
  { id: 'paper', label: 'Paper' },
  { id: 'watch', label: 'Watch' },
  { id: 'live', label: 'Live' },
];

const pivotCells = [
  { columnId: 'paper', rowId: 'momentum', tone: 'positive' as const, value: '+$4.2k' },
  { columnId: 'watch', rowId: 'momentum', tone: 'positive' as const, value: '+$1.8k' },
  { columnId: 'live', rowId: 'momentum', tone: 'warning' as const, value: '$420' },
  { columnId: 'paper', rowId: 'mean', tone: 'negative' as const, value: '-$310' },
  { columnId: 'watch', rowId: 'mean', tone: 'positive' as const, value: '+$860' },
  { columnId: 'live', rowId: 'mean', tone: 'neutral' as const, value: '$0' },
  { columnId: 'paper', rowId: 'hedge', tone: 'positive' as const, value: '+$980' },
  { columnId: 'watch', rowId: 'hedge', tone: 'warning' as const, value: '$180' },
  { columnId: 'live', rowId: 'hedge', tone: 'positive' as const, value: '+$220' },
];

export function PivotSummaryExample({ density = 'comfortable', metricLabel = 'Net P/L by strategy and mode', variant = 'default' }: PivotSummaryExampleProps) {
  return <PivotSummary cells={pivotCells} columns={pivotColumns} density={density} metricLabel={metricLabel} rows={pivotRows} variant={variant} />;
}
