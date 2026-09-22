import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import test from 'node:test';

const root = resolve(import.meta.dirname, '..');

function readSource(relativePath) {
  return readFileSync(resolve(root, relativePath), 'utf8');
}

function assertContains(source, pattern, message) {
  assert.match(source, pattern, message);
}

function assertNotContains(source, pattern, message) {
  assert.doesNotMatch(source, pattern, message);
}

test('ListView supports controlled list selection and disabled row behavior', () => {
  const types = readSource('src/components/lists/ListView/ListView.types.ts');
  const source = readSource('src/components/lists/ListView/ListView.tsx');

  assertContains(types, /selectable\?: boolean;/, 'ListView exposes selectable to disable manual selection.');
  assertContains(types, /selectedId\?: string;/, 'ListView exposes selectedId for controlled selection by id.');
  assertContains(types, /defaultSelectedId\?: string;/, 'ListView exposes defaultSelectedId for uncontrolled selection by id.');
  assertContains(types, /selectedIndex\?: number;/, 'ListView exposes selectedIndex for controlled selection by index.');
  assertContains(types, /defaultSelectedIndex\?: number;/, 'ListView exposes defaultSelectedIndex for uncontrolled selection by index.');
  assertContains(types, /enableSearch\?: boolean;/, 'ListView exposes a flag for built-in search controls.');
  assertContains(types, /searchPlaceholder\?: string;/, 'ListView exposes configurable search placeholder copy.');
  assertContains(types, /onSearchChange\?: \(searchValue: string\) => void;/, 'ListView exposes search value changes.');
  assertContains(source, /useDeferredValue\(activeSearchValue\)/, 'ListView defers search filtering so typing stays responsive.');
  assertContains(source, /function itemMatchesSearch/, 'ListView has built-in item text search.');
  assertContains(source, /<SearchInput[\s\S]*ariaLabel=\{`Search \$\{ariaLabel\}`\}/, 'ListView renders the shared SearchInput when search is enabled.');
  assertContains(types, /onSelectionChange\?: \(selectedId: string, item: ListViewItem, index: number\) => void;/, 'ListView exposes normalized selection callback alias.');
  assertContains(types, /onSelect\?: \(item: ListViewItem, index: number\) => void;/, 'ListView reports selected item and displayed index.');
  assertContains(source, /disabled=\{item\.disabled\}/, 'Disabled ListView items use native button disabled behavior.');
  assertContains(source, /if \(!selectable \|\| item\.disabled\) \{[\s\S]*return;[\s\S]*\}/, 'ListView guards manual selection behind selectable and item disabled.');
  assertContains(source, /onSelectionChange\?\.\(item\.id, item, index\)/, 'ListView row clicks call the normalized selection callback.');
  assertContains(source, /onSelect\?\.\(item, index\)/, 'ListView keeps the legacy selection callback.');
});

