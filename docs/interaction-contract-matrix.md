# Interaction Contract Matrix

This matrix defines the shared interaction language for component props and preview QA.

## Naming Rules

- `selectable`: enables manual selection through click, tap, and keyboard activation. It must not hide a selected or current item that was supplied by code.
- `selected*`: controlled selected/current display state. Domain-specific names such as `selectedNodeId`, `selectedRowIndex`, `selectedSymbol`, and `selectedPrice` are equivalent to `selectedId` for their data shape.
- `defaultSelected*`: uncontrolled initial selection. Only components that own internal selection state expose this.
- `onSelectionChange`: normalized callback alias for new and updated selectable components. Domain-specific callbacks may remain as backward-compatible aliases.
- `interactive`: hover/click affordance that is not necessarily selection. Do not use it as a synonym for `selectable`.
- `disabled`: blocks manual mutation. Disabled state must not block programmatic props from rendering current, selected, pressed, active, or value state.
- `current` and `active`: progress or runtime state unless a component explicitly maps it to selected display state.

## Selection-Bearing Components

| Components | selectable | selected/current prop | default selected prop | onSelectionChange equivalent | Keyboard support | Disabled behavior | Programmatic selection |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `ListView` | `selectable`, default `true` | `selectedId`, `selectedIndex` | `defaultSelectedId`, `defaultSelectedIndex` | `onSelectionChange(selectedId, item, index)`, legacy `onSelect(item, index)` | Native button keyboard | `selectable=false` removes manual focus/click; `item.disabled` uses native disabled button | Yes; selected row and selected group stay styled |
| `DataTable` | `selectable`, default `true` | `selectedRowId`, `selectedRowIndex` | `defaultSelectedRowId`, `defaultSelectedRowIndex` | `onSelectionChange(rowId, row, rowIndex)`, legacy `onSelectedRowChange(rowIndex, row)` | Row `Enter` / `Space` | `selectable=false` removes row focus and click; `row.disabled` blocks one row | Yes; selected row stays styled even when manual selection is off |
| `PropertyList` | `selectable`, default `false` | `selectedId`, `selectedIndex` | `defaultSelectedId`, `defaultSelectedIndex` | `onSelectionChange(selectedId, item, itemIndex)`, legacy `onSelectedItemChange(itemIndex, item)` | Native button keyboard | `selectable=false` disables property buttons | Yes; selected item stays styled while buttons are disabled |
| `Timeline`, `ActivityFeed` | `selectable`, default `true` | `selectedId` | None | `onItemSelect(itemId, item)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected/current item stays styled |
| `WorkflowStepper` | `selectable`, default `true` | `selectedStepId` | None | `onStepSelect(stepId, step)` | Native button keyboard | `selectable=false` removes focus/click | Yes; current step stays styled |
| `RunQueue` | `selectable`, default `true` | `selectedId` | None | `onItemSelect(itemId, item)` | `Enter` / `Space` | `selectable=false` removes listbox selection; action buttons keep their own disabled flags | Yes; selected queue item stays styled |
| `ExecutionTimeline` | `selectable`, default `true` | `selectedPhaseId` | None | `onPhaseSelect(phaseId, phase)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected/current phase stays styled |
| `AuditTrail` | `selectable`, default `true` | `selectedEntryId` | None | `onEntrySelect(entryId, entry)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected entry stays styled |
| `WorkflowDependencyGraph` | `selectable`, default `true` | `selectedNodeId` | None | `onNodeSelect(nodeId, node)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected graph node stays styled |
| `DatasetSummary` | `selectable`, default `true` | `selectedMetricId` | Internal first metric | `onMetricSelect(metricId, metric)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected metric stays styled |
| `FieldProfile` | `selectable`, default `true` | `selectedBucketIndex` | Internal first bucket | `onBucketSelect(bucketIndex, bucket)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected bucket stays styled |
| `QueryResultPanel` | `selectable`, default `true` | `selectedRowIndex` | Internal first row | `onSelectedRowChange(rowIndex, row)` | Delegated to `DataTable` | Delegated to `DataTable` | Yes; selected row stays styled |
| `DataQualityPanel` | `selectable`, default `true` | `selectedCheckId` | Internal first check | `onCheckSelect(checkId, check)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected check stays styled |
| `SchemaExplorer` | `selectable`, default `true` | `selectedTableId`, `selectedFieldId` | Active table falls back to first table | `onTableSelect`, `onFieldSelect` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected table and field stay styled |
| `LineageTrace` | `selectable`, default `true` | `selectedNodeId` | None | `onNodeSelect(nodeId, node)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected lineage node stays styled |
| `Watchlist`, `MarketTicker` | `selectable`, default `true` | `selectedSymbol` | Internal first quote | `onSelectedSymbolChange(symbol)` | Native button or explicit `Enter` / `Space` | `selectable=false` removes focus/click | Yes; selected symbol stays styled |
| `PositionsTable` | `selectable`, default `true` | `selectedSymbol` | Internal first matching row through `DataTable` | `onSelectedSymbolChange(symbol)` | Delegated to `DataTable` | Delegated to `DataTable` | Yes; selected symbol row stays styled |
| `TradeBlotter` | `selectable`, default `true` | `selectedIndex` | None | `onSelectedOrderChange(orderIndex, order)` | Delegated to `DataTable` | Delegated to `DataTable` | Yes; selected order row stays styled |
| `OrderBookLadder` | `selectable`, default `true` | `selectedPrice` | None | `onPriceSelect(price, side)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected price level stays styled |
| `AllocationBreakdown` | `selectable`, default `true` | `selectedId` | None | `onAllocationSelect(allocationId, allocation)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected allocation stays styled |
| `BrokerConnectionSummary` | `selectable`, default `true` | `selectedId` | None | `onConnectionSelect(connectionId, connection)` | Native button keyboard | `selectable=false` removes focus/click | Yes; selected channel stays styled |
| `SidebarNav` | No `selectable`; navigation is always selectable | `selectedId` | Internal first item | `onSelectedIdChange(itemId)` | Native button keyboard | `item.disabled` blocks selection | Yes |
| `TopBar`, `PageHeader` | No `selectable`; actions are buttons | `selectedActionId` on `TopBar`, `action.active` on both | None | `onActionSelect(actionId)` | Native button keyboard | `action.disabled` blocks action | Yes |
| `Tabs` | No `selectable`; tabs are always navigable | `value` | `defaultValue` | `onValueChange(value, item)` | Tab keyboard handling | `item.disabled` blocks tab change | Yes |
| `Accordion` | No `selectable`; open state is disclosure state | `openIds` | `defaultOpenIds` | `onOpenIdsChange(openIds, item)` | Native button keyboard | `item.disabled` blocks toggle | Yes |
| `ColumnExplorer` | No `selectable`; explorer items are selectable | `selectedPath` | `defaultSelectedPath` | `onSelectedPathChange(path, item)` | Optional `keyboardNavigation`, typeahead | `item.disabled` blocks selection | Yes |
| `TreeView` | No `selectable`; tree items are selectable | `selectedId`, `expandedIds` | `defaultSelectedId`, `defaultExpandedIds` | `onSelect(item)`, `onExpandedIdsChange(expandedIds)` | Tree keyboard behavior | `item.disabled` blocks selection | Yes |
| `CommandMenu` | No `selectable`; filtered commands are selectable | Query via `query`; highlighted result is internal | `defaultQuery` | `onSelect(item)`, `onQueryChange(query)` | Command input and item keyboard behavior | `item.disabled` blocks selection | Query is programmable; active result is internal |
| `ContextMenu` | No `selectable`; menu items are selectable | `selectedId`, `open` | `defaultOpen` | `onSelect(item)`, `onOpenChange(open)` | Menu trigger/item keyboard behavior | `item.disabled` blocks selection | Yes |
| `NodePalette` | No `selectable`; templates are selectable | `selectedTemplateId`, `query` | `defaultSelectedTemplateId`, `defaultQuery` | `onSelectedTemplateChange(templateId, template)`, `onQueryChange(query)` | Search/list keyboard behavior | `template.disabled` blocks selection | Yes |
| `NodeMiniMap` | `interactive`, not `selectable` | `selectedNodeId`, node/edge `selected` flags | None | `onNodeSelect(nodeId, node)`, `onViewportMove(viewport)` | Pointer-first minimap | `node.disabled` blocks node select | Yes |
| `Node`, `NodeEdge`, `NodePort` | Display/port interaction props only | `selected` on `Node` and `NodeEdge` | None | Port pointer callbacks on `Node` | Pointer-first canvas primitives | `disabled` on node/port blocks affordance | Yes for visual selected state |

