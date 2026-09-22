import { lazy, Suspense, type ReactElement } from 'react';
import {
  ButtonExample,
  CheckboxExample,
  ColorInputExample,
  NumberInputExample,
  SearchInputExample,
  SliderExample,
  TextAreaExample,
  TextInputExample,
} from '../components/inputs';
import { MarkdownViewerExample, ObsidianGraphViewExample, RichTextViewerExample, TextOutputExample } from '../components/content';
import type { MarkdownViewerVariant, ObsidianGraphViewLabelMode, ObsidianGraphViewVariant, RichTextViewerVariant, TextOutputVariant } from '../components/content';
import { MessageChatExample } from '../components/communication';
import type { MessageChatDensity, MessageChatMode, MessageChatVariant } from '../components/communication';
import {
  CandlestickChartExample,
  CorrelationHeatmapExample,
  DepthChartExample,
  EquityCurveExample,
  TimeSeriesChartExample,
  VolumeBarsExample,
} from '../components/charts';
import type {
  DepthPoint,
  MarketChartDensity,
  MarketChartTone,
  MarketChartVariant,
  OhlcPoint,
  TimeSeriesChartMode,
  VolumeBarsMode,
} from '../components/charts';
import {
  LatencyIndicatorExample,
  MarketStateBadgeExample,
  MarketTickerExample,
  OrderBookLadderExample,
  AllocationBreakdownExample,
  BrokerConnectionSummaryExample,
  OrderStatusExample,
  OrderTicketExample,
  PnLDisplayExample,
  PositionSummaryExample,
  PositionsTableExample,
  PriceDisplayExample,
  QuoteTileExample,
  RiskLimitPanelExample,
  StrategyCardExample,
  TradeBlotterExample,
  WatchlistExample,
} from '../components/trading';
import type {
  TradingDensity,
  TradingMarketState,
  TradingOrderStatus,
  TradingOrderType,
  TradingSide,
  TradingStrategyStatus,
  TradingSurfaceVariant,
  TradingTimeInForce,
  TradingTone,
} from '../components/trading';
import {
  DatePickerExample,
  DateRangePickerExample,
  DateTimePickerExample,
  FilePickerExample,
  FormActionsExample,
  FormFieldExample,
  FormGroupExample,
  OptionPickerExample,
  TagPickerExample,
  TimePickerExample,
  ValidationSummaryExample,
} from '../components/forms';
import type {
  FormControlSize,
  FormFieldOrientation,
  FormFieldState,
  FormGroupColumns,
  FormSurfaceVariant,
  OptionPickerVariant,
  TimePickerFormat,
  WeekStart,
} from '../components/forms';
import {
  AppShellExample,
  PageHeaderExample,
  ResizablePanelExample,
  SidebarNavExample,
  SplitPaneExample,
  StatusBarExample,
  TopBarExample,
} from '../components/layout';
import type {
  LayoutDensity,
  LayoutOrientation,
  LayoutPanelResizeDirection,
  LayoutShellPreset,
  LayoutSurfaceVariant,
} from '../components/layout';
import {
  ActivityFeedExample,
  AuditTrailExample,
  ExecutionTimelineExample,
  JobDetailPanelExample,
  RunQueueExample,
  TimelineExample,
  WorkflowDependencyGraphExample,
  WorkflowStepperExample,
} from '../components/activity';
import type { ActivityDensity, ActivityOrientation, ActivityVariant, RunQueueState } from '../components/activity';
import {
  DataQualityPanelExample,
  DatasetSummaryExample,
  FieldProfileExample,
  JoinPreviewExample,
  LineageTraceExample,
  PivotSummaryExample,
  QueryResultPanelExample,
  SchemaExplorerExample,
} from '../components/advanced-data';
import type { AdvancedDataDensity, AdvancedDataStatus, AdvancedDataVariant } from '../components/advanced-data';
import { DataTableExample, MetricCardExample, PropertyListExample, TagExample } from '../components/data-display';
import type {
  DataTableDensity,
  DataTableScenario,
  DataTableSortDirection,
  DataTableVariant,
  MetricCardSize,
  MetricCardTone,
  MetricCardVariant,
  PropertyListColumns,
  PropertyListDensity,
  PropertyListScenario,
  PropertyListVariant,
  TagSize,
  TagTone,
  TagVariant,
} from '../components/data-display';
import type { CodeEditorLanguage } from '../components/editors';
import { AccordionExample, BreadcrumbExample, ColumnExplorerExample, CommandMenuExample, FileExplorerExample, TabsExample, TreeViewExample, UserCardExample } from '../components/navigation';
import type {
  AccordionDensity,
  AccordionMode,
  AccordionVariant,
  BreadcrumbDensity,
  BreadcrumbVariant,
  ColumnExplorerDensity,
  ColumnExplorerVariant,
  CommandMenuDensity,
  CommandMenuVariant,
  FileExplorerDensity,
  FileExplorerSortBy,
  FileExplorerSortDirection,
  FileExplorerVariant,
  FileExplorerView,
  TabsDensity,
  TabsOrientation,
  TabsVariant,
  TreeViewDensity,
  TreeViewVariant,
  UserCardPlacement,
  UserCardVariant,
} from '../components/navigation';
import {
  NodeCanvasExample,
  NodeEdgeExample,
  NodeExample,
  NodeInspectorExample,
  NodeMiniMapExample,
  NodePaletteExample,
  NodePortExample,
  NodeToolbarExample,
  NodeWorkspaceMockExample,
} from '../components/node-system';
import type {
  NodeCanvasVariant,
  NodeDensity,
  NodeEdgeAnimation,
  NodeEdgePath,
  NodeFlowDirection,
  NodeMiniMapVariant,
  NodePortDirection,
  NodePortSide,
  NodeTone,
} from '../components/node-system';
import { ContextMenuExample, DrawerExample, ModalExample, PopoverExample, ToastExample, TooltipExample } from '../components/overlays';
import type {
  DrawerPlacement,
  DrawerSize,
  ModalSize,
  PopoverPlacement,
  PopoverSize,
  ToastPlacement,
  ToastTone,
  TooltipPlacement,
  TooltipSize,
  TooltipTone,
} from '../components/overlays';
import {
  ConnectionIndicatorExample,
  CountBadgeExample,
  DeltaIndicatorExample,
  FreshnessIndicatorExample,
  HealthMeterExample,
  LoadingIndicator,
  LoadingIndicatorExample,
  LogIndicatorExample,
  ProgressBarExample,
  RiskIndicatorExample,
  SignalStrengthExample,
  SkeletonExample,
  StatusBadgeExample,
  TrendSparkIndicatorExample,
} from '../components/feedback';
import type {
  ConnectionIndicatorSize,
  ConnectionIndicatorStatus,
  ConnectionIndicatorVariant,
  CountBadgeSize,
  CountBadgeTone,
  CountBadgeVariant,
  DeltaIndicatorDirection,
  DeltaIndicatorSize,
  DeltaIndicatorVariant,
  FreshnessIndicatorSize,
  FreshnessIndicatorState,
  FreshnessIndicatorVariant,
  HealthMeterSize,
  HealthMeterTone,
  HealthMeterVariant,
  LoadingIndicatorSize,
  LoadingIndicatorTone,
  LoadingIndicatorVariant,
  LogIndicatorSize,
  LogIndicatorTone,
  ProgressBarMode,
  ProgressBarSize,
  ProgressBarTone,
  RiskIndicatorLevel,
  RiskIndicatorSize,
  RiskIndicatorVariant,
  SignalStrengthLevel,
  SignalStrengthSize,
  SignalStrengthVariant,
  SkeletonDensity,
  SkeletonVariant,
  StatusBadgeSize,
  StatusBadgeStatus,
  StatusBadgeVariant,
  TrendSparkIndicatorSize,
  TrendSparkIndicatorTone,
  TrendSparkIndicatorVariant,
} from '../components/feedback';
import {
  CardExample,
  DividerExample,
  EmptyStateExample,
  PanelExample,
  SectionExample,
  ToolbarExample,
} from '../components/surfaces';

const LazyCodeEditorExample = lazy(() => import('../components/editors/CodeEditor/CodeEditor.examples').then((module) => ({ default: module.CodeEditorExample })));
import type {
  CardPadding,
  CardVariant,
  DividerInset,
  DividerOrientation,
  DividerTone,
  EmptyStateAlignment,
  EmptyStateSize,
  EmptyStateTone,
  PanelPadding,
  PanelVariant,
  SectionDensity,
  SectionVariant,
  ToolbarDensity,
  ToolbarJustify,
  ToolbarOrientation,
  ToolbarVariant,
} from '../components/surfaces';
import type {
  ButtonContentMode,
  ButtonIconName,
  ButtonInteraction,
  ButtonSize,
  ButtonVariant,
  TextAreaResize,
} from '../components/inputs';
import { DropdownExample } from '../components/inputs/Dropdown';
import type { DropdownSize } from '../components/inputs/Dropdown';
import { ListViewExample } from '../components/lists/ListView';
import type {
  ListViewContentMode,
  ListViewDensity,
  ListViewGroupAttribute,
  ListViewImportanceFilter,
  ListViewOrderDirection,
  ListViewRendererMode,
  ListViewScenario,
  ListViewVerticalAlign,
} from '../components/lists/ListView';

const dropdownOptionSourceExample = `Strategy engine | #05d671
Risk gateway | #ffc800
Order router | #ff4d5a
Portfolio monitor | #8b8bff`;

const logIndicatorLinesExample = `Signal score updated for Demo Momentum
Order router accepted rebalance instruction
Risk gateway moved exposure limit to watch
Broker stream heartbeat received`;

const trendSparkValuesExample = `12, 14, 13, 18, 21, 19, 24`;

const marketSeriesValuesExample = `102.4, 103.1, 102.8, 104.6, 106.2, 105.8, 108.4, 109.1, 110.6`;

const marketVolumeValuesExample = `4200, 5100, 3900, 6200, 5800, 7300, 6900, 8100, 7600, 8800`;

const signedVolumeValuesExample = `2200, 3100, -1800, 4200, -2600, 5300, 4900, -2100, 6100, 6700`;

const ohlcCandlesExample = `09:30, 102.4, 104.2, 101.8, 103.6, 3800
10:00, 103.6, 104.8, 102.9, 103.1, 4200
10:30, 103.1, 105.4, 102.8, 105.1, 5100
11:00, 105.1, 106.6, 104.7, 106.2, 4600
11:30, 106.2, 106.7, 104.8, 105.3, 3900
12:00, 105.3, 108.3, 105.1, 107.9, 6200
12:30, 107.9, 109.1, 107.4, 108.6, 5800
13:00, 108.6, 109.7, 108.1, 109.2, 5300`;

const depthBidsExample = `108.10, 3400
108.35, 2600
108.60, 1700
108.85, 900`;

const depthAsksExample = `109.25, 800
109.50, 1600
109.75, 2450
110.00, 3300`;

const equityValuesExample = `100000, 100850, 100420, 102140, 103720, 103260, 105480, 106920, 108640, 109120`;

const benchmarkValuesExample = `100000, 100320, 100680, 101100, 101860, 102240, 102980, 103720, 104160, 104840`;

const correlationSymbolsExample = `AAPL, MSFT, NVDA, TSLA, SPY`;

const correlationMatrixExample = `1, 0.72, 0.58, 0.22, 0.64
0.72, 1, 0.68, 0.18, 0.71
0.58, 0.68, 1, 0.31, 0.62
0.22, 0.18, 0.31, 1, -0.12
0.64, 0.71, 0.62, -0.12, 1`;

const quoteSparkValuesExample = `204, 205.2, 204.8, 207, 208.4, 209.2, 210.42`;

const filePickerFilesExample = `demo-momentum.yaml
risk-limits.json`;

const textAreaValueExample = `Risk gateway paused new entries while volatility exceeds the configured threshold.
Portfolio monitor can continue simulation runs with current exposure.`;

const textOutputValueExample = `14:08:12 Strategy engine accepted simulation request.
14:08:13 Risk gateway returned exposure limit: 42%.
14:08:14 Portfolio monitor published rebalance preview.`;

const markdownViewerSourceExample = `# Strategy Brief

**Demo Momentum** is ready for simulation.

- Inputs validated
- Risk gate active
- Broker stream in watch mode

\`\`\`yaml
mode: simulate
risk_limit: 42
\`\`\`

> Raw HTML is displayed as text, not executed.`;

const codeEditorYamlExample = `strategy:
  name: Demo Momentum
  mode: simulate
  symbols:
    - AAPL
    - MSFT
risk:
  max_exposure: 0.42
  halt_on_disconnect: true
execution:
  broker: paper
  order_type: limit`;

const columnExplorerSelectedPathExample = 'workspace/strategies/demo-momentum';
const accordionOpenIdsExample = 'runtime';
const commandMenuQueryExample = '';
const treeViewExpandedIdsExample = 'workspace, strategies';

const listViewRichHtmlExample = `<span style="display:flex; width:100%; gap:12px; align-items:center;">
  <span style="flex:1 1 0; min-width:0;">
    <span style="display:block; color:var(--color-muted); font-size:11px; font-weight:700;">Strategy</span>
    <strong style="display:block; color:var(--color-foreground);">Alpha</strong>
  </span>
  <span style="flex:1 1 0; min-width:0;">
    <span style="display:block; color:var(--color-muted); font-size:11px; font-weight:700;">State</span>
    <span style="display:block; color:var(--list-view-indicator-color); font-weight:700;">Online</span>
  </span>
  <span style="flex:1 1 0; min-width:0;">
    <span style="display:block; color:var(--color-muted); font-size:11px; font-weight:700;">Score</span>
    <span style="display:block; color:var(--color-foreground);">94</span>
  </span>
  <span style="flex:1 1 0; min-width:0; text-align:right;">
    <span style="display:block; color:var(--color-muted); font-size:11px; font-weight:700;">Latency</span>
    <span style="display:block; color:var(--color-foreground);">12 ms</span>
  </span>
</span>`;

export type ComponentParameterValue = string | boolean;

export type ComponentParameterValues = Record<string, ComponentParameterValue>;

export type ComponentControlVisibility = {
  parameterId: string;
  value: ComponentParameterValue;
};

type ComponentControlBase = {
  id: string;
  label: string;
  description: string;
  visibleWhen?: ComponentControlVisibility;
};

export type ComponentParameterControl =
  | (ComponentControlBase & {
      type: 'select';
      options: Array<{ color?: string; label: string; value: string }>;
    })
  | (ComponentControlBase & {
      type: 'boolean';
    })
  | (ComponentControlBase & {
      type: 'text';
      placeholder?: string;
    })
  | (ComponentControlBase & {
      type: 'richtext';
      placeholder?: string;
      rows?: number;
    })
  | (ComponentControlBase & {
      type: 'color';
      defaultValue: string;
    });

export type ComponentPreviewDefinition = {
  id: string;
  group: string;
  name: string;
  description: string;
  status: string;
  parameters: ComponentParameterControl[];
  defaultParameters: ComponentParameterValues;
  contentDescription?: string;
  contentTitle?: string;
  contentControls?: ComponentParameterControl[];
  defaultContentValues?: ComponentParameterValues;
  renderPreview: (parameters: ComponentParameterValues, contentValues: ComponentParameterValues) => ReactElement;
};

const selectableParameter: ComponentParameterControl = {
  id: 'selectable',
  type: 'boolean',
  label: 'Selectable',
  description: 'Allows item clicks and selected-state styling.',
};

const selectableVisibleWhen: ComponentControlVisibility = { parameterId: 'selectable', value: true };

function getIndexParameter(value: ComponentParameterValue | undefined): number {
  const parsedValue = Number.parseInt(String(value ?? '0'), 10);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function getNumberParameter(value: ComponentParameterValue | undefined, fallbackValue: number): number {
  const parsedValue = Number.parseFloat(String(value ?? ''));
  return Number.isFinite(parsedValue) ? parsedValue : fallbackValue;
}

function getNumberListParameter(value: ComponentParameterValue | undefined, fallbackValues: number[]): number[] {
  const parsedValues = String(value ?? '')
    .split(/[\s,;|]+/)
    .map((item) => Number.parseFloat(item))
    .filter(Number.isFinite);

  return parsedValues.length >= 2 ? parsedValues : fallbackValues;
}

function getTextListParameter(value: ComponentParameterValue | undefined, fallbackValues: string[]): string[] {
  const parsedValues = String(value ?? '')
    .split(/[\n,;|]+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return parsedValues.length > 0 ? parsedValues : fallbackValues;
}

function getOhlcParameter(value: ComponentParameterValue | undefined, fallbackCandles: OhlcPoint[]): OhlcPoint[] {
  const candles = String(value ?? '')
    .split(/\n+/)
    .map((line) => line.split(/[,;|]+/).map((part) => part.trim()))
    .map(([label, open, high, low, close, volume]) => ({
      close: Number.parseFloat(close ?? ''),
      high: Number.parseFloat(high ?? ''),
      label,
      low: Number.parseFloat(low ?? ''),
      open: Number.parseFloat(open ?? ''),
      volume: volume === undefined || volume === '' ? undefined : Number.parseFloat(volume),
    }))
    .filter(
      (candle) =>
        candle.label &&
        Number.isFinite(candle.open) &&
        Number.isFinite(candle.high) &&
        Number.isFinite(candle.low) &&
        Number.isFinite(candle.close),
    );

  return candles.length > 0 ? candles : fallbackCandles;
}

function getDepthParameter(value: ComponentParameterValue | undefined, fallbackLevels: DepthPoint[]): DepthPoint[] {
  const levels = String(value ?? '')
    .split(/\n+/)
    .map((line) => line.split(/[,;|]+/).map((part) => Number.parseFloat(part.trim())))
    .filter(([price, size]) => Number.isFinite(price) && Number.isFinite(size))
    .map(([price, size]) => ({ price, size }));

  return levels.length >= 2 ? levels : fallbackLevels;
}

function getMatrixParameter(value: ComponentParameterValue | undefined, fallbackMatrix: number[][]): number[][] {
  const matrix = String(value ?? '')
    .split(/\n+/)
    .map((line) =>
      line
        .split(/[,;|]+/)
        .map((part) => Number.parseFloat(part.trim()))
        .filter(Number.isFinite),
    )
    .filter((row) => row.length > 0);

  return matrix.length > 0 ? matrix : fallbackMatrix;
}

const tradingDensityOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
];

const tradingSurfaceOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Muted', value: 'muted' },
  { label: 'Outline', value: 'outline' },
  { label: 'Accent', value: 'accent' },
];

const tradingToneOptions = [
  { label: 'Auto', value: 'auto' },
  { label: 'Accent', value: 'accent' },
  { label: 'Positive', value: 'positive' },
  { label: 'Negative', value: 'negative' },
  { label: 'Warning', value: 'warning' },
  { label: 'Neutral', value: 'neutral' },
];

const tradingBadgeVariantOptions = [
  { label: 'Soft', value: 'soft' },
  { label: 'Solid', value: 'solid' },
  { label: 'Outline', value: 'outline' },
];

const formSizeOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
];

const formSurfaceOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Muted', value: 'muted' },
  { label: 'Outline', value: 'outline' },
];

const formStateOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Error', value: 'error' },
  { label: 'Warning', value: 'warning' },
  { label: 'Success', value: 'success' },
];

const formActionAlignmentOptions = [
  { label: 'Start', value: 'start' },
  { label: 'End', value: 'end' },
  { label: 'Between', value: 'between' },
];

const formColumnOptions = [
  { label: 'One', value: 'one' },
  { label: 'Two', value: 'two' },
  { label: 'Three', value: 'three' },
];

const weekStartOptions = [
  { label: 'Monday', value: 'monday' },
  { label: 'Sunday', value: 'sunday' },
];

const layoutDensityOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
];

const layoutVariantOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Muted', value: 'muted' },
  { label: 'Outline', value: 'outline' },
];

const layoutShellPresetOptions = [
  { label: 'Workspace', value: 'workspace' },
  { label: 'Document', value: 'document' },
  { label: 'Dense', value: 'dense' },
];

const layoutOrientationOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

const activityDensityOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
];

const activityVariantOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Muted', value: 'muted' },
  { label: 'Outline', value: 'outline' },
];

const runQueueStateOptions = [
  { label: 'Queued', value: 'queued' },
  { label: 'Running', value: 'running' },
  { label: 'Complete', value: 'complete' },
  { label: 'Blocked', value: 'blocked' },
  { label: 'Failed', value: 'failed' },
  { label: 'Paused', value: 'paused' },
];

const activityOrientationOptions = [
  { label: 'Horizontal', value: 'horizontal' },
  { label: 'Vertical', value: 'vertical' },
];

const messageChatDensityOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
];

const messageChatVariantOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Muted', value: 'muted' },
  { label: 'Outline', value: 'outline' },
];

const advancedDataDensityOptions = [
  { label: 'Compact', value: 'compact' },
  { label: 'Comfortable', value: 'comfortable' },
  { label: 'Spacious', value: 'spacious' },
];

const advancedDataVariantOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Muted', value: 'muted' },
  { label: 'Outline', value: 'outline' },
];

const advancedDataStatusOptions = [
  { label: 'Ready', value: 'ready' },
  { label: 'Running', value: 'running' },
  { label: 'Warning', value: 'warning' },
  { label: 'Error', value: 'error' },
  { label: 'Paused', value: 'paused' },
];

const advancedDataJoinOptions = [
  { label: 'Inner', value: 'inner' },
  { label: 'Left', value: 'left' },
  { label: 'Right', value: 'right' },
  { label: 'Outer', value: 'outer' },
];

const tagToneOptions = [
  { label: 'Default', value: 'default' },
  { label: 'Accent', value: 'accent' },
  { label: 'Positive', value: 'positive' },
  { label: 'Negative', value: 'negative' },
  { label: 'Warning', value: 'warning' },
  { label: 'Neutral', value: 'neutral' },
  { label: 'Muted', value: 'muted' },
];

const tagVariantOptions = [
  { label: 'Soft', value: 'soft' },
  { label: 'Solid', value: 'solid' },
  { label: 'Outline', value: 'outline' },
];

