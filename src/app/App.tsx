import { ExternalLink, FolderOpen, Maximize2, RotateCcw, Save, Trash2, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react';
import { Button, Checkbox, ColorInput, Slider, TextArea, TextInput } from '../components/inputs';
import { Dropdown } from '../components/inputs/Dropdown';
import type { DropdownValue } from '../components/inputs/Dropdown';
import { CountBadge, DeltaIndicator, StatusBadge } from '../components/feedback';
import { ListView } from '../components/lists/ListView';
import type { ListViewFilterAttribute, ListViewItem } from '../components/lists/ListView';
import { Modal } from '../components/overlays';
import { EmptyState, Panel, Section, Toolbar } from '../components/surfaces';
import projectThemeConfig from '../theme/theme.config.json';
import { componentPreviews, type ComponentParameterControl, type ComponentParameterValue, type ComponentParameterValues } from './componentRegistry';

const THEME_CONFIG_ENDPOINT = '/api/theme-config';
const THEME_STORAGE_KEY = 'agentic-ui.theme.v1';
const THEME_LOADED_PRESET_STORAGE_KEY = 'agentic-ui.theme-loaded-preset.v1';
const THEME_PRESETS_STORAGE_KEY = 'agentic-ui.theme-presets.v1';
const FULLSCREEN_PREVIEW_STORAGE_KEY = 'agentic-ui.fullscreen-preview.v1';
const MAX_THEME_PRESETS = 12;
const PREVIEW_FRAME_BOUNDS = {
  minHeight: 96,
  minWidth: 120,
  maxHeight: 1600,
  maxWidth: 2400,
};

const colorControls = [
  { label: 'Foreground', token: '--color-foreground', defaultValue: '#17191c' },
  { label: 'Background', token: '--color-background', defaultValue: '#f6f7f9' },
  { label: 'Surface', token: '--color-surface', defaultValue: '#ffffff' },
  { label: 'Surface muted', token: '--color-surface-muted', defaultValue: '#eef1f4' },
  { label: 'Card surface', token: '--color-surface-raised', defaultValue: '#ffffff' },
  { label: 'Muted text', token: '--color-muted', defaultValue: '#5f6875' },
  { label: 'Border', token: '--color-border', defaultValue: '#d9dee5' },
  { label: 'Strong border', token: '--color-border-strong', defaultValue: '#b6bfca' },
  { label: 'Scrollbar', token: '--color-scrollbar-thumb', defaultValue: '#9aa3ad' },
  { label: 'Code background', token: '--color-code-background', defaultValue: '#f7f9fc' },
  { label: 'Code foreground', token: '--color-code-foreground', defaultValue: '#1d2430' },
  { label: 'Code gutter', token: '--color-code-gutter-background', defaultValue: '#edf1f6' },
  { label: 'Code active line', token: '--color-code-active-line', defaultValue: '#eef4ff' },
  { label: 'Code selection', token: '--color-code-selection', defaultValue: '#c7d8ff' },
  { label: 'Accent', token: '--color-accent', defaultValue: '#2458c7' },
  { label: 'Positive', token: '--color-trading-positive', defaultValue: '#137a49' },
  { label: 'Negative', token: '--color-trading-negative', defaultValue: '#b4232d' },
  { label: 'Warning', token: '--color-trading-warning', defaultValue: '#9a6700' },
  { label: 'Neutral', token: '--color-trading-neutral', defaultValue: '#596270' },
  { label: 'Data type base', token: '--color-data-type-base', defaultValue: '#4e8cff' },
] as const;

const radiusControls = [
  { label: 'Extra small', token: '--radius-xs', defaultValue: '4px', max: 16 },
  { label: 'Small', token: '--radius-sm', defaultValue: '6px', max: 20 },
  { label: 'Medium', token: '--radius-md', defaultValue: '8px', max: 28 },
  { label: 'Large', token: '--radius-lg', defaultValue: '12px', max: 36 },
] as const;

const motionControls = [
  { label: 'Press feedback', token: '--motion-duration-press', defaultValue: '120ms', max: 240 },
  { label: 'Popup open/close', token: '--motion-duration-popup', defaultValue: '180ms', max: 420 },
  { label: 'List movement', token: '--motion-duration-list', defaultValue: '220ms', max: 520 },
  { label: 'Counter slide', token: '--motion-duration-counter', defaultValue: '160ms', max: 360 },
  { label: 'Indicator loop', token: '--motion-duration-indicator', defaultValue: '900ms', max: 1800 },
] as const;

const editableControls = [...colorControls, ...radiusControls, ...motionControls] as const;

const tradingStateSamples = [
  { label: 'Positive', value: '+2.48%', tone: 'positive' },
  { label: 'Negative', value: '-1.16%', tone: 'negative' },
  { label: 'Neutral', value: 'Flat', tone: 'neutral' },
] as const;

const typeRoles = [
  { className: 'type-display-small', label: 'Display small', sample: 'Agentic UI' },
  { className: 'type-headline-medium', label: 'Headline medium', sample: 'Portfolio controls' },
  { className: 'type-title-medium', label: 'Title medium', sample: 'Order ticket status' },
  { className: 'type-body-medium', label: 'Body medium', sample: 'Reusable component text uses Montserrat by default.' },
  { className: 'type-label-large', label: 'Label large', sample: 'Primary action' },
];

const componentTypeFilterAttributes: ListViewFilterAttribute[] = [
  {
    id: 'type',
    label: 'Type',
    options: Array.from(new Set(componentPreviews.map((component) => component.group))).map((group) => ({
      label: group,
      value: group,
    })),
  },
];

type ThemeToken = (typeof editableControls)[number]['token'];
type ThemeValues = Record<ThemeToken, string>;
type ThemePreset = {
  createdAt: number;
  id: string;
  name: string;
  updatedAt: number;
  values: ThemeValues;
};
type ComponentParameterState = Record<string, ComponentParameterValues>;
type ComponentContentState = Record<string, ComponentParameterValues>;
type PreviewFrameSize = { height: number; width: number };
type PreviewResizeDirection = 'both' | 'height' | 'width';
type PreviewControlGroupId = 'content' | 'parameters';
type FullscreenPreviewRequest = {
  componentId?: string;
  enabled: boolean;
  snapshotId?: string;
};
type FullscreenPreviewSnapshot = {
  componentId: string;
  contentValues: ComponentParameterValues;
  createdAt: number;
  parameters: ComponentParameterValues;
};
type FullscreenPreviewSnapshots = Record<string, FullscreenPreviewSnapshot>;
function clampValue(value: number, minValue: number, maxValue: number): number {
  return Math.min(Math.max(value, minValue), maxValue);
}

function buildDefaultComponentParameterState(): ComponentParameterState {
  return componentPreviews.reduce((parameterState, component) => {
    parameterState[component.id] = { ...component.defaultParameters };
    return parameterState;
  }, {} as ComponentParameterState);
}

function buildDefaultComponentContentState(): ComponentContentState {
  return componentPreviews.reduce((contentState, component) => {
    contentState[component.id] = { ...(component.defaultContentValues ?? {}) };
    return contentState;
  }, {} as ComponentContentState);
}

function buildFallbackThemeValues(): ThemeValues {
  return editableControls.reduce((theme, control) => {
    theme[control.token] = control.defaultValue;
    return theme;
  }, {} as ThemeValues);
}

function normalizeThemeValues(source?: Partial<Record<string, string>>): ThemeValues {
  const fallbackThemeValues = buildFallbackThemeValues();

  return editableControls.reduce((theme, control) => {
    const configValue = source?.[control.token];
    theme[control.token] = typeof configValue === 'string' ? configValue : fallbackThemeValues[control.token];
    return theme;
  }, {} as ThemeValues);
}

function buildDefaultThemeValues(): ThemeValues {
  return normalizeThemeValues(projectThemeConfig);
}

function themeValuesMatch(firstThemeValues: ThemeValues, secondThemeValues: ThemeValues): boolean {
  return editableControls.every((control) => firstThemeValues[control.token] === secondThemeValues[control.token]);
}

function hasCustomProjectTheme(projectThemeValues: ThemeValues): boolean {
  return !themeValuesMatch(projectThemeValues, buildFallbackThemeValues());
}

function hasStoredThemeValues(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(THEME_STORAGE_KEY) !== null;
}

function readStoredThemeValues(): ThemeValues | null {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const rawTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (!rawTheme) {
      return null;
    }

    const parsedTheme = JSON.parse(rawTheme) as Partial<Record<string, string>>;
    return normalizeThemeValues(parsedTheme);
  } catch {
    return null;
  }
}