test('ListView grouped selection highlights and collapses the active group independently', () => {
  const source = readSource('src/components/lists/ListView/ListView.tsx');
  const css = readSource('src/components/lists/ListView/ListView.css');

  assertContains(source, /const isSelectedGroup = group\.items\.some\(\(item\) => selectedItemIds\.has\(item\.id\)\);/, 'Grouped ListView derives active group from the current selection.');
  assertContains(source, /data-selected=\{isSelectedGroup \? 'true' : undefined\}/, 'Grouped ListView marks the selected group for styling.');
  assertContains(source, /aria-expanded=\{!isCollapsed\}/, 'Grouped ListView exposes collapsed state on group headers.');
  assertContains(source, /onClick=\{\(\) => toggleGroup\(group\.id\)\}/, 'Grouped ListView headers can collapse without scrolling back to the original header.');
  assertContains(css, /\.list-view__group-trigger \{[\s\S]*clip-path: inset\(\s*0\s*calc\(var\(--list-view-group-mask-size\) \* -1\)[\s\S]*\);/, 'Grouped ListView headers do not mask upward into the previous group.');
  assertContains(css, /\.list-view__search > \.search-input \{[\s\S]*width: 100%;/, 'ListView search input fills the toolbar search column.');
  assertContains(css, /\.list-view__item\[data-indicators='false'\]\[data-selected='true'\] \{[\s\S]*border-left-color: var\(--color-accent\);/, 'No-indicator ListView rows keep the selected left border.');
});

const manualSelectionContracts = [
  {
    name: 'ActivityFeed',
    path: 'src/components/activity/ActivityFeed/ActivityFeed.tsx',
    selected: /const isSelected = item\.id === selectedId;/,
    manualGuard: /onClick=\{selectable \? \(\) => onItemSelect\?\.\(item\.id, item\) : undefined\}/,
  },
  {
    name: 'RunQueue',
    path: 'src/components/activity/RunQueue/RunQueue.tsx',
    selected: /const isSelected = item\.id === selectedId;/,
    manualGuard: /if \(!selectable\) \{\s+return;\s+\}/,
  },
  {
    name: 'Timeline',
    path: 'src/components/activity/Timeline/Timeline.tsx',
    selected: /const isSelected = item\.id === selectedId;/,
    manualGuard: /onClick=\{selectable \? \(\) => onItemSelect\?\.\(item\.id, item\) : undefined\}/,
  },
  {
    name: 'WorkflowStepper',
    path: 'src/components/activity/WorkflowStepper/WorkflowStepper.tsx',
    selected: /const isSelected = step\.id === selectedStepId;/,
    manualGuard: /onClick=\{selectable \? \(\) => onStepSelect\?\.\(step\.id, step\) : undefined\}/,
  },
  {
    name: 'ExecutionTimeline',
    path: 'src/components/activity/ExecutionTimeline/ExecutionTimeline.tsx',
    selected: /const isSelected = selectedPhaseId === phase\.id;/,
    manualGuard: /onClick=\{selectable \? \(\) => onPhaseSelect\?\.\(phase\.id, phase\) : undefined\}/,
  },
  {
    name: 'AuditTrail',
    path: 'src/components/activity/AuditTrail/AuditTrail.tsx',
    selected: /const isSelected = selectedEntryId === entry\.id;/,
    manualGuard: /onClick=\{selectable \? \(\) => onEntrySelect\?\.\(entry\.id, entry\) : undefined\}/,
  },
  {
    name: 'WorkflowDependencyGraph',
    path: 'src/components/activity/WorkflowDependencyGraph/WorkflowDependencyGraph.tsx',
    selected: /const isSelected = selectedNodeId === node\.id;/,
    manualGuard: /onClick=\{selectable \? \(\) => onNodeSelect\?\.\(node\.id, node\) : undefined\}/,
  },
  {
    name: 'DatasetSummary',
    path: 'src/components/advanced-data/DatasetSummary/DatasetSummary.tsx',
    selected: /const isSelected = internalSelectedMetricId === metric\.id;/,
    manualGuard: /onClick=\{selectable \? \(\) => selectMetric\(metric\) : undefined\}/,
  },
  {
    name: 'FieldProfile',
    path: 'src/components/advanced-data/FieldProfile/FieldProfile.tsx',
    selected: /const isSelected = internalSelectedBucketIndex === bucketIndex;/,
    manualGuard: /onClick=\{selectable \? \(\) => selectBucket\(bucket, bucketIndex\) : undefined\}/,
  },
  {
    name: 'DataQualityPanel',
    path: 'src/components/advanced-data/DataQualityPanel/DataQualityPanel.tsx',
    selected: /const isSelected = internalSelectedCheckId === check\.id;/,
    manualGuard: /onClick=\{selectable \? \(\) => selectCheck\(check\) : undefined\}/,
  },
  {
    name: 'SchemaExplorer',
    path: 'src/components/advanced-data/SchemaExplorer/SchemaExplorer.tsx',
    selected: /const isSelected = table\.id === activeTable\?\.id;[\s\S]*const isSelected = selectedFieldId === field\.id;/,
    manualGuard: /onClick=\{selectable \? \(\) => activeTable && onFieldSelect\?\.\(activeTable\.id, field\.id, field\) : undefined\}/,
  },
  {
    name: 'LineageTrace',
    path: 'src/components/advanced-data/LineageTrace/LineageTrace.tsx',
    selected: /const isSelected = selectedNodeId === node\.id;/,
    manualGuard: /onClick=\{selectable \? \(\) => onNodeSelect\?\.\(node\.id, node\) : undefined\}/,
  },
  {
    name: 'Watchlist',
    path: 'src/components/trading/Watchlist/Watchlist.tsx',
    selected: /const isSelected = quote\.symbol === activeSymbol;/,
    manualGuard: /onClick=\{selectable \? \(\) => selectQuote\(quote\.symbol\) : undefined\}/,
  },
  {
    name: 'MarketTicker',
    path: 'src/components/trading/MarketTicker/MarketTicker.tsx',
    selected: /const isSelected = quote\.symbol === internalSelectedSymbol;/,
    manualGuard: /onClick=\{selectable \? \(\) => selectSymbol\(quote\.symbol\) : undefined\}/,
  },
  {
    name: 'OrderBookLadder',
    path: 'src/components/trading/OrderBookLadder/OrderBookLadder.tsx',
    selected: /const isSelected = selectedPrice === level\.price;/,
    manualGuard: /onClick=\{selectable \? \(\) => onPriceSelect\?\.\(level\.price, side\) : undefined\}/,
  },
  {
    name: 'AllocationBreakdown',
    path: 'src/components/trading/AllocationBreakdown/AllocationBreakdown.tsx',
    selected: /const isSelected = selectedId === allocation\.id;/,
    focusGuard: /if \(!selectable\) \{[\s\S]*<div className="allocation-breakdown__item"/,
    manualGuard: /if \(!selectable\) \{\s+return \(/,
  },
  {
    name: 'BrokerConnectionSummary',
    path: 'src/components/trading/BrokerConnectionSummary/BrokerConnectionSummary.tsx',
    selected: /const isSelected = selectedId === connection\.id;/,
    manualGuard: /onClick=\{selectable \? \(\) => onConnectionSelect\?\.\(connection\.id, connection\) : undefined\}/,
  },
];

test('selectable=false disables manual selection without hiding programmatic current state', () => {
  for (const contract of manualSelectionContracts) {
    const source = readSource(contract.path);

    assertContains(source, contract.selected, `${contract.name} selected state must not be gated by selectable.`);
    assertContains(source, /data-selected=\{isSelected \? 'true' : undefined\}|selected=\{isSelected\}/, `${contract.name} renders selected/current state.`);
    assertContains(source, contract.focusGuard ?? /tabIndex=\{selectable \?/, `${contract.name} removes manual keyboard focus when selectable is false.`);
    assertContains(source, contract.manualGuard, `${contract.name} guards manual selection changes behind selectable.`);
    assertNotContains(source, /const isSelected = selectable &&/, `${contract.name} must not clear selected state when manual selection is disabled.`);
    assertNotContains(source, /data-selected=\{selectable &&/, `${contract.name} must not gate selected styling on selectable.`);
    assertNotContains(source, /selected=\{selectable &&/, `${contract.name} must not gate selected props on selectable.`);
  }
});

test('ObsidianGraphView exposes deterministic vault graph rendering', () => {
  const types = readSource('src/components/content/ObsidianGraphView/ObsidianGraphView.types.ts');
  const source = readSource('src/components/content/ObsidianGraphView/ObsidianGraphView.tsx');
  const css = readSource('src/components/content/ObsidianGraphView/ObsidianGraphView.css');
  const example = readSource('src/components/content/ObsidianGraphView/ObsidianGraphView.examples.tsx');
  const contentIndex = readSource('src/components/content/index.ts');
  const componentIndex = readSource('src/components/index.ts');
  const rootIndex = readSource('src/index.ts');
  const registry = readSource('src/app/componentRegistry.tsx');

  assertContains(types, /export type ObsidianGraphNode = \{[\s\S]*group\?: string;[\s\S]*id: string;[\s\S]*label: string;/, 'ObsidianGraphView exposes document nodes with group metadata.');
  assertContains(types, /export type ObsidianGraphLink = \{[\s\S]*source: string;[\s\S]*target: string;/, 'ObsidianGraphView exposes document links by id.');
  assertContains(types, /selectedNodeId\?: string;/, 'ObsidianGraphView accepts an externally selected document.');
  assertContains(types, /onSelectNode\?: \(node: ObsidianGraphNode\) => void;/, 'ObsidianGraphView reports selected graph documents.');
  assertContains(source, /const FORCE_ITERATIONS = 170;/, 'ObsidianGraphView uses a finite deterministic layout pass.');
  assertContains(source, /function buildObsidianGraphLayout\(nodes: readonly ObsidianGraphNode\[\], links: readonly ObsidianGraphLink\[\]\)/, 'ObsidianGraphView keeps layout generation inside the component.');
  assertContains(source, /resolvedLinks\.forEach\(\(link\) => \{[\s\S]*const targetDistance = 130 \+ groupBonus;[\s\S]*const spring = \(distance - targetDistance\)/, 'ObsidianGraphView separates connected notes with spring forces.');
  assertContains(source, /function getConnectedNodeIds\(activeNodeId: string \| undefined, links: LayoutLink\[\]\)/, 'ObsidianGraphView highlights selected-note neighbors.');
  assertContains(source, /onClick=\{\(\) => onSelectNode\?\.\(node\)\}/, 'ObsidianGraphView nodes can drive host selection.');
  assertContains(source, /preserveAspectRatio="none"/, 'ObsidianGraphView keeps SVG edges aligned with percentage-positioned document nodes.');
  assertContains(example, /id: 'wss-aggregation'/, 'ObsidianGraphView preview includes infrastructure notes for a fuller vault graph.');
  assertContains(example, /source: 'alpaca-stream', target: 'wss-aggregation'/, 'ObsidianGraphView preview includes dense cross-section vault links.');
  assertContains(example, /height = '560px'/, 'ObsidianGraphView preview uses enough vertical space to show the graph clearly.');
  assertContains(css, /\.obsidian-graph-view \{[\s\S]*height: var\(--obsidian-graph-height, 420px\);/, 'ObsidianGraphView owns a reusable graph viewport.');
  assertContains(css, /\.obsidian-graph-view__link\[data-related='true'\] \{[\s\S]*stroke-width: 2\.4;/, 'ObsidianGraphView visually emphasizes selected-note links.');
  assertContains(css, /\.obsidian-graph-view__node \{[\s\S]*pointer-events: auto;/, 'ObsidianGraphView renders interactive document nodes.');
  assertContains(contentIndex, /export \{ ObsidianGraphView, ObsidianGraphViewExample \} from '\.\/ObsidianGraphView';/, 'ObsidianGraphView is exported from content components.');
  assertContains(componentIndex, /ObsidianGraphView, ObsidianGraphViewExample/, 'ObsidianGraphView is exported from the component barrel.');
  assertContains(rootIndex, /ObsidianGraphView,/, 'ObsidianGraphView is exported from the package entry.');
  assertContains(registry, /id: 'obsidian-graph-view'[\s\S]*name: 'ObsidianGraphView'/, 'ObsidianGraphView appears in the component preview registry.');
  assertContains(registry, /defaultParameters: \{[\s\S]*height: '560px'[\s\S]*labelMode: 'active'/, 'ObsidianGraphView preview defaults to the denser graph viewport.');
});

test('DataTable and PropertyList support controlled and uncontrolled selected state', () => {
  const dataTableTypes = readSource('src/components/data-display/DataTable/DataTable.types.ts');
  const dataTableSource = readSource('src/components/data-display/DataTable/DataTable.tsx');
  const propertyListTypes = readSource('src/components/data-display/PropertyList/PropertyList.types.ts');
  const propertyListSource = readSource('src/components/data-display/PropertyList/PropertyList.tsx');

  assertContains(dataTableTypes, /defaultSelectedRowIndex\?: number;/, 'DataTable exposes an uncontrolled default selected row.');
  assertContains(dataTableTypes, /defaultSelectedRowId\?: string;/, 'DataTable exposes an uncontrolled default selected row by id.');
  assertContains(dataTableTypes, /selectedRowIndex\?: number;/, 'DataTable exposes a controlled selected row.');
  assertContains(dataTableTypes, /selectedRowId\?: string;/, 'DataTable exposes a controlled selected row by id.');
  assertContains(dataTableTypes, /onSelectionChange\?: \(rowId: string, row: DataTableRow, rowIndex: number\) => void;/, 'DataTable exposes normalized selection callback alias.');
  assertContains(dataTableSource, /selectedRowIndex !== undefined/, 'DataTable syncs controlled selection changes.');
  assertContains(dataTableSource, /selectedRowId !== undefined/, 'DataTable syncs controlled selected row id changes.');
  assertContains(dataTableSource, /const isSelected = selectable && internalSelectedRowIndex === sourceIndex;/, 'DataTable omits the visual selected state when row selection is disabled.');
  assertContains(dataTableSource, /onSelectionChange\?\.\(row\.id, row, rowIndex\)/, 'DataTable calls the normalized selection callback.');

  assertContains(propertyListTypes, /defaultSelectedIndex\?: number;/, 'PropertyList exposes an uncontrolled default selected item.');
  assertContains(propertyListTypes, /defaultSelectedId\?: string;/, 'PropertyList exposes an uncontrolled default selected item by id.');
  assertContains(propertyListTypes, /selectedIndex\?: number;/, 'PropertyList exposes a controlled selected item.');
  assertContains(propertyListTypes, /selectedId\?: string;/, 'PropertyList exposes a controlled selected item by id.');
  assertContains(propertyListTypes, /onSelectionChange\?: \(selectedId: string, item: PropertyListItem, itemIndex: number\) => void;/, 'PropertyList exposes normalized selection callback alias.');
  assertContains(propertyListSource, /selectedIndex !== undefined/, 'PropertyList syncs controlled selection changes.');
  assertContains(propertyListSource, /selectedId !== undefined/, 'PropertyList syncs controlled selected item id changes.');
  assertContains(propertyListSource, /disabled=\{!selectable\}/, 'PropertyList disables manual row selection when selectable=false.');
  assertContains(propertyListSource, /onSelectionChange\?\.\(item\.id, item, itemIndex\)/, 'PropertyList calls the normalized selection callback.');
});

test('Node primitives contain body content and expose reusable canvas interaction math', () => {
  const nodeTypes = readSource('src/components/node-system/NodeSystem.types.ts');
  const nodeSource = readSource('src/components/node-system/Node/Node.tsx');
  const edgeSource = readSource('src/components/node-system/NodeEdge/NodeEdge.tsx');
  const nodeCss = readSource('src/components/node-system/NodeSystem.css');
  const canvasSource = readSource('src/components/node-system/NodeCanvas/NodeCanvas.tsx');
  const canvasUtils = readSource('src/components/node-system/NodeCanvas/NodeCanvas.utils.ts');
  const canvasIndex = readSource('src/components/node-system/NodeCanvas/index.ts');

  assertContains(nodeTypes, /export type NodeBodyOverflow = 'auto' \| 'hidden' \| 'visible';/, 'Node exposes explicit body overflow modes.');
  assertContains(nodeTypes, /bodyOverflow\?: NodeBodyOverflow;/, 'NodeProps includes bodyOverflow.');
  assertContains(nodeSource, /bodyOverflow = 'hidden'/, 'Node body overflow defaults to contained content.');
  assertContains(nodeCss, /\.node-system-node__body \{[\s\S]*overflow: hidden;/, 'Node body content is contained by default.');
  assertContains(nodeCss, /\.node-system-node\[data-body-overflow='visible'\] \.node-system-node__body \{[\s\S]*overflow: visible;/, 'Node body overflow can be explicitly relaxed.');
  assertContains(nodeCss, /\.node-system-inspector\.surface-panel,[\s\S]*\.node-system-inspector \.surface-panel__body \{[\s\S]*align-content: start;/, 'NodeInspector keeps stretched inspector content anchored near the top.');
  assertContains(canvasUtils, /export function getNodeCanvasSelectionBounds/, 'NodeCanvas exposes selection bounds helper.');
  assertContains(canvasUtils, /export function getNodeCanvasSelectedNodeIds/, 'NodeCanvas exposes rectangle selection helper.');
  assertContains(canvasUtils, /export function getNodeCanvasMovedNodes/, 'NodeCanvas exposes synced selected-node movement helper.');
  assertContains(canvasUtils, /export function getNodeCanvasDragOrigins/, 'NodeCanvas exposes grouped drag origin helper.');
  assertContains(canvasUtils, /export function getNodeCanvasDraggedNodes/, 'NodeCanvas exposes grouped drag movement helper.');
  assertContains(canvasUtils, /export function getNodeCanvasExpandedPlane/, 'NodeCanvas exposes auto-expanding plane helper.');
  assertContains(nodeTypes, /onSelectedNodeIdsChange\?:/, 'NodeCanvasProps exposes built-in marquee selection changes.');
  assertContains(nodeTypes, /selectableNodes\?: NodeCanvasSelectableNode\[\];/, 'NodeCanvasProps accepts selectable nodes for built-in selection.');
  assertContains(nodeTypes, /pannable\?: boolean;/, 'NodeCanvasProps exposes built-in canvas panning.');
  assertContains(nodeTypes, /onPanChange\?: \(offset: NodeCanvasPanOffset, details: NodeCanvasPanChangeDetails\) => void;/, 'NodeCanvasProps reports pan offset changes.');
  assertContains(nodeTypes, /defaultOffsetX\?: number;/, 'NodeCanvasProps supports uncontrolled default horizontal offsets.');
  assertContains(nodeTypes, /defaultOffsetY\?: number;/, 'NodeCanvasProps supports uncontrolled default vertical offsets.');
  assertContains(canvasSource, /selectionButton = 2/, 'NodeCanvas defaults marquee selection to right-button drag.');
  assertContains(canvasSource, /function startPanning/, 'NodeCanvas starts built-in panning from empty canvas drags.');
  assertContains(canvasSource, /commitPanOffset/, 'NodeCanvas updates controlled or uncontrolled offsets while panning.');
  assertContains(canvasSource, /suppressContextMenuRef\.current = hasDraggedSelection;/, 'NodeCanvas suppresses context menus after right-drag selection.');
  assertContains(nodeSource, /consumeContextMenuSuppression\(\)/, 'Node consumes canvas context-menu suppression before node menu handlers.');
  assertContains(edgeSource, /height: `\$\{canvasHeight\}px`/, 'NodeEdge fixes SVG height to the logical canvas coordinate plane.');
  assertContains(edgeSource, /width: `\$\{canvasWidth\}px`/, 'NodeEdge fixes SVG width to the logical canvas coordinate plane.');
  assertContains(nodeCss, /\.node-system-edge \{[\s\S]*top: 0;[\s\S]*left: 0;/, 'NodeEdge anchors without stretching to the scrollable plane.');
  assertContains(nodeCss, /\.node-system-canvas__selection-rect/, 'NodeCanvas renders a built-in marquee rectangle.');
  assertContains(nodeCss, /\.node-system-canvas\[data-pannable='true'\]/, 'NodeCanvas renders a grab cursor for pannable canvases.');
  assertContains(nodeCss, /\.node-system-canvas\[data-panning='true'\]/, 'NodeCanvas renders a grabbing cursor while panning.');
  assertContains(canvasIndex, /getNodeCanvasExpandedPlane/, 'NodeCanvas exports plane expansion helper.');
});

test('NodeWorkspaceMock exposes right-click marquee selection and canvas actions', () => {
  const example = readSource('src/components/node-system/NodeSystem.examples.tsx');
  const nodeCss = readSource('src/components/node-system/NodeSystem.css');
  const registry = readSource('src/app/componentRegistry.tsx');

  assertContains(example, /shortcut: 'Right drag canvas'/, 'NodeWorkspaceMock documents right-drag selection in canvas shortcuts.');
  assertContains(example, /pannable/, 'NodeWorkspaceMock enables shared NodeCanvas panning.');
  assertContains(example, /onPanChange=\{handleCanvasPanChange\}/, 'NodeWorkspaceMock delegates canvas pan offset changes to NodeCanvas.');
  assertContains(example, /selectableNodes=\{nodes\}/, 'NodeWorkspaceMock delegates marquee selection to NodeCanvas.');
  assertContains(example, /onSelectedNodeIdsChange=\{handleSelectedNodeIdsChange\}/, 'NodeWorkspaceMock handles NodeCanvas selection output.');
  assertContains(example, /getNodeCanvasDragOrigins\(nodes, selectedNodeIds, node\.id\)/, 'NodeWorkspaceMock uses shared grouped drag origins.');
  assertContains(example, /getNodeCanvasDraggedNodes\(currentNodes, dragState\.nodeOrigins/, 'NodeWorkspaceMock uses shared grouped drag movement.');
  assertContains(example, /<strong>Fit view<\/strong>/, 'NodeWorkspaceMock context menu exposes a Fit view action.');
  assertContains(example, /contextMenu\.canAddNodes/, 'NodeWorkspaceMock gates node-template actions behind editable canvas state.');
  assertContains(example, /selectedNodeIds\.length > 1 \? `\$\{selectedNodeIds\.length\} nodes selected`/, 'NodeWorkspaceMock labels multi-node marquee selections.');
  assertContains(nodeCss, /\.node-system-canvas\[data-selecting='true'\] \.node-system-canvas__plane/, 'Node canvas disables transform transitions during marquee selection.');
  assertContains(nodeCss, /\.node-system-canvas__selection-rect/, 'NodeCanvas renders a visible marquee rectangle for the workspace mock.');
  assertContains(registry, /right-click canvas actions, marquee selection/, 'Component registry describes the NodeWorkspaceMock interaction surface.');
});

test('preview harness exposes edge-case scenarios for ListView', () => {
  const registry = readSource('src/app/componentRegistry.tsx');
  const example = readSource('src/components/lists/ListView/ListView.examples.tsx');
  const dataTableExample = readSource('src/components/data-display/DataTable/DataTable.examples.tsx');
  const propertyListExample = readSource('src/components/data-display/PropertyList/PropertyList.examples.tsx');

  assertContains(registry, /id: 'scenario'/, 'Component preview harness exposes a scenario control.');
  assertContains(registry, /Sticky selected group/, 'ListView preview includes a sticky selected group scenario.');
  assertContains(registry, /Long labels/, 'ListView preview includes a long-label scenario.');
  assertContains(registry, /Empty state/, 'ListView preview includes an empty-state scenario.');
  assertContains(registry, /Disabled rows/, 'ListView preview includes a disabled-row scenario.');
  assertContains(registry, /id: 'enableSearch'/, 'ListView preview exposes the built-in search flag.');
  assertContains(registry, /enableSearch=\{Boolean\(parameters\.enableSearch\)\}/, 'ListView preview passes the search flag to the component example.');
  assertContains(example, /enableSearch\?: boolean;/, 'ListView example exposes the search flag.');
  assertContains(example, /searchPlaceholder="Search rows"/, 'ListView example provides a search placeholder.');
  assertContains(example, /ListViewScenario = 'default' \| 'sticky-selected-group' \| 'long-labels' \| 'empty-state' \| 'many-items' \| 'collapsed-selected-group' \| 'disabled-items'/, 'ListView example defines a stable scenario union.');
  assertContains(example, /stickySelectedGroupItems/, 'ListView example includes grouped rows for sticky-header QA.');
  assertContains(example, /longLabelItems/, 'ListView example includes long-label rows for wrapping QA.');
  assertContains(example, /disabledItems/, 'ListView example includes disabled rows for interaction QA.');
  assertContains(dataTableExample, /DataTableScenario = 'default' \| 'empty-state' \| 'long-labels' \| 'many-rows' \| 'disabled-rows'/, 'DataTable example defines stable edge-case scenarios.');
  assertContains(propertyListExample, /PropertyListScenario = 'default' \| 'empty-state' \| 'long-labels' \| 'many-items'/, 'PropertyList example defines stable edge-case scenarios.');
  assertContains(registry, /Switches the table data set for edge-case QA\./, 'DataTable preview exposes its scenario selector.');
  assertContains(registry, /Switches property items for edge-case QA\./, 'PropertyList preview exposes its scenario selector.');
});

test('interaction matrix documents shared naming semantics', () => {
  const matrix = readSource('docs/interaction-contract-matrix.md');

  assertContains(matrix, /`selectable`: enables manual selection/, 'Matrix defines selectable as manual-selection capability.');
  assertContains(matrix, /`interactive`: hover\/click affordance that is not necessarily selection/, 'Matrix separates interactive from selectable.');
  assertContains(matrix, /`onSelectionChange`: normalized callback alias/, 'Matrix documents normalized callback aliases.');
  assertContains(matrix, /\| `ListView` \| `selectable`, default `true` \| `selectedId`, `selectedIndex` \| `defaultSelectedId`, `defaultSelectedIndex`/, 'Matrix includes ListView normalized selection contract.');
  assertContains(matrix, /\| `DataTable` \| `selectable`, default `true` \| `selectedRowId`, `selectedRowIndex` \| `defaultSelectedRowId`, `defaultSelectedRowIndex`/, 'Matrix includes DataTable controlled/uncontrolled selection contract.');
  assertContains(matrix, /\| `PropertyList` \| `selectable`, default `false` \| `selectedId`, `selectedIndex` \| `defaultSelectedId`, `defaultSelectedIndex`/, 'Matrix includes PropertyList controlled/uncontrolled selection contract.');
});