## Form And Value Components

These components use value/checked/open props rather than selection props. Their interaction contract is `disabled` blocks manual mutation while controlled props still render.

| Components | Controlled prop | Default prop | Change callback | Keyboard support | Disabled behavior |
| --- | --- | --- | --- | --- | --- |
| `Button` | `pressed` for toggle mode | Internal toggle state | `onPressedChange` plus native `onClick` | Native button keyboard | Native `disabled` |
| `Checkbox` | `checked` | Native default behavior | `onCheckedChange` | Native checkbox keyboard | Native `disabled` |
| `TextInput`, `NumberInput`, `SearchInput`, `TextArea`, `ColorInput`, `Slider` | `value` | Native/default component value | `onValueChange` | Native field keyboard | Native `disabled` |
| `Dropdown`, `OptionPicker`, `TagPicker`, `DatePicker`, `TimePicker`, `DateRangePicker`, `DateTimePicker`, `FilePicker` | Component-specific value or selected index | Component-specific defaults | `onChange` / value callbacks | Native/custom picker keyboard | `disabled` blocks picker mutation |
| `SplitPane`, `ResizablePanel` | `splitPercent`, `size` | `defaultSplitPercent`, `defaultSize` | `onSplitPercentChange`, `onSizeChange` | Pointer resize handles | `resizable=false` disables manual resizing |
| `Modal`, `Popover`, `Drawer`, `Toast` | `open` / visibility props | `defaultOpen` where available | `onOpenChange` or action callbacks | Dialog/popover keyboard behavior | Confirmation/action buttons own disabled behavior |