export const componentPreviews: ComponentPreviewDefinition[] = [
  {
    id: 'button',
    group: 'Inputs',
    name: 'Button',
    description: 'Action button with text, icon, momentary, and toggle modes.',
    status: 'Ready',
    parameters: [
      {
        id: 'buttonType',
        type: 'select',
        label: 'Type',
        description: 'Momentary buttons fire actions; toggle buttons keep an on/off state.',
        options: [
          { label: 'Momentary', value: 'momentary' },
          { label: 'Toggle', value: 'toggle' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the visual emphasis of the action.',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Subtle', value: 'subtle' },
          { label: 'Danger', value: 'danger' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes button height and horizontal padding.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'contentMode',
        type: 'select',
        label: 'Content',
        description: 'Switches between text, icon plus text, and icon-only layouts.',
        options: [
          { label: 'Text', value: 'text' },
          { label: 'Icon + text', value: 'icon-text' },
          { label: 'Icon only', value: 'icon' },
        ],
      },
      {
        id: 'iconName',
        type: 'select',
        label: 'Icon',
        description: 'Chooses the icon used when icon content is enabled.',
        options: [
          { label: 'Play', value: 'play' },
          { label: 'Save', value: 'save' },
          { label: 'Search', value: 'search' },
        ],
      },
      {
        id: 'pressed',
        type: 'boolean',
        label: 'Pressed',
        description: 'Sets the toggle state from code; clicking the preview can still change it.',
        visibleWhen: { parameterId: 'buttonType', value: 'toggle' },
      },
      {
        id: 'showToggleIndicator',
        type: 'boolean',
        label: 'Toggle indicator',
        description: 'Shows the small toggle-state marker for toggle buttons.',
        visibleWhen: { parameterId: 'buttonType', value: 'toggle' },
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Prevents interaction with the button.',
      },
    ],
    defaultParameters: {
      buttonType: 'momentary',
      contentMode: 'icon-text',
      disabled: false,
      iconName: 'play',
      pressed: false,
      showToggleIndicator: true,
      size: 'comfortable',
      variant: 'primary',
    },
    contentTitle: 'Button Content',
    contentDescription: 'Sample text and icon content for the rendered button.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Text shown inside the button, or used as the accessible name for icon-only mode.',
        placeholder: 'Run strategy',
      },
    ],
    defaultContentValues: {
      label: 'Run strategy',
    },
    renderPreview: (parameters, contentValues) => (
      <ButtonExample
        buttonType={parameters.buttonType as ButtonInteraction}
        contentMode={parameters.contentMode as ButtonContentMode}
        disabled={Boolean(parameters.disabled)}
        iconName={parameters.iconName as ButtonIconName}
        label={String(contentValues.label ?? '')}
        pressed={Boolean(parameters.pressed)}
        showToggleIndicator={Boolean(parameters.showToggleIndicator)}
        size={parameters.size as ButtonSize}
        variant={parameters.variant as ButtonVariant}
      />
    ),
  },
  {
    id: 'text-input',
    group: 'Inputs',
    name: 'TextInput',
    description: 'Single-line text input with theme-driven field styling.',
    status: 'Ready',
    parameters: [
      {
        id: 'value',
        type: 'text',
        label: 'Code value',
        description: 'Sets the input value from code; typing in the preview can still change it.',
        placeholder: 'Demo engine',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Prevents editing the text.',
      },
      {
        id: 'isPassword',
        type: 'boolean',
        label: 'Password',
        description: 'Uses password entry so the typed value is masked by the browser.',
      },
    ],
    defaultParameters: {
      disabled: false,
      isPassword: false,
      value: 'Demo engine',
    },
    contentTitle: 'Text Input Content',
    contentDescription: 'Placeholder text used when the field has no value.',
    contentControls: [
      {
        id: 'placeholder',
        type: 'text',
        label: 'Placeholder',
        description: 'Text shown when the field is empty.',
        placeholder: 'Strategy name',
      },
    ],
    defaultContentValues: {
      placeholder: 'Strategy name',
    },
    renderPreview: (parameters, contentValues) => (
      <TextInputExample
        disabled={Boolean(parameters.disabled)}
        isPassword={Boolean(parameters.isPassword)}
        placeholder={String(contentValues.placeholder ?? '')}
        value={String(parameters.value ?? '')}
      />
    ),
  },
  {
    id: 'number-input',
    group: 'Inputs',
    name: 'NumberInput',
    description: 'Numeric input for thresholds, limits, and measured values.',
    status: 'Ready',
    parameters: [
      {
        id: 'value',
        type: 'text',
        label: 'Code value',
        description: 'Sets the numeric value from code; editing the preview can still change it.',
        placeholder: '12',
      },
      {
        id: 'min',
        type: 'text',
        label: 'Minimum',
        description: 'Lowest allowed numeric value.',
        placeholder: '0',
      },
      {
        id: 'max',
        type: 'text',
        label: 'Maximum',
        description: 'Highest allowed numeric value.',
        placeholder: '100',
      },
      {
        id: 'step',
        type: 'text',
        label: 'Step',
        description: 'Increment used by the browser number control.',
        placeholder: '1',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Prevents editing the number.',
      },
    ],
    defaultParameters: {
      disabled: false,
      max: '100',
      min: '0',
      step: '1',
      value: '12',
    },
    contentTitle: 'Number Input Content',
    contentDescription: 'Sample display content rendered around the numeric value.',
    contentControls: [
      {
        id: 'suffix',
        type: 'text',
        label: 'Suffix',
        description: 'Optional unit rendered after the number.',
        placeholder: 'ms',
      },
    ],
    defaultContentValues: {
      suffix: 'ms',
    },
    renderPreview: (parameters, contentValues) => (
      <NumberInputExample
        disabled={Boolean(parameters.disabled)}
        max={getNumberParameter(parameters.max, 100)}
        min={getNumberParameter(parameters.min, 0)}
        step={getNumberParameter(parameters.step, 1)}
        suffix={String(contentValues.suffix ?? '')}
        value={getNumberParameter(parameters.value, 12)}
      />
    ),
  },
  {
    id: 'search-input',
    group: 'Inputs',
    name: 'SearchInput',
    description: 'Search field with leading search icon and clear affordance.',
    status: 'Ready',
    parameters: [
      {
        id: 'value',
        type: 'text',
        label: 'Code query',
        description: 'Sets the search query from code; typing in the preview can still change it.',
        placeholder: 'risk',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Prevents editing or clearing the query.',
      },
    ],
    defaultParameters: {
      disabled: false,
      value: 'risk',
    },
    contentTitle: 'Search Input Content',
    contentDescription: 'Placeholder text used when the search query is empty.',
    contentControls: [
      {
        id: 'placeholder',
        type: 'text',
        label: 'Placeholder',
        description: 'Text shown when the query is empty.',
        placeholder: 'Search components',
      },
    ],
    defaultContentValues: {
      placeholder: 'Search components',
    },
    renderPreview: (parameters, contentValues) => (
      <SearchInputExample disabled={Boolean(parameters.disabled)} placeholder={String(contentValues.placeholder ?? '')} value={String(parameters.value ?? '')} />
    ),
  },
  {
    id: 'checkbox',
    group: 'Inputs',
    name: 'Checkbox',
    description: 'Binary check control with label and supporting text.',
    status: 'Ready',
    parameters: [
      {
        id: 'checked',
        type: 'boolean',
        label: 'Checked',
        description: 'Sets the checked state from code; clicking the preview can still change it.',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Prevents changing the checked state.',
      },
    ],
    defaultParameters: {
      checked: true,
      disabled: false,
    },
    contentTitle: 'Checkbox Content',
    contentDescription: 'Sample label and supporting text for the checkbox.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Primary checkbox text.',
        placeholder: 'Enable live checks',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text below the label.',
        placeholder: 'Use live broker and market feed status.',
      },
    ],
    defaultContentValues: {
      description: 'Use live broker and market feed status.',
      label: 'Enable live checks',
    },
    renderPreview: (parameters, contentValues) => (
      <CheckboxExample
        checked={Boolean(parameters.checked)}
        description={String(contentValues.description ?? '')}
        disabled={Boolean(parameters.disabled)}
        label={String(contentValues.label ?? '')}
      />
    ),
  },
  {
    id: 'slider',
    group: 'Inputs',
    name: 'Slider',
    description: 'Range input for numeric thresholds and weighted settings.',
    status: 'Ready',
    parameters: [
      {
        id: 'value',
        type: 'text',
        label: 'Code value',
        description: 'Sets the slider value from code; dragging the preview can still change it.',
        placeholder: '42',
      },
      {
        id: 'min',
        type: 'text',
        label: 'Minimum',
        description: 'Lowest range value.',
        placeholder: '0',
      },
      {
        id: 'max',
        type: 'text',
        label: 'Maximum',
        description: 'Highest range value.',
        placeholder: '100',
      },
      {
        id: 'step',
        type: 'text',
        label: 'Step',
        description: 'Increment used while dragging.',
        placeholder: '1',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Prevents changing the slider.',
      },
    ],
    defaultParameters: {
      disabled: false,
      max: '100',
      min: '0',
      step: '1',
      value: '42',
    },
    contentTitle: 'Slider Content',
    contentDescription: 'Sample display content rendered beside the slider value.',
    contentControls: [
      {
        id: 'suffix',
        type: 'text',
        label: 'Suffix',
        description: 'Optional unit rendered beside the slider value.',
        placeholder: '%',
      },
    ],
    defaultContentValues: {
      suffix: '%',
    },
    renderPreview: (parameters, contentValues) => (
      <SliderExample
        disabled={Boolean(parameters.disabled)}
        max={getNumberParameter(parameters.max, 100)}
        min={getNumberParameter(parameters.min, 0)}
        step={getNumberParameter(parameters.step, 1)}
        suffix={String(contentValues.suffix ?? '')}
        value={getNumberParameter(parameters.value, 42)}
      />
    ),
  },
  {
    id: 'color-input',
    group: 'Inputs',
    name: 'ColorInput',
    description: 'Color picker with editable hex value.',
    status: 'Ready',
    parameters: [
      {
        id: 'value',
        type: 'color',
        label: 'Code color',
        description: 'Sets the color value from code; editing the preview can still change it.',
        defaultValue: '#05d671',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Prevents changing the color.',
      },
    ],
    defaultParameters: {
      disabled: false,
      value: '#05d671',
    },
    contentTitle: 'Color Input Content',
    contentDescription: 'Sample label rendered above the color field.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Text shown above the color field.',
        placeholder: 'Signal color',
      },
    ],
    defaultContentValues: {
      label: 'Signal color',
    },
    renderPreview: (parameters, contentValues) => (
      <ColorInputExample disabled={Boolean(parameters.disabled)} label={String(contentValues.label ?? '')} value={String(parameters.value ?? '')} />
    ),
  },
  {
    id: 'dropdown',
    group: 'Inputs',
    name: 'Dropdown',
    description: 'Theme-driven dropdown for single selection, multi-selection, and text item lists.',
    status: 'Ready',
    parameters: [
      {
        id: 'mode',
        type: 'select',
        label: 'Mode',
        description: 'Switches between single selection and multi-selection behavior.',
        options: [
          { label: 'Single select', value: 'single' },
          { label: 'Multi select', value: 'multi' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes the trigger height and horizontal padding.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showOptionColors',
        type: 'boolean',
        label: 'Color markers',
        description: 'Shows optional item colors beside selected values and menu items.',
      },
      {
        id: 'selectedIndex',
        type: 'select',
        label: 'Selected option',
        description: 'Controls the selected option from code using the zero-based option index.',
        options: [
          { label: 'First item (0)', value: '0' },
          { label: 'Second item (1)', value: '1' },
          { label: 'Third item (2)', value: '2' },
          { label: 'Fourth item (3)', value: '3' },
        ],
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Prevents opening or changing the dropdown.',
      },
    ],
    defaultParameters: {
      disabled: false,
      mode: 'single',
      selectedIndex: '0',
      showOptionColors: true,
      size: 'comfortable',
    },
    contentTitle: 'Dropdown Items',
    contentDescription: 'Edit the sample options. Use one label per line, with an optional color after a pipe.',
    contentControls: [
      {
        id: 'placeholder',
        type: 'text',
        label: 'Placeholder',
        description: 'Text shown when no item is selected.',
        placeholder: 'Select item',
      },
      {
        id: 'items',
        type: 'richtext',
        label: 'Items',
        description: 'One item per line. Optional format: Label | #05d671.',
        placeholder: dropdownOptionSourceExample,
        rows: 6,
      },
    ],
    defaultContentValues: {
      items: dropdownOptionSourceExample,
      placeholder: 'Select item',
    },
    renderPreview: (parameters, contentValues) => (
      <DropdownExample
        disabled={Boolean(parameters.disabled)}
        multiSelect={parameters.mode === 'multi'}
        optionSource={String(contentValues.items ?? '')}
        placeholder={String(contentValues.placeholder ?? '')}
        selectedIndex={getIndexParameter(parameters.selectedIndex)}
        showOptionColors={Boolean(parameters.showOptionColors)}
        size={parameters.size as DropdownSize}
      />
    ),
  },
  {
    id: 'form-field',
    group: 'Forms / Pickers',
    name: 'FormField',
    description: 'Reusable field wrapper for labels, helper text, required markers, and validation messages.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes field density.', options: formSizeOptions },
      {
        id: 'orientation',
        type: 'select',
        label: 'Orientation',
        description: 'Switches between stacked and inline label layout.',
        options: [
          { label: 'Stacked', value: 'stacked' },
          { label: 'Inline', value: 'inline' },
        ],
      },
      { id: 'state', type: 'select', label: 'State', description: 'Applies validation state styling.', options: formStateOptions },
      { id: 'required', type: 'boolean', label: 'Required', description: 'Shows the required marker beside the label.' },
    ],
    defaultParameters: {
      orientation: 'stacked',
      required: true,
      size: 'comfortable',
      state: 'default',
    },
    contentTitle: 'Field Content',
    contentDescription: 'Label, helper, error, and sample input value.',
    contentControls: [
      { id: 'label', type: 'text', label: 'Label', description: 'Field label.', placeholder: 'Strategy name' },
      { id: 'description', type: 'text', label: 'Description', description: 'Helper text below the label.', placeholder: 'Reusable label and validation wrapper.' },
      { id: 'error', type: 'text', label: 'Error', description: 'Validation message. Empty text hides it.', placeholder: 'Name is required' },
      { id: 'value', type: 'text', label: 'Value', description: 'Sample input value.', placeholder: 'Demo Momentum' },
    ],
    defaultContentValues: {
      description: 'Reusable label, helper text, required marker, and validation message.',
      error: '',
      label: 'Strategy name',
      value: 'Demo Momentum',
    },
    renderPreview: (parameters, contentValues) => (
      <FormFieldExample
        description={String(contentValues.description ?? '')}
        error={String(contentValues.error ?? '')}
        label={String(contentValues.label ?? '')}
        orientation={parameters.orientation as FormFieldOrientation}
        required={Boolean(parameters.required)}
        size={parameters.size as FormControlSize}
        state={parameters.state as FormFieldState}
        value={String(contentValues.value ?? '')}
      />
    ),
  },
  {
    id: 'form-group',
    group: 'Forms / Pickers',
    name: 'FormGroup',
    description: 'Grouped form surface for related controls, with responsive columns and shared density.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes group spacing.', options: formSizeOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: formSurfaceOptions },
      { id: 'columns', type: 'select', label: 'Columns', description: 'Controls the internal field grid.', options: formColumnOptions },
    ],
    defaultParameters: {
      columns: 'two',
      size: 'comfortable',
      variant: 'default',
    },
    contentTitle: 'Group Content',
    contentDescription: 'Legend and helper copy for the group.',
    contentControls: [
      { id: 'legend', type: 'text', label: 'Legend', description: 'Group title.', placeholder: 'Order defaults' },
      { id: 'description', type: 'text', label: 'Description', description: 'Supporting copy.', placeholder: 'Related fields share one surface.' },
    ],
    defaultContentValues: {
      description: 'Related fields share a surface, density, and validation rhythm.',
      legend: 'Order defaults',
    },
    renderPreview: (parameters, contentValues) => (
      <FormGroupExample
        columns={parameters.columns as FormGroupColumns}
        description={String(contentValues.description ?? '')}
        legend={String(contentValues.legend ?? '')}
        size={parameters.size as FormControlSize}
        variant={parameters.variant as FormSurfaceVariant}
      />
    ),
  },
  {
    id: 'option-picker',
    group: 'Forms / Pickers',
    name: 'OptionPicker',
    description: 'Theme-driven card or chip picker for single and multi-selection choices.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes option density.', options: formSizeOptions },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Switches between card and chip presentation.',
        options: [
          { label: 'Cards', value: 'cards' },
          { label: 'Chips', value: 'chips' },
        ],
      },
      {
        id: 'columns',
        type: 'select',
        label: 'Columns',
        description: 'Controls the card grid.',
        options: [{ label: 'Auto', value: 'auto' }, ...formColumnOptions],
      },
      { id: 'multiSelect', type: 'boolean', label: 'Multi-select', description: 'Allows multiple selected options.' },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables all options.' },
    ],
    defaultParameters: {
      columns: 'auto',
      disabled: false,
      multiSelect: false,
      size: 'comfortable',
      variant: 'cards',
    },
    contentTitle: 'Selection',
    contentDescription: 'Selected values, one per line for multi-select.',
    contentControls: [
      { id: 'selectedValues', type: 'richtext', label: 'Selected values', description: 'Use simulation, watch, or paper.', placeholder: 'simulation', rows: 3 },
    ],
    defaultContentValues: {
      selectedValues: 'simulation',
    },
    renderPreview: (parameters, contentValues) => {
      const selectedValues = getTextListParameter(contentValues.selectedValues, ['simulation']);

      return (
        <OptionPickerExample
          columns={parameters.columns as FormGroupColumns | 'auto'}
          disabled={Boolean(parameters.disabled)}
          multiSelect={Boolean(parameters.multiSelect)}
          size={parameters.size as FormControlSize}
          value={parameters.multiSelect ? selectedValues : selectedValues[0]}
          variant={parameters.variant as OptionPickerVariant}
        />
      );
    },
  },
  {
    id: 'date-picker',
    group: 'Forms / Pickers',
    name: 'DatePicker',
    description: 'Themed calendar picker with month navigation, today shortcut, and code-driven value.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes trigger density.', options: formSizeOptions },
      { id: 'weekStartsOn', type: 'select', label: 'Week start', description: 'Controls weekday ordering.', options: weekStartOptions },
      { id: 'showTodayButton', type: 'boolean', label: 'Today button', description: 'Shows the Today shortcut.' },
      { id: 'required', type: 'boolean', label: 'Required', description: 'Shows the required marker.' },
      { id: 'readOnly', type: 'boolean', label: 'Read only', description: 'Prevents opening the picker.' },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables the picker.' },
    ],
    defaultParameters: {
      disabled: false,
      readOnly: false,
      required: false,
      showTodayButton: true,
      size: 'comfortable',
      weekStartsOn: 'monday',
    },
    contentTitle: 'Date Content',
    contentDescription: 'Label, helper copy, and initial ISO date value.',
    contentControls: [
      { id: 'label', type: 'text', label: 'Label', description: 'Picker label.', placeholder: 'Session date' },
      { id: 'description', type: 'text', label: 'Description', description: 'Helper copy.', placeholder: 'Select a trading session date.' },
      { id: 'value', type: 'text', label: 'Value', description: 'ISO date value in YYYY-MM-DD format.', placeholder: '2026-07-02' },
    ],
    defaultContentValues: {
      description: 'Select a trading session date.',
      label: 'Session date',
      value: '2026-07-02',
    },
    renderPreview: (parameters, contentValues) => (
      <DatePickerExample
        description={String(contentValues.description ?? '')}
        disabled={Boolean(parameters.disabled)}
        label={String(contentValues.label ?? '')}
        readOnly={Boolean(parameters.readOnly)}
        required={Boolean(parameters.required)}
        showTodayButton={Boolean(parameters.showTodayButton)}
        size={parameters.size as FormControlSize}
        value={String(contentValues.value ?? '')}
        weekStartsOn={parameters.weekStartsOn as WeekStart}
      />
    ),
  },
  {
    id: 'time-picker',
    group: 'Forms / Pickers',
    name: 'TimePicker',
    description: 'Scrollable themed time picker with configurable step size and 12/24 hour labels.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes trigger density.', options: formSizeOptions },
      {
        id: 'format',
        type: 'select',
        label: 'Format',
        description: 'Controls display format.',
        options: [
          { label: '24 hour', value: '24h' },
          { label: '12 hour', value: '12h' },
        ],
      },
      {
        id: 'stepMinutes',
        type: 'select',
        label: 'Step',
        description: 'Controls option interval.',
        options: [
          { label: '5 min', value: '5' },
          { label: '15 min', value: '15' },
          { label: '30 min', value: '30' },
          { label: '60 min', value: '60' },
        ],
      },
      { id: 'required', type: 'boolean', label: 'Required', description: 'Shows the required marker.' },
      { id: 'readOnly', type: 'boolean', label: 'Read only', description: 'Prevents opening the picker.' },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables the picker.' },
    ],
    defaultParameters: {
      disabled: false,
      format: '24h',
      readOnly: false,
      required: false,
      size: 'comfortable',
      stepMinutes: '15',
    },
    contentTitle: 'Time Content',
    contentDescription: 'Label, helper copy, and initial time value.',
    contentControls: [
      { id: 'label', type: 'text', label: 'Label', description: 'Picker label.', placeholder: 'Start time' },
      { id: 'description', type: 'text', label: 'Description', description: 'Helper copy.', placeholder: 'Choose when the run should start.' },
      { id: 'value', type: 'text', label: 'Value', description: 'Time value in HH:mm format.', placeholder: '14:30' },
    ],
    defaultContentValues: {
      description: 'Choose when the run should start.',
      label: 'Start time',
      value: '14:30',
    },
    renderPreview: (parameters, contentValues) => (
      <TimePickerExample
        description={String(contentValues.description ?? '')}
        disabled={Boolean(parameters.disabled)}
        format={parameters.format as TimePickerFormat}
        label={String(contentValues.label ?? '')}
        readOnly={Boolean(parameters.readOnly)}
        required={Boolean(parameters.required)}
        size={parameters.size as FormControlSize}
        stepMinutes={getNumberParameter(parameters.stepMinutes, 15)}
        value={String(contentValues.value ?? '')}
      />
    ),
  },
  {
    id: 'date-range-picker',
    group: 'Forms / Pickers',
    name: 'DateRangePicker',
    description: 'Composed range picker with start/end dates and quick presets.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes picker density.', options: formSizeOptions },
      { id: 'weekStartsOn', type: 'select', label: 'Week start', description: 'Controls weekday ordering.', options: weekStartOptions },
      { id: 'showPresets', type: 'boolean', label: 'Presets', description: 'Shows Today, 7D, and 30D presets.' },
      { id: 'required', type: 'boolean', label: 'Required', description: 'Shows required markers.' },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables both pickers.' },
    ],
    defaultParameters: {
      disabled: false,
      required: false,
      showPresets: true,
      size: 'comfortable',
      weekStartsOn: 'monday',
    },
    contentTitle: 'Range Content',
    contentDescription: 'Initial ISO start and end values.',
    contentControls: [
      { id: 'description', type: 'text', label: 'Description', description: 'Helper copy.', placeholder: 'Select the analysis window.' },
      { id: 'start', type: 'text', label: 'Start', description: 'Start ISO date.', placeholder: '2026-06-26' },
      { id: 'end', type: 'text', label: 'End', description: 'End ISO date.', placeholder: '2026-07-02' },
    ],
    defaultContentValues: {
      description: 'Select the analysis window.',
      end: '2026-07-02',
      start: '2026-06-26',
    },
    renderPreview: (parameters, contentValues) => (
      <DateRangePickerExample
        description={String(contentValues.description ?? '')}
        disabled={Boolean(parameters.disabled)}
        required={Boolean(parameters.required)}
        showPresets={Boolean(parameters.showPresets)}
        size={parameters.size as FormControlSize}
        value={{ end: String(contentValues.end ?? ''), start: String(contentValues.start ?? '') }}
        weekStartsOn={parameters.weekStartsOn as WeekStart}
      />
    ),
  },
  {
    id: 'file-picker',
    group: 'Forms / Pickers',
    name: 'FilePicker',
    description: 'Themed drag/drop or browse picker for local file names, without upload behavior.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes picker density.', options: formSizeOptions },
      { id: 'multiple', type: 'boolean', label: 'Multiple', description: 'Allows more than one file.' },
      {
        id: 'maxFiles',
        type: 'select',
        label: 'Max files',
        description: 'Limits selected file names.',
        options: [
          { label: '1', value: '1' },
          { label: '3', value: '3' },
          { label: '5', value: '5' },
        ],
      },
      { id: 'required', type: 'boolean', label: 'Required', description: 'Shows the required marker.' },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables drag/drop and browse.' },
    ],
    defaultParameters: {
      disabled: false,
      maxFiles: '3',
      multiple: true,
      required: false,
      size: 'comfortable',
    },
    contentTitle: 'File Content',
    contentDescription: 'Labels, accepted extension string, and selected file names.',
    contentControls: [
      { id: 'label', type: 'text', label: 'Label', description: 'Picker label.', placeholder: 'Strategy config' },
      { id: 'description', type: 'text', label: 'Description', description: 'Helper copy.', placeholder: 'YAML and JSON strategy configs are accepted.' },
      { id: 'accept', type: 'text', label: 'Accept', description: 'Native accept string.', placeholder: '.yaml,.yml,.json' },
      { id: 'files', type: 'richtext', label: 'Selected files', description: 'One file name per line.', placeholder: filePickerFilesExample, rows: 3 },
    ],
    defaultContentValues: {
      accept: '.yaml,.yml,.json',
      description: 'YAML and JSON strategy configs are accepted.',
      files: filePickerFilesExample,
      label: 'Strategy config',
    },
    renderPreview: (parameters, contentValues) => (
      <FilePickerExample
        accept={String(contentValues.accept ?? '')}
        description={String(contentValues.description ?? '')}
        disabled={Boolean(parameters.disabled)}
        label={String(contentValues.label ?? '')}
        maxFiles={getNumberParameter(parameters.maxFiles, 3)}
        multiple={Boolean(parameters.multiple)}
        required={Boolean(parameters.required)}
        selectedFiles={getTextListParameter(contentValues.files, ['demo-momentum.yaml'])}
        size={parameters.size as FormControlSize}
      />
    ),
  },
  {
    id: 'tag-picker',
    group: 'Forms / Pickers',
    name: 'TagPicker',
    description: 'Multi-select tag picker with reusable options and optional custom tags.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes tag picker density.', options: formSizeOptions },
      { id: 'allowCustomTags', type: 'boolean', label: 'Custom tags', description: 'Allows adding ad-hoc tags from text input.' },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables selection and custom entry.' },
    ],
    defaultParameters: {
      allowCustomTags: true,
      disabled: false,
      size: 'comfortable',
    },
    contentTitle: 'Tag Content',
    contentDescription: 'Initial selected tag values.',
    contentControls: [
      { id: 'label', type: 'text', label: 'Label', description: 'Picker label.', placeholder: 'Strategy tags' },
      { id: 'selectedValues', type: 'richtext', label: 'Selected values', description: 'Comma or line separated tag values.', placeholder: 'momentum,review', rows: 3 },
    ],
    defaultContentValues: {
      label: 'Strategy tags',
      selectedValues: 'momentum,review',
    },
    renderPreview: (parameters, contentValues) => (
      <TagPickerExample
        allowCustomTags={Boolean(parameters.allowCustomTags)}
        disabled={Boolean(parameters.disabled)}
        label={String(contentValues.label ?? '')}
        selectedValues={String(contentValues.selectedValues ?? '')}
        size={parameters.size as FormControlSize}
      />
    ),
  },
  {
    id: 'date-time-picker',
    group: 'Forms / Pickers',
    name: 'DateTimePicker',
    description: 'Composed date and time picker for scheduled runs and workflow windows.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes picker density.', options: formSizeOptions },
      { id: 'format', type: 'select', label: 'Format', description: 'Switches between 24-hour and 12-hour time labels.', options: [{ label: '24 hour', value: '24h' }, { label: '12 hour', value: '12h' }] },
      { id: 'weekStartsOn', type: 'select', label: 'Week start', description: 'Controls weekday ordering.', options: weekStartOptions },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables both date and time pickers.' },
    ],
    defaultParameters: {
      disabled: false,
      format: '24h',
      size: 'comfortable',
      weekStartsOn: 'monday',
    },
    contentTitle: 'Date Time Content',
    contentDescription: 'Initial ISO-like date-time value.',
    contentControls: [
      { id: 'label', type: 'text', label: 'Label', description: 'Picker label.', placeholder: 'Run schedule' },
      { id: 'value', type: 'text', label: 'Value', description: 'YYYY-MM-DDTHH:mm value.', placeholder: '2026-07-02T14:30' },
    ],
    defaultContentValues: {
      label: 'Run schedule',
      value: '2026-07-02T14:30',
    },
    renderPreview: (parameters, contentValues) => (
      <DateTimePickerExample
        disabled={Boolean(parameters.disabled)}
        format={parameters.format as TimePickerFormat}
        label={String(contentValues.label ?? '')}
        size={parameters.size as FormControlSize}
        value={String(contentValues.value ?? '')}
        weekStartsOn={parameters.weekStartsOn as WeekStart}
      />
    ),
  },
  {
    id: 'validation-summary',
    group: 'Forms / Pickers',
    name: 'ValidationSummary',
    description: 'Grouped validation messages for form-level errors, warnings, and successes.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes summary density.', options: formSizeOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes summary surface treatment.', options: formSurfaceOptions },
    ],
    defaultParameters: {
      size: 'comfortable',
      variant: 'default',
    },
    contentTitle: 'Summary Content',
    contentDescription: 'Title shown above validation messages.',
    contentControls: [
      { id: 'title', type: 'text', label: 'Title', description: 'Summary title.', placeholder: 'Ticket validation' },
    ],
    defaultContentValues: {
      title: 'Ticket validation',
    },
    renderPreview: (parameters, contentValues) => (
      <ValidationSummaryExample size={parameters.size as FormControlSize} title={String(contentValues.title ?? '')} variant={parameters.variant as FormSurfaceVariant} />
    ),
  },
  {
    id: 'form-actions',
    group: 'Forms / Pickers',
    name: 'FormActions',
    description: 'Reusable form action bar with alignment, busy, and sticky options.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes button density.', options: formSizeOptions },
      { id: 'alignment', type: 'select', label: 'Alignment', description: 'Aligns action buttons within the bar.', options: formActionAlignmentOptions },
      { id: 'busy', type: 'boolean', label: 'Busy', description: 'Disables actions and shows busy feedback on primary action.' },
      { id: 'sticky', type: 'boolean', label: 'Sticky', description: 'Uses sticky form-footer treatment.' },
    ],
    defaultParameters: {
      alignment: 'end',
      busy: false,
      size: 'comfortable',
      sticky: false,
    },
    renderPreview: (parameters) => (
      <FormActionsExample
        alignment={parameters.alignment as 'start' | 'end' | 'between'}
        busy={Boolean(parameters.busy)}
        size={parameters.size as FormControlSize}
        sticky={Boolean(parameters.sticky)}
      />
    ),
  },
  {
    id: 'app-shell',
    group: 'Layout / App Shell',
    name: 'AppShell',
    description: 'Full application frame composed from top bar, sidebar navigation, content, inspector, and status bar slots.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes shell content padding.', options: layoutDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets the shell surface treatment.', options: layoutVariantOptions },
      { id: 'preset', type: 'select', label: 'Preset', description: 'Applies a reusable shell composition preset.', options: layoutShellPresetOptions },
      { id: 'sidebarCollapsed', type: 'boolean', label: 'Collapsed nav', description: 'Shows the sidebar as an icon rail.' },
      { id: 'showBreadcrumbs', type: 'boolean', label: 'Breadcrumbs', description: 'Shows app-level breadcrumb slot above content.' },
      { id: 'fullHeight', type: 'boolean', label: 'Full frame', description: 'Lets the composed app shell fill the available preview frame.' },
    ],
    defaultParameters: {
      density: 'comfortable',
      fullHeight: true,
      preset: 'workspace',
      showBreadcrumbs: true,
      sidebarCollapsed: false,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <AppShellExample
        density={parameters.density as LayoutDensity}
        fullHeight={Boolean(parameters.fullHeight)}
        preset={parameters.preset as LayoutShellPreset}
        showBreadcrumbs={Boolean(parameters.showBreadcrumbs)}
        sidebarCollapsed={Boolean(parameters.sidebarCollapsed)}
        variant={parameters.variant as LayoutSurfaceVariant}
      />
    ),
  },
  {
    id: 'top-bar',
    group: 'Layout / App Shell',
    name: 'TopBar',
    description: 'Application top bar with brand, page identity, subtitle, and action slots.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes top bar height and action button size.', options: layoutDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets top bar surface treatment.', options: layoutVariantOptions },
      {
        id: 'selectedActionId',
        type: 'select',
        label: 'Selected action',
        description: 'Sets the active action from code.',
        options: [
          { label: 'Run', value: 'run' },
          { label: 'Alerts', value: 'alerts' },
          { label: 'Settings', value: 'settings' },
        ],
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectedActionId: 'run',
      variant: 'default',
    },
    contentTitle: 'Top Bar Content',
    contentDescription: 'Brand and workspace identity text.',
    contentControls: [
      { id: 'brand', type: 'text', label: 'Brand', description: 'Small brand label.', placeholder: 'Agentic UI' },
      { id: 'title', type: 'text', label: 'Title', description: 'Main top bar title.', placeholder: 'Demo workspace' },
      { id: 'subtitle', type: 'text', label: 'Subtitle', description: 'Supporting state text.', placeholder: 'Paper runtime connected' },
    ],
    defaultContentValues: {
      brand: 'Agentic UI',
      subtitle: 'Paper runtime connected',
      title: 'Demo workspace',
    },
    renderPreview: (parameters, contentValues) => (
      <TopBarExample
        brand={String(contentValues.brand ?? '')}
        density={parameters.density as LayoutDensity}
        selectedActionId={String(parameters.selectedActionId ?? 'run')}
        subtitle={String(contentValues.subtitle ?? '')}
        title={String(contentValues.title ?? '')}
        variant={parameters.variant as LayoutSurfaceVariant}
      />
    ),
  },
  {
    id: 'sidebar-nav',
    group: 'Layout / App Shell',
    name: 'SidebarNav',
    description: 'Selectable sidebar navigation with optional descriptions, badges, and collapsed icon-rail mode.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes row density.', options: layoutDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets sidebar surface treatment.', options: layoutVariantOptions },
      { id: 'collapsed', type: 'boolean', label: 'Collapsed', description: 'Hides labels and shows an icon rail.' },
      {
        id: 'selectedId',
        type: 'select',
        label: 'Selected item',
        description: 'Sets selected navigation item from code.',
        options: [
          { label: 'Strategies', value: 'strategies' },
          { label: 'Portfolio', value: 'portfolio' },
          { label: 'Markets', value: 'markets' },
          { label: 'Risk', value: 'risk' },
          { label: 'Runtime', value: 'runtime' },
        ],
      },
    ],
    defaultParameters: {
      collapsed: false,
      density: 'comfortable',
      selectedId: 'strategies',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <SidebarNavExample
        collapsed={Boolean(parameters.collapsed)}
        density={parameters.density as LayoutDensity}
        selectedId={String(parameters.selectedId ?? 'strategies')}
        variant={parameters.variant as LayoutSurfaceVariant}
      />
    ),
  },
  {
    id: 'page-header',
    group: 'Layout / App Shell',
    name: 'PageHeader',
    description: 'Page-level heading block with eyebrow, description, metadata, and action slots.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes header spacing.', options: layoutDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets header surface treatment.', options: layoutVariantOptions },
    ],
    defaultParameters: {
      density: 'comfortable',
      variant: 'default',
    },
    contentTitle: 'Header Content',
    contentDescription: 'Text slots used by the page heading.',
    contentControls: [
      { id: 'eyebrow', type: 'text', label: 'Eyebrow', description: 'Small context label.', placeholder: 'Portfolio control' },
      { id: 'title', type: 'text', label: 'Title', description: 'Main page title.', placeholder: 'Demo workspace overview' },
      { id: 'description', type: 'text', label: 'Description', description: 'Supporting copy.', placeholder: 'Monitor generated strategies.' },
      { id: 'meta', type: 'text', label: 'Meta', description: 'Small update/status text.', placeholder: 'Updated 14:08:12' },
    ],
    defaultContentValues: {
      description: 'Monitor generated strategies, active positions, and runtime health in one workspace.',
      eyebrow: 'Portfolio control',
      meta: 'Updated 14:08:12',
      title: 'Demo workspace overview',
    },
    renderPreview: (parameters, contentValues) => (
      <PageHeaderExample
        density={parameters.density as LayoutDensity}
        description={String(contentValues.description ?? '')}
        eyebrow={String(contentValues.eyebrow ?? '')}
        meta={String(contentValues.meta ?? '')}
        title={String(contentValues.title ?? '')}
        variant={parameters.variant as LayoutSurfaceVariant}
      />
    ),
  },
  {
    id: 'split-pane',
    group: 'Layout / App Shell',
    name: 'SplitPane',
    description: 'Two-pane layout with horizontal or vertical orientation and a draggable divider.',
    status: 'Ready',
    parameters: [
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets split pane surface treatment.', options: layoutVariantOptions },
      { id: 'orientation', type: 'select', label: 'Orientation', description: 'Controls pane direction.', options: layoutOrientationOptions },
      {
        id: 'splitPercent',
        type: 'select',
        label: 'Split',
        description: 'Sets the initial split from code.',
        options: [
          { label: '30%', value: '30' },
          { label: '42%', value: '42' },
          { label: '50%', value: '50' },
          { label: '64%', value: '64' },
        ],
      },
      { id: 'resizable', type: 'boolean', label: 'Resizable', description: 'Allows dragging the divider.' },
      { id: 'persistSize', type: 'boolean', label: 'Persist size', description: 'Stores divider position in local storage.' },
    ],
    defaultParameters: {
      orientation: 'horizontal',
      persistSize: true,
      resizable: true,
      splitPercent: '42',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <SplitPaneExample
        orientation={parameters.orientation as LayoutOrientation}
        persistKey={parameters.persistSize ? 'workbench-split-pane' : undefined}
        resizable={Boolean(parameters.resizable)}
        splitPercent={getNumberParameter(parameters.splitPercent, 42)}
        variant={parameters.variant as LayoutSurfaceVariant}
      />
    ),
  },
  {
    id: 'resizable-panel',
    group: 'Layout / App Shell',
    name: 'ResizablePanel',
    description: 'Panel primitive with draggable edge for inspectors, sidebars, and editor panes.',
    status: 'Ready',
    parameters: [
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets panel surface treatment.', options: layoutVariantOptions },
      {
        id: 'direction',
        type: 'select',
        label: 'Resize edge',
        description: 'Chooses which edge is draggable.',
        options: [
          { label: 'Right', value: 'right' },
          { label: 'Left', value: 'left' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Top', value: 'top' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Sets the initial panel size from code.',
        options: [
          { label: '280', value: '280' },
          { label: '360', value: '360' },
          { label: '480', value: '480' },
        ],
      },
      { id: 'resizable', type: 'boolean', label: 'Resizable', description: 'Shows or hides the resize edge.' },
      { id: 'persistSize', type: 'boolean', label: 'Persist size', description: 'Stores panel size in local storage.' },
    ],
    defaultParameters: {
      direction: 'right',
      persistSize: true,
      resizable: true,
      size: '360',
      variant: 'default',
    },
    contentTitle: 'Panel Content',
    contentDescription: 'Header text for the resizable panel.',
    contentControls: [
      { id: 'title', type: 'text', label: 'Title', description: 'Panel title.', placeholder: 'Node inspector' },
      { id: 'description', type: 'text', label: 'Description', description: 'Panel helper copy.', placeholder: 'Drag the edge to resize the panel.' },
    ],
    defaultContentValues: {
      description: 'Drag the edge to resize the panel.',
      title: 'Node inspector',
    },
    renderPreview: (parameters, contentValues) => (
      <ResizablePanelExample
        description={String(contentValues.description ?? '')}
        direction={parameters.direction as LayoutPanelResizeDirection}
        persistKey={parameters.persistSize ? 'workbench-resizable-panel' : undefined}
        resizable={Boolean(parameters.resizable)}
        size={getNumberParameter(parameters.size, 360)}
        title={String(contentValues.title ?? '')}
        variant={parameters.variant as LayoutSurfaceVariant}
      />
    ),
  },
  {
    id: 'status-bar',
    group: 'Layout / App Shell',
    name: 'StatusBar',
    description: 'Compact app status strip for runtime, connection, risk, and mode indicators.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes status bar spacing.', options: layoutDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets status bar surface treatment.', options: layoutVariantOptions },
    ],
    defaultParameters: {
      density: 'comfortable',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <StatusBarExample density={parameters.density as LayoutDensity} variant={parameters.variant as LayoutSurfaceVariant} />
    ),
  },
  {
    id: 'timeline',
    group: 'Activity / Workflow',
    name: 'Timeline',
    description: 'Ordered event timeline for strategy runs, state changes, and audit trails.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes item spacing and text density.', options: activityDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets the timeline surface treatment.', options: activityVariantOptions },
      { id: 'orientation', type: 'select', label: 'Orientation', description: 'Switches between vertical and horizontal timeline flow.', options: activityOrientationOptions },
      selectableParameter,
      {
        id: 'selectedId',
        type: 'select',
        label: 'Selected event',
        description: 'Sets the selected timeline event from code; clicking can still change it.',
        options: [
          { label: 'Accepted', value: 'accepted' },
          { label: 'Risk watch', value: 'risk-watch' },
          { label: 'Orders ready', value: 'orders-ready' },
        ],
      },
      { id: 'showTimestamps', type: 'boolean', label: 'Timestamps', description: 'Shows or hides event timestamps.' },
    ],
    defaultParameters: {
      density: 'comfortable',
      orientation: 'vertical',
      selectable: true,
      selectedId: 'risk-watch',
      showTimestamps: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <TimelineExample
        density={parameters.density as ActivityDensity}
        orientation={parameters.orientation as ActivityOrientation}
        selectable={Boolean(parameters.selectable)}
        selectedId={String(parameters.selectedId ?? 'risk-watch')}
        showTimestamps={Boolean(parameters.showTimestamps)}
        variant={parameters.variant as ActivityVariant}
      />
    ),
  },
  {
    id: 'activity-feed',
    group: 'Activity / Workflow',
    name: 'ActivityFeed',
    description: 'Live activity stream for runtime events, sources, timestamps, and state badges.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes row spacing and type density.', options: activityDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets the feed surface treatment.', options: activityVariantOptions },
      selectableParameter,
      {
        id: 'selectedId',
        type: 'select',
        label: 'Selected activity',
        description: 'Sets the selected feed item from code; clicking can still change it.',
        options: [
          { label: 'Heartbeat', value: 'heartbeat' },
          { label: 'Risk', value: 'risk' },
          { label: 'Orders', value: 'orders' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
      { id: 'showSource', type: 'boolean', label: 'Source labels', description: 'Shows or hides source labels above each activity title.' },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedId: 'risk',
      showSource: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <ActivityFeedExample
        density={parameters.density as ActivityDensity}
        selectable={Boolean(parameters.selectable)}
        selectedId={String(parameters.selectedId ?? 'risk')}
        showSource={Boolean(parameters.showSource)}
        variant={parameters.variant as ActivityVariant}
      />
    ),
  },
  {
    id: 'workflow-stepper',
    group: 'Activity / Workflow',
    name: 'WorkflowStepper',
    description: 'Clickable workflow stepper for process stages, current progress, and step states.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes step spacing and icon size.', options: activityDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets the stepper surface treatment.', options: activityVariantOptions },
      { id: 'orientation', type: 'select', label: 'Orientation', description: 'Switches between horizontal and vertical step layout.', options: activityOrientationOptions },
      selectableParameter,
      {
        id: 'selectedStepId',
        type: 'select',
        label: 'Selected step',
        description: 'Sets the selected workflow step from code; clicking can still change it.',
        options: [
          { label: 'Validate', value: 'validate' },
          { label: 'Simulate', value: 'simulate' },
          { label: 'Risk gate', value: 'risk' },
          { label: 'Submit', value: 'submit' },
        ],
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      orientation: 'horizontal',
      selectable: true,
      selectedStepId: 'simulate',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <WorkflowStepperExample
        density={parameters.density as ActivityDensity}
        orientation={parameters.orientation as ActivityOrientation}
        selectable={Boolean(parameters.selectable)}
        selectedStepId={String(parameters.selectedStepId ?? 'simulate')}
        variant={parameters.variant as ActivityVariant}
      />
    ),
  },
  {
    id: 'run-queue',
    group: 'Activity / Workflow',
    name: 'RunQueue',
    description: 'Queued workflow runs with status badges, progress, selection, and action buttons.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes queue row spacing and button size.', options: activityDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Sets the queue surface treatment.', options: activityVariantOptions },
      selectableParameter,
      {
        id: 'selectedId',
        type: 'select',
        label: 'Selected run',
        description: 'Sets the selected queue item from code; clicking can still change it.',
        options: [
          { label: 'Simulation', value: 'simulation' },
          { label: 'Approval', value: 'approval' },
          { label: 'Quality scan', value: 'quality' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
      { id: 'showProgress', type: 'boolean', label: 'Progress', description: 'Shows or hides progress bars for each queued item.' },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedId: 'simulation',
      showProgress: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <RunQueueExample
        density={parameters.density as ActivityDensity}
        selectable={Boolean(parameters.selectable)}
        selectedId={String(parameters.selectedId ?? 'simulation')}
        showProgress={Boolean(parameters.showProgress)}
        variant={parameters.variant as ActivityVariant}
      />
    ),
  },
  {
    id: 'execution-timeline',
    group: 'Activity / Workflow',
    name: 'ExecutionTimeline',
    description: 'Phase timeline for execution pipelines with progress and status states.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes phase spacing.', options: activityDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: activityVariantOptions },
      selectableParameter,
      {
        id: 'selectedPhaseId',
        type: 'select',
        label: 'Selected phase',
        description: 'Sets selected phase from code.',
        options: [
          { label: 'Hydrate', value: 'hydrate' },
          { label: 'Score', value: 'score' },
          { label: 'Validate', value: 'validate' },
          { label: 'Route', value: 'route' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedPhaseId: 'score',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <ExecutionTimelineExample
        density={parameters.density as ActivityDensity}
        selectable={Boolean(parameters.selectable)}
        selectedPhaseId={String(parameters.selectedPhaseId ?? 'score')}
        variant={parameters.variant as ActivityVariant}
      />
    ),
  },
  {
    id: 'audit-trail',
    group: 'Activity / Workflow',
    name: 'AuditTrail',
    description: 'Chronological audit events with actors, states, timestamps, and selection.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes audit row spacing.', options: activityDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: activityVariantOptions },
      selectableParameter,
      { id: 'showActors', type: 'boolean', label: 'Actors', description: 'Shows actor/source labels.' },
      {
        id: 'selectedEntryId',
        type: 'select',
        label: 'Selected entry',
        description: 'Sets selected audit event from code.',
        options: [
          { label: 'Runtime 105', value: '105' },
          { label: 'Approval 106', value: '106' },
          { label: 'Blocked 107', value: '107' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedEntryId: '106',
      showActors: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <AuditTrailExample
        density={parameters.density as ActivityDensity}
        selectable={Boolean(parameters.selectable)}
        selectedEntryId={String(parameters.selectedEntryId ?? '106')}
        showActors={Boolean(parameters.showActors)}
        variant={parameters.variant as ActivityVariant}
      />
    ),
  },
  {
    id: 'job-detail-panel',
    group: 'Activity / Workflow',
    name: 'JobDetailPanel',
    description: 'Focused job detail panel with status, progress, and runtime metrics.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes panel spacing.', options: activityDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: activityVariantOptions },
      { id: 'state', type: 'select', label: 'State', description: 'Sets job state.', options: runQueueStateOptions },
      { id: 'progress', type: 'text', label: 'Progress', description: 'Progress value from 0 to 100.', placeholder: '62' },
    ],
    defaultParameters: {
      density: 'comfortable',
      progress: '62',
      state: 'running',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <JobDetailPanelExample
        density={parameters.density as ActivityDensity}
        progress={getNumberParameter(parameters.progress, 62)}
        state={parameters.state as RunQueueState}
        variant={parameters.variant as ActivityVariant}
      />
    ),
  },
  {
    id: 'workflow-dependency-graph',
    group: 'Activity / Workflow',
    name: 'WorkflowDependencyGraph',
    description: 'Dependency summary for workflow steps and prerequisite relationships.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes graph row spacing.', options: activityDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: activityVariantOptions },
      selectableParameter,
      {
        id: 'selectedNodeId',
        type: 'select',
        label: 'Selected node',
        description: 'Sets selected node from code.',
        options: [
          { label: 'Hydrate', value: 'hydrate' },
          { label: 'Score', value: 'score' },
          { label: 'Validate', value: 'validate' },
          { label: 'Route', value: 'route' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedNodeId: 'score',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <WorkflowDependencyGraphExample
        density={parameters.density as ActivityDensity}
        selectable={Boolean(parameters.selectable)}
        selectedNodeId={String(parameters.selectedNodeId ?? 'score')}
        variant={parameters.variant as ActivityVariant}
      />
    ),
  },
  {
    id: 'message-chat',
    group: 'Communication',
    name: 'MessageChat',
    description: 'Conversation surface for direct messages or team group chats, with participant presence, reactions, delivery state, and a send composer.',
    status: 'Ready',
    parameters: [
      {
        id: 'mode',
        type: 'select',
        label: 'Mode',
        description: 'Switches the header and messages between a direct conversation and a group chat.',
        options: [
          { label: 'Direct message', value: 'direct' },
          { label: 'Group chat', value: 'group' },
        ],
      },
      { id: 'density', type: 'select', label: 'Density', description: 'Changes the message and surface spacing.', options: messageChatDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes the chat surface treatment.', options: messageChatVariantOptions },
      { id: 'showParticipants', type: 'boolean', label: 'Participants', description: 'Shows group members in the header and participant strip.', visibleWhen: { parameterId: 'mode', value: 'group' } },
      { id: 'showComposer', type: 'boolean', label: 'Composer', description: 'Shows the interactive message composer.' },
      { id: 'showEmojiPicker', type: 'boolean', label: 'Emoji picker', description: 'Shows the emoji selector at the start of the composer.', visibleWhen: { parameterId: 'showComposer', value: true } },
      { id: 'showTyping', type: 'boolean', label: 'Typing indicator', description: 'Shows an incoming typing indicator beneath the message transcript.' },
      { id: 'readOnly', type: 'boolean', label: 'Read only', description: 'Prevents messages from being sent while retaining the transcript.' },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables the message composer.' },
    ],
    defaultParameters: {
      density: 'comfortable',
      disabled: false,
      mode: 'direct',
      readOnly: false,
      showComposer: true,
      showEmojiPicker: true,
      showParticipants: true,
      showTyping: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <MessageChatExample
        density={parameters.density as MessageChatDensity}
        disabled={Boolean(parameters.disabled)}
        mode={parameters.mode as MessageChatMode}
        readOnly={Boolean(parameters.readOnly)}
        showComposer={Boolean(parameters.showComposer)}
        showEmojiPicker={Boolean(parameters.showEmojiPicker)}
        showParticipants={Boolean(parameters.showParticipants)}
        showTyping={Boolean(parameters.showTyping)}
        variant={parameters.variant as MessageChatVariant}
      />
    ),
  },
  {
    id: 'panel',
    group: 'Surfaces',
    name: 'Panel',
    description: 'Standard container for inspectors, tool areas, and reusable layout regions.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the surface treatment while staying theme-driven.',
        options: [
          { label: 'Outlined', value: 'outlined' },
          { label: 'Filled', value: 'filled' },
          { label: 'Raised', value: 'raised' },
        ],
      },
      {
        id: 'padding',
        type: 'select',
        label: 'Padding',
        description: 'Controls the interior spacing for the panel body and chrome.',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showFooter',
        type: 'boolean',
        label: 'Footer',
        description: 'Shows or hides the optional footer slot.',
      },
    ],
    defaultParameters: {
      padding: 'comfortable',
      showFooter: true,
      variant: 'outlined',
    },
    contentTitle: 'Panel Content',
    contentDescription: 'Sample heading and supporting text for the panel header.',
    contentControls: [
      {
        id: 'heading',
        type: 'text',
        label: 'Heading',
        description: 'Optional panel heading. Empty text removes the heading slot.',
        placeholder: 'Runtime panel',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text below the heading.',
        placeholder: 'Reusable surface for inspectors and tool regions.',
      },
    ],
    defaultContentValues: {
      description: 'Reusable surface for inspectors and tool regions.',
      heading: 'Runtime panel',
    },
    renderPreview: (parameters, contentValues) => (
      <PanelExample
        description={String(contentValues.description ?? '')}
        heading={String(contentValues.heading ?? '')}
        padding={parameters.padding as PanelPadding}
        showFooter={Boolean(parameters.showFooter)}
        variant={parameters.variant as PanelVariant}
      />
    ),
  },
  {
    id: 'card',
    group: 'Surfaces',
    name: 'Card',
    description: 'Repeated content surface for summaries, selectable items, and compact status blocks.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Sets the card emphasis using theme surface tokens.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Accent', value: 'accent' },
        ],
      },
      {
        id: 'padding',
        type: 'select',
        label: 'Padding',
        description: 'Changes card interior spacing.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'interactive',
        type: 'boolean',
        label: 'Interactive',
        description: 'Adds hover and focus-ready treatment for clickable cards.',
      },
      {
        id: 'selected',
        type: 'boolean',
        label: 'Selected',
        description: 'Shows the selected state for code-driven selection.',
      },
    ],
    defaultParameters: {
      interactive: true,
      padding: 'comfortable',
      selected: false,
      variant: 'default',
    },
    contentTitle: 'Card Content',
    contentDescription: 'Sample text slots rendered by the card header.',
    contentControls: [
      {
        id: 'eyebrow',
        type: 'text',
        label: 'Eyebrow',
        description: 'Optional small label above the card title.',
        placeholder: 'Strategy',
      },
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Primary card title.',
        placeholder: 'Demo Momentum',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting card text.',
        placeholder: 'Reusable compact surface for repeated summaries.',
      },
      {
        id: 'meta',
        type: 'text',
        label: 'Meta',
        description: 'Optional trailing header label.',
        placeholder: 'Ready',
      },
    ],
    defaultContentValues: {
      description: 'Reusable compact surface for repeated summaries.',
      eyebrow: 'Strategy',
      meta: 'Ready',
      title: 'Demo Momentum',
    },
    renderPreview: (parameters, contentValues) => (
      <CardExample
        description={String(contentValues.description ?? '')}
        eyebrow={String(contentValues.eyebrow ?? '')}
        interactive={Boolean(parameters.interactive)}
        meta={String(contentValues.meta ?? '')}
        padding={parameters.padding as CardPadding}
        selected={Boolean(parameters.selected)}
        title={String(contentValues.title ?? '')}
        variant={parameters.variant as CardVariant}
      />
    ),
  },
  {
    id: 'section',
    group: 'Surfaces',
    name: 'Section',
    description: 'Titled content region with optional disclosure, divider, and footer slots.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Switches between open layout and panel-backed section chrome.',
        options: [
          { label: 'Plain', value: 'plain' },
          { label: 'Panel', value: 'panel' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes vertical spacing for the section content.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'collapsible',
        type: 'boolean',
        label: 'Collapsible',
        description: 'Enables the disclosure button and collapse animation.',
      },
      {
        id: 'collapsed',
        type: 'boolean',
        label: 'Collapsed',
        description: 'Sets the collapsed state from code; clicking the header can still change it.',
        visibleWhen: { parameterId: 'collapsible', value: true },
      },
      {
        id: 'showDivider',
        type: 'boolean',
        label: 'Divider',
        description: 'Shows a divider between the section heading and body.',
      },
    ],
    defaultParameters: {
      collapsed: false,
      collapsible: true,
      density: 'comfortable',
      showDivider: true,
      variant: 'panel',
    },
    contentTitle: 'Section Content',
    contentDescription: 'Sample heading and supporting text for the section header.',
    contentControls: [
      {
        id: 'heading',
        type: 'text',
        label: 'Heading',
        description: 'Optional section heading.',
        placeholder: 'Execution settings',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional text shown below the heading.',
        placeholder: 'A titled region for related controls or content.',
      },
    ],
    defaultContentValues: {
      description: 'A titled region for related controls or content.',
      heading: 'Execution settings',
    },
    renderPreview: (parameters, contentValues) => (
      <SectionExample
        collapsed={Boolean(parameters.collapsed)}
        collapsible={Boolean(parameters.collapsible)}
        density={parameters.density as SectionDensity}
        description={String(contentValues.description ?? '')}
        heading={String(contentValues.heading ?? '')}
        showDivider={Boolean(parameters.showDivider)}
        variant={parameters.variant as SectionVariant}
      />
    ),
  },
  {
    id: 'divider',
    group: 'Surfaces',
    name: 'Divider',
    description: 'Horizontal or vertical separator with optional label and theme-driven tones.',
    status: 'Ready',
    parameters: [
      {
        id: 'orientation',
        type: 'select',
        label: 'Orientation',
        description: 'Chooses horizontal or vertical separation.',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Maps divider strength to border theme tokens.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Strong', value: 'strong' },
        ],
      },
      {
        id: 'inset',
        type: 'select',
        label: 'Inset',
        description: 'Adds leading or symmetric spacing to the divider line.',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Start', value: 'start' },
          { label: 'Both', value: 'both' },
        ],
      },
    ],
    defaultParameters: {
      inset: 'none',
      orientation: 'horizontal',
      tone: 'default',
    },
    contentTitle: 'Divider Content',
    contentDescription: 'Optional horizontal divider label.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional label rendered in horizontal orientation.',
        placeholder: 'Risk controls',
      },
    ],
    defaultContentValues: {
      label: 'Risk controls',
    },
    renderPreview: (parameters, contentValues) => (
      <DividerExample
        inset={parameters.inset as DividerInset}
        label={String(contentValues.label ?? '')}
        orientation={parameters.orientation as DividerOrientation}
        tone={parameters.tone as DividerTone}
      />
    ),
  },
  {
    id: 'toolbar',
    group: 'Surfaces',
    name: 'Toolbar',
    description: 'Dense action row or column for local tools, editor actions, and preview controls.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes whether the toolbar is open, filled, or outlined.',
        options: [
          { label: 'Plain', value: 'plain' },
          { label: 'Filled', value: 'filled' },
          { label: 'Outlined', value: 'outlined' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes toolbar gap and padding.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'orientation',
        type: 'select',
        label: 'Orientation',
        description: 'Renders actions as a row or column.',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ],
      },
      {
        id: 'justify',
        type: 'select',
        label: 'Justify',
        description: 'Places toolbar actions along the main axis.',
        options: [
          { label: 'Start', value: 'start' },
          { label: 'Center', value: 'center' },
          { label: 'Between', value: 'between' },
          { label: 'End', value: 'end' },
        ],
      },
      {
        id: 'wrap',
        type: 'boolean',
        label: 'Wrap',
        description: 'Allows actions to wrap when the preview frame is narrow.',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      justify: 'start',
      orientation: 'horizontal',
      variant: 'outlined',
      wrap: true,
    },
    renderPreview: (parameters) => (
      <ToolbarExample
        density={parameters.density as ToolbarDensity}
        justify={parameters.justify as ToolbarJustify}
        orientation={parameters.orientation as ToolbarOrientation}
        variant={parameters.variant as ToolbarVariant}
        wrap={Boolean(parameters.wrap)}
      />
    ),
  },
  {
    id: 'empty-state',
    group: 'Surfaces',
    name: 'EmptyState',
    description: 'Themed placeholder for empty lists, missing selections, and unconfigured views.',
    status: 'Ready',
    parameters: [
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Maps the empty state accent to a theme semantic token.',
        options: [
          { label: 'Neutral', value: 'neutral' },
          { label: 'Accent', value: 'accent' },
          { label: 'Warning', value: 'warning' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes spacing and overall density.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'alignment',
        type: 'select',
        label: 'Alignment',
        description: 'Centers content or aligns it to the start edge.',
        options: [
          { label: 'Center', value: 'center' },
          { label: 'Start', value: 'start' },
        ],
      },
      {
        id: 'showIcon',
        type: 'boolean',
        label: 'Icon',
        description: 'Shows or hides the empty-state icon.',
      },
      {
        id: 'showAction',
        type: 'boolean',
        label: 'Action',
        description: 'Shows or hides the optional action slot.',
      },
    ],
    defaultParameters: {
      alignment: 'center',
      showAction: true,
      showIcon: true,
      size: 'comfortable',
      tone: 'neutral',
    },
    contentTitle: 'Empty State Content',
    contentDescription: 'Sample title and description for the placeholder.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Optional empty-state title.',
        placeholder: 'No components found',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text.',
        placeholder: 'Create a component or adjust the filters to reveal matching entries.',
      },
    ],
    defaultContentValues: {
      description: 'Create a component or adjust the filters to reveal matching entries.',
      title: 'No components found',
    },
    renderPreview: (parameters, contentValues) => (
      <EmptyStateExample
        alignment={parameters.alignment as EmptyStateAlignment}
        description={String(contentValues.description ?? '')}
        showAction={Boolean(parameters.showAction)}
        showIcon={Boolean(parameters.showIcon)}
        size={parameters.size as EmptyStateSize}
        title={String(contentValues.title ?? '')}
        tone={parameters.tone as EmptyStateTone}
      />
    ),
  },
  {
    id: 'text-area',
    group: 'Content',
    name: 'TextArea',
    description: 'Editable multiline input with auto-resize, read-only mode, resize control, and optional counter.',
    status: 'Ready',
    parameters: [
      {
        id: 'value',
        type: 'richtext',
        label: 'Code value',
        description: 'Sets the textarea value from code; typing in the preview can still change it.',
        placeholder: textAreaValueExample,
        rows: 6,
      },
      {
        id: 'autoResize',
        type: 'boolean',
        label: 'Auto resize',
        description: 'Adjusts height to fit content between the min and max row settings.',
      },
      {
        id: 'resize',
        type: 'select',
        label: 'Resize handle',
        description: 'Controls the browser resize direction when auto-resize is off.',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Vertical', value: 'vertical' },
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Both', value: 'both' },
        ],
      },
      {
        id: 'minRows',
        type: 'text',
        label: 'Min rows',
        description: 'Minimum visible text rows.',
        placeholder: '4',
      },
      {
        id: 'maxRows',
        type: 'text',
        label: 'Max rows',
        description: 'Maximum auto-resize rows before the field scrolls.',
        placeholder: '8',
      },
      {
        id: 'maxLength',
        type: 'text',
        label: 'Max length',
        description: 'Optional character cap shown by the counter.',
        placeholder: '240',
      },
      {
        id: 'showCounter',
        type: 'boolean',
        label: 'Counter',
        description: 'Shows the current character count under the field.',
      },
      {
        id: 'readOnly',
        type: 'boolean',
        label: 'Read only',
        description: 'Allows selection and scrolling without editing.',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Prevents focusing or editing the textarea.',
      },
    ],
    defaultParameters: {
      autoResize: true,
      disabled: false,
      maxLength: '240',
      maxRows: '8',
      minRows: '4',
      readOnly: false,
      resize: 'vertical',
      showCounter: true,
      value: textAreaValueExample,
    },
    contentTitle: 'TextArea Content',
    contentDescription: 'Sample label, description, and placeholder text for the editable field.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Visible field label.',
        placeholder: 'Strategy note',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional helper text under the field.',
        placeholder: 'Editable multiline strategy note.',
      },
      {
        id: 'placeholder',
        type: 'text',
        label: 'Placeholder',
        description: 'Text shown when the field is empty.',
        placeholder: 'Write a note',
      },
    ],
    defaultContentValues: {
      description: 'Editable multiline strategy note.',
      label: 'Strategy note',
      placeholder: 'Write a note',
    },
    renderPreview: (parameters, contentValues) => {
      const minRows = Math.max(1, Math.round(getNumberParameter(parameters.minRows, 4)));
      const maxRows = Math.max(minRows, Math.round(getNumberParameter(parameters.maxRows, 8)));
      const maxLength = Math.max(1, Math.round(getNumberParameter(parameters.maxLength, 240)));

      return (
        <TextAreaExample
          autoResize={Boolean(parameters.autoResize)}
          description={String(contentValues.description ?? '')}
          disabled={Boolean(parameters.disabled)}
          label={String(contentValues.label ?? '')}
          maxLength={maxLength}
          maxRows={maxRows}
          minRows={minRows}
          placeholder={String(contentValues.placeholder ?? '')}
          readOnly={Boolean(parameters.readOnly)}
          resize={parameters.resize as TextAreaResize}
          showCounter={Boolean(parameters.showCounter)}
          value={String(parameters.value ?? '')}
        />
      );
    },
  },
  {
    id: 'text-output',
    group: 'Content',
    name: 'TextOutput',
    description: 'Read-only multiline output with wrapping, copy action, max-height, and themed scrollbar.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the output surface treatment.',
        options: [
          { label: 'Panel', value: 'panel' },
          { label: 'Plain', value: 'plain' },
          { label: 'Code', value: 'code' },
        ],
      },
      {
        id: 'wrap',
        type: 'boolean',
        label: 'Wrap text',
        description: 'Wraps long output lines instead of preserving horizontal scrolling.',
      },
      {
        id: 'showCopyAction',
        type: 'boolean',
        label: 'Copy action',
        description: 'Shows a copy button for the output value.',
      },
      {
        id: 'maxHeight',
        type: 'text',
        label: 'Max height',
        description: 'CSS max-height for the scrollable output body.',
        placeholder: '260px',
      },
    ],
    defaultParameters: {
      maxHeight: '260px',
      showCopyAction: true,
      variant: 'panel',
      wrap: true,
    },
    contentTitle: 'Text Output Content',
    contentDescription: 'Sample output body, label, and helper text.',
    contentControls: [
      {
        id: 'value',
        type: 'richtext',
        label: 'Value',
        description: 'Read-only output text. Empty values show the empty state.',
        placeholder: textOutputValueExample,
        rows: 7,
      },
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional output label.',
        placeholder: 'Execution output',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional helper text under the label.',
        placeholder: 'Read-only strategy output with themed scrolling.',
      },
    ],
    defaultContentValues: {
      description: 'Read-only strategy output with themed scrolling.',
      label: 'Execution output',
      value: textOutputValueExample,
    },
    renderPreview: (parameters, contentValues) => (
      <TextOutputExample
        description={String(contentValues.description ?? '')}
        label={String(contentValues.label ?? '')}
        maxHeight={String(parameters.maxHeight ?? '')}
        showCopyAction={Boolean(parameters.showCopyAction)}
        value={String(contentValues.value ?? '')}
        variant={parameters.variant as TextOutputVariant}
        wrap={Boolean(parameters.wrap)}
      />
    ),
  },
  {
    id: 'markdown-viewer',
    group: 'Content',
    name: 'MarkdownViewer',
    description: 'Theme-driven markdown renderer for docs, generated summaries, and read-only notes.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Switches between panel-backed and plain markdown layout.',
        options: [
          { label: 'Panel', value: 'panel' },
          { label: 'Plain', value: 'plain' },
        ],
      },
      {
        id: 'maxHeight',
        type: 'text',
        label: 'Max height',
        description: 'CSS max-height for the scrollable markdown surface.',
        placeholder: '420px',
      },
    ],
    defaultParameters: {
      maxHeight: '420px',
      variant: 'panel',
    },
    contentTitle: 'Markdown Content',
    contentDescription: 'Markdown source used by the preview. Raw HTML is rendered as text.',
    contentControls: [
      {
        id: 'source',
        type: 'richtext',
        label: 'Markdown source',
        description: 'Supports headings, paragraphs, lists, links, blockquotes, rules, bold text, inline code, and fenced code.',
        placeholder: markdownViewerSourceExample,
        rows: 14,
      },
      {
        id: 'emptyText',
        type: 'text',
        label: 'Empty text',
        description: 'Text shown when the markdown source is empty.',
        placeholder: 'No markdown content',
      },
    ],
    defaultContentValues: {
      emptyText: 'No markdown content',
      source: markdownViewerSourceExample,
    },
    renderPreview: (parameters, contentValues) => (
      <MarkdownViewerExample
        emptyText={String(contentValues.emptyText ?? '')}
        maxHeight={String(parameters.maxHeight ?? '')}
        source={String(contentValues.source ?? '')}
        variant={parameters.variant as MarkdownViewerVariant}
      />
    ),
  },
  {
    id: 'obsidian-graph-view',
    group: 'Content',
    name: 'ObsidianGraphView',
    description: 'Vault document graph with deterministic force layout, backlink-style edges, and selected-note focus.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Switches between a panel-backed graph and a transparent graph surface.',
        options: [
          { label: 'Panel', value: 'panel' },
          { label: 'Plain', value: 'plain' },
        ],
      },
      {
        id: 'labelMode',
        type: 'select',
        label: 'Labels',
        description: 'Controls how many note labels stay visible on the graph.',
        options: [
          { label: 'Active neighbors', value: 'active' },
          { label: 'All', value: 'all' },
          { label: 'None', value: 'none' },
        ],
      },
      {
        id: 'height',
        type: 'text',
        label: 'Height',
        description: 'CSS height for the graph viewport.',
        placeholder: '560px',
      },
    ],
    defaultParameters: {
      height: '560px',
      labelMode: 'active',
      variant: 'panel',
    },
    renderPreview: (parameters) => (
      <ObsidianGraphViewExample
        height={String(parameters.height ?? '')}
        labelMode={parameters.labelMode as ObsidianGraphViewLabelMode}
        variant={parameters.variant as ObsidianGraphViewVariant}
      />
    ),
  },
  {
    id: 'rich-text-viewer',
    group: 'Content',
    name: 'RichTextViewer',
    description: 'Trusted rich HTML viewer for cases where markdown is too limiting.',
    status: 'Ready',
    parameters: [
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes rich text surface treatment.', options: advancedDataVariantOptions },
      { id: 'trusted', type: 'boolean', label: 'Trusted HTML', description: 'Renders HTML when enabled; otherwise shows source text.' },
      { id: 'maxHeight', type: 'text', label: 'Max height', description: 'CSS max-height before scrolling.', placeholder: '420px' },
    ],
    defaultParameters: {
      maxHeight: '420px',
      trusted: true,
      variant: 'default',
    },
    contentTitle: 'Rich HTML',
    contentDescription: 'Trusted HTML source used by the preview.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Optional viewer title.',
        placeholder: 'Trusted rich content',
      },
      {
        id: 'html',
        type: 'richtext',
        label: 'HTML',
        description: 'Rendered as trusted HTML when enabled.',
        rows: 10,
        placeholder: '<h2>Runtime summary</h2><p><strong>Demo Momentum</strong> is online.</p>',
      },
    ],
    defaultContentValues: {
      html: '<h2>Runtime summary</h2><p><strong>Demo Momentum</strong> is online with <code>paper</code> routing enabled.</p><ul><li>Risk gateway: watch</li><li>Signal freshness: 42s</li></ul>',
      title: 'Trusted rich content',
    },
    renderPreview: (parameters, contentValues) => (
      <RichTextViewerExample
        html={String(contentValues.html ?? '')}
        maxHeight={String(parameters.maxHeight ?? '')}
        title={String(contentValues.title ?? '')}
        trusted={Boolean(parameters.trusted)}
        variant={parameters.variant as RichTextViewerVariant}
      />
    ),
  },
  {
    id: 'code-editor',
    group: 'Editors',
    name: 'CodeEditor',
    description: 'CodeMirror-based editor for YAML and other programming languages.',
    status: 'Ready',
    parameters: [
      {
        id: 'language',
        type: 'select',
        label: 'Language',
        description: 'Chooses syntax highlighting and parsing behavior.',
        options: [
          { label: 'YAML', value: 'yaml' },
          { label: 'JSON', value: 'json' },
          { label: 'TypeScript', value: 'typescript' },
          { label: 'JavaScript', value: 'javascript' },
          { label: 'Python', value: 'python' },
          { label: 'SQL', value: 'sql' },
          { label: 'Plain text', value: 'plaintext' },
        ],
      },
      {
        id: 'lineNumbers',
        type: 'boolean',
        label: 'Line numbers',
        description: 'Shows a gutter with line numbers.',
      },
      {
        id: 'showActiveLine',
        type: 'boolean',
        label: 'Active line',
        description: 'Highlights the cursor line and its gutter marker.',
      },
      {
        id: 'lineWrapping',
        type: 'boolean',
        label: 'Line wrap',
        description: 'Wraps long lines instead of requiring horizontal scrolling.',
      },
      {
        id: 'readOnly',
        type: 'boolean',
        label: 'Read only',
        description: 'Displays code without allowing edits in the preview.',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Disables editor interaction.',
      },
      {
        id: 'enableSearch',
        type: 'boolean',
        label: 'Search',
        description: 'Shows the editor search toolbar.',
      },
      {
        id: 'showDiagnostics',
        type: 'boolean',
        label: 'Diagnostics',
        description: 'Shows diagnostics, error-line markers, and clickable line jumps.',
      },
      {
        id: 'minHeight',
        type: 'text',
        label: 'Min height',
        description: 'CSS minimum height for the editor body.',
        placeholder: 'fit-content',
      },
      {
        id: 'maxHeight',
        type: 'text',
        label: 'Max height',
        description: 'CSS maximum height before the editor scrolls.',
        placeholder: '520px',
      },
    ],
    defaultParameters: {
      disabled: false,
      language: 'yaml',
      lineNumbers: true,
      lineWrapping: false,
      maxHeight: '520px',
      minHeight: 'fit-content',
      readOnly: false,
      enableSearch: true,
      showDiagnostics: true,
      showActiveLine: true,
    },
    contentTitle: 'Code Content',
    contentDescription: 'Controlled source value and placeholder used by the editor preview.',
    contentControls: [
      {
        id: 'value',
        type: 'richtext',
        label: 'Code value',
        description: 'Sets the editor value from code; typing in the preview can still change it.',
        placeholder: codeEditorYamlExample,
        rows: 14,
      },
      {
        id: 'placeholder',
        type: 'text',
        label: 'Placeholder',
        description: 'Text shown when the editor is empty.',
        placeholder: 'Write YAML',
      },
    ],
    defaultContentValues: {
      placeholder: 'Write YAML',
      value: codeEditorYamlExample,
    },
    renderPreview: (parameters, contentValues) => (
      <Suspense fallback={<LoadingIndicator label="Loading editor" size="comfortable" tone="accent" variant="dots" />}>
        <LazyCodeEditorExample
          disabled={Boolean(parameters.disabled)}
          enableSearch={Boolean(parameters.enableSearch)}
          language={parameters.language as CodeEditorLanguage}
          lineNumbers={Boolean(parameters.lineNumbers)}
          lineWrapping={Boolean(parameters.lineWrapping)}
          maxHeight={String(parameters.maxHeight ?? '')}
          minHeight={String(parameters.minHeight ?? '')}
          placeholder={String(contentValues.placeholder ?? '')}
          readOnly={Boolean(parameters.readOnly)}
          showDiagnostics={Boolean(parameters.showDiagnostics)}
          showActiveLine={Boolean(parameters.showActiveLine)}
          value={String(contentValues.value ?? '')}
        />
      </Suspense>
    ),
  },
  {
    id: 'column-explorer',
    group: 'Navigation',
    name: 'ColumnExplorer',
    description: 'Finder-style cascading browser for hierarchical workspaces, configs, and generated assets.',
    status: 'Ready',
    parameters: [
      {
        id: 'density',
        type: 'select',
        label: 'Size',
        description: 'Changes row height and spacing in every column.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Adds or removes the outer explorer surface.',
        options: [
          { label: 'Panel', value: 'panel' },
          { label: 'Plain', value: 'plain' },
        ],
      },
      {
        id: 'minColumnWidth',
        type: 'text',
        label: 'Minimum column width',
        description: 'Columns fill available space and only scroll horizontally below this width.',
        placeholder: '200px',
      },
      {
        id: 'showIcons',
        type: 'boolean',
        label: 'Icons',
        description: 'Shows optional item icons when the item provides one.',
      },
      {
        id: 'showStatus',
        type: 'boolean',
        label: 'Status dots',
        description: 'Shows a themed status dot based on each item tone.',
      },
      {
        id: 'showMetadata',
        type: 'boolean',
        label: 'Metadata',
        description: 'Shows descriptions and short trailing metadata labels.',
      },
      {
        id: 'showCounts',
        type: 'boolean',
        label: 'Counts',
        description: 'Shows optional child or data counts in headers and rows.',
      },
      {
        id: 'showPreview',
        type: 'boolean',
        label: 'Preview panel',
        description: 'Shows the optional trailing detail panel for the selected item.',
      },
      {
        id: 'keyboardNavigation',
        type: 'boolean',
        label: 'Keyboard navigation',
        description: 'Allows arrow-key movement through columns.',
      },
      {
        id: 'typeahead',
        type: 'boolean',
        label: 'Typeahead',
        description: 'Allows typing to jump to matching items.',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      keyboardNavigation: true,
      minColumnWidth: '200px',
      showCounts: true,
      showIcons: true,
      showMetadata: true,
      showPreview: true,
      showStatus: true,
      typeahead: true,
      variant: 'panel',
    },
    contentTitle: 'Explorer Content',
    contentDescription: 'Code-driven selection and labels used by the sample explorer.',
    contentControls: [
      {
        id: 'selectedPath',
        type: 'text',
        label: 'Selected path',
        description: 'Slash-separated item ids set from code; clicking the preview can still change it.',
        placeholder: columnExplorerSelectedPathExample,
      },
      {
        id: 'rootLabel',
        type: 'text',
        label: 'Root label',
        description: 'Label shown above the first column.',
        placeholder: 'Project',
      },
    ],
    defaultContentValues: {
      rootLabel: 'Project',
      selectedPath: columnExplorerSelectedPathExample,
    },
    renderPreview: (parameters, contentValues) => (
      <ColumnExplorerExample
        density={parameters.density as ColumnExplorerDensity}
        keyboardNavigation={Boolean(parameters.keyboardNavigation)}
        minColumnWidth={String(parameters.minColumnWidth ?? '200px')}
        rootLabel={String(contentValues.rootLabel ?? '')}
        selectedPathSource={String(contentValues.selectedPath ?? '')}
        showCounts={Boolean(parameters.showCounts)}
        showIcons={Boolean(parameters.showIcons)}
        showMetadata={Boolean(parameters.showMetadata)}
        showPreview={Boolean(parameters.showPreview)}
        showStatus={Boolean(parameters.showStatus)}
        typeahead={Boolean(parameters.typeahead)}
        variant={parameters.variant as ColumnExplorerVariant}
      />
    ),
  },
  {
    id: 'tabs',
    group: 'Navigation',
    name: 'Tabs',
    description: 'View switching for compact panels, inspectors, and workspace sections.',
    status: 'Ready',
    parameters: [
      {
        id: 'density',
        type: 'select',
        label: 'Size',
        description: 'Changes tab height and spacing.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the tab selection treatment.',
        options: [
          { label: 'Line', value: 'line' },
          { label: 'Pills', value: 'pills' },
          { label: 'Contained', value: 'contained' },
        ],
      },
      {
        id: 'orientation',
        type: 'select',
        label: 'Orientation',
        description: 'Switches between horizontal and vertical tab layouts.',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ],
      },
      {
        id: 'showPanels',
        type: 'boolean',
        label: 'Panels',
        description: 'Shows the active tab panel below or beside the tab list.',
      },
      {
        id: 'showBadges',
        type: 'boolean',
        label: 'Badges',
        description: 'Shows optional count badges in tabs.',
      },
      {
        id: 'showDescriptions',
        type: 'boolean',
        label: 'Descriptions',
        description: 'Shows secondary tab descriptions for richer inspector tabs.',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      orientation: 'horizontal',
      showBadges: true,
      showDescriptions: true,
      showPanels: true,
      variant: 'line',
    },
    contentTitle: 'Tabs Content',
    contentDescription: 'Code-driven active tab used by the example.',
    contentControls: [
      {
        id: 'selectedTabId',
        type: 'text',
        label: 'Selected tab id',
        description: 'Sets the active tab from code; clicking the preview can still change it.',
        placeholder: 'runtime',
      },
    ],
    defaultContentValues: {
      selectedTabId: 'runtime',
    },
    renderPreview: (parameters, contentValues) => (
      <TabsExample
        density={parameters.density as TabsDensity}
        orientation={parameters.orientation as TabsOrientation}
        selectedTabId={String(contentValues.selectedTabId ?? 'runtime')}
        showBadges={Boolean(parameters.showBadges)}
        showDescriptions={Boolean(parameters.showDescriptions)}
        showPanels={Boolean(parameters.showPanels)}
        variant={parameters.variant as TabsVariant}
      />
    ),
  },
  {
    id: 'accordion',
    group: 'Navigation',
    name: 'Accordion',
    description: 'Collapsible section stack for dense settings, inspectors, and secondary detail groups.',
    status: 'Ready',
    parameters: [
      {
        id: 'density',
        type: 'select',
        label: 'Size',
        description: 'Changes trigger height and panel spacing.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the surrounding surface treatment.',
        options: [
          { label: 'Bordered', value: 'bordered' },
          { label: 'Filled', value: 'filled' },
          { label: 'Plain', value: 'plain' },
        ],
      },
      {
        id: 'mode',
        type: 'select',
        label: 'Mode',
        description: 'Allows one or multiple sections to be open.',
        options: [
          { label: 'Single', value: 'single' },
          { label: 'Multiple', value: 'multiple' },
        ],
      },
      {
        id: 'showIcons',
        type: 'boolean',
        label: 'Icons',
        description: 'Shows leading icons in each trigger.',
      },
      {
        id: 'showMetadata',
        type: 'boolean',
        label: 'Metadata',
        description: 'Shows short trailing metadata labels.',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      mode: 'single',
      showIcons: true,
      showMetadata: true,
      variant: 'bordered',
    },
    contentTitle: 'Accordion Content',
    contentDescription: 'Code-driven open section ids used by the example.',
    contentControls: [
      {
        id: 'openIds',
        type: 'text',
        label: 'Open ids',
        description: 'Comma-separated section ids. Use multiple ids when mode is multiple.',
        placeholder: accordionOpenIdsExample,
      },
    ],
    defaultContentValues: {
      openIds: accordionOpenIdsExample,
    },
    renderPreview: (parameters, contentValues) => (
      <AccordionExample
        density={parameters.density as AccordionDensity}
        mode={parameters.mode as AccordionMode}
        openIdsSource={String(contentValues.openIds ?? '')}
        showIcons={Boolean(parameters.showIcons)}
        showMetadata={Boolean(parameters.showMetadata)}
        variant={parameters.variant as AccordionVariant}
      />
    ),
  },
  {
    id: 'breadcrumb',
    group: 'Navigation',
    name: 'Breadcrumb',
    description: 'Path display and navigation for nested workspaces, records, and generated assets.',
    status: 'Ready',
    parameters: [
      {
        id: 'density',
        type: 'select',
        label: 'Size',
        description: 'Changes breadcrumb item height and spacing.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Adds or removes a surrounding breadcrumb surface.',
        options: [
          { label: 'Plain', value: 'plain' },
          { label: 'Panel', value: 'panel' },
        ],
      },
      {
        id: 'maxItems',
        type: 'text',
        label: 'Max items',
        description: 'Collapses the middle of long paths above this count.',
        placeholder: '5',
      },
      {
        id: 'showHomeIcon',
        type: 'boolean',
        label: 'Home icon',
        description: 'Shows a home icon on the first breadcrumb item.',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      maxItems: '5',
      showHomeIcon: true,
      variant: 'panel',
    },
    renderPreview: (parameters) => (
      <BreadcrumbExample
        density={parameters.density as BreadcrumbDensity}
        maxItems={Number(parameters.maxItems) || 5}
        showHomeIcon={Boolean(parameters.showHomeIcon)}
        variant={parameters.variant as BreadcrumbVariant}
      />
    ),
  },
  {
    id: 'tree-view',
    group: 'Navigation',
    name: 'TreeView',
    description: 'Nested hierarchy for compact sidebars when cascading columns are too wide.',
    status: 'Ready',
    parameters: [
      {
        id: 'density',
        type: 'select',
        label: 'Size',
        description: 'Changes tree row height and spacing.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Adds or removes the outer tree surface.',
        options: [
          { label: 'Panel', value: 'panel' },
          { label: 'Plain', value: 'plain' },
        ],
      },
      {
        id: 'showIcons',
        type: 'boolean',
        label: 'Icons',
        description: 'Shows optional item icons.',
      },
      {
        id: 'showStatus',
        type: 'boolean',
        label: 'Status dots',
        description: 'Shows themed status dots based on each item tone.',
      },
      {
        id: 'showDescriptions',
        type: 'boolean',
        label: 'Descriptions',
        description: 'Shows secondary item descriptions.',
      },
      {
        id: 'showBadges',
        type: 'boolean',
        label: 'Badges',
        description: 'Shows optional count badges.',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      showBadges: true,
      showDescriptions: true,
      showIcons: true,
      showStatus: true,
      variant: 'panel',
    },
    contentTitle: 'Tree Content',
    contentDescription: 'Code-driven expanded nodes and selected item used by the sample tree.',
    contentControls: [
      {
        id: 'expandedIds',
        type: 'text',
        label: 'Expanded ids',
        description: 'Comma-separated item ids expanded from code.',
        placeholder: treeViewExpandedIdsExample,
      },
      {
        id: 'selectedId',
        type: 'text',
        label: 'Selected id',
        description: 'Selected item id set from code; clicking the preview can still change it.',
        placeholder: 'demo-momentum',
      },
    ],
    defaultContentValues: {
      expandedIds: treeViewExpandedIdsExample,
      selectedId: 'demo-momentum',
    },
    renderPreview: (parameters, contentValues) => (
      <TreeViewExample
        density={parameters.density as TreeViewDensity}
        expandedIdsSource={String(contentValues.expandedIds ?? '')}
        selectedId={String(contentValues.selectedId ?? '')}
        showBadges={Boolean(parameters.showBadges)}
        showDescriptions={Boolean(parameters.showDescriptions)}
        showIcons={Boolean(parameters.showIcons)}
        showStatus={Boolean(parameters.showStatus)}
        variant={parameters.variant as TreeViewVariant}
      />
    ),
  },
  {
    id: 'file-explorer',
    group: 'Navigation',
    name: 'FileExplorer',
    description: 'Windows-style main file pane for folders and files, without breadcrumbs or a navigation tree.',
    status: 'Ready',
    parameters: [
      {
        id: 'view',
        type: 'select',
        label: 'View',
        description: 'Switches between Windows-style details and icon grid layouts.',
        options: [
          { label: 'Details', value: 'details' },
          { label: 'Icon grid', value: 'grid' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes item row height and spacing.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the explorer surface treatment.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'sortBy',
        type: 'select',
        label: 'Sort by',
        description: 'Sets the initial file sort column; click headers to change it.',
        options: [
          { label: 'Name', value: 'name' },
          { label: 'Type', value: 'type' },
          { label: 'Date modified', value: 'modified' },
          { label: 'Size', value: 'size' },
        ],
      },
      {
        id: 'sortDirection',
        type: 'select',
        label: 'Sort direction',
        description: 'Sets the initial sort direction.',
        options: [
          { label: 'Ascending', value: 'asc' },
          { label: 'Descending', value: 'desc' },
        ],
      },
      { id: 'multiSelect', type: 'boolean', label: 'Multi-select', description: 'Lets clicks add or remove selected items.' },
      { id: 'showViewToolbar', type: 'boolean', label: 'View toolbar', description: 'Shows the Windows-style details and large-icons view switcher.' },
      { id: 'showFileDetails', type: 'boolean', label: 'File details', description: 'Shows type and size metadata beneath icons in grid view.', visibleWhen: { parameterId: 'view', value: 'grid' } },
    ],
    defaultParameters: {
      density: 'comfortable',
      multiSelect: false,
      showFileDetails: true,
      showViewToolbar: true,
      sortBy: 'name',
      sortDirection: 'asc',
      variant: 'default',
      view: 'details',
    },
    renderPreview: (parameters) => (
      <FileExplorerExample
        density={parameters.density as FileExplorerDensity}
        multiSelect={Boolean(parameters.multiSelect)}
        showFileDetails={Boolean(parameters.showFileDetails)}
        showViewToolbar={Boolean(parameters.showViewToolbar)}
        sortBy={parameters.sortBy as FileExplorerSortBy}
        sortDirection={parameters.sortDirection as FileExplorerSortDirection}
        variant={parameters.variant as FileExplorerVariant}
        view={parameters.view as FileExplorerView}
      />
    ),
  },
  {
    id: 'user-card',
    group: 'Navigation',
    name: 'UserCard',
    description: 'Compact account trigger with a profile menu for usage, personal actions, settings, and sign out.',
    status: 'Ready',
    parameters: [
      {
        id: 'placement',
        type: 'select',
        label: 'Menu placement',
        description: 'Positions the account menu around its compact user trigger.',
        options: [
          { label: 'Above, start aligned', value: 'top-start' },
          { label: 'Above, end aligned', value: 'top-end' },
          { label: 'Below, start aligned', value: 'bottom-start' },
          { label: 'Below, end aligned', value: 'bottom-end' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the account menu surface treatment.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      { id: 'showUsage', type: 'boolean', label: 'Usage action', description: 'Shows the usage-remaining action.' },
      { id: 'showPetAction', type: 'boolean', label: 'Pet action', description: 'Shows the optional personal action from the reference menu.' },
      { id: 'showHelp', type: 'boolean', label: 'Help button', description: 'Shows a secondary help button next to the user trigger.' },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables opening the account menu.' },
    ],
    defaultParameters: {
      disabled: false,
      placement: 'top-start',
      showHelp: true,
      showPetAction: true,
      showUsage: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <UserCardExample
        disabled={Boolean(parameters.disabled)}
        placement={parameters.placement as UserCardPlacement}
        showHelp={Boolean(parameters.showHelp)}
        showPetAction={Boolean(parameters.showPetAction)}
        showUsage={Boolean(parameters.showUsage)}
        variant={parameters.variant as UserCardVariant}
      />
    ),
  },
  {
    id: 'command-menu',
    group: 'Navigation',
    name: 'CommandMenu',
    description: 'Keyboard-first command picker for workspace actions, search, and quick navigation.',
    status: 'Ready',
    parameters: [
      {
        id: 'density',
        type: 'select',
        label: 'Size',
        description: 'Changes search and result row spacing.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Adds or removes the command menu surface.',
        options: [
          { label: 'Panel', value: 'panel' },
          { label: 'Plain', value: 'plain' },
        ],
      },
      {
        id: 'maxResults',
        type: 'text',
        label: 'Max results',
        description: 'Limits the number of matching commands shown.',
        placeholder: '8',
      },
      {
        id: 'showSections',
        type: 'boolean',
        label: 'Sections',
        description: 'Groups matching commands by section.',
      },
      {
        id: 'showShortcuts',
        type: 'boolean',
        label: 'Shortcuts',
        description: 'Shows optional keyboard shortcut labels.',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      maxResults: '8',
      showSections: true,
      showShortcuts: true,
      variant: 'panel',
    },
    contentTitle: 'Command Content',
    contentDescription: 'Code-driven search query used by the sample command menu.',
    contentControls: [
      {
        id: 'query',
        type: 'text',
        label: 'Query',
        description: 'Search query set from code; typing in the preview can still change it.',
        placeholder: 'risk',
      },
    ],
    defaultContentValues: {
      query: commandMenuQueryExample,
    },
    renderPreview: (parameters, contentValues) => (
      <CommandMenuExample
        density={parameters.density as CommandMenuDensity}
        maxResults={Number(parameters.maxResults) || 8}
        query={String(contentValues.query ?? '')}
        showSections={Boolean(parameters.showSections)}
        showShortcuts={Boolean(parameters.showShortcuts)}
        variant={parameters.variant as CommandMenuVariant}
      />
    ),
  },
  {
    id: 'node-canvas',
    group: 'Node System',
    name: 'NodeCanvas',
    description: 'Graph workspace for node-based strategy flows, including canvas, nodes, ports, edges, palette, toolbar, and inspector.',
    status: 'Ready',
    parameters: [
      {
        id: 'flowDirection',
        type: 'select',
        label: 'Flow direction',
        description: 'Changes port placement and edge direction for horizontal or vertical workflows.',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the canvas surface treatment.',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'Muted', value: 'muted' },
          { label: 'Plain', value: 'plain' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes node and toolbar spacing across the composed preview.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'zoom',
        type: 'text',
        label: 'Zoom',
        description: 'Sets the visual canvas zoom from code.',
        placeholder: '0.9',
      },
      {
        id: 'selectedNodeId',
        type: 'select',
        label: 'Selected node',
        description: 'Selects a node from code while node clicks can still update selection.',
        options: [
          { label: 'Market Stream', value: 'market-stream' },
          { label: 'Strategy Engine', value: 'strategy-engine' },
          { label: 'Risk Gate', value: 'risk-gate' },
          { label: 'Order Router', value: 'order-router' },
        ],
      },
      {
        id: 'locked',
        type: 'boolean',
        label: 'Locked',
        description: 'Shows the canvas as a read-only workflow visualization.',
      },
      {
        id: 'editable',
        type: 'boolean',
        label: 'Editable',
        description: 'Allows ports and topology edits independently from canvas locking.',
      },
      {
        id: 'showGrid',
        type: 'boolean',
        label: 'Grid',
        description: 'Shows the themed canvas grid.',
      },
      {
        id: 'showToolbar',
        type: 'boolean',
        label: 'Toolbar',
        description: 'Shows the node toolbar above the canvas.',
      },
      {
        id: 'showPalette',
        type: 'boolean',
        label: 'Palette',
        description: 'Shows the node template palette beside the canvas.',
      },
      {
        id: 'showInspector',
        type: 'boolean',
        label: 'Inspector',
        description: 'Shows the selected-node inspector beside the canvas.',
      },
      {
        id: 'showMiniMap',
        type: 'boolean',
        label: 'Mini map',
        description: 'Shows the graph overview overlay inside the canvas.',
      },
      {
        id: 'animatedEdges',
        type: 'boolean',
        label: 'Animated edges',
        description: 'Animates the connection paths inside the canvas.',
      },
      {
        id: 'edgeAnimation',
        type: 'select',
        label: 'Edge animation',
        description: 'Changes how animated connection paths move.',
        options: [
          { label: 'Flow', value: 'flow' },
          { label: 'Pulse', value: 'pulse' },
          { label: 'Trace', value: 'trace' },
        ],
        visibleWhen: { parameterId: 'animatedEdges', value: true },
      },
    ],
    defaultParameters: {
      animatedEdges: true,
      density: 'comfortable',
      edgeAnimation: 'flow',
      editable: true,
      flowDirection: 'horizontal',
      locked: false,
      selectedNodeId: 'strategy-engine',
      showGrid: true,
      showInspector: true,
      showMiniMap: true,
      showPalette: true,
      showToolbar: true,
      variant: 'grid',
      zoom: '0.9',
    },
    renderPreview: (parameters) => (
      <NodeCanvasExample
        animatedEdges={Boolean(parameters.animatedEdges)}
        density={parameters.density as NodeDensity}
        edgeAnimation={parameters.edgeAnimation as NodeEdgeAnimation}
        editable={Boolean(parameters.editable)}
        flowDirection={parameters.flowDirection as NodeFlowDirection}
        locked={Boolean(parameters.locked)}
        selectedNodeId={String(parameters.selectedNodeId ?? 'strategy-engine')}
        showGrid={Boolean(parameters.showGrid)}
        showInspector={Boolean(parameters.showInspector)}
        showMiniMap={Boolean(parameters.showMiniMap)}
        showPalette={Boolean(parameters.showPalette)}
        showToolbar={Boolean(parameters.showToolbar)}
        variant={parameters.variant as NodeCanvasVariant}
        zoom={getNumberParameter(parameters.zoom, 0.9)}
      />
    ),
  },
  {
    id: 'node-workspace-mock',
    group: 'Node System',
    name: 'NodeWorkspaceMock',
    description: 'Interactive composition for testing node palette, toolbar, right-click canvas actions, marquee selection, typed ports, edges, movement, and inspector together.',
    status: 'Ready',
    parameters: [
      {
        id: 'flowDirection',
        type: 'select',
        label: 'Flow direction',
        description: 'Switches node ports between left/right and top/bottom flow.',
        options: [
          { label: 'Horizontal', value: 'horizontal' },
          { label: 'Vertical', value: 'vertical' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Canvas variant',
        description: 'Changes the canvas surface treatment used by the mock workspace.',
        options: [
          { label: 'Grid', value: 'grid' },
          { label: 'Muted', value: 'muted' },
          { label: 'Plain', value: 'plain' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes node and toolbar spacing across the composed mock.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'locked',
        type: 'boolean',
        label: 'Locked',
        description: 'Prevents adding, deleting, connecting, or moving nodes while leaving selection and zoom available.',
      },
      {
        id: 'editable',
        type: 'boolean',
        label: 'Editable',
        description: 'Allows topology edits while locked separately controls movement and panning.',
      },
      {
        id: 'showGrid',
        type: 'boolean',
        label: 'Grid',
        description: 'Shows the themed canvas grid.',
      },
      {
        id: 'showToolbar',
        type: 'boolean',
        label: 'Toolbar',
        description: 'Shows the node toolbar above the canvas.',
      },
      {
        id: 'showPalette',
        type: 'boolean',
        label: 'Palette',
        description: 'Shows the node template palette and lets row clicks add nodes.',
      },
      {
        id: 'showInspector',
        type: 'boolean',
        label: 'Inspector',
        description: 'Shows the selected-node inspector beside the canvas.',
      },
      {
        id: 'showMiniMap',
        type: 'boolean',
        label: 'Mini map',
        description: 'Shows the graph overview overlay and viewport inside the workspace.',
      },
      {
        id: 'animatedEdges',
        type: 'boolean',
        label: 'Animated edges',
        description: 'Animates the connection paths inside the canvas.',
      },
      {
        id: 'edgeAnimation',
        type: 'select',
        label: 'Edge animation',
        description: 'Changes how animated connection paths move.',
        options: [
          { label: 'Flow', value: 'flow' },
          { label: 'Pulse', value: 'pulse' },
          { label: 'Trace', value: 'trace' },
        ],
        visibleWhen: { parameterId: 'animatedEdges', value: true },
      },
    ],
    defaultParameters: {
      animatedEdges: true,
      density: 'comfortable',
      edgeAnimation: 'flow',
      editable: true,
      flowDirection: 'horizontal',
      locked: false,
      showGrid: true,
      showInspector: true,
      showMiniMap: true,
      showPalette: true,
      showToolbar: true,
      variant: 'grid',
    },
    renderPreview: (parameters) => (
      <NodeWorkspaceMockExample
        animatedEdges={Boolean(parameters.animatedEdges)}
        density={parameters.density as NodeDensity}
        edgeAnimation={parameters.edgeAnimation as NodeEdgeAnimation}
        editable={Boolean(parameters.editable)}
        flowDirection={parameters.flowDirection as NodeFlowDirection}
        locked={Boolean(parameters.locked)}
        showGrid={Boolean(parameters.showGrid)}
        showInspector={Boolean(parameters.showInspector)}
        showMiniMap={Boolean(parameters.showMiniMap)}
        showPalette={Boolean(parameters.showPalette)}
        showToolbar={Boolean(parameters.showToolbar)}
        variant={parameters.variant as NodeCanvasVariant}
      />
    ),
  },
  {
    id: 'node',
    group: 'Node System',
    name: 'Node',
    description: 'Reusable node body with title, status, content slot, selection state, and optional ports.',
    status: 'Ready',
    parameters: [
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes node padding and inner rhythm.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Sets the node status color stripe.',
        options: [
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Warning', value: 'warning' },
          { label: 'Negative', value: 'negative' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'selected',
        type: 'boolean',
        label: 'Selected',
        description: 'Shows the selected graph-node treatment.',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Shows disabled node opacity and blocks click behavior.',
      },
      {
        id: 'showPorts',
        type: 'boolean',
        label: 'Ports',
        description: 'Renders the node input and output anchors.',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      disabled: false,
      selected: true,
      showPorts: true,
      tone: 'accent',
    },
    contentTitle: 'Node Content',
    contentDescription: 'Header text and status label shown inside the sample node.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Main node title.',
        placeholder: 'Strategy Engine',
      },
      {
        id: 'subtitle',
        type: 'text',
        label: 'Subtitle',
        description: 'Supporting node subtitle.',
        placeholder: 'Momentum v2',
      },
      {
        id: 'statusLabel',
        type: 'text',
        label: 'Status',
        description: 'Optional status pill shown in the header.',
        placeholder: 'running',
      },
    ],
    defaultContentValues: {
      statusLabel: 'running',
      subtitle: 'Momentum v2',
      title: 'Strategy Engine',
    },
    renderPreview: (parameters, contentValues) => (
      <NodeExample
        density={parameters.density as NodeDensity}
        disabled={Boolean(parameters.disabled)}
        selected={Boolean(parameters.selected)}
        showPorts={Boolean(parameters.showPorts)}
        statusLabel={String(contentValues.statusLabel ?? '')}
        subtitle={String(contentValues.subtitle ?? '')}
        title={String(contentValues.title ?? '')}
        tone={parameters.tone as NodeTone}
      />
    ),
  },
  {
    id: 'node-port',
    group: 'Node System',
    name: 'NodePort',
    description: 'Input or output connection anchor for node graph edges.',
    status: 'Ready',
    parameters: [
      {
        id: 'side',
        type: 'select',
        label: 'Side',
        description: 'Sets the side the port is attached to.',
        options: [
          { label: 'Left', value: 'left' },
          { label: 'Right', value: 'right' },
          { label: 'Top', value: 'top' },
          { label: 'Bottom', value: 'bottom' },
        ],
      },
      {
        id: 'direction',
        type: 'select',
        label: 'Direction',
        description: 'Changes the port shape for input or output use.',
        options: [
          { label: 'Input', value: 'input' },
          { label: 'Output', value: 'output' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Sets the port color.',
        options: [
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Warning', value: 'warning' },
          { label: 'Negative', value: 'negative' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'connected',
        type: 'boolean',
        label: 'Connected',
        description: 'Shows the connected halo around the port.',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Disables the port control.',
      },
      {
        id: 'showLabel',
        type: 'boolean',
        label: 'Label',
        description: 'Shows the sample label beside the port.',
      },
    ],
    defaultParameters: {
      connected: true,
      direction: 'input',
      disabled: false,
      showLabel: true,
      side: 'left',
      tone: 'accent',
    },
    renderPreview: (parameters) => (
      <NodePortExample
        connected={Boolean(parameters.connected)}
        direction={parameters.direction as NodePortDirection}
        disabled={Boolean(parameters.disabled)}
        showLabel={Boolean(parameters.showLabel)}
        side={parameters.side as NodePortSide}
        tone={parameters.tone as NodeTone}
      />
    ),
  },
  {
    id: 'node-edge',
    group: 'Node System',
    name: 'NodeEdge',
    description: 'Connection path between two node ports, with straight, stepped, and smooth routing.',
    status: 'Ready',
    parameters: [
      {
        id: 'path',
        type: 'select',
        label: 'Path',
        description: 'Changes the connection route geometry.',
        options: [
          { label: 'Smooth', value: 'smooth' },
          { label: 'Straight', value: 'straight' },
          { label: 'Step', value: 'step' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Sets the edge color.',
        options: [
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Warning', value: 'warning' },
          { label: 'Negative', value: 'negative' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Animates the edge path.',
      },
      {
        id: 'animationStyle',
        type: 'select',
        label: 'Animation style',
        description: 'Changes how the edge animation behaves.',
        options: [
          { label: 'Flow', value: 'flow' },
          { label: 'Pulse', value: 'pulse' },
          { label: 'Trace', value: 'trace' },
        ],
        visibleWhen: { parameterId: 'animated', value: true },
      },
      {
        id: 'selected',
        type: 'boolean',
        label: 'Selected',
        description: 'Shows the selected edge emphasis.',
      },
    ],
    defaultParameters: {
      animated: true,
      animationStyle: 'flow',
      path: 'smooth',
      selected: true,
      tone: 'accent',
    },
    contentTitle: 'Edge Content',
    contentDescription: 'Optional edge label rendered on the connection path.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Small label shown at the middle of the edge.',
        placeholder: 'signal',
      },
    ],
    defaultContentValues: {
      label: 'signal',
    },
    renderPreview: (parameters, contentValues) => (
      <NodeEdgeExample
        animationStyle={parameters.animationStyle as NodeEdgeAnimation}
        animated={Boolean(parameters.animated)}
        label={String(contentValues.label ?? '')}
        path={parameters.path as NodeEdgePath}
        selected={Boolean(parameters.selected)}
        tone={parameters.tone as NodeTone}
      />
    ),
  },
  {
    id: 'node-toolbar',
    group: 'Node System',
    name: 'NodeToolbar',
    description: 'Canvas action row for zoom, fit, delete, and optional snap-to-grid controls.',
    status: 'Ready',
    parameters: [
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes toolbar button size.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showLabels',
        type: 'boolean',
        label: 'Labels',
        description: 'Shows text labels beside toolbar icons.',
      },
      {
        id: 'showSnapToggle',
        type: 'boolean',
        label: 'Snap toggle',
        description: 'Shows the snap-to-grid toggle action.',
      },
      {
        id: 'snapToGrid',
        type: 'boolean',
        label: 'Snap active',
        description: 'Sets the snap toggle state from code.',
        visibleWhen: { parameterId: 'showSnapToggle', value: true },
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      showLabels: true,
      showSnapToggle: true,
      snapToGrid: true,
    },
    renderPreview: (parameters) => (
      <NodeToolbarExample
        density={parameters.density as NodeDensity}
        showLabels={Boolean(parameters.showLabels)}
        showSnapToggle={Boolean(parameters.showSnapToggle)}
        snapToGrid={Boolean(parameters.snapToGrid)}
      />
    ),
  },
  {
    id: 'node-palette',
    group: 'Node System',
    name: 'NodePalette',
    description: 'Searchable template list for adding node types to a graph workspace.',
    status: 'Ready',
    parameters: [
      {
        id: 'selectedTemplateId',
        type: 'select',
        label: 'Selected template',
        description: 'Selects a palette row from code while row clicks can still change it.',
        options: [
          { label: 'Market Stream', value: 'market-stream' },
          { label: 'Strategy Engine', value: 'strategy-engine' },
          { label: 'Risk Gate', value: 'risk-gate' },
          { label: 'Order Router', value: 'order-router' },
        ],
      },
      {
        id: 'showSearch',
        type: 'boolean',
        label: 'Search',
        description: 'Shows the reusable SearchInput above the template list.',
      },
    ],
    defaultParameters: {
      selectedTemplateId: 'strategy-engine',
      showSearch: true,
    },
    contentTitle: 'Palette Content',
    contentDescription: 'Code-driven search query for the sample templates.',
    contentControls: [
      {
        id: 'query',
        type: 'text',
        label: 'Query',
        description: 'Filters palette templates from code while typing still works in the preview.',
        placeholder: 'strategy',
      },
    ],
    defaultContentValues: {
      query: '',
    },
    renderPreview: (parameters, contentValues) => (
      <NodePaletteExample
        query={String(contentValues.query ?? '')}
        selectedTemplateId={String(parameters.selectedTemplateId ?? 'strategy-engine')}
        showSearch={Boolean(parameters.showSearch)}
      />
    ),
  },
  {
    id: 'node-inspector',
    group: 'Node System',
    name: 'NodeInspector',
    description: 'Selected-node detail panel with property list and editable configuration slot.',
    status: 'Ready',
    parameters: [
      {
        id: 'selectedNodeId',
        type: 'select',
        label: 'Selected node',
        description: 'Chooses the inspected sample node.',
        options: [
          { label: 'Market Stream', value: 'market-stream' },
          { label: 'Strategy Engine', value: 'strategy-engine' },
          { label: 'Risk Gate', value: 'risk-gate' },
          { label: 'Order Router', value: 'order-router' },
        ],
      },
      {
        id: 'showConfig',
        type: 'boolean',
        label: 'Config editor',
        description: 'Shows the reusable TextArea configuration field.',
      },
    ],
    defaultParameters: {
      selectedNodeId: 'strategy-engine',
      showConfig: true,
    },
    renderPreview: (parameters) => <NodeInspectorExample selectedNodeId={String(parameters.selectedNodeId ?? 'strategy-engine')} showConfig={Boolean(parameters.showConfig)} />,
  },
  {
    id: 'node-minimap',
    group: 'Node System',
    name: 'NodeMiniMap',
    description: 'Overview map for large node graphs with selected-node focus and viewport tracking.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes whether the minimap is a standalone panel, compact block, or floating canvas overlay.',
        options: [
          { label: 'Panel', value: 'panel' },
          { label: 'Floating', value: 'floating' },
          { label: 'Compact', value: 'compact' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes the minimap shell padding.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'selectedNodeId',
        type: 'select',
        label: 'Selected node',
        description: 'Selects a node from code while minimap clicks can still update selection.',
        options: [
          { label: 'Market Stream', value: 'market-stream' },
          { label: 'Strategy Engine', value: 'strategy-engine' },
          { label: 'Risk Gate', value: 'risk-gate' },
          { label: 'Order Router', value: 'order-router' },
        ],
      },
      {
        id: 'interactive',
        type: 'boolean',
        label: 'Interactive',
        description: 'Allows clicking minimap nodes to select them.',
      },
      {
        id: 'showEdges',
        type: 'boolean',
        label: 'Edges',
        description: 'Shows or hides the graph connection strokes.',
      },
      {
        id: 'showLabels',
        type: 'boolean',
        label: 'Labels',
        description: 'Shows compact node labels inside minimap nodes.',
      },
      {
        id: 'showViewport',
        type: 'boolean',
        label: 'Viewport',
        description: 'Shows the currently visible canvas area.',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      interactive: true,
      selectedNodeId: 'strategy-engine',
      showEdges: true,
      showLabels: false,
      showViewport: true,
      variant: 'panel',
    },
    renderPreview: (parameters) => (
      <NodeMiniMapExample
        density={parameters.density as NodeDensity}
        interactive={Boolean(parameters.interactive)}
        selectedNodeId={String(parameters.selectedNodeId ?? 'strategy-engine')}
        showEdges={Boolean(parameters.showEdges)}
        showLabels={Boolean(parameters.showLabels)}
        showViewport={Boolean(parameters.showViewport)}
        variant={parameters.variant as NodeMiniMapVariant}
      />
    ),
  },
  {
    id: 'tooltip',
    group: 'Overlays',
    name: 'Tooltip',
    description: 'Compact hover and focus hint for icon buttons, controls, and dense toolbars.',
    status: 'Ready',
    parameters: [
      {
        id: 'placement',
        type: 'select',
        label: 'Placement',
        description: 'Positions the tooltip around the trigger.',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Right', value: 'right' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Left', value: 'left' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes tooltip padding and type scale.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Maps the tooltip border and background accent to theme colors.',
        options: [
          { label: 'Neutral', value: 'neutral' },
          { label: 'Accent', value: 'accent' },
          { label: 'Warning', value: 'warning' },
        ],
      },
      {
        id: 'open',
        type: 'boolean',
        label: 'Open',
        description: 'Sets the preview open state from code; hover and focus can still change it.',
      },
      {
        id: 'disabled',
        type: 'boolean',
        label: 'Disabled',
        description: 'Suppresses the tooltip while keeping the trigger visible.',
      },
    ],
    defaultParameters: {
      disabled: false,
      open: true,
      placement: 'top',
      size: 'comfortable',
      tone: 'neutral',
    },
    contentTitle: 'Tooltip Content',
    contentDescription: 'Trigger label and hint text rendered inside the tooltip bubble.',
    contentControls: [
      {
        id: 'triggerLabel',
        type: 'text',
        label: 'Trigger label',
        description: 'Visible text in the sample trigger.',
        placeholder: 'Broker stream',
      },
      {
        id: 'content',
        type: 'text',
        label: 'Tooltip text',
        description: 'Short hint shown when the tooltip is visible.',
        placeholder: 'Live broker status updates every five seconds.',
      },
    ],
    defaultContentValues: {
      content: 'Live broker status updates every five seconds.',
      triggerLabel: 'Broker stream',
    },
    renderPreview: (parameters, contentValues) => (
      <TooltipExample
        content={String(contentValues.content ?? '')}
        disabled={Boolean(parameters.disabled)}
        open={Boolean(parameters.open)}
        placement={parameters.placement as TooltipPlacement}
        size={parameters.size as TooltipSize}
        tone={parameters.tone as TooltipTone}
        triggerLabel={String(contentValues.triggerLabel ?? '')}
      />
    ),
  },
  {
    id: 'popover',
    group: 'Overlays',
    name: 'Popover',
    description: 'Anchored floating content for quick settings, compact details, and local controls.',
    status: 'Ready',
    parameters: [
      {
        id: 'placement',
        type: 'select',
        label: 'Placement',
        description: 'Positions the popover panel around its trigger.',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Right', value: 'right' },
          { label: 'Bottom', value: 'bottom' },
          { label: 'Left', value: 'left' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes panel width and padding.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'open',
        type: 'boolean',
        label: 'Open',
        description: 'Sets the preview open state from code; clicking the trigger can still change it.',
      },
    ],
    defaultParameters: {
      open: true,
      placement: 'bottom',
      size: 'comfortable',
    },
    contentTitle: 'Popover Content',
    contentDescription: 'Trigger, heading, supporting text, and footer rendered around the panel body.',
    contentControls: [
      {
        id: 'triggerLabel',
        type: 'text',
        label: 'Trigger label',
        description: 'Visible text in the popover trigger.',
        placeholder: 'Open settings',
      },
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Panel heading.',
        placeholder: 'Quick settings',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Supporting copy below the heading.',
        placeholder: 'Adjust local settings without leaving the current workspace.',
      },
      {
        id: 'footer',
        type: 'text',
        label: 'Footer',
        description: 'Optional footer note.',
        placeholder: 'Changes apply to the selected node only.',
      },
    ],
    defaultContentValues: {
      description: 'Adjust local settings without leaving the current workspace.',
      footer: 'Changes apply to the selected node only.',
      title: 'Quick settings',
      triggerLabel: 'Open settings',
    },
    renderPreview: (parameters, contentValues) => (
      <PopoverExample
        description={String(contentValues.description ?? '')}
        footer={String(contentValues.footer ?? '')}
        open={Boolean(parameters.open)}
        placement={parameters.placement as PopoverPlacement}
        size={parameters.size as PopoverSize}
        title={String(contentValues.title ?? '')}
        triggerLabel={String(contentValues.triggerLabel ?? '')}
      />
    ),
  },
  {
    id: 'context-menu',
    group: 'Overlays',
    name: 'ContextMenu',
    description: 'Right-click or action-menu surface for node actions and dense item commands.',
    status: 'Ready',
    parameters: [
      {
        id: 'open',
        type: 'boolean',
        label: 'Open',
        description: 'Sets the initial menu visibility from code; trigger clicks can still change it.',
      },
      {
        id: 'selectedId',
        type: 'select',
        label: 'Selected action',
        description: 'Marks an action as selected from code.',
        options: [
          { label: 'Open details', value: 'open' },
          { label: 'Duplicate', value: 'duplicate' },
          { label: 'Pause', value: 'pause' },
          { label: 'Delete', value: 'delete' },
        ],
      },
      {
        id: 'showShortcuts',
        type: 'boolean',
        label: 'Shortcuts',
        description: 'Shows keyboard shortcut hints at the trailing edge.',
      },
    ],
    defaultParameters: {
      open: true,
      selectedId: 'open',
      showShortcuts: true,
    },
    contentTitle: 'Context Menu Content',
    contentDescription: 'Trigger label for the sample menu target.',
    contentControls: [
      {
        id: 'triggerLabel',
        type: 'text',
        label: 'Trigger label',
        description: 'Accessible label and visible action button text.',
        placeholder: 'Node actions',
      },
    ],
    defaultContentValues: {
      triggerLabel: 'Node actions',
    },
    renderPreview: (parameters, contentValues) => (
      <ContextMenuExample
        open={Boolean(parameters.open)}
        selectedId={String(parameters.selectedId ?? 'open')}
        showShortcuts={Boolean(parameters.showShortcuts)}
        triggerLabel={String(contentValues.triggerLabel ?? '')}
      />
    ),
  },
  {
    id: 'modal',
    group: 'Overlays',
    name: 'Modal',
    description: 'Blocking dialog for confirmations and focused workflows.',
    status: 'Ready',
    parameters: [
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes dialog width and padding.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'open',
        type: 'boolean',
        label: 'Open',
        description: 'Sets the preview open state from code; buttons and backdrop can still close it.',
      },
      {
        id: 'showClose',
        type: 'boolean',
        label: 'Close icon',
        description: 'Shows the top-right close affordance.',
      },
    ],
    defaultParameters: {
      open: true,
      showClose: true,
      size: 'comfortable',
    },
    contentTitle: 'Modal Content',
    contentDescription: 'Dialog title, supporting copy, and primary action label.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Dialog heading.',
        placeholder: 'Confirm broker check',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Supporting copy below the heading.',
        placeholder: 'This blocks the current workflow until the confirmation is handled.',
      },
      {
        id: 'confirmLabel',
        type: 'text',
        label: 'Primary action',
        description: 'Text for the primary confirmation button.',
        placeholder: 'Run check',
      },
    ],
    defaultContentValues: {
      confirmLabel: 'Run check',
      description: 'This blocks the current workflow until the confirmation is handled.',
      title: 'Confirm broker check',
    },
    renderPreview: (parameters, contentValues) => (
      <ModalExample
        confirmLabel={String(contentValues.confirmLabel ?? '')}
        description={String(contentValues.description ?? '')}
        open={Boolean(parameters.open)}
        showClose={Boolean(parameters.showClose)}
        size={parameters.size as ModalSize}
        title={String(contentValues.title ?? '')}
      />
    ),
  },
  {
    id: 'drawer',
    group: 'Overlays',
    name: 'Drawer',
    description: 'Side or bottom panel for details, inspectors, and secondary workflows.',
    status: 'Ready',
    parameters: [
      {
        id: 'placement',
        type: 'select',
        label: 'Placement',
        description: 'Chooses which edge the drawer enters from.',
        options: [
          { label: 'Right', value: 'right' },
          { label: 'Left', value: 'left' },
          { label: 'Bottom', value: 'bottom' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes drawer width and padding.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'open',
        type: 'boolean',
        label: 'Open',
        description: 'Sets the preview open state from code; buttons and backdrop can still close it.',
      },
      {
        id: 'showClose',
        type: 'boolean',
        label: 'Close icon',
        description: 'Shows the top-right close affordance.',
      },
    ],
    defaultParameters: {
      open: true,
      placement: 'right',
      showClose: true,
      size: 'comfortable',
    },
    contentTitle: 'Drawer Content',
    contentDescription: 'Drawer heading, supporting text, and footer copy.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Drawer heading.',
        placeholder: 'Node inspector',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Supporting text below the heading.',
        placeholder: 'Side panel for selected node configuration and runtime details.',
      },
      {
        id: 'footer',
        type: 'text',
        label: 'Footer',
        description: 'Optional footer note.',
        placeholder: 'Inspector state follows the selected canvas item.',
      },
    ],
    defaultContentValues: {
      description: 'Side panel for selected node configuration and runtime details.',
      footer: 'Inspector state follows the selected canvas item.',
      title: 'Node inspector',
    },
    renderPreview: (parameters, contentValues) => (
      <DrawerExample
        description={String(contentValues.description ?? '')}
        footer={String(contentValues.footer ?? '')}
        open={Boolean(parameters.open)}
        placement={parameters.placement as DrawerPlacement}
        showClose={Boolean(parameters.showClose)}
        size={parameters.size as DrawerSize}
        title={String(contentValues.title ?? '')}
      />
    ),
  },
  {
    id: 'toast',
    group: 'Overlays',
    name: 'Toast',
    description: 'Transient notification with tone, action, dismiss, and placement options.',
    status: 'Ready',
    parameters: [
      {
        id: 'placement',
        type: 'select',
        label: 'Placement',
        description: 'Positions the notification region.',
        options: [
          { label: 'Top left', value: 'top-left' },
          { label: 'Top center', value: 'top-center' },
          { label: 'Top right', value: 'top-right' },
          { label: 'Bottom left', value: 'bottom-left' },
          { label: 'Bottom center', value: 'bottom-center' },
          { label: 'Bottom right', value: 'bottom-right' },
        ],
      },
      {
        id: 'autoDismissMs',
        type: 'text',
        label: 'Dismiss after',
        description: 'Milliseconds before each toast starts its closing animation. Use 0 to keep toasts until dismissed.',
        placeholder: '3800',
      },
      {
        id: 'stackLimit',
        type: 'text',
        label: 'Stack limit',
        description: 'Maximum number of source toasts kept in the visible stack.',
        placeholder: '5',
      },
      {
        id: 'maxHeight',
        type: 'text',
        label: 'Max height',
        description: 'CSS max-height for the toast stack, for example 100%, 320px, or 60vh.',
        placeholder: '100%',
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Maps the notification icon and border to theme colors.',
        options: [
          { label: 'Neutral', value: 'neutral' },
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Negative', value: 'negative' },
          { label: 'Warning', value: 'warning' },
        ],
      },
      {
        id: 'visible',
        type: 'boolean',
        label: 'Visible',
        description: 'Sets the preview visibility from code; dismiss and show buttons can still change it.',
      },
      {
        id: 'showIcon',
        type: 'boolean',
        label: 'Icon',
        description: 'Shows the semantic leading icon.',
      },
    ],
    defaultParameters: {
      autoDismissMs: '3800',
      maxHeight: '100%',
      placement: 'bottom-right',
      showIcon: true,
      stackLimit: '5',
      tone: 'warning',
      visible: true,
    },
    contentTitle: 'Toast Content',
    contentDescription: 'Notification title, body text, and optional action label.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Notification title.',
        placeholder: 'Runtime update',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Notification body text.',
        placeholder: 'Risk gateway moved exposure limit to watch.',
      },
      {
        id: 'actionLabel',
        type: 'text',
        label: 'Action label',
        description: 'Optional action button text.',
        placeholder: 'Review',
      },
    ],
    defaultContentValues: {
      actionLabel: 'Review',
      description: 'Risk gateway moved exposure limit to watch.',
      title: 'Runtime update',
    },
    renderPreview: (parameters, contentValues) => (
      <ToastExample
        actionLabel={String(contentValues.actionLabel ?? '')}
        autoDismissMs={getNumberParameter(parameters.autoDismissMs, 3800)}
        description={String(contentValues.description ?? '')}
        maxHeight={String(parameters.maxHeight ?? '100%')}
        placement={parameters.placement as ToastPlacement}
        showIcon={Boolean(parameters.showIcon)}
        stackLimit={getNumberParameter(parameters.stackLimit, 5)}
        title={String(contentValues.title ?? '')}
        tone={parameters.tone as ToastTone}
        visible={Boolean(parameters.visible)}
      />
    ),
  },
  {
    id: 'data-table',
    group: 'Data Display',
    name: 'DataTable',
    description: 'Dense sortable table for positions, strategies, orders, and runtime records.',
    status: 'Ready',
    parameters: [
      {
        id: 'scenario',
        type: 'select',
        label: 'Scenario',
        description: 'Switches the table data set for edge-case QA.',
        options: [
          { label: 'Default rows', value: 'default' },
          { label: 'Empty state', value: 'empty-state' },
          { label: 'Long labels', value: 'long-labels' },
          { label: 'Many rows', value: 'many-rows' },
          { label: 'Disabled rows', value: 'disabled-rows' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Size',
        description: 'Changes row height and cell padding across the table.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes table surface treatment while staying theme-driven.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'enableSorting',
        type: 'boolean',
        label: 'Sorting',
        description: 'Enables sortable column headers. Header clicks can still change the sort in preview.',
      },
      selectableParameter,
      {
        id: 'sortColumn',
        type: 'select',
        label: 'Sort column',
        description: 'Sets the starting sort column from code.',
        options: [
          { label: 'Strategy', value: 'strategy' },
          { label: 'State', value: 'state' },
          { label: 'P/L', value: 'pnl' },
          { label: 'Exposure', value: 'exposure' },
          { label: 'Owner', value: 'owner' },
        ],
        visibleWhen: { parameterId: 'enableSorting', value: true },
      },
      {
        id: 'sortDirection',
        type: 'select',
        label: 'Sort direction',
        description: 'Sets the starting sort direction from code.',
        options: [
          { label: 'Ascending', value: 'asc' },
          { label: 'Descending', value: 'desc' },
        ],
        visibleWhen: { parameterId: 'enableSorting', value: true },
      },
      {
        id: 'selectedRowIndex',
        type: 'select',
        label: 'Selected row',
        description: 'Selects a row from code using the zero-based source row index.',
        options: [
          { label: 'First row (0)', value: '0' },
          { label: 'Second row (1)', value: '1' },
          { label: 'Third row (2)', value: '2' },
          { label: 'Fourth row (3)', value: '3' },
        ],
      },
      {
        id: 'stickyHeader',
        type: 'boolean',
        label: 'Sticky header',
        description: 'Keeps table headers pinned while the table body scrolls.',
      },
      {
        id: 'showRowNumbers',
        type: 'boolean',
        label: 'Row numbers',
        description: 'Shows a leading row index column.',
      },
      {
        id: 'showStatus',
        type: 'boolean',
        label: 'Status badge',
        description: 'Uses the existing StatusBadge component for state cells.',
      },
      {
        id: 'showDelta',
        type: 'boolean',
        label: 'Delta cells',
        description: 'Uses the existing DeltaIndicator component for movement cells.',
      },
      {
        id: 'maxHeight',
        type: 'text',
        label: 'Max height',
        description: 'Sets the scrollable table height from code.',
        placeholder: '360px',
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      enableSorting: true,
      maxHeight: '360px',
      scenario: 'default',
      selectable: true,
      selectedRowIndex: '0',
      showDelta: true,
      showRowNumbers: false,
      showStatus: true,
      sortColumn: 'strategy',
      sortDirection: 'asc',
      stickyHeader: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <DataTableExample
        density={parameters.density as DataTableDensity}
        enableSorting={Boolean(parameters.enableSorting)}
        maxHeight={String(parameters.maxHeight ?? '')}
        scenario={parameters.scenario as DataTableScenario}
        selectable={Boolean(parameters.selectable)}
        selectedRowIndex={getIndexParameter(parameters.selectedRowIndex)}
        showDelta={Boolean(parameters.showDelta)}
        showRowNumbers={Boolean(parameters.showRowNumbers)}
        showStatus={Boolean(parameters.showStatus)}
        sortColumn={String(parameters.sortColumn ?? 'strategy')}
        sortDirection={parameters.sortDirection as DataTableSortDirection}
        stickyHeader={Boolean(parameters.stickyHeader)}
        variant={parameters.variant as DataTableVariant}
      />
    ),
  },
  {
    id: 'property-list',
    group: 'Data Display',
    name: 'PropertyList',
    description: 'Key-value display for configuration, selected records, and compact details.',
    status: 'Ready',
    parameters: [
      {
        id: 'scenario',
        type: 'select',
        label: 'Scenario',
        description: 'Switches property items for edge-case QA.',
        options: [
          { label: 'Default items', value: 'default' },
          { label: 'Empty state', value: 'empty-state' },
          { label: 'Long labels', value: 'long-labels' },
          { label: 'Many items', value: 'many-items' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Size',
        description: 'Changes item padding and vertical rhythm.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes surface treatment for the property group.',
        options: [
          { label: 'Panel', value: 'panel' },
          { label: 'Plain cards', value: 'plain' },
          { label: 'Striped', value: 'striped' },
        ],
      },
      {
        id: 'columns',
        type: 'select',
        label: 'Columns',
        description: 'Switches between one-column and two-column property layouts.',
        options: [
          { label: 'One', value: 'one' },
          { label: 'Two', value: 'two' },
        ],
      },
      {
        id: 'selectable',
        type: 'boolean',
        label: 'Selectable',
        description: 'Allows clicking items and selecting one item from code.',
      },
      {
        id: 'selectedIndex',
        type: 'select',
        label: 'Selected item',
        description: 'Selects a property from code using the zero-based index.',
        options: [
          { label: 'First item (0)', value: '0' },
          { label: 'Second item (1)', value: '1' },
          { label: 'Third item (2)', value: '2' },
          { label: 'Fourth item (3)', value: '3' },
        ],
      },
      {
        id: 'showDividers',
        type: 'boolean',
        label: 'Dividers',
        description: 'Shows separators between property rows for panel and striped variants.',
      },
      {
        id: 'showStatus',
        type: 'boolean',
        label: 'Status value',
        description: 'Uses the existing StatusBadge component for the mode property.',
      },
    ],
    defaultParameters: {
      columns: 'one',
      density: 'comfortable',
      scenario: 'default',
      selectable: true,
      selectedIndex: '0',
      showDividers: true,
      showStatus: true,
      variant: 'panel',
    },
    renderPreview: (parameters) => (
      <PropertyListExample
        columns={parameters.columns as PropertyListColumns}
        density={parameters.density as PropertyListDensity}
        scenario={parameters.scenario as PropertyListScenario}
        selectable={Boolean(parameters.selectable)}
        selectedIndex={getIndexParameter(parameters.selectedIndex)}
        showDividers={Boolean(parameters.showDividers)}
        showStatus={Boolean(parameters.showStatus)}
        variant={parameters.variant as PropertyListVariant}
      />
    ),
  },
  {
    id: 'metric-card',
    group: 'Data Display',
    name: 'MetricCard',
    description: 'Reusable metric tile for scores, balances, counts, and trading summaries.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the card surface emphasis.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Accent', value: 'accent' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes padding and value type scale.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Auto derives the tone from the delta value.',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Negative', value: 'negative' },
          { label: 'Warning', value: 'warning' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'selected',
        type: 'boolean',
        label: 'Selected',
        description: 'Shows the selected surface treatment from code.',
      },
      {
        id: 'showDelta',
        type: 'boolean',
        label: 'Delta',
        description: 'Shows the movement indicator in the card header.',
      },
      {
        id: 'showSparkline',
        type: 'boolean',
        label: 'Sparkline',
        description: 'Shows a compact inline trend line based on numeric values.',
      },
    ],
    defaultParameters: {
      selected: false,
      showDelta: true,
      showSparkline: true,
      size: 'comfortable',
      tone: 'auto',
      variant: 'default',
    },
    contentTitle: 'Metric Content',
    contentDescription: 'Displayed metric value, movement, and optional sparkline values.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Small label shown above the metric value.',
        placeholder: 'Signal score',
      },
      {
        id: 'value',
        type: 'text',
        label: 'Value',
        description: 'Primary metric value.',
        placeholder: '94',
      },
      {
        id: 'unit',
        type: 'text',
        label: 'Unit',
        description: 'Optional unit shown beside the value.',
        placeholder: '/ 100',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Supporting text below the metric value.',
        placeholder: 'Live strategy score across active symbols.',
      },
      {
        id: 'deltaValue',
        type: 'text',
        label: 'Delta value',
        description: 'Numeric movement value used by the delta indicator and auto tone.',
        placeholder: '2.48',
      },
      {
        id: 'deltaLabel',
        type: 'text',
        label: 'Delta label',
        description: 'Optional label shown inside the delta indicator.',
        placeholder: 'Today',
      },
      {
        id: 'sparklineValues',
        type: 'richtext',
        label: 'Sparkline values',
        description: 'Comma, space, or line separated numbers used for the sparkline.',
        placeholder: trendSparkValuesExample,
        rows: 4,
      },
    ],
    defaultContentValues: {
      deltaLabel: 'Today',
      deltaValue: '2.48',
      description: 'Live strategy score across active symbols.',
      label: 'Signal score',
      sparklineValues: trendSparkValuesExample,
      unit: '/ 100',
      value: '94',
    },
    renderPreview: (parameters, contentValues) => (
      <MetricCardExample
        deltaLabel={String(contentValues.deltaLabel ?? '')}
        deltaValue={getNumberParameter(contentValues.deltaValue, 0)}
        description={String(contentValues.description ?? '')}
        label={String(contentValues.label ?? '')}
        selected={Boolean(parameters.selected)}
        showDelta={Boolean(parameters.showDelta)}
        showSparkline={Boolean(parameters.showSparkline)}
        size={parameters.size as MetricCardSize}
        sparklineValues={getNumberListParameter(contentValues.sparklineValues, [12, 14, 13, 18, 21, 19, 24])}
        tone={parameters.tone as MetricCardTone}
        unit={String(contentValues.unit ?? '')}
        value={String(contentValues.value ?? '')}
        variant={parameters.variant as MetricCardVariant}
      />
    ),
  },
  {
    id: 'dataset-summary',
    group: 'Advanced Data',
    name: 'DatasetSummary',
    description: 'Dataset health summary with quality, coverage, freshness, issues, and selectable metrics.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes spacing and compactness.', options: advancedDataDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes the summary surface treatment.', options: advancedDataVariantOptions },
      { id: 'status', type: 'select', label: 'Status', description: 'Sets the dataset processing state.', options: advancedDataStatusOptions },
      selectableParameter,
      {
        id: 'selectedMetricId',
        type: 'select',
        label: 'Selected metric',
        description: 'Selects the active metric from code; clicking a metric still changes it in preview.',
        options: [
          { label: 'Accepted', value: 'accepted' },
          { label: 'Blocked', value: 'blocked' },
          { label: 'Refresh age', value: 'latency' },
          { label: 'Lineage', value: 'lineage' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
      { id: 'qualityScore', type: 'text', label: 'Quality score', description: 'Overall quality percentage.', placeholder: '94' },
      { id: 'coverageScore', type: 'text', label: 'Coverage score', description: 'Dataset coverage percentage.', placeholder: '96' },
      { id: 'showMetrics', type: 'boolean', label: 'Metrics', description: 'Shows or hides selectable metric tiles.' },
      { id: 'showIssues', type: 'boolean', label: 'Issues', description: 'Shows or hides issue rows.' },
    ],
    defaultParameters: {
      coverageScore: '96',
      density: 'comfortable',
      qualityScore: '94',
      selectable: true,
      selectedMetricId: 'accepted',
      showIssues: true,
      showMetrics: true,
      status: 'ready',
      variant: 'default',
    },
    contentTitle: 'Dataset Content',
    contentDescription: 'Main title shown in the dataset summary header.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Dataset summary heading.',
        placeholder: 'Strategy runtime records',
      },
    ],
    defaultContentValues: {
      title: 'Strategy runtime records',
    },
    renderPreview: (parameters, contentValues) => (
      <DatasetSummaryExample
        coverageScore={getNumberParameter(parameters.coverageScore, 96)}
        density={parameters.density as AdvancedDataDensity}
        qualityScore={getNumberParameter(parameters.qualityScore, 94)}
        selectable={Boolean(parameters.selectable)}
        selectedMetricId={String(parameters.selectedMetricId ?? 'accepted')}
        showIssues={Boolean(parameters.showIssues)}
        showMetrics={Boolean(parameters.showMetrics)}
        status={parameters.status as AdvancedDataStatus}
        title={String(contentValues.title ?? 'Strategy runtime records')}
        variant={parameters.variant as AdvancedDataVariant}
      />
    ),
  },
  {
    id: 'field-profile',
    group: 'Advanced Data',
    name: 'FieldProfile',
    description: 'Selected-field profile with facts, completeness, uniqueness, and distribution buckets.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes field profile spacing.', options: advancedDataDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes the field profile surface treatment.', options: advancedDataVariantOptions },
      { id: 'status', type: 'select', label: 'Status', description: 'Sets the field profile processing state.', options: advancedDataStatusOptions },
      selectableParameter,
      {
        id: 'selectedBucketIndex',
        type: 'select',
        label: 'Selected bucket',
        description: 'Selects a distribution bucket from code; bucket clicks still update the preview.',
        options: [
          { label: '0-10 (0)', value: '0' },
          { label: '10-25 (1)', value: '1' },
          { label: '25-50 (2)', value: '2' },
          { label: '50-75 (3)', value: '3' },
          { label: '75+ (4)', value: '4' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
      { id: 'missingRate', type: 'text', label: 'Missing rate', description: 'Percent of missing values.', placeholder: '2' },
      { id: 'uniqueRate', type: 'text', label: 'Unique rate', description: 'Percent of unique values.', placeholder: '84' },
      { id: 'showDistribution', type: 'boolean', label: 'Distribution', description: 'Shows or hides the bucket chart.' },
    ],
    defaultParameters: {
      density: 'comfortable',
      missingRate: '2',
      selectable: true,
      selectedBucketIndex: '2',
      showDistribution: true,
      status: 'ready',
      uniqueRate: '84',
      variant: 'default',
    },
    contentTitle: 'Field Content',
    contentDescription: 'Field identity and type shown in the profile header.',
    contentControls: [
      { id: 'fieldName', type: 'text', label: 'Field name', description: 'Selected field name.', placeholder: 'exposure_limit' },
      { id: 'fieldType', type: 'text', label: 'Field type', description: 'Selected field type.', placeholder: 'number' },
    ],
    defaultContentValues: {
      fieldName: 'exposure_limit',
      fieldType: 'number',
    },
    renderPreview: (parameters, contentValues) => (
      <FieldProfileExample
        density={parameters.density as AdvancedDataDensity}
        fieldName={String(contentValues.fieldName ?? 'exposure_limit')}
        fieldType={String(contentValues.fieldType ?? 'number')}
        missingRate={getNumberParameter(parameters.missingRate, 2)}
        selectable={Boolean(parameters.selectable)}
        selectedBucketIndex={getIndexParameter(parameters.selectedBucketIndex)}
        showDistribution={Boolean(parameters.showDistribution)}
        status={parameters.status as AdvancedDataStatus}
        uniqueRate={getNumberParameter(parameters.uniqueRate, 84)}
        variant={parameters.variant as AdvancedDataVariant}
      />
    ),
  },
  {
    id: 'query-result-panel',
    group: 'Advanced Data',
    name: 'QueryResultPanel',
    description: 'Query result surface with execution summary, query text, and selectable preview table.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes summary and table density.', options: advancedDataDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes the query result surface treatment.', options: advancedDataVariantOptions },
      { id: 'status', type: 'select', label: 'Status', description: 'Sets the query execution state.', options: advancedDataStatusOptions },
      selectableParameter,
      {
        id: 'selectedRowIndex',
        type: 'select',
        label: 'Selected row',
        description: 'Selects a result row from code; clicking rows still changes selection.',
        options: [
          { label: 'First row (0)', value: '0' },
          { label: 'Second row (1)', value: '1' },
          { label: 'Third row (2)', value: '2' },
          { label: 'Fourth row (3)', value: '3' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
      { id: 'durationMs', type: 'text', label: 'Duration', description: 'Query duration in milliseconds.', placeholder: '184' },
      { id: 'maxHeight', type: 'text', label: 'Table height', description: 'Maximum result table height.', placeholder: '320px' },
      { id: 'showSummary', type: 'boolean', label: 'Summary', description: 'Shows or hides execution summary metrics.' },
      { id: 'showQuery', type: 'boolean', label: 'Query text', description: 'Shows or hides the query text block.' },
    ],
    defaultParameters: {
      density: 'comfortable',
      durationMs: '184',
      maxHeight: '320px',
      selectable: true,
      selectedRowIndex: '0',
      showQuery: true,
      showSummary: true,
      status: 'ready',
      variant: 'default',
    },
    contentTitle: 'Query Content',
    contentDescription: 'Title shown above the query result panel.',
    contentControls: [
      { id: 'title', type: 'text', label: 'Title', description: 'Query result title.', placeholder: 'Strategy candidates' },
    ],
    defaultContentValues: {
      title: 'Strategy candidates',
    },
    renderPreview: (parameters, contentValues) => (
      <QueryResultPanelExample
        density={parameters.density as AdvancedDataDensity}
        durationMs={getNumberParameter(parameters.durationMs, 184)}
        maxHeight={String(parameters.maxHeight ?? '320px')}
        selectable={Boolean(parameters.selectable)}
        selectedRowIndex={getIndexParameter(parameters.selectedRowIndex)}
        showQuery={Boolean(parameters.showQuery)}
        showSummary={Boolean(parameters.showSummary)}
        status={parameters.status as AdvancedDataStatus}
        title={String(contentValues.title ?? 'Strategy candidates')}
        variant={parameters.variant as AdvancedDataVariant}
      />
    ),
  },
  {
    id: 'data-quality-panel',
    group: 'Advanced Data',
    name: 'DataQualityPanel',
    description: 'Validation checklist with quality score, check statuses, and selectable check rows.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes quality panel spacing.', options: advancedDataDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes the quality panel surface treatment.', options: advancedDataVariantOptions },
      { id: 'status', type: 'select', label: 'Status', description: 'Sets the overall validation state.', options: advancedDataStatusOptions },
      selectableParameter,
      {
        id: 'selectedCheckId',
        type: 'select',
        label: 'Selected check',
        description: 'Selects a quality check from code; clicking checks still changes selection.',
        options: [
          { label: 'Identity completeness', value: 'identity' },
          { label: 'Freshness window', value: 'freshness' },
          { label: 'Range validation', value: 'bounds' },
          { label: 'Manual review queue', value: 'review' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
      { id: 'score', type: 'text', label: 'Score', description: 'Overall quality score percentage.', placeholder: '92' },
      { id: 'showProgress', type: 'boolean', label: 'Progress', description: 'Shows or hides per-check progress bars.' },
    ],
    defaultParameters: {
      density: 'comfortable',
      score: '92',
      selectable: true,
      selectedCheckId: 'freshness',
      showProgress: true,
      status: 'ready',
      variant: 'default',
    },
    contentTitle: 'Quality Content',
    contentDescription: 'Panel heading shown above the checks.',
    contentControls: [
      { id: 'title', type: 'text', label: 'Title', description: 'Quality panel title.', placeholder: 'Runtime validation' },
    ],
    defaultContentValues: {
      title: 'Runtime validation',
    },
    renderPreview: (parameters, contentValues) => (
      <DataQualityPanelExample
        density={parameters.density as AdvancedDataDensity}
        score={getNumberParameter(parameters.score, 92)}
        selectable={Boolean(parameters.selectable)}
        selectedCheckId={String(parameters.selectedCheckId ?? 'freshness')}
        showProgress={Boolean(parameters.showProgress)}
        status={parameters.status as AdvancedDataStatus}
        title={String(contentValues.title ?? 'Runtime validation')}
        variant={parameters.variant as AdvancedDataVariant}
      />
    ),
  },
  {
    id: 'schema-explorer',
    group: 'Advanced Data',
    name: 'SchemaExplorer',
    description: 'Schema browser for tables, fields, nullable markers, and field metadata.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes schema row spacing.', options: advancedDataDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: advancedDataVariantOptions },
      selectableParameter,
      { id: 'showNullable', type: 'boolean', label: 'Nullable markers', description: 'Shows nullable field markers.' },
      {
        id: 'selectedTableId',
        type: 'select',
        label: 'Selected table',
        description: 'Sets selected table from code.',
        options: [
          { label: 'Strategy candidates', value: 'strategy_candidates' },
          { label: 'Positions', value: 'positions' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
      {
        id: 'selectedFieldId',
        type: 'select',
        label: 'Selected field',
        description: 'Sets selected field from code.',
        options: [
          { label: 'Score', value: 'score' },
          { label: 'Risk state', value: 'risk' },
          { label: 'Symbol', value: 'symbol' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedFieldId: 'score',
      selectedTableId: 'strategy_candidates',
      showNullable: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <SchemaExplorerExample
        density={parameters.density as AdvancedDataDensity}
        selectable={Boolean(parameters.selectable)}
        selectedFieldId={String(parameters.selectedFieldId ?? '')}
        selectedTableId={String(parameters.selectedTableId ?? '')}
        showNullable={Boolean(parameters.showNullable)}
        variant={parameters.variant as AdvancedDataVariant}
      />
    ),
  },
  {
    id: 'pivot-summary',
    group: 'Advanced Data',
    name: 'PivotSummary',
    description: 'Compact pivot table summary for metric values across two dimensions.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes pivot spacing.', options: advancedDataDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: advancedDataVariantOptions },
    ],
    defaultParameters: {
      density: 'comfortable',
      variant: 'default',
    },
    contentTitle: 'Pivot Content',
    contentDescription: 'Metric label displayed in the pivot header.',
    contentControls: [
      { id: 'metricLabel', type: 'text', label: 'Metric label', description: 'Metric caption above the pivot.', placeholder: 'Net P/L by strategy and mode' },
    ],
    defaultContentValues: {
      metricLabel: 'Net P/L by strategy and mode',
    },
    renderPreview: (parameters, contentValues) => (
      <PivotSummaryExample density={parameters.density as AdvancedDataDensity} metricLabel={String(contentValues.metricLabel ?? '')} variant={parameters.variant as AdvancedDataVariant} />
    ),
  },
  {
    id: 'join-preview',
    group: 'Advanced Data',
    name: 'JoinPreview',
    description: 'Join coverage preview for matched and unmatched row counts.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes join preview spacing.', options: advancedDataDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: advancedDataVariantOptions },
      { id: 'joinType', type: 'select', label: 'Join type', description: 'Selects the join method label.', options: advancedDataJoinOptions },
      { id: 'matchedRows', type: 'text', label: 'Matched rows', description: 'Number of matched rows.', placeholder: '38' },
    ],
    defaultParameters: {
      density: 'comfortable',
      joinType: 'left',
      matchedRows: '38',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <JoinPreviewExample
        density={parameters.density as AdvancedDataDensity}
        joinType={parameters.joinType as 'inner' | 'left' | 'right' | 'outer'}
        matchedRows={getNumberParameter(parameters.matchedRows, 38)}
        variant={parameters.variant as AdvancedDataVariant}
      />
    ),
  },
  {
    id: 'lineage-trace',
    group: 'Advanced Data',
    name: 'LineageTrace',
    description: 'Selectable data lineage trace from source through transform, validation, and publish.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes lineage spacing.', options: advancedDataDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: advancedDataVariantOptions },
      { id: 'orientation', type: 'select', label: 'Orientation', description: 'Switches between horizontal and vertical trace flow.', options: layoutOrientationOptions },
      selectableParameter,
      {
        id: 'selectedNodeId',
        type: 'select',
        label: 'Selected node',
        description: 'Sets selected lineage node from code.',
        options: [
          { label: 'Source', value: 'source' },
          { label: 'Transform', value: 'transform' },
          { label: 'Validate', value: 'validate' },
          { label: 'Publish', value: 'publish' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      orientation: 'horizontal',
      selectable: true,
      selectedNodeId: 'transform',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <LineageTraceExample
        density={parameters.density as AdvancedDataDensity}
        orientation={parameters.orientation as 'horizontal' | 'vertical'}
        selectable={Boolean(parameters.selectable)}
        selectedNodeId={String(parameters.selectedNodeId ?? 'transform')}
        variant={parameters.variant as AdvancedDataVariant}
      />
    ),
  },
  {
    id: 'tag',
    group: 'Data Display',
    name: 'Tag',
    description: 'Compact label for filters, states, and metadata.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes tag density.', options: formSizeOptions },
      { id: 'tone', type: 'select', label: 'Tone', description: 'Selects semantic tag color.', options: tagToneOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes tag surface treatment.', options: tagVariantOptions },
      { id: 'dot', type: 'boolean', label: 'Dot', description: 'Shows the leading status dot.' },
      { id: 'removable', type: 'boolean', label: 'Removable', description: 'Shows a remove button.' },
    ],
    defaultParameters: {
      dot: true,
      removable: false,
      size: 'comfortable',
      tone: 'warning',
      variant: 'soft',
    },
    contentTitle: 'Tag Content',
    contentDescription: 'Label displayed inside the tag.',
    contentControls: [
      { id: 'label', type: 'text', label: 'Label', description: 'Tag label text.', placeholder: 'High importance' },
    ],
    defaultContentValues: {
      label: 'High importance',
    },
    renderPreview: (parameters, contentValues) => (
      <TagExample
        dot={Boolean(parameters.dot)}
        label={String(contentValues.label ?? '')}
        removable={Boolean(parameters.removable)}
        size={parameters.size as TagSize}
        tone={parameters.tone as TagTone}
        variant={parameters.variant as TagVariant}
      />
    ),
  },
  {
    id: 'time-series-chart',
    group: 'Market Visuals',
    name: 'TimeSeriesChart',
    description: 'Theme-driven line or area chart for prices, scores, and generic market series.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the chart surface treatment.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes chart padding and plot height.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'mode',
        type: 'select',
        label: 'Mode',
        description: 'Switches between a plain line and an area-backed line.',
        options: [
          { label: 'Area', value: 'area' },
          { label: 'Line', value: 'line' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Auto derives positive or negative color from the first and last value.',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Negative', value: 'negative' },
          { label: 'Warning', value: 'warning' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'showGrid',
        type: 'boolean',
        label: 'Grid',
        description: 'Shows horizontal reference lines behind the series.',
      },
      {
        id: 'showPoints',
        type: 'boolean',
        label: 'Points',
        description: 'Shows point markers on every data value.',
      },
      {
        id: 'showValue',
        type: 'boolean',
        label: 'Value',
        description: 'Shows the latest value in the chart header.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Animates the line and area when the chart enters.',
      },
    ],
    defaultParameters: {
      animated: true,
      density: 'comfortable',
      mode: 'area',
      showGrid: true,
      showPoints: false,
      showValue: true,
      tone: 'auto',
      variant: 'default',
    },
    contentTitle: 'Chart Data',
    contentDescription: 'Title, supporting text, and comma or line separated values.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Chart heading.',
        placeholder: 'AAPL intraday',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text below the title.',
        placeholder: 'Intraday mid-price movement across the active session.',
      },
      {
        id: 'values',
        type: 'richtext',
        label: 'Values',
        description: 'Comma, space, or line separated numeric series values.',
        placeholder: marketSeriesValuesExample,
        rows: 4,
      },
    ],
    defaultContentValues: {
      description: 'Intraday mid-price movement across the active session.',
      title: 'AAPL intraday',
      values: marketSeriesValuesExample,
    },
    renderPreview: (parameters, contentValues) => (
      <TimeSeriesChartExample
        animated={Boolean(parameters.animated)}
        density={parameters.density as MarketChartDensity}
        description={String(contentValues.description ?? '')}
        mode={parameters.mode as TimeSeriesChartMode}
        showGrid={Boolean(parameters.showGrid)}
        showPoints={Boolean(parameters.showPoints)}
        showValue={Boolean(parameters.showValue)}
        title={String(contentValues.title ?? '')}
        tone={parameters.tone as MarketChartTone}
        values={getNumberListParameter(contentValues.values, [102.4, 103.1, 102.8, 104.6, 106.2, 105.8, 108.4])}
        variant={parameters.variant as MarketChartVariant}
      />
    ),
  },
  {
    id: 'candlestick-chart',
    group: 'Market Visuals',
    name: 'CandlestickChart',
    description: 'OHLC chart with themed positive and negative candles plus optional volume.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the chart surface treatment.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes chart padding and plot height.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showGrid',
        type: 'boolean',
        label: 'Grid',
        description: 'Shows horizontal price reference lines.',
      },
      {
        id: 'showVolume',
        type: 'boolean',
        label: 'Volume',
        description: 'Shows volume bars under the candle plot.',
      },
      {
        id: 'showWicks',
        type: 'boolean',
        label: 'Wicks',
        description: 'Shows high and low wicks for each candle.',
      },
      {
        id: 'showValue',
        type: 'boolean',
        label: 'Value',
        description: 'Shows the latest close in the chart header.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Animates candles and volume bars when the chart enters.',
      },
    ],
    defaultParameters: {
      animated: true,
      density: 'comfortable',
      showGrid: true,
      showValue: true,
      showVolume: true,
      showWicks: true,
      variant: 'default',
    },
    contentTitle: 'OHLC Data',
    contentDescription: 'One candle per line: label, open, high, low, close, optional volume.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Chart heading.',
        placeholder: 'AAPL OHLC',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text below the title.',
        placeholder: 'OHLC candles with optional volume bars.',
      },
      {
        id: 'candles',
        type: 'richtext',
        label: 'Candles',
        description: 'One candle per line: label, open, high, low, close, optional volume.',
        placeholder: ohlcCandlesExample,
        rows: 8,
      },
    ],
    defaultContentValues: {
      candles: ohlcCandlesExample,
      description: 'OHLC candles with optional volume bars.',
      title: 'AAPL OHLC',
    },
    renderPreview: (parameters, contentValues) => (
      <CandlestickChartExample
        animated={Boolean(parameters.animated)}
        candles={getOhlcParameter(contentValues.candles, getOhlcParameter(ohlcCandlesExample, []))}
        density={parameters.density as MarketChartDensity}
        description={String(contentValues.description ?? '')}
        showGrid={Boolean(parameters.showGrid)}
        showValue={Boolean(parameters.showValue)}
        showVolume={Boolean(parameters.showVolume)}
        showWicks={Boolean(parameters.showWicks)}
        title={String(contentValues.title ?? '')}
        variant={parameters.variant as MarketChartVariant}
      />
    ),
  },
  {
    id: 'volume-bars',
    group: 'Market Visuals',
    name: 'VolumeBars',
    description: 'Reusable bar chart for absolute volume or signed buy/sell pressure.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the chart surface treatment.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes chart padding and plot height.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'mode',
        type: 'select',
        label: 'Mode',
        description: 'Absolute mode draws neutral volume; signed mode draws positive and negative pressure.',
        options: [
          { label: 'Absolute', value: 'absolute' },
          { label: 'Signed', value: 'signed' },
        ],
      },
      {
        id: 'showGrid',
        type: 'boolean',
        label: 'Grid',
        description: 'Shows horizontal reference lines behind the bars.',
      },
      {
        id: 'showValue',
        type: 'boolean',
        label: 'Value',
        description: 'Shows total absolute volume in the chart header.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Animates bars when the chart enters.',
      },
    ],
    defaultParameters: {
      animated: true,
      density: 'comfortable',
      mode: 'absolute',
      showGrid: true,
      showValue: true,
      variant: 'default',
    },
    contentTitle: 'Volume Data',
    contentDescription: 'Comma or line separated bar values. Use negative values for signed pressure.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Chart heading.',
        placeholder: 'Volume bars',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text below the title.',
        placeholder: 'Session volume with optional signed buy/sell pressure.',
      },
      {
        id: 'values',
        type: 'richtext',
        label: 'Values',
        description: 'Comma, space, or line separated bar values.',
        placeholder: marketVolumeValuesExample,
        rows: 4,
      },
    ],
    defaultContentValues: {
      description: 'Session volume with optional signed buy/sell pressure.',
      title: 'Volume bars',
      values: marketVolumeValuesExample,
    },
    renderPreview: (parameters, contentValues) => {
      const mode = parameters.mode as VolumeBarsMode;
      const fallbackValues = mode === 'signed' ? [2200, 3100, -1800, 4200, -2600, 5300, 4900] : [4200, 5100, 3900, 6200, 5800, 7300, 6900];
      const contentValue = String(contentValues.values ?? '');
      const values = contentValue === marketVolumeValuesExample && mode === 'signed'
        ? getNumberListParameter(signedVolumeValuesExample, fallbackValues)
        : getNumberListParameter(contentValues.values, fallbackValues);

      return (
        <VolumeBarsExample
          animated={Boolean(parameters.animated)}
          density={parameters.density as MarketChartDensity}
          description={String(contentValues.description ?? '')}
          mode={mode}
          showGrid={Boolean(parameters.showGrid)}
          showValue={Boolean(parameters.showValue)}
          title={String(contentValues.title ?? '')}
          values={values}
          variant={parameters.variant as MarketChartVariant}
        />
      );
    },
  },
  {
    id: 'depth-chart',
    group: 'Market Visuals',
    name: 'DepthChart',
    description: 'Stepped bid and ask liquidity chart with midpoint and spread display.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the chart surface treatment.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes chart padding and plot height.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showGrid',
        type: 'boolean',
        label: 'Grid',
        description: 'Shows horizontal size reference lines.',
      },
      {
        id: 'showMidPrice',
        type: 'boolean',
        label: 'Mid price',
        description: 'Shows the midpoint marker between best bid and ask.',
      },
      {
        id: 'showValue',
        type: 'boolean',
        label: 'Spread',
        description: 'Shows the current spread in the chart header.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Animates stepped depth areas when the chart enters.',
      },
    ],
    defaultParameters: {
      animated: true,
      density: 'comfortable',
      showGrid: true,
      showMidPrice: true,
      showValue: true,
      variant: 'default',
    },
    contentTitle: 'Depth Data',
    contentDescription: 'One level per line: price, cumulative size.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Chart heading.',
        placeholder: 'Order book depth',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text below the title.',
        placeholder: 'Bid and ask liquidity ladder around the midpoint.',
      },
      {
        id: 'bids',
        type: 'richtext',
        label: 'Bids',
        description: 'One bid level per line: price, cumulative size.',
        placeholder: depthBidsExample,
        rows: 4,
      },
      {
        id: 'asks',
        type: 'richtext',
        label: 'Asks',
        description: 'One ask level per line: price, cumulative size.',
        placeholder: depthAsksExample,
        rows: 4,
      },
    ],
    defaultContentValues: {
      asks: depthAsksExample,
      bids: depthBidsExample,
      description: 'Bid and ask liquidity ladder around the midpoint.',
      title: 'Order book depth',
    },
    renderPreview: (parameters, contentValues) => (
      <DepthChartExample
        animated={Boolean(parameters.animated)}
        asks={getDepthParameter(contentValues.asks, getDepthParameter(depthAsksExample, []))}
        bids={getDepthParameter(contentValues.bids, getDepthParameter(depthBidsExample, []))}
        density={parameters.density as MarketChartDensity}
        description={String(contentValues.description ?? '')}
        showGrid={Boolean(parameters.showGrid)}
        showMidPrice={Boolean(parameters.showMidPrice)}
        showValue={Boolean(parameters.showValue)}
        title={String(contentValues.title ?? '')}
        variant={parameters.variant as MarketChartVariant}
      />
    ),
  },
  {
    id: 'equity-curve',
    group: 'Market Visuals',
    name: 'EquityCurve',
    description: 'Portfolio equity line with optional benchmark and drawdown context.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the chart surface treatment.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes chart padding and plot height.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Auto derives positive or negative color from start and end equity.',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Negative', value: 'negative' },
          { label: 'Warning', value: 'warning' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'showBenchmark',
        type: 'boolean',
        label: 'Benchmark',
        description: 'Shows the dashed comparison curve.',
      },
      {
        id: 'showDrawdown',
        type: 'boolean',
        label: 'Drawdown',
        description: 'Shows drawdown context below the equity line.',
      },
      {
        id: 'showGrid',
        type: 'boolean',
        label: 'Grid',
        description: 'Shows horizontal equity reference lines.',
      },
      {
        id: 'showValue',
        type: 'boolean',
        label: 'Value',
        description: 'Shows latest equity in the chart header.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Animates equity, benchmark, and drawdown when the chart enters.',
      },
    ],
    defaultParameters: {
      animated: true,
      density: 'comfortable',
      showBenchmark: true,
      showDrawdown: true,
      showGrid: true,
      showValue: true,
      tone: 'auto',
      variant: 'default',
    },
    contentTitle: 'Equity Data',
    contentDescription: 'Portfolio and optional benchmark values.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Chart heading.',
        placeholder: 'Portfolio equity',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text below the title.',
        placeholder: 'Portfolio equity with benchmark and drawdown context.',
      },
      {
        id: 'values',
        type: 'richtext',
        label: 'Equity values',
        description: 'Comma, space, or line separated equity values.',
        placeholder: equityValuesExample,
        rows: 4,
      },
      {
        id: 'benchmarkValues',
        type: 'richtext',
        label: 'Benchmark values',
        description: 'Comma, space, or line separated benchmark values.',
        placeholder: benchmarkValuesExample,
        rows: 4,
      },
    ],
    defaultContentValues: {
      benchmarkValues: benchmarkValuesExample,
      description: 'Portfolio equity with benchmark and drawdown context.',
      title: 'Portfolio equity',
      values: equityValuesExample,
    },
    renderPreview: (parameters, contentValues) => (
      <EquityCurveExample
        animated={Boolean(parameters.animated)}
        benchmarkValues={getNumberListParameter(contentValues.benchmarkValues, [100000, 100320, 100680, 101100, 101860])}
        density={parameters.density as MarketChartDensity}
        description={String(contentValues.description ?? '')}
        showBenchmark={Boolean(parameters.showBenchmark)}
        showDrawdown={Boolean(parameters.showDrawdown)}
        showGrid={Boolean(parameters.showGrid)}
        showValue={Boolean(parameters.showValue)}
        title={String(contentValues.title ?? '')}
        tone={parameters.tone as MarketChartTone}
        values={getNumberListParameter(contentValues.values, [100000, 100850, 100420, 102140, 103720])}
        variant={parameters.variant as MarketChartVariant}
      />
    ),
  },
  {
    id: 'correlation-heatmap',
    group: 'Market Visuals',
    name: 'CorrelationHeatmap',
    description: 'Matrix heatmap for symbol correlation and portfolio relationship views.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the chart surface treatment.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Muted', value: 'muted' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes chart padding and plot height.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showValues',
        type: 'boolean',
        label: 'Values',
        description: 'Shows numeric correlation values inside each cell.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Animates heatmap cells when the chart enters.',
      },
    ],
    defaultParameters: {
      animated: true,
      density: 'comfortable',
      showValues: true,
      variant: 'default',
    },
    contentTitle: 'Matrix Data',
    contentDescription: 'Symbols and matching numeric matrix rows.',
    contentControls: [
      {
        id: 'title',
        type: 'text',
        label: 'Title',
        description: 'Chart heading.',
        placeholder: 'Correlation matrix',
      },
      {
        id: 'description',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text below the title.',
        placeholder: 'Pairwise symbol correlation for portfolio risk context.',
      },
      {
        id: 'symbols',
        type: 'richtext',
        label: 'Symbols',
        description: 'Comma or line separated symbol labels.',
        placeholder: correlationSymbolsExample,
        rows: 3,
      },
      {
        id: 'matrix',
        type: 'richtext',
        label: 'Matrix',
        description: 'One numeric matrix row per line, separated by commas.',
        placeholder: correlationMatrixExample,
        rows: 6,
      },
    ],
    defaultContentValues: {
      description: 'Pairwise symbol correlation for portfolio risk context.',
      matrix: correlationMatrixExample,
      symbols: correlationSymbolsExample,
      title: 'Correlation matrix',
    },
    renderPreview: (parameters, contentValues) => (
      <CorrelationHeatmapExample
        animated={Boolean(parameters.animated)}
        density={parameters.density as MarketChartDensity}
        description={String(contentValues.description ?? '')}
        matrix={getMatrixParameter(contentValues.matrix, getMatrixParameter(correlationMatrixExample, []))}
        showValues={Boolean(parameters.showValues)}
        symbols={getTextListParameter(contentValues.symbols, getTextListParameter(correlationSymbolsExample, []))}
        title={String(contentValues.title ?? '')}
        variant={parameters.variant as MarketChartVariant}
      />
    ),
  },
  {
    id: 'price-display',
    group: 'Trading Workflow',
    name: 'PriceDisplay',
    description: 'Formatted market price display with optional symbol, currency, precision, and semantic tone.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes the price typography scale.', options: tradingDensityOptions },
      { id: 'tone', type: 'select', label: 'Tone', description: 'Sets or auto-derives the display color.', options: tradingToneOptions },
      { id: 'showSymbol', type: 'boolean', label: 'Symbol', description: 'Shows the symbol before the formatted price.' },
      { id: 'showCurrency', type: 'boolean', label: 'Currency code', description: 'Shows the ISO currency code after the price.' },
    ],
    defaultParameters: {
      showCurrency: false,
      showSymbol: true,
      size: 'comfortable',
      tone: 'neutral',
    },
    contentTitle: 'Price Content',
    contentDescription: 'Code-driven value and display labels.',
    contentControls: [
      { id: 'label', type: 'text', label: 'Label', description: 'Optional caption above the price.', placeholder: 'Last price' },
      { id: 'symbol', type: 'text', label: 'Symbol', description: 'Market symbol shown when enabled.', placeholder: 'AAPL' },
      { id: 'value', type: 'text', label: 'Value', description: 'Numeric price value.', placeholder: '210.42' },
      { id: 'precision', type: 'text', label: 'Precision', description: 'Number of fraction digits.', placeholder: '2' },
    ],
    defaultContentValues: {
      label: 'Last price',
      precision: '2',
      symbol: 'AAPL',
      value: '210.42',
    },
    renderPreview: (parameters, contentValues) => (
      <PriceDisplayExample
        label={String(contentValues.label ?? '')}
        precision={getNumberParameter(contentValues.precision, 2)}
        showCurrency={Boolean(parameters.showCurrency)}
        showSymbol={Boolean(parameters.showSymbol)}
        size={parameters.size as TradingDensity}
        symbol={String(contentValues.symbol ?? '')}
        tone={parameters.tone as TradingTone}
        value={getNumberParameter(contentValues.value, 210.42)}
      />
    ),
  },
  {
    id: 'pnl-display',
    group: 'Trading Workflow',
    name: 'PnLDisplay',
    description: 'Profit and loss display with signed amount, percentage, and theme trading colors.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes the P/L typography scale.', options: tradingDensityOptions },
      { id: 'tone', type: 'select', label: 'Tone', description: 'Auto derives positive or negative unless overridden.', options: tradingToneOptions },
      {
        id: 'mode',
        type: 'select',
        label: 'Mode',
        description: 'Controls whether amount, percent, or both are shown.',
        options: [
          { label: 'Both', value: 'both' },
          { label: 'Amount', value: 'amount' },
          { label: 'Percent', value: 'percent' },
        ],
      },
      { id: 'showSign', type: 'boolean', label: 'Sign', description: 'Shows plus and minus signs for non-zero values.' },
    ],
    defaultParameters: {
      mode: 'both',
      showSign: true,
      size: 'comfortable',
      tone: 'auto',
    },
    contentTitle: 'P/L Content',
    contentDescription: 'Amount and percentage used by the display.',
    contentControls: [
      { id: 'amount', type: 'text', label: 'Amount', description: 'Signed P/L amount.', placeholder: '2190' },
      { id: 'percent', type: 'text', label: 'Percent', description: 'Signed P/L percentage.', placeholder: '3.59' },
    ],
    defaultContentValues: {
      amount: '2190',
      percent: '3.59',
    },
    renderPreview: (parameters, contentValues) => (
      <PnLDisplayExample
        amount={getNumberParameter(contentValues.amount, 2190)}
        mode={parameters.mode as 'amount' | 'percent' | 'both'}
        percent={getNumberParameter(contentValues.percent, 3.59)}
        showSign={Boolean(parameters.showSign)}
        size={parameters.size as TradingDensity}
        tone={parameters.tone as TradingTone}
      />
    ),
  },
  {
    id: 'order-status',
    group: 'Trading Workflow',
    name: 'OrderStatus',
    description: 'Order lifecycle badge built on the shared status badge primitive.',
    status: 'Ready',
    parameters: [
      {
        id: 'status',
        type: 'select',
        label: 'Status',
        description: 'Maps order state to a semantic status tone.',
        options: [
          { label: 'Draft', value: 'draft' },
          { label: 'Submitted', value: 'submitted' },
          { label: 'Working', value: 'working' },
          { label: 'Partial', value: 'partial' },
          { label: 'Filled', value: 'filled' },
          { label: 'Canceled', value: 'canceled' },
          { label: 'Rejected', value: 'rejected' },
        ],
      },
      { id: 'size', type: 'select', label: 'Size', description: 'Changes badge density.', options: tradingDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes badge surface treatment.', options: tradingBadgeVariantOptions },
      { id: 'showDot', type: 'boolean', label: 'Dot', description: 'Shows the leading status dot.' },
      { id: 'animated', type: 'boolean', label: 'Animated', description: 'Uses the status badge pulse when supported.' },
    ],
    defaultParameters: {
      animated: true,
      showDot: true,
      size: 'comfortable',
      status: 'working',
      variant: 'soft',
    },
    renderPreview: (parameters) => (
      <OrderStatusExample
        animated={Boolean(parameters.animated)}
        showDot={Boolean(parameters.showDot)}
        size={parameters.size as TradingDensity}
        status={parameters.status as TradingOrderStatus}
        variant={parameters.variant as 'soft' | 'solid' | 'outline'}
      />
    ),
  },
  {
    id: 'market-state-badge',
    group: 'Trading Workflow',
    name: 'MarketStateBadge',
    description: 'Session state badge for open, closed, delayed, and halted market states.',
    status: 'Ready',
    parameters: [
      {
        id: 'state',
        type: 'select',
        label: 'State',
        description: 'Maps the market state to a semantic badge tone.',
        options: [
          { label: 'Open', value: 'open' },
          { label: 'Closed', value: 'closed' },
          { label: 'Pre-market', value: 'pre-market' },
          { label: 'After hours', value: 'after-hours' },
          { label: 'Delayed', value: 'delayed' },
          { label: 'Halted', value: 'halted' },
        ],
      },
      { id: 'size', type: 'select', label: 'Size', description: 'Changes badge density.', options: tradingDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes badge surface treatment.', options: tradingBadgeVariantOptions },
      { id: 'showDot', type: 'boolean', label: 'Dot', description: 'Shows the leading status dot.' },
      { id: 'animated', type: 'boolean', label: 'Animated', description: 'Uses the status badge pulse when supported.' },
    ],
    defaultParameters: {
      animated: true,
      showDot: true,
      size: 'comfortable',
      state: 'open',
      variant: 'soft',
    },
    renderPreview: (parameters) => (
      <MarketStateBadgeExample
        animated={Boolean(parameters.animated)}
        showDot={Boolean(parameters.showDot)}
        size={parameters.size as TradingDensity}
        state={parameters.state as TradingMarketState}
        variant={parameters.variant as 'soft' | 'solid' | 'outline'}
      />
    ),
  },
  {
    id: 'latency-indicator',
    group: 'Trading Workflow',
    name: 'LatencyIndicator',
    description: 'Broker, stream, or runtime latency pill with threshold-based trading tones.',
    status: 'Ready',
    parameters: [
      { id: 'size', type: 'select', label: 'Size', description: 'Changes indicator density.', options: tradingDensityOptions },
      { id: 'showSignal', type: 'boolean', label: 'Signal dot', description: 'Shows the leading status signal.' },
    ],
    defaultParameters: {
      showSignal: true,
      size: 'comfortable',
    },
    contentTitle: 'Latency Content',
    contentDescription: 'Latency value and threshold behavior.',
    contentControls: [
      { id: 'label', type: 'text', label: 'Label', description: 'Indicator label.', placeholder: 'Broker stream' },
      { id: 'latencyMs', type: 'text', label: 'Latency', description: 'Latency in milliseconds.', placeholder: '42' },
      { id: 'warningMs', type: 'text', label: 'Warning ms', description: 'Threshold where the indicator turns warning.', placeholder: '250' },
      { id: 'errorMs', type: 'text', label: 'Error ms', description: 'Threshold where the indicator turns negative.', placeholder: '750' },
    ],
    defaultContentValues: {
      errorMs: '750',
      label: 'Broker stream',
      latencyMs: '42',
      warningMs: '250',
    },
    renderPreview: (parameters, contentValues) => (
      <LatencyIndicatorExample
        label={String(contentValues.label ?? '')}
        latencyMs={getNumberParameter(contentValues.latencyMs, 42)}
        showSignal={Boolean(parameters.showSignal)}
        size={parameters.size as TradingDensity}
        thresholdErrorMs={getNumberParameter(contentValues.errorMs, 750)}
        thresholdWarningMs={getNumberParameter(contentValues.warningMs, 250)}
      />
    ),
  },
  {
    id: 'position-summary',
    group: 'Trading Workflow',
    name: 'PositionSummary',
    description: 'Compact position summary with quantity, average price, market value, P/L, and exposure.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes metric density.', options: tradingDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes card surface treatment.', options: tradingSurfaceOptions },
      { id: 'selected', type: 'boolean', label: 'Selected', description: 'Shows selected-card treatment.' },
      { id: 'showExposure', type: 'boolean', label: 'Exposure', description: 'Shows the exposure row when available.' },
    ],
    defaultParameters: {
      density: 'comfortable',
      selected: false,
      showExposure: true,
      variant: 'default',
    },
    contentTitle: 'Position Content',
    contentDescription: 'Sample position facts used by the card.',
    contentControls: [
      { id: 'symbol', type: 'text', label: 'Symbol', description: 'Position symbol.', placeholder: 'AAPL' },
      { id: 'quantity', type: 'text', label: 'Quantity', description: 'Signed share or unit quantity.', placeholder: '300' },
      { id: 'averagePrice', type: 'text', label: 'Average', description: 'Average entry price.', placeholder: '203.12' },
      { id: 'marketValue', type: 'text', label: 'Market value', description: 'Current market value.', placeholder: '63126' },
      { id: 'pnl', type: 'text', label: 'P/L', description: 'Signed profit and loss amount.', placeholder: '2190' },
      { id: 'pnlPercent', type: 'text', label: 'P/L percent', description: 'Signed profit and loss percentage.', placeholder: '3.59' },
      { id: 'exposure', type: 'text', label: 'Exposure', description: 'Position exposure percent.', placeholder: '42' },
    ],
    defaultContentValues: {
      averagePrice: '203.12',
      exposure: '42',
      marketValue: '63126',
      pnl: '2190',
      pnlPercent: '3.59',
      quantity: '300',
      symbol: 'AAPL',
    },
    renderPreview: (parameters, contentValues) => (
      <PositionSummaryExample
        density={parameters.density as TradingDensity}
        position={{
          averagePrice: getNumberParameter(contentValues.averagePrice, 203.12),
          exposure: getNumberParameter(contentValues.exposure, 42),
          marketValue: getNumberParameter(contentValues.marketValue, 63126),
          pnl: getNumberParameter(contentValues.pnl, 2190),
          pnlPercent: getNumberParameter(contentValues.pnlPercent, 3.59),
          quantity: getNumberParameter(contentValues.quantity, 300),
          side: getNumberParameter(contentValues.quantity, 300) < 0 ? 'short' : 'long',
          symbol: String(contentValues.symbol ?? 'AAPL'),
        }}
        selected={Boolean(parameters.selected)}
        showExposure={Boolean(parameters.showExposure)}
        variant={parameters.variant as TradingSurfaceVariant}
      />
    ),
  },
  {
    id: 'order-ticket',
    group: 'Trading Workflow',
    name: 'OrderTicket',
    description: 'Theme-driven order ticket shell using the library input and button primitives.',
    status: 'Ready',
    parameters: [
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes panel surface treatment.', options: tradingSurfaceOptions },
      {
        id: 'side',
        type: 'select',
        label: 'Side',
        description: 'Controls buy or sell treatment.',
        options: [
          { color: '#05d671', label: 'Buy', value: 'buy' },
          { color: '#f94854', label: 'Sell', value: 'sell' },
        ],
      },
      {
        id: 'orderType',
        type: 'select',
        label: 'Type',
        description: 'Changes the order type and price field behavior.',
        options: [
          { label: 'Market', value: 'market' },
          { label: 'Limit', value: 'limit' },
          { label: 'Stop', value: 'stop' },
          { label: 'Stop limit', value: 'stop-limit' },
        ],
      },
      {
        id: 'timeInForce',
        type: 'select',
        label: 'Time in force',
        description: 'Controls time-in-force selection.',
        options: [
          { label: 'Day', value: 'day' },
          { label: 'GTC', value: 'gtc' },
          { label: 'IOC', value: 'ioc' },
          { label: 'FOK', value: 'fok' },
        ],
      },
      { id: 'disabled', type: 'boolean', label: 'Disabled', description: 'Disables ticket controls.' },
    ],
    defaultParameters: {
      disabled: false,
      orderType: 'limit',
      side: 'buy',
      timeInForce: 'day',
      variant: 'default',
    },
    contentTitle: 'Order Content',
    contentDescription: 'Initial code-driven order values.',
    contentControls: [
      { id: 'symbol', type: 'text', label: 'Symbol', description: 'Initial symbol.', placeholder: 'AAPL' },
      { id: 'quantity', type: 'text', label: 'Quantity', description: 'Initial quantity.', placeholder: '100' },
      { id: 'limitPrice', type: 'text', label: 'Price', description: 'Initial limit or stop price.', placeholder: '210.42' },
      { id: 'estimatedFee', type: 'text', label: 'Fee', description: 'Estimated order fee.', placeholder: '1' },
    ],
    defaultContentValues: {
      estimatedFee: '1',
      limitPrice: '210.42',
      quantity: '100',
      symbol: 'AAPL',
    },
    renderPreview: (parameters, contentValues) => (
      <OrderTicketExample
        disabled={Boolean(parameters.disabled)}
        estimatedFee={getNumberParameter(contentValues.estimatedFee, 1)}
        limitPrice={getNumberParameter(contentValues.limitPrice, 210.42)}
        orderType={parameters.orderType as TradingOrderType}
        quantity={getNumberParameter(contentValues.quantity, 100)}
        side={parameters.side as TradingSide}
        symbol={String(contentValues.symbol ?? 'AAPL')}
        timeInForce={parameters.timeInForce as TradingTimeInForce}
        variant={parameters.variant as TradingSurfaceVariant}
      />
    ),
  },
  {
    id: 'watchlist',
    group: 'Trading Workflow',
    name: 'Watchlist',
    description: 'Selectable quote list composed from price, P/L, and sparkline components.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes row density.', options: tradingDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes panel surface treatment.', options: tradingSurfaceOptions },
      { id: 'showSparkline', type: 'boolean', label: 'Sparkline', description: 'Shows row-level trend sparklines.' },
      selectableParameter,
      {
        id: 'selectedSymbol',
        type: 'select',
        label: 'Selected',
        description: 'Sets the initially selected quote from code.',
        options: [
          { label: 'AAPL', value: 'AAPL' },
          { label: 'MSFT', value: 'MSFT' },
          { label: 'NVDA', value: 'NVDA' },
          { label: 'TSLA', value: 'TSLA' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedSymbol: 'AAPL',
      showSparkline: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <WatchlistExample
        density={parameters.density as TradingDensity}
        selectable={Boolean(parameters.selectable)}
        selectedSymbol={String(parameters.selectedSymbol ?? 'AAPL')}
        showSparkline={Boolean(parameters.showSparkline)}
        variant={parameters.variant as TradingSurfaceVariant}
      />
    ),
  },
  {
    id: 'positions-table',
    group: 'Trading Workflow',
    name: 'PositionsTable',
    description: 'Sortable positions table composed from DataTable and trading display primitives.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes table density.', options: tradingDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes table surface treatment.', options: tradingSurfaceOptions.filter((option) => option.value !== 'accent') },
      { id: 'showExposure', type: 'boolean', label: 'Exposure', description: 'Shows the exposure column.' },
      selectableParameter,
      {
        id: 'selectedSymbol',
        type: 'select',
        label: 'Selected',
        description: 'Sets the selected row from code.',
        options: [
          { label: 'AAPL', value: 'AAPL' },
          { label: 'MSFT', value: 'MSFT' },
          { label: 'NVDA', value: 'NVDA' },
          { label: 'TSLA', value: 'TSLA' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedSymbol: 'AAPL',
      showExposure: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <PositionsTableExample
        density={parameters.density as TradingDensity}
        selectable={Boolean(parameters.selectable)}
        selectedSymbol={String(parameters.selectedSymbol ?? 'AAPL')}
        showExposure={Boolean(parameters.showExposure)}
        variant={parameters.variant as 'default' | 'muted' | 'outline'}
      />
    ),
  },
  {
    id: 'trade-blotter',
    group: 'Trading Workflow',
    name: 'TradeBlotter',
    description: 'Sortable order blotter using DataTable and order status badges.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes table density.', options: tradingDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes table surface treatment.', options: tradingSurfaceOptions.filter((option) => option.value !== 'accent') },
      { id: 'showFilledQuantity', type: 'boolean', label: 'Filled quantity', description: 'Shows filled versus requested quantity.' },
      selectableParameter,
      {
        id: 'selectedIndex',
        type: 'select',
        label: 'Selected',
        description: 'Sets the selected order from code using zero-based index.',
        options: [
          { label: '0', value: '0' },
          { label: '1', value: '1' },
          { label: '2', value: '2' },
          { label: '3', value: '3' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedIndex: '0',
      showFilledQuantity: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <TradeBlotterExample
        density={parameters.density as TradingDensity}
        selectable={Boolean(parameters.selectable)}
        selectedIndex={getIndexParameter(parameters.selectedIndex)}
        showFilledQuantity={Boolean(parameters.showFilledQuantity)}
        variant={parameters.variant as 'default' | 'muted' | 'outline'}
      />
    ),
  },
  {
    id: 'strategy-card',
    group: 'Trading Workflow',
    name: 'StrategyCard',
    description: 'Reusable strategy summary card with status and compact metric slots.',
    status: 'Ready',
    parameters: [
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes card surface treatment.', options: tradingSurfaceOptions },
      {
        id: 'status',
        type: 'select',
        label: 'Status',
        description: 'Maps strategy runtime state to the shared status badge.',
        options: [
          { label: 'Online', value: 'online' },
          { label: 'Watching', value: 'watching' },
          { label: 'Paused', value: 'paused' },
          { label: 'Error', value: 'error' },
          { label: 'Disabled', value: 'disabled' },
        ],
      },
      { id: 'selected', type: 'boolean', label: 'Selected', description: 'Shows selected-card treatment.' },
    ],
    defaultParameters: {
      selected: false,
      status: 'online',
      variant: 'default',
    },
    contentTitle: 'Strategy Content',
    contentDescription: 'Heading and supporting copy for the strategy card.',
    contentControls: [
      { id: 'name', type: 'text', label: 'Name', description: 'Strategy name.', placeholder: 'Demo Momentum' },
      { id: 'description', type: 'text', label: 'Description', description: 'Supporting description.', placeholder: 'Momentum strategy watching AAPL, MSFT, and NVDA.' },
    ],
    defaultContentValues: {
      description: 'Momentum strategy watching AAPL, MSFT, and NVDA with risk gate enabled.',
      name: 'Demo Momentum',
    },
    renderPreview: (parameters, contentValues) => (
      <StrategyCardExample
        description={String(contentValues.description ?? '')}
        name={String(contentValues.name ?? '')}
        selected={Boolean(parameters.selected)}
        status={parameters.status as TradingStrategyStatus}
        variant={parameters.variant as TradingSurfaceVariant}
      />
    ),
  },
  {
    id: 'risk-limit-panel',
    group: 'Trading Workflow',
    name: 'RiskLimitPanel',
    description: 'Portfolio guardrail panel with risk indicator and animated limit progress bars.',
    status: 'Ready',
    parameters: [
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes panel surface treatment.', options: tradingSurfaceOptions },
      { id: 'showDetails', type: 'boolean', label: 'Details', description: 'Shows numeric limit detail rows.' },
    ],
    defaultParameters: {
      showDetails: true,
      variant: 'default',
    },
    contentTitle: 'Risk Content',
    contentDescription: 'Risk scores and limit values for the panel.',
    contentControls: [
      { id: 'riskScore', type: 'text', label: 'Risk score', description: 'Risk score from 0 to 100.', placeholder: '42' },
      { id: 'currentExposure', type: 'text', label: 'Exposure', description: 'Current exposure value.', placeholder: '420000' },
      { id: 'maxExposure', type: 'text', label: 'Max exposure', description: 'Maximum exposure value.', placeholder: '1000000' },
      { id: 'dailyLoss', type: 'text', label: 'Daily loss', description: 'Current daily loss value.', placeholder: '12200' },
      { id: 'maxDailyLoss', type: 'text', label: 'Max daily loss', description: 'Maximum daily loss value.', placeholder: '30000' },
    ],
    defaultContentValues: {
      currentExposure: '420000',
      dailyLoss: '12200',
      maxDailyLoss: '30000',
      maxExposure: '1000000',
      riskScore: '42',
    },
    renderPreview: (parameters, contentValues) => (
      <RiskLimitPanelExample
        currentExposure={getNumberParameter(contentValues.currentExposure, 420000)}
        dailyLoss={getNumberParameter(contentValues.dailyLoss, 12200)}
        maxDailyLoss={getNumberParameter(contentValues.maxDailyLoss, 30000)}
        maxExposure={getNumberParameter(contentValues.maxExposure, 1000000)}
        riskScore={getNumberParameter(contentValues.riskScore, 42)}
        showDetails={Boolean(parameters.showDetails)}
        variant={parameters.variant as TradingSurfaceVariant}
      />
    ),
  },
  {
    id: 'quote-tile',
    group: 'Trading Workflow',
    name: 'QuoteTile',
    description: 'Compact quote card with price, P/L percent, spread, volume, and sparkline.',
    status: 'Ready',
    parameters: [
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes card surface treatment.', options: tradingSurfaceOptions },
      { id: 'selected', type: 'boolean', label: 'Selected', description: 'Shows selected-card treatment.' },
      { id: 'showSparkline', type: 'boolean', label: 'Sparkline', description: 'Shows the quote sparkline.' },
    ],
    defaultParameters: {
      selected: false,
      showSparkline: true,
      variant: 'default',
    },
    contentTitle: 'Quote Content',
    contentDescription: 'Single quote data used by the tile.',
    contentControls: [
      { id: 'symbol', type: 'text', label: 'Symbol', description: 'Quote symbol.', placeholder: 'AAPL' },
      { id: 'price', type: 'text', label: 'Price', description: 'Last price.', placeholder: '210.42' },
      { id: 'change', type: 'text', label: 'Change', description: 'Absolute price change.', placeholder: '2.84' },
      { id: 'changePercent', type: 'text', label: 'Change percent', description: 'Percent price change.', placeholder: '1.37' },
      { id: 'spread', type: 'text', label: 'Spread', description: 'Current spread.', placeholder: '0.03' },
      { id: 'volume', type: 'text', label: 'Volume', description: 'Current volume.', placeholder: '84200000' },
      { id: 'sparkline', type: 'richtext', label: 'Sparkline', description: 'Comma or line separated sparkline values.', placeholder: quoteSparkValuesExample, rows: 3 },
    ],
    defaultContentValues: {
      change: '2.84',
      changePercent: '1.37',
      price: '210.42',
      sparkline: quoteSparkValuesExample,
      spread: '0.03',
      symbol: 'AAPL',
      volume: '84200000',
    },
    renderPreview: (parameters, contentValues) => (
      <QuoteTileExample
        quote={{
          change: getNumberParameter(contentValues.change, 2.84),
          changePercent: getNumberParameter(contentValues.changePercent, 1.37),
          price: getNumberParameter(contentValues.price, 210.42),
          sparklineValues: getNumberListParameter(contentValues.sparkline, [204, 205.2, 204.8, 207, 208.4, 209.2, 210.42]),
          spread: getNumberParameter(contentValues.spread, 0.03),
          symbol: String(contentValues.symbol ?? 'AAPL'),
          volume: getNumberParameter(contentValues.volume, 84200000),
        }}
        selected={Boolean(parameters.selected)}
        showSparkline={Boolean(parameters.showSparkline)}
        variant={parameters.variant as TradingSurfaceVariant}
      />
    ),
  },
  {
    id: 'market-ticker',
    group: 'Trading Workflow',
    name: 'MarketTicker',
    description: 'Horizontally scrollable ticker composed from quote tiles.',
    status: 'Ready',
    parameters: [
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes ticker and tile treatment.', options: tradingSurfaceOptions },
      { id: 'animated', type: 'boolean', label: 'Animated', description: 'Animates quote tiles when they enter.' },
      { id: 'showSparkline', type: 'boolean', label: 'Sparkline', description: 'Shows quote sparklines.' },
      selectableParameter,
      {
        id: 'selectedSymbol',
        type: 'select',
        label: 'Selected',
        description: 'Highlights one quote tile.',
        options: [
          { label: 'AAPL', value: 'AAPL' },
          { label: 'MSFT', value: 'MSFT' },
          { label: 'NVDA', value: 'NVDA' },
          { label: 'TSLA', value: 'TSLA' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      animated: true,
      selectable: true,
      selectedSymbol: 'AAPL',
      showSparkline: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <MarketTickerExample
        animated={Boolean(parameters.animated)}
        selectable={Boolean(parameters.selectable)}
        selectedSymbol={String(parameters.selectedSymbol ?? 'AAPL')}
        showSparkline={Boolean(parameters.showSparkline)}
        variant={parameters.variant as TradingSurfaceVariant}
      />
    ),
  },
  {
    id: 'order-book-ladder',
    group: 'Trading Workflow',
    name: 'OrderBookLadder',
    description: 'Bid/ask depth ladder with selectable price levels and optional totals.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes ladder row spacing.', options: tradingDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes ladder surface treatment.', options: tradingSurfaceOptions.filter((option) => option.value !== 'accent') },
      { id: 'showTotals', type: 'boolean', label: 'Totals', description: 'Shows cumulative size totals.' },
      selectableParameter,
      { id: 'selectedPrice', type: 'text', label: 'Selected price', description: 'Selected price from code.', placeholder: '210.41', visibleWhen: selectableVisibleWhen },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedPrice: '210.41',
      showTotals: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <OrderBookLadderExample
        density={parameters.density as TradingDensity}
        selectable={Boolean(parameters.selectable)}
        selectedPrice={getNumberParameter(parameters.selectedPrice, 210.41)}
        showTotals={Boolean(parameters.showTotals)}
        variant={parameters.variant as 'default' | 'muted' | 'outline'}
      />
    ),
  },
  {
    id: 'allocation-breakdown',
    group: 'Trading Workflow',
    name: 'AllocationBreakdown',
    description: 'Allocation bars with current weights, targets, and selectable sleeves.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes allocation spacing.', options: tradingDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: tradingSurfaceOptions },
      { id: 'showTargets', type: 'boolean', label: 'Targets', description: 'Shows target allocation markers.' },
      selectableParameter,
      {
        id: 'selectedId',
        type: 'select',
        label: 'Selected allocation',
        description: 'Sets selected sleeve from code.',
        options: [
          { label: 'Equity', value: 'equity' },
          { label: 'Hedge', value: 'hedge' },
          { label: 'Cash', value: 'cash' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedId: 'equity',
      showTargets: true,
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <AllocationBreakdownExample
        density={parameters.density as TradingDensity}
        selectable={Boolean(parameters.selectable)}
        selectedId={String(parameters.selectedId ?? 'equity')}
        showTargets={Boolean(parameters.showTargets)}
        variant={parameters.variant as TradingSurfaceVariant}
      />
    ),
  },
  {
    id: 'broker-connection-summary',
    group: 'Trading Workflow',
    name: 'BrokerConnectionSummary',
    description: 'Broker/account connection health summary with latency and selectable channels.',
    status: 'Ready',
    parameters: [
      { id: 'density', type: 'select', label: 'Density', description: 'Changes connection row spacing.', options: tradingDensityOptions },
      { id: 'variant', type: 'select', label: 'Variant', description: 'Changes surface treatment.', options: tradingSurfaceOptions },
      selectableParameter,
      {
        id: 'selectedId',
        type: 'select',
        label: 'Selected connection',
        description: 'Sets selected connection from code.',
        options: [
          { label: 'Account', value: 'account' },
          { label: 'Market data', value: 'market-data' },
          { label: 'Execution', value: 'execution' },
        ],
        visibleWhen: selectableVisibleWhen,
      },
    ],
    defaultParameters: {
      density: 'comfortable',
      selectable: true,
      selectedId: 'execution',
      variant: 'default',
    },
    renderPreview: (parameters) => (
      <BrokerConnectionSummaryExample
        density={parameters.density as TradingDensity}
        selectable={Boolean(parameters.selectable)}
        selectedId={String(parameters.selectedId ?? 'execution')}
        variant={parameters.variant as TradingSurfaceVariant}
      />
    ),
  },
  {
    id: 'loading-indicator',
    group: 'Feedback',
    name: 'LoadingIndicator',
    description: 'Indeterminate loading feedback with spinner, dots, and pulse variants.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Chooses the visual loading animation style.',
        options: [
          { label: 'Spinner', value: 'spinner' },
          { label: 'Dots', value: 'dots' },
          { label: 'Pulse', value: 'pulse' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes the indicator dimensions and stroke weight.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Maps the indicator color to theme semantic tokens.',
        options: [
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Negative', value: 'negative' },
          { label: 'Warning', value: 'warning' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
    ],
    defaultParameters: {
      size: 'comfortable',
      tone: 'accent',
      variant: 'spinner',
    },
    contentTitle: 'Loading Content',
    contentDescription: 'Optional label rendered beside the loading animation. Empty labels hide the text.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Visible status text shown beside the indicator.',
        placeholder: 'Syncing agents',
      },
    ],
    defaultContentValues: {
      label: 'Syncing agents',
    },
    renderPreview: (parameters, contentValues) => (
      <LoadingIndicatorExample
        label={String(contentValues.label ?? '')}
        size={parameters.size as LoadingIndicatorSize}
        tone={parameters.tone as LoadingIndicatorTone}
        variant={parameters.variant as LoadingIndicatorVariant}
      />
    ),
  },
  {
    id: 'progress-bar',
    group: 'Feedback',
    name: 'ProgressBar',
    description: 'Determinate and indeterminate progress display for loading or completion states.',
    status: 'Ready',
    parameters: [
      {
        id: 'mode',
        type: 'select',
        label: 'Mode',
        description: 'Determinate progress uses a value; indeterminate progress shows ongoing work.',
        options: [
          { label: 'Determinate', value: 'determinate' },
          { label: 'Indeterminate', value: 'indeterminate' },
        ],
      },
      {
        id: 'value',
        type: 'text',
        label: 'Code value',
        description: 'Sets the progress value from code.',
        placeholder: '64',
        visibleWhen: { parameterId: 'mode', value: 'determinate' },
      },
      {
        id: 'min',
        type: 'text',
        label: 'Minimum',
        description: 'Lowest progress value.',
        placeholder: '0',
        visibleWhen: { parameterId: 'mode', value: 'determinate' },
      },
      {
        id: 'max',
        type: 'text',
        label: 'Maximum',
        description: 'Highest progress value.',
        placeholder: '100',
        visibleWhen: { parameterId: 'mode', value: 'determinate' },
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated fill',
        description: 'Adds a subtle moving highlight inside the filled progress segment.',
        visibleWhen: { parameterId: 'mode', value: 'determinate' },
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes the track height.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Maps progress color to theme semantic tokens.',
        options: [
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Negative', value: 'negative' },
          { label: 'Warning', value: 'warning' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'showValue',
        type: 'boolean',
        label: 'Value label',
        description: 'Shows the current value or running state beside the label.',
      },
    ],
    defaultParameters: {
      max: '100',
      min: '0',
      mode: 'determinate',
      animated: true,
      showValue: true,
      size: 'comfortable',
      tone: 'accent',
      value: '64',
    },
    contentTitle: 'Progress Content',
    contentDescription: 'Optional label rendered above the progress track.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Text shown above the progress track.',
        placeholder: 'Strategy warmup',
      },
    ],
    defaultContentValues: {
      label: 'Strategy warmup',
    },
    renderPreview: (parameters, contentValues) => (
      <ProgressBarExample
        animated={Boolean(parameters.animated)}
        label={String(contentValues.label ?? '')}
        max={getNumberParameter(parameters.max, 100)}
        min={getNumberParameter(parameters.min, 0)}
        mode={parameters.mode as ProgressBarMode}
        showValue={Boolean(parameters.showValue)}
        size={parameters.size as ProgressBarSize}
        tone={parameters.tone as ProgressBarTone}
        value={getNumberParameter(parameters.value, 64)}
      />
    ),
  },
  {
    id: 'skeleton',
    group: 'Feedback',
    name: 'Skeleton',
    description: 'Placeholder loading surfaces for text, lists, and card-like content.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Chooses the placeholder layout pattern.',
        options: [
          { label: 'Text', value: 'text' },
          { label: 'List', value: 'list' },
          { label: 'Card', value: 'card' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Density',
        description: 'Changes line height, spacing, and placeholder rhythm.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'rows',
        type: 'text',
        label: 'Rows',
        description: 'Sets how many placeholder rows are generated.',
        placeholder: '3',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Enables the shimmer animation.',
      },
    ],
    defaultParameters: {
      animated: true,
      density: 'comfortable',
      rows: '3',
      variant: 'list',
    },
    renderPreview: (parameters) => (
      <SkeletonExample
        animated={Boolean(parameters.animated)}
        density={parameters.density as SkeletonDensity}
        rows={getNumberParameter(parameters.rows, 3)}
        variant={parameters.variant as SkeletonVariant}
      />
    ),
  },
  {
    id: 'status-badge',
    group: 'Feedback',
    name: 'StatusBadge',
    description: 'Compact state badge for online, watching, paused, error, and disabled states.',
    status: 'Ready',
    parameters: [
      {
        id: 'status',
        type: 'select',
        label: 'Status',
        description: 'Sets the semantic state from code.',
        options: [
          { label: 'Online', value: 'online' },
          { label: 'Watching', value: 'watching' },
          { label: 'Paused', value: 'paused' },
          { label: 'Error', value: 'error' },
          { label: 'Disabled', value: 'disabled' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the badge fill and border treatment.',
        options: [
          { label: 'Soft', value: 'soft' },
          { label: 'Solid', value: 'solid' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes badge height and inline padding.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showDot',
        type: 'boolean',
        label: 'Status dot',
        description: 'Shows the leading status dot.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated dot',
        description: 'Adds a subtle pulse to active online and watching dots.',
      },
    ],
    defaultParameters: {
      animated: true,
      showDot: true,
      size: 'comfortable',
      status: 'online',
      variant: 'soft',
    },
    contentTitle: 'Status Content',
    contentDescription: 'Optional label override. Empty labels fall back to the selected status text.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional visible text shown inside the badge.',
        placeholder: 'Online',
      },
    ],
    defaultContentValues: {
      label: '',
    },
    renderPreview: (parameters, contentValues) => (
      <StatusBadgeExample
        animated={Boolean(parameters.animated)}
        label={String(contentValues.label ?? '')}
        showDot={Boolean(parameters.showDot)}
        size={parameters.size as StatusBadgeSize}
        status={parameters.status as StatusBadgeStatus}
        variant={parameters.variant as StatusBadgeVariant}
      />
    ),
  },
  {
    id: 'delta-indicator',
    group: 'Feedback',
    name: 'DeltaIndicator',
    description: 'Positive, negative, or neutral movement display for trading values.',
    status: 'Ready',
    parameters: [
      {
        id: 'value',
        type: 'text',
        label: 'Code value',
        description: 'Sets the numeric delta from code.',
        placeholder: '2.48',
      },
      {
        id: 'direction',
        type: 'select',
        label: 'Direction',
        description: 'Auto reads the numeric value; manual directions can override the icon and tone.',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Up', value: 'up' },
          { label: 'Down', value: 'down' },
          { label: 'Flat', value: 'flat' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes how much surface treatment the delta receives.',
        options: [
          { label: 'Plain', value: 'plain' },
          { label: 'Pill', value: 'pill' },
          { label: 'Card', value: 'card' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes the indicator height and text scale.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'precision',
        type: 'text',
        label: 'Precision',
        description: 'Decimal places used when formatting the delta.',
        placeholder: '2',
      },
      {
        id: 'showIcon',
        type: 'boolean',
        label: 'Icon',
        description: 'Shows the directional icon.',
      },
      {
        id: 'showSign',
        type: 'boolean',
        label: 'Positive sign',
        description: 'Shows a plus sign for positive values.',
      },
    ],
    defaultParameters: {
      direction: 'auto',
      precision: '2',
      showIcon: true,
      showSign: true,
      size: 'comfortable',
      value: '2.48',
      variant: 'pill',
    },
    contentTitle: 'Delta Content',
    contentDescription: 'Label and unit displayed with the numeric delta.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional text shown above or beside the delta value.',
        placeholder: 'PnL today',
      },
      {
        id: 'unit',
        type: 'text',
        label: 'Unit',
        description: 'Suffix appended to the formatted value.',
        placeholder: '%',
      },
    ],
    defaultContentValues: {
      label: 'PnL today',
      unit: '%',
    },
    renderPreview: (parameters, contentValues) => (
      <DeltaIndicatorExample
        direction={parameters.direction as DeltaIndicatorDirection}
        label={String(contentValues.label ?? '')}
        precision={Math.round(getNumberParameter(parameters.precision, 2))}
        showIcon={Boolean(parameters.showIcon)}
        showSign={Boolean(parameters.showSign)}
        size={parameters.size as DeltaIndicatorSize}
        unit={String(contentValues.unit ?? '')}
        value={getNumberParameter(parameters.value, 2.48)}
        variant={parameters.variant as DeltaIndicatorVariant}
      />
    ),
  },
  {
    id: 'risk-indicator',
    group: 'Feedback',
    name: 'RiskIndicator',
    description: 'Severity indicator for low, medium, high, and critical risk states.',
    status: 'Ready',
    parameters: [
      {
        id: 'level',
        type: 'select',
        label: 'Level',
        description: 'Sets the risk level from code.',
        options: [
          { label: 'Low', value: 'low' },
          { label: 'Medium', value: 'medium' },
          { label: 'High', value: 'high' },
          { label: 'Critical', value: 'critical' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Chooses between a compact pill and stepped severity bars.',
        options: [
          { label: 'Pill', value: 'pill' },
          { label: 'Bars', value: 'bars' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes indicator height and text scale.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showScore',
        type: 'boolean',
        label: 'Score',
        description: 'Shows the optional numeric or textual score.',
      },
    ],
    defaultParameters: {
      level: 'medium',
      showScore: true,
      size: 'comfortable',
      variant: 'bars',
    },
    contentTitle: 'Risk Content',
    contentDescription: 'Optional label and score displayed beside the severity marker.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional visible text. Empty labels use the selected risk level.',
        placeholder: 'Exposure risk',
      },
      {
        id: 'score',
        type: 'text',
        label: 'Score',
        description: 'Optional value shown after the label.',
        placeholder: '64',
      },
    ],
    defaultContentValues: {
      label: '',
      score: '64',
    },
    renderPreview: (parameters, contentValues) => (
      <RiskIndicatorExample
        label={String(contentValues.label ?? '')}
        level={parameters.level as RiskIndicatorLevel}
        score={String(contentValues.score ?? '')}
        showScore={Boolean(parameters.showScore)}
        size={parameters.size as RiskIndicatorSize}
        variant={parameters.variant as RiskIndicatorVariant}
      />
    ),
  },
  {
    id: 'log-indicator',
    group: 'Feedback',
    name: 'LogIndicator',
    description: 'Single-line live log indicator with upward push and fade transitions.',
    status: 'Ready',
    parameters: [
      {
        id: 'lineIndex',
        type: 'select',
        label: 'Code line',
        description: 'Selects which sample log line is treated as the newest line from code.',
        options: [
          { label: 'First line (0)', value: '0' },
          { label: 'Second line (1)', value: '1' },
          { label: 'Third line (2)', value: '2' },
          { label: 'Fourth line (3)', value: '3' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes the log line height and text scale.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Maps the signal dot and surface color to theme tokens.',
        options: [
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Negative', value: 'negative' },
          { label: 'Warning', value: 'warning' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated line',
        description: 'Animates a new line entering from below while the previous line exits upward.',
      },
      {
        id: 'showTimestamp',
        type: 'boolean',
        label: 'Timestamp',
        description: 'Shows or hides the timestamp prefix.',
      },
    ],
    defaultParameters: {
      animated: true,
      lineIndex: '1',
      showTimestamp: true,
      size: 'comfortable',
      tone: 'accent',
    },
    contentTitle: 'Log Content',
    contentDescription: 'Edit the sample log lines. The selected code line becomes the newest visible line.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional small label shown above the log line.',
        placeholder: 'Runtime log',
      },
      {
        id: 'timestamp',
        type: 'text',
        label: 'Timestamp',
        description: 'Timestamp text shown before the log message.',
        placeholder: '14:08:12',
      },
      {
        id: 'lines',
        type: 'richtext',
        label: 'Lines',
        description: 'One log line per row. The selected line animates in as the current line.',
        placeholder: logIndicatorLinesExample,
        rows: 6,
      },
    ],
    defaultContentValues: {
      label: 'Runtime log',
      lines: logIndicatorLinesExample,
      timestamp: '14:08:12',
    },
    renderPreview: (parameters, contentValues) => (
      <LogIndicatorExample
        animated={Boolean(parameters.animated)}
        label={String(contentValues.label ?? '')}
        lineIndex={getIndexParameter(parameters.lineIndex)}
        lineSource={String(contentValues.lines ?? '')}
        showTimestamp={Boolean(parameters.showTimestamp)}
        size={parameters.size as LogIndicatorSize}
        timestamp={String(contentValues.timestamp ?? '')}
        tone={parameters.tone as LogIndicatorTone}
      />
    ),
  },
  {
    id: 'connection-indicator',
    group: 'Feedback',
    name: 'ConnectionIndicator',
    description: 'Connectivity status for live, delayed, reconnecting, offline, and error states.',
    status: 'Ready',
    parameters: [
      {
        id: 'status',
        type: 'select',
        label: 'Status',
        description: 'Sets the connection state from code.',
        options: [
          { label: 'Live', value: 'live' },
          { label: 'Delayed', value: 'delayed' },
          { label: 'Reconnecting', value: 'reconnecting' },
          { label: 'Offline', value: 'offline' },
          { label: 'Error', value: 'error' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the amount of surface treatment.',
        options: [
          { label: 'Inline', value: 'inline' },
          { label: 'Pill', value: 'pill' },
          { label: 'Card', value: 'card' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes height, spacing, and type scale.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showSignal',
        type: 'boolean',
        label: 'Signal bars',
        description: 'Shows the leading connection strength bars.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Animates reconnecting and live signal states.',
      },
    ],
    defaultParameters: {
      animated: true,
      showSignal: true,
      size: 'comfortable',
      status: 'live',
      variant: 'pill',
    },
    contentTitle: 'Connection Content',
    contentDescription: 'Optional label and detail text. Empty labels fall back to the selected status.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional visible label override.',
        placeholder: 'Live',
      },
      {
        id: 'detail',
        type: 'text',
        label: 'Detail',
        description: 'Secondary text shown under or beside the status.',
        placeholder: 'Market data feed',
      },
    ],
    defaultContentValues: {
      detail: 'Market data feed',
      label: '',
    },
    renderPreview: (parameters, contentValues) => (
      <ConnectionIndicatorExample
        animated={Boolean(parameters.animated)}
        detail={String(contentValues.detail ?? '')}
        label={String(contentValues.label ?? '')}
        showSignal={Boolean(parameters.showSignal)}
        size={parameters.size as ConnectionIndicatorSize}
        status={parameters.status as ConnectionIndicatorStatus}
        variant={parameters.variant as ConnectionIndicatorVariant}
      />
    ),
  },
  {
    id: 'health-meter',
    group: 'Feedback',
    name: 'HealthMeter',
    description: 'Compact health score meter with automatic positive, warning, and negative tones.',
    status: 'Ready',
    parameters: [
      {
        id: 'value',
        type: 'text',
        label: 'Code value',
        description: 'Sets the health percent from code.',
        placeholder: '78',
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Chooses between segmented bars and a continuous meter.',
        options: [
          { label: 'Bars', value: 'bars' },
          { label: 'Meter', value: 'meter' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes meter width, height, and label scale.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Auto maps the value to health colors, or you can force a theme tone.',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Warning', value: 'warning' },
          { label: 'Negative', value: 'negative' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'segments',
        type: 'text',
        label: 'Segments',
        description: 'Number of bars used in the segmented variant.',
        placeholder: '5',
        visibleWhen: { parameterId: 'variant', value: 'bars' },
      },
      {
        id: 'showValue',
        type: 'boolean',
        label: 'Value label',
        description: 'Shows the percentage label.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated fill',
        description: 'Animates bars or meter fill changes.',
      },
    ],
    defaultParameters: {
      animated: true,
      segments: '5',
      showValue: true,
      size: 'comfortable',
      tone: 'auto',
      value: '78',
      variant: 'bars',
    },
    contentTitle: 'Health Content',
    contentDescription: 'Optional label displayed above the health visualization.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Visible metric label.',
        placeholder: 'System health',
      },
    ],
    defaultContentValues: {
      label: 'System health',
    },
    renderPreview: (parameters, contentValues) => (
      <HealthMeterExample
        animated={Boolean(parameters.animated)}
        label={String(contentValues.label ?? '')}
        segments={Math.round(getNumberParameter(parameters.segments, 5))}
        showValue={Boolean(parameters.showValue)}
        size={parameters.size as HealthMeterSize}
        tone={parameters.tone as HealthMeterTone}
        value={getNumberParameter(parameters.value, 78)}
        variant={parameters.variant as HealthMeterVariant}
      />
    ),
  },
  {
    id: 'signal-strength',
    group: 'Feedback',
    name: 'SignalStrength',
    description: 'Signal quality indicator with bars or dots for weak through maximum signal levels.',
    status: 'Ready',
    parameters: [
      {
        id: 'level',
        type: 'select',
        label: 'Level',
        description: 'Sets the signal level from code.',
        options: [
          { label: 'None', value: 'none' },
          { label: 'Weak', value: 'weak' },
          { label: 'Medium', value: 'medium' },
          { label: 'Strong', value: 'strong' },
          { label: 'Maximum', value: 'max' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Switches the visual marker style.',
        options: [
          { label: 'Bars', value: 'bars' },
          { label: 'Dots', value: 'dots' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes marker size and text scale.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showLabel',
        type: 'boolean',
        label: 'Label',
        description: 'Shows the signal label beside the marker.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated',
        description: 'Animates active signal segments when the level changes.',
      },
    ],
    defaultParameters: {
      animated: true,
      level: 'strong',
      showLabel: true,
      size: 'comfortable',
      variant: 'bars',
    },
    contentTitle: 'Signal Content',
    contentDescription: 'Optional label override. Empty labels fall back to the selected signal level.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional visible label override.',
        placeholder: 'Strong signal',
      },
    ],
    defaultContentValues: {
      label: '',
    },
    renderPreview: (parameters, contentValues) => (
      <SignalStrengthExample
        animated={Boolean(parameters.animated)}
        label={String(contentValues.label ?? '')}
        level={parameters.level as SignalStrengthLevel}
        showLabel={Boolean(parameters.showLabel)}
        size={parameters.size as SignalStrengthSize}
        variant={parameters.variant as SignalStrengthVariant}
      />
    ),
  },
  {
    id: 'trend-spark-indicator',
    group: 'Feedback',
    name: 'TrendSparkIndicator',
    description: 'Tiny sparkline indicator for compact positive, negative, or flat trend context.',
    status: 'Ready',
    parameters: [
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Shows a line-only sparkline or a softly filled area.',
        options: [
          { label: 'Line', value: 'line' },
          { label: 'Area', value: 'area' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes sparkline width and height.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Auto uses the first and last values to choose positive, negative, or neutral.',
        options: [
          { label: 'Auto', value: 'auto' },
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Negative', value: 'negative' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'showValue',
        type: 'boolean',
        label: 'Latest value',
        description: 'Shows the latest value beside the label.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated line',
        description: 'Draws the sparkline in when values change.',
      },
    ],
    defaultParameters: {
      animated: true,
      showValue: true,
      size: 'comfortable',
      tone: 'auto',
      variant: 'area',
    },
    contentTitle: 'Trend Content',
    contentDescription: 'Edit the label, display value, and numeric source values for the sparkline.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Visible metric label.',
        placeholder: 'Signal score',
      },
      {
        id: 'valueLabel',
        type: 'text',
        label: 'Value label',
        description: 'Optional display value. Empty labels use the latest numeric source value.',
        placeholder: '24',
      },
      {
        id: 'values',
        type: 'richtext',
        label: 'Values',
        description: 'Comma, space, or line separated numbers used to draw the sparkline.',
        placeholder: trendSparkValuesExample,
        rows: 4,
      },
    ],
    defaultContentValues: {
      label: 'Signal score',
      valueLabel: '',
      values: trendSparkValuesExample,
    },
    renderPreview: (parameters, contentValues) => (
      <TrendSparkIndicatorExample
        animated={Boolean(parameters.animated)}
        label={String(contentValues.label ?? '')}
        showValue={Boolean(parameters.showValue)}
        size={parameters.size as TrendSparkIndicatorSize}
        tone={parameters.tone as TrendSparkIndicatorTone}
        valueLabel={String(contentValues.valueLabel ?? '')}
        valueSource={String(contentValues.values ?? '')}
        variant={parameters.variant as TrendSparkIndicatorVariant}
      />
    ),
  },
  {
    id: 'count-badge',
    group: 'Feedback',
    name: 'CountBadge',
    description: 'Notification count badge with caps, zero visibility, semantic tones, and subtle pulse animation.',
    status: 'Ready',
    parameters: [
      {
        id: 'count',
        type: 'text',
        label: 'Code count',
        description: 'Sets the current count from code.',
        placeholder: '12',
      },
      {
        id: 'max',
        type: 'text',
        label: 'Maximum',
        description: 'Counts above this value render as max plus.',
        placeholder: '99',
      },
      {
        id: 'tone',
        type: 'select',
        label: 'Tone',
        description: 'Maps the badge color to a theme token.',
        options: [
          { label: 'Accent', value: 'accent' },
          { label: 'Positive', value: 'positive' },
          { label: 'Negative', value: 'negative' },
          { label: 'Warning', value: 'warning' },
          { label: 'Neutral', value: 'neutral' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes badge fill and border treatment.',
        options: [
          { label: 'Soft', value: 'soft' },
          { label: 'Solid', value: 'solid' },
          { label: 'Outline', value: 'outline' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes badge height and inline padding.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showZero',
        type: 'boolean',
        label: 'Show zero',
        description: 'Keeps the badge visible when the count is zero.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Pulse',
        description: 'Adds a subtle pulse for changing counts.',
      },
    ],
    defaultParameters: {
      animated: true,
      count: '12',
      max: '99',
      showZero: false,
      size: 'comfortable',
      tone: 'warning',
      variant: 'soft',
    },
    contentTitle: 'Badge Content',
    contentDescription: 'Optional label rendered before the count. Empty labels show only the number.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional text shown before the badge count.',
        placeholder: 'Alerts',
      },
    ],
    defaultContentValues: {
      label: 'Alerts',
    },
    renderPreview: (parameters, contentValues) => (
      <CountBadgeExample
        animated={Boolean(parameters.animated)}
        count={getNumberParameter(parameters.count, 12)}
        label={String(contentValues.label ?? '')}
        max={getNumberParameter(parameters.max, 99)}
        showZero={Boolean(parameters.showZero)}
        size={parameters.size as CountBadgeSize}
        tone={parameters.tone as CountBadgeTone}
        variant={parameters.variant as CountBadgeVariant}
      />
    ),
  },
  {
    id: 'freshness-indicator',
    group: 'Feedback',
    name: 'FreshnessIndicator',
    description: 'Data freshness marker for live, fresh, stale, and expired update states.',
    status: 'Ready',
    parameters: [
      {
        id: 'state',
        type: 'select',
        label: 'State',
        description: 'Sets the data freshness state from code.',
        options: [
          { label: 'Live', value: 'live' },
          { label: 'Fresh', value: 'fresh' },
          { label: 'Stale', value: 'stale' },
          { label: 'Expired', value: 'expired' },
        ],
      },
      {
        id: 'variant',
        type: 'select',
        label: 'Variant',
        description: 'Changes the amount of surface treatment.',
        options: [
          { label: 'Inline', value: 'inline' },
          { label: 'Pill', value: 'pill' },
          { label: 'Card', value: 'card' },
        ],
      },
      {
        id: 'size',
        type: 'select',
        label: 'Size',
        description: 'Changes height, spacing, and type scale.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'showDot',
        type: 'boolean',
        label: 'Status dot',
        description: 'Shows the leading freshness dot.',
      },
      {
        id: 'animated',
        type: 'boolean',
        label: 'Animated dot',
        description: 'Adds a pulse to live and fresh states.',
      },
    ],
    defaultParameters: {
      animated: true,
      showDot: true,
      size: 'comfortable',
      state: 'fresh',
      variant: 'pill',
    },
    contentTitle: 'Freshness Content',
    contentDescription: 'Optional label and age text. Empty labels fall back to the selected state.',
    contentControls: [
      {
        id: 'label',
        type: 'text',
        label: 'Label',
        description: 'Optional visible label override.',
        placeholder: 'Quotes',
      },
      {
        id: 'age',
        type: 'text',
        label: 'Age',
        description: 'Age text shown beside the freshness label.',
        placeholder: '5s',
      },
    ],
    defaultContentValues: {
      age: '5s',
      label: 'Quotes',
    },
    renderPreview: (parameters, contentValues) => (
      <FreshnessIndicatorExample
        age={String(contentValues.age ?? '')}
        animated={Boolean(parameters.animated)}
        label={String(contentValues.label ?? '')}
        showDot={Boolean(parameters.showDot)}
        size={parameters.size as FreshnessIndicatorSize}
        state={parameters.state as FreshnessIndicatorState}
        variant={parameters.variant as FreshnessIndicatorVariant}
      />
    ),
  },
  {
    id: 'list-view',
    group: 'Lists',
    name: 'ListView',
    description: 'Selectable rows for compact navigation, status lists, and component catalogs.',
    status: 'Ready',
    parameters: [
      {
        id: 'scenario',
        type: 'select',
        label: 'Scenario',
        description: 'Switches between focused edge-case data sets for interaction QA.',
        options: [
          { label: 'Sticky selected group', value: 'sticky-selected-group' },
          { label: 'Collapsed selected group', value: 'collapsed-selected-group' },
          { label: 'Many rows', value: 'many-items' },
          { label: 'Long labels', value: 'long-labels' },
          { label: 'Disabled rows', value: 'disabled-items' },
          { label: 'Empty state', value: 'empty-state' },
          { label: 'Default rows', value: 'default' },
        ],
      },
      {
        id: 'density',
        type: 'select',
        label: 'Size',
        description: 'Changes row height and spacing across every rendered row.',
        options: [
          { label: 'Compact', value: 'compact' },
          { label: 'Comfortable', value: 'comfortable' },
          { label: 'Spacious', value: 'spacious' },
        ],
      },
      {
        id: 'contentMode',
        type: 'select',
        label: 'Content',
        description: 'Chooses whether rows show only a title, supporting text, or full metadata.',
        options: [
          { label: 'Title only', value: 'title' },
          { label: 'Summary', value: 'summary' },
          { label: 'Full metadata', value: 'full' },
        ],
      },
      {
        id: 'renderer',
        type: 'select',
        label: 'Renderer',
        description: 'Switches between default text slots and a custom JSX row renderer.',
        options: [
          { label: 'Default text', value: 'default' },
          { label: 'Rich component', value: 'rich' },
        ],
      },
      {
        id: 'showIndicators',
        type: 'boolean',
        label: 'Color indicator',
        description: 'Shows or hides the left status stripe on every row.',
      },
      {
        id: 'enableFiltering',
        type: 'boolean',
        label: 'Filtering',
        description: 'Shows filter controls driven by item attributes.',
      },
      {
        id: 'enableGrouping',
        type: 'boolean',
        label: 'Grouping',
        description: 'Groups matching items into collapsible sections driven by an item attribute.',
      },
      {
        id: 'groupAttribute',
        type: 'select',
        label: 'Group attribute',
        description: 'Chooses which item attribute creates the collapsible groups.',
        options: [
          { label: 'Importance', value: 'importance' },
          { label: 'Title', value: 'title' },
        ],
        visibleWhen: { parameterId: 'enableGrouping', value: true },
      },
      {
        id: 'importanceFilter',
        type: 'select',
        label: 'Importance filter',
        description: 'Sets the initial importance filter from code; the preview filter control can still change it.',
        options: [
          { label: 'All', value: 'all' },
          { label: 'High', value: 'high' },
          { label: 'Mid', value: 'mid' },
          { label: 'Low', value: 'low' },
          { label: 'High + Mid', value: 'high-mid' },
        ],
        visibleWhen: { parameterId: 'enableFiltering', value: true },
      },
      {
        id: 'enableOrdering',
        type: 'boolean',
        label: 'Ordering',
        description: 'Shows ordering controls driven by item attributes.',
      },
      {
        id: 'enableSearch',
        type: 'boolean',
        label: 'Search',
        description: 'Shows a search field that filters rows by text and attributes.',
      },
      {
        id: 'orderAttribute',
        type: 'select',
        label: 'Order attribute',
        description: 'Sets the initial ordering attribute from code; the preview order control can still change it.',
        options: [
          { label: 'Default', value: 'default' },
          { label: 'Importance', value: 'importance' },
          { label: 'Title', value: 'title' },
        ],
        visibleWhen: { parameterId: 'enableOrdering', value: true },
      },
      {
        id: 'orderDirection',
        type: 'select',
        label: 'Order direction',
        description: 'Chooses ascending or descending order for the selected attribute.',
        options: [
          { label: 'Ascending', value: 'asc' },
          { label: 'Descending', value: 'desc' },
        ],
        visibleWhen: { parameterId: 'enableOrdering', value: true },
      },
      {
        id: 'selectedIndex',
        type: 'select',
        label: 'Selected row',
        description: 'Controls the selected item from code using the zero-based item index.',
        options: [
          { label: 'First item (0)', value: '0' },
          { label: 'Second item (1)', value: '1' },
          { label: 'Third item (2)', value: '2' },
          { label: 'Later selected group (9)', value: '9' },
          { label: 'Later group row (12)', value: '12' },
          { label: 'Final row (14)', value: '14' },
        ],
      },
      {
        id: 'verticalAlign',
        type: 'select',
        label: 'Vertical align',
        description: 'Places the grouped rows at the top, center, or bottom of the available list area.',
        options: [
          { label: 'Top', value: 'top' },
          { label: 'Center', value: 'center' },
          { label: 'Bottom', value: 'bottom' },
        ],
      },
    ],
    defaultParameters: {
      contentMode: 'full',
      density: 'comfortable',
      enableFiltering: false,
      enableGrouping: true,
      enableOrdering: false,
      enableSearch: true,
      groupAttribute: 'importance',
      importanceFilter: 'all',
      orderAttribute: 'default',
      orderDirection: 'asc',
      renderer: 'default',
      scenario: 'sticky-selected-group',
      selectedIndex: '9',
      showIndicators: true,
      verticalAlign: 'top',
    },
    contentControls: [
      {
        id: 'firstItemTitle',
        type: 'text',
        label: 'Title',
        description: 'Primary text for the first row.',
        placeholder: 'Strategy engine',
        visibleWhen: { parameterId: 'renderer', value: 'default' },
      },
      {
        id: 'firstItemEyebrow',
        type: 'text',
        label: 'Eyebrow',
        description: 'Optional label shown above the title in full mode.',
        placeholder: 'Runtime',
        visibleWhen: { parameterId: 'renderer', value: 'default' },
      },
      {
        id: 'firstItemDescription',
        type: 'text',
        label: 'Description',
        description: 'Optional supporting text for summary and full modes.',
        placeholder: 'Signal evaluation and ranking are active.',
        visibleWhen: { parameterId: 'renderer', value: 'default' },
      },
      {
        id: 'firstItemMeta',
        type: 'text',
        label: 'Trailing label',
        description: 'Optional label rendered on the right side of the row.',
        placeholder: 'Online',
        visibleWhen: { parameterId: 'renderer', value: 'default' },
      },
      {
        id: 'firstItemRichText',
        type: 'richtext',
        label: 'Rich text',
        description: 'Rendered as sanitized HTML for the first row. Use var(--list-view-indicator-color) to match the indicator.',
        placeholder: listViewRichHtmlExample,
        rows: 12,
        visibleWhen: { parameterId: 'renderer', value: 'rich' },
      },
      {
        id: 'firstItemIndicatorColor',
        type: 'color',
        label: 'Indicator color',
        description: 'Overrides the first row status stripe without changing the theme. Leave empty to follow the theme.',
        defaultValue: '#05d671',
      },
    ],
    defaultContentValues: {
      firstItemDescription: 'Signal evaluation and ranking are active.',
      firstItemEyebrow: 'Runtime',
      firstItemIndicatorColor: '',
      firstItemMeta: 'Online',
      firstItemRichText: listViewRichHtmlExample,
      firstItemTitle: 'Strategy engine',
    },
    renderPreview: (parameters, contentValues) => (
      <ListViewExample
        contentMode={parameters.contentMode as ListViewContentMode}
        density={parameters.density as ListViewDensity}
        enableFiltering={Boolean(parameters.enableFiltering)}
        enableGrouping={Boolean(parameters.enableGrouping)}
        enableOrdering={Boolean(parameters.enableOrdering)}
        enableSearch={Boolean(parameters.enableSearch)}
        firstItemContent={{
          description: String(contentValues.firstItemDescription ?? ''),
          eyebrow: String(contentValues.firstItemEyebrow ?? ''),
          indicatorColor: String(contentValues.firstItemIndicatorColor ?? ''),
          meta: String(contentValues.firstItemMeta ?? ''),
          richText: typeof contentValues.firstItemRichText === 'string' ? contentValues.firstItemRichText : undefined,
          title: String(contentValues.firstItemTitle ?? ''),
        }}
        groupAttribute={parameters.groupAttribute as ListViewGroupAttribute}
        importanceFilter={parameters.importanceFilter as ListViewImportanceFilter}
        orderAttribute={String(parameters.orderAttribute ?? 'default')}
        orderDirection={parameters.orderDirection as ListViewOrderDirection}
        renderer={parameters.renderer as ListViewRendererMode}
        scenario={parameters.scenario as ListViewScenario}
        selectedIndex={getIndexParameter(parameters.selectedIndex)}
        showIndicators={Boolean(parameters.showIndicators)}
        verticalAlign={parameters.verticalAlign as ListViewVerticalAlign}
      />
    ),
  },
];
