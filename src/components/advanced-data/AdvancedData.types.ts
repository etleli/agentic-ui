import type { HTMLAttributes, ReactNode } from 'react';
import type { DataTableColumn, DataTableRow } from '../data-display';

export type AdvancedDataDensity = 'compact' | 'comfortable' | 'spacious';
export type AdvancedDataVariant = 'default' | 'muted' | 'outline';
export type AdvancedDataTone = 'accent' | 'positive' | 'negative' | 'warning' | 'neutral' | 'muted';
export type AdvancedDataStatus = 'ready' | 'running' | 'warning' | 'error' | 'paused' | 'disabled';

export type DatasetSummaryMetric = {
  deltaValue?: number;
  description?: ReactNode;
  id: string;
  label: ReactNode;
  sparklineValues?: number[];
  tone?: AdvancedDataTone | 'auto';
  unit?: ReactNode;
  value: ReactNode;
};

export type DatasetSummaryIssue = {
  description?: ReactNode;
  id: string;
  label: ReactNode;
  tone?: AdvancedDataTone;
};

export type DatasetSummaryProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  coverageScore?: number;
  density?: AdvancedDataDensity;
  description?: ReactNode;
  fieldCount?: ReactNode;
  freshness?: ReactNode;
  issues?: DatasetSummaryIssue[];
  metrics?: DatasetSummaryMetric[];
  qualityScore?: number;
  rowCount?: ReactNode;
  selectable?: boolean;
  selectedMetricId?: string;
  showIssues?: boolean;
  showMetrics?: boolean;
  status?: AdvancedDataStatus;
  title?: ReactNode;
  variant?: AdvancedDataVariant;
  onMetricSelect?: (metricId: string, metric: DatasetSummaryMetric) => void;
};

export type FieldProfileBucket = {
  count?: ReactNode;
  id: string;
  label: ReactNode;
  tone?: AdvancedDataTone;
  value: number;
};

export type FieldProfileFact = {
  description?: ReactNode;
  id: string;
  label: ReactNode;
  meta?: ReactNode;
  tone?: AdvancedDataTone;
  value: ReactNode;
};

export type FieldProfileProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  buckets?: FieldProfileBucket[];
  density?: AdvancedDataDensity;
  description?: ReactNode;
  facts?: FieldProfileFact[];
  fieldName?: ReactNode;
  fieldType?: ReactNode;
  missingRate?: number;
  selectable?: boolean;
  selectedBucketIndex?: number;
  showDistribution?: boolean;
  status?: AdvancedDataStatus;
  uniqueRate?: number;
  variant?: AdvancedDataVariant;
  onBucketSelect?: (bucketIndex: number, bucket: FieldProfileBucket) => void;
};

export type QueryResultPanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  columns?: DataTableColumn[];
  density?: AdvancedDataDensity;
  description?: ReactNode;
  durationMs?: number;
  freshness?: ReactNode;
  maxHeight?: string;
  query?: string;
  rowCount?: number;
  rows?: DataTableRow[];
  scannedRows?: number;
  selectable?: boolean;
  selectedRowIndex?: number;
  showQuery?: boolean;
  showSummary?: boolean;
  status?: AdvancedDataStatus;
  title?: ReactNode;
  variant?: AdvancedDataVariant;
  onSelectedRowChange?: (rowIndex: number, row: DataTableRow) => void;
};

export type DataQualityCheckStatus = 'pass' | 'warn' | 'fail' | 'running' | 'paused';

export type DataQualityCheck = {
  description?: ReactNode;
  id: string;
  label: ReactNode;
  metric?: ReactNode;
  progress?: number;
  status?: DataQualityCheckStatus;
};

export type DataQualityPanelProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  checks?: DataQualityCheck[];
  density?: AdvancedDataDensity;
  description?: ReactNode;
  score?: number;
  selectable?: boolean;
  selectedCheckId?: string;
  showProgress?: boolean;
  status?: AdvancedDataStatus;
  title?: ReactNode;
  variant?: AdvancedDataVariant;
  onCheckSelect?: (checkId: string, check: DataQualityCheck) => void;
};

export type SchemaExplorerField = {
  description?: ReactNode;
  id: string;
  label: ReactNode;
  meta?: ReactNode;
  nullable?: boolean;
  tone?: AdvancedDataTone;
  type?: ReactNode;
};

export type SchemaExplorerTable = {
  description?: ReactNode;
  fields?: SchemaExplorerField[];
  id: string;
  label: ReactNode;
  meta?: ReactNode;
  tone?: AdvancedDataTone;
};

export type SchemaExplorerProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  density?: AdvancedDataDensity;
  selectable?: boolean;
  selectedFieldId?: string;
  selectedTableId?: string;
  showNullable?: boolean;
  tables?: SchemaExplorerTable[];
  title?: ReactNode;
  variant?: AdvancedDataVariant;
  onFieldSelect?: (tableId: string, fieldId: string, field: SchemaExplorerField) => void;
  onTableSelect?: (tableId: string, table: SchemaExplorerTable) => void;
};

export type PivotSummaryCell = {
  columnId: string;
  rowId: string;
  tone?: AdvancedDataTone;
  value: ReactNode;
};

export type PivotSummaryAxisItem = {
  id: string;
  label: ReactNode;
  meta?: ReactNode;
};

export type PivotSummaryProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  cells?: PivotSummaryCell[];
  columns?: PivotSummaryAxisItem[];
  density?: AdvancedDataDensity;
  metricLabel?: ReactNode;
  rows?: PivotSummaryAxisItem[];
  title?: ReactNode;
  variant?: AdvancedDataVariant;
};

export type JoinPreviewDataset = {
  label: ReactNode;
  rowCount?: ReactNode;
  keyLabel?: ReactNode;
};

export type JoinPreviewProps = Omit<HTMLAttributes<HTMLDivElement>, 'children'> & {
  density?: AdvancedDataDensity;
  joinType?: 'inner' | 'left' | 'right' | 'outer';
  left?: JoinPreviewDataset;
  matchedRows?: number;
  right?: JoinPreviewDataset;
  unmatchedLeft?: number;
  unmatchedRight?: number;
  variant?: AdvancedDataVariant;
};

export type LineageTraceNode = {
  description?: ReactNode;
  id: string;
  label: ReactNode;
  meta?: ReactNode;
  status?: AdvancedDataStatus;
  tone?: AdvancedDataTone;
};

export type LineageTraceProps = Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onSelect'> & {
  density?: AdvancedDataDensity;
  nodes?: LineageTraceNode[];
  orientation?: 'horizontal' | 'vertical';
  selectable?: boolean;
  selectedNodeId?: string;
  title?: ReactNode;
  variant?: AdvancedDataVariant;
  onNodeSelect?: (nodeId: string, node: LineageTraceNode) => void;
};