function storeThemeValues(themeValues: ThemeValues) {
  window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(themeValues));
}

function clearStoredThemeValues() {
  window.localStorage.removeItem(THEME_STORAGE_KEY);
}

function readLoadedThemePresetId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  return window.localStorage.getItem(THEME_LOADED_PRESET_STORAGE_KEY) ?? '';
}

function storeLoadedThemePresetId(presetId: string) {
  window.localStorage.setItem(THEME_LOADED_PRESET_STORAGE_KEY, presetId);
}

function clearLoadedThemePresetId() {
  window.localStorage.removeItem(THEME_LOADED_PRESET_STORAGE_KEY);
}

function createThemePresetId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function sortThemePresets(themePresets: ThemePreset[]): ThemePreset[] {
  return [...themePresets].sort((firstPreset, secondPreset) => secondPreset.updatedAt - firstPreset.updatedAt);
}

function getNextThemePresetName(themePresets: ThemePreset[]): string {
  const presetNameSet = new Set(themePresets.map((preset) => preset.name));
  let presetIndex = themePresets.length + 1;

  while (presetNameSet.has(`Preset ${presetIndex}`)) {
    presetIndex += 1;
  }

  return `Preset ${presetIndex}`;
}

function normalizeThemePreset(source: unknown, fallbackIndex: number): ThemePreset | null {
  if (!source || typeof source !== 'object') {
    return null;
  }

  const preset = source as Partial<ThemePreset>;
  const now = Date.now();
  const id = typeof preset.id === 'string' && preset.id.length > 0 ? preset.id : createThemePresetId();
  const name = typeof preset.name === 'string' && preset.name.trim().length > 0 ? preset.name.trim() : `Preset ${fallbackIndex + 1}`;
  const createdAt = typeof preset.createdAt === 'number' && Number.isFinite(preset.createdAt) ? preset.createdAt : now;
  const updatedAt = typeof preset.updatedAt === 'number' && Number.isFinite(preset.updatedAt) ? preset.updatedAt : createdAt;

  return {
    createdAt,
    id,
    name,
    updatedAt,
    values: normalizeThemeValues(preset.values),
  };
}

function readThemePresets(): ThemePreset[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const rawPresets = window.localStorage.getItem(THEME_PRESETS_STORAGE_KEY);
    const parsedPresets = rawPresets ? JSON.parse(rawPresets) : [];

    if (!Array.isArray(parsedPresets)) {
      return [];
    }

    return sortThemePresets(parsedPresets.flatMap((preset, index) => normalizeThemePreset(preset, index) ?? []));
  } catch {
    return [];
  }
}

function storeThemePresets(themePresets: ThemePreset[]) {
  const normalizedPresets = sortThemePresets(themePresets).slice(0, MAX_THEME_PRESETS);
  window.localStorage.setItem(THEME_PRESETS_STORAGE_KEY, JSON.stringify(normalizedPresets));
}

function getLoadedThemePreset(themePresets: ThemePreset[]): ThemePreset | null {
  const loadedThemePresetId = readLoadedThemePresetId();

  if (!loadedThemePresetId) {
    return null;
  }

  return themePresets.find((preset) => preset.id === loadedThemePresetId) ?? null;
}

function hasLoadedThemePreset(): boolean {
  return getLoadedThemePreset(readThemePresets()) !== null;
}

function getInitialSelectedThemePreset(themePresets: ThemePreset[]): ThemePreset | undefined {
  return getLoadedThemePreset(themePresets) ?? themePresets[0];
}