## Display-Only Or State-Display Components

These components do not own selection. Any `selected`, `active`, `current`, or status prop is a visual state supplied by code.

- Layout/surfaces: `AppShell`, `Panel`, `Card`, `Section`, `Divider`, `Toolbar`, `EmptyState`, `FormField`, `FormGroup`, `FormActions`, `ValidationSummary`, `StatusBar`.
- Content/editor display: `TextOutput`, `MarkdownViewer`, `RichTextViewer`, `CodeEditor`.
- Node canvas/display: `NodeCanvas`, `NodeWorkspaceMock`, `NodeToolbar`, `NodeInspector`.
- Data display: `MetricCard`, `Tag`, `PivotSummary`, `JoinPreview`.
- Charts: `TimeSeriesChart`, `CandlestickChart`, `VolumeBars`, `DepthChart`, `EquityCurve`, `CorrelationHeatmap`.
- Trading displays: `PriceDisplay`, `PnLDisplay`, `OrderStatus`, `MarketStateBadge`, `LatencyIndicator`, `PositionSummary`, `OrderTicket`, `StrategyCard`, `RiskLimitPanel`, `QuoteTile`.
- Feedback: `LoadingIndicator`, `ProgressBar`, `Skeleton`, `StatusBadge`, `DeltaIndicator`, `RiskIndicator`, `LogIndicator`, `ConnectionIndicator`, `HealthMeter`, `SignalStrength`, `TrendSparkIndicator`, `CountBadge`, `FreshnessIndicator`, `Tooltip`.
- Navigation displays without selection state: `Breadcrumb`.

## Preview Harness Edge Cases

The preview harness uses per-component `scenario` controls where the edge case materially changes component behavior.

- `ListView`: default rows, sticky selected group, collapsed selected group, many rows, long labels, disabled rows, empty state.
- `DataTable`: default rows, empty state, long labels, many rows, disabled rows.
- `PropertyList`: default items, empty state, long labels, many items.

Add future scenario controls only when static props cannot already cover the edge case. Prefer names that describe data shape (`empty-state`, `long-labels`, `many-items`, `disabled-rows`) rather than implementation detail.