function readFullscreenPreviewRequest(): FullscreenPreviewRequest {
  if (typeof window === 'undefined') {
    return { enabled: false };
  }

  const searchParams = new URLSearchParams(window.location.search);
  return {
    componentId: searchParams.get('component') ?? undefined,
    enabled: searchParams.get('fullscreenPreview') === '1',
    snapshotId: searchParams.get('snapshot') ?? undefined,
  };
}

function readFullscreenPreviewSnapshots(): FullscreenPreviewSnapshots {
  if (typeof window === 'undefined') {
    return {};
  }

  try {
    const rawSnapshots = window.localStorage.getItem(FULLSCREEN_PREVIEW_STORAGE_KEY);
    return rawSnapshots ? (JSON.parse(rawSnapshots) as FullscreenPreviewSnapshots) : {};
  } catch {
    return {};
  }
}

function readFullscreenPreviewSnapshot(snapshotId?: string): FullscreenPreviewSnapshot | null {
  if (!snapshotId) {
    return null;
  }

  return readFullscreenPreviewSnapshots()[snapshotId] ?? null;
}

function createFullscreenPreviewSnapshotId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function storeFullscreenPreviewSnapshot(snapshot: FullscreenPreviewSnapshot): string {
  const snapshotId = createFullscreenPreviewSnapshotId();
  const snapshots = readFullscreenPreviewSnapshots();
  const snapshotEntries = Object.entries({
    ...snapshots,
    [snapshotId]: snapshot,
  })
    .sort(([, firstSnapshot], [, secondSnapshot]) => secondSnapshot.createdAt - firstSnapshot.createdAt)
    .slice(0, 12);

  window.localStorage.setItem(FULLSCREEN_PREVIEW_STORAGE_KEY, JSON.stringify(Object.fromEntries(snapshotEntries)));
  return snapshotId;
}

function loadThemeValues(): ThemeValues {
  const loadedThemePreset = getLoadedThemePreset(readThemePresets());

  return loadedThemePreset ? { ...loadedThemePreset.values } : readStoredThemeValues() ?? buildDefaultThemeValues();
}

async function fetchProjectThemeValues(): Promise<ThemeValues | null> {
  try {
    const response = await fetch(THEME_CONFIG_ENDPOINT, { cache: 'no-store' });
    if (!response.ok) {
      return null;
    }

    const themeConfig = (await response.json()) as Partial<Record<string, string>>;
    return normalizeThemeValues(themeConfig);
  } catch {
    return null;
  }
}

async function persistProjectThemeValues(themeValues: ThemeValues): Promise<boolean> {
  try {
    const response = await fetch(THEME_CONFIG_ENDPOINT, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(themeValues),
    });

    return response.ok;
  } catch {
    return false;
  }
}

function radiusSampleStyle(token: string): CSSProperties {
  return { borderRadius: `var(${token})` };
}

function parseDurationMs(value: string): number {
  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function isHexColor(value: string): boolean {
  return /^#[0-9a-f]{6}$/i.test(value);
}

function getDropdownStringValue(value: DropdownValue): string {
  return Array.isArray(value) ? (value[0] ?? '') : value;
}

function isControlVisible(control: ComponentParameterControl, parameterValues: ComponentParameterValues): boolean {
  if (!control.visibleWhen) {
    return true;
  }

  return parameterValues[control.visibleWhen.parameterId] === control.visibleWhen.value;
}

function buildPreviewControlGroupKey(componentId: string, groupId: PreviewControlGroupId): string {
  return `${componentId}:${groupId}`;
}

function getAvailablePreviewFrameSize(element: HTMLDivElement): PreviewFrameSize | null {
  const rect = element.getBoundingClientRect();
  const width = Math.floor(rect.width);
  const height = Math.floor(rect.height);

  if (width <= 0 || height <= 0) {
    return null;
  }

  return {
    height: clampValue(height, PREVIEW_FRAME_BOUNDS.minHeight, PREVIEW_FRAME_BOUNDS.maxHeight),
    width: clampValue(width, PREVIEW_FRAME_BOUNDS.minWidth, PREVIEW_FRAME_BOUNDS.maxWidth),
  };
}

export function App() {
  const fullscreenPreviewRequest = useMemo(() => readFullscreenPreviewRequest(), []);
  const fullscreenPreviewSnapshot = useMemo(
    () => readFullscreenPreviewSnapshot(fullscreenPreviewRequest.snapshotId),
    [fullscreenPreviewRequest.snapshotId],
  );
  const initialSelectedComponentId = fullscreenPreviewSnapshot?.componentId ?? fullscreenPreviewRequest.componentId ?? componentPreviews[0]?.id;
  const [themeValues, setThemeValues] = useState<ThemeValues>(() => loadThemeValues());
  const [savedThemeValues, setSavedThemeValues] = useState<ThemeValues>(() => ({ ...themeValues }));
  const [saveMessage, setSaveMessage] = useState(() => (hasLoadedThemePreset() ? 'Preset loaded' : hasStoredThemeValues() ? 'Saved locally' : 'Saved'));
  const [themePresets, setThemePresets] = useState<ThemePreset[]>(() => readThemePresets());
  const [selectedThemePresetId, setSelectedThemePresetId] = useState(() => getInitialSelectedThemePreset(themePresets)?.id ?? '');
  const [themePresetName, setThemePresetName] = useState(() => getInitialSelectedThemePreset(themePresets)?.name ?? getNextThemePresetName(themePresets));
  const [pendingThemePresetOverwrite, setPendingThemePresetOverwrite] = useState<ThemePreset | null>(null);
  const [isThemePresetOverwriteOpen, setIsThemePresetOverwriteOpen] = useState(false);
  const [componentParameterValues, setComponentParameterValues] = useState<ComponentParameterState>(() => {
    const defaultComponentParameterState = buildDefaultComponentParameterState();

    if (fullscreenPreviewSnapshot) {
      defaultComponentParameterState[fullscreenPreviewSnapshot.componentId] = { ...fullscreenPreviewSnapshot.parameters };
    }

    return defaultComponentParameterState;
  });
  const [componentContentValues, setComponentContentValues] = useState<ComponentContentState>(() => {
    const defaultComponentContentState = buildDefaultComponentContentState();

    if (fullscreenPreviewSnapshot) {
      defaultComponentContentState[fullscreenPreviewSnapshot.componentId] = { ...fullscreenPreviewSnapshot.contentValues };
    }

    return defaultComponentContentState;
  });
  const [collapsedControlGroups, setCollapsedControlGroups] = useState<Record<string, boolean>>({});
  const [previewFrameSize, setPreviewFrameSize] = useState<PreviewFrameSize>({ height: 520, width: 920 });
  const [hasCustomPreviewFrameSize, setHasCustomPreviewFrameSize] = useState(false);
  const [selectedComponentId, setSelectedComponentId] = useState(() => initialSelectedComponentId);
  const previewFrameSizeRef = useRef(previewFrameSize);
  const previewFrameScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let isCurrent = true;
    const storedThemeValues = readStoredThemeValues();
    const loadedThemePreset = getLoadedThemePreset(readThemePresets());

    void fetchProjectThemeValues().then((projectThemeValues) => {
      if (!isCurrent) {
        return;
      }

      if (loadedThemePreset) {
        const presetValues = { ...loadedThemePreset.values };

        storeThemeValues(presetValues);
        setThemeValues(presetValues);
        setSavedThemeValues({ ...presetValues });
        setSaveMessage('Preset loaded');
        return;
      }

      if (!projectThemeValues) {
        return;
      }

      if (!storedThemeValues || hasCustomProjectTheme(projectThemeValues)) {
        setThemeValues(projectThemeValues);
        setSavedThemeValues({ ...projectThemeValues });

        if (hasCustomProjectTheme(projectThemeValues)) {
          storeThemeValues(projectThemeValues);
        }

        setSaveMessage('Saved globally');
        return;
      }

      setSaveMessage('Saved locally');
    });

    return () => {
      isCurrent = false;
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    editableControls.forEach((control) => {
      root.style.setProperty(control.token, themeValues[control.token]);
    });
  }, [themeValues]);

  useEffect(() => {
    previewFrameSizeRef.current = previewFrameSize;
  }, [previewFrameSize]);

  useEffect(() => {
    if (hasCustomPreviewFrameSize || !selectedComponentId) {
      return undefined;
    }

    const previewFrameScroll = previewFrameScrollRef.current;

    if (!previewFrameScroll) {
      return undefined;
    }

    const previewFrameScrollElement: HTMLDivElement = previewFrameScroll;

    function updateAutoPreviewSize() {
      const nextFrameSize = getAvailablePreviewFrameSize(previewFrameScrollElement);

      if (!nextFrameSize) {
        return;
      }

      setPreviewFrameSize((currentFrameSize) =>
        currentFrameSize.width === nextFrameSize.width && currentFrameSize.height === nextFrameSize.height ? currentFrameSize : nextFrameSize,
      );
    }

    updateAutoPreviewSize();

    const resizeObserver = new ResizeObserver(updateAutoPreviewSize);
    resizeObserver.observe(previewFrameScrollElement);

    return () => resizeObserver.disconnect();
  }, [hasCustomPreviewFrameSize, selectedComponentId]);

  const hasUnsavedChanges = useMemo(
    () => editableControls.some((control) => themeValues[control.token] !== savedThemeValues[control.token]),
    [savedThemeValues, themeValues],
  );
  const saveStateLabel = hasUnsavedChanges ? 'Unsaved' : saveMessage;
  const saveStateStatus = saveMessage === 'Saving' ? 'watching' : hasUnsavedChanges ? 'paused' : 'disabled';
  const selectedThemePreset = useMemo(
    () => themePresets.find((preset) => preset.id === selectedThemePresetId),
    [selectedThemePresetId, themePresets],
  );
  const themePresetOptions = useMemo(
    () =>
      themePresets.map((preset) => ({
        label: preset.name,
        value: preset.id,
      })),
    [themePresets],
  );
  const componentListItems = useMemo<ListViewItem[]>(
    () =>
      componentPreviews.map((component) => ({
        attributes: {
          type: component.group,
        },
        id: component.id,
        eyebrow: component.group,
        title: component.name,
        description: component.description,
        meta: component.status,
        tone: 'accent',
      })),
    [],
  );
  const selectedComponent = useMemo(
    () => componentPreviews.find((component) => component.id === selectedComponentId),
    [selectedComponentId],
  );
  const selectedComponentParameters = selectedComponent
    ? (componentParameterValues[selectedComponent.id] ?? selectedComponent.defaultParameters)
    : {};
  const selectedComponentContentValues = selectedComponent
    ? (componentContentValues[selectedComponent.id] ?? selectedComponent.defaultContentValues ?? {})
    : {};
  const selectedRenderer = selectedComponentParameters.renderer;
  const selectedContentTitle = selectedComponent?.contentTitle ?? (selectedRenderer === 'rich' ? 'Rich Component Content' : 'First Item Content');
  const selectedContentDescription =
    selectedComponent?.contentDescription ??
    (selectedRenderer === 'rich'
      ? 'Custom component content for the first rendered item; the indicator color remains separate.'
      : 'Sample data for the first rendered item; empty fields are not rendered.');
  const previewFrameStyle = {
    '--preview-frame-height': `${previewFrameSize.height}px`,
    '--preview-frame-width': `${previewFrameSize.width}px`,
  } as CSSProperties;
  const areParametersCollapsed = selectedComponent ? Boolean(collapsedControlGroups[buildPreviewControlGroupKey(selectedComponent.id, 'parameters')]) : false;
  const isContentCollapsed = selectedComponent ? Boolean(collapsedControlGroups[buildPreviewControlGroupKey(selectedComponent.id, 'content')]) : false;

  function updateThemeValue(token: keyof ThemeValues, value: string) {
    clearLoadedThemePresetId();
    setThemeValues((currentTheme) => ({
      ...currentTheme,
      [token]: value,
    }));
  }

  function updateComponentParameter(parameterId: string, value: string | boolean) {
    if (!selectedComponent) {
      return;
    }

    setComponentParameterValues((currentParameters) => ({
      ...currentParameters,
      [selectedComponent.id]: {
        ...(currentParameters[selectedComponent.id] ?? selectedComponent.defaultParameters),
        [parameterId]: value,
      },
    }));
  }

  function updateComponentContentValue(contentId: string, value: string | boolean) {
    if (!selectedComponent) {
      return;
    }

    setComponentContentValues((currentContentValues) => ({
      ...currentContentValues,
      [selectedComponent.id]: {
        ...(currentContentValues[selectedComponent.id] ?? selectedComponent.defaultContentValues ?? {}),
        [contentId]: value,
      },
    }));
  }

  function togglePreviewControlGroup(componentId: string, groupId: PreviewControlGroupId) {
    const controlGroupKey = buildPreviewControlGroupKey(componentId, groupId);

    setCollapsedControlGroups((currentCollapsedControlGroups) => ({
      ...currentCollapsedControlGroups,
      [controlGroupKey]: !currentCollapsedControlGroups[controlGroupKey],
    }));
  }

  function fitPreviewFrameToAvailableSpace() {
    setHasCustomPreviewFrameSize(false);

    const previewFrameScroll = previewFrameScrollRef.current;
    const nextFrameSize = previewFrameScroll ? getAvailablePreviewFrameSize(previewFrameScroll) : null;

    if (nextFrameSize) {
      setPreviewFrameSize(nextFrameSize);
    }
  }

  function startPreviewResize(event: ReactPointerEvent<HTMLButtonElement>, direction: PreviewResizeDirection) {
    event.preventDefault();
    event.currentTarget.blur();
    setHasCustomPreviewFrameSize(true);

    const startX = event.clientX;
    const startY = event.clientY;
    const startSize = previewFrameSizeRef.current;

    function handlePointerMove(pointerEvent: PointerEvent) {
      setPreviewFrameSize({
        height:
          direction === 'height' || direction === 'both'
            ? clampValue(startSize.height + pointerEvent.clientY - startY, PREVIEW_FRAME_BOUNDS.minHeight, PREVIEW_FRAME_BOUNDS.maxHeight)
            : startSize.height,
        width:
          direction === 'width' || direction === 'both'
            ? clampValue(startSize.width + pointerEvent.clientX - startX, PREVIEW_FRAME_BOUNDS.minWidth, PREVIEW_FRAME_BOUNDS.maxWidth)
            : startSize.width,
      });
    }

    function handlePointerUp() {
      window.removeEventListener('pointermove', handlePointerMove);
    }

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp, { once: true });
  }

  function buildWorkbenchUrl(): string {
    const workbenchUrl = new URL(window.location.href);
    workbenchUrl.searchParams.delete('fullscreenPreview');
    workbenchUrl.searchParams.delete('component');
    workbenchUrl.searchParams.delete('snapshot');
    return workbenchUrl.toString();
  }

  function openFullscreenPreview() {
    if (!selectedComponent) {
      return;
    }

    const snapshotId = storeFullscreenPreviewSnapshot({
      componentId: selectedComponent.id,
      contentValues: { ...selectedComponentContentValues },
      createdAt: Date.now(),
      parameters: { ...selectedComponentParameters },
    });
    const fullscreenUrl = new URL(window.location.href);
    fullscreenUrl.searchParams.set('fullscreenPreview', '1');
    fullscreenUrl.searchParams.set('component', selectedComponent.id);
    fullscreenUrl.searchParams.set('snapshot', snapshotId);

    window.open(fullscreenUrl.toString(), '_blank', 'noopener,noreferrer');
  }

  function openWorkbenchPreview() {
    window.location.href = buildWorkbenchUrl();
  }

  function closeFullscreenPreview() {
    window.close();
    window.setTimeout(() => {
      if (!window.closed) {
        openWorkbenchPreview();
      }
    }, 0);
  }

  function renderComponentControl(
    control: ComponentParameterControl,
    controlValue: ComponentParameterValue | undefined,
    onUpdate: (controlId: string, value: string | boolean) => void,
  ) {
    if (control.type === 'select') {
      return (
        <div className="component-parameter-control component-parameter-control--field" key={control.id}>
          <span className="parameter-copy">
            <strong>{control.label}</strong>
            <small>{control.description}</small>
          </span>
          <Dropdown
            ariaLabel={control.label}
            dataParameterId={control.id}
            options={control.options}
            size="compact"
            value={String(controlValue ?? '')}
            onChange={(nextValue) => onUpdate(control.id, getDropdownStringValue(nextValue))}
          />
        </div>
      );
    }

    if (control.type === 'boolean') {
      return (
        <div className="component-parameter-control component-parameter-control--toggle" key={control.id}>
          <Checkbox
            aria-label={control.label}
            checked={Boolean(controlValue)}
            data-parameter-id={control.id}
            description={control.description}
            label={control.label}
            onCheckedChange={(checked) => onUpdate(control.id, checked)}
          />
        </div>
      );
    }

    if (control.type === 'color') {
      const stringValue = typeof controlValue === 'string' ? controlValue : '';

      return (
        <div className="component-parameter-control component-parameter-control--color" key={control.id}>
          <span className="parameter-copy">
            <strong>{control.label}</strong>
            <small>{control.description}</small>
          </span>
          <ColorInput
            ariaLabel={control.label}
            data-parameter-id={control.id}
            placeholder={control.defaultValue}
            value={stringValue}
            onBlur={() => {
              if (stringValue && !isHexColor(stringValue)) {
                onUpdate(control.id, control.defaultValue);
              }
            }}
            onValueChange={(value) => onUpdate(control.id, value)}
          />
        </div>
      );
    }

    if (control.type === 'richtext') {
      return (
        <div className="component-parameter-control component-parameter-control--wide" key={control.id}>
          <span className="parameter-copy">
            <strong>{control.label}</strong>
            <small>{control.description}</small>
          </span>
          <TextArea
            ariaLabel={control.label}
            data-parameter-id={control.id}
            rows={control.rows ?? 4}
            spellCheck="false"
            value={typeof controlValue === 'string' ? controlValue : ''}
            placeholder={control.placeholder}
            onValueChange={(value) => onUpdate(control.id, value)}
          />
        </div>
      );
    }

    return (
      <div className="component-parameter-control component-parameter-control--field" key={control.id}>
        <span className="parameter-copy">
          <strong>{control.label}</strong>
          <small>{control.description}</small>
        </span>
        <TextInput
          ariaLabel={control.label}
          data-parameter-id={control.id}
          value={typeof controlValue === 'string' ? controlValue : ''}
          placeholder={control.placeholder}
          onValueChange={(value) => onUpdate(control.id, value)}
        />
      </div>
    );
  }

  async function saveTheme() {
    setSaveMessage('Saving');
    storeThemeValues(themeValues);
    const savedGlobally = await persistProjectThemeValues(themeValues);
    setSavedThemeValues({ ...themeValues });
    setSaveMessage(savedGlobally ? 'Saved globally' : 'Saved locally');
  }

  function selectThemePreset(value: DropdownValue) {
    const presetId = getDropdownStringValue(value);
    const preset = themePresets.find((themePreset) => themePreset.id === presetId);

    setSelectedThemePresetId(presetId);

    if (preset) {
      setThemePresetName(preset.name);
    }
  }

  function commitThemePreset(nextPreset: ThemePreset, message: string) {
    const nextThemePresets = sortThemePresets([nextPreset, ...themePresets.filter((preset) => preset.id !== nextPreset.id)]).slice(0, MAX_THEME_PRESETS);

    storeThemePresets(nextThemePresets);
    storeLoadedThemePresetId(nextPreset.id);
    setThemePresets(nextThemePresets);
    setSelectedThemePresetId(nextPreset.id);
    setThemePresetName(nextPreset.name);
    setSaveMessage(message);
  }

  function createNextThemePreset(): { matchingPreset?: ThemePreset; nextPreset: ThemePreset } {
    const trimmedPresetName = themePresetName.trim();
    const presetName = trimmedPresetName.length > 0 ? trimmedPresetName : getNextThemePresetName(themePresets);
    const matchingPreset = themePresets.find((preset) => preset.name.toLowerCase() === presetName.toLowerCase());
    const now = Date.now();
    const presetId = matchingPreset?.id ?? createThemePresetId();

    return {
      matchingPreset,
      nextPreset: {
        createdAt: matchingPreset?.createdAt ?? now,
        id: presetId,
        name: presetName,
        updatedAt: now,
        values: { ...themeValues },
      },
    };
  }

  function saveThemePreset() {
    const { matchingPreset, nextPreset } = createNextThemePreset();

    if (matchingPreset) {
      setPendingThemePresetOverwrite(nextPreset);
      setIsThemePresetOverwriteOpen(true);
      return;
    }

    commitThemePreset(nextPreset, 'Preset saved');
  }

  function confirmThemePresetOverwrite() {
    if (!pendingThemePresetOverwrite) {
      return;
    }

    commitThemePreset(pendingThemePresetOverwrite, 'Preset overwritten');
    setIsThemePresetOverwriteOpen(false);
  }

  function cancelThemePresetOverwrite() {
    setIsThemePresetOverwriteOpen(false);
    setSaveMessage('Preset unchanged');
  }

  function loadThemePreset() {
    if (!selectedThemePreset) {
      return;
    }

    const presetValues = { ...selectedThemePreset.values };

    storeThemeValues(presetValues);
    storeLoadedThemePresetId(selectedThemePreset.id);
    setThemeValues(presetValues);
    setSavedThemeValues({ ...presetValues });
    setSaveMessage('Preset loaded');
  }

  function deleteThemePreset() {
    if (!selectedThemePreset) {
      return;
    }

    const nextThemePresets = themePresets.filter((preset) => preset.id !== selectedThemePreset.id);
    const nextSelectedThemePreset = nextThemePresets[0];

    storeThemePresets(nextThemePresets);
    if (readLoadedThemePresetId() === selectedThemePreset.id) {
      clearLoadedThemePresetId();
    }
    setThemePresets(nextThemePresets);
    setSelectedThemePresetId(nextSelectedThemePreset?.id ?? '');
    setThemePresetName(nextSelectedThemePreset?.name ?? getNextThemePresetName(nextThemePresets));
    setSaveMessage('Preset deleted');
  }

  async function resetTheme() {
    clearStoredThemeValues();
    clearLoadedThemePresetId();
    const projectThemeValues = await fetchProjectThemeValues();
    const defaultThemeValues = projectThemeValues ?? buildDefaultThemeValues();

    if (projectThemeValues && hasCustomProjectTheme(projectThemeValues)) {
      storeThemeValues(projectThemeValues);
    }

    setThemeValues(defaultThemeValues);
    setSavedThemeValues({ ...defaultThemeValues });
    setSaveMessage(projectThemeValues ? 'Saved globally' : 'Saved');
  }

  if (fullscreenPreviewRequest.enabled) {
    return (
      <main className="fullscreen-preview-shell">
        <header className="fullscreen-preview-header">
          <div className="fullscreen-preview-title">
            {selectedComponent ? <span className="type-label-medium">{selectedComponent.group}</span> : null}
            <h1 className="type-title-large">{selectedComponent?.name ?? 'Preview'}</h1>
            {selectedComponent ? <p className="type-body-medium">{selectedComponent.description}</p> : null}
          </div>
          <Toolbar ariaLabel="Fullscreen preview actions" className="fullscreen-preview-actions" density="compact" justify="end" variant="plain">
            <Button icon={<ExternalLink size={16} aria-hidden="true" />} size="compact" variant="secondary" onClick={openWorkbenchPreview}>
              Workbench
            </Button>
            <Button icon={<X size={16} aria-hidden="true" />} size="compact" variant="subtle" onClick={closeFullscreenPreview}>
              Close
            </Button>
          </Toolbar>
        </header>

        <section className="fullscreen-preview-stage" aria-label={`${selectedComponent?.name ?? 'Component'} fullscreen preview`}>
          {selectedComponent ? (
            selectedComponent.renderPreview(selectedComponentParameters, selectedComponentContentValues)
          ) : (
            <EmptyState description="The requested preview is not registered in this workbench." size="spacious" title="Preview unavailable" tone="neutral" />
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="library-shell">
      <aside className="theme-sidebar" aria-label="Theme settings">
        <header className="theme-header">
          <div>
            <span className="type-label-large theme-kicker">Agentic UI</span>
            <h1 className="type-headline-medium">Theme</h1>
          </div>
          <StatusBadge
            aria-live="polite"
            animated={saveMessage === 'Saving'}
            className="save-state"
            label={saveStateLabel}
            showDot={saveMessage === 'Saving' || hasUnsavedChanges}
            size="compact"
            status={saveStateStatus}
            variant="soft"
          />
        </header>

        <Toolbar ariaLabel="Theme actions" className="theme-actions" density="compact" variant="plain">
          <Button
            disabled={saveMessage === 'Saving'}
            icon={<Save size={16} aria-hidden="true" />}
            size="compact"
            variant="primary"
            onClick={() => void saveTheme()}
          >
            Save
          </Button>
          <Button icon={<RotateCcw size={16} aria-hidden="true" />} size="compact" variant="secondary" onClick={() => void resetTheme()}>
            Reset
          </Button>
        </Toolbar>

        <Panel as="section" className="settings-section" description="Local theme snapshots." heading="Presets" padding="comfortable" variant="raised">
          <div className="preset-control">
            <Dropdown
              ariaLabel="Theme preset"
              disabled={themePresetOptions.length === 0}
              options={themePresetOptions}
              placeholder={themePresetOptions.length === 0 ? 'No presets' : 'Choose preset'}
              size="compact"
              value={selectedThemePresetId}
              onChange={selectThemePreset}
            />
            <TextInput
              ariaLabel="Preset name"
              placeholder="Preset name"
              spellCheck="false"
              value={themePresetName}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  saveThemePreset();
                }
              }}
              onValueChange={setThemePresetName}
            />
            <Toolbar ariaLabel="Preset actions" className="preset-actions" density="compact" variant="plain">
              <Button icon={<Save size={16} aria-hidden="true" />} size="compact" variant="secondary" onClick={saveThemePreset}>
                Save Preset
              </Button>
              <Button
                disabled={!selectedThemePreset}
                icon={<FolderOpen size={16} aria-hidden="true" />}
                size="compact"
                variant="secondary"
                onClick={loadThemePreset}
              >
                Load
              </Button>
              <Button
                disabled={!selectedThemePreset}
                icon={<Trash2 size={16} aria-hidden="true" />}
                size="compact"
                variant="danger"
                onClick={deleteThemePreset}
              >
                Delete
              </Button>
            </Toolbar>
          </div>
        </Panel>

        <Panel as="section" className="settings-section" description="Foreground, surfaces, and trading states." heading="Colors" padding="comfortable" variant="raised">
          <div className="control-list">
            {colorControls.map((control) => (
              <div className="color-control" key={control.token}>
                <span className="control-copy">
                  <strong>{control.label}</strong>
                  <code>{control.token}</code>
                </span>
                <ColorInput
                  ariaLabel={`${control.label} color`}
                  spellCheck="false"
                  value={themeValues[control.token]}
                  placeholder={control.defaultValue}
                  onBlur={() => {
                    if (!isHexColor(themeValues[control.token])) {
                      updateThemeValue(control.token, control.defaultValue);
                    }
                  }}
                  onValueChange={(value) => updateThemeValue(control.token, value)}
                />
              </div>
            ))}
          </div>
        </Panel>

        <Panel as="section" className="settings-section" description="Live examples for positive, negative, and neutral tokens." heading="Trading States" padding="comfortable" variant="raised">
          <div className="trading-state-list" aria-label="Trading state examples">
            {tradingStateSamples.map((sample) => (
              <DeltaIndicator
                direction={sample.tone === 'positive' ? 'up' : sample.tone === 'negative' ? 'down' : 'flat'}
                key={sample.tone}
                label={sample.label}
                precision={sample.tone === 'neutral' ? 0 : 2}
                showSign={sample.tone !== 'neutral'}
                unit={sample.tone === 'neutral' ? '' : '%'}
                value={sample.tone === 'positive' ? 2.48 : sample.tone === 'negative' ? -1.16 : 0}
                variant="card"
              />
            ))}
          </div>
        </Panel>

        <Panel as="section" className="settings-section" description="Editable radius tokens with live shape samples." heading="Border Radius" padding="comfortable" variant="raised">
          <div className="control-list">
            {radiusControls.map((control) => {
              const radiusValue = Number.parseInt(themeValues[control.token], 10);

              return (
                <label className="radius-control" key={control.token}>
                  <span className="radius-sample" style={radiusSampleStyle(control.token)} />
                  <span className="control-copy">
                    <strong>{control.label}</strong>
                    <code>{control.token}</code>
                  </span>
                  <Slider
                    ariaLabel={control.label}
                    label="Radius"
                    min="0"
                    max={control.max}
                    suffix="px"
                    value={Number.isNaN(radiusValue) ? 0 : radiusValue}
                    onValueChange={(value) => updateThemeValue(control.token, `${value}px`)}
                  />
                </label>
              );
            })}
          </div>
        </Panel>

        <Panel as="section" className="settings-section" description="Shared timings for press, popup, counter, and list movement." heading="Motion" padding="comfortable" variant="raised">
          <div className="control-list">
            {motionControls.map((control) => (
              <label className="motion-control" key={control.token}>
                <span className="motion-sample" data-token={control.token} />
                <span className="control-copy">
                  <strong>{control.label}</strong>
                  <code>{control.token}</code>
                </span>
                <Slider
                  ariaLabel={control.label}
                  label="Duration"
                  min="0"
                  max={control.max}
                  suffix="ms"
                  value={parseDurationMs(themeValues[control.token])}
                  onValueChange={(value) => updateThemeValue(control.token, `${value}ms`)}
                />
              </label>
            ))}
          </div>
        </Panel>

        <Panel as="section" className="settings-section" description="Montserrat mapped to Material-style type roles." heading="Type Roles" padding="comfortable" variant="raised">
          <div className="type-stack">
            {typeRoles.map((role) => (
              <article className="type-row" key={role.className}>
                <span className="type-label-medium">{role.label}</span>
                <p className={role.className}>{role.sample}</p>
              </article>
            ))}
          </div>
        </Panel>
      </aside>

      {pendingThemePresetOverwrite ? (
        <Modal
          cancelLabel="Keep Existing"
          confirmLabel="Overwrite Preset"
          description={`A preset named "${pendingThemePresetOverwrite.name}" already exists.`}
          open={isThemePresetOverwriteOpen}
          title="Overwrite preset?"
          onCancel={cancelThemePresetOverwrite}
          onConfirm={confirmThemePresetOverwrite}
          onOpenChange={setIsThemePresetOverwriteOpen}
        >
          Saving now will replace that preset with the current theme values.
        </Modal>
      ) : null}

      <section className="component-stage" aria-labelledby="component-title">
        <header className="component-header">
          <div>
            <h2 className="type-headline-medium" id="component-title">
              Components
            </h2>
            <p className="type-body-medium">Browse reusable components and edit their preview controls.</p>
          </div>
          <div className="component-header-actions">
            <CountBadge animated={false} className="component-count" count={componentPreviews.length} max={99} size="compact" tone="neutral" variant="soft" />
          </div>
        </header>

        <div className="preview-panel">
          <Panel as="section" className="component-list-panel" heading="List" padding="comfortable" variant="raised">
            <ListView
              ariaLabel="Component previews"
              density="compact"
              enableFiltering
              enableGrouping
              enableSearch
              emptyTitle="No components yet"
              emptyDescription="The first generated component will create the first list item."
              filterAttributes={componentTypeFilterAttributes}
              groupAttributeId="type"
              items={componentListItems}
              searchPlaceholder="Search components"
              selectedId={selectedComponentId}
              onSelect={(item) => setSelectedComponentId(item.id)}
            />
          </Panel>

          <Panel as="section" className="component-preview-panel" heading="Preview" padding="comfortable" variant="raised">
            {selectedComponent ? (
              <div className="component-preview-content">
                <div className="component-preview-intro">
                  <span className="type-label-medium">{selectedComponent.group}</span>
                  <h4 className="type-title-large">{selectedComponent.name}</h4>
                  <p className="type-body-medium">{selectedComponent.description}</p>
                </div>

                {selectedComponent.parameters.length > 0 ? (
                  <Section
                    className="component-control-group"
                    collapsed={areParametersCollapsed}
                    collapsible
                    description="Behavior and display options applied to every preview instance."
                    heading="Parameters"
                    showDivider={false}
                    onCollapsedChange={() => togglePreviewControlGroup(selectedComponent.id, 'parameters')}
                  >
                    <div className="component-parameter-panel">
                      {selectedComponent.parameters.map((control) =>
                        isControlVisible(control, selectedComponentParameters)
                          ? renderComponentControl(
                              control,
                              selectedComponentParameters[control.id] ?? selectedComponent.defaultParameters[control.id],
                              updateComponentParameter,
                            )
                          : null,
                      )}
                    </div>
                  </Section>
                ) : null}

                {selectedComponent.contentControls && selectedComponent.contentControls.length > 0 ? (
                  <Section
                    className="component-control-group"
                    collapsed={isContentCollapsed}
                    collapsible
                    description={selectedContentDescription}
                    heading={selectedContentTitle}
                    showDivider={false}
                    onCollapsedChange={() => togglePreviewControlGroup(selectedComponent.id, 'content')}
                  >
                    <div className="component-parameter-panel">
                      {selectedComponent.contentControls.map((control) =>
                        isControlVisible(control, selectedComponentParameters)
                          ? renderComponentControl(
                              control,
                              selectedComponentContentValues[control.id] ?? selectedComponent.defaultContentValues?.[control.id],
                              updateComponentContentValue,
                            )
                          : null,
                      )}
                    </div>
                  </Section>
                ) : null}

                <div className="component-preview-actions">
                  <Button icon={<ExternalLink size={16} aria-hidden="true" />} size="compact" variant="secondary" onClick={openFullscreenPreview}>
                    Open fullscreen
                  </Button>
                </div>

                <div className="component-preview-frame-scroll" ref={previewFrameScrollRef}>
                  <div className="component-preview-frame" style={previewFrameStyle}>
                    <span className="component-preview-frame-size">
                      <span className="type-label-medium">
                        {previewFrameSize.width} x {previewFrameSize.height}
                      </span>
                      <Button
                        aria-label="Fit preview to available space"
                        className="component-preview-fit-button"
                        icon={<Maximize2 size={14} aria-hidden="true" />}
                        iconOnly
                        size="compact"
                        tooltip="Fit preview to available space"
                        tooltipPlacement="left"
                        variant="subtle"
                        onClick={fitPreviewFrameToAvailableSpace}
                      />
                    </span>
                    <div className="component-preview-surface">
                      {selectedComponent.renderPreview(selectedComponentParameters, selectedComponentContentValues)}
                    </div>
                    <button
                      className="component-preview-resize-handle component-preview-resize-handle--width"
                      type="button"
                      aria-label="Resize preview width"
                      title="Resize preview width"
                      onPointerDown={(event) => startPreviewResize(event, 'width')}
                    />
                    <button
                      className="component-preview-resize-handle component-preview-resize-handle--height"
                      type="button"
                      aria-label="Resize preview height"
                      title="Resize preview height"
                      onPointerDown={(event) => startPreviewResize(event, 'height')}
                    />
                    <button
                      className="component-preview-resize-handle component-preview-resize-handle--both"
                      type="button"
                      aria-label="Resize preview width and height"
                      title="Resize preview width and height"
                      onPointerDown={(event) => startPreviewResize(event, 'both')}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <EmptyState
                className="empty-preview"
                description="Component examples will render here after we add them."
                size="spacious"
                title="No preview selected"
                tone="neutral"
              />
            )}
          </Panel>
        </div>
      </section>
    </main>
  );
}
